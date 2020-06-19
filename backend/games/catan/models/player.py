from typing import Optional

from backend.games.common.models.player import Player as BasePlayer
from .materials_deck import MaterialsDeck
from .development_deck import DevelopmentDeck, DevelopmentType
from .land import LandType


class Player(BasePlayer):
    def __init__(self, name: str, color: str, materials_deck: Optional[MaterialsDeck] = None,
                 development_deck: Optional[DevelopmentDeck] = None):
        BasePlayer.__init__(self, name=name, is_bot=False)
        self.color = color

        self._materials_deck = MaterialsDeck() if materials_deck is None else materials_deck
        self._development_deck = DevelopmentDeck() if development_deck is None else development_deck

    def update_materials(self, material: LandType, number: int):
        self._materials_deck.update(material=material, number=number)

    def update_development(self, development_card: DevelopmentType, number: int):
        self._development_deck.update(development_card=development_card, number=number)

    # region material properties.
    @property
    def n_wood(self) -> int:
        return self._materials_deck.n_wood

    @property
    def n_sheep(self) -> int:
        return self._materials_deck.n_sheep

    @property
    def n_wheat(self) -> int:
        return self._materials_deck.n_wheat

    @property
    def n_brick(self) -> int:
        return self._materials_deck.n_brick

    @property
    def n_stone(self) -> int:
        return self._materials_deck.n_stone
    # endregion

    # region development_properties.
    @property
    def n_knight(self) -> int:
        return self._development_deck.n_knight

    @property
    def n_monopoly(self) -> int:
        return self._development_deck.n_monopoly

    @property
    def n_resources(self) -> int:
        return self._development_deck.n_resources

    @property
    def n_roads(self) -> int:
        return self._development_deck.n_roads

    @property
    def n_point(self) -> int:
        return self._development_deck.n_point
    # endregion
