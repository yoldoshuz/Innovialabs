---
title: Frontend va backend: farqi nimada
description: Frontend va backend nima, qaysi texnologiyalar ishlatiladi, har biri nima qiladi va ular API orqali qanday bog‘lanadi — ovqat yetkazish servisi misolida.
summary: Frontend — foydalanuvchi brauzer yoki ilovada ko‘radigan va bosadigan hamma narsa; backend — server mantiqi, ma’lumotlar va integratsiyalar. Ular API orqali bog‘lanadi.
---
## Farq haqida qisqacha

- **Frontend** — klient qismi: brauzer yoki mobil ilovada ishlaydigan interfeys. Tugmalar, formalar, animatsiyalar, ekranga moslashish.
- **Backend** — server qismi: biznes-mantiq, ma’lumotlar bazasi, avtorizatsiya, to‘lovlar, tashqi servislar bilan integratsiyalar.

Oddiy o‘xshatish — restoran. Frontend — bu zal va menyu: mehmon bevosita ular bilan ishlaydi. Backend — oshxona va ombor: buyurtma o‘sha yerda tayyorlanadi, lekin mehmon ularni ko‘rmaydi. Ular orasidagi ofitsiant — bu **API**.

## Misol: ovqat yetkazish servisi

Tushlik buyurtma qilganingizda kim nimaga javob berishini ko‘raylik:

| Foydalanuvchi harakati | Frontend | Backend |
|---|---|---|
| Ilovani ochdi | Restoranlar ro‘yxati, kartochkalar, filtrlarni ko‘rsatadi | Bazadan yaqin atrofdagi restoranlarni beradi |
| Taomni savatga qo‘shdi | Ekrandagi hisoblagich va summani yangilaydi | Savatni saqlashi, mavjudligini tekshirishi mumkin |
| Promokod kiritdi | Maydon va xato xabarini ko‘rsatadi | Kod amal qilishini tekshiradi, narxni qayta hisoblaydi |
| To‘lov qildi | To‘lov formasini ochadi | Buyurtma yaratadi, to‘lov tizimi bilan ishlaydi |
| Kuryerni kuzatmoqda | Xarita va statusni chizadi | Koordinatalarni oladi va yangilanishlarni yuboradi |

E’tibor bering: **pul va ma’lumotlarga ta’sir qiladigan tekshiruvlar** (narx, chegirma, kirish huquqlari) har doim backendda bajariladi. Frontend qulaylik uchun ularni takrorlashi mumkin, lekin unga ishonib bo‘lmaydi — foydalanuvchi brauzerdagi kodni o‘zgartirishi mumkin.

## Odatiy texnologiyalar

**Frontend:**
- HTML, CSS, JavaScript va TypeScript;
- freymvork va kutubxonalar: React, Vue, Angular, Svelte, shuningdek ularning ustidagi Next.js va Nuxt;
- mobil ilovalar uchun — Swift, Kotlin, Flutter, React Native.

**Backend:**
- tillar: JavaScript/TypeScript (Node.js), Python, PHP, Go, Java, C# va boshqalar;
- freymvorklar: Express, NestJS, Django, FastAPI, Laravel, Spring;
- ma’lumotlar bazalari: PostgreSQL, MySQL, MongoDB, Redis;
- infratuzilma: serverlar, Docker, navbatlar, fayl omborlari.

Stek texnologiyaning «modaligi» bo‘yicha emas, vazifa, jamoa va yuklama talablariga qarab tanlanadi.

## Ular qanday muloqot qiladi: API

**API** — frontend qanday so‘rovlar yuborishi va qanday javoblar olishi haqidagi kelishuv. Ko‘pincha bu HTTP ustidagi **REST** yoki **GraphQL**, ma’lumotlar **JSON** formatida uzatiladi.

Frontendning restoranlar ro‘yxatini so‘rashi:

```http
GET /api/restaurants?lat=41.31&lng=69.24
```

Backend javobi:

```json
[
  { "id": 12, "name": "Plov Center", "deliveryMinutes": 35 },
  { "id": 47, "name": "Green Bowl", "deliveryMinutes": 25 }
]
```

Yaxshi API hujjatlashtirilgan va barqaror bo‘ladi: formatni oldindan kelishib olgach, frontend va backendni parallel ishlab chiqish mumkin.

## Fullstack kim

**Fullstack-dasturchi** ikkala tomon bilan ishlaydi. Bu kichik loyihalar va MVP uchun qulay. Yirik mahsulotlarda rollar odatda ajratiladi: frontend-dasturchilar interfeyslar, brauzer unumdorligi va foydalanish qulayligini chuqurroq biladi, backend-dasturchilar esa arxitektura, ma’lumotlar bazalari va xavfsizlikni.

## Buyurtmachilarning keng tarqalgan xatolari

- **Loyihani maketlar bo‘yicha baholash.** Chiroyli interfeys — ishning bir qismi xolos. Buyurtmalar mantiqi, rollar, integratsiyalar va admin panel ko‘pincha ekranlardan ko‘proq kuch talab qiladi.
- **Muhim mantiqni faqat frontendda saqlash.** Masalan, brauzerda hisoblangan chegirmani soxtalashtirish oson.
- **API ni oldindan kelishmaslik.** Jamoalar bir-birini kutib qoladi, muddatlar cho‘ziladi.
- **Admin panelni unutish.** Kimdir kontent, buyurtmalar va foydalanuvchilarni boshqarishi kerak — bu ham backend va interfeys ishi.

## FAQ

### Biznes uchun nima muhimroq — frontend yoki backend?

Ikkalasi ham kerak. Frontend mijozga qulaymi va u xarid qiladimi — shuni belgilaydi, backend esa buyurtmalar, to‘lovlar va ma’lumotlar ishonchli ishlashini. Zaif tomon butun mahsulotni cheklaydi.

### Sayt backendsiz ishlay oladimi?

Ha, agar u statik bo‘lsa: vizitka sayt, lending, hujjatlar. Bunday holatda ariza formalari tashqi servis orqali yuboriladi. Akkauntlar, buyurtmalar yoki bazadagi katalog paydo bo‘lishi bilan backend kerak bo‘ladi.

### Nega sayt va mobil ilova bitta backenddan foydalanishi mumkin?

Chunki backend tayyor ekranlarni emas, API orqali ma’lumotlarni beradi. Sayt hamda iOS va Android ilovalari bir xil manzillarga murojaat qiladi va ma’lumotlarni har biri o‘z interfeysida ko‘rsatadi.
