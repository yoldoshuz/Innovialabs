---
title: aiogram 3 Project Architecture: Routers, Middlewares and DI
description: A maintainable aiogram 3 bot layout: routers per feature, a middleware that injects DB sessions and services, typed config and handlers you can unit test.
summary: Split handlers into routers by feature, keep business logic in services, give handlers a DB session and services through a middleware, and handlers stay thin and easy to test.
---
## The short answer

A maintainable aiogram 3 bot rests on four ideas:

- **Routers by feature**: one module per area (start, catalog, orders, admin), assembled in one place.
- **Thin handlers**: they parse the update and reply; logic lives in **services** that know nothing about Telegram.
- **Dependency injection through middlewares**: a DB session and services arrive as handler arguments, not as global imports.
- **Typed config** in one object, passed through the dispatcher.

A new feature becomes a new router, and business logic is tested without a bot.

## Project layout

```text
bot/
  __main__.py        # entry point: config, bot, dispatcher, start
  config.py          # settings from environment
  handlers/
    start.py
    orders.py
    admin.py
  middlewares/
    db.py            # session and services per update
  filters/
    admin.py
  keyboards/
  services/
    orders.py        # business logic, no aiogram imports
  db/
    models.py
    repositories.py
tests/
```

The key rule is the direction of dependencies: `handlers` know about `services`, `services` know about `db`, and nothing below handlers imports aiogram.

## Config

Read settings once at startup and validate them. With pydantic-settings, a missing variable fails at launch, not on the first user request.

```python
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    bot_token: SecretStr
    database_url: str
    admin_ids: list[int] = []
```

`SecretStr` keeps the token out of logs and tracebacks when the settings object is printed.

## Routers

Each handler module creates its own `Router` and registers handlers on it. The entry point includes them in order.

```python
# handlers/orders.py
from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from bot.services.orders import OrderService

router = Router()

@router.message(Command("orders"))
async def list_orders(message: Message, orders: OrderService) -> None:
    items = await orders.list_for_user(message.from_user.id)
    await message.answer(orders.format_list(items))
```

**Order matters**: an update goes to the first handler whose filters match. Put specific routers first and catch-all handlers (for example, "unknown command") in the last router.

## Middlewares and dependency injection

aiogram passes values from the `data` dictionary into handler parameters by name. A middleware is the natural place to put a DB session and services there.

```python
# middlewares/db.py
from typing import Any, Awaitable, Callable

from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from sqlalchemy.ext.asyncio import async_sessionmaker

from bot.services.orders import OrderService

class DbMiddleware(BaseMiddleware):
    def __init__(self, session_pool: async_sessionmaker) -> None:
        self.session_pool = session_pool

    async def __call__(
        self,
        handler: Callable[[TelegramObject, dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: dict[str, Any],
    ) -> Any:
        async with self.session_pool() as session:
            data["session"] = session
            data["orders"] = OrderService(session)
            return await handler(event, data)
```

Each update gets its own session, which closes when the handler finishes. Decide explicitly where commits happen: in the service after a successful operation, or in the middleware after the handler returns.

Two kinds of registration:

| Registration | Runs | Good for |
|---|---|---|
| `dp.update.outer_middleware(...)` | for every update, before routing | logging, throttling, blocking banned users |
| `router.message.middleware(...)` | only when the handler's filters passed | data that a specific handler needs |

## The entry point

```python
# __main__.py
import asyncio

from aiogram import Bot, Dispatcher
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from bot.config import Settings
from bot.handlers import admin, orders, start
from bot.middlewares.db import DbMiddleware

async def main() -> None:
    settings = Settings()
    engine = create_async_engine(settings.database_url)
    session_pool = async_sessionmaker(engine, expire_on_commit=False)

    bot = Bot(settings.bot_token.get_secret_value())
    dp = Dispatcher()
    dp.update.middleware(DbMiddleware(session_pool))
    dp.include_routers(admin.router, orders.router, start.router)

    await dp.start_polling(bot, settings=settings)

asyncio.run(main())
```

Keyword arguments to `start_polling` go into the shared data, so any handler or filter can request `settings: Settings`.

## Access filters

Admin checks belong to a filter applied to the whole router, not to each handler.

```python
# filters/admin.py
from aiogram.filters import Filter
from aiogram.types import Message

from bot.config import Settings

class IsAdmin(Filter):
    async def __call__(self, message: Message, settings: Settings) -> bool:
        return message.from_user is not None and message.from_user.id in settings.admin_ids

# handlers/admin.py
router = Router()
router.message.filter(IsAdmin())
```

## Tests

Because dependencies arrive as arguments, a handler is a plain async function. Test services against a test database, and handlers with mocks (pytest-asyncio is assumed here):

```python
from unittest.mock import AsyncMock, MagicMock

import pytest

from bot.handlers.orders import list_orders

@pytest.mark.asyncio
async def test_list_orders_replies():
    message = MagicMock()
    message.from_user.id = 42
    message.answer = AsyncMock()
    orders = MagicMock()
    orders.list_for_user = AsyncMock(return_value=[])

    await list_orders(message, orders)

    orders.list_for_user.assert_awaited_once_with(42)
    message.answer.assert_awaited_once()
```

## Common mistakes

- A global engine or session imported straight into handlers: hard to test and easy to leak connections.
- Business logic inside handlers: it cannot be reused from an admin panel, API or scheduled job.
- A catch-all handler in the first router that swallows everything below it.
- A middleware registered on `router.message` and an expectation that it also works for callback queries.

Details of middlewares and routing are in the [aiogram documentation](https://docs.aiogram.dev/).

## FAQ

### Do I need a DI library such as dishka?

Not necessarily. For most bots a middleware that puts a session and services into `data` is enough. A DI container makes sense when there are many dependencies with different lifetimes or the same services are shared with a web API.

### Where should FSM states live?

Next to the feature that uses them: the `StatesGroup` for checkout sits in the orders module. In production, use a persistent storage such as Redis so states survive restarts.

### How do I avoid opening a DB session for updates that do not need it?

Register the middleware not on `dp.update`, but on the specific routers or event types that work with the database. Then it runs only after their filters have matched.
