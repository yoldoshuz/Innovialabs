---
title: HTML nima va veb-sahifa qanday tuzilgan
description: Yangi boshlovchilar uchun HTML: teglar, atributlar, head va body bilan hujjat tuzilishi, asosiy elementlar va brauzerda ochiladigan oddiy sahifa.
summary: HTML — sahifa tuzilishini teglar yordamida tasvirlaydigan belgilash tili: sarlavhalar, abzaslar, havolalar, rasmlar, formalar. Brauzer HTML ni o‘qib, ekranda ko‘rganingizga aylantiradi.
---
## Qisqacha: HTML — sahifaning karkasi

**HTML** (HyperText Markup Language) — dasturlash tili emas, belgilash (markup) tili. U hisoblamaydi va qaror qabul qilmaydi, balki sahifada **nima** borligini tasvirlaydi: sarlavha qayerda, abzas, havola, rasm yoki tugma qayerda.

Tashqi ko‘rinishni **CSS**, xatti-harakatni **JavaScript** belgilaydi, lekin har qanday veb-sahifaning asosi — HTML. Usiz brauzerda ko‘rsatadigan narsa bo‘lmaydi.

## Teglar va atributlar

HTML **elementlardan** iborat. Element odatda bir juft teg — ochuvchi va yopuvchi — va ular orasidagi mazmun bilan yoziladi:

```html
<p>Bu matn abzasi.</p>
```

Ba’zi elementlar **bo‘sh** bo‘lib, yopuvchi tegi bo‘lmaydi, masalan rasm yoki qatorni ko‘chirish:

```html
<img src="logo.png" alt="Kompaniya logotipi">
<br>
```

**Atributlar** elementni aniqlashtiradi va ochuvchi teg ichida `nom="qiymat"` ko‘rinishida yoziladi:

- `href` — havola manzili;
- `src` — rasm yoki video fayliga yo‘l;
- `alt` — ko‘zi ojiz foydalanuvchilar va qidiruv tizimlari uchun rasmning matnli tavsifi;
- `class` va `id` — uslublar va skriptlar uchun nomlar;
- `lang` — sahifa tili.

Elementlarni bir-birining ichiga joylash mumkin, lekin ularni teskari tartibda yopish kerak.

## Hujjat tuzilishi

Har qanday HTML sahifa bir xil skeletga ega:

```html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mening birinchi sahifam</title>
  </head>
  <body>
    <h1>Salom!</h1>
    <p>Bu mening birinchi veb-sahifam.</p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML hujjatlari</a>
  </body>
</html>
```

Bu yerda nima sodir bo‘lmoqda:

- `<!DOCTYPE html>` — brauzerga bu zamonaviy HTML ekanini bildiradi.
- `<html>` — ildiz element, qolgan hamma narsa uning ichida.
- `<head>` — sahifada ko‘rinmaydigan xizmat ma’lumotlari: kodirovka, tab sarlavhasi, qidiruv tizimlari uchun tavsif, uslublarni ulash.
- `<body>` — sahifaning barcha ko‘rinadigan mazmuni.

Bu kodni `index.html` fayliga saqlang va ikki marta bosib oching — brauzer ishlaydigan sahifani ko‘rsatadi.

## Asosiy elementlar

| Element | Nima uchun |
|---|---|
| `<h1>`–`<h6>` | Turli darajadagi sarlavhalar |
| `<p>` | Matn abzasi |
| `<a>` | Havola |
| `<img>` | Rasm |
| `<ul>`, `<ol>`, `<li>` | Belgili va raqamli ro‘yxatlar |
| `<strong>`, `<em>` | Muhim va ajratilgan matn |
| `<form>`, `<input>`, `<button>` | Formalar va tugmalar |
| `<table>`, `<tr>`, `<td>` | Ma’lumotlar jadvallari |
| `<div>`, `<span>` | Ma’nosiz universal konteynerlar |

## Semantika: ma’noli teglar

`<div>` dan tashqari HTML da blokning vazifasini tasvirlaydigan **semantik** elementlar bor:

- `<header>` — sayt yoki bo‘lim shapkasi;
- `<nav>` — navigatsiya;
- `<main>` — sahifaning asosiy mazmuni;
- `<article>` — mustaqil nashr;
- `<section>` — ma’noviy bo‘lim;
- `<footer>` — sahifa pastki qismi.

Semantika **qidiruv tizimlariga** sahifani tushunishga, **ekran o‘quvchilariga** esa uni ko‘rish qobiliyati cheklangan odamlarga to‘g‘ri o‘qib berishga yordam beradi. Bunday elementlar `<div>` bilan bir xil ko‘rinadi, lekin foydasi ko‘proq.

## Yangi boshlovchilarning keng tarqalgan xatolari

- **Katta shrift uchun bir nechta `<h1>`.** Sarlavha darajasi — bu tuzilma, o‘lcham esa CSS da beriladi.
- **Mazmunli rasmlarda bo‘sh yoki yo‘q `alt`.** Foydalanish qulayligi va SEO zarar ko‘radi.
- **Semantik teglar o‘rniga faqat `<div>`.**
- **`<div>` dan yasalgan tugmalar.** Harakatlar uchun `<button>` bor — u qo‘shimcha kodsiz klaviaturadan ishlaydi.
- **Yopilmagan teglar va noto‘g‘ri joylashtirish.** Brauzer xatoni tuzatishga harakat qiladi, lekin natija kutilmagan bo‘lishi mumkin.

## FAQ

### HTML dasturlash tilimi?

Yo‘q. Bu belgilash tili: unda o‘zgaruvchilar, shartlar va sikllar yo‘q. Mantiqni JavaScript qo‘shadi, HTML esa faqat tuzilma va mazmunni tasvirlaydi.

### HTML dan keyin nimani o‘rganish kerak?

Tashqi ko‘rinish va moslashuvchanlikni boshqarish uchun CSS, so‘ng interaktivlik qo‘shish uchun JavaScript. Ma’lumotnoma sifatida MDN Web Docs saytidan foydalanish qulay.

### Sayt konstruktor yoki CMS da qilingan bo‘lsa, HTML ni bilish kerakmi?

Chuqur bilish shart emas, lekin asosiy bilimlar foydali. Ular sarlavhalarni to‘g‘ri joylashtirish, rasmlarga alt yozish va sahifa nega kutilganidek ko‘rinmayotganini tushunishga yordam beradi.
