from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player
from ...typing_hints import CardID


@register_play(play_name='describe_card')
class DescribeCard(Play):

    def __init__(self, player: Player, card_id: CardID, description: str):
        Play.__init__(self, player=player)
        self.card_id = card_id
        self.description = description

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'DescribeCard':
        return DescribeCard(player=json_data['player'],
                            card_id=json_data['cardId'],
                            description=json_data['description'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {
            'cardId': int(request.rel_url.query['card_id']),
            'description': request.rel_url.query['description'],
        }

    def update_game(self, game):
        game.card_description = self.description
        player: Player = game.get_player_by_name(self.player.name)
        player.remove_card_from_deck(self.card_id)
        player.played_card_id = self.card_id

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             card_description = $2,
                             n_actions = n_actions + 1
                         WHERE id = $3
                         """,
                         database_data['player_list'],
                         database_data['card_description'],
                         database_data['id'])
