---
title: Xavfsiz cookie: HttpOnly, Secure va SameSite bayroqlari
description: Sessiya cookie’sini qanday sozlash kerak: HttpOnly, Secure va SameSite nima qiladi, Lax, Strict va None farqi, __Host- prefiksi va kirishni buzadigan xatolar.
summary: Sessiya cookie’si HttpOnly, Secure, SameSite=Lax (yoki Strict) bo‘lishi, __Host- prefiksiga va serverda cheklangan muddatga ega bo‘lishi kerak. Bu bayroqlar XSS orqali o‘g‘irlash, HTTP orqali sizib chiqish va CSRF’ning katta qismini yopadi.
---

## Qisqa javob

Ko‘pchilik veb-ilovalarda sessiya cookie’si uchun quyidagi to‘plam mos keladi:

```http
Set-Cookie: __Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=86400
```

Har bir atribut o‘z tahdidini yopadi va ulardan birini olib tashlash aniq bir teshik ochadi.

## Har bir bayroq nima qiladi

| Bayroq | Nima qiladi | Nimadan himoya qiladi |
|---|---|---|
| `HttpOnly` | cookie JavaScript’dan (`document.cookie`) o‘qilmaydi | XSS orqali sessiyani o‘g‘irlash |
| `Secure` | cookie faqat HTTPS orqali yuboriladi | ochiq tarmoqda ushlab olish, tasodifan HTTP’ga o‘tish |
| `SameSite` | saytlararo so‘rovlarda yuborishni cheklaydi | CSRF, saytlararo sizib chiqishlarning bir qismi |
| `Domain` | cookie’ni subdomenlarga kengaytiradi | hech narsadan (aksincha, hujum yuzasini kengaytiradi) |
| `Path` | yo‘lni cheklaydi | xavfsizlik chegarasi emas |
| `Max-Age` / `Expires` | brauzerdagi amal qilish muddati | uzoq yashovchi o‘g‘irlangan sessiyalar |

**HttpOnly** XSS’ning o‘zidan qutqarmaydi: zararli skript baribir foydalanuvchi nomidan so‘rov yubora oladi. Lekin u cookie’ni olib ketib, boshqa qurilmadan ishlata olmaydi.

**Domain**ni umuman ko‘rsatmagan ma’qul. Usiz cookie host-only bo‘ladi va faqat uni o‘rnatgan aniq domenga yuboriladi.

## Lax, Strict va None

- **Strict** — cookie hech qanday saytlararo so‘rovda, hatto pochta yoki messenjerdagi havolani bosganda ham yuborilmaydi. Tashqi havola orqali kelgan foydalanuvchi birinchi sahifada tizimdan chiqqandek ko‘rinadi.
- **Lax** — cookie oddiy havola orqali o‘tishda (yuqori darajadagi `GET`) yuboriladi, lekin saytlararo `POST`, `fetch`, `iframe` va rasmlar bilan yuborilmaydi. Standart sifatida oqilona tanlov.
- **None** — cookie har doim yuboriladi. Begona `iframe` ichidagi vidjetlar va ayrim domenlararo ssenariylar uchun kerak. Albatta `Secure` bilan birga, aks holda brauzer uni rad etadi.

`SameSite` ko‘rsatilmasa, brauzerlar turlicha ishlaydi: ba’zilari standart bo‘yicha `Lax` qo‘llaydi, ba’zilari yo‘q. Qiymatni har doim aniq belgilang.

Keng tarqalgan murosa — ikkita cookie: xavfli amallar uchun `Strict` (parolni o‘zgartirish, to‘lovlar) va oddiy navigatsiya uchun `Lax`.

## Cookie prefikslari

Brauzer nomdagi prefikslarni tekshiradi va qoidalarga mos kelmagan cookie’ni qabul qilmaydi:

- **`__Secure-`** — cookie’da `Secure` bo‘lishi va u HTTPS sahifadan o‘rnatilishi shart.
- **`__Host-`** — xuddi shunday, qo‘shimcha ravishda `Path=/` va `Domain` **taqiqlangan**. Bunday cookie’ni subdomendan almashtirib bo‘lmaydi.

Sessiya uchun, agar subdomenlarda umumiy kirish kerak bo‘lmasa, `__Host-` eng yaxshi variant.

## Sessiyaning amal qilish muddati

- `Max-Age` va `Expires`siz cookie sessiyaviy hisoblanadi, lekin tablarni tiklaydigan brauzerlar uni kunlab saqlashi mumkin. «Brauzerni yopdim — chiqdim» degan taxminga tayanmang.
- Asosiy muddat **serverda** belgilanadi: idle-taymaut (harakatsizlikda sessiya tugaydi) va mutlaq taymaut (faol sessiya ham tugaydi).
- Kirishda va huquqlar oshganda **yangi sessiya identifikatorini bering** — bu session fixation’ni yopadi.
- Chiqishda sessiyani faqat brauzerdagi cookie’ni emas, serverda ham o‘chiring.
- Admin panellar va moliyaviy bo‘limlar uchun muddatlar oddiy kabinetdan qisqaroq bo‘lsin.

## Kirishni buzadigan yoki sessiyalarni oshkor qiladigan xatolar

- **Lokal HTTP muhitida `Secure`** nostandart host bilan — cookie saqlanmaydi, kirish «jimgina» ishlamaydi. Lokal muhitda HTTPS yoki `localhost`dan foydalaning.
- **`Secure`siz `SameSite=None`** — brauzer cookie’ni tashlab yuboradi.
- **OAuth yoki to‘lov redirektida `SameSite=Strict`**: provayder foydalanuvchini saytlararo so‘rov bilan qaytaradi va sessiya holati yo‘qoladi. Ayniqsa `POST` orqali qaytishlar tez-tez buziladi — ular `Lax`da ham cookie olmaydi.
- Sababsiz **`Domain=.example.com`** — cookie’ni barcha subdomenlar, jumladan test muhitlari va uchinchi tomon servislari ko‘radi.
- Sessiya tokenini `localStorage`da saqlash — u sahifadagi istalgan skriptga ochiq.
- Turli subdomen yoki yo‘llarda bir xil nomli cookie — brauzer bir nechta qiymat yuboradi va server noto‘g‘risini oladi.
- Parol o‘zgarganda bekor qilinmaydigan cheksiz «meni eslab qol» tokenlari.

Atributlar bo‘yicha ma’lumotnoma — [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

## FAQ

### JWT’ni cookie’da saqlash mumkinmi?

Ha, va bu ko‘pincha `localStorage`dan xavfsizroq: `HttpOnly` bilan skriptlar uni o‘qiy olmaydi. Lekin unda CSRF’dan himoya kerak — `SameSite` va token yoki `Origin` tekshiruvi.

### Nega foydalanuvchi messenjerdan o‘tgach tizimdan chiqqandek ko‘rinadi?

Ehtimol, sessiya cookie’si `SameSite=Strict` bilan o‘rnatilgan. Asosiy sessiya uchun `Lax`dan foydalaning, `Strict`ni esa faqat xavfli amallar uchun alohida cookie’ga qoldiring.

### Butun sayt HTTPS’da bo‘lsa, Secure nima uchun kerak?

Foydalanuvchi redirektdan oldin `http://` manzilni ochishi mumkin va `Secure`siz cookie ochiq matnda ketadi. Bu bayroq HSTS bilan birga bunday ssenariyni istisno qiladi.
