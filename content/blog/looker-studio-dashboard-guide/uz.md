---
title: Looker Studio: Google Sheets dan bepul dashbordlar
description: Looker Studio ga Google Sheets, BigQuery va boshqa manbalarni ulash, filtrlar va hisoblanadigan maydonli grafiklar yaratish hamda dashbordni xavfsiz ulashish.
summary: Looker Studio Google Sheets, BigQuery va o‘nlab boshqa manbalarni bepul interaktiv dashbordlarga aylantiradi. Asosiysi — kirishdagi jadvalning toza tuzilishi va ongli kirish sozlamalari: manba kimning hisob ma’lumotlaridan foydalanadi va kim ma’lumotlarni yuklab ola oladi.
---

## Qisqa javob

**Looker Studio** (avvalgi Google Data Studio) — Google ning dashbordlar uchun bepul veb-vositasi. Faqat Google akkaunt kerak. Ish tartibi:

1. Manba jadvalni tayyorlash.
2. Uni **ma’lumotlar manbasi** (data source) sifatida ulash.
3. Hisobotni yig‘ish: grafiklar, jadvallar, filtrlar.
4. **Hisoblanadigan maydonlar** qo‘shish.
5. Ulashish — to‘g‘ri huquqlar bilan.

## Google Sheets ni ulashga tayyorlaymiz

Looker Studio dagi ko‘p muammolar jadvaldan boshlanadi. Qoidalar oddiy:

- **Bitta sarlavha qatori**, birlashtirilgan kataklar va bo‘sh ustunlarsiz.
- **Bitta qator — bitta yozuv** (buyurtma, lid, tashrif), ma’lumotlar ichida oraliq jamlanmalarsiz.
- Har bir ustunda **bitta tur**: sanalar faqat sana, summalarda «taxminan 500» kabi matn bo‘lmasin.
- Oylar ustunlarga emas, bitta «sana» ustuniga yozilsin.
- «Xom» ma’lumotlar uchun alohida varaq, izoh va hisob-kitoblar uchun boshqa varaq.

Qatorlar juda ko‘payib ketsa, Sheets sekinlashadi — bu ma’lumotlarni **BigQuery** yoki oddiy bazaga ko‘chirish vaqti kelganini bildiradi.

## Manbalarni ulaymiz

Create → Data source → konnektorni tanlang:

| Manba | Qachon ishlatiladi |
|---|---|
| **Google Sheets** | Kichik hajm, qo‘lda kiritish, CRM dan eksport |
| **BigQuery** | Katta hajmlar, turli tizimlardan yig‘ilgan ma’lumotlar |
| **GA4, Google Ads, Search Console** | Marketing analitikasi |
| **MySQL, PostgreSQL** | Ilova bazasiga to‘g‘ridan-to‘g‘ri ulanish |
| **Hamkor konnektorlar** | Ijtimoiy tarmoqlar, reklama kabinetlari; ko‘pincha pullik |

Ulangandan keyin maydon turlarini tekshiring: sanalar **Date**, summalar **Number** yoki **Currency** bo‘lsin, standart agregatsiya esa kerakli joyda Sum yoki Count bo‘lsin.

**BigQuery** haqida unutmang: dashbordning unga har bir so‘rovi pullik bo‘lishi mumkin. Dashbord uchun kichik agregatsiyalangan jadvallar yoki view lar tayyorlang va **Data freshness** sozlamasi orqali keshlashdan foydalaning.

## Grafiklar, filtrlar va hisoblanadigan maydonlar

Sahifaning asosiy to‘plami:

- **Scorecard** — o‘tgan davr bilan solishtirilgan asosiy raqamlar.
- **Time series** — kunlar yoki haftalar bo‘yicha dinamika.
- **Bar chart** — kanallar yoki toifalar bo‘yicha taqsimot.
- **Table** — saralash imkoniyatli batafsil jadval.

Interaktivlikni boshqaruv elementlari beradi: **Date range control**, kanal yoki shahar bo‘yicha **Drop-down list**. Grafikni bosish butun sahifani filtrlashi uchun **cross-filtering** ni yoqing.

**Hisoblanadigan maydonlar** ma’lumotlar manbasida (Add a field) yoki to‘g‘ridan-to‘g‘ri grafikda yaratiladi. O‘rtacha chek:

```sql
SUM(revenue) / COUNT_DISTINCT(order_id)
```

Kanallarni guruhlash:

```sql
CASE
  WHEN source IN ("google", "yandex") THEN "Qidiruv"
  WHEN source = "telegram" THEN "Telegram"
  ELSE "Boshqa"
END
```

Manbada yaratilgan maydonlar shu manba asosidagi barcha hisobotlarda mavjud bo‘ladi — yagona formulalarni yuritish osonlashadi.

Ikki jadvalni birlashtirish kerak bo‘lsa (masalan, reklama xarajatlari va arizalar), umumiy kalit — sana yoki kampaniya bilan **Blend data** dan foydalaning.

## Dashbordni xavfsiz ulashamiz

Ko‘pincha aynan shu yerda xato qilishadi. Uch narsani tekshiring.

**1. Manba kimning hisob ma’lumotlaridan foydalanadi.** Manba sozlamalarida **Data credentials** bor:

- **Owner’s credentials** — tomoshabinlar jadvalga o‘zlari kira olmasa ham, ma’lumotlarni sizning ruxsatingiz orqali ko‘radi.
- **Viewer’s credentials** — har kim faqat o‘ziga ruxsat berilgan narsani ko‘radi.

Maxfiy ma’lumotlar uchun ikkinchi variantni tanlang yoki faqat ko‘rsatish mumkin bo‘lgan narsalardan iborat alohida jadval yarating.

**2. Hisobot kimga va qanday ochiq.**

- «Havolaga ega hamma» bilan emas, aniq odamlar yoki guruh bilan ulashing.
- Standart holatda **Viewer** bering, **Editor** ni faqat hisobotni tahrirlaydiganlarga.
- Ma’lumotlar maxfiy bo‘lsa, tomoshabinlar uchun yuklab olish, chop etish va nusxalashni o‘chiring.

**3. Manbaning o‘zida nima bor.** Ustun grafikda yashirilgan bo‘lsa ham, hisobot muharriri manbaning barcha maydonlarini ko‘radi. Ortiqcha narsani ulamang — savdo dashbordida mijozlarning shaxsiy ma’lumotlari odatda kerak emas.

## FAQ

### Looker Studio haqiqatan ham bepulmi?

Asosiy versiya bepul. Hamkor konnektorlar, BigQuery so‘rovlari va jamoalar uchun qo‘shimcha boshqaruv funksiyalariga ega Looker Studio Pro pullik bo‘lishi mumkin.

### Nega dashbord eskirgan ma’lumotlarni ko‘rsatadi?

Looker Studio manbalar javoblarini keshlaydi. Manba sozlamalarida **Data freshness** ni tekshiring yoki hisobot menyusidagi ma’lumotlarni yangilash buyrug‘idan foydalaning. Sheets uchun yangi qatorlar ulangan diapazonga tushayotganiga ham ishonch hosil qiling.

### Dashbordni saytga joylashtirish mumkinmi?

Ha, File → Embed report orqali. Joylashtirilgan hisobot o‘sha kirish sozlamalariga bo‘ysunadi: barcha tashrifchilar ko‘rishi uchun uni ommaviy qilish kerak bo‘ladi. Shuning uchun bu usulda faqat e’lon qilish mumkin bo‘lgan ma’lumotlarni ko‘rsating.
