---
title: Dizayndagi vizual ierarxiya: e’tiborni qanday boshqarish mumkin
description: Vizual ierarxiya avval nimaga qarash kerakligini ko‘rsatadi. O‘lcham, kontrast, rang, bo‘shliq va joylashuv uni qanday quradi, gavjum ekranni tuzatish misoli.
summary: Vizual ierarxiya — ko‘z ekranni o‘qiydigan tartib, u o‘lcham, kontrast, rang, bo‘shliqlar va joylashuv bilan boshqariladi. Har bir ekranda bitta asosiy elementni tanlang, uni eng kuchli qiling va qolganlarini ataylab susaytiring.
---
## Qisqa javob

**Vizual ierarxiya** — elementlarni odamlar ularni muhimlik tartibida ko‘radigan qilib joylashtirish: avval asosiy xabar, keyin tushuntiruvchi detallar, so‘ng qolgan hamma narsa. Foydalanuvchilar interfeyslarni o‘qimaydi, balki ko‘z yugurtirib chiqadi. Agar barcha elementlar bir xil baland «baqirsa», hech biri eshitilmaydi va asosiy harakat yo‘qoladi.

Asosiy qoida: **ekranda eng muhimi nima ekanini hal qiling, uni vizual jihatdan eng kuchli qiling, qolganini esa sokinroq.** Ierarxiya faqat asosiysini ajratish bilan emas, ikkinchi darajalilarni susaytirish bilan ham yaratiladi.

## Ierarxiyaning beshta vositasi

**1. O‘lcham.** Katta elementlar birinchi bo‘lib ko‘zga tashlanadi. Asosiy matndan sezilarli kattaroq sarlavha tuzilmani darhol ko‘rsatadi. Ko‘plab deyarli bir xil o‘lchamlar o‘rniga cheklangan shkaladan (masalan, 4–6 qiymat) foydalaning.

**2. Kontrast va shrift qalinligi.** Och fonda to‘q matn, oddiyga qarshi qalin, konturliga qarshi to‘ldirilgan. Ikkinchi darajali matn yumshoq kulrangda yo‘qolmasdan orqaga chekinadi. O‘qish uchun yetarli kontrastni saqlang: WCAG kabi foydalanish imkoniyati talablari matn uchun minimal kontrast koeffitsiyentlarini belgilaydi.

**3. Rang.** To‘yingan urg‘u rangi nigohni tortadi, shuning uchun uni bitta narsa uchun qoldiring: asosiy harakat yoki muhim holat. Agar havolalar, ikonlar, belgilar va fonlar urg‘u rangida bo‘lsa, u ishlashdan to‘xtaydi.

**4. Bo‘shliqlar va guruhlash.** Yonma-yon turgan elementlar o‘zaro bog‘liq deb qabul qilinadi (yaqinlik tamoyili). Element atrofida qancha ko‘p bo‘shliq bo‘lsa, unga shuncha ko‘p e’tibor qaratiladi. Guruhlar orasidagi katta va ular ichidagi zich bo‘shliqlar ekranni ortiqcha chiziq va ramkalarsiz o‘qiladigan qiladi.

**5. Joylashuv.** Nigoh odatda yuqoridan va chapdan o‘ngga yoziladigan tillarda chapdan boshlanadi. Muhim narsalar yuqoriroqqa va tabiiy ko‘z yugurtirish yo‘llariga joylashtiriladi. Keng tarqalgan sxemalar — matnli sahifalar uchun **F-pattern** va oddiy lending ekranlari uchun **Z-pattern**.

## Oldin va keyin: gavjum ekranni tuzatamiz

Obuna tarifi kartochkasini tasavvur qiling.

**Oldin:**

```text
PRO TARIF | YANGI! | FOYDALI | -20%
Jamoangizga kerak bo‘lgan hamma narsa
$29/oy   yillik to‘lov   QQS kiritilgan
[Sinab ko‘rish] [Taqqoslash] [Bog‘lanish] [Batafsil]
Funksiya 1  Funksiya 2  Funksiya 3  Funksiya 4  Funksiya 5  Funksiya 6
```

