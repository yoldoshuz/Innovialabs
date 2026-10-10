---
title: Saytga qorong‘i mavzuni qanday to‘g‘ri qo‘shish kerak
description: Qorong‘i mavzu to‘g‘ri usulda: CSS o‘zgaruvchilari, prefers-color-scheme, tanlovni eslab qoluvchi tugma va yuklanishda yorug‘ mavzu chaqnashisiz.
summary: Ranglarni CSS o‘zgaruvchilari orqali belgilang, standart holatda prefers-color-scheme bo‘yicha tizim mavzusiga amal qiling, foydalanuvchi tanlovini localStorage’da saqlang va uni sahifa chizilishidan oldin head’dagi kichik skript bilan qo‘llang.
---

## Qisqa javob

To‘g‘ri qorong‘i mavzu uchta narsaga tayanadi:

- Barcha ranglar uchun **CSS o‘zgaruvchilari** (custom properties) — mavzu yuzlab qoidalarni emas, o‘zgaruvchilar qiymatini almashtiradi.
- **prefers-color-scheme** — standart holatda sayt operatsion tizim sozlamasiga ergashadi.
- Tanlovni saqlaydigan **qo‘lda almashtirgich** va mavzuni birinchi chizilishdan oldin qo‘llaydigan `<head>` ichidagi skript. Aks holda foydalanuvchi yorug‘ mavzuning chaqnashini ko‘radi.

## 1-qadam. Ranglar token sifatida

Komponentlar ichida `color: #1a1033` deb yozmang. Semantik o‘zgaruvchilar yarating: fon, matn, xira matn, chegara, aksent.

```css
:root {
  --bg: #ffffff;
  --text: #1a1033;
  --muted: #5f5873;
  --border: #e4e0ee;
  --accent: #7c3aed;
  color-scheme: light;
}

:root[data-theme="dark"] {
  --bg: #120b24;
  --text: #ede9fe;
  --muted: #a39cb8;
  --border: #2c2343;
  --accent: #a78bfa;
  color-scheme: dark;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**color-scheme** xususiyati brauzerga standart elementlarni — scrollbar, input, checkbox’larni qayta bo‘yashni bildiradi. Usiz qorong‘i fonda yorug‘ nativ boshqaruv elementlari qolib ketadi.

## 2-qadam. Standart holatda tizim mavzusi

Foydalanuvchi hali hech narsa tanlamagan bo‘lsa, tizim sozlamasini hurmat qiling. Qulay sxema: `data-theme` atributi faqat qo‘lda tanlanganda qo‘yiladi, usiz esa media so‘rov ishlaydi.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #120b24;
    --text: #ede9fe;
    /* qorong‘i mavzuning qolgan o‘zgaruvchilari */
    color-scheme: dark;
  }
}
```

Shunday qilib uchta holat paydo bo‘ladi: **tizim**, **yorug‘**, **qorong‘i**. Bu tizimga ergashishni butunlay o‘chirib qo‘yadigan ikki holatli tugmadan adolatliroq.

## 3-qadam. Tanlovni eslab qoluvchi almashtirgich

```js
function setTheme(theme) {
  // theme: "light" | "dark" | "system"
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
}
```

`localStorage`ga murojaatni `try/catch` ichiga oling: maxfiy rejimda yoki sayt ma’lumotlari bloklanganda u xato chiqarishi mumkin.

## 4-qadam. Yuklanishdagi chaqnashni yo‘qotamiz

Agar mavzu asosiy JavaScript yuklangandan keyin qo‘llansa, sahifa avval yorug‘ chiziladi, keyin keskin qorayadi. Yechim — `<head>` ichida, uslublar va kontentdan oldin joylashgan kichik **bloklovchi skript**:

```html
<script>
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
</script>
```

U birinchi chizilishdan oldin bajariladi, shuning uchun chaqnash bo‘lmaydi. React va Next.js’da server foydalanuvchi tanlovini bilmasligini hisobga oling: `<html>` dagi atribut gidratsiyadan oldin o‘zgaradi va framework nomuvofiqlik haqida ogohlantirishi mumkin. Odatda `<html>` ga `suppressHydrationWarning` qo‘yiladi yoki tayyor mavzular kutubxonasi ishlatiladi.

## Ko‘p uchraydigan xatolar

- **Ranglarni `filter: invert()` bilan teskari qilish.** Fotosuratlar, logotiplar va brend ranglari buziladi.
- **Sof qora fon va sof oq matn.** Juda yuqori kontrast ko‘zni charchatadi; chuqur to‘q ton va biroz yumshatilgan yorug‘ matn yaxshiroq o‘qiladi.
- **Soyalarni unutish.** Qorong‘i fonda soyalar deyarli ko‘rinmaydi — chuqurlikni yorug‘roq yuzalar orqali bering.
- **Kontrastni tekshirmaslik.** Xira matn va aksent tugmalar qorong‘i mavzuda ko‘pincha WCAG talablaridan o‘tmaydi.
- **Rasmlar va grafiklarni unutish.** Oq fonli illyustratsiyalarga alohida versiya yoki taglik, grafiklarga esa o‘z ranglari kerak.

## Relizdan oldingi chek-list

- Komponentlardagi barcha ranglar o‘zgaruvchilar orqali o‘tadi.
- Ikkala mavzu uchun `color-scheme` belgilangan.
- Qo‘lda tanlov bo‘lmasa, sayt tizimga ergashadi.
- Tanlov saqlanadi va chaqnashsiz qo‘llanadi.
- Matn, havolalar, tugmalar va fokus holatlari uchun kontrast tekshirilgan.
- Logotip, ikonkalar va rasmlar ikkala fonda ham o‘qiladi.

## FAQ

### Qorong‘i mavzu majburiymi?

Yo‘q. Bu talab emas, qulaylikni yaxshilash. Lekin uni qilsangiz, to‘liq bo‘lishi kerak: o‘qib bo‘lmaydigan bloklari bor chala qorong‘i mavzu umuman yo‘qligidan yomonroq.

### Tanlovni qayerda saqlash kerak: localStorage yoki cookie?

Statik sayt uchun localStorage va head’dagi skript yetarli. Cookie server HTML’ni o‘zi render qilib, mijoz skriptisiz darhol to‘g‘ri mavzuni berishni xohlaganda foydali.

### Qorong‘i mavzu uchun alohida brend ranglari kerakmi?

Ko‘pincha ha. Oq fonda yaxshi ishlaydigan to‘yingan aksent qorong‘i fonda juda to‘q yoki o‘ta “baqiroq” ko‘rinishi mumkin. Odatda brend palitrasidagi xuddi shu rangning yorug‘roq tusi ishlatiladi.
