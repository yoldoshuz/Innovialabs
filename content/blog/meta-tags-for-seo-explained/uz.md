---
title: SEO uchun meta-teglar: qaysilari muhim, qaysilari foydasiz
description: title, description, robots, viewport, Open Graph va eskirgan keywords tegini ko‘rib chiqamiz: har bir meta-teg bugun nima qiladi va uni qanday to‘ldirish kerak.
summary: SEO uchun title, meta robots va viewport haqiqatan muhim, description snippetning kliklanishiga ta’sir qiladi, Open Graph ijtimoiy tarmoq va messenjerlarda havola ko‘rinishiga javob beradi, meta keywords’ni esa Google hisobga olmaydi.
---

## Qaysi meta-teglar haqiqatan muhim

Meta-teglar — sahifaning `<head>` qismidagi xizmat satrlari bo‘lib, ularni qidiruv tizimlari, brauzerlar va ijtimoiy tarmoqlar o‘qiydi. Ularning hammasi bir xil foydali emas:

| Teg | Reytingga ta’sir qiladimi | Nima uchun kerak |
|---|---|---|
| `title` | Ha | Qidiruv natijasi va brauzer vkladkasidagi sarlavha |
| `meta description` | To‘g‘ridan-to‘g‘ri yo‘q | Snippet matni, kliklarga ta’sir qiladi |
| `meta robots` | Indeksatsiyani boshqaradi | Indeksatsiya yoki havolalarga o‘tishni taqiqlash |
| `meta viewport` | Bilvosita | To‘g‘ri mobil versiya |
| Open Graph | Yo‘q | Ijtimoiy tarmoq va messenjerlarda havola prevyusi |
| `meta keywords` | Google’da yo‘q | Eskirgan |

## Title: sahifaning asosiy tegi

**Title** — eng kuchli on-page signallardan biri. U qidiruv natijalarida sarlavha sifatida ko‘rinadi, garchi qidiruv tizimi uni muvaffaqiyatsiz deb hisoblasa, qayta yozishi mumkin.

Qanday yozish kerak:

- har bir sahifa uchun noyob;
- asosiy fikr boshida, asosiy so‘rov — tabiiy ravishda, ro‘yxat ko‘rinishida emas;
- natijalarda kesilib qolmasligi uchun yetarlicha qisqa;
- brend nomi — oxirida, ajratuvchi belgi orqali.

## Description: pozitsiya uchun emas, klik uchun

**Meta description** reytingga to‘g‘ridan-to‘g‘ri ta’sir qilmaydi, lekin ko‘pincha snippet matni sifatida ishlatiladi. Yaxshi tavsif foydalanuvchi aynan sizning havolangizni tanlash ehtimolini oshiradi.

- Sahifada nima topilishini bir-ikki gapda tasvirlang.
- Har bir sahifa uchun noyob tavsif yozing.
- Title’ni takrorlamang va kalit so‘zlarni sanab chiqmang.

Agar sahifadagi parcha so‘rovga yaxshiroq javob bersa, qidiruv tizimi description’ni u bilan almashtirishi mumkin — bu odatiy hol.

## Robots: indeksatsiyani boshqarish

`meta robots` qidiruv tizimiga sahifa bilan nima qilishni aytadi:

- `noindex` — natijalarda ko‘rsatmaslik;
- `nofollow` — sahifadagi havolalarga o‘tmaslik.

Odatiy qo‘llanilishi — xizmat sahifalari, ichki qidiruv natijalari, savat. Ko‘p uchraydigan xato — test muhitidagi `noindex`’ni qoldirib, uni ishchi saytga chiqarib yuborish.

Muhim: agar sahifa robots.txt’da yopilgan bo‘lsa, robot undagi `noindex`’ni ko‘rmaydi. Sahifani indeksdan olib tashlash uchun u aylanib chiqish uchun ochiq qolishi kerak.

## Viewport: mobil versiya

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Bu tegsiz mobil brauzer sahifani kichraytirilgan desktop ko‘rinishida chizadi. Qidiruv tizimlari birinchi navbatda mobil versiyani baholaydi, shuning uchun teg majburiy.

## Open Graph: ulashilganda havola qanday ko‘rinadi

`og:title`, `og:description`, `og:image` va `og:url` teglari Telegram, Facebook, LinkedIn va boshqa xizmatlarda havola prevyusini belgilaydi. Ular pozitsiyaga ta’sir qilmaydi, ammo ulashilgan havolaga bosish-bosmaslikka kuchli ta’sir qiladi. X (Twitter) uchun qo‘shimcha ravishda `twitter:card` teglari ishlatiladi.

```html
<meta property="og:title" content="Sahifa nomi">
<meta property="og:description" content="Qisqa tavsif">
<meta property="og:image" content="https://example.com/cover.png">
```

## Keywords: eskirgan teg

`meta keywords` bir paytlar sahifaning kalit so‘zlarini sanab o‘tardi. Suiiste’mol qilingani sababli Google uni allaqachon reyting uchun ishlatmaydi. Uni to‘ldirish shart emas, kalit so‘zlarning uzun ro‘yxati esa raqobatchilarga semantikangizni ochib berishi mumkin.

## Ko‘p uchraydigan xatolar

- Ko‘plab sahifalarda bir xil title va description.
- Bo‘sh title yoki “Bosh sahifa” kabi title.
- Muhim sahifalarda tasodifiy `noindex`.
- `og:image` yo‘qligi — havola messenjerda bo‘sh ko‘rinadi.
- Title’da kalit so‘zlar bilan haddan oshirish.

## FAQ

### Nega Google mening title yoki description’imni emas, boshqasini ko‘rsatadi?

Qidiruv tizimi boshqa matn aniq so‘rovga yaxshiroq javob beradi deb hisoblasa, ularni qayta yozadi. Title va description’ni sahifa mazmuniga aniqroq moslashtirsangiz, almashtirish ehtimoli kamayadi.

### Yandex uchun meta keywords’ni to‘ldirish kerakmi?

Amaliy foydasi yo‘q. Vaqtni title, description va kontent sifatiga sarflang.

### Open Graph SEO’ga ta’sir qiladimi?

Pozitsiyaga to‘g‘ridan-to‘g‘ri yo‘q. Ammo chiroyli prevyu ijtimoiy tarmoqlar va messenjerlardan o‘tishlarni ko‘paytiradi.
