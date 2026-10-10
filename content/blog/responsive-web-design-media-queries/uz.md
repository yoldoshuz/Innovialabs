---
title: Moslashuvchan maket: media so‘rovlar, breakpoint’lar va mobile first
description: Moslashuvchan sayt qanday qilinadi: viewport meta, mobile first yondashuvi, breakpoint tanlash, clamp() bilan fluid shriftlar va container queries.
summary: Moslashuvchan maket viewport tegi va mobil uchun bazaviy stillardan boshlanadi, media so‘rovlar esa katta ekranlar uchun qoidalar qo‘shadi. Breakpoint kontent buziladigan joyga qo‘yiladi, shriftlar clamp() orqali, komponentlar container queries orqali moslashadi.
---
## Mohiyati bir abzasda

Moslashuvchan sayt — ekran kengligiga moslashadigan bitta maket. U uchta narsaga tayanadi: **viewport tegi**, **egiluvchan o‘lchamlar** (foizlar, `fr`, `clamp()`) va ma’lum kengliklarda joylashuvni o‘zgartiradigan **media so‘rovlar**. Eng ishonchli tartib — **mobile first**: avval tor ekran uchun stillar, keyin keng ekranlar uchun qo‘shimchalar.

## 1-qadam. Viewport tegi

Usiz mobil brauzer sahifani desktop sifatida chizadi va kichraytiradi. Media so‘rovlar esa kutilganidek ishlamaydi.

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

`user-scalable=no` orqali kattalashtirishni taqiqlamang — bu matnni kattalashtirishi kerak bo‘lgan odamlarga xalaqit beradi.

## 2-qadam. Mobile first

Bazaviy stillar mobil uchun media so‘rovsiz yoziladi. Katta ekranlar uchun `min-width` orqali qoidalar qo‘shiladi.

```css
.layout {
  display: grid;
  gap: 16px;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 240px 1fr;
  }
}
```

Nima uchun bu yaxshiroq:

- Mobil versiya **sodda** bo‘ladi: bitta ustun, minimal qayta yozishlar.
- Murakkablik bekor qilinmaydi, balki **qo‘shiladi**, shuning uchun CSS qisqaroq.
- Boshidanoq bezak haqida emas, asosiy kontent haqida o‘ylaysiz.

## 3-qadam. Breakpoint’larni qanday tanlash

Aniq telefon modellariga mo‘ljal olishning ma’nosi yo‘q — qurilmalar juda ko‘p. To‘g‘ri yondashuv: **breakpoint kontent buziladigan joyga qo‘yiladi**.

1. Sahifani oching va oynani tordan kengga sekin cho‘zing.
2. Qatorlar juda uzun bo‘lib ketsa, kartochkalarga tor bo‘lsa yoki bo‘shliq paydo bo‘lsa — breakpoint o‘sha yerda kerak.
3. Ularni **oz** saqlang: odatda butun loyiha uchun ikki-to‘rttasi yetadi.
4. Qiymatlarni bir joyda — preprotsessor o‘zgaruvchilarida yoki framework konfigida saqlang.

Agar maket foydalanuvchi shrift o‘lchamini hisobga olishini istasangiz, media so‘rovlarda `em` yoki `rem` ishlating.

## 4-qadam. clamp() bilan fluid shriftlar

Turli breakpoint’larda bir nechta shrift o‘lchami o‘rniga chegaralangan silliq masshtablashni berish mumkin:

```css
h1 {
  font-size: clamp(2rem, 1.2rem + 4vw, 4.5rem);
}
```

`clamp(minimum, istalgan, maksimum)` — sarlavha ekran bilan birga o‘sadi, lekin minimumdan kichik va maksimumdan katta bo‘lmaydi. `vw`’ga `rem` qo‘shish muhim: u brauzerdagi kattalashtirishga javob berishni saqlaydi.

## 5-qadam. Container queries

Media so‘rovlar oyna kengligiga qaraydi, komponent uchun esa ko‘pincha **uning konteyneri kengligi** muhim. Bitta kartochka tor sidebar’da ham, keng asosiy ustunda ham turishi mumkin.

```css
.card-wrap {
  container-type: inline-size;
}

@container (min-width: 420px) {
  .card {
    display: grid;
    grid-template-columns: 160px 1fr;
  }
}
```

Qoida oddiy: **media so‘rovlar — sahifa joylashuvi uchun, container queries — komponentlar uchun**.

## Unutish oson bo‘lgan narsalar

- **Rasmlar**: `max-width: 100%; height: auto;`, turli ekranlar uchun esa `srcset` va `sizes`.
- **Bosish zonalari**: tugma va havolalar barmoq uchun yetarlicha katta bo‘lishi kerak.
- **Hover**: sensorli qurilmalarda kursor olib borish yo‘q, `@media (hover: hover)` orqali tekshiring.
- **Jadvallar**: gorizontal aylantiriladigan konteynerga o‘rang.
- **Ekran balandligi**: mobilda brauzer panellari tufayli `100vh` kutilmagan ishlashi mumkin, buning uchun `dvh` va `svh` birliklari bor.

## Qanday test qilish kerak

1. **DevTools** qurilmalar rejimi tez tekshirish uchun qulay, lekin bu emulyatsiya.
2. **Haqiqiy qurilmalar** — kamida bitta arzon Android va bitta iPhone. Faqat ularda haqiqiy tezlik, shriftlar, klaviatura va imo-ishoralar ko‘rinadi.
3. Faqat ommabop emas, breakpoint’lar **orasidagi kengliklar** ham.
4. **Albom orientatsiyasi va tizimda kattalashtirilgan shrift**.

## FAQ

### Nechta breakpoint kerak?

Kontent qancha talab qilsa, shuncha. Aksariyat saytlarga ikki-to‘rttasi yetadi. Agar ular ko‘payib ketsa, odatda maketni qayta ko‘rib chiqish yoki egiluvchan to‘rlar va container queries’ga o‘tish kerak.

### Mobile first majburiymi?

Yo‘q, lekin u CSS’ni soddalashtiradi va kontent ustuvorliklarini belgilashga majbur qiladi. Loyiha dastlab desktop uchun bo‘lsa, `max-width` orqali desktop first ham ishlaydi — asosiysi, ikkala uslubni bitta faylda aralashtirmang.

### Container queries media so‘rovlarning o‘rnini bosadimi?

Yo‘q, ular bir-birini to‘ldiradi. Media so‘rovlar sahifaning umumiy tuzilishi va qorong‘i mavzu yoki kamaytirilgan animatsiya kabi foydalanuvchi sozlamalari uchun hamon kerak.
