import os

from aiohttp import web

from .solve_sudoku import solve_sudoku
from .create_sudoku import create_sudoku
from ..constants import ENDPOINT_SCOPE


def collect_end_points(app: web.Application):
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'solve-sudoku'), solve_sudoku)
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'create-sudoku'), create_sudoku)
