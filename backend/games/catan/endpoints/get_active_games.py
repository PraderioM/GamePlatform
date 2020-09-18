from typing import List

from aiohttp import web
import asyncpg

from games.common.endpoints.get_active_games import get_active_games as general_get_active_games
from ..models.game import Game
from ..global_variables import ACTIVE_GAMES_DICT


async def get_active_games(request: web.Request) -> web.Response:
    limit = int(request.rel_url.query.get('limit', '10'))
    offset = int(request.rel_url.query.get('offset', '0'))

    async def get_games_from_database(db: asyncpg.Connection) -> List[Game]:
        # Return a list of the desired results
        game_list = [game for game in ACTIVE_GAMES_DICT.values()]
        return sorted(game_list, key=lambda game: game.last_updated)[offset: offset + limit]

    return await general_get_active_games(pool=request.app['db'],
                                          get_games_from_database=get_games_from_database,
                                          remove_old_games=None)
