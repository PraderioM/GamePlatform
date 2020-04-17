from typing import Optional

import asyncpg


async def get_name_from_token(token: str, db: asyncpg.Connection) -> Optional[str]:
    return await db.fetchval("""
                             SELECT name
                             FROM  users
                             WHERE token=$1
                             """, token)


async def get_token_from_name(name: str, db: asyncpg.Connection) -> Optional[str]:
    return await db.fetchval("""
                             SELECT token
                             FROM  users
                             WHERE name=$1
                             """, name)
