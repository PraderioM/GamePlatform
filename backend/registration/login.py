import json
from uuid import uuid4

from aiohttp import web
import asyncpg


async def login(request: web.Request) -> web.Response:
    """Returns state 200 and the generated token if the user and password are correct, returns state 401 otherwise"""
    name = request.rel_url.query['name']

    # Make sure user name and password are specified.
    if name == '':
        return web.Response(
            status=200,
            # status=404,
            body=json.dumps(
                {
                    'token': None,
                    'incorrectName': True,
                    'errorMessage': 'Please specify user name.'
                }
            )
        )

    pool = request.app['db']
    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            registered_name = await db.fetchrow("""
                                                SELECT name AS name
                                                FROM  users
                                                WHERE name=$1
                                                """, name)

            # If we the combination user password doesn't exist return None.
            if registered_name is None:
                return web.Response(
                    status=200,
                    # status=404,
                    body=json.dumps(
                        {
                            'token': None,
                            'incorrectName': True,
                            'errorMessage': f'User name `{name}` not found'
                        }
                    )
                )
            # Generate token.
            token = uuid4()

            # Update the token in the database.
            await db.execute("""
                             UPDATE users
                             SET token = $1
                             WHERE name = $2
                             """, token, name)

            return web.Response(
                status=200,
                body=json.dumps(
                    {
                        'token': str(token),
                        'errorMessage': f'User {name} logged in.'
                    }
                )
            )
