import json

from aiohttp import web
import asyncpg

from ..models.game import Game
from backend.logging.identify import get_name_from_token


async def find_game(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    pool = request.app['db']

    async with pool.acquire() as db:
        async with db.transaction():
            db: asyncpg.Connection = db
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

            # Return a dummy result if no game was found with desired id.
            if game_data is None:
                dummy_game = Game(rows=0, cols=0, current_player_index=0, gravity=False,
                                  play_list=[], player_list=[], id_=None)
                error_message = f'There is no active game with id `{game_id}`.'
                return web.Response(
                    status=200,
                    body=json.dumps(dummy_game.to_frontend(db=db,
                                                           description=error_message)
                                    )
                )

            out_game = Game.from_database(json_data=game_data)

            # Add new player if needed and update database.
            if out_game.n_missing > 0:
                name = await get_name_from_token(token=request.rel_url.query['token'], db=db)
                out_game.add_new_player_name(name=name)
                database_player_list = json.dumps([player.to_database() for player in out_game.player_list])
                await db.execute("""
                                 UPDATE tic_tac_toe_active_games
                                 SET last_updated = now(), players = $1
                                 WHERE id = $2
                                 """, database_player_list, out_game.id)

            return web.Response(
                status=200,
                body=json.dumps(await out_game.to_frontend(db=db))
            )
