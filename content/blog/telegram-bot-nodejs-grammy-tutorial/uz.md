---
title: grammY bilan Node.js’da Telegram-bot yozish
description: grammY va TypeScript’da Telegram-bot yig‘amiz: buyruqlar, klaviaturalar, sessiyalar va middleware, hamda grammY’ni Telegraf bilan qisqacha solishtiramiz.
summary: grammY’da bot middleware zanjiriga ega Bot obyektidir: buyruqlar, klaviaturalar va sessiyalar bot.command, InlineKeyboard va session plagini orqali ulanadi, ishlab chiqishda esa bitta bot.start() qatori bilan ishga tushadi.
---
## Qisqa javob

**grammY** — Telegram Bot API uchun TypeScript’dagi freymvork. Undagi hamma narsa **middleware** ustiga qurilgan: har bir update funksiyalar zanjiridan o‘tadi va ulardan istalgani javob berishi yoki `next()` orqali boshqaruvni keyingisiga uzatishi mumkin. Buyruqlar, tugmalar va sessiyalar ham middleware.

Node.js’ning amaldagi LTS-versiyasi va @BotFather’dan olingan token kerak.

## 1-qadam. Loyiha

```bash
mkdir my-bot && cd my-bot
npm init -y
npm install grammy
npm install -D typescript tsx @types/node
```

`tsx` TypeScript’ni alohida yig‘ishsiz ishga tushiradi — ishlab chiqishda qulay. Production uchun kod odatda `tsc` bilan kompilyatsiya qilinadi va tayyor JavaScript ishga tushiriladi.

## 2-qadam. Sessiya va middleware’li bot

```ts
// bot.ts
import { Bot, Context, InlineKeyboard, Keyboard, session, SessionFlavor } from "grammy";

interface SessionData {
  orders: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// 1. Sessiya: xabarlar orasida foydalanuvchi ma’lumotlari
bot.use(session({ initial: (): SessionData => ({ orders: 0 }) }));

// 2. O‘z middleware’imiz: qayta ishlash vaqtini yozamiz
bot.use(async (ctx, next) => {
  const started = Date.now();
  await next();
  console.log(`update ${ctx.update.update_id}: ${Date.now() - started} ms`);
});

const mainMenu = new Keyboard().text("Katalog").text("Buyurtmalarim").resized();

bot.command("start", (ctx) =>
  ctx.reply("Xush kelibsiz! Bo‘limni tanlang.", { reply_markup: mainMenu }),
);

bot.hears("Katalog", (ctx) => {
  const kb = new InlineKeyboard()
    .text("Mahsulot A", "buy:a")
    .text("Mahsulot B", "buy:b")
    .row()
    .url("Sayt", "https://example.com");
  return ctx.reply("Nima buyurtma qilasiz?", { reply_markup: kb });
});

bot.callbackQuery(/^buy:(.+)$/, async (ctx) => {
  ctx.session.orders += 1;
  await ctx.answerCallbackQuery({ text: "Qo‘shildi" });
  await ctx.reply(`${ctx.match[1]} uchun buyurtma qabul qilindi.`);
});

bot.hears("Buyurtmalarim", (ctx) => ctx.reply(`Shu sessiyadagi buyurtmalar: ${ctx.session.orders}`));

bot.on("message:text", (ctx) => ctx.reply("Tushunmadim. /start ni bosing."));

bot.catch((err) => console.error("Bot xatosi:", err.error));

bot.start();
```

Ishga tushirish:

```bash
BOT_TOKEN="123456:ABC..." npx tsx bot.ts
```

## Qismma-qism tahlil

