---
title: Ilovani App Store’ga qanday joylash: bosqichma-bosqich qo‘llanma
description: Sertifikatlar va provisioning, App Store Connect sozlamalari, metama’lumotlar va skrinshotlar, build yuklash, ko‘rikka yuborish va bosqichli reliz.
summary: Sizga faol Apple Developer Program a’zoligi, imzolangan build va skrinshotlar hamda maxfiylik siyosati bilan to‘ldirilgan App Store Connect kartochkasi kerak; Apple tasdiqlagach, ilovani darhol, belgilangan sanada yoki bosqichma-bosqich chiqarasiz.
---

## Qisqacha: Xcode’dan App Store’gacha

App Store’ga joylash besh qadamdan iborat:

1. Apple Developer Program’dagi **akkaunt** (yillik pullik a’zolik).
2. **Imzolash**: Bundle ID, distribution sertifikati va provisioning profile.
3. App Store Connect’dagi **ilova kartochkasi**: nomi, tavsifi, skrinshotlar, maxfiylik.
4. Xcode yoki CI orqali **build yuklash**.
5. **Ko‘rik va reliz**: tekshiruvga yuborish, keyin qo‘lda, avtomatik yoki bosqichma-bosqich chiqarish.

Birinchi marta sozlash tufayli ko‘proq vaqt ketadi, keyingi relizlar odatiy tartibda o‘tadi.

## 1-qadam. Sertifikatlar va provisioning

Apple build aynan sizning jamoangiz tomonidan imzolanganini tekshiradi. Buning uchun uch narsa kerak:

- **App ID (Bundle ID)** — `uz.company.app` ko‘rinishidagi noyob identifikator. Certificates, Identifiers & Profiles bo‘limida yaratiladi. Relizdan keyin uni o‘zgartirib bo‘lmaydi.
- **Apple Distribution sertifikati** — buildni jamoangiz imzolaganini tasdiqlaydi.
- **App Store turidagi provisioning profile** — App ID, sertifikat va yoqilgan imkoniyatlarni (push, Sign in with Apple, iCloud) bog‘laydi.

Eng oson yo‘l — Xcode’dagi **Automatically manage signing**: u sertifikat va profilni o‘zi yaratadi. Qo‘lda boshqarish CI va katta jamoalar uchun ma’qul. Ko‘p uchraydigan xato — sertifikatning maxfiy kalitini yo‘qotish, shuning uchun `.p12` eksportini jamoaning himoyalangan omborida saqlang.

## 2-qadam. App Store Connect’dagi kartochka

App Store Connect’da **Apps → «+» → New App** ni oching va platforma, nom, asosiy til, Bundle ID hamda SKU’ni (ichki kod, foydalanuvchilar uni ko‘rmaydi) kiriting.

Keyin to‘ldiring:

- **App Information**: kategoriya, yosh reytingi anketasi, maxfiylik siyosatiga havola.
- **App Privacy**: ilova va uchinchi tomon SDK’lari (analitika, reklama, crash-hisobotlar) qanday ma’lumot to‘playdi. Javoblar ilovaning haqiqiy xatti-harakatiga mos bo‘lishi shart.
- **Pricing and Availability**: narx yoki bepul, tarqatiladigan mamlakatlar.

## 3-qadam. Metama’lumotlar va skrinshotlar

Har bir lokalizatsiya uchun kerak:

| Maydon | Nima muhim |
|---|---|
| Nom va subtitle | Qisqa, vergul bilan kalit so‘zlar ro‘yxatisiz |
| Tavsif | Ilova nima qiladi va kim uchun |
| Kalit so‘zlar | Cheklangan maydon, ilova nomini takrorlamang |
| Skrinshotlar | iPhone’ning majburiy ekran o‘lchamlari uchun (iPad qo‘llab-quvvatlansa, u uchun ham) |
| Support URL | Kontaktlari bor ishlaydigan sahifa |

Skrinshotlar ilovaning haqiqiy interfeysini ko‘rsatishi kerak. Joriy o‘lchamlarni App Store Connect yordam bo‘limidan tekshiring — Apple ularni vaqti-vaqti bilan yangilaydi.

## 4-qadam. Buildni yuklash

1. Xcode’da Release konfiguratsiyali sxemani va **Any iOS Device** qurilmasini tanlang.
2. **Build raqamini** oshiring — u har bir yuklash uchun noyob bo‘lishi kerak.
3. **Product → Archive**, so‘ng Organizer’da **Distribute App → App Store Connect**.

Yuklangandan keyin build bir muddat qayta ishlanadi va TestFlight bo‘limida paydo bo‘ladi. Ko‘rikka yuborishdan oldin uni TestFlight orqali haqiqiy qurilmalarda sinab ko‘ring.

Avtomatlashtirish uchun fastlane qulay:

```ruby
lane :release do
  build_app(scheme: "MyApp")
  upload_to_app_store(skip_screenshots: true, skip_metadata: true)
end
```

## 5-qadam. Ko‘rik va bosqichli reliz

Versiya sahifasida yuklangan buildni tanlang va **App Review Information** ni to‘ldiring: kontaktlar, ko‘rib chiquvchi uchun izohlar va ilovada kirish bo‘lsa, **demo-akkaunt**. Ishlaydigan test logini bo‘lmasa, rad etilish deyarli aniq.

**Eksport nazorati** (shifrlashdan foydalanish) savoliga javob bering va chiqarish usulini tanlang:

- **Manually release** — tasdiqdan keyin tugmani o‘zingiz bosasiz.
- **Automatically release** — versiya tasdiqdan so‘ng darhol chiqadi.
- **Scheduled** — belgilangan sanadan oldin emas.

Yangilanishlar uchun **Phased Release** mavjud: Apple versiyani avtoyangilanish yoqilgan foydalanuvchilarga 7 kun davomida asta-sekin tarqatadi. Analitika yoki crash-hisobotlarda muammo ko‘rinsa, tarqatishni pauza qilish mumkin. Qo‘lda yangilaydigan foydalanuvchilar versiyani darhol oladi.

## Ko‘p uchraydigan xatolar

- Demo-akkaunt unutilgan yoki uning paroli eskirgan.
- Maxfiylik siyosati ochilmaydi yoki to‘planadigan ma’lumotlarni tilga olmaydi.
- Skrinshotlar haqiqiy ekranlar emas, maketlardan tayyorlangan.
- Build raqami oshirilmagan — yuklash rad etiladi.
- App Privacy javoblarida uchinchi tomon SDK’lari hisobga olinmagan.

## FAQ

### Apple ko‘rigi qancha davom etadi?

Odatda bir necha soatdan bir necha kungacha. Bu ko‘rik jamoasining bandligi va ilovaning murakkabligiga bog‘liq. Rad etilgandan keyin tuzatilgan build qaytadan tekshiruvdan o‘tadi.

### Mac’siz ilova joylash mumkinmi?

iOS buildini faqat macOS’da ishlaydigan Xcode yig‘adi va imzolaydi. O‘z Mac’ingiz bo‘lmasa, macOS mashinalari bor bulutli CI xizmatlaridan foydalanish mumkin, lekin nosozliklarni tuzatish uchun haqiqiy Mac baribir qulayroq.

### TestFlight reliz qilishdan nimasi bilan farq qiladi?

TestFlight — beta-test: buildni faqat taklif qilingan testerlar oladi. Tashqi test ham Apple’ning qisqa tekshiruvidan o‘tadi, ammo App Store’da ommaviy reliz bo‘lmaydi.
