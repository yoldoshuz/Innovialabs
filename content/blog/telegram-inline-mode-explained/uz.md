---
title: Telegram-botlarning inline rejimi nima va undan qanday foydalanish
description: Istalgan chatda @bot so‘rovlari qanday ishlaydi, inline rejimda qanday natija turlari bor va biznes u orqali katalog mahsulotlarini qanday ulashadi.
summary: Inline rejim istalgan chatda @bot_nomi va so‘rov yozib botni chaqirish imkonini beradi: bot natijalar ro‘yxatini qaytaradi, foydalanuvchi tanlanganini joriy chatga yuboradi — mahsulot, maqola va havolalarni ulashish uchun qulay.
---
## Inline rejim qanday ishlaydi

**Inline rejim** — botdan u bilan chatni ochmasdan foydalanish usuli. Foydalanuvchi istalgan dialog, guruh yoki kanalda kiritish maydoniga `@bot_nomi` va so‘rov matnini yozadi, masalan `@shopbot krossovka`. Klaviatura ustida natijalar ro‘yxati chiqadi, tanlangan natija esa joriy chatga «via @bot_nomi» belgisi bilan yuboriladi.

Asosiy xususiyatlari:

- bot chaqirilgan chatning **a’zosi bo‘lishi shart emas**;
- bot **yozishmani ko‘rmaydi** — faqat so‘rov matni va foydalanuvchi haqidagi ma’lumotni oladi;
- xabarni foydalanuvchining o‘zi yuboradi, shuning uchun suhbatdoshlar uni o‘sha foydalanuvchi nomidan ko‘radi.

## Texnik jihatdan qanday tuzilgan

1. Rejim BotFather’da `/setinline` buyrug‘i bilan yoqiladi, o‘sha yerda maslahat-placeholder ham beriladi.
2. Foydalanuvchi so‘rov yozayotganda bot **`inline_query`** yangilanishini oladi: so‘rov matni, sahifalash uchun `offset` va odatda qidiruv bo‘layotgan chat turi.
3. Bot **`answerInlineQuery`** metodi bilan javob beradi va bir martada 50 tagacha natija yuboradi.
4. Qaysi natija tanlanganini bilish uchun `/setinlinefeedback` ni yoqing — shunda `chosen_inline_result` yangilanishi keladi.

Javobning foydali parametrlari:

- `cache_time` — Telegram natijalarni o‘z tomonida necha soniya keshlashi;
- `is_personal` — natijalar shaxsiy bo‘lsa, har bir foydalanuvchi uchun alohida keshlash;
- `next_offset` — aylantirganda keyingi qismni yuklash;
- `button` — natijalar ustidagi tugma, u bot bilan shaxsiy chatni yoki Mini App’ni ochadi, masalan avtorizatsiya uchun.

## Natija turlari

| Tur | Nima yuboriladi |
|---|---|
| Article | matnli xabar, ko‘pincha prevyu va tugmalar bilan |
| Photo, GIF, Video | havola orqali yoki Telegram’ga yuklangan media |
| Audio, Voice, Document | audio, ovozli xabar, fayl |
| Location, Venue | xaritadagi nuqta yoki manzilli joy |
| Contact | kontakt kartochkasi |
| Game | botda ro‘yxatdan o‘tgan o‘yin |

Media uchun «keshlangan» variantlar ham bor: ular Telegram’ga allaqachon yuklangan faylning `file_id` sidan foydalanadi, bu tashqi havolalardan tezroq va ishonchliroq. Har qanday natijaga **inline klaviatura** biriktirish mumkin, masalan «Do‘konda ochish» tugmasi.

## Biznes uchun foydasi

- **Mahsulotni ulashish.** Xaridor `@shopbot` orqali mahsulot qidiradi, rasmi va narxi bor kartochkani do‘stiga yoki oilaviy chatga yuboradi, tugma esa buyurtma uchun botga yoki Mini App’ga olib boradi.
- **Bilimlar bazasi va qo‘llab-quvvatlash.** Xodim tayyor javob yoki yo‘riqnoma havolasini to‘g‘ridan-to‘g‘ri mijoz bilan dialogga qo‘yadi.
- **Referal havolalar va promokodlar.** Foydalanuvchi shaxsiy taklifnomani istalgan chatga yuboradi.
- **Kontent tanlash.** Maqolalar, retseptlar, jadval, valyuta kurslari — odamlar yozishmada muhokama qiladigan hamma narsa.
- **Birgalikdagi qarorlar.** Guruh chatiga yozilish sloti, so‘rovnoma yoki uchrashuv manzilini yuborish.

## Keng tarqalgan xatolar

- **Sekin javob.** Foydalanuvchi har bir belgi yozilganda natijani kutadi. Ro‘yxatni to‘liq aylanib emas, indeks bo‘yicha qidiring va har bir belgiga tashqi API’larga og‘ir so‘rov yubormang.
- **Bo‘sh so‘rovda natija yo‘q.** Foydalanuvchi faqat `@bot_nomi` yozganda mashhur yoki oxirgi pozitsiyalarni ko‘rsating.
- **Noto‘g‘ri kesh.** `is_personal` siz shaxsiy narxlar yoki akkaunt ma’lumotlari keshdan boshqa foydalanuvchilarga tushib qolishi mumkin.
- **Tugmalarga oddiy xabardagidek munosabat.** Inline xabarda odatiy `message` yo‘q, callback query’da `inline_message_id` keladi va tahrirlash ham u orqali qilinadi.

## FAQ

### Inline rejimdan foydalanish uchun botni guruhga qo‘shish kerakmi?

Yo‘q. Agar guruh adminlari botlar orqali yuboriladigan xabarlarni cheklamagan bo‘lsa, inline rejim foydalanuvchi xabar yoza oladigan har qanday chatda ishlaydi.

### Bot o‘zi chaqirilgan chatdagi xabarlarni ko‘radimi?

Yo‘q. Bot faqat so‘rov matni, foydalanuvchi ma’lumotlari va, agar foydalanuvchi rozi bo‘lsa, geolokatsiyani oladi. Qolgan yozishma unga ko‘rinmaydi.

### Inline rejim inline tugmalardan nimasi bilan farq qiladi?

Inline tugmalar bot bilan chatdagi bot xabarlariga biriktiriladi. Inline rejim esa botni istalgan boshqa chatda `@bot_nomi` orqali chaqirish. Ularni faqat shu rejimni ishga tushiradigan `switch_inline_query` tugmasi bog‘laydi.
