---
title: UI dizaynerlar uchun rang nazariyasi asoslari
description: Interfeyslarga tatbiq etilgan rang nazariyasi: rang doirasi, uyg‘unliklar, HSL’da fikrlash, asosiy, neytral va semantik ranglar hamda 60-30-10 qoidasi.
summary: UI’da rang bezak emas, ma’no va diqqat vositasi: bitta asosiy brend rangini tanlang, interfeysning katta qismi uchun keng neytral shkala yarating, holatlar uchun semantik ranglar qo‘shing va urg‘uni kam ishlating. HSL’da fikrlash uyg‘un tuslarni olishni osonlashtiradi.
---
## Qisqa javob

Interfeysda rangning uchta vazifasi bor: **brendni ko‘rsatish**, **e’tiborni yo‘naltirish** va **ma’noni yetkazish** (muvaffaqiyat, xato, havola, nofaol). Ishlaydigan UI palitrasi odatda oddiy bo‘ladi:

- brend va asosiy harakatlar uchun **bitta asosiy rang**;
- matn, fonlar va chegaralar uchun **neytral (kulrang) shkala** — ekranning katta qismi;
- holatlar uchun **semantik ranglar**: muvaffaqiyat, ogohlantirish, xato, ma’lumot.

Rang nazariyasi ularni bir-biriga mos va o‘qiladigan qilib tanlashga yordam beradi.

## Rang doirasi va uyg‘unliklar

**Rang doirasi** tuslarni aylana bo‘ylab joylashtiradi. Doiradagi o‘zaro joylashuv klassik uyg‘unliklarni beradi:

| Uyg‘unlik | Qanday quriladi | UI’da qo‘llanilishi |
|---|---|---|
| Monoxrom | Bitta rangning tuslari | Sokin, yaxlit interfeyslar; yaxshi qilish eng oson |
| Analog | Qo‘shni tuslar | Yumshoq gradiyentlar, illyustratsiyalar, bog‘liq kategoriyalar |
| Komplementar | Qarama-qarshi tuslar | Asosiy rang fonida kuchli urg‘u; me’yorida ishlatish kerak |
| Bo‘lingan komplementar | Rang va uning qarama-qarshisining ikki qo‘shnisi | Sof komplementarga qaraganda kamroq keskin urg‘u |
| Triada | Teng uzoqlikdagi uchta tus | Grafiklar va illyustratsiyalar; asosiy UI uchun juda shovqinli |

Interfeyslarda uyg‘unliklar kamdan-kam «boricha» ishlatiladi. Odatda asos **monoxrom** (asosiy rang va neytrallar) bo‘ladi, uyg‘unlikdan olingan yana bitta tus esa ikkinchi darajali urg‘uga aylanadi.

## HEX’da emas, HSL’da fikrlang

`#7C3AED` kabi kod odamga hech narsa demaydi. **HSL** rangni dizayner o‘ylaganidek tasvirlaydi:

- **Hue (tus)** — doiradagi o‘rni, 0–360 daraja;
- **Saturation (to‘yinganlik)** — kulrangdan yorqingacha, 0–100%;
- **Lightness (yorug‘lik)** — qoradan oqgacha, 0–100%.

Shunda palitra tizimli bo‘ladi. Och fon kerak — yorug‘likni oshirasiz; hover holati — biroz kamaytirasiz; xiralashgan variant — to‘yinganlikni pasaytirasiz. Tus o‘zgarmaydi, shuning uchun tuslar bir-biriga qarindoshdek seziladi.

```css
:root {
  --primary-600: hsl(262 83% 58%);  /* asosiy tugmalar */
  --primary-700: hsl(262 70% 45%);  /* hover, bosilgan holat */
  --primary-100: hsl(262 90% 95%);  /* och fonlar */
  --gray-900:    hsl(260 30% 13%);  /* asosiy matn */
  --gray-500:    hsl(260 8% 50%);   /* ikkinchi darajali matn */
}
```

