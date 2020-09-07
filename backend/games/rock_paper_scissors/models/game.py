from typing import List, Optional, Tuple, Dict


from backend.games.rock_paper_scissors.models.vidtory_criterion import VictoryCriterion
from backend.games.rock_paper_scissors.models.player import Player


class Game:
    def __init__(self, player_list: List[Player], n_plays: int = 3,
                 victory_criterion: VictoryCriterion = VictoryCriterion.BY_PLAY,
                 current_round: int = 0,
                 id_: Optional[str] = None):
        assert n_plays % 2 == 1, 'Number of plays must be odd.'
        assert n_plays >= 3, f'Number of plays must be at least 3 but got {n_plays}'
        assert len(player_list) >= 2, f'Number of players must be at least 2 but got {len(player_list)}'
        assert isinstance(victory_criterion, VictoryCriterion)

        self.player_list = player_list[:]
        self.id = id_
        self.n_plays = n_plays
        self.current_round = current_round
        self._victory_criterion = victory_criterion

    @classmethod
    def from_database(cls, json_data: Dict) -> 'Game':
        # Todo implement. This method must return a game object using all the data in the input json data dict
        #  (assume all data is available).
        pass

    def to_database(self) -> Dict:
        # Todo implement. This method should return a dictionary with the json data needed in the
        #  `from_database` method.
        pass

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
            'game_id': None if self.id is None else str(self.id),
            'n_players': self.n_players,
            'n_bots': self.n_bots,
            'n_registered': self.n_registered_players,
            'n_plays': self.n_plays,
            'victory_criterion': self.victory_criterion.name,
        }

    def play_round(self):
        play_list = [
            (player, player.get_bot_play(self.n_plays) if player.is_bot else player.last_play)
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

    def add_play(self, play):
        player = self.get_player_by_name(play.player.name)

        # Do not update if player is not playing.
        if player is None or not player.is_active or player.last_played_round == self.current_round:
            return

        # Update player data if player exists.
        player.last_play = play.play
        player.last_played_round = self.current_round

        # If all active players have made their play we can play the current round.
        for player in self.active_players:
            if player.is_bot:
                continue
            elif player.last_played_round < self.current_round:
                return

        self.play_round()

    def add_new_player_name(self, name: str):
        for player in self.player_list:
            if player.is_bot or player.name is not None:
                continue

            player.name = name

    def get_player_by_name(self, name: str) -> Optional[Player]:
        for player in self.player_list:
            if player.name == name:
                return player

    def _get_winner_players(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
        if self.victory_criterion == VictoryCriterion.BY_PLAY:
            return self._get_winner_players_by_play(play_list=play_list)
        elif self.victory_criterion == VictoryCriterion.BY_PLAYER:
            return self._get_winner_players_by_players(play_list=play_list)
        else:
            raise NotImplementedError(f'Winners selection for victory criterion {self.victory_criterion} '
                                      f'is not yet implemented.')

    def _get_winner_players_by_play(self, play_list: List[Tuple[Player, int]]) -> List[Player]:
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

    def are_players_ready(self):
        return len([player for player in self.active_players if player.last_played_round == self.current_round]) == 0

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
    def n_missing_players(self) -> int:
        return self.n_players - self.n_registered_players

    @property
    def has_ended(self) -> bool:
        return self.n_active_players == 1

    def to_frontend(self):
        return self.to_database()

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
