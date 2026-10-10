---
title: Telegram Business: ish vaqti, tezkor javoblar va chat-botlar
description: Telegram Business’ga nimalar kiradi: ish vaqti, manzil, salomlashish va «joyda yo‘qman» xabarlari, tezkor javoblar va shaxsiy biznes-akkauntga chat-bot ulash.
summary: Telegram Business shaxsiy akkauntni ishchi akkauntga aylantiradi: ish vaqti va manzilni ko‘rsatadi, salomlashish va «joyda yo‘qman» xabarlarini o‘zi yuboradi, shablonli tezkor javoblar beradi va mijozlarga sizning nomingizdan javob beradigan botni ulash imkonini beradi.
---
## Qisqa javob

**Telegram Business** — mijozlar bilan o‘z shaxsiy akkauntidan muloqot qiladiganlar uchun funksiyalar to‘plami. U **Telegram Premium** obunasi bilan mavjud va «Sozlamalar» → «Telegram Business» bo‘limida sozlanadi. Asosiy imkoniyatlari:

- profilda **ish vaqti** va **manzil**;
- yangi mijozlar uchun **salomlashish xabari**;
- ish vaqtidan tashqari **«joyda yo‘qman» xabari**;
- **tezkor javoblar** — `/` orqali chaqiriladigan shablonlar;
- shaxsiy chatlaringizda javob beradigan **chat-botni ulash**.

Bu savdoni allaqachon shaxsiy yozishmada olib boradigan mutaxassislar va kichik jamoalar uchun yechim: ustalar, maslahatchilar, Telegram’dagi do‘konlar.

## Ish vaqti va manzil

**Ish vaqti** hafta kunlari bo‘yicha vaqt mintaqasi bilan belgilanadi. Mijoz profilda hozir ochiq yoki yopiqligini ko‘radi va javobni qachon kutishni tushunadi.

**Manzil** profilda xaritadagi nuqta bilan birga ko‘rsatiladi. Bu salonlar, kafelar, shourumlar va mijoz shaxsan keladigan har qanday joy uchun foydali.

## Salomlashish va «joyda yo‘qman» xabari

**Salomlashish xabari** sizga yangi odam yoki uzoq vaqt aloqaga chiqmagan kishi yozganda avtomatik yuboriladi. «Uzoq vaqt» muddatini o‘zingiz tanlaysiz. Kimga yuborish va kimni istisno qilishni ham ko‘rsatish mumkin, masalan mavjud kontaktlarni.

**«Joyda yo‘qman» xabari** siz band bo‘lganingizda yuboriladi. Jadval variantlari:

- doim — masalan, ta’tilda;
- ish vaqtidan tashqari;
- o‘z jadvalingiz bo‘yicha.

Yuborishni **faqat tarmoqda bo‘lmaganingizda** yoqish mumkin, shunda chatda turgan bo‘lsangiz, shablon bilan javob berilmaydi.

Bunday xabarlarda nima yozish kerak:

- o‘zingizni tanishtiring va nima bilan shug‘ullanishingizni qisqa ayting;
- qachon javob berishingizni ayting;
- vazifani darhol tasvirlab berishni so‘rang — shunda javob tezroq bo‘ladi;
- katalog yoki narxlar ro‘yxati bo‘lsa, havolasini bering.

## Tezkor javoblar

**Tezkor javoblar** — qisqa buyruqli saqlangan xabarlar. Chatda `/` ni kiritasiz va kerakli shablonni tanlaysiz: masalan, `/price`, `/address`, `/payment`. Shablonda matn, rasm va fayllar bo‘lishi mumkin.

Birinchi navbatda qaysi javoblarni saqlash kerak:

- narxlar yoki narxlar ro‘yxatiga havola;
- manzil va qanday borish;
- to‘lov va yetkazib berish usullari;
- eng ko‘p beriladigan ikki-uch savolga javoblar.

## Chat-botni ulash

Eng kuchli funksiya — **shaxsiy chatlaringizda ishlaydigan bot**. Mijoz sizga odatdagidek yozadi, bot esa javob beradi: ariza yig‘adi, tez-tez beriladigan savollarga javob beradi, vaqtga yozadi.

Bu qanday ishlaydi:

1. Bot **biznes rejimini** qo‘llab-quvvatlashi kerak: dasturchi uni BotFather orqali bot sozlamalarida yoqadi.
2. Telegram Business bo‘limida «Chat-botlar» bandida botni tanlaysiz.
3. U qaysi chatlarda ishlashini ko‘rsatasiz: tanlanganlardan tashqari hammasida yoki faqat tanlanganlarida.
4. Bot xabarlarga javob bera oladimi, hal qilasiz.

Istalgan chatda botni to‘xtatib, suhbatni o‘zingiz davom ettirishingiz mumkin.

Dasturchi uchun: bot ulanish haqida yangilanishlar va biznes-chatlardan xabarlarni oladi, javobni esa ulanish identifikatorini ko‘rsatib yuboradi:

```json
{
  "business_connection_id": "<ulanish ID>",
  "chat_id": 123456789,
  "text": "Assalomu alaykum! Qaysi xizmat sizni qiziqtiradi?"
}
```

Batafsil — [Bot API hujjatlarida](https://core.telegram.org/bots/api).

## Keng tarqalgan xatolar

- **Yarim ekranlik uzun salomlashish.** Mijoz bitta narsani bilmoqchi: qachon javob berishadi va nima yozish kerak.
- **Muddatsiz «joyda yo‘qman» xabari.** «Tez orada javob beramiz» iborasi hech narsani va’da qilmaydi.
- **Insonga uzatmaydigan bot.** Bot savolni tushunmasa, buni halol aytishi va chatni sizga uzatishi kerak.
- **Botni barcha chatlarga birdan qo‘yish**, jumladan yaqinlar bilan shaxsiy yozishmaga ham. Uni ishchi chatlar bilan cheklang.

## FAQ

### Telegram Business uchun Telegram Premium kerakmi?

Ha, Telegram Business funksiyalari Telegram Premium obunasiga kiradi. Botlar esa bepul yaratiladi, lekin ularni ishlab chiqish va server — alohida xarajatlar.

### Mijoz unga bot javob berayotganini ko‘radimi?

Xabarlar sizning chatingizda sizning nomingizdan yuboriladi. Baribir avtomatik javobni halol belgilash yaxshi amaliyot, shunda mijoz chalg‘imaydi.

### Telegram Business oddiy botdan nimasi bilan farq qiladi?

Oddiy bot — mijoz o‘tishi kerak bo‘lgan alohida akkaunt. Telegram Business’da bot sizning shaxsiy yozishmangizda javob beradi va mijoz siz bilan to‘g‘ridan-to‘g‘ri muloqot qiladi.
