from typing import Optional

from aiohttp import web
import asyncpg

from backend.games.common.endpoints.make_play import make_play as general_make_play
from ..models.game import Game
from ..models.play import Play
from ..models.player import Player
from .utils import get_game_data


async def make_play(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    json_data = Play.pre_process_web_request(request=request)

    async def get_game_from_database(db: asyncpg.Connection) -> Game:
        game_data = await get_game_data(game_id=game_id, db=db)
        return Game.from_database(json_data=game_data)

    def get_play(game: Game, player: Player) -> Optional[Play]:
        return Play.from_database(json_data={'player': player.to_database(), **json_data})

    def get_bot_play(game: Game, player: Player) -> Optional[Play]:
        return player.get_bot_play(game)

    return await general_make_play(pool=request.app['db'], token=request.rel_url.query['token'],
                                   active_games_table='catan_active_games',
                                   get_game_from_database=get_game_from_database,
                                   get_play=get_play, get_bot_play=get_bot_play)
