---
title: Google Play’da ilova nashr qilish: bosqichma-bosqich qo‘llanma
description: Google Play’da nashr qilish yo‘li: Play Console akkaunti, yangi shaxsiy akkauntlar uchun yopiq test, do‘kon sahifasi, reyting, Data Safety va relizlar.
summary: Google Play’da nashr qilish — bu tasdiqlangan Play Console akkaunti, imzolangan AAB, to‘ldirilgan deklaratsiyalar (reyting, Data Safety, maxfiylik siyosati), do‘kon sahifasi, test treklari va tekshiruvdan keyingi reliz; yangi shaxsiy akkauntlar avval yopiq testdan o‘tishi kerak.
---

## Qisqa javob

Tayyor yig‘madan Google Play’dagi ilovagacha bo‘lgan yo‘l quyidagicha:

1. **Play Console**’da akkaunt ochish va verifikatsiyadan o‘tish.
2. Ilova yaratish va imzolangan **AAB** tayyorlash.
3. **«Ilova kontenti»** bo‘limini to‘ldirish: maxfiylik siyosati, reyting, Data Safety va boshqa deklaratsiyalar.
4. **Do‘kon sahifasini** rasmiylashtirish.
5. **Test treklaridan** o‘tish. Yangi shaxsiy akkauntlar uchun production’ga kirishdan oldin yopiq test majburiy.
6. Relizni chiqarish, tekshiruvni kutish va yangilanishni bosqichma-bosqich tarqatish.

## 1-qadam. Dasturchi akkaunti

Akkaunt turini tanlang:

- **Shaxsiy** — xususiy dasturchi uchun. Yangi shaxsiy akkauntlarga yopiq test talabi qo‘llanadi (quyida batafsil).
- **Tashkilot** — kompaniya uchun. **D-U-N-S** raqami kerak bo‘ladi, do‘konda esa kompaniya nomi ko‘rsatiladi.

Ro‘yxatdan o‘tish bir martalik to‘lov, email va telefonni tasdiqlash hamda shaxs yoki tashkilotni tekshirishni o‘z ichiga oladi. Akkauntni xodimning shaxsiy pochtasiga emas, korporativ pochtaga oching va jamoaga foydalanuvchilarni boshqarish orqali kirish huquqini bering.

## 2-qadam. Yig‘ma

- Format — upload key bilan imzolangan **AAB**; foydalanuvchilar uchun imzoni Play App Signing qo‘yadi.
- **applicationId** noyob va nashrdan keyin o‘zgarmaydi.
- **versionCode** har bir yuklashda oshiriladi.
- **targetSdk** Google Play’ning amaldagi talabiga mos keladi.
- Debug loglar, test API manzillari va zaglushkalar olib tashlangan.

## 3-qadam. Ilova kontenti

Bu deklaratsiyalar to‘plami bo‘lib, ularsiz relizni tekshiruvga yuborib bo‘lmaydi:

- **Maxfiylik siyosati** — ma’lumotlar real qanday qayta ishlanishini tasvirlovchi, havola orqali ochiladigan ommaviy sahifa.
- **Ilovaga kirish** — agar kirish talab qilinsa, ko‘rib chiquvchiga test akkaunt va yo‘riqnoma bering.
- **Reklama** — ilovada reklama bor-yo‘qligi.
- **Yosh reytingi** — IARC so‘rovnomasi; hududlar uchun reytinglar javoblaringiz asosida avtomatik beriladi. Halol javob bering: nomuvofiqlik bloklanishga olib keladi.
- **Maqsadli auditoriya** — agar unga bolalar kirsa, oilaviy siyosatning qo‘shimcha talablari amal qiladi.
- **Data Safety** — qanday ma’lumotlar yig‘iladi va uzatiladi, nima uchun, uzatishda shifrlanadimi, ularni o‘chirish mumkinmi. Barcha SDK’larni hisobga oling: analitika, xatolik hisobotlari, reklama, to‘lovlar.
- **Akkauntni o‘chirish** — agar ilovada akkaunt yaratish mumkin bo‘lsa, uni ilova ichida va veb-havola orqali o‘chirish imkoni kerak.
- **Maxsus ruxsatlar** — SMS, qo‘ng‘iroqlar jurnali, fon geolokatsiyasi va shunga o‘xshash ma’lumotlarga kirish uchun asoslangan alohida deklaratsiyalar kerak.

