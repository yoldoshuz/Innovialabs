---
title: Telegram Mini App da initData ni backendda qanday tekshirish kerak
description: Telegram Mini App da initData imzosini tekshirish: HMAC algoritmi, auth_date yangiligi, bot tokenisiz tekshiruv va nega initDataUnsafe ga ishonib bo‘lmaydi.
summary: Serverga xom initData satrini yuboring, bot tokeni va WebAppData satridan olingan kalit bilan HMAC-SHA-256 ni qayta hisoblang, hash bilan solishtiring va auth_date ni tekshiring — initDataUnsafe ga hech qachon ishonmang.
---
## Qisqa javob

Mini App ochilganda Telegram unga **initData** ni uzatadi — foydalanuvchi ma’lumotlari va `hash` imzosi bor query string formatidagi satr. Backend quyidagilarni qilishi kerak:

1. Klientdan `Telegram.WebApp.initData` ning **xom satrini** olish.
2. Bot tokeni yordamida imzoni qayta hisoblab, `hash` bilan solishtirish.
3. `auth_date` yetarlicha yangi ekanini tekshirish.
4. Shundan keyingina `user.id` ni olib, sessiya yaratish.

## Nega initDataUnsafe ga ishonib bo‘lmaydi

`Telegram.WebApp.initDataUnsafe` — o‘sha ma’lumotlar, faqat klientda obyektga ajratilgan. Nomidagi **Unsafe** so‘zi — to‘g‘ridan-to‘g‘ri ogohlantirish:

- Mini App — oddiy veb-sahifa. Uni brauzerda ochib, `window.Telegram` ni almashtirish yoki DevTools da so‘rovni tahrirlash mumkin.
- Istalgan odam API ingizga `{"user": {"id": 123}}` yuborib, boshqa foydalanuvchi qiyofasiga kirishi mumkin.
- `initDataUnsafe` faqat ko‘rsatish uchun yaraydi: sarlavhadagi ism, ma’lumot yuklanguncha avatar. Avtorizatsiya, to‘lov va ma’lumotlarga kirish uchun — faqat tekshirilgan `initData`.

## Imzoni tekshirish algoritmi

1. `initData` satrini query string sifatida ajrating. `hash` qiymatini chetga oling.
2. Qolgan juftliklarni kalit bo‘yicha saralang va `\n` orqali `key=value` satriga birlashtiring. Qiymatlarni **dekodlangan, lekin o‘zgartirilmagan** holda oling — `user` maydonidagi JSON ni qayta yig‘mang.
3. Maxfiy kalit: `HMAC-SHA-256(key="WebAppData", message=bot_token)`.
4. Kutilgan imzo: `hex(HMAC-SHA-256(key=secret_key, message=data_check_string))`.
5. Uni `hash` bilan doimiy vaqtda solishtiring.

```js
import crypto from "node:crypto";

export function validateInitData(initData, botToken, maxAgeSec = 3600) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;

  return JSON.parse(params.get("user") ?? "null");
}
```

Mashhur kutubxonalarda tayyor yechimlar bor: masalan, aiogram dagi `safe_parse_webapp_init_data` yoki `@telegram-apps/init-data-node` paketi. Ulardan foydalansangiz ham, muddat tekshiruvi yoqilganiga ishonch hosil qiling.

## auth_date yangiligi

Imzo haqiqiylikni isbotlaydi, lekin yangilikni emas. Ushlab qolingan `initData` satrini siz qabul qilib turgan ekansiz, qayta yuborish mumkin.

- Ssenariyga mos **maksimal yoshni** belgilang: to‘lov uchun qisqa, katalogni ko‘rish uchun uzunroq.
- `initData` ni **bir martalik ruxsatnoma** sifatida ishlating: tekshirdingiz — aniq amal qilish muddatiga ega o‘z sessiya tokeningizni berasiz.
- Serverda vaqt aniq bo‘lishini kuzating (NTP), aks holda yangi ma’lumotlar rad etiladi.

## initData ni serverga qanday uzatish

- Satrni sarlavhada yuboring, masalan `Authorization: tma <initData>` — ekotizimdagi bir qator kutubxonalarda shunday qabul qilingan.
- `initData` ni URL ga qo‘ymang: u proksi va analitika loglariga tushadi.
- Imzoni har bir handlerda alohida emas, **bitta middleware** da tekshiring.

## Bot tokenisiz tekshirish

Ba’zan foydalanuvchi ma’lumotlarini tokeningiz bo‘lmagan uchinchi tomon servisi tekshirishi kerak. Buning uchun `initData` da **`signature`** maydoni bor — Telegram ning ochiq kaliti bilan tekshiriladigan Ed25519 imzosi.

- Tekshiriladigan satr `<bot_id>:WebAppData` bilan boshlanadi, keyin `\n` orqali **`hash` va `signature` siz** saralangan maydonlar keladi.
- Ishchi va test muhitlari uchun ochiq kalitlar Telegram hujjatlarida e’lon qilingan.
- Shu tarzda servis tokenni olmasdan ma’lumotlar aynan sizning botingiz uchun berilganiga ishonch hosil qiladi.

Bot tokeni — bot ustidan to‘liq nazorat. Imzoni tekshirish uchun uni hamkorlarga berib bo‘lmaydi.

## Ko‘p uchraydigan xatolar

- **`user` JSON ini qayta yig‘ish**: kalitlar tartibi yoki ekranlash o‘zgaradi — imzo mos kelmaydi.
- **Ikki marta dekodlash** yoki aksincha, kodlangan qiymatlardan foydalanish.
- **HMAC argumentlarini almashtirib qo‘yish**: maxfiy kalit — `WebAppData` kaliti bilan tokendan olingan HMAC, teskarisi emas.
- Imzoni tekshirib, `auth_date` ni tekshirmaslik.
- Bitta bot uchun test va ishchi muhitda turli tokenlar.

## FAQ

### Bu Telegram Login Widget tekshiruvidan nimasi bilan farq qiladi?

Algoritm o‘xshash, lekin maxfiy kalit boshqa: Login Widget da bu tokenning SHA-256 qiymati, Mini App da esa `WebAppData` kaliti bilan tokenning HMAC-SHA-256 qiymati. Biri uchun yozilgan kod ikkinchisiga o‘zgartirishsiz mos kelmaydi.

### Nega initData bo‘sh?

Ko‘pincha Mini App bot tugmasi yoki havolasi orqali emas, to‘g‘ridan-to‘g‘ri brauzerda ochilgan yoki ma’lumotlar to‘plami cheklangan klaviatura tugmasidan ishga tushirilgan. Ishga tushirish usulini tekshiring.

### initData ni sessiya sifatida saqlash mumkinmi?

Yaxshisi yo‘q. Uni kirishda bir marta tekshiring va o‘z sessiya tokeningizni bering. Shunda amal qilish muddati va ruxsatni bekor qilishni o‘zingiz boshqarasiz.
