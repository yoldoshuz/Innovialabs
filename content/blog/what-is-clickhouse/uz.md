---
title: ClickHouse nima va nega uni analitika uchun tanlashadi
description: ClickHouse — ulkan jadvallar bo‘yicha tezkor analitik so‘rovlar uchun ustunli MBBT. U qanday ishlaydi, qayerda kuchli va PostgreSQL dan farqi nimada.
summary: ClickHouse — analitika uchun open-source ustunli ma’lumotlar bazasi: u faqat kerakli ustunlarni o‘qib, ularni yaxshi siqqani uchun milliardlab qatorlarni tez skanerlaydi va agregatsiya qiladi. Tez-tez nuqtaviy yangilash va tranzaksiyalar uchun mos emas, shuning uchun odatda PostgreSQL o‘rniga emas, uning yonida ishlaydi.
---

## Qisqa javob

**ClickHouse** — **OLAP**, ya’ni analitik qayta ishlash uchun mo‘ljallangan open-source **ustunli** ma’lumotlar bazasini boshqarish tizimi. Uning vazifasi — juda katta jadvallar bo‘yicha «oxirgi bir yilda har bir shahar bo‘yicha har kuni nechta xarid bo‘lgan» kabi savollarga dashbordlar va ma’lumotlarni jonli o‘rganish uchun yetarlicha tez javob berish.

Tahlilchilar uni so‘rovlarning yuqori tezligi, kuchli siqish va tanish SQL uyg‘unligi uchun tanlashadi.

## Ustunli saqlash: tezlik qayerdan

PostgreSQL kabi klassik baza ma’lumotlarni **qatorlar bo‘yicha** saqlaydi: bitta yozuvning barcha maydonlari yonma-yon turadi. Bu «1042-buyurtmani olib, holatini yangilash» kabi vazifa uchun ideal.

ClickHouse esa ma’lumotlarni **ustunlar bo‘yicha** saqlaydi: `city` ning barcha qiymatlari birga, `amount` ning barcha qiymatlari birga va hokazo. Analitika uchun bu hamma narsani o‘zgartiradi:

- 50 ta ustundan 3 tasi kerak bo‘lgan so‘rov **diskdan faqat shu 3 tasini o‘qiydi**.
- Bitta ustundagi qiymatlar bir-biriga o‘xshash, shuning uchun **juda yaxshi siqiladi**.
- Qayta ishlash qiymatlar to‘plami bilan bajariladi (vektorli bajarish), protsessor samarali ishlatiladi.

Siqish har bir ustun uchun alohida sozlanadi. Standart — LZ4; ZSTD kuchliroq siqadi, `Delta`, `DoubleDelta` yoki `Gorilla` kabi maxsus kodeklar esa vaqt belgilari va metrikalar bilan yordam beradi.

## MergeTree: asosiy jadval dvijogi

ClickHouse dagi jadvallarning aksariyati **MergeTree** oilasidagi dvijoklardan foydalanadi:

- Har bir qo‘shish diskda o‘zgarmas **bo‘lak (part)** yaratadi; fon jarayonlari bo‘laklarni kattaroqlariga **birlashtiradi**.
- `ORDER BY` ma’lumotlarning saralanishini belgilaydi va **siyrak birlamchi indeks** quradi — u har bir qatorga emas, qatorlar bloklariga (granulalarga) ishora qiladi.
- `PARTITION BY` ma’lumotlarni, odatda oy yoki kun bo‘yicha bo‘ladi, shunda eski partitsiyalarni o‘chirish oson.

Maxsus variantlar odatiy vazifalarni hal qiladi: **ReplacingMergeTree** (qatorning oxirgi versiyasini qoldiradi), **SummingMergeTree** va **AggregatingMergeTree** (birlashtirishda oldindan agregatsiya), shuningdek replikatsiya uchun **Replicated** versiyalar.

