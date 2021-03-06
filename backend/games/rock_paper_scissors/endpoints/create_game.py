from typing import Dict, Optional, Tuple
from uuid import uuid4

from aiohttp import web
import asyncpg

from registration.identify import get_name_from_token
from games.common.endpoints.create_game import create_game as general_create_game
from ..models.game import Game
from ..models.player import Player
from ..models.vidtory_criterion import VictoryCriterion
from ..models.play_mode import PlayMode


async def create_game(request: web.Request) -> web.Response:
    # Get params.
    npc = int(request.rel_url.query['npc'])
    pc = int(request.rel_url.query['pc'])
    n_plays = int(request.rel_url.query['n_plays'])
    total_points = int(request.rel_url.query['total_points'])
    victory_criterion = VictoryCriterion.from_name(request.rel_url.query['victory_criterion'])
    play_mode = PlayMode.from_name(request.rel_url.query['play_mode'])

    token = request.rel_url.query['token']

    return await general_create_game(pool=request.app['db'],
                                     get_new_game=lambda db: get_new_game(db,
                                                                          pc=pc,
                                                                          npc=npc,
                                                                          n_plays=n_plays,
                                                                          total_points=total_points,
                                                                          victory_criterion=victory_criterion,
                                                                          play_mode=play_mode,
                                                                          token=token),
                                     add_new_game_to_database=add_new_game_to_database)


async def get_new_game(db: asyncpg.Connection, pc: int, npc: int, n_plays: int, total_points: int,
                       victory_criterion: VictoryCriterion, play_mode: PlayMode,
                       token: str) -> Tuple[Optional[Game], Optional[Dict]]:
    # Check correctness of input data.
    dummy_game = Game(player_list=[Player('player_1'), Player('player_2')],
                      n_plays=3,
                      victory_criterion=VictoryCriterion.BY_PLAY)
    error_message: Optional[str] = None

    if pc < 1:
        error_message = f'There must be at least one player character however ' \
                        f'got number of player characters of {pc}'
    elif npc < 0:
        error_message = f'There cannot be a negative number of non player characters however ' \
                        f'got number of non player characters of {npc}'
    elif pc + npc <= 1:
        error_message = f'This is a game of at least two players but got total number of players of {npc + pc}.'

    if error_message is not None:
        return None, {**dummy_game.to_frontend(db=db), 'error_message': error_message}

    # If settings are correct we create a new game.
    name_list = [await get_name_from_token(token=token, db=db)] + [None] * (npc + pc - 1)
    is_bot_list = [False] * pc + [True] * npc
    player_list = [Player(name=name, is_bot=is_bot)
                   for name, is_bot in zip(name_list, is_bot_list)]
    return Game(player_list=player_list, n_plays=n_plays,
                victory_criterion=victory_criterion,
                play_mode=play_mode,
                total_points=total_points,
                id_=str(uuid4())), None


async def add_new_game_to_database(new_game: Game, db: asyncpg.Connection):
    database_game = new_game.to_database()
    # Inset name in database.
    await db.execute("""
                     INSERT INTO rock_paper_scissors_active_games (id, player_list, victory_criterion,
                                                                   n_plays, total_points, play_mode)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     """, new_game.id,
                     database_game['player_list'],
                     database_game['victory_criterion'],
                     new_game.n_plays,
                     database_game['total_points'],
                     database_game['play_mode'])
