from aiohttp import web

from .utils import get_game_from_database, get_dummy_frontend_game
from backend.games.common.endpoints.get_game_update import get_game_update as general_get_game_update
from ..constants import ACTIVE_GAMES_TABLE


async def get_game_update(request: web.Request) -> web.Response:
    return await general_get_game_update(token=request.rel_url.query['token'],
                                         pool=request.app['db'],
                                         active_games_table=ACTIVE_GAMES_TABLE,
                                         game_id=request.rel_url.query['game_id'],
                                         get_game_from_database=get_game_from_database,
                                         get_dummy_frontend_game=get_dummy_frontend_game)
