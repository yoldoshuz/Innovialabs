---
title: Android fragmentatsiyasi: minimal OS versiyasi va test qurilmalari
description: Auditoriya ma’lumotlari asosida minSdk’ni qanday tanlash, eski Android versiyalari nimaga tushadi va real test qurilmalari to‘plamini qanday tuzish.
summary: Minimal Android versiyasi o‘z auditoriyangiz ma’lumotlari asosida, yo‘qotiladigan foydalanuvchilarni eski versiyalarni qo‘llab-quvvatlash xarajatlari bilan solishtirib tanlanadi; testlar esa kichik matritsada o‘tkaziladi: eng eski va eng yangi versiyalar, ommabop modellar, kuchsiz qurilma va turli ishlab chiqaruvchi qobiqlari.
---

## Qisqa javob

Android fragmentatsiyasi — bu minglab modellar, bir nechta faol OS versiyalari va o‘nlab ishlab chiqaruvchi qobiqlari. Hammasini testlash imkonsiz, shuning uchun ikkita yechim ishlaydi:

1. **minSdk ma’lumotlarga qarab tanlanadi**, «hamma joyda ishlasin» deb emas: eski versiyadan voz kechganda qancha foydalanuvchi yo‘qotilishini ko‘rib, uni qo‘llab-quvvatlash narxi bilan solishtiriladi.
2. **Testlar matritsada o‘tkaziladi** — u asosiy farqlarni qamrab oladi: versiyalar, ishlab chiqaruvchilar, qurilma quvvati va ekran o‘lchamlari.

## Chalkashtiriladigan uchta SDK parametri

```kotlin
android {
    compileSdk = 36        // loyiha qaysi SDK bilan kompilyatsiya qilinadi
    defaultConfig {
        minSdk = 26        // qo‘llab-quvvatlanadigan eng eski Android versiyasi
        targetSdk = 36     // ilova qaysi versiya xatti-harakatiga moslashtirilgan
    }
}
```

Qiymatlar misol uchun. Farqni bilish muhim:

- **minSdk** ilovani qaysi qurilmalarga umuman o‘rnatish mumkinligini belgilaydi. Bu biznes va auditoriya bo‘yicha qaror.
- **targetSdk**’ni Google Play muntazam ravishda yangi darajaga ko‘tarishni talab qiladi, aks holda yangilanish chiqarib bo‘lmaydi. Bu tanlov emas, majburiyat.
- **compileSdk** odatda so‘nggi barqaror versiyaga teng.

## Ma’lumotlarni qayerdan olish

- **Android Studio** loyiha yaratishda API versiyalari taqsimotini ko‘rsatadi — bu global manzara.
- **Play Console** nashr qilingan ilova uchun real foydalanuvchilaringizning Android versiyalari va qurilma modellarini ko‘rsatadi.
- **O‘z analitikangiz** — mobil analitikadagi yoki, ilova hali bo‘lmasa, saytdagi modellar va OS versiyalari haqidagi ma’lumotlar.
- **Hududiy statistika** — bozor bo‘yicha taxminiy mo‘ljal.

Arzon qurilmalar ko‘p bo‘lgan hududlarda eski versiyalar global statistikadagidan ko‘proq uchrashi mumkin. Shuning uchun o‘z hududingiz va auditoriyangiz ma’lumotlariga tayaning.

## Eski versiyalarni qo‘llab-quvvatlash nimaga tushadi

| Qaror | Afzalliklar | Kamchiliklar |
|---|---|---|
| Past minSdk | ko‘proq potensial foydalanuvchi | ko‘proq kod tarmoqlari, aylanma yechimlar va testlar; eskirgan WebView va tizim komponentlari |
| Yuqori minSdk | zamonaviy API’lar, kamroq test va xato | auditoriyaning bir qismi ilovani o‘rnata olmaydi |

Tashqi omilni ham hisobga oling: Jetpack kutubxonalari, Firebase va Google Play services vaqti-vaqti bilan o‘z minimal darajasini ko‘taradi. Juda eski versiyani qo‘llab-quvvatlashga tayyor bo‘lsangiz ham, uni ushlab turish imkonsiz bo‘lib qolishi mumkin.

