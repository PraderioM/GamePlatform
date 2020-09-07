import json
from typing import Dict, Optional, Tuple
from uuid import uuid4

from aiohttp import web
import asyncpg

from backend.registration.identify import get_name_from_token
from ..models.game import Game
from ..models.player import Player
from ..models.vidtory_criterion import VictoryCriterion


async def create_game(request: web.Request) -> web.Response:
    # Get params.
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    n_plays = int(request.rel_url.query['n_plays'])
    victory_criterion = VictoryCriterion.from_name(request.rel_url.query['n_plays'])

    token = request.rel_url.query['token']

    async with request.app['db'].acquire() as db:
        # If settings are correct we create a new game.
        new_game, error_game = await get_new_game(db=db, pc=pc, npc=npc, n_plays=n_plays,
                                                  victory_criterion=victory_criterion, token=token)
        if error_game is not None:
            return web.Response(status=200, body=json.dumps(error_game))

        async with db.transaction():
            await add_new_game_to_database(new_game, db)

            frontend_new_game = new_game.to_frontend()
            return web.Response(
                status=200,
                body=json.dumps(frontend_new_game)
            )


async def get_new_game(db: asyncpg.Connection, pc: int, npc: int, n_plays: int,
                       victory_criterion: VictoryCriterion, token: str) -> Tuple[Optional[Game], Optional[Dict]]:
    # Check correctness of input data.
    dummy_game = Game(player_list=[Player('player_1'), Player('player_2')],
                      n_plays=3,
                      victory_criterion=VictoryCriterion.BY_PLAY)
    error_message: Optional[str] = None

    if pc < 1:
        error_message = f'There must be at least one player character however ' \
                        f'got number of player characters of {pc}'
    elif npc < 0:
        error_message = f'There cannot be a negative number of non player characters however ' \
                        f'got number of non player characters of {npc}'
    elif pc + npc <= 1:
        error_message = f'This is a game of at least two players but got total number of players of {npc + pc}.'

    if error_message is not None:
        return None, {**dummy_game.to_frontend(), 'error_message': error_message}

    # If settings are correct we create a new game.
    name_list = [await get_name_from_token(token=token, db=db)] + [None] * (npc + pc - 1)
    is_bot_list = [False] * pc + [True] * npc
    player_list = [Player(name=name, is_bot=is_bot)
                   for name, is_bot in zip(name_list, is_bot_list)]
    return Game(player_list=player_list, n_plays=n_plays,
                victory_criterion=victory_criterion, id_=str(uuid4())), None


async def add_new_game_to_database(new_game: Game, db: asyncpg.Connection):
    database_game = new_game.to_database()
    # Inset name in database.
    await db.execute("""
                     INSERT INTO rock_paper_scissors_active_games (id, player_list, victory_criterion, n_plays)
                     VALUES ($1, $2, $3, $4)
                     """, new_game.id,
                     database_game['player_list'],
                     database_game['victory_criterion'],
                     new_game.n_plays)
