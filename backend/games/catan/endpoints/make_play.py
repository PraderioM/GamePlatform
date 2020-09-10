from typing import Dict, List, Optional

from aiohttp import web
import asyncpg

from backend.games.common.endpoints.make_play import make_play as general_make_play
from ..models.game import Game
from ..models.play import Play
from ..models.player import Player
from .utils import get_game_data
from ..constants import ACTIVE_GAMES_TABLE


async def make_play(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    json_data = Play.pre_process_web_request(request=request)
    play_list: List[Play] = []

    async def get_game_from_database(db: asyncpg.Connection) -> Game:
        game_data = await get_game_data(game_id=game_id, db=db)
        return Game.from_database(json_data=game_data)

    def get_play(game: Game, player: Player) -> Optional[Play]:
        play = Play.from_frontend(json_data={'player': player.to_frontend(), **json_data})
        play_list.append(play)
        return play

    def get_bot_play(game: Game, player: Player) -> Optional[Play]:
        play = player.get_bot_play(game)
        play_list.append(play)
        return play

    async def update_database(db: asyncpg.connection, active_games_table: str, database_data: Dict):
        for play in play_list:
            if play is None:
                continue

            await play.update_database(db, active_games_table, database_data)

    return await general_make_play(pool=request.app['db'], token=request.rel_url.query['token'],
                                   active_games_table=ACTIVE_GAMES_TABLE,
                                   get_game_from_database=get_game_from_database,
                                   get_play=get_play, get_bot_play=get_bot_play,
                                   update_database=update_database)
