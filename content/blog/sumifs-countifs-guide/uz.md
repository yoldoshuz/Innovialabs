---
title: SUMIFS va COUNTIFS: shartlar bo‘yicha yig‘indi va sanash
description: Excel va Google Sheets’da bir nechta shart bo‘yicha yig‘indi va qatorlar sonini hisoblash: sanalar, shablon belgilar, taqqoslash operatorlari va xatolar.
summary: SUMIFS barcha shartlar bir vaqtda bajarilgan qatorlardagi qiymatlarni qo‘shadi, COUNTIFS esa bunday qatorlarni sanaydi; shartlar «diapazon — mezon» juftliklari bilan beriladi va sanalar, taqqoslash operatorlari hamda * va ? belgilarini o‘z ichiga olishi mumkin.
---
## Qisqa javob

**SUMIFS** **barcha** shartlar bajarilgan qatorlardagi sonlarni qo‘shadi. **COUNTIFS** bunday qatorlar sonini hisoblaydi.

```
=SUMIFS(sum_range, criteria_range1, criterion1, [criteria_range2, criterion2], ...)
=COUNTIFS(criteria_range1, criterion1, [criteria_range2, criterion2], ...)
```

Tartibga e’tibor bering: SUMIFS’da yig‘iladigan diapazon **birinchi** turadi, eski SUMIF’da esa oxirida. Bitta shart bo‘lsa ham doim SUMIFS’dan foydalangan qulayroq.

Ikkala funksiya Excel va Google Sheets’da bir xil ishlaydi. Rus tilidagi Excel’da ular СУММЕСЛИМН va СЧЁТЕСЛИМН deb ataladi, argumentlar esa nuqtali vergul bilan ajratiladi.

## Misol: savdo hisoboti

«Sales» varag‘i: A — sana, B — menejer, C — shahar, D — mahsulot, E — summa, F — buyurtma holati.

Menejer Alisherning Toshkentdagi tushumi:

```
=SUMIFS(E:E, B:B, "Alisher", C:C, "Toshkent")
```

Qiymatlarni formulaga yozgandan ko‘ra kataklarga ishora qilgan yaxshiroq: `=SUMIFS(E:E, B:B, H2, C:C, H3)`. Shunda formulani butun hisobot jadvali bo‘ylab cho‘zish mumkin. Harflar registri hisobga olinmaydi: «toshkent» va «Toshkent» mos keladi.

## Taqqoslash operatorlari

| Mezon | Ma’nosi |
|---|---|
| `">100000"` | 100 000 dan katta |
| `"<=50"` | 50 dan kichik yoki teng |
| `"<>Bekor qilindi"` | «Bekor qilindi»dan boshqa hammasi |
| `"<>"` | bo‘sh bo‘lmagan kataklar |
| `"="` | bo‘sh kataklar |
| `">="&H2` | H2 dagi qiymatdan katta yoki teng |

Eng ko‘p uchraydigan xato — havolani qo‘shtirnoq ichiga yozish: `">=H2"` «H2» matni bilan solishtiradi. Operator qo‘shtirnoqda yoziladi, havola esa **&** orqali qo‘shiladi.

## Sanalar bo‘yicha shartlar

2025-yil mart oyidagi tushum:

```
=SUMIFS(E:E, A:A, ">="&DATE(2025,3,1), A:A, "<"&DATE(2025,4,1))
```

- Bitta ustunni ikki marta ko‘rsatish mumkin — **oraliq** shunday beriladi.
- Yuqori chegarani «31-sanadan kichik yoki teng» emas, «**keyingi oyning birinchi kunidan kichik**» deb bering: sanalarda vaqt ham bo‘lsa, aks holda oxirgi kun qatorlari tushib qoladi.
- Sanani `">=01.03.2025"` kabi matn ko‘rinishida yozmang: natija hududiy sozlamalarga bog‘liq bo‘lib qoladi.

