---
title: Parollarni qanday to‘g‘ri saqlash kerak: bcrypt, scrypt va Argon2
description: Nega MD5 va SHA-256 parollar uchun yaramaydi, salt va work factor nima beradi, Argon2 va bcrypt parametrlarini tanlash va eski xeshlarni ko‘chirish.
summary: Parollar faqat salt qo‘shilgan sekin xesh ko‘rinishida saqlanadi — Argon2id, scrypt yoki bcrypt, MD5 yoki SHA emas. Eski xeshlar yangi algoritmga asta-sekin, foydalanuvchi tizimga kirganda o‘tkaziladi.
---

## Qisqa javob

Parol hech qachon ochiq holda saqlanmaydi va shifrlanmaydi ham. U **parollar uchun maxsus xesh funksiyasidan** — **Argon2id**, **scrypt** yoki **bcrypt** orqali o‘tkaziladi va natija saqlanadi. Kirishda parol qayta xeshlanadi va solishtiriladi.

Yangi loyiha uchun **Argon2id** ni tanlang. Agar stekingizda u yaxshi qo‘llab-quvvatlanmasa, scrypt yoki bcrypt ham mos keladi. MD5, SHA-1 va hatto oddiy SHA-256 parollar uchun yaramaydi.

## Nega MD5 va SHA ishlamaydi

MD5 va SHA ma’lumotlar yaxlitligini tekshirish uchun yaratilgan, ularning asosiy xususiyati — **tezlik**. Parollar uchun bu kamchilik: baza sizib chiqsa, hujumchi videokartalarda variantlarni juda katta tezlikda tekshiradi.

Oddiy xesh bilan nima noto‘g‘ri ketadi:

- **Bir xil parollar bir xil xesh beradi.** Kimda parol bir xilligi ko‘rinadi, bitta topilgan parol hammasini ochadi.
- **Rainbow jadvallar.** Ommabop parollarning xeshlari oldindan hisoblab qo‘yilgan, topish jadvaldan qidirishga aylanadi.
- **Tez tanlash.** Lug‘atlar va o‘zgartirish qoidalari («Password1!», «qwerty2024») bir necha daqiqada tekshiriladi.

Ikki marta xeshlash (`md5(sha1(p))`) yoki koddagi «maxfiy» salt muammoni hal qilmaydi — tezlik o‘zgarmaydi.

## Salt va work factor nima qiladi

**Salt** — har bir parol uchun noyob tasodifiy qator. U xesh yonida saqlanadi va sir hisoblanmaydi. Salt bir xil parollarning xeshlarini har xil qiladi va rainbow jadvallarni foydasiz qiladi.

**Work factor** (narx) — xeshni hisoblashni ataylab sekinlashtiruvchi parametr. Foydalanuvchi farqni sezmaydi, hujumchi uchun esa har bir urinish qimmatga tushadi.

Zamonaviy kutubxonalar saltni o‘zi yaratadi va parametrlar bilan birga xesh qatoriga yozadi, masalan `$argon2id$v=19$m=19456,t=2,p=1$...`. Salt uchun alohida ustun kerak emas.

## Algoritmlarni solishtirish

| Algoritm | Nima sozlanadi | Xususiyatlari |
|---|---|---|
| **Argon2id** | xotira, iteratsiyalar, parallellik | Xotira sarfi hisobiga GPU’da tanlashga chidamli. Standart tanlov |
| **scrypt** | N (xotira va vaqt), r, p | U ham ko‘p xotira talab qiladi, keng qo‘llab-quvvatlanadi |
| **bcrypt** | cost (raundlar sonining logarifmi) | Vaqt sinovidan o‘tgan, deyarli hamma joyda bor. Parolning faqat dastlabki 72 baytini hisobga oladi |
| PBKDF2 | iteratsiyalar soni | FIPS talablariga moslik kerak bo‘lsa. Faqat CPU’ni yuklaydi |

## Parametrlarni qanday tanlash

