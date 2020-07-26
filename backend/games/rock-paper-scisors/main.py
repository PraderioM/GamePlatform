import enum
import os
from random import randint
from typing import List, Tuple


class VictoryCriterion(enum.Enum):
    BY_PLAY = 0
    BY_PLAYER = 1


class Player:
    def __init__(self, name: str, is_bot: bool = False):
        self.name = name
        self.is_bot = is_bot

    def make_play(self, n_plays: int) -> int:
        if self.is_bot:
            return randint(1, n_plays)
        else:
            self.ask_human_play(n_plays=n_plays)

    def ask_human_play(self, n_plays: int) -> int:
        # Todo do stuff.
        return 1


class Game:
    def __init__(self, players: List[Player], n_plays: int = 3,
                 victory_criterion: VictoryCriterion = VictoryCriterion.BY_PLAY):
        assert n_plays % 2 == 1
        assert n_plays >= 3
        assert len(players) >= 2
        self._players = players[:]
        self.n_plays = n_plays
        self.victory_criterion = victory_criterion

    @classmethod
    def from_cli_inputs(cls) -> 'Game':
        human_players = cls.ask_human_players()
        bots = cls.ask_bot_players()
        n_plays = cls.ask_n_plays()
        victory_criterion = cls.ask_victory_criterion()
        return Game(players=human_players + bots, n_plays=n_plays, victory_criterion=victory_criterion)

    def play(self):
        while len(self._players) > 1:
            winner_players = self.play_round()
            self._players = winner_players

        print(f'The winner is {self._players[0].name}.')

    def play_round(self) -> List[Player]:
        play_list = [(player, player.make_play(n_plays=self.n_plays)) for player in self._players]
        return self._get_winner_players(play_list)

    @staticmethod
    def ask_human_players() -> List[Player]:
        # Todo do stuff.
        return []

    @staticmethod
    def ask_bot_players() -> List[Player]:
        # Todo do stuff.
        return []

    @staticmethod
    def ask_n_plays() -> int:
        # Todo do stuff.
        return 3

    @staticmethod
    def ask_victory_criterion() -> VictoryCriterion:
        # Todo do stuff.
        return VictoryCriterion.BY_PLAY

    @property
    def players(self) -> List[Player]:
        return self._players[:]

    def _get_winner_players(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        # Todo do stuff.
        return [play_list[0][0]]


if __name__ == '__main__':
    game = Game.from_cli_inputs()
    game.play()
