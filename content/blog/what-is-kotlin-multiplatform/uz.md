---
title: Kotlin Multiplatform nima va qachon o‘zini oqlaydi
description: Kotlin Multiplatform sodda tilda: native UI saqlangan holda iOS va Android uchun umumiy biznes-mantiq, Compose Multiplatform, Flutter va React Native’dan farqi.
summary: Kotlin Multiplatform (KMP) biznes-mantiq, tarmoq va ma’lumotlar bilan ishlashni Kotlin’da bir marta yozib, iOS va Android’da ishlatish imkonini beradi, interfeys esa native qoladi. Native UX muhim bo‘lsa va jamoada Android tajribasi bo‘lsa, u o‘zini oqlaydi.
---

## Kotlin Multiplatform nima

**Kotlin Multiplatform (KMP)** — JetBrains texnologiyasi bo‘lib, Kotlin’da umumiy kod yozib, uni bir nechta platformaga kompilyatsiya qilish imkonini beradi: Android, iOS, desktop, veb va server.

Asosiy g‘oya: **platformaga bog‘liq bo‘lmagan qismni umumlashtirish**, bog‘liq qismini esa native qoldirish. Odatda umumiy bo‘ladi:

- biznes-mantiq va qoidalar;
- API va tarmoq bilan ishlash;
- ma’lumot modellari, validatsiya, kesh va lokal baza;
- analitika va xatolarni qayta ishlash.

Interfeys native qolishi mumkin: Android’da **Jetpack Compose**, iOS’da **SwiftUI**. iOS uchun umumiy kod oddiy native freymvorkka kompilyatsiya qilinadi va Xcode’ga boshqa har qanday bog‘liqlik kabi ulanadi.

## Bu qanday ishlaydi

Loyiha **source set**’larga bo‘linadi: umumiy kod uchun `commonMain`, platformaga xos kod uchun `androidMain` va `iosMain`. Platformaga xos narsa kerak bo‘lsa, `expect`/`actual` mexanizmi ishlatiladi: umumiy kodda kutilma e’lon qilinadi, har bir platforma esa o‘z realizatsiyasini beradi.

```kotlin
// commonMain
expect fun platformName(): String

// androidMain
actual fun platformName(): String = "Android"

// iosMain
actual fun platformName(): String = "iOS"
```

KMP atrofida kutubxonalar ekotizimi shakllangan: tarmoq uchun **Ktor**, JSON uchun **kotlinx.serialization**, asinxronlik uchun **kotlinx.coroutines**, ma’lumotlar bazasi uchun **SQLDelight** va Room.

## Compose Multiplatform

**Compose Multiplatform** — keyingi qadam: nafaqat mantiq, balki UI ham umumiy bo‘ladi. Bu Jetpack Compose asosidagi JetBrains freymvorki bo‘lib, interfeysni Android, iOS, desktop va vebda chizadi.

Natijada ikki rejim bor:

- **Faqat mantiq umumiy**, UI native. Platformalarga maksimal moslik, lekin interfeys ikki marta yoziladi.
- **Mantiq ham, UI ham umumiy** — Compose Multiplatform orqali. Kod kamroq, lekin iOS’da interfeys qo‘shimcha ishsiz to‘liq «Apple uslubida» bo‘lmaydi.

Rejimlarni aralashtirish mumkin: ba’zi ekranlar Compose’da, ba’zilari SwiftUI’da.

## Texnologiya qanchalik yetuk

Kotlin Multiplatform barqaror deb e’lon qilingan, Google uni Android va iOS o‘rtasida umumiy mantiq uchun rasman qo‘llab-quvvatlaydi, iOS uchun Compose Multiplatform ham barqaror maqomga ega bo‘lgan. Ko‘plab yirik kompaniyalar KMP’ni prodakshnda ishlatadi.

Shunga qaramay, hisobga oling:

- kutubxonalar ekotizimi Flutter va React Native’nikidan kichikroq;
- iOS dasturchilari Kotlin kodi va Gradle yig‘ish tizimiga ko‘nikishi kerak;
- iOS uchun yig‘ish tezligi va umumiy kodni Xcode’dan debug qilish sozlashni talab qiladi.

## Flutter va React Native’dan farqi

| Mezon | Kotlin Multiplatform | Flutter | React Native |
|---|---|---|---|
| Til | Kotlin | Dart | JavaScript / TypeScript |
| Nima umumiy | Mantiq, xohlasangiz UI | Mantiq va UI | Mantiq va UI |
| UI | Native yoki Compose | O‘z chizish dvigateli | JS orqali native komponentlar |
| Joriy etish | Mavjud ilovaga bosqichma-bosqich | Odatda yangi ilova | Ekranlar bo‘yicha, lekin qiyinroq |
| Kirish chegarasi | Android jamoasi uchun past | Dart o‘rganish kerak | Veb jamoasi uchun past |

Asosiy farq: KMP **UI yondashuvini o‘zgartirishga majburlamaydi**. Uni bitta moduldan, masalan tarmoq qatlamidan boshlab, asta-sekin joriy qilish mumkin.

## KMP qachon o‘zini oqlaydi

- Sizda allaqachon **native ilovalar** bor va ulardagi mantiq bir-biridan farqlanib ketyapti.
- Jamoada kuchli **Android tajribasi** bor.
- **Native UX** va unumdorlik muhim, lekin biznes-mantiqni takrorlashni xohlamaysiz.
- Mantiq murakkab: moliya, oflayn sinxronizatsiya, hisob-kitoblar — ikki xil realizatsiyadagi xatolar qimmatga tushadigan joylar.

## Qachon boshqa variant yaxshiroq

- Kotlin tajribasi bo‘lmagan kichik jamoa bilan tez MVP kerak — Flutter yoki React Native natijani tezroq berishi mumkin.
- Jamoa veb va TypeScript’da kuchli — React Native yaqinroq.
- Ilova oddiy va umumiy mantiq deyarli yo‘q.

## FAQ

### KMP ishlatilganda iOS dasturchilari kerakmi?

Ha. UI native qolsa, u Swift’da yoziladi. Compose Multiplatform bilan ham iOS yig‘ish, nashr qilish va platforma xususiyatlarini tushunadigan odam kerak.

### Mavjud ilovaga KMP qo‘shsa bo‘ladimi?

Bo‘ladi. Odatda bitta umumiy moduldan, masalan tarmoq qatlami yoki ma’lumot modellaridan boshlanadi va qolgan mantiq asta-sekin unga ko‘chiriladi.

### KMP va Compose Multiplatform bir narsami?

Yo‘q. KMP — umumiy kod uchun asos, Compose Multiplatform esa uning ustidagi UI freymvork. KMP’ni Compose’siz, interfeysni native qoldirib ishlatish mumkin.
