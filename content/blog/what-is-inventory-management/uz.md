---
title: Tovar zaxiralarini boshqarish nima: usullar, metrikalar va vositalar
description: Qoldiqlar, buyurtma nuqtasi, sug‘urta zaxirasi, aylanuvchanlik, ABC-tahlil va FIFO oddiy tilda, hamda jadvallardan tizimga o‘tish vaqti kelganining belgilari.
summary: Zaxiralarni boshqarish — har bir mahsulotdan qancha saqlash va uni qachon qayta buyurtma qilishni hal qilish, toki taqchillik tufayli savdo yo‘qolmasin va pul ortiqcha qoldiqlarda muzlab qolmasin.
---
## Qisqa javob

**Tovar zaxiralarini boshqarish** — har bir mahsulot bo‘yicha uchta savolga javob beradigan jarayon:

- **Hozir qancha bor** va qayerda.
- **Qachon qayta buyurtma qilish kerak**, toki javon bo‘sh qolmasin.
- **Qancha buyurtma qilish kerak**, toki omborda ortiqcha narsa turmasin.

Bir tomonga xato — **taqchillik**: xaridor raqobatchiga ketadi. Ikkinchi tomonga xato — **ortiqcha zaxira**: pul qutilarda muzlab qoladi, mahsulot esa eskiradi yoki modadan chiqadi.

## Asosiy tushunchalar va metrikalar

**Qoldiq (stock level).** Uchta raqamni farqlang:

- **Jismoniy qoldiq** — omborda haqiqatan turgan narsa.
- **Band qilingan** — rasmiylashtirilgan buyurtmalarda va’da qilingan.
- **Mavjud** — jismoniy qoldiq minus band qilingan. Saytda aynan shuni ko‘rsatish kerak.

**Buyurtma nuqtasi (reorder point)** — yetkazib beruvchiga yangi buyurtma berish vaqti kelgan qoldiq darajasi:

```text
Buyurtma nuqtasi = Kunlik o‘rtacha savdo × Yetkazib berish muddati (kun) + Sug‘urta zaxirasi
```

**Sug‘urta zaxirasi (safety stock)** — savdo odatdagidan yuqori bo‘lsa yoki yetkazib beruvchi kechiksa, ehtiyot uchun yostiq. Boshlash uchun oddiy formula:

```text
Sug‘urta zaxirasi = Maks. kunlik savdo × Maks. yetkazib berish muddati
                  − O‘rtacha kunlik savdo × O‘rtacha yetkazib berish muddati
```

**Aylanuvchanlik (inventory turnover)** — davr mobaynida zaxira necha marta «yangilanadi»:

```text
Aylanuvchanlik = Davr uchun sotilgan tovar tannarxi / Davrdagi o‘rtacha zaxira
```

Aylanuvchanlik qancha yuqori bo‘lsa, tovar shuncha tez pulga aylanadi. Uni bitta kategoriya ichida solishtirish mantiqli: oziq-ovqat va mebel uchun me’yorlar butunlay boshqacha.

## Usullar

**ABC-tahlil.** Mahsulotlar tushum yoki foydaga qo‘shgan hissasi bo‘yicha guruhlarga bo‘linadi:

| Guruh | Unga nima kiradi | Qanday boshqarish kerak |
|---|---|---|
| **A** | Asosiy tushumni beradigan assortimentning kichik qismi | Tez-tez nazorat, sug‘urta zaxirasi shart |
| **B** | O‘rtacha hissa | Muntazam tekshiruv |
| **C** | Kam hissali ko‘plab pozitsiyalar | Minimal zaxira, sotuvdan olish uchun nomzodlar |

Guruh chegaralarini har bir do‘kon o‘zi belgilaydi. Ko‘pincha ABC ni talabning barqarorligi bo‘yicha **XYZ-tahlil** bilan to‘ldirishadi.

**FIFO (First In, First Out)** — «birinchi kelgan, birinchi ketadi». Avval eskiroq partiyalardagi tovar jo‘natiladi. Bu yaroqlilik muddati bor mahsulotlar, kosmetika, dori-darmon va eskiradigan har qanday narsa uchun muhim. FIFO buxgalteriyada tannarxni baholash usuli sifatida ham qo‘llaniladi.

**Muntazam inventarizatsiya.** Eng yaxshi tizim ham aralashib ketish, yaroqsizlik va yo‘qotishlar tufayli haqiqatdan farq qila boshlaydi. Rejali qayta sanash — ayniqsa A guruhi uchun — raqamlarga ishonchni qaytaradi.

## Jadvallar qachon yetmay qoladi

Excel yoki Google Sheets boshida yaxshi ishlaydi. Hisob tizimiga o‘tish vaqti kelganining belgilari:

- Siz **bir nechta kanalda** sotasiz (sayt, marketpleyslar, oflayn do‘kon) va qoldiqlarni ular o‘rtasida sinxronlash kerak.
- Jadval kech yangilangani uchun **mavjud bo‘lmagan tovar sotiladi**.
- Jadval bilan bir vaqtda **bir nechta odam** ishlaydi va tuzatishlar yo‘qoladi.
- **Bir nechta ombor** yoki yaroqlilik muddatli partiyalar paydo bo‘ldi.
- Qo‘lda sanash va solishtirishga ish vaqtining sezilarli qismi ketadi.

## Qanday vositalar bor

- **Do‘kon platformasidagi ombor moduli** — bitta kanal va oddiy assortiment uchun mos.
- **Hisob tizimlari va ERP** (masalan, 1C) — qoldiqlar, xaridlar, tannarx va hujjatlar bir joyda.
- **Tovar moduli bor CRM** — savdo menejerlar orqali o‘tsa va buyurtmani mijoz bilan bog‘lash muhim bo‘lsa.
- **WMS** — omborning o‘zi katta bo‘lsa va manzilli saqlash hamda yig‘ish muhim bo‘lsa.
- **Shaxsiy tizim** — jarayonlar nostandart bo‘lsa va tayyor yechimlarni jiddiy moslashtirishga to‘g‘ri kelsa.

Tanlashda asosiysi — qoldiqlar bo‘yicha **yagona haqiqat manbai** bo‘lishi va sayt hamda marketpleyslar u bilan API orqali sinxronlanishi.

## FAQ

### Buyurtma nuqtasini qanchalik tez-tez qayta hisoblash kerak?

Savdo yoki yetkazib berish muddatlari o‘zgarganda: mavsumda, yetkazib beruvchi almashganda, reklama boshlanganda. A guruhi uchun uni sozlashda bir marta emas, muntazam tekshirib turish mantiqli.

### Mahsulotning yaroqlilik muddati bo‘lmasa, FIFO kerakmi?

Jo‘natish uchun har doim emas, lekin u vaqt o‘tishi bilan ko‘rinishi yoki dolzarbligini yo‘qotadigan eski partiyalar «tiqilib qolishining» oldini oladi. Tannarx hisobi uchun usulni buxgalter bilan birga tanlang.

### Zaxiralarni alohida hisob tizimisiz, CRM da yuritish mumkinmi?

Mumkin, agar CRM da tovar moduli bo‘lsa va sxemangiz oddiy bo‘lsa: bitta ombor, partiyalar va murakkab xaridlarsiz. Bir nechta ombor yoki marketpleyslar paydo bo‘lganda odatda hisob tizimi yoki u bilan integratsiya kerak bo‘ladi.
