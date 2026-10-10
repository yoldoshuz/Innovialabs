---
title: Google Sheets’da QUERY funksiyasi: SQL kabi ma’lumotlar tahlili
description: Google Sheets’da QUERY sintaksisi: select, where, group by, pivot, order by va label, sanalar bo‘yicha shartlar va IMPORTRANGE bilan jonli hisobotlar.
summary: QUERY diapazonga SQL’ga o‘xshash so‘rov yuboradi — bitta formula bilan filtrlaydi, guruhlaydi, saralaydi va ustunlarni qayta nomlaydi, IMPORTRANGE bilan birga esa manba jadval o‘zgarishi bilan yangilanadigan hisobotlar quradi.
---
## Qisqa javob

**QUERY** — diapazon va SQL’ga o‘xshash tilda yozilgan so‘rovni qabul qiladigan Google Sheets funksiyasi:

```
=QUERY(data, "query", [headers])
```

- **data** — diapazon, masalan `Orders!A:F`;
- **query** — qo‘shtirnoq ichidagi satr;
- **headers** — yuqoridagi nechta qator sarlavha hisoblanishi; uni doim aniq ko‘rsating, odatda `1`.

So‘rov qismlari **qat’iy shu tartibda** yoziladi: `select`, `where`, `group by`, `pivot`, `order by`, `limit`, `offset`, `label`, `format`. Istalgan qismni tushirib qoldirish mumkin, lekin o‘rnini almashtirib bo‘lmaydi.

Rus tilidagi lokalda funksiya argumentlari nuqtali vergul bilan ajratiladi, so‘rovning o‘zi esa doim inglizcha kalit so‘zlar bilan yoziladi.

## Ustunlarga qanday murojaat qilinadi

- Ma’lumot oddiy diapazon bo‘lsa, ustunlar **harflar** bilan belgilanadi: `A`, `B`, `C`, bosh harflarda.
- Ma’lumot boshqa funksiya natijasi bo‘lsa (IMPORTRANGE, jingalak qavsdagi massiv), **Col1, Col2, Col3** ishlatiladi — C bosh harf bilan.
- So‘rov ichidagi matnli qiymatlar **bittalik qo‘shtirnoqqa** olinadi: `'Toshkent'`.

Misol uchun «Orders» varag‘i: A — sana, B — menejer, C — shahar, D — mahsulot, E — summa, F — holat.

## select va where

```
=QUERY(Orders!A:F, "select A, B, E where F = 'Paid' and E > 100000", 1)
```

`where` ichidagi operatorlar:

- taqqoslash: `=`, `!=`, `<>`, `>`, `<`, `>=`, `<=`;
- mantiq: `and`, `or`, `not`;
- bo‘sh qiymatlar: `is null`, `is not null`;
- matn: `contains`, `starts with`, `ends with`, `like` (`%` va `_` belgilari bilan), `matches` (muntazam ifoda).

QUERY’da matnni taqqoslash **registrni hisobga oladi**: `'toshkent'` va `'Toshkent'` — turli qiymatlar. Ma’lumotlar har xil yozilgan bo‘lsa, `lower(C) = 'toshkent'` dan foydalaning.

Shart qiymatini katakdan satrni ulash orqali olish mumkin:

```
=QUERY(Orders!A:F, "select A, B, E where C = '"&H1&"'", 1)
```

## group by va agregatlar

Menejerlar bo‘yicha tushum va buyurtmalar soni:

```
=QUERY(Orders!A:F, "select B, sum(E), count(A) where F = 'Paid' group by B order by sum(E) desc", 1)
```

- Agregat funksiyalar: `sum`, `count`, `avg`, `min`, `max`.
- Qoida: `select`’dagi agregat funksiyasiz har bir ustun `group by`’da ham ko‘rsatilishi shart.

## pivot

`pivot` ustun qiymatlarini sarlavhalarga aylantiradi — bitta formulada yig‘ma jadval hosil bo‘ladi:

```
=QUERY(Orders!A:F, "select B, sum(E) where F = 'Paid' group by B pivot C", 1)
```

Qatorlar — menejerlar, ustunlar — shaharlar, kesishmada — tushum.

