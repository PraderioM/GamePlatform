from random import choice, shuffle
from typing import List, Optional, Set

from backend.games.common.models.game import Game as BaseGame
from .player import Player
from .play import Play
from . development_deck import DevelopmentDeck
from . materials_deck import MaterialsDeck
from .land import Land, LandType
from .port import Port, PortType


class Game(BaseGame):
    PORTS = [
        Port(port_type=PortType.Sheep, intersections={{-18, -1, 0}, {-18, -17, 0}}),
        Port(port_type=PortType.General, intersections={{-16, -15, 2}, {-15, -14, 2}}),
        Port(port_type=PortType.Brick, intersections={{-14, -13, 3}, {-13, 3, 4}}),
        Port(port_type=PortType.General, intersections={{-12, -11, 4}, {-11, 4, 5}}),
        Port(port_type=PortType.Wood, intersections={{-10, -9, 6}, {-9, -8, 6}}),
        Port(port_type=PortType.Stone, intersections={{-8, -7, 7}, {-7, 7, 8}}),
        Port(port_type=PortType.General, intersections={{-7, -6, 8}, {-6, -5, 8}}),
        Port(port_type=PortType.Wheat, intersections={{-5, 8, 9}, {-5, -4, 9}}),
        Port(port_type=PortType.General, intersections={{-3, -2, 10}, {-2, 10, 11}}),
    ]
    START_POSITIONS = [0, 2, 4, 6, 8, 10]
    NUMBER_LIST = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11]
    N_WOOD = 4
    N_WHEAT = 4
    N_SHEEP = 4
    N_BRICK = 3
    N_STONE = 3
    N_DESERT = 1

    INTERSECTIONS = [{-18, -1, 0}, {-18, -17, 0}, {-17, 0, 1}, {-17, -16, 1}, {-16, 1, 2}, {-16, -15, 2}, {-15, -14, 2},
                     {-2, -1, 11}, {-1, 0, 11}, {0, 11, 12}, {0, 1, 12}, {1, 12, 13}, {1, 2, 13}, {2, 3, 13},
                     {-14, 2, 3}, {-14, -13, 3}, {-3, -2, 10}, {-2, 10, 11}, {10, 11, 17}, {11, 12, 17}, {12, 17, 18},
                     {12, 13, 18}, {13, 14, 18}, {3, 13, 14}, {3, 4, 14}, {-13, 3, 4}, {-13, -12, 4}, {-4, -3, 10},
                     {-4, 9, 10}, {9, 10, 17}, {9, 16, 17}, {16, 17, 18}, {15, 15, 18}, {14, 15, 18}, {5, 14, 15},
                     {4, 5, 14}, {-11, 4, 5}, {-12, -11, 4}, {-5, -4, 9}, {-5, 8, 9}, {8, 9, 16}, {7, 8, 16},
                     {7, 15, 16}, {6, 7, 15}, {5, 6, 15}, {-10, 5, 6}, {-11, -10, 5}, {-6, -5, 8}, {-7, -6, 8},
                     {-7, 7, 8}, {-8, -7, 7}, {-8, 6, 7}, {-9, -8, 6}, {-10, -9, 6}]

    def __init__(self, current_player_index: int,
                 development_deck: DevelopmentDeck,
                 materials_deck: MaterialsDeck,
                 land_list: List[Land],
                 play_list: List[Play], player_list: List[Player],
                 id_: Optional[str]):
        BaseGame.__init__(self, current_player_index=current_player_index, player_list=player_list,
                          play_list=play_list, id_=id_)
        self._development_deck = development_deck
        self._materials_deck = materials_deck
        self._land_list = land_list

    def get_random_land_list(self, seed: Optional[float] = None) -> List[Land]:
        land_type_list = [LandType.Wood] * self.N_WOOD
        land_type_list += [LandType.Wheat] * self.N_WHEAT
        land_type_list += [LandType.Sheep] * self.N_SHEEP
        land_type_list += [LandType.Brick] * self.N_BRICK
        land_type_list += [LandType.Stone] * self.N_STONE
        land_type_list += [LandType.Desert] * self.N_DESERT
        shuffle(land_type_list, random=seed)

        start_index = choice(self.START_POSITIONS)
        return [Land(land_type=land_type, number=number+start_index)
                for land_type, number in zip(land_type_list, self.NUMBER_LIST)]

    def get_segments(self) -> List[Set[int]]:
        found_segments: List[Set[int]] = []
        for intersection in self.INTERSECTIONS:
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
        return [intersection for intersection in self.INTERSECTIONS if pos_1 in intersection and pos_2 in intersection]

    def intersection_distance(self, intersection_1: Set[int], intersection_2: Set[int]) -> int:
        explored_intersections: List[Set[int]] = []
        distance = 0
        frontier_intersections: List[Set[int]] = [intersection_1]

        while len(frontier_intersections) == 0:
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


class ExpansionGame(Game):
    # Todo write corresponding description.
    PORTS = []
    START_POSITIONS = []
    NUMBER_LIST = []
    N_WOOD = 4
    N_WHEAT = 4
    N_SHEEP = 4
    N_BRICK = 3
    N_STONE = 3
    N_DESERT = 1
