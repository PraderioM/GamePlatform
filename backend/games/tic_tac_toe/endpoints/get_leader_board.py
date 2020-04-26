import json

from aiohttp import web
import asyncpg

from ..models.leader_board_row import LeaderBoardRow


async def get_leader_board(request: web.Request) -> web.Response:
    limit = int(request.rel_url.query.get('limit', '10'))
    offset = int(request.rel_url.query.get('offset', '0'))
    pool = request.app['db']

    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            leader_board_data = await db.fetch("""
                                               SELECT player_name AS player_name,
                                                      wins AS wins,
                                                      played AS played,
                                                      points AS points
                                               FROM tic_tac_toe_leader_board
                                               ORDER BY points DESC
                                               LIMIT $1 OFFSET $2
                                               """, limit, offset)
            leader_board_rows = [LeaderBoardRow.from_database(json_data) for json_data in leader_board_data]
            return web.Response(
                status=200,
                body=json.dumps([row.to_frontend() for row in leader_board_rows])
            )
    pass
