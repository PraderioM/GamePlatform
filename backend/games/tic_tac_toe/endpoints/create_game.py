import json
from typing import Optional
from uuid import uuid4

from aiohttp import web
import asyncpg

from backend.logging.identify import get_name_from_token
from ..models.game import Game
from ..models.player import Player


async def create_game(request: web.Request) -> web.Response:
    rows = int(request.rel_url.query['rows'])
    cols = int(request.rel_url.query['cols'])
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    gravity = True if request.rel_url.query['gravity'] == 'True' else False
    # todo debug.
    print(request.rel_url.query['gravity'])

    pool = request.app['db']

    async with pool.acquire() as db:
        db: asyncpg.Connection = db

        # Check correctness of input data.
        dummy_game = Game(rows=0, cols=0, current_player_index=0, gravity=gravity,
                          play_list=[], player_list=[], id_=None)
        error_message: Optional[str] = None
        if rows <= 0 or  cols <= 0:
            error_message = f'rows and cols must be strictly positive however got rows={rows} and cols={cols}.'
        elif rows * cols % (npc + pc) != 0:
            error_message = f'Total number of cells must be a multiple of the number of players however there ' \
                            f'are {rows*cols} cells which is not divisible by the number of players ({npc + pc}).'
        elif pc < 1:
            error_message = f'There must be at least one player character however ' \
                            f'got number of player characters of {pc}'
        elif npc <= 0:
            error_message = f'There cannot be a negative number of non player characters however ' \
                            f'got number of non player characters of {npc}'

        if error_message is not None:
            return web.Response(
                status=200,
                body=json.dumps(await dummy_game.to_frontend(db=db, description=error_message))
            )

        # If settings are correct we create a new game.
        name_list = [await get_name_from_token(request.rel_url.query['token'], db=db)] + [None] * (npc + pc - 1)
        symbol_list = []
        for i in range(npc + pc):
            for letter in 'theGAME':
                if i == 0:
                    symbol_list.append(letter)
                else:
                    symbol_list.append(f'{letter}{i}')
        symbol_list = symbol_list[:npc + pc]
        is_bot_list = [False] * pc + [True] * npc
        player_list = [Player(name=name, symbol=symbol, is_bot=is_bot)
                       for name, symbol, is_bot in zip(name_list, symbol_list, is_bot_list)]
        out_game = Game(rows=rows, cols=cols, current_player_index=0, gravity=gravity, play_list=[],
                        player_list=player_list, id_=str(uuid4()))
        database_game = out_game.to_database()
        async with db.transaction():
            # Inset name in database.
            await db.execute("""
                             INSERT INTO tic_tac_toe_active_games (id, rows, cols, players, plays, gravity)
                             VALUES ($1, $2, $3, $4, $5, $6)
                             """, out_game.id, out_game.rows, out_game.cols,
                             database_game['players'], database_game['plays'],
                             out_game.gravity)

            if error_message is not None:
                return web.Response(
                    status=200,
                    body=json.dumps(await out_game.to_frontend(db=db, description=error_message))
                )
    pass
