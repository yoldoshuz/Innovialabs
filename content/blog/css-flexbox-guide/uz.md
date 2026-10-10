---
title: CSS Flexbox: vyorstka misollari bilan to‘liq qo‘llanma
description: Flex-konteyner va flex-elementlarning barcha xususiyatlari misollar bilan va tipik yechimlar: navbar, markazlash, kartochkalar qatori, pastki footer.
summary: Flexbox elementlarni bitta o‘q bo‘ylab joylashtiradi: display: flex bo‘lgan konteyner yo‘nalish, tekislash va oraliqlarni boshqaradi, elementlar esa qanday cho‘zilishi va siqilishini belgilaydi.
---

## Flexbox nima va u qachon kerak

**Flexbox** — CSS’dagi joylashtirish usuli bo‘lib, elementlarni **bitta chiziqqa** tizadi: qator yoki ustun. U navigatsiya, qatordagi tugmalar, markazlash va bir xil balandlikdagi kartochkalar uchun mos.

U ota elementda bitta xususiyat bilan yoqiladi:

```css
.container {
  display: flex;
}
```

Ota element **flex-konteyner**ga, uning bevosita bolalari esa **flex-elementlar**ga aylanadi. Flexbox’da ikkita o‘q bor: **asosiy o‘q** (elementlar shu bo‘ylab joylashadi) va **ko‘ndalang o‘q** (unga perpendikulyar).

## Konteyner xususiyatlari

| Xususiyat | Nima qiladi | Ko‘p ishlatiladigan qiymatlar |
|---|---|---|
| `flex-direction` | Asosiy o‘q yo‘nalishi | `row`, `column`, `row-reverse`, `column-reverse` |
| `flex-wrap` | Yangi qatorga o‘tkazish | `nowrap`, `wrap` |
| `flex-flow` | direction + wrap qisqartmasi | `row wrap` |
| `justify-content` | Asosiy o‘q bo‘yicha tekislash | `flex-start`, `center`, `space-between`, `space-around`, `space-evenly` |
| `align-items` | Ko‘ndalang o‘q bo‘yicha tekislash | `stretch`, `center`, `flex-start`, `flex-end`, `baseline` |
| `align-content` | O‘tkazilgan qatorlarni taqsimlash | `flex-start`, `center`, `space-between` |
| `gap` | Elementlar orasidagi masofa | `16px`, `1rem 2rem` |

Muhim: `flex-direction: column` bo‘lganda o‘qlar o‘rin almashadi va `justify-content` vertikal ishlay boshlaydi.

## Element xususiyatlari

| Xususiyat | Nima qiladi |
|---|---|
| `flex-grow` | Element bo‘sh joyning qancha ulushini oladi (standart 0) |
| `flex-shrink` | Joy yetmaganda qanchalik siqiladi (standart 1) |
| `flex-basis` | Joy taqsimlanishidan oldingi boshlang‘ich o‘lcham |
| `flex` | Qisqartma: grow, shrink, basis |
| `align-self` | Ko‘ndalang o‘q bo‘yicha o‘z tekislanishi |
| `order` | Ko‘rsatish tartibi |

Eng foydali qisqartmalar:

- `flex: 1` — element cho‘ziladi va joyni qo‘shnilari bilan teng bo‘ladi;
- `flex: none` — o‘smaydi ham, siqilmaydi ham;
- `flex: 0 0 200px` — qat’iy 200px kenglik.

## Tipik maketlar

### Navbar: logotip chapda, menyu o‘ngda

```html
<header class="nav">
  <a href="/" class="logo">Logo</a>
  <nav class="menu">
    <a href="/about">Biz haqimizda</a>
    <a href="/contacts">Kontaktlar</a>
  </nav>
</header>
```

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}
.menu {
  display: flex;
  gap: 24px;
}
```

### Blokni markazlash

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

Blok ikkala o‘q bo‘yicha ham aynan o‘rtada turadi.

### Kartochkalar qatori

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 260px;
}
```

Har bir kartochka 260px kenglikka intiladi, qatorni to‘ldirish uchun cho‘ziladi va joy yetmaganda keyingi qatorga o‘tadi. Bir qatordagi kartochkalar standart `align-items: stretch` tufayli bir xil balandlikka ega bo‘ladi.

### Pastga yopishgan footer

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}
main {
  flex: 1;
}
```

`main` barcha bo‘sh joyni egallaydi va footer qisqa sahifada ham pastda qoladi.

## Ko‘p uchraydigan xatolar

- **Xususiyatlar noto‘g‘ri elementda.** `justify-content` konteynerga, `flex: 1` esa elementga yoziladi.
- **Uzun matn joylashuvni buzadi.** Flex-elementlarda standart `min-width: auto` bo‘ladi, uzun so‘z yoki jadval elementning siqilishiga yo‘l qo‘ymaydi. `min-width: 0` yordam beradi.
- **`gap` o‘rniga margin.** `gap` chetdagi elementlarga ortiqcha oraliq qo‘shmaydi.
- **Ikki o‘lchamli setka uchun Flexbox.** Ham qatorlar, ham ustunlar bo‘yicha tekislash kerak bo‘lsa, CSS Grid qulayroq.
- **Ma’noni o‘zgartirish uchun `order`.** U faqat vizual tartibni o‘zgartiradi, klaviatura va screen reader esa HTML’dagi tartib bo‘yicha yuradi.

Xususiyatlarning to‘liq tavsifi [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)da bor.

## FAQ

### Flexbox Grid’dan nimasi bilan farq qiladi?

Flexbox bitta o‘lchamda ishlaydi: qator yoki ustun. Grid esa birdaniga ikkitasida. Navigatsiya va tugmalar qatori uchun odatda Flexbox, sahifa maketi va galereyalar uchun Grid olinadi. Ular ko‘pincha birga ishlatiladi.

### Nega justify-content ishlamayapti?

Xususiyat `display: flex` bo‘lgan konteynerga berilganini va elementlarda bo‘sh joy borligini tekshiring. Agar `flex: 1` bo‘lgan element butun joyni egallab olgan bo‘lsa, taqsimlanadigan narsa qolmaydi.

### Bir xil kenglikdagi ustunlarni qanday qilish mumkin?

Har bir elementga `flex: 1` bering. Agar kontent uzunligi har xil bo‘lsa, uzun matn ustunni cho‘zmasligi uchun `min-width: 0` qo‘shing.
