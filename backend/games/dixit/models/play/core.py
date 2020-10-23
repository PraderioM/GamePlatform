from abc import abstractmethod
from typing import Dict, Type

from aiohttp import web
import asyncpg

from games.common.models.play import Play as BasePlay
from ..player import Player


class Play(BasePlay):
    PLAY_TYPES: Dict[str, Type['Play']] = {}

    def __init__(self, player: Player):
        BasePlay.__init__(self, player=player)
        self.player: Player = self.player

    @abstractmethod
    def update_game(self, game):
        raise NotImplementedError('`update_game` method should be implemented.')

    @abstractmethod
    def update_database(self, db: asyncpg.connection, active_games_table: str, database_data: Dict):
        raise NotImplementedError('`update_database` method should be implemented.')

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Play':
        raise NotImplementedError('From database method should be implemented.')

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Play':
        play_name = json_data.pop('play_name')
        return cls.PLAY_TYPES[play_name].from_frontend(json_data)

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        play_name = request.rel_url.query['play_name']
        return {'play_name': play_name, **cls.PLAY_TYPES[play_name].pre_process_web_request(request=request)}

    def to_database(self) -> Dict:
        raise NotImplementedError('To database method should not be implemented.')

    def to_frontend(self, *args, **kwargs) -> Dict:
        raise NotImplementedError('To frontend method should not be implemented.')


def register_play(play_name: str):
    def _register_play(cls: Type[Play]) -> Type[Play]:
        if play_name in Play.PLAY_TYPES.keys():
            raise ValueError(f'Repeated key {play_name}.')
        Play.PLAY_TYPES[play_name] = cls

        return cls

    return _register_play
