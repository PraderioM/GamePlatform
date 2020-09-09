from typing import Dict

from aiohttp import web
import asyncpg

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
        return game.thief_position != self.dst_index and self.dst_index >= 0 and game.is_current_player(self.player)

    def update_game(self, game):
        game.move_thief(self)

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'MoveThief':
        return MoveThief(player=Player.from_reduced_json(json_data['player']),
                         dst_index=json_data['dst_index'])

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'MoveThief':
        return MoveThief(player=Player.from_reduced_json(json_data['player']),
                         dst_index=json_data['dst_index'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {'dst_index': int(request.rel_url.query['dst_index'])}

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {
            **Play.to_frontend(self),
            'dstIndex': self.dst_index
        }

    def to_database(self) -> Dict:
        return {
            **Play.to_database(self),
            'dst_index': self.dst_index
        }

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET thief_moved = $1,
                             thief_position = $2,
                             to_steal_players = $3
                         WHERE id = $4
                         """,
                         database_data['thief_moved'],
                         database_data['thief_position'],
                         database_data['to_steal_players'],
                         database_data['id'])
