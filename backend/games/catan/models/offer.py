from typing import List, Dict

from backend.games.common.models.game_component import GameComponent
from .player import Player
from .materials_deck import MaterialsDeck


class Offer(GameComponent):

    def __init__(self, offer_maker: Player, target_player_list: List[Player],
                 offered_deck: MaterialsDeck, requested_deck: MaterialsDeck):
        self._offer_maker = offer_maker
        self._target_player_list = target_player_list
        self.offered_deck = offered_deck
        self.requested_deck = requested_deck

    # region frontend conversion.
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Offer':
        raise NotImplementedError('from fronted is not implemented.')

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {
            'offerMaker': self._offer_maker.to_frontend(),
            'targetPlayerList': [player.to_frontend() for player in self._target_player_list],
            'offeredDeck': self.offered_deck.to_json(),
            'requestedDeck': self.requested_deck.to_json(),
        }
    # endregion.

    # region database conversion.
    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Offer':
        return Offer(
            offer_maker=Player.from_database(json_data['offer_maker']),
            target_player_list=[
                Player.from_database(player_data) for player_data in json_data['target_player_list']
            ],
            offered_deck=MaterialsDeck.from_json(json_data['offered_deck']),
            requested_deck=MaterialsDeck.from_json(json_data['requested_deck']),
        )

    def to_database(self) -> Dict:
        return {
            'offer_maker': self._offer_maker.to_database(),
            'target_player_list': [player.to_database() for player in self._target_player_list],
            'offered_deck': self.offered_deck.to_json(),
            'requested_deck': self.requested_deck.to_json(),
        }
    # endregion.

    def remove_target_player(self, player_name: str):
        target_player = [player for player in self._target_player_list if player.name == player_name]

        for player in target_player:
            self._target_player_list.remove(player)

    def is_source_player(self, player: Player):
        return player.name == self._offer_maker.name

    def is_target_player(self, player: Player):
        for target_player in self._target_player_list:
            if target_player.name == player.name:
                return True
        return False

    @property
    def n_target_players(self) -> int:
        return len(self._target_player_list)

    @property
    def offer_maker_name(self) -> str:
        return self._offer_maker.name
