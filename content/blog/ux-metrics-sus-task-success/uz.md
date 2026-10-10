---
title: UX metrikalar: SUS, vazifa muvaffaqiyati va UX’ni o‘lchash
description: SUS, vazifani bajarish muvaffaqiyati, vazifaga ketgan vaqt, xatolar ulushi va SEQ nima, ularni qanday yig‘ish va dizayn iteratsiyalarini qanday solishtirish.
summary: Interfeys qulayligi xulq-atvor metrikalari (vazifa muvaffaqiyati, vaqt, xatolar) va idrok metrikalari (har vazifadan keyin SEQ, test oxirida SUS) bilan o‘lchanadi. Iteratsiyalarni faqat vazifalar, muvaffaqiyat mezonlari va ishtirokchilar bir xil bo‘lganda solishtirish mumkin.
---

## Qisqa javob

UX ikki guruh metrikalar bilan o‘lchanadi:

- **xulq-atvor metrikalari** — inson nima qildi: vazifani bajardimi, qancha vaqt sarfladi, nechta xato qildi;
- **idrok metrikalari** — u buni qanday baholadi: vazifa qanchalik oson bo‘ldi (SEQ) va tizim umuman qanchalik qulay (SUS).

Ular birgalikda alohida olingan hech bir metrika bermaydigan manzarani ko‘rsatadi: foydalanuvchi vazifani bajarishi mumkin, lekin qiynalib, yoki tez, lekin xato bilan.

## Beshta asosiy metrika

| Metrika | Nimani ko‘rsatadi | Qachon yig‘iladi |
|---|---|---|
| Task success rate | muvaffaqiyatli urinishlar ulushi | har bir vazifada |
| Time on task | vazifaga qancha vaqt ketadi | har bir vazifada |
| Error rate | xatolar qanchalik tez-tez | har bir vazifada |
| SEQ | vazifaning subyektiv osonligi | vazifadan so‘ng darhol |
| SUS | tizim qulayligini umumiy idrok | sessiya oxirida |

## Vazifa muvaffaqiyati

**Task success rate** = muvaffaqiyatli urinishlar / barcha urinishlar. Testdan oldin **muvaffaqiyat mezoni**ni yozib qo‘ying: masalan, «buyurtma to‘g‘ri yetkazib berish manzili bilan rasmiylashtirildi». Busiz moderatorlar natijani turlicha hisoblaydi.

Qisman muvaffaqiyatni (yordam bilan bajardi) ham hisobga olish mumkin, lekin u qanday hisoblanishini oldindan kelishib oling va iteratsiyalar orasida qoidani o‘zgartirmang.

## Vazifaga ketgan vaqt

Vaqtni vazifa boshlanishidan muvaffaqiyat mezoniga erishilguncha o‘lchang. Amaliy qoidalar:

- asosan **muvaffaqiyatli** urinishlarni hisobga oling — muvaffaqiyatsizlari manzarani buzadi;
- vaqt taqsimoti odatda o‘ngga og‘gan bo‘ladi, shuning uchun o‘rtacha emas, **mediana**ga qarang;
- «ovoz chiqarib o‘ylash» bilan o‘tadigan moderatsiyali testlarda vaqt oshadi, shuning uchun faqat bir xil formatdagi sessiyalarni solishtiring.

## Xatolar ulushi

Avval **xato** nima ekanini belgilang: navigatsiyadagi noto‘g‘ri bosish, noto‘g‘ri to‘ldirilgan maydon, formani noto‘g‘ri ma’lumot bilan yuborish. Keyin vazifadagi xatolar sonini yoki kamida bitta xato qilgan ishtirokchilar ulushini hisoblang. Faqat qancha emas, qanday xatolar ekani ham muhim: ularni sabablar bo‘yicha guruhlab, dizayn vazifalariga aylantiring.

## SEQ — vazifadan keyin bitta savol

**Single Ease Question**: «Bu vazifani bajarish qanchalik qiyin yoki oson bo‘ldi?» — 1 (juda qiyin) dan 7 (juda oson) gacha shkala. Savol har bir vazifadan so‘ng darhol beriladi. SEQ qaysi ssenariylar rasman bajarilgan bo‘lsa ham og‘ir qabul qilinishini tez ko‘rsatadi.

## SUS — umumiy so‘rovnoma

**System Usability Scale** — 1 dan 5 gacha javob beriladigan 10 ta da’vo; toq raqamlilari ijobiy, juft raqamlilari salbiy shaklda. Hisoblash:

- toq savollar uchun: javob − 1;
- juft savollar uchun: 5 − javob;
- yig‘indi 2,5 ga ko‘paytiriladi va 0 dan 100 gacha ball olinadi.

```js
function sus(answers) { // 10 ta javob massivi, har biri 1 dan 5 gacha
  const sum = answers.reduce((acc, a, i) =>
    acc + (i % 2 === 0 ? a - 1 : 5 - a), 0);
  return sum * 2.5;
}
```

SUS bali **foiz emas**. Nashr qilingan tadqiqotlarda o‘rtacha natija sifatida ko‘pincha taxminan 68 ko‘rsatiladi, lekin mahsulotni o‘zingizning oldingi o‘lchovlaringiz bilan solishtirish eng ishonchli yo‘l.

## Iteratsiyalarni qanday solishtirish kerak

1. Har bir versiya uchun **bir xil vazifalar va muvaffaqiyat mezonlari**.
2. Tajriba va segment bo‘yicha **o‘xshash ishtirokchilar**.
3. **Bitta test formati**: moderatsiyali yoki moderatsiyasiz, bir xil qurilma.
4. **Tarqoqlikka qarang.** Kichik tanlanmalarda bir necha ballik farq tasodifiy bo‘lishi mumkin — ishonch intervallarini yoki hech bo‘lmasa qiymatlar oralig‘ini ko‘rsating.
5. **Raqamlarni kuzatuvlar bilan birlashtiring.** Metrika nima yomonlashganini, sessiya yozuvlari esa nima uchunligini aytadi.

## Tipik xatolar

- Raundlar orasida vazifalar matnini o‘zgartirish.
- O‘rtacha vaqtni muvaffaqiyatsiz urinishlar bilan birga hisoblash.
- SUS’ni «qoniqish foizi» deb taqdim etish.
- Bir nechta ishtirokchi asosida ahamiyatlilik haqida xulosa chiqarish.

## FAQ

### UX metrikalar uchun nechta ishtirokchi kerak?

Maqsadga bog‘liq. Muammolarni topish uchun kichik sifat testi yetarli. Bir versiya boshqasidan yaxshiroq deb ishonch bilan aytish uchun kattaroq tanlanma va ishonch intervallarini baholash kerak.

### Bu metrikalarni moderatorsiz yig‘ish mumkinmi?

Ha. Moderatsiyasiz test platformalari muvaffaqiyat, vaqt hamda SEQ va SUS javoblarini qayd etadi. Lekin muvaffaqiyat mezonlarini ayniqsa puxta sozlash kerak, chunki ishtirokchidan aniqlashtirib bo‘lmaydi.

### Nima muhimroq — SUS yoki xulq-atvor metrikalari?

Ular turli savollarga javob beradi. Xulq-atvor metrikalari interfeys aynan qayerda xalaqit berishini, SUS esa mahsulot umuman qanday qabul qilinishini ko‘rsatadi. Ikkalasidan ham foydalaning.
