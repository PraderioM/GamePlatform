import abc
import json
from typing import Set, Dict

from aiohttp import web

from .core import Play, register_play
from ..player import Player
from ..land import LandType


class BuildPlay(Play):
    def __init__(self, player: Player, position: Set[int], price: Dict[LandType, int]):
        Play.__init__(self, player=player)
        self.position = position
        self._price = price

    @abc.abstractmethod
    def has_structures(self, game) -> bool:
        raise NotImplementedError('`has_structures` method must be implemented.')

    @abc.abstractmethod
    def is_position_valid(self, game) -> bool:
        raise NotImplementedError('`is_position_valid` method must be implemented.')

    @staticmethod
    @abc.abstractmethod
    def is_number_of_plays_correct(n_plays: int, turn_index: int) -> bool:
        raise NotImplementedError('`is_number_of_plays_correct` method must be implemented.')

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {'position': json.loads(request.rel_url.query['position'])}

    def can_update_game(self, game) -> bool:
        if game.discard_cards:
            return False

        player = game.get_player_by_name(self.player.name)
        if player is None or (not player.dice_thrown and not self.can_build_before_dice(game)):
            return False

        # Check if player has enough roads left.
        if not self.has_structures(game):
            return False

        # Check if the player has enough materials.
        if not self.is_building_free(game):
            player_deck = player.materials_deck
            for material, number in self._price.items():
                if player_deck[material] < number:
                    return False

        return self.is_position_valid(game=game)

    def can_update_game_setup_round(self, game) -> bool:
        n_plays = len(game.play_list)
        turn_index = game.turn_index
        is_correct_turn = self.is_number_of_plays_correct(n_plays, turn_index)
        is_position_valid = self.is_position_valid(game=game)
        return is_correct_turn and is_position_valid

    def update_game(self, game):
        is_free = self.is_building_free(game)
        # Pay the price for updating if necessary.
        if not game.is_setup_round and not is_free:
            player = game.get_player_by_name(self.player.name)
            for material, number in self._price.items():
                player.update_materials(material=material, number=-number)
                game.update_materials(material=material, number=number)

        game.play_list.append(self)

        if is_free:
            self.update_free_count(game)

        game.get_player_score(self.player)
        self.update_post_processing(game)

    @staticmethod
    def is_building_free(game) -> bool:
        return False

    @staticmethod
    def update_free_count(game):
        pass

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {
            **Play.to_frontend(self, *args, **kwargs),
            'position': sorted([val for val in self.position])
        }

    def to_database(self) -> Dict:
        return {
            **Play.to_database(self),
            'position': sorted([val for val in self.position])
        }

    def can_build_before_dice(self, game) -> bool:
        return False

    def update_post_processing(self, game):
        pass


