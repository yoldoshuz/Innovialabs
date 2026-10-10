---
title: Muqobil do‘konlar: Huawei AppGallery, RuStore va boshqalar
description: Android ilova qachon Google Play’dan tashqariga chiqishi kerak, AppGallery va RuStore nimani talab qiladi va Google servislarini nima bilan almashtirish mumkin.
summary: Google Play’dan tashqarida nashr qilish auditoriyaning sezilarli qismi Google servislarisiz Huawei qurilmalarida yoki Rossiyada bo‘lsa o‘zini oqlaydi; buning uchun push, to‘lov, xarita va kirish har bir platforma analoglariga almashtirilgan alohida yig‘malar kerak.
---

## Qachon bu mantiqli

O‘zbekistondagi auditoriya uchun **odatda Google Play asosiy do‘kon bo‘lib qoladi**. Muqobillar «qamrov uchun» emas, aniq vaziyatlarda kerak:

- **Google servislarisiz Huawei smartfonlari.** So‘nggi yillardagi ko‘plab Huawei modellari Google Mobile Services (GMS) va Google Play’siz sotiladi. Agar analitika bunday qurilmalarning sezilarli ulushini ko‘rsatsa, AppGallery’siz ularni yo‘qotasiz.
- **Rossiyadagi auditoriya.** Google Play rossiyalik foydalanuvchilar uchun to‘lovlarni cheklagan, **RuStore** esa u yerda sotiladigan ko‘plab smartfonlarga oldindan o‘rnatiladi. Bu bozorda monetizatsiya uchun RuStore deyarli majburiy.
- **Qo‘shimcha targ‘ibot.** Samsung Galaxy Store va Xiaomi GetApps o‘z brendlari qurilmalarida oldindan o‘rnatilgan. Ularning foydalanuvchilarida odatda Google Play ham bor, shuning uchun bu zaruratdan ko‘ra targ‘ibot kanali.

Agar alohida yig‘malarni qo‘llab-quvvatlaydigan va yangilanishlarni bir vaqtda chiqaradigan odam bo‘lmasa, bir nechta do‘konga chiqmang: do‘kondagi eskirgan versiya umuman yo‘qligidan yomonroq.

## Do‘konlar nimani talab qiladi

Asosiy to‘plam hamma joyda o‘xshash:

- jismoniy yoki yuridik shaxs tekshiruvidan o‘tgan **dasturchi akkaunti**;
- imzolangan **reliz yig‘masi** (APK yoki AAB — qo‘llab-quvvatlanadigan formatlarni do‘kon konsolida aniqlang);
- **ilova sahifasi**: ikonka, skrinshotlar, kerakli tillardagi tavsiflar;
- **maxfiylik siyosati** va yosh reytingi;
- ko‘pincha rasmiy tafsilotlarga Google’dan qattiqroq qaraydigan **moderatsiya**.

Asosiy do‘konlarning xususiyatlari:

| Do‘kon | Qayerda kerak | To‘lov | Push |
|---|---|---|---|
| Huawei AppGallery | GMS’siz Huawei qurilmalari | HMS In-App Purchases | HMS Push Kit |
| RuStore | Rossiyadagi auditoriya | RuStore to‘lov SDK’si | RuStore Push SDK |
| Galaxy Store | Samsung qurilmalari | Samsung IAP | FCM ishlaydi, GMS bor |
| Xiaomi GetApps | Xiaomi qurilmalari | do‘kon qoidalariga ko‘ra | FCM ishlaydi, GMS bor |

AppGallery ilovalarni GMS’siz qurilmalarda tekshiradi: agar Google servislarisiz ilova yopilib qolsa yoki kirishga imkon bermasa, u rad etiladi. RuStore’ning dasturchi rezidentligi va monetizatsiyaga oid talablari o‘zgarib turgan — ro‘yxatdan o‘tishdan oldin amaldagi shartlarni tekshiring.

## Google servislarisiz nima buziladi

GMS bo‘lmagan qurilmada Google Play services’ga tayanadigan hamma narsa ishlamay qoladi:

