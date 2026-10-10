---
title: Frontend dasturchi kim: vazifalar, ko‘nikmalar va vositalar
description: Frontend dasturchi har kuni nima qiladi, qanday ko‘nikma va vositalar kerak, kim bilan ishlaydi va agentlik, mahsulot va startapda rol qanday farqlanadi.
summary: Frontend dasturchi dizayn maketlarini sayt yoki veb-ilovaning ishlaydigan interfeysiga aylantiradi: sahifalarni yig‘adi, JavaScript’da mantiq yozadi va serverdan ma’lumotlarni ulaydi.
---
## Qisqacha: bu kim

**Frontend dasturchi** sayt yoki veb-ilovaning foydalanuvchi ko‘radigan va u bilan ishlaydigan qismi uchun javob beradi: sahifalar, tugmalar, formalar, animatsiyalar, shaxsiy kabinetlar.

Uning ishi — dizaynerdan maketni olib, uni telefonda ham, katta monitorda ham birdek yaxshi ko‘rinadigan va serverdan ma’lumot oladigan **tez, qulay va to‘g‘ri ishlaydigan interfeysga** aylantirish.

## Har kuni nima bilan shug‘ullanadi

- Figma’dagi maketlar bo‘yicha **komponent va sahifalarni yig‘ish**.
- **Interfeys mantig‘i**: ma’lumotlarni tekshiradigan formalar, filtrlar, savatlar, modal oynalar.
- **API bilan ishlash**: serverga so‘rovlar, javoblarni qayta ishlash, yuklanish va xato holatlari.
- **Moslashuvchanlik**: interfeys har qanday ekran o‘lchamida ishlashi kerak.
- **Unumdorlik**: rasmlar, yuklanish tezligi va silliqlikni optimallashtirish.
- **Xatolarni tuzatish** va hamkasblar kodini review qilish.
- Dizayner, backend dasturchi va menejer bilan **vazifalarni muhokama qilish**.

Vaqtning katta qismi yangi kod yozishga emas, balki **mavjud kodni o‘qish**, debug qilish va detallarni kelishishga ketadi.

## Asosiy ko‘nikmalar to‘plami

| Soha | Nimani bilish kerak |
|---|---|
| **HTML** | Semantik belgilash, formalar, foydalanish imkoniyati (accessibility) |
| **CSS** | Flexbox, Grid, moslashuvchan dizayn, animatsiyalar |
| **JavaScript** | Til asoslari, DOM bilan ishlash, asinxronlik, API so‘rovlari |
| **TypeScript** | Tiplashtirish — ko‘p jamoalarda allaqachon standart |
| **Freymvork** | Mashhurlaridan biri: React, Vue yoki Angular |
| **Vositalar** | Git, paket menejerlari, yig‘uvchilar, brauzer DevTools |

Frontend dasturchi doimiy ishlaydigan narsaga misol — serverdan ma’lumot so‘rash:

```javascript
async function loadProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Failed to load products");
  return response.json();
}
```

Texnik ko‘nikmalardan tashqari **detallarga e’tibor**, maket bo‘yicha savol bera olish va haqiqiy odamlar interfeysdan qanday foydalanishini tushunish muhim.

## Kim bilan ishlaydi

- **Dizayner** — elementlar xatti-harakati, holatlar, chekinishlar va statik maketda ko‘rinmaydigan narsalarni aniqlashtirish.
- **Backend dasturchi** — API’dagi ma’lumotlar formati, xatolarni qayta ishlash, avtorizatsiya.
- **QA muhandis** — topilgan xatolarni takrorlash va tuzatish.
- **Loyiha menejeri** — muddatlar, ustuvorliklar, vazifalarni baholash.

Yaxshi frontend dasturchi — bog‘lovchi bo‘g‘in: maket va API bir-biriga mos kelmasligini u birinchilardan bo‘lib ko‘radi va bu masalani ko‘taradi.

## Turli kompaniyalarda rol qanday farqlanadi

| Kompaniya turi | Ish xususiyatlari |
|---|---|
| **Agentlik / studiya** | Ko‘plab turli loyiha va mijozlar, qisqa muddatlar, vazifa va texnologiyalar xilma-xilligi. Dunyoqarash tez kengayadi. |
| **Mahsulot kompaniyasi** | Uzoq muddat bitta mahsulot, sifatni chuqur ishlab chiqish, metrikalar, A/B testlar, katta kod bazasi. |
| **Startap** | Yuqori tezlik, kam jarayonlar, ko‘pincha backend va dizayn bilan chegaradosh vazifalarni ham olishga to‘g‘ri keladi. |

«Eng yaxshi» variant yo‘q: agentlik tajriba kengligini, mahsulot — chuqurlikni, startap — mustaqillikni beradi.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- JavaScript va CSS asoslarini o‘tkazib, **darhol freymvorkni o‘rganish**.
- **Moslashuvchanlikni e’tiborsiz qoldirish** va sahifani faqat o‘z ekranida tekshirish.
- **Holatlarni qayta ishlamaslik**: yuklanish, bo‘sh ma’lumot, server xatolari.
- **Foydalanish imkoniyatini unutish**: maydon yozuvlari, kontrast, klaviatura bilan navigatsiya.

## FAQ

### Frontend dasturchi chizishni bilishi yoki dizayner bo‘lishi kerakmi?

Yo‘q. Maket chizish — dizaynerning vazifasi. Lekin kompozitsiya, tipografika va chekinishlar asoslarini tushunish foydali: shunda maketni aniq amalga oshirish va nomuvofiqliklarni ko‘rish osonroq.

### Birinchi bo‘lib qaysi freymvorkni o‘rganish kerak?

Hududingizdagi vakansiyalarda eng ko‘p uchraydiganidan boshlang. JavaScript’ni yaxshi tushunish muhimroq: bu poydevor bilan freymvorklar orasida o‘tish ko‘p vaqt olmaydi.

### Frontend backend’dan nimasi bilan farq qiladi?

Frontend foydalanuvchi brauzerida ishlaydi va interfeys uchun javob beradi. Backend serverda ishlaydi va ma’lumotlar, biznes-mantiq va integratsiyalar uchun javob beradi. Ular birgalikda to‘liq veb-ilovani tashkil qiladi.
