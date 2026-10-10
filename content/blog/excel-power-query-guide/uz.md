---
title: Excel’da Power Query: ma’lumotlarni tozalashni avtomatlashtirish
description: Power Query bo‘yicha amaliy qo‘llanma: fayl va papkalardan import, tozalash va o‘zgartirish, jadvallarni birlashtirish va hisobotni bir bosishda yangilash.
summary: Power Query siz bir marta bajargan tozalash qadamlarini (import, bo‘shliqlarni olib tashlash, turlar, birlashtirish) eslab qoladi va yangi ma’lumotlarda takrorlaydi, shuning uchun bir soatlik qo‘l mehnati talab qilgan hisobot bitta tugma bilan yangilanadi.
---
## Power Query qanday muammoni hal qiladi

**Power Query** — Excel’ga o‘rnatilgan ma’lumotlarni import qilish va o‘zgartirish vositasi (Data → Get Data). Har hafta eksportni qo‘lda tozalash o‘rniga qadamlarni bir marta tasvirlaysiz. Excel ularni so‘rov (query) sifatida saqlaydi va har bir yangilashda takrorlaydi.

Asosiy g‘oyalar:

- Manba fayl **o‘zgarmaydi**. Power Query uni o‘qiydi va tozalangan nusxani yuklaydi.
- Har bir harakat **Applied Steps** ro‘yxatida qadamga aylanadi. Qadamlarni qayta nomlash, joyini almashtirish yoki o‘chirish mumkin.
- Qadamlar ortida **M** formula tili turadi. Usiz ham ishlash mumkin, lekin uni o‘qiy olish xatolarni topishga yordam beradi.

Vosita takrorlanuvchi vazifalar uchun mos: haftalik savdo eksportlari, bank ko‘chirmalari, CRM’dan olingan ma’lumotlar, bir xil formatdagi filiallar hisobotlari.

## Fayl va papkalardan import

**Bitta fayl:** Data → Get Data → From File → From Workbook, From Text/CSV va hokazo. Varaq yoki jadvalni tanlang va Power Query muharririni ochish uchun Load emas, **Transform Data** tugmasini bosing.

**Butun papka** — eng foydali ssenariy. Bir xil tuzilishdagi barcha oylik fayllarni bitta papkaga joylang, so‘ng:

1. Data → Get Data → From File → From Folder, papkani tanlang.
2. **Combine & Transform Data** tugmasini bosing va kerakli varaq yoki jadvalni ko‘rsating.
3. Power Query **namuna fayl** (sample file) asosida yordamchi so‘rov yaratadi. Har bir faylga qo‘llanishi kerak bo‘lgan tozalash qadamlarini «Transform Sample File»ga, umumiy natijadagi qadamlarni esa asosiy so‘rovga qo‘shing.

Shundan so‘ng yangi faylni papkaga tashlab, hisobotni yangilash kifoya.

Maslahat: manba qadamidan keyinoq fayllar ro‘yxatini kengaytma bo‘yicha filtrlang, shunda vaqtinchalik fayllar (masalan, `~$` bilan boshlanadiganlari) va tasodifiy hujjatlar qo‘shilib ketmaydi.

## Tozalash va o‘zgartirish

Eng ko‘p ishlatiladigan qadamlar, barchasi lentada mavjud:

- **Use First Row as Headers** va **Remove Top Rows** — jadval ustida sarlavhasi bor eksportlar uchun.
- **Change Type**: sanalar, sonlar, matn. Turlarni ongli ravishda belgilang va sanalar yoki kasr sonlar boshqa mintaqaviy formatda kelsa, lokalni ko‘rsating (Using Locale).
- **Trim** va **Clean** ortiqcha bo‘shliqlar va ko‘rinmas belgilarni olib tashlaydi. Aynan ular ko‘pincha moslikni qidirish ishlamasligiga sabab bo‘ladi.
- **Replace Values**, guruh sarlavhasi ostidagi bo‘sh kataklar uchun **Fill Down**, **Remove Duplicates**.
- **Split Column** — ajratgich bo‘yicha bo‘lish, masalan «Familiya, Ism».
- **Unpivot Columns** — ustunlarga yoyilgan oylarni qatorlarga aylantiradi. Yig‘ma jadvallar bunday ko‘rinish bilan ancha yaxshi ishlaydi.
- **Filter** — jami qatorlari, bo‘sh qatorlar va test yozuvlarini olib tashlash.

