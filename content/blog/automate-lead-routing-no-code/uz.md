---
title: Saytdagi arizalarni dasturlashsiz qanday avtomatlashtirish mumkin
description: Saytdagi arizalar uchun no-code oqim: jadvalga yozish, jamoaga messenjerda xabar, menejer biriktirish, dublikatlardan himoya va nosozlik haqida ogohlantirish.
summary: Sayt formasi Zapier, Make yoki n8n’ga webhook yuboradi; ssenariy kontaktlarni normallashtiradi, jadvalda dublikatni tekshiradi, menejerni navbat yoki qoida bo‘yicha biriktiradi, arizani yozadi va ishchi chatga xabar beradi, har qanday xatoda esa alohida ogohlantirish yuboradi.
---
## Sxema bir xatboshida

Formadagi ariza → avtomatlashtirish platformasiga **webhook** → telefon va email’ni **normallashtirish** → jadvalda **dublikatni qidirish** → **menejer** biriktirish → **Google Sheets**’ga qator yozish → **ishchi chatga** xabar (Telegram, Slack) → nosozlikda alohida kanalga **ogohlantirish**.

Buni Zapier, Make yoki n8n’da yig‘ish mumkin: mantiq bir xil, faqat qadamlar nomi farq qiladi.

## Oldindan nimani tayyorlash kerak

Quyidagi ustunli **«Arizalar» jadvali**:

| Ustun | Nima uchun |
|---|---|
| Sana | Ariza qachon kelgani |
| Ism | Qanday murojaat qilish |
| Telefon | Normallashtirilgan, dublikatlar kaliti |
| Email | Normallashtirilgan, ikkinchi kalit |
| Manba | Sahifa yoki UTM-belgi |
| Menejer | Kimga biriktirilgan |
| Holat | Yangi, ishda, yopilgan |
| Hodisa ID’si | Bitta hodisa ikki marta qayta ishlanmasligi uchun |

**«Sozlamalar» varag‘i**: menejerlar ro‘yxati va ularning messenjerdagi kontaktlari, «faol» belgisi va navbat bo‘yicha taqsimlash uchun hisoblagich katagi.

Arizalar uchun **ishchi chat** va texnik ogohlantirishlar uchun **alohida chat** — xatolar arizalar orasida yo‘qolib ketmasligi uchun.

## Bosqichma-bosqich yig‘ish

### 1. Arizani qabul qilish

**Webhook**’dan foydalaning: ko‘plab sayt konstruktorlari va formalar ma’lumotni URL’ga yubora oladi. Shunda ariza so‘rovsiz, darhol keladi. Forma webhook’ni qo‘llab-quvvatlamasa, platformaning shu forma bilan tayyor integratsiyasi mos keladi.

### 2. Normallashtirish

Har qanday solishtirishdan oldin ma’lumotlarni bitta ko‘rinishga keltiring:

- telefon — faqat mamlakat kodi bilan raqamlar, masalan `998901234567`;
- email — kichik harflarda, chetlaridagi bo‘sh joylarsiz;
- majburiy maydonlar bo‘sh bo‘lsa — ssenariyni filtr bilan to‘xtatib, logga yozing.

Bu qadamsiz `+998 90 123-45-67` va `998901234567` ikki xil odam deb hisoblanadi.

### 3. Dublikatlarni tekshirish

Jadvaldan xuddi shu telefon yoki email’li qatorni qidiring:

- So‘nggi bir necha kun ichida **topildi** — yangi ariza yaratmang, «takroriy murojaat» belgisini qo‘ying va allaqachon biriktirilgan menejerga xabar bering.
- **Topilmadi** — davom etamiz.

Qo‘shimcha ravishda **hodisa ID’sini** tekshiring: xizmat xuddi shu webhook’ni qayta yuborgan bo‘lsa, uni shunchaki o‘tkazib yuborish kerak.

### 4. Menejer biriktirish

Oddiydan murakkabgacha variantlar:

- **Navbat bo‘yicha (round-robin):** hisoblagich qiymatini olasiz, faollar ro‘yxatidan shu raqamdagi menejerni tanlaysiz, hisoblagichni oshirasiz. Bir vaqtda kelgan arizalarda hisoblagich ikki marta o‘qilishi mumkinligini hisobga oling; katta oqim uchun jadvaldan ko‘ra platformaning ma’lumotlar ombori ishonchliroq.
- **Qoida bo‘yicha:** shahar, mahsulot, til — router yoki Paths orqali.
- **Ish vaqtini hisobga olib:** jadvaldan tashqari ariza navbatchiga ketadi.

Menejerlar ro‘yxatini ssenariyga yozib qo‘ymang, sozlamalar varag‘idan oling: shunda xodimni almashtirish bitta qatorni tahrirlash bilan hal bo‘ladi.

### 5. Yozish va xabar berish

- Jadvalga barcha maydonlar va biriktirilgan menejer bilan qator qo‘shing.
- Ishchi chatga xabar yuboring: ism, telefon, manba va mas’ul xodimni eslatish. Jadval qatoriga havola ishni tezlashtiradi.

### 6. Nosozlik haqida ogohlantirishlar

- **Make**’da asosiy modullarga xato ishlovchisini, **n8n**’da Error Workflow’ni, **Zapier**’da xato bildirishnomalarini va iloji bo‘lsa zaxira yo‘lni qo‘shing.
- Ogohlantirishni xato matni va ariza ma’lumotlari bilan texnik chatga yuboring, shunda uni qo‘lda qayta ishlash mumkin bo‘ladi.
- **Nazorat tekshiruvi** foydali: ish vaqtida uzoq vaqt birorta ham ariza kelmasa, ssenariy bu haqda xabar beradi — balki formaning o‘zi buzilgandir.

## Keng tarqalgan xatolar

- **Normallashtirish yo‘q** — dublikatlar tekshiruvdan o‘tib ketadi.
- **Menejerlar qadamlarga yozilgan** — xodim almashgach, arizalar bo‘shliqqa ketadi.
- **Xatolar va arizalar bitta chatda** — ogohlantirishlar yo‘qoladi.
- **Kirish huquqlari cheklanmagan jadval** — havolasi bor har kim mijozlarning shaxsiy ma’lumotlarini ko‘radi. Kirishni cheklang va mamlakatingizda shaxsiy ma’lumotlarni saqlash talablarini aniqlang.

## FAQ

### Nega darhol CRM emas, jadval?

Jadval — tez start: uni sozlash oson va o‘qish tushunarli. Arizalar ko‘payganda yoki savdo voronkasi kerak bo‘lganda, xuddi shu ssenariyni yozish qadamini almashtirib, CRM’ga yo‘naltirish mumkin.

### Bu sxema uchun qaysi platformani tanlash kerak?

Oddiy chiziqli oqim uchun Zapier yetarli. Tarmoqlanish, massivlar bilan ishlash va moslashuvchan xatolarni qayta ishlash kerak bo‘lsa, Make qulayroq. O‘z serveringiz va ma’lumotlar ustidan nazorat muhim bo‘lsa, n8n mos keladi.

### Nosozlik paytida kelgan arizalar bilan nima qilish kerak?

Ogohlantirishlar ariza ma’lumotlari bilan sozlangan bo‘lsa, ular qo‘lda qayta ishlanadi. Ko‘plab xizmatlar muvaffaqiyatsiz webhook’larni qayta yuboradi, platformalar esa ishga tushishlar tarixini saqlaydi va u yerdan to‘xtagan bajarilishlarni qayta ishga tushirish mumkin.
