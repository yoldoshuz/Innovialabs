---
title: Cookies, localStorage yoki sessionStorage: ma’lumotni qayerda saqlash
description: Cookies, localStorage va sessionStorage’ni solishtiramiz: yashash muddati, limitlar, server kirishi, xavfsizlik bayroqlari va brauzerda nimani saqlab bo‘lmaydi.
summary: Cookies har bir so‘rov bilan serverga ketadi va HttpOnly hamda Secure bayroqlari bilan sessiyalar uchun mos; localStorage maxfiy bo‘lmagan sozlamalarni uzoq, sessionStorage esa tab yopilguncha saqlaydi.
---

## Qisqa javob

- **Cookies** — serverga kerak bo‘lgan ma’lumotlar uchun, eng avvalo sessiya identifikatori. `HttpOnly`, `Secure`, `SameSite` bayroqlari bilan himoyalanadi.
- **localStorage** — brauzer yopilgandan keyin ham saqlanishi kerak bo‘lgan maxfiy bo‘lmagan ma’lumotlar uchun: mavzu, til, forma qoralamasi.
- **sessionStorage** — bitta tabning vaqtinchalik holati uchun: master qadami, sessiya davomidagi filtrlar.

Maxfiy ma’lumotlar — parollar, to‘lov ma’lumotlari, uzoq muddatli tokenlar — localStorage va sessionStorage’da umuman saqlanmaydi.

## Solishtirish

| | Cookies | localStorage | sessionStorage |
|---|---|---|---|
| Yashash muddati | `Expires`/`Max-Age`gacha yoki brauzer sessiyasi oxirigacha | o‘chirilmaguncha | tab ochiq ekan |
| Hajm | bitta cookie uchun taxminan 4 KB | odatda origin uchun bir necha MB | odatda origin uchun bir necha MB |
| Serverga yuborilishi | har bir so‘rov bilan avtomatik | yo‘q | yo‘q |
| JS orqali kirish | ha, agar `HttpOnly` bo‘lmasa | ha | ha |
| Ko‘rinish sohasi | domen va yo‘l | origin | origin + aniq tab |
| API | `document.cookie`, `Set-Cookie` sarlavhasi | sinxron `getItem`/`setItem` | sinxron `getItem`/`setItem` |

Web Storage’ning aniq limitlari brauzerga bog‘liq, shuning uchun ularning chegarasiga tayanmang.

## Cookies: ma’lumot serverga kerak bo‘lganda

Cookie’ni server sarlavha orqali yoki skript `document.cookie` orqali o‘rnatadi. Brauzer uni mos domenga yuboriladigan so‘rovlarga o‘zi biriktiradi.

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

Bayroqlar ma’nosi:

- **HttpOnly** — cookie JavaScript’dan ko‘rinmaydi. Saytga zararli skript kiritilsa (XSS), u cookie’ni o‘qiy olmaydi.
- **Secure** — faqat HTTPS orqali yuboriladi.
- **SameSite** — boshqa saytlardan keladigan so‘rovlarda yuborilishni cheklaydi va **CSRF** xavfini kamaytiradi. `Lax` — oqilona standart qiymat, `Strict` — qat’iyroq, `None` esa `Secure` talab qiladi va uchinchi tomon ssenariylari uchun kerak.
- **Max-Age / Expires** — yashash muddati. Ularsiz cookie brauzer yopilguncha yashaydi.

Cookies’ning kamchiligi — har bir so‘rovni og‘irlashtiradi. Ularda katta ma’lumot saqlamang.

## localStorage: uzoq muddatli maxfiy bo‘lmagan ma’lumotlar

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme"); // "dark"
```

Faqat satrlarni saqlaydi, shuning uchun obyektlar `JSON.stringify` bilan seriyalanadi va `JSON.parse` bilan o‘qiladi. Ma’lumotlar bir origin’ning barcha tablari uchun umumiy, `storage` hodisasi esa tablarni sinxronlash imkonini beradi.

Hisobga oling:

- API **sinxron** — katta yozuvlar interfeysni sekinlashtirishi mumkin.
- Maxfiy rejimda yoki saqlash taqiqlanganda kirish xato chiqarishi mumkin, shuning uchun chaqiruvlarni `try/catch`ga o‘rang.
- Sahifadagi istalgan skript, jumladan uchinchi tomon skripti ham, localStorage’ni o‘qiy oladi.

## sessionStorage: bitta tab holati

API xuddi shunday, lekin ma’lumotlar faqat joriy tabda yashaydi. Qayta yuklash ularni o‘chirmaydi, tabni yopish — o‘chiradi. Bir saytning ikki tabi bir-birining sessionStorage’ini ko‘rmaydi.

Ko‘p qadamli formalar, vaqtinchalik filtrlar, ro‘yxatdagi joylashuv uchun mos.

## Klientda nimani saqlab bo‘lmaydi

- **Parollar** — hech qanday ko‘rinishda.
- **Bank kartasi ma’lumotlari** va boshqa to‘lov rekvizitlari.
- localStorage/sessionStorage’da **uzoq muddatli access va refresh tokenlar**: XSS bo‘lsa, ular o‘g‘irlanadi. Sessiyalar uchun `HttpOnly` cookie ishonchliroq.
- **Server huquqlariga ega API kalitlar** — brauzerga tushgan hamma narsani foydalanuvchi ko‘rishi mumkin.
- Interfeys ularsiz ishlay oladigan **shaxsiy ma’lumotlar**.
- **Huquq va rollar haqiqat manbai sifatida.** Klient ularni almashtirib qo‘yishi mumkin, tekshiruv har doim serverda bo‘ladi.

## Qanday tanlash kerak

1. Serverga har bir so‘rovda kerakmi? — **cookie**.
2. Maxfiymi? — faqat **HttpOnly cookie** yoki umuman faqat server.
3. Brauzer yopilgandan keyin ham saqlanishi kerakmi? — **localStorage**.
4. Faqat shu tabda kerakmi? — **sessionStorage**.
5. Ko‘p tuzilgan ma’lumot yoki fayllar? — **IndexedDB**.

## Ko‘p uchraydigan xatolar

- JWT’ni «tutorialda shunday edi» deb localStorage’da saqlash.
- Production’da `Secure` va `SameSite`siz cookie.
- localStorage’ni `try/catch`siz va standart qiymatsiz o‘qish.
- Har bir so‘rovni og‘irlashtiradigan katta obyektlarni cookies’da saqlash.

Bayroqlar haqida batafsil — [MDN hujjatlarida](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).

## FAQ

### JWT’ni localStorage’da saqlasa bo‘ladimi?

Texnik jihatdan mumkin, lekin XSS zaifligi bo‘lsa, token o‘g‘irlanadi. Sessiyalar uchun `Secure` va `SameSite`li HttpOnly cookie hamda CSRF’dan himoya xavfsizroq.

### Server localStorage’ni ko‘radimi?

Yo‘q. localStorage va sessionStorage faqat brauzerda mavjud. Server qiymatni olishi uchun uni so‘rovda aniq yuborish kerak.

### sessionStorage muddatsiz cookie’dan nimasi bilan farq qiladi?

Sessiya cookie’si brauzer yopilguncha yashaydi, barcha tablar uchun umumiy va serverga yuboriladi. sessionStorage bitta tabga bog‘langan va serverga yuborilmaydi.
