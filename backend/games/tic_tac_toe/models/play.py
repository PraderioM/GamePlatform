from typing import Dict, List, Optional, Union

from .player import Player
from games.common.models.play import Play as BasePlay


class Play(BasePlay):
    def __init__(self, row: int, col: int, player: Player):
        self.row = row
        self.col = col
        BasePlay.__init__(self, player=player)

    @classmethod
    def from_database(cls, json_data: Dict[str, Union[int, str]], all_players: List[Player]) -> 'Play':
        play_player: Optional[Player] = None
        for player in all_players:
            if player.name == json_data['player_name']:
                play_player = player
                break

        assert play_player is not None, f'Could not find player named `{json_data["player_name"]}`'

        return Play(row=json_data['row'], col=json_data['col'], player=play_player)

    @classmethod
    def from_frontend(cls, json_data: Dict[str, Union[int, str]], all_players: List[Player]) -> 'Play':
        play_player: Optional[Player] = None
        for player in all_players:
            if player.symbol == json_data['symbol']:
                play_player = player
                break

        assert play_player is not None, f'Could not find player with symbol `{json_data["symbol"]}`'

        return Play(row=json_data['row'], col=json_data['col'], player=play_player)

    def to_database(self) -> Dict[str, Union[str, int]]:
        return {
            'row': self.row,
            'col': self.col,
            'player_name': self.player.name
        }

    def to_frontend(self) -> Dict[str, Union[str, int]]:
        return {
            'row': self.row,
            'col': self.col,
            'symbol': self.player.symbol
        }
