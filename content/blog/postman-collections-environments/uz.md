---
title: Postman’da kolleksiyalar, muhitlar va o‘zgaruvchilar
description: Postman’da so‘rovlarni kolleksiyalarga qanday tartiblash, dev va production o‘rtasida almashish, o‘zgaruvchilar sohalarini tushunish va jamoa bilan ulashish.
summary: So‘rovlarni papkali kolleksiyalarga joylang, manzil va tokenlarni {{baseUrl}} kabi o‘zgaruvchilarga chiqaring, har bir stend uchun alohida muhit yarating — shunda dev va production o‘rtasida almashish bir bosishda bo‘ladi.
---
## Asosiy g‘oya

Postman’ning uchta vositasi bitta vazifani hal qiladi — so‘rovlarni takrorlamaslik:

- **Kolleksiya** — bitta API yoki loyiha so‘rovlari joylashgan papka: ichki papkalar, umumiy avtorizatsiya va hujjatlar bilan.
- **O‘zgaruvchi** — so‘rovga qo‘yiladigan nomlangan qiymat: `{{baseUrl}}/users`.
- **Muhit (environment)** — muayyan stend uchun o‘zgaruvchilar to‘plami: lokal, dev, staging, production.

So‘rov bir marta yoziladi, server manzili va token esa tanlangan muhit bilan birga o‘zgaradi.

## Kolleksiyani qanday tartiblash

Yaxshi tuzilma API tuzilmasini takrorlaydi:

```text
Shop API
├── Auth
│   ├── Login
│   └── Refresh token
├── Products
│   ├── List products
│   ├── Get product
│   └── Create product
└── Orders
    ├── Create order
    └── Get order
```

Amaliy qoidalar:

- **So‘rov nomlari** — tushunarli va amal bo‘yicha: «POST /orders 2» emas, «Create order».
- **Avtorizatsiyani** kolleksiya darajasida sozlang, so‘rovlarda esa **Inherit auth from parent** ni qoldiring. Token bitta joyda o‘zgaradi.
- **Javob misollarini saqlang** (Save as example) — ular hujjatlarga tushadi va API’ni birinchi marta ko‘rayotganlarga yordam beradi.

## Muhitlar: dev, staging, production

Har bir stend uchun bir xil nomli o‘zgaruvchilar bilan muhit yarating:

| O‘zgaruvchi | Local | Staging | Production |
|---|---|---|---|
| `baseUrl` | `http://localhost:3000` | `https://staging.api.example.com` | `https://api.example.com` |
| `token` | lokal token | stend tokeni | production tokeni |

So‘rovlarda faqat o‘zgaruvchilardan foydalaning: `{{baseUrl}}/products`. Muhitlar almashtirgichi yuqori o‘ng burchakda joylashgan. Postman o‘zgaruvchilarni rang bilan ajratadi: topilmaganlari qizil rangda ko‘rinadi.

Production’dagi ma’lumotlarni tasodifan o‘zgartirib yubormaslik uchun ko‘p jamoalar unga faqat xavfsiz o‘qish so‘rovlari bo‘lgan alohida kolleksiya yoki muhit ajratadi.

## O‘zgaruvchilarning ko‘rinish sohalari

Postman’da beshta daraja bor. Bir xil nomli o‘zgaruvchi bir nechta joyda berilgan bo‘lsa, **eng tor** soha ustun keladi:

| Soha | Qayerda amal qiladi | Nima uchun |
|---|---|---|
| **Global** | Butun workspace | Kamdan-kam kerak, adashish oson |
| **Collection** | Bitta kolleksiya | API konstantalari: versiya, yo‘llar |
| **Environment** | Tanlangan muhit | Stend manzillari, tokenlar |
| **Data** | Ma’lumotlar fayli bilan bitta ishga tushirish | Runner’dagi test ma’lumotlari to‘plamlari |
| **Local** | Bitta so‘rov yoki ishga tushirish | Skriptlardagi vaqtinchalik qiymatlar |

Ustuvorlik: Local → Data → Environment → Collection → Global.

## Skriptlardan o‘zgaruvchi berish

Tokenni qo‘lda nusxalamasdan, login javobidan saqlash qulay. So‘rovdan keyin bajariladigan skriptlar vkladkasiga qo‘shing:

```javascript
const data = pm.response.json();
pm.environment.set("token", data.access_token);
```

Endi Login so‘rovidan keyin `{{token}}` ishlatilgan barcha so‘rovlar yangi tokenni oladi.

## Maxfiy ma’lumotlar va umumiy qiymatlar

O‘zgaruvchining butun jamoa bilan sinxronlanadigan **umumiy qiymati** va faqat sizda saqlanadigan **joriy qiymati** bor. Bu maydonlarning nomlari Postman versiyalarida farq qiladi, lekin tamoyil bitta:

- Umumiy qiymatga ko‘rsatsa bo‘ladigan narsalarni qo‘ying: manzillar, identifikatorlar, bo‘sh to‘ldirgichlar.
- Token va parollarni faqat joriy qiymatda saqlang va **secret** turini belgilang — u qiymatni ekranda yashiradi.
- Nozik ma’lumotlar uchun **Postman Vault** bor: maxfiy qiymatlar lokal saqlanadi va `{{vault:nomi}}` ko‘rinishidagi havolalar orqali qo‘yiladi.

## Jamoaviy ish va hujjatlar

- **Team workspace** — kolleksiya va muhitlar butun jamoaga ko‘rinadi va hammada yangilanadi.
- **Fork va pull request** — kolleksiyadan nusxa olib, uni o‘zgartirish va o‘zgarishlarni Git’dagidek taklif qilish mumkin.
- **JSON’ga eksport** — kolleksiya va muhitni fayl sifatida yuklab olib, kod yonida repozitoriyda saqlash mumkin.
- **Hujjatlar** — kolleksiya, papka va so‘rov tavsiflari Markdown’da yoziladi. Postman ulardan so‘rov va javob misollari bilan hujjat sahifasini yig‘adi.

## Ko‘p uchraydigan xatolar

- Server manzili to‘g‘ridan-to‘g‘ri so‘rovga yozilgan — stend almashganda hammasini qo‘lda tuzatishga to‘g‘ri keladi.
- Tokenlar o‘zgaruvchining umumiy qiymatida va butun jamoaga ko‘rinadi.
- Global sohada va muhitda bir xil nomli o‘zgaruvchilar — qaysi biri ishlagani noma’lum.
- Tavsiflar yo‘q: bir oydan keyin «test 3» so‘rovi nima uchun kerakligini hech kim eslamaydi.

## FAQ

### Kolleksiya o‘zgaruvchisi muhit o‘zgaruvchisidan nimasi bilan farq qiladi?

Kolleksiya o‘zgaruvchisi barcha stendlar uchun bir xil, masalan API versiyasi. Muhit o‘zgaruvchisi stend bilan birga o‘zgaradi, masalan server manzili va token.

### Postman kolleksiyalarini Git’da saqlash mumkinmi?

Ha. Kolleksiya va muhitlarni JSON’ga eksport qiling, maxfiy ma’lumotlarni olib tashlang va commit qiling. Keyin xuddi shu fayllarni CI’da Newman orqali ishga tushirish mumkin.

### Nega o‘zgaruvchi qizil rangda ko‘rinyapti?

U mavjud sohalarning hech birida aniqlanmagan. Kerakli muhit tanlanganini va o‘zgaruvchi nomida xato yo‘qligini tekshiring.
