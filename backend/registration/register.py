import json
from uuid import uuid4

from aiohttp import web
import asyncpg


async def register(request):
    """Add User and Password"""
    name = request.rel_url.query['name']
    confirmed_name = request.rel_url.query['confirmed_name']

    # Name must be specified.
    if name == '':
        return web.Response(
            status=200,
            # status=409,
            body=json.dumps(
                {
                    'token': None,
                    'incorrectName': True,
                    'errorMessage': 'User name must be specified.'
                }
            )
        )

    # name and confirmed name must coincide.
    if name != confirmed_name:
        return web.Response(
            status=200,
            # status=409,
            body=json.dumps(
                {
                    'token': None,
                    'incorrectName': True,
                    'incorrectNameConfirm': True,
                    'errorMessage': 'Username confirmation does not coincide with username.',
                }
            )
        )

    pool = request.app['db']
    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            name_count = await db.fetchval("""
                                           SELECT COUNT(name)
                                           FROM  users
                                           WHERE name=$1
                                           """, name)

            # If the user password doesn't exist return None.
            if name_count != 0:
                return web.Response(
                    status=200,
                    # status=409,
                    body=json.dumps(
                        {
                            'token': None,
                            'incorrectName': True,
                            'errorMessage': f'User {name} already exists. Please try a different username.'
                        }
                    )
                )

            # Generate token.
            token = uuid4()

            # Insert the user and password  and token in the database.
            await db.execute("""INSERT INTO users (name, token)
                                VALUES ($1, $2)
                                """, name, token)

            return web.Response(
                status=201,
                body=json.dumps(
                    {
                        'token': str(token),
                        'errorMessage': f'User {name} correctly registered.'
                    }
                )
            )
