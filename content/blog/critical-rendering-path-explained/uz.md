---
title: Critical Rendering Path: brauzer sahifani qanday chizadi
description: Brauzer HTML va CSS’ni pikselga qanday aylantiradi: DOM, CSSOM, render tree, layout, paint, composite va bloklovchi resurslar bilan ishlash.
summary: Critical Rendering Path — HTML olingandan ekranda birinchi piksellar paydo bo‘lgunicha bo‘lgan qadamlar zanjiri; uning boshida bloklovchi CSS va JS qancha kam bo‘lsa, foydalanuvchi sahifani shuncha tez ko‘radi.
---

## Critical Rendering Path nima

**Critical Rendering Path (CRP)** — brauzer sahifaning birinchi kadrini ko‘rsatish uchun bosib o‘tadigan qadamlar ketma-ketligi:

1. HTML’ni tahlil qilib **DOM** quradi.
2. CSS’ni tahlil qilib **CSSOM** quradi.
3. Ularni **render tree**ga birlashtiradi.
4. Elementlar geometriyasini hisoblaydi — **layout**.
5. Piksellarni chizadi — **paint**.
6. Qatlamlarni yakuniy kadrga yig‘adi — **composite**.

CRP’ni optimallashtirish — birinchi chizishgacha bo‘lgan ish va kutishni qisqartirish demakdir. **FCP** va **LCP** metrikalari bevosita shunga bog‘liq.

## DOM va CSSOM

Brauzer HTML’ni oqim tarzida o‘qiydi: baytlar tokenlarga, tokenlar tugunlarga, tugunlar DOM daraxtiga aylanadi. Hujjat hali yuklanayotganda ham DOM’ni qismlab qurish mumkin.

CSS bilan boshqacha. **CSSOM**’dan qisman foydalanib bo‘lmaydi: fayl oxiridagi qoida boshidagisini bekor qilishi mumkin. Shu sababli CSS **chizishni bloklaydi** — brauzer shartsiz ulangan barcha uslublarni yuklab, tahlil qilmaguncha sahifani chizmaydi.

## Render tree, layout, paint va composite

- **Render tree** faqat hisoblangan uslublarga ega ko‘rinadigan tugunlarni o‘z ichiga oladi. `display: none` bo‘lgan elementlar, `<head>` va `<script>` unga kirmaydi.
- **Layout** (Firefox’da reflow) har bir blokning o‘lchami va joylashuvini viewport’ga nisbatan hisoblaydi.
- **Paint** piksellarni to‘ldiradi: matn, ranglar, soyalar, rasmlar.
- **Composite** qatlamlarni tartib va shaffoflikni hisobga olib ustma-ust qo‘yadi.

Muhim amaliy jihat: `width` yoki `top` o‘zgarsa, layout qaytadan ishga tushadi, `color` o‘zgarsa — faqat paint, `transform` va `opacity` esa ko‘pincha faqat composite bosqichida qayta ishlanadi. Shuning uchun animatsiyalarni `transform` va `opacity` asosida qurgan ma’qul.

## Chizishni nima bloklaydi

| Resurs | HTML tahlilini bloklaydi | Chizishni bloklaydi |
|---|---|---|
| `<link rel="stylesheet">` | yo‘q | ha |
| atributsiz `<script>` | ha | bilvosita |
| `<script defer>` | yo‘q | yo‘q |
| `<script async>` | faqat bajarilish vaqtida | yo‘q |
| `<script type="module">` | yo‘q (defer kabi) | yo‘q |

Oddiy `<script>` parserni to‘xtatadi: brauzer uni yuklab, bajaradi, agar undan oldin CSS bo‘lsa, CSSOM’ni ham kutadi, chunki skript uslublarni o‘qishi mumkin.

## Yo‘lni qanday qisqartirish mumkin

**1. Kritik resurslar kamroq bo‘lsin.** Birinchi ekranga kerak bo‘lmagan hamma narsani keyinroq yuklang.

**2. Skriptlar `defer` yoki `async` bilan.**

```html
<script src="/app.js" defer></script>
<script src="/analytics.js" async></script>
```

`defer` tartibni saqlaydi va HTML tahlilidan keyin bajariladi, `async` esa tayyor bo‘lishi bilan, tartibsiz bajariladi. Mustaqil analitika uchun `async`, ilova kodi uchun `defer` mos.

**3. Kritik CSS — inline.** Birinchi ekran uslublarini `<head>` ichidagi `<style>`ga joylashtirib, qolganini alohida yuklash mumkin.

**4. `media` orqali shartli uslublar.**

```html
<link rel="stylesheet" href="/print.css" media="print">
```

Bu fayl yuklanadi, lekin ekranda chizishni bloklamaydi.

**5. Muhim resurslarni erta topish.** Shrift yoki asosiy rasm uchun `<link rel="preload">`, tashqi domenlar uchun `<link rel="preconnect">`.

**6. Kamroq bayt.** Siqish (gzip, Brotli), minifikatsiya, ishlatilmaydigan CSS’ni olib tashlash.

**7. Ko‘rinmas matnsiz shriftlar.** `font-display: swap` asosiy shrift yuklanguncha zaxira shriftni ko‘rsatadi.

## Ko‘p uchraydigan xatolar

- `<head>`dagi `defer`siz skriptlar — sahifa kontentni ko‘rsatishdan oldin ularni kutadi.
- Butun sayt uchun bitta ulkan CSS-bandl, holbuki birinchi ekranga uning kichik qismi kerak.
- CSS ichida `@import`: fayllar parallel emas, zanjir bo‘lib yuklanadi.
- `top`/`left`/`width` orqali animatsiya — har kadrda layout chaqiriladi.
- Siklda uslubni o‘zgartirgandan so‘ng darhol `offsetHeight`ni o‘qish — **forced synchronous layout** (layout thrashing).
- Asosiy rasmga `loading="lazy"` qo‘yish — LCP elementini kechiktirib bo‘lmaydi.

## Qanday o‘lchash mumkin

Chrome DevTools’dagi **Performance** panelida DOM va CSSOM qachon tayyor bo‘lgani, layout va paint qancha davom etgani va qaysi resurslar birinchi kadrni bloklagani ko‘rinadi. **Lighthouse** render-blocking resurslarni alohida ko‘rsatadi. Bosqichlar [web.dev](https://web.dev/articles/critical-rendering-path) hujjatlarida batafsil yoritilgan.

## FAQ

### Nega CSS chizishni bloklaydi, HTML esa yo‘q?

DOM’ni qisman ko‘rsatish mumkin, CSSOM’ni esa yo‘q: keyingi har qanday qoida allaqachon tahlil qilingan elementlar ko‘rinishini o‘zgartirishi mumkin. To‘liq CSSOM bo‘lmasa, brauzer sahifani noto‘g‘ri chizib qo‘yishi mumkin.

### defer yoki async — qaysi birini tanlash kerak?

DOM’ga yoki bir-biriga bog‘liq skriptlar uchun `defer` — tartib saqlanadi. Bajarilish tartibi muhim bo‘lmagan mustaqil skriptlar, masalan, hisoblagichlar uchun `async`.

### Kritik CSS’ni har doim inline qilish kerakmi?

Har doim emas. CSS kichik va yaxshi keshlansa, foyda minimal bo‘ladi. Uslublar fayli katta bo‘lib, birinchi ekran uning faqat bir qismidan foydalansa, inline qilish o‘zini oqlaydi.
