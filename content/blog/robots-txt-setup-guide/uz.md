---
title: robots.txt’ni to‘g‘ri sozlash: qoidalar va misollar
description: robots.txt direktivalari, user-agent, joker belgilar, Yandex uchun Clean-param, WordPress va Bitrix uchun tayyor shablonlar hamda faylni tekshirish usullari.
summary: robots.txt robotlarning saytni aylanib chiqishini boshqaradi: xizmat bo‘limlari va dublikatlarni yoping, CSS, JS va muhim sahifalarni yopmang, Sitemap’ni ko‘rsating va faylni panellarda tekshiring.
---
## Qisqa javob

**robots.txt** — sayt ildizida joylashgan matnli fayl (`https://example.com/robots.txt`), u qidiruv robotlariga qaysi bo‘limlarni aylanib chiqmaslik kerakligini aytadi. U **skanerlashni** boshqaradi, indeksatsiyani emas: yopilgan sahifaga havolalar bo‘lsa, u baribir qidiruvda chiqishi mumkin. Sahifani qidiruvdan olib tashlash uchun `noindex` ishlating, robots.txt esa robot resurslarini keraksiz URL’larga sarflamaslik uchun kerak.

## Asosiy direktivalar

| Direktiva | Vazifasi |
|---|---|
| `User-agent` | Qoidalar qaysi robot uchun (`*` — hammasi uchun) |
| `Disallow` | Yo‘lni aylanib chiqishni taqiqlaydi |
| `Allow` | Taqiqlangan bo‘lim ichidagi yo‘lga ruxsat beradi |
| `Sitemap` | Sayt xaritasi manzilini ko‘rsatadi |
| `Clean-param` | Faqat Yandex: qaysi GET-parametrlarni e’tiborsiz qoldirish |

Qoidalar `User-agent` bo‘yicha guruhlanadi. Robot o‘zi uchun eng aniq guruhni tanlaydi, uning ichida `Allow` va `Disallow` zid kelsa, yo‘l bo‘yicha uzunroq mos kelgan qoida ustun bo‘ladi.

## Joker belgilar

- `*` — istalgan belgilar ketma-ketligi: `Disallow: /*?sort=` saralash parametri bor barcha URL’larni yopadi.
- `$` — qator oxiri: `Disallow: /*.pdf$` PDF fayllarni yopadi, lekin `/pdf-guide/`ni emas.

Yo‘llar registrga sezgir, `Disallow: /catalog` esa `/catalog-old/`ni ham yopadi. Faqat bo‘lim kerak bo‘lsa, `/catalog/` deb yozing.

## Yandex uchun Clean-param

Bu direktiva Yandex’ga parametrlar sahifa mazmunini o‘zgartirmasligini aytadi va bunday URL’lar bitta sahifa deb hisoblanadi:

```text
User-agent: Yandex
Clean-param: utm_source&utm_medium&utm_campaign /
Clean-param: ref /catalog/
```

Birinchi qator butun saytda UTM-belgilarni olib tashlaydi, ikkinchisi katalogdagi `ref` parametrini. Google bu direktivani qo‘llab-quvvatlamaydi: u uchun dublikatlar `rel="canonical"` orqali hal qilinadi.

## Tayyor shablonlar

**WordPress:**

```text
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /?s=
Disallow: /*?replytocom=

Sitemap: https://example.com/sitemap.xml
```

**1C-Bitrix:**

```text
User-agent: *
Disallow: /bitrix/
Disallow: /auth/
Disallow: /personal/
Disallow: /search/
Disallow: /*?sort=
Allow: /bitrix/*.css
Allow: /bitrix/*.js

Sitemap: https://example.com/sitemap.xml
```

**Framework’dagi sayt (Next.js va shunga o‘xshashlar):**

```text
User-agent: *
Disallow: /api/
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml
```

Shablonlar — boshlang‘ich nuqta. Chop etishdan oldin ularni o‘z saytingiz tuzilmasi bilan solishtiring.

## Faylni qanday tekshirish kerak

1. Brauzerda `/robots.txt`ni oching: fayl 200 kodi va oddiy matn qaytarishi kerak.
2. **Google Search Console** — robots.txt hisoboti Google qaysi versiyani ko‘rayotganini va xatolarni ko‘rsatadi.
3. **Yandex Webmaster** — «Asboblar» → «robots.txt tahlili»: aniq URL’larga ruxsat borligini tekshirish mumkin.
4. O‘zgarishlardan keyin bir nechta asosiy sahifani tekshiring — ular ochiq qolishi kerak.

Protokol tafsilotlari: [Google’ning robots.txt hujjatlari](https://developers.google.com/search/docs/crawling-indexing/robots/intro).

## Ko‘p uchraydigan xatolar

- Test serverdan ko‘chirilgandan keyin ishlayotgan saytda qolib ketgan `Disallow: /`.
- CSS va JS yopilgan — qidiruv tizimi sahifani to‘g‘ri chiza olmaydi.
- Sahifani qidiruvdan noindex o‘rniga robots.txt orqali olib tashlashga urinish.
- noindex tegi bor sahifalarni robots.txt’da yopish — robot tegni ko‘rmaydi.
- Yandex endi hisobga olmaydigan `Host` kabi eskirgan direktivalar.

## FAQ

### robots.txt maxfiy ma’lumotlarni himoya qiladimi?

Yo‘q. Fayl ochiq, insofli robotlar unga shunchaki amal qiladi. Maxfiy ma’lumotlarni robots.txt bilan emas, avtorizatsiya bilan himoya qiling.

### Crawl-delay kerakmi?

Google bu direktivani qo‘llab-quvvatlamaydi, Yandex ham endi unga tayanmaydi. Robotlar yuklamasini server sozlamalari va vebmaster panellari orqali boshqarish yaxshiroq.

### Bir nechta subdomen uchun bitta robots.txt bo‘lishi mumkinmi?

Yo‘q. Har bir subdomen va protokol o‘z ildizidagi faylni o‘qiydi, shuning uchun `shop.example.com` uchun alohida robots.txt kerak.
