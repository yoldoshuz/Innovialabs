---
title: How to Validate initData in Telegram Mini Apps on the Backend
description: Validating Telegram Mini App initData: the HMAC algorithm, auth_date freshness, third-party validation without a bot token and why initDataUnsafe is unsafe.
summary: Send the raw initData string to your server, recompute HMAC-SHA-256 with a key derived from the bot token and the string WebAppData, compare it with hash and check auth_date — never trust initDataUnsafe.
---
## The short answer

When a Mini App opens, Telegram passes it **initData** — a query-string-formatted value with user data and a `hash` signature. Your backend must:

1. Receive the **raw string** `Telegram.WebApp.initData` from the client.
2. Recompute the signature with the bot token and compare it with `hash`.
3. Check that `auth_date` is fresh enough.
4. Only then read `user.id` and create a session.

## Why initDataUnsafe cannot be trusted

`Telegram.WebApp.initDataUnsafe` is the same data, already parsed into an object on the client. The word **Unsafe** is an explicit warning:

- A Mini App is an ordinary web page. Anyone can open it in a browser, replace `window.Telegram`, or edit the request in DevTools.
- Anyone can send `{"user": {"id": 123}}` to your API and impersonate another user.
- `initDataUnsafe` is fine for display only: a name in the header, an avatar before data loads. For authorization, payments and data access, use verified `initData` only.

## The signature algorithm

1. Parse `initData` as a query string. Set aside the `hash` value.
2. Sort the remaining pairs by key and join them as `key=value` lines separated by `\n`. Use values **decoded but otherwise untouched** — do not rebuild the JSON in the `user` field.
3. Secret key: `HMAC-SHA-256(key="WebAppData", message=bot_token)`.
4. Expected signature: `hex(HMAC-SHA-256(key=secret_key, message=data_check_string))`.
5. Compare it with `hash` in constant time.

```js
import crypto from "node:crypto";

export function validateInitData(initData, botToken, maxAgeSec = 3600) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;

  return JSON.parse(params.get("user") ?? "null");
}
```

Popular libraries ship ready-made implementations, such as `safe_parse_webapp_init_data` in aiogram or the `@telegram-apps/init-data-node` package. If you use one, still confirm that the expiry check is enabled.

## auth_date freshness

A signature proves authenticity, not freshness. An intercepted `initData` string can be replayed for as long as you accept it.

- Set a **maximum age** that fits the scenario: short for payments, longer for browsing a catalog.
- Treat `initData` as a **one-time pass**: verify it, then issue your own session token with a clear lifetime.
- Keep server time accurate (NTP), or fresh data will be rejected.

## How to send initData to the server

- Put the string in a header, for example `Authorization: tma <initData>` — a convention used by several ecosystem libraries.
- Do not put `initData` in the URL: it will end up in proxy and analytics logs.
- Verify the signature in **one middleware**, not separately in every handler.

## Validation without the bot token

Sometimes a third-party service needs to verify user data without having your token. For this, `initData` includes a **`signature`** field — an Ed25519 signature that can be checked with Telegram's public key.

- The string to verify starts with `<bot_id>:WebAppData`, followed by the sorted fields joined with `\n`, **excluding `hash` and `signature`**.
- Public keys for the production and test environments are published in the Telegram documentation.
- This way the service confirms the data was issued for your bot without ever receiving the token.

The bot token is full control over the bot. Never hand it to partners just so they can verify signatures.

## Common mistakes

- **Re-serializing the `user` JSON**: key order or escaping changes and the signature no longer matches.
- **Double decoding**, or the opposite — using still-encoded values.
- **Swapped HMAC arguments**: the secret is the HMAC of the token keyed with `WebAppData`, not the other way around.
- Checking the signature but not `auth_date`.
- A different token in test and production for the same bot.

## FAQ

### How is this different from Telegram Login Widget verification?

The algorithm is similar, but the secret key differs: the Login Widget uses SHA-256 of the token, while Mini Apps use HMAC-SHA-256 of the token keyed with `WebAppData`. Code for one will not work for the other without changes.

### Why is initData empty?

Usually the Mini App was opened directly in a browser rather than through the bot's button or link, or it was launched from a keyboard button where the data set is limited. Check how the app is launched.

### Can I store initData as the session?

Better not. Verify it once at login and issue your own session token. That way you control lifetime and revocation.
