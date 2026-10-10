---
title: Mobil ilovalar uchun CI/CD: Fastlane va Codemagic bilan avtoyig‘ish
description: Fastlane va Codemagic yordamida imzolash, yig‘ish, testlar va TestFlight hamda Google Play’ga yuklashni avtomatlashtirish, versiyalash va maxfiy ma’lumotlar.
summary: Fastlane reliz bosqichlarini kod sifatida tavsiflaydi (imzolash, yig‘ish, testlar, do‘konlarga yuklash), Codemagic esa bulutdagi macOS mashinalari va tayyor nashr qilishni beradi. Ko‘pincha ular birga ishlatiladi, maxfiy kalitlar esa faqat shifrlangan CI o‘zgaruvchilarida saqlanadi.
---

## Nimani va nima bilan avtomatlashtirish kerak

Mobil ilovani qo‘lda reliz qilish — o‘nga yaqin qadam: yig‘ish raqamini oshirish, imzolash, yig‘ish, testlarni ishga tushirish, TestFlight va Google Play’ga yuklash. Har bir qadam — xato qilish ehtimoli. Pipeline buni har bir commit yoki tegda bir xil bajaradi.

- **Fastlane** — ochiq kodli vosita, unda reliz `Fastfile` ichidagi «yo‘laklar» (lanes) sifatida yoziladi. Lokal kompyuterda ham, istalgan CI’da ham ishlaydi.
- **Codemagic** — macOS va Linux mashinalari, `codemagic.yaml` konfiguratsiyasi, tayyor imzolash va do‘konlarga nashr qilish imkoniyatiga ega bulutli CI/CD. Flutter, React Native va nativ loyihalarni yaxshi qo‘llab-quvvatlaydi.

Ular raqobatchi emas: reliz mantig‘i Fastlane’da yozilgan bo‘lsa, uni Codemagic ichida ishga tushirish mumkin.

## Odatiy pipeline

1. Kod va bog‘liqliklarni olish.
2. Linter va testlarni ishga tushirish — xato bo‘lsa reliz to‘xtaydi.
3. Sertifikat va profillarni (iOS) yoki keystore’ni (Android) o‘rnatish.
4. Yig‘ish raqamini belgilash.
5. `.ipa` va `.aab` fayllarini yig‘ish.
6. TestFlight’ga va Google Play’ning ichki trekiga yuklash.
7. Jamoani xabardor qilish.

## Fastlane: Fastfile namunasi

```ruby
default_platform(:ios)

platform :ios do
  lane :beta do
    api_key = app_store_connect_api_key(
      key_id: ENV["ASC_KEY_ID"],
      issuer_id: ENV["ASC_ISSUER_ID"],
      key_content: ENV["ASC_KEY_CONTENT"]
    )
    setup_ci
    match(type: "appstore", readonly: true, api_key: api_key)
    increment_build_number(
      build_number: latest_testflight_build_number(api_key: api_key) + 1
    )
    build_app(scheme: "App", export_method: "app-store")
    upload_to_testflight(api_key: api_key, skip_waiting_for_build_processing: true)
  end
end

platform :android do
  lane :internal do
    gradle(task: "clean bundleRelease")
    upload_to_play_store(track: "internal")
  end
end
```

Asosiy jihatlar:

- **`match`** sertifikat va profillarni shifrlangan maxfiy repozitoriy yoki bulut omborida saqlaydi. Butun jamoa va CI bir xil fayllardan foydalanadi — «menda imzolanadi, senda yo‘q» muammosi yo‘qoladi.
- **`setup_ci`** CI mashinasida vaqtinchalik keychain yaratadi.
- Apple ID login o‘rniga **App Store Connect API kaliti** — pipeline’da ikki bosqichli tasdiqlash so‘ralmaydi.
- Android’da `upload_to_play_store` Google Play xizmat akkauntining JSON kaliti orqali ishlaydi.

## Codemagic: Flutter uchun misol

