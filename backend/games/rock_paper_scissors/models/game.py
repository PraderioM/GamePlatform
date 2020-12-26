import json
from typing import List, Optional, Tuple, Dict

import asyncpg

from ..models.play_mode import PlayMode
from ..models.vidtory_criterion import VictoryCriterion
from ..models.player import Player
from ..models.play import Play


class Game:
    def __init__(self, player_list: List[Player], n_plays: int = 3,
                 victory_criterion: VictoryCriterion = VictoryCriterion.BY_PLAY,
                 play_mode: PlayMode = PlayMode.CLASSIC,
                 total_points: Optional[int] = None,
                 current_round: int = 0,
                 id_: Optional[str] = None,
                 n_actions: int = 1):
        assert n_plays % 2 == 1, 'Number of plays must be odd.'
        assert n_plays >= 3, f'Number of plays must be at least 3 but got {n_plays}'
        assert len(player_list) >= 2, f'Number of players must be at least 2 but got {len(player_list)}'
        assert isinstance(victory_criterion, VictoryCriterion)
        assert isinstance(play_mode, PlayMode)
        if victory_criterion == VictoryCriterion.BY_POINTS:
            error_msg = f'total points must be specified when victory criterion is {victory_criterion.name}'
            assert total_points is not None, error_msg
            assert total_points > 0, f'total points must be strictly positive. However got `{total_points}`.'

        self.player_list = player_list[:]
        self.id = id_
        self.n_plays = n_plays
        self.current_round = current_round
        self.play_mode = play_mode
        self._total_points = total_points
        self._victory_criterion = victory_criterion
        self._n_actions = n_actions

    @classmethod
    def from_database(cls, json_data: Dict) -> 'Game':
        return Game(
            player_list=[Player.from_database(player_data) for player_data in json.loads(json_data['player_list'])],
            n_plays=json_data['n_plays'],
            victory_criterion=VictoryCriterion.from_name(json_data['victory_criterion']),
            play_mode=PlayMode.from_name(json_data['play_mode']),
            total_points=json_data['total_points'],
            current_round=json_data['current_round'],
            id_=json_data['id'],
            n_actions=json_data['n_actions'],
        )

    def to_database(self) -> Dict:
        return {
            'player_list': json.dumps([player.to_database() for player in self.player_list]),
            'n_plays': self.n_plays,
            'victory_criterion': self.victory_criterion.name,
            'play_mode': self.play_mode.name,
            'total_points': self.total_points,
            'current_round': self.current_round,
            'id': self.id,
            'n_actions': self._n_actions,
        }

    def to_frontend(self, db: asyncpg.Connection):
        return {
            'playerList': [player.to_frontend() for player in self.player_list],
            'nPlays': self.n_plays,
            'victoryCriterion': self.victory_criterion.name,
            'playMode': self.play_mode.name,
            'hasEnded': self.has_ended,
            'totalPoints': self.total_points,
            'currentRound': self.current_round,
            'id': str(self.id),
            'n_actions': self._n_actions,
        }

    def to_game_resolution(self, player: Player) -> Dict:
        if player is None:
            return {'isObserver': True}

        current_player = self.get_player_by_name(player.name)

        sorted_scores = sorted(
            [
                player.points
                for player in self.player_list
            ],
            reverse=True
        )

        player_score = current_player.points

        if player_score == sorted_scores[0]:
            if player_score == sorted_scores[1]:
                return {'isTie': True}
            else:
                return {'isVictorious': True}
        else:
            return {'isLoser': True}

    def is_winner_points(self, resolution_points: int) -> bool:
        return resolution_points == len(self.player_list) - 1

    def to_display(self) -> Dict:
        return {
            'gameId': None if self.id is None else str(self.id),
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'currentPlayers': self.n_registered_players,
            'nPlays': self.n_plays,
            'victoryCriterion': self.victory_criterion.name,
            'playMode': self.play_mode.name,
        }

    def play_round(self):
        play_list = [
            (player, player.get_bot_play(self.n_plays) if player.is_bot else player.current_play)
            for player in self.active_players
        ]
        winner_players = self._get_winner_players(play_list)
        winner_player_names = [player.name for player in winner_players]

        # Players who lose must be removed from the list of active players.
        for player in self.active_players:
            if player.name not in winner_player_names:
                player.is_active = False

        # Update round at the end of every round.
        self.current_round += 1

    def resolution_points(self, player: Player) -> int:
        player = self.get_player_by_name(player.name)
        return player.last_played_round

    def add_play(self, play: Play):
        player = self.get_player_by_name(play.player.name)

        # Do not update if player is not playing.
        if player is None or not player.is_active or player.last_played_round == self.current_round:
            self.update_n_actions()
            return

        # Update player data if player exists.
        player.last_play = player.current_play
        player.modifier = play.modifier
        player.current_play = play.play
        player.last_played_round = self.current_round

        # If all active players have made their play we can play the current round.
        for player in self.active_players:
            if player.is_bot:
                continue
            elif player.last_played_round < self.current_round:
                self.update_n_actions()
                return

        self.play_round()
        self.update_n_actions()

    def add_new_player_name(self, name: str):
        # Cannot add twice the same player.
        for player in self.player_list:
            if player.name == name:
                return

        if self.n_missing > 0:
            for player in self.player_list:
                if player.name is None and not player.is_bot:
                    player.name = name
                    break

    def get_player_by_name(self, name: str) -> Optional[Player]:
        for player in self.player_list:
            if player.name == name:
                return player

    def _get_winner_players(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        if self.victory_criterion == VictoryCriterion.BY_PLAY:
            return self._get_winner_players_by_play(play_list=play_list)
        elif self.victory_criterion == VictoryCriterion.BY_PLAYER:
            return self._get_winner_players_by_players(play_list=play_list)
        elif self.victory_criterion == VictoryCriterion.BY_POINTS:
            return self._get_winner_players_by_points(play_list=play_list)
        else:
            raise NotImplementedError(f'Winners selection for victory criterion {self.victory_criterion} '
                                      f'is not yet implemented.')

    def _get_winner_players_by_play(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        # Todo modify in order to apply play mode SMBC.
        scores = []
        set_of_plays = set()
        # Creating a set of plays, with no repeated plays.
        for i, (player_1, play_1) in enumerate(play_list):
            set_of_plays.add(play_1)
        iterable_set_of_plays = list(set_of_plays)
        # Comparing each player's play to the set of non repeated plays.
        for i, (player_1, play_1) in enumerate(play_list):
            score = 0
            for j in iterable_set_of_plays:
                if play_1 == j:
                    continue
                elif self.first_wins_second(play_1, j):
                    score += 1
                elif self.first_wins_second(j, play_1):
                    score -= 1
            scores.append(score)
        # Take highest score.
        max_score = max(scores)
        # Take players which have max_score.
        return [player for (player, _), score in zip(play_list, scores) if score == max_score]

    def _get_winner_players_by_players(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        # Todo modify in order to apply play mode SMBC.
        scores = []
        for i, (player_1, play_1) in enumerate(play_list):
            score = 0
            for j, (player_2, play_2) in enumerate(play_list):
                if i == j:
                    continue
                elif play_1 == play_2:
                    continue
                elif self.first_wins_second(play_1, play_2):
                    score += 1
                elif self.first_wins_second(play_2, play_1):
                    score -= 1
            scores.append(score)
        # Take highest score
        max_score = max(scores)
        # Take players which have max_score
        return [player for (player, _), score in zip(play_list, scores) if score == max_score]

    def _get_winner_players_by_points(self, play_list) -> List[Player]:
        # Todo implement. this should modify players adding points and, in case some of them have surpassed the total
        #  points threshold, remove them all players except the ones with highest score.
        pass

    def are_players_ready(self):
        return len([player for player in self.active_players if player.last_played_round == self.current_round]) == 0

    def update_n_actions(self):
        self._n_actions += 1

    @property
    def victory_criterion(self) -> VictoryCriterion:
        return self._victory_criterion

    @property
    def active_players(self) -> List[Player]:
        return [player for player in self.player_list if player.is_active]

    @property
    def bot_players(self) -> List[Player]:
        return [player for player in self.player_list if player.is_bot]

    @property
    def registered_players(self) -> List[Player]:
        return [player for player in self.player_list if player.name is not None or player.is_bot]

    @property
    def n_players(self) -> int:
        return len(self.player_list)

    @property
    def n_bots(self) -> int:
        return len(self.bot_players)

    @property
    def n_active_players(self) -> int:
        return len(self.active_players)

    @property
    def n_registered_players(self) -> int:
        return len(self.registered_players)

    @property
    def n_missing(self) -> int:
        return self.n_players - self.n_registered_players

    @property
    def has_ended(self) -> bool:
        return self.n_active_players == 1

    @property
    def n_actions(self):
        return self._n_actions

    @property
    def total_points(self) -> Optional[int]:
        return self._total_points if self.victory_criterion == VictoryCriterion.BY_POINTS else None

    @staticmethod
    def first_wins_second(first_play: int, second_play: int) -> bool:
        if first_play > second_play and first_play % 2 == 1 and second_play % 2 == 1:
            first_wins = False
        elif first_play < second_play and first_play % 2 == 1 and second_play % 2 == 0:
            first_wins = False
        elif first_play > second_play and first_play % 2 == 0 and second_play % 2 == 0:
            first_wins = False
        elif first_play < second_play and first_play % 2 == 0 and second_play % 2 == 1:
            first_wins = False
        else:
            first_wins = True

        return first_wins
