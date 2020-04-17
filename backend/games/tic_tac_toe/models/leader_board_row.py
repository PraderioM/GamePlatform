from typing import Dict, Union


class LeaderBoardRow:
    def __init__(self, player_name: str, wins: int, losses: int, ties: int):
        self.player_name = player_name
        self.wins = wins
        self.losses = losses
        self.ties = ties

    @classmethod
    def from_database(cls, json_data: Dict[str, Union[int, str]]) -> 'LeaderBoardRow':
        return LeaderBoardRow(player_name=json_data['player_name'],
                              wins=json_data['wins'], losses=json_data['losses'],
                              ties=json_data['ties'])

    def to_frontend(self) -> Dict[str, Union[int, str]]:
        return {
            'playerName': self.player_name,
            'totalPlayed': self.total_played,
            'wins': self.wins,
            'losses': self.losses,
            'ties': self.ties,
            'points': self.points,
        }

    @property
    def total_played(self) -> int:
        return self.wins + self.losses + self.ties

    @property
    def points(self) -> int:
        return self.wins - self.losses
