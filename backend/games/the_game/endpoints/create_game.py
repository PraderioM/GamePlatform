from random import shuffle
from typing import Dict, Optional, Tuple
from uuid import uuid4

from aiohttp import web
import asyncpg

from registration.identify import get_name_from_token
from games.common.endpoints.create_game import create_game as general_create_game
from ..models.game import Game
from ..models.player import Player
from ..models.pile import Pile
from ..constants import ACTIVE_GAMES_TABLE, N_DESCENDING_PILES, N_ASCENDING_PILES, MAX_CARDS


async def create_game(request: web.Request) -> web.Response:
    # Get params.
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    on_fire = True if request.rel_url.query['on_fire'] == 'true' else False
    deck_size = int(request.rel_url.query['deck_size'])
    min_to_play_cards = int(request.rel_url.query['min_to_play_cards'])

    token = request.rel_url.query['token']

    return await general_create_game(pool=request.app['db'],
                                     get_new_game=lambda db: get_new_game(db,
                                                                          pc=pc,
                                                                          npc=npc,
                                                                          on_fire=on_fire,
                                                                          deck_size=deck_size,
                                                                          min_to_play_cards=min_to_play_cards,
                                                                          token=token),
                                     add_new_game_to_database=add_new_game_to_database)


async def get_new_game(db: asyncpg.Connection,
                       pc: int,
                       npc: int,
                       on_fire: bool,
                       deck_size: int,
                       min_to_play_cards: int,
                       token: str) -> Tuple[Optional[Game], Optional[Dict]]:
    # Check correctness of input data.
    dummy_game = Game(current_player_index=0, player_list=[Player('player_1', deck_size)],
                      pile_list=[],
                      id_=None)
    error_message: Optional[str] = None

    if pc < 1:
        error_message = f'There must be at least one player character however ' \
                        f'got number of player characters of {pc}'
    elif npc < 0:
        error_message = f'There cannot be a negative number of non player characters however ' \
                        f'got number of non player characters of {npc}'
    elif pc + npc > 5:
        error_message = f'This is a game of at most five players but got total number of {npc + pc} players.'

    elif deck_size <= 0:
        error_message = f'Deck size must be strictly positive however got a deck size of {deck_size}.'

    elif deck_size > (MAX_CARDS - 2) / (npc + pc):
        error_message = f'Deck size must lower than {int(MAX_CARDS / (npc + pc))} for games of '
        error_message += f'{npc + pc} player however got a deck size of {deck_size}.'

    elif min_to_play_cards > deck_size:
        error_message = f'Min to play cards must be greater than the deck size however got a deck size of {deck_size}'
        error_message += f'and min to play cards of {min_to_play_cards}.'

    if error_message is not None:
        return None, {**dummy_game.to_frontend(), 'description': error_message}

    # If settings are correct we create a new game.
    remaining_cards = [i for i in range(2, MAX_CARDS)]
    shuffle(remaining_cards)
    deck_list = [remaining_cards[i*deck_size: (i+1)*deck_size] for i in range(npc + pc)]
    is_bot_list = [False] * pc + [True] * npc
    name_list = [await get_name_from_token(token=token, db=db)] + [None] * (npc + pc - 1)
    player_list = [
        Player(name=name, original_deck_length=len(deck), deck=deck, is_bot=is_bot)
        for name, is_bot, deck in zip(name_list, is_bot_list, deck_list)
    ]

    ascending_pile_list = [Pile(ascending=True, id_=i) for i in range(N_ASCENDING_PILES)]
    descending_pile_list = [Pile(ascending=False, id_=N_ASCENDING_PILES + i) for i in range(N_DESCENDING_PILES)]
    pile_list = ascending_pile_list + descending_pile_list

    return Game(player_list=player_list,
                pile_list=pile_list,
                id_=str(uuid4()),
                remaining_cards=remaining_cards[deck_size * (npc+pc):],
                on_fire=on_fire,
                deck_size=deck_size,
                min_to_play_cards=min_to_play_cards), None


async def add_new_game_to_database(new_game: Game, db: asyncpg.Connection):
    database_game = new_game.to_database()
    # Inset name in database.
    await db.execute(f"""
                     INSERT INTO {ACTIVE_GAMES_TABLE} (id, player_list, pile_list,
                                                       remaining_cards, on_fire, deck_size, min_to_play_cards)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     """, new_game.id,
                     database_game['player_list'],
                     database_game['pile_list'],
                     database_game['remaining_cards'],
                     database_game['on_fire'],
                     database_game['deck_size'],
                     database_game['min_to_play_cards'])