```yaml
workflows:
  ios-testflight:
    integrations:
      app_store_connect: CI key
    environment:
      flutter: stable
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.example.app
    scripts:
      - name: Dependencies
        script: flutter pub get
      - name: Tests
        script: flutter test
      - name: Signing
        script: xcode-project use-profiles
      - name: Build
        script: |
          flutter build ipa --release \
            --build-number=$BUILD_NUMBER \
            --export-options-plist=/Users/builder/export_options.plist
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

Codemagic imzolash fayllarini App Store Connect integratsiyasi orqali o‘zi oladi. Android uchun `publishing` blokiga xizmat akkaunti kaliti va trek ko‘rsatilgan `google_play` qo‘shiladi.

## Versiyalash

- **Versiya** (`1.4.0`) — foydalanuvchilar uchun. Uni ongli ravishda, qo‘lda yoki teg bo‘yicha o‘zgartiring.
- **Yig‘ish raqami** (`CFBundleVersion`, `versionCode`) — doim o‘sib borishi shart bo‘lgan texnik raqam. Uni mashinaga topshirgan ma’qul.

Yig‘ish raqamining ishonchli manbalari:

- TestFlight yoki Google Play’dagi oxirgi raqam plyus bir;
- CI yig‘ishlar hisoblagichi (masalan, Codemagic’dagi `$BUILD_NUMBER`);
- commit’lar soni — faqat tarix hech qachon qayta yozilmasa.

Yig‘ish raqamini repozitoriyda qo‘lda tahrirlanadigan qiymat sifatida saqlamang: bu konfliktlar va rad etilgan yuklashlar manbai.

## Pipeline’dagi maxfiy ma’lumotlar

Mobil pipeline ayniqsa qimmatli fayllar bilan ishlaydi: Android keystore, App Store Connect’ning `.p8` kaliti, `match` paroli va Google xizmat akkauntining JSON fayli.

- Ularni repozitoriyga **hech qachon commit qilmang**, hatto maxfiy repozitoriyga ham.
- CI’ning **shifrlangan o‘zgaruvchilarida** saqlang. Binar fayllarni base64 ko‘rinishida saqlab, yig‘ish vaqtida dekodlang.
- **Minimal huquqlar** bering: Google Play xizmat akkauntiga faqat kerakli ilovalar, API kalitiga faqat kerakli rol.
- Reliz workflow’larini kim ishga tushira olishini cheklang va ularni fork’lardan kelgan pull request’larda ishga tushirmang.
- **Keystore zaxira nusxasini** alohida saqlang: o‘zingiz imzolasangiz va uni yo‘qotsangiz, ilovani yangilash juda qiyinlashadi. Play App Signing bu xavfni kamaytiradi.

## Ko‘p uchraydigan xatolar

- Har bir commit va reliz uchun bitta pipeline — tekshirish va nashr qilishni ajrating.
- Testlar do‘konga yuklangandan keyin ishga tushadi, oldin emas.
- Sertifikatlar turli mashinalarda qo‘lda yaratilgan va bir-biriga zid.
- Bog‘liqliklar keshi yo‘q — yig‘ish kerakligidan ancha uzoq davom etadi.

## FAQ

### Fastlane yoki Codemagic — qaysi birini tanlash kerak?

O‘z mashinalaringizni sozlamasdan macOS’li tayyor bulutli CI kerak bo‘lsa — Codemagic. Reliz mantig‘i murakkab yoki boshqa CI (GitHub Actions, GitLab CI) allaqachon ishlatilsa — Fastlane. Ko‘pincha ikkalasi birga qo‘llanadi.

### iOS ilovani Mac’siz yig‘ish mumkinmi?

iOS uchun yig‘ish macOS va Xcode talab qiladi, lekin bu albatta sizning kompyuteringiz bo‘lishi shart emas: bulutli CI xizmatlari macOS mashinalarini taqdim etadi.

### TestFlight’ga yig‘ilmalarni qanchalik tez-tez yuborish kerak?

Qulay ritm: asosiy branch’dan har bir merge’dan keyin yoki jadval bo‘yicha yig‘ilma yuborish, production’ga esa teg bo‘yicha chiqarish. Shunda testerlar doim dolzarb versiyani ko‘radi.
