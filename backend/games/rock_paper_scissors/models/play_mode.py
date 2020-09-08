import enum


class PlayMode(enum.Enum):
    CLASSIC = 0
    SMBC = 1

    @classmethod
    def from_name(cls, mode_name: str) -> 'PlayMode':
        mode_name = mode_name.lower()

        if mode_name == 'classic':
            return PlayMode.CLASSIC
        elif mode_name == 'smbc':
            return PlayMode.SMBC
        else:
            raise ValueError(f'Unrecognized play mode `{mode_name}`.')
