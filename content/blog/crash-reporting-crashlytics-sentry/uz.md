---
title: Ilova qulashlarini kuzatish: Crashlytics yoki Sentry
description: Crash-free rate nima, dSYM va mapping fayllari nega kerak, Crashlytics va Sentry qanday ulanadi va qulashlar ta’siriga ko‘ra qanday saralanadi.
summary: Agar siz Firebase’dan foydalansangiz, Crashlytics — qulashlarni ko‘rishning bepul va tez yo‘li; Sentry xatolar, unumdorlik va o‘z serverida joylash bo‘yicha kuchliroq, lekin murakkabroq va katta hajmda pullik. Har ikkisida ham dSYM va mapping fayllari yuklanmasa, hisobotlarni o‘qib bo‘lmaydi.
---

## Qisqa javob: qaysi birini tanlash

**Firebase Crashlytics** — mobil ilova uchun oqilona standart tanlov: bepul, tez ulanadi, Firebase Analytics va Remote Config bilan yaxshi ishlaydi. **Sentry** ko‘proq narsa kerak bo‘lganda tanlanadi: ilova va backend uchun yagona xatolar tizimi, unumdorlikni kuzatish, moslashuvchan alert qoidalari yoki o‘z serveringizda joylash.

| Mezon | Crashlytics | Sentry |
|---|---|---|
| Narx | Bepul | Bepul tarif bor, keyin hodisalar hajmi bo‘yicha to‘lov; o‘zingizda joylash mumkin |
| Asosiy yo‘nalish | Mobil ilovadagi qulashlar va nofatal xatolar | Barcha platformalarda xatolar, unumdorlik, relizlar |
| Platformalar | iOS, Android, Flutter, Unity, React Native (uchinchi tomon moduli orqali) | iOS, Android, Flutter, React Native, veb, backend |
| Alertlar | Oddiy, jumladan qulashlarning keskin o‘sishi | Moslashuvchan qoidalar, Slack va webhook integratsiyalari |
| Ma’lumot joylashuvi | Faqat Google buluti | Bulut yoki self-hosted |

## Crash-free rate: barqarorlikning asosiy ko‘rsatkichi

**Crash-free users** — davr mobaynida birorta ham qulash bo‘lmagan foydalanuvchilar ulushi. **Crash-free sessions** — qulashsiz o‘tgan sessiyalar ulushi. Birinchisi qancha odam zarar ko‘rganini, ikkinchisi oddiy foydalanishda ilova qanchalik tez-tez qulashini ko‘rsatadi.

Ikkalasini ham kuzating va versiyalar bo‘yicha solishtiring. Yangi versiya avvalgisidan sezilarli yomon bo‘lsa, tuzatish chiqquncha App Store Connect yoki Google Play Console’dagi bosqichma-bosqich relizni to‘xtating.

## Simvolizatsiya: stack trace nega o‘qilmaydi

Reliz yig‘masida kod optimallashtirilgan va obfuskatsiya qilingan, shuning uchun hisobotda funksiya nomlari o‘rniga xotira manzillari yoki `a.b.c` kabi nomlar chiqadi. Ularni tushunarli stack trace’ga qaytarish uchun **simvol fayllari** kerak:

- **iOS — dSYM**. Release konfiguratsiyasida `DWARF with dSYM File` tanlangan bo‘lsa, yig‘ishda yaratiladi. Har bir yig‘ma uchun yuklash kerak.
- **Android — mapping.txt**. Minifikatsiya paytida R8/ProGuard yaratadi. Usiz klass nomlari obfuskatsiyalangan holda qoladi.
- **Native kod (NDK, C++)** — alohida simvol fayllari.
- **Flutter** — `--obfuscate --split-debug-info` bilan yig‘ilganda debug-info ham yuklanadi.
- **React Native** — JavaScript bandli uchun source map’lar.

Eng ko‘p uchraydigan xato: simvollar bitta yig‘ma uchun yuklanadi, keyingisida unutiladi. Yuklashni qo‘lda emas, CI’da avtomatlashtiring.

