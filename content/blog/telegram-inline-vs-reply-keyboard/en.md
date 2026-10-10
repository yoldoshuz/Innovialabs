---
title: Inline vs Reply Keyboard in Telegram Bots: When to Use Each
description: How inline and reply keyboards differ in Telegram bots, how callback data, commands and the menu button work, and UX rules for clean bot navigation.
summary: A reply keyboard replaces the phone keyboard and sends text as the user, so use it for a persistent main menu; inline buttons are attached to a message and silently pass callback data, so use them for actions on that message.
---
## The key difference

Telegram bots have two kinds of buttons, and they behave in fundamentally different ways.

- A **reply keyboard** (`ReplyKeyboardMarkup`) appears in place of the phone keyboard. Tapping a button **sends its text to the chat** as the user, as if they had typed it.
- An **inline keyboard** (`InlineKeyboardMarkup`) is attached to a specific bot message. Tapping it writes nothing to the chat: the bot receives a **callback query** with hidden `callback_data` and can update that same message.

The simple rule: reply keyboards for **persistent navigation**, inline keyboards for **actions in the context of a message**.

## Reply keyboard: options and limits

Useful options:

- `resize_keyboard` fits button height to content; without it buttons are oversized.
- `one_time_keyboard` hides the keyboard after a tap, `is_persistent` keeps it visible.
- `input_field_placeholder` shows a hint in the input field.
- Special buttons can request the user's **contact**, **location** or open a **Mini App**.
- Send `ReplyKeyboardRemove` to remove the keyboard.

Downsides: every tap adds a duplicate-looking message to the chat, and the bot receives plain text it has to match against strings. Rename a button or add a translation and old handlers break.

## Inline keyboard: options and limits

Inline button types include:

- `callback_data` to pass data to the bot (up to 64 bytes);
- `url` to open a link;
- `web_app` to open a Mini App;
- `switch_inline_query` to start the bot's inline mode in another chat;
- `pay` for a payment button on an invoice;
- `copy_text` to copy text to the clipboard.

The main rule: for every callback query the bot must call **`answerCallbackQuery`**, otherwise the user sees a loading indicator on the button. That call can also show a short notification or an alert.

An inline keyboard in aiogram 3:

```python
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="Details", callback_data="item:42:info")],
    [InlineKeyboardButton(text="Add to cart", callback_data="item:42:add")],
])
```

The 64-byte limit means `callback_data` should hold a **short identifier**, not a JSON payload. The bot loads everything else from its database.

## Commands and the menu button

Two more navigation elements sit outside keyboards:

- **Commands** (`/start`, `/help`, `/catalog`) are set via BotFather or the `setMyCommands` method. The list can differ by language and chat type.
- The **menu button** to the left of the input field. With `setChatMenuButton` it either shows the command list or opens a Mini App.

For most bots a good combination is commands to enter main sections and inline buttons to work inside a section.

## UX rules for clean navigation

1. **Edit, don't multiply.** When moving through an inline menu, update the current message with `editMessageText` instead of sending a new one.
2. **Two or three buttons per row at most.** Long labels get cut off on phones.
3. **Always provide a way out:** "Back" and "Main menu" buttons.
4. **Don't mix without reason** a large reply keyboard and inline buttons on one screen; users won't know where to tap.
5. **Confirm actions** with a brief `answerCallbackQuery` notification instead of a separate message.
6. **Handle old messages.** Users may tap a week-old button; the bot should respond gracefully that the action has expired.

## Which one to use

| Task | Best option |
|---|---|
| Main menu that is always at hand | reply keyboard or menu button |
| Asking for phone number or location | reply button with a special type |
| Catalog, pagination, filters | inline buttons |
| "Yes / No" confirmation | inline buttons |
| Opening a website or Mini App | inline `url` or `web_app` button |

## FAQ

### Can I show inline and reply keyboards at the same time?

Yes, but not on the same message, because a message carries only one markup. A reply keyboard stays on screen from an earlier message while inline buttons attach to the new one.

### Why does the button keep spinning after a tap?

The bot did not call `answerCallbackQuery`. The answer is required even when there is no notification to show.

### How do I build multilingual buttons?

Inline buttons make it easy: translate the label and keep the same `callback_data`. With reply buttons you have to match the text in every language.
