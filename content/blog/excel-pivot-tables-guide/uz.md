---
title: Excel va Google Sheets’da yig‘ma jadvallar: qadamma-qadam qo‘llanma
description: Excel va Google Sheets’da ma’lumotlarni tayyorlash va yig‘ma jadval (pivot) qurish: sanalar bo‘yicha guruhlash, hisoblanadigan maydonlar, filtrlar va kesimlar.
summary: Yig‘ma jadval formulasiz, bir necha bosishda ma’lumotlarni guruhlaydi va jamlaydi, lekin faqat toza manba jadvalda ishonchli ishlaydi: bitta sarlavha qatori, har qatorda bitta yozuv va har ustunda to‘g‘ri ma’lumot turi.
---
## Qisqa javob

**Yig‘ma jadval (pivot table)** uzun yozuvlar ro‘yxatini ixcham hisobotga aylantiradi: menejerlar bo‘yicha tushum, oylar bo‘yicha buyurtmalar, shahar va mahsulotlar bo‘yicha savdo. Formula yozish shart emas — maydonlarni Rows, Columns, Values va Filters sohalariga sudrab qo‘yasiz.

Yig‘ma jadvaldagi muammolarning aksariyati uning o‘zida emas, manba ma’lumotlarda bo‘ladi. Shuning uchun tayyorgarlikdan boshlaymiz.

## 1-qadam. Manba ma’lumotlarni tayyorlang

Jadvalni ro‘yxat bo‘yicha tekshiring:

- **bitta sarlavha qatori**, har bir ustunning takrorlanmas nomi bor;
- **bitta qator — bitta yozuv**: bitta buyurtma, bitta savdo, bitta operatsiya;
- ma’lumotlar ichida **birlashtirilgan kataklar**, bo‘sh qator va ustunlar yo‘q;
- «Jami» va oraliq jami qatorlari yo‘q — yig‘ma jadval ularni yana bir bor hisoblaydi;
- har ustunda **bitta ma’lumot turi**: sanalar — haqiqiy sana, summalar — son.

Excel’da diapazonni **Ctrl+T** bilan jadvalga (Table) aylantiring — shunda yangi qatorlar yig‘ma jadval manbasiga avtomatik qo‘shiladi. Google Sheets’da diapazonni butun ustunlar bilan ko‘rsating, masalan `Sales!A:F`.

Turlarni tez tekshirish: `=ISNUMBER(A2)` haqiqiy sana yoki summa uchun TRUE qaytaradi. Chap chetga tekislangan sonlar odatda matn sifatida saqlangan bo‘ladi.

## 2-qadam. Yig‘ma jadvalni quring

- **Excel:** Insert → PivotTable → manba va yangi varaqni tanlang.
- **Google Sheets:** Insert → Pivot table → diapazon va yangi varaq.

Savdo jadvali misolida (sana, menejer, shahar, mahsulot, summa, holat):

1. **Menejer** — Rows’ga.
2. **Summa** — Values’ga, Sum funksiyasi bilan.
3. **Shahar** — Columns’ga.
4. **Holat** — Filters’ga, faqat to‘langan buyurtmalarni qoldiring.

Jamlash funksiyasini tekshiring. Son ustunida matn yoki bo‘sh kataklar bo‘lsa, Excel Sum o‘rniga Count’ni tanlashi mumkin; buni Value Field Settings’da o‘zgartirasiz. U yerda qiymatlarni **umumiy jamidan foiz** sifatida ham ko‘rsatish mumkin — menejer yoki shaharning ulushini ko‘rish uchun foydali.

## 3-qadam. Sanalar bo‘yicha guruhlash

Savdoni kunlar emas, oylar bo‘yicha ko‘rish uchun:

- **Excel:** sanani Rows’ga sudrang. Yangi versiyalar ko‘pincha sanalarni o‘zi guruhlaydi; bo‘lmasa, yig‘ma jadvaldagi sanaga o‘ng tugma → **Group** → **Months** va **Years**’ni belgilang. Faqat oylar tanlansa, turli yillarning yanvari bitta qatorga qo‘shilib ketadi.
- **Google Sheets:** sanani Rows’ga qo‘shing, so‘ng yig‘ma jadvaldagi istalgan sanaga o‘ng tugma → **Create pivot date group** → masalan, Year-Month.

