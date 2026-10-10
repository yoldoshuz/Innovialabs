---
title: aiogram 3 bilan Python’da Telegram-bot yozish
description: aiogram 3 da ishlaydigan Telegram-botni bosqichma-bosqich yig‘amiz: routerlar, handlerlar, filtrlar, reply va inline klaviaturalar, har bir qator izohi bilan.
summary: aiogram 3 da bot Bot (API bilan aloqa), Dispatcher (update’larni qabul qilish) va filtrlar mos kelganda ishlaydigan handlerli Router’lardan iborat; klaviaturalar javobga biriktiriladi, ishga tushirish esa start_polling orqali.
---
## Qisqa javob

**aiogram 3** dagi bot uch qismdan yig‘iladi:

- **Bot** — token saqlanadigan obyekt, u orqali Telegram Bot API metodlari chaqiriladi.
- **Dispatcher** — update’larni qabul qilib, handlerlarga tarqatadi.
- **Router** — **handlerlar** guruhi: xabar **filtrlardan** (buyruq, matn, kontent turi) o‘tganda ishlaydigan asinxron funksiyalar.

Quyida /start buyrug‘i, oddiy va inline klaviatura hamda tugma bosilishini qayta ishlaydigan bot. Python 3.9+ va @BotFather’dan olingan token kerak.

## 1-qadam. Muhit

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install aiogram
```

Tokenni kodga yozmang. Uni `BOT_TOKEN` muhit o‘zgaruvchisi orqali bering — shunda u Git’ga tushmaydi.

## 2-qadam. Klaviaturalar

```python
# keyboards.py
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

main_kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Xizmatlar"), KeyboardButton(text="Kontaktlar")]],
    resize_keyboard=True,
)

def services_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="Bot ishlab chiqish", callback_data="svc:bots")
    builder.button(text="Saytlar", callback_data="svc:web")
    builder.adjust(1)  # har qatorda bitta tugma
    return builder.as_markup()
```

- **Reply-klaviatura** telefonning oddiy klaviaturasi o‘rnini egallaydi; tugma bosilsa, uning matni xabar sifatida yuboriladi.
- **Inline-klaviatura** xabar ostida turadi; bosilganda botga chatdagi matn emas, `callback_data` keladi.
- `InlineKeyboardBuilder` tugmalar ma’lumotlardan yasalganda qulay: `adjust()` ularni qatorlarga joylaydi.

## 3-qadam. Router’dagi handlerlar

```python
# handlers.py
from aiogram import F, Router
from aiogram.filters import Command, CommandStart
from aiogram.types import CallbackQuery, Message

from keyboards import main_kb, services_kb

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        f"Assalomu alaykum, {message.from_user.first_name}! Bo‘limni tanlang.",
        reply_markup=main_kb,
    )

@router.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer("Buyruqlar: /start — menyu, /help — yordam.")

@router.message(F.text == "Xizmatlar")
async def show_services(message: Message):
    await message.answer("Sizni nima qiziqtiradi?", reply_markup=services_kb())

@router.message(F.text == "Kontaktlar")
async def show_contacts(message: Message):
    await message.answer("Savolingizni shu yerga yozing, javob beramiz.")

@router.callback_query(F.data.startswith("svc:"))
async def on_service(callback: CallbackQuery):
    code = callback.data.split(":", 1)[1]
    await callback.message.answer(f"Siz tanladingiz: {code}")
    await callback.answer()

@router.message(F.photo)
async def on_photo(message: Message):
    await message.answer("Rasm qabul qilindi.")

@router.message()
async def fallback(message: Message):
    await message.answer("Tushunmadim. Menyuni ochish uchun /start ni bosing.")
```

Bu yerda muhimi:

- `@router.message(...)` **dekoratori** funksiyani xabarlar handleri sifatida ro‘yxatdan o‘tkazadi, `@router.callback_query(...)` esa inline-tugmalar bosilishini.
- **Filtrlar** dekoratorga beriladi: `CommandStart()`, `Command("help")`, **sehrli filtr** `F` (`F.text == ...`, `F.photo`, `F.data.startswith(...)`).
- **Tartib muhim.** Handlerlar yuqoridan pastga tekshiriladi va birinchi mos kelgani ishlaydi. Shuning uchun filtrsiz `@router.message()` eng oxirida turadi.
- `callback.answer()` majburiy: usiz foydalanuvchida tugma ustida yuklanish belgisi aylanib turadi.

## 4-qadam. Kirish nuqtasi

```python
# main.py
import asyncio
import logging
import os

from aiogram import Bot, Dispatcher

from handlers import router

async def main():
    bot = Bot(token=os.environ["BOT_TOKEN"])
    dp = Dispatcher()
    dp.include_router(router)
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
```

`include_router` router’ni dispetcherga ulaydi. Router’lar ko‘p bo‘lishi mumkin: masalan, `user_router`, `admin_router`, `payments_router` — har biri o‘z faylida. `start_polling` long polling’ni ishga tushiradi: bot Telegram’dan o‘zi so‘rab turadi. Production uchun odatda webhook’ga o‘tiladi.

Ishga tushirish:

```bash
export BOT_TOKEN="123456:ABC..."   # Windows PowerShell: $env:BOT_TOKEN="..."
python main.py
```

## Ko‘p uchraydigan xatolar

- **Handler ichida sinxron kod.** `requests` yoki `time.sleep` butun botni to‘xtatib qo‘yadi. Asinxron kutubxonalar (`aiohttp`, ma’lumotlar bazasi uchun asinxron drayverlar) va `asyncio.sleep` dan foydalaning.
- **aiogram 2 misollaridan kod.** Eski qo‘llanmalardagi `executor`, `dp.message_handler` va `types.ParseMode` 3-versiyada ishlamaydi.
- **`callback.answer()` unutilgan** — tugma «osilib» qoladi.
- **Bitta katta fayl.** Handlerlarni boshidanoq router’larga ajrating, keyin bu qiyinroq.
- **Token repozitoriyda.** Token sizib chiqsa, uni @BotFather’da qayta chiqaring.

## FAQ

### aiogram 3 aiogram 2 dan nimasi bilan farq qiladi?

Handlerlar to‘g‘ridan-to‘g‘ri dispetcherda emas, router’larda ro‘yxatdan o‘tadi, filtrlar sehrli `F` va `Command` kabi klasslarga o‘tkazilgan, ishga tushirish esa `dp.start_polling(bot)` orqali. 2-versiya kodi qayta yozilmasdan ishlamaydi.

### Kiritish maydoni yonida buyruqlar menyusini qanday qilish mumkin?

Ishga tushishda `BotCommand` ro‘yxati bilan `await bot.set_my_commands([...])` ni chaqiring yoki buyruqlarni @BotFather’da belgilang. Shundan so‘ng ular kiritish maydonining chap tomonidagi menyuda paydo bo‘ladi.

### Foydalanuvchi javoblarini xabarlar orasida qanday saqlash mumkin?

Ko‘p bosqichli ssenariylar uchun aiogram’da holatlar mashinasi (FSM) bor: siz holatlarni belgilaysiz va oraliq ma’lumotlarni xotirada yoki Redis’da saqlaysiz.
