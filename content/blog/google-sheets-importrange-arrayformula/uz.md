---
title: Google Sheets’da IMPORTRANGE va ARRAYFORMULA
description: IMPORTRANGE orqali Google Sheets fayllari orasida ma’lumot olish, ruxsat berish, bitta formulani butun ustunga qo‘llash va jadvalni tez hamda barqaror saqlash.
summary: IMPORTRANGE boshqa Google Sheets faylidan diapazonni olib keladi, ARRAYFORMULA esa bitta formulani butun ustunga qo‘llaydi; ma’lumotni bir marta import qilsangiz, diapazonlarni cheklasangiz va uzun fayl zanjirlarini qurmasangiz, ular qo‘lda nusxa ko‘chirishni to‘liq almashtiradi.
---
## Qisqa javob

- **IMPORTRANGE** boshqa jadvaldan diapazonni olib, joriy jadvalda ko‘rsatadi. Manba o‘zgarsa, import ham o‘zgaradi.
- **ARRAYFORMULA** formulani yuqoridagi katakka bir marta yozish va butun ustunni hisoblash imkonini beradi. Formulani minglab qatorlarga cho‘zish va yangi qatorlarga tushganini kuzatish shart emas.

Ikkalasi birgalikda fayllar orasida qo‘lda nusxa ko‘chirishni almashtiradi. Ammo har bir ortiqcha bog‘lanish va har bir cheklanmagan diapazon jadvalni sekinlashtiradi, shuning uchun tuzilmani ehtiyotkorlik bilan quring.

Misollarda argumentlar vergul bilan ajratilgan; rus tilidagi lokalda nuqtali vergul ishlatiladi.

## IMPORTRANGE sintaksisi

```
=IMPORTRANGE("https://docs.google.com/spreadsheets/d/KEY/edit", "Sales!A1:F")
```

- Birinchi argument — jadval havolasi yoki faqat uning kaliti (manzildagi `/d/` va `/edit` orasidagi qism).
- Ikkinchisi — **matn ko‘rinishidagi** diapazon: varaq nomi, undov belgisi, manzil.
- Ikkala argumentni kataklarda saqlash mumkin: `=IMPORTRANGE(B1, B2)`. Varaq qayta nomlansa, har bir formulani emas, bitta sozlama katakni tuzatasiz.

## Ruxsat qanday beriladi

1. Formulani kiriting. Birinchi marta izoh bilan **#REF!** chiqadi.
2. Kursorni katak ustiga olib boring va **Allow access** tugmasini bosing.
3. Buning uchun manba jadvalga kamida ko‘rish huquqingiz bo‘lishi kerak.

Ruxsat **har bir fayl juftligi uchun bir marta** beriladi. Oqibatini hisobga oling: shundan keyin qabul qiluvchi faylning istalgan muharriri manbadan siz sozlagan diapazonnigina emas, istalgan diapazonni import qila oladi. Maxfiy ma’lumotlar uchun faqat kerakli ustunlar bo‘lgan alohida manba fayl yarating.

## ARRAYFORMULA: butun ustun uchun bitta formula

Pastga cho‘zilgan `=B2*C2` o‘rniga D2 katagiga:

```
=ARRAYFORMULA(IF(A2:A="", , B2:B*C2:C))
```

- **Havolalar — alohida kataklar emas, diapazonlar**: `B2` o‘rniga `B2:B`.
- `IF(A2:A="", , ...)` tekshiruvi hali ma’lumot yo‘q qatorlarni bo‘sh qoldiradi, aks holda ustun nollar bilan to‘lib ketadi.
- Formulani kiritayotganda **Ctrl+Shift+Enter** bossangiz, u avtomatik ravishda ARRAYFORMULA ichiga olinadi.
- Formula ostidagi kataklar bo‘sh bo‘lishi kerak. U yerda biror narsa bo‘lsa, massiv yoyila olmaydi va formula #REF! qaytaradi.

