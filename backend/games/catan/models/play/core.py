from abc import abstractmethod
from typing import Dict, Type

from aiohttp import web

from backend.games.common.models.play import Play as BasePlay
from ..player import Player


class Play(BasePlay):
    PLAY_TYPES: Dict[str, Type['Play']] = {}

    def __init__(self, player: Player):
        BasePlay.__init__(self, player=player)
        self.player: Player = self.player

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Play':
        play_name = json_data.pop('play_name')
        return cls.PLAY_TYPES[play_name].from_database(json_data)

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        play_name = request.rel_url.query['play_name']
        return {'play_name': play_name, **cls.PLAY_TYPES[play_name].pre_process_web_request(request=request)}

    def can_update_game(self, game) -> bool:
        if not game.is_current_player(self.player):
            return False
        elif not game.thief_moved:
            return False
        elif game.discard_cards:
            return False
        elif game.to_build_roads > 0:
            return False
        elif not game.has_thrown_dice:
            return False
        else:
            return True

    def can_update_game_setup_round(self, game) -> bool:
        return False

    @abstractmethod
    def update_game(self, game):
        raise NotImplementedError('`update_game` is not implemented.')

    @staticmethod
    def game_pre_processing(game):
        game.reset_offer()

    @property
    def play_points(self) -> int:
        return 0

    def to_database(self) -> Dict:
        return {'player': self.player.to_database()}

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {'player': self.player.to_frontend()}


def register_play(cls: Type[Play], play_name: str):
    if play_name in Play.PLAY_TYPES.keys():
        raise ValueError(f'Repeated key {play_name}.')
    Play.PLAY_TYPES[play_name] = cls

    def to_database(self) -> Dict:
        out_dict = self.to_database()
        if not isinstance(out_dict, Dict):
            raise ValueError('`to_database` method must return a dictionary.')
        elif 'play_name' in out_dict.keys():
            raise ValueError('`to_database` method cannot return a dictionary with a key named `play_name`.')

        return {**out_dict, **{'play_name': play_name}}

    cls.to_database = to_database

    return cls