@register_play(play_name='build_road')
class BuildRoad(BuildPlay):
    def __init__(self, player: Player, position: Set[int]):
        BuildPlay.__init__(self, player=player, position=position, price={LandType.Brick: 1, LandType.Wood: 1})

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'BuildRoad':
        return BuildRoad(player=Player.from_reduced_json(json_data['player']),
                         position=set(json_data['position']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'BuildRoad':
        return BuildRoad(player=Player.from_reduced_json(json_data['player']),
                         position=set(json_data['position']))

    def has_structures(self, game):
        player_plays = [play for play in game.play_list if play.player.name == self.player.name]
        player_road_building_plays = [play for play in player_plays if isinstance(play, BuildRoad)]
        built_roads = len(player_road_building_plays)
        return built_roads < game.board.n_per_player_roads

    @staticmethod
    def is_number_of_plays_correct(n_plays: int, turn_index: int) -> bool:
        return n_plays == 2 * turn_index + 1

    def is_position_valid(self, game) -> bool:
        # If road was already built in that position player cannot build road.
        for play in game.play_list:
            if isinstance(play, BuildRoad) and play.position == self.position:
                return False

        # If there is a settlement or city nearby construction is also valid.
        neighbour_intersections = game.get_neighbour_intersections(self.position)
        settlement_play_list = [play for play in game.play_list if
                                isinstance(play, BuildSettlement) or isinstance(play, BuildCity)]
        for play in settlement_play_list:
            if play.player.name == self.player.name:
                for intersection in neighbour_intersections:
                    if play.position == intersection:
                        return True

        # If there is another road nearby construction is also valid.
        road_play_list = [play for play in game.play_list if isinstance(play, BuildRoad)]
        for intersection in neighbour_intersections:
            # If a different player's city is in the way we cannot build from that direction.
            is_valid_direction = True
            for play in settlement_play_list:
                if play.position == intersection and play.player.name != self.player.name:
                    is_valid_direction = False
                    break
            if not is_valid_direction:
                continue

            for segment in game.get_neighbour_segments(intersection):
                if segment == self.position:
                    continue

                # If there is a connection to a previous road then we can build there.
                for play in road_play_list:
                    if play.position == segment and play.player.name == self.player.name:
                        return True

        return False

    @staticmethod
    def is_building_free(game) -> bool:
        return game.to_build_roads > 0

    @staticmethod
    def setup_round_post_processing(game):
        game.end_turn()

    @staticmethod
    def update_free_count(game):
        game.to_build_roads -= 1

    def can_build_before_dice(self, game) -> bool:
        return game.to_build_roads > 0


@register_play(play_name='build_settlement')
class BuildSettlement(BuildPlay):
    def __init__(self, player: Player, position: Set[int]):
        BuildPlay.__init__(self, player=player, position=position,
                           price={LandType.Wheat: 1, LandType.Sheep: 1, LandType.Wood: 1, LandType.Brick: 1})

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'BuildSettlement':
        return BuildSettlement(player=Player.from_reduced_json(json_data['player']),
                               position=set(json_data['position']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'BuildSettlement':
        return BuildSettlement(player=Player.from_reduced_json(json_data['player']),
                               position=set(json_data['position']))

    def can_update_game(self, game) -> bool:
        return BuildPlay.can_update_game(self, game) and game.to_build_roads == 0

    def has_structures(self, game) -> bool:
        player_plays = [play for play in game.play_list if play.player.name == self.player.name]
        player_settlement_building_plays = [play for play in player_plays if isinstance(play, BuildSettlement)]
        built_settlements = len(player_settlement_building_plays)
        return built_settlements < game.board.n_per_player_settlements

    def is_position_valid(self, game) -> bool:
        # If some settlement is posted too close then position is invalid.
        settlement_plays = [play for play in game.play_list
                            if isinstance(play, BuildSettlement) or isinstance(play, BuildCity)]
        for play in settlement_plays:
            if game.intersection_distance(play.position, self.position) < 2:
                return False

        # On setup round no more restrictions are imposed on position.
        if game.is_setup_round:
            return True

        # Otherwise we need intersection to be attached to some existing road.
        road_plays = [play for play in game.play_list if isinstance(play, BuildRoad)]
        for segment in game.get_neighbour_segments(self.position):
            for play in road_plays:
                if play.position == segment and play.player.name == self.player.name:
                    return True

        return False

    def update_post_processing(self, game):
        if game.turn_index < len(game.player_list) or game.turn_index >= 2 * len(game.player_list):
            return

        game.take_materials_from_settlement(self.position, self.player.name)

    @staticmethod
    def is_number_of_plays_correct(n_plays: int, turn_index: int) -> bool:
        return n_plays == 2 * turn_index

    @property
    def play_points(self) -> int:
        return 1


@register_play(play_name='build_city')
class BuildCity(BuildPlay):
    def __init__(self, player: Player, position: Set[int]):
        BuildPlay.__init__(self, player=player, position=position, price={LandType.Wheat: 2, LandType.Stone: 3})

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'BuildCity':
        return BuildCity(player=Player.from_reduced_json(json_data['player']),
                         position=set(json_data['position']))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'BuildCity':
        return BuildCity(player=Player.from_reduced_json(json_data['player']),
                         position=set(json_data['position']))

    def can_update_game(self, game) -> bool:
        return BuildPlay.can_update_game(self, game) and game.to_build_roads == 0

    def has_structures(self, game):
        player_plays = [play for play in game.play_list if play.player.name == self.player.name]
        player_city_building_plays = [play for play in player_plays if isinstance(play, BuildCity)]
        built_cities = len(player_city_building_plays)
        return built_cities < game.board.n_per_player_cities

    def is_position_valid(self, game) -> bool:
        for play_index, play in enumerate(game.play_list):
            is_settlement = isinstance(play, BuildSettlement)
            is_correct_player = play.player.name == self.player.name
            is_same_position = play.position == self.position
            if is_settlement and is_correct_player and is_same_position:
                return True
        return False

    def update_game(self, game):
        # Remove previous settlement before replacing it with a city.
        remove_index = None
        for play_index, play in enumerate(game.play_list):
            if isinstance(play, BuildSettlement) and play.player.name == self.player.name:
                remove_index = play_index
                break
        game.play_list.pop(remove_index)

        BuildPlay.update_game(self, game=game)

    @staticmethod
    def is_number_of_plays_correct(n_plays: int, turn_index: int) -> bool:
        return False

    @property
    def play_points(self) -> int:
        return 2
