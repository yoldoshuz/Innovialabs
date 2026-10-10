---
title: Telegram’da ariza yig‘uvchi bot ssenariysini loyihalash
description: Bot dialogini birinchi aloqadan saralangan arizagacha qurish: kirish nuqtalari, savollar, tarmoqlanish, kontakt so‘rash, lid-magnit va menejerga xabar berish.
summary: Yaxshi ssenariy aniq foydadan boshlanadi, tugmalar bilan 2-4 ta savol beradi, javoblarga qarab tarmoqlanadi, telefonni «Kontaktni ulashish» tugmasi orqali so‘raydi va menejerga darhol barcha javoblar hamda manba yozilgan ariza kartochkasini yuboradi.
---
## Qisqa javob

Ariza yig‘uvchi bot ssenariysi — besh qadamdan iborat qisqa yo‘l:

1. Aniq va’da bilan **kirish**: odam nimani oladi.
2. **Saralash**: tugmalardagi javob variantlari bilan 2-4 ta savol.
3. **Tarmoqlanish**: turli javoblar uchun turli davomlar.
4. **Kontakt**: «Kontaktni ulashish» tugmasi orqali telefon.
5. **Uzatish**: menejerga ariza kartochkasi va mijoz uchun tushunarli keyingi qadam.

Odamni shu yo‘l bo‘ylab olg‘a siljitmaydigan hamma narsani olib tashlagan ma’qul.

## 1-qadam. Kirish nuqtalari

Odam botga turli joylardan keladi va buni birinchi xabardanoq bilish kerak:

- Telegram yoki boshqa kanallardagi reklama;
- kanalingizdagi tugma yoki qadalgan post;
- oflayndagi QR-kod;
- saytdagi havola.

Har bir manba uchun parametrli alohida havola qiling: `t.me/your_bot?start=ads_spring`. Bot `/start ads_spring`ni oladi, manbani saqlaydi va dialogni turlicha boshlashi mumkin: masalan, darhol e’londa bo‘lgan narsani taklif qiladi.

## 2-qadam. Birinchi xabar

Birinchi xabar odam davom etadimi yoki yo‘qmi, shuni hal qiladi. Unda nima bo‘lishi kerak:

- bir qatorda **siz kimsiz**;
- botda bir-ikki daqiqada **odam nima oladi**: hisob-kitob, tanlov, maslahat, material;
- boshlash uchun **bitta asosiy tugma**.

Telefon qoldirishni so‘rashdan boshlamang. Avval foyda va savollar, kontakt esa odam jalb bo‘lgandan keyin.

## 3-qadam. Saralovchi savollar

Faqat menejerga suhbatga tayyorlanishga yoki maqsadli bo‘lmaganlarni ajratishga yordam beradigan narsalarni so‘rang. Odatiy to‘plam:

| Savol | Nima uchun |
|---|---|
| Qaysi xizmat yoki tovar qiziqtiradi | Kerakli mutaxassisga yo‘naltirish |
| Vazifa yoki vaziyat | Qo‘ng‘iroqdan oldin kontekstni tushunish |
| Muddatlar | Shoshilinchlikni aniqlash |
| Byudjet yoki hajm | Maqsadli arizalarni ajratish |

Savollar uchun qoidalar:

- iloji boricha **erkin kiritish o‘rniga tugmalar**;
- **bitta xabar — bitta savol**;
- **jarayonni ko‘rsating**: «3 tadan 2-savol»;
- **«Orqaga» tugmasi** yoki javobni o‘zgartirish imkoniyati;
- noodatiy mijozlarni yo‘qotmaslik uchun erkin kiritishli **«Boshqa» varianti**.

## 4-qadam. Tarmoqlanish

Turli javoblar turli harakatlarni talab qilganda tarmoqlanish kerak:

