---
title: "Markazlashgan loglar: Grafana Loki yoki ELK Stack"
description: Nega loglarni serverdan olib chiqish kerak, Grafana Loki va ELK indeksatsiya, resurslar va narx bo‘yicha qanday farqlanadi va loglarni qanday yetkazish mumkin.
summary: Loki faqat label’larni indekslaydi va loglarni arzon saqlaydi — Grafana ishlatadigan ko‘pchilik jamoalarga mos; ELK butun matnni indekslaydi, kuchliroq qidiradi, lekin ancha ko‘p resurs va e’tibor talab qiladi.
---
## Qisqa javob

Agar sizga barcha serverlardan loglarni yig‘ish va xatolarni servis, muhit va vaqt bo‘yicha tez topish kerak bo‘lsa — **Grafana Loki** dan boshlang. Agar istalgan so‘z bo‘yicha full-text qidiruv, murakkab analitika va katta hajmlarda maydonlar bo‘yicha agregatsiyalar kerak bo‘lsa — **ELK** (Elasticsearch, Logstash, Kibana) yoki uning ochiq forki OpenSearch’ni ko‘rib chiqing.

## Nega loglar serverdan chiqishi kerak

- **Server ishdan chiqishi mumkin.** Disk bilan birga avariyani tahlil qilish uchun kerak bo‘lgan loglar ham yo‘qoladi.
- **Serverlar bittadan ko‘p.** Beshta mashina va o‘nta konteynerda `ssh` va `grep` bilan xato qidirish — uzoq.
- **Konteynerlar vaqtinchalik.** Konteyner qayta yaratilganda uning stdout’i yo‘qoladi.
- **Kirish va xavfsizlik.** Loglarni o‘qish uchun dasturchiga production’da root kerak emas.
- **Korrelyatsiya.** Bitta oynada barcha servislarda aynan bir soniyada nima bo‘lgani ko‘rinadi.

## Ular qanday tuzilgan

**ELK** har bir yozuvni tahlil qiladi va mazmuni bo‘yicha **teskari indeks** (inverted index) quradi. Istalgan so‘z va maydon bo‘yicha qidiruv juda tez, lekin indeks ko‘p joy egallaydi, Elasticsearch esa xotira va diskka talabchan.

**Loki** faqat **label’larni** indekslaydi: `app`, `env`, `host`. Log matni siqilgan chunk’larga aylanadi va, masalan, obyektli xotirada saqlanadi. So‘rov paytida Loki avval label’lar bo‘yicha oqimlarni tanlaydi, keyin matnni «kuch bilan» filtrlaydi.

## Taqqoslash

| Mezon | Grafana Loki | ELK / OpenSearch |
|---|---|---|
| Nima indekslanadi | Faqat label’lar | Butun matn va maydonlar |
| Resurslar | Kamtarona | Yuqori (RAM, tez disklar) |
| Saqlash | Obyektli (S3-mos) yoki disk | Klaster disklari |
| Istalgan so‘z bo‘yicha qidiruv | Katta oraliqlarda sekinroq | Tez |
| Maydonlar bo‘yicha analitika | Bazaviy (LogQL) | Kuchli |
| Interfeys | Grafana | Kibana / OpenSearch Dashboards |
| Ekspluatatsiya murakkabligi | Pastroq | Yuqoriroq: shard’lar, replikalar, indeks retention’i |

Ikkala holatda ham narx mahsulot nomiga emas, balki **kunlik log hajmi, saqlash muddati va qidiruv tezligiga qo‘yiladigan talablarga** bog‘liq. Qancha kam indekslasangiz, saqlash shuncha arzon — Loki’ning asosiy ustunligi shunda.

## Loglarni yetkazishning minimal sxemasi

Universal yig‘uvchi — **Fluent Bit**: u fayllar yoki konteyner loglarini o‘qiydi va ularni ham Loki’ga, ham Elasticsearch’ga yubora oladi. Bu qulay: bitta backend bilan boshlab, keyin ilovalarga tegmasdan uni almashtirish mumkin.

Loki’ga yuborish:

```ini
[INPUT]
    Name   tail
    Path   /var/log/app/*.log
    Tag    app

[OUTPUT]
    Name   loki
    Match  app
    Host   loki
    Port   3100
    Labels job=app, env=prod
```

Elasticsearch’ga yuborish:

```ini
[OUTPUT]
    Name               es
    Match              app
    Host               elasticsearch
    Port               9200
    Index              app-logs
    Suppress_Type_Name On
```

Grafana’ning o‘z agenti ham bor — **Grafana Alloy**, u Promtail o‘rnini egalladi. ELK uchun klassik variant — Filebeat. Butun infratuzilma uchun bitta agent tanlang.

Loki’dagi so‘rov misoli (LogQL): tanlangan davrdagi servisning barcha xatolari.

```logql
{app="api", env="prod"} |= "error" | json | level="error"
```

## Qanday qilib xato qilmaslik kerak

- **Loki’da label’lar kam bo‘lsin.** 3–6 ta barqaror label ishlating. `user_id` yoki `request_id` ni label qilmang — oqimlar soni portlaydi. Bunday qiymatlarni log tanasida qoldiring.
- **Strukturasiz loglar.** JSON loglarni ikkala tizimda ham filtrlash ancha oson.
- **Retention yo‘q.** Saqlash muddatini oldindan belgilang, aks holda disk kutilmaganda tugaydi.
- **Loglardagi sirlar.** Parollar, tokenlar va shaxsiy ma’lumotlar markaziy omborga tushmasligi kerak.
- **Bufersiz yig‘uvchi.** Backend mavjud bo‘lmaganda loglarni yo‘qotmaslik uchun diskka buferlashni sozlang.

## FAQ

### Loki’dan boshlab, keyin ELK’ga o‘tish mumkinmi?

Ha, ayniqsa yetkazish Fluent Bit yoki OpenTelemetry Collector kabi universal agentga qurilgan bo‘lsa. Faqat chiqish plagini o‘zgaradi, ilovalar o‘sha-o‘sha qoladi.

### Loki kichik loyiha uchun mosmi?

Ha. Loki’ni lokal diskda saqlash bilan bitta konteynerda ishga tushirish mumkin, loglarni esa metrikalar allaqachon turgan o‘sha Grafana’da ko‘rish mumkin.

### Audit va xavfsizlik analitikasi uchun nimani tanlash kerak?

Ko‘plab maydonlar bo‘yicha murakkab so‘rovlar va tergovlar uchun odatda Elasticsearch yoki OpenSearch qulayroq: u yerda full-text indeks va agregatsiyalar kuchliroq.