## order by, limit, label, format

```
=QUERY(Orders!A:F, "select B, sum(E) group by B order by sum(E) desc limit 10 label B 'Menejer', sum(E) 'Tushum' format sum(E) '#,##0'", 1)
```

- `order by ... desc` — kamayish tartibida saralash;
- `limit 10` — dastlabki 10 qator, reytinglar uchun qulay;
- `label` — «sum Amount» o‘rniga tushunarli sarlavhalar;
- `format` — natijaning son formati.

## Sanalar bilan ishlash

So‘rovda sana `date 'yyyy-mm-dd'` literali ko‘rinishida yoziladi:

```
=QUERY(Orders!A:F, "select B, sum(E) where A >= date '2025-03-01' and A < date '2025-04-01' group by B", 1)
```

Sanani H1 katagidan olish uchun uni TEXT orqali kerakli formatga o‘tkazing:

```
=QUERY(Orders!A:F, "select B, sum(E) where A >= date '"&TEXT(H1,"yyyy-mm-dd")&"' group by B", 1)
```

`year(A)` va `month(A)` funksiyalari davrlar bo‘yicha guruhlash imkonini beradi. Muhim jihat: **month() oylarni noldan sanaydi**, yanvar — bu 0. Buni sarlavhalarda hisobga oling yoki oy raqamini yordamchi ustunda saqlang.

## QUERY + IMPORTRANGE: jonli hisobot

Ishchi jadvaldan ma’lumot o‘qiydigan alohida fayldagi hisobot:

```
=QUERY(IMPORTRANGE("spreadsheet_url", "Orders!A:F"), "select Col2, sum(Col5) where Col6 = 'Paid' group by Col2 label sum(Col5) 'Tushum'", 1)
```

- IMPORTRANGE’dan keyin ustunlar harflar bilan emas, **Col1, Col2…** deb ataladi.
- Birinchi marta ruxsat bering: IMPORTRANGE’ni bo‘sh katakka alohida qo‘ying va «Allow access» tugmasini bosing. Shundan keyin u QUERY ichida ishlaydi.
- Hisobot manba jadvaldan keyin yangilanadi, lekin bir zumda emas — biroz kechikish bilan.

## Ko‘p uchraydigan xatolar

- **Ustunda aralash turlar.** QUERY ustun turini qiymatlarning ko‘pchiligiga qarab belgilaydi, qolganlarini bo‘sh qiymatga aylantiradi. Summa ustunida matn bo‘lsa, qatorlarning bir qismi indamay yo‘qoladi.
- **Sarlavhalar argumenti ko‘rsatilmagan.** QUERY o‘zi taxmin qiladi va ba’zan dastlabki ma’lumot qatorlarini sarlavhaga qo‘shib yuboradi.
- IMPORTRANGE’dan keyin **ColN o‘rniga harflar** yoki aksincha.
- **So‘rov qismlarining noto‘g‘ri tartibi**, masalan `group by`’dan oldin `order by`.
- **Manbaga ustun qo‘shish** harflarni suradi va hisobot boshqa ma’lumotni hisoblay boshlaydi. Yangi ustunlarni oxiriga qo‘shing.

## FAQ

### Excel’da QUERY bormi?

Yo‘q, bu Google Sheets funksiyasi. Excel’da shunga o‘xshash vazifalarni Power Query, yig‘ma jadvallar va FILTER, SORT kabi dinamik massiv funksiyalari hal qiladi.

### Ma’lumot bor bo‘lsa ham, QUERY nega bo‘sh natija qaytaradi?

Matnli shartlardagi registrni, ortiqcha bo‘sh joylarni, sana literalining formatini va ma’lumot turlarini tekshiring: matn sifatida saqlangan summalar `E > 0` kabi shartdan o‘tmaydi.

### Bitta so‘rovda bir nechta diapazonni birlashtirish mumkinmi?

Ha: ularni massivga birlashtiring va ColN’dan foydalaning. Masalan, `{Sheet1!A2:F; Sheet2!A2:F}` ikki varaqning ustunlar tuzilishi bir xil bo‘lsa, ularning qatorlarini ketma-ket joylashtiradi.