Muammolar: to‘rtta belgi tarif nomi bilan raqobatlashadi, narx va shartlar bir xil o‘lchamda, to‘rtta tugma teng ko‘rinadi, funksiyalar guruhlanmagan zich qator. Nigoh to‘xtaydigan joy yo‘q.

**Keyin:**

```text
Pro
$29 / oy
yillik to‘lov, QQS kiritilgan

[   Bepul sinab ko‘rish   ]
   Tariflarni taqqoslash

  - Funksiya 1
  - Funksiya 2
  - Funksiya 3
  + yana 3 ta
```

Nima o‘zgardi:

- **Ortiqcha belgilar olib tashlandi.** Sarlavha sifatida faqat tarif nomi qoldi.
- **Narx eng katta elementga aylandi**, shartlar uning ostiga kichik kulrang matn bilan ko‘chirildi.
- Urg‘u rangida **bitta asosiy tugma**; «Tariflarni taqqoslash» sokin matnli havolaga aylandi; «Bog‘lanish» va «Batafsil» sahifaning boshqa joyiga ko‘chirildi.
- **Funksiyalar yuqoridan bo‘shliq bilan qisqa ro‘yxatga aylandi**: asosiy uchtasi ko‘rinadi, qolganlari yashirilgan.
- **Bo‘shliqlar kontentni uchta blokka guruhladi**: nom va narx, harakat, detallar.

Mazmun deyarli o‘sha, faqat ierarxiya o‘zgardi.

## Har qanday ekran uchun tekshiruv ro‘yxati

- Ekrandagi **bitta asosiy elementni** ayta olasizmi?
- Ko‘rinishda faqat **bitta asosiy tugma** bormi?
- Matnning **o‘lcham va qalinliklari** bir nechtadan oshmaydimi?
- Urg‘u rangi **tejamkorlik bilan** ishlatilganmi?
- Bog‘liq elementlar faqat ramkalar bilan emas, **bo‘shliqlar bilan guruhlanganmi**?
- Ekran **ko‘z qisish testidan** o‘tadimi: nigohni xiralashtirsangiz, asosiy bloklar ajralib turadimi?

## Ko‘p uchraydigan xatolar

- Hamma narsani «muhim bo‘lgani uchun» qalin yoki katta qilish.
- Muhimlikni faqat rang bilan ko‘rsatish — bu rangni farqlashda qiynaladigan odamlar uchun va yomon yorug‘likda ishlamaydi.
- Hamma joyda bir xil bo‘shliqlar, shu sababli guruhlar qo‘shilib ketadi.
- Kontentni bo‘shliq o‘rniga ramkalar, chiziqlar va soyalar bilan ajratish.

## FAQ

### Ierarxiyani qanday tez tekshirish mumkin?

Ko‘z qisish testidan foydalaning yoki kichik xiralashtirilgan skrinshotga qarang. Shuningdek, ekranni kimgadir bir necha soniya ko‘rsatib, nimani eslab qolganini so‘rash mumkin. Agar u boshqa elementni aytsa, ierarxiyani yaxshilash kerak.

### Ekranda bir nechta diqqat markazi bo‘lishi mumkinmi?

Darajalar bir nechta bo‘lishi mumkin, lekin bitta element aniq yetakchi bo‘lishi kerak. Ikki-uchta teng kuchli element foydalanuvchini ikkilantiradi, ayniqsa ular raqobatdosh harakatlar bo‘lsa.

### Mobil ekranlarda ierarxiya muhimmi?

Desktopdagidan ham ko‘proq. Kichik ekran bir vaqtda kamroq narsa ko‘rsatadi, shuning uchun elementlar tartibi va aniq asosiy harakat foydalanuvchi ortiqcha aylantirishsiz tushunib olishini hal qiladi.