```sql
CREATE TABLE events
(
    event_time DateTime,
    user_id    UInt64,
    event_type LowCardinality(String),
    url        String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(event_time)
ORDER BY (event_type, event_time);

SELECT event_type, count() AS events, uniq(user_id) AS users
FROM events
WHERE event_time >= now() - INTERVAL 7 DAY
GROUP BY event_type
ORDER BY events DESC;
```

## Odatiy vazifalar

- **Mahsulot va veb-analitika**: kliklar, ko‘rishlar, voronkalar, foydalanuvchilarni ushlab qolish.
- Ilova va servislarning **hodisalar loglari**.
- **Observability**: katta hajmdagi loglar, metrikalar va trassirovkalar.
- **Reklama va marketing**: ko‘rsatishlar, atributsiya, kampaniyalar bo‘yicha hisobotlar.
- Uzoq tarix ustida ham tez qolishi kerak bo‘lgan BI vositalaridagi **biznes-dashbordlar**.

Umumiy belgi: faqat qo‘shiladigan ko‘plab hodisalar, kam o‘zgarishlar va ko‘p qatorlarni agregatsiya qiladigan so‘rovlar.

## ClickHouse va PostgreSQL

| | PostgreSQL | ClickHouse |
|---|---|---|
| Saqlash | Qatorlar bo‘yicha | Ustunlar bo‘yicha |
| Kuchli tomoni | Tranzaksiyalar, nuqtaviy tanlash, yangilash | Katta jadvallar bo‘yicha agregatsiya |
| Yangilash va o‘chirish | Arzon, odatiy amal | Og‘ir amallar, muntazam qilmagan ma’qul |
| Qo‘shish | Bittadan qator ham bo‘ladi | Katta to‘plamlar bilan yaxshiroq |
| Tranzaksiyalar | To‘liq ACID | Cheklangan |
| Odatiy roli | Ilovaning asosiy bazasi | Analitika uchun ombor |

Amalda ko‘plab tizimlar **ikkalasidan** foydalanadi: PostgreSQL mahsulotga xizmat qiladi, hodisalar va biznes-ma’lumotlar nusxalari esa hisobotlar uchun ETL yoki change data capture orqali ClickHouse ga tushadi.

## Ko‘p uchraydigan xatolar

- **Bittadan qator qo‘shish.** Har bir qo‘shish bo‘lak yaratadi va minglab mayda qo‘shishlar birlashtirishni haddan tashqari yuklaydi. To‘plamlarga yig‘ing yoki asinxron qo‘shishdan foydalaning.
- **ORDER BY ni o‘ylamasdan tanlash.** Eng ko‘p filtrlanadigan ustunlarni birinchi qo‘ying.
- Alohida qatorlar tez-tez yangilanadigan **OLTP-baza sifatida ishlatish**.
- **ClickHouse ga juda erta o‘tish.** Agar yaxshi indeksli PostgreSQL hisobotlarni uddalasa, ikkinchi baza hozircha kerak bo‘lmasligi mumkin.

## FAQ

### ClickHouse asosiy baza sifatida PostgreSQL o‘rnini bosa oladimi?

Odatda yo‘q. Unda odatiy ilovaga kerak bo‘ladigan arzon yangilashlar, to‘laqonli tranzaksiyalar va tez nuqtaviy tanlashlar yo‘q. U asosiy baza yonidagi alohida analitik qatlam sifatida eng yaxshi ishlaydi.

### ClickHouse ni qachon qo‘shishga arziydi?

Katta hodisalar jadvallari bo‘yicha analitik so‘rovlar asosiy bazada sekinlashganda yoki uning ishiga ta’sir qila boshlaganda, ma’lumotlar esa asosan yangilanmasdan qo‘shilib borsa.

### Tahlilchilar yangi til o‘rganishi kerakmi?

Yo‘q. ClickHouse analitika uchun qo‘shimcha funksiyalarga ega SQL dan foydalanadi. Ko‘pchilik mashhur BI vositalari, jumladan Metabase va boshqa keng tarqalgan dashbordlar unga ulana oladi.
