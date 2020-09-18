from typing import List, Set

from games.catan.models.port import Port


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
