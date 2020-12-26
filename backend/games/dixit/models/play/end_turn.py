from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player


@register_play(play_name='end_turn')
class EndTurn(Play):

    def __init__(self):
        Play.__init__(self, player=Player('dummy'))

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'EndTurn':
        return EndTurn()

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    def update_game(self, game):
        game.resolve_turn()
        game.end_turn()

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             played_cards = $2,
                             current_player_index = $3,
                             card_description = null,
                             n_actions = n_actions + 1
                         WHERE id = $4
                         """,
                         database_data['player_list'],
                         database_data['played_cards'],
                         database_data['current_player_index'],
                         database_data['id'])
