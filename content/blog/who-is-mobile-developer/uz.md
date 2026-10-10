---
title: Mobil dasturchi kim va kasbga qanday kirish mumkin
description: Mobil dasturchi nima qiladi, ishga olishda native va kross-platforma dasturlash farqi, juniorga nima kerak va talab qanday shakllanadi.
summary: Mobil dasturchi iOS va Android uchun ilovalar yaratadi: interfeys, logika, tarmoq va ma’lumotlar bilan ishlash, do‘konlarga joylash. Boshlash uchun bitta platforma yoki bitta kross-platforma freymvorkni tanlang, asoslarini o‘zlashtiring va portfolio uchun 2–3 ta tugallangan ilova yarating.
---

## Qisqacha: mobil dasturchi kim

**Mobil dasturchi** smartfon va planshetlar uchun ilovalar yaratadi. U foydalanuvchi ko‘radigan va bosadigan narsalar hamda qurilmada «parda ortida» bo‘ladigan jarayonlar uchun javob beradi: ekranlar va navigatsiya, API orqali server bilan ishlash, ma’lumotlarni lokal saqlash, bildirishnomalar, kamera va geolokatsiyaga kirish, unumdorlik va batareya sarfi.

Ishning alohida qismi — **nashr qilish**: build’larni tayyorlash, App Store va Google Play tekshiruvidan o‘tish, yangilanishlarni chiqarish.

## Asosiy yo‘nalishlar

| Yo‘nalish | Tillar va vositalar | Xususiyatlari |
|---|---|---|
| iOS (native) | Swift, SwiftUI, UIKit, Xcode | ishlash uchun Mac kerak |
| Android (native) | Kotlin, Jetpack Compose, Android Studio | qurilmalar juda xilma-xil |
| Flutter | Dart | iOS va Android uchun bitta kod |
| React Native | JavaScript/TypeScript, React | veb-dasturlashga yaqin |

**Native dasturlash** platforma imkoniyatlariga to‘liq kirish va odatda eng yaxshi unumdorlikni beradi. U silliqlik, tizim bilan chuqur integratsiya va OT ning yangi imkoniyatlari muhim bo‘lgan murakkab ilovalar uchun tanlanadi.

**Kross-platforma dasturlash** bitta jamoaga ilovani ikkala platforma uchun birdaniga chiqarish imkonini beradi. Uni ko‘pincha tezlik va byudjet muhim bo‘lgan startaplar, studiyalar va kompaniyalar tanlaydi.

## Ishga olish tomonidan qanday ko‘rinadi

- **Yirik mahsulot kompaniyalari** va banklar ko‘pincha alohida iOS va Android jamoalarini saqlaydi va native dasturchilarni qidiradi.
- **Studiyalar va startaplar** mahsulotni ikkala platformaga tezroq chiqarish uchun ko‘proq Flutter yoki React Native’dan foydalanadi.
- **Kross-platforma dasturchi** ham native asoslarni tushunishi kerak: ruxsatlar, ilovaning hayot sikli, nashr qilish. Busiz nostandart muammolarni hal qilish qiyin.
- **React Native** — React’ni biladiganlar uchun tabiiy yo‘l; **Flutter** esa yaxlit vositalar to‘plami tufayli yangi boshlovchilar orasida mashhur tanlov.

Tanlashdan oldin o‘z shahringizdagi yoki masofaviy ish platformalaridagi vakansiyalarni ochib, aynan siz ishlamoqchi bo‘lgan joyda qaysi steklar ko‘proq uchrashini ko‘rib chiqing. Talab hududlarga qarab sezilarli farq qiladi va vaqt o‘tishi bilan o‘zgaradi.

## Junior-dasturchiga nima kerak

**Majburiy asos:**

- tanlangan platforma tilini ishonchli bilish;
- interfeys va ekranlar orasidagi navigatsiyani qurish;
- REST API va JSON bilan ishlash, tarmoq xatolarini qayta ishlash;
- ma’lumotlarni lokal saqlash;
- asinxronlik: uzoq amallar paytida interfeysni «muzlatib» qo‘ymaslik;
- Git va jamoada ishlash.

**Imkoniyatni sezilarli oshiradi:**

- arxitektura yondashuvlarini (masalan, MVVM) tushunish va kodni tartibli saqlash;
- bazaviy unit-testlar;
- kamida bitta ilovani do‘konga joylagan tajriba;
- interfeys detallariga e’tibor: yuklanish holatlari, bo‘sh ekranlar, xatolar.

## Portfolioni qanday qurish

O‘nta tugallanmagan emas, **2–3 ta tugallangan ilova** yarating. Yaxshi to‘plam:

1. Ochiq API bilan ishlaydigan ilova: ro‘yxat, batafsil ekran, qidiruv, xatolarni qayta ishlash.
2. Lokal ma’lumotli ilova: eslatmalar, odatlar trekeri, xaridlar ro‘yxati.
3. O‘zingizning real vazifangizni hal qiladigan narsa — bunday loyihalar haqida suhbatda gapirish eng oson.

Kodni GitHub’ga tushunarli README, skrinshotlar va arxitektura tavsifi bilan joylang. Agar ilovani do‘konga chiqara olsangiz — bu katta ustunlik.

## Keng tarqalgan xatolar

- Bitta texnologiyani yaxshi darajaga yetkazish o‘rniga Swift, Kotlin va Flutter’ni bir vaqtda o‘rganish.
- Tutoriallarni o‘zgartirmasdan nusxalab, o‘z loyihasi sifatida ko‘rsatish.
- Xatolarni qayta ishlash va turli ekran o‘lchamlarini e’tiborsiz qoldirish.
- Ilova server bilan qanday aloqa qilishini tushunmaslik.

## FAQ

### Yangi boshlovchi nimani tanlashi kerak: native yoki kross-platforma?

O‘z hududingizdagi vakansiyalar va tajribangizga qarang. Agar JavaScript va React’ni bilsangiz — React Native’ni ko‘rib chiqing. Noldan boshlasangiz, Flutter ham, native platformalardan biri ham mos keladi. Asosiysi — bittasini ishonchli darajaga yetkazish.

### Mobil dasturlash uchun Mac kerakmi?

iOS dasturlash va App Store’ga joylash uchun amalda ha. Android va Android uchun kross-platforma dasturlashni Windows yoki Linux’da olib borish mumkin.

### Backend’ni bilish kerakmi?

Server qismini yozish shart emas, lekin HTTP, REST API, avtorizatsiya va ma’lumot formatlari qanday ishlashini tushunish kerak. Mobil ilova deyarli har doim server bilan aloqa qiladi.
