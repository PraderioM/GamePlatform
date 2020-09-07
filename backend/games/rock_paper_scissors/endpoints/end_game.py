import json

from aiohttp import web
import asyncpg

from .utils import get_game_data
from ..models.game import Game
from backend.registration.identify import get_name_from_token


async def end_game(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    token = request.rel_url.query['token']

    async with request.app['db'].acquire() as db:
        async with db.transaction():
            game = await get_game_from_database(db, game_id=game_id)

            name = await get_name_from_token(token=token, db=db)
            player = game.get_player_by_name(name=name)

            # Get game resolution
            game_resolution = game.to_game_resolution(player)

            # If player is indeed playing the game we must update the leader board if not already updated.
            if player is not None and not player.is_bot:
                # Get last played game.
                last_played = await db.fetchval(f"""
                                                SELECT last_played
                                                FROM rock_paper_scissors_leader_board
                                                WHERE player_name = $1
                                                """, player.name)

                resolution_points = game.resolution_points(player=player)
                win = 1 if game.is_winner_points(resolution_points) else 0
                # If there is no last played game then player has never played and we must create a
                # new player in the database.
                if last_played is None:
                    await db.execute(f"""
                                     INSERT INTO rock_paper_scissors_leader_board
                                                 (player_name, wins, last_played, played, points)
                                     VALUES ($1, $2, $3, 1, $4)
                                     """, player.name, win, game_id, resolution_points)
                # If last played is different than the current then we need not to create a user however we need to
                # update its points.
                elif last_played != game_id:
                    await db.execute(f"""
                                     UPDATE rock_paper_scissors_leader_board
                                     SET last_played = $1, wins = wins + $2, played = played + 1, points = points + $3
                                     WHERE player_name = $4 and last_played != $1
                                     """,
                                     game_id, win, resolution_points, player.name
                                     )

            return web.Response(
                status=200,
                body=json.dumps(game_resolution)
            )


async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Game:
    game_data = await get_game_data(game_id=game_id, db=db)
    return Game.from_database(game_data)
