from aiohttp import web

from .utils import get_game_from_database, get_dummy_frontend_game
from ..constants import ACTIVE_GAMES_TABLE
from backend.games.common.endpoints.enter_game import enter_game as general_enter_game
from backend.games.common.endpoints.enter_game import generate_update_player_list


async def enter_game(request: web.Request) -> web.Response:

    return await general_enter_game(token=request.rel_url.query['token'],
                                    pool=request.app['db'],
                                    update_player_list=generate_update_player_list(ACTIVE_GAMES_TABLE),
                                    game_id=request.rel_url.query['game_id'],
                                    get_game_from_database=get_game_from_database,
                                    get_dummy_frontend_game=get_dummy_frontend_game)
