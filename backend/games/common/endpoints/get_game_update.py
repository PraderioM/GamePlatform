import json
from typing import Awaitable, Callable, Dict, Optional

from aiohttp import web
import asyncpg

from games.common.models.game import Game


def generate_get_n_actions(active_games_table: str) -> Callable[[asyncpg.Connection, str],
                                                                Awaitable[Optional[int]]]:
    async def get_n_actions(db: asyncpg.Connection, game_id: str) -> Optional[int]:
        return await db.fetchval(f"""
                                 SELECT n_actions
                                 FROM {active_games_table}
                                 WHERE id = $1
                                 """, game_id)

    return get_n_actions


async def get_game_update(last_received_action: int, pool: asyncpg.pool.Pool,
                          game_id: str,
                          get_game_from_database: Callable[[asyncpg.Connection, str], Awaitable[Game]],
                          get_dummy_frontend_game: Callable[[str], Dict],
                          get_n_actions: Callable[[asyncpg.Connection, str],
                                                  Awaitable[Optional[int]]]) -> web.Response:
    async with pool.acquire() as db:

        # Get last time game was updated.
        n_actions = await get_n_actions(db, game_id)

        # If unable to do so then game does not exist and we return an error message.
        if n_actions is None:
            dummy_game = get_dummy_frontend_game(f'Could not find game with id `{game_id}`')
            return web.Response(
                status=200,
                body=json.dumps(dummy_game)
            )

        # If the last game update is previous to the last time the player received an update then we need not get game.
        if n_actions <= last_received_action:
            return web.Response(status=200)

        # Otherwise we get the game data and return it.
        out_game = await get_game_from_database(db, game_id)
        frontend_out_game = out_game.to_frontend(db=db)

        return web.Response(
            status=200,
            body=json.dumps(frontend_out_game)
        )
