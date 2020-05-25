import abc
from typing import Dict, Optional

import asyncpg

from backend.registration.identify import get_token_from_name
from .game_component import GameComponent


class Player(GameComponent):
    def __init__(self, name: Optional[str], is_bot: bool = False):
        self.name = name
        self.is_bot = is_bot

    async def get_token(self, db: asyncpg.Connection) -> Optional[str]:
        if self.is_bot:
            return None

        return await get_token_from_name(name=self.name, db=db)

    def get_bot_play(self, game):
        raise NotImplementedError('Bot is not implemented for current game.')

    @abc.abstractmethod
    def to_frontend(self, token: Optional[str] = None, *args, **kwargs) -> Dict:
        raise NotImplementedError('Sub-classes must implement to frontend method.')
