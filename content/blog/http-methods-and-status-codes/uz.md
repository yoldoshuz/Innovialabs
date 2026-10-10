---
title: Dasturchi bilishi kerak bo‘lgan HTTP metodlari va javob kodlari
description: GET, POST, PUT, PATCH va DELETE, idempotentlik hamda asosiy 2xx, 3xx, 4xx, 5xx kodlari: qaysi metodni ishlatish va qachon qaysi kodni qaytarish.
summary: Metod resurs bilan nima qilishni, javob kodi esa natijani bildiradi; GET, PUT va DELETE idempotent, POST esa yo‘q, mijoz xatolari (4xx) server xatolaridan (5xx) aniq ajratilishi kerak.
---
## Asosiysi ikki jumlada

**HTTP metodi** mijozning niyatini bildiradi: o‘qish, yaratish, o‘zgartirish yoki o‘chirish. **Javob kodi** natijani xabar qiladi. Ikkalasi to‘g‘ri tanlansa, mijoz, proksi, kesh va monitoring javob tanasini o‘qimasdan nima bo‘lganini tushunadi.

## Beshta asosiy metod

| Metod | Vazifasi | Xavfsiz | Idempotent |
|---|---|---|---|
| GET | Resursni olish | Ha | Ha |
| POST | Resurs yaratish yoki amalni ishga tushirish | Yo‘q | Yo‘q |
| PUT | Resursni to‘liq almashtirish | Yo‘q | Ha |
| PATCH | Resursning bir qismini o‘zgartirish | Yo‘q | Kafolatlanmaydi |
| DELETE | Resursni o‘chirish | Yo‘q | Ha |

- **Xavfsiz** metod serverda hech narsani o‘zgartirmaydi. GET’ni ma’lumotlarni o‘chirish yoki o‘zgartirish uchun ishlatmang: qidiruv robotlari va brauzerlar uni o‘zi chaqirishi mumkin.
- **PUT** resursni to‘liq yuborishni talab qiladi. Siz yubormagan maydonlar o‘chirilgan yoki tozalangan hisoblanadi.
- **PATCH** faqat o‘zgarishlarni yuboradi, masalan mahsulotning yangi narxini.

## Idempotentlik oddiy tilda

Agar bir xil so‘rov qayta yuborilganda birinchisi bilan bir xil yakuniy natija bersa, metod **idempotent** hisoblanadi.

- `DELETE /orders/7` ikki marta — buyurtma o‘chirilgan, holat o‘sha.
- `PUT /products/42` bir xil tana bilan ikki marta — mahsulot o‘sha holatda.
- `POST /orders` ikki marta — ikkita buyurtma.

Bu tarmoqda nosozlik bo‘lganda muhim: javob kelmasa, idempotent so‘rovni xavfsiz qayta yuborish mumkin. POST’ni qayta yuborish xavfli — masalan, pul ikki marta yechiladi. Yechim — **idempotentlik kaliti**: mijoz noyob sarlavha yuboradi, server esa bitta operatsiyani ikki marta bajarmaydi.

## 2xx kodlari: muvaffaqiyat

- **200 OK** — so‘rov bajarildi, tanada ma’lumot bor.
- **201 Created** — resurs yaratildi. Yaxshi amaliyot — uni manzili ko‘rsatilgan `Location` sarlavhasi bilan qaytarish.
- **202 Accepted** — so‘rov qabul qilindi, keyinroq qayta ishlanadi (masalan, hisobot yaratish).
- **204 No Content** — muvaffaqiyatli, tana yo‘q. Ko‘pincha DELETE uchun.

## 3xx kodlari: yo‘naltirish

- **301 Moved Permanently** — manzil butunlay o‘zgardi. Sahifalar ko‘chirilganda SEO uchun muhim.
- **302 Found** — vaqtinchalik yo‘naltirish.
- **304 Not Modified** — mijozdagi keshlangan nusxa dolzarb, ma’lumot qayta yuborilmaydi.
- **307 / 308** — metod va so‘rov tanasini saqlagan holda vaqtinchalik va doimiy yo‘naltirish.

## 4xx kodlari: mijoz tomonidagi xato

- **400 Bad Request** — noto‘g‘ri so‘rov: buzilgan JSON, noto‘g‘ri format.
- **401 Unauthorized** — mijoz autentifikatsiyadan o‘tmagan: token yo‘q yoki muddati tugagan.
- **403 Forbidden** — mijoz ma’lum, lekin huquqlari yetarli emas.
- **404 Not Found** — resurs mavjud emas.
- **405 Method Not Allowed** — bu manzil uchun metod qo‘llab-quvvatlanmaydi.
- **409 Conflict** — holat ziddiyati: bu email band, versiya eskirgan.
- **422 Unprocessable Content** — sintaksis to‘g‘ri, lekin ma’lumot validatsiyadan o‘tmadi.
- **429 Too Many Requests** — so‘rovlar limiti oshib ketdi.

## 5xx kodlari: server tomonidagi xato

- **500 Internal Server Error** — koddagi kutilmagan xato.
- **502 Bad Gateway** — proksi yuqoridagi serverdan noto‘g‘ri javob oldi.
- **503 Service Unavailable** — servis vaqtincha ishlamayapti: yuklama yoki texnik xizmat.
- **504 Gateway Timeout** — yuqoridagi server o‘z vaqtida javob bermadi.

Qoida: agar mijoz so‘rovni o‘zi tuzata olsa — bu 4xx. Agar server aybdor bo‘lsa — 5xx. Monitoring odatda aynan 5xx ko‘payganda signal beradi.

## Ko‘p uchraydigan xatolar

- **Tanada `"error": true` bilan 200 qaytarish.** Mijozlar, keshlar va monitoring so‘rovni muvaffaqiyatli deb hisoblaydi.
- **401 va 403’ni adashtirish.** 401 — «siz kimsiz?», 403 — «kimligingizni bilamiz, lekin mumkin emas».
- **Noto‘g‘ri ma’lumotga 500 qaytarish.** Validatsiya xatosi — bu 400 yoki 422, server nosozligi emas.
- **Ma’lumotni GET orqali o‘zgartirish.** `/delete?id=5` kabi havola brauzerning oldindan yuklashi tufayli ishlab ketishi mumkin.

## FAQ

### Qachon PUT, qachon PATCH ishlatish kerak?

PUT — mijoz resursni to‘liq yuborib, uni almashtirmoqchi bo‘lganda. PATCH — bitta yoki bir nechta maydon o‘zgarganda. Amalda PATCH ko‘proq uchraydi.

### Resurs mavjud, lekin buni ko‘rsatish mumkin bo‘lmasa, qaysi kodni qaytarish kerak?

Ko‘p API’lar resurs borligini oshkor qilmaslik uchun 403 o‘rniga 404 qaytaradi. Shaxsiy ma’lumotlar uchun bu maqbul amaliyot.

### Kodlarning to‘liq ro‘yxatini qayerdan topish mumkin?

MDN’ning HTTP bo‘yicha qo‘llanmasida va HTTP spetsifikatsiyasida — u yerda barcha standart kodlar va ularning aniq ma’nosi yozilgan.
