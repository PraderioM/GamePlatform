import json
from typing import Awaitable, Callable, Optional

from aiohttp import web
import asyncpg

from backend.registration.identify import get_name_from_token
from backend.games.common.models.game import Game
from backend.games.common.models.play import Play
from backend.games.common.models.player import Player


async def make_play(pool: asyncpg.pool.Pool,
                    token: str, active_games_table: str,
                    get_game_from_database: Callable[[asyncpg.Connection], Awaitable[Game]],
                    get_play: Callable[[Game, Player], Optional[Play]],
                    get_bot_play: Optional[Callable[[Game, Player], Optional[Play]]] = None) -> web.Response:
    async with pool.acquire() as db:
        db: asyncpg.Connection = db
        async with db.transaction():
            game = await get_game_from_database(db)

            # If all players aren't ready we cannot make any play.
            if game.n_missing > 0:
                return web.Response(
                    status=200,
                    body=json.dumps(game.to_frontend(db=db))
                )

            # Get player requesting to make play.
            name = await get_name_from_token(token=token, db=db)
            player = game.get_player_from_name(name=name)

            if player is not None:
                play = get_play(game, player)
                game.add_play(play)

            # Make bot plays.
            while game.current_player.is_bot:
                if get_bot_play is None:
                    raise NotImplementedError
                else:
                    play = get_bot_play(game, game.current_player)
                    game.add_play(play)

            # Update database.
            database_data = game.to_database()
            await db.execute(f"""
                             UPDATE {active_games_table}
                             SET current_player_index = $1, players = $2, plays = $3, last_updated = now()
                             WHERE id = $4
                             """,
                             database_data['current_player_index'],
                             database_data['players'],
                             database_data['plays'],
                             database_data['id'])

            return web.Response(
                status=200,
                body=json.dumps(game.to_frontend(db=db))
            )
