from copy import deepcopy
from typing import Dict, Optional, Union

from .land import LandType


class MaterialsDeck:
    def __init__(self, cards_dict: Optional[Dict[Union[LandType, int], int]] = None):
        self._deck = self.get_empty_deck() if cards_dict is None else cards_dict

    @classmethod
    def from_json(cls, json_data: Dict[Union[int, str], int]) -> 'MaterialsDeck':
        json_data = {int(key): val for key, val in json_data.items()}
        return MaterialsDeck(
            {
                land_type: json_data[land_type.value] for land_type in LandType
            }
        )

    def update(self, material: LandType, number: int):
        print(self._deck)
        print(material)
        self._deck[material] += number

    @staticmethod
    def get_empty_deck() -> Dict[LandType, int]:
        return {land_type: 0 for land_type in LandType}

    @property
    def n_wood(self) -> int:
        return self._deck[LandType.Wood]

    @property
    def n_sheep(self) -> int:
        return self._deck[LandType.Sheep]

    @property
    def n_wheat(self) -> int:
        return self._deck[LandType.Wheat]

    @property
    def n_brick(self) -> int:
        return self._deck[LandType.Brick]

    @property
    def n_stone(self) -> int:
        return self._deck[LandType.Stone]

    @property
    def n_materials(self) -> int:
        return self.n_wood + self.n_sheep + self.n_wheat + self.n_brick + self.n_stone

    @property
    def deck(self) -> Dict[LandType, int]:
        return deepcopy(self._deck)

    def to_json(self) -> Dict[int, int]:
        return {land_type.value: n_materials for land_type, n_materials in self._deck.items()}
