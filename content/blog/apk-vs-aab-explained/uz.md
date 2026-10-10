---
title: APK va AAB: Android ilova formatlari o‘rtasidagi farq
description: APK va AAB ichida nima bor, nega Google Play faqat App Bundle qabul qiladi, split APK yuklashni qanday kamaytiradi va ilova imzosi qanday ishlaydi.
summary: APK — qurilmaga o‘rnatiladigan paket, AAB esa nashr formati: Google Play undan har bir qurilma uchun yengillashtirilgan APK yig‘adi va ularni ilova kaliti bilan imzolaydi.
---

## Qisqa javob

- **APK** (Android Package) — o‘rnatishga tayyor fayl. Uni telefonga nusxalab, o‘rnatish mumkin.
- **AAB** (Android App Bundle) — nashr formati. Uni qurilmaga o‘rnatib bo‘lmaydi: Google Play AAB’ni olib, undan aniq telefon uchun optimallashtirilgan **split APK** to‘plamini yaratadi.

Google Play’da yangi ilovalar faqat AAB formatida nashr qilinadi. APK do‘kondan tashqari o‘rnatish, ichki testlash va ayrim boshqa do‘konlar uchun kerak bo‘lib qoladi.

## APK ichida nima bor

APK — standart tuzilishga ega ZIP-arxiv:

- `AndroidManifest.xml` — binar ko‘rinishdagi manifest: paket, ruxsatlar, komponentlar;
- `classes.dex` — ilovaning kompilyatsiya qilingan kodi;
- `resources.arsc` va `res/` papkasi — resurslar: satrlar, maketlar, rasmlar;
- `assets/` — ilova o‘zgarishsiz o‘qiydigan ixtiyoriy fayllar;
- `lib/<abi>/` — protsessor arxitekturalari uchun nativ kutubxonalar;
- `META-INF/` va imzo bloki — dasturchi imzosi haqidagi ma’lumotlar.

Klassik **universal APK**’ning muammosi shundaki, unda hammasi birga: barcha arxitekturalar uchun kutubxonalar, barcha ekran zichliklari uchun rasmlar, barcha tillardagi satrlar. Foydalanuvchi qurilmasiga hech qachon kerak bo‘lmaydigan narsalarni yuklab oladi.

## AAB ichida nima bor

AAB ham ZIP-arxiv, lekin modullar bo‘yicha tuzilgan:

- `base/` — manifest, kod (`dex/`), resurslar, `lib/` va `assets/` bilan asosiy modul;
- ilova qismlarga bo‘lingan bo‘lsa, **feature-modullar** papkalari;
- `BundleConfig.pb` va yig‘ish metama’lumotlari.

AAB ichida yakuniy qurilmalar uchun imzo yo‘q — uni Google Play APK yaratishda qo‘shadi.

## Split APK yuklashni qanday kamaytiradi

Google Play AAB’dan asosiy APK va **konfiguratsion splitlar** yig‘adi:

| Split | Ichida nima bor | Misol |
|---|---|---|
| ABI | nativ kutubxonalar | faqat `arm64-v8a` |
| Ekran zichligi | rasmlar | faqat `xxhdpi` |
| Til | satrlar va resurslar | faqat `ru` va `uz` |

Qurilma asosiy APK’ni va faqat o‘ziga mos splitlarni oladi. Bundan tashqari **Play Feature Delivery** (talab bo‘yicha yuklanadigan modullar) va **Play Asset Delivery** (o‘yinlarning katta resurslari) ishlatilishi mumkin.

## Imzo qanday ishlaydi

Har bir APK imzolangan bo‘lishi kerak, aks holda Android uni o‘rnatmaydi. Yangilanish faqat imzosi o‘rnatilgan versiya imzosiga mos kelsa qabul qilinadi.

AAB bilan **Play App Signing** majburiy va kalitlar ikkita bo‘ladi:

- **upload key** — u bilan AAB’ni Play Console’ga yuklashdan oldin imzolaysiz;
- **app signing key** — uni Google saqlaydi va foydalanuvchilar oladigan APK’larni u bilan imzolaydi.

Afzalligi: upload key yo‘qolsa yoki oshkor bo‘lsa, uni Play Console orqali tiklash mumkin, ilova imzo kaliti esa xavfsiz qoladi.

Muhim jihat: agar ilovani Google Play’dan tashqarida ham tarqatsangiz, imzolar mos kelmasligi mumkin va foydalanuvchi boshqa manbadan o‘rnatilgan versiya ustidan yangilay olmaydi. Play App Signing’ni ulashda hamma joyda bitta kalitdan foydalanish uchun o‘z imzo kalitingizni yuklash mumkin.

## Ikkala formatni qanday yig‘ish

```bash
# Google Play uchun AAB
./gradlew bundleRelease

# To‘g‘ridan-to‘g‘ri o‘rnatish va testlar uchun APK
./gradlew assembleRelease

# AAB’ni lokal tekshirish: ulangan qurilma uchun APK yig‘ish va o‘rnatish
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app.apks --connected-device
java -jar bundletool.jar install-apks --apks=app.apks
```

Flutter’da shunga o‘xshash buyruqlar — `flutter build appbundle` va `flutter build apk`. Batafsil ma’lumot [Android App Bundle hujjatlarida](https://developer.android.com/guide/app-bundle).

## Ko‘p uchraydigan xatolar

- **Keystore faqat dasturchi noutbukida saqlanadi.** Zaxira nusxa kerak, parollar esa kompaniya parol menejerida bo‘lishi lozim.
- **AAB testerlarga to‘g‘ridan-to‘g‘ri yuboriladi.** U o‘rnatilmaydi — Play Console’dagi ichki testlash yoki universal APK’dan foydalaning.
- **AAB hajmi yuklash hajmi deb qabul qilinadi.** Foydalanuvchilar uchun real hajmni Play Console’dagi ilova hajmi hisobotida ko‘ring.
- **Kalitlar va parollar repozitoriyga tushadi.** Ularni `build.gradle`’da emas, CI sirlarida saqlang.

## FAQ

### Hozir Google Play’ga oddiy APK yuklasa bo‘ladimi?

Yangi ilovalar uchun — yo‘q, AAB kerak. APK hamon do‘kondan tashqari o‘rnatish, korporativ ssenariylar va ayrim muqobil do‘konlarda ishlatiladi.

### Kalit yo‘qolsa nima bo‘ladi?

Upload key yo‘qolsa, u Play Console orqali tiklanadi — ilova imzo kaliti Google’da saqlanadi. Agar ilova faqat sizning kalitingiz bilan imzolansa va u yo‘qolsa, xuddi shu imzo bilan yangilanish chiqarib bo‘lmaydi.

### AAB ilovani tezroq qiladimi?

Yo‘q, format ishlash tezligiga ta’sir qilmaydi. U yuklash hajmini va egallanadigan joyni kamaytiradi, bu sekin internet va arzon qurilmalarda o‘rnatishga bilvosita yordam beradi.
