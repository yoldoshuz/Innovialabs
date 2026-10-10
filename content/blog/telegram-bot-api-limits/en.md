---
title: Telegram Bot API Limits: Rate Limits, File Sizes and Messages
description: The documented Telegram Bot API limits on sending rate, file sizes, message length and the 429 error, and how to design a bot that stays within them.
summary: Telegram advises at most 1 message per second per chat, 20 per minute per group and about 30 per second overall; bots download files up to 20 MB, upload up to 50 MB, send text up to 4096 characters, and exceeding the rate returns a 429 error with retry_after.
---
## The main limits in one table

Telegram publishes guidance in the official Bot FAQ and the Bot API documentation. Exact thresholds can change and depend on load, so treat them as a safe ceiling rather than a guarantee.

| What is limited | Limit |
|---|---|
| Messages to one chat | about 1 per second (short bursts tolerated) |
| Messages to one group | no more than 20 per minute |
| Bulk notifications | about 30 messages per second overall |
| Bot file download (`getFile`) | up to 20 MB |
| Bot file upload | up to 50 MB, photos up to 10 MB |
| Sending a file by URL | photos up to 5 MB, other files up to 20 MB |
| Message text | 4096 characters |
| Media caption | 1024 characters |
| `callback_data` | 64 bytes |
| Results per `answerInlineQuery` | 50 |
| Items in a media group | 2 to 10 |
| Storage of unfetched updates | up to 24 hours |

For faster broadcasts Telegram offers **paid broadcasts** billed in Telegram Stars via the `allow_paid_broadcast` parameter. Check the current documentation for the conditions.

## The 429 error and retry_after

When a bot exceeds a limit, the API returns **HTTP 429 Too Many Requests**. The response includes `parameters.retry_after`: the number of seconds to wait.

The correct reaction:

1. Pause sending to that chat (or the whole queue if the limit is global).
2. Wait exactly `retry_after` seconds.
3. Retry the request.

The wrong reaction is retrying immediately in a loop. That extends the block and may lead to stricter limits.

```python
import asyncio
from aiogram.exceptions import TelegramRetryAfter

async def safe_send(bot, chat_id, text):
    while True:
        try:
            return await bot.send_message(chat_id, text)
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
```

## Designing a bot around the limits

**A send queue.** Route all outgoing messages through one rate-limited queue: a global per-second cap plus a minimum interval per chat. A spike of orders then won't turn into a wave of errors.

**Broadcasts as a separate process.** Run bulk sending as a background job that works in batches with pauses and stores progress. If it crashes, it resumes where it stopped instead of starting over and sending duplicates.

**Handle 403.** Users block bots. A `403 Forbidden` response means you can no longer message that person: flag them in the database and skip them in future broadcasts.

**Long texts.** Split them into parts under 4096 characters at paragraph boundaries, not mid-word or mid-markup. Remember photo captions are capped at 1024 characters.

**Files.** After uploading a file once, store its `file_id` and resend by ID; it is faster and saves bandwidth. If you need files beyond the standard limits, you can run your own **Local Bot API Server**, which removes the download limit and allows uploads up to 2000 MB.

**Edit instead of sending.** Update progress, statuses and menus with `editMessageText`: fewer messages means less risk of hitting the per-chat limit.

**Deleting messages.** In groups a bot can delete messages only within 48 hours of sending, so plan any auto-cleanup around that.

## Common mistakes

- Broadcasting with a plain loop over the whole database, with no pauses and no 429 handling.
- Sending several messages in a row in response to one action instead of a single message.
- Uploading the same file again instead of reusing its `file_id`.
- Storing large data in `callback_data`, which is limited to 64 bytes.
- Expecting the standard API to download a 100 MB user video.

## FAQ

### Why did my bot get a 429 while sending fewer than 30 messages per second?

Most likely it hit a per-chat or per-group limit: several messages in a row to one user, or more than 20 per minute in a group. Throttle per chat, not only globally.

### Can I ask Telegram to raise my limits?

Standard limits are not raised on request. For high-speed broadcasts there are paid broadcasts in Stars, and for large files there is the self-hosted Local Bot API Server.

### What happens if my bot doesn't fetch updates?

Telegram keeps unfetched updates for a limited time, roughly a day. If the bot is down longer, some events are lost, so monitor its availability.
