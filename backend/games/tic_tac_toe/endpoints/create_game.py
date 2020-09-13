from typing import Dict, Optional, Tuple
from uuid import uuid4

from aiohttp import web
import asyncpg

from backend.registration.identify import get_name_from_token
from backend.games.common.endpoints.create_game import create_game as general_create_game
from ..constants import ACTIVE_GAMES_TABLE
from ..models.game import Game
from ..models.player import Player


async def create_game(request: web.Request) -> web.Response:
    # Get params.
    rows = int(request.rel_url.query['rows'])
    cols = int(request.rel_url.query['cols'])
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    gravity = True if request.rel_url.query['gravity'] == 'true' else False

    token = request.rel_url.query['token']

    async def get_new_game(db: asyncpg.Connection) -> Tuple[Optional[Game], Optional[Dict]]:
        # Check correctness of input data.
        dummy_game = Game(rows=0, cols=0, current_player_index=0, gravity=gravity,
                          play_list=[], player_list=[], id_=None)
        error_message: Optional[str] = None
        if rows <= 0 or cols <= 0:
            error_message = f'rows and cols must be strictly positive however got rows={rows} and cols={cols}.'
        elif rows * cols % (npc + pc) != 0:
            error_message = f'Total number of cells must be a multiple of the number of players however there ' \
                            f'are {rows * cols} cells which is not divisible by the number of players ({npc + pc}).'
        elif pc < 1:
            error_message = f'There must be at least one player character however ' \
                            f'got number of player characters of {pc}'
        elif npc < 0:
            error_message = f'There cannot be a negative number of non player characters however ' \
                            f'got number of non player characters of {npc}'
        elif pc + npc <= 1:
            error_message = f'The is a game of at least two players but got total number of players of {npc + pc}.'
        elif npc > 0:
            error_message = f'Artificial intelligence is not yet implemented and npc player cannot be set.'

        if error_message is not None:
            return None, dummy_game.to_frontend(db=None, description=error_message)

        # If settings are correct we create a new game.
        name_list = [await get_name_from_token(token=token, db=db)] + [None] * (npc + pc - 1)
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
        return Game(rows=rows, cols=cols, current_player_index=0, gravity=gravity, play_list=[],
                    player_list=player_list, id_=str(uuid4())), None

    async def add_new_game_to_database(new_game: Game, db: asyncpg.Connection):
        database_game = new_game.to_database()
        # Inset name in database.
        await db.execute(f"""
                         INSERT INTO {ACTIVE_GAMES_TABLE} (id, rows, cols, player_list, play_list, gravity)
                         VALUES ($1, $2, $3, $4, $5, $6)
                         """, new_game.id, new_game.rows, new_game.cols,
                         database_game['players'], database_game['plays'],
                         new_game.gravity)

    return await general_create_game(pool=request.app['db'],
                                     token=token,
                                     get_new_game=get_new_game,
                                     add_new_game_to_database=add_new_game_to_database)
