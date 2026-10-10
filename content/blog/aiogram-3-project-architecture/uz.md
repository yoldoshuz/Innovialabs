---
title: aiogram 3 loyihasi arxitekturasi: routerlar, middleware va DI
description: aiogram 3 da qo‘llab-quvvatlash oson bot tuzilmasi: funksiyalar bo‘yicha routerlar, DB sessiyasi va servislarni middleware orqali uzatish, konfig va testlar.
summary: Handler’larni funksiyalar bo‘yicha routerlarga ajrating, biznes-mantiqni servislarda saqlang, DB sessiyasi va servislarni middleware orqali bering — shunda handler’lar yupqa va oson test qilinadigan bo‘ladi.
---
## Qisqa javob

aiogram 3 dagi qo‘llab-quvvatlash oson bot to‘rtta g‘oyaga tayanadi:

- **Funksiyalar bo‘yicha routerlar**: har bir yo‘nalish uchun bitta modul (start, katalog, buyurtmalar, admin), ular bitta joyda yig‘iladi.
- **Yupqa handler’lar**: update’ni tahlil qiladi va javob beradi; mantiq Telegram haqida hech narsa bilmaydigan **servislarda** yashaydi.
- **Middleware orqali bog‘liqliklarni uzatish**: DB sessiyasi va servislar global import emas, handler argumentlari sifatida keladi.
- **Tiplangan konfig** bitta obyektda, dispatcher orqali uzatiladi.

Yangi funksiya — bu yangi router, biznes-mantiq esa botsiz test qilinadi.

## Loyiha tuzilmasi

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

Asosiy qoida — bog‘liqliklar yo‘nalishi: `handlers` `services` haqida biladi, `services` esa `db` haqida, handler’lardan pastdagi hech narsa aiogram’ni import qilmaydi.

## Konfig

Sozlamalarni ishga tushishda bir marta o‘qing va validatsiya qiling. pydantic-settings bilan yetishmayotgan o‘zgaruvchi foydalanuvchining birinchi so‘rovida emas, ishga tushishning o‘zida xato beradi.

```python
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    bot_token: SecretStr
    database_url: str
    admin_ids: list[int] = []
```

`SecretStr` sozlamalar obyekti qayerdadir chop etilsa ham tokenni loglar va traceback’larga tushirmaydi.

## Routerlar

Har bir handler moduli o‘z `Router` ini yaratadi va handler’larni unda ro‘yxatdan o‘tkazadi. Kirish nuqtasi ularni tartib bilan ulaydi.

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

**Tartib muhim**: update filtrlari mos kelgan birinchi handler’ga boradi. Aniq routerlarni oldinroq, «hammasini ushlaydigan» handler’larni (masalan, «noma’lum buyruq») esa oxirgi routerga qo‘ying.

## Middleware va bog‘liqliklarni uzatish

aiogram `data` lug‘atidagi qiymatlarni handler parametrlariga nomi bo‘yicha uzatadi. Middleware — DB sessiyasi va servislarni u yerga joylashning tabiiy joyi.

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

Har bir update o‘z sessiyasini oladi, u handler tugagach yopiladi. Commit qayerda bo‘lishini aniq hal qiling: muvaffaqiyatli amaldan keyin servisda yoki handler’dan keyin middleware’da.

Ro‘yxatdan o‘tkazishning ikki turi:

| Ro‘yxatdan o‘tkazish | Qachon ishlaydi | Nima uchun |
|---|---|---|
| `dp.update.outer_middleware(...)` | har bir update’da, routingdan oldin | loglash, throttling, bloklangan foydalanuvchilarni to‘xtatish |
| `router.message.middleware(...)` | faqat handler filtrlari o‘tganda | aniq handler’larga kerak bo‘lgan ma’lumotlar |

## Kirish nuqtasi

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

`start_polling` ning nomlangan argumentlari umumiy ma’lumotlarga tushadi, shuning uchun istalgan handler yoki filtr `settings: Settings` ni so‘rashi mumkin.

## Kirish filtrlari

Adminni tekshirish — har bir handler’dagi kod emas, butun routerga qo‘llanadigan filtr.

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

## Testlar

Bog‘liqliklar argument sifatida kelgani uchun handler — oddiy async-funksiya. Servislarni test bazasida, handler’larni esa mock’lar bilan test qiling (bu yerda pytest-asyncio ishlatiladi):

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

## Ko‘p uchraydigan xatolar

- Handler’larga to‘g‘ridan-to‘g‘ri import qilingan global engine yoki sessiya: test qilish qiyin, ulanishlar oson «yo‘qoladi».
- Handler ichidagi biznes-mantiq: uni admin panel, API yoki fon vazifasidan qayta ishlatib bo‘lmaydi.
- Birinchi routerdagi «hammasini ushlaydigan» handler, u pastdagi hamma narsani tutib oladi.
- `router.message` dagi middleware callback so‘rovlar uchun ham ishlaydi deb kutish.

Middleware va routing tafsilotlari — [aiogram hujjatlarida](https://docs.aiogram.dev/).

## FAQ

### dishka kabi DI-kutubxona kerakmi?

Shart emas. Ko‘pchilik botlar uchun sessiya va servislarni `data` ga qo‘yadigan middleware yetarli. DI-konteyner bog‘liqliklar ko‘p bo‘lsa, ularning hayot sikli turlicha bo‘lsa yoki xuddi shu servislar veb-API’da ham ishlatilsa o‘zini oqlaydi.

### FSM holatlarini qayerda saqlash kerak?

Ularni ishlatadigan funksiya yonida: buyurtma rasmiylashtirish uchun `StatesGroup` buyurtmalar modulida turadi. Production’da holatlar qayta ishga tushirishdan keyin ham saqlanib qolishi uchun Redis kabi doimiy xotiradan foydalaning.

### DB sessiyasi kerak bo‘lmagan update’lar uchun uni ochmaslik mumkinmi?

Ha. Middleware’ni `dp.update` ga emas, ma’lumotlar bazasi bilan ishlaydigan aniq routerlar yoki hodisa turlariga ro‘yxatdan o‘tkazing. Shunda u faqat ularning filtrlari mos kelgandan keyin ishlaydi.
