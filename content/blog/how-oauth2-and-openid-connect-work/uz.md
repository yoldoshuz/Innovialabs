---
title: OAuth 2.0 va OpenID Connect qanday ishlaydi
description: OAuth 2.0 va OpenID Connect oddiy tilda: rollar, PKCE bilan authorization code flow, access va ID tokenlar, scope’lar va Google orqali kirish.
summary: OAuth 2.0 ilovaga parolni bermasdan API’ga cheklangan ruxsat beradi, OpenID Connect esa uning ustiga ID token qo‘shadi va ilovaga aynan kim kirganini aytadi.
---
## Qisqa javob

**OAuth 2.0** — **avtorizatsiya** protokoli. U «ilovaga foydalanuvchi nomidan nima qilishga ruxsat berilgan» degan savolga javob beradi. Foydalanuvchi ilovaga parolini bermaydi, ilova esa cheklangan huquqli **access token** oladi.

**OpenID Connect (OIDC)** — OAuth 2.0 ustidagi **autentifikatsiya** qatlami. U «bu foydalanuvchi kim» degan savolga javob beradi. Buning uchun OIDC **ID token** qo‘shadi — kirish haqidagi imzolangan hujjat.

«Google orqali kirish» tugmasi deyarli har doim OIDC hisoblanadi.

## To‘rtta rol

- **Resource owner** — ma’lumotlar egasi bo‘lgan foydalanuvchi.
- **Client** — sizning ilovangiz: sayt, mobil ilova yoki bot.
- **Authorization server** — foydalanuvchini tekshirib, token beradigan server (masalan, Google).
- **Resource server** — murojaat qilinadigan API (masalan, Google Calendar API).

Ba’zan ikkala server bitta kompaniyaga tegishli bo‘ladi, lekin mantiqan ular alohida rollar.

## PKCE bilan authorization code flow

Bu saytlar, SPA va mobil ilovalar uchun asosiy tavsiya etilgan ssenariy. **PKCE** (Proof Key for Code Exchange) avtorizatsiya kodi tutib olinishidan himoya qiladi.

1. Ilova tasodifiy **code_verifier** satrini yaratadi va undan **code_challenge** hisoblaydi: SHA-256, base64url ko‘rinishida.
2. Foydalanuvchi authorization server’ga `client_id`, `redirect_uri`, `scope`, `state` va `code_challenge` parametrlari bilan yo‘naltiriladi.
3. Foydalanuvchi tizimga kiradi va ruxsat berishga rozilik bildiradi.
4. Server foydalanuvchini bir martalik **kod** va o‘sha `state` bilan `redirect_uri` manziliga qaytaradi.
5. Ilova kodni `code_verifier` bilan birga token endpoint’ga yuboradi.
6. Server verifier challenge’ga mos kelishini tekshiradi va tokenlarni beradi.

```http
GET /authorize?response_type=code
  &client_id=my-app
  &redirect_uri=https://app.example.com/callback
  &scope=openid%20email%20profile
  &state=af0ifjsldkj
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
```

Hujumchi 4-qadamda kodni tutib olsa ham, `code_verifier` bo‘lmasa uni tokenga almashtira olmaydi. **state** parametri soxta javobdan (CSRF) himoya qiladi: ilova uni yo‘naltirishdan oldin saqlagan qiymat bilan solishtiradi.

Token to‘g‘ridan-to‘g‘ri manzil satrida keladigan eski **implicit flow** endi tavsiya etilmaydi — PKCE bilan code flow’dan foydalaning.

## Access token va ID token

| | Access token | ID token |
|---|---|---|
| Kim uchun | API (resource server) uchun | Sizning ilovangiz uchun |
| Nima uchun | Resurslarga kirish | Kim kirganini bilish |
| Format | Istalgan, shaffof bo‘lmagan satr ham bo‘lishi mumkin | Har doim JWT |
| Nimani tekshirish kerak | API tekshiradi | Imzo, `iss`, `aud`, `exp`, `nonce` |

Asosiy qoida: **access token’ni kirish dalili sifatida ishlatmang**, ID token’ni esa API uchun ruxsatnoma sifatida yubormang. Bular turli qabul qiluvchilar uchun turli hujjatlar.

Yana **refresh token** ham bor — qayta kirmasdan yangi access token olish uchun uzoq yashaydigan token. Uni faqat serverda yoki qurilmaning himoyalangan xotirasida saqlang.

## Scope’lar

**Scope** — so‘ralgan huquq. OIDC’da `openid` scope’i majburiy, odatda unga `email` va `profile` qo‘shiladi. API’ga kirish uchun alohida scope’lar so‘raladi, masalan, kalendarni o‘qish uchun.

**Minimal** huquq so‘rang: ro‘yxat qanchalik keng bo‘lsa, rozilik ekranida shuncha ko‘p foydalanuvchi voz kechadi va token sizib chiqsa, zarar shuncha katta bo‘ladi.

## Misol: Google orqali kirish

1. Ilovani Google konsolida ro‘yxatdan o‘tkazasiz, `client_id` olasiz va ruxsat etilgan `redirect_uri` manzillarini ko‘rsatasiz.
2. «Google orqali kirish» tugmasi foydalanuvchini `openid email profile` scope’i bilan Google sahifasiga yuboradi.
3. Kirishdan so‘ng Google kod qaytaradi, serveringiz uni ID token va access token’ga almashtiradi.
4. ID token’ni tekshirasiz va undan `sub` — foydalanuvchining Google’dagi doimiy identifikatori — hamda email’ni olasiz.
5. `sub` bo‘yicha bazangizdan foydalanuvchini topasiz yoki yaratasiz va oddiy sessiyani ochasiz.

Agar ilovaga kalendar ham kerak bo‘lsa, tegishli scope qo‘shiladi — bu endi oddiy kirish emas, OAuth orqali avtorizatsiya.

## Ko‘p uchraydigan xatolar

- Foydalanuvchini `sub` o‘rniga email bo‘yicha aniqlash: email o‘zgarishi mumkin.
- ID token imzosi va `aud` maydonini tekshirmaslik.
- `client_secret`ni mobil ilova yoki frontend ichida saqlash.
- Istalgan yoki wildcard `redirect_uri` manzillariga ruxsat berish.
- Sinovdan o‘tgan kutubxona o‘rniga protokolni noldan yozish.

## FAQ

### OAuth va OpenID Connect o‘rtasidagi farq nima?

OAuth 2.0 resurslarga kirish masalasini hal qiladi, lekin foydalanuvchi kimligini aytmaydi. OpenID Connect standart ID token va foydalanuvchi ma’lumotlari endpoint’ini qo‘shadi, shuning uchun tizimga kirish uchun mos keladi.

### Ilovada server bo‘lsa ham PKCE kerakmi?

Ha, uni barcha client’larda, jumladan server tomonidagilarda ham ishlatish tavsiya etiladi. U `client_secret` o‘rnini bosmaydi, balki kodni almashtirishni qo‘shimcha himoyalaydi.

### Brauzerda tokenlarni qayerda saqlash kerak?

Eng ishonchli yo‘l — tokenlarni serverda saqlash, brauzerga esa HttpOnly, Secure va SameSite bayroqlari bilan sessiya cookie’sini berish. localStorage’dagi tokenlarni sahifadagi har qanday XSS o‘qiy oladi.
