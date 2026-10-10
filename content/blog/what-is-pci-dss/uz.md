---
title: PCI DSS nima va internet-do‘kon uchun u nimani anglatadi
description: To‘lov kartalari ma’lumotlari xavfsizligi standarti PCI DSS nima uchun kerak, qanday muvofiqlik darajalari bor va provayderning to‘lov sahifasi hamda tokenizatsiya talablarni qanday kamaytiradi.
summary: PCI DSS — kartalarni qabul qiladigan har bir kishi uchun majburiy bank kartalari ma’lumotlarini himoya qilish standarti; kartani kiritishni to‘lov provayderi sahifasiga topshirgan va faqat tokenlar bilan ishlaydigan do‘kon o‘z majburiyatlarini minimalga tushiradi.
---
## Qisqa javob: PCI DSS nima

**PCI DSS** (Payment Card Industry Data Security Standard) — to‘lov kartalari ma’lumotlari xavfsizligi standarti. Uni yirik xalqaro to‘lov tizimlari, jumladan Visa va Mastercard tomonidan tashkil etilgan **PCI SSC** kengashi ishlab chiqqan.

Standart shu tizimlar kartalari ma’lumotlarini **qabul qiladigan, qayta ishlaydigan, saqlaydigan yoki uzatadigan** har bir kishi uchun majburiy: do‘konlar, to‘lov provayderlari, hostinglar, protsessing markazlari. Rioya qilinishini davlat emas, to‘lov tizimlari **ekvayer bank** orqali nazorat qiladi. Buzilish va ma’lumot sizib chiqishi uchun jarimalar, eng yomon holatda esa kartalarni qabul qilishdan uzib qo‘yish xavfi bor.

## U nima uchun kerak

Karta raqami, amal qilish muddati va CVV — firibgarga internetda to‘lov qilish uchun kerak bo‘lgan hamma narsa. Bitta do‘kondan sizib chiqqan ma’lumot minglab karta egalariga ta’sir qiladi. PCI DSS himoyaning yagona minimumini belgilaydi:

- himoyalangan tarmoq va tarmoqlararo ekranlar;
- karta ma’lumotlarini saqlash va uzatishda shifrlash;
- avtorizatsiyadan keyin **CVV va magnit tasma ma’lumotlarini** saqlash taqiqi;
- kirishni nazorat qilish va harakatlarni jurnalga yozish;
- dasturiy ta’minotni muntazam yangilash, zaifliklarni skanerlash va kirib borish testlari;
- xavfsizlik siyosati va xodimlarni o‘qitish.

## Muvofiqlik darajalari

Do‘kon darajasi (merchant level) kartalar bo‘yicha **yillik tranzaksiyalar soniga** bog‘liq. Misol — Visa tasnifi:

| Daraja | Yiliga tranzaksiyalar soni | Muvofiqlik qanday tasdiqlanadi |
|---|---|---|
| **1** | 6 mln dan ortiq, shuningdek ma’lumot sizib chiqqandan keyin | Sertifikatlangan auditor (QSA) auditi |
| **2** | 1 mln dan 6 mln gacha | O‘z-o‘zini baholash anketasi (SAQ), ba’zan audit |
| **3** | 20 mingdan 1 mln gacha onlayn tranzaksiya | O‘z-o‘zini baholash anketasi |
| **4** | 20 minggacha onlayn tranzaksiya | O‘z-o‘zini baholash anketasi, ekvayer talabiga ko‘ra |

Boshqa to‘lov tizimlarida chegaralar o‘xshash, lekin farq qilishi mumkin. Aniq daraja va hisobot tartibini ekvayeringiz yoki to‘lov provayderingiz aytadi.

Darajadan tashqari **SAQ anketasi turi** ham muhim — u to‘lovni qanday qabul qilishingizga bog‘liq:

- **SAQ A** — karta faqat provayder sahifasida kiritiladi (redirekt yoki iframe). Eng qisqa talablar ro‘yxati.
- **SAQ A-EP** — forma saytingizda, lekin ma’lumotlar to‘g‘ridan-to‘g‘ri provayderga ketadi. Saytingiz to‘lov xavfsizligiga ta’sir qiladi, shuning uchun talablar ko‘proq.
- **SAQ D** — karta ma’lumotlarini o‘z serverlaringizda o‘zingiz qabul qilasiz va qayta ishlaysiz. Standartning to‘liq hajmi.

## Majburiyatlarni qanday kamaytirish mumkin

Asosiy tamoyil — **karta ma’lumotlariga tegmang**. Serverlaringizda yo‘q narsa sizib chiqa olmaydi.

**Provayderning to‘lov sahifasi (hosted payment page).** Xaridor «To‘lash» tugmasini bosadi va to‘lov xizmati sahifasiga, masalan Stripe Checkout yoki mahalliy provayderning to‘lov sahifasiga o‘tadi. Karta raqami o‘sha yerda kiritiladi, saytingiz esa faqat natijani oladi: to‘landi yoki yo‘q.

**Provayderning o‘rnatiladigan maydonlari (iframe).** Forma saytingizning bir qismi kabi ko‘rinadi, lekin karta maydonlari texnik jihatdan provayder serveridan yuklanadi.

**Tokenizatsiya.** Birinchi to‘lovdan keyin provayder kartani o‘zida saqlaydi va sizga **token** beradi — uning tizimidan tashqarida foydasiz bo‘lgan tasodifiy qator. Obunalar va takroriy xaridlar uchun siz karta raqamini ko‘rmasdan token orqali pul yechasiz.

```json
{
  "customer_id": "c_1042",
  "payment_token": "tok_8f3a91c2",
  "card_last4": "4242",
  "card_brand": "visa"
}
```

O‘z bazangizda shuni saqlash mumkin: token, oxirgi to‘rt raqam va karta turi. To‘liq raqam va CVV — hech qachon.

## Ko‘p uchraydigan xatolar

- Karta ma’lumotlari bor so‘rovlarni otladka loglariga yozish.
- Mijozdan karta raqamini chat yoki email orqali yuborishni so‘rash.
- To‘lovni provayder qabul qilgani uchun sayt xavfsizligi haqida o‘ylamasa ham bo‘ladi deb hisoblash: buzilgan sahifa to‘lov havolasini almashtirib qo‘yishi mumkin.
- To‘lov formasi bor saytda CMS va plaginlarni yangilamaslik.

## FAQ

### Payme yoki Click orqali to‘lov qabul qilsam, PCI DSS kerakmi?

PCI DSS xalqaro to‘lov tizimlari kartalariga tegishli. Agar xaridorni provayder sahifasiga yo‘naltirsangiz va karta ma’lumotlarini o‘zingiz qayta ishlamasangiz, asosiy yuk provayder zimmasida bo‘ladi. Sizning tomoningizga, shu jumladan mahalliy kartalar bo‘yicha qo‘yiladigan talablarni shartnoma va provayder hujjatlaridan aniqlang.

### Takroriy to‘lovlar uchun karta raqamini saqlash mumkinmi?

Bunga arzimaydi. Provayder tokenizatsiyasidan foydalaning: takroriy yechimlar xuddi shunday ishlaydi, to‘liq karta raqami esa sizda saqlanmaydi.

### Rasmiy talablarni qayerdan topish mumkin?

Standart matnlari va SAQ anketalari [PCI Security Standards Council saytida](https://www.pcisecuritystandards.org/) e’lon qilinadi.
