---
title: Change Data Capture (CDC) va Debezium: o‘zgarishlarni uzatish
description: Jurnalga asoslangan CDC qanday ishlaydi, Debezium baza o‘zgarishlarini Kafka va boshqa tizimlarga qanday uzatadi va CDC qachon paketli ETL’dan afzal.
summary: Jurnalga asoslangan CDC baza tranzaksiya jurnalini o‘qib, har bir qo‘shish, yangilash va o‘chirishni hodisaga aylantiradi; Debezium buni PostgreSQL, MySQL va boshqalar uchun bajarib, hodisalarni Kafka’ga yuboradi, shu bois ombor, qidiruv indeksi va kesh keyingi paketli ishga tushirishni kutmasdan soniyalarda sinxronlanadi.
---

## Qisqa javob

**Change Data Capture (CDC)** — bazadagi har bir o‘zgarishni ushlab, boshqa tizimlarga yetkazish. Eng ishonchli shakli — **jurnalga asoslangan CDC**: u jadvallarga so‘rov yuborish o‘rniga bazaning o‘z tranzaksiya jurnalini, ya’ni replikatsiya uchun ishlatiladigan jurnalni o‘qiydi.

**Debezium** — CDC uchun open-source platforma. U jurnalga ulanadi, qatordagi har bir o‘zgarishni hodisaga aylantiradi va odatda uni **Apache Kafka** ga joylaydi, u yerdan istalgan miqdordagi iste’molchilar o‘qiy oladi.

## O‘zgarishlarni ushlashning uchta usuli

| Yondashuv | Qanday ishlaydi | Zaif tomonlari |
|---|---|---|
| **So‘rovlar** | `WHERE updated_at > last_run` bo‘yicha so‘rash | Jismoniy o‘chirishlarni ko‘rmaydi, ishonchli timestamp’ga bog‘liq, bazani yuklaydi |
| **Triggerlar** | Triggerlar o‘zgarishlarni audit jadvaliga yozadi | Har bir tranzaksiyada qo‘shimcha yozuv, triggerlarni qo‘llab-quvvatlash kerak |
| **Jurnal** | WAL (PostgreSQL) yoki binlog (MySQL) ni o‘qish | Jurnalga kirish va sozlash kerak, komponentlar ko‘proq |

Jurnalga asoslangan CDC **har bir commit qilingan o‘zgarishni, jumladan o‘chirishlarni ham**, commit tartibida ko‘radi va jadvallarning o‘ziga deyarli yuklama qo‘shmaydi.

## Debezium qanday ishlaydi

Debezium ko‘pincha **Kafka Connect’dagi source-konnektor** sifatida ishga tushiriladi. Har bir baza uchun u:

1. Tanlangan jadvallarning ixtiyoriy **boshlang‘ich snapshot**ini oladi.
2. Jurnalni oqim bilan o‘qishga o‘tadi: PostgreSQL’da **mantiqiy replikatsiya sloti** (`pgoutput` plagini), MySQL’da **ROW formatidagi binlog** orqali.
3. Hodisalarni Kafka topiklariga yozadi, odatda har bir jadval uchun `prefix.schema.table` ko‘rinishidagi alohida topik.
4. Qayta ishga tushgandan keyin davom etish uchun o‘z pozitsiyasini (offset) saqlaydi.

Har bir hodisada qatorning o‘zgarishdan **oldingi** va **keyingi** holati, amal turi (`c` yaratish, `u` yangilash, `d` o‘chirish, `r` snapshot o‘qish) hamda manba metama’lumotlari — tranzaksiya va vaqt bor.

PostgreSQL’ni tayyorlash:

```ini
# postgresql.conf
wal_level = logical
```

Kafka Connect’da konnektorni minimal ro‘yxatdan o‘tkazish:

```json
{
  "name": "shop-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "plugin.name": "pgoutput",
    "database.hostname": "db",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "${file:/secrets/db.properties:password}",
    "database.dbname": "shop",
    "topic.prefix": "shop",
    "table.include.list": "public.orders,public.customers"
  }
}
```

Debezium uchun faqat kerakli replikatsiya va o‘qish huquqlariga ega alohida foydalanuvchi yarating.

