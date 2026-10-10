---
title: Dasturchi uchun sayt tezligini optimallashtirish chek-listi
description: Sayt tezligini oshirish bo‘yicha amaliy chek-list: server, tarmoq, JS, CSS, shriftlar, rasmlar va uchinchi tomon skriptlari hamda har birini o‘lchash usuli.
summary: Avval o‘lchang (Lighthouse va real Core Web Vitals ma’lumotlari), so‘ng server javobi, tarmoq, rasmlar, JS, CSS, shriftlar va uchinchi tomon skriptlarini tartib bilan tekshiring va har o‘zgarishdan keyin qayta o‘lchang.
---

## Qisqacha: nimadan boshlash kerak

Sayt tezligi bitta sozlama emas, balki zanjir: server javob beradi, brauzer resurslarni yuklaydi, kodni tahlil qilib bajaradi va sahifani chizadi. Aynan sizda sekinlashayotgan bo‘g‘inni optimallashtirish kerak. Tartib doim bir xil:

1. **O‘lchash** — laboratoriyada va real foydalanuvchilarda.
2. **Eng tor joyni topish** — LCP, INP, CLS va TTFB metrikalari bo‘yicha.
3. **Bitta narsani tuzatish** va **qayta o‘lchash**.

Quyida qatlamlar bo‘yicha chek-list va har bir bandni nima bilan tekshirish ko‘rsatilgan.

## Qanday o‘lchash kerak

- **Lab ma’lumotlari**: Lighthouse va Chrome DevTools’dagi Performance paneli. Debug uchun qulay, lekin bu bitta simulyatsiya.
- **Field ma’lumotlari**: Google Search Console’dagi Core Web Vitals hisoboti, CrUX yoki `web-vitals` kutubxonasi orqali o‘zingiz yig‘gan ma’lumotlar. Real foydalanuvchilar aynan shuni ko‘radi.
- **Waterfall**: DevTools’dagi Network paneli yoki WebPageTest nima, qaysi tartibda yuklanishini va chizishni nima to‘sayotganini ko‘rsatadi.

Tarmoq va CPU throttling bilan sinang: tez noutbukda deyarli har qanday sayt tez ko‘rinadi.

## Server javobi (TTFB)

- [ ] Iloji bo‘lsa HTML’ni keshlang: statik generatsiya, ISR, CDN yoki reverse proxy darajasida kesh.
- [ ] Render’ning kritik yo‘lidagi sekin ma’lumotlar bazasi so‘rovlari va tashqi API chaqiruvlarini tekshiring.
- [ ] Matnli resurslar uchun **Brotli** yoki gzip siqishni yoqing.
- [ ] **HTTP/2 yoki HTTP/3** va auditoriyaga yaqin CDN’dan foydalaning.

Nima bilan tekshirish: DevTools’da TTFB (hujjatning Timing bo‘limi), server loglari va APM.

## Tarmoq va keshlash

- [ ] Nomida xesh bo‘lgan statik fayllar uzun `Cache-Control: public, max-age=31536000, immutable` bilan beriladi.
- [ ] Muhim uchinchi tomon domenlari uchun `preconnect` bor.
- [ ] Redirect zanjirlari yo‘q (http → https → www → yakuniy URL).
- [ ] LCP resursi (odatda asosiy rasm) kech aniqlanmaydi — kerak bo‘lsa `fetchpriority="high"` yoki `preload`.

## Rasmlar

- [ ] Zamonaviy formatlar: **WebP** yoki **AVIF**.
- [ ] `srcset` va `sizes` orqali moslashuvchan o‘lchamlar.
- [ ] Birinchi ekrandan pastdagi rasmlar uchun `loading="lazy"` — lekin LCP rasmi uchun **emas**.
- [ ] Maket siljishi (CLS) bo‘lmasligi uchun `width` va `height` ko‘rsatilgan.

Nima bilan tekshirish: Lighthouse’dagi «Properly size images» va «Serve images in next-gen formats».

## JavaScript

- [ ] Bundle’ni bundle analyzer bilan tahlil qiling va og‘ir yoki ishlatilmayotgan bog‘liqliklarni olib tashlang.
- [ ] **Code splitting**: sahifalar va og‘ir vidjetlar kodi talab bo‘yicha yuklanadi.
- [ ] Muhim bo‘lmagan skriptlar `defer` yoki `async` bilan.
- [ ] Uzun vazifalar (long tasks) bo‘lingan, og‘ir hisob-kitoblar serverga yoki Web Worker’ga ko‘chirilgan — bu **INP**ga bevosita ta’sir qiladi.

Nima bilan tekshirish: DevTools’dagi Coverage va Performance, «Reduce unused JavaScript» auditi.

## CSS

- [ ] Ishlatilmayotgan stillar olib tashlangan (yig‘uvchi yoki PurgeCSS kabi vositalar orqali).
- [ ] Birinchi ekran uchun kritik CSS bitta katta umumiy fayl bilan to‘silmagan.
- [ ] Layout’ni qayta hisoblatadigan xususiyatlarning og‘ir animatsiyalari yo‘q; `transform` va `opacity`ni animatsiya qiling.

## Shriftlar

- [ ] **WOFF2** formati, faqat kerakli qalinliklar va belgilar to‘plami (subsetting).
- [ ] Matn ko‘rinmay qolmasligi uchun `font-display: swap` yoki `optional`.
- [ ] Asosiy shrift `preload` qilingan yoki o‘z serveringizda joylashgan.
- [ ] Shrift almashinuvi CLS bermasligi uchun fallback metrikalari sozlangan.

## Uchinchi tomon skriptlari

- [ ] Ro‘yxat tuzing: analitika, chatlar, piksellar, vidjetlar. Hech kim foydalanmayotganini o‘chiring.
- [ ] Ularni asosiy chizishdan keyin yoki o‘zaro ta’sir bo‘yicha yuklang (masalan, chat — bosilganda).
- [ ] Joylashtirilgan video va xaritalarni yengil preview bilan almashtiring.

Nima bilan tekshirish: Lighthouse’dagi «Reduce the impact of third-party code», Network panelida domenlar bo‘yicha guruhlash.

## Ko‘p uchraydigan xatolar

- Field ma’lumotlari o‘rniga bitta Lighthouse natijasiga qarab optimallashtirish.
- Asosiy rasmga `loading="lazy"` qo‘yish — LCP yomonlashadi.
- O‘nta narsani birdaniga o‘zgartirib, nima ishlaganini bilmay qolish.
- O‘rta darajadagi mobil qurilmalarni unutish.

## FAQ

### Qaysi metrika eng muhim?

Muammoga bog‘liq. Yuklanish hissi uchun LCP, javob tezligi uchun INP, barqarorlik uchun CLS muhim. Field ma’lumotlarida eng yomon ko‘rsatkichdan boshlang.

### Lighthouse’da 100 ball olish shartmi?

Yo‘q. Ball — laboratoriya tekshiruvi uchun mo‘ljal. Real foydalanuvchilar Core Web Vitals’ning «yaxshi» chegaralarida bo‘lishi muhimroq.

### Tezlikni qanchalik tez-tez tekshirish kerak?

Har bir sezilarli relizdan keyin va yangi uchinchi tomon skriptlari qo‘shilganda. Lighthouse CI yoki performance budjetlarini pipeline’ga qo‘shish buni avtomatlashtiradi.
