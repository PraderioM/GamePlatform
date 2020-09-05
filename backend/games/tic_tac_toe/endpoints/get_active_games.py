from typing import List

from aiohttp import web
import asyncpg

from backend.games.common.endpoints.get_active_games import get_active_games as general_get_active_games
from ..models.game import Game


async def get_active_games(request: web.Request) -> web.Response:
    limit = int(request.rel_url.query.get('limit', '10'))
    offset = int(request.rel_url.query.get('offset', '0'))
    active_games_table = 'tic_tac_toe_active_games'

    async def get_games_from_database(db: asyncpg.Connection) -> List[Game]:
        active_games = await db.fetch(f"""
                                      SELECT id AS id,
                                             rows AS rows,
                                             cols AS cols,
                                             current_player_index AS current_player_index,
                                             player_list AS players, 
                                             play_list AS plays,
                                             gravity AS gravity
                                      FROM {active_games_table}
                                      ORDER BY creation_date DESC
                                      LIMIT $1 OFFSET $2
                                      """, limit, offset)

        # Return a list of the desired results
        return [Game.from_database(json_data=game_data) for game_data in active_games]

    return await general_get_active_games(pool=request.app['db'],
                                          active_games_table=active_games_table,
                                          get_games_from_database=get_games_from_database)
