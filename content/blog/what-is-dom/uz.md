---
title: DOM nima va JavaScript sahifani qanday o‘zgartiradi
description: DOM haqida sodda: elementlar daraxti, tugunlarni topish va o‘zgartirish, hodisalar va delegatsiya, React va Vue nega DOM bilan bevosita ishlashni yashiradi.
summary: DOM — brauzer HTML’dan quradigan jonli obyektlar daraxti; JavaScript undagi tugunlarni topadi, o‘zgartiradi va hodisalarga javob beradi, brauzer esa sahifani darhol qayta chizadi.
---

## DOM nima

**DOM** (Document Object Model) — sahifaning obyektlar daraxti ko‘rinishidagi tasviri. Brauzer HTML’ni o‘qib, undan tuzilma quradi: hujjatda `<html>`, uning ichida `<head>` va `<body>`, body ichida esa sarlavhalar, paragraflar, tugmalar bor. Har bir element, matn va izoh — daraxtning **tuguni**.

Muhim jihat: DOM — bu HTML fayl emas. HTML — manba matn, DOM esa **xotiradagi jonli model**. JavaScript aynan modelni o‘zgartiradi va brauzer o‘zgarishlarni darhol ko‘rsatadi. “Kodni ko‘rish” asl HTML’ni, DevTools → Elements esa joriy DOM’ni ko‘rsatadi.

## Elementni qanday topish mumkin

```js
const title = document.querySelector("h1");          // birinchi h1
const buttons = document.querySelectorAll(".btn");  // barcha .btn
const form = document.getElementById("order-form");
```

- `querySelector` istalgan CSS selektorni qabul qiladi va birinchi topilgan elementni yoki `null` qaytaradi.
- `querySelectorAll` barcha mosliklarning statik ro‘yxatini qaytaradi.

## Sahifani qanday o‘zgartirish mumkin

```js
title.textContent = "Yangi sarlavha";
title.classList.add("is-active");
form.setAttribute("aria-busy", "true");

const item = document.createElement("li");
item.textContent = "Yangi band";
document.querySelector("ul").append(item);

item.remove();
```

Bir nechta qoida:

- Matn uchun `innerHTML` emas, **textContent** ishlating. Foydalanuvchi ma’lumotlarini `innerHTML` orqali qo‘yish XSS hujumlariga yo‘l ochadi.
- Uslublarni `element.style` orqali emas, **klasslar** orqali o‘zgartirgan ma’qul: bezak CSS’da qoladi.

## Hodisalar

Sahifa foydalanuvchi harakatlariga **hodisalar** orqali javob beradi: bosish, matn kiritish, formani yuborish, aylantirish.

```js
const button = document.querySelector("#buy");

button.addEventListener("click", (event) => {
  console.log("Bosildi", event.target);
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // sahifani qayta yuklamaslik
});
```

Hodisalar **yuqoriga ko‘tariladi** (bubbling): tugmani bosish avval tugmaning o‘zida, keyin ota elementda, so‘ng undan yuqorida — `document`gacha ishlaydi.

## Hodisalarni delegatsiya qilish

Bubbling har bir elementga yuzta ishlovchi o‘rniga konteynerga bitta ishlovchi osish imkonini beradi:

```js
document.querySelector("#list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  console.log("O‘chirish", button.dataset.id);
});
```

Delegatsiyaning afzalliklari:

- **Kamroq ishlovchilar** — kamroq xotira va kod.
- **Yangi elementlar uchun ham ishlaydi**: keyinroq qo‘shilgan bandlar avtomatik qayta ishlanadi.

## Frameworklar nega DOM’ni yashiradi

Kichik skriptda DOM bilan bevosita ishlash normal holat. Ammo katta interfeysda muammolar tez paydo bo‘ladi:

- holat ham ma’lumotlarda, ham DOM’da saqlanadi va ular **bir-biridan farqlanib qoladi**;
- har bir o‘zgarishda qaysi elementlarni yangilashni qo‘lda eslab qolish kerak;
- tez-tez o‘zgarishlar ortiqcha **layout** qayta hisoblashlari va qayta chizishlarni keltirib chiqaradi.

React, Vue, Svelte va boshqalar buni **deklarativ** hal qiladi: siz joriy ma’lumotlarda interfeys qanday ko‘rinishi kerakligini tasvirlaysiz, framework esa DOM’dagi minimal o‘zgarishlarni o‘zi hisoblaydi. React buning uchun virtual daraxtdan, boshqalari kompilyatsiya yoki reaktivlikdan foydalanadi, lekin g‘oya bitta: dasturchi tugunlarni emas, **ma’lumotlarni** o‘zgartiradi.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- Element paydo bo‘lishidan oldin uni qidirish. `<head>` ichidagi `defer`siz skript body qurilishidan oldin bajariladi.
- Sikl ichida element o‘lchamini o‘qib, darhol uslublarni o‘zgartirish — bu brauzerni layout’ni qayta-qayta hisoblashga majbur qiladi.
- Foydalanuvchi kiritgan matnni `innerHTML` orqali qo‘yish.
- React yoki Vue komponenti ichida DOM’ni qo‘lda o‘zgartirish: framework bu o‘zgarishlarni ustidan yozib yuboradi.

## FAQ

### DOM JavaScript’ning bir qismimi?

Yo‘q. DOM — brauzer taqdim etadigan standart interfeys. JavaScript u bilan ishlash uchun eng keng tarqalgan til, xolos. Masalan, Node.js’da standart holatda DOM yo‘q.

### React’da yozsam, DOM’ni o‘rganishim kerakmi?

Ha, hech bo‘lmaganda asoslarini. Hodisalar, bubbling, formalar, fokus va accessibility DOM qoidalari bo‘yicha ishlaydi, ref’lar va uchinchi tomon kutubxonalari bilan integratsiya esa elementlarga bevosita kirishni talab qiladi.

### Shadow DOM nima?

Bu element ichidagi izolyatsiya qilingan kichik daraxt bo‘lib, uning uslublari va belgilashi sahifaning qolgan qismi bilan aralashmaydi. Uni veb-komponentlar ishlatadi.
