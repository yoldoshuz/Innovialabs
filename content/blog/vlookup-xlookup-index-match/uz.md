---
title: VLOOKUP, XLOOKUP va INDEX MATCH: qaysi birini qachon ishlatish kerak
description: Excel va Google Sheets’da VLOOKUP, XLOOKUP va INDEX MATCH taqqoslanadi: aniq va taxminiy qidiruv, chapga qidirish, xatolar va tezlik.
summary: Excel 365/2021 yoki Google Sheets’da odatiy tanlov — XLOOKUP; fayl eski Excel versiyalarida ham ochilsa, INDEX MATCH ishlating, VLOOKUP esa kalit birinchi ustunda turgan kichik va barqaror jadvallar uchungina mos.
---
## Qisqa javob

- **XLOOKUP** — zamonaviy tanlov: chapga ham, o‘ngga ham qidiradi, odatda aniq moslikdan foydalanadi va «topilmasa» holatini o‘zi qayta ishlaydi. Excel 365, Excel 2021 va undan yangi versiyalarda hamda Google Sheets’da mavjud.
- **INDEX + MATCH** — hamma joyda, jumladan eski Excel’da ham ishlaydi, istalgan yo‘nalishda qidiradi va yangi ustun qo‘shilganda buzilmaydi.
- **VLOOKUP** — eng mashhur, lekin eng mo‘rt funksiya: faqat diapazonning birinchi ustunida qidiradi va natijani ustun raqami bo‘yicha qaytaradi.

Misollarda argumentlar vergul bilan ajratilgan. Rus tilidagi Excel’da funksiyalar ВПР, ИНДЕКС, ПОИСКПОЗ, ПРОСМОТРX deb nomlanadi, ajratuvchi esa nuqtali vergul bo‘ladi — mantiq o‘zgarmaydi.

## Misol uchun ma’lumotlar

«Products» varag‘ida: A ustun — artikul, B — nomi, C — narxi. «Orders» varag‘ining A2 katagida artikul turibdi va uning narxini olib kelish kerak.

## VLOOKUP

```
=VLOOKUP(A2, Products!A:C, 3, FALSE)
```

- Argumentlar: nimani qidiramiz, qayerda qidiramiz (**kalit albatta birinchi ustunda bo‘lishi shart**), natija qaysi ustundan olinadi, moslik turi.
- **FALSE (yoki 0) — aniq moslik.** To‘rtinchi argument tushirib qoldirilsa, VLOOKUP taxminiy qidiruvni yoqadi va saralanmagan ma’lumotlarda hech qanday xatosiz boshqa qatorni qaytaradi. Bu VLOOKUP bilan eng ko‘p uchraydigan muammo.
- Chapga qidirib bo‘lmaydi: artikul nomdan o‘ngda tursa, ustunlarning joyini almashtirishga to‘g‘ri keladi.
- Ustun raqami formulaga qattiq yozilgan. Jadval o‘rtasiga ustun qo‘shsangiz, formula indamay boshqa ma’lumotni qaytara boshlaydi.

## INDEX + MATCH

```
=INDEX(Products!C:C, MATCH(A2, Products!A:A, 0))
```

- **MATCH** kalit turgan qator raqamini topadi. Oxiridagi **0** — aniq moslik; odatda 1 turadi, ya’ni taxminiy qidiruv.
- **INDEX** shu raqam bo‘yicha kerakli ustundan qiymatni oladi.
- Natija ustuni istalgan joyda, jumladan kalitdan chapda ham bo‘lishi mumkin.
- Formula aniq ustunlarga ishora qiladi, shuning uchun yangi ustun qo‘shish uni buzmaydi.
- Qator va ustun bo‘yicha bir vaqtda qidirish uchun qulay: `=INDEX(B2:M50, MATCH(H1, A2:A50, 0), MATCH(H2, B1:M1, 0))` — H1 dagi mahsulotning H2 dagi oy bo‘yicha savdosi.

## XLOOKUP

```
=XLOOKUP(A2, Products!A:A, Products!C:C, "Katalogda yo‘q")
```

- Argumentlar: nimani qidiramiz, qayerda qidiramiz, natijani qayerdan olamiz, hech narsa topilmasa nima ko‘rsatiladi.
- **Aniq moslik standart holatda** yoqilgan — FALSE’ni unutib qo‘yish xavfi yo‘q.
- Beshinchi argument — moslik rejimi: `0` — aniq, `-1` — aniq yoki eng yaqin kichigi, `1` — aniq yoki eng yaqin kattasi, `2` — `*` va `?` belgilari bilan.
- Oltinchi argument — yo‘nalish: `-1` oxiridan qidiradi va **oxirgi** uchrashni topadi, masalan mijozning so‘nggi buyurtmasini.
- Bir vaqtda bir nechta ustunni qaytara oladi: `=XLOOKUP(A2, Products!A:A, Products!B:C)`.

