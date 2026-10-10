---
title: Biznesda yuzni tanish: ssenariylar, aniqlik va qonun
description: Yuzni tanish biznesga qayerda foydali — kirish nazorati va ish vaqti hisobi, xatolar va modellar xolisligi, ishga tushirishdan oldingi biometrik talablar.
summary: Yuzni tanish odamlar tekshiruvga o‘zi rozi bo‘lgan joyda o‘rinli — ofisga kirish, smena hisobi; ishga tushirishdan oldin xato chegarasini tanlang, tizimni o‘z xodimlaringizda sinang va biometrik ma’lumotlarga rozilik oling.
---
## Qisqa javob

Yuzni tanish **nazorat ostidagi ssenariylarda** yaxshi ishlaydi: odam tizim haqida biladi, kameraga qaraydi va rozilik bergan. Bu ofisga kirish, ish vaqtini hisobga olish, ilovada shaxsni tasdiqlash. Olomon ichidan odamlarni ularning bexabarligida qidirish murakkabroq va xavfliroq: xatolar ko‘proq, qonun talablari qattiqroq.

## Odatiy ssenariylar

- **Kirish nazorati** — turniket yoki eshik karta o‘rniga yuz orqali ochiladi. Kartani boshqaga berish mumkin, yuzni — yo‘q.
- **Ish vaqti hisobi** — xodim kirishdagi terminalda belgilanadi, ma’lumotlar HR tizimi yoki 1C’ga ketadi.
- **Shaxsni tasdiqlash (KYC)** — onlayn ro‘yxatdan o‘tishda selfini hujjatdagi foto bilan solishtirish.
- **Doimiy mijozlarga xizmat** — faqat mijozning aniq roziligi bilan, aks holda bu afzallikdan ko‘ra xavf.

## Ishlashning ikki rejimi

| Rejim | Nima qiladi | Misol |
|---|---|---|
| **Verifikatsiya 1:1** | Odam o‘zini kim deb ko‘rsatsa, o‘sha ekanini tekshiradi | Selfi va pasportdagi foto |
| **Identifikatsiya 1:N** | Odamni ko‘p yuzli bazadan qidiradi | Kartasiz turniket |

Identifikatsiya murakkabroq: baza qanchalik katta bo‘lsa, ikki o‘xshash odamni adashtirish ehtimoli shunchalik yuqori.

## Aniqlikni qanday tushunish kerak

Tizimda ikki xil xato bor:

- **FMR / FAR (yolg‘on moslik)** — tizim begonani o‘tkazib yubordi.
- **FNMR / FRR (yolg‘on rad)** — tizim o‘zimiznikini tanimadi.

Ular **chegara** (threshold) orqali bog‘liq: chegara qat’iyroq — begonalar kamroq o‘tadi, lekin o‘zimiznikilar ko‘proq tanilmaydi. Server xonasi eshigi uchun qat’iy chegara kerak, smenaga belgilanish uchun yumshoqrog‘i ham bo‘ladi.

Amalda aniqlikka nima ta’sir qiladi:

- yoritish, kamera burchagi va o‘rnatish balandligi;
- niqoblar, ko‘zoynaklar, bosh kiyimlar;
- bazaga ro‘yxatdan o‘tkazishdagi foto sifati;
- **soxtalashtirishdan himoya (liveness)** — usiz tizimni foto yoki telefondagi video bilan aldash mumkin.

## Modellarning xolis emasligi

Mustaqil testlar, masalan NIST’ning yuzni tanish algoritmlarini baholash dasturi, ko‘p algoritmlarning aniqligi turli demografik guruhlar uchun farq qilishini ko‘rsatadi. Shuning uchun:

- vendor e’lon qilgan aniqlikka tayanmang — **tizimni o‘z odamlaringizda sinang**;
- xatolarni faqat o‘rtacha emas, guruhlar bo‘yicha alohida ko‘ring;
- **zaxira yo‘l** qoldiring: karta, PIN yoki qo‘riqchi tekshiruvi.

## Qonun va biometrik ma’lumotlar

Odamni tanish mumkin bo‘lgan yuz tasviri — bu **biometrik shaxsiy ma’lumot**. Ko‘pchilik yurisdiksiyalarda unga alohida talablar qo‘yiladi. O‘zbekistonda «Shaxsga doir ma’lumotlar to‘g‘risida»gi qonun, Yevropa Ittifoqida GDPR, Rossiyada 152-FZ amal qiladi. Umumiy tamoyillar o‘xshash:

- **Rozilik** — aniq va ongli; xodimlar uchun uni alohida hujjat bilan rasmiylashtirish kerak.
- **Maqsad va minimallashtirish** — faqat e’lon qilingan maqsad uchun keraklisini yig‘ing.
- **Saqlash** — ma’lumotlar qayerda, kimda kirish bor, qancha saqlanadi. Ayrim mamlakatlarda fuqarolar ma’lumotlarini mahalliy saqlash talabi bor.
- **Muqobil** — odam rad etib, boshqa usuldan foydalana olishi kerak.
- **Himoya** — shifrlash, kirish jurnali, xodim ishdan ketganda o‘chirish.

Aniq talablar o‘zgarib turadi, shuning uchun ishga tushirishdan oldin yurist bilan maslahatlashing.

## Ishga tushirishdan oldingi chek-list

1. Maqsad belgilangan va nega yuzsiz hal qilib bo‘lmasligi tushunarli.
2. Rejim (1:1 yoki 1:N) va xato chegarasi tanlangan.
3. Liveness tekshiruvi bor.
4. Real xodimlarda pilot o‘tkazilgan, xatolar sanalgan.
5. Roziliklar va saqlash siyosati rasmiylashtirilgan.
6. Kirishning zaxira usuli bor.

## FAQ

### Yuzni tanishni mavjud kameralarga ulash mumkinmi?

Ba’zan ha, lekin kuzatuv kameralari odatda baland o‘rnatiladi va burchak ostida suratga oladi, bu aniqlikni pasaytiradi. Kirish va ish vaqti hisobi uchun ko‘pincha yuz balandligida alohida terminallar o‘rnatiladi.

### Bu o‘zimizning ofis bo‘lsa, xodimlar roziligi kerakmi?

Odatda ha: biometriya ma’lumotlarning alohida toifasiga kiradi. Rasmiylashtirish tartibi mamlakatga bog‘liq, shuning uchun ishga tushirishdan oldin yurist bilan aniqlang.

### Tizim ayrim xodimlarni tanimasa nima qilish kerak?

Ularni sifatli foto bilan qayta ro‘yxatdan o‘tkazing, yoritish va kamera burchagini tekshiring, kerak bo‘lsa chegarani to‘g‘rilang. Va doim zaxira kirish usulini saqlang.
