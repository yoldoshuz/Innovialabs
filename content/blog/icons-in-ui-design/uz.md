---
title: Interfeysdagi ikonkalar: uslublar, o‘lchamlar va to‘plamlar
description: Kontur yoki to‘ldirilgan ikonkani qanday tanlash, qaysi setka va o‘lchamlardan foydalanish, ikonkalarni bir xil saqlash va qaysi bepul to‘plamlar mos kelishi.
summary: Bitta uslub va bitta chiziq qalinligidagi tayyor ikonka to‘plamini oling, uni 24 px setkada 16, 20, 24 va 32 o‘lchamlarda ishlating, ma’nosi hammaga tushunarli bo‘lmagan amallar uchun esa doim matnli yozuv qo‘shing.
---

## Qisqacha javob

Interfeysdagi yaxshi ikonkalar alohida rasmning chiroyi emas, balki **yagona tizim**dir. Foydalanuvchi amalni bir lahzada tanishi va ikonkalar turli manbalardan olinganini sezmasligi kerak.

Ko‘p muammolarni hal qiladigan uchta qoida:

- Butun mahsulotda **bitta to‘plam va bitta uslub**.
- **Bitta setka va qat’iy o‘lchamlar shkalasi.**
- Ikonka ma’nosi hammaga ravshan bo‘lmasa, **yonida yozuv**.

## Kontur yoki to‘ldirilgan

| Uslub | Qayerda yaxshi | Xavflar |
|---|---|---|
| **Outline** (kontur) | Zich interfeyslar, navigatsiya, asboblar paneli | Kichik o‘lchamda ingichka chiziq yo‘qolib qoladi |
| **Filled** (to‘ldirilgan) | Faol holatlar, kichik o‘lchamlar, yorqin urg‘ular | Ko‘p to‘ldirilgan ikonka ekranni og‘irlashtiradi |
| **Duotone** | Marketing sahifalari, illyustrativ bloklar | Mavzu va qorong‘i rejimga moslash qiyinroq |

Keng tarqalgan usul: **oddiy holat uchun kontur, faol holat uchun to‘ldirilgan**. Ko‘plab mobil ilovalarning pastki navigatsiyasi shunday ishlaydi — tanlangan tab to‘ldiriladi. Asosiysi, uslubni tasodifan emas, ongli ravishda almashtirish.

## Setka va o‘lchamlar

Ko‘pchilik to‘plamlar taxminan 2 px ichki chekinishli **24×24 px setka**da chiziladi. Shu «jonli zona» ichida asosiy shakllar joylashadi: doira, kvadrat, vertikal va gorizontal to‘rtburchak. Shunda dumaloq va kvadrat ikonka bir xil kattalikda ko‘rinadi.

Amaliy o‘lchamlar shkalasi:

- **16 px** — zich matn ichida, belgilar, kichik maydonlar.
- **20 px** — kompakt interfeyslardagi tugmalar va menyu bandlari.
- **24 px** — navigatsiya va amallar uchun asosiy o‘lcham.
- **32 px va undan katta** — bo‘sh holatlar, katta kartochkalar.

Muhim tafsilotlar:

- **Chiziq qalinligi** barcha ikonkalarda bir xil bo‘lishi kerak: 24 o‘lchamda odatda 1,5 yoki 2 px. 16 px gacha kichraytirilganda chiziqni ko‘pincha qalinlashtirish kerak bo‘ladi, aks holda ikonka «sochilib» ketadi.
- **Bosiladigan zona** ikonkaning o‘zidan kattaroq. Apple kamida 44×44 pt, Material Design esa 48×48 dp tavsiya qiladi. Bunday zona ichidagi 24 px ikonka — odatiy amaliyot.
- Oddiy ekranlarda chiziqlar xira bo‘lmasligi uchun **piksel setkasiga tekislang**.

## Bir xillik

Ikonkalar «har xil operadan» ekanini ko‘rsatadigan belgilar:

