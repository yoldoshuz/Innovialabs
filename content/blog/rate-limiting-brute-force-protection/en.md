---
title: Rate Limiting and Brute-Force Protection for Login and APIs
description: Rate-limit algorithms, per-IP vs per-account limits, lockouts vs progressive delays, where to place CAPTCHA, and how to implement it with nginx and Redis.
summary: Limit attempts both per IP and per account, prefer growing delays and a CAPTCHA after a few failures over hard lockouts, store counters in a shared store like Redis, and add a coarse limit in nginx on top.
---
## The short answer

**Rate limiting** caps how many requests a single source can make in a given time. For login forms and APIs it is the main defense against **password brute-forcing**, guessing SMS codes and API abuse.

A setup that works for most projects:

- **Two counters**: per IP and per account (username, email, phone).
- After a few failed attempts — a **CAPTCHA** or a **growing delay**, not a permanent lockout.
- Counters live in a **shared store** (Redis) so they work across all servers.
- On top — a coarse limit in **nginx** or your CDN that drops obvious junk before it reaches the app.
- When the limit is exceeded, respond with **HTTP 429** and a `Retry-After` header.

## Algorithms

| Algorithm | How it works | Good for |
|---|---|---|
| **Fixed window** | A counter per interval (say, a minute) that resets when the next one starts | Simple and cheap; allows a double burst at window edges |
| **Sliding window** | Counts requests over the last N seconds instead of the calendar minute | More precise for login and sensitive actions |
| **Token bucket** | A bucket refills at a constant rate; each request takes a token | APIs: allows short bursts while capping the average rate |
| **Leaky bucket** | Requests pass at a fixed rate; the excess waits in a queue or is dropped | Smoothing load; this is how nginx `limit_req` works |

A login form is usually fine with a fixed or sliding window; a public API benefits from a token bucket.

## Per IP or per account

- **Per IP only** — an attacker tries passwords for one user from thousands of addresses (botnet, proxies) and never hits the limit. Also, an entire office or a mobile carrier can share one IP.
- **Per account only** — the attacker tries one common password against thousands of accounts (**password spraying**), with a single attempt per account.

So you need **both**: a strict per-account limit (a handful of failures per 15 minutes), a looser and broader per-IP limit (dozens of attempts per minute), and a global limit on failed logins across the service to detect mass attacks.

Do not reveal whether an account exists: the error message and response time should be the same for "no such user" and "wrong password".

## Lockout or delay

- **A hard account lockout** after N failures is simple but dangerous: anyone can lock out someone else just by entering wrong passwords. It hands attackers a ready-made denial-of-service tool.
- **A progressive delay** grows with each failure (1, 2, 4, 8 seconds...). Brute-forcing becomes pointless, while a real user barely notices.
- **A temporary lock** for 15-30 minutes with an email notification to the owner is a reasonable compromise.

## Where to place CAPTCHA

- Not on the first login attempt: it annoys everyone to stop a few.
- Show it **after 2-3 failures** per account or IP, and on sign-up, password reset and SMS sending.
- Prefer "invisible" checks that challenge only suspicious visitors.
- CAPTCHA complements rate limits rather than replacing them: solving services exist.

## nginx implementation

The base layer limits how often one IP can hit the login endpoint:

```nginx
http {
    limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
    limit_req_status 429;

    server {
        location = /api/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
        }
    }
}
```

`rate=10r/m` is the average rate, `burst=5` is the allowed short spike. If the site sits behind a CDN or load balancer, configure the `realip` module, otherwise every request will be counted against the proxy's IP.

## Redis implementation

A per-account counter in the application. The Lua script runs atomically inside Redis, so the counter never ends up without an expiry:

```javascript
const script = `
  local c = redis.call("INCR", KEYS[1])
  if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
  return c
`;

async function tooManyAttempts(login) {
  const key = `login:fail:${login.toLowerCase()}`;
  const count = await redis.eval(script, 1, key, 900); // 15-minute window
  return count > 5;
}
```

Increment the counter on a failed login and reset it on success. The same counter keyed by IP is your second layer.

## Common mistakes

- Limits are kept in process memory, so they break as soon as you run several servers.
- Only `/login` is protected, while password reset, SMS code checks and API tokens are not.
- No limit on one-time code entry: a short numeric code is guessed quickly.
- The real client IP is not detected behind a proxy, so the limit blocks everyone at once.

## FAQ

### What limits should I use for a login form?

There are no universal numbers. Start from real user behavior: people rarely fail more than a few times in a row. Begin with a strict per-account limit and a looser per-IP one, then watch the logs and adjust.

### Do I need rate limiting if two-factor authentication is enabled?

Yes. 2FA stops logins with a guessed password, but not brute-forcing of the password and one-time codes themselves, server load, or attackers triggering SMS messages at your expense.

### What should the client get when the limit is exceeded?

Status 429 Too Many Requests and a `Retry-After` header with the wait time. For a login form, show a clear message without details about which limit was triggered.
