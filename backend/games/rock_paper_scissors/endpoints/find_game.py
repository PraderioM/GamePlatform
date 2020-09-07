import json
from typing import Dict

from aiohttp import web

from .utils import get_game_from_database
from ..models.game import Game
from ..models.player import Player
from backend.registration.identify import get_name_from_token


async def find_game(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    token = request.rel_url.query['token']

    async with request.app['db'].acquire() as db:
        async with db.transaction():
            out_game = await get_game_from_database(db, game_id)

            if out_game is None:
                dummy_game = get_dummy_frontend_game(game_id)
                return web.Response(
                    status=200,
                    body=json.dumps(dummy_game)
                )

            # Add new player if needed and update database.
            if out_game.n_missing_players > 0:
                name = await get_name_from_token(token=token, db=db)
                out_game.add_new_player_name(name=name)
                database_player_list = [player.to_database() for player in out_game.player_list]
                await db.execute(f"""
                                 UPDATE tic_tac_toe_active_games
                                 SET last_updated = now(), player_list = $1
                                 WHERE id = $2
                                 """, json.dumps(database_player_list), out_game.id)
            else:
                # Update last updated since a connection is made.
                await db.execute(f"""
                                 UPDATE tic_tac_toe_active_games
                                 SET last_updated = now()
                                 WHERE id = $1
                                 """, out_game.id)

            frontend_out_game = out_game.to_frontend()
            return web.Response(
                status=200,
                body=json.dumps(frontend_out_game)
            )


def get_dummy_frontend_game(game_id: str) -> Dict:
    dummy_game = Game(player_list=[Player(name='player1'), Player(name='player2')])
    return {**dummy_game.to_frontend(), 'description': f'There is no active game with id `{game_id}`.'}
