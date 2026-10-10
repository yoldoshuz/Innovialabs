---
title: Feature flags nima va ular relizlarni qanday xavfsizroq qiladi
description: Feature flags deploy va relizni qanday ajratadi, flag turlari, qaysi vositalarni tanlash va flaglar bo‘yicha texnik qarzni qanday to‘plamaslik.
summary: Feature flag — koddagi almashtirgich bo‘lib, yangi deploysiz funksiyani yoqadi yoki o‘chiradi. U kodni oldindan chiqarish, funksiyani avval foydalanuvchilarning bir qismiga ochish va muammo bo‘lsa darhol o‘chirish imkonini beradi.
---

## Qisqacha: feature flag nima

**Feature flag** (funksiya bayrog‘i, feature toggle) — koddagi shart bo‘lib, foydalanuvchiga yangi funksiyani ko‘rsatish-ko‘rsatmaslikni hal qiladi. Flag qiymati koddan tashqarida saqlanadi: konfigda, bazada yoki maxsus servisda — va qayta yig‘ish hamda deploysiz o‘zgartiriladi.

```ts
if (flags.isEnabled("new-checkout", user)) {
  return renderNewCheckout();
}
return renderOldCheckout();
```

Asosiy g‘oya — **deploy va relizni ajratish**. Deploy — kodni serverga yetkazish. Reliz — funksiya foydalanuvchilarga ochiladigan payt. Flaglar bilan bu ikki mustaqil qarorga aylanadi.

## Nega bu relizlarni xavfsizroq qiladi

- **Darhol orqaga qaytarish.** Funksiya buzilsa, butun deployni qaytarmasdan flagni o‘chirasiz.
- **Bosqichma-bosqich ishga tushirish.** Avval jamoa, keyin foydalanuvchilarning kichik qismi, so‘ngra hamma.
- **Uzoq yashaydigan branchlar kamroq.** Tugallanmagan kodni o‘chirilgan flag ortida main’ga qo‘shish mumkin (trunk-based development).
- **Biznes signali bo‘yicha reliz.** Marketing funksiyani dasturchilarsiz kerakli kuni ochadi.

## Flag turlari

| Turi | Nima uchun | Yashash muddati |
|---|---|---|
| **Release** | Tugallanmagan yoki yangi funksiyani ishga tushguncha yashirish | Qisqa: to‘liq relizdan keyin o‘chirish |
| **Experiment** | A/B-test: turli guruhlarga turli variantlar | Tajriba tugaguncha |
| **Ops / kill switch** | Tizimning og‘ir yoki xavfli qismini favqulodda o‘chirish | Uzoq, ko‘pincha doimiy |
| **Permission** | Funksiyani muayyan tariflar yoki mijozlarga ochish | Uzoq |

Bu farq muhim: bir yil unutilgan release flag — qarz, yillar davomida yashaydigan kill switch esa odatiy hol.

## Qanday vositalar bor

- **Konfig yoki muhit o‘zgaruvchilari.** Bir-ikki flag uchun eng oddiy variant, lekin qiymatni o‘zgartirish ko‘pincha qayta ishga tushirishni talab qiladi.
- **Bazada o‘z jadvalingiz + admin panel.** Moslashuvchan, lekin targeting, audit va raskatka foizlarini o‘zingiz yozasiz.
- **Open-source yechimlar** — masalan, Unleash, Flagsmith, GrowthBook. O‘z serveringizda o‘rnatish mumkin.
- **SaaS servislar** — masalan, LaunchDarkly. Tayyor SDK, targeting, audit, lekin bu tashqi bog‘liqlik va obuna.
- **OpenFeature standarti** — flaglar uchun yagona API, kodni qayta yozmasdan provayderni almashtirish imkonini beradi.

Tanlov flaglar soniga, foydalanuvchilar bo‘yicha targeting kerakligiga va yechimni o‘zingiz qo‘llab-quvvatlashga tayyorligingizga bog‘liq.

## Flaglar bo‘yicha qarzni qanday to‘plamaslik

Har bir flag — koddagi qo‘shimcha `if` tarmog‘i va test uchun ortiqcha ssenariy. Intizomsiz ular yuzlab bo‘lib ketadi.

- **Egasi va muddati.** Har bir flagning mas’uli va kutilayotgan o‘chirish sanasi bor.
- **Tushunarli nomlar.** `checkout-v2-release`, `flag1` yoki `test_new` emas.
- **O‘chirish — vazifaning bir qismi.** To‘liq relizdan keyin flag va eski kod tarmog‘ini o‘chirish uchun vazifa oching.
- **Muntazam audit.** Har sprint yoki oyda uzoq vaqt 100% yoki 0% da turgan flaglarni tekshiring.
- **Xavfsiz standart qiymat.** Flag servisi ishlamasa, kod oldindan aytib bo‘ladigan rejimda ishlashi kerak.

## Ko‘p uchraydigan xatolar

- Flaglarni bir-birining ichiga joylash — test qilish uchun kombinatsiyalar juda ko‘payadi.
- Flagni faqat frontendda tekshirish, backend endpoint esa ochiq qoladi.
- Flaglarni to‘g‘ri kirish huquqlari tizimi o‘rniga ishlatish.
- Flagni kim va qachon almashtirganini loglamaslik.

## FAQ

### Feature flag Git’dagi alohida branchdan nimasi bilan farq qiladi?

Branch kodni qo‘shilgunga qadar ajratadi, flag esa qo‘shilgandan keyin. Flaglar bilan kod main’da yashaydi va deploy qilinadi, lekin siz ochishga qaror qilmaguningizcha funksiya o‘chiq qoladi.

### Flaglar ilovani sekinlashtiradimi?

Flagni tekshirish odatda arzon: SDK qiymatlarni lokal keshlaydi. Muammo faqat har bir tekshiruvda tarmoq so‘rovi yuborilsa paydo bo‘ladi — bundan qochish kerak.

### Kichik jamoaga pullik servis kerakmi?

Shart emas. Bir nechta flag uchun konfig yoki bazadagi jadval yetarli. Servis yoki open-source yechim raskatka foizlari, targeting va audit kerak bo‘lganda o‘zini oqlaydi.
