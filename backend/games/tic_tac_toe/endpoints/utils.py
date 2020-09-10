from typing import Dict, Optional

import asyncpg

from backend.games.tic_tac_toe.models.game import Game
from ..constants import ACTIVE_GAMES_TABLE


async def get_game_data(game_id: str, db: asyncpg.Connection) -> Optional[Dict]:
    return await db.fetchrow(f"""
                             SELECT id AS id,
                                    rows AS rows,
                                    cols AS cols,
                                    current_player_index AS current_player_index,
                                    player_list AS players, 
                                    play_list AS plays,
                                    gravity AS gravity
                             FROM {ACTIVE_GAMES_TABLE}
                             WHERE id = $1
                             """, game_id)


async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Optional[Game]:
    game_data = await get_game_data(game_id=game_id, db=db)

    # Return a dummy result if no game was found with desired id.
    if game_data is None:
        return None

    return Game.from_database(json_data=game_data)


def get_dummy_frontend_game(description: str) -> Dict:
    dummy_game = Game(rows=0, cols=0, current_player_index=0, gravity=False,
                      play_list=[], player_list=[], id_=None)
    return dummy_game.to_frontend(db=None, description=description)
