---
title: Mobil ilovani qanday tezlashtirish: ishga tushish, silliqlik va xotira
description: Android va iOS profayler’lari bilan sovuq start, kadr uzilishlari va xotirani o‘lchash, so‘ng odatiy yechimlar: lazy yuklash, kesh, ro‘yxat virtualizatsiyasi.
summary: Avval haqiqiy qurilmada va reliz yig‘masida o‘lchang, keyin optimallashtiring. Ko‘pincha ishga tushishda ishlarni kechiktirish, rasmlarni keshlash va kichraytirish, ro‘yxatlarni virtualizatsiya qilish va og‘ir ishni asosiy oqimdan olib chiqish yordam beradi.
---

## Avval o‘lchash, keyin tezlashtirish

«Ko‘z bilan» optimallashtirish ko‘pincha noto‘g‘ri joyni tezlashtiradi. Ish tartibi:

1. Metrikani tanlang: ishga tushish vaqti, silliqlik yoki xotira.
2. **Haqiqiy o‘rta toifali qurilmada** va **reliz** (yoki profile) yig‘masida o‘lchang — debug yig‘malar sezilarli darajada sekinroq.
3. Profayler bilan tor joyni toping.
4. Bitta narsani tuzating va qayta o‘lchang.

## Nimani o‘lchash kerak

- **Sovuq start** — ilova jarayoni hali xotirada bo‘lmagandagi ishga tushish. Eng sekin va eng muhim ssenariy. Iliq va issiq startlar tezroq, ularni alohida kuzatish kerak.
- **Silliqlik (jank)** — tushib qolgan kadrlar. 60 Gts’da har bir kadr uchun taxminan **16,7 ms**, 120 Gts’da taxminan **8,3 ms** bor. Ulgurmasa — animatsiya va aylantirish titraydi.
- **Xotira** — eng yuqori iste’mol va sizib chiqishlar (leak). Ular tufayli tizim ilovani fonda yopadi yoki u ishdan chiqadi.

## Platformalar bo‘yicha vositalar

| Platforma | Ishga tushish | Silliqlik | Xotira |
|---|---|---|---|
| Android | Macrobenchmark, `adb`, Android Studio Profiler | Profiler, Perfetto, JankStats | Memory Profiler, LeakCanary |
| iOS | Instruments: App Launch, Xcode Organizer | Instruments: Time Profiler, Hitches | Instruments: Allocations, Leaks |
| Flutter | DevTools (profile mode) | DevTools: Performance | DevTools: Memory |
| React Native | Platformalarning nativ profayler’lari | Perf Monitor, Hermes profayleri | Nativ profayler’lar |

Android’da sovuq startni tez tekshirish:

```bash
adb shell am force-stop com.example.app
adb shell am start -W -n com.example.app/.MainActivity
```

Natijada `TotalTime` qiymatiga qarang. Barqaror raqamlar uchun Macrobenchmark va bir necha marta ishga tushirishdan foydalaning. Production uchun haqiqiy foydalanuvchilar ma’lumotlari foydali: Google Play Console’dagi Android vitals va Xcode Organizer’dagi metrikalar.

## Odatiy yechimlar

### Ishga tushishni tezlashtirish

- **Kechiktirilgan initsializatsiya**: analitika, reklama, qo‘llab-quvvatlash chati va boshqa SDKlar birinchi kadrgacha kerak emas. Ularni chizilgandan keyin yoki talab bo‘yicha ishga tushiring.
- Tarmoq so‘rovlari va ma’lumotlar bazasi bilan og‘ir amallarni **startda sinxron** bajarmang. Kesh yoki skeleton ko‘rsating.
- Android’da **Baseline Profiles** dan foydalaning — ular birinchi ishga tushirishlarda kod bajarilishini tezlashtiradi.
- iOS’da dinamik ulanadigan kutubxonalar soniga e’tibor bering: har biri yuklanishda qo‘shimcha ish qo‘shadi.

### Rasmlar va kesh

- Rasmlarni asl o‘lchamda emas, **ko‘rsatiladigan o‘lchamda** yuklang.
- Disk va xotira keshi bor kutubxonalardan foydalaning: Android’da Coil yoki Glide, iOS’da Kingfisher yoki SDWebImage, Flutter’da `cached_network_image`.
- Samarali formatlarni tanlang (masalan, WebP) va assetlarni siqing.

### Ro‘yxatlarni virtualizatsiya qilish

- Uzun ro‘yxatlarni **lazy** chizing: `RecyclerView` yoki `LazyColumn`, `UICollectionView` yoki SwiftUI lazy konteynerlari, Flutter’da `ListView.builder`, React Native’da `FlatList`.
- Butun ro‘yxat qayta chizilmasligi uchun elementlarga **barqaror kalitlar** bering.
- Katakchalar tuzilishini soddalashtiring: kamroq ichma-ichlik, kamroq og‘ir effektlar.

### Asosiy oqimni yengillashtirish

- JSON parsing, ma’lumotlar bazasi bilan ishlash, rasmlarni qayta ishlash — **fon oqimida**: Android’da korutinlar, iOS’da Swift Concurrency, Flutter’da izolyatlar.
- React Native’da animatsiyalar paytida JS oqimida og‘ir hisob-kitoblardan qoching.
- Har bir qayta chizishda obyektlarni qayta yaratmang va ma’lumotlarni qayta hisoblamang.

### Xotira

- Ekran yopilganda tinglovchilar va taymerlardan obunani bekor qiling.
- Uzoq yashaydigan obyektlarning ekranlarga havolalarini kuzating — bu sizib chiqishning klassik sababi.
- Kesh hajmini cheklang.

## Ko‘p uchraydigan xatolar

- Debug yig‘mada yoki faqat flagman telefonda o‘lchash.
- Barcha SDKlarni birinchi millisoniyalarda ishga tushirish.
- Kameradan olingan suratlarni ro‘yxat prevyusiga to‘liq o‘lchamda yuklash.
- Qayta o‘lchamasdan optimallashtirish va yordam berdimi-yo‘qmi, bilmaslik.

## FAQ

### Nega ilova dasturchilarda tez, foydalanuvchilarda esa sekin?

Dasturchilar odatda kuchli qurilmalarda va tez internetda test qiladi. Foydalanuvchilarda arzon telefonlar, kam bo‘sh xotira va sekin tarmoq bo‘lishi mumkin. O‘rta toifali qurilmada tekshiring va do‘kon konsollaridagi haqiqiy foydalanuvchilar metrikalariga qarang.

### Kross-platforma ilova har doim nativdan sekinroqmi?

Shart emas. Flutter va React Native silliq interfeyslar yaratishga imkon beradi, lekin ularning profayl vositalarini bilish kerak. Unumdorlik muammolarining aksariyati freymvork tanlovi bilan emas, arxitektura va ortiqcha ish bilan bog‘liq.

### Hammasi sekin ishlasa, nimadan boshlash kerak?

Sovuq start va bosh ekrandan: ularni har bir foydalanuvchi ko‘radi. Ishga tushish profilini oling, ortiqcha initsializatsiya va sinxron ishlarni olib tashlang, keyin asosiy ro‘yxatlarni aylantirishga o‘ting.
