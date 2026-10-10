---
title: Как написать Telegram-бота на Python с aiogram 3
description: Пошагово собираем рабочего Telegram-бота на aiogram 3: роутеры, хендлеры, фильтры, reply- и inline-клавиатуры, и разбираем, что делает каждая строка.
summary: В aiogram 3 бот состоит из Bot (связь с API), Dispatcher (приём апдейтов) и Router с хендлерами, которые срабатывают по фильтрам; клавиатуры прикрепляются к ответам, а запуск делается через start_polling.
---
## Короткий ответ

Бот на **aiogram 3** собирается из трёх частей:

- **Bot** — объект с токеном, через который вы вызываете методы Telegram Bot API.
- **Dispatcher** — получает апдейты и раздаёт их обработчикам.
- **Router** — группа **хендлеров**: асинхронных функций, которые срабатывают, когда сообщение проходит **фильтры** (команда, текст, тип контента).

Ниже — бот с командой /start, обычной и inline-клавиатурой и обработкой нажатий. Нужны Python 3.9+ и токен от @BotFather.

## Шаг 1. Окружение

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install aiogram
```

Токен не пишите в код. Передайте его через переменную окружения `BOT_TOKEN` — так он не попадёт в Git.

## Шаг 2. Клавиатуры

```python
# keyboards.py
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

main_kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Услуги"), KeyboardButton(text="Контакты")]],
    resize_keyboard=True,
)

def services_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="Разработка ботов", callback_data="svc:bots")
    builder.button(text="Сайты", callback_data="svc:web")
    builder.adjust(1)  # по одной кнопке в ряд
    return builder.as_markup()
```

- **Reply-клавиатура** заменяет обычную клавиатуру телефона; нажатие отправляет текст кнопки как сообщение.
- **Inline-клавиатура** висит под сообщением; нажатие присылает боту `callback_data`, а не текст в чат.
- `InlineKeyboardBuilder` удобен, когда кнопки строятся из данных: `adjust()` раскладывает их по рядам.

## Шаг 3. Хендлеры в роутере

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
        f"Здравствуйте, {message.from_user.first_name}! Выберите раздел.",
        reply_markup=main_kb,
    )

@router.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer("Команды: /start — меню, /help — помощь.")

@router.message(F.text == "Услуги")
async def show_services(message: Message):
    await message.answer("Что вас интересует?", reply_markup=services_kb())

@router.message(F.text == "Контакты")
async def show_contacts(message: Message):
    await message.answer("Напишите вопрос прямо сюда, мы ответим.")

@router.callback_query(F.data.startswith("svc:"))
async def on_service(callback: CallbackQuery):
    code = callback.data.split(":", 1)[1]
    await callback.message.answer(f"Вы выбрали: {code}")
    await callback.answer()

@router.message(F.photo)
async def on_photo(message: Message):
    await message.answer("Фото получено.")

@router.message()
async def fallback(message: Message):
    await message.answer("Не понял. Нажмите /start, чтобы открыть меню.")
```

Что здесь важно:

- **Декоратор** `@router.message(...)` регистрирует функцию как обработчик сообщений, `@router.callback_query(...)` — нажатий inline-кнопок.
- **Фильтры** передаются в декоратор: `CommandStart()`, `Command("help")`, **магический фильтр** `F` (`F.text == ...`, `F.photo`, `F.data.startswith(...)`).
- **Порядок важен.** Хендлеры проверяются сверху вниз, срабатывает первый подходящий. Поэтому «ловушка» `@router.message()` без фильтров стоит последней.
- `callback.answer()` обязателен: без него у пользователя будет крутиться индикатор загрузки на кнопке.

## Шаг 4. Точка входа

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

`include_router` подключает роутер к диспетчеру. Роутеров может быть много: например, `user_router`, `admin_router`, `payments_router` — каждый в своём файле. `start_polling` запускает long polling: бот сам опрашивает Telegram. Для продакшена обычно переходят на webhook.

Запуск:

```bash
export BOT_TOKEN="123456:ABC..."   # Windows PowerShell: $env:BOT_TOKEN="..."
python main.py
```

## Частые ошибки

- **Синхронный код внутри хендлера.** `requests` или `time.sleep` блокируют весь бот. Используйте асинхронные библиотеки (`aiohttp`, асинхронные драйверы БД) и `asyncio.sleep`.
- **Код из примеров для aiogram 2.** `executor`, `dp.message_handler` и `types.ParseMode` из старых туториалов в версии 3 не работают.
- **Забытый `callback.answer()`** — кнопка «зависает».
- **Один большой файл.** Разносите хендлеры по роутерам сразу, потом это сложнее.
- **Токен в репозитории.** Если токен утёк, перевыпустите его в @BotFather.

## FAQ

### Чем aiogram 3 отличается от aiogram 2?

Вместо регистрации хендлеров прямо на диспетчере появились роутеры, фильтры переписаны на магический `F` и классы вроде `Command`, а запуск идёт через `dp.start_polling(bot)`. Код второй версии без переделки не запустится.

### Как сделать меню команд рядом с полем ввода?

Вызовите `await bot.set_my_commands([...])` со списком `BotCommand` при старте или задайте команды в @BotFather. После этого они появятся в меню слева от поля ввода.

### Как сохранять ответы пользователя между сообщениями?

Для многошаговых сценариев в aiogram есть машина состояний (FSM): вы задаёте состояния и храните промежуточные данные в памяти или Redis.
