import json
from typing import Dict, List, Optional

from games.common.models.player import Player as BasePlayer
from ..typing_hints import CardID


class Player(BasePlayer):
    def __init__(self, name: str,
                 deck: Optional[List[CardID]] = None,
                 points: int = 0,
                 chosen_card_id: Optional[CardID] = None,
                 played_card_id: Optional[CardID] = None,
                 is_bot: bool = False):
        if is_bot:
            raise NotImplementedError('Bot players are not implemented and will not be implemented in the near future.')
        BasePlayer.__init__(self, name=name, is_bot=is_bot)
        self._deck = [] if deck is None else deck[:]
        self.points = points
        self.chosen_card_id = chosen_card_id
        self.played_card_id = played_card_id

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Player':
        raise NotImplementedError('From frontend method is not implemented.')

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Player':
        return Player(name=json_data['name'],
                      deck=json.loads(json_data['deck']),
                      points=json_data['points'],
                      chosen_card_id=json_data['chosen_card_id'],
                      played_card_id=json_data['played_card_id'])

    def to_database(self) -> Dict:
        return {
            'name': self.name,
            'deck': self._deck,
            'points': self.points,
            'chosen_card_id': self.chosen_card_id,
            'played_card_id': self.played_card_id,
        }

    def to_frontend(self, points: int = 0) -> Dict:
        return {
            'name': self.name,
            'isBot': False,
            'deck': self._deck,
            'points': self.points,
            'chosenCardId': self.chosen_card_id,
            'playedCardId': self.played_card_id,
        }

    def get_bot_play(self, game):
        raise NotImplementedError('Bot for DiXiT is not implemented and will not be implemented in the near future.')

    def remove_card_from_deck(self, card_id: CardID):
        self._deck.remove(card_id)

    def add_card_to_deck(self, card_id: CardID):
        self._deck.append(card_id)

    @property
    def n_cards(self) -> int:
        return len(self._deck)

    @property
    def deck(self) -> List[CardID]:
        return self._deck[:]
