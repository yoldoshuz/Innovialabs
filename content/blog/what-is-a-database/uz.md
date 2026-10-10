---
title: Ma’lumotlar bazasi nima va u qanday ishlaydi
description: Ma’lumotlar bazasi oddiy tilda: jadvallar, qatorlar, MBBT, so‘rovlar va saqlash internet-do‘kon hamda CRM misolida, shuningdek bazalarning asosiy turlari.
summary: Ma’lumotlar bazasi — tartiblangan axborot ombori, MBBT esa uni diskka saqlaydigan, so‘rov bo‘yicha keraklisini tez topadigan va ko‘p foydalanuvchi bir vaqtda ishlaganda ma’lumotlar buzilishiga yo‘l qo‘ymaydigan dastur.
---

## Qisqa javob

**Ma’lumotlar bazasi** — bu topish, o‘zgartirish va himoya qilish oson bo‘lishi uchun tartibli saqlanadigan axborot to‘plami. Mijozlar ro‘yxati, mahsulotlar katalogi, buyurtmalar tarixi — deyarli har qanday ilova bunday ma’lumotlarni bazada saqlaydi.

Ikki tushunchani farqlash muhim:

- **Ma’lumotlar bazasi** — ma’lumotlarning o‘zi va ularning tuzilmasi.
- **MBBT** (ma’lumotlar bazasini boshqarish tizimi) — shu ma’lumotlar bilan ishlaydigan dastur: PostgreSQL, MySQL, MongoDB, Redis va boshqalar.

Ilova diskdagi fayllarni to‘g‘ridan-to‘g‘ri o‘qimaydi. U MBBTga **so‘rov** yuboradi — «shu mijozning may oyidagi barcha buyurtmalarini top» — va tayyor javob oladi.

## Nega oddiy Excel jadvali emas

Ma’lumot kam va u bilan bitta odam ishlasa, Excel yetadi. Muammolar quyidagi holatlarda boshlanadi:

- bir vaqtning o‘zida yuzlab foydalanuvchi buyurtma beradi va qoldiqlarni o‘zgartiradi;
- yozuvlar millionlab bo‘ladi, javob esa soniyaning bir qismida kerak;
- to‘lov yechilib, buyurtma yaratilmay qolishiga yo‘l qo‘yib bo‘lmaydi;
- kirish huquqlarini ajratish kerak: menejer o‘z bitimlarini, buxgalter hisob-fakturalarni ko‘radi.

MBBT aynan shu vazifalarni hal qiladi: **bir vaqtda kirish**, **qidiruv tezligi**, **yaxlitlik** va **kirish huquqlari**.

## Jadvallar, qatorlar va ustunlar

Eng keng tarqalgan tur — **relyatsion** bazalar. Ularda ma’lumotlar Excel varaqlariga o‘xshash, lekin qat’iy qoidalarga bo‘ysunadigan jadvallarda saqlanadi.

Internet-do‘konni olaylik:

| id | name | email | city |
|----|------|-------|------|
| 1 | Aliya | aliya@example.com | Toshkent |
| 2 | Bobur | bobur@example.com | Samarqand |

- **Jadval** (`customers`) bir turdagi obyektlarni — mijozlarni tasvirlaydi.
- **Qator** (yozuv) — bitta aniq mijoz.
- **Ustun** (maydon) — bitta xususiyat: ism, email, shahar. Har bir ustunning turi bor: son, matn, sana.
- **Birlamchi kalit** (`id`) — qatorni aniq topish mumkin bo‘lgan noyob raqam.

Buyurtmalar alohida `orders` jadvalida saqlanadi va har bir buyurtmada `customer_id` maydoni — mijozga havola bor. Bu jadvallar orasidagi **bog‘lanish**. Shuning uchun mijoz ma’lumotlari har bir buyurtmaga ko‘chirilmaydi, bir marta yoziladi.

CRMda ham mantiq xuddi shunday: `contacts`, `deals`, `tasks` jadvallari kalitlar orqali bog‘langan.

## So‘rov qanday ishlaydi

Relyatsion bazalarga so‘rovlar **SQL** tilida yoziladi:

```sql
SELECT name, email
FROM customers
WHERE city = 'Toshkent';
```