Muhim izoh: HSL’dagi yorug‘lik idrok etiladigan yorqinlikka mos kelmaydi. Bir xil yorug‘likdagi sariq va ko‘k butunlay boshqacha ko‘rinadi. Natijani doim ko‘z bilan va kontrast tekshirish vositasi bilan tekshiring. Bu muammoni zamonaviy CSS qo‘llab-quvvatlaydigan OKLCH kabi perseptiv modellar hal qiladi.

## UI palitrasini bosqichma-bosqich yig‘amiz

1. Brenddan **asosiy rangni tanlang**. Uning ustidagi oq matn o‘qilishiga ishonch hosil qiling.
2. Yorug‘likni o‘zgartirib va to‘yinganlikni moslab, juda ochdan juda to‘qgacha 9–10 tusdan iborat **shkala yarating**.
3. **Neytrallarni yig‘ing.** Sof kulrang ko‘pincha jonsiz ko‘rinadi; kulranglardagi asosiy tusning yengil ohangi palitrani yaxlit qiladi.
4. **Semantik ranglarni qo‘shing**: muvaffaqiyat uchun yashil, ogohlantirish uchun qahrabo, xato uchun qizil, ma’lumot uchun ko‘k. Har biriga fon uchun och tus va matn uchun to‘yingan tus kerak.
5. **Kontrastni tekshiring.** WCAG AA darajasida oddiy matn uchun kamida 4.5:1 va katta matn uchun 3:1 talab qiladi.
6. **Qorong‘i mavzuni** alohida tasvirlang. Oddiy inversiya kamdan-kam ishlaydi: to‘q fonda to‘yingan ranglarni yumshatish kerak.

## Interfeyslar uchun 60-30-10 qoidasi

Qoida interyer dizaynidan kelgan: 60% ustun rang, 30% ikkinchi darajali, 10% urg‘u. Ekranda u shunday ko‘rinadi:

- **60% — neytrallar**: fonlar va katta yuzalar, odatda oq, och kulrang yoki qorong‘i mavzuda to‘q kulrang.
- **30% — ikkinchi darajali**: matn, kartochkalar, yon panellar, chegaralar, yordamchi yuzalar.
- **10% — urg‘u**: asosiy tugmalar, faol holatlar, muhim havolalar va ajratib ko‘rsatishlar.

Raqamlarni aniq o‘lchov emas, muvozanat mo‘ljali sifatida qabul qiling. Gap shundaki, urg‘u kam bo‘ladi va shuning uchun nigohni tortish kuchini saqlaydi.

## Ko‘p uchraydigan xatolar

- Brend rangi hamma joyda, natijada asosiy harakatlar ajralib turmaydi.
- Ma’no faqat rang orqali beriladi; rangni farqlashda qiynaladigan odamlar holatlarni tushunishi uchun ikonlar, matn yoki shakl qo‘shing.
- Tizimsiz juda ko‘p tuslar, har biri bitta ekran uchun «ko‘z bilan» tanlangan.
- Oq fonda och kulrang matn: nafis ko‘rinadi, lekin kontrastdan o‘tmaydi.
- Semantik ranglar brend bilan to‘qnashadi: masalan, qizil brend rangi farqsiz ravishda xatolar uchun ham ishlatiladi.

## FAQ

### Interfeysga nechta rang kerak?

Odatda tuslari bilan bitta asosiy rang, neytral shkala va to‘rtta semantik rang. Ikkinchi darajali urg‘u — ixtiyoriy. Murakkablikni tuslar soni emas, ularning ohanglari yaratadi.

### Brend rangining kontrasti yomon bo‘lsa nima qilish kerak?

Uni katta elementlar va bezak uchun ishlating, matn va oq yozuvli tugmalar uchun esa o‘sha tusning to‘qroq ohangini oling. Brend taniqli bo‘lib qoladi, interfeys esa o‘qiladigan.

### Ranglarni qaysi formatda berish kerak: HEX, RGB yoki HSL?

CSS istalganini tushunadi. Shkalalarni qurish va tuzatish uchun HSL yoki OKLCH qulayroq, HEX esa brendbuklarda odatiy. Butun jamoa bir xil qiymatlardan foydalanishi uchun yakuniy qiymatlarni dizayn-tokenlar sifatida saqlang.
