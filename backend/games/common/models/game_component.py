import abc
from typing import Dict


class GameComponent(abc.ABC):

    @classmethod
    @abc.abstractmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'GameComponent':
        raise NotImplementedError('Sub-classes must implement from database method.')

    @classmethod
    @abc.abstractmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'GameComponent':
        raise NotImplementedError('Sub-classes must implement from frontend method.')

    @abc.abstractmethod
    def to_database(self) -> Dict:
        raise NotImplementedError('Sub-classes must implement to database method.')

    @abc.abstractmethod
    def to_frontend(self, *args, **kwargs) -> Dict:
        raise NotImplementedError('Sub-classes must implement to frontend method.')
