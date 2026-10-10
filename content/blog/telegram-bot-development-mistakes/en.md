---
title: Common Mistakes in Telegram Bot Development and How to Avoid Them
description: UX, technical and business mistakes in Telegram bots: dead-end menus, lost state on restart, hardcoded tokens, no admin tools — and how to fix each one.
summary: Most bot problems are dead-end menus, state kept in process memory, hardcoded tokens, missing error handling and no admin tools; fix them with Back buttons on every screen, Redis or a database for state, secrets in environment variables, a global error handler and a simple admin panel.
---
## Short answer

Bot mistakes fall into three groups:

- **UX** — users get stuck, don't know what to do next, or wait for a button to respond;
- **technical** — the bot loses data, breaks on limits or exposes its token;
- **business** — the owner can't change anything without a developer and can't see results.

Below are the most common mistakes and how to fix them.

## UX mistakes

| Mistake | Fix |
|---|---|
| Dead-end menus with no way back | "Back" and "Main menu" buttons on every screen; `/start` always returns home |
| The bot ignores unexpected text or stickers | a fallback "didn't get that" handler with a hint and main action buttons |
| A button keeps "loading" after a tap | always call `answerCallbackQuery`, even with no text |
| Every tap sends a new message | edit the current message with `editMessageText` for navigation |
| No way out of a form | a "Cancel" button and `/cancel` command at every step |
| Walls of text | short messages, one action per screen, details behind a button |

## Technical mistakes

**State in memory.** If form steps and carts live in RAM, users start over after every deploy or crash. Keep state in Redis or a database:

```python
import os
from aiogram import Dispatcher
from aiogram.fsm.storage.redis import RedisStorage

storage = RedisStorage.from_url(os.environ["REDIS_URL"])
dp = Dispatcher(storage=storage)
```

**Hardcoded token.** A token in the repository gives full control of the bot to anyone who sees the code. Keep it in environment variables or a secret manager and add `.env` to `.gitignore`. If it leaks, reissue it in BotFather with `/revoke`.

**Two bot instances on polling.** Two processes calling `getUpdates` at once get a conflict error and lose updates. In production, use a webhook or guarantee a single instance. A webhook and `getUpdates` can't work at the same time.

**No error or limit handling.** One exception shouldn't silently break a flow. Add a global handler, and when sending, handle `429` (wait for `retry_after`) and `403` (the user blocked the bot):

```python
from aiogram.types import ErrorEvent

@dp.errors()
async def on_error(event: ErrorEvent):
    logger.exception("Update failed: %s", event.update.update_id, exc_info=event.exception)
```

**Blocking code in an async bot.** A synchronous database driver or heavy computation in a handler slows down every user. Use async drivers and move long jobs to a queue.

**Duplicate processing.** After failures, Telegram may deliver an update again. Make money and order operations **idempotent** — check whether this payment or request was already processed.

**No logs or alerts.** Log with user and update IDs, and send critical errors to a service chat.

## Business mistakes

- **No admin tools.** Every price, text change or broadcast needs a developer. Minimum: editing texts and catalog, segmented broadcasts, lead export, basic stats, staff roles.
- **No path to a human.** A complex question hits a menu wall. Add a "Message a manager" button that hands over to a work chat or CRM.
- **No analytics.** Without "opened — chose — paid" events you can't tell whether the bot works. Log key actions from day one.
- **Personal data without rules.** If the bot collects phones and addresses, you need user consent, a privacy policy and limited staff access.

## Pre-launch checklist

- every screen has a way back;
- state survives restarts;
- the token and keys never reach the repository;
- there is a global error handler and alerts;
- the owner can edit texts and send broadcasts alone;
- key actions are tracked.

## FAQ

### Polling or webhook in production?

For a small bot, polling on one server works fine. A webhook is more convenient with several instances and in cloud infrastructure, but requires an HTTPS address.

### What if the token already ended up in a public repository?

Reissue it in BotFather right away, update the environment variables and remove it from the repository history. The old token stops working once reissued.

### Does a small bot need admin tools?

Yes, at least minimal ones: editing key texts and exporting leads. Otherwise every small change becomes a developer task.
