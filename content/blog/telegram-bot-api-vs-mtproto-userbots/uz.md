---
title: Bot API yoki MTProto: Telethon, Pyrogram va userbot xavflari
description: Bot API va klient MTProto API farqi, lokal Bot API server yoki Telethon qachon kerak va userbotlar nimani xavf ostiga qo‘yadi: ban va qoidabuzarlik.
summary: Biznes botlar uchun deyarli doim Bot API yetarli; katta fayllar uchun lokal Bot API server yoki bot nomidan MTProto kerak, shaxsiy akkauntdagi userbotlar esa kamdan-kam oqlanadi va ban hamda Telegram qoidalarini buzish xavfini tug‘diradi.
---
## Qisqa javob

- **Bot API** — Telegram ning o‘zi qo‘llab-quvvatlaydigan botlar uchun HTTP interfeys. Vazifalarning aksariyat qismiga mos: qo‘llab-quvvatlash, savdo, bildirishnomalar, Mini App lar, to‘lovlar.
- **MTProto** — rasmiy klientlar ishlaydigan Telegram ning asl protokoli. **Telethon** yoki **Pyrogram** kabi kutubxonalar orqali bot nomidan ham, **oddiy foydalanuvchi** nomidan ham (userbot) ishlash mumkin.
- **Userbot** — shaxsiy akkauntni avtomatlashtirish. Ko‘proq imkoniyat beradi, lekin bloklanish va API foydalanish shartlarini buzish xavfi bor.

## Taqqoslash

| | Bot API | Bot nomidan MTProto | MTProto userbot |
|---|---|---|---|
| Kirish | Bot tokeni | Bot tokeni + `api_id`/`api_hash` | Telefon raqami + kod |
| Transport | Telegram serverlariga HTTPS | O‘z ulanishi | O‘z ulanishi |
| Ko‘radigan xabarlar | Faqat botga yo‘naltirilganlar | Bot kabi | Akkaunt ko‘radigan hammasi |
| Fayl cheklovlari | Bor, bulutli Bot API da | Ancha yumshoq | Klientdagidek |
| Murakkablik | Past | O‘rta | O‘rta |
| Ban xavfi | Qoidalarga rioya qilinsa minimal | Minimal | Sezilarli |

Muhim nozik jihat: **MTProto userbot degani emas**. Telethon va Pyrogram bot tokeni bilan avtorizatsiya qila oladi. Siz maqomi aniq bot bo‘lib qolgan holda protokol imkoniyatlarini olasiz.

## Bot API qachon yetarli

- Mijozlar bilan dialoglar, menyular, formalar, FSM.
- Bot obunachilariga bildirishnoma va rassilkalar.
- Mini App lar, Telegram Payments va Stars.
- Bot administrator sifatida qo‘shilgan guruh va kanallarda ishlash.

Agar vazifa Bot API bilan hal bo‘lsa, unda qoling: uni Telegram qo‘llab-quvvatlaydi, u barqaror va istalgan dasturchiga tushunarli.

## Lokal Bot API server qachon kerak

Telegram Bot API serverining manba kodini e’lon qilgan. Uni o‘zingizda ishga tushirib, bot so‘rovlarini shu yerga yo‘naltirish mumkin. Bu o‘sha Bot API, faqat boshqa imkoniyatlar bilan:

- **katta fayllar**: bulutli Bot API ga qaraganda yuklash va yuklab olish limitlari sezilarli darajada yuqori;
- fayllar HTTP orqali yuklab olinmasdan **lokal diskdan** mavjud;
- webhook ni **lokal manzilga**, HTTP orqali va istalgan portga yuborish mumkin;
- webhook uchun ko‘proq parallel ulanishlar.

Bahosi — joylashtirish, yangilash va monitoring qilish kerak bo‘lgan alohida servis. Video, arxiv va hujjatlar bilan ishlaydigan botlar uchun bu odatda o‘zini oqlaydi.

## MTProto qachon oqlanadi