M tilida bunday qadamlar shunday ko‘rinadi (Home → Advanced Editor):

```powerquery
let
    Source = Excel.CurrentWorkbook(){[Name="Sales"]}[Content],
    Trimmed = Table.TransformColumns(Source, {{"Client", Text.Trim, type text}}),
    Typed = Table.TransformColumnTypes(Trimmed, {{"Date", type date}, {"Amount", type number}}),
    NoBlanks = Table.SelectRows(Typed, each [Amount] <> null)
in
    NoBlanks
```

## Jadvallarni birlashtirish va qo‘shish

Ko‘pincha adashtiriladigan ikki xil amal:

| Amal | Nima qiladi | SQL’dagi o‘xshashi | Misol |
|---|---|---|---|
| **Append Queries** | bir xil ustunli jadvallarni ketma-ket ostma-ost qo‘yadi | UNION | yanvar + fevral + mart savdolari |
| **Merge Queries** | kalit bo‘yicha boshqa jadvaldan ustunlarni qo‘shadi | JOIN | savdolar + ID bo‘yicha mijozlar ma’lumotnomasi |

Merge’da kalit ustunlar va **ulanish turi** tanlanadi: Left Outer (birinchi jadvalning barcha qatorlari), Inner (faqat mosliklar), Left Anti (jufti yo‘q qatorlar, bo‘shliqlarni topish uchun qulay) va boshqalar. Birlashtirgandan so‘ng yangi ustunni yoying va faqat kerakli maydonlarni belgilang.

Birlashtirishdan oldin kalitlar **bir xil turda va ortiqcha bo‘shliqsiz** ekanini tekshiring, aks holda «123» va «123 » mos kelmaydi.

## Hisobotni bir bosishda yangilash

**Close & Load To…** orqali natija qayerga borishini tanlang: varaqdagi jadval, yig‘ma jadval (PivotTable) yoki kitobni to‘ldirib yubormasligi kerak bo‘lgan oraliq so‘rovlar uchun **Only Create Connection**.

Keyin:

- **Data → Refresh All** barcha so‘rovlarni qayta ishga tushiradi va ularga asoslangan yig‘ma jadvallarni yangilaydi.
- So‘rov xususiyatlarida **fayl ochilganda yangilash** yoki ma’lum oraliqda yangilashni yoqish mumkin.
- Papka yo‘lini **parametrda** (Manage Parameters) saqlang, shunda hisobotni bitta qiymatni o‘zgartirib boshqa kompyuterga ko‘chirish mumkin.

## Ko‘p uchraydigan xatolar

- **Qattiq yozilgan ustun nomlari.** Manba ustunni qayta nomlasa, Change Type kabi qadamlar xato beradi. Barqaror eksport formatini kelishib oling yoki ustunlarni bitta erta qadamda qayta nomlang.
- **Hammasini varaqlarga yuklash.** Yordamchi so‘rovlar faqat ulanish bo‘lishi kerak.
- **Papkada turli fayllar.** Har xil tuzilish birlashtirish qadamini buzadi.
- **Maxfiylik darajasi xatolari** manbalarni birlashtirishda. Himoyani ko‘r-ko‘rona o‘chirish o‘rniga Query Options → Privacy bo‘limini tekshiring.

## FAQ

### M tilini bilish shartmi?

Yo‘q. Ko‘p vazifalar lentadagi tugmalar bilan hal qilinadi. M interfeysda yo‘q mantiq kerak bo‘lganda yoki qadam nega xato berayotganini tushunish uchun foydali.

### Power Query VBA makroslaridan nimasi bilan farq qiladi?

Power Query aynan import va o‘zgartirish uchun yaratilgan: qadamlar ko‘rinib turadi va tahrirlanadi, manba ma’lumotlar o‘zgarmaydi. VBA esa Excel’dagi har qanday amal uchun universal til, lekin ma’lumotlarni tozalashda uni qo‘llab-quvvatlash qiyinroq.

### Ma’lumotlar Excel’ga sig‘may qolsa nima qilish kerak?

Xuddi shu so‘rovlarni Power BI’ga ko‘chirish mumkin, u yerda ham Power Query ishlaydi. Bir nechta tizim avtomatik ravishda ma’lumot almashishi kerak bo‘lganda, fayllarga asoslangan hisobotlar odatda ma’lumotlar bazasi va to‘laqonli integratsiya bilan almashtiriladi.
