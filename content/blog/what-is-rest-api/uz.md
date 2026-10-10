---
title: REST API nima: misollar bilan oddiy tushuntirish
description: REST API oddiy tilda: resurslar, endpoint’lar, HTTP metodlari, JSON, stateless va javob kodlari internet-do‘kon katalogi misolida.
summary: REST API — dasturlarning HTTP orqali ma’lumot almashish kelishuvi: har bir obyekt o‘z manziliga ega resurs, u bilan bajariladigan amal esa GET, POST, PUT, PATCH yoki DELETE metodi bilan belgilanadi.
---
## Asosiysi qisqacha

**API** — bir dastur boshqasidan biror ish bajarishni yoki ma’lumot berishni so‘rash usuli. **REST** — bunday API’larni HTTP ustida qurishning mashhur uslubi. HTTP — brauzeringiz ishlaydigan protokolning o‘zi.

Internet-do‘konning mahsulotlar katalogini tasavvur qiling. Mobil ilova, sayt va Telegram-bot mahsulotlarni bitta manbadan — serverdan oladi. Uchalasi ham serverni bir xil tushunishi uchun u REST API taqdim etadi: mahsulotni olish, yaratish, o‘zgartirish yoki o‘chirish uchun manzillar va qoidalar to‘plami.

## Resurslar va endpoint’lar

**Resurs** — tizim ishlaydigan har qanday obyekt: mahsulot, kategoriya, buyurtma, foydalanuvchi.

**Endpoint** — resurs mavjud bo‘lgan manzil:

- `/products` — barcha mahsulotlar (kolleksiya);
- `/products/42` — id’si 42 bo‘lgan aniq mahsulot;
- `/categories/5/products` — 5-kategoriyadagi mahsulotlar.

Manzillarda fe’llar emas, **otlar** ishlatiladi. `/getProducts` emas, `/products`. Resurs bilan nima qilish kerakligini HTTP metodi aytadi.

## HTTP metodlari: resurs bilan nima qilamiz

| Metod | Amal | Misol |
|---|---|---|
| GET | Olish | `GET /products/42` |
| POST | Yaratish | `POST /products` |
| PUT | To‘liq almashtirish | `PUT /products/42` |
| PATCH | Qisman o‘zgartirish | `PATCH /products/42` |
| DELETE | O‘chirish | `DELETE /products/42` |

Bitta `/products/42` manzili turli metodlar bilan turli amallarni bildiradi. Aynan shu REST API’ni oldindan bashorat qilinadigan qiladi.

## JSON: ma’lumot formati

Ko‘pincha server va mijoz ma’lumotni **JSON** formatida almashadi. Bu odamlar ham, dasturlar ham oson o‘qiydigan oddiy matnli format.

Mahsulot yaratish so‘rovi:

```http
POST /products
Content-Type: application/json

{
  "name": "Elektr choynak",
  "price": 250000,
  "categoryId": 5
}
```

Server javobi:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 43,
  "name": "Elektr choynak",
  "price": 250000,
  "categoryId": 5
}
```

## Stateless: server oldingi so‘rovlarni eslab qolmaydi

**Stateless** tamoyili har bir so‘rov o‘zi yetarli ekanini bildiradi. Server so‘rovlar orasida «suhbat sessiyasi»ni saqlamaydi — mijoz har safar kerakli hamma narsani yuboradi, masalan sarlavhadagi avtorizatsiya tokenini:

```http
GET /orders
Authorization: Bearer <token>
```

Bu nima uchun kerak: bir nechta serverlardan istalgani istalgan so‘rovni qayta ishlay oladi. Tizimni kengaytirish va nosozliklardan keyin tiklash osonroq.

## Javob kodlari: natija bitta raqamda

Server natijani uch xonali kod bilan bildiradi:

- **2xx** — muvaffaqiyat: `200 OK`, `201 Created`, `204 No Content`.
- **3xx** — yo‘naltirish.
- **4xx** — mijoz xatosi: `400 Bad Request` (noto‘g‘ri ma’lumot), `401 Unauthorized` (avtorizatsiya yo‘q), `404 Not Found` (resurs yo‘q).
- **5xx** — server xatosi: `500 Internal Server Error`.

Mijoz avval kodga, keyin javob tanasiga qaraydi.

## REST API’ni qayerda uchratasiz

- Mobil ilova lenta va savatni yuklaydi.
- Sayt to‘lov xizmati orqali to‘lov qabul qiladi.
- CRM saytdan arizalarni oladi.
- Ombor qoldiqlarni marketpleys bilan sinxronlaydi.

Bugun tizimlar orasidagi deyarli har qanday integratsiya — API chaqiruvlari, REST esa ular orasida eng keng tarqalgan uslub.

## Ko‘p uchraydigan noto‘g‘ri tasavvurlar

- **«REST — bu shunchaki HTTP orqali JSON».** Resurslar, to‘g‘ri metodlar va javob kodlari ham muhim.
- **«Hamma narsani POST orqali qilish mumkin».** Mumkin, lekin bashorat qilinuvchanlik, keshlash va boshqa dasturchilar uchun tushunarlilik yo‘qoladi.
- **«Xatoni 200 kodi bilan qaytarish mumkin».** Bu mijozlar mantiqini buzadi: ular so‘rovni muvaffaqiyatli deb hisoblaydi.

## FAQ

### REST API GraphQL’dan nimasi bilan farq qiladi?

REST’da har bir resursning o‘z manzili bor va javob shaklini server belgilaydi. GraphQL’da odatda bitta manzil bo‘ladi, mijoz esa qaysi maydonlar kerakligini o‘zi yozadi.

### REST API’dan foydalanish uchun dasturlashni bilish kerakmi?

So‘rovlarni sinab ko‘rish uchun Postman yoki curl kabi vositalar yetarli. API’ni mahsulotga integratsiya qilish uchun dasturchi kerak.

### REST API xavfsizmi?

Uslubning o‘zi xavfsizlikni kafolatlamaydi. Uni HTTPS, token orqali avtorizatsiya, huquqlarni tekshirish va kiruvchi ma’lumotlarni validatsiya qilish ta’minlaydi.