- **`Bot<MyContext>`** — kengaytirilgan kontekst turiga ega bot. `SessionFlavor` `ctx` ga turlari aniq `session` maydonini qo‘shadi.
- **`bot.use(...)`** middleware’ni barcha update’larga ulaydi. Tartib muhim: sessiya `ctx.session` ni o‘qiydigan handlerlardan oldin turishi kerak.
- **O‘z middleware’ingiz** — `(ctx, next)` funksiyasi. `await next()` dan oldingi kod handlerlardan oldin, keyingisi esa ular tugagach bajariladi. Logging, kirish huquqini tekshirish va vaqtni o‘lchash shunday qilinadi.
- **`bot.command("start")`** buyruqqa, **`bot.hears("Katalog")`** aniq matnga yoki regulyar ifodaga javob beradi.
- **`Keyboard`** — oddiy klaviatura o‘rniga reply-klaviatura, **`InlineKeyboard`** — xabar ostidagi tugmalar. `.row()` yangi qator boshlaydi, `.resized()` tugmalarni ixcham qiladi.
- **`bot.callbackQuery(...)`** inline-tugmalar bosilishini ushlaydi; `ctx.match` regulyar ifoda guruhlarini saqlaydi. `answerCallbackQuery` yuklanish belgisini olib tashlaydi.
- **`bot.on("message:text")`** — **filter query**: update turini tavsiflovchi qisqa satr. Qolgan hamma narsa uchun «tuzoq» oxirida turadi.
- **`bot.catch`** xatolarni ushlaydi, shunda bitta nosoz update tufayli bot to‘xtab qolmaydi.

## Sessiyalar: qayerda saqlash kerak

Standart holatda sessiya **xotirada** saqlanadi va qayta ishga tushirilganda yo‘qoladi. Production’da `storage` parametri orqali tashqi ombor ulanadi — grammY’da Redis, ma’lumotlar bazalari va fayllar uchun adapterlar bor. Sessiyada faqat yengil ma’lumotlarni saqlang: ssenariy qadami, tanlangan parametrlar, butun buyurtmalar tarixini emas.

## grammY yoki Telegraf

| | grammY | Telegraf |
|---|---|---|
| Til | TypeScript’da yozilgan | 4-versiyadan boshlab TypeScript’da yozilgan |
| Model | Middleware va filter query’lar | Middleware va sahnalar (scenes) |
| Ekotizim | Rasmiy plaginlar: sessiyalar, menyular, dialoglar, chastotani cheklash | Eski misollar va javoblarning katta bazasi |
| Muhitlar | Node.js, Deno, Bun, serverless | Asosan Node.js |

Ikkalasi ham ishlaydi. grammY hujjatlari va plaginlari tufayli TypeScript’dagi yangi loyihalar uchun qulayroq. Agar jamoa allaqachon Telegraf’da yozsa yoki mavjud loyihani qo‘llab-quvvatlasangiz, Telegraf mantiqli.

## Ko‘p uchraydigan xatolar

- **`session` handlerlardan keyin ulangan** — `ctx.session` `undefined` bo‘lib chiqadi.
- **`answerCallbackQuery` yo‘q** — tugma «osilib» qolgandek ko‘rinadi.
- **`bot.start()` va webhook bir vaqtda.** Botda webhook o‘rnatilgan bo‘lsa, long polling ishlamaydi — webhook’ni o‘chiring yoki bittasini tanlang.
- **Og‘ir amallar navbatsiz.** Uzoq vazifalar shu chatdagi keyingi update’larni ushlab qoladi; ularni fonga chiqaring.

## FAQ

### grammY’da TypeScript’siz yozsa bo‘ladimi?

Ha, kutubxona oddiy JavaScript’da ham ishlaydi. TypeScript shunchaki update maydonlari bo‘yicha maslahatlar beradi va xatolarni ishga tushirishdan oldin ushlaydi.

### Botni polling’dan webhook’ga qanday o‘tkazish mumkin?

`bot.start()` o‘rniga veb-serveringiz adapteri bilan `webhookCallback(bot, ...)` dan foydalaning va manzilni `setWebhook` metodi orqali ro‘yxatdan o‘tkazing. Handlerlar mantiqi o‘zgarmaydi.

### Ko‘p bosqichli dialoglar uchun plagin kerakmi?

Oddiy anketalar uchun «joriy qadam» maydoni bor sessiya yetarli. Tarmoqlanuvchi uzun ssenariylar uchun rasmiy conversations plagini qulayroq.