Qulay usul — formulani sarlavha qatoriga joylashtirish, shunda saralashda u joyidan siljimaydi:

```
={"Jami"; ARRAYFORMULA(IF(A2:A="", , B2:B*C2:C))}
```

Butun ustun uchun ma’lumotnomadan qidiruv:

```
=ARRAYFORMULA(IF(A2:A="", , IFNA(VLOOKUP(A2:A, Lookup!A:C, 3, FALSE), "ro‘yxatda yo‘q")))
```

Cheklov: diapazonni bitta qiymatga yig‘adigan funksiyalar (SUM, AND, OR) ARRAYFORMULA ichida qatorma-qator ishlamaydi. `AND(shart1, shart2)` o‘rniga `(shart1)*(shart2)` ko‘paytmasidan, OR o‘rniga qo‘shishdan foydalaning. Murakkab qatorma-qator mantiq uchun LAMBDA bilan BYROW yoki MAP bor.

## Hisobotlar uchun ishchi sxema

1. Hisobot faylida har bir manba uchun **bitta** IMPORTRANGE bo‘lgan «Import» varag‘ini yarating.
2. **Faqat kerakli ustunlarni** va cheklangan diapazonni import qiling.
3. Barcha hisob-kitoblarni «Import»ga ishora qiluvchi alohida varaqlarda ARRAYFORMULA, QUERY yoki FILTER orqali bajaring.
4. Formulalar varag‘ini himoyalang: Data → Protect sheets and ranges.

## Sekin va mo‘rt jadval qilmaslik uchun

- **IMPORTRANGE’ni har bir katakda chaqirmang.** Har bir chaqiruv — boshqa faylga alohida so‘rov. Bitta import va mahalliy havolalar tezroq ishlaydi.
- **«A fayl → B fayl → C fayl → hisobot» kabi zanjirlardan qoching.** Kechikishlar qo‘shilib boradi, bitta uzilish esa zanjirning qolgan qismini to‘xtatadi.
- **Varaqning pastki va o‘ng tomonidagi bo‘sh qator va ustunlarni o‘chiring.** `A2:A` bo‘yicha ARRAYFORMULA varaqning barcha qatorlarini, jumladan bo‘shlarini ham qayta ishlaydi.
- **Katta diapazonlarda NOW, TODAY, RAND va RANDBETWEEN’ni ko‘p ishlatmang** — ular jadvalni tez-tez qayta hisoblashga majbur qiladi.
- **Manba varaqlarni qayta nomlamang va o‘rtasiga ustun qo‘shmang**: IMPORTRANGE’dagi diapazon matn bo‘lib, o‘zi yangilanmaydi. Yangi ustunlarni oxiriga qo‘shing.
- **O‘sishni kuzatib boring.** O‘nlab fayllar bir-biriga bog‘langan va ma’lumotni ko‘p odam kiritayotgan bo‘lsa, jadval tor joyga aylanadi — bu ma’lumotlar bazasi yoki CRM’ga o‘tish vaqti kelganidan darak.

## FAQ

### IMPORTRANGE nega uzoq vaqt «Loading...» yoki xato ko‘rsatadi?

Odatda faylda importlar juda ko‘pligi, diapazon haddan tashqari kengligi yoki manbaga kirish huquqi yo‘qolgani sabab bo‘ladi. Chaqiruvlar sonini kamaytiring, diapazonlarni toraytiring va manba jadvalga hali ham kirish huquqingiz borligini tekshiring.

### Google Drive’dagi Excel faylidan import qilish mumkinmi?

IMPORTRANGE faqat Google Sheets fayllari bilan ishlaydi. Avval .xlsx faylni File menyusi orqali Google Sheets fayli sifatida saqlang.

### QUERY va FILTER uchun ARRAYFORMULA kerakmi?

Yo‘q. QUERY, FILTER, SORT va UNIQUE massivni allaqachon to‘liq qaytaradi, ularni o‘rash shart emas.