| Funksiya | Google | Huawei | Boshqa variantlar |
|---|---|---|---|
| Push-bildirishnomalar | Firebase Cloud Messaging | Push Kit | RuStore Push SDK |
| Ichki xaridlar | Google Play Billing | In-App Purchases | RuStore to‘lov SDK’si |
| Xaritalar | Google Maps SDK | Map Kit | Yandex MapKit, 2GIS, OpenStreetMap asosidagi xaritalar |
| Geolokatsiya | Fused Location Provider | Location Kit | tizimning LocationManager’i |
| Kirish | Google Sign-In | Account Kit | VK ID, telefon, email |
| Yaxlitlikni tekshirish | Play Integrity API | Safety Detect | serverdagi tekshiruvlar |

Firebase SDK’larining bir qismi Play services’siz ham ishlaydi, lekin bunga tayanib bo‘lmaydi: har bir bog‘liqlikni GMS’siz real qurilmada tekshiring.

## Bir nechta do‘konni qanday qo‘llab-quvvatlash

1. **Servislarni interfeyslar ortiga yashiring.** Ilova kodi aniq SDK’lar bilan emas, `PushService`, `BillingService`, `MapProvider` bilan ishlaydi.
2. **Variantlarni product flavors orqali yig‘ing.** Bitta kod — o‘z bog‘liqliklariga ega bir nechta yig‘ma.
3. **Serverni bir nechta provayder bilan ishlashga o‘rgating:** har bir do‘kon uchun turli push-tokenlar va xaridlarni tekshirish.
4. **Relizlarni CI’da avtomatlashtiring,** shunda barcha do‘konlar yangilanishni bir vaqtda oladi.

```kotlin
// app modulining build.gradle.kts fayli
android {
    flavorDimensions += "store"
    productFlavors {
        create("google") { dimension = "store" }
        create("huawei") { dimension = "store" }
        create("rustore") { dimension = "store" }
    }
}
```

Realizatsiyalar `src/google/`, `src/huawei/` va `src/rustore/` papkalariga joylanadi, bog‘liqliklar esa har bir variant uchun `googleImplementation`, `huaweiImplementation` va hokazo orqali alohida ulanadi. Flutter va React Native’da xuddi shu yondashuv flavors va har bir platforma uchun plaginlarga quriladi.

## Ko‘p uchraydigan xatolar

- **Google uchun yig‘ma AppGallery’ga o‘zgarishsiz yuklanadi.** GMS’siz Huawei’da push-bildirishnomalar kelmaydi, xaritalar ochilmaydi, kirish ishlamaydi.
- **Turli do‘konlarda turli imzo kalitlari.** Ilovani bir do‘kondan o‘rnatgan foydalanuvchi uni boshqasidan yangilay olmaydi.
- **Yangilanishlar hamma joyda chiqmaydi.** Versiyalar farqlanib ketadi, qo‘llab-quvvatlash xizmati allaqachon tuzatilgan xatolar haqida shikoyat oladi.
- **Barcha do‘konlar uchun bir xil to‘lov qoidasi.** Har bir do‘konning raqamli tovarlar bo‘yicha o‘z siyosati bor — har birini alohida tekshiring.

## FAQ

### AppGallery’ga Google Play’dagi APK’ning o‘zini yuklasa bo‘ladimi?

Texnik jihatdan ha, lekin GMS bo‘lmagan qurilmalarda Google servislariga bog‘liq funksiyalar ishlamaydi. Agar ilova ularga bog‘liq bo‘lmasa, alohida yig‘ma kerak bo‘lmasligi mumkin.

### RuStore uchun alohida yig‘ma kerakmi?

Ilovada pullik raqamli funksiyalar bo‘lmasa, ko‘pincha o‘sha yig‘ma mos keladi. Monetizatsiya uchun RuStore to‘lov SDK’si, demak, alohida yig‘ma varianti kerak bo‘ladi.

### Nechta do‘kondan boshlash kerak?

Google Play va auditoriyangizning sezilarli segmentini qamrab oladigan do‘kondan. Qolganlarini analitika real talabni ko‘rsatganda qo‘shing.
