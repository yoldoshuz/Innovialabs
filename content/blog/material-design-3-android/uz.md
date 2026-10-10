---
title: Android ilovalar uchun Material Design 3: asosiy tamoyillar
description: Material Design 3 asoslari: dinamik rang, komponentlar, navigatsiya, tonal balandlik, moslashuvchan maketlar va qachon o‘z uslub kerakligi.
summary: Material Design 3 — Android uchun Google dizayn tizimi: ranglar rollar orqali beriladi va foydalanuvchi fon rasmiga moslasha oladi, navigatsiya ekran kengligiga bog‘liq, chuqurlik sirt tusi bilan beriladi, brend uslubi esa tizim xatti-harakatini buzmasdan uning ustiga qo‘yiladi.
---

## Qisqacha: Material 3 nima

**Material Design 3** (Material You deb ham ataladi) — Google dizayn tizimining joriy versiyasi. U Android va boshqa platformalarda ranglar, tipografika, komponentlar, oraliqlar, harakat va interfeys xatti-harakatini tasvirlaydi.

Jamoa uchun bu uchta amaliy narsa:

- Jetpack Compose va Material Components kutubxonasida holatlari va qulayligi o‘ylab qo‘yilgan **tayyor komponentlar**;
- tasodifiy HEX kodlar to‘plami o‘rniga **rang rollari tizimi**;
- telefonlar, planshetlar va buklanadigan qurilmalar uchun **moslashish qoidalari**.

## Dinamik rang

Android 12’dan boshlab tizim foydalanuvchining fon rasmidan palitra qura oladi, ilova esa uni qabul qilishi mumkin. Shuning uchun Material 3’da ranglar qiymatlar bilan emas, **rollar** bilan beriladi:

- **primary / onPrimary** — asosiy urg‘ular va ulardagi matn;
- **secondary, tertiary** — qo‘shimcha urg‘ular;
- **surface va surface container darajalari** — ekranlar, kartochkalar, panellar foni;
- **error** — xatolar;
- **container** variantlari — tugmalar va chiplar uchun yumshoqroq fonlar.

Dizayn rollarga tayansa, ilova dinamik rang bilan ham, brend palitrasi bilan ham, tungi rejimda ham to‘g‘ri ishlaydi. Brend sxemasini Material Theme Builder’da bitta asosiy rangdan yaratish qulay.

Compose’da sxemani tanlash quyidagicha:

```kotlin
val context = LocalContext.current
val colorScheme = when {
    Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
    darkTheme -> BrandDarkColors
    else -> BrandLightColors
}
MaterialTheme(colorScheme = colorScheme, content = content)
```

Agar brend taniqli ranglarni talab qilsa, dinamik rangdan umuman foydalanmaslik ham — odatiy amaliyot.

## Komponentlar

Asosiy to‘plam: bir necha urg‘u darajasidagi tugmalar (filled, tonal, outlined, text), ekranning asosiy harakati uchun **FAB**, **top app bar**, kartochkalar, chiplar, dialoglar, **bottom sheet**, snackbar, matn maydonlari.

Komponentlarni noldan chizmang, kutubxonadan oling: ularda bosish va fokus holatlari, ekran o‘quvchilarini qo‘llab-quvvatlash va to‘g‘ri o‘lchamlar allaqachon bor. Material’da minimal bosish zonasi — **48×48 dp**.

## Navigatsiya

Navigatsiya turi ekran kengligi va bo‘limlar soniga bog‘liq:

| Komponent | Qachon ishlatiladi |
|---|---|
| Navigation bar (pastda) | Telefon, 3 tadan 5 tagacha asosiy bo‘lim |
| Navigation rail (yon tomonda) | Planshet, ochilgan holatdagi buklanadigan telefon |
| Navigation drawer | Ko‘p bo‘limlar yoki keng ekranlar |
| Top app bar | Ekran sarlavhasi va uning harakatlari |

