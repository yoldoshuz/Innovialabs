---
title: Monitoring va observability: metrikalar, loglar va treyslar
description: Monitoring observabilitydan nimasi bilan farq qiladi, metrikalar, loglar va treyslar qaysi savolga javob beradi va qaysi vositalar nimani qamrab oladi.
summary: Monitoring oldindan belgilangan tekshiruvlar orqali nimadir buzilganini bildiradi; observability esa uch manba — metrikalar (qancha), loglar (nima bo‘ldi) va treyslar (aynan qayerda) yordamida sababini topishga imkon beradi.
---
## Qisqa javob

**Monitoring** — oldindan ma’lum ko‘rsatkichlarni kuzatish: CPU yuklamasi, xatolar soni, javob vaqti. Nima muhimligini oldindan belgilaysiz va alertlar qo‘yasiz. Monitoring **«nimadir noto‘g‘rimi?»** degan savolga javob beradi.

**Observability** (kuzatuvchanlik) — tizimning xususiyati: u chiqaradigan ma’lumotlar orqali uning ichki holatini, hatto hech kim oldindan ko‘rmagan vaziyatlarda ham tushunish imkoniyati. U **«nega bunday bo‘lyapti?»** degan savolga javob beradi.

Ular raqobatchi emas: monitoring observabilityning bir qismi. Avval alert xatolar ko‘payganini aytadi, keyin observability ma’lumotlari sababni topishga yordam beradi.

## Uch ustun: metrikalar, loglar, treyslar

| Manba | Bu nima | Qaysi savolga javob beradi |
|---|---|---|
| **Metrikalar** | vaqt bo‘yicha raqamlar: soniyadagi so‘rovlar, xatolar, kechikish, xotira | Qancha? Qanchalik tez-tez? Trend bormi? |
| **Loglar** | tafsilotli hodisa yozuvlari: xato, foydalanuvchi, parametrlar | Aynan nima sodir bo‘ldi? |
| **Treyslar** | bitta so‘rovning barcha servislar orqali yo‘li va har bir qadam davomiyligi | Aynan qayerda sekinlashyapti yoki yiqilyapti? |

### Metrikalar

Metrikalarni saqlash arzon va ular tez agregatsiya qilinadi, shuning uchun dashbordlar va alertlar aynan ularga quriladi. Kamchiligi — tafsilot kam: metrika 5xx xatolar ko‘payganini ko‘rsatadi, lekin qaysi so‘rov sabab bo‘lganini aytmaydi.

**Kardinallikka** ehtiyot bo‘ling: metrikaga foydalanuvchi ID yoki to‘liq URL belgisini qo‘shsangiz, vaqt qatorlari soni keskin oshadi, ombor esa sekin va qimmat bo‘lib qoladi.

### Loglar

Loglar kontekst beradi: stektreys, kiruvchi ma’lumotlar, buyurtma identifikatori. **Strukturalangan loglar** (JSON) yozgan ma’qul, shunda maydonlar bo‘yicha qidirish va filtrlash mumkin. Kamchiligi — hajm: loglar tez o‘sadi, ularni saqlash va indekslash pul talab qiladi.

### Treyslar

Treys **spanlardan** — ish bo‘laklaridan iborat: HTTP so‘rovni qayta ishlash, bazaga so‘rov, tashqi API chaqiruvi. Bitta so‘rovning barcha spanlari umumiy **trace ID** bilan bog‘langan. Treyslar ayniqsa bir nechta servisdan iborat tizimlarda kerak, chunki u yerda bitta servis loglari orqali sababni topib bo‘lmaydi.

## Ular birgalikda qanday ishlaydi

Odatiy tekshiruv shunday ko‘rinadi:

1. **Metrika** alert yuboradi: API ning p95 kechikishi oshdi.
2. Sekin so‘rovning **treysi** vaqt to‘lov servisini chaqirishga ketayotganini ko‘rsatadi.
3. Shu servisning xuddi shu trace ID li **loglari** bazaga ulanishdagi taymautlarni ko‘rsatadi.

Asosiysi — **korrelyatsiya**: har bir log qatoriga trace ID qo‘shing, vositalarda esa grafikdan treyslarga va treysdan loglarga o‘tishni sozlang.

## Qaysi vositalar nimani qamrab oladi

| Vazifa | Mashhur open source variantlar |
|---|---|
| Metrikalar | Prometheus, VictoriaMetrics |
| Loglar | Loki, Elasticsearch/OpenSearch, Graylog |
| Treyslar | Jaeger, Tempo, Zipkin |
| Vizualizatsiya va alertlar | Grafana, Alertmanager |
| Ma’lumot yig‘ish | OpenTelemetry, Fluent Bit, Vector |

Uchala ustunni birdaniga yopadigan platformalar ham bor: Datadog, New Relic, Grafana Cloud, Elastic Observability. Ularni ishga tushirish tezroq, lekin narx odatda ma’lumot hajmi bilan birga o‘sadi.

**OpenTelemetry** — metrikalar, loglar va treyslarni yig‘ish uchun ochiq standart va SDK to‘plami. Kodni u orqali instrumentatsiya qilsangiz, saqlash backendini ilovani qayta yozmasdan almashtirish mumkin.

## Nimadan boshlash kerak

- Kichik loyiha: server va ilova metrikalari, markazlashgan loglar, xatolar va mavjudlik bo‘yicha bir nechta alert. Treyslarni hozircha joriy qilmasa ham bo‘ladi.
- Bir nechta servis yoki navbatlar: OpenTelemetry orqali treysingni qo‘shing va loglarga trace ID yozing.
- Foydalanuvchi sezadigan **simptomlar** (xatolar, kechikish) bo‘yicha alert qo‘ying, har bir ichki metrika bo‘yicha emas, aks holda jamoa bildirishnomalarga e’tibor bermay qo‘yadi.

## FAQ

### Kichik loyihaga observability kerakmi?
Uch ustunning to‘liq to‘plami odatda kerak emas. Lekin asosiy metrikalar, markazlashgan loglar va alertlar productiondagi har qanday loyihaga kerak: ularsiz muammolar haqida foydalanuvchilardan bilib olasiz.

### Faqat loglar bilan cheklansa bo‘ladimi?
Texnik jihatdan metrikalarni loglardan hisoblash mumkin, lekin bu qimmatroq va sekinroq. Metrikalar dashbord va alertlar uchun, loglar esa aniq holatlarni tahlil qilish uchun qulayroq.

### APM nima?
APM (Application Performance Monitoring) — ilova metrikalari va treyslarini avtomatik yig‘adigan vositalar sinfi: endpointlar javob vaqti, bazaga sekin so‘rovlar, xatolar. Mohiyatan bu ilova darajasi uchun tayyor observability yechimi.
