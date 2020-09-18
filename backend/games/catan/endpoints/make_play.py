from typing import List, Optional

from aiohttp import web
import asyncpg

from games.common.endpoints.make_play import make_play as general_make_play
from ..models.game import Game
from ..models.play import Play
from ..models.player import Player
from .utils import get_game_from_database
from ..global_variables import ACTIVE_GAMES_DICT, LOCK


async def make_play(request: web.Request) -> web.Response:
    json_data = Play.pre_process_web_request(request=request)
    play_list: List[Play] = []

    def get_play(game: Game, player: Player) -> Optional[Play]:
        play = Play.from_frontend(json_data={'player': player.to_frontend(), **json_data})
        play_list.append(play)
        return play

    def get_bot_play(game: Game, player: Player) -> Optional[Play]:
        play = player.get_bot_play(game)
        play_list.append(play)
        return play

    async def update_database(db: asyncpg.connection, game: Game):
        ACTIVE_GAMES_DICT[game.id] = game

    await LOCK.acquire()
    response = await general_make_play(pool=request.app['db'],
                                       token=request.rel_url.query['token'],
                                       game_id=request.rel_url.query['game_id'],
                                       get_game_from_database=get_game_from_database,
                                       get_play=get_play,
                                       update_database=update_database,
                                       get_bot_play=get_bot_play)
    LOCK.release()
    return response
