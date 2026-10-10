---
title: Yangi boshlovchilar uchun Power BI: birinchi hisobotni yaratamiz
description: Qadamma-qadam: Excel va ma’lumotlar bazasidan yuklash, Power Query da tozalash, model qurish, DAX o‘lchovlarini yozish va interaktiv hisobotni nashr qilish.
summary: Power BI dagi birinchi hisobot besh qadamdan iborat: manbalarni ulash, Power Query da ma’lumotlarni tartibga keltirish, jadvallarni «yulduz» modeliga bog‘lash, bir nechta DAX o‘lchovini yozish va hisobotni rejali yangilanish bilan Power BI Service ga nashr qilish.
---

## Qisqa javob: birinchi hisobot nimalardan iborat

Boshlash uchun bepul **Power BI Desktop** kerak (Windows da ishlaydi). Butun yo‘l quyidagicha:

1. **Get Data** — Excel va ma’lumotlar bazasini ulash.
2. **Power Query** — tozalash va turlarni to‘g‘rilash.
3. **Model** — faktlar va ma’lumotnoma jadvallarini bog‘lash.
4. **DAX** — o‘lchovlar: tushum, buyurtmalar soni, o‘rtacha chek.
5. **Nashr** — hisobotni Power BI Service ga yuborish va yangilanishni sozlash.

Quyida har bir qadam savdo misolida: buyurtmalar jadvali bazada, mahsulotlar ma’lumotnomasi Excel da.

## 1-qadam. Excel va bazadan ma’lumot yuklaymiz

- **Excel**: Home → Get Data → Excel workbook. Varaqni yoki, yaxshisi, **formatlangan jadvalni** (Excel da Ctrl+T) tanlang — u yangi qatorlar qo‘shilishiga chidamliroq.
- **Ma’lumotlar bazasi**: Get Data → SQL Server, PostgreSQL yoki MySQL. Server va baza nomini kiriting. Ayrim DBMS lar uchun drayver o‘rnatish kerak bo‘lishi mumkin.

Ulanishda rejimni tanlang:

| Rejim | Qanday ishlaydi | Qachon mos |
|---|---|---|
| **Import** | Ma’lumotlar hisobot fayliga nusxalanadi | Ko‘pchilik hisobotlar, eng yuqori tezlik |
| **DirectQuery** | Har bir vizual bazaga so‘rov yuboradi | Juda katta yoki deyarli real vaqtdagi ma’lumotlar |

**Import** dan boshlang — u soddaroq va model xatolarini kechiradi.

Maslahat: butun jadvalni «har ehtimolga qarshi» tortmang. Faqat kerakli ustunlar va davrni tanlang — hisobot tezroq va yengilroq bo‘ladi.

## 2-qadam. Power Query da tozalaymiz

**Transform data** tugmasini bosing. Har bir amal qadam sifatida yoziladi va har yangilanishda takrorlanadi — endi qo‘lda tozalash shart emas.

Odatiy qadamlar to‘plami:

- **Change Type** — sanalar sana, summalar o‘nli son bo‘lsin.
- **Remove Duplicates** kalit bo‘yicha (masalan, ma’lumotnomadagi artikul).
- **Trim / Clean** — bog‘lanishlar juftini topishga xalaqit beradigan ortiqcha bo‘shliqlarni olib tashlash.
- **Replace Values** va **Fill Down** — bo‘sh joylarni to‘ldirish.
- **Unpivot Columns** — oylar ustunlarga yoyilgan bo‘lsa, ularni qatorlarga aylantiring.

Qadamlarga tushunarli nom bering — bir oydan keyin bu juda asqotadi. So‘ng **Close & Apply**.

## 3-qadam. Ma’lumotlar modelini quramiz

**Model** ko‘rinishini oching. Maqsad — **«yulduz»** sxemasi: markazda faktlar jadvali (buyurtmalar), atrofida ma’lumotnomalar (mahsulotlar, mijozlar, sanalar).