- turli chiziq qalinligi va burchaklarning turli yumaloqligi;
- birida kontur yopiq, boshqasida kesilgan;
- turli perspektiva: biri tekis, boshqasi izometriyada;
- bitta metafora turli amallar uchun ishlatilgan.

To‘plamda kerakli ikonka bo‘lmasa, uni to‘plam qoidalari bo‘yicha chizing: o‘sha setka, chiziq, radiuslar va chiziq uchlari. Eng yomon yo‘l — yetishmagan ikonkani «vaqtincha» boshqa kutubxonadan olish.

## Yozuvlar va ma’no

Faqat bir nechta ikonka hammaga bir xil tushuniladi: qidiruv, yopish, bosh sahifa, sozlamalar, o‘chirish. Qolganlarining deyarli hammasi taxmin. Shuning uchun:

- **Navigatsiyadagi ikonkalarga yozuv qo‘shing.** Yozuvli pastki panel yozuvsizidan tushunarliroq.
- **Noyob amalni ikonka bilan almashtirmang**, masalan «1C’ga eksport» — bu yerda matn ishonchliroq.
- **Tooltip mobil qurilmalarda yordam bermaydi**: u yerda kursorni olib borish yo‘q.
- **Matnsiz ikonka-tugma** skrinrider o‘qishi uchun ochiq nomga (`aria-label`) ega bo‘lishi kerak.
- **Rang ma’noning yagona tashuvchisi emas**: «xato» holatini shakl va matn bilan ham ko‘rsating.

## Ko‘rib chiqishga arziydigan bepul to‘plamlar

| To‘plam | Xususiyatlari |
|---|---|
| **Material Symbols** | Juda katta tanlov, o‘zgaruvchan parametrlar: qalinlik, to‘ldirish, optik o‘lcham |
| **Lucide** | Toza kontur uslub, React va boshqa freymvorklar uchun qulay paketlar |
| **Phosphor** | Bitta to‘plamning bir nechta varianti: thin, light, regular, bold, fill, duotone |
| **Heroicons** | Outline va solid variantli ixcham to‘plam, Tailwind bilan yaxshi mos keladi |
| **Tabler Icons** | Bir xil chiziq qalinligidagi katta kontur to‘plam |

Foydalanishdan oldin aniq to‘plamning **litsenziyasi**ni va tijoriy foydalanish shartlarini tekshiring — ular farq qiladi va o‘zgarishi mumkin.

## Ko‘p uchraydigan xatolar

- Bitta interfeysda ikki-uchta kutubxonani aralashtirish.
- Ro‘yxatning har bir bandida hech narsani tushuntirmaydigan «chiroy uchun» ikonkalar.
- Bitta ekranda 18, 22 va 26 px kabi tasodifiy o‘lchamlar.
- Foydalanuvchi birinchi marta ko‘rayotgan amal uchun yozuvsiz ikonka.
- Ikonkalarni SVG o‘rniga rastr ko‘rinishida eksport qilish.

## FAQ

### Mahsulot uchun to‘plamda nechta ikonka kerak?

Interfeysda haqiqatan ishlatiladigan miqdorda. Odatda o‘z to‘plamini noldan chizishdan ko‘ra, tayyor kutubxonani ulab, faqat kerakli ikonkalarni import qilish qulayroq. O‘z to‘plami ikonkalar brendning bir qismiga aylanganda o‘zini oqlaydi.

### Ikonkalarni dasturchilarga qaysi formatda berish kerak?

SVG’da: u sifat yo‘qotmasdan masshtablanadi va `currentColor` orqali rangni o‘zgartirishga imkon beradi. Topshirishdan oldin ortiqcha guruhlarni olib tashlang, pipeline talab qilsa chiziqlarni konturga aylantiring va fayllarni yagona sxema bo‘yicha nomlang.

### Tooltip bo‘lsa, ikonkaga yozuv kerakmi?

Asosiy navigatsiya uchun — ha. Tooltip faqat kursor olib borilganda chiqadi, sensorli ekranlarda umuman yo‘q, foydalanuvchi esa avval ikonkaga kursor olib borish kerakligini taxmin qilishi lozim.
