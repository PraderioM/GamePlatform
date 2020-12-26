from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player


@register_play(play_name='choose_starting_player')
class ChooseStartingPlayer(Play):

    def __init__(self, player: Player):
        Play.__init__(self, player=player)

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'ChooseStartingPlayer':
        return ChooseStartingPlayer(player=json_data['player'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    def update_game(self, game):
        if game.current_player_index is None:
            player: Player = game.get_player_by_name(self.player.name)
            game.set_current_player(player)

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET current_player_index = $1,
                             n_actions = n_actions + 1
                         WHERE id = $2
                         """,
                         database_data['current_player_index'],
                         database_data['id'])
