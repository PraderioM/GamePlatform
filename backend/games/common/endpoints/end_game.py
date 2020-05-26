import json
from typing import Awaitable, Callable

from aiohttp import web
import asyncpg

from ..models.game import Game
from backend.registration.identify import get_name_from_token


async def end_game(pool: asyncpg.pool.Pool, game_id: str, token: str,
                   get_game_from_database: Callable[[asyncpg.Connection], Awaitable[Game]],
                   leader_board_database: str) -> web.Response:

    async with pool.acquire() as db:
        async with db.transaction():
            game = await get_game_from_database(db)

            name = await get_name_from_token(token=token, db=db)
            player = game.get_player_from_name(name=name)

            # Get game resolution
            game_resolution = game.to_game_resolution(player)

            # If player is indeed playing the game we must update the leader board if not already updated.
            if player is not None and not player.is_bot:
                # Get last played game.
                last_played = await db.fetchval(f"""
                                                SELECT last_played
                                                FROM {leader_board_database}
                                                WHERE player_name = $1
                                                """, player.name)

                resolution_points = game.resolution_points(player=player)
                win = 1 if game.is_winner_points(resolution_points) else 0
                # If there is no last played game then player has never played and we must create a
                # new player in the database.
                if last_played is None:
                    await db.execute(f"""
                                     INSERT INTO {leader_board_database}
                                                 (player_name, wins, last_played, played, points)
                                     VALUES ($1, $2, $3, 1, $4)
                                     """, player.name, win, game_id, resolution_points)
                # If last played is different than the current then we need not to create a user however we need to
                # update its points.
                elif last_played != game_id:
                    await db.execute(f"""
                                     UPDATE {leader_board_database}
                                     SET last_played = $1, wins = wins + $2, played = played + 1, points = points + $3
                                     WHERE player_name = $4 and last_played != $1
                                     """,
                                     game_id, win, resolution_points, player.name
                                     )

            return web.Response(
                status=200,
                body=json.dumps(game_resolution)
            )
