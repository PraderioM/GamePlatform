from typing import Dict, Optional, Union

from games.common.models.player import Player as BasePlayer


class Player(BasePlayer):
    def __init__(self, name: Optional[str], symbol: str, is_bot: bool = False):
        self.symbol = symbol
        BasePlayer.__init__(self, name=name, is_bot=is_bot)

    @classmethod
    def from_database(cls, json_data: Dict[str, Union[bool, str]]) -> 'Player':
        return Player(name=json_data['name'], symbol=json_data['symbol'], is_bot=json_data['is_bot'])

    @classmethod
    def from_frontend(cls, json_data: Dict[str, Union[bool, str]]) -> 'Player':
        return Player(name=json_data['name'], symbol=json_data['symbol'], is_bot=json_data['isBot'])

    def to_database(self) -> Dict[str, Union[bool, str]]:
        return {
            'name': self.name,
            'is_bot': self.is_bot,
            'symbol': self.symbol,
        }

    def to_frontend(self, points: int) -> Dict[str, Union[str, bool]]:
        return {
            'name': self.name,
            'isBot': self.is_bot,
            'symbol': self.symbol,
            'points': points
        }

    def get_bot_play(self, game):
        # Todo implement
        raise NotImplementedError('Get bot play has not yet been implemented.')
        pass
