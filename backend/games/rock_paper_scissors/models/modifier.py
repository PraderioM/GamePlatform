import enum


class Modifier(enum.Enum):
    CANNIBAL = 0
    CLONE = 1
    I = 2

    @classmethod
    def from_name(cls, modifier_name: str) -> 'Modifier':
        modifier_name = modifier_name.lower()

        if modifier_name == 'cannibal':
            return Modifier.CANNIBAL
        elif modifier_name == 'clone':
            return Modifier.CLONE
        elif modifier_name == 'i':
            return Modifier.I
        else:
            raise ValueError(f'Unrecognized modifier `{modifier_name}`.')
