from typing import Dict, Union

from aiohttp import web

from .player import Player


class Play:
    def __init__(self, player: Player, play: int):
        self.player = player
        self.play = play

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Play':
        return Play(player=Player(json_data['player_name']), play=json_data['play'])

    @staticmethod
    def pre_process_web_request(request: web.Request) -> Dict[str, Union[str, int]]:
        return {'player_name': request.rel_url.query['player_name']}
