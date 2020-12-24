from aiohttp import web

from .utils import get_game_from_database, get_dummy_frontend_game
from ..constants import ACTIVE_GAMES_TABLE
from games.common.endpoints.get_game_update import get_game_update as general_get_game_update
from games.common.endpoints.get_game_update import generate_get_last_updated_time


async def get_game_update(request: web.Request) -> web.Response:
    return await general_get_game_update(token=request.rel_url.query['token'],
                                         pool=request.app['db'],
                                         game_id=request.rel_url.query['game_id'],
                                         get_game_from_database=get_game_from_database,
                                         get_dummy_frontend_game=get_dummy_frontend_game,
                                         get_last_updated_time=generate_get_last_updated_time(ACTIVE_GAMES_TABLE))
