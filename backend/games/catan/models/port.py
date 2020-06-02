import enum
from typing import Set


class PortType(enum.Enum):
    Wood = 0
    Sheep = 1
    Wheat = 2
    Brick = 3
    Stone = 4
    General = 5


class Port:
    def __init__(self, port_type: PortType, intersections: Set[Set[int]]):
        self._port_type = port_type
        self.intersections = intersections