- **Birga-ko‘p** bog‘lanishlar: bitta mahsulot — ko‘p buyurtma qatorlari.
- Filtr yo‘nalishi — **bir tomonlama**, ma’lumotnomadan faktlarga. Ikki tomonlama bog‘lanishlarni maxsus holatlar uchun qoldiring.
- Alohida **sanalar jadvalini** yarating va uni Date table deb belgilang. Usiz davrlarni solishtirish funksiyalari ishonchsiz ishlaydi.

```dax
Date = CALENDAR ( DATE ( 2023, 1, 1 ), DATE ( 2026, 12, 31 ) )
```

`Date[Date]` ni buyurtma sanasi bilan bog‘lang.

## 4-qadam. Birinchi DAX o‘lchovlarini yozamiz

**O‘lchov** (measure) sahifadagi filtrlarni hisobga olib, shu zahoti hisoblanadi, **hisoblanadigan ustun** esa yangilanishda har bir qator uchun bir marta hisoblanadi. Jamlanmalar uchun deyarli doim o‘lchovlar kerak.

```dax
Total Sales = SUM ( Orders[Amount] )
Orders Count = DISTINCTCOUNT ( Orders[OrderID] )
Avg Check = DIVIDE ( [Total Sales], [Orders Count] )
Sales LY = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
Sales YoY % = DIVIDE ( [Total Sales] - [Sales LY], [Sales LY] )
```

`DIVIDE` nolga bo‘lishni xavfsiz qayta ishlaydi. O‘lchovlarni oson topish uchun ularni alohida bo‘sh jadvalda saqlang.

## 5-qadam. Sahifani yig‘amiz va nashr qilamiz

Minimal sahifa: asosiy o‘lchovlar kartochkalari, sanalar bo‘yicha savdo chiziqli grafigi, toifalar bo‘yicha ustunli diagramma, davr va hudud bo‘yicha **kesimlar** (slicers). Ustunni bosish qolgan vizuallarni filtrlaydi — interaktivlik shu.

Nashr: **Publish** → Power BI Service dagi ish maydoni. Keyin:

- Lokal bazadan ma’lumotlarni yangilash uchun **on-premises data gateway** ni o‘rnating va **scheduled refresh** ni sozlang.
- Hamkasblar bilan ulashish uchun odatda pullik litsenziyalar yoki sig‘im kerak — tarifingiz shartlarini tekshiring.
- Ichki ma’lumotlar uchun **Publish to web** dan foydalanmang: hisobot havolaga ega har qanday odamga ochiq bo‘lib qoladi.

## Yangi boshlovchilarning keng tarqalgan xatolari

- «Yulduz» o‘rniga bitta ulkan «yassi» jadval — sekin va hisoblash qiyin.
- O‘lchovlar o‘rniga hisoblanadigan ustunlardagi summalar.
- Sanalar jadvali yo‘q — o‘tgan yil bilan solishtirish g‘alati raqamlar beradi.
- Power Query qadamlari o‘rniga Excel manbasini qo‘lda tuzatish.
- Bitta sahifada o‘nlab vizuallar. 5–7 ta va tushunarli sarlavha yaxshiroq.

## FAQ

### Boshlash uchun pullik litsenziya kerakmi?

Yo‘q. Power BI Desktop bepul, unda hisobotlarni lokal yaratish va saqlash mumkin. Litsenziyalar hisobotni nashr qilish va hamkasblar bilan ulashish kerak bo‘lganda muhim bo‘ladi.

### Power Query DAX dan nimasi bilan farq qiladi?

Power Query ma’lumotlarni modelga yuklashdan oldin tayyorlaydi: tozalaydi, birlashtiradi, jadvallar shaklini o‘zgartiradi. DAX esa yuklangan model ustida ko‘rsatkichlarni hisoblaydi. Avval Power Query da toza ma’lumot, keyin DAX da o‘lchovlar.

### Nega o‘lchov barcha qatorlarda bir xil qiymat ko‘rsatadi?

Ko‘pincha jadvallar orasida bog‘lanish yo‘q yoki filtr yo‘nalishi faktlar jadvaliga yetib bormaydi. Model ko‘rinishida bog‘lanishlarni tekshiring va vizualdagi maydon faktlar bilan bog‘langan ma’lumotnomadan olinganiga ishonch hosil qiling.
