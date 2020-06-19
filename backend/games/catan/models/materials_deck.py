from typing import Dict, Optional

from .land import LandType


class MaterialsDeck:
    def __init__(self, cards_dict: Optional[Dict[LandType, int]] = None):
        self._deck = self.get_empty_deck() if cards_dict is None else cards_dict

    def update(self, material: LandType, number: int):
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
