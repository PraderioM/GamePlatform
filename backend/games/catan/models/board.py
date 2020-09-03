from typing import List, Set

from .port import Port, PortType


class Board:
    def __init__(self, n_wood: int, n_wheat: int, n_sheep: int, n_brick: int, n_stone: int, n_desert: int,
                 start_positions: List[int], number_list: List[int], ports: List[Port],
                 intersections: List[Set[int]], n_knight: int, n_monopoly: int, n_materials: int,
                 n_roads: int, n_point: int, n_per_player_cities: int = 8, n_per_player_roads: int = 10,
                 n_per_player_settlements: int = 10, win_points: int = 10, min_long_road: int = 5,
                 long_road_points: int = 2, min_knights: int = 3, knights_points: int = 2,
                 max_material_cards: int = 7):
        # region land description.
        self.n_wood = n_wood
        self.n_wheat = n_wheat
        self.n_sheep = n_sheep
        self.n_brick = n_brick
        self.n_stone = n_stone
        self.n_desert = n_desert
        # endregion.

        # region table description.
        self._start_positions = start_positions[:]
        self._number_list = number_list[:]
        self._ports = ports[:]
        self._intersections = intersections[:]
        # endregion.

        # region development description.
        self.n_knight = n_knight
        self.n_monopoly = n_monopoly
        self.n_materials = n_materials
        self.n_roads = n_roads
        self.n_point = n_point
        # endregion.

        # region player description.
        self.n_per_player_cities = n_per_player_cities
        self.n_per_player_roads = n_per_player_roads
        self.n_per_player_settlements = n_per_player_settlements
        # endregion.

        # region long road conditions.
        self.min_long_road = min_long_road
        self.long_road_points = long_road_points
        # endregion.

        # region knight conditions.
        self.min_knights = min_knights
        self.knights_points = knights_points
        # endregion.

        # region winning conditions.
        self.win_points = win_points
        # endregion.

        # region materials deck conditions.
        self.max_material_cards = max_material_cards
        # endregion.

    @property
    def start_positions(self) -> List[int]:
        return self._start_positions[:]

    @property
    def number_list(self) -> List[int]:
        return self._number_list[:]

    @property
    def ports(self) -> List[Port]:
        return self._ports[:]

    @property
    def intersections(self) -> List[Set[int]]:
        return self._intersections[:]


BOARD = Board(
    n_wood=4,
    n_wheat=4,
    n_sheep=4,
    n_brick=3,
    n_stone=3,
    n_desert=1,
    start_positions=[0, 2, 4, 6, 8, 10],
    number_list=[5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11],
    ports=[
        Port(port_type=PortType.Sheep, intersections=({-18, -1, 0}, {-18, -17, 0})),
        Port(port_type=PortType.General, intersections=({-16, -15, 2}, {-15, -14, 2})),
        Port(port_type=PortType.Brick, intersections=({-14, -13, 3}, {-13, 3, 4})),
        Port(port_type=PortType.General, intersections=({-12, -11, 4}, {-11, 4, 5})),
        Port(port_type=PortType.Wood, intersections=({-10, -9, 6}, {-9, -8, 6})),
        Port(port_type=PortType.Stone, intersections=({-8, -7, 7}, {-7, 7, 8})),
        Port(port_type=PortType.General, intersections=({-7, -6, 8}, {-6, -5, 8})),
        Port(port_type=PortType.Wheat, intersections=({-5, 8, 9}, {-5, -4, 9})),
        Port(port_type=PortType.General, intersections=({-3, -2, 10}, {-2, 10, 11})),
    ],
    intersections=[
        {-18, -1, 0},
        {-18, -17, 0},
        {-17, 0, 1},
        {-17, -16, 1},
        {-16, 1, 2},
        {-16, -15, 2},
        {-15, -14, 2},
        {-2, -1, 11},
        {-1, 0, 11},
        {0, 11, 12},
        {0, 1, 12},
        {1, 12, 13},
        {1, 2, 13},
        {2, 3, 13},
        {-14, 2, 3},
        {-14, -13, 3},
        {-3, -2, 10},
        {-2, 10, 11},
        {10, 11, 17},
        {11, 12, 17},
        {12, 17, 18},
        {12, 13, 18},
        {13, 14, 18},
        {3, 13, 14},
        {3, 4, 14},
        {-13, 3, 4},
        {-13, -12, 4},
        {-4, -3, 10},
        {-4, 9, 10},
        {9, 10, 17},
        {9, 16, 17},
        {16, 17, 18},
        {15, 16, 18},
        {14, 15, 18},
        {5, 14, 15},
        {4, 5, 14},
        {-11, 4, 5},
        {-12, -11, 4},
        {-5, -4, 9},
        {-5, 8, 9},
        {8, 9, 16},
        {7, 8, 16},
        {7, 15, 16},
        {6, 7, 15},
        {5, 6, 15},
        {-10, 5, 6},
        {-11, -10, 5},
        {-6, -5, 8},
        {-7, -6, 8},
        {-7, 7, 8},
        {-8, -7, 7},
        {-8, 6, 7},
        {-9, -8, 6},
        {-10, -9, 6}
    ],
    n_knight=14,
    n_monopoly=2,
    n_materials=2,
    n_roads=2,
    n_point=5,
    n_per_player_cities=8,
    n_per_player_roads=30,
    n_per_player_settlements=10,
)