## Aniq va taxminiy qidiruv

Taxminiy qidiruv **shkalalar** uchun kerak: buyurtma summasiga qarab chegirma, stavkalar, darajalar. Masalan, «0 dan — 0%, 1 000 000 dan — 5%, 5 000 000 dan — 10%» jadvali bor va 3 200 000 summasi uchun chegirmani topish kerak.

- `TRUE` bilan VLOOKUP va `1` bilan MATCH birinchi ustun **o‘sish tartibida saralangan** bo‘lishini talab qiladi, aks holda natijani oldindan aytib bo‘lmaydi.
- `-1` rejimidagi XLOOKUP saralashni talab qilmaydi: `=XLOOKUP(D2, Tiers!A:A, Tiers!B:B, , -1)`.

Qolgan barcha holatlarda — ma’lumotnomalar, artikullar, ID, e-mail — **faqat aniq moslikdan** foydalaning.

## Xatolar va tezlik

| Holat | Natija | Nima qilish kerak |
|---|---|---|
| Kalit topilmadi | #N/A | Ma’lumotni tekshirish, IFNA bilan o‘rash yoki XLOOKUP’dagi «topilmasa» argumentini to‘ldirish |
| VLOOKUP’dagi ustun raqami diapazon kengligidan katta | #REF! | Raqamni tuzatish yoki INDEX MATCH’ga o‘tish |
| Son qidiryapsiz, jadvalda esa u matn sifatida saqlangan | #N/A | VALUE yoki TEXT bilan turlarni moslash, TRIM bilan bo‘sh joylarni olib tashlash |
| Saralanmagan ma’lumot va taxminiy qidiruv | Xatosiz, lekin noto‘g‘ri qiymat | Aniq moslikni yoqish |

Bir necha ming qatorli jadvallarda funksiyalar tezligidagi farq sezilmaydi. Katta fayllarda oddiy odatlar yordam beradi:

- keragidan ancha ko‘p qatorga ishora qilish o‘rniga chegaralangan diapazon yoki Excel jadvallaridan (Ctrl+T) foydalaning;
- bitta qatordan bir nechta maydon olinsa, MATCH’ni yordamchi ustunda bir marta hisoblang va bir nechta INDEX’ni unga yo‘naltiring;
- saralanganiga ishonchingiz komil bo‘lgan ma’lumotlarda XLOOKUP’ning oltinchi argumentiga `2` yoki `-2` qo‘yib, ikkilik qidiruvni yoqing.

Barcha xatolarni IFERROR orqasiga yashirmang: u formuladagi xatoliklarni ham yopib qo‘yadi. Qidiruv uchun **IFNA** xavfsizroq — u faqat #N/A’ni ushlaydi.

## Qanday tanlash kerak

1. Fayl faqat Excel 365/2021+ yoki Google Sheets’da ochiladi — **XLOOKUP**.
2. Kimdir uni hali eski Excel’da ochadi — **INDEX MATCH**.
3. Kichik va barqaror jadval, kalit chapda — **VLOOKUP** ham bo‘laveradi.

## FAQ

### XLOOKUP Google Sheets’da ishlaydimi?

Ha. Google Sheets’da XLOOKUP bor va xuddi shunday ishlaydi: standart holatda aniq moslik, istalgan yo‘nalishda qidiruv va qiymat topilmagan holat uchun argument.

### Qiymat aniq bor bo‘lsa ham, nega VLOOKUP #N/A qaytaradi?

Ko‘pincha kalitlar bir xil ko‘rinadi, lekin farq qiladi: bir jadvalda son, boshqasida matn, oxirida bo‘sh joy yoki boshqa tizimdan eksport qilinganda qolgan ko‘rinmas belgi. Ikki katakni `=A2=Products!A5` kabi formula bilan solishtiring: FALSE chiqsa, ma’lumotlarni tozalang.

### Ikki shart bo‘yicha qidirish mumkinmi?

Ha. Eng ishonchli usul — kalitlarni birlashtiruvchi yordamchi ustun (masalan, artikul va ombor) yaratib, shu ustun bo‘yicha qidirish. Excel 365’da diapazonlarni formulaning o‘zida birlashtirish mumkin: `=XLOOKUP(A2&B2, Products!A2:A1000&Products!D2:D1000, Products!C2:C1000)`; Google Sheets’da bu formulani ARRAYFORMULA ichiga oling.
