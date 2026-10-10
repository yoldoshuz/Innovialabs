---
title: Brauzerda keshlash: Cache-Control, ETag va keshni yangilash
description: Cache-Control va ETag sarlavhalari qanday ishlaydi, nega HTML va statik fayllar turlicha keshlanadi va DevTools’da keshni qanday tekshirish mumkin.
summary: Nomida hash bor statik fayllarni immutable bilan bir yilga keshlang, HTML’ni esa no-cache va ETag bilan bering — shunda yangilanishlar darhol yetib boradi, takroriy yuklanishlar esa deyarli bir zumda bo‘ladi.
---

## Qisqa javob

Brauzer faylni keshdan olishni yoki serverga murojaat qilishni javob sarlavhalariga qarab hal qiladi. Ko‘pchilik saytlar uchun ishlaydigan sxema:

- **Nomida hash bor statik fayllar** (`app.3f9a2c.js`, `logo.81bd.svg`) — `Cache-Control: public, max-age=31536000, immutable`. Bunday nomli fayl hech qachon o‘zgarmaydi, shuning uchun uni bir yil saqlash mumkin.
- **HTML va API javoblari** — `Cache-Control: no-cache` hamda `ETag` yoki `Last-Modified`. Brauzer har safar serverdan «o‘zgardimi?» deb so‘raydi, o‘zgarmagan bo‘lsa tanasiz qisqa `304 Not Modified` javobini oladi.
- **Shaxsiy ma’lumotlar** — `Cache-Control: private, no-store`.

## Asosiy sarlavhalar

| Sarlavha | Vazifasi |
|---|---|
| `max-age=N` | Javob N soniya yangi hisoblanadi, serverga so‘rov yuborilmaydi |
| `no-cache` | Saqlash mumkin, lekin ishlatishdan oldin serverda tekshirish kerak |
| `no-store` | Umuman saqlamaslik |
| `private` / `public` | Faqat brauzer / CDN va proksilar ham |
| `immutable` | Fayl o‘zgarmaydi, sahifa yangilanganda ham qayta tekshirilmaydi |
| `s-maxage=N` | CDN va umumiy keshlar uchun alohida muddat |
| `ETag` | Resurs versiyasining «izi» |
| `Last-Modified` | Oxirgi o‘zgarish sanasi |

Ko‘p uchraydigan chalkashlik: **no-cache «keshlamaslik» degani emas**. Bu «keshlash, lekin har doim qayta tekshirish» degani. Saqlashni taqiqlash — `no-store`.

## Qayta tekshirish (revalidation) qanday ishlaydi

1. Server faylni `ETag: "abc123"` bilan yuboradi.
2. Yangilik muddati tugadi (yoki `no-cache` qo‘yilgan), brauzer `If-None-Match: "abc123"` yuboradi.
3. Versiya o‘sha bo‘lsa, server tanasiz `304` qaytaradi — trafik tejaladi, lekin so‘rovning o‘zi emas.
4. Versiya yangi bo‘lsa — yangi tarkib va yangi `ETag` bilan `200` keladi.

Qayta tekshirish to‘liq yuklashdan arzon, ammo baribir tarmoq so‘rovi. Shuning uchun statik fayllar uchun uzun `max-age` orqali **so‘rovlardan butunlay qochgan** ma’qul.

## Fayl nomidagi hash orqali keshni yangilash

Agar `styles.css`ni bir yillik `max-age` bilan bersangiz, foydalanuvchilar yangi versiyani ko‘rmaydi. Yechim — **cache busting**: sborshik (Vite, webpack, Next.js) fayl nomiga tarkib hashini qo‘shadi. Kod o‘zgardi — hash o‘zgardi — nom o‘zgardi — brauzer yangi faylni yuklaydi.

Muhim shart: **bu fayllarga havola qiluvchi HTML uzoq keshlanmasligi kerak**. Aks holda eski HTML eski fayllarga ishora qilib qoladi. nginx misoli:

```nginx
location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
    add_header Cache-Control "no-cache";
    try_files $uri $uri/ /index.html;
}
```

Manzilga `?v=2` qo‘shish ham ishlaydi, lekin uni qo‘lda yangilashni unutish oson, hashni esa sborshik o‘zi qo‘yadi.

## DevTools’da keshni tekshirish

- **Network** bo‘limini oching, so‘rovni tanlang va **Response Headers**ga qarang: qaysi `Cache-Control` o‘rnatilgan, `ETag` bormi.
- **Size** ustunida `(memory cache)` yoki `(disk cache)` ko‘rinsa — fayl tarmoqsiz keshdan olingan. `304` statusi — qayta tekshirish bo‘lgan.
- **Disable cache** belgisi keshni faqat DevTools ochiq turganda o‘chiradi. Haqiqiy xatti-harakatni ko‘rish uchun uni olib tashlang.
- Oddiy yangilash resurslarni qayta tekshirishi mumkin, shuning uchun sayt ichidagi havola orqali o‘tishni ham sinab ko‘ring.
- CDN’ni hisobga oling: `Age` yoki `X-Cache` (provayderga bog‘liq) kabi sarlavhalar oraliq kesh javob berganini ko‘rsatadi.

## Ko‘p uchraydigan xatolar

- **Uzun max-age’li HTML.** Foydalanuvchilar saytning eski versiyasini kunlab ko‘radi.
- **Hashsiz fayllarni uzoq keshlash.** `logo.png` yangilandi, ba’zi tashrif buyuruvchilarda esa eski logotip qoladi.
- **Shaxsiy javoblarda `private` yo‘qligi.** CDN ularni boshqa foydalanuvchiga berib yuborishi mumkin.
- **Balanser ortidagi serverlarda turli ETag’lar** — brauzer faylni qayta-qayta yuklaydi.
- **`Expires`ga tayanish.** `max-age` ko‘rsatilgan bo‘lsa, u ustun turadi; `Cache-Control`ning o‘zi yetarli.

## FAQ

### ETag yoki Last-Modified — qaysi birini tanlash kerak?

Ikkalasi ham qayta tekshirish uchun ishlaydi. ETag aniqroq, chunki vaqtni emas, tarkibni aks ettiradi. Ikkalasini birga yuborish mumkin: brauzer mos shartli sarlavhalarni qaytaradi, server esa ularni tekshiradi.

### Barcha foydalanuvchilar saytning yangi versiyasini olishi uchun nima qilish kerak?

Fayllar hash bilan, HTML esa `no-cache` bilan berilsa, hech narsa qilish shart emas — keyingi ochilishda yangi fayllar yuklanadi. HTML uzoq muddatga keshlangan bo‘lsa, muddat tugashini kutish yoki resurs manzillarini o‘zgartirish kerak; server qo‘shimcha mexanizmlarsiz brauzer keshini masofadan tozalay olmaydi.

### API javoblarini keshlash kerakmi?

Shaxsiy va tez-tez o‘zgaradigan ma’lumotlar uchun odatda `no-cache` yoki `no-store` ishlatiladi. Kam o‘zgaradigan ommaviy ma’lumotnomalarni qisqa `max-age` va ETag bilan berish mumkin.
