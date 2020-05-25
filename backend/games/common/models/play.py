from .player import Player
from .game_component import GameComponent


class Play(GameComponent):
    def __init__(self, player: Player):
        self.player = player
