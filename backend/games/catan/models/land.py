import enum
from typing import Optional


class LandType(enum.Enum):
    Wood = 0
    Sheep = 1
    Wheat = 2
    Brick = 3
    Stone = 4
    Desert = 5


class Land:
    def __init__(self, land_type: LandType, number: int):
        self._land_type = land_type
        self._number = number

    def get_material(self, number: int) -> Optional[LandType]:
        if self._land_type != LandType.Desert and number == self._number:
            return self._land_type
        else:
            return None

