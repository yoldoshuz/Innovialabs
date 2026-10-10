---
title: Ranglar kontrastini WCAG bo‘yicha qanday tekshirish mumkin
description: AA va AAA darajalarida matn va interfeys elementlari kontrastiga WCAG talablari, tekshirish vositalari, Figma plaginlari va brend ranglarini tuzatish usullari.
summary: WCAG 2 bo‘yicha oddiy matnga kamida 4.5:1 (AA) yoki 7:1 (AAA), katta matnga 3:1 yoki 4.5:1, interfeys elementlari va ma’noli grafikaga 3:1 kontrast kerak; har bir real matn va fon juftligini tekshiring, o‘tmaganini to‘qlashtiring yoki kattalashtiring.
---

## Qisqacha javob

**Kontrast koeffitsiyenti** ikki rangning nisbiy yorqinligini **1:1** (bir xil) dan **21:1** (oq fonda qora) gacha bo‘lgan shkalada solishtiradi. WCAG 2 quyidagi minimumlarni belgilaydi:

| Nima | AA | AAA |
|---|---|---|
| Oddiy matn | 4.5:1 | 7:1 |
| Katta matn | 3:1 | 4.5:1 |
| Interfeys elementlari va grafika | 3:1 | alohida belgilanmagan |

**Katta matn** — oddiy qalinlikda 18 pt (taxminan 24 px) va undan katta yoki qalin (bold) shriftda 14 pt (taxminan 18,5 px) va undan katta. WCAG’ga tayanadigan ko‘pchilik qonun va shartnomalar **AA** darajasini talab qiladi.

Qiymatlar yaxlitlanmaydi: **4.49:1** 4.5:1 talabidan **o‘tmaydi**.

## Aynan nima tekshiruvdan o‘tishi kerak

**Matn (AA uchun 1.4.3, AAA uchun 1.4.6 mezoni):**

- asosiy matn, yozuvlar, ma’noli pleysholderlar, havolalar;
- tugmalar, beyjlar, maslahatlardagi matn;
- rasm va gradiyentlardagi matn — uning ostidagi eng och joyda.

**Matn bo‘lmagan kontrast (1.4.11, AA) — 3:1** qo‘shni ranglarga nisbatan:

- kiritish maydonlari ramkalari, agar maydon chegarasini faqat ramka ko‘rsatsa;
- chekboks va radiotugmalar konturlari, o‘tkazgichlar holatlari;
- **fokus indikatorlari**;
- matnli yozuvsiz ma’no beradigan ikonkalar;
- grafiklarning muhim qismlari: chiziqlar, segmentlar.

**Istisnolar:** nofaol elementlar, sof dekor, logotiplar va brend nomlari, ko‘rinmaydigan matn hamda boshqa muhim mazmunli rasmning bir qismi bo‘lgan matn.

## Koeffitsiyent qanday hisoblanadi

Har bir rang **nisbiy yorqinlik** L ga o‘tkaziladi, so‘ng:

`ratio = (L_ochrog‘i + 0.05) / (L_to‘qrog‘i + 0.05)`

```js
function luminance(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

contrast("#767676", "#ffffff"); // taxminan 4.54 — oddiy matn uchun AA’dan o‘tadi
```

Qo‘lda hisoblash kamdan-kam kerak bo‘ladi, lekin formula «o‘rtacha» kulrang nega ko‘pincha o‘tmasligini tushuntiradi.

## Tekshirish vositalari

**Brauzerda:**

- **WebAIM Contrast Checker**: ikki rangni kiritasiz, koeffitsiyent va har bir daraja bo‘yicha natijani olasiz.
- **Brauzer DevTools**: uslublar panelidagi rang tanlagich tanlangan matn kontrastini ko‘rsatadi.
- **Lighthouse** va **axe DevTools**: butun sahifadagi past kontrastli matnni topadigan avtomatik audit.

**Kompyuterda:**

- TPGi’ning **Colour Contrast Analyser** dasturi: ekrandagi istalgan piksel uchun pipetka, rasm va gradiyentlar uchun qulay.

**Figma’da:**

- **Stark**, **Contrast**, **A11y – Color Contrast Checker** plaginlari tanlangan qatlamlar yoki butun freymlarni tekshiradi.
- Ish tartibi: faqat tayyor ekranlarni emas, kutubxonadagi komponent holatlarini (oddiy, hover, nofaol, xato) tekshiring.

Avtomatik vositalar fotosuratlardagi matnni yaxshi baholay olmaydi. Bunday joylarni matn ortidagi eng och pikselni pipetka bilan olib, qo‘lda tekshiring.

## O‘tmaydigan brend ranglarini qanday tuzatish mumkin

Brend ranglari ko‘pincha yorqin bo‘ladi va oq fonda matn sifatida o‘tmaydi. Brendni o‘zgartirish shart emas — rangdan **foydalanish usulini** o‘zgartiring.

1. **Matn va havolalar uchun to‘qroq pog‘ona.** Yorqin rangni katta yuzalar va dekor uchun qoldiring, matn uchun esa shu tusning to‘qroq variantini oling.
2. **Matn rangini almashtiring.** Yorqin tugmadagi oq matn o‘tmasa, xuddi shu fondagi to‘q matn o‘tishi mumkin.
3. **Matnni katta qiling.** AA darajasida katta o‘lchamdagi sarlavhaga 3:1 yetarli. Asosiy matn uchun bu usul to‘g‘ri kelmaydi.
4. **Ikkinchi belgi qo‘shing.** Havolalarning tagiga chizing, ramka yoki ikonka qo‘shing, shunda ma’no faqat rangga bog‘liq bo‘lmaydi.
5. **Rasmlarda qoplamadan foydalaning.** Fotodagi matn ostidagi to‘q gradiyent kontrastni oldindan aytib bo‘ladigan qiladi.
6. **Ochiq foydalanish uchun tokenlar yarating.** Tekshirilgan `text-brand`, `bg-brand`, `border-brand` tokenlarini belgilang, shunda dizaynerlar «xom» rangni olmaydi.

## Ko‘p uchraydigan xatolar

- Maydon yozuvi o‘rniga och kulrang pleysholder.
- Hover, fokus va xatosiz faqat oddiy holatni tekshirish.
- Och mavzuda o‘tgan narsa qorong‘i mavzuda ham o‘tadi deb o‘ylash.
- Kichik o‘lchamdagi ingichka shriftlar: rasman o‘tadi, lekin yomonroq o‘qiladi.

## FAQ

### AA yetarlimi yoki AAA kerakmi?

AA — saytlar uchun standart maqsad va ko‘pchilik talablar aynan unga tayanadi. Barcha matn uchun AAA’ga brend ranglari bilan erishish qiyin, shuning uchun u o‘qish eng muhim bo‘lgan joylarda, masalan uzun maqolalarda qo‘llanadi.

### Nofaol tugmalar uchun kontrast kerakmi?

Yo‘q. WCAG nofaol elementlarni kontrast talablaridan chiqarib tashlaydi, ammo ular baribir nofaol ekani tanilishi kerak.

### APCA va WCAG 3 haqida nima deyish mumkin?

APCA — WCAG’ning kelgusi versiyalari uchun taklif qilingan yangi kontrast hisoblash usuli. U tadqiqot uchun foydali, lekin bugun muvofiqlik WCAG 2 koeffitsiyentlari bo‘yicha baholanadi.
