---
title: "CORS: xato nega paydo bo‘ladi va uni qanday tuzatish kerak"
description: Brauzer boshqa domenga so‘rovlarni nega bloklaydi, preflight va CORS sarlavhalari qanday ishlaydi, serverni xavfsiz tarzda qanday sozlash mumkin.
summary: CORS xatosini server emas, brauzer beradi va u serverda tuzatiladi: server himoyani o‘chirmasdan, kerakli sarlavhalar bilan sizning origin’ingizga aniq ruxsat berishi kerak.
---

## CORS xatosi nega paydo bo‘ladi

Brauzer **same-origin policy** qoidasiga amal qiladi: sahifadagi JavaScript faqat o‘z **origin**’idan — protokol, domen va port birikmasidan kelgan javoblarni erkin o‘qiy oladi. `https://site.uz` va `https://api.site.uz` — turli origin’lar, `http://localhost:3000` va `http://localhost:8080` ham shunday.

**CORS** (Cross-Origin Resource Sharing) — server brauzerga «Bu origin javoblarimni o‘qishi mumkin» deb aytadigan mexanizm. Kerakli sarlavha bo‘lmasa, brauzer javobni bloklaydi va konsolga xato yozadi.

Muhim: so‘rov ko‘pincha **serverga yetib boradi** va bajariladi. Brauzer shunchaki natijani kodingizga bermaydi. Shu sababli Postman va curl ishlaydi — ularda CORS yo‘q.

## Oddiy so‘rovlar va preflight

Ba’zi so‘rovlarni brauzer darhol yuboradi: `GET`, `HEAD` yoki «oddiy» sarlavhalar va `application/x-www-form-urlencoded` kabi turlar bilan `POST`.

Qolganlari uchun — masalan, `PUT`, `DELETE`, `Content-Type: application/json` yoki `Authorization` sarlavhali `POST` — brauzer avval **preflight** yuboradi: ruxsat so‘raydigan `OPTIONS` so‘rovi.

```http
OPTIONS /orders HTTP/1.1
Origin: https://site.uz
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type, authorization
```

Server muvaffaqiyatli status va ruxsat beruvchi sarlavhalar bilan javob berishi kerak. Shundan keyingina asosiy so‘rov ketadi.

## Qaysi sarlavhalar kerak

| Sarlavha | Vazifasi |
|---|---|
| `Access-Control-Allow-Origin` | Qaysi origin javobni o‘qiy oladi |
| `Access-Control-Allow-Methods` | Ruxsat etilgan metodlar (preflight uchun) |
| `Access-Control-Allow-Headers` | Ruxsat etilgan so‘rov sarlavhalari |
| `Access-Control-Allow-Credentials` | Cookie yuborish mumkinmi |
| `Access-Control-Max-Age` | Preflight javobini qancha keshlash |
| `Vary: Origin` | Kesh boshqa origin uchun javobni bermasligi uchun |

## To‘g‘ri tuzatish

Serverni origin’larning **oq ro‘yxati** bilan sozlang. Express uchun misol:

```js
import express from "express";
import cors from "cors";

const app = express();
const allowed = ["https://site.uz", "https://admin.site.uz"];

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

Agar CORS nginx’da sozlansa, `OPTIONS` so‘rovi 404 yoki 401 qaytaradigan ilovaga ketmasdan, sarlavhalar bilan javob olishiga ishonch hosil qiling.

## Cookie va credentials

Brauzer cookie’ni boshqa origin’ga yuborishi uchun ikki tomonda sozlash kerak:

- klientda `fetch(url, { credentials: "include" })`;
- serverda `Access-Control-Allow-Credentials: true` va `Access-Control-Allow-Origin`’da **aniq** origin.

Credentials bilan birga `*` qiymatini brauzer qabul qilmaydi. Bundan tashqari, kross-sayt so‘rovlar uchun cookie’larda `SameSite=None; Secure` bo‘lishi kerak.

## Xavfli «yechimlar»

- Credentials bilan birga **istalgan Origin’ni qaytarish**. Shunda har qanday sayt tizimga kirgan foydalanuvchi nomidan so‘rov yubora oladi.
- **Yopiq API uchun `*`**. Faqat avtorizatsiyasiz ochiq ma’lumotlar uchun maqbul.
- CORS’ni o‘chiradigan **brauzer kengaytmalari va flaglar**. Faqat sizda ishlaydi, foydalanuvchilar baribir xatoni ko‘radi.
- **Begona ochiq proksilar**. Ma’lumotlaringiz uchinchi tomon serveri orqali o‘tadi.

Yaxshi muqobil — **bitta origin**: frontend va API’ni reverse proxy yoki yig‘uvchining dev-proxy’si orqali bitta domendan berish. Shunda CORS umuman kerak emas.

## Qanday tashxis qo‘yish kerak

1. Network bo‘limini oching va `OPTIONS` so‘rovini toping.
2. Uning statusini tekshiring: u 404, 401 yoki 500 emas, muvaffaqiyatli bo‘lishi kerak.
3. So‘rovdagi `Origin`ni `Access-Control-Allow-Origin` qiymati bilan solishtiring — protokol va portgacha to‘liq mos kelishi kerak.
4. Xatolarda sarlavhalar yo‘qolmayaptimi, tekshiring: ko‘p serverlar 4xx va 5xx javoblarga CORS qo‘shmaydi va haqiqiy xato CORS xatosiga o‘xshab qoladi.

## FAQ

### Nega Postman’da ishlaydi, brauzerda esa yo‘q?

CORS — brauzer qoidasi. Postman va server so‘rovlari uni tekshirmaydi, shuning uchun ular javobni ko‘radi, brauzer esa uni skriptdan yashiradi.

### CORS’ni faqat frontendda tuzatish mumkinmi?

Yo‘q. Ruxsatni server beradi. Frontendda faqat so‘rovlarni o‘z origin’ingiz orqali proksilab, CORS zaruratini yo‘qotish mumkin.

### CORS API’mni hujumlardan himoya qiladimi?

Yo‘q, bu avtorizatsiya mexanizmi emas. U brauzerda javoblarni o‘qishni cheklaydi, lekin boshqa dasturlardan keladigan so‘rovlarga to‘sqinlik qilmaydi. API’ga baribir autentifikatsiya va huquqlarni tekshirish kerak.