- **Maqsadli bo‘lmagan javob** (masalan, hajm juda kichik) — qo‘ng‘iroq o‘rniga muloyimlik bilan mos variant yoki foydali material taklif qilish.
- **Shoshilinch so‘rov** — darhol menejer bilan bog‘lanishni taklif qilish.
- **Turli xizmatlar** — har biri uchun o‘z aniqlashtiruvchi savollari.

Ishlab chiqishdan oldin sxemani chizing: har bir tugun — xabar, har bir strelka — tugma. Sxema bitta ekranga sig‘masa, ssenariy katta ehtimol bilan juda uzun.

## 5-qadam. Kontakt so‘rash

Telefonni eng qulay usulda **`request_contact`li klaviatura tugmasi** orqali olish mumkin: odam bitta tugmani bosadi va Telegram uning akkaunti raqamini uzatadi.

```python
from aiogram.types import KeyboardButton, ReplyKeyboardMarkup

kb = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="Kontaktni ulashish", request_contact=True)]],
    resize_keyboard=True,
    one_time_keyboard=True,
)
```

`contact.user_id` yuboruvchi ID’si bilan mos kelishini tekshiring: shunda odam boshqa birovning raqamini emas, o‘z raqamini ulashganiga ishonch hosil qilasiz. Raqamni qo‘lda kiritish variantini ham qoldiring va telefon nima uchun kerakligini tushuntiring.

## 6-qadam. Lid-magnit

Lid-magnit — kontakt yoki ssenariyni oxirigacha o‘tish evaziga beriladigan foydali material: chek-list, narxlar ro‘yxati, to‘plam, narx hisob-kitobi. Joylashtirishning ikki varianti:

- **Kontaktdan keyin** — telefonli arizalar ko‘proq, lekin odamlarning bir qismi shu qadamda chiqib ketadi.
- **Kontaktdan oldin** — oxirigacha ko‘proq odam yetib boradi, kontaktni esa keyingi qadamda so‘rash mumkin.

Material haqiqatan foydali va xizmatingiz bilan bog‘liq bo‘lishi kerak. Uni to‘g‘ridan-to‘g‘ri botda fayl yoki xabar sifatida yuborgan yaxshi.

## 7-qadam. Menejerga xabar

Ariza qoldirilgach, bot darhol ishchi chatga kartochka yuboradi:

- ism, telefon, username;
- savollarga barcha javoblar;
- `start` parametridan olingan manba;
- ariza vaqti;
- «Ishga olish» va «Mijozga yozish» tugmalari.

Parallel ravishda ariza CRM’ga ketadi. Bot mijozga keyin nima bo‘lishini va u bilan qachon bog‘lanishlarini yozadi.

## Ko‘p uchraydigan xatolar

- Birinchi natijagacha juda ko‘p savollar.
- Tugmalar yetarli bo‘lgan joyda erkin kiritish.
- Jarayon saqlanmaydi: odam qaytib keladi va boshidan boshlaydi.
- Yarmida tashlab ketilgan dialoglar umuman ishlanmaydi. Ma’lum vaqtdan keyin bitta eslatma yuborish mumkin, ko‘p emas.
- Ariza menejerga javoblarsiz yetib boradi va u xuddi shu savollarni qayta beradi.

## FAQ

### Ssenariyda nechta savol berish kerak?

Menejerga birinchi suhbat uchun qancha kerak bo‘lsa, shuncha va bittasi ham ortiq emas. Savol keyingi harakatlarga ta’sir qilmasa, uni olib tashlagan yaxshi.

### Foydalanuvchi dialogni tashlab ketsa, javoblarni qayerda saqlash kerak?

Bot bazasida, har bir qadamdan keyin. Shunda odam qaytganda o‘sha joydan davom etadi, siz esa qaysi savolda eng ko‘p odam chiqib ketishini ko‘rasiz.

### Xizmatim oddiy bo‘lsa, lid-magnit kerakmi?

Shart emas. Odam tayyor so‘rov bilan kelsa, menejerga tez yo‘l har qanday materialdan yaxshiroq ishlaydi.
