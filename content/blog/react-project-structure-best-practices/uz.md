---
title: React loyiha tuzilmasini qanday tashkil qilish: papkalar va qoidalar
description: Turlar yoki fichalar bo‘yicha tuzilma, kengayadigan papkalar daraxti, nomlash qoidalari, umumiy UI va React loyihasida API mantiqi qayerda bo‘lishi.
summary: Kichik loyihalar uchun fayl turlari bo‘yicha guruhlash yetarli, o‘sayotgan ilovani esa fichalar bo‘yicha bo‘lgan ma’qul: bitta funksiyaga tegishli hamma narsa bitta papkada, umumiy kod esa shared’da.
---

## Qisqa javob

React majburiy tuzilmani talab qilmaydi, shuning uchun qaror jamoaga qoladi. Ishlaydigan qoida: **kichik loyiha — turlar bo‘yicha, o‘sayotgan loyiha — fichalar bo‘yicha guruhlash**. Eng muhimi — har qanday dasturchi bir daqiqada kodni qayerdan izlash va yangisini qayerga qo‘yishni tushunishi kerak.

## Turlar bo‘yicha yoki fichalar bo‘yicha

**Turlar bo‘yicha** (type-based) — barcha komponentlar `components/` da, barcha hooklar `hooks/` da, barcha so‘rovlar `api/` da.

**Fichalar bo‘yicha** (feature-based) — kod mahsulot funksiyalari bo‘yicha guruhlanadi: `auth/`, `cart/`, `orders/`. Har bir ficha ichida uning komponentlari, hooklari, so‘rovlari va tiplari joylashadi.

| Mezon | Turlar bo‘yicha | Fichalar bo‘yicha |
|---|---|---|
| Kirish chegarasi | Past, darhol tushunarli | Fichalar chegaralarini kelishib olish kerak |
| Loyiha o‘sishi | Papkalar yuzlab fayllargacha kattalashadi | Har bir ficha ixcham qoladi |
| Funksiyani o‘chirish | Fayllar loyiha bo‘ylab tarqalgan | Bitta papka o‘chiriladi |
| Jamoaviy ish | Umumiy papkalarda tez-tez konfliktlar | Jamoalar o‘z fichalarida ishlaydi |

## Kengayadigan papkalar daraxti

```text
src/
  app/            # kirish nuqtasi, routing, provayderlar
  pages/          # sahifalar, fichalarni yig‘adi
  features/
    cart/
      components/
      hooks/
      api.ts
      types.ts
      index.ts    # fichaning ochiq interfeysi
    auth/
  shared/
    ui/           # Button, Modal, Input
    lib/          # utilitalar, sanalarni formatlash
    api/          # HTTP-klient, asosiy sozlama
    config/
```

Agar Next.js kabi freymvorkdan foydalansangiz, `app/` yoki `pages/` papkasini uning routingi belgilaydi. Unda bu papkada faqat marshrutlar va yupqa sahifalarni saqlang, mantiqni esa `features/` va `shared/` ga qo‘ying.

## Tuzilmani tartibda saqlaydigan qoidalar

- **Bog‘liqliklar bir tomonga yo‘naladi:** `pages` → `features` → `shared`. `shared` dagi modul fichalarni import qilmaydi.
- **Fichalar bir-birining ichiga to‘g‘ridan-to‘g‘ri kirmaydi.** Agar `orders` ga `cart` dan kod kerak bo‘lsa, ichki fayllardan emas, `features/cart/index.ts` orqali import qiling.
- **Kod ishlatiladigan joy yonida yashaydi.** Bitta komponentga kerak bo‘lgan hook uning yonida turadi. `shared` ga faqat haqiqatan bir necha joyda ishlatiladigan narsalarni ko‘chiring.
- **Sayoz ichma-ichlik.** Uch-to‘rt darajadan ortiq papkalar odatda tuzilma haddan tashqari murakkablashganini bildiradi.

## Nomlash qoidalari

- **Komponentlar** — PascalCase: `ProductCard.tsx`. Agar komponentning stillari, testlari va ichki komponentlari bo‘lsa, unga alohida papka.
- **Hooklar** — `use` prefiksi bilan: `useCart.ts`.
- **Utilitalar va boshqa modullar** — camelCase yoki kebab-case; bittasini tanlang va linterda mustahkamlang.
- **Testlar** — fayl yonida: `ProductCard.test.tsx`.
- **Import aliaslari**, masalan `../../../shared/ui` o‘rniga `@/shared/ui`.

## Umumiy UI

`shared/ui` — biznes mantiqsiz interfeys g‘ishtchalari: tugmalar, maydonlar, modal oynalar, tipografiya. Ular savat yoki buyurtmalar haqida bilmaydi va hamma narsani props orqali oladi. Predmet sohasini biladigan komponent (masalan, `CartItem`) fichaga tegishli.

## API mantiqi qayerda bo‘lishi kerak

Komponentlar ichida to‘g‘ridan-to‘g‘ri `fetch` chaqirmang. Uch qatlamli qulay sxema:

1. **`shared/api`** — sozlangan HTTP-klient: asosiy URL, sarlavhalar, xatolarni qayta ishlash.
2. **`features/*/api.ts`** — fichaning so‘rov funksiyalari: `getCart()`, `addToCart()`.
3. **Ficha hooklari** — so‘rovlarni, masalan, TanStack Query orqali o‘raydi va komponentlarga ma’lumot hamda statuslarni beradi.

Shunday qilib komponent faqat ko‘rsatish uchun javob beradi, API o‘zgarishi esa bitta qatlamga ta’sir qiladi.

## Tipik xatolar

- Hamma narsa tashlanadigan `utils/` yoki `helpers/` papkasi.
- Muddatidan oldin maydalash: besh komponentli loyiha uchun o‘nta papka.
- Fichalar orasidagi siklik importlar.
- Yozilgan qoidalarsiz loyihaning turli qismlarida turli kelishuvlar.

## FAQ

### Qachon turlar bo‘yicha tuzilmadan fichalar bo‘yicha tuzilmaga o‘tish kerak?

Umumiy papkalarda kerakli faylni topish qiyinlashganda yoki bir necha dasturchi doimo bir xil papkalarni tahrirlaganda. O‘tishni bosqichma-bosqich qilish mumkin: yangi funksiyalarni darhol ficha sifatida rasmiylashtiring.

### Feature-Sliced Design’ni darhol joriy qilish kerakmi?

Shart emas. Bu aniq qatlamlarga ega batafsil metodologiya, u yirik loyihalarda foydali. Boshlash uchun uning asosiy g‘oyalari yetarli: qatlamlar, modullarning ochiq interfeysi va bir yo‘nalishli bog‘liqliklar.

### Global tiplarni qayerga qo‘yish kerak?

Muayyan fichaning tiplari — uning `types.ts` fayliga. API javobi yoki foydalanuvchi kabi umumiy tiplar — `shared` ga.
