from typing import Optional

from aiohttp import web
import asyncpg

from games.common.endpoints.make_play import make_play as general_make_play
from ..models.game import Game
from ..models.play import Play
from ..models.player import Player
from .utils import get_game_from_database
from ..constants import ACTIVE_GAMES_TABLE


async def make_play(request: web.Request) -> web.Response:
    row = int(request.rel_url.query['row'])
    col = int(request.rel_url.query['col'])

    def get_play(game: Game, player: Player) -> Optional[Play]:
        play = Play(row=row, col=col, player=player)
        return game.pre_process_play(play)

    def get_bot_play(game: Game, player: Player) -> Optional[Play]:
        play = player.get_bot_play(game)
        return game.pre_process_play(play)

    return await general_make_play(pool=request.app['db'],
                                   token=request.rel_url.query['token'],
                                   game_id=request.rel_url.query['game_id'],
                                   get_game_from_database=get_game_from_database,
                                   get_play=get_play,
                                   update_database=update_database,
                                   get_bot_play=get_bot_play)


async def update_database(db: asyncpg.connection, game: Game):
    database_data = game.to_database()

    await db.execute(f"""
                     UPDATE {ACTIVE_GAMES_TABLE}
                     SET current_player_index = $1,
                         player_list = $2,
                         play_list = $3,
                         n_actions = n_actions + 1
                     WHERE id = $4
                     """,
                     database_data['current_player_index'],
                     database_data['players'],
                     database_data['plays'],
                     database_data['id'])
