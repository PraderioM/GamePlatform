from random import randint
from typing import Dict, Optional

from .modifier import Modifier


class Player:
    NAMED_PLAYS = ('Rock', 'Paper', 'Scissors', 'Lizard', 'Spock')

    def __init__(self, name: str, is_bot: bool = False,
                 last_play: Optional[int] = None,
                 current_play: Optional[int] = None,
                 modifier: Optional[Modifier] = None,
                 points: Optional[int] = 0,
                 imaginary_points: int = 0,
                 last_played_round: int = -1,
                 is_active: bool = True):
        self.name = name
        self.is_bot = is_bot
        self.last_play = last_play
        self._modifier = modifier
        self._points = points
        self.imaginary_points = imaginary_points
        self.current_play = current_play
        self.last_played_round = last_played_round
        self.is_active = is_active

    @classmethod
    def from_database(cls, json_data: Dict) -> 'Player':
        return Player(
            name=json_data['name'],
            is_bot=json_data['is_bot'],
            last_play=json_data['last_play'],
            current_play=json_data['current_play'],
            modifier=Modifier.from_name(json_data.get('modifier', 'clone')),
            points=json_data['points'],
            imaginary_points=json_data['imaginary_points'],
            last_played_round=json_data['last_played_round'],
            is_active=json_data['is_active']
        )

    def to_database(self) -> Dict:
        return {
            'name': self.name,
            'is_bot': self.is_bot,
            'last_play': self.last_play,
            'current_play': self.current_play,
            'modifier': self.modifier.name,
            'points': self._points,
            'imaginary_points': self.imaginary_points,
            'last_played_round': self.last_played_round,
            'is_active': self.is_active
        }

    def to_frontend(self):
        return {
            'isBot': self.is_bot,
            'isActive': self.is_active,
            'points': self.points,
            'imaginaryPoints': self.imaginary_points,
            'name': self.name,
            'lastPlay': self.last_play,
            'currentPlay': self.current_play,
            'lastPlayedRound': self.last_played_round,
        }

    @staticmethod
    def get_bot_play(n_plays: int) -> int:
        return randint(1, n_plays)

    def ask_human_play(self, n_plays: int) -> int:
        # Define message for asking input.
        input_message = f'What play do you wish to make, {self.name}?'
        named_plays = self.NAMED_PLAYS
        for play_number in range(n_plays):
            play_name = f'play_{play_number + 1}' if play_number >= len(named_plays) else named_plays[play_number]
            input_message += f'\n\t{play_number + 1}) {play_name}'

        input_message += '\n'

        # Ask play until input is correct.
        while True:
            selected_play_str = input(input_message)

            # Check if input is correct.
            if not selected_play_str.isnumeric():
                print(f'Play must be an integer but got `{selected_play_str}`')
                continue

            selected_play = int(selected_play_str)
            if selected_play < 1 or selected_play > n_plays:
                print(f'{self.name}, you troll...'
                      f'Please select one of the possible options.')
                continue

            print('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
            return selected_play

    @property
    def points(self) -> int:
        if self._points is None:
            return self.last_played_round + (1 if self.is_active else 0)
        else:
            return self._points

    @points.setter
    def points(self, val: int):
        self._points = val

    @property
    def modifier(self) -> Modifier:
        if self._modifier is None:
            return Modifier.CLONE
        else:
            return self._modifier

    @modifier.setter
    def modifier(self, mod: Optional[Modifier]):
        self._modifier = mod
