---
title: Core Web Vitals dala va laboratoriya ma’lumotlari: CrUX, Lighthouse, RUM
description: Nega Lighthouse va Search Console turlicha ko‘rsatadi, CrUX’ning 28 kunlik oynasi qanday ishlaydi va tuzatishlarni kuzatish uchun RUM’ni qanday sozlash kerak.
summary: Lighthouse sun’iy sharoitda bitta yuklanishni o‘lchaydi, Search Console esa haqiqiy Chrome foydalanuvchilarining 28 kunlik ma’lumotlarini 75-persentil bo‘yicha ko‘rsatadi, shuning uchun raqamlar farq qiladi; tuzatishlarni kuzatish uchun o‘z RUM’ingiz kerak.
---

## Nega raqamlar mos kelmaydi

**Laboratoriya ma’lumotlari** (Lighthouse, PageSpeed Insights’ning diagnostika bo‘limi) — emulyatsiya qilingan qurilmada belgilangan tarmoq tezligida sahifaning bitta yuklanishi. **Dala ma’lumotlari** (CrUX, Search Console) — Chrome foydalanuvchilari o‘z qurilmalari va tarmoqlarida haqiqatan boshdan kechirgan tajriba.

Ular bir necha sababga ko‘ra farq qiladi:

- **Turli qurilmalar va tarmoqlar.** Haqiqiy foydalanuvchilarda tez internetli kuchli smartfonlar ham, sekin tarmoqdagi eski telefonlar ham bor.
- **Kesh va takroriy tashriflar.** Laboratoriya odatda sahifani «noldan» yuklaydi, haqiqiy tashrifchilar esa ko‘pincha kesh bilan keladi.
- **Xatti-harakat.** Laboratoriya bosmaydi, skroll qilmaydi va kutmaydi — maket siljishlari va javob kechikishlari esa ko‘pincha aynan o‘zaro ta’sirda yuzaga keladi.
- **INP laboratoriyada o‘lchanmaydi.** Interaction to Next Paint haqiqiy o‘zaro ta’sirlarni talab qiladi; Lighthouse faqat bilvosita ko‘rsatkich — **Total Blocking Time**ni ko‘rsatadi.

Reyting uchun qidiruv tizimi **dala ma’lumotlariga** tayanadi. Laboratoriya ma’lumotlari esa nosozliklarni tuzatish uchun kerak.

## CrUX qanday ishlaydi

**Chrome UX Report (CrUX)** — statistika yuborishga ruxsat bergan Chrome foydalanuvchilaridan yig‘ilgan unumdorlik bo‘yicha ochiq ma’lumotlar to‘plami.

- **28 kunlik siljuvchi oyna.** Har kuni hisobotga yangi kun qo‘shiladi va eng eskisi chiqib ketadi. Shuning uchun tuzatishdan keyin Search Console’dagi natija darhol emas, asta-sekin o‘zgaradi.
- **75-persentil.** Ko‘rsatkich kamida 75% tashriflarda chegaraga sig‘sa, sahifa «yaxshi» hisoblanadi.
- **Trafik chegarasi.** Sahifa bo‘yicha ma’lumot yetarli bo‘lmasa, CrUX butun manba (origin) bo‘yicha ma’lumot ko‘rsatadi yoki hech narsa ko‘rsatmaydi.
- **Search Console’da guruhlash.** Hisobot o‘xshash URL’larni guruhlarga birlashtiradi, shuning uchun bitta shablon muammosi birdaniga ko‘p sahifaga ta’sir qiladi.

## Manbalarni solishtirish

| Manba | Turi | Nima beradi | Cheklovlar |
|---|---|---|---|
| Lighthouse | Laboratoriya | Muammo sabablari, takrorlanuvchanlik | Bitta yuklanish, INP yo‘q |
| PageSpeed Insights | Dala + laboratoriya | CrUX’ning tezkor kesimi va diagnostika | Yetarli trafik kerak |
| Search Console | Dala (CrUX) | URL guruhlari, qidiruv uchun holat | 28 kunlik kechikish, tafsilotlar kam |
| O‘z RUM’ingiz | Dala | Barcha sahifalar, segmentlar, tezkor aloqa | Joriy etish va ma’lumot saqlash kerak |

## RUM’ni qanday sozlash kerak

**Real User Monitoring** — ko‘rsatkichlarni to‘g‘ridan-to‘g‘ri tashrifchilaringiz brauzerlarida yig‘ish. U 28 kunlik oynani kutmasdan, tuzatishlar samarasini bir necha kunda ko‘rsatadi.

Eng oddiy yo‘l — Chrome jamoasining `web-vitals` kutubxonasi:

```js
import { onLCP, onINP, onCLS } from 'web-vitals';

function send(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: location.pathname,
  });
  navigator.sendBeacon('/api/vitals', body);
}

onLCP(send);
onINP(send);
onCLS(send);
```

Keyin:

1. **Ma’lumotlarni** sahifa turi, qurilma va ulanish turi bilan birga analitika yoki o‘z bazangizda **saqlang**.
2. O‘rtachani emas, **75-persentilni hisoblang** — shunda ko‘rsatkichga CrUX kabi qaraysiz.
3. Sahifa shablonlari va mobil/desktop qurilmalar bo‘yicha **segmentlang**.
4. Har bir o‘zgarish samarasini ko‘rish uchun grafikda **relizlarni belgilang**.
5. Qaysi element LCP bo‘lganini yoki qaysi o‘zaro ta’sir yomon INP berganini bilish uchun **atributsiyadan** (`web-vitals/attribution` yig‘masi) foydalaning.

## Tuzatishlar bo‘yicha ish jarayoni

1. Search Console’da muammoli URL guruhini toping.
2. Muammo va segmentni RUM’da tasdiqlang.
3. Lighthouse va DevTools’da muammoni takrorlang va sababini toping.
4. Tuzatishni chiqaring va bir necha kundan keyin RUM’ni tekshiring.
5. CrUX yangilanishini kuting va Search Console’da «Tuzatishni tekshirish» tugmasini bosing.

## Keng tarqalgan xatolar

- Dala ma’lumotlarini e’tiborsiz qoldirib, «Lighthouse’da 100 gacha» optimallashtirish.
- Relizdan keyingi kunoq Search Console’da o‘zgarish kutish.
- Asosiy trafik mobil bo‘lsa-da, faqat desktopga qarash.

## FAQ

### Nega Lighthouse’da 100, Search Console esa muammo ko‘rsatadi?

Lighthouse ideal sharoitda bitta yuklanishni o‘lchaydi. Sekin qurilmalardagi va sahifa bilan o‘zaro ta’sir qilayotgan haqiqiy foydalanuvchilar boshqacha tajriba oladi — CrUX’ga aynan shu tushadi.

### Search Console tuzatish natijasini qachon ko‘rsatadi?

Ma’lumotlar 28 kunlik oyna davomida asta-sekin yangilanadi. Ko‘r-ko‘rona kutmaslik uchun samarani bir necha kun ichida o‘z RUM’ingizda tekshiring.

### CrUX bo‘lsa, RUM kerakmi?

Kichik sayt uchun CrUX yetarli bo‘lishi mumkin. Barcha sahifalar, segmentlar va relizlar samarasini tez va batafsil ko‘rish muhim bo‘lsa, RUM kerak.