Ichkarida nima bo‘ladi:

1. MBBT so‘rovni tahlil qiladi va jadval hamda ustunlar mavjudligini tekshiradi.
2. **Rejalashtiruvchi** eng tez usulni tanlaydi: butun jadvalni o‘qish yoki indeksdan foydalanish.
3. Ma’lumotlar xotiradan yoki diskdan o‘qiladi, filtrlanadi va ilovaga qaytariladi.

**Indeks** kitob oxiridagi alifbo ko‘rsatkichi kabi ishlaydi: barcha qatorlarni ko‘rib chiqish o‘rniga MBBT keraklilarini darhol topadi. Indekssiz katta jadvallar sekinlasha boshlaydi.

## Ma’lumotlar qanday saqlanadi va yo‘qolmaydi

- Ma’lumotlar diskdagi fayllarda turadi, tez-tez ishlatiladigan qismlari esa operativ xotirada keshlanadi.
- O‘zgarishlar avval **jurnalga** (WAL) yoziladi, shuning uchun elektr uzilishidan keyin baza tiklanadi.
- **Tranzaksiya** bir nechta amalni bittaga birlashtiradi: «pulni yechish va buyurtma yaratish» to‘liq bajariladi yoki umuman bajarilmaydi.
- **Zaxira nusxalar** va **replikatsiya** (bazaning boshqa serverdagi nusxasi) disk yoki server yo‘qolishidan himoya qiladi.

## Ma’lumotlar bazalarining asosiy turlari

| Tur | Ma’lumotni qanday saqlaydi | Misollar | Qachon mos |
|-----|---------------------------|----------|------------|
| Relyatsion (SQL) | Bog‘langan jadvallar | PostgreSQL, MySQL | Buyurtmalar, to‘lovlar, CRM, aksariyat biznes-tizimlar |
| Hujjatli | JSONga o‘xshash hujjatlar | MongoDB | Moslashuvchan tuzilma, kataloglar, kontent |
| Kalit-qiymat | «Kalit → qiymat» juftliklari | Redis | Kesh, sessiyalar, navbatlar |
| Ustunli | Ma’lumot ustunlar bo‘yicha | ClickHouse | Katta hajmdagi analitika |
| Grafli | Tugunlar va bog‘lanishlar | Neo4j | Ijtimoiy tarmoqlar, tavsiyalar |
| Qidiruv | Teskari indeks | Elasticsearch | To‘liq matnli qidiruv |

Aksariyat loyihalar bitta relyatsion bazadan boshlaydi va boshqalarini faqat aniq vazifa paydo bo‘lganda qo‘shadi — masalan, kesh uchun Redis.

## Yangi boshlovchilarning keng tarqalgan xatolari

- Hamma narsani takrorlanuvchi ma’lumotli bitta ulkan jadvalda saqlash.
- Turlar va cheklovlarni belgilamaslik — keyin «sana» maydonida matn paydo bo‘ladi.
- Zaxira nusxalarni birinchi ma’lumot yo‘qotilgandan keyingina sozlash.
- Vazifaga mosini emas, modadagi bazani tanlash.

## FAQ

### Ma’lumotlar bazasi MBBTdan nimasi bilan farq qiladi?

Ma’lumotlar bazasi — ma’lumotlarning o‘zi va tuzilmasi. MBBT — ularni saqlaydigan, so‘rovlarni bajaradigan va yaxlitlikni kuzatadigan dastur. Kundalik nutqda PostgreSQLni ham «baza» deyishadi, bu normal holat.

### Bazadan foydalanish uchun SQLni bilish kerakmi?

Ilova foydalanuvchisiga kerak emas — u interfeys orqali ishlaydi. Dasturchi, analitik va hisobot tuzadiganlar uchun asosiy SQL juda foydali: bu aksariyat bazalar uchun umumiy til.

### Kichik loyiha uchun qaysi bazani tanlash kerak?

Sayt, do‘kon yoki CRM uchun odatda bitta relyatsion baza — PostgreSQL yoki MySQL yetarli. Boshqa turlarni oldindan emas, aniq ehtiyoj paydo bo‘lganda qo‘shgan ma’qul.
