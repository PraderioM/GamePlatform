from copy import deepcopy
import enum
from random import choice
from typing import Dict, Optional, Union


class DevelopmentType(enum.Enum):
    KNIGHT = 0
    MONOPOLY = 1
    RESOURCES = 2
    ROADS = 3
    POINT = 4


class DevelopmentDeck:
    def __init__(self, cards_dict: Optional[Dict[DevelopmentType, int]] = None):
        self._deck = self.get_empty_deck() if cards_dict is None else cards_dict

    @classmethod
    def from_json(cls, json_data: Dict[Union[int, str], int]) -> 'DevelopmentDeck':
        json_data = {int(key): val for key, val in json_data.items()}
        return DevelopmentDeck(
            {
                development_type: json_data[development_type.value] for development_type in DevelopmentType
            }
        )

    def update(self, development_card: DevelopmentType, number: int):
        self._deck[development_card] += number

    @staticmethod
    def get_empty_deck() -> Dict[DevelopmentType, int]:
        return {development_type: 0 for development_type in DevelopmentType}

    def get_random_card(self) -> Optional[DevelopmentType]:
        deck = []
        for development_type, available_number in self._deck.items():
            deck.extend([development_type] * available_number)

        if len(deck) == 0:
            return None

        out_type = choice(deck)
        self._deck[out_type] -= 1

        return out_type

    @property
    def n_knight(self) -> int:
        return self._deck[DevelopmentType.KNIGHT]

    @property
    def n_monopoly(self) -> int:
        return self._deck[DevelopmentType.MONOPOLY]

    @property
    def n_resources(self) -> int:
        return self._deck[DevelopmentType.RESOURCES]

    @property
    def n_roads(self) -> int:
        return self._deck[DevelopmentType.ROADS]

    @property
    def n_point(self) -> int:
        return self._deck[DevelopmentType.POINT]

    @property
    def n_cards(self) -> int:
        return self.n_knight + self.n_monopoly + self.n_resources + self.n_roads + self.n_point

    @property
    def deck(self) -> Dict[DevelopmentType, int]:
        return deepcopy(self._deck)

    def to_json(self) -> Dict[int, int]:
        return {development_type.value: n_developments for development_type, n_developments in self._deck.items()}
