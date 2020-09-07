from typing import Dict, Optional

import asyncpg

from backend.games.rock_paper_scissors.models.game import Game


async def get_game_from_database(db: asyncpg.Connection, game_id: str) -> Optional[Game]:
    game_data = await get_game_data(game_id=game_id, db=db)

    # Return a dummy result if no game was found with desired id.
    if game_data is None:
        return None

    return Game.from_database(json_data=game_data)


async def get_game_data(game_id: str, db: asyncpg.Connection) -> Optional[Dict]:
    return await db.fetchrow("""
                             SELECT id AS id,
                                    player_list AS player_list, 
                                    current_round AS current_round,
                                    victory_criterion AS victory_criterion,
                                    n_plays AS n_plays
                             FROM rock_paper_scissors_active_games
                             WHERE id = $1
                             """, game_id)
