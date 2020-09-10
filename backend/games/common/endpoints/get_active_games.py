import json
from typing import Awaitable, Callable, List

from aiohttp import web
import asyncpg

from backend.games.common.models.game import Game


async def get_active_games(pool: asyncpg.pool.Pool, active_games_table: str,
                           get_games_from_database: Callable[[asyncpg.Connection],
                                                             Awaitable[List[Game]]]) -> web.Response:
    async with pool.acquire() as db:
        await remove_old_games(db=db, active_games_table=active_games_table)
        game_list = await get_games_from_database(db)

        return web.Response(
            status=200,
            body=json.dumps([game.to_display() for game in game_list if not game.has_ended])
        )


async def remove_old_games(db: asyncpg.Connection, active_games_table: str, minute_limits: int = 60 * 24):
    # Get ids that need to be removed.
    to_remove_ids = await db.fetch(f"""
                                   SELECT id
                                   FROM {active_games_table}
                                   WHERE (now()::time - last_updated) > INTERVAL '{minute_limits} mins' 
                                   """)
    if len(to_remove_ids) == 0:
        return

    # Remove ids.
    to_remove_ids = [str(id_['id']) for id_ in to_remove_ids]
    id_string = ', '.join([f'${i+1}' for i in range(len(to_remove_ids))])
    await db.execute(f"""
                     DELETE FROM {active_games_table}
                     WHERE id IN ({id_string})
                     """, *to_remove_ids)