- **Klient ilovalar**: o‘z Telegram klientingiz yoki foydalanuvchi ongli ravishda o‘z akkauntiga kiradigan integratsiya.
- **Bot nomidan fayllar bilan ishlash**, agar lokal Bot API server biror sababga ko‘ra mos kelmasa.
- **O‘z akkauntingizni me’yoriy hajmda avtomatlashtirish**: o‘z chatlaringizni arxivlash, eksport, ma’lumotlarni ko‘chirish.
- **O‘z kanallaringiz analitikasi**, agar kerakli ma’lumotlar Bot API va ichki statistikada bo‘lmasa.

Kutubxonani tanlashdan oldin u **hozir qo‘llab-quvvatlanayotganini** tekshiring. Asl Pyrogram endi faol rivojlanmayapti, hamjamiyat forklardan foydalanadi. Telethon, TDLib va GramJS — boshqa keng tarqalgan variantlar.

## Userbot xavflari

**Akkauntni bloklash.** Telegram shubhali faollikni kuzatadi: guruhlarga ommaviy qo‘shilish, notanish odamlarga xabar yuborish, tez-tez takrorlanadigan bir xil harakatlar, birinchi kundan avtomatlashtirilgan yangi raqamlar. Oqibatlari — vaqtinchalik cheklovlardan akkauntni o‘chirishgacha.

**API shartlarini buzish.** Telegram API foydalanish shartlari spam, obunachi va ko‘rishlarni sun’iy oshirish, foydalanuvchi ma’lumotlarini roziliksiz yig‘ish va rasmiy klientlarga taqlid qilishni taqiqlaydi. Buzilish `api_id` ning bekor qilinishiga olib kelishi mumkin.

**`FLOOD_WAIT` xatolari.** Protokol necha soniya kutish kerakligini aniq aytadi. Bunday xatolarni e’tiborsiz qoldirish — cheklovlarga tez yo‘l.

**Sessiya xavfsizligi.** Sessiya fayli yoki sessiya satri — parol va kodsiz **akkauntga to‘liq kirish**. Uning sizib chiqishi akkaunt o‘g‘irlanishiga teng. Uni sir sifatida saqlang, repozitoriyga kommit qilmang.

**Huquqiy masalalar.** Begona guruhlardan xabar va kontaktlarni yig‘ish — shaxsiy ma’lumotlarni qayta ishlash. Shaxsiy ma’lumotlar to‘g‘risidagi qonunlar, jumladan mahalliy qonunlar, qonuniy asos va rozilikni talab qiladi.

## Qanday tanlash kerak

1. **Bot API** dan boshlang.
2. Fayl hajmiga taqalsangiz — **lokal Bot API server**.
3. Protokol imkoniyatlari kerak bo‘lsa — **bot nomidan MTProto**.
4. Userbot — faqat o‘z akkauntingiz uchun, me’yoriy hajmda va xavflarni tushungan holda. Savdo bog‘liq bo‘lgan biznes jarayonni unga qurmang.

## FAQ

### Userbot orqali mijozlarga rassilka qilish mumkinmi?

Texnik jihatdan ha, lekin bu banga to‘g‘ri yo‘l: notanish odamlarga xabarlar spam deb baholanadi. Mijozlar bilan muloqot uchun ular o‘zlari yozgan botdan yoki kanaldan foydalaning.

### Bot API uchun api_id kerakmi?

Yo‘q. Bot API uchun bot tokeni yetarli. `api_id` va `api_hash` faqat MTProto orqali ishlash uchun kerak, jumladan Telethon yoki Pyrogram da bot tokeni bilan kirishda.

### Lokal Bot API serverni qo‘llab-quvvatlash qanchalik qiyin?

Bu fayl omboriga ega alohida servis: uni joylashtirish, Bot API ning yangi versiyalaridan keyin yangilash va monitoring qilish kerak. DevOps amaliyotiga ega jamoa uchun bu odatiy vazifa.