## Crashlytics’ni ulash

1. Firebase’da loyiha yarating va iOS hamda Android ilovalarini qo‘shing.
2. `GoogleService-Info.plist` va `google-services.json` fayllarini loyihaga joylang.
3. Crashlytics SDK’ni qo‘shing.
4. Android’da Gradle plaginini ulang — u mapping faylni o‘zi yuklaydi:

```kotlin
plugins {
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
}
```

5. iOS’da Build Phases’ga Firebase hujjatlaridagi dSYM yuklash skriptini qo‘shing.
6. Sinov qulashini chaqiring va u konsolda o‘qiladigan stack trace bilan paydo bo‘lganini tekshiring.

**Nofatal xatolarni** ham yozib boring, masalan API javobini parse qilishdagi xatolar. Ekran nomi, foydalanuvchi roli yoki konfiguratsiya versiyasi kabi kalitlarni qo‘shing, lekin shaxsiy ma’lumotlarni yozmang.

## Sentry’ni ulash

1. Sentry’da loyiha yarating va DSN’ni oling.
2. SDK’ni o‘rnating va uni ilova ishga tushishida imkon qadar erta ishga tushiring. Flutter uchun misol:

```dart
await SentryFlutter.init(
  (options) {
    options.dsn = "https://<key>@<host>/<project>";
    options.tracesSampleRate = 0.2;
  },
  appRunner: () => runApp(const MyApp()),
);
```

3. dSYM, mapping fayllari va source map’larni yuklash uchun CI’da `sentry-cli`’ni sozlang.
4. Prodakshnni sinov yig‘malaridan ajratish va versiyalarni solishtirish uchun **release** va **environment**’ni uzating.

## Alertlar va ustuvorlik

Hamma qulashlar bir xil muhim emas. Ularni ta’siri bo‘yicha saralang:

- Hodisalar soni emas, **qancha foydalanuvchiga ta’sir qilgani**. Bitta qurilma yuzlab takrorlarni berishi mumkin.
- **Qayerda sodir bo‘lmoqda**: to‘lov, ro‘yxatdan o‘tish yoki ilova ishga tushishi — juda muhim, kam ochiladigan sozlamalar ekrani kutishi mumkin.
- **Yangi yoki regressiya**: oxirgi versiyada paydo bo‘lgan muammo eski va barqarordan muhimroq.
- **Trend**: relizdan keyingi keskin o‘sish o‘sha kuniyoq javob talab qiladi.

Kamida uchta alertni sozlang: yangi versiyadagi yangi muammo, qulashlarning keskin o‘sishi va crash-free ko‘rsatkichining siz belgilagan chegaradan pasayishi. Ularni hech kim o‘qimaydigan pochtaga emas, jamoa kanaliga yuboring.

## FAQ

### Crashlytics va Sentry’ni bir vaqtda ishlatsa bo‘ladimi?

Texnik jihatdan ha, lekin ikkita qulash ishlovchisi bir-biriga xalaqit berishi mumkin, jamoa esa ikki xil panelni kuzatishga majbur bo‘ladi. Odatda qulashlar uchun bitta vosita tanlanadi.

### Foydalanuvchilar shikoyat qilyapti, Crashlytics’da esa qulashlar yo‘q. Nega?

Ko‘p uchraydigan sabablar: hisobot ilova keyingi ochilganda yuboriladi, debug yig‘mada yig‘ish o‘chirilgan yoki tizim ilovani xotira yetishmasligi sababli yopgan — bu har doim ham qulash sifatida qayd etilmaydi.

### Qulash hisobotlarini yig‘ish uchun foydalanuvchi roziligi kerakmi?

Bu qanday ma’lumot yig‘ishingiz va qaysi qonunchilik qo‘llanilishiga bog‘liq. Hisobotlarga shaxsiy ma’lumotlarni yubormang va diagnostika yig‘ilishini maxfiylik siyosatida hamda do‘konlarning maxfiylik bo‘limlarida ko‘rsating.
