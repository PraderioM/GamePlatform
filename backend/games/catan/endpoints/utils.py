from typing import Dict, Optional

import asyncpg

from ..global_variables import ACTIVE_GAMES_DICT
from ..models.game import Game


async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Optional[Game]:
    return ACTIVE_GAMES_DICT.get(game_id, None)


def get_dummy_frontend_game(description: str) -> Dict:
    dummy_game = Game(current_player_index=0, turn_index=0,
                      play_list=[], player_list=[], id_=None)
    return dummy_game.to_frontend(db=None, description=description)
