---
title: Server va ilovaning qaysi metrikalarini monitoring qilish kerak
description: CPU, xotira, disk, tarmoq, to‘rtta oltin signal, RED va USE usullari, alertlar uchun oqilona chegaralar va har bir sakrash nimani anglatishi.
summary: Server resurslarini (CPU, xotira, disk, tarmoq) USE usuli bilan, ilova xatti-harakatini esa to‘rtta oltin signal — kechikish, trafik, xatolar, to‘yinish bo‘yicha kuzating; alertlarni foydalanuvchi sezadigan narsalarga qo‘ying.
---
## Birinchi navbatda nimani kuzatish kerak

Metrikalar ikki darajaga bo‘linadi:

- **Server resurslari** — CPU, xotira, disk, tarmoq. “Temir yetarlimi?” degan savolga javob beradi.
- **Ilova xatti-harakati** — kechikish, so‘rovlar soni, xatolar. “Foydalanuvchiga qulaymi?” degan savolga javob beradi.

Ikkinchi darajadan boshlash kerak: foydalanuvchini CPU yuklamasi qiziqtirmaydi, uni sahifa sekin yoki xato bilan ochilishi qiziqtiradi. Resurslar esa **sababni** topishga yordam beradi.

## To‘rtta oltin signal

Bu yondashuv Google SRE kitobidan olingan. So‘rovlarga xizmat ko‘rsatadigan har qanday servis uchun:

1. **Latency (kechikish)** — javob vaqti. O‘rtacha qiymatga emas, p95 va p99 persentillarga qarang: o‘rtacha qiymat sekin so‘rovlarni yashiradi.
2. **Traffic (trafik)** — soniyasiga so‘rovlar yoki boshqa yuklama ko‘rsatkichi.
3. **Errors (xatolar)** — muvaffaqiyatsiz javoblar ulushi: HTTP 5xx, taymautlar, noto‘g‘ri javoblar.
4. **Saturation (to‘yinish)** — servis chegarasiga qanchalik yaqin: navbatlar, ulanishlar puli, eng tor resursning yuklamasi.

## RED va USE usullari

Bir-birini yaxshi to‘ldiradigan ikkita soddalashtirilgan chek-list.

| Usul | Nima uchun | Nimani o‘lchash |
|---|---|---|
| **RED** | Servislar va API | Rate (so‘rovlar), Errors (xatolar), Duration (davomiylik) |
| **USE** | Resurslar: CPU, disk, tarmoq | Utilization (yuklama), Saturation (navbat), Errors (xatolar) |

**RED** — tashqaridan qarash, mijoz servisni qanday ko‘rishi. **USE** — ichkaridan qarash, tor joyni topish uchun.

## Resurs metrikalari va sakrash nimani anglatadi

Quyidagi chegaralar qoida emas, **boshlang‘ich nuqta**. To‘g‘ri qiymatlar sizdagi odatiy yuklamaga bog‘liq.

### CPU
- **Nimani kuzatish:** yuklama, yadrolar soniga nisbatan load average, iowait, virtual mashinalarda steal.
- **Boshlang‘ich chegara:** uzoq vaqt 80–90% dan yuqori yuklama — tekshirish uchun sabab.
- **Sakrash odatda nimani anglatadi:** trafik o‘sishi, og‘ir so‘rov yoki koddagi sikl, cron vazifasi. Yuqori **iowait** sekin diskka, yuqori **steal** provayderdagi yuklangan xostga ishora qiladi.

### Xotira
- **Nimani kuzatish:** mavjud xotira (free emas, available), swap ishlatilishi, OOM killer hodisalari.
- **Boshlang‘ich chegara:** available doimiy ravishda 10–15% dan past yoki faol swap.
- **Odatda nimani anglatadi:** xotira oqishi (grafik faqat qayta ishga tushirganda tushadigan “arra” ko‘rinishida), haddan tashqari katta keshlar yoki pullar, yuklama o‘sishi.

