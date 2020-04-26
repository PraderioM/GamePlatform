import json
from typing import Callable, Dict, List, Optional, Tuple, Union

import asyncpg

from .play import Play
from .player import Player


class Game:
    def __init__(self, rows: int, cols: int, current_player_index: int, gravity: bool,
                 play_list: List[Play], player_list: List[Player],
                 id_: Optional[str]):
        self.rows = rows
        self.cols = cols
        self.current_player_index = current_player_index
        self.gravity = gravity
        self.play_list = play_list[:]
        self.player_list = player_list[:]
        self.id = id_

    @classmethod
    def from_database(cls, json_data: Dict[str, Union[int, str, bool, Dict]]) -> 'Game':
        rows = json_data['rows']
        cols = json_data['cols']
        gravity = json_data['gravity']
        id_ = json_data['id']
        current_player_index = json_data['current_player_index']
        players_list = [Player.from_database(json_data=json_data) for json_data in json.loads(json_data['players'])]
        play_list = [Play.from_database(json_data=json_data,
                                        all_players=players_list) for json_data in json.loads(json_data['plays'])]
        return Game(rows=rows, cols=cols, current_player_index=current_player_index, gravity=gravity,
                    play_list=play_list, player_list=players_list, id_=id_)

    def to_database(self) -> Dict[str, Union[str, int, bool, Dict]]:
        return {
            'rows': self.rows,
            'cols': self.cols,
            'current_player_index': self.current_player_index,
            'gravity': self.gravity,
            'plays': json.dumps([play.to_database() for play in self.play_list]),
            'players': json.dumps([player.to_database() for player in self.player_list]),
            'id': self.id,
        }

    async def to_frontend(self, db: asyncpg.Connection,
                          description: str = 'successfully obtained game.') -> Dict[str, Union[str, int]]:
        return {
            'rows': self.rows,
            'cols': self.cols,
            'currentPlayer': self.current_player_index,
            'players': [player.to_frontend(token=await player.get_token(db=db),
                                           points=self.get_player_points(player)) for player in self.player_list],
            'plays': [play.to_frontend() for play in self.play_list],
            'id': None if self.id is None else str(self.id),
            'description': description,
        }

    def to_display(self) -> Dict[str, Union[str, int, bool]]:
        return {
            'gameId': None if self.id is None else str(self.id),
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'gravity': self.gravity,
            'currentPlayers': self.n_current,
            'rows': self.rows,
            'cols': self.cols,
        }

    def to_game_resolution(self, player: Optional[Player]) -> Dict[str, bool]:
        if player is None:
            return {'isObserver': True}

        all_points = sorted([self.get_player_points(p) for p in self.player_list], reverse=True)
        player_points = self.get_player_points(player)

        if player_points == all_points[0]:
            if player_points == all_points[1]:
                return {'isTie': True}
            else:
                return {'isVictorious': True}
        else:
            return {'isLoser': True}

    def resolution_points(self, player: Player):
        all_scores = [self.get_player_points(p) for p in self.player_list]
        player_score = self.get_player_points(player)
        above_players = len([score for score in all_scores if score > player_score])
        below_players = len([score for score in all_scores if score < player_score])

        return below_players - above_players

    def get_player_points(self, player: Player) -> int:
        # Get player plays.
        plays = [play for play in self.play_list if play.player == player]

        # Compute lengths of all formed rows.
        hor_lengths = self._get_row_lengths(plays[:], lambda row, col: (row, col+1))
        diag_lengths = self._get_row_lengths(plays[:], lambda row, col: (row+1, col+1))
        ver_lengths = self._get_row_lengths(plays[:], lambda row, col: (row+1, col))
        anti_diag_lengths = self._get_row_lengths(plays[:], lambda row, col: (row+1, col-1))

        # Join all lengths.
        all_lengths = hor_lengths + diag_lengths + ver_lengths + anti_diag_lengths

        # Points are computed for every row of plays as (row_length - 1)**2 and all results are added together
        if len(all_lengths) == 0:
            return 0
        else:
            return sum([(length - 1)**2 for length in all_lengths])

    def add_play(self, play: Optional[Play]):
        if play is None:
            return
        if play.player in self.player_list:
            if self.player_list.index(play.player) == self.current_player_index:
                self.play_list.append(play)
                self.update_player_index()

    def update_player_index(self):
        self.current_player_index = (self.current_player_index + 1) % len(self.player_list)

    def get_player_from_name(self, name: str) -> Optional[Player]:
        out_player: Optional[Player] = None
        for player in self.player_list:
            if player.name == name:
                out_player = player
        return out_player

    def current_player(self) -> Player:
        return self.player_list[self.current_player_index]

    def pre_process_play(self, play: Play) -> Optional[Play]:
        if self.gravity:
            return self._pre_process_play_with_gravity(play)
        else:
            return self._pre_process_play_without_gravity(play)

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

    @staticmethod
    def get_play_in_coords(row: int, col: int, play_list: List[Play]) -> Optional[Play]:
        for play in play_list:
            if play.row == row and play.col == col:
                return play
        return None

    def _get_row_lengths(self, play_list: List[Play],
                         get_next_coord_func: Callable[[int, int], Tuple[int, int]]) -> List[int]:
        length_list: List[int] = []
        for row in range(self.rows):
            for col in range(self.cols):
                current_play = Game.get_play_in_coords(row=row, col=col, play_list=play_list)
                if current_play is not None:
                    row_length, play_list = self._update_play_list(play=current_play,
                                                                   play_list=play_list[:],
                                                                   get_next_coord_func=get_next_coord_func)
                    length_list.append(row_length)
        return length_list

    @staticmethod
    def _update_play_list(play: Play, play_list: List[Play],
                          get_next_coord_func: Callable[[int, int], Tuple[int, int]]) -> Tuple[int, List[Play]]:
        row_length = 0
        while play is not None:
            play_list.remove(play)
            row_length += 1
            new_row, new_col = get_next_coord_func(play.row, play.col)
            play = Game.get_play_in_coords(row=new_row, col=new_col, play_list=play_list)

        return row_length, play_list

    def _pre_process_play_with_gravity(self, play: Play) -> Optional[Play]:
        occupied_rows = [existing_play.row for existing_play in self.play_list if existing_play.col == play.col]
        new_row = self.rows - 1 - len(occupied_rows)
        if new_row < 0:
            return None
        return Play(row=new_row, col=play.col, player=play.player)

    def _pre_process_play_without_gravity(self, play: Play) -> Optional[Play]:
        pos_occupied = False
        for existing_play in self.play_list:
            if play.row == existing_play.row and play.col == existing_play.col:
                pos_occupied = True
                break

        if pos_occupied:
            return None
        return play

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
    def n_missing(self) -> int:
        return self.n_players - self.n_current

    @property
    def has_ended(self) -> bool:
        return len(self.play_list) >= self.rows * self.cols

