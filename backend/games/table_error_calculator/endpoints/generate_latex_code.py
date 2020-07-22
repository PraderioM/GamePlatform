import json

from aiohttp import web

from ..models.table import Table


async def generate_latex_code(request: web.Request) -> web.Response:
    # Pre process inputs.
    # Todo do black magic to get data.
    # stuff = request.rel_url.query['stuff']
    table = Table.from_json()

    # Otherwise we create a new table.
    return web.Response(
        status=200,
        body=json.dumps({'latex_code': table.get_latex_code()})
    )
