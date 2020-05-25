from typing import Dict, Optional

from aiohttp import web
import asyncpg

from .utils import get_game_data
from ..models.game import Game
from backend.games.common.endpoints.find_game import find_game as general_find_game


async def find_game(request: web.Request) -> web.Response:
    async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Optional[Game]:
        game_data = await get_game_data(game_id=game_id, db=db)

        # Return a dummy result if no game was found with desired id.
        if game_data is None:
            return None

        return Game.from_database(json_data=game_data)

    def get_dummy_frontend_game(game_id: str) -> Dict:
        dummy_game = Game(rows=0, cols=0, current_player_index=0, gravity=False,
                          play_list=[], player_list=[], id_=None)
        return dummy_game.to_frontend(db=None, description=f'There is no active game with id `{game_id}`.')

    return await general_find_game(game_id=request.rel_url.query['game_id'],
                                   token=request.rel_url.query['token'],
                                   pool=request.app['db'],
                                   active_games_database='tic_tac_toe_active_games',
                                   get_game_from_database=get_game_from_database,
                                   get_dummy_frontend_game=get_dummy_frontend_game)
