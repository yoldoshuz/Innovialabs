---
title: Как написать Telegram-бота на Node.js с grammY
description: Собираем Telegram-бота на TypeScript и grammY: команды, клавиатуры, сессии и middleware — и коротко сравниваем grammY с Telegraf.
summary: В grammY бот — это объект Bot с цепочкой middleware: команды, клавиатуры и сессии подключаются через bot.command, InlineKeyboard и плагин session, а запуск для разработки делается одной строкой bot.start().
---
## Короткий ответ

**grammY** — фреймворк для Telegram Bot API на TypeScript. Всё в нём строится на **middleware**: каждое обновление проходит по цепочке функций, и любая из них может ответить или передать управление дальше через `next()`. Команды, кнопки и сессии — это тоже middleware.

Нужны Node.js актуальной LTS-версии и токен от @BotFather.

## Шаг 1. Проект

```bash
mkdir my-bot && cd my-bot
npm init -y
npm install grammy
npm install -D typescript tsx @types/node
```

`tsx` запускает TypeScript без отдельной сборки — удобно для разработки. Для продакшена код обычно компилируют `tsc` и запускают уже JavaScript.

## Шаг 2. Бот с сессией и middleware

```ts
// bot.ts
import { Bot, Context, InlineKeyboard, Keyboard, session, SessionFlavor } from "grammy";

interface SessionData {
  orders: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// 1. Сессия: данные пользователя между сообщениями
bot.use(session({ initial: (): SessionData => ({ orders: 0 }) }));

// 2. Свой middleware: логируем время обработки
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`update ${ctx.update.update_id}: ${Date.now() - started} ms`);
});

const mainMenu = new Keyboard().text("Каталог").text("Мои заказы").resized();

bot.command("start", (ctx) =>
  ctx.reply("Добро пожаловать! Выберите раздел.", { reply_markup: mainMenu }),
);

bot.hears("Каталог", (ctx) => {
  const kb = new InlineKeyboard()
    .text("Товар A", "buy:a")
    .text("Товар B", "buy:b")
    .row()
    .url("Сайт", "https://example.com");
  return ctx.reply("Что заказать?", { reply_markup: kb });
});

bot.callbackQuery(/^buy:(.+)$/, async (ctx) => {
  ctx.session.orders += 1;
  await ctx.answerCallbackQuery({ text: "Добавлено" });
  await ctx.reply(`Заказ на ${ctx.match[1]} принят.`);
});

bot.hears("Мои заказы", (ctx) => ctx.reply(`Заказов в этой сессии: ${ctx.session.orders}`));

bot.on("message:text", (ctx) => ctx.reply("Не понял. Нажмите /start."));

bot.catch((err) => console.error("Ошибка бота:", err.error));

bot.start();
```

Запуск:

```bash
BOT_TOKEN="123456:ABC..." npx tsx bot.ts
```

## Разбор по частям

- **`Bot<MyContext>`** — бот с расширенным типом контекста. `SessionFlavor` добавляет в `ctx` поле `session` с подсказками типов.
- **`bot.use(...)`** подключает middleware ко всем обновлениям. Порядок важен: сессия должна стоять раньше обработчиков, которые читают `ctx.session`.
- **Свой middleware** — функция `(ctx, next)`. Код до `await next()` выполняется до обработчиков, после — когда они закончили. Так делают логирование, проверку доступа, замер времени.
- **`bot.command("start")`** реагирует на команду, **`bot.hears("Каталог")`** — на точный текст или регулярное выражение.
- **`Keyboard`** — reply-клавиатура вместо обычной, **`InlineKeyboard`** — кнопки под сообщением. `.row()` начинает новый ряд, `.resized()` делает кнопки компактными.
- **`bot.callbackQuery(...)`** ловит нажатия inline-кнопок; `ctx.match` содержит группы регулярного выражения. `answerCallbackQuery` убирает индикатор загрузки.
- **`bot.on("message:text")`** — **filter query**: короткая строка, описывающая тип обновления. Ловушка для всего остального стоит последней.
- **`bot.catch`** перехватывает ошибки, чтобы бот не падал из-за одного сбойного апдейта.

## Сессии: где хранить

По умолчанию сессия хранится **в памяти** и исчезает при перезапуске. Для продакшена подключают внешнее хранилище через параметр `storage` — у grammY есть адаптеры для Redis, баз данных и файлов. Храните в сессии только лёгкие данные: шаг сценария, выбранные параметры, а не всю историю заказов.

## grammY или Telegraf

| | grammY | Telegraf |
|---|---|---|
| Язык | Написан на TypeScript | Написан на TypeScript с версии 4 |
| Модель | Middleware и filter queries | Middleware и сцены |
| Экосистема | Официальные плагины: сессии, меню, диалоги, ограничение частоты | Большая база старых примеров и ответов |
| Среды | Node.js, Deno, Bun, serverless | В основном Node.js |

Оба фреймворка рабочие. grammY удобнее для новых проектов на TypeScript благодаря документации и плагинам. Telegraf имеет смысл, если команда уже на нём пишет или вы поддерживаете существующий проект.

## Частые ошибки

- **`session` подключена после обработчиков** — `ctx.session` оказывается `undefined`.
- **Нет `answerCallbackQuery`** — кнопка выглядит «зависшей».
- **`bot.start()` и webhook одновременно.** Если у бота задан webhook, long polling работать не будет — удалите webhook или используйте что-то одно.
- **Тяжёлые операции без очереди.** Долгие задачи блокируют обработку следующих апдейтов этого чата; выносите их в фон.

## FAQ

### Можно ли писать на grammY без TypeScript?

Да, библиотека работает и в обычном JavaScript. TypeScript просто даёт подсказки по полям апдейтов и ловит ошибки до запуска.

### Как перевести бота с polling на webhook?

Вместо `bot.start()` используйте `webhookCallback(bot, ...)` с адаптером вашего веб-сервера и зарегистрируйте адрес через метод `setWebhook`. Логика обработчиков при этом не меняется.

### Нужен ли плагин для многошаговых диалогов?

Для простых анкет хватит сессии с полем «текущий шаг». Для длинных сценариев с ветвлениями удобнее официальный плагин conversations.
