from typing import Optional, Dict

from games.common.models.player import Player as BasePlayer
from .materials_deck import MaterialsDeck
from .development_deck import DevelopmentDeck, DevelopmentType
from .land import LandType


class Player(BasePlayer):
    def __init__(self, name: str, color: str, materials_deck: Optional[MaterialsDeck] = None,
                 development_deck: Optional[DevelopmentDeck] = None,
                 new_development_deck: Optional[DevelopmentDeck] = None,
                 dice_thrown: bool = False,
                 cards_discarded: bool = False,
                 n_played_knights: int = 0):
        BasePlayer.__init__(self, name=name, is_bot=False)
        self.color = color
        self.dice_thrown = dice_thrown
        self._cards_discarded = cards_discarded

        self._materials_deck = MaterialsDeck() if materials_deck is None else materials_deck
        self._development_deck = DevelopmentDeck() if development_deck is None else development_deck
        self._new_development_deck = DevelopmentDeck() if new_development_deck is None else new_development_deck
        self.n_played_knights = n_played_knights

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Player':
        return Player(name=json_data['name'], color=json_data['color'],
                      materials_deck=MaterialsDeck.from_json(json_data['materialsDeck']),
                      development_deck=DevelopmentDeck.from_json(json_data['developmentDeck']),
                      dice_thrown=json_data['diceThrown'],
                      cards_discarded=json_data['cardsDiscarded'],
                      n_played_knights=json_data['nPlayedKnights'])

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Player':
        return Player(name=json_data['name'], color=json_data['color'],
                      materials_deck=MaterialsDeck.from_json(json_data['materials_deck']),
                      development_deck=DevelopmentDeck.from_json(json_data['development_deck']),
                      new_development_deck=DevelopmentDeck.from_json(json_data['new_development_deck']),
                      dice_thrown=json_data['dice_thrown'],
                      cards_discarded=json_data['cards_discarded'],
                      n_played_knights=json_data['n_played_knights'])

    def to_database(self) -> Dict:
        return {
            'name': self.name,
            'color': self.color,
            'materials_deck': self._materials_deck.to_json(),
            'development_deck': self._development_deck.to_json(),
            'new_development_deck': self._new_development_deck.to_json(),
            'dice_thrown': self.dice_thrown,
            'cards_discarded': self.cards_discarded,
            'n_played_knights': self.n_played_knights,
        }

    def to_frontend(self, points: int = 0) -> Dict:
        development_deck = {}
        development_dict = self._development_deck.to_json()
        new_development_dict = self._new_development_deck.to_json()
        for land_type, number in development_dict.items():
            development_deck[land_type] = number + new_development_dict[land_type]

        return {
            'name': self.name,
            'color': self.color,
            'materialsDeck': self._materials_deck.to_json(),
            'developmentDeck': development_deck,
            'points': points,
            'diceThrown': self.dice_thrown,
            'cardsDiscarded': self.cards_discarded,
            'nPlayedKnights': self.n_played_knights,
        }

    @classmethod
    def from_reduced_json(cls, json_data: Dict[str, str]) -> 'Player':
        return Player(name=json_data['name'], color=json_data.get('color', 'black'))

    def to_reduced_json(self) -> Dict:
        return {
            'name': self.name,
            'color': self.color,
        }

    def get_random_material(self) -> Optional[LandType]:
        return self._materials_deck.get_random_material()

    def update_materials(self, material: LandType, number: int):
        self._materials_deck.update(material=material, number=number)

    def update_development(self, development_card: DevelopmentType, number: int):
        self._development_deck.update(development_card=development_card, number=number)

    def update_new_development(self, development_card: DevelopmentType, number: int):
        self._new_development_deck.update(development_card=development_card, number=number)

    def end_turn(self):
        new_development_deck = self._new_development_deck.to_json()
        self._development_deck = DevelopmentDeck(
            {
                development_type: n_existing + new_development_deck[development_type.value]
                for development_type, n_existing in self._development_deck.deck.items()
            }
        )
        self._new_development_deck = DevelopmentDeck()
        self.dice_thrown = False
        self.cards_discarded = False

    def get_bot_play(self, game):
        raise NotImplementedError('Bot for CATAN is still not implemented.')

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

    @property
    def n_materials(self) -> int:
        return self._materials_deck.n_materials

    @property
    def materials_deck(self) -> Dict[LandType, int]:
        return self._materials_deck.deck
    # endregion

    # region development_properties.
    @property
    def n_knight(self) -> int:
        return self._development_deck.n_knight + self._new_development_deck.n_knight

    @property
    def n_available_knight(self) -> int:
        return self._development_deck.n_knight

    @property
    def n_monopoly(self) -> int:
        return self._development_deck.n_monopoly + self._new_development_deck.n_monopoly

    @property
    def n_available_monopoly(self) -> int:
        return self._development_deck.n_monopoly

    @property
    def n_resources(self) -> int:
        return self._development_deck.n_resources + self._new_development_deck.n_resources

    @property
    def n_available_resources(self) -> int:
        return self._development_deck.n_resources

    @property
    def n_roads(self) -> int:
        return self._development_deck.n_roads + self._new_development_deck.n_roads

    @property
    def n_available_roads(self) -> int:
        return self._development_deck.n_roads

    @property
    def n_point(self) -> int:
        return self._development_deck.n_point + self._new_development_deck.n_point
    # endregion

    @property
    def cards_discarded(self) -> bool:
        if self.n_materials <= 7:
            self._cards_discarded = True
        return self._cards_discarded

    @cards_discarded.setter
    def cards_discarded(self, discarded: bool):
        self._cards_discarded = discarded