Guruhlash imkoni bo‘lmasa, ustunda sana bo‘lmagan qiymatlar bor: matn, xatolar yoki satr ko‘rinishida yozilgan sanalar.

## 4-qadam. Hisoblanadigan maydonlar

Hisoblanadigan maydon — mavjud maydonlar asosidagi yangi ko‘rsatkich, masalan marja.

- **Excel:** PivotTable Analyze → Fields, Items & Sets → **Calculated Field**, formula `=(Amount-Cost)/Amount` ko‘rinishida.
- **Google Sheets:** Values → Add → **Calculated field**, formula `=SUM(Amount)-SUM(Cost)` ko‘rinishida va Custom jamlash usuli bilan. Nomida bo‘sh joy bor maydonlarni bittalik qo‘shtirnoqqa oling.

Excel’dagi muhim nozik jihat: hisoblanadigan maydon qatorma-qator emas, **maydonlar jamisi** bilan ishlaydi. Ulush yoki marja uchun bu to‘g‘ri. Ammo `=Price*Quantity` barcha narxlar yig‘indisini barcha miqdorlar yig‘indisiga ko‘paytiradi — bu ma’nosiz natija. Qator darajasidagi hisoblarni manba ma’lumotlarga ustun sifatida qo‘shing.

## 5-qadam. Filtrlar va kesimlar

- Yig‘ma jadvalning o‘zidagi **filtrlar** bir martalik tanlovlar uchun mos.
- **Kesimlar (slicers)** — rahbar uchun qulay tugmalar. Excel’da: Insert → Slicer; sanalar uchun **Timeline** bor. Report Connections orqali bitta kesimni bir manbadagi bir nechta yig‘ma jadvalga ulash mumkin.
- Google Sheets’da: Data → **Add a slicer**. U varaqdagi shu diapazonga qurilgan yig‘ma jadval va diagrammalarni filtrlaydi.

## Yig‘ma jadval nega «buziladi»

| Belgi | Sabab | Nima qilish kerak |
|---|---|---|
| Yangi ma’lumotlar hisobotda yo‘q | Excel’da yig‘ma jadval o‘zi yangilanmaydi yoki manba yangi qatorlarni qamramaydi | Refresh (Data → Refresh All), manba sifatida Table |
| Maydon yo‘qolib qoldi | Manbadagi sarlavha qayta nomlangan | Maydonni qaytadan qo‘shish |
| Sum o‘rniga Count yoki nol summalar | Sonlar matn sifatida saqlangan | Songa aylantirish |
| Sanalar guruhlanmaydi | Sana ustunida matn yoki xatolar | Qiymatlarni tuzatish |
| «(blank)» qatori | Manbada bo‘sh qatorlar | Ularni o‘chirish yoki diapazonni toraytirish |
| «Toshkent» ikki marta chiqadi | Har xil yozilish yoki ortiqcha bo‘sh joylar | TRIM bilan tozalash, yagona ro‘yxatga keltirish |
| Jamilar haqiqiydan katta | Manbada «Jami» qatorlari bor | Ularni ma’lumotlardan olib tashlash |

Yangilashda Excel yig‘ma jadvallar bir-birining ustiga chiqishi haqida ogohlantirsa, bitta varaqda ikki yig‘ma jadval juda yaqin turibdi. Ularni alohida varaqlarga ajrating.

## FAQ

### Yig‘ma jadval avtomatik yangilanadimi?

Google Sheets’da — ha, ma’lumotlar o‘zgarishi bilan. Excel’da — yo‘q: Refresh tugmasini bosing yoki PivotTable Options’da fayl ochilganda yangilashni yoqing.

### Bir nechta varaqdan yig‘ma jadval qurish mumkinmi?

Avval ma’lumotlarni bitta jadvalga birlashtirish ishonchliroq. Excel’da buning uchun Power Query va Data Model bor, Google Sheets’da esa diapazonlarni formula bilan, masalan QUERY orqali birlashtirish mumkin.

### Yig‘ma jadvalmi yoki SUMIFS formulalarimi?

Ma’lumotlarni turli kesimlarda tez o‘rganish uchun yig‘ma jadval qulayroq. Ko‘rinishi qat’iy belgilangan va o‘zi qayta hisoblanadigan hisobot kerak bo‘lsa, formulalar yaxshiroq.
