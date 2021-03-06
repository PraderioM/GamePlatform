import json
from typing import Awaitable, Callable, List, Optional

from aiohttp import web
import asyncpg

from games.common.models.game import Game


async def get_active_games(pool: asyncpg.pool.Pool,
                           get_games_from_database: Callable[[asyncpg.Connection],
                                                             Awaitable[List[Game]]],
                           remove_old_games: Optional[Callable[[asyncpg.Connection], Awaitable[None]]]) -> web.Response:
    async with pool.acquire() as db:
        if remove_old_games is not None:
            await remove_old_games(db)
        game_list = await get_games_from_database(db)

        return web.Response(
            status=200,
            body=json.dumps([game.to_display() for game in game_list if not game.has_ended])
        )


def generate_remove_old_games(active_games_table: str,
                              minute_limits: int = 1440) -> Callable[[asyncpg.Connection], Awaitable[None]]:
    async def remove_old_games(db: asyncpg.Connection):
        # # Get ids that need to be removed.
        to_remove_ids = await db.fetch(f"""
                                       SELECT id
                                       FROM {active_games_table}
                                       WHERE (now()::time - creation_date) > INTERVAL '{minute_limits} mins' or
                                             (now()::time - creation_date) < INTERVAL '0 mins'
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

    return remove_old_games
