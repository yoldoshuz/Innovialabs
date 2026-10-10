---
title: Make ssenariylari: routerlar, iteratorlar va filtrlar
description: Make ssenariylari qanday ishlaydi: modullar va operatsiyalar, router bilan tarmoqlash, iterator va agregator bilan massivlar, xatolarni qayta ishlash va jadval.
summary: Make ssenariysi — ma’lumot paketlari (bundles) o‘tadigan modullar zanjiri: router oqimni tarmoqlarga bo‘ladi, filtrlar qaysi paket o‘tishini hal qiladi, iterator massivni alohida paketlarga ajratadi, agregator esa ularni qayta birlashtiradi.
---
## Make ssenariysi qanday ishlaydi

Make’dagi (avvalgi nomi Integromat) **ssenariy (scenario)** — **modullarning** vizual zanjiri. Har bir modul biror xizmatdagi bitta amal: xatlarni olish, qator yaratish, xabar yuborish.

Modullar orasida ma’lumot **paketlar (bundles)** ko‘rinishida o‘tadi. Trigger beshta yangi buyurtma topsa, beshta paket chiqaradi va keyingi har bir modul besh marta — har bir paket uchun bir marta bajariladi.

Tarif uchun asosiy tushuncha — **operatsiya**: bitta modulning bir marta bajarilishi. Beshta paket uchta moduldan o‘tsa, taxminan o‘n beshta operatsiya bo‘ladi. Make’ning joriy tariflarida sarf kreditlarda ifodalanishi mumkin, lekin mantiq bir xil: paketlar va modullar qancha ko‘p bo‘lsa, sarf shuncha ko‘p.

## Filtrlar: faqat keraklisini o‘tkazish

**Filtr** ikki modul orasidagi bog‘lanishga qo‘yiladi. Paket faqat shart bajarilsa o‘tadi: buyurtma summasi noldan katta, email maydoni bo‘sh emas, holat «to‘langan».

- Shartlarni **AND** va **OR** orqali birlashtirish mumkin.
- Keraksiz paketlarga operatsiya sarflamaslik uchun filtrni **iloji boricha boshiga yaqin** qo‘ying.

## Router: bir nechta tarmoq

**Router** oqimni bir nechta yo‘nalishga bo‘ladi. Har bir paket har bir tarmoqning filtri bo‘yicha tekshiriladi.

Misol — arizalarni qayta ishlash:

- 1-tarmoq: manba «sayt» → CRM’da bitim yaratish.
- 2-tarmoq: manba «Telegram» → savdo bo‘limi chatiga yuborish.
- 3-tarmoq (**fallback route**): qolgan hammasi → qo‘lda ko‘rib chiqish uchun jadvalga yozish.

Muhim: paket bir nechta tarmoqqa mos kelsa, u **barcha mos tarmoqlarga** ketadi. Tarmoqlar kesishmasligi kerak bo‘lsa, shartlarni bir-birini istisno qiladigan qiling, «qolgan hammasi» uchun esa fallback’dan foydalaning.

## Iterator va agregator: massivlar bilan ishlash

Modullar ko‘pincha **massiv** qaytaradi: buyurtmadagi tovarlar, xat ilovalari, API javobidagi qatorlar.

- **Iterator** massivni alohida paketlarga ajratadi. Uchta tovarli buyurtma uchta paketga aylanadi va keyingi modul har bir tovar uchun bajariladi.
- **Aggregator** paketlarni qayta bittaga yig‘adi. Turlari:
  - **Array aggregator** — massivga (masalan, ro‘yxatni bitta so‘rovda yuborish uchun);
  - **Text aggregator** — bitta matn satriga (masalan, xabar uchun tovarlar ro‘yxati);
  - **Numeric aggregator** — songa: yig‘indi, o‘rtacha, soni.

Agregatorda **Source module** sozlamasi bor — yig‘ish qaysi moduldan boshlanishi. Odatda bu paketlarni chiqargan iterator yoki trigger. Noto‘g‘ri modul tanlansa, bitta yakuniy paket o‘rniga bir nechtasi chiqadi.

Odatiy sxema: **trigger → iterator → har bir elementni qayta ishlash → agregator → bitta yakuniy amal**.

## Xatolarni qayta ishlash

Standart holatda moduldagi xato ssenariyni to‘xtatadi, takroriy xatolarda esa Make uni o‘chirib qo‘yishi mumkin. Buni boshqarish uchun modulga **error handler** qo‘shiladi:

| Ishlovchi | Nima qiladi |
|---|---|
| Ignore | Xatoni o‘tkazib yuboradi, ssenariy davom etadi |
| Resume | Zaxira qiymatni qo‘yib, davom etadi |
| Break | Tugallanmagan bajarilishni qayta urinish uchun saqlaydi |
| Commit | Bajarilishni to‘xtatadi, bajarilganini saqlab qoladi |
| Rollback | To‘xtatadi va qo‘llab-quvvatlansa, o‘zgarishlarni bekor qilishga urinadi |

Vaqti-vaqti bilan xato beradigan tashqi API’lar uchun avtomatik qayta urinishli **Break** qulay. **Ignore**’dan ehtiyot bo‘lib foydalaning: xatolar shunchaki ko‘zdan yo‘qoladi.

## Jadval

Ssenariy quyidagi usullardan biri bilan ishga tushadi:

- **Jadval bo‘yicha**: ma’lum oraliqda, kuniga bir marta, haftaning yoki oyning ma’lum kunlarida.
- **Darhol**: webhook yoki instant-trigger orqali — xizmat ma’lumotni o‘zi yuborganda ssenariy ishlaydi.
- **Qo‘lda** — bir martalik vazifalar va testlar uchun.

Esda tuting: jadval bo‘yicha tekshiruv yangi ma’lumot bo‘lmasa ham operatsiya sarflaydi. Kamdan-kam hodisalar uchun juda qisqa oraliq — ortiqcha sarfning keng tarqalgan sababi.

## FAQ

### Make Zapier’dan nimasi bilan farq qiladi?

Make mantiq ustidan ko‘proq nazorat beradi: vizual tarmoqlar, massivlar bilan ishlash, moslashuvchan xatolarni qayta ishlash. Zapier chiziqli ssenariylar uchun soddaroq. Tanlov mantiqning murakkabligiga va avtomatlashtirishni kim qo‘llab-quvvatlashiga bog‘liq.

### Nega ssenariy kutganimdan ko‘p operatsiya sarfladi?

Odatda paketlar soni sabab: iterator undan keyingi modullarning bajarilishini ko‘paytiradi, tez-tez jadval bo‘yicha ishga tushish esa bo‘sh tekshiruvlarga operatsiya sarflaydi. Bajarilish tarixini oching — u yerda har bir modul necha marta ishlagani ko‘rinadi.

### Har bir iteratordan keyin agregator kerakmi?

Yo‘q. U faqat elementlarni qayta ishlagandan keyin bitta umumiy natija kerak bo‘lsa kerak — masalan, har bir element uchun alohida xabar emas, ro‘yxatli bitta xabar.