EXTENDED_BOARD = Board(
    n_wood=6,
    n_wheat=6,
    n_sheep=6,
    n_brick=5,
    n_stone=5,
    n_desert=2,
    start_positions=[0, 2, 5, 8, 10, 13],
    number_list=[2, 5, 4, 6, 3, 9, 8, 11, 11, 10, 6, 3, 8, 4, 8, 10, 11, 12, 10, 5, 4, 9, 5, 9, 12, 3, 12, 6],
    ports=[
        Port(port_type=PortType.General, intersections=({-22, -21, 0}, {-22, -1, 0})),
        Port(port_type=PortType.Wood, intersections=({-21, -20, 1}, {-20, 1, 2})),
        Port(port_type=PortType.General, intersections=({-19, -18, 2}, {-18, 2, 3})),
        Port(port_type=PortType.Brick, intersections=({-17, 3, 4}, {-17, -16, 4})),
        Port(port_type=PortType.General, intersections=({-16, -15, 5}, {-15, -14, 5})),
        Port(port_type=PortType.General, intersections=({-13, -12, 7}, {-12, 7, 8})),
        Port(port_type=PortType.Sheep, intersections=({-10, 8, 9}, {-10, -9, 9})),
        Port(port_type=PortType.General, intersections=({-9, -8, 10}, {-8, -7, 10})),
        Port(port_type=PortType.Stone, intersections=({-6, -5, 12}, {-5, 12, 13})),
        Port(port_type=PortType.Sheep, intersections=({-3, 13, 14}, {-3, -2, 14})),
        Port(port_type=PortType.Wheat, intersections=({-2, 14, 15}, {-2, -1, 15})),
    ],
    intersections=[
        {-22, -1, 0},
        {-22, -21, 0},
        {-21, 0, 1},
        {-21, -20, 1},
        {-20, 1, 2},
        {-20, -19, 2},
        {-19, -18, 2},
        {-19, -18, 2},
        {-2, -1, 15},
        {-1, 0, 15},
        {0, 15, 16},
        {0, 1, 16},
        {1, 16, 17},
        {1, 2, 17},
        {2, 3, 17},
        {-18, 2, 3},
        {-18, -17, 3},
        {-3, -2, 14},
        {-2, 14, 15},
        {14, 15, 25},
        {15, 16, 25},
        {16, 25, 26},
        {16, 17, 26},
        {17, 18, 26},
        {3, 17, 18},
        {3, 4, 18},
        {-17, 3, 4},
        {-17, -16, 4},
        {-4, -3, 13},
        {-3, 13, 14},
        {13, 14, 24},
        {14, 24, 25},
        {24, 25, 29},
        {25, 26, 29},
        {26, 27, 29},
        {18, 26, 27},
        {18, 19, 27},
        {4, 18, 19},
        {4, 5, 19},
        {-16, 4, 5},
        {-16, -15, 5},
        {-5, -4, 13},
        {-5, 12, 13},
        {12, 13, 24},
        {12, 23, 24},
        {23, 24, 29},
        {23, 28, 29},
        {27, 28, 29},
        {20, 27, 28},
        {19, 20, 27},
        {6, 19, 20},
        {5, 6, 19},
        {-14, 5, 6},
        {-15, -14, 5},
        {-6, -5, 12},
        {-6, 11, 12},
        {11, 12, 23},
        {11, 22, 23},
        {22, 23, 28},
        {21, 22, 28},
        {20, 21, 28},
        {7, 20, 21},
        {6, 7, 20},
        {-13, 6, 7},
        {-14, -13, 6},
        {-7, -6, 11},
        {-7, 10, 11},
        {10, 11, 22},
        {9, 10, 22},
        {9, 21, 22},
        {8, 9, 21},
        {7, 8, 21},
        {-12, 7, 8},
        {-13, -12, 7},
        {-8, -7, 10},
        {-9, -8, 10},
        {-9, 9, 10},
        {-10, -9, 9},
        {-10, 8, 9},
        {-11, -10, 8},
        {-12, -11, 8},
    ],
    n_knight=20,
    n_monopoly=3,
    n_materials=3,
    n_roads=3,
    n_point=5,
    n_per_player_cities=8,
    n_per_player_roads=30,
    n_per_player_settlements=10,
)
