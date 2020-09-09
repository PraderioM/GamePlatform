from typing import Dict

from aiohttp import web
import asyncpg

from backend.registration.identify import get_name_from_token
from ..models.play import Play
from ..models.modifier import Modifier
from .utils import get_game_from_database


async def make_play(request: web.Request) -> web.Response:
    game_id = request.rel_url.query['game_id']
    token = request.rel_url.query['token']
    play_number = int(request.rel_url.query['play'])
    modifier = Modifier.from_name(request.rel_url.query['modifier'])

    async with request.app['db'].acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            game = await get_game_from_database(db, game_id)

            # If all players aren't ready we cannot make any play.
            if game.n_missing_players > 0:
                return web.Response(status=200)

            # Get player requesting to make play.
            name = await get_name_from_token(token=token, db=db)
            player = game.get_player_by_name(name=name)

            if player is not None:
                play = Play(player, play_number, modifier)
                game.add_play(play)

            # Update database.
            database_data = game.to_database()
            await update_database(db, database_data)

            return web.Response(status=200)


async def update_database(db: asyncpg.connection, database_data: Dict):
    await db.execute(f"""
                     UPDATE rock_paper_scissors_active_games
                     SET player_list = $1,
                         current_round = $2,
                         n_plays = $3
                     WHERE id = $4
                     """,
                     database_data['player_list'],
                     database_data['current_round'],
                     database_data['n_plays'],
                     database_data['id'])
