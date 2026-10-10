---
title: How the Telegram Bot API Works: Updates, Methods and Tokens
description: How the Telegram Bot API works: HTTP requests and JSON responses, the Update object, core methods like sendMessage, the bot token and common errors.
summary: The Bot API is an HTTP interface: your code calls methods at api.telegram.org using the bot token and gets JSON back, while incoming events arrive as Update objects via getUpdates or a webhook.
---
## The short answer

The **Telegram Bot API** is an HTTP interface between your program and Telegram. The model is simple:

- **You → Telegram**: send an HTTP request to a method (`sendMessage`, `sendPhoto` and so on) and get a JSON response.
- **Telegram → you**: everything that happens to the bot (messages, button taps, payments) arrives as **Update** objects.

Every request carries the bot **token** — it is part of the URL itself. Libraries such as aiogram, python-telegram-bot or grammY do exactly the same, just more conveniently.

## The request URL and the token

All methods follow one pattern:

```text
https://api.telegram.org/bot<TOKEN>/<METHOD_NAME>
```

**@BotFather** issues the token when you create the bot. It looks like a number, a colon and a long string of characters. Keep in mind:

- the token is **full access** to the bot: whoever has it can read incoming messages and post as the bot;
- never store it in a public repository or in frontend code — only in environment variables or server secrets;
- if it leaks, regenerate it in @BotFather and the old one stops working immediately.

The simplest check is the `getMe` method:

```bash
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

## The response format

Every response is JSON with an `ok` field:

```json
{"ok": true, "result": {"id": 123456789, "is_bot": true, "first_name": "Demo", "username": "demo_bot"}}
```

On failure `ok` is `false`, with `error_code` and `description` next to it. The most common ones:

| Code | Meaning |
|---|---|
| 400 | Bad parameters: empty text, unknown chat_id, broken markup |
| 401 | Invalid token |
| 403 | The user blocked the bot, or the bot cannot write to that chat |
| 409 | Conflicting update delivery (webhook and getUpdates at once) |
| 429 | Too many requests; the response includes `retry_after` seconds |

## The Update object

Each incoming event is an **Update** with a unique `update_id` and **exactly one** of these fields: `message`, `edited_message`, `callback_query`, `channel_post`, `inline_query`, `pre_checkout_query`, `my_chat_member` and others.

```json
{
  "update_id": 100000001,
  "message": {
    "message_id": 5,
    "from": {"id": 123456789, "is_bot": false, "first_name": "Ali"},
    "chat": {"id": 123456789, "type": "private"},
    "date": 1700000000,
    "text": "/start"
  }
}
```

The key value in an update is `chat.id`: that is where the bot sends its reply.

There are two ways to receive updates:

- **getUpdates** — your code asks Telegram for new events and passes an `offset` (last `update_id` + 1) so it does not get the same ones again;
- **webhook** — Telegram POSTs each update to your HTTPS address.

Telegram keeps undelivered updates only for a limited time, so a bot that was down for long may miss old events.

## Core methods

- `sendMessage` — text with formatting and buttons.
- `sendPhoto`, `sendDocument`, `sendVideo` — media and files.
- `editMessageText`, `deleteMessage` — change or remove the bot's own message.
- `answerCallbackQuery` — acknowledge an inline button tap, otherwise the user sees a loading spinner.
- `setMyCommands` — the bot's command menu.
- `setWebhook`, `getWebhookInfo`, `deleteWebhook` — manage update delivery.

Sending a message with a button:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": 123456789, "text": "Hi! Choose an action:", "reply_markup": {"inline_keyboard": [[{"text": "Catalog", "callback_data": "catalog"}]]}}'
```

Parameters can go in the query string, as form data or as JSON. Files are uploaded with `multipart/form-data`.

## Beginner mistakes

- Not passing `offset` to getUpdates and receiving the same messages over and over.
- Not answering `callback_query`, so the button appears stuck.
- Ignoring 429 and keeping up requests without a pause.
- Not handling 403: the user blocked the bot and should be removed from broadcasts.

The full list of methods and types is in the [official Bot API documentation](https://core.telegram.org/bots/api).

## FAQ

### Do I have to use a library?

No, any HTTP client works. But a library handles update parsing, command routing, retries and file uploads, so real projects usually pick one.

### Can a bot read all of a user's messages through the Bot API?

No. A bot receives only what is addressed to it: private messages to the bot and, in groups, commands and mentions (unless privacy mode is off or the bot is an admin).

### What should I do if the token leaks?

Regenerate it in @BotFather right away and update it on the server. The old token stops working and the attacker loses access.
