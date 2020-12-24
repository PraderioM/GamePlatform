import json
from typing import Dict, List, Optional

from games.common.models.player import Player as BasePlayer
from ..typing_hints import Card, PileId


class Player(BasePlayer):
    def __init__(self, name: str,
                 original_deck_length: int,
                 deck: Optional[List[Card]] = None,
                 blocked_pile_list: Optional[List[PileId]] = None,
                 slowed_down_pile_list: Optional[List[PileId]] = None,
                 is_bot: bool = False):
        if is_bot:
            raise NotImplementedError('Bot players are not implemented yet.')
        BasePlayer.__init__(self, name=name, is_bot=is_bot)
        self._deck = [] if deck is None else deck[:]
        self._original_deck_length = original_deck_length
        self._blocked_pile_list = [] if blocked_pile_list is None else blocked_pile_list[:]
        self._slowed_down_pile_list = [] if slowed_down_pile_list is None else slowed_down_pile_list[:]

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Player':
        raise NotImplementedError('From frontend method is not implemented.')

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Player':
        return Player(name=json_data['name'],
                      original_deck_length=json_data['original_deck_length'],
                      deck=json.loads(json_data['deck']),
                      blocked_pile_list=json.loads(json_data['blocked_pile_list']),
                      slowed_down_pile_list=json.loads(json_data['slowed_down_pile_list']),
                      is_bot=json_data['is_bot'])

    def to_database(self) -> Dict:
        return {
            'name': self.name,
            'original_deck_length': self._original_deck_length,
            'deck': json.dumps(self._deck),
            'blocked_pile_list': json.dumps(self._blocked_pile_list),
            'slowed_down_pile_list': json.dumps(self._slowed_down_pile_list),
            'is_bot': self.is_bot,
        }

    def to_frontend(self, points: int = 0) -> Dict:
        return {
            'name': self.name,
            'originalDeckLength': self._original_deck_length,
            'deck': self._deck,
            'blockedPileList': self._blocked_pile_list,
            'slowedDownPileList': self._slowed_down_pile_list,
            'isBot': self.is_bot,
        }

    def get_bot_play(self, game):
        raise NotImplementedError('Bot for the GAME is not implemented yet.')

    def remove_card_from_deck(self, card: Card):
        self._deck.remove(card)

    def add_card_to_deck(self, card: Card):
        self._deck.append(card)

    def add_blocked_pile(self, pile_id: PileId):
        if pile_id in self._slowed_down_pile_list:
            self._slowed_down_pile_list.remove(pile_id)

        self._blocked_pile_list.append(pile_id)
        self._blocked_pile_list = list(set(self._blocked_pile_list))

    def add_slowed_down_pile(self, pile_id: PileId):
        if pile_id in self._blocked_pile_list:
            self._blocked_pile_list.remove(pile_id)

        self._slowed_down_pile_list.append(pile_id)
        self._slowed_down_pile_list = list(set(self._slowed_down_pile_list))

    def reset_original_deck_length(self):
        self._original_deck_length = len(self._deck)

    def reset_pile_reservation(self, pile_id: PileId):
        if pile_id in self._blocked_pile_list:
            self._blocked_pile_list.remove(pile_id)

        if pile_id in self._slowed_down_pile_list:
            self._slowed_down_pile_list.remove(pile_id)

    def reset_all_reservations(self):
        self._slowed_down_pile_list = []
        self._blocked_pile_list = []

    @property
    def n_cards(self) -> int:
        return len(self._deck)

    @property
    def deck(self) -> List[Card]:
        return self._deck[:]

    @property
    def original_deck_length(self) -> int:
        return self._original_deck_length
