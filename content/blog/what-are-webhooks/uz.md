---
title: Webhook nima va uning API’dan farqi
description: Webhook — hodisa yuz berganda servis sizga o‘zi yuboradigan HTTP so‘rov. Push va pull, imzoni tekshirish, qayta yuborish va idempotentlik haqida.
summary: Webhook — teskari chaqiruv: siz API orqali qayta-qayta so‘ramaysiz, balki tashqi servis biror narsa yuz berganda manzilingizga o‘zi HTTP so‘rov yuboradi.
---

## Webhook oddiy so‘zlar bilan

**API** — siz so‘raysiz: «Yangi to‘lovlar bormi?». **Webhook** — servis o‘zi xabar beradi: «To‘lov keldi, mana ma’lumotlar».

Texnik jihatdan webhook — oddiy HTTP so‘rov (ko‘pincha JSON bilan `POST`), uni tashqi tizim hodisa yuz bergan paytda siz oldindan ko‘rsatgan URL’ga yuboradi. Siz servisni so‘rab turmaysiz, xabarni kutasiz.

## Push va pull: farqi nimada

| | Pull (API’ni so‘rash) | Push (webhook) |
|---|---|---|
| Kim boshlaydi | Sizning ilovangiz | Tashqi servis |
| Kechikish | So‘rov chastotasiga bog‘liq | Hodisadan deyarli darhol keyin |
| Yuklama | Ko‘p bo‘sh so‘rovlar | So‘rov faqat hodisa bo‘lganda |
| Sizdan nima kerak | API klienti | Ochiq HTTPS endpoint |

Amalda ular birga ishlatiladi: webhook hodisa haqida xabar beradi, tafsilotlar uchun esa API’ga murojaat qilasiz.

## Webhook’lar qayerda uchraydi

- **To‘lov tizimlari**: to‘lov o‘tdi, bekor qilindi yoki qaytarildi. Do‘kon buyurtma holatini menejersiz o‘zgartiradi.
- **CRM**: bitim yaratildi yoki voronka bosqichi o‘zgardi — ma’lumot messenjer, ombor yoki analitikaga ketadi.
- **Telegram-botlar**: webhook rejimida Telegram har bir yangi xabarni serveringizga o‘zi yuboradi.
- **Git-hostinglar**: repozitoriyga push yig‘ish va deployni ishga tushiradi.

## Webhook’larni to‘g‘ri qabul qilish

### 1. Haqiqiyligini tekshiring

Endpoint ochiq, demak, unga istalgan odam so‘rov yuborishi mumkin. Odatda provayder so‘rov tanasini maxfiy kalit bilan imzolaydi (ko‘pincha HMAC), siz esa imzoni tekshirasiz.

```js
import crypto from "node:crypto";

function isValid(rawBody, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

Imzo parse qilingan JSON bo‘yicha emas, so‘rovning **xom tanasi** bo‘yicha hisoblanadi. Aniq algoritm va sarlavhani provayder hujjatlaridan qarang.

### 2. Tez javob bering

Provayder javobni cheklangan vaqt kutadi. To‘g‘ri sxema: imzoni tekshirdingiz, hodisani saqladingiz, darhol `200` qaytardingiz, og‘ir ishlov berishni esa navbatga topshirdingiz.

### 3. Qayta yuborishlarga tayyor bo‘ling

Agar serveringiz javob bermasa yoki xato qaytarsa, aksariyat servislar webhook’ni qayta yuboradi. Demak, bitta hodisa bir necha marta kelishi mumkin.

### 4. Ishlov berishni idempotent qiling

**Idempotentlik** — o‘sha hodisani qayta ishlash natijani o‘zgartirmaydi. Odatda hodisaning noyob ID’si bo‘ladi: uni saqlang va allaqachon ishlanganlarini o‘tkazib yuboring.

- Buyurtma ikki marta to‘langan deb belgilanmasligi kerak.
- Mijozga ikkita bir xil xat ketmasligi kerak.
- Ombordagi qoldiq ikki marta hisobdan chiqarilmasligi kerak.

### 5. Tartibga ishonmang

Hodisalar yuz bergan tartibda kelmasligi mumkin. Holatni vaqt yoki obyekt versiyasi bo‘yicha solishtiring, shubha bo‘lsa, joriy holatni API orqali so‘rang.

## Ko‘p uchraydigan xatolar

- Imzo tekshirilmaydi — istalgan odam to‘lovni «tasdiqlashi» mumkin.
- So‘rov ichida uzoq ishlov berish — provayder yetkazishni muvaffaqiyatsiz deb hisoblab, qayta yuboradi.
- Dublikatlardan himoya yo‘q — ikki marta yechib olish va xabarnomalar.
- Kiruvchi hodisalar logi yo‘q — nima noto‘g‘ri ketganini aniqlab bo‘lmaydi.
- HTTPS’siz endpoint.

## FAQ

### Webhook’siz, faqat API bilan ishlasa bo‘ladimi?

Bo‘ladi, agar servisni vaqti-vaqti bilan so‘rab tursangiz. Lekin bu kechikish va ortiqcha so‘rovlarga olib keladi, API limitlari bo‘lsa, muammoga aylanishi mumkin. Real vaqtdagi hodisalar uchun webhook qulayroq.

### Webhook’larni lokal qanday test qilish mumkin?

Provayderning test rejimidan va lokal serverga vaqtinchalik ochiq manzil beradigan tunneldan foydalaning. Ko‘p servislar shaxsiy kabinetdan hodisani qo‘lda qayta yuborish imkonini ham beradi.

### Webhook kelmasa nima qilish kerak?

Provayderning qayta yuborishlariga tayaning va zaxira tekshiruvni saqlang: o‘tkazib yuborilgan bo‘lishi mumkin bo‘lgan holatlarni vaqti-vaqti bilan API orqali so‘rab turing.
