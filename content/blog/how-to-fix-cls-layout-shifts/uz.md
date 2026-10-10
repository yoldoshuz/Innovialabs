---
title: CLS’ni qanday tuzatish va saytdagi maket siljishlarini yo‘qotish
description: Yuklanishda sakraydigan elementlarni topish va CLS’ni tuzatish: rasm o‘lchamlari, reklama slotlari, veb-shriftlar, bannerlar va kech yuklanadigan embedlar.
summary: CLS elementlar oldindan joy ajratilmasdan paydo bo‘lganda oshadi. Media va slotlarga o‘lcham bering, ko‘rinib turgan kontent ustiga yangi blok qo‘ymang va shriftlar yuklanishini sozlang.
---

## CLS nima va nega u oshadi

**CLS (Cumulative Layout Shift)** — Core Web Vitals metrikasi bo‘lib, sahifa bilan ishlash paytida kontent qanchalik «sakrashini» ko‘rsatadi. Foydalanuvchi tugmani bosmoqchi bo‘ladi, ustida to‘satdan banner paydo bo‘ladi va bosish boshqa joyga tushadi. Google **0,1 va undan past** qiymatni yaxshi deb hisoblaydi.

Deyarli barcha siljishlarning sababi bitta: **brauzer element o‘lchamini oldindan bilmaydi**. U sahifani chizadi, keyin rasm, reklama yoki shrift kech yuklanadi va pastdagi hamma narsa suriladi.

Muhim: foydalanuvchi harakatidan (bosish, matn kiritish) keyingi qisqa vaqtdagi siljishlar hisobga olinmaydi. Bosganda ochiladigan akkordeon — bu normal. Sahifa o‘z-o‘zidan siljisa, yomon.

## Siljiyotgan elementlarni qanday topish mumkin

- **PageSpeed Insights** — real Chrome foydalanuvchilaridan olingan dala ma’lumotlari va laboratoriya testini ko‘rsatadi. Diagnostika bo‘limida eng katta siljishlarga sabab bo‘lgan elementlar ro‘yxati bor.
- **Chrome DevTools → Performance** — yuklanishni yozib oling, Layout Shifts qatorida har bir siljish va elementi ko‘rinadi.
- **Rendering → Layout Shift Regions** — DevTools’da siljish joylarini sahifaning o‘zida ko‘k rangda ajratib ko‘rsatadi.
- **Search Console → Core Web Vitals** — real foydalanuvchilar ma’lumotlari bo‘yicha muammoli URL guruhlarini ko‘rsatadi.

Mobil va desktop versiyani ham tekshiring: tor ekranda siljishlar odatda kuchliroq bo‘ladi.

## Asosiy sabablar va ularni tuzatish

### O‘lchamsiz rasm va videolar

Eng ko‘p uchraydigan sabab. `width` va `height` ni ko‘rsating — zamonaviy brauzerlar nisbatni o‘zi hisoblab, fayl yuklanguncha joy ajratadi.

```html
<img src="/photo.jpg" width="1200" height="800" alt="Kompaniya ofisi">
```

Moslashuvchan bloklar uchun CSS `aspect-ratio` dan foydalaning:

```css
.video-wrapper { aspect-ratio: 16 / 9; width: 100%; }
```

### Reklama slotlari va embedlar

Reklama, xaritalar, YouTube videolari va ijtimoiy tarmoq vidjetlari kech va ko‘pincha noma’lum balandlik bilan yuklanadi.

- Konteynerga eng ko‘p uchraydigan reklama o‘lchamiga mos **min-height** bering.
- Reklama kelmasa, slotni yopib qo‘ymang — bo‘sh joy yoki zaglushka qoldiring.
- Embedlar uchun fasaddan foydalaning: kerakli o‘lchamdagi statik prevyu, haqiqiy iframe esa bosilganda yuklanadi.

### Veb-shriftlar

Zaxira shrift yuklangan shriftga almashganda qatorlar kengligi o‘zgaradi va matn boshqacha ko‘chadi.

- Asosiy shriftlarni `<link rel="preload">` orqali oldindan yuklang.
- Ikkinchi darajali shriftlar uchun `font-display: optional` yoki yaxshi tanlangan zaxira shrift bilan `swap` dan foydalaning.
- `@font-face` ichida `size-adjust` va `ascent-override` orqali zaxira shrift metrikalarini moslashtiring — almashish deyarli sezilmaydi.
- Shriftlarni o‘z serveringizda saqlang va faqat kerakli qalinliklarni yuklang.

### Bannerlar, bildirishnomalar va cookie-panellar

JavaScript yuklanishdan keyin sahifa tepasiga qo‘shadigan blok butun kontentni pastga suradi.

- Bunday elementlarni **kontent ustida** (`position: fixed`) ko‘rsating, hujjat oqimida emas.
- Agar blok oqimda bo‘lishi shart bo‘lsa, unga dastlabki HTML’dayoq joy ajrating.
- Foydalanuvchi allaqachon ko‘rib turgan kontent **ustiga** yangi narsa qo‘shmang.

### Animatsiyalar

`top`, `height` yoki `margin` emas, `transform` va `opacity` ni animatsiya qiling. Geometriya xususiyatlarini o‘zgartirish maketni qayta hisoblaydi va siljish sifatida hisoblanishi mumkin.

## Chiqarishdan oldingi chek-list

- Barcha `img`, `video`, `iframe` larda o‘lcham yoki `aspect-ratio` bor.
- Reklama va dinamik bloklarda `min-height` berilgan.
- Shriftlar oldindan yuklanadi, zaxira shrift metrikalari moslashtirilgan.
- Bannerlar va popaplar kontentni pastga surmaydi.
- Skeletonlar haqiqiy kontent balandligiga mos.
- Sahifa mobil kenglikda tekshirilgan.

## Ko‘p uchraydigan xatolar

- **Faqat laboratoriyada tekshirish.** Lighthouse yuklanishni o‘lchaydi, real siljishlar esa ko‘pincha skroll va lenta yuklanishida sodir bo‘ladi.
- **O‘lchamsiz lazy-load.** `width`/`height` siz dangasa yuklanadigan rasmlar skrollda albatta siljish beradi.
- **Noto‘g‘ri balandlikdagi skeleton.** 200px zaglushka o‘rniga 400px blok kelsa — bu ham siljish.

## FAQ

### Tuzatishdan keyin Search Console’da CLS qancha tez yangilanadi?

Dala ma’lumotlari taxminan 28 kunlik siljuvchi davr bo‘yicha yig‘iladi, shuning uchun yaxshilanish asta-sekin ko‘rinadi. PageSpeed Insights’dagi laboratoriya testi natijani darhol ko‘rsatadi.

### CLS qidiruvdagi o‘ringa ta’sir qiladimi?

Core Web Vitals sahifa qulayligi signallariga kiradi, lekin kontentning mosligi muhimroq. Yaxshi CLS ko‘proq foydalanuvchi xatti-harakati va konversiyaga yordam beradi, o‘rinni to‘g‘ridan-to‘g‘ri keskin oshirmaydi.

### Menyu bosilganda ochilishidagi siljish bilan kurashish kerakmi?

Yo‘q. Foydalanuvchi harakatidan keyingi o‘zgarishlar CLS’ga kirmaydi. Asosiysi, javob tez va kechikishsiz bo‘lsin.
