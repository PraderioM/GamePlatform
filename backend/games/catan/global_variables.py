import asyncio

LOCK = asyncio.Lock()
ACTIVE_GAMES_DICT = {}
