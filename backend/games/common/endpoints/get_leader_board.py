import json

from aiohttp import web
import asyncpg

from backend.games.common.models.leader_board_row import LeaderBoardRow


async def get_leader_board(pool: asyncpg.pool.Pool, leader_board_table: str,
                           limit: int = 10, offset: int = 0) -> web.Response:
    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        leader_board_data = await db.fetch(f"""
                                           SELECT player_name AS player_name,
                                                  wins AS wins,
                                                  played AS played,
                                                  points AS points
                                           FROM {leader_board_table}
                                           ORDER BY points DESC
                                           LIMIT $1 OFFSET $2
                                           """, limit, offset)
        leader_board_rows = [LeaderBoardRow.from_database(json_data) for json_data in leader_board_data]
        return web.Response(
            status=200,
            body=json.dumps([row.to_frontend() for row in leader_board_rows])
        )
