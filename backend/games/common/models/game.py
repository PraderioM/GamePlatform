import abc
import asyncpg
import json
from random import shuffle
from typing import Dict, List, Optional

from .game_component import GameComponent
from .play import Play
from .player import Player


class Game(GameComponent):
    def __init__(self, current_player_index: int,
                 play_list: List[Play], player_list: List[Player],
                 id_: Optional[str]):
        self.current_player_index = current_player_index
        self.play_list = play_list[:]
        self.player_list = player_list[:]
        self.id = id_

    def to_database(self) -> Dict:
        return {
            'current_player_index': self.current_player_index,
            'plays': json.dumps([play.to_database() for play in self.play_list]),
            'players': json.dumps([player.to_database() for player in self.player_list]),
            'id': self.id,
        }

    @abc.abstractmethod
    def to_display(self) -> Dict:
        raise NotImplementedError('Sub-classes must implement to frontend method.')

    @abc.abstractmethod
    def to_frontend(self, db: Optional[asyncpg.Connection] = None, *args, **kwargs) -> Dict:
        raise NotImplementedError('Sub-classes must implement to frontend method.')

    @abc.abstractmethod
    def get_player_score(self, player: Player) -> int:
        raise NotImplementedError('Sub-classes must implement get player points method.')

    def to_game_resolution(self, player: Optional[Player]) -> Dict[str, bool]:
        if player is None:
            return {'isObserver': True}

        scores_dict = self.get_all_player_scores()
        sorted_scores = sorted([score for _, score in scores_dict.items()], reverse=True)
        player_score = scores_dict[player.name]

        if player_score == sorted_scores[0]:
            if player_score == sorted_scores[1]:
                return {'isTie': True}
            else:
                return {'isVictorious': True}
        else:
            return {'isLoser': True}

    def get_all_player_scores(self) -> Dict[str, int]:
        return {player.name: self.get_player_score(player) for player in self.player_list}

    def resolution_points(self, player: Player):
        scores_dict = self.get_all_player_scores()
        sorted_scores = sorted([score for _, score in scores_dict.items()], reverse=True)
        player_score = scores_dict[player.name]
        above_players = len([score for score in sorted_scores if score > player_score])
        below_players = len([score for score in sorted_scores if score < player_score])

        return below_players - above_players

    def add_play(self, play: Optional[Play]):
        if play is None:
            return
        if play.player in self.player_list:
            if self.player_list.index(play.player) == self.current_player_index:
                self.play_list.append(play)
                self.update_player_index()

    def update_player_index(self):
        self.current_player_index = (self.current_player_index + 1) % len(self.player_list)

    def get_player_by_name(self, name: str) -> Optional[Player]:
        for player in self.player_list:
            if player.name == name:
                return player
        return None

    def add_new_player_name(self, name: str):
        # Cannot add twice the same player.
        for player in self.player_list:
            if player.name == name:
                return

        if self.n_missing > 0:
            player_list = self.player_list[:]
            # Make player position random.
            shuffle(player_list)
            for player in player_list:
                if player.name is None and not player.is_bot:
                    player.name = name
                    break

    def is_winner_points(self, resolution_points: int) -> bool:
        return resolution_points == len(self.player_list) - 1

    @property
    def n_bots(self) -> int:
        return len([player for player in self.player_list if player.is_bot])

    @property
    def n_players(self) -> int:
        return len([player for player in self.player_list if not player.is_bot])

    @property
    def n_current(self) -> int:
        return len([player for player in self.player_list if player.name is not None and not player.is_bot])

    @property
    def current_player(self) -> Player:
        return self.player_list[self.current_player_index]

    @property
    def n_missing(self) -> int:
        return self.n_players - self.n_current

    @property
    @abc.abstractmethod
    def has_ended(self) -> bool:
        raise NotImplementedError('Sub-classes must implement `has_ended` property')