## 4-qadam. Do‘kon sahifasi

- **Nom** 30 belgigacha, **qisqa tavsif** 80 belgigacha, **to‘liq tavsif** 4000 belgigacha.
- **Ikonka** 512×512 PNG, **grafik banner** 1024×500, telefon skrinshotlari, kerak bo‘lsa — planshet skrinshotlari.
- Sahifaning auditoriya tillariga **tarjimalari**: rus, o‘zbek, ingliz.
- Kategoriya va aloqa uchun email.

Nomda «eng yaxshi» yoki «№1» kabi so‘zlar, emoji va boshqa brendlardan foydalanmang: metama’lumotlar alohida siyosat bo‘yicha tekshiriladi.

## 5-qadam. Test treklari

| Trek | Nima uchun | Xususiyatlari |
|---|---|---|
| Ichki test | jamoa tomonidan tezkor tekshiruv | testerlarning kichik ro‘yxati, yig‘ma tez ochiladi |
| Yopiq test | taklif qilingan foydalanuvchilarda test | yangi shaxsiy akkauntlar uchun majburiy bosqich |
| Ochiq test | ommaviy beta | ilova sahifasidan istalgan kishi qo‘shilishi mumkin |
| Production | barcha foydalanuvchilar | bosqichma-bosqich tarqatish mumkin |

**Yangi shaxsiy akkauntlar uchun talab:** ushbu maqola yozilgan paytda kamida 12 nafar tester bilan, ular kamida 14 kun ketma-ket testda qolgan holda yopiq test o‘tkazish, shundan keyingina test qanday o‘tgani haqidagi savollarga javob berib, production’ga kirish uchun ariza topshirish kerak. Shartlar o‘zgarishi mumkin — amaldagilarini [Play Console ma’lumotnomasida](https://support.google.com/googleplay/android-developer) tekshiring.

Testerlarni oldindan to‘plang, fikr-mulohazalarni yig‘ing va test davomida yangilanishlar chiqaring: arizada bu haqda so‘raladi.

## 6-qadam. Reliz va tekshiruv

- Production’da reliz yarating, AAB yuklang, o‘zgarishlar tavsifini qo‘shing va tekshiruvga yuboring.
- **Tekshiruv muddati** — odatda bir necha soatdan bir necha kungacha; birinchi nashr va yangi akkauntlar uzoqroq tekshiriladi. Marketing ishga tushirilishini yuborish kuniga belgilamang.
- **Boshqariladigan nashr** tasdiqlangan o‘zgarishlar qachon ko‘rinishini o‘zingiz hal qilish imkonini beradi.
- **Bosqichma-bosqich tarqatish**: foydalanuvchilarning kichik ulushidan boshlang, Android vitals’dagi nosozliklar va ANR’larni kuzating va qamrovni kengaytiring. Tarqatishni to‘xtatish mumkin.

## Rad etishning ko‘p uchraydigan sabablari

- Ko‘rib chiquvchi kira olmaydi — test akkaunt yo‘q.
- Data Safety SDK’lar real yig‘ayotgan narsalarga mos kelmaydi.
- Maxfiylik siyosati ochilmaydi yoki shablon tarzida yozilgan.
- Maxsus ruxsatlar deklaratsiyasiz va tushunarli sababsiz so‘ralgan.
- Testerlar oxirgi daqiqada to‘planadi va ishga tushirish kechikadi.

## FAQ

### Noldan nashr qilish qancha vaqt oladi?

Muddat akkaunt verifikatsiyasi, shaxsiy akkaunt uchun yopiq test (kamida ikki hafta) va relizni tekshirishdan tashkil topadi. Tashkilot akkaunti tezroq o‘tadi, chunki yopiq test talabi unga tatbiq etilmaydi.

### Shaxsiy akkauntmi yoki tashkilot akkauntimi?

Agar ilovani kompaniya chiqarsa — tashkilot akkaunti: do‘konda kompaniya nomi ko‘rinadi va majburiy yopiq test kerak emas. Shaxsiy akkaunt xususiy dasturchilarga mos keladi.

### Har bir yangilanish tekshiriladimi?

Ha, yangilanishlar va do‘kon sahifasidagi o‘zgarishlar ham tekshiruvdan o‘tadi, odatda birinchi nashrdan tezroq.
