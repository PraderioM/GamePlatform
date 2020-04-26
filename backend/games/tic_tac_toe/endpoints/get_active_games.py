import json

from aiohttp import web
import asyncpg

from ..models.game import Game


async def get_active_games(request: web.Request) -> web.Response:
    limit = int(request.rel_url.query.get('limit', '10'))
    offset = int(request.rel_url.query.get('offset', '0'))
    pool = request.app['db']

    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            await remove_old_games(db=db)
            active_games = await db.fetch("""
                                          SELECT id AS id,
                                                 rows AS rows,
                                                 cols AS cols,
                                                 current_player_index AS current_player_index,
                                                 players AS players, 
                                                 plays AS plays,
                                                 gravity AS gravity
                                          FROM tic_tac_toe_active_games
                                          ORDER BY creation_date DESC
                                          LIMIT $1 OFFSET $2
                                          """, limit, offset)

            # Return a list of the desired results
            game_list = [Game.from_database(json_data=game_data) for game_data in active_games]

            return web.Response(
                status=200,
                body=json.dumps([game.to_display() for game in game_list if not game.has_ended])
            )


async def remove_old_games(db: asyncpg.Connection, minute_limits: int = 5):
    # Get ids that need to be removed. # Todo check out why it fails with minute limits greater than 10.
    to_remove_ids = await db.fetch(f"""
                                   SELECT id
                                   FROM tic_tac_toe_active_games
                                   WHERE (now()::time - last_updated) > INTERVAL '{minute_limits} mins' 
                                   """)
    if len(to_remove_ids) == 0:
        return

    # Remove ids.
    to_remove_ids = [str(id_['id']) for id_ in to_remove_ids]
    id_string = ', '.join([f'${i+1}' for i in range(len(to_remove_ids))])
    await db.execute(f"""
                     DELETE FROM tic_tac_toe_active_games
                     WHERE id IN ({id_string})
                     """, *to_remove_ids)
