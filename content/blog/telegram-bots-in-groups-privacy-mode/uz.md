---
title: Telegram guruhlarida botlar: privacy mode va admin huquqlari
description: Telegram-bot guruhda qaysi xabarlarni ko‘radi, privacy mode va admin huquqlari buni qanday o‘zgartiradi hamda botni sozlashdagi keng tarqalgan xatolar.
summary: Standart holatda guruhdagi bot privacy mode’da ishlaydi va faqat buyruqlar, o‘z xabarlariga javoblar va xizmat hodisalarini ko‘radi; barcha xabarlarni olish uchun BotFather’da privacy mode’ni o‘chiring yoki botni admin qiling.
---
## Bot guruhda standart holatda nimani ko‘radi

Har bir yangi botda **privacy mode** (maxfiylik rejimi) yoqilgan bo‘ladi. Guruhda bunday bot butun yozishmani emas, faqat quyidagilarni oladi:

- **buyruqlar**, ya’ni `/` bilan boshlanadigan xabarlar (eng ishonchlisi — `/command@bot_nomi` ko‘rinishida);
- botning o‘z xabarlariga **javoblar (reply)**;
- **xizmat xabarlari**: kim qo‘shildi, kim chiqdi, nom o‘zgarishi, qadalgan xabarlar;
- inline rejimda **shu bot orqali** yuborilgan xabarlar.

Botga qaratilmagan oddiy xabarlar unga yetib bormaydi. Bu maxfiylik uchun qilingan: foydalanuvchilar bot hamma narsani o‘qimasligini bilishi kerak.

## Barcha xabarlarni qanday olish mumkin

Ikki usul bor:

1. BotFather’da **privacy mode’ni o‘chirish**: `/mybots` → bot → Bot Settings → Group Privacy → Turn off. Yoki `/setprivacy` buyrug‘i bilan.
2. **Botni guruh administratori qilish.** Admin-bot privacy mode’dan qat’i nazar barcha xabarlarni oladi.

Muhim jihat: privacy mode o‘zgartirilgandan keyin **botni guruhdan chiqarib, qayta qo‘shing**. Aks holda mavjud guruhlarda u eski sozlama bilan ishlashda davom etadi — «maxfiylikni o‘chirdim, lekin bot baribir hech narsani ko‘rmayapti» degan holatning eng ko‘p uchraydigan sababi shu.

## Bot hech qachon ko‘rmaydigan narsalar

- **Boshqa botlarning xabarlari.** Botlar bir-biriga javob yozib siklga tushib qolmasligi uchun Telegram guruhlarda boshqa botlarning xabarlarini botlarga yetkazmaydi.
- **Qo‘shilishidan oldingi tarix.** Bot API eski yozishmani yuklay olmaydi: bot faqat qo‘shilganidan keyin kelganlarni oladi.
- **Admin bo‘lmasa, kanal postlari.** Kanallarda bot faqat administrator sifatida ishlaydi va `channel_post` yangilanishlarini oladi.

## Admin huquqlari: minimal bering

Bot admin bo‘lganda unga alohida huquqlar beriladi. Faqat vazifaga keraklilarini bering:

| Bot vazifasi | Kerakli huquqlar |
|---|---|
| Spamni moderatsiya qilish | xabarlarni o‘chirish, a’zolarni bloklash |
| Yangi a’zolar uchun salomlashish va captcha | a’zolarni cheklash |
| E’lonlarni qadash | xabarlarni qadash |
| Taklif havolalarini berish | foydalanuvchilarni taklif qilish |
| Forum mavzulari bilan ishlash | mavzularni boshqarish |

**Administrator tayinlash** huquqi deyarli hech qachon kerak emas: bot tokeni sizib chiqsa, buzg‘unchi guruh ustidan nazoratni qo‘lga oladi.

## Sozlashdagi keng tarqalgan xatolar

- Privacy mode o‘zgargandan keyin **botni qayta ulamaslik**.
- **Kerakli yangilanishlarni so‘ramaslik.** A’zolar o‘zgarishi hodisalari (`chat_member`) faqat admin-botga va faqat `getUpdates` yoki `setWebhook` da `allowed_updates` ichida aniq ko‘rsatilganda keladi.
- **Eski chat_id’ni saqlab qolish.** Oddiy guruh superguruhga aylanganda uning identifikatori o‘zgaradi. Xizmat xabarida `migrate_to_chat_id` keladi — uni bazada yangilang.
- **Anonim admindan `from` kutish.** Administrator anonim yozsa, jo‘natuvchi sifatida odam emas, chatning o‘zi (`sender_chat`) ko‘rsatiladi.
- **Forum mavzularini e’tiborsiz qoldirish.** Mavzuli guruhlarda `message_thread_id` uzatib, o‘sha tarmoqqa javob bering.
- **Botni istalgan kishi qo‘shishi mumkin.** Agar bot guruhlar uchun mo‘ljallanmagan bo‘lsa, BotFather’da `/setjoingroups` orqali buni taqiqlang.

## Rejimni qanday tanlash

- **Bot buyruqlarga javob beradi** (so‘rovnomalar, eslatmalar, ma’lumotnoma) — privacy mode’ni yoqilgan holda qoldiring.
- **Moderator yoki antispam bot** — uni minimal huquqlar bilan admin qiling.
- **Bot butun yozishmani tahlil qiladi** (kalit so‘zlar bo‘yicha qidiruv, chatdan arizalar yig‘ish) — privacy mode’ni o‘chiring va a’zolarga bot xabarlarni o‘qishini ochiq ayting.

## FAQ

### Nega bot guruhda /start ga javob bermaydi?

Guruhda bir nechta bot bo‘lsa, umumiy buyruq boshqa botga ketishi mumkin. `/start@bot_nomi` shaklidan foydalaning va sozlamalar o‘zgargandan keyin bot qayta qo‘shilganini tekshiring.

### Bot guruh a’zosiga birinchi bo‘lib shaxsiy xabar yoza oladimi?

Yo‘q. Bot foydalanuvchiga faqat u botni o‘zi ishga tushirgandan keyin shaxsiy xabar yoza oladi. Buning uchun odatda `start` parametrli botga havola-tugma beriladi.

### Privacy mode o‘chirilgan bo‘lsa, botni admin qilish kerakmi?

Faqat unga admin amallari kerak bo‘lsa: xabarlarni o‘chirish, a’zolarni cheklash, postlarni qadash. Xabarlarni o‘qish uchun privacy mode’ni o‘chirish yetarli.
