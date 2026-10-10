---
title: How to Build a Telegram Bot in Python with aiogram 3
description: Build a working Telegram bot with aiogram 3 step by step: routers, handlers, filters, reply and inline keyboards, with every piece of code explained.
summary: In aiogram 3 a bot is made of a Bot (talks to the API), a Dispatcher (receives updates) and Routers whose handlers fire when filters match; keyboards are attached to replies and start_polling runs it.
---
## The short answer

An **aiogram 3** bot has three building blocks:

- **Bot** holds the token and calls Telegram Bot API methods.
- **Dispatcher** receives updates and hands them to handlers.
- **Router** is a group of **handlers**: async functions that run when a message passes their **filters** (a command, a text, a content type).

Below is a bot with /start, a reply keyboard, an inline keyboard and button handling. You need Python 3.9+ and a token from @BotFather.

## Step 1. Environment

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install aiogram
```

Do not hardcode the token. Pass it through a `BOT_TOKEN` environment variable so it never ends up in Git.

## Step 2. Keyboards

```python
# keyboards.py
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

main_kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Services"), KeyboardButton(text="Contacts")]],
    resize_keyboard=True,
)

def services_kb():
    builder = InlineKeyboardBuilder()
    builder.button(text="Bot development", callback_data="svc:bots")
    builder.button(text="Websites", callback_data="svc:web")
    builder.adjust(1)  # one button per row
    return builder.as_markup()
```

- A **reply keyboard** replaces the phone keyboard; tapping a button sends its text as a message.
- An **inline keyboard** sits under a message; tapping sends the bot `callback_data` instead of a chat message.
- `InlineKeyboardBuilder` helps when buttons come from data; `adjust()` arranges them into rows.

## Step 3. Handlers in a router

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
        f"Hello, {message.from_user.first_name}! Pick a section.",
        reply_markup=main_kb,
    )

@router.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer("Commands: /start opens the menu, /help shows this.")

@router.message(F.text == "Services")
async def show_services(message: Message):
    await message.answer("What are you interested in?", reply_markup=services_kb())

@router.message(F.text == "Contacts")
async def show_contacts(message: Message):
    await message.answer("Write your question right here and we will reply.")

@router.callback_query(F.data.startswith("svc:"))
async def on_service(callback: CallbackQuery):
    code = callback.data.split(":", 1)[1]
    await callback.message.answer(f"You chose: {code}")
    await callback.answer()

@router.message(F.photo)
async def on_photo(message: Message):
    await message.answer("Photo received.")

@router.message()
async def fallback(message: Message):
    await message.answer("I did not get that. Tap /start to open the menu.")
```

What matters here:

- The `@router.message(...)` **decorator** registers a message handler; `@router.callback_query(...)` handles inline button taps.
- **Filters** go into the decorator: `CommandStart()`, `Command("help")`, and the **magic filter** `F` (`F.text == ...`, `F.photo`, `F.data.startswith(...)`).
- **Order matters.** Handlers are checked top to bottom and the first match wins, so the catch-all `@router.message()` with no filters goes last.
- `callback.answer()` is required: without it the user sees a loading spinner on the button.

## Step 4. Entry point

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

`include_router` attaches the router to the dispatcher. You can have many routers, for example `user_router`, `admin_router` and `payments_router`, each in its own file. `start_polling` runs long polling, where the bot asks Telegram for updates itself. In production you usually switch to a webhook.

Run it:

```bash
export BOT_TOKEN="123456:ABC..."   # Windows PowerShell: $env:BOT_TOKEN="..."
python main.py
```

## Common mistakes

- **Blocking code in a handler.** `requests` or `time.sleep` freeze the whole bot. Use async libraries (`aiohttp`, async database drivers) and `asyncio.sleep`.
- **Copying aiogram 2 examples.** `executor`, `dp.message_handler` and `types.ParseMode` from old tutorials do not work in version 3.
- **Forgetting `callback.answer()`**, so the button looks stuck.
- **One huge file.** Split handlers into routers from the start; it is harder later.
- **Token in the repository.** If it leaks, revoke it in @BotFather and issue a new one.

## FAQ

### How is aiogram 3 different from aiogram 2?

Handlers are registered on routers instead of directly on the dispatcher, filters use the magic `F` and classes like `Command`, and you start the bot with `dp.start_polling(bot)`. Version 2 code will not run without rewriting.

### How do I add a command menu next to the input field?

Call `await bot.set_my_commands([...])` with a list of `BotCommand` objects on startup, or set the commands in @BotFather. They will then appear in the menu to the left of the input field.

### How do I keep user answers between messages?

For multi-step flows aiogram has a finite state machine (FSM): you define states and keep intermediate data in memory or Redis.
