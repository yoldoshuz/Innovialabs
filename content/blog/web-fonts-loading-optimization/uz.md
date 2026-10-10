---
title: 'Veb-shriftlar: tez va sakrashlarsiz qanday ulash mumkin'
description: Veb-shriftlarni tez ulash: WOFF2, font-display, preload, kirill va lotin subsetlari, o‘z serverida saqlash va zaxira shrift metrikalarini sozlash.
summary: Shriftlarni o‘z domeningizdan WOFF2 formatida bering, ularni unicode-range bo‘yicha qismlarga ajrating, faqat asosiy faylni preload qiling, font-display tanlang va zaxira shrift metrikalarini moslang — matn darhol chiqadi, sahifa sakramaydi.
---

## Qisqa javob

Shriftlar saytni ikki yo‘l bilan sekinlashtiradi: matn **uzoq vaqt ko‘rinmaydi**, shrift yuklanganda esa qatorlar **eni va balandligini o‘zgartiradi** va sahifa sakraydi (bu CLS metrikasini yomonlashtiradi). Retsept:

1. **WOFF2** formati.
2. **Subsetting**: faqat kerakli belgilar, kirill va lotin alohida fayllarda.
3. O‘z domeningizda **self-hosting**.
4. Bir-ikkita asosiy fayl uchun **preload**.
5. Vazifaga mos **font-display**.
6. Almashinuv sezilmasligi uchun zaxira shrift **metrikalarini moslash**.

## WOFF2 va kamroq yozuv turlari

WOFF2 eski formatlarga qaraganda yaxshiroq siqadi va barcha zamonaviy brauzerlarda ishlaydi. Endi TTF yoki EOT ulash shart emas.

Asosiy tejash — fayllar sonida. Har bir yozuv turi (400, 500, 700, kursiv) alohida yuklanadi. Agar shrift **variable font** ko‘rinishida bo‘lsa, bitta fayl bir nechta qalinlikni almashtiradi. Dizaynni tekshiring: ko‘pincha ikki-uchta qalinlik yetarli.

## Subsetting: kirill va lotin

To‘liq shriftda grek, vyetnam alifbolari, turli belgilar va saytingizga kerak bo‘lmagan boshqa narsalar bor. Uni qismlarga bo‘ling va **unicode-range** ko‘rsating — brauzer faylni faqat sahifada shu belgilar bo‘lsa yuklaydi.

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+2000-206F;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-cyrillic.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

O‘zbek lotin yozuvi uchun ‘ va ’ belgilarini (U+2018, U+2019) tekshiring — ular diapazonlardan biriga tushishi kerak. Fayllarni fonttools paketidagi `pyftsubset` utilitasi bilan kesish mumkin.

## Self-hosting yoki Google Fonts

| | O‘z domeningiz | Google Fonts |
|---|---|---|
| Ulanishlar | Ortiqchasi yo‘q | CSS va fayllar uchun alohida domenlar |
| Saytlararo kesh | Yo‘q | Bu yerda ham yo‘q: brauzerlar keshni sayt bo‘yicha ajratadi |
| Nazorat | To‘liq: subsetlar, preload, sarlavhalar | Cheklangan |
| Maxfiylik | So‘rovlar uchinchi tomonga ketmaydi | So‘rovlar tashqi xizmatga ketadi |

Ilgari Google Fonts foydasiga umumiy kesh dalil edi, lekin zamonaviy brauzerlar keshni saytlar bo‘yicha ajratadi va bu ustunlik yo‘qoldi. Shuning uchun ko‘pincha **shriftlarni o‘zingizda saqlash** foydaliroq. Frameworklar buni avtomatik qila oladi: masalan, `next/font` shriftlarni build paytida yuklab olib, ularni sizning domeningizdan beradi.

## preload: aniq nishonga

```html
<link rel="preload" href="/fonts/inter-cyrillic.woff2"
      as="font" type="font/woff2" crossorigin>
```

- **crossorigin atributi majburiy**, hatto o‘z domeningiz uchun ham, aks holda fayl ikki marta yuklanadi.
- **Bir-ikkita faylni** preload qiling: asosiy matn va ehtimol sarlavhalar. Hammasini preload qilish CSS va rasmlar bilan raqobatlashadi.

## font-display: qaysi birini tanlash

- **swap** — matn darhol zaxira shriftda chiqadi, keyin almashtiriladi. Asosiy matn uchun yaxshi, lekin metrikalar moslanmasa sakrash beradi.
- **optional** — shrift juda qisqa vaqt ichida ulgurmasa, brauzer zaxira shriftda qoladi. Sakrash yo‘q, ammo birinchi tashrifda brend shrifti ko‘rinmasligi mumkin.
- **fallback** — ular orasidagi murosa.
- **block** — shrift yuklanguncha matnni yashiradi. Asosiy matn uchun deyarli hech qachon kerak emas.

## Zaxira shrift metrikalarini moslash

Sakrash Arial va sizning shriftingizda harflar eni va qator balandligi turlicha bo‘lgani uchun yuz beradi. “Moslangan” zaxira shrift yarating:

```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: "Inter", "Inter Fallback", sans-serif;
}
```

Yuqoridagi qiymatlar — misol: har bir shrift uchun ular uning metrikalari asosida hisoblanishi kerak. Buni Fontaine yoki Capsize kabi vositalar qiladi, `next/font` esa bunday fallback’ni o‘zi yaratadi.

## Ko‘p uchraydigan xatolar

- Shriftni CSS ichida `@import` orqali ulash — bu ortiqcha ketma-ket so‘rov.
- Ikkitasi ishlatilsa ham oltita yozuv turini yuklash.
- preload’da `crossorigin`ni unutish.
- Shriftlarni uzoq keshlashsiz berish: nomida xeshi bor fayllarni uzoq muddat keshlash mumkin.

## FAQ

### Tizim shriftlari bilan cheklansa bo‘ladimi?

Ha. Tizim shriftlari umuman yuklanishni talab qilmaydi va eng tez variant. Agar brend muayyan shriftni talab qilmasa, bu oqilona tanlov.

### preload qilgan bo‘lsam ham nega shrift miltillaydi?

Odatda `crossorigin` yo‘qligi, noto‘g‘ri yo‘l yoki sahifaga kerak bo‘lmagan subset preload qilingani sababli. Network bo‘limini tekshiring: fayl bir marta va erta yuklanishi kerak.

### O‘zbekcha matn uchun alohida subset kerakmi?

O‘zbek lotin yozuvi deyarli to‘liq asosiy lotin bilan qoplanadi, lekin ‘ va ’ apostroflarini tekshiring va ular shriftda hamda tanlangan unicode-range’da borligiga ishonch hosil qiling.
