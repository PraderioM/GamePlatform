from copy import deepcopy
import json
from random import choice, shuffle
from typing import Dict, List, Optional, Set, Union
from datetime import datetime

import asyncpg

from backend.games.common.models.game import Game as BaseGame
from .development_deck import DevelopmentDeck, DevelopmentType
from .land import Land, LandType
from .materials_deck import MaterialsDeck
from .offer import Offer
from .play import Play, BuildRoad, BuildSettlement, BuildCity, MoveThief
from .player import Player
from .board.constants import CLASSIC_BOARD, EXTENDED_3_4_4_BOARD
from .board.board import Board
from .port import Port


class Game(BaseGame):

    def __init__(self, current_player_index: int,
                 turn_index: int,
                 play_list: List[Play],
                 player_list: List[Player],
                 id_: Optional[str],
                 development_deck: Optional[DevelopmentDeck] = None,
                 materials_deck: Optional[MaterialsDeck] = None,
                 land_list: Optional[List[Land]] = None,
                 to_steal_players: Optional[List[Player]] = None,
                 knight_player: Optional[Player] = None,
                 long_road_player: Optional[Player] = None,
                 offer: Optional[Offer] = None,
                 discard_cards: bool = False,
                 thief_moved: bool = True,
                 to_build_roads: int = 0,
                 extended: bool = False,
                 last_dice_result: int = 7,
                 thief_position: Optional[int] = None,
                 last_updated: Optional[datetime] = None):
        BaseGame.__init__(self, current_player_index=current_player_index, player_list=player_list,
                          play_list=play_list, id_=id_)
        self.turn_index = turn_index
        self._discard_cards = discard_cards
        self.last_dice_result = last_dice_result
        self.thief_moved = thief_moved
        self.to_build_roads = to_build_roads
        self._extended = extended
        self._development_deck = self.get_empty_development_deck() if development_deck is None else development_deck
        self._materials_deck = self.get_empty_materials_deck() if materials_deck is None else materials_deck
        self._land_list = self.get_random_land_list() if land_list is None else land_list[:]
        self.offer = offer
        self._to_steal_players = to_steal_players
        self._knight_player = knight_player
        self._long_road_player = long_road_player
        self._thief_position = thief_position
        self.last_updated = datetime.now() if last_updated is None else last_updated

    # region frontend conversion.1
    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Game':
        raise NotImplementedError('from fronted is not implemented.')

    def to_frontend(self, db: Optional[asyncpg.Connection] = None,
                    description: str = 'successfully obtained game.') -> Dict:
        return {
            'currentPlayer': self.current_player_index,
            'turn': self.turn_index,
            'players': [player.to_frontend(points=self.get_player_score(player, compute_victory_points=False))
                        for player in self.player_list],
            'plays': [play.to_frontend() for play in self.play_list],
            'developmentDeck': self._development_deck.to_json(),
            'materialsDeck': self._materials_deck.to_json(),
            'landList': [land.to_frontend() for land in self._land_list],
            'offer': None if self.offer is None else self.offer.to_frontend(),
            'id': None if self.id is None else str(self.id),
            'extended': self._extended,
            'toStealPlayers': [player.name for player in self.to_steal_players],
            'knightPlayer': None if self._knight_player is None else self._knight_player.name,
            'longRoadPlayer': None if self._long_road_player is None else self._long_road_player.name,
            'discardCards': self.discard_cards,
            'thiefMoved': self.thief_moved,
            'toBuildRoads': self.to_build_roads,
            'lastDiceResult': self.last_dice_result,
            'description': description,
            'hasEnded': self.has_ended,
            'thiefPosition': self.thief_position,
        }

    def to_display(self) -> Dict:
        return {
            'gameId': None if self.id is None else str(self.id),
            'nPlayers': self.n_players,
            'nBots': self.n_bots,
            'currentPlayers': self.n_current,
            'extended': self._extended,
        }

    # region database conversion.
    @classmethod
    def from_database(cls, json_data: Dict) -> 'Game':
        players_list = [Player.from_database(json_data=player_data) for player_data in json.loads(json_data['players'])]
        play_list = [
            Play.from_database(json_data=player_data, all_players=players_list)
            for player_data in json.loads(json_data.get('plays', []))
        ]
        if 'development_deck' in json_data:
            development_deck = DevelopmentDeck.from_json(json.loads(json_data['development_deck']))
        else:
            development_deck = None

        if 'materials_deck' in json_data:
            materials_deck = MaterialsDeck.from_json(json.loads(json_data['materials_deck']))
        else:
            materials_deck = None

        if 'land_list' in json_data:
            land_list = [Land.from_json(land_data) for land_data in json.loads(json_data['land_list'])]
        else:
            land_list = None

        if json_data.get('offer', None) is None:
            offer = None
        else:
            offer = Offer.from_database(json_data=json.loads(json_data['offer']), all_players=players_list)

        if json_data.get('knight_player', None) is None:
            knight_player = None
        else:
            knight_player = Player(name=json_data['knight_player'], color='black')

        if json_data.get('long_road_player', None) is None:
            long_road_player = None
        else:
            long_road_player = Player(name=json_data['long_road_player'], color='black')

        if json_data.get('to_steal_players', None) is None:
            to_steal_players = []
        else:
            to_steal_players = [Player(name=name, color='black') for name in json.loads(json_data['to_steal_players'])]

        return Game(
            current_player_index=json_data.get('current_player_index', 0),
            turn_index=json_data.get('turn_index', 0),
            play_list=play_list,
            player_list=players_list,
            id_=json_data['id'],
            development_deck=development_deck,
            materials_deck=materials_deck,
            land_list=land_list,
            offer=offer,
            extended=json_data.get('extended', False),
            to_steal_players=to_steal_players,
            knight_player=knight_player,
            long_road_player=long_road_player,
            discard_cards=json_data.get('discard_cards', False),
            thief_moved=json_data.get('thief_moved', True),
            to_build_roads=json_data.get('to_build_roads', 0),
            last_dice_result=json_data.get('last_dice_result', 7),
            thief_position=json_data.get('thief_position', None),
        )

    def to_database(self) -> Dict[str, Union[str, int, bool, Dict]]:
        offer = None if self.offer is None else json.dumps(self.offer.to_database())
        knight_player = None if self._knight_player is None else self._knight_player.name
        long_road_player = None if self._long_road_player is None else self._long_road_player.name
        return {
            **BaseGame.to_database(self),
            **{
                'development_deck': json.dumps(self._development_deck.to_json()),
                'materials_deck': json.dumps(self._materials_deck.to_json()),
                'land_list': json.dumps([land.to_json() for land in self._land_list]),
                'offer': offer,
                'knight_player': knight_player,
                'long_road_player': long_road_player,
                'turn_index': self.turn_index,
                'discard_cards': self.discard_cards,
                'thief_moved': self.thief_moved,
                'to_steal_players': json.dumps([player.name for player in self.to_steal_players]),
                'to_build_roads': self.to_build_roads,
                'last_dice_result': self.last_dice_result,
                'extended': self._extended,
                'thief_position': self.thief_position,
            },
        }

    # endregion

    # region overwritten methods.
    def add_new_player_name(self, name: str):
        # Cannot add twice the same player.
        for player in self.player_list:
            if player.name == name:
                return

        if self.n_missing > 0:
            player_list = self.player_list[:]
            # Make player position random.
            shuffle(player_list)
            for player in player_list:
                if player.name is None and not player.is_bot:
                    player.name = name
                    break

    def add_play(self, play: Optional[Play]):
        if play is None:
            return
        if play.player.name in [player.name for player in self.player_list]:
            self.process_play(play)

    # endregion.

    # region play processing.
    def process_play(self, play: Play):
        is_setup = self.is_setup_round
        if (play.can_update_game(self) and not is_setup) or (play.can_update_game_setup_round(self) and is_setup):
            play.game_pre_processing(self)
            play.update_game(self)
            if is_setup:
                play.setup_round_post_processing(self)
            self.last_updated = datetime.now()

    def reset_offer(self):
        self.offer = None

    def is_current_player(self, player: Player) -> bool:
        return self.player_list[self.current_player_index].name == player.name

    # endregion.

    # region materials.
    def give_materials(self, dice_number: int):
        thief_land_index = self.thief_position
        for land_index, land in enumerate(self._land_list):
            if land_index == thief_land_index:
                continue

            if land.number == dice_number:
                # Give one material at every settlement and two at every city.
                for play in self.play_list:
                    if not isinstance(play, BuildSettlement) and not isinstance(play, BuildCity):
                        continue
                    elif isinstance(play, BuildSettlement):
                        n_materials = 1
                    else:
                        n_materials = 2

                    # If land is not the specified one skip the rest.
                    if land_index not in play.position:
                        continue

                    # Update player materials.
                    for player in self.player_list:
                        if player.name == play.player.name:
                            player.update_materials(material=land.land_type, number=n_materials)
                            self._materials_deck.update(material=land.land_type, number=-n_materials)

    def take_materials_from_settlement(self, position: Set[int], player_name: str, n_materials: int = 1):
        # Get player.
        player = self.get_player_by_name(player_name)

        # Iterate over all lands neighbour to the intersection.
        for index in position:
            if index < 0:
                continue

            # Skip desert.
            land = self._land_list[index]
            if land.land_type == LandType.Desert:
                continue

            # Give a material to the player for the surrounding land.
            player.update_materials(material=land.land_type, number=n_materials)
            self._materials_deck.update(material=land.land_type, number=-n_materials)

    def monopolize_materials(self, player_name: str, material: LandType):
        total_material_number = 0
        for player in self.player_list:
            player: Player = player
            player_material_number = player.materials_deck[material]
            total_material_number += player_material_number
            player.update_materials(material=material, number=-player_material_number)

        player = self.get_player_by_name(name=player_name)
        player.update_materials(material=material, number=total_material_number)

    def update_materials(self, material: LandType, number: int):
        self._materials_deck.update(material=material, number=number)

    # endregion.

    # region development.
    def remaining_development_cards(self) -> int:
        return self._development_deck.n_cards

    def update_development(self, development_card: DevelopmentType, number: int):
        self._development_deck.update(development_card=development_card, number=number)

    def pick_random_development_card(self, player: Player):
        development_card = self._development_deck.get_random_card()

        # If there is no card to return me return None
        if development_card is None:
            raise ValueError('No remaining development cards.')

        # Update number of cards for player and in deck.
        player.update_new_development(development_card=development_card, number=1)
        self.update_development(development_card=development_card, number=-1)

    # endregion.

    def move_thief(self, move_thief: MoveThief):
        # Add last thief move.
        self._thief_position = move_thief.dst_index
        self.thief_moved = True

        # Update to_steal players with players around the given land.
        to_steal_player_names = []
        for play in self.play_list:
            if not (isinstance(play, BuildSettlement) or isinstance(play, BuildCity)):
                continue

            # Add player name if if touches land.
            if move_thief.dst_index in play.position and play.player.name not in to_steal_player_names:
                to_steal_player_names.append(play.player.name)

        self.to_steal_players = [
            Player(name=name, color='black') for name in to_steal_player_names if name != move_thief.player.name
        ]

    # region game resolution.
    @property
    def has_ended(self) -> bool:
        for player in self.player_list:
            if self.get_player_score(player, compute_victory_points=True) >= self.board.win_points:
                return True
        return False

    def get_player_score(self, player: Player, compute_victory_points: bool = True) -> int:
        # Compute play related points (development cards, settlements and cities).
        out_points = 0
        for play in self.play_list:
            if play.player.name == player.name:
                out_points += play.play_points

        # Get player victory points.
        if compute_victory_points:
            out_points += player.n_point

        # Compute knights points.
        knight_points = self._get_player_card_points(per_player_scores=self.get_per_player_knights(),
                                                     player=player,
                                                     awarded_player=self._knight_player,
                                                     score_threshold=self.board.min_knights,
                                                     max_points=self.board.knights_points)
        if knight_points != 0:
            self._knight_player = Player(name=player.name, color=player.color)
        out_points += knight_points

        # Compute long road points.
        long_road_points = self._get_player_card_points(per_player_scores=self.get_per_player_longest_road(),
                                                        player=player,
                                                        awarded_player=self._long_road_player,
                                                        score_threshold=self.board.min_long_road,
                                                        max_points=self.board.long_road_points)
        if long_road_points != 0:
            self._long_road_player = Player(name=player.name, color=player.color)
        out_points += long_road_points

        return out_points

    def get_per_player_knights(self) -> Dict[str, int]:
        return {player.name: player.n_played_knights for player in self.player_list}

    def get_per_player_longest_road(self) -> Dict[str, int]:
        return {player.name: len(self.get_player_longest_road(player)) for player in self.player_list}

    def get_player_longest_road(self, player: Player) -> List[Set[int]]:
        # Get all road building plays related to player.
        road_building_play_list = [play for play in self.play_list if
                                   isinstance(play, BuildRoad) and play.player.name == player.name]
        post_building_play_list = [play for play in self.player_list if
                                   isinstance(play, BuildSettlement) or isinstance(play, BuildCity)]
        all_roads = self._get_all_road_combinations(
            built_roads=[play.position for play in road_building_play_list],
            other_player_built_posts=[play.position for play in post_building_play_list
                                      if play.player.name != player.name]
        )

        # Get the longest road.
        if len(all_roads) == 0:
            return []
        else:
            return sorted(all_roads, key=lambda x: len(x))[-1]

    # endregion.

    # region initialization methods.
    def get_random_land_list(self, seed: Optional[float] = None) -> List[Land]:
        land_type_list = [LandType.Wood for _ in range(self.board.n_wood)]
        land_type_list += [LandType.Wheat for _ in range(self.board.n_wheat)]
        land_type_list += [LandType.Sheep for _ in range(self.board.n_sheep)]
        land_type_list += [LandType.Brick for _ in range(self.board.n_brick)]
        land_type_list += [LandType.Stone for _ in range(self.board.n_stone)]
        land_type_list += [LandType.Desert for _ in range(self.board.n_desert)]
        shuffle(land_type_list, random=seed)

        start_index = choice(self.board.start_positions)

        land_list: List[Land] = []
        index = 0
        for land_type in land_type_list:
            # Add desert if needed.
            if land_type == LandType.Desert:
                land_list.append(Land(land_type=land_type, number=7))
                continue

            number = self.board.number_list[(index + start_index) % len(self.board.number_list)]
            land_list.append(Land(land_type=land_type, number=number))
            index += 1
        return land_list

    def get_empty_development_deck(self) -> DevelopmentDeck:
        return DevelopmentDeck(
            cards_dict={
                DevelopmentType.KNIGHT: self.board.n_knight,
                DevelopmentType.MONOPOLY: self.board.n_monopoly,
                DevelopmentType.RESOURCES: self.board.n_materials,
                DevelopmentType.ROADS: self.board.n_roads,
                DevelopmentType.POINT: self.board.n_point
            }
        )

    @staticmethod
    def get_empty_materials_deck() -> MaterialsDeck:
        return MaterialsDeck()

    # endregion.

    def end_turn(self):
        # end turn for every player.
        for player in self.player_list:
            player.end_turn()

        # reset offer to None.
        self.reset_offer()

        # Reset thief moved.
        self.thief_moved = True

        # Reset number of roads to build.
        self.to_build_roads = 0

        # Reset cards discarding.
        self.discard_cards = False

        # Update turn index.
        self.turn_index += 1

        # Update current player index.
        n_players = len(self.player_list)
        if n_players < self.turn_index < 2 * n_players:
            self.current_player_index -= 1
        elif n_players != self.turn_index and 2 * n_players != self.turn_index:
            self.current_player_index += 1
        self.current_player_index = self.current_player_index % len(self.player_list)

    def get_player_by_name(self, name: str) -> Optional[Player]:
        for player in self.player_list:
            if player.name == name:
                return player
        return None

    # region distance methods.
    def get_segments(self) -> List[Set[int]]:
        found_segments: List[Set[int]] = []
        for intersection in self.board.intersections:
            pos_1, pos_2, pos_3 = [pos for pos in intersection]
            neighbour_segments = [(pos_1, pos_2), (pos_2, pos_3), (pos_3, pos_1)]
            for pos_1, pos_2 in neighbour_segments:
                if pos_1 >= 0 or pos_2 >= 0:
                    continue
                new_segment = {pos_1, pos_2}
                if new_segment not in found_segments:
                    found_segments.append(new_segment)

        return found_segments

    @staticmethod
    def get_neighbour_segments(intersection: Set[int]) -> List[Set[int]]:
        assert len(intersection) == 3
        pos_1, pos_2, pos_3 = [pos for pos in intersection]
        neighbour_segments = [(pos_1, pos_2), (pos_2, pos_3), (pos_3, pos_1)]
        return [{pos_1, pos_2} for pos_1, pos_2 in neighbour_segments if pos_1 >= 0 or pos_2 >= 0]

    def get_neighbour_intersections(self, segment: Set[int]) -> List[Set[int]]:
        assert len(segment) == 2
        pos_1, pos_2 = [pos for pos in segment]
        return [intersection for intersection in self.board.intersections
                if pos_1 in intersection and pos_2 in intersection]

    def intersection_distance(self, intersection_1: Set[int], intersection_2: Set[int]) -> int:
        explored_intersections: List[Set[int]] = []
        distance = 0
        frontier_intersections: List[Set[int]] = [intersection_1]

        while len(frontier_intersections) != 0:
            if intersection_2 in frontier_intersections:
                return distance

            # Frontier segments.
            explored_intersections.extend(frontier_intersections)
            frontier_segments = []
            for intersection in frontier_intersections:
                for segment in self.get_neighbour_segments(intersection):
                    if segment not in frontier_segments:
                        frontier_segments.append(segment)

            # Frontier intersections.
            frontier_intersections = []
            for segment in frontier_segments:
                for intersection in self.get_neighbour_intersections(segment=segment):
                    if intersection not in explored_intersections and intersection not in frontier_intersections:
                        frontier_intersections.append(intersection)

            distance += 1

        return distance

    # endregion.

    # region ports.
    def get_player_ports(self, player_name: str):
        all_ports = self.board.ports
        player_plays = [play for play in self.play_list if play.player.name == player_name]
        player_settlements = [play for play in player_plays
                              if isinstance(play, BuildSettlement) or isinstance(play, BuildCity)]
        player_ports: List[Port] = []
        for port in all_ports:
            for play in player_settlements:
                for intersection in port.intersections:
                    if play.position == intersection:
                        player_ports.append(port)
                        break

        return player_ports

    # endregion.

    # region properties.
    @property
    def to_steal_players(self) -> List[Player]:
        if self._to_steal_players is None:
            return []
        else:
            return self._to_steal_players[:]

    @to_steal_players.setter
    def to_steal_players(self, players: Optional[List[Player]]):
        if players is None:
            self._to_steal_players = players
        else:
            self._to_steal_players = players[:]

    @property
    def board(self) -> Board:
        if self._extended:
            return deepcopy(EXTENDED_3_4_4_BOARD)
        else:
            return deepcopy(CLASSIC_BOARD)

    @property
    def discard_cards(self) -> bool:
        if not self._discard_cards:
            return False

        for player in self.player_list:
            if not player.cards_discarded:
                return True

        self._discard_cards = False
        return False

    @discard_cards.setter
    def discard_cards(self, discard: bool):
        self._discard_cards = discard

    @property
    def thief_position(self) -> int:
        if self._thief_position is not None:
            return self._thief_position

        return sorted([index for index in self.desert_land_indexes])[0]

    @property
    def desert_land_indexes(self) -> Set[int]:
        indexes: Set[int] = set([])
        for land_index, land in enumerate(self._land_list):
            if land.land_type == LandType.Desert:
                indexes.add(land_index)

        return indexes

    @property
    def is_setup_round(self) -> bool:
        # Update current player index.
        n_players = len(self.player_list)
        return self.turn_index < 2 * n_players

    @property
    def is_second_setup_round(self) -> bool:
        # Update current player index.
        n_players = len(self.player_list)
        return n_players <= self.turn_index < 2 * n_players

    @property
    def has_thrown_dice(self) -> bool:
        current_player: Player = self.player_list[self.current_player_index]
        return current_player.dice_thrown

    @property
    def extended(self) -> bool:
        return self._extended

    # endregion

    @staticmethod
    def _get_player_card_points(per_player_scores: Dict[str, int], player: Player,
                                awarded_player: Optional[Player],
                                score_threshold: int, max_points: int) -> int:
        max_score = max([score for score in per_player_scores.values()])
        if per_player_scores[player.name] >= score_threshold:
            if awarded_player is None:
                return max_points
            elif awarded_player.name == player.name:
                if per_player_scores[player.name] >= max_score:
                    return max_points
            elif per_player_scores[player.name] > per_player_scores[awarded_player.name]:
                return max_points
        return 0

    def _get_all_road_combinations(self, built_roads: List[Set[int]],
                                   other_player_built_posts: List[Set[int]],
                                   previous_road_combination: Optional[List[Set[int]]] = None) -> List[List[Set[int]]]:
        road_combinations: List[List[Set[int]]] = []
        if previous_road_combination is None:
            previous_road_combination = []
            neighbour_roads = built_roads[:]
        else:
            last_road = previous_road_combination[-1]
            neighbour_intersections = self.get_neighbour_intersections(segment=last_road)

            # We cannot go back so we need to remove one of the intersections
            # if the previous road combination was of length at least 2.
            if len(previous_road_combination) >= 2:
                second_to_last_road = previous_road_combination[-2]
                forbidden_intersections = self.get_neighbour_intersections(segment=second_to_last_road)
                neighbour_intersections = [
                    intersection
                    for intersection in neighbour_intersections
                    if intersection not in forbidden_intersections
                ]

            neighbour_roads = []
            for intersection in neighbour_intersections:
                if intersection in other_player_built_posts:
                    continue
                for segment in self.get_neighbour_segments(intersection=intersection):
                    if segment in built_roads and segment not in previous_road_combination:
                        neighbour_roads.append(segment)

        # If we cannot further extend previous road we stop here.
        if len(neighbour_roads) == 0:
            if len(previous_road_combination) != 0:
                road_combinations.append(previous_road_combination[:])

        # Apply function recursively.
        for road in neighbour_roads:
            new_previous_road_combination = previous_road_combination[:] + [road]
            new_combinations = self._get_all_road_combinations(built_roads=built_roads,
                                                               other_player_built_posts=other_player_built_posts,
                                                               previous_road_combination=new_previous_road_combination)
            road_combinations.extend(new_combinations)

        return road_combinations
