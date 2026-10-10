---
title: Semantik HTML: qaysi teglardan foydalanish va nima uchun
description: Sahifada qaysi semantik HTML teglari kerak, nega button div’dan yaxshi va semantika accessibility, kodni qo‘llab-quvvatlash va tahlilga qanday ta’sir qiladi.
summary: Semantik HTML — teglarni ko‘rinishiga qarab emas, kontent ma’nosiga qarab tanlash (header, nav, main, article, button); shunda sahifani screen reader, qidiruv tizimlari va dasturchilar tushunadi.
---

## Semantik HTML nima

**Semantik HTML** — bu teg kontent qanday ko‘rinishini emas, balki *nima ekanini* bildirishi. Sahifa shapkasi — `<header>`, menyu — `<nav>`, tugma — `<button>`. Ko‘rinish uchun CSS javob beradi, ma’no uchun esa HTML.

Agar hammasi `<div>` va `<span>` bilan qilingan bo‘lsa, brauzer sahifani nomsiz qutilar to‘plami sifatida ko‘radi. Yaxshi ko‘radigan odam buni sezmasligi mumkin, lekin screen reader, qidiruv roboti va keyingi dasturchi albatta sezadi.

## Asosiy teglar va ularni qachon ishlatish

| Teg | Vazifasi |
|---|---|
| `<header>` | Sahifa yoki bo‘limning kirish qismi: logotip, sarlavha, navigatsiya |
| `<nav>` | Sayt yoki bo‘lim bo‘yicha asosiy navigatsiya |
| `<main>` | Sahifaning noyob kontenti, sahifada bitta |
| `<article>` | Mustaqil material: maqola, post, mahsulot kartochkasi |
| `<section>` | O‘z sarlavhasiga ega tematik bo‘lim |
| `<aside>` | Qo‘shimcha kontent: yon ustun, bog‘liq havolalar |
| `<footer>` | Sahifa yoki bo‘limning pastki qismi: kontaktlar, mualliflik huquqi |
| `<button>` | Sahifadagi harakat: yuborish, ochish, almashtirish |
| `<a>` | Manzilga o‘tish |

Oddiy qoida: **havola qayergadir olib boradi, tugma nimadir qiladi**.

## Oldin va keyin

“Div”lardagi vyorstka:

```html
<div class="header">
  <div class="logo">Shop</div>
  <div class="menu">
    <div onclick="go('/catalog')">Katalog</div>
  </div>
</div>
<div class="content">
  <div class="post">
    <div class="title">Kuzgi yangiliklar</div>
    <div class="btn" onclick="like()">Yoqdi</div>
  </div>
</div>
```

Xuddi shu sahifa semantik ko‘rinishda:

```html
<header>
  <a href="/">Shop</a>
  <nav>
    <a href="/catalog">Katalog</a>
  </nav>
</header>
<main>
  <article>
    <h2>Kuzgi yangiliklar</h2>
    <button type="button" onclick="like()">Yoqdi</button>
  </article>
</main>
```

Kod hajmi deyarli bir xil, ma’no esa ancha ko‘p.

## Nega `button` `div`’dan yaxshi

`<div onclick>` tugmaga o‘xshaydi, lekin tugma emas. U haqiqiy tugmadek ishlashi uchun qo‘lda quyidagilarni qo‘shishga to‘g‘ri keladi:

- Tab tugmasi bilan unga yetib borish uchun `tabindex="0"`;
- Enter va probelni qayta ishlash;
- screen reader uni tugma deb e’lon qilishi uchun `role="button"`;
- fokus uslublari va `disabled` holati.

`<button>` bularning barchasini **tekinga** beradi. `<a href>` bilan ham shunday: haqiqiy havola yangi tabda ochiladi, nusxalanadi va indekslanadi, JavaScript orqali o‘tadigan `div` esa yo‘q.

## Semantika amalda nima beradi

- **Accessibility.** Screen reader’lar teglar asosida sahifa xaritasini tuzadi: foydalanuvchi to‘g‘ridan-to‘g‘ri `main` yoki navigatsiyaga o‘tishi, sarlavhalarni ko‘zdan kechirishi mumkin.
- **Kodni qo‘llab-quvvatlash.** `<nav>` va `<article>` `div.wrapper-2`’dan tezroq o‘qiladi. Yangi dasturchi tezroq tushunib oladi.
- **Sahifani tahlil qilish.** Qidiruv tizimlari, brauzerdagi o‘qish rejimi va boshqa parser’lar asosiy kontentni topish uchun tuzilmaga tayanadi.
- **Kamroq JavaScript.** Nativ elementlar fokus, klaviatura va forma yuborishni allaqachon biladi.

## Ko‘p uchraydigan xatolar

- Bitta sahifada **bir nechta `<main>`**. Ko‘rinadigan `main` bitta bo‘lishi kerak.
- **O‘ram sifatida `<section>`.** Agar blokning o‘z sarlavhasi bo‘lmasa va u faqat uslub uchun kerak bo‘lsa, `<div>` ishlating.
- **O‘lcham uchun tanlangan sarlavhalar.** `<h3>` kichikroq bo‘lgani uchun emas, ichma-ichlik darajasiga qarab tanlanadi. O‘lcham CSS’da beriladi.
- **Havola ichidagi tugma** yoki `href`siz havola. Bu klaviatura navigatsiyasini buzadi.
- **Formadagi tugmada `type` yo‘qligi.** Standart holatda `<form>` ichidagi `<button>` formani yuboradi.

## Vyorstkani qanday tekshirish

1. CSS’ni o‘chirib, sahifa tuzilmasi tushunarli ekanini ko‘ring.
2. Sahifani faqat klaviatura bilan aylanib chiqing: Tab, Enter, probel.
3. Brauzer DevTools’idagi accessibility panelini ochib, elementlar rollarini tekshiring.
4. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)dagi elementlar ma’lumotnomasiga qarang.

## FAQ

### Div’dan umuman voz kechish kerakmi?

Yo‘q. `<div>` bezash uchun guruhlashda oddiy va to‘g‘ri teg. Muhimi — uni o‘z ma’nosiga ega elementlar o‘rniga ishlatmaslik: tugmalar, havolalar, navigatsiya, sarlavhalar.

### Semantika SEO’ga ta’sir qiladimi?

Semantika qidiruv tizimlariga asosiy kontent qayerdaligini va sarlavhalar tuzilmasini tushunishga yordam beradi. Bu pozitsiyalar o‘sishini kafolatlamaydi, lekin sahifani tahlil qilishdagi ortiqcha to‘siqlarni olib tashlaydi.

### Article section’dan nimasi bilan farq qiladi?

`<article>` sahifadan kesib olinsa ham o‘z-o‘zidan ma’noga ega: maqola, sharh, kartochka. `<section>` esa kattaroq butunning tematik qismi va odatda sarlavhaga ega.