### Disk
- **Nimani kuzatish:** to‘lganlik, bo‘sh inode’lar, I/O kechikishi, IOPS.
- **Boshlang‘ich chegara:** 80–85% dan yuqori — ogohlantirish, 90–95% dan yuqori — shoshilinch.
- **Odatda nimani anglatadi:** rotatsiyasiz o‘sgan loglar, o‘sha diskdagi backup’lar, vaqtinchalik fayllar. I/O kechikishining o‘sishi — bazaga og‘ir so‘rovlar yoki bulutli disk limitining tugashi.

### Tarmoq
- **Nimani kuzatish:** kiruvchi va chiquvchi trafik, xatolar va paket yo‘qotishlari, ulanishlar soni, TCP retransmitlar.
- **Sakrash odatda nimani anglatadi:** marketing rassilkasi yoki bot-trafik, DDoS, katta eksportlar, provayderdagi muammolar.

## Ilova va biznes metrikalari

Tizim metrikalaridan tashqari quyidagilarni yig‘ish foydali:

- **ma’lumotlar bazasi** so‘rovlarining davomiyligi va sekin so‘rovlar soni;
- **navbatlar** hajmi va fon vazifalarini qayta ishlash vaqti;
- **tashqi bog‘liqliklar** — to‘lov shlyuzlari, API’lar, ularning kechikishi va xatolari;
- **biznes metrikalari** — ro‘yxatdan o‘tishlar, buyurtmalar, to‘lovlar. Serverlar “yashil” turganda buyurtmalarning keskin tushishi ko‘pincha nosozlikning birinchi belgisi bo‘ladi.

## Alertlarni shovqinsiz qanday sozlash kerak

- **Alert harakat talab qilishi kerak.** Unga e’tibor bermaslik mumkin bo‘lsa, bu alert emas, grafik.
- **Sabablarga emas, simptomlarga alert qo‘ying**: “xatolar ulushi oshdi” “CPU 85%” dan muhimroq.
- **Davomiylikdan foydalaning**: shart bitta nuqtada emas, bir necha daqiqa davomida saqlanishi kerak.
- **Darajalarni ajrating**: ogohlantirish — chatga, kritik — navbatchiga.
- **Chegaralarni qayta ko‘rib chiqing** har bir intsidentdan keyin.

## Ko‘p uchraydigan xatolar

- Faqat o‘rtacha kechikishga qarash.
- Serverni kuzatib, saytni tashqaridan tekshirmaslik (uptime tekshiruvlari).
- Jamoa ko‘nikib, javob bermay qo‘yadigan o‘nlab alertlar qo‘yish.
- Metrikalar tarixini saqlamaslik — usiz trendlar va odatiy daraja ko‘rinmaydi.

## FAQ

### Monitoringni qaysi vositadan boshlash kerak?
Keng tarqalgan open-source variant — metrikalarni yig‘ish uchun Prometheus, grafiklar va alertlar uchun Grafana. Bulutli provayderlar va SaaS servislar o‘z infratuzilmasisiz shunga o‘xshash imkoniyatlarni beradi.

### Nima muhimroq: metrikalar, loglar yoki treyslar?
Ular turli vazifani bajaradi. Metrikalar nimadir noto‘g‘ri ekanini, loglar aynan nima bo‘lganini, treyslar esa servislar zanjirining qayerida so‘rov sekinlashayotganini ko‘rsatadi. Odatda metrikalar va loglardan boshlanadi.

### Nega persentillar o‘rtacha qiymatdan yaxshiroq?
O‘rtacha qiymat chetga chiqishlarni silliqlaydi: so‘rovlarning ko‘pi tez, bir qismi esa juda sekin bo‘lsa, o‘rtacha normal ko‘rinadi. p95 va p99 eng omadsiz foydalanuvchilarning tajribasini ko‘rsatadi.
