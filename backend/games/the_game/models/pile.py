from typing import Dict, Optional

from games.common.models.game_component import GameComponent
from ..typing_hints import Card, PileId
from ..constants import MAX_CARDS


class Pile(GameComponent):
    def __init__(self, ascending: bool,
                 id_: PileId,
                 last_card: Optional[Card] = None,
                 last_added_turn: Optional[int] = None):
        self._ascending = ascending
        self._id = id_
        self._last_card = last_card
        self._last_added_turn = last_added_turn

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Pile':
        raise NotImplementedError('From frontend method is not implemented.')

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Pile':
        return Pile(ascending=json_data['ascending'],
                    id_=json_data['id'],
                    last_card=json_data['last_card'],
                    last_added_turn=json_data['last_added_turn'])

    def to_database(self) -> Dict:
        return {
            'ascending': self._ascending,
            'id': self.id,
            'last_card': self.last_card,
            'last_added_turn': self.last_added_turn,
        }

    def to_frontend(self, points: int = 0) -> Dict:
        return {
            'ascending': self._ascending,
            'id': self._id,
            'lastCard': self.last_card,
            'lastAddedTurn': self.last_added_turn,
        }

    def add_card(self, card: Card, turn: int):
        self._last_card = card
        self._last_added_turn = turn

    @property
    def last_card(self) -> Card:
        if self._last_card is None:
            if self._ascending:
                return 1
            else:
                return MAX_CARDS
        else:
            return self._last_card

    @property
    def last_added_turn(self) -> Card:
        if self._last_added_turn is None:
            return -1
        else:
            return self._last_added_turn

    @property
    def is_ascending(self) -> bool:
        return self._ascending

    @property
    def is_descending(self) -> bool:
        return not self._ascending

    @property
    def id(self) -> int:
        return self._id
