---
title: TestFlight va Google Play test treklari orqali beta-testlash
description: TestFlight va Google Play’da ichki, yopiq va ochiq testlash qanday ishlaydi, testerlarni taklif qilish, fikr va crash’larni yig‘ish hamda build’ni chiqarish.
summary: iOS’da beta TestFlight orqali (ichki va tashqi testerlar), Android’da Play Console treklari orqali (ichki, yopiq, ochiq) tarqatiladi. Tekshirilgan build keyin qayta yig‘masdan production’ga chiqariladi.
---

## Qisqa javob

Beta-test — deyarli tayyor build’ni do‘konlarning rasmiy vositalari orqali cheklangan guruhga berish. Testerlar ilovani oddiy ilova kabi o‘rnatadi, siz esa ommaviy relizdan oldin fikr-mulohazalar va ishdan chiqish (crash) hisobotlarini olasiz.

- **iOS** — App Store Connect ichidagi **TestFlight** xizmati. Testerlar TestFlight ilovasini o‘rnatadi va build’laringizni u orqali oladi.
- **Android** — Google Play Console’dagi **test treklari**: ichki, yopiq va ochiq. Tester havola orqali qatnashishni tasdiqlaydi va ilovani to‘g‘ridan-to‘g‘ri Google Play’dan o‘rnatadi.

Ikkala yo‘lning asosiy afzalligi: keyin production’ga chiqadigan aynan o‘sha build testlanadi.

## Testlashning uch darajasi

| Daraja | iOS (TestFlight) | Android (Play Console) |
|---|---|---|
| Ichki | App Store Connect jamoasi a’zolari, build qayta ishlangach darhol mavjud | Internal testing: email ro‘yxati, to‘liq tekshiruvsiz tez mavjud |
| Yopiq | Email yoki guruhlar bo‘yicha tashqi testerlar, Beta App Review kerak | Closed testing: email ro‘yxatlari yoki Google Groups, Google tekshiruvidan o‘tadi |
| Ochiq | Ishtirokchilar soni cheklangan ommaviy TestFlight havolasi | Open testing: Google Play sahifasidan istalgan kishi qo‘shila oladi |

Amaliy tartib: avval ichki doira (jamoa va buyurtmachi), keyin yopiq (sodiq foydalanuvchilar, hamkorlar), qurilmalarning keng tanlovi kerak bo‘lsagina ochiq test.

**Yangi Google Play akkauntlari uchun muhim:** yangi shaxsiy dasturchi akkauntlari uchun Google production ochilishidan oldin ma’lum muddat davomida minimal sondagi ishtirokchilar bilan yopiq test o‘tkazishni talab qiladi. Aniq shartlar o‘zgarib turadi — ularni Play Console’da oldindan tekshiring va bu vaqtni rejaga kiriting.

## Testerlarni qanday taklif qilish

**TestFlight:**
1. Build’ni Xcode yoki CI orqali yuklang va qayta ishlanishini kuting.
2. Ichki testerlar uchun odamlarni App Store Connect jamoasiga qo‘shing va guruhga kiriting.
3. Tashqi testerlar uchun guruh yarating, email qo‘shing yoki **ommaviy havolani** yoqing, «What to Test» maydonini to‘ldiring va build’ni Beta App Review’ga yuboring.

**Google Play:**
1. AAB faylini kerakli trekka yuklang va reliz yarating.
2. Email ro‘yxati yoki Google Group qo‘shing.
3. Testerlarga **opt-in havolani** yuboring — u orqali qo‘shilmaguncha ular do‘konda ilovani ko‘rmaydi.

Esda tuting: TestFlight build’larining amal qilish muddati bor, undan keyin ular ishga tushmaydi. Uzoq testlar uchun yangi build’larni muntazam yuklab turing.

## Fikr-mulohaza va crash’larni yig‘ish

- **TestFlight** testerga skrinshot olib, fikrni to‘g‘ridan-to‘g‘ri ilova ichidan yuborish imkonini beradi. Fikrlar va crash hisobotlari App Store Connect hamda Xcode Organizer’da ko‘rinadi.
- **Google Play** crash va ANR’larni **Android vitals** bo‘limida yig‘adi, **pre-launch report** esa build’ni avtomatik ravishda real qurilmalar to‘plamida ishga tushirib, xatolar va accessibility muammolarini ko‘rsatadi.
- Batafsil manzara uchun **Crashlytics** yoki Sentry qo‘shing: simvolizatsiya qilingan stack trace, versiyalar, qurilmalar va crash’gacha bo‘lgan qadamlar.

Maslahat: testerlarga ssenariylarning qisqa chek-listini («ro‘yxatdan o‘tish, to‘lash, push olish») va fikr uchun bitta kanal bering. Aks holda fikrlar tarqoq va to‘liqsiz bo‘ladi.

## Betadan production’ga

- **iOS:** testlangan build App Store Connect’dagi ilova versiyasida tanlanadi va App Review’ga yuboriladi. Qayta yig‘ish shart emas. Yumshoq chiqarish uchun **phased release**’dan foydalaning — yangilanish foydalanuvchilarga bosqichma-bosqich yetadi.
- **Android:** Play Console’da reliz test trekidan production’ga **o‘tkaziladi (promote)**. **Staged rollout**’dan foydalaning: foydalanuvchilarning kichik ulushidan boshlang va Android vitals’dagi crash’larni kuzatib, kengaytiring.

## Ko‘p uchraydigan xatolar

- Tashqi testerlarga ichki tekshiruvsiz xom build yuborish.
- Build raqamini oshirmaslik — do‘konlar bir xil build number / versionCode bilan qayta yuklashni qabul qilmaydi.
- Production’dan farqli kalitlar va muhitga ega debug build’da testlash.
- Tashqi test uchun demo akkauntlar va tekshiruvchilar uchun izohlarni unutish.
- Bosqichli relizsiz hammaga birdaniga chiqarish.

## FAQ

### Beta-test uchun Apple tekshiruvi kerakmi?
Ichki testerlar uchun — yo‘q. Tashqi testerlar uchun build Beta App Review’dan o‘tadi; odatda bu to‘liq tekshiruvdan tezroq, lekin ayniqsa versiyaning birinchi build’i uchun vaqt ajrating.

### Betada pullik xaridlarni testlash mumkinmi?
Ha. TestFlight’da xaridlar haqiqiy pul yechilmasdan sandbox orqali o‘tadi, Google Play’da esa Play Console’ga qo‘shilgan litsenziyalangan testerlar orqali.

### Beta qancha davom etishi kerak?
Ilovaning murakkabligi va do‘kon talablariga bog‘liq. Kunlarga emas, natijaga qarang: asosiy ssenariylar turli qurilmalarda o‘tilgan va jiddiy crash’lar yo‘q.
