from aiohttp import web

from .utils import get_game_from_database
from games.common.endpoints.end_game import end_game as general_end_game
from ..constants import LEADER_BOARD_TABLE


async def end_game(request: web.Request) -> web.Response:

    return await general_end_game(pool=request.app['db'],
                                  game_id=request.rel_url.query['game_id'],
                                  token=request.rel_url.query['token'],
                                  get_game_from_database=get_game_from_database,
                                  leader_board_table=LEADER_BOARD_TABLE)
