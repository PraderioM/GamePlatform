from typing import Dict, Optional

import asyncpg


async def get_game_data(game_id: str, db: asyncpg.Connection) -> Optional[Dict]:
    return await db.fetchrow("""
                             SELECT id AS id,
                                    rows AS rows,
                                    cols AS cols,
                                    current_player_index AS current_player_index,
                                    player_list AS players, 
                                    play_list AS plays,
                                    gravity AS gravity
                             FROM tic_tac_toe_active_games
                             WHERE id = $1
                             """, game_id)
