import json
from datetime import time
from typing import Awaitable, Callable, Dict, Optional

from aiohttp import web
import asyncpg

from games.common.models.game import Game
from registration.updating import get_last_received_update_from_token, update_last_received_update_by_token


def generate_get_last_updated_time(active_games_table: str) -> Callable[[asyncpg.Connection, str],
                                                                        Awaitable[Optional[time]]]:
    async def get_last_updated_time(db: asyncpg.Connection, game_id: str) -> Optional[time]:
        return await db.fetchval(f"""
                                 SELECT last_updated
                                 FROM {active_games_table}
                                 WHERE id = $1
                                 """, game_id)

    return get_last_updated_time


async def get_game_update(token: str, pool: asyncpg.pool.Pool,
                          game_id: str,
                          get_game_from_database: Callable[[asyncpg.Connection, str], Awaitable[Game]],
                          get_dummy_frontend_game: Callable[[str], Dict],
                          get_last_updated_time: Callable[[asyncpg.Connection, str],
                                                          Awaitable[Optional[time]]]) -> web.Response:
    async with pool.acquire() as db:
        # Get last time player has received an update.
        last_received_update = await get_last_received_update_from_token(token=token, db=db)

        # If unable to do so it means token has expired. Show message accordingly.
        if last_received_update is None:
            dummy_game = get_dummy_frontend_game(f'Your token has expired. Please re-start session.')
            return web.Response(
                status=200,
                body=json.dumps(dummy_game)
            )

        # Get last time game was updated.
        last_updated = await get_last_updated_time(db, game_id)

        # If unable to do so then game does not exist and we return an error message.
        if last_updated is None:
            dummy_game = get_dummy_frontend_game(f'Could not find game with id `{game_id}`')
            return web.Response(
                status=200,
                body=json.dumps(dummy_game)
            )

        # If the last game update is previous to the last time the player received an update then we need not get game.
        if last_updated < last_received_update:
            return web.Response(status=200)

        # Otherwise we get the game data and return it.
        out_game = await get_game_from_database(db, game_id)
        frontend_out_game = out_game.to_frontend(db=db)

        # Before ending we update the last time player has received an update.
        await update_last_received_update_by_token(token=token, db=db)

        return web.Response(
            status=200,
            body=json.dumps(frontend_out_game)
        )
