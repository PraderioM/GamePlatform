from aiohttp import web
import asyncpg
import json

from backend.registration.identify import get_name_from_token
from ..models.game import Game
from ..models.play import Play


async def make_play(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    pool = request.app['db']

    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            game_data = await db.fetchrow("""
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
            game = Game.from_database(json_data=game_data)

            # If all players aren't ready we cannot make any play.
            if game.n_missing > 0:
                return web.Response(
                    status=200,
                    body=json.dumps(await game.to_frontend(db=db))
                )

            name = await get_name_from_token(token=request.rel_url.query['token'], db=db)
            player = game.get_player_from_name(name=name)
            if player is not None:
                play = Play(row=int(request.rel_url.query['row']),
                            col=int(request.rel_url.query['col']),
                            player=player)
                play = game.pre_process_play(play)
                game.add_play(play)

            # Make bot plays.
            while game.current_player().is_bot:
                play = game.current_player().get_bot_play(game)
                play = game.pre_process_play(play)
                game.add_play(play)

            # Update database.
            database_data = game.to_database()
            await db.execute("""
                             UPDATE tic_tac_toe_active_games
                             SET current_player_index = $1, players = $2, plays = $3, last_updated = now()
                             WHERE id = $4
                             """,
                             database_data['current_player_index'],
                             database_data['players'],
                             database_data['plays'],
                             database_data['id'])

            return web.Response(
                status=200,
                body=json.dumps(await game.to_frontend(db=db))
            )
