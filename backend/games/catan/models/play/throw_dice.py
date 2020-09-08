from random import randint
from typing import Dict

from aiohttp import web

from ..player import Player
from .core import Play, register_play


@register_play(play_name='throw_dice')
class ThrowDice(Play):
    def can_update_game(self, game) -> bool:
        return not self.player.dice_thrown and game.is_current_player(self.player)

    def update_game(self, game):
        # Get random dice throw.
        dice_result = randint(1, 6) + randint(1, 6)
        game.last_dice_result = dice_result

        # If a 7 appears cards must be discarded and the thief must be moved.
        if dice_result == 7:
            game.discard_cards = True
            game.thief_moved = False
        # Give materials to every player according to their available settlements.
        else:
            game.give_materials(dice_result)
        
        game.get_player_by_name(self.player.name).dice_thrown = True

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'ThrowDice':
        return ThrowDice(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'ThrowDice':
        return ThrowDice(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

