from typing import Optional

from .player import Player
from .modifier import Modifier


class Play:
    def __init__(self, player: Player, play: int, modifier: Optional[Modifier] = None):
        self.player = player
        self.play = play
        self.modifier = modifier
