import json
from random import shuffle
from typing import Awaitable, Callable, Dict

from aiohttp import web
import asyncpg

from backend.games.common.models.game import Game
from backend.registration.identify import get_name_from_token


async def enter_game(token: str, pool: asyncpg.pool.Pool,
                     active_games_table: str,
                     game_id: str,
                     get_game_from_database: Callable[[asyncpg.Connection, str], Awaitable[Game]],
                     get_dummy_frontend_game: Callable[[str], Dict],
                     shuffle_before_start: bool = False) -> web.Response:
    async with pool.acquire() as db:
        # Get username corresponding to token.
        player_name = await get_name_from_token(token=token, db=db)

        # If unable to do so it means token has expired. Show message accordingly.
        if player_name is None:
            dummy_game = get_dummy_frontend_game(f'Your token has expired. Please re-start session.')
            return web.Response(
                status=200,
                body=json.dumps(dummy_game)
            )

        # If we are able then let us look for the game.
        async with db.transaction():
            # Get game info.
            out_game = await get_game_from_database(db, game_id)

            # If unable to do so it means game does not exist. Return a dummy game.
            if out_game is None:
                dummy_game = get_dummy_frontend_game(f'could not find game with id `{game_id}`')
                return web.Response(
                    status=200,
                    body=json.dumps(dummy_game)
                )

            # Add new player if needed and update database.
            if out_game.n_missing > 0:
                out_game.add_new_player_name(name=player_name)
                database_player_list = [player.to_database() for player in out_game.player_list]
                if shuffle_before_start and out_game.n_missing == 0:
                    shuffle(database_player_list)
                await db.execute(f"""
                                 UPDATE {active_games_table}
                                 SET last_updated = now(), player_list = $1
                                 WHERE id = $2
                                 """, json.dumps(database_player_list), out_game.id)

        # Update player last received update.
        await db.execute(f"""
                         UPDATE users
                         SET last_received_update = now()
                         WHERE name = $1
                         """, player_name)

        frontend_out_game = out_game.to_frontend(db=db)
        return web.Response(
            status=200,
            body=json.dumps(frontend_out_game)
        )
