---
title: How to Create a Telegram Bot with BotFather: Step-by-Step Guide
description: Create a Telegram bot in BotFather step by step: name and username, description, avatar, commands and menu button, and how to keep the token safe.
summary: Open @BotFather, send /newbot, choose a name and a username ending in bot, and you get a token; then set the description, avatar, commands and menu button, and keep the token only in server environment variables.
---
## The short version

1. Find the official **@BotFather** in Telegram (it has a blue check mark) and tap "Start".
2. Send `/newbot` and choose the bot's **name** and **username**.
3. Receive the **token** and store it somewhere safe right away.
4. Set the description, avatar, commands and menu button.
5. Connect the token to your bot's code.

A freshly created bot does nothing by itself: BotFather only registers it. The logic is written by a developer or configured in a bot builder.

## Step 1. Name and username

After `/newbot`, BotFather asks for two values:

- **Name**: what users see in the chat list and profile. Any language, spaces allowed, and easy to change later with `/setname`.
- **Username**: the bot's handle, like `@shop_helper_bot`. Requirements: Latin letters, digits and underscores, 5 to 32 characters, ending in `bot` (for example `ShopBot` or `shop_bot`). It must not be taken.

Choose the username as if it were final: it goes into `t.me/name` links, business cards and ads.

## Step 2. The token

BotFather replies with a **token** like `123456789:AAH...`. The token is full access to the bot: anyone who has it can send messages as the bot and read its updates.

To confirm the token works, call `getMe`; it returns your bot's details.

## Step 3. Description and avatar

- `/setdescription`: the text users see in an empty chat **before tapping "Start"**. Explain what the bot does and why to start it.
- `/setabouttext`: a short text on the bot's **profile**, up to 120 characters.
- `/setuserpic`: the **avatar**. Send a square image that stays legible in a small circle.

A good description answers three questions: what the bot does, who it is for and what happens after "Start".

## Step 4. Commands

`/setcommands` sets the list that appears when users type `/` and in the menu button. One command per line:

```text
start - Get started
catalog - Product catalog
orders - My orders
help - Help and contacts
```

Rules: command names use lowercase Latin letters, digits and underscores, up to 32 characters. Keep the list short; 3 to 6 commands read better than twenty. You can also set commands from code with `setMyCommands`, which makes per-language lists easy.

## Step 5. The menu button

To the left of the input field there is a **menu button**. By default it opens the command list. In BotFather's bot settings (`/mybots` → your bot → Bot Settings → Menu Button) you can turn it into a launcher for a **Mini App**, a web app inside Telegram. In code, `setChatMenuButton` does the same.

Other useful settings under `/mybots`: group privacy, whether the bot can be added to groups, and inline mode.

## Storing the token safely

- Keep the token in **environment variables** or a secrets manager, never in code.
- Add `.env` to `.gitignore` before your first commit.
- Never put the token into Mini App or website code: anything sent to a browser is visible to users.
- Don't share it in chats or show it in screenshots.
- Use **separate bots** for development and production.
- If the token leaks, **revoke it** immediately: `/mybots` → your bot → API Token → Revoke current token. The old token stops working; update the new one on your server.

```bash
# .env (do not commit)
BOT_TOKEN=123456789:replace_with_your_token
```

## Common mistakes

- Messaging a fake account that looks like BotFather. The real one is `@BotFather` with a check mark.
- Publishing the token in a public repository.
- Leaving the description empty, so users don't know why they should tap "Start".
- Adding commands in BotFather without writing handlers for them in code.

## FAQ

### How many bots can one account create?

BotFather limits the number of bots per account. If you reach it, BotFather tells you when you try to create a new one; you can remove unused bots with `/deletebot`.

### Can I transfer a bot to someone else?

Yes, BotFather's bot settings include ownership transfer. It requires two-step verification to be enabled on the accounts involved.

### Do I need a server for the bot to work?

Yes. BotFather only registers the bot; replying to users requires your program running on a server or in the cloud, connected to the Bot API with the token.
