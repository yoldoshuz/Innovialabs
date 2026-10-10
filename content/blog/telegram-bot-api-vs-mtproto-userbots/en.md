---
title: Bot API vs MTProto: Telethon, Pyrogram and Userbot Risks
description: How the Bot API differs from the MTProto client API, when a local Bot API server or Telethon makes sense, and what userbots risk: bans and ToS violations.
summary: For business bots the Bot API is almost always enough; a local Bot API server or MTProto as a bot covers large files, while userbots on a personal account are rarely justified and risk bans and Telegram ToS violations.
---
## The short answer

- **Bot API** is the HTTP interface for bots that Telegram itself maintains. It covers the vast majority of tasks: support, sales, notifications, Mini Apps, payments.
- **MTProto** is Telegram's native protocol, used by the official clients. Libraries like **Telethon** or **Pyrogram** let you work through it either as a bot or as a **regular user** (a userbot).
- A **userbot** automates a personal account. It can do more, but it risks bans and violating the API terms of service.

## Comparison

| | Bot API | MTProto as a bot | MTProto userbot |
|---|---|---|---|
| Login | Bot token | Bot token + `api_id`/`api_hash` | Phone number + code |
| Transport | HTTPS to Telegram servers | Its own connection | Its own connection |
| Sees messages | Only those addressed to the bot | As a bot | Everything the account sees |
| File limits | Yes, on the cloud Bot API | Much looser | Same as a client |
| Complexity | Low | Medium | Medium |
| Ban risk | Minimal if you follow the rules | Minimal | Noticeable |

A key nuance: **MTProto does not mean userbot**. Telethon and Pyrogram can sign in with a bot token. You get protocol-level capabilities while staying a bot with a clear status.

## When the Bot API is enough

- Customer conversations, menus, forms, FSM.
- Notifications and broadcasts to the bot's subscribers.
- Mini Apps, Telegram Payments and Stars.
- Groups and channels where the bot is added as an admin.

If the Bot API solves the task, stay on it: Telegram maintains it, it is stable, and any developer understands it.

## When you need a local Bot API server

Telegram has published the source code of the Bot API server. You can run it yourself and point your bot's requests at it. It is the same Bot API, with different capabilities:

- **large files**: noticeably higher upload and download limits than the cloud Bot API;
- files are available **from the local disk** without downloading over HTTP;
- webhooks can go to a **local address**, over HTTP and on any port;
- more parallel webhook connections.

The price is an extra service to deploy, update and monitor. For bots that handle video, archives and documents, it usually pays off.

## When MTProto is justified

- **Client applications**: your own Telegram client or an integration where users knowingly sign in to their account.
- **File handling as a bot**, if a local Bot API server does not fit for some reason.
- **Automating your own account** at moderate volumes: archiving your chats, exports, data migration.
- **Analytics for your own channels**, when the data you need is not in the Bot API or built-in statistics.

Before choosing a library, check **whether it is maintained today**. The original Pyrogram is no longer actively developed, and the community uses forks. Telethon, TDLib and GramJS are other common options.

## Userbot risks

**Account bans.** Telegram watches for suspicious activity: mass group joins, messages to strangers, frequent repetitive actions, fresh numbers put under automation from day one. Consequences range from temporary restrictions to account deletion.

**API terms violations.** The Telegram API terms of service prohibit spam, inflating subscriber and view counts, collecting user data without consent and impersonating official clients. Violations can get your `api_id` revoked.

**`FLOOD_WAIT` errors.** The protocol tells you exactly how many seconds to wait. Ignoring these errors is a fast track to restrictions.

**Session security.** A session file or session string is **full access to the account** without a password or code. Leaking it equals losing the account. Store it as a secret and never commit it to a repository.

**Legal issues.** Collecting messages and contacts from other people's groups is processing personal data. Personal data laws, including local ones, require a lawful basis and consent.

## How to choose

1. Start with the **Bot API**.
2. Hitting file size limits — a **local Bot API server**.
3. Need protocol-level capabilities — **MTProto as a bot**.
4. A userbot only for your own account, at moderate volume and with the risks understood. Do not build a business process that sales depend on around it.

## FAQ

### Can I use a userbot to message customers?

Technically yes, but it is a direct path to a ban: messages to strangers are treated as spam. To talk to customers, use a bot they messaged first, or a channel.

### Do I need an api_id for the Bot API?

No. A bot token is enough for the Bot API. `api_id` and `api_hash` are only required for MTProto, including signing in with a bot token in Telethon or Pyrogram.

### How hard is a local Bot API server to maintain?

It is a separate service with file storage: you deploy it, update it as new Bot API versions ship, and monitor it. For a team with DevOps practices, that is routine work.
