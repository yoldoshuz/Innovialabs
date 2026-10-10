---
title: Flexbox yoki CSS Grid: qachon qaysi birini ishlatish kerak
description: Flexbox CSS Grid’dan nimasi bilan farq qiladi, bir va ikki o‘lchamli joylashuv orasida qanday tanlash va ikkalasini qachon birga ishlatish kerak.
summary: Flexbox elementlarni bitta yo‘nalishda — qator yoki ustunda joylashtiradi, Grid esa qatorlar va ustunlarni bir vaqtda boshqaradi. Komponentlar uchun ko‘pincha Flexbox, sahifa karkasi va to‘rlar uchun Grid mos, ular birga yaxshi ishlaydi.
---
## Qisqa javob

**Flexbox** — bir o‘lchamli joylashuv: elementlar bitta o‘q bo‘ylab, qator yoki ustun bo‘lib tiziladi. O‘lcham kontentdan kelib chiqadi, konteyner esa bo‘sh joyni taqsimlaydi.

**CSS Grid** — ikki o‘lchamli joylashuv: siz qatorlar va ustunlarni belgilaysiz, elementlar shu to‘rning kataklariga joylashadi. Avval struktura, keyin kontent.

Amaliy qoida: **bitta chiziq bo‘ylab tekislash muhim bo‘lsa — Flexbox, elementlar ham gorizontal, ham vertikal bo‘yicha mos tushishi kerak bo‘lsa — Grid**.

## Asosiy farq: content-first va layout-first

- Flexbox’da element o‘lchami kontentdan «o‘sadi». Turli uzunlikdagi uchta tugma turli kenglikni egallaydi va bu normal holat.
- Grid’da o‘lchamlarni konteyner belgilaydi. Katalogdagi kartochkalar matni har xil bo‘lsa ham bir xil kenglikda bo‘ladi.

Shuning uchun maketdan oldin bitta savol bering: **bu yerda kim asosiy — kontentmi yoki to‘rmi?**

## Taqqoslash

| Mezon | Flexbox | CSS Grid |
|---|---|---|
| Yo‘nalish | bitta o‘q | ikki o‘q |
| Mantiq | kontentdan | to‘rdan |
| Qatorga ko‘chish | `flex-wrap`, qatorlar mustaqil | ustunlar barcha qatorlarda tekis |
| Elementlarni ustma-ust qo‘yish | noqulay | bir xil kataklar orqali |
| Odatiy vazifalar | menyu, tugmalar, toolbar, markazlash | sahifa karkasi, galereya, katalog, formalar |

## Flexbox’ni qachon tanlash kerak

- **Navigatsiya va toolbar’lar**: chapda logo, o‘ngda menyu.
- **Tugmalar guruhi, teglar, ikonka + matn**.
- Bitta elementni **markazlash**.
- **Bitta element cho‘ziladigan qator**, qolganlari esa faqat kerakli joyni egallaydi.

```css
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.toolbar .search {
  flex: 1; /* qolgan barcha joyni egallaydi */
}
```

## CSS Grid’ni qachon tanlash kerak

- **Sahifa karkasi**: header, sidebar, kontent, footer.
- Kartochkalar tekis qatorlarda turishi kerak bo‘lgan **katalog va galereyalar**.
- Yozuv va maydonlari tekislangan **formalar**.
- Matnni rasm ustiga `position: absolute`’siz **qo‘yish**.

Media so‘rovlarsiz moslashuvchan kartochkalar to‘ri:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
```

## Eng yaxshi variant — birgalikda

Odatda eng toza maket ikkala vositani turli darajada ishlatadi:

1. **Grid karkasni quradi**: sahifa, bo‘limlar, kartochkalar to‘ri.
2. **Flexbox katak ichidagi kontentni joylashtiradi**: kartochka ichida sarlavha, narx va tugma.

```css
.card {
  display: flex;
  flex-direction: column;
}
.card .button {
  margin-top: auto; /* tugma barcha kartochkalarda pastga yopishadi */
}
```

Yana bir foydali usul — **subgrid**: ichki to‘r ota-elementning chiziqlarini meros qilib oladi va qo‘shni kartochkalardagi sarlavhalar bir balandlikda tekislanadi. Zamonaviy brauzerlar uni qo‘llab-quvvatlaydi, lekin auditoriyangiz uchun tekshirib ko‘ring.

## Ko‘p uchraydigan xatolar

- `calc()` kengliklar va manfiy margin’lar bilan **Flexbox’da to‘r qurish** — Grid buni bitta qatorda hal qiladi.
- **Oddiy tugmalar qatori uchun Grid** — ortiqcha murakkablik.
- Ikkala vositada ishlaydigan `gap` o‘rniga **margin bilan oraliq berish**.
- HTML’ni o‘zgartirmasdan `order` yoki Grid joylashuvi orqali **vizual tartibni almashtirish** — bu klaviatura va skrinriderlar uchun tartibni buzadi.

## Bir daqiqada qaror qilish

1. Elementlar bitta chiziqda va o‘lchami kontentga bog‘liqmi? — **Flexbox**.
2. Bir vaqtda tekis qator va ustunlar kerakmi? — **Grid**.
3. Tashqi karkas va ichki kontent bormi? — **Tashqarida Grid, ichkarida Flexbox**.

## FAQ

### Grid Flexbox’ning o‘rnini egalladimi?

Yo‘q. Ular turli vazifalar uchun mo‘ljallangan va ikkalasi ham to‘laqonli standart. Grid Flexbox’ni eskirgan qilmaydi, aksariyat loyihalarda ikkalasi ham ishlatiladi.

### Unumdorlik uchun qaysi biri yaxshiroq?

Odatiy interfeyslarda farq sezilarli emas. Tezlikka qarab emas, joylashuv mazmuniga qarab tanlang: unumdorlikka DOM hajmi va og‘ir animatsiyalar ko‘proq ta’sir qiladi.

### Faqat Grid bilan moslashuvchan maket qilsa bo‘ladimi?

Ha, `auto-fill`, `minmax()` va nomlangan hududlar media so‘rovlarsiz ko‘p narsani qilishga imkon beradi. Lekin kataklar ichidagi kichik komponentlar uchun Flexbox odatda soddaroq va qisqaroq bo‘lib qoladi.
