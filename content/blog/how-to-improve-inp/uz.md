---
title: INP’ni qanday yaxshilash va sayt javobini tezlashtirish
description: INP qanday o‘lchanadi, sekin o‘zaro ta’sirlarni qanday topish hamda uzun vazifalar, og‘ir tashqi skriptlar va qimmat qayta chizishlarni qanday tuzatish.
summary: INP sahifa bosish va matn kiritishga vizual jihatdan qanchalik tez javob berishini ko‘rsatadi. Uni yaxshilash uchun uzun vazifalarni bo‘ling, tashqi skriptlarni kamaytiring va har bir harakatdan keyingi chizish hajmini qisqartiring.
---

## INP nima va u qanday o‘lchanadi

**INP (Interaction to Next Paint)** — sahifaning javob berish tezligini baholaydigan Core Web Vitals metrikasi. U tashrif davomidagi barcha bosish, teginish va tugma bosishlarni olib, eng sekinlaridan birini ko‘rsatadi. **200 ms gacha** yaxshi, 500 ms dan ortiq — yomon hisoblanadi.

Har bir o‘zaro ta’sir uch qismdan iborat:

| Bosqich | Nima sodir bo‘ladi | Kechikishning odatiy sababi |
|---|---|---|
| **Input delay** | Asosiy oqim bo‘shashini kutish | Boshqa skriptlar allaqachon ishlayapti |
| **Processing time** | Hodisa ishlovchilari ishlaydi | onClick ichidagi og‘ir mantiq |
| **Presentation delay** | Stillar, maket va chizish | Katta DOM, ommaviy qayta chizish |

Skroll va sichqoncha bilan ustiga olib borish INP’ga kirmaydi. Metrika real foydalanuvchilardan yig‘iladi, shuning uchun yuklanish bo‘yicha laboratoriya testi uni ko‘rsatmaydi.

## Sekin o‘zaro ta’sirlarni qanday topish

1. **Search Console → Core Web Vitals** — qaysi sahifa guruhlarida INP muammosi borligini ko‘rsatadi.
2. **PageSpeed Insights** — aniq URL uchun dala INP qiymatini beradi.
3. **Chrome DevTools → Performance** — CPU sekinlashtirishni yoqing (4x yoki 6x), yozib oling va harakatni takrorlang: filtrni bosish, menyuni ochish, qidiruvga yozish. Interactions qatorida davomiylik va bosqichlar bo‘yicha taqsimot ko‘rinadi.
4. **RUM yig‘ish** — `web-vitals` kutubxonasi INP’ni element ko‘rsatilgan holda analitikangizga yuborishga imkon beradi. Shunda real foydalanuvchilarda aynan qaysi tugma sekinlashayotganini bilasiz.

```js
import { onINP } from 'web-vitals/attribution';

onINP(({ value, attribution }) => {
  console.log(value, attribution.interactionTarget);
});
```

Kuchsiz qurilmalarda sinab ko‘ring: kuchli noutbukda muammolar ko‘pincha ko‘rinmaydi.

## Uzun vazifalarni tuzatish

**Uzun vazifa** — 50 ms dan uzoq davom etadigan har qanday JavaScript bloki. U bajarilayotganda brauzer kiritishga javob bera olmaydi.

- **Ishni qismlarga bo‘ling** va ular orasida boshqaruvni brauzerga qaytaring. Zamonaviy usul — `scheduler.yield()`, zaxira variant — `setTimeout(resolve, 0)`.
- **Avval interfeysni yangilang, keyin hisoblang.** Bosishga javobni (spinner, holat o‘zgarishi) ko‘rsating, analitika, saqlash va og‘ir hisob-kitoblarni esa keyin bajaring.
- **Hisob-kitoblarni Web Worker’ga chiqaring** — katta massivlarni saralash, parsing, ma’lumotlarni qayta ishlash.
- Qidiruv va filtrlar uchun **debounce** qo‘llang, har bir harf uchun so‘rov yuborilmasin.

```js
async function handleClick() {
  showSpinner();
  await scheduler.yield();
  runHeavyWork();
}
```

Maqsadli brauzerlarda `scheduler.yield()` qo‘llab-quvvatlanishini tekshiring va zaxira variant qo‘shing.

## Tashqi skriptlar

Chatlar, piksellar, teg-menejerlar, A/B testlar va vidjetlar foydalanuvchi biror narsani bosmoqchi bo‘lgan paytda asosiy oqimni band qiladi.

- **Audit** o‘tkazing: DevTools’ning Performance panelida vaqtni domenlar bo‘yicha guruhlang.
- Hech kim foydalanmaydigan narsalarni olib tashlang.
- Muhim bo‘lmagan skriptlarni `defer` bilan yoki birinchi o‘zaro ta’sirdan keyin yuklang.
- Chat vidjetini yengil tugma ko‘rinishida ko‘rsating va to‘liq holda bosilganda yuklang.

## Qimmat qayta chizishlar

Hatto tez ishlovchi ham sekin chizishga sabab bo‘lishi mumkin.

- **DOM’ni kichraytiring.** Minglab tugunlar stillarni qayta hisoblashni qimmatlashtiradi. Uzun ro‘yxatlarni virtualizatsiya qiling.
- **React’da** ortiqcha qayta renderlardan qoching: holatni u ishlatiladigan joyga yaqin saqlang, `memo` qo‘llang, shoshilinch bo‘lmagan yangilanishlar uchun `useTransition` dan foydalaning.
- **Layout thrashing’dan qoching** — siklda o‘lchamlarni o‘qish (`offsetHeight`) va stillarni yozishni almashtirib turish.
- Ekrandan tashqaridagi bloklar uchun `content-visibility: auto` dan foydalaning.

## Ko‘p uchraydigan xatolar

- Faqat yuklanishni optimallashtirib, undan keyingi ishni e’tiborsiz qoldirish.
- Kuchli kompyuterda CPU sekinlashtirishsiz tekshirish.
- Teg-menejer orqali skriptlarni ularning narxini nazorat qilmasdan qo‘shish.

## FAQ

### INP FID’dan nimasi bilan farq qiladi?

FID faqat birinchi o‘zaro ta’sirdagi kechikishni o‘lchardi. INP barcha o‘zaro ta’sirlarni va keyingi chizishgacha bo‘lgan to‘liq vaqtni hisobga oladi, shuning uchun real javob tezligini aniqroq aks ettiradi. INP Core Web Vitals’da FID o‘rnini egalladi.

### Nega Lighthouse’da INP yo‘q?

Oddiy Lighthouse ishga tushirilganda sahifani faqat yuklaydi va hech narsani bosmaydi. Laboratoriyada INP bilan bog‘liq Total Blocking Time’ga qarang yoki qo‘lda harakatlar bilan Timespan rejimidan foydalaning.

### Birinchi navbatda nimani tuzatish kerak?

Asosiy sahifalardagi eng ko‘p bajariladigan harakatlardan boshlang: savatga qo‘shish, filtrlar, menyu va formalar. Aynan ular INP qiymatini belgilashi ehtimoli yuqori.