Amaliy qoida: agar versiyadan voz kechish aynan sizning foydalanuvchilaringizning kichik ulushini yo‘qotsa-yu, ishning sezilarli qismini tejasa — minSdk’ni ko‘taring.

## Ekranlar va ishlab chiqaruvchi qobiqlari

**Ekranlar.** Ixcham va katta smartfonlar, planshetlar, buklanadigan qurilmalar, kamera uchun kesiklar, imo-ishorali va tugmali navigatsiya. **Katta tizim shriftini** alohida tekshiring: interfeyslar eng ko‘p aynan unda buziladi. Moslashuvchan maket uchun aniq ruxsatlarga bog‘lanish o‘rniga window size classes’dan foydalaning.

**Qobiqlar.** Samsung One UI, Xiaomi HyperOS va MIUI, OPPO va realme’dagi ColorOS, vivo, Huawei va Honor qobiqlari turlicha ishlaydi. Odatiy muammolar:

- batareyani agressiv tejash fon vazifalarini yopadi va push-bildirishnomalarni kechiktiradi;
- avtoishga tushirish va fonda ishlash uchun qo‘shimcha ruxsatlar;
- o‘ziga xos ruxsat dialoglari va bildirishnoma sozlamalari;
- kamera, fayllar va WebView ishlashidagi farqlar.

Fon vazifalarini WorkManager’da quring, foydalanuvchiga esa kerakli paytda ilova uchun batareya optimallashtirishini qanday o‘chirishni tushuntiring.

## Real qurilmalar matritsasini qanday tuzish

1. Analitikadan auditoriyangizdagi **eng ommabop modellarni** yozib oling.
2. Asosiy o‘lchovlarni qamrab oling: minimal va so‘nggi OS versiyalari, asosiy ishlab chiqaruvchilar, kuchsiz qurilma, kichik va katta ekranlar.
3. Darajalarga bo‘ling: asosiy ssenariylar uchun **bir nechta jismoniy qurilma**, OS versiyalari va ekranlar uchun **emulyatorlar**, uzun dum uchun Firebase Test Lab kabi **bulutli fermalar**.
4. Analitika o‘zgarganda matritsani qayta ko‘rib chiqing.

Namuna to‘plam:

| Qurilma | Nimani tekshiradi |
|---|---|
| Minimal versiyadagi arzon smartfon | tezlik va API bo‘yicha quyi chegara |
| Auditoriyangizdagi ommabop Samsung modeli | One UI, ommaviy segment |
| Ommabop Xiaomi yoki Redmi modeli | qobiq, batareya tejash, push |
| So‘nggi Android versiyasidagi smartfon | yangi ruxsatlar va tizim xatti-harakati |
| Kichik ekran va katta shriftli emulyator | maket |
| Planshet yoki buklanadigan smartfon, agar qo‘llab-quvvatlasangiz | moslashuvchanlik |

## Ko‘p uchraydigan xatolar

- **minSdk shablondan qolgan**, auditoriya bilan solishtirilmagan.
- **Testlar faqat dasturchining flagmanida**, foydalanuvchilar esa arzon modellarda.
- **targetSdk o‘z vaqtida yangilanmaydi** va yangilanishlar chiqarish bloklanadi.
- **Katta shrift va qorong‘i mavzu tekshirilmagan.**

## FAQ

### Ma’lumot hali bo‘lmasa, qaysi minSdk’ni tanlash kerak?

Android Studio yangi loyihalar uchun taklif qiladigan qiymatdan boshlang va uni analitikaning dastlabki haftalaridan keyin yoki kompaniyangiz sayti ma’lumotlari asosida moslang.

### Ko‘p qurilma sotib olish kerakmi?

Yo‘q. Asosiy ishlab chiqaruvchilar va kuchsiz qurilmani qamrab oladigan bir nechta jismoniy qurilma, qolgani uchun emulyatorlar va bulutli ferma yetarli.

### Bu Flutter va React Native’ga ham tegishlimi?

Ha. Freymvorklar va plaginlarning o‘z minimal Android darajasi bor, sizning minSdk’ingiz undan past bo‘la olmaydi. Krossplatformalik qobiqlar va ekranlar bilan bog‘liq muammolarni ham yo‘qotmaydi.
