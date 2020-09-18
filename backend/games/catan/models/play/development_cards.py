import abc
from typing import Dict

from aiohttp import web
import asyncpg

from .core import Play, register_play
from ..player import Player
from ..land import LandType
from ..development_deck import DevelopmentType


@register_play(play_name='buy_development')
class BuyDevelopment(Play):
    PRICE = {LandType.Sheep: 1, LandType.Wheat: 1, LandType.Stone: 1}

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'BuyDevelopment':
        return BuyDevelopment(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'BuyDevelopment':
        return BuyDevelopment(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    def can_update_game(self, game) -> bool:
        # If base game tells that game cannot be updated then game cannot be updated.
        if not Play.can_update_game(self, game=game):
            return False

        # Check if there are enough development cards left.
        if game.remaining_development_cards() == 0:
            return False

        # Check if player has necessary materials for buying.
        player: Player = game.get_player_by_name(self.player.name)
        player_materials = player.materials_deck
        for material, number in self.PRICE.items():
            if player_materials[material] < self.PRICE[material]:
                return False

        return True

    def update_game(self, game):
        # Pay materials.
        player: Player = game.get_player_by_name(self.player.name)
        for material, number in self.PRICE.items():
            player.update_materials(material=material, number=-number)
            game.update_materials(material=material, number=number)

        # Pick card.
        game.pick_random_development_card(player=player)

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             development_deck = $2,
                             materials_deck = $3,
                             last_updated = now()
                         WHERE id = $4
                         """,
                         database_data['players'],
                         database_data['development_deck'],
                         database_data['materials_deck'],
                         database_data['id'])


class DevelopmentPlay(Play):
    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {}

    def can_update_game(self, game) -> bool:
        if not game.is_current_player(game.get_player_by_name(self.player.name)):
            return False
        elif not game.thief_moved:
            return False
        elif game.discard_cards:
            return False
        elif game.to_build_roads > 0:
            return False
        elif len(game.to_steal_players) != 0:
            return False
        else:
            player = game.get_player_by_name(self.player.name)
            return self.has_available_cards(player)

    @staticmethod
    @abc.abstractmethod
    def has_available_cards(player: Player) -> bool:
        raise NotImplementedError('`has_available_cards` method is not implemented.')


@register_play(play_name='play_knight')
class PlayKnight(DevelopmentPlay):

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'PlayKnight':
        return PlayKnight(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'PlayKnight':
        return PlayKnight(player=Player.from_reduced_json(json_data['player']))

    def update_game(self, game):
        # Thief must be moved.
        game.thief_moved = False

        # Knight card must be removed and
        player = game.get_player_by_name(self.player.name)
        player.update_development(development_card=DevelopmentType.KNIGHT, number=-1)
        player.n_played_knights += 1

    @staticmethod
    def has_available_cards(player: Player) -> bool:
        return player.n_available_knight > 0

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             knight_player = $2,
                             thief_moved = $3,
                             last_updated = now()
                         WHERE id = $4
                         """,
                         database_data['players'],
                         database_data['knight_player'],
                         database_data['thief_moved'],
                         database_data['id'])


@register_play(play_name='play_roads')
class PlayRoads(DevelopmentPlay):

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'PlayRoads':
        return PlayRoads(player=Player.from_reduced_json(json_data['player']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'PlayRoads':
        return PlayRoads(player=Player.from_reduced_json(json_data['player']))

    def update_game(self, game):
        game.to_build_roads = 2
        player = game.get_player_by_name(self.player.name)
        player.update_development(development_card=DevelopmentType.ROADS, number=-1)

    @staticmethod
    def has_available_cards(player: Player) -> bool:
        return player.n_available_roads > 0

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             to_build_roads = $2,
                             last_updated = now()
                         WHERE id = $3
                         """,
                         database_data['players'],
                         database_data['to_build_roads'],
                         database_data['id'])


def _resource_from_name(land_name: str) -> LandType:
    for land_type in LandType:
        if land_type.name.lower() == land_name.lower():
            return land_type


@register_play(play_name='play_resources')
class PlayResources(DevelopmentPlay):
    def __init__(self, player: Player, resource_1: LandType, resource_2: LandType):
        DevelopmentPlay.__init__(self, player=player)
        self._resource_1 = resource_1
        self._resource_2 = resource_2

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'PlayResources':
        return PlayResources(player=Player.from_reduced_json(json_data['player']),
                             resource_1=_resource_from_name(json_data['resource1']),
                             resource_2=_resource_from_name(json_data['resource2']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'PlayResources':
        return PlayResources(player=Player.from_reduced_json(json_data['player']),
                             resource_1=_resource_from_name(json_data['resource_1']),
                             resource_2=_resource_from_name(json_data['resource_2']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {
            'resource1': request.rel_url.query['resource1'],
            'resource2': request.rel_url.query['resource2']
        }

    def update_game(self, game):
        player = game.get_player_by_name(self.player.name)

        # Add resources.
        for material, number in self.resource_dict.items():
            player.update_materials(material=material, number=number)
            game.update_materials(material=material, number=-number)

        # Remove development card.
        player.update_development(development_card=DevelopmentType.RESOURCES, number=-1)

    @staticmethod
    def has_available_cards(player: Player) -> bool:
        return player.n_available_resources > 0

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {
            **DevelopmentPlay.to_frontend(self),
            'resource1': self._resource_1.value,
            'resource2': self._resource_2.value
        }

    def to_database(self) -> Dict:
        return {
            **DevelopmentPlay.to_frontend(self),
            'resource_1': self._resource_1.value,
            'resource_2': self._resource_2.value
        }

    @property
    def resource_dict(self) -> Dict[LandType, int]:
        return {self._resource_1: 1, self._resource_2: 1}

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             materials_deck = $2,
                             last_updated = now()
                         WHERE id = $3
                         """,
                         database_data['players'],
                         database_data['materials_deck'],
                         database_data['id'])


@register_play(play_name='play_monopoly')
class PlayMonopoly(DevelopmentPlay):
    def __init__(self, player: Player, material: LandType):
        DevelopmentPlay.__init__(self, player=player)
        self.material = material

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'PlayMonopoly':
        return PlayMonopoly(player=Player.from_reduced_json(json_data['player']),
                            material=_resource_from_name(json_data['material']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'PlayMonopoly':
        return PlayMonopoly(player=Player.from_reduced_json(json_data['player']),
                            material=_resource_from_name(json_data['material']))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {
            'material': request.rel_url.query['material']
        }

    def update_game(self, game):
        game.monopolize_materials(player_name=self.player.name, material=self.material)

        # Remove development card.
        player = game.get_player_by_name(self.player.name)
        player.update_development(development_card=DevelopmentType.MONOPOLY, number=-1)

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {
            **DevelopmentPlay.to_frontend(self),
            'material': self.material,
        }

    def to_database(self) -> Dict:
        return {
            **DevelopmentPlay.to_frontend(self),
            'material': self.material,
        }

    @staticmethod
    def has_available_cards(player: Player) -> bool:
        return player.n_available_monopoly > 0

    async def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        await db.execute(f"""
                         UPDATE {active_games_table}
                         SET player_list = $1,
                             last_updated = now()
                         WHERE id = $2
                         """,
                         database_data['players'],
                         database_data['id'])
