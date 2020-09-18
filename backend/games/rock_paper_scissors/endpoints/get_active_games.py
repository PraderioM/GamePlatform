from typing import List

from aiohttp import web
import asyncpg

from games.common.endpoints.get_active_games import get_active_games as general_get_active_games
from games.common.endpoints.get_active_games import generate_remove_old_games
from ..models.game import Game
from ..constants import ACTIVE_GAMES_TABLE


async def get_active_games(request: web.Request) -> web.Response:
    limit = int(request.rel_url.query.get('limit', '10'))
    offset = int(request.rel_url.query.get('offset', '0'))

    async def get_games_from_database(db: asyncpg.Connection) -> List[Game]:
        active_games = await db.fetch(f"""
                                      SELECT id AS id,
                                             player_list AS player_list,
                                             current_round AS current_round,
                                             victory_criterion AS victory_criterion,
                                             n_plays AS n_plays,
                                             total_points AS total_points,
                                             play_mode AS play_mode
                                      FROM {ACTIVE_GAMES_TABLE}
                                      ORDER BY creation_date DESC
                                      LIMIT $1 OFFSET $2
                                      """, limit, offset)

        # Return a list of the desired results
        return [Game.from_database(json_data=game_data) for game_data in active_games]

    return await general_get_active_games(pool=request.app['db'],
                                          get_games_from_database=get_games_from_database,
                                          remove_old_games=generate_remove_old_games(ACTIVE_GAMES_TABLE))
