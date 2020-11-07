import json
from random import shuffle
from typing import Dict, List, Optional, Union

import asyncpg

from games.common.models.game import Game as BaseGame
from .play import Play
from .player import Player
from ..typing_hints import CardID


class Game(BaseGame):

    def __init__(self, current_player_index: int,
                 player_list: List[Player],
                 id_: Optional[str] = None,
                 image_set: str = 'classic',
                 n_cards: int = 69,
                 total_points: int = 30,
                 card_description: Optional[str] = None,
                 played_cards: Optional[List[CardID]] = None):
        BaseGame.__init__(self,
                          current_player_index=current_player_index,
                          player_list=player_list,
                          play_list=[],
                          id_=id_)
        self._n_cards = n_cards
        self._image_set = image_set
        self._total_points = total_points
        self.card_description = card_description
        self._played_cards = [] if played_cards is None else played_cards[:]

    def get_player_score(self, player: Player) -> int:
        return player.points

    # region frontend conversion.
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Game':
        raise NotImplementedError('from fronted is not implemented.')

    def to_frontend(self, db: Optional[asyncpg.Connection] = None,
                    description: str = 'successfully obtained game.') -> Dict:
        has_ended = self.has_ended
        return {
            'currentPlayer': self.current_player_index,
            'playerList': [player.to_frontend() for player in self.player_list],
            'totalPoints': self._total_points,
            'cardDescription': self.card_description,
            'imageSet': self._image_set,
            'id': None if self.id is None else str(self.id),
            'description': description,
            'hasEnded': has_ended,
        }

    # endregion

    def to_display(self) -> Dict:
        return {
            'gameId': None if self.id is None else str(self.id),
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'currentPlayers': self.n_current,
            'totalPoints': self._total_points,
            'imageSet': self._image_set,
        }

    # region database conversion.
    @classmethod
    def from_database(cls, json_data: Dict) -> 'Game':
        players_list = [
            Player.from_database(json_data=player_data) for player_data in json.loads(json_data['player_list'])
        ]
        return Game(
            current_player_index=json_data.get('current_player_index', 0),
            player_list=players_list,
            id_=json_data['id'],
            n_cards=json_data['n_cards'],
            total_points=json_data['total_points'],
            image_set=json_data['image_set'],
            card_description=json_data['card_description'],
            played_cards=json.loads(json_data['played_cards'])
        )

    def to_database(self) -> Dict[str, Union[str, int, bool, Dict]]:
        return {
            'current_player_index': self.current_player_index,
            'player_list': json.dumps([player.to_database() for player in self.player_list]),
            'id': self.id,
            'n_cards': self._n_cards,
            'total_points': self._total_points,
            'image_set': self._image_set,
            'card_description': self.card_description,
            'played_cards': json.dumps(self._played_cards),
        }

    # endregion

    # region play processing.
    def add_play(self, play: Optional[Play]):
        if play is None:
            return

        play.update_game(self)

    def resolve_turn(self):
        # Assign points for getting correct story teller card.
        story_teller: Player = self.current_player
        story_teller_card = story_teller.played_card_id
        correct_choice_players = [player for player in self.player_list if player.chosen_card_id == story_teller_card]
        if len(correct_choice_players) in [0, self.n_players - 1]:
            # Add 2 points to every player but story-teller.
            for player in self.player_list:
                if player.name == story_teller.name:
                    continue
                player.points += 2
        else:
            # Add 3 points to story teller and to any player that has made the correct card choice.
            story_teller.points += 3
            for player in correct_choice_players:
                player.points += 2

        # Get points for incorrectly given card choices.
        for player in self.player_list:
            if player.name == story_teller.name:
                continue
            points = len([1 for p in self.player_list if p.chosen_card_id == player.played_card_id])
            player.points += points

    def end_turn(self):
        # Reset values to original values and add played cards to list of played cards.
        self.card_description = None

        for player in self.player_list:
            if player.played_card_id is not None:
                self._played_cards.append(player.played_card_id)

            player.played_card_id = None
            player.chosen_card_id = None

        # Check if there are enough new cards left to give them to players and if not reset played cards.
        remaining_cards = self.deck_cards
        if len(remaining_cards) < len(self.player_list):
            self._played_cards = []

        # Pick a new card for each player.
        remaining_cards = self.deck_cards
        shuffle(remaining_cards)
        for player in self.player_list:
            player.add_card_to_deck(remaining_cards.pop(0))

        # Update story teller player and end.
        self.update_player_index()

    @property
    def deck_cards(self) -> List[CardID]:
        unavailable_cards = self.players_cards + self._played_cards
        return [card_id for card_id in range(self._n_cards) if card_id not in unavailable_cards]

    @property
    def players_cards(self) -> List[CardID]:
        card_list: List[CardID] = []
        for player in self.player_list:
            card_list.extend(player.deck)
        return card_list

    @property
    def has_ended(self) -> bool:
        for player in self.player_list:
            if player.points >= self._total_points:
                return True

        return False
