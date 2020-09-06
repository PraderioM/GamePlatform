import enum
from typing import Optional, Set, Tuple

from .land import LandType


class PortType(enum.Enum):
    Wood = 0
    Sheep = 1
    Wheat = 2
    Brick = 3
    Stone = 4
    General = 5


class Port:
    def __init__(self, port_type: PortType, intersections: Tuple[Set[int], Set[int]]):
        self._port_type = port_type
        self.intersections = intersections

    @property
    def port_type(self) -> PortType:
        return self._port_type

    @property
    def land_type(self) -> Optional[LandType]:
        for land_type in LandType:
            if land_type.name == self._port_type.name:
                return land_type
        return None
