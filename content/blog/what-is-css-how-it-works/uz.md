---
title: CSS nima: selektorlar, kaskad va spetsifiklik
description: Brauzer CSS’ni qanday qo‘llaydi: selektorlar, kaskad, spetsifiklik, meros olish va box model — darhol ishga tushirsa bo‘ladigan qisqa misollarda.
summary: CSS — bezash tili: selektor elementlarni tanlaydi, qoida uslublarni belgilaydi, ziddiyatda esa spetsifikligi yuqoriroq yoki teng bo‘lsa, kodda keyinroq yozilgan e’lon g‘olib bo‘ladi.
---

## CSS nima va u qanday ishlaydi

**CSS** (Cascading Style Sheets) HTML elementlari qanday ko‘rinishini tasvirlaydi: ranglar, shriftlar, oraliqlar, joylashuv. HTML tuzilma uchun, CSS esa tashqi ko‘rinish uchun javob beradi.

Har bir qoida **selektor** va **e’lonlardan** iborat:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

`p` — selektor (barcha paragraflar), `color: #333` — “xususiyat: qiymat” ko‘rinishidagi e’lon. Brauzer HTML’ni o‘qiydi, elementlar daraxtini quradi, har biri uchun mos qoidalarni topadi va yakuniy uslublarni hisoblaydi.

## Asosiy selektorlar

| Selektor | Misol | Nimani tanlaydi |
|---|---|---|
| Teg bo‘yicha | `p` | Barcha paragraflar |
| Klass bo‘yicha | `.card` | `class="card"` bo‘lgan elementlar |
| Id bo‘yicha | `#logo` | `id="logo"` bo‘lgan element |
| Atribut bo‘yicha | `[type="email"]` | Shu turdagi maydonlar |
| Avlod | `.card p` | `.card` ichidagi paragraflar |
| To‘g‘ridan-to‘g‘ri avlod | `ul > li` | Faqat bevosita `li` elementlari |
| Psevdoklass | `a:hover` | Kursor ostidagi havola |

Amalda vyorstkaning asosi — **klasslar**. Ular qayta ishlatiladi va spetsifiklik bilan muammo tug‘dirmaydi.

## Kaskad: qoidalar bir nechta bo‘lsa nima bo‘ladi

Bitta elementga ko‘pincha bir xil xususiyatli bir nechta qoida mos keladi. Brauzer ziddiyatni quyidagi tartibda hal qiladi:

1. **Manba va muhimlik.** Sayt muallifi uslublari brauzerning standart uslublarini bekor qiladi. `!important` e’lon ustuvorligini oshiradi.
2. **Spetsifiklik.** Aniqroq selektor g‘olib bo‘ladi.
3. **Koddagi tartib.** Spetsifiklik teng bo‘lsa, keyinroq e’lon qilingan qoida g‘olib.

```css
.title { color: blue; }
.title { color: red; } /* g‘olib: keyinroq e’lon qilingan */
```

## Spetsifiklik oddiy so‘zlar bilan

Spetsifiklik uchta son sifatida hisoblanadi: **id — klasslar — teglar**.

| Selektor | Spetsifiklik |
|---|---|
| `p` | 0-0-1 |
| `.card p` | 0-1-1 |
| `.card .title` | 0-2-0 |
| `#main .title` | 1-1-0 |

Taqqoslash chapdan o‘ngga boradi: bitta id istalgan miqdordagi klassdan kuchli. “Klasslar”ga atributlar va psevdoklasslar ham kiradi, “teglar”ga esa `::before` kabi psevdoelementlar. `style="..."` inlayn uslubi har qanday selektordan kuchli.

```html
<p id="intro" class="lead">Matn</p>
```

```css
#intro { color: green; } /* 1-0-0, g‘olib */
.lead  { color: blue; }  /* 0-1-0 */
p      { color: gray; }  /* 0-0-1 */
```

## Meros olish

Ba’zi xususiyatlar ota elementdan **meros olinadi**: `color`, `font-family`, `font-size`, `line-height`. Shuning uchun shriftni `body`’da berish kifoya.

Boshqalari meros olinmaydi: `margin`, `padding`, `border`, `background`, `width`. Qiymatni majburan meros olish uchun `inherit` ishlatiladi:

```css
button { font: inherit; }
```

## Box model

Har bir element to‘rt qatlamli to‘rtburchak: **content** (kontent), **padding** (ichki oraliq), **border** (ramka), **margin** (tashqi oraliq).

Standart holatda `width` faqat kontent kengligini belgilaydi, padding va border esa ustiga qo‘shiladi. Shuning uchun `width: 300px; padding: 20px` blok aslida 340px egallaydi. Ko‘pchilik loyihalar bu xatti-harakatni o‘zgartiradi:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Endi `width` padding va border’ni o‘z ichiga oladi va o‘lchamlarni hisoblash osonlashadi.

## Ko‘p uchraydigan xatolar

- **`!important` bilan kurashish.** Bu ziddiyatni vaqtincha o‘chiradi, lekin keyingi `!important`’ni yana bekor qilishga to‘g‘ri keladi. Selektorlarni soddalashtirgan ma’qul.
- **Id bo‘yicha bezash.** Yuqori spetsifiklik keyin uslublarni qayta belgilashga xalaqit beradi.
- `.page .content .list .item a` kabi **uzun zanjirlar**. Ular mo‘rt va belgilashga bog‘liq.
- **Unutilgan `box-sizing`**, shu sababli bloklar setkaga sig‘maydi.

Qaysi qoida qo‘llanganini DevTools’dagi Styles bo‘limi ko‘rsatadi: chizib tashlangan e’lonlar kaskadda yutqazgan. To‘liq ma’lumotnoma — [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS)da.

## FAQ

### CSS’ni qayerda yozish kerak — alohida faylda yoki HTML’da?

Odatda `<link rel="stylesheet">` orqali ulangan alohida faylda. Shunda uslublar keshlanadi va barcha sahifalarda qayta ishlatiladi. Inlayn uslublarni kamdan-kam nuqtaviy holatlar uchun qoldiring.

### Nega mening uslubim qo‘llanmayapti?

Ko‘pincha uni spetsifikligi yuqoriroq yoki keyinroq e’lon qilingan qoida bekor qiladi. DevTools’ni oching, elementni tanlang va qaysi e’lon chizib tashlanganini hamda uni nima yutganini ko‘ring.

### Tailwind yoki Bootstrap bo‘lsa, CSS o‘rganish kerakmi?

Ha. Freymvorklar oddiy CSS hosil qiladi, kaskad, box model va spetsifiklikni tushunmasdan vyorstka nega kutilmagan tarzda ishlayotganini aniqlash qiyin.
