import json
from math import floor
from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..materials_deck import MaterialsDeck
from ..player import Player


@register_play(play_name='discard_cards')
class DiscardCards(Play):
    def __init__(self, player: Player, materials_deck: MaterialsDeck):
        Play.__init__(self, player=player)
        self.materials_deck = materials_deck

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'DiscardCards':
        return DiscardCards(player=Player.from_reduced_json(json_data['player']),
                            materials_deck=MaterialsDeck.from_frontend(json_data['materials_deck']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'DiscardCards':
        return DiscardCards(player=Player.from_reduced_json(json_data['player']),
                            materials_deck=MaterialsDeck.from_json(json_data['materials_deck']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {'materials_deck': json.loads(request.rel_url.query['materials_deck'])}

    def to_frontend(self) -> Dict:
        return {
            **Play.to_frontend(self),
            'materialsDeck': self.materials_deck.to_json()
        }

    def to_database(self) -> Dict:
        return {
            **Play.to_database(self),
            'materials_deck': self.materials_deck.to_json()
        }

    def can_update_game(self, game) -> bool:
        player: Player = game.get_player_by_name(self.player.name)

        # Player must not have previously discarded.
        if player.cards_discarded:
            return False

        # Correct number of materials must be discarded.
        if int(floor(player.n_materials / 2)) != self.materials_deck.n_materials:
            return False

        # No more material than the available ones must be discarded.
        player_deck = player.materials_deck
        for material, n_materials in self.materials_deck.deck.items():
            if n_materials > player_deck[material]:
                return False

        return True

    def update_game(self, game):
        player = game.get_player_by_name(self.player.name)

        for material, n_materials in self.materials_deck.deck.items():
            player.update_materials(material=material, number=-n_materials)
            game.update_materials(material=material, number=n_materials)

        player.cards_discarded = True

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             materials_deck = $2,
                             discard_cards = $3,
                             last_updated = now()
                         WHERE id = $4
                         """,
                         database_data['players'],
                         database_data['materials_deck'],
                         database_data['discard_cards'],
                         database_data['id'])
