import json
from typing import Awaitable, Callable, Dict

from aiohttp import web
import asyncpg

from backend.games.common.models.game import Game
from backend.registration.identify import get_name_from_token


async def find_game(game_id: str, token: str, pool: asyncpg.pool.Pool,
                    active_games_database: str,
                    get_game_from_database: Callable[[asyncpg.Connection, str], Awaitable[Game]],
                    get_dummy_frontend_game: Callable[[str], Dict]) -> web.Response:
    async with pool.acquire() as db:
        async with db.transaction():
            out_game = await get_game_from_database(db, game_id)

            if out_game is None:
                dummy_game = get_dummy_frontend_game(game_id)
                return web.Response(
                    status=200,
                    body=json.dumps(dummy_game)
                )

            # Add new player if needed and update database.
            if out_game.n_missing > 0:
                name = await get_name_from_token(token=token, db=db)
                out_game.add_new_player_name(name=name)
                database_player_list = json.dumps([player.to_database() for player in out_game.player_list])
                await db.execute(f"""
                                 UPDATE {active_games_database}
                                 SET last_updated = now(), players = $1
                                 WHERE id = $2
                                 """, database_player_list, out_game.id)

            frontend_out_game = out_game.to_frontend(db=db)
            return web.Response(
                status=200,
                body=json.dumps(frontend_out_game)
            )
