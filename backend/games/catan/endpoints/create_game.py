from typing import Dict, Optional, Tuple
from uuid import uuid4

from aiohttp import web
import asyncpg

from registration.identify import get_name_from_token
from games.common.endpoints.create_game import create_game as general_create_game
from ..models.game import Game
from ..models.player import Player
from ..global_variables import ACTIVE_GAMES_DICT


async def create_game(request: web.Request) -> web.Response:
    # Get params.
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    extended = True if request.rel_url.query['expansion'] == 'true' else False

    token = request.rel_url.query['token']

    async def get_new_game(db: asyncpg.Connection) -> Tuple[Optional[Game], Optional[Dict]]:
        # Check correctness of input data.
        dummy_game = Game(current_player_index=0, turn_index=0,
                          play_list=[], player_list=[], id_=None)
        error_message: Optional[str] = None
        if pc < 1:
            error_message = f'There must be at least one player character however ' \
                            f'got number of player characters of {pc}'
        elif npc < 0:
            error_message = f'There cannot be a negative number of non player characters however ' \
                            f'got number of non player characters of {npc}'
        elif pc + npc <= 1:
            error_message = f'CATAN is a game of at least two players but got total number of players of {npc + pc}.'
        elif npc > 0:
            error_message = f'Artificial intelligence is not yet implemented and npc player cannot be set.'
        elif npc + pc > 4 and not extended:
            error_message = f'CATAN is currently implemented only for a maximum of 4 players but got `{npc + pc}`.'
            if npc + pc <= 6:
                error_message += ' Please select the expansion to increase the maximum to 6 players.'
        elif npc + pc > 6 and extended:
            error_message = f'CATAN is currently implemented only for a maximum of 6 players but got `{npc + pc}`.'

        if error_message is not None:
            return None, dummy_game.to_frontend(db=None, description=error_message)

        # If settings are correct we create a new game.
        name_list = [await get_name_from_token(token=token, db=db)] + [None] * (npc + pc - 1)
        color_list = ['red', 'blue', 'green', 'yellow', 'black', 'brown',
                      'pink', 'aqua', 'chartreuse', 'gold', 'blanchedalmond', 'chocolate'][:npc+pc]
        # is_bot_list = [False] * pc + [True] * npc
        player_list = [Player(name=name, color=color) for name, color in zip(name_list, color_list)]

        return Game(current_player_index=0, turn_index=0, play_list=[],
                    player_list=player_list, id_=str(uuid4()), extended=extended), None

    async def add_new_game_to_database(new_game: Game, db: asyncpg.Connection):
        ACTIVE_GAMES_DICT[new_game.id] = new_game

    return await general_create_game(pool=request.app['db'],
                                     token=token,
                                     get_new_game=get_new_game,
                                     add_new_game_to_database=add_new_game_to_database)
