from typing import Dict, Optional

import asyncpg

from ..models.game import Game
from ..models.player import Player
from ..constants import ACTIVE_GAMES_TABLE


async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Optional[Game]:
    game_data = await get_game_data(game_id=game_id, db=db)

    # Return a dummy result if no game was found with desired id.
    if game_data is None:
        return None

    return Game.from_database(json_data=game_data)


async def get_game_data(game_id: str, db: asyncpg.Connection) -> Optional[Dict]:
    return await db.fetchrow(f"""
                             SELECT id AS id,
                                    player_list AS player_list, 
                                    pile_list AS pile_list, 
                                    current_player_index AS current_player_index,
                                    remaining_cards AS remaining_cards,
                                    on_fire AS on_fire,
                                    turn AS turn,
                                    deck_size AS deck_size,
                                    min_to_play_cards AS min_to_play_cards,
                                    n_actions AS n_actions
                             FROM {ACTIVE_GAMES_TABLE}
                             WHERE id = $1
                             """, game_id)


def get_dummy_frontend_game(description: str) -> Dict:
    dummy_game = Game(current_player_index=0, player_list=[Player('player_1', 6)],
                      pile_list=[],
                      id_=None)
    return {**dummy_game.to_frontend(None), 'description': description}
