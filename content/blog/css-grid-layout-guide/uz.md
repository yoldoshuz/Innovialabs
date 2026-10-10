---
title: CSS Grid: asoslardan haqiqiy maketlargacha qo‘llanma
description: Treklar, fr birligi, nomlangan sohalar, auto-fit va minmax, noaniq setka hamda CSS Grid’da moslashuvchan maket va galereyani bosqichma-bosqich yig‘ish.
summary: CSS Grid elementlarni bir vaqtda qatorlar va ustunlar bo‘yicha joylashtiradi: konteynerda setka treklarini tasvirlaysiz, elementlar esa kataklarga yoki nomlangan sohalarga tushadi — sahifa maketlari uchun eng qulay usul.
---

## CSS Grid nima

**CSS Grid** — ikki o‘lchamli joylashtirish tizimi: u **qatorlar va ustunlarni bir vaqtda** boshqaradi. Flexbox elementlarni bitta chiziqqa tizadi, Grid esa ularni kataklardan iborat jadvalga joylaydi va uni HTML’ni o‘zgartirmasdan qayta qurish mumkin.

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}
```

Bu yerda ikkita ustun: birinchisi 200px, ikkinchisi qolgan joyni egallaydi. Konteynerning bevosita bolalari kataklarga avtomatik taqsimlanadi.

## Asosiy tushunchalar

| Tushuncha | Bu nima |
|---|---|
| **Trek** | Setkaning qatori yoki ustuni |
| **Chiziq** | Treklar orasidagi chegara, 1 dan raqamlanadi |
| **Katak** | Qator va ustun kesishmasi |
| **Soha** | Bir nechta katakdan iborat to‘rtburchak |
| **`gap`** | Treklar orasidagi oraliq |

## fr birligi

`fr` — konteynerdagi **bo‘sh joy** ulushi. `1fr 2fr` qat’iy o‘lchamlar va `gap` ayirilgandan keyin joyni 1:2 nisbatda bo‘ladi.

```css
grid-template-columns: 240px 1fr 1fr;
```

Birinchi ustun qat’iy, qolgan ikkitasi qoldiqni teng bo‘ladi. Takrorlarni `repeat()` bilan yozish qulay:

```css
grid-template-columns: repeat(4, 1fr);
```

## Elementlarni chiziqlar bo‘yicha joylashtirish

Chiziqlarni ko‘rsatib, elementni bir nechta trekka cho‘zish mumkin:

```css
.wide {
  grid-column: 1 / 3;  /* 1-chiziqdan 3-chiziqqacha: ikki ustun */
}
.tall {
  grid-row: span 2;    /* ikkita qatorni egallash */
}
```

`-1` aniq setkaning oxirgi chizig‘ini bildiradi, shuning uchun `grid-column: 1 / -1` elementni butun kenglikka cho‘zadi.

## Nomlangan sohalar

`grid-template-areas` maketni to‘g‘ridan-to‘g‘ri CSS’da chizish imkonini beradi:

```css
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }
.page > main   { grid-area: main; }
.page > footer { grid-area: footer; }
```

Kod sahifa sxemasi kabi o‘qiladi, maketni esa faqat sohalar qatorlarini o‘zgartirib qayta qurish mumkin.

## auto-fit va minmax: media so‘rovlarsiz moslashuvchanlik

```css
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

Brauzer nechta ustun sig‘ishini o‘zi hal qiladi: har biri 240px’dan tor emas va bo‘sh joy ulushigacha cho‘ziladi. Tor ekranda — bitta ustun, keng ekranda — to‘rtta yoki undan ko‘p.

- **`auto-fit`** bo‘sh ustunlarni yig‘ib qo‘yadi va elementlar butun kenglikka cho‘ziladi.
- **`auto-fill`** bo‘sh ustunlarni saqlaydi va elementlar o‘z o‘lchamida qoladi.

## Noaniq setka

Agar elementlar tasvirlangan setkadagi kataklardan ko‘p bo‘lsa, Grid **noaniq** (implicit) qatorlar yaratadi. Ularning o‘lchamini `grid-auto-rows` belgilaydi:

```css
.grid {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(160px, auto);
}
```

Har bir yangi qator 160px’dan past bo‘lmaydi va kontent ko‘p bo‘lsa, o‘sadi.

## Bosqichma-bosqich: moslashuvchan sahifa maketi

1. Mobil versiyani tasvirlang — hammasi bitta ustunda:

```css
.page {
  display: grid;
  gap: 16px;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
}
```

2. Keng ekranda sohalarni qayta joylang:

```css
@media (min-width: 900px) {
  .page {
    grid-template-columns: 1fr 280px;
    grid-template-areas:
      "header header"
      "main sidebar"
      "footer footer";
  }
}
```

3. Yuqoridagi misoldagidek elementlarga `grid-area` belgilang. HTML o‘zgarmaydi.

## Bosqichma-bosqich: kartochkalar galereyasi

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.gallery img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

Kartochkalar ekran kengligiga qarab o‘zi qayta joylashadi, `aspect-ratio` esa rasmlarni bir xil saqlaydi.

## Ko‘p uchraydigan xatolar

- **Uzun kontentli `1fr`.** `1fr`’ning minimumi `auto` ga teng, keng kontent ustunni kengaytirib yuboradi. `minmax(0, 1fr)` ishlating.
- **Sohalar mos kelmasligi.** `grid-template-areas`’dagi har bir qatorda ustunlar soni bir xil bo‘lishi, soha esa to‘rtburchak bo‘lishi kerak.
- **Hamma narsa uchun Grid.** Oddiy tugmalar qatori uchun Flexbox soddaroq.
- **Vizual tartib va HTML tartibi.** Sohalarni qayta joylash klaviatura va screen reader uchun o‘qish tartibini o‘zgartirmaydi.

Batafsil ma’lumot [MDN hujjatlarida](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout).

## FAQ

### Grid yoki Flexbox — qaysi birini tanlash kerak?

Qatorlar ham, ustunlar ham muhim bo‘lsa — Grid: sahifa maketi, galereya, dashboard. Bir o‘lchamli vazifalar uchun — Flexbox: navigatsiya, tugmalar qatori, kartochka ichida tekislash. Ko‘pincha sahifa setkasi Grid’da, bloklar ichi esa Flexbox’da bo‘ladi.

### Grid ishlatganda media so‘rovlar kerakmi?

Galereyalar uchun ko‘pincha `repeat(auto-fit, minmax(...))` yetarli. Sahifa maketini qayta qurish, masalan yon ustunni ko‘chirish uchun media so‘rovlar hamon qulay.

### Brauzerlar CSS Grid’ni qo‘llab-quvvatlaydimi?

Grid’ning asosiy imkoniyatlari barcha zamonaviy brauzerlarda qo‘llab-quvvatlanadi. Yangi funksiyalar uchun MDN’dagi moslik jadvallarini tekshiring.
