---
title: Telegram Bot API qanday ishlaydi: apdeytlar, metodlar va token
description: Telegram Bot API qanday ishlaydi: HTTP so‘rovlar va JSON javoblar, Update obyekti, sendMessage kabi asosiy metodlar, token roli va ko‘p uchraydigan xatolar.
summary: Bot API — bu HTTP interfeys: kodingiz bot tokeni bilan api.telegram.org manzilidagi metodlarni chaqiradi va JSON oladi, kiruvchi hodisalar esa getUpdates yoki webhook orqali Update obyektlari ko‘rinishida keladi.
---
## Qisqa javob

**Telegram Bot API** — dasturingiz va Telegram o‘rtasidagi HTTP interfeys. Model oddiy:

- **Siz → Telegram**: metodga (`sendMessage`, `sendPhoto` va hokazo) HTTP so‘rov yuborasiz va JSON javob olasiz.
- **Telegram → siz**: bot bilan sodir bo‘ladigan hamma narsa (xabarlar, tugma bosishlar, to‘lovlar) **Update** obyektlari ko‘rinishida keladi.

Har bir so‘rov bot **tokeni** bilan imzolanadi — u to‘g‘ridan-to‘g‘ri manzil tarkibiga kiradi. aiogram, python-telegram-bot yoki grammY kabi kutubxonalar ham aynan shuni qiladi, faqat qulayroq.

## So‘rov manzili va token

Barcha metodlar bitta shablon bo‘yicha chaqiriladi:

```text
https://api.telegram.org/bot<TOKEN>/<METHOD_NAME>
```

**Token**ni bot yaratilganda @BotFather beradi. U son, ikki nuqta va uzun belgilar qatoridan iborat. Bilish muhim:

- token — botga **to‘liq kirish huquqi**: uni bilgan kishi kiruvchi xabarlarni o‘qiy oladi va bot nomidan yoza oladi;
- uni ochiq repozitoriyda yoki frontendda saqlab bo‘lmaydi — faqat muhit o‘zgaruvchilarida yoki server sirlarida;
- sizib chiqsa, @BotFather orqali yangi token chiqariladi, eskisi darhol ishlamay qoladi.

Eng oddiy tekshiruv — `getMe` metodi:

```bash
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

## Javob formati

Har qanday javob `ok` maydoniga ega JSON:

```json
{"ok": true, "result": {"id": 123456789, "is_bot": true, "first_name": "Demo", "username": "demo_bot"}}
```

Xatoda `ok` qiymati `false` bo‘ladi, yonida `error_code` va `description` keladi. Eng ko‘p uchraydiganlari:

| Kod | Ma’nosi |
|---|---|
| 400 | Noto‘g‘ri parametrlar: bo‘sh matn, mavjud bo‘lmagan chat_id, belgilashdagi xato |
| 401 | Noto‘g‘ri token |
| 403 | Foydalanuvchi botni bloklagan yoki bot bu chatga yoza olmaydi |
| 409 | Apdeyt olish usullari ziddiyati (bir vaqtda webhook va getUpdates) |
| 429 | So‘rovlar juda ko‘p; javobda `retry_after` — necha soniyadan keyin takrorlash kerakligi |

## Update obyekti

Har bir kiruvchi hodisa — noyob `update_id` va quyidagi maydonlardan **bittasi**ga ega **Update**: `message`, `edited_message`, `callback_query`, `channel_post`, `inline_query`, `pre_checkout_query`, `my_chat_member` va boshqalar.

```json
{
  "update_id": 100000001,
  "message": {
    "message_id": 5,
    "from": {"id": 123456789, "is_bot": false, "first_name": "Ali"},
    "chat": {"id": 123456789, "type": "private"},
    "date": 1700000000,
    "text": "/start"
  }
}
```

Apdeytdagi eng kerakli qiymat — `chat.id`: bot javobni aynan shu yerga yuboradi.

Apdeytlarni olishning ikki usuli bor:

- **getUpdates** — kodingiz Telegramdan yangi hodisalarni o‘zi so‘raydi va bir xil narsani qayta olmaslik uchun `offset` (oxirgi `update_id` + 1) uzatadi;
- **webhook** — Telegram har bir apdeytni HTTPS manzilingizga POST so‘rov bilan o‘zi yuboradi.

Olinmagan apdeytlarni Telegram cheklangan vaqt saqlaydi, shuning uchun uzoq ishlamay turgan bot eski hodisalarni ko‘rmasligi mumkin.

## Asosiy metodlar

- `sendMessage` — belgilash va tugmalar bilan matn.
- `sendPhoto`, `sendDocument`, `sendVideo` — media va fayllar.
- `editMessageText`, `deleteMessage` — o‘z xabarini o‘zgartirish yoki o‘chirish.
- `answerCallbackQuery` — inline-tugma bosilganini tasdiqlash, aks holda foydalanuvchida yuklanish belgisi osilib qoladi.
- `setMyCommands` — bot buyruqlari menyusi.
- `setWebhook`, `getWebhookInfo`, `deleteWebhook` — apdeytlar yetkazilishini boshqarish.

Tugmali xabar yuborish misoli:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": 123456789, "text": "Salom! Amalni tanlang:", "reply_markup": {"inline_keyboard": [[{"text": "Katalog", "callback_data": "catalog"}]]}}'
```

Parametrlarni query string, form-data yoki JSON ko‘rinishida uzatish mumkin. Fayllar `multipart/form-data` orqali yuklanadi.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- getUpdates ga `offset` uzatmaslik va bir xil xabarlarni qayta-qayta olish.
- `callback_query` ga javob bermaslik — tugma «qotib qoladi».
- 429 xatosini e’tiborsiz qoldirib, pauzasiz so‘rov yuborishda davom etish.
- 403 ni qayta ishlamaslik: foydalanuvchi botni bloklagan va uni tarqatmadan olib tashlash kerak.

Metodlar va turlarning to‘liq ro‘yxati — [Bot API rasmiy hujjatlarida](https://core.telegram.org/bots/api).

## FAQ

### Kutubxonadan foydalanish shartmi?

Yo‘q, istalgan HTTP klient yetarli. Lekin kutubxona apdeytlarni tahlil qilish, buyruqlarni yo‘naltirish, xatoda qayta urinish va fayllar bilan ishlashni o‘z zimmasiga oladi, shuning uchun real loyihada odatda uni tanlashadi.

### Bot API orqali foydalanuvchining barcha xabarlarini o‘qish mumkinmi?

Yo‘q. Bot faqat o‘ziga yo‘naltirilgan narsani oladi: botga shaxsiy xabarlar, guruhlarda esa buyruqlar va eslatmalar (agar privacy mode o‘chirilmagan yoki bot admin bo‘lmasa).

### Token sizib chiqsa nima qilish kerak?

Uni darhol @BotFather da qayta chiqarib, serverda yangilang. Eski token ishlamay qoladi va buzg‘unchi kirish huquqini yo‘qotadi.
