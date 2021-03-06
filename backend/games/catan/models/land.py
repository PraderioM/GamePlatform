import enum
from typing import Dict, Optional, Union


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

    @classmethod
    def from_json(cls, json_data: Dict[str, Union[int]]) -> 'Land':
        for land_type in LandType:
            value = json_data['land_type']
            if isinstance(value, int):
                is_land = land_type.value == value
            else:
                is_land = land_type.name.lower() == str(value).lower()

            if is_land:
                return Land(land_type=land_type, number=json_data['number'])

        return Land(land_type=LandType.Desert, number=0)

    def get_material(self, number: int) -> Optional[LandType]:
        if self._land_type != LandType.Desert and number == self._number:
            return self._land_type
        else:
            return None

    def to_json(self) -> Dict[str, int]:
        return {'land_type': self._land_type.value,
                'number': self._number}

    def to_frontend(self) -> Dict[str, int]:
        return {'landType': self._land_type.name.lower(),
                'value': self._number}

    @property
    def land_type(self) -> LandType:
        return self._land_type

    @property
    def number(self) -> int:
        return self._number
