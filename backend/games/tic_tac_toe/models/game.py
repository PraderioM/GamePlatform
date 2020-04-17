from typing import Dict, List, Optional, Union

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
        gravity = json_data['cols']
        id_ = json_data['id']
        current_player_index = json_data['current_player_index']
        players_list = [Player.from_database(json_data=json_data) for json_data in json_data['players']]
        play_list = [Play.from_database(json_data=json_data,
                                        all_players=players_list) for json_data in json_data['plays']]
        return Game(rows=rows, cols=cols, current_player_index=current_player_index, gravity=gravity,
                    play_list=play_list, player_list=players_list, id_=id_)

    def to_database(self) -> Dict[str, Union[str, int, bool, Dict]]:
        return {
            'rows': self.rows,
            'cols': self.cols,
            'current_player_index': self.current_player_index,
            'gravity': self.gravity,
            'play_list': [play.to_database() for play in self.play_list],
            'player_list': [player.to_database() for player in self.player_list],
            'id': self.id,
        }

    async def to_frontend(self, db: asyncpg.Connection,
                          description: str = 'successfully obtained game.') -> Dict[str, Union[str, int]]:
        return {
            'rows': self.rows,
            'cols': self.cols,
            'currentPlayer': self.current_player_index,
            'players': [player.to_frontend(await player.get_token(db=db)) for player in self.player_list],
            'plays': [play.to_frontend() for play in self.play_list],
            'id': self.id,
            'description': description,
        }

    def to_display(self) -> Dict[str, Union[str, int, bool]]:
        return {
            'gameId': self.id,
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'gravity': self.gravity,
            'currentPlayers': self.n_current,
            'rows': self.rows,
            'cols': self.cols,
        }

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
        if self.n_missing > 0:
            for player in self.player_list:
                if not player.is_bot and player.name is None:
                    player.name = name

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
        return len([player for player in self.player_list if not player.is_bot and player.name is not None])

    @property
    def n_missing(self) -> int:
        return self.n_players - self.n_current
