from random import randint
from typing import Dict, Optional


class Player:
    NAMED_PLAYS = ('Rock', 'Paper', 'Scissors', 'Lizard', 'Spock')

    def __init__(self, name: str, is_bot: bool = False,
                 last_play: Optional[int] = None,
                 current_play: Optional[int] = None,
                 play: Optional[int] = None,
                 last_played_round: int = -1,
                 is_active: bool = True):
        self.name = name
        self.is_bot = is_bot
        self.last_play = last_play
        self.current_play = current_play
        self.play = play
        self.last_played_round = last_played_round
        self.is_active = is_active

    @classmethod
    def from_database(cls, json_data: Dict) -> 'Player':
        # Todo implement. This method must return a game object using all the data in the input json data dict
        #  (assume all data is available).
        pass

    def to_database(self) -> Dict:
        # Todo implement. This method should return a dictionary with the json data needed in the
        #  `from_database` method.
        pass

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

    def to_frontend(self):
        return self.to_database()

    @property
    def points(self) -> int:
        return self.last_played_round + (1 if self.is_active else 0)
