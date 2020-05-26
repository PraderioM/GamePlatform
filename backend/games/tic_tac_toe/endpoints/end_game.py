from aiohttp import web
import asyncpg

from .utils import get_game_data
from ..models.game import Game
from backend.games.common.endpoints.end_game import end_game as general_end_game


async def end_game(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']

    async def get_game_from_database(db: asyncpg.Connection) -> Game:
        game_data = await get_game_data(game_id=game_id, db=db)
        return Game.from_database(game_data)

    return await general_end_game(pool=request.app['db'], game_id=game_id,
                                  token=request.rel_url.query['token'],
                                  get_game_from_database=get_game_from_database,
                                  leader_board_database='tic_tac_toe_leader_board')