Alohida — **tizimning «Orqaga» tugmasi va imo-ishorasi**. Android’da ular doim bor, ilova esa ularga to‘g‘ri javob berishi kerak. Yangi versiyalarda **predictive back** paydo bo‘ldi — imo-ishora qayerga olib borishini oldindan ko‘rsatadigan animatsiya; uni qo‘llab-quvvatlash kerak.

## Balandlik va chuqurlik

Material 3’da chuqurlik birinchi navbatda **tonal balandlik** bilan beriladi: sirt qanchalik baland bo‘lsa, uning tusi fondan shunchalik ko‘proq farq qiladi. Soyalar tejab ishlatiladi — haqiqatan kontent ustida «suzib» turadigan elementlar uchun, masalan FAB yoki dialoglar. Bir nechta standart balandlik darajasi ko‘zda tutilgan, o‘zingiz yangisini o‘ylab topmasdan, ulardan foydalaning.

## Moslashuvchan maketlar

Material **window size classes** — oyna kengligi sinflariga tayanadi:

- **compact** — 600 dp gacha, oddiy telefon;
- **medium** — 600 dan 840 dp gacha, kichik planshet yoki ochilgan buklanadigan telefon;
- **expanded** — 840 dp dan, planshet va desktop rejimi.

Katta ekranlar uchun tipik sxemalar bor: **list-detail** (ro‘yxat va tafsilotlar yonma-yon), **feed** (bir necha ustunli kartochkalar lentasi), **supporting pane** (asosiy kontent va yordamchi panel). Interfeysni **edge-to-edge** — tizim panellari ostida, to‘g‘ri oraliqlar bilan chizish ham kerak.

## Qat’iy Material yoki o‘z uslub

| Material’ga qat’iy amal qiling | Brend uslubini qo‘shing |
|---|---|
| Ichki va B2B ilovalar | Kuchli brendga ega iste’mol mahsulotlari |
| MVP’ni tez chiqarish kerak | O‘z dizayn tizimingiz uchun resurs bor |
| «Shunchaki ishlashi» kerak bo‘lgan utilitalar | Vizual uslub mahsulot qiymatining bir qismi |

Ko‘p hollarda ishlaydigan murosa: **xatti-harakat — Material bo‘yicha, ko‘rinish — brendniki**. Navigatsiya, imo-ishoralar, bosish zonalari va holatlar tizimniki bo‘lib qoladi, ranglar, shriftlar, burchaklar shakli va illyustratsiyalar esa — sizniki.

## Ko‘p uchraydigan xatolar

- iOS interfeysini ko‘chirish: «Orqaga» tugmasidagi yozuvlar, tizim imo-ishorasini e’tiborsiz qoldirish.
- Komponentlarga HEX ranglarni qat’iy yozib qo‘yish — tungi rejim buziladi.
- Mayda bosish zonalarini qilish.
- Ilovani planshet va buklanadigan telefonda tekshirmaslik.

## FAQ

### Dinamik rangdan foydalanish shartmi?

Yo‘q. Bu ixtiyoriy: ko‘p mahsulotlar faqat brend palitrasidan foydalanadi. Asosiysi — dizaynni rang rollariga qurish, shunda sxemalar o‘rtasida almashish qayta ishlashni talab qilmaydi.

### Material 3 Flutter’dagi ilovaga mos keladimi?

Ha. Flutter Material 3 vidjetlarini o‘z ichiga oladi, shuning uchun bu maqoladagi tamoyillar kross-platforma ilovalarga ham tegishli. iOS versiyasi uchun esa navigatsiya va imo-ishoralarni moslashtirish kerak.

### Brendimiz kuchli bo‘lsa, Material’dan butunlay voz kechsa bo‘ladimi?

Bo‘ladi, lekin Material allaqachon hal qilgan vazifalarni o‘zingiz hal qilishingizga to‘g‘ri keladi: qulaylik, holatlar, moslashuvchanlik. Odatda Material’ni asos qilib olib, mavzuni brendga moslashtirish foydaliroq.
