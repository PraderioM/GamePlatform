from typing import Dict

from aiohttp import web
import asyncpg

from ..player import Player
from .core import Play, register_play


@register_play(play_name='steal')
class Steal(Play):
    def __init__(self, player: Player, to_steal_player: Player):
        Play.__init__(self, player=player)
        self.to_steal_player = to_steal_player

    def can_update_game(self, game) -> bool:
        if game.discard_cards or game.to_build_roads > 0:
            return False

        # Make sure that player to steal from is different than player.
        if self.player.name == self.to_steal_player.name:
            return False

        # Check if player we should steal from.
        for player in game.to_steal_players:
            # Take only plays regarding the player we should steal from.
            if player.name == self.to_steal_player.name:
                return True

        return False

    def update_game(self, game):
        # Get player to steal from.
        to_steal_player = game.get_player_by_name(self.to_steal_player.name)

        # Take a random material from to_steal player, add it to player and only then reset to_steal_players.
        material = to_steal_player.get_random_material()

        # If player has materials then we take it.
        if material is not None:
            to_steal_player.update_materials(material=material, number=-1)
            game.get_player_by_name(self.player.name).update_materials(material=material, number=1)

        game.to_steal_players = None

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Steal':
        return Steal(player=Player.from_reduced_json(json_data['player']),
                     to_steal_player=Player(name=json_data['to_steal_player'], color='black'))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Steal':
        return Steal(player=Player.from_reduced_json(json_data['player']),
                     to_steal_player=Player(name=json_data['to_steal_player'], color='black'))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {
            'to_steal_player': request.rel_url.query['to_steal_player']}

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {
            **Play.to_frontend(self),
            'toStealPlayer': self.to_steal_player.name
        }

    def to_database(self) -> Dict:
        return {
            **Play.to_database(self),
            'to_steal_player': self.to_steal_player.name
        }

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             to_steal_players = $2,
                             last_updated = now()
                         WHERE id = $3
                         """,
                         database_data['players'],
                         database_data['to_steal_players'],
                         database_data['id'])
