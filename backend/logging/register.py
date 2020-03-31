import json
import re
from uuid import uuid4

from aiohttp import web
import asyncpg


async def register(request):
    """Add User and Password"""
    name = request.rel_url.query['name']
    password = request.rel_url.query['password']

    if re.match('^[\w]+$', password) is None:
        return web.Response(
            status=403,
            body=json.dumps(
                {
                    'token': None,
                    'errorMessage': f'Passwords can only contain alphanumeric values.'
                }
            )
        )

    pool = request.app['db']
    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            user_password = await db.fetchval("""
                                         SELECT COUNT(name)
                                         FROM  users
                                         WHERE name=$1
                                         """, name)

            # If the user password doesn't exist return None.
            if user_password is not None:
                return web.Response(
                    status=409,
                    body=json.dumps(
                        {
                            'token': None,
                            'errorMessage': f'User {name} already exists. Please try a different username.'
                        }
                    )
                )

            # Generate token.
            token = uuid4()

            # Insert the user and password  and token in the database.
            await db.execute("""INSERT INTO users (name, password, token)
                                VALUES ($1, $2, $3)
                                """, name, password, token)

            return web.Response(
                status=201,
                body=json.dumps(
                    {
                        'token': str(token),
                        'errorMessage': f'User {name} correctly registered.'
                    }
                )
            )
