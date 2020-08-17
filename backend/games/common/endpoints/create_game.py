import json
from typing import Awaitable, Callable, Dict, Tuple

from aiohttp import web
import asyncpg

from backend.games.common.models.game import Game


async def create_game(pool: asyncpg.pool.Pool,
                      get_new_game: Callable[[asyncpg.Connection], Awaitable[Tuple[Game, Dict]]],
                      add_new_game_to_database: Callable[[Game, asyncpg.Connection], Awaitable[None]]) -> web.Response:
    async with pool.acquire() as db:
        # If settings are correct we create a new game.
        new_game, error_game = await get_new_game(db)
        if error_game is not None:
            return web.Response(
                status=200,
                body=json.dumps(error_game)
            )

        async with db.transaction():
            await add_new_game_to_database(new_game, db)

            frontend_new_game = new_game.to_frontend(db=db)
            print('game created.')
            print(frontend_new_game)
            return web.Response(
                status=200,
                body=json.dumps(frontend_new_game)
            )
