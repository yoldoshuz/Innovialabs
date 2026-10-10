---
title: Telegram-botda inline va reply klaviatura: qachon qaysi biri kerak
description: Telegram-botda inline va reply klaviatura farqi, callback data, buyruqlar va menyu tugmasi qanday ishlashi hamda navigatsiyani tushunarli qilish qoidalari.
summary: Reply klaviatura oddiy klaviatura o‘rnini egallab, foydalanuvchi nomidan matn yuboradi — u doimiy bosh menyu uchun; inline tugmalar xabarga biriktiriladi va botga callback data’ni jimgina uzatadi — ular aynan shu xabar ustidagi amallar uchun.
---
## Asosiy farq

Telegram-botda ikki xil tugma bor va ular mutlaqo boshqacha ishlaydi.

- **Reply klaviatura** (`ReplyKeyboardMarkup`) telefonning oddiy klaviaturasi o‘rnida paydo bo‘ladi. Tugma bosilganda foydalanuvchi nomidan **chatga matn yuboriladi**, xuddi u o‘zi yozgandek.
- **Inline klaviatura** (`InlineKeyboardMarkup`) botning aniq bir xabariga biriktiriladi. Bosilganda chatga hech narsa yozilmaydi: bot yashirin `callback_data` bilan **callback query** oladi va aynan shu xabarni o‘zgartirishi mumkin.

Bundan oddiy qoida kelib chiqadi: reply — **doimiy navigatsiya** uchun, inline — **xabar kontekstidagi amallar** uchun.

## Reply klaviatura: imkoniyatlar va cheklovlar

Bilish foydali:

- `resize_keyboard` tugmalar balandligini mazmunga moslaydi, usiz ular juda katta bo‘ladi.
- `one_time_keyboard` bosilgandan keyin klaviaturani yashiradi, `is_persistent` esa uni ekranda qoldiradi.
- `input_field_placeholder` kiritish maydonida maslahat ko‘rsatadi.
- Maxsus tugmalar **kontakt**, **geolokatsiya** so‘rashi yoki **Mini App** ochishi mumkin.
- Klaviaturani olib tashlash uchun `ReplyKeyboardRemove` yuboriladi.

Kamchiliklari: har bir bosish chatni takroriy xabarlar bilan to‘ldiradi, bot esa oddiy matn oladi va uni satrlar bilan solishtirishi kerak. Tugma nomini o‘zgartirsangiz yoki tarjima qo‘shsangiz, eski handlerlar buziladi.

## Inline klaviatura: imkoniyatlar va cheklovlar

Inline tugma turlari:

- `callback_data` — botga ma’lumot uzatish (64 baytgacha);
- `url` — havolani ochish;
- `web_app` — Mini App ochish;
- `switch_inline_query` — botning inline rejimini boshqa chatda ishga tushirish;
- `pay` — hisobdagi to‘lov tugmasi;
- `copy_text` — matnni buferga nusxalash.

Asosiy qoida: har bir callback query’ga bot **`answerCallbackQuery`** chaqirishi shart, aks holda foydalanuvchida yuklanish belgisi aylanib turadi. Shu chaqiruvda qisqa bildirishnoma yoki alert ham ko‘rsatish mumkin.

aiogram 3 da inline klaviatura misoli:

```python
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

kb = InlineKeyboardMarkup(inline_keyboard=[
    [InlineKeyboardButton(text="Batafsil", callback_data="item:42:info")],
    [InlineKeyboardButton(text="Savatga", callback_data="item:42:add")],
])
```

64 bayt cheklovi `callback_data`ga ma’lumotli JSON emas, **qisqa identifikator** qo‘yilishini anglatadi. Qolganini bot bazadan oladi.

## Buyruqlar va menyu tugmasi

Klaviaturalardan tashqari yana ikkita navigatsiya elementi bor:

- **Buyruqlar** (`/start`, `/help`, `/catalog`) BotFather yoki `setMyCommands` metodi orqali beriladi. Ro‘yxatni tillar va chat turlari bo‘yicha farqli qilish mumkin.
- Kiritish maydoni chap tomonidagi **menyu tugmasi**. `setChatMenuButton` orqali u buyruqlar ro‘yxatini ko‘rsatadi yoki Mini App ochadi.

Ko‘pchilik botlar uchun yaxshi kombinatsiya: buyruqlar — asosiy bo‘limlarga kirish uchun, inline tugmalar — bo‘lim ichida ishlash uchun.

## Toza navigatsiya uchun UX qoidalari

1. **Ko‘paytirmang, tahrirlang.** Inline menyu bo‘ylab o‘tishda yangi xabar yubormang, joriy xabarni `editMessageText` bilan o‘zgartiring.
2. **Bir qatorda 2–3 tadan ortiq tugma qo‘ymang.** Telefonda uzun yozuvlar qirqiladi.
3. **Har doim chiqish yo‘li bering:** «Orqaga» va «Bosh menyu» tugmalari.
4. **Sababsiz aralashtirmang** katta reply klaviatura va inline tugmalarni bitta ekranda — foydalanuvchi qayerni bosishni tushunmaydi.
5. **Amalni tasdiqlang:** alohida xabar o‘rniga `answerCallbackQuery` orqali qisqa bildirishnoma.
6. **Eski xabarlarni hisobga oling.** Foydalanuvchi bir hafta oldingi tugmani bosishi mumkin — bot amal eskirganini to‘g‘ri aytishi kerak.

## Qachon qaysi birini tanlash

| Vazifa | Eng yaxshi variant |
|---|---|
| Doim qo‘l ostidagi bosh menyu | reply klaviatura yoki menyu tugmasi |
| Telefon raqami yoki geolokatsiya so‘rash | maxsus turdagi reply tugma |
| Katalog, sahifalash, filtrlar | inline tugmalar |
| «Ha / Yo‘q» tasdiqlash | inline tugmalar |
| Saytga yoki Mini App’ga o‘tish | `url` yoki `web_app` inline tugmasi |

## FAQ

### Inline va reply klaviaturani bir vaqtda ko‘rsatish mumkinmi?

Ha, lekin bitta xabarda emas: xabarda faqat bitta razmetka bo‘lishi mumkin. Reply klaviatura oldingi xabardan ekranda qoladi, inline tugmalar esa yangisiga biriktiriladi.

### Nega tugma bosilgandan keyin «aylanib» turadi?

Bot `answerCallbackQuery` chaqirmagan. Hech qanday bildirishnoma ko‘rsatish kerak bo‘lmasa ham javob berish shart.

### Tugmalarni bir nechta tilda qanday qilish mumkin?

Inline tugmalar bilan bu osonroq: yozuv tarjima qilinadi, `callback_data` esa bir xil qoladi. Reply tugmalarda har bir til uchun matnni solishtirishga to‘g‘ri keladi.
