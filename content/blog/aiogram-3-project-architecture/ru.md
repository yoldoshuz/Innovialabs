---
title: Архитектура проекта на aiogram 3: роутеры, middleware и DI
description: Поддерживаемая структура бота на aiogram 3: роутеры по фичам, middleware для внедрения сессий БД и сервисов, типизированный конфиг и тестируемые хендлеры.
summary: Разделите хендлеры на роутеры по фичам, держите бизнес-логику в сервисах, передавайте сессию БД и сервисы через middleware — и хендлеры останутся тонкими и легко тестируемыми.
---
## Коротко

Поддерживаемый бот на aiogram 3 держится на четырёх идеях:

- **Роутеры по фичам**: один модуль на область (старт, каталог, заказы, админка), собираются в одном месте.
- **Тонкие хендлеры**: разбирают апдейт и отвечают; логика живёт в **сервисах**, которые ничего не знают о Telegram.
- **Внедрение зависимостей через middleware**: сессия БД и сервисы приходят аргументами хендлера, а не глобальным импортом.
- **Типизированный конфиг** в одном объекте, который передаётся через диспетчер.

Новая фича — это новый роутер, а бизнес-логика тестируется без бота.

## Структура проекта

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

Главное правило — направление зависимостей: `handlers` знают о `services`, `services` — о `db`, и ничто ниже хендлеров не импортирует aiogram.

## Конфиг

Читайте настройки один раз при старте и валидируйте их. С pydantic-settings отсутствующая переменная роняет запуск, а не первый запрос пользователя.

```python
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    bot_token: SecretStr
    database_url: str
    admin_ids: list[int] = []
```

`SecretStr` не даёт токену попасть в логи и трейсбеки, если объект настроек где-то распечатают.

## Роутеры

Каждый модуль хендлеров создаёт свой `Router` и регистрирует на нём обработчики. Точка входа подключает их по порядку.

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

**Порядок важен**: апдейт уходит в первый хендлер, чьи фильтры совпали. Ставьте специфичные роутеры раньше, а «ловушки для всего» (например, «неизвестная команда») — в последний роутер.

## Middleware и внедрение зависимостей

aiogram передаёт значения из словаря `data` в параметры хендлера по имени. Middleware — естественное место, чтобы положить туда сессию БД и сервисы.

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

Каждый апдейт получает свою сессию, которая закрывается после хендлера. Явно решите, где происходит commit: в сервисе после успешной операции или в middleware после хендлера.

Два вида регистрации:

| Регистрация | Когда срабатывает | Для чего |
|---|---|---|
| `dp.update.outer_middleware(...)` | на каждый апдейт, до роутинга | логирование, троттлинг, блокировка забаненных |
| `router.message.middleware(...)` | только если фильтры хендлера прошли | данные, нужные конкретным хендлерам |

## Точка входа

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

Именованные аргументы `start_polling` попадают в общие данные, поэтому любой хендлер или фильтр может запросить `settings: Settings`.

## Фильтры доступа

Проверка админа — это фильтр на весь роутер, а не код в каждом хендлере.

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

## Тесты

Раз зависимости приходят аргументами, хендлер — обычная async-функция. Сервисы тестируйте на тестовой базе, хендлеры — с моками (здесь используется pytest-asyncio):

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

## Частые ошибки

- Глобальный engine или сессия, импортированные прямо в хендлеры: сложно тестировать и легко «потерять» соединения.
- Бизнес-логика внутри хендлеров: её нельзя переиспользовать из админки, API или фоновой задачи.
- «Ловушка для всего» в первом роутере, которая перехватывает всё, что ниже.
- Middleware на `router.message` и ожидание, что оно сработает и для callback-запросов.

Подробности о middleware и роутинге — в [документации aiogram](https://docs.aiogram.dev/).

## FAQ

### Нужна ли DI-библиотека вроде dishka?

Не обязательно. Для большинства ботов хватает middleware, которое кладёт сессию и сервисы в `data`. DI-контейнер оправдан, когда зависимостей много, у них разный жизненный цикл или те же сервисы используются в веб-API.

### Где хранить FSM-состояния?

Рядом с фичей, которая их использует: `StatesGroup` оформления заказа лежит в модуле заказов. В продакшене используйте постоянное хранилище, например Redis, чтобы состояния переживали перезапуск.

### Как не открывать сессию БД для апдейтов, которым она не нужна?

Регистрируйте middleware не на `dp.update`, а на конкретных роутерах или типах событий, которые работают с базой. Тогда оно сработает только после того, как их фильтры совпали.
