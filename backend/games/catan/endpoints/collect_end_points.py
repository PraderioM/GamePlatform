import os

from aiohttp import web

from .create_game import create_game
from .end_game import end_game
from .find_game import find_game
from .get_active_games import get_active_games
from .get_leader_board import get_leader_board
from .make_play import make_play
from ..constants import ENDPOINT_SCOPE


def collect_end_points(app: web.Application):
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'get-active-games'), get_active_games)
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'create-game'), create_game)
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'find-game'), find_game)
    app.router.add_post(os.path.join(ENDPOINT_SCOPE, 'make-play'), make_play)
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'end-game'), end_game)
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'get-leader-board'), get_leader_board)
