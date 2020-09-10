from datetime import time
from typing import Optional

import asyncpg


async def get_last_received_update_from_token(token: str, db: asyncpg.Connection) -> Optional[time]:
    return await db.fetchval("""
                             SELECT last_received_update
                             FROM  users
                             WHERE token=$1
                             """, token)


async def update_last_received_update_by_token(token: str, db: asyncpg.Connection):
    return await db.fetchval("""
                             UPDATE users
                             SET last_received_update = now()
                             WHERE token=$1
                             """, token)


async def update_last_received_update_by_name(name: str, db: asyncpg.Connection):
    return await db.fetchval("""
                             UPDATE users
                             SET last_received_update = now()
                             WHERE name=$1
                             """, name)
