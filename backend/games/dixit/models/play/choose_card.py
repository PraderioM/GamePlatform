from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player
from ...typing_hints import CardID


@register_play(play_name='choose_card')
class ChooseCard(Play):

    def __init__(self, player: Player, card_id: CardID):
        Play.__init__(self, player=player)
        self.card_id = card_id

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'ChooseCard':
        return ChooseCard(player=json_data['player'],
                          card_id=json_data['cardId'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {'cardId': int(request.rel_url.query['card_id'])}

    def update_game(self, game):
        player: Player = game.get_player_by_name(self.player.name)
        player.chosen_card_id = self.card_id

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             last_updated = now()
                         WHERE id = $2
                         """,
                         database_data['player_list'],
                         database_data['id'])