## O‘zgarishlarni keyingi tizimlarga yetkazish

Hodisalar Kafka’ga tushgach, ularni turli iste’molchilar mustaqil ravishda ishlatishi mumkin:

- **Ma’lumotlar ombori** (ClickHouse, BigQuery, Snowflake va boshqalar) — sink-konnektorlar yoki oqimli ishlov berish orqali.
- **Qidiruv indeksi**, masalan Elasticsearch — mahsulot o‘zgarishi bilanoq yangilanadi.
- Redis’dagi **keshni bekor qilish**.
- Biznes hodisalariga javob beradigan **boshqa mikroservislar**.

Agar Kafka kerak bo‘lmasa, **Debezium Server** hodisalarni to‘g‘ridan-to‘g‘ri boshqa xabar brokerlariga yubora oladi, JVM ilovalari uchun esa o‘rnatiladigan dvigatel bor.

## Omborni sinxronlashda CDC va paketli ETL

| | Paketli ETL | Jurnalga asoslangan CDC |
|---|---|---|
| Yangilik | Keyingi ishga tushirishdan keyin | Deyarli real vaqtda |
| O‘chirishlar | Ko‘pincha yo‘qoladi | Qayd etiladi |
| Manbaga yuklama | Ishga tushirish paytida og‘ir so‘rovlar | Jurnalni o‘qish |
| Murakkablik | Past: rejalashtiruvchi va SQL | Yuqoriroq: Kafka, konnektorlar, monitoring |
| O‘zgarishlar tarixi | Faqat yakuniy holat | Har bir oraliq o‘zgarish |

Agar kuniga yoki soatiga bir marta yangilanish yetarli bo‘lsa, ma’lumot hajmi o‘rtacha bo‘lsa va jamoada oqimli infratuzilma bo‘lmasa, paketli ETL hamon yaxshi tanlov. CDC hisobotlar yangi bo‘lishi kerak bo‘lganda, jadvallar katta bo‘lganda yoki bir xil o‘zgarishlar bir nechta tizimga kerak bo‘lganda o‘zini oqlaydi.

## E’tibor berish kerak bo‘lgan joylar

- **Replikatsiya slotlari WAL’ni ushlab turadi.** Konnektor to‘xtasa, PostgreSQL slot uchun WAL’ni saqlaydi va disk to‘lib qolishi mumkin. Slot kechikishini kuzating va alert sozlang.
- **At-least-once yetkazish.** Nosozliklardan keyin hodisalar takrorlanishi mumkin. Iste’molchilarni **idempotent** qiling, masalan primary key bo‘yicha upsert.
- **Sxema o‘zgarishlarini** iste’molchilar qayta ishlashi kerak; schema registry’ni ko‘rib chiqing.
- **Tartib** global emas, kalit (Kafka partitsiyasi) doirasida kafolatlanadi.
- **Ichki jadvallar tuzilmani oshkor qiladi.** Boshqa servislar uchun mo‘ljallangan hodisalarda **outbox patterni** (CDC ushlaydigan alohida hodisalar jadvali) barqaror kontrakt beradi.

## FAQ

### Debezium uchun Kafka albatta kerakmi?

Yo‘q, lekin Kafka Connect eng keng tarqalgan sxema. Debezium Server va o‘rnatiladigan dvigatel hodisalarni Kafka’siz boshqa tizimlarga yetkazish imkonini beradi.

### CDC bazani sekinlashtiradimi?

Jurnalni o‘qish so‘rovlar bilan tekshirishdan yengilroq, lekin mantiqiy dekodlash baribir CPU sarflaydi, replikatsiya sloti esa iste’molchi orqada qolganda WAL’ni ushlab turadi. Ikkala ko‘rsatkichni ham kuzating.

### CDC backup’ning o‘rnini bosa oladimi?

Yo‘q. CDC o‘zgarishlarni, jumladan xatolarni ham, boshqa tizimlarga uzatadi. Backup’lar va vaqt nuqtasiga tiklash baribir kerak. Muayyan konnektorlarni sozlash [Debezium hujjatlarida](https://debezium.io/documentation/) yoritilgan.
