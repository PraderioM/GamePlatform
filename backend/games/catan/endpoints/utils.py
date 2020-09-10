from typing import Dict, Optional

import asyncpg

from ..constants import ACTIVE_GAMES_TABLE
from ..models.game import Game


async def get_game_data(game_id: str, db: asyncpg.Connection) -> Optional[Dict]:
    return await db.fetchrow(f"""
                             SELECT id as id,
                                    current_player_index as current_player_index,
                                    turn_index as turn_index,
                                    play_list as plays,
                                    player_list as players,
                                    development_deck as development_deck,
                                    materials_deck as materials_deck,
                                    land_list as land_list,
                                    offer as offer,
                                    extended as extended,
                                    knight_player as knight_player,
                                    long_road_player as long_road_player,
                                    discard_cards as discard_cards,
                                    thief_moved as thief_moved,
                                    to_build_roads as to_build_roads,
                                    last_dice_result as last_dice_result,
                                    thief_position as thief_position,
                                    to_steal_players as to_steal_players
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
    dummy_game = Game(current_player_index=0, turn_index=0,
                      play_list=[], player_list=[], id_=None)
    return dummy_game.to_frontend(db=None, description=description)
