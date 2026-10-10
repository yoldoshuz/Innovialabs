---
title: How to Build a Telegram Bot in Node.js with grammY
description: Build a Telegram bot in TypeScript with grammY: commands, keyboards, sessions and middleware, plus a short comparison of grammY and Telegraf.
summary: In grammY a bot is a Bot object with a middleware chain: commands, keyboards and sessions come from bot.command, InlineKeyboard and the session plugin, and for development you start it with one line, bot.start().
---
## The short answer

**grammY** is a TypeScript framework for the Telegram Bot API. Everything is built on **middleware**: each update flows through a chain of functions, and any of them can reply or pass control on with `next()`. Commands, buttons and sessions are middleware too.

You need a current LTS version of Node.js and a token from @BotFather.

## Step 1. Project

```bash
mkdir my-bot && cd my-bot
npm init -y
npm install grammy
npm install -D typescript tsx @types/node
```

`tsx` runs TypeScript without a separate build step, which is handy in development. In production you usually compile with `tsc` and run the JavaScript output.

## Step 2. A bot with a session and middleware

```ts
// bot.ts
import { Bot, Context, InlineKeyboard, Keyboard, session, SessionFlavor } from "grammy";

interface SessionData {
  orders: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// 1. Session: per-user data between messages
bot.use(session({ initial: (): SessionData => ({ orders: 0 }) }));

// 2. Custom middleware: log handling time
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`update ${ctx.update.update_id}: ${Date.now() - started} ms`);
});

const mainMenu = new Keyboard().text("Catalog").text("My orders").resized();

bot.command("start", (ctx) =>
  ctx.reply("Welcome! Pick a section.", { reply_markup: mainMenu }),
);

bot.hears("Catalog", (ctx) => {
  const kb = new InlineKeyboard()
    .text("Product A", "buy:a")
    .text("Product B", "buy:b")
    .row()
    .url("Website", "https://example.com");
  return ctx.reply("What would you like?", { reply_markup: kb });
});

bot.callbackQuery(/^buy:(.+)$/, async (ctx) => {
  ctx.session.orders += 1;
  await ctx.answerCallbackQuery({ text: "Added" });
  await ctx.reply(`Order for ${ctx.match[1]} received.`);
});

bot.hears("My orders", (ctx) => ctx.reply(`Orders in this session: ${ctx.session.orders}`));

bot.on("message:text", (ctx) => ctx.reply("I did not get that. Tap /start."));

bot.catch((err) => console.error("Bot error:", err.error));

bot.start();
```

Run it:

```bash
BOT_TOKEN="123456:ABC..." npx tsx bot.ts
```

## Piece by piece

- **`Bot<MyContext>`** is a bot with an extended context type. `SessionFlavor` adds a typed `session` field to `ctx`.
- **`bot.use(...)`** attaches middleware to every update. Order matters: the session must come before handlers that read `ctx.session`.
- **Custom middleware** is a `(ctx, next)` function. Code before `await next()` runs before the handlers, code after it runs once they finish. That is how you do logging, access checks and timing.
- **`bot.command("start")`** reacts to a command; **`bot.hears("Catalog")`** reacts to exact text or a regular expression.
- **`Keyboard`** is a reply keyboard that replaces the regular one; **`InlineKeyboard`** puts buttons under a message. `.row()` starts a new row, `.resized()` makes buttons compact.
- **`bot.callbackQuery(...)`** catches inline button taps; `ctx.match` holds the regex groups. `answerCallbackQuery` removes the loading spinner.
- **`bot.on("message:text")`** uses a **filter query**, a short string describing the update type. The catch-all goes last.
- **`bot.catch`** handles errors so one failing update does not crash the bot.

## Sessions: where to store them

By default the session lives **in memory** and disappears on restart. In production you pass external storage through the `storage` option; grammY has adapters for Redis, databases and files. Keep sessions light: the current step and selected options, not the full order history.

## grammY or Telegraf

| | grammY | Telegraf |
|---|---|---|
| Language | Written in TypeScript | Written in TypeScript since version 4 |
| Model | Middleware and filter queries | Middleware and scenes |
| Ecosystem | Official plugins: sessions, menus, conversations, rate limiting | A large base of older examples and answers |
| Runtimes | Node.js, Deno, Bun, serverless | Mostly Node.js |

Both work. grammY is more convenient for new TypeScript projects thanks to its docs and plugins. Telegraf makes sense if your team already uses it or you maintain an existing project.

## Common mistakes

- **`session` registered after the handlers**, so `ctx.session` is `undefined`.
- **No `answerCallbackQuery`**, so the button looks stuck.
- **`bot.start()` while a webhook is set.** Long polling will not work while the bot has a webhook; delete it or pick one approach.
- **Heavy work without a queue.** Long tasks hold up the next updates from that chat; move them to the background.

## FAQ

### Can I use grammY without TypeScript?

Yes, it works in plain JavaScript. TypeScript just gives you hints for update fields and catches mistakes before you run the code.

### How do I switch from polling to a webhook?

Instead of `bot.start()`, use `webhookCallback(bot, ...)` with your web server's adapter and register the URL with the `setWebhook` method. Your handler logic stays the same.

### Do I need a plugin for multi-step dialogs?

For simple forms, a session with a "current step" field is enough. For long flows with branching, the official conversations plugin is more convenient.
