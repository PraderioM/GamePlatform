from aiohttp import web

from backend.games.common.endpoints.get_leader_board import get_leader_board as general_get_leader_board
from ..constants import LEADER_BOARD_TABLE


async def get_leader_board(request: web.Request) -> web.Response:
    return await general_get_leader_board(pool=request.app['db'],
                                          leader_board_table=LEADER_BOARD_TABLE,
                                          limit=int(request.rel_url.query.get('limit', '10')),
                                          offset=int(request.rel_url.query.get('offset', '0')))
