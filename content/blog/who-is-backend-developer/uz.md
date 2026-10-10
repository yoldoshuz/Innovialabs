---
title: Backend dasturchi kim va u nima bilan shug‘ullanadi
description: Backend dasturchi haqiqiy vazifalar misolida: API, ma’lumotlar bazasi, biznes-mantiq va integratsiyalar. Ish beruvchilar kutadigan ko‘nikmalar va tillar.
summary: Backend dasturchi mahsulotning server qismini yaratadi: ma’lumotlarni saqlaydi va qayta ishlaydi, biznes qoidalarni amalga oshiradi, API orqali interfeysga ma’lumot beradi va tizimni tashqi servislar bilan bog‘laydi.
---
## Qisqacha: bu kim

**Backend dasturchi** «ekran ortida» sodir bo‘ladigan hamma narsa uchun javob beradi. Foydalanuvchi «Buyurtma berish» tugmasini bosadi — interfeys serverga so‘rov yuboradi, keyin backend ishlaydi: ma’lumotlarni tekshiradi, narxni hisoblaydi, buyurtmani bazaga saqlaydi, tovarni ombordan hisobdan chiqaradi va bildirishnoma yuboradi.

Agar frontend — vitrina bo‘lsa, backend — **ombor, kassa va buxgalteriya** birgalikda.

## Backend dasturchining haqiqiy vazifalari

### API

Backend saytga, mobil ilovaga yoki Telegram-botga ma’lumotni **API** orqali beradi — bu mijoz ma’lumot so‘raydigan yoki yuboradigan manzillar to‘plami. Dasturchi ushbu manzillarni, so‘rov va javoblar formatini, xatolarni qayta ishlashni loyihalaydi.

```http
GET /api/orders/42
Authorization: Bearer <token>
```

### Ma’lumotlar bazasi

**Ma’lumotlarni qanday saqlashni** loyihalash kerak: qanday jadvallar, ular orasida qanday bog‘lanishlar, qaysi indekslar qidiruvni tezlashtiradi. So‘ng ma’lumotlar hajmi o‘sganda tizim sekinlashmasligi uchun so‘rovlarni to‘g‘ri yozish kerak.

```sql
SELECT id, total, status
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC;
```

### Biznes-mantiq

Biznes ishlaydigan qoidalar: chegirmalar qanday hisoblanadi, buyurtmani kim bekor qila oladi, qaytarishda nima sodir bo‘ladi. Bu qoidalar **aniq va oldindan aytib bo‘ladigan** tarzda amalga oshirilishi kerak, chunki bu yerdagi xato pulga tushadi.

### Integratsiyalar

Tashqi servislarni ulash: to‘lov tizimlari, yetkazib berish xizmatlari, CRM, SMS-xabarnomalar, messenjerlar. Backend dasturchi boshqa API hujjatlarini o‘qiydi, nosozliklarni qayta ishlaydi va ma’lumotlar yo‘qolmasligini kuzatadi.

### Ishonchlilik va xavfsizlik

Avtorizatsiya va kirish huquqlari, odatiy zaifliklardan himoya, loglash, xatolarni qayta ishlash, testlar. Tashqi servis javob bermayotgan paytda ham backend barqaror ishlashi kerak.

## Ish beruvchilar kutadigan ko‘nikmalar

- **Bitta tilni** va uning asosiy freymvorkini **ishonchli bilish**.
- **SQL va relyatsion ma’lumotlar bazalari**: sxemalarni loyihalash, so‘rovlar, indekslar, tranzaksiyalar.
- **HTTP va API loyihalash**: metodlar, javob kodlari, REST, autentifikatsiya.
- **Git** va pull request orqali jamoada ishlash.
- **Linux va Docker asoslari**: ilovani ishga tushirish, loglarni ko‘rish.
- **Testlash**: o‘z kodingiz uchun avtotestlar yozish.
- **Xavfsizlikni tushunish**: parollarni saqlash, kiruvchi ma’lumotlarni tekshirish, kirish huquqlari.

Junior lavozim uchun odatda dastlabki to‘rt band bo‘yicha ishonchli bilim va qolganlari bilan tanishlik yetarli.

## Mashhur steklar

| Til | Odatiy freymvorklar | Qayerda ko‘p uchraydi |
|---|---|---|
| **Python** | Django, FastAPI | Veb-servislar, tahlil, AI loyihalar |
| **JavaScript / TypeScript** | Node.js, NestJS, Express | Jamoa frontend va backend’ni bitta tilda yozadigan veb-ilovalar |
| **PHP** | Laravel, Symfony | Saytlar, internet-do‘konlar, CMS |
| **Java / Kotlin** | Spring | Yirik korporativ tizimlar, banklar |
| **Go** | Standart kutubxona, Gin | Yuqori yuklamali servislar, infratuzilma |
| **C#** | ASP.NET | Korporativ tizimlar |

Qaysi tilni tanlashni hududingizdagi vakansiyalarga qarab hal qilgan ma’qul. Backend dasturlash tamoyillari — HTTP, ma’lumotlar bazalari, arxitektura — barcha steklarda bir xil.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- **SQL’ni tushunmasdan freymvork o‘rganish**: ertami-kechmi bu sekin so‘rovlarga olib keladi.
- **Xatolarni qayta ishlamaslik** va tashqi servis doim javob beradi deb umid qilish.
- **Maxfiy ma’lumotlarni kodda saqlash**: parol va kalitlar muhit o‘zgaruvchilarida turishi kerak.
- **Testlarni o‘tkazib yuborish**: backend’dagi xatolar ko‘pincha ma’lumotlarni buzmaguncha sezilmaydi.

## FAQ

### Backend dasturchiga kuchli matematika kerakmi?

Ko‘pchilik vazifalar uchun mantiq va asosiy matematika yetarli. Chuqur matematika alohida sohalarda kerak bo‘ladi — masalan, mashinali o‘qitish yoki katta ma’lumotlar bilan ishlashda.

### Backend frontend’dan qiyinroqmi?

Ular turlicha qiyin. Frontend interfeys va turli brauzerlardagi xatti-harakatga e’tibor talab qiladi, backend — ma’lumotlar, arxitektura va ishonchlilikka. Qaysi vazifalar sizga qiziqroq ekaniga qarab tanlang.

### Amaliyotni qaysi loyihadan boshlash kerak?

Ma’lumotlar bazasi bilan oddiy API yarating: masalan, foydalanuvchilarni ro‘yxatdan o‘tkazadigan vazifalar ro‘yxati yoki buyurtmalar hisobi. Ma’lumotlarni tekshirish, xatolarni qayta ishlash va testlar qo‘shing — bu portfolio uchun yaxshi loyiha bo‘ladi.
