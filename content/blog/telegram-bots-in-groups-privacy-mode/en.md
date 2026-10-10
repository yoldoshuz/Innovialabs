---
title: How Telegram Bots Work in Groups: Privacy Mode and Admin Rights
description: Which group messages a Telegram bot actually receives, how privacy mode and admin rights change that, and the setup mistakes that most often break bots.
summary: By default a bot in a group runs in privacy mode and sees only commands, replies to its own messages and service events; to receive every message, turn privacy mode off in BotFather or make the bot an admin.
---
## What a bot sees in a group by default

Every new bot has **privacy mode** turned on. In a group, such a bot does not receive the whole conversation, only:

- **commands**, meaning messages that start with `/` (most reliably in the form `/command@botname`);
- **replies** to the bot's own messages;
- **service messages**: members joining or leaving, title changes, pinned messages;
- messages sent **via this bot** in inline mode.

Regular messages that are not addressed to the bot never reach it. This protects privacy: members should know the bot is not reading everything.

## How to receive all messages

There are two ways:

1. **Turn privacy mode off** in BotFather: `/mybots` → your bot → Bot Settings → Group Privacy → Turn off, or use `/setprivacy`.
2. **Make the bot a group admin.** Admin bots receive all messages regardless of privacy mode.

One crucial detail: after changing privacy mode, **remove the bot from the group and add it back**. Otherwise existing groups keep the old setting. This is the most common reason behind "I disabled privacy, but the bot still sees nothing".

## What a bot never sees

- **Messages from other bots.** To prevent bots from looping by replying to each other, Telegram does not deliver other bots' group messages to bots.
- **History before it joined.** The Bot API cannot load old messages; the bot receives only what arrives after it is added.
- **Channel posts unless it is an admin.** In channels a bot works only as an admin and receives `channel_post` updates.

## Admin rights: grant the minimum

When a bot becomes an admin, it gets individual permissions. Grant only what the task needs:

| Bot task | Required rights |
|---|---|
| Spam moderation | delete messages, ban members |
| Welcome message and captcha | restrict members |
| Pinning announcements | pin messages |
| Issuing invite links | invite users |
| Working with forum topics | manage topics |

The right to **add new admins** is almost never needed: if the bot token leaks, an attacker would control the group.

## Common setup mistakes

- **Not re-adding the bot** after changing privacy mode.
- **Not requesting the right updates.** Member change events (`chat_member`) reach only admin bots, and only if you list them explicitly in `allowed_updates` for `getUpdates` or `setWebhook`.
- **Keeping an old chat_id.** When a basic group is upgraded to a supergroup, its ID changes. A service message carries `migrate_to_chat_id`; update it in your database.
- **Expecting `from` for anonymous admins.** When an admin posts anonymously, the sender is the chat itself (`sender_chat`), not a person.
- **Ignoring forum topics.** In groups with topics, reply in the same thread by passing `message_thread_id`.
- **Anyone can add the bot.** If your bot is not designed for groups, disable that with `/setjoingroups` in BotFather.

## How to choose a mode

- **The bot responds to commands** (polls, reminders, help): keep privacy mode on.
- **Moderator or anti-spam bot**: make it an admin with minimal rights.
- **The bot processes the whole conversation** (keyword search, collecting requests from chat): turn privacy mode off and tell members openly that the bot reads messages.

## FAQ

### Why doesn't my bot respond to /start in a group?

With several bots in the group, a generic command may go to a different bot. Use `/start@botname` and make sure the bot was re-added after you changed its settings.

### Can a bot message a group member privately first?

No. A bot can message a user privately only after that user has started the bot. The usual approach is a button linking to the bot with a `start` parameter.

### Do I need admin rights if privacy mode is already off?

Only if the bot must perform admin actions: deleting messages, restricting members, pinning posts. Reading messages only requires privacy mode to be off.
