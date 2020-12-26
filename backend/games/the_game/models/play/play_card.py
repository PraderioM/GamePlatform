from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player
from ..pile import Pile
from ...typing_hints import Card, PileId


@register_play(play_name='play_card')
class PlayCard(Play):

    def __init__(self, player: Player, card: Card, pile_id: PileId):
        Play.__init__(self, player=player)
        self.card = card
        self.pile_id = pile_id

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'PlayCard':
        return PlayCard(player=json_data['player'],
                        card=json_data['card'],
                        pile_id=json_data['pileId'])

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {
            'card': int(request.rel_url.query['card_number']),
            'pileId': int(request.rel_url.query['pile_id']),
        }

    def update_game(self, game):
        player: Player = game.get_player_by_name(self.player.name)
        pile: Pile = game.get_pile(self.pile_id)
        pile.add_card(self.card, game.turn)
        player.remove_card_from_deck(self.card)
        game.reset_pile_reservation(self.pile_id)

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             pile_list = $2,
                             n_actions = n_actions + 1
                         WHERE id = $3
                         """,
                         database_data['player_list'],
                         database_data['pile_list'],
                         database_data['id'])
