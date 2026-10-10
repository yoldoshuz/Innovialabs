---
title: Interfeysda animatsiya: tamoyillar, davomiylik va easing
description: UI’da animatsiyani loyihalash: ma’noli harakat, davomiylik, easing egri chiziqlari, xoreografiya, reduced motion va dasturchilar uchun spetsifikatsiya.
summary: Interfeysdagi animatsiya bezash uchun emas, nima sodir bo‘lganini tushuntirish uchun kerak: qisqa davomiylik, paydo bo‘lish uchun ease-out, yo‘qolish uchun ease-in, bir vaqtda bitta diqqat nuqtasi. Harakatni kamaytirish sozlamasini albatta hurmat qiling va animatsiyani dasturchilarga aniq parametrli tokenlar sifatida topshiring.
---

## Qisqa javob

Yaxshi UI animatsiyasi **funksional** bo‘ladi: element qayerdan paydo bo‘lgani, qayerga ketgani, nima o‘zgargani va tizim harakatga javob berganini ko‘rsatadi. Agar harakatni shu vazifalardan biri bilan izohlab bo‘lmasa, uni olib tashlash yoki soddalashtirish kerak. Asosiy qoidalar: tez, tabiiy sekinlashish bilan, bir vaqtda bir nechta harakat raqobat qilmasdan va tizimda animatsiyani o‘chirganlar uchun muqobil variant bilan.

## Harakat umuman nima uchun kerak

- **Qayta aloqa**: bosish, yuklanish, muvaffaqiyatli saqlash.
- **Yo‘nalish**: ekranlar orasidagi o‘tish foydalanuvchi ierarxiyaning qayerida ekanini ko‘rsatadi.
- **Elementlar aloqasi**: kartochka batafsil sahifaga ochiladi — bu o‘sha obyekt ekani aniq.
- **Diqqat**: yangi bildirishnoma yoki xatoga nazarni ehtiyotkorlik bilan jalb qilish.
- **Brend xarakteri** — faqat yuqoridagilar ustiga, ularning o‘rniga emas.

## Davomiylik

Universal aniq qiymatlar yo‘q, lekin ishchi mo‘ljallar bor:

| Harakat turi | Mo‘ljal |
|---|---|
| Mikro-o‘zaro ta’sirlar: hover, bosish, toggle | taxminan 100–200 ms |
| Kichik elementlar paydo bo‘lishi: tooltip, menyu | taxminan 150–250 ms |
| Katta o‘tishlar: modal oyna, ekran almashishi | taxminan 250–400 ms |
| Murakkab sahnalar, onboarding | uzoqroq, lekin interfeysni bloklamasdan |

Tanlash qoidalari:

- element bosib o‘tadigan **masofa** va maydon qanchalik katta bo‘lsa, animatsiya shunchalik uzoq;
- **yo‘qolish** odatda paydo bo‘lishdan biroz tezroq;
- mobil ekranlarda harakatlar katta monitorlarga qaraganda qisqaroq;
- tez-tez bajariladigan amallar eng tez animatsiyalanishi kerak — ular yuzlab marta ko‘riladi.

## Easing

Haqiqiy dunyoda obyektlar harakatni bir zumda boshlamaydi va to‘xtatmaydi, shuning uchun **linear** mexanik ko‘rinadi. U shaffoflik, cheksiz loader’lar va progress indikatorlari uchun mos.

- **ease-out** (oxirida sekinlashish) — paydo bo‘lish uchun: element tez kirib, yumshoq to‘xtaydi.
- **ease-in** (tezlashish) — ekrandan chiqish uchun: element tezlashib, yo‘qoladi.
- **ease-in-out** — ekran ichida bir nuqtadan boshqasiga ko‘chish uchun.
- **spring** — inersiya muhim bo‘lgan imo-ishoralar va sudrab olib o‘tish uchun prujina fizikasi.

Kodda egri chiziqlar `cubic-bezier()` orqali beriladi. Har bir maketdagi tasodifiy qiymatlar o‘rniga dizayn tizimida 3–4 ta nomlangan egri chiziq yarating.

## Xoreografiya

Bir nechta element harakatlanganda tartib kerak:

- bir vaqtda **bitta diqqat nuqtasi** — asosiy harakat yetakchi, qolganlari qo‘llab-quvvatlaydi;
- **stagger** — ro‘yxat elementlari orasidagi kichik kechikish ketma-ketlikni ko‘rsatadi, lekin umumiy davomiylik cheksiz o‘smasligi kerak;
- **yagona yo‘nalish** — elementlar navigatsiyaga mos ravishda keladi va ketadi;
- **shared element** — umumiy element ekranlar orasida «oqib o‘tadi» va ularni bog‘laydi.

## Reduced motion

Ba’zi foydalanuvchilar tizimda harakatni kamaytirish sozlamasini yoqadi: kimdadir animatsiya noqulaylik yoki bosh aylanishini keltirib chiqaradi. Buni hurmat qiling: siljish va masshtablashni yumshoq shaffoflik o‘zgarishi bilan almashtiring, parallaks va avtomatik ijroni o‘chiring.

```css
:root {
  --motion-fast: 150ms;
  --motion-base: 250ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

.panel {
  transition: transform var(--motion-base) var(--ease-out),
              opacity var(--motion-base) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .panel { transition: opacity var(--motion-fast) linear; }
}
```

## Animatsiyani dasturchilarga qanday topshirish kerak

«Shunday bo‘lishi kerak» degan video yetarli emas. Har bir animatsiya uchun quyidagilarni ko‘rsating:

1. **Trigger** — uni nima ishga tushiradi.
2. **Xususiyatlar** — nima va qaysi qiymatdan qaysi qiymatga o‘zgaradi (pozitsiya, masshtab, shaffoflik).
3. **Davomiylik va kechikish** — millisekundlarda yoki token bilan.
4. **Easing** — nomlangan egri chiziq yoki `cubic-bezier`.
5. **To‘xtatilish** — animatsiya vaqtida foydalanuvchi qayta bossa nima bo‘ladi.
6. **Reduced motion uchun variant**.

Figma’dagi prototip yoki video hissiyotni, parametrlar jadvali esa aniqlikni yetkazadi. Iloji bo‘lsa, `transform` va `opacity`ni animatsiya qiling: brauzer ularni o‘lcham va oraliqlarni o‘zgartirishdan ko‘ra samaraliroq qayta ishlaydi.

## FAQ

### B2B va boshqaruv interfeyslarida animatsiya kerakmi?

Ha, lekin vazmin: qayta aloqa, silliq ochilishlar, o‘tishlar. Odamlar bunday tizimlarda soatlab ishlaydi, shuning uchun bezak harakati tezda jonga tegadi.

### Maketda silliq bo‘lgan animatsiya nega «qotadi»?

Ko‘pincha kenglik, balandlik yoki soya kabi og‘ir xususiyatlar animatsiya qilinadi yoki bir vaqtda juda ko‘p element harakatlanadi. `transform` va `opacity`ga o‘ting va parallel harakatlar sonini kamaytiring.

### prefers-reduced-motion’da animatsiyani butunlay o‘chirsa bo‘ladimi?

Bo‘ladi, lekin harakatni yumshoq shaffoflik o‘zgarishi bilan almashtirgan ma’qul: qayta aloqa va o‘zgarishlarni tushunish saqlanadi, noqulaylik esa yo‘qoladi.
