---
title: iOS va Android’da ruxsatlarni qanday to‘g‘ri so‘rash kerak
description: Kamera, geolokatsiya, foto va bildirishnomalarga kirishni so‘rash: runtime ruxsatlar, oldindan ekranlar, purpose strings, rad etish va qisman kirish.
summary: Ruxsatni foydalanuvchi unga muhtoj amalni o‘zi boshlagan paytda so‘rang va nima uchunligini tushuntiring. Rad etilganda ilova ishlashda davom etishi, foto va geolokatsiyaga qisman kirish esa oddiy ssenariy sifatida qo‘llab-quvvatlanishi kerak.
---

## Asosiy qoida

iOS’da tizimning ruxsat oynasi **faqat bir marta** ko‘rsatiladi, Android’da esa takroriy rad etishlardan keyin tizim uni ko‘rsatmay qo‘yadi. Shuning uchun har bir so‘rov — osongina behuda ketadigan urinish.

Oddiy sxema ishlaydi:
- **kontekstda** so‘rash — foydalanuvchi «QR skanerlash»ni bosganda, birinchi ishga tushirishda emas;
- **faqat keraklisini** so‘rash — geolokatsiyani «kelajak uchun» so‘ramaslik;
- **foydasini** tushunarli tilda **tushuntirish**;
- rad etilganda **ilovani buzmaslik**.

## Runtime ruxsatlar qanday ishlaydi

**iOS.** Har bir himoyalangan resurs uchun `Info.plist`’da **purpose string** ko‘rsatiladi — tizim dialogda ko‘rsatadigan matn. Usiz resursga murojaat qilganda ilova ishdan chiqadi, Apple ko‘rigi esa noaniq ifodalarni rad etadi.

```xml
<key>NSCameraUsageDescription</key>
<string>Kamera chekdagi QR-kodni skanerlash uchun kerak.</string>
```

Yaxshi purpose string «ilovaga kirish kerak» emas, «men nima olaman» degan savolga javob beradi.

**Android.** Xavfli ruxsatlar manifestda e’lon qilinadi va ish vaqtida so‘raladi:

```kotlin
val requestCamera = registerForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) openScanner() else showScannerFallback()
}

requestCamera.launch(Manifest.permission.CAMERA)
```

`shouldShowRequestPermissionRationale` metodi foydalanuvchi allaqachon rad etganini va avval sababini tushuntirish kerakligini bildiradi. Android’ning yangi versiyalarida alohida ruxsatlar paydo bo‘lgan — masalan, bildirishnomalarni ko‘rsatish uchun — shuning uchun maqsadli API talablarini tekshiring.

## Oldindan ko‘rsatiladigan ekran (pre-permission)

Tizim dialogidan oldin o‘z ekraningizni ko‘rsatish mumkin: illyustratsiya, foyda haqida bitta gap va tizim so‘rovini chaqiradigan tugma.

- Tugmalar — «Davom etish» va «Hozir emas». Tizim dialogiga taqlid qilmang va hech narsaga ruxsat bermaydigan tugmaga «Ruxsat berish» deb yozmang.
- «Hozir emas» bloklamasdan qadamni haqiqatan o‘tkazib yuborishi kerak.
- Foydalanuvchi sizning ekraningizda rad etsa, tizim dialogi sarflanmaydi — keyinroq qulay paytda yana so‘rash mumkin.

## Rad etish va qisman kirish

**Rad etish.** Muqobil taklif qiling: geolokatsiya o‘rniga manzilni qo‘lda kiritish, kamera o‘rniga fayl tanlash. Agar funksiya ruxsatsiz imkonsiz bo‘lsa, buni tushuntiring va ilova sozlamalariga o‘tish tugmasini bering.

**Foto.** Foydalanuvchi faqat **tanlangan fotolarga** kirish berishi mumkin — iOS’da ham, Android’ning yangi versiyalarida ham. Bu oddiy ssenariy: mavjud fotolarni ko‘rsating va yana tanlash imkonini bering. Agar faqat avatar yuklash kerak bo‘lsa, **tizim foto-pikeri**dan foydalaning — u umuman ruxsat talab qilmaydi.

**Geolokatsiya.** **Aniq va taxminiy** lokatsiya, shuningdek «foydalanish vaqtida» va «doimo» kirish bor. Ob-havo yoki eng yaqin shahar uchun taxminiysi yetarli. Fon geolokatsiyasini alohida va faqat funksiya usiz haqiqatan ishlamasa so‘rang.

**Bildirishnomalar.** Birinchi ishga tushirishda so‘ramang. Foydasi aniq bo‘lgan amaldan keyin so‘rash yaxshiroq: «Buyurtma yo‘lga chiqqanda xabar beraylikmi?». iOS’da **provisional** bildirishnomalar bor — ular so‘rovsiz jimgina keladi va foydalanuvchi ularni qoldirish-qoldirmaslikni o‘zi hal qiladi.

## Do‘konlar nimani kutadi

- **App Store:** purpose strings ma’lumotlardan foydalanishni aniq tushuntirishi kerak. Rozilikka majburlash, zaruratsiz rad etish sababli ilovani bloklash yoki oldindan ekranlar bilan chalg‘itish mumkin emas.
- **Google Play:** sezgir ruxsatlar (fon geolokatsiyasi, barcha fayllarga kirish, SMS va qo‘ng‘iroqlar jurnali va boshqalar) uchun Play Console’da deklaratsiya to‘ldirish va funksiya asosiy ekanini isbotlash kerak. Aks holda yangilanish rad etiladi.
- Ruxsatlar ro‘yxati Privacy-belgilar va Data Safety’dagi javoblarga mos kelishi kerak.

## Ko‘p uchraydigan xatolar

- Birinchi ishga tushirishda ketma-ket so‘rovlar.
- SDK’lar yoki eski funksiyalardan qolgan ortiqcha ruxsatlar.
- «Ilovaga kameraga kirish kerak» kabi shablon purpose strings.
- Rad etilgandan keyin muqobil o‘rniga bo‘sh ekran.

## FAQ

### Rad etilgandan keyin tizim dialogini yana ko‘rsatish mumkinmi?
iOS’da — yo‘q, faqat foydalanuvchini sozlamalarga yuborish mumkin. Android’da ham takroriy rad etishlardan keyin tizim dialogni ko‘rsatmay qo‘yadi va sozlamalar orqali yo‘l qoladi.

### Bitta fotoni tanlash uchun ruxsat kerakmi?
Yo‘q. iOS va Android’dagi tizim foto-pikerlari ruxsat so‘ramasdan faqat tanlangan fayllarga kirish beradi.

### Bildirishnomalarga ruxsatni qachon so‘ragan ma’qul?
Foydasi aniq bo‘lgan amaldan keyin: buyurtma berish, tadbirga obuna bo‘lish. Birinchi ishga tushirishda kontekstsiz so‘rov ko‘proq rad etiladi.
