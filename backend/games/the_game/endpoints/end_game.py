from aiohttp import web
import asyncpg

from .utils import get_game_data
from ..models.game import Game
from games.common.endpoints.end_game import end_game as general_end_game
from ..constants import LEADER_BOARD_TABLE


async def end_game(request: web.Request) -> web.Response:

    async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Game:
        game_data = await get_game_data(game_id=game_id, db=db)
        return Game.from_database(game_data)

    return await general_end_game(pool=request.app['db'],
                                  game_id=request.rel_url.query['game_id'],
                                  token=request.rel_url.query['token'],
                                  get_game_from_database=get_game_from_database,
                                  leader_board_table=LEADER_BOARD_TABLE)
