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

            await db.execute(f"""
                             UPDATE {active_games_table}
                             SET current_player_index = $1,
                                 player_list = $2,
                                 play_list = $3,
                                 turn_index = $4,
                                 last_dice_result = $5,
                                 offer = $6,
                                 development_deck = $7,
                                 materials_deck = $8,
                                 knight_player = $9,
                                 long_road_player = $10,
                                 discard_cards = $11,
                                 thief_moved = $12,
                                 to_build_roads = $13,
                                 thief_position = $14,
                                 to_steal_players = $15
                             WHERE id = $16
                             """,
                             database_data['current_player_index'],
                             database_data['players'],
                             database_data['plays'],
                             database_data['turn_index'],
                             database_data['last_dice_result'],
                             database_data['offer'],
                             database_data['development_deck'],
                             database_data['materials_deck'],
                             database_data['knight_player'],
                             database_data['long_road_player'],
                             database_data['discard_cards'],
                             database_data['thief_moved'],
                             database_data['to_build_roads'],
                             database_data['thief_position'],
                             database_data['to_steal_players'],
                             database_data['id'])

    return await general_make_play(pool=request.app['db'], token=request.rel_url.query['token'],
                                   active_games_table=ACTIVE_GAMES_TABLE,
                                   get_game_from_database=get_game_from_database,
                                   get_play=get_play, get_bot_play=get_bot_play,
                                   update_database=update_database)
