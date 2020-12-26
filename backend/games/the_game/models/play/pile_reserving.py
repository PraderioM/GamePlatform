from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player
from ...typing_hints import PileId


class PileReserving(Play):

    def __init__(self, player: Player, pile_id: PileId):
        Play.__init__(self, player=player)
        self.pile_id = pile_id

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'BlockPile':
        return BlockPile(player=json_data['player'], pile_id=json_data['pileId'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {
            'pileId': int(request.rel_url.query['pile_id']),
        }

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             n_actions = n_actions + 1
                         WHERE id = $2
                         """,
                         database_data['player_list'],
                         database_data['id'])


@register_play(play_name='block_pile')
class BlockPile(PileReserving):

    def update_game(self, game):
        player: Player = game.get_player_by_name(self.player.name)
        player.add_blocked_pile(self.pile_id)


@register_play(play_name='slow_down_pile')
class SlowDownPile(PileReserving):

    def update_game(self, game):
        player: Player = game.get_player_by_name(self.player.name)
        player.add_slowed_down_pile(self.pile_id)
