from typing import Dict, Union


class LeaderBoardRow:
    def __init__(self, player_name: str, wins: int, played: int, points: int):
        self.player_name = player_name
        self.wins = wins
        self.played = played
        self.points = points

    @classmethod
    def from_database(cls, json_data: Dict[str, Union[int, str]]) -> 'LeaderBoardRow':
        return LeaderBoardRow(player_name=json_data['player_name'],
                              wins=json_data['wins'],
                              played=json_data['played'],
                              points=json_data['points'])

    def to_frontend(self) -> Dict[str, Union[int, str]]:
        return {
            'playerName': self.player_name,
            'totalPlayed': self.played,
            'wins': self.wins,
            'points': self.points,
        }
