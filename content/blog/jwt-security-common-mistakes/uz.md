---
title: JWT xavfsizligi: odatiy xatolar va ulardan qanday qochish
description: JWT’dagi odatiy xatolar: alg none, algoritmni almashtirish, zaif sirlar, localStorage’dagi tokenlar, muddat va bekor qilish yo‘qligi, refresh rotatsiyasi.
summary: JWT faqat server algoritmni qat’iy belgilasa, kuchli kalit ishlatsa, muddat, emitent va auditoriyani tekshirsa, qisqa muddatli access tokenlarni aylantiriladigan refresh tokenlar bilan bersa va ularni JavaScript yeta olmaydigan joyda saqlasa xavfsiz.
---
## Qisqa javob

**JSON Web Token** — imzolangan JSON bo‘lagi: `header.payload.signature`. Imzo tokenni siz chiqarganingiz va u o‘zgartirilmaganini isbotlaydi. Faqat shuni. Payload faqat Base64URL’da kodlangan, **shifrlanmagan**, haqiqiy imzo esa foydalanuvchi tizimdan chiqqanmi yoki bloklanganmi, bu haqda hech narsa demaydi.

JWT zaifliklarining aksariyati token sarlavhasiga ishonish, zaif kalitlar va hayot siklini boshqarmaslikdan kelib chiqadi. Odatiy xatolar va ularni tuzatish yo‘llarini ko‘rib chiqamiz.

## 1-xato: «alg: none» va algoritmni almashtirish

Token sarlavhasida `alg` — imzo algoritmi bor. Agar server algoritmni **tokenning o‘zidan** olsa, uni hujumchi boshqaradi:

- **alg none** — hujumchi imzoni olib tashlaydi va `"alg": "none"` qo‘yadi. Ehtiyotsiz kutubxona imzolanmagan tokenni qabul qiladi.
- **Algorithm confusion** — server RS256 kutadi (yopiq kalit imzolaydi, ochiq kalit tekshiradi). Hujumchi algoritmni HS256 ga o‘zgartiradi va tokenni sizning **ochiq kalitingiz** bilan HMAC siri sifatida imzolaydi. Agar kutubxona ikkala holat uchun bitta kalitdan foydalansa, soxta token o‘tib ketadi.

**Yechim**: serverda ruxsat etilgan algoritmlarni qat’iy belgilang va emitent hamda auditoriyani tekshiring.

```ts
import { jwtVerify } from "jose";

const { payload } = await jwtVerify(token, publicKey, {
  algorithms: ["RS256"],
  issuer: "https://auth.example.com",
  audience: "api",
});
```

Qo‘llab-quvvatlanadigan kutubxonadan foydalaning va faqat dekodlangan, lekin tekshirilmagan token asosida hech qachon kirish haqida qaror qabul qilmang.

## 2-xato: zaif sirlar

HS256 da kamida bitta tokenga ega bo‘lgan har kim serveringizga tegmasdan sirni **oflayn** terib ko‘rishi mumkin. `secret`, `changeme` yoki loyiha nomi tez topiladi.

- Uzun tasodifiy kalitdan foydalaning, masalan `openssl rand -base64 32` bilan yaratilgan 256 bit.
- Uni repozitoriyda emas, sirlar menejeri yoki muhit o‘zgaruvchilarida saqlang.
- Turli muhitlar uchun — turli kalitlar.
- Agar tokenlarni bir nechta servis tekshirsa, asimmetrik algoritmlarni tanlang (RS256, ES256, EdDSA): yopiq kalit faqat avtorizatsiya servisida bo‘ladi.
- `kid` sarlavhasi va JWKS endpoint orqali **kalitlar rotatsiyasini** o‘ylab qo‘ying.

## 3-xato: payload’dagi maxfiy ma’lumotlar

Payload’ni istalgan odam dekodlay oladi. U yerga parollar, pasport ma’lumotlari, to‘liq manzillar va ichki sirlarni qo‘ymang. Faqat API’ga keraklisini qoldiring: foydalanuvchi ID’si, rollar, amal qilish muddati. Ma’lumotni yashirish kerak bo‘lsa, shifrlangan tokenlar (JWE) dan foydalaning yoki ma’lumotni serverda saqlang.

## 4-xato: tokenlarni localStorage’da saqlash

