from typing import Dict

from aiohttp import web
import asyncpg

from ..player import Player
from .core import Play, register_play


@register_play(play_name='end_turn')
class EndTurn(Play):
    def can_update_game_setup_round(self, game) -> bool:
        return len(game.play_list) == 2 * (game.turn_index + 1)

    def update_game(self, game):
        game.end_turn()

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'EndTurn':
        return EndTurn(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'EndTurn':
        return EndTurn(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET current_player_index = $1,
                             player_list = $2,
                             turn_index = $3,
                             last_updated = now()
                         WHERE id = $4
                         """,
                         database_data['current_player_index'],
                         database_data['players'],
                         database_data['turn_index'],
                         database_data['id'])
