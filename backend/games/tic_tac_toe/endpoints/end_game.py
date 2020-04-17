from aiohttp import web
import asyncpg
import json

from backend.logging.identify import get_name_from_token
from ..models.game import Game
from ..models.play import Play


async def end_game(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    pool = request.app['db']

    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            database_data = await db.fetchrow("""
                                    SELECT id AS id,
                                           rows AS rows,
                                           cols AS cols,
                                           current_player_index AS current_player_index,
                                           players AS players, 
                                           plays AS plays,
                                           gravity AS gravity
                                    FROM tic_tac_toe_active_games
                                    WHERE id = $1
                                    """, game_id)
            game_data = {
                key: await database_data[key] for key in ['rows', 'cols', 'id',
                                                          'players', 'plays', 'current_player_index']
            }
            game = Game.from_database(json_data=game_data)
            name = await get_name_from_token(token=request.rel_url.query['token'], db=db)
            player = game.get_player_from_name(name=name)
            # Get game resolution
            game_resolution = game.to_game_resolution(player)

            # If player is indeed playing the game we must update the leader board if not already updated.
            if player is not None and not player.is_bot:
                resolution_points = game.resolution_points(player=player)
                win = 1 if resolution_points == len(game.player_list) - 1 else 0
                # Get last played game.
                last_played = await db.fetchval("""
                                                SELECT last_played
                                                FROM tic_tac_toe_leader_board
                                                WHERE player_name = $1
                                                """, player.name)
                # If there is no last played game then player has never played and we must create a
                # new player in the database.
                if last_played is None:
                    await db.execute("""
                                     INSERT INTO tic_tac_toe_leader_board
                                                 (player_name, wins, last_played, played, points)
                                     VALUES ($1, $2, $3, 1, $4)
                                     """, player.name, win, game_id, resolution_points)
                # If last played is different than the current then we need not to create a user however we need to
                # update its points.
                elif last_played != game_id:
                    await db.execute("""
                                     UPDATE tic_tac_toe_leader_board
                                     SET last_played = $1, wins = wins + $2, played = played + 1, points = points + $3
                                     WHERE player_name = $4 and last_played != $1
                                     """,
                                     game_id, win, resolution_points, player.name
                                     )

            return web.Response(
                status=200,
                body=json.dumps(game_resolution)
            )
