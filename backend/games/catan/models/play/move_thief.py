from typing import Dict

from ..player import Player
from .core import Play, register_play


@register_play(play_name='move_thief')
class MoveThief(Play):
    def __init__(self, player: Player, dst_index: int):
        Play.__init__(self, player=player)
        self.dst_index = dst_index

    def can_update_game(self, game) -> bool:
        if game.discard_cards or game.to_build_roads > 0:
            return False
        return self.thief_land_index != self.dst_index and self.dst_index >= 0 and game.is_current_player(self.player)

    def update_game(self, game):
        game.move_thief(self)

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'MoveThief':
        return MoveThief(player=Player.from_frontend(json_data=json_data['player']),
                         dst_index=json_data['dstIndex'])

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'MoveThief':
        return MoveThief(player=Player.from_database(json_data=json_data['player']),
                         dst_index=json_data['dst_index'])

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {'player': self.player.to_frontend(),
                'dstIndex': self.dst_index}

    def to_database(self) -> Dict:
        return {'player': self.player.to_database(),
                'dst_index': self.dst_index}