`localStorage`dagi hamma narsani sahifadagi istalgan JavaScript o‘qiy oladi. Bitta **XSS** zaifligi yoki buzilgan uchinchi tomon skripti — va tokenlar o‘g‘irlanib, boshqa qurilmadan ishlatiladi.

Xavfsizroq variantlar:

- Tokenlarni **HttpOnly, Secure, SameSite** bayroqlari bor cookie’da saqlash — JavaScript ularni o‘qiy olmaydi. Keyin ma’lumotni o‘zgartiruvchi so‘rovlar uchun CSRF himoyasini qo‘shing.
- Access tokenni faqat xotirada saqlash va sahifa yuklanganda refresh orqali qayta olish.
- SPA uchun **Backend-for-Frontend** andozasini ko‘rib chiqish: brauzerda sessiya cookie’si, tokenlar esa BFF’da.

Hech bir variant XSS’ni davolamaydi — sahifangizdagi skript baribir foydalanuvchi nomidan so‘rov yubora oladi. Lekin uzoq muddatli tokenlarni oddiy o‘g‘irlashni to‘xtatadi.

## 5-xato: muddat va bekor qilish yo‘q

`exp` siz token abadiy amal qiladi. Uzoq muddatli tokenni chiqish, parol o‘zgarishi yoki akkaunt bloklanganidan keyin bekor qilib bo‘lmaydi.

- Doim `exp` ni belgilang va `exp`, `nbf`, `iss` va `aud` ni tekshiring.
- **Access tokenlarni qisqa muddatli** qiling — kunlar emas, daqiqalar.
- Darhol bekor qilish uchun `jti` bo‘yicha denylist, bazada foydalanuvchi tokenlari versiyasi yoki muhim amallarni server holati bilan solishtirishdan foydalaning.

## 6-xato: rotatsiyasiz refresh tokenlar

Refresh token uzoq yashaydi, shuning uchun u eng qimmatli nishon.

- **Har bir foydalanishda rotatsiya**: har bir yangilash yangi refresh token beradi va eskisini bekor qiladi.
- **Qayta foydalanishni aniqlash**: agar allaqachon ishlatilgan refresh token kelsa, demak kimdadir nusxasi bor — butun tokenlar oilasini bekor qiling va qayta kirishni talab qiling.
- Foydalanuvchi seanslarni ko‘rishi va yakunlashi uchun refresh tokenlarni serverda xesh ko‘rinishida, qurilma yoki sessiyaga bog‘lab saqlang.
- Refresh tokenni barcha API’larga emas, faqat avtorizatsiya endpointiga yuboring.

## Qachon sessiyalar yaxshiroq

JWT bir nechta mustaqil servis umumiy bazasiz shaxsni tekshirishi kerak bo‘lganda yaxshi. Ko‘p mahsulotlar uchun klassik **server sessiyalari** soddaroq va xavfsizroq:

- Bitta domendagi bitta veb-ilova.
- Darhol chiqish va «barcha seanslarni yakunlash» tugmasi kerak.
- Admin panellar va ichki vositalar.

Serverda saqlanadigan, HttpOnly cookie’dagi tasodifiy sessiya ID’si yuqoridagi xatolarning aksariyatini tuzilishi bo‘yicha istisno qiladi.

## FAQ

### JWT shifrlanganmi?

Oddiy imzolangan JWT (JWS) — yo‘q. Uning payload’ini istalgan odam o‘qiy oladi. Shifrlash uchun JWE kerak, u ancha kam qo‘llaniladi va tizimni murakkablashtiradi.

### Access token qancha yashashi kerak?

Bu huquqlar o‘zgarishi va chiqish qanchalik tez kuchga kirishi kerakligi hamda mijozlar tokenni qanchalik tez-tez yangilay olishiga bog‘liq. Keng tarqalgan amaliyot — daqiqalar, uzoq seanslarni esa refresh tokenlar ta’minlaydi.

### JWT bilan foydalanuvchini tizimdan chiqarish mumkinmi?

Tokenni mijozda o‘chirish yetarli emas — nusxasi muddati tugaguncha amal qiladi. Haqiqiy chiqish refresh tokenni serverda bekor qilishni va kerak bo‘lsa, access tokenlar uchun denylist yoki versiya tekshiruvini talab qiladi.
