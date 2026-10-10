---
title: Telegram Bot Security: Tokens, Webhooks and Access Control
description: How to protect a Telegram bot in production: keep the token secret, verify webhook requests, check admin rights, validate input and callback data.
summary: Treat the token as a password, verify every webhook request with a secret header, check permissions by user ID on the server, and treat all input, including callback data, as untrusted.
---
## The short answer

A Telegram bot is a public API endpoint that anyone can talk to. Most incidents come from five places:

- **The token** leaks and someone else controls the bot.
- **The webhook** accepts requests that did not come from Telegram.
- **Admin commands** are protected by a username or a hidden button instead of a real check.
- **Input and callback data** are trusted as if the bot generated them.
- **User data** is stored longer and wider than needed.

Close these five, and the bot is in better shape than most.

## Token: storage, leaks and revocation

The token gives full control over the bot: reading updates, sending messages, changing the webhook. Handle it like a database password.

- Keep it in environment variables or a secrets manager, never in the repository. Add `.env` to `.gitignore` and enable secret scanning in your Git hosting.
- Watch your **logs**: Bot API URLs contain the token (`/bot<token>/sendMessage`). HTTP client debug logs, error trackers and proxy logs can capture it.
- Use **separate bots** for development and production, so a test token on a laptop never touches real users.

If the token leaks, revoke it in @BotFather (the `/revoke` command or the bot settings). The old token stops working at once. Then deploy the new token, set the webhook again with a new secret, and review what the bot sent while it was exposed.

## Webhook: verify that the request came from Telegram

The webhook URL is just an HTTPS endpoint. If it is guessed or leaks, anyone can send fake updates, for example a "payment" or a message from an "admin".

When calling `setWebhook`, pass `secret_token`. Telegram will add it to every request in the `X-Telegram-Bot-Api-Secret-Token` header, and your server rejects anything without an exact match.

```python
import hmac

def is_from_telegram(headers: dict, expected: str) -> bool:
    received = headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    return hmac.compare_digest(received, expected)
```

More practices:

- Use a non-obvious path rather than `/webhook`, but do not rely on it alone.
- Respond quickly and move heavy work to a queue, so slow requests do not pile up into retries.
- Filtering by Telegram IP ranges is an optional extra layer; ranges can change, so the secret header remains the main check.

Parameter details are in the [setWebhook documentation](https://core.telegram.org/bots/api#setwebhook).

## Access control for admin functions

Common mistakes: checking `username` (it can be changed or taken by someone else), hiding the admin button but leaving the command open, or trusting the chat where the message came from.

Do it like this:

- Check **user_id** against an allowlist in the config or the database, on every admin handler, not only at the "entry" command.
- Put the check in one place: a filter or middleware applied to the whole admin router.
- In groups, ask `getChatMember` for the current status instead of caching admin rights forever. Remember **anonymous admins**: their messages arrive on behalf of the group, and `from_user` is not the real person.
- Log admin actions: who, what, when.

## Input validation and callback data

Everything a user sends is untrusted: text, files, contacts, location. Validate length, format and ranges before use.

- Use parameterized queries for SQL, never string concatenation.
- Escape user text before sending it with `parse_mode` HTML or MarkdownV2, otherwise formatting breaks or a fake link appears.
- Check file type and size before processing; do not run downloaded files.
- Limit request rate per user so one account cannot overload the bot or a paid external API.

**Callback data** deserves special attention. It is up to 64 bytes and travels through the client, so it is safest to assume it can be forged. A button with `order:delete:1542` does not prove that the user owns order 1542.

- On every callback, check on the server that the object belongs to this user and the action is allowed in its current state.
- For sensitive actions, store the context on the server and put only a random short ID in the callback.
- Make actions idempotent: a repeated tap must not charge or create twice.

## Storing user data

- Collect **the minimum**: if user_id is enough, do not ask for a phone number.
- Define retention: delete old FSM states, logs and dialog history. Set TTLs in Redis.
- Close Redis and the database from the internet, use passwords and encrypted backups.
- Do not write personal data and tokens into logs.
- Check local personal data laws: some countries, including Uzbekistan and Russia, have data localization requirements.

## FAQ

### Is a secret webhook URL enough without the secret header?

No. URLs leak through logs, proxies and configuration screenshots. The secret header is cheap to add and gives a clear rule: no header, no processing.

### Can I trust that a callback came from my own button?

Assume not. Any value from a client is input that has to be checked. Verify ownership and object state on the server for every action that changes data.

### What should I do first if the token leaked?

Revoke it in @BotFather, deploy the new token, set the webhook again with a new secret and find the source of the leak, whether a repository, logs or a chat.
