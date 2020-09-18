from typing import Awaitable, Callable, Optional

from aiohttp import web
import asyncpg

from registration.identify import get_name_from_token
from games.common.models.game import Game
from games.common.models.play import Play
from games.common.models.player import Player


async def make_play(pool: asyncpg.pool.Pool,
                    token: str,
                    game_id: str,
                    get_game_from_database: Callable[[asyncpg.Connection, str], Awaitable[Game]],
                    get_play: Callable[[Game, Player], Optional[Play]],
                    update_database: Callable[[asyncpg.Connection, Game],
                                              Awaitable[None]],
                    get_bot_play: Optional[Callable[[Game, Player], Optional[Play]]] = None,
                    is_linear: bool = True) -> web.Response:
    async with pool.acquire() as db:
        async with db.transaction():
            game = await get_game_from_database(db, game_id)

            # If there is no game we do nothing.
            if game is None:
                return web.Response(status=200)

            # If all players aren't ready we cannot make any play.
            if game.n_missing > 0:
                return web.Response(status=200)

            # Get player requesting to make play.
            name = await get_name_from_token(token=token, db=db)
            player = game.get_player_from_name(name=name)

            if player is not None:
                play = get_play(game, player)
                game.add_play(play)

            # Make bot plays if game is linear otherwise both play should be arranged by game
            # once all human players have made the corresponding play.
            if is_linear:
                while game.current_player.is_bot:
                    if get_bot_play is None:
                        raise NotImplementedError('Artificial intelligence is not yet implemented.')
                    else:
                        play = get_bot_play(game, game.current_player)
                        game.add_play(play)

            # Update database.
            await update_database(db, game)

            return web.Response(status=200)