Oylik hisobot uchun H2 ga oyning birinchi kunini yozing va EDATE’dan foydalaning:

```
=SUMIFS(E:E, A:A, ">="&H2, A:A, "<"&EDATE(H2,1))
```

Joriy oyning boshlanishini `=EOMONTH(TODAY(),-1)+1` formulasi beradi.

## Shablon belgilar

- `*` — istalgan miqdordagi belgilar: `"*iPhone*"` nomida iPhone uchraydigan barcha mahsulotlarni topadi.
- `?` — aynan bitta belgi: `"A-???"` «A-101» kabi kodlarni topadi.
- `~` — belgining o‘zini topish kerak bo‘lsa, ekranlash: `"~*"`.

Shablon belgilar faqat matn bilan ishlaydi. Sonlar uchun taqqoslash operatorlaridan foydalaning.

## Buyurtmalarni sanash

Oy davomida to‘langan buyurtmalar soni:

```
=COUNTIFS(F:F, "To‘langan", A:A, ">="&H2, A:A, "<"&EDATE(H2,1))
```

O‘rtacha chek — summaning songa bo‘linmasi. Savdo bo‘lmagan oyda #DIV/0! chiqmasligi uchun xuddi shu shartlar bilan **AVERAGEIFS**’dan foydalaning va uni «savdo yo‘q» kabi tushunarli matn bilan IFERROR ichiga oling.

## «YOKI» mantig‘i

Bitta SUMIFS ichidagi barcha shartlar **«VA»** mantig‘i bilan bog‘langan. «Toshkent **yoki** Samarqand» natijasini olish uchun ikki formulani qo‘shing:

```
=SUMIFS(E:E, C:C, "Toshkent") + SUMIFS(E:E, C:C, "Samarqand")
```

Variantlar ko‘p yoki mantiq murakkab bo‘lsa, SUMPRODUCT yoki «mos / mos emas» belgisi bor yordamchi ustun bilan ishlash osonroq.

## Ko‘p uchraydigan xatolar

- **Har xil o‘lchamdagi diapazonlar** — `E2:E100` va `B2:B90` #VALUE! beradi. Barcha diapazonlarda qatorlar soni bir xil bo‘lishi kerak.
- **Matn sifatida saqlangan summalar** indamay o‘tkazib yuboriladi va jami haqiqiydan kam chiqadi. Belgisi — sonlar katakning chap chetiga tekislangan.
- **Ortiqcha bo‘sh joylar**: oxirida bo‘sh joy bor «Toshkent » «Toshkent»ga teng emas. Ma’lumotlarni TRIM bilan tozalang.
- **Matn ko‘rinishidagi sanalar** sana oraliqlariga tushmaydi. ISNUMBER bilan tekshiring: haqiqiy sana — bu son.
- **Ma’lumotlar ichidagi jami qatorlari** ikki marta hisoblashga olib keladi. Manba jadvalni oraliq jamilarsiz saqlang.

## FAQ

### SUMIFS harflar registrini hisobga oladimi?

Yo‘q. Registr muhim bo‘lsa, matnni registrni hisobga olib solishtiradigan EXACT funksiyasi bilan birga SUMPRODUCT’dan foydalaning.

### Shartda boshqa varaqqa ishora qilish mumkinmi?

Ha, diapazonlar ham, mezonlar ham boshqa varaqlarda bo‘lishi mumkin, masalan `Sales!E:E` va `Report!H2`. Asosiysi, barcha shart diapazonlari va yig‘iladigan diapazon bir xil uzunlikda bo‘lsin.

### SUMIFS qachon yig‘ma jadvaldan yaxshiroq?

Formulalar ko‘rinishi qat’iy belgilangan va o‘zi yangilanishi kerak bo‘lgan hisobotlar uchun qulay. Yig‘ma jadval esa ma’lumotlarni qaysi kesimda ko‘rish kerakligini hali bilmaganingizda ularni tahlil qilish uchun tezroq.