1. **OWASP Password Storage Cheat Sheet** tavsiyalaridan boshlang — u yerda har bir algoritm uchun dolzarb minimal qiymatlar berilgan.
2. Xeshlash vaqtini o‘zingizning production serveringizda o‘lchang. Mo‘ljal — bitta amal uchun soniyaning bir qismi: kirish tez bo‘lsin, server esa eng yuqori yuklamaga bardosh bersin.
3. Xotirani hisobga oling: katta xotira parametrli Argon2 bir vaqtda ko‘p kirishlar bo‘lganda RAM’ni tugatishi mumkin.
4. Server almashganda parametrlarni qayta ko‘rib chiqing va vaqt o‘tishi bilan oshirib boring.

`argon2-cffi` kutubxonasi bilan Python misoli:

```python
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()  # xavfsiz standart parametrlar

stored = ph.hash("user-password")

try:
    ph.verify(stored, "user-password")
    if ph.check_needs_rehash(stored):
        stored = ph.hash("user-password")  # parametrlar eskirgan, qayta saqlaymiz
except VerifyMismatchError:
    pass  # parol noto‘g‘ri
```

Node.js’da bcrypt bilan: `await bcrypt.hash(password, 12)` va `await bcrypt.compare(password, hash)`. PHP’da — `password_hash()`, `password_verify()` va `password_needs_rehash()`.

## Eski xeshlarni kirishda ko‘chirish

Foydalanuvchilarning parollarini siz bilmaysiz, shuning uchun butun bazani birdaniga qayta hisoblab bo‘lmaydi. Ishlaydigan sxema:

1. Xesh algoritmi uchun maydon qo‘shing (yoki uni qator prefiksidan aniqlang).
2. Kirishda parolni eski usulda tekshiring.
3. Parol to‘g‘ri bo‘lsa — darhol Argon2id xeshini hisoblang va yozuvni almashtiring.
4. Uzoq vaqt kirmaydigan foydalanuvchilarni darhol himoyalash mumkin: eski xeshni yangisiga o‘rang (`argon2(md5(password))`), keyingi kirishda esa sof Argon2id bilan almashtiring.
5. Ma’lum muddatdan keyin qolgan eski xeshlarni o‘chiring va bunday foydalanuvchilardan parolni tiklashni so‘rang.

## Ko‘p uchraydigan xatolar

- Xeshlarni kutubxona funksiyasi o‘rniga oddiy `==` bilan solishtirish (vaqt bo‘yicha hujum ehtimoli).
- «Sekin ishlayapti» deb cost’ni juda past qo‘yish — yaxshisi kirish urinishlari chastotasini cheklang.
- Parollarni so‘rovlar va xatolar logiga yozish.
- Parolni qisqartirish yoki uzun parollar va maxsus belgilarni taqiqlash.
- Rate limiting va 2FA yo‘qligi — eng yaxshi xesh ham kirish formasi orqali tanlashdan qutqarmaydi.

## FAQ

### Parollarni shunchaki AES bilan shifrlasa bo‘ladimi?

Yo‘q. Shifrlash qaytariladigan jarayon: kalit baza bilan birga o‘g‘irlansa, barcha parollar ochiladi. Xesh qaytarilmaydi va parolni tekshirish uchun asl qiymat kerak emas.

### «Pepper» kerakmi?

Bu bazadan tashqarida, masalan sirlar menejerida saqlanadigan qo‘shimcha sir. Agar faqat baza sizib chiqsa, u foydali, lekin rotatsiyani murakkablashtiradi. Bu Argon2 yoki bcrypt’ga qo‘shimcha, ularning o‘rnini bosmaydi.

### bcrypt’ning 72 bayt cheklovi bilan nima qilish kerak?

Ko‘pchilik parollar uchun bu yetarli. Agar juda uzun parollarga ruxsat bersangiz, Argon2id ni tanlang — unda bunday cheklov yo‘q.
