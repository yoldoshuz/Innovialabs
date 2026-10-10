---
title: AI savdo yordamchisi: lidlarni avtomatik saralash
description: AI yordamchi qanday saralovchi savollar beradi, lidlarni baholaydi, CRMga yozadi va issiq mijozlarni yolg‘on va’dalarsiz menejerlarga uzatadi.
summary: AI savdo yordamchisi bir necha xabarda mijozning ehtiyoji, byudjeti va muddatlarini aniqlaydi, lidni baholaydi, hammasini CRMga saqlaydi va issiq lidlarni menejerga beradi — tasdiqlangan qoidalarda yo‘q narsani esa hech qachon va’da qilmaydi.
---

## AI savdo yordamchisi nima qiladi

AI savdo yordamchisi — chatda, messenjerda yoki saytda kelgan murojaatga birinchi bo‘lib javob beradigan LLM. Uning vazifasi «sotish» emas, balki **kim bilan gaplashayotganini tez tushunish**:

- bir nechta saralovchi savol berish;
- lid xaridga qanchalik tayyorligini baholash;
- javoblarni CRMga tuzilgan ko‘rinishda yozish;
- issiq lidni menejerga uzatish, qolganlarga esa foydali keyingi qadamni taklif qilish.

Menejerlar dastlabki so‘rovga vaqt sarflamay, suhbatni tayyor kontekst bilan boshlaydi.

## Saralovchi savollar qanday tuziladi

Asos sifatida joriy savdo jarayoningiz olinadi. Ko‘pincha **BANT** mantig‘i ishlatiladi: byudjet, vakolat, ehtiyoj, muddat. Lekin ifodalar anketa emas, jonli suhbatdek bo‘lishi kerak.

Tamoyillar:

- **Bir xabarda bitta savol.** Uzun ro‘yxat odamni cho‘chitadi.
- **Aytilgan narsani qayta so‘ramaslik.** Model oldingi javoblarni hisobga olishi kerak.
- **«Bilmayman» javobiga yo‘l qo‘yish.** Byudjet ko‘pincha noma’lum — bu ham javob, bosim o‘tkazish uchun sabab emas.
- **Mijozning o‘z savollariga** davom etishdan oldin bilimlar bazasi asosida javob berish.

## Lidlarni baholash (skoring)

LLM erkin matndan ma’lumot ajratib olishda yaxshi, ammo yakuniy bahoni **koddagi qoidalar** bilan hisoblash ishonchliroq. Model maydonlarni to‘ldiradi, kod ball qo‘yadi.

```json
{
  "need": "onlayn to‘lovli internet-do'kon",
  "budget_known": true,
  "decision_maker": true,
  "timeline": "1-3 months",
  "company_size": "small",
  "contact": "+998..."
}
```

Mantiq namunasi: ehtiyoj aniq, muddat ma’lum va suhbatdosh qaror qabul qiladi — lid «issiq». Muddat va byudjet yo‘q — «iliq», unga foydali material yuboriladi. Shunday qilib baho **oldindan aytib bo‘ladigan va tushuntiriladigan** bo‘lib qoladi, qoidalarni esa savdo bo‘limi o‘zgartira oladi.

## CRMga yozish

Yordamchi CRMingiz API orqali ishlaydi:

1. Dublikat yaratmaslik uchun telefon yoki email bo‘yicha mavjud kontaktni qidiradi.
2. Bitim yaratadi yoki yangilaydi va maydonlarni JSONdan to‘ldiradi.
3. To‘liq yozishma va qisqa xulosani biriktiradi.
4. Voronka bosqichi va mas’ul xodimni belgilaydi.

Muhim: maydonlar tuzilmasi oldindan belgilanadi va yozishdan oldin model javobi **tekshiriladi (validatsiya)**. Maydon tekshiruvdan o‘tmasa, u taxmin bilan to‘ldirilmaydi, bo‘sh qoladi.

## Issiq lidlarni menejerga uzatish

- Menejer xulosa bilan bildirishnoma oladi: nima kerak, muddatlar, asosiy shartlar.
- Yordamchi mijozga odam ulanishini va taxminan qachonligini rostini aytadi.
- Belgilangan vaqtda menejer lidni olmasa, boshqa xodimga eskalatsiya ishga tushadi.

## Yolg‘on va’dalardan himoya

Bu asosiy xavf. LLM foydali bo‘lishga intiladi va mavjud bo‘lmagan chegirma, muddat yoki funksiyani «va’da qilib» qo‘yishi mumkin.

Nima yordam beradi:

- **Tizim yo‘riqnomasidagi qat’iy taqiqlar:** bilimlar bazasida bo‘lmasa, narx, chegirma va muddatlarni aytmaslik.
- **Narx haqida faqat tasdiqlangan prays bo‘yicha** javob berish yoki «aniq narxni menejer hisoblab beradi» iborasi.
- **Yuborishdan oldin javobni tekshirish:** alohida qoida yoki modelning ikkinchi chaqiruvi va’dalar, summalar va sanalarni qidiradi.
- Barcha suhbatlarni **jurnalga yozish** va muntazam tanlab ko‘rib chiqish.
- **Shaffoflik:** mijoz AI yordamchi bilan gaplashayotganini bilishi kerak.

## Ko‘p uchraydigan xatolar

- Suhbatni ketma-ket o‘nta savolli anketaga aylantirish.
- Lid qiymati haqidagi yakuniy qarorni qoidalarsiz modelga topshirish.
- CRMga validatsiyasiz yozib, dublikatlar ko‘paytirish.
- Issiq lidlarning qanchasi haqiqatan bitimgacha yetganini kuzatmaslik.

## FAQ

### Bot bilan muloqot mijozlarni cho‘chitmaydimi?

Ko‘pincha javobni uzoq kutish ko‘proq cho‘chitadi. Yordamchi tez, aniq javob bersa va suhbatni odamga oson uzatsa, ko‘pchilik mijozlar uchun bu qulay. Asosiysi — bu AI ekanini yashirmaslik.

### Yordamchini istalgan CRMga ulash mumkinmi?

CRMda API yoki vebhuklar bo‘lsa, integratsiya odatda mumkin. Murakkablik undagi maydonlar va voronka bosqichlarini qanchalik moslashuvchan sozlash mumkinligiga bog‘liq.

### Yordamchi yaxshi ishlayotganini qanday bilaman?

Ishga tushirishdan oldin va keyin birinchi javob tezligini, asosiy maydonlari to‘ldirilgan lidlar ulushini va issiq lidlarning bitimga aylanishini solishtiring. Shuningdek, yozishmalarni muntazam qo‘lda o‘qib boring.
