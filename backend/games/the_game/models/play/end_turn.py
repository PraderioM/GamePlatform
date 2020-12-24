from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player


@register_play(play_name='end_turn')
class EndTurn(Play):

    def __init__(self, player: Player):
        Play.__init__(self, player=player)

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'EndTurn':
        return EndTurn(player=json_data['player'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    def update_game(self, game):
        player: Player = game.get_player_by_name(self.player.name)
        player.reset_all_reservations()
        game.refill_player_deck(self.player.name)
        game.update_turn()

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             remaining_cards = $2,
                             turn = $3,
                             current_player_index = $4,
                             last_updated = now()
                         WHERE id = $5
                         """,
                         database_data['player_list'],
                         database_data['remaining_cards'],
                         database_data['turn'],
                         database_data['current_player_index'],
                         database_data['id'])
