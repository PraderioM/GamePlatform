from typing import List
from datetime import datetime, timedelta

from aiohttp import web
import asyncpg

from .utils import get_game_from_database, get_dummy_frontend_game
from ..models.game import Game
from ..models.player import Player
from games.common.endpoints.enter_game import enter_game as general_enter_game
from ..global_variables import ACTIVE_GAMES_DICT, LOCK


async def enter_game(request: web.Request) -> web.Response:
    await LOCK.acquire()
    response = await general_enter_game(token=request.rel_url.query['token'],
                                        pool=request.app['db'],
                                        game_id=request.rel_url.query['game_id'],
                                        get_game_from_database=get_game_from_database,
                                        get_dummy_frontend_game=get_dummy_frontend_game,
                                        update_player_list=update_player_list,
                                        shuffle_before_start=True)
    LOCK.release()
    return response


async def update_player_list(db: asyncpg.Connection, game: Game, player_list: List[Player], game_id: str):
    game = ACTIVE_GAMES_DICT.get(game_id, game)
    game.player_list = player_list
    game.last_updated = datetime.now()
