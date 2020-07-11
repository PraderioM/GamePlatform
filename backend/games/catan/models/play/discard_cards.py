from math import floor
from typing import Dict

from .core import Play, register_play
from ..materials_deck import MaterialsDeck
from ..player import Player


@register_play(play_name='discard_cards')
class DiscardCards(Play):
    def __init__(self, player: Player, materials_deck: MaterialsDeck):
        Play.__init__(self, player=player)
        self.materials_deck = materials_deck

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'DiscardCards':
        return DiscardCards(player=Player.from_frontend(json_data['player']),
                            materials_deck=MaterialsDeck.from_json(json_data['materialsDeck']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'DiscardCards':
        return DiscardCards(player=Player.from_database(json_data['player']),
                            materials_deck=MaterialsDeck.from_json(json_data['materials_deck']))

    def to_frontend(self) -> Dict:
        return {'player': self.player.to_frontend(),
                'materialsDeck': self.materials_deck.to_json()}

    def to_database(self) -> Dict:
        return {'player': self.player.to_frontend(),
                'materials_deck': self.materials_deck.to_json()}

    def can_update_game(self, game) -> bool:
        player: Player = game.get_player_by_name(self.player.name)

        # Player must not have previously discarded.
        if player.cards_discarded:
            return False

        # Correct number of materials must be discarded.
        if int(floor(player.n_materials / 2)) != self.materials_deck.n_materials:
            return False

        # No more material than the available ones must be discarded.
        player_deck = player.materials_deck
        for material, n_materials in self.materials_deck.deck.items():
            if n_materials > player_deck[material]:
                return False

        return True

    def update_game(self, game):
        player = game.get_player_by_name(self.player.name)

        for material, n_materials in self.materials_deck.deck.items():
            player.update_materials(material=material, number=-n_materials)
            game.update_materials(material=material, number=n_materials)

        player.cards_discarded = True
