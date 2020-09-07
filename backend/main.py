import asyncio
import logging
import os

from aiohttp import web
import aiohttp_cors
import asyncpg

from backend.registration.login import login
from backend.registration.logout import logout
from backend.registration.register import register
from backend.games.tic_tac_toe.endpoints.collect_end_points import collect_end_points as tic_tac_toe_end_points
from backend.games.sudoku.endpoints.collect_end_points import collect_end_points as sudoku_end_points
from backend.games.catan.endpoints.collect_end_points import collect_end_points as catan_end_points
from backend.games.rock_paper_scissors.endpoints.collect_end_points import collect_end_points as r_p_s_end_points


async def create_app():  # Start the app
    logger = logging.getLogger('GamePlatform')
    app_ = web.Application()

    # Configure default CORS settings.
    cors = aiohttp_cors.setup(app_, defaults={
        "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
    })

    # Get a connection pool to the database.
    logger.info('creating web app.')
    conn = await asyncpg.create_pool(
        database=os.environ.get('DATABASE_NAME'),
        host=os.environ.get('DATABASE_HOST'),
        port=os.environ.get('DATABASE_PORT'),
        user=os.environ.get('DATABASE_USER'),
        password=os.environ.get('DATABASE_PASSWORD'),
        min_size=os.environ.get('MIN_POOL_SIZE', 1),
        max_size=os.environ.get('MAX_POOL_SIZE', 10)
    )
    app_["db"] = conn

    # Register handlers.
    app_.router.add_get('/login', login)
    app_.router.add_get('/logout', logout)
    app_.router.add_get('/register', register)
    tic_tac_toe_end_points(app=app_)
    sudoku_end_points(app=app_)
    catan_end_points(app=app_)
    r_p_s_end_points(app=app_)

    # Configure CORS on all routes (deactivate it).
    for route in list(app_.router.routes()):
        cors.add(route)

    return app_


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    app = loop.run_until_complete(create_app())
    web.run_app(app, host=os.environ.get('HOST'), port=2121)
