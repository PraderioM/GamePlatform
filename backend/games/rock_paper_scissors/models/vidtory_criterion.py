import enum


class VictoryCriterion(enum.Enum):
    BY_PLAY = 0
    BY_PLAYER = 1
    BY_POINTS = 2

    @classmethod
    def from_name(cls, criterion_name: str) -> 'VictoryCriterion':
        criterion_name = criterion_name.lower()

        if criterion_name == 'by_play':
            return VictoryCriterion.BY_PLAY
        elif criterion_name == 'by_player':
            return VictoryCriterion.BY_PLAYER
        elif criterion_name == 'by_points':
            return VictoryCriterion.BY_POINTS
        else:
            raise ValueError(f'Unrecognized victory criterion `{criterion_name}`.')
