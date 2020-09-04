from typing import Dict

from aiohttp import web

from ..player import Player
from .core import Play, register_play
from .build import BuildSettlement, BuildCity


@register_play(play_name='steal')
class Steal(Play):
    def __init__(self, player: Player, to_steal_player: Player):
        Play.__init__(self, player=player)
        self.to_steal_player = to_steal_player

    def can_update_game(self, game) -> bool:
        if game.discard_cards or game.to_build_roads > 0:
            return False

        # Make sure that player to steal from is different than player.
        if self.player.name == self.to_steal_player.name:
            return False

        # Check if player we should steal from is amongst the players we can steal from.
        # That is the players touching the thief.
        for play in game.play_list:
            # Take only plays regarding the player we should steal from.
            if play.player.name != self.to_steal_player.name:
                continue

            # If play is not the building of a settlement or a city we skip it.
            if not (isinstance(play, BuildSettlement) or isinstance(play, BuildCity)):
                continue

            # Otherwise if the thief land touches the position of the built city or settlement
            # then we can steal from the player.
            if game.thief_position in play.position:
                return True

        return False

    def update_game(self, game):
        # Get player to steal from.
        to_steal_player = game.get_player_by_name(self.to_steal_player.name)

        # If player has no materials we reset to steal players and continue.
        if to_steal_player.n_materials == 0:
            game.to_steal_players = None

        # Otherwise take a random material from to_steal player, add it to player and only then reset to_steal_players.
        material = to_steal_player.get_random_material()
        to_steal_player.update_materials(material=material, number=-1)
        game.get_player_by_name(self.player.name).update_materials(material=material, number=1)
        game.to_steal_players = None

    @classmethod
    def from_frontend(cls, json_data: Dict, *args, **kwargs) -> 'Steal':
        return Steal(player=Player.from_frontend(json_data=json_data['player']),
                     to_steal_player=Player(name=json_data['to_steal_player'], color='black'))

    @classmethod
    def from_database(cls, json_data: Dict, *args, **kwargs) -> 'Steal':
        return Steal(player=Player.from_database(json_data=json_data['player']),
                     to_steal_player=Player(name=json_data['to_steal_player'], color='black'))

    @classmethod
    def pre_process_web_request(cls, request: web.Request) -> Dict:
        return {'to_steal_player': request.rel_url.query['to_steal_player']}

    def to_frontend(self, *args, **kwargs) -> Dict:
        return {'player': self.player.to_frontend(),
                'toStealPlayer': self.to_steal_player.to_frontend()}

    def to_database(self) -> Dict:
        return {'player': self.player.to_database(),
                'to_steal_player': self.to_steal_player.name}

