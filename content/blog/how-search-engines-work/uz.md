---
title: Qidiruv tizimlari qanday ishlaydi: skanerlash, indeksatsiya, reyting
description: Google va Yandex sahifalarni qanday topadi, ko‘rsatadi, saqlaydi va tartiblaydi hamda sayt egasi har bir bosqichda nimaga ta’sir qila oladi.
summary: Qidiruv tizimi avval sahifani robot orqali topadi, keyin uni render qilib indeksga saqlaydi, so‘rov kelganda esa indeksdan eng foydali javoblarni tanlaydi. Sayt egasi har bir bosqichga ochiqlik, tushunarli belgilash va kontent sifati orqali ta’sir qiladi.
---

## Qisqacha: to‘rt bosqich

Google va Yandex bir xil sxema bo‘yicha ishlaydi:

1. **Topish** — robot sahifa mavjudligini bilib oladi.
2. **Skanerlash va rendering** — robot sahifani yuklaydi va kerak bo‘lsa JavaScript’ni bajaradi.
3. **Indeksatsiya** — qidiruv tizimi tarkibni tahlil qilib, sahifani bazaga saqlash-saqlamaslikni hal qiladi.
4. **Reyting** — har bir so‘rovda tizim indeksdan mos sahifalarni tanlab, ularni tartiblaydi.

Sahifa istalgan bosqichda tushib qolsa, foydalanuvchiga yetib bormaydi.

## Topish: robot sahifalarni qanday topadi

Qidiruv roboti (Googlebot, YandexBot) havolalar bo‘ylab o‘tadi va manzillar ro‘yxatini o‘qiydi. Asosiy manbalar:

- saytingizning boshqa sahifalaridagi **ichki havolalar**;
- boshqa saytlardagi **tashqi havolalar**;
- **sitemap.xml** — sahifalar ro‘yxati bo‘lgan fayl;
- URL’ni Google Search Console yoki Yandex Webmaster’ga qo‘lda yuborish.

**Siz nazorat qiladigan narsa:** hech qanday havola bo‘lmagan sahifa («yetim» sahifa) umuman topilmasligi mumkin. Sitemap’ni dolzarb saqlang va muhim sahifalarni havolalar bilan bog‘lang.

## Skanerlash va rendering

Robot sahifani serverdan so‘raydi. Bu yerda muhim:

- **robots.txt** — bo‘limlarni skanerlashga ruxsat beradi yoki taqiqlaydi;
- **server javobi** — ishlayotgan sahifalar uchun 200, ko‘chirilganlar uchun 301, o‘chirilganlar uchun 404;
- **tezlik va barqarorlik** — server sekin yoki xato bilan javob bersa, robot kamroq skanerlaydi.

Zamonaviy qidiruv tizimlari JavaScript’ni bajara oladi, lekin rendering resurs talab qiladi va kechikishi mumkin. Asosiy matn faqat skriptlar ishlagandan keyin paydo bo‘lsa, u kechroq yoki to‘liq hisobga olinmasligi mumkin. Shuning uchun kontent saytlar ko‘pincha **server rendering (SSR) yoki statik generatsiyani** tanlaydi.

## Indeksatsiya: sahifa bazaga tushadimi

Skanerlangan har bir sahifa ham indeksga tushmaydi. Qidiruv tizimi uni rad etishi mumkin, agar u:

- `noindex` tegi bilan yopilgan bo‘lsa;
- boshqa sahifani takrorlasa (unda **canonical** versiya hisobga olinadi);
- deyarli bo‘sh yoki foydasiz bo‘lsa;
- xato qaytarsa yoki yo‘naltirsa.

```html
<!-- Indeksatsiyani taqiqlash -->
<meta name="robots" content="noindex">

<!-- Sahifaning asosiy versiyasini ko‘rsatish -->
<link rel="canonical" href="https://example.com/services/seo">
```

**Siz nazorat qiladigan narsa:** noyob kontent, to‘g‘ri canonical, tasodifiy `noindex` yo‘qligi. Holatni Search Console va Webmaster’ning indeksatsiya hisobotlarida tekshirish mumkin.

## Reyting: kim yuqorida bo‘ladi

Foydalanuvchi so‘roviga tizim soniyaning bir qismida mos sahifalarni tanlab, tartiblaydi. Aniq formulalar yopiq, lekin asosiy omillar guruhlari ma’lum:

| Guruh | Misollar |
|---|---|
| **Relevantlik** | sahifa so‘rovdagi so‘zlarnigina emas, uning ma’nosiga qanchalik javob beradi |
| **Sifat va ekspertiza** | to‘liqlik, aniqlik, tushunarli muallif va manba |
| **Obro‘** | boshqa saytlardagi havolalar va eslatmalar |
| **Qulaylik** | tezlik, mobil versiya, bezovta qiluvchi elementlar yo‘qligi |
| **Kontekst** | foydalanuvchi joylashuvi, til, qurilma turi |
| **Xulq-atvor** | Yandex’da foydalanuvchilarning natijalar bilan o‘zaro ta’siri sezilarli rol o‘ynaydi |

Natijalar shaxsiylashtirilgan: turli shaharlardagi ikki kishi turli natijalarni ko‘rishi mumkin.

## Sahifalar qayerda yo‘qoladi: tekshiruv ro‘yxati

- Sahifaga havola yo‘q va u sitemap’da ko‘rsatilmagan.
- Bo‘lim robots.txt’da tasodifan yopilgan.
- Server 5xx qaytaradi yoki juda sekin javob beradi.
- Asosiy kontent faqat foydalanuvchi harakatidan keyin skript orqali yuklanadi.
- Test versiyadan qolib ketgan `noindex`.
- Bir xil tarkibli bir nechta URL canonical’siz.
- Matn sahifa mo‘ljallangan so‘rovga javob bermaydi.

## FAQ

### Yangi sahifa qidiruvda qancha vaqtda paydo bo‘ladi?

Aniq muddat yo‘q: bir necha kundan bir necha haftagacha. Indekslangan sahifalardan havolalar, dolzarb sitemap va URL’ni vebmaster panellari orqali yuborish jarayonni tezlashtiradi.

### Google va Yandex ishlash tamoyili bo‘yicha farq qiladimi?

Bosqichlar bir xil, lekin reyting algoritmlari, indeksatsiya tezligi va alohida omillarning og‘irligi farq qiladi. Shuning uchun bitta saytning ikki qidiruv tizimidagi o‘rinlari ko‘pincha mos kelmaydi.

### Organik natijalardagi o‘rin uchun qidiruv tizimiga pul to‘lash mumkinmi?

Yo‘q. Pullik faqat alohida belgilanadigan reklamani joylashtirish mumkin. Organik o‘rinlar sayt sifati va relevantligiga bog‘liq.
