---
title: How to Add Telegram Login to Your Website
description: A step-by-step guide to the Telegram Login Widget: bot and domain setup, server-side hash verification, account linking and secure sessions.
summary: Create a bot, link your domain to it in BotFather, embed the widget, then on the server verify the hash using the SHA-256 of the bot token and check that auth_date is fresh — only then create a session.
---
## How it works

The **Telegram Login Widget** is a "Log in with Telegram" button that Telegram renders on your site. The user confirms the login inside Telegram, and the widget returns:

- `id` — the user's permanent identifier;
- `first_name`, `last_name`, `username`, `photo_url` — profile data (some fields may be missing);
- `auth_date` — the login time as a Unix timestamp;
- `hash` — a signature that lets your server confirm the data came from Telegram.

The key rule: **data from the browser means nothing until the server has verified `hash`**. Anyone can craft JSON with someone else's `id`.

## Step 1. Bot and domain

1. Create a bot in **@BotFather** or reuse an existing one. Logins are requested on its behalf.
2. Send BotFather the `/setdomain` command and enter your site's domain. The widget only works on the linked domain.
3. Keep the **bot token** in your server's environment variables. It is needed to verify signatures and must never reach the frontend.

For local development the widget needs a real domain, so teams usually use a tunnel or a test subdomain.

## Step 2. The widget on the page

There are two modes: a **redirect** to your URL with data in query parameters, or a JavaScript **callback**.

```html
<script async src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="your_bot"
  data-size="large"
  data-auth-url="https://example.com/auth/telegram"
  data-request-access="write"></script>
```

- `data-auth-url` — Telegram redirects the user here with `id`, `auth_date`, `hash` and other parameters.
- Alternatively, set `data-onauth="onTelegramAuth(user)"` and POST the `user` object to your server.
- `data-request-access="write"` asks permission for your bot to message the user. Add it if you plan to send notifications.

## Step 3. Verify the hash on the server

The algorithm:

1. Take every received field except `hash`.
2. Sort them by key and build a string of `key=value` lines joined with `\n`.
3. The secret key is the **SHA-256 of the bot token** (raw bytes).
4. Compute HMAC-SHA-256 of the string with that key and compare the hex result to `hash`.
5. Check that `auth_date` is not too old.

```python
import hashlib, hmac, time

def verify_telegram_login(data: dict, bot_token: str, max_age: int = 86400) -> bool:
    received_hash = data.pop("hash", "")
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret = hashlib.sha256(bot_token.encode()).digest()
    expected = hmac.new(secret, check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received_hash):
        return False
    return time.time() - int(data["auth_date"]) < max_age
```

Details that matter:

- Use **constant-time comparison** (`hmac.compare_digest`, `crypto.timingSafeEqual`).
- Include **all received fields** in the string, not just the ones you know: Telegram may add new ones.
- Do not confuse this with Mini Apps: there the secret key is derived differently, via HMAC with the key `WebAppData`.

## Step 4. Linking accounts

Store the link by **`id`**, not `username`: usernames can be changed or removed.

Typical scenarios:

- **New user** — create an account with a `telegram_id`.
- **Already signed in another way** — the user clicks "Connect Telegram" in profile settings, and you attach `telegram_id` to the current account.
- **Has an email account but logs in with Telegram for the first time** — do not merge automatically. The widget does not send email or phone, so a matching name proves nothing. Ask the user to sign in the old way and then connect Telegram.

Add a unique index on `telegram_id` so one Telegram account cannot be attached to two profiles.

## Step 5. Sessions

After a successful check, the server creates **its own session** — Telegram is no longer involved.

- Use a cookie with `HttpOnly`, `Secure` and `SameSite=Lax` or `Strict`.
- Never use `hash` or `auth_date` as a session token.
- Limit the `auth_date` window so an intercepted link with parameters cannot be replayed much later.
- After the redirect, strip the parameters from the address bar so they do not end up in browser history and logs.
- Let users log out and disconnect Telegram.

## Common mistakes

- Trusting data from `onTelegramAuth` without server-side verification.
- The bot token in frontend code.
- Checking only known fields instead of all received ones.
- No `auth_date` check.

## FAQ

### Can I get the user's phone number or email?

No, the widget does not provide them. If you need a phone number, request it separately — for example, through your bot with a share-contact button and the user's consent.

### Why is the widget not showing up?

Most often the domain was not linked with `/setdomain`, or the page is served from a different domain. Also make sure your site's CSP does not block the script.

### Do I need a running bot for login?

You do not need a separate bot server for authentication itself — a bot with a token and a linked domain is enough. A bot server is only required if you want to message users.
