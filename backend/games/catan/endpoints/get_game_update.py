from datetime import datetime

from aiohttp import web
import asyncpg

from .utils import get_game_from_database, get_dummy_frontend_game
from games.common.endpoints.get_game_update import get_game_update as general_get_game_update


async def get_game_update(request: web.Request) -> web.Response:
    return await general_get_game_update(last_received_action=int(request.rel_url.query['n_actions']),
                                         pool=request.app['db'],
                                         game_id=request.rel_url.query['game_id'],
                                         get_game_from_database=get_game_from_database,
                                         get_dummy_frontend_game=get_dummy_frontend_game,
                                         get_n_actions=get_n_actions)


async def get_n_actions(db: asyncpg.Connection, game_id: str) -> datetime:
    game = await get_game_from_database(db=db, game_id=game_id)
    return game.n_actions
