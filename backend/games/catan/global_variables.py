import asyncio

LOCK = asyncio.Lock()
LOCK_QUEUE = asyncio.Lock()
ACTIVE_GAMES_DICT = {}
