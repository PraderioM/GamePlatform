from math import floor
from random import shuffle
from typing import Dict, Optional, Tuple
from uuid import uuid4

from aiohttp import web
import asyncpg

from registration.identify import get_name_from_token
from games.common.endpoints.create_game import create_game as general_create_game
from ..models.game import Game
from ..models.player import Player
from ..constants import DECK_SIZE


async def create_game(request: web.Request) -> web.Response:
    # Get params.
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    total_points = int(request.rel_url.query['total_points'])
    image_set = request.rel_url.query['image_set']
    n_cards = int(request.rel_url.query['n_cards'])

    token = request.rel_url.query['token']

    return await general_create_game(pool=request.app['db'],
                                     get_new_game=lambda db: get_new_game(db,
                                                                          pc=pc,
                                                                          npc=npc,
                                                                          total_points=total_points,
                                                                          image_set=image_set,
                                                                          n_cards=n_cards,
                                                                          token=token),
                                     add_new_game_to_database=add_new_game_to_database)


async def get_new_game(db: asyncpg.Connection, pc: int, npc: int,
                       total_points: int,
                       image_set: str, n_cards: int,
                       token: str) -> Tuple[Optional[Game], Optional[Dict]]:
    # Check correctness of input data.
    dummy_game = Game(current_player_index=0, player_list=[Player('player_1'), Player('player_2')], id_=str(uuid4()))
    error_message: Optional[str] = None

    if pc < 1:
        error_message = f'There must be at least one player character however ' \
                        f'got number of player characters of {pc}'
    elif npc < 0:
        error_message = f'There cannot be a negative number of non player characters however ' \
                        f'got number of non player characters of {npc}'
    elif pc + npc < 3:
        error_message = f'This is a game of at least three players but got total number of players of {npc + pc}.'

    elif total_points <= 0:
        error_message = f'Goal number of points must be strictly positive however got {total_points}.'

    elif n_cards < DECK_SIZE * (npc + pc):
        error_message = f'There can be at most {floor(n_cards / DECK_SIZE)} players with image set `{image_set}`'

    if error_message is not None:
        return None, {**dummy_game.to_frontend(), 'description': error_message}

    # If settings are correct we create a new game.
    all_cards = [i for i in range(n_cards)]
    shuffle(all_cards)
    deck_list = [all_cards[i*DECK_SIZE: (i+1)*DECK_SIZE] for i in range(npc + pc)]
    is_bot_list = [False] * pc + [True] * npc
    name_list = [await get_name_from_token(token=token, db=db)] + [None] * (npc + pc - 1)
    player_list = [
        Player(name=name, is_bot=is_bot, deck=deck)
        for name, is_bot, deck in zip(name_list, is_bot_list, deck_list)
    ]

    return Game(current_player_index=0,
                player_list=player_list,
                image_set=image_set,
                n_cards=n_cards,
                total_points=total_points,
                id_=str(uuid4())), None


async def add_new_game_to_database(new_game: Game, db: asyncpg.Connection):
    database_game = new_game.to_database()
    # Inset name in database.
    await db.execute("""
                     INSERT INTO dixit_active_games (id, player_list, n_cards, total_points, image_set, played_cards)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     """, new_game.id,
                     database_game['player_list'],
                     database_game['n_cards'],
                     database_game['total_points'],
                     database_game['image_set'],
                     database_game['played_cards'])
