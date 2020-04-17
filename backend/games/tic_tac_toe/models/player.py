from typing import Dict, Optional, Union

import asyncpg


class Player:
    def __init__(self, name: Optional[str], symbol: str, is_bot: bool = False):
        self.name = name
        self.symbol = symbol
        self.is_bot = is_bot

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

    def to_frontend(self, token: Optional[str], points: int) -> Dict[str, Union[str, bool]]:
        return {
            'name': self.name,
            'isBot': self.is_bot,
            'symbol': self.symbol,
            'token': token,
            'points': points
        }

    async def get_token(self, db: asyncpg.Connection) -> Optional[str]:
        if self.is_bot:
            return None

        return await db.fetchval("""
                                 SELECT token
                                 FROM users
                                 WHERE name == $1
                                 """, self.name)

    def get_bot_play(self, game):
        # Todo implement
        pass
