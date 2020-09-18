from aiohttp import web
import asyncpg

from backend.games.common.endpoints.make_play import make_play as general_make_play
from ..models.game import Game
from ..models.play import Play
from ..models.player import Player
from ..models.modifier import Modifier
from .utils import get_game_from_database
from ..constants import ACTIVE_GAMES_TABLE


async def make_play(request: web.Request) -> web.Response:
    play_number = int(request.rel_url.query['play'])
    modifier = Modifier.from_name(request.rel_url.query['modifier'])

    def get_play(game: Game, player: Player) -> Play:
        return Play(player, play_number, modifier)

    return await general_make_play(pool=request.app['db'],
                                   token=request.rel_url.query['token'],
                                   game_id=request.rel_url.query['game_id'],
                                   get_game_from_database=get_game_from_database,
                                   get_play=get_play,
                                   update_database=update_database,
                                   get_bot_play=None,
                                   is_linear=False)


async def update_database(db: asyncpg.connection, game: Game):
    database_data = game.to_database()
    await db.execute(f"""
                     UPDATE {ACTIVE_GAMES_TABLE}
                     SET player_list = $1,
                         current_round = $2,
                         n_plays = $3,
                         last_updated = now()
                     WHERE id = $4
                     """,
                     database_data['player_list'],
                     database_data['current_round'],
                     database_data['n_plays'],
                     database_data['id'])
