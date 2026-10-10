---
title: Telegram-bot uchun webhook yoki long polling: qaysi birini tanlash
description: Telegram-bot uchun webhook va long pollingni solishtiramiz: sozlash, hostingga talablar, kechikish va ishonchlilik hamda qaysi usul qachon mos kelishi.
summary: Long polling oddiyroq: bot apdeytlarni o‘zi oladi va domen hamda SSL siz ishlaydi, bu ishlab chiqish va kichik botlar uchun qulay; webhook HTTPS manzilni talab qiladi, lekin prodakshen, masshtablash va serverless uchun yaxshiroq.
---
## Qisqa javob

Telegram botga hodisalarni (**apdeytlarni**) ikki usulda yetkazadi va bir vaqtda faqat bittasi ishlaydi.

- **Long polling** — bot Telegramdan `getUpdates` metodi orqali o‘zi so‘raydi: «yangi narsa bormi?». So‘rov hodisa paydo bo‘lguncha yoki taymaut tugaguncha ochiq turadi, keyin bot darhol keyingisini yuboradi.
- **Webhook** — siz bir marta `setWebhook` orqali Telegramga HTTPS manzilingizni aytasiz, keyin Telegram har bir apdeytni POST so‘rov bilan o‘zi yuboradi.

Soddaroq aytganda: polling da bot o‘zi qo‘ng‘iroq qiladi, webhook da qo‘ng‘iroqni kutadi.

## Solishtirish

| | Long polling | Webhook |
|---|---|---|
| Sozlash | Skriptni ishga tushirdingiz — ishlaydi | Domen, HTTPS va `setWebhook` sozlash kerak |
| Hosting | Internetga chiqadigan istalgan mashina, hatto NAT ortida | Internetdan kirish mumkin bo‘lgan ochiq manzil |
| SSL sertifikat | Kerak emas | Majburiy (Telegramga yuklansa, o‘zi imzolagani ham bo‘ladi) |
| Portlar | Cheklovsiz | Faqat 443, 80, 88 yoki 8443 |
| Kechikish | Deyarli bir zumda | Deyarli bir zumda |
| Doimiy jarayon | Kerak, bot doim ulanishni ushlab turadi | Shart emas, serverless ga mos |
| Botning bir nechta nusxasi | Mumkin emas: ikkinchi `getUpdates` 409 xatosini beradi | Balanslovchi ortida mumkin |
| Lokal sinash | Oddiy | Tunnel yoki test server kerak |

Amalda yetkazish tezligida deyarli farq yo‘q: long polling da javob hodisa paydo bo‘lishi bilan keladi.

## Ishonchlilik qanday ishlaydi

**Long polling.** Bot ishdan chiqsa, apdeytlar Telegram tomonida to‘planadi va qayta ishga tushgandan keyin olinadi. Ular cheklangan vaqt saqlanadi, shuning uchun uzoq to‘xtab qolish hodisalarni yo‘qotishni anglatadi. `offset` ni to‘g‘ri uzatish muhim, aks holda apdeytlar takror keladi.

**Webhook.** Serveringiz xato bilan javob bersa yoki javob bermasa, Telegram qayta yuboradi, lekin bir necha muvaffaqiyatsiz urinishdan keyin to‘xtaydi. Holatni `getWebhookInfo` da ko‘rish mumkin: kutilayotgan apdeytlar soni va oxirgi xato matni.

Webhook uchun ikki qoida:

- **tez javob bering** — darhol 200 qaytaring, og‘ir ishni navbatga qo‘ying;
- **manbani tekshiring** — `setWebhook` ga `secret_token` uzating, Telegram uni `X-Telegram-Bot-Api-Secret-Token` sarlavhasida yuboradi. Usiz kelgan so‘rovlarni rad eting.

## Webhookni qanday sozlash kerak

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://example.com/telegram/webhook" \
  -d "secret_token=long_random_string" \
  -d "drop_pending_updates=true"
```

Holatni tekshirish:

```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

Polling ga qaytish uchun `deleteWebhook` ni chaqiring: webhook o‘rnatilgan ekan, `getUpdates` xato qaytaradi.

## Qachon qaysi birini tanlash

**Long polling mos keladi, agar:**

- botni lokal ishlab chiqayotgan va sinayotgan bo‘lsangiz;
- bot kichik va bitta nusxada ishlasa;
- serverda ochiq manzil yoki domen bo‘lmasa;
- iloji boricha oddiy ishga tushirish kerak bo‘lsa.

**Webhook mos keladi, agar:**

- bot prodakshenda bo‘lsa va sizda HTTPS li domen allaqachon bo‘lsa;
- yuklama ostida botning bir nechta nusxasini ishga tushirish kerak bo‘lsa;
- bot serverless platformada yoki veb-ilova bilan birga ishlasa;
- doimiy ishlab turadigan jarayonni ushlab turishni istamasangiz.

Ko‘p uchraydigan ishchi variant: lokal — polling, serverda — webhook. aiogram kabi kutubxonalar ikkala rejimni qo‘llab-quvvatlaydi, almashtirish odatda bir necha qatorga to‘g‘ri keladi.

## Ko‘p uchraydigan xatolar

- Polling bilan botning ikki nusxasini ishga tushirish — ular bir-biridan apdeytlarni «o‘g‘irlaydi» va 409 xatosini oladi.
- Webhookka javob berishdan oldin uzoq ishlov berish — Telegram buni nosozlik deb hisoblaydi va apdeytni qayta yuboradi.
- `secret_token` ni unutib, hammadan so‘rov qabul qilish.
- Server ko‘chirilgandan keyin webhook manzilini yangilamaslik.

## FAQ

### Qaysi usul tezroq?

Foydalanuvchi uchun farq sezilmaydi. Ikkala usul ham apdeytni hodisadan deyarli darhol keyin yetkazadi; tanlov tezlikka emas, infratuzilmaga bog‘liq.

### Ikkala usuldan bir vaqtda foydalansa bo‘ladimi?

Yo‘q. Webhook o‘rnatilgan ekan, `getUpdates` ishlamaydi. Polling ga o‘tish uchun avval webhookni o‘chiring.

### Polling prodakshen uchun yaroqlimi?

Ha, agar bot barqaror serverda bitta nusxada ishlasa. Ko‘plab botlar yillar davomida shunday ishlaydi. Webhook masshtablash yoki serverless kerak bo‘lganda zarur bo‘ladi.
