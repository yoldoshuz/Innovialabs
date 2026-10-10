---
title: Postman nima va unda API’ni qanday test qilish mumkin
description: Menejerlar, QA va junior dasturchilar uchun Postman: GET va POST so‘rov yuborish, sarlavhalar, so‘rov tanasi, avtorizatsiya va server javobini o‘qish.
summary: Postman — API’ga qo‘lda so‘rov yuborib, server javobini ko‘rish uchun dastur: siz metod, manzil, sarlavhalar va tanani ko‘rsatasiz, Send tugmasini bosasiz hamda status kodi, vaqt va javob ma’lumotlarini ko‘rasiz.
---
## Postman nima

**Postman** — API bilan ishlash uchun klient. U serverga so‘rov yuborib, u nima javob berganini ko‘rish imkonini beradi — kod yozmasdan va sayt yoki ilovaning tayyor interfeysisiz.

Kimga foydali:

- **Menejerlarga** — va’da qilingan API funksiyasi haqiqatan ishlashini va nima qaytarishini tekshirish uchun.
- **QA muhandislariga** — backend’ni frontend va mobil ilovadan alohida test qilish uchun.
- **Junior dasturchilarga** — integratsiya yozishdan oldin begona API qanday tuzilganini tushunish uchun.

Postman Windows, macOS va Linux uchun ish stoli ilovasi hamda veb-versiya sifatida mavjud. Ko‘pchilik funksiyalar uchun bepul akkaunt kerak.

## So‘rov nimalardan iborat

| Qism | Bu nima | Misol |
|---|---|---|
| **Metod** | Nima qilmoqchisiz | GET — olish, POST — yaratish |
| **URL** | Resurs manzili | `https://api.example.com/users` |
| **Params** | Manzildagi `?` dan keyingi parametrlar | `?page=2&limit=20` |
| **Headers** | Xizmat ma’lumotlari | `Content-Type: application/json` |
| **Body** | Siz yuboradigan ma’lumotlar | Yangi foydalanuvchi maydonlari bilan JSON |
| **Authorization** | Siz kimsiz | token yoki login va parol |

## GET so‘rovini qanday yuborish

1. **New → HTTP** yoki vkladkalar yonidagi «+» ni bosing.
2. Metodni **GET** qoldiring.
3. Manzilni kiriting, masalan `https://api.example.com/users`.
4. Parametrlar kerak bo‘lsa, ularni **Params** vkladkasida qo‘shing — Postman ularni manzilga o‘zi qo‘shib qo‘yadi.
5. **Send** ni bosing.

Pastda server javobi paydo bo‘ladi.

## POST so‘rovini qanday yuborish

POST odatda yangi narsa yaratadi: foydalanuvchi, buyurtma, ariza.

1. **POST** metodini tanlang va manzilni ko‘rsating.
2. **Body** vkladkasini oching va formatni tanlang.
3. JSON uchun **raw** va **JSON** turini tanlang, so‘ng ma’lumotlarni kiriting:

```json
{
  "name": "Aziza",
  "email": "aziza@example.com"
}
```

4. **Send** ni bosing.

So‘rov tanasining qanday formatlari bor:

- **raw → JSON** — zamonaviy API’lar uchun eng ko‘p uchraydigan variant.
- **form-data** — fayl yoki forma maydonlarini yuborish kerak bo‘lganda.
- **x-www-form-urlencoded** — klassik HTML formalar va ba’zi eski API’lar.
- **binary** — bitta faylni butunligicha yuborish.

Qaysi format kerakligi API hujjatlarida yozilgan. Agar hujjat bo‘lmasa — dasturchidan so‘rang.

## Sarlavhalar

Sarlavhalar serverga qo‘shimcha ma’lumot beradi. Eng ko‘p uchraydiganlari:

- **Content-Type** — so‘rov tanasi qaysi formatda. Body vkladkasida JSON tanlasangiz, Postman uni o‘zi qo‘yadi.
- **Accept** — javobni qaysi formatda olishni xohlaysiz.
- **Authorization** — kirish ma’lumotlari. Uni alohida vkladka orqali berish qulayroq.

## Avtorizatsiya

**Authorization** vkladkasida API hujjatlarida ko‘rsatilgan turni tanlang:

- **Bearer Token** — tokenni qo‘yasiz, Postman `Authorization: Bearer <token>` sarlavhasini qo‘shadi.
- **API Key** — sarlavhadagi yoki manzil parametrlaridagi kalit, maydon nomini API belgilaydi.
- **Basic Auth** — login va parol.
- **OAuth 2.0** — Postman token olish jarayonini o‘zi bajara oladi.

Hamkasblar bilan ulashadigan so‘rovlarga haqiqiy (production) tokenlarni qo‘ymang — buning uchun o‘zgaruvchilar va muhitlar bor.

## Javobni qanday o‘qish kerak

Javob blokida to‘rtta narsaga qarang:

- **Status kodi** — muvaffaqiyat yoki xatoning asosiy belgisi.
- **Vaqt** — server qancha vaqtda javob berdi.
- Javob **hajmi**.
- **Body** — ma’lumotlarning o‘zi. **Pretty** rejimi JSON’ni o‘qish uchun formatlaydi.

Javobning **Headers** vkladkasida serverning xizmat sarlavhalari, **Cookies** vkladkasida esa cookie’lar ko‘rinadi.

| Kod | Ma’nosi |
|---|---|
| 200, 201 | Muvaffaqiyat; 201 — resurs yaratildi |
| 400 | So‘rovda xato: maydonlar yoki format noto‘g‘ri |
| 401 | Avtorizatsiya yo‘q: token yo‘q yoki noto‘g‘ri |
| 403 | Avtorizatsiyadan o‘tgansiz, lekin ruxsat yo‘q |
| 404 | Resurs topilmadi yoki manzil noto‘g‘ri |
| 500 va undan yuqori | Server tomonidagi xato |

## Foydali mayda narsalar

- **cURL importi**: cURL buyrug‘ini **Import** orqali qo‘ying — Postman uni tayyor so‘rovga aylantiradi.
- **Kod generatsiyasi**: o‘ng tomondagi `</>` belgisi xuddi shu so‘rovni JavaScript, Python, PHP va boshqa tillarda ko‘rsatadi.
- **Saqlash**: so‘rovlarni qaytadan yig‘maslik uchun kolleksiyalarda saqlang.

## FAQ

### Postman’dan foydalanish uchun dasturlashni bilish kerakmi?

Yo‘q. So‘rov yuborish va javobni o‘qish uchun so‘rov nimalardan iboratligini tushunish yetarli. Dasturlash keyinroq, avtomatik tekshiruvlar yozmoqchi bo‘lsangiz, kerak bo‘ladi.

### Postman brauzer orqali test qilishdan nimasi bilan farq qiladi?

Brauzerning manzil satri faqat GET so‘rovlarini yuboradi va sarlavha hamda tanani sozlab bo‘lmaydi. Postman’da istalgan metoddan foydalanish, sarlavhalar, avtorizatsiya va ma’lumotlarni berish hamda javobni batafsil ko‘rish mumkin.

### Tokenlarni Postman’da saqlash xavfsizmi?

So‘rovlar va kolleksiyalar Postman bulutiga sinxronlanadi. Maxfiy ma’lumotlarni so‘rov tanasida yoki kolleksiyaning umumiy tavsifida emas, secret turidagi o‘zgaruvchilarda va muhitning joriy qiymatlarida saqlang.
