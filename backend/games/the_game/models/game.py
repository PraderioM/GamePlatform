import json
from random import choice
from typing import Dict, List, Optional, Union

import asyncpg

from games.common.models.game import Game as BaseGame
from .play import Play
from .player import Player
from .pile import Pile
from ..constants import MAX_CARDS, ON_FIRE_CARDS, ON_FIRE_LIFE
from ..typing_hints import PileId, Card


class Game(BaseGame):

    def __init__(self,
                 player_list: List[Player],
                 pile_list: List[Pile],
                 id_: Optional[str] = None,
                 remaining_cards: Optional[List[Card]] = None,
                 current_player_index: Optional[int] = None,
                 on_fire: bool = False,
                 turn: int = 0,
                 deck_size: int = 6,
                 min_to_play_cards: int = 2):
        BaseGame.__init__(self,
                          current_player_index=current_player_index,
                          player_list=player_list,
                          play_list=[],
                          id_=id_)
        self._pile_list = pile_list[:]
        self._remaining_cards = [i for i in range(2, MAX_CARDS)] if remaining_cards is None else remaining_cards[:]
        self._on_fire = on_fire
        self.turn = turn
        self._deck_size = deck_size
        self._min_to_play_cards = min_to_play_cards

    def get_player_score(self, player: Player) -> int:
        return 1 if self.n_non_placed_cards == 0 else 0

    # region frontend conversion.
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Game':
        raise NotImplementedError('from fronted is not implemented.')

    def to_frontend(self, db: Optional[asyncpg.Connection] = None,
                    description: str = 'successfully obtained game.') -> Dict:
        return {
            'playerList': [player.to_frontend() for player in self.player_list],
            'pileList': [pile.to_frontend() for pile in self._pile_list],
            'remainingCards': self._remaining_cards,
            'currentPlayer': self.current_player_index,
            'onFire': self._on_fire,
            'turn': self.turn,
            'deckSize': self._deck_size,
            'minToPlayCards': self._min_to_play_cards,
            'hasEnded': self.has_ended,
            'description': description,
            'id': None if self.id is None else str(self.id),
        }

    # endregion

    def to_display(self) -> Dict:
        return {
            'gameId': None if self.id is None else str(self.id),
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'currentPlayers': self.n_current,
            'onFire': self._on_fire,
            'minToPlayCards': self._min_to_play_cards,
            'deckSize': self._deck_size,
        }

    # region database conversion.
    @classmethod
    def from_database(cls, json_data: Dict) -> 'Game':
        players_list = [
            Player.from_database(json_data=player_data) for player_data in json.loads(json_data['player_list'])
        ]
        pile_list = [
            Pile.from_database(json_data=pile_data) for pile_data in json.loads(json_data['pile_list'])
        ]
        return Game(
            player_list=players_list,
            pile_list=pile_list,
            id_=json_data['id'],
            remaining_cards=json.loads(json_data['remaining_cards']),
            current_player_index=json_data.get('current_player_index', None),
            on_fire=json_data['on_fire'],
            turn=json_data['turn'],
            deck_size=json_data['deck_size'],
            min_to_play_cards=json_data['min_to_play_cards']
        )

    def to_database(self) -> Dict[str, Union[str, int, bool, Dict]]:
        return {
            'player_list': json.dumps([player.to_database() for player in self.player_list]),
            'pile_list': json.dumps([pile.to_database() for pile in self._pile_list]),
            'id': self.id,
            'remaining_cards': json.dumps(self._remaining_cards),
            'current_player_index': self.current_player_index,
            'on_fire': self._on_fire,
            'turn': self.turn,
            'deck_size': self._deck_size,
            'min_to_play_cards': self._min_to_play_cards,
        }

    # endregion

    # region play processing.
    def add_play(self, play: Optional[Play]):
        if play is None:
            return

        play.update_game(self)

    def set_current_player(self, player: Player):
        player_index = 0
        for list_player in self.player_list:
            if player.name == list_player.name:
                self.current_player_index = player_index

            player_index += 1

    def get_pile(self, pile_id: PileId):
        for pile in self._pile_list:
            if pile.id == pile_id:
                return pile

    def reset_pile_reservation(self, pile_id: PileId):
        for player in self.player_list:
            player.reset_pile_reservation(pile_id)

    def update_turn(self):
        self.turn += 1

        self.update_player_index()
        current_player: Player = self.current_player
        while current_player.n_cards == 0:
            self.update_player_index()
            current_player: Player = self.current_player

    def refill_player_deck(self, name: str):
        player: Player = self.get_player_by_name(name)

        # Add all possible cards needed to refill player.
        while self.n_remaining_cards > 0 and player.n_cards < self._deck_size:
            card = choice(self._remaining_cards)
            self._remaining_cards.remove(card)
            player.add_card_to_deck(card)

        player.reset_original_deck_length()

    # endregion.

    @property
    def n_non_placed_cards(self) -> int:
        n = len(self._remaining_cards)
        for player in self.player_list:
            n += player.n_cards

        return n

    @property
    def has_ended(self) -> bool:
        # Game cannot end before it starts.
        if self.current_player_index is None:
            return False

        # Game ends if there are no cards left.
        if self.n_non_placed_cards == 0:
            return True

        # If there are still cards left then game hasn't ended if current player can still play.
        current_player: Player = self.current_player
        # Check card by card and pile by pile if any card can be played in any pile.
        for player_card in current_player.deck:
            for pile in self._pile_list:
                last_pile_card = pile.last_card

                # Cards can be played in ascending piles if they are greater or exactly 10 values lower.
                if pile.is_ascending:
                    if player_card > last_pile_card or player_card == last_pile_card - 10:
                        return False
                # Cards can be played in descending piles if they are lower or exactly 10 values greater.
                else:
                    if player_card < last_pile_card or player_card == last_pile_card + 10:
                        return False

        # If current player cannot play any card then game has ended if and only if player cannot skip turn.
        # That is if either the player hasn't played the minimum required amount or there are uncovered on fire cards.
        played_cards = current_player.original_deck_length - current_player.n_cards
        if self._min_to_play_cards < played_cards or (self.n_remaining_cards == 0 and played_cards > 0):
            if self._on_fire:
                for pile in self._pile_list:
                    last_pile_card = pile.last_card
                    if last_pile_card in ON_FIRE_CARDS:
                        if self.turn - pile.last_added_turn >= ON_FIRE_LIFE:
                            return True
            return False

        return True

    @property
    def pile_list(self) -> List[Pile]:
        return self._pile_list[:]

    @property
    def n_remaining_cards(self) -> int:
        return len(self._remaining_cards)
