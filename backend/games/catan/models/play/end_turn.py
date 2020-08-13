from typing import Dict

from aiohttp import web

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
        return EndTurn(player=Player.from_frontend(json_data=json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'EndTurn':
        return EndTurn(player=Player.from_database(json_data=json_data['player']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {'player': self.player.to_frontend()}

    def to_database(self) -> Dict:
        return {'player': self.player.to_database()}

