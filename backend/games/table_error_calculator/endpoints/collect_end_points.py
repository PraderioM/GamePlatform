import os

from aiohttp import web

from .generate_latex_code import generate_latex_code
from ..constants import ENDPOINT_SCOPE


def collect_end_points(app: web.Application):
    app.router.add_get(os.path.join(ENDPOINT_SCOPE, 'generate-latex-code'), generate_latex_code)
