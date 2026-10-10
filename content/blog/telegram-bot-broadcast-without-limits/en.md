---
title: How to Send Broadcasts to Bot Users Without Hitting Limits
description: How to broadcast to your whole Telegram bot audience without hitting limits: throttling, queues, 429 and 403 errors, audience segments and delivery tracking.
summary: Send broadcasts through a rate-limited queue, wait exactly retry_after on a 429, mark users who return 403 as inactive, and measure results from per-message statuses and link clicks.
---
## The short answer

A trouble-free broadcast is a **rate-limited queue**, not a `for user in users: send()` loop. What you need:

- **Speed.** Telegram's FAQ advises not sending bulk notifications faster than roughly 30 messages per second, and no more than one message per second to a single chat. Stay comfortably below that.
- **Error 429.** If Telegram answers `Too Many Requests`, wait the number of seconds in `retry_after`, then retry.
- **Error 403.** The user blocked the bot or deleted their account. Mark them inactive and stop messaging them.
- **Tracking.** Every message gets a status: sent, failed, blocked.

For large volumes, Telegram offers **paid broadcasts**: the `allow_paid_broadcast` parameter lets you exceed the free limit for Telegram Stars. Details and pricing are in the Bot API documentation.

## How to structure sending

1. **Create a campaign** in your database: text, buttons, segment, start time.
2. **Build the recipient list**: one row per user with status `pending`.
3. **A worker** takes rows in batches and sends them with a pause between messages.
4. **Each result** is written back to that table: `sent`, `blocked`, `failed`, plus the message ID.
5. **Retries** apply only to `pending` rows and temporary errors. Restarting the worker must not send anything twice.

Any queue you are comfortable with works: Redis, Celery, arq, RabbitMQ, or simply a PostgreSQL table with row locking. What matters is that state lives in the database, not in process memory.

Minimal logic with aiogram 3:

```python
import asyncio
from aiogram.exceptions import (
    TelegramForbiddenError,
    TelegramRetryAfter,
    TelegramBadRequest,
)

async def send_one(bot, user_id: int, from_chat_id: int, message_id: int) -> str:
    while True:
        try:
            await bot.copy_message(user_id, from_chat_id, message_id)
            return "sent"
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
        except TelegramForbiddenError:
            return "blocked"
        except TelegramBadRequest:
            return "failed"

async def run_campaign(bot, recipients, from_chat_id, message_id, rate=20):
    for user_id in recipients:
        status = await send_one(bot, user_id, from_chat_id, message_id)
        await save_status(user_id, status)
        await asyncio.sleep(1 / rate)
```

`copyMessage` is handy for broadcasts: you prepare the post in a staff chat, check how it looks, and the bot copies it without a "forwarded" label.

## Errors and what to do

| Telegram response | Cause | Action |
|---|---|---|
| 429 Too Many Requests | Rate exceeded | Pause for `retry_after`, then retry |
| 403 Forbidden | Bot blocked, account deleted | Set `is_active = false` |
| 400 Bad Request | Chat not found, invalid markup, broken button URL | Log it, do not retry forever |
| 5xx, timeout | Temporary failure | Retry with a delay, cap the attempts |

If you keep getting 429s, lower your overall rate instead of just waiting longer.

## Segmentation

Do not send everything to everyone. Segments raise response and reduce blocks:

- **Activity**: messaged the bot in the last month, inactive for a long time.
- **Actions**: submitted a request, bought, abandoned checkout halfway.
- **Source**: came via a specific ad link with a `start` parameter.
- **Language** of the interface or the one chosen in the bot.
- **Consent**: the user has not turned off notifications in the bot's settings.

Give users an easy way to unsubscribe: a button or a command. That beats being blocked, after which you lose the contact entirely.

## How to measure results

- **Delivery**: share of `sent` among all recipients, number of new `blocked`.
- **Clicks**: links with UTM tags or a deep link like `t.me/bot?start=camp42`, which tells the bot which broadcast brought the person in.
- **Inline button taps**: callback data with the campaign ID.
- **Target actions**: requests and payments tied to the campaign.
- **Unsubscribes and blocks** over the few days after the broadcast.

The Bot API does not report read receipts, so rely on user actions.

## Common mistakes

- Broadcasting from inside a command handler: the process stalls, and after a restart some people get the message twice.
- Sending in many parallel threads without a shared rate limiter.
- Ignoring 403s: the pool of dead users grows, and every broadcast wastes time on them.
- The same text for the entire base regardless of language and interests.

More on limits in the [Telegram bot developer FAQ](https://core.telegram.org/bots/faq).

## FAQ

### Can I speed things up by running several bots?

Each bot can only message its own users, so splitting the audience across bots usually does not solve the problem. A shared rate limiter and, if needed, paid broadcasts are more reliable.

### How long will a broadcast to a large base take?

It depends on the audience size, the chosen rate and the number of errors. You can estimate it upfront: divide the number of recipients by the sending rate and add a buffer for pauses after 429s.

### Should I send broadcasts at night to avoid disturbing people?

Rather the opposite: pick a time when your audience is active and account for time zones. Night notifications more often lead to unsubscribes and blocks.
