---
title: Ma’lumotlar ombori (DWH) nima va u biznesga nega kerak
description: Ma’lumotlar ombori CRM, buxgalteriya, sayt va reklamani qanday birlashtiradi, yulduz va qorparcha sxemalari, BigQuery, Snowflake va ClickHouse farqi.
summary: Ma’lumotlar ombori (DWH) — tahlil uchun alohida baza bo‘lib, unga CRM, buxgalteriya, sayt va reklamadan ma’lumotlar muntazam yig‘iladi va biznes savollariga yagona, tekshirilgan raqamlar asosida javob beriladi.
---

## DWH oddiy so‘zlar bilan

**Ma’lumotlar ombori (Data Warehouse, DWH)** — ilova ishlashi uchun emas, tahlil uchun yaratilgan baza. Unga kompaniyaning turli tizimlaridan ma’lumotlar jadval bo‘yicha tushadi, umumiy ko‘rinishga keltiriladi va tarixi bilan saqlanadi.

DWH bo‘lmasa, holat odatda shunday: sotuvlar CRM’da, to‘lovlar 1C yoki boshqa hisob tizimida, arizalar sayt bazasida, xarajatlar reklama kabinetlarida. Muayyan kanaldan kelgan mijoz qanchaga tushganini bilish uchun kimdir to‘rtta jadvalni Excel’ga yuklab, qo‘lda birlashtiradi. Har safar boshqacha va xatolar bilan.

DWH buni quyidagicha hal qiladi:

- **Yagona haqiqat manbai** — tushum, mijozlar va buyurtmalar barcha hisobotlarda bir xil hisoblanadi.
- **Tarix** — CRM’dagi bitim statuslari qayta yozilgan bo‘lsa ham, davrlarni solishtirish mumkin.
- **Tizimlar o‘rtasidagi bog‘lanish** — reklama bosilishi, ariza, bitim va to‘lov bitta zanjirga ulanadi.
- **Ishchi tizimlarga yuk yo‘q** — og‘ir hisobotlar CRM va saytni sekinlashtirmaydi.

## Ma’lumotlar omborga qanday tushadi

Odatiy sxema:

1. **Manbalar**: CRM (amoCRM, Bitrix24), hisob tizimi, sayt yoki ilova bazasi, Google Analytics, Yandex Metrika, reklama kabinetlari.
2. **Yuklash**: konnektorlar yoki skriptlar ma’lumotlarni API yoki bazalardan oladi, odatda soatiga yoki kuniga bir marta.
3. **DWH ichidagi qatlamlar**: xom ma’lumotlar, keyin tozalangan va bog‘langanlari, keyin hisobotlar uchun tayyor vitrinalar.
4. **Foydalanish**: BI-dashbordlar, moliya uchun eksportlar, prognoz modellari.

Asosiy ish yuklashda emas, **ta’riflarni kelishishda**: «mijoz», «bitim», «tushum» deb nimani hisoblaymiz. Agar bo‘limlar buni turlicha tushunsa, ombor chalkashlikni faqat tezlashtiradi.

## «Yulduz» va «qorparcha» sxemalari

DWH’dagi ma’lumotlar odatda **faktlar jadvallari** va **o‘lchovlar jadvallari**ga ajratiladi.

- **Faktlar** — raqamli hodisalar: sotuv, to‘lov, bosish, tashrif. Qatorlar ko‘p, asosan qo‘shilib boradi.
- **O‘lchovlar** — kontekst: mijoz, mahsulot, menejer, sana, kanal.

**Yulduz (star schema)**: markazda faktlar jadvali, atrofida o‘lchovlar, har biri bitta jadval. So‘rovlar sodda, birlashtirishlar kam, BI-vositalar bunday model bilan oson ishlaydi.

**Qorparcha (snowflake schema)**: o‘lchovlar qo‘shimcha normallashtiriladi. Masalan, «mahsulot» «kategoriya»ga, u esa «guruh»ga havola qiladi. Takrorlanish kamroq, lekin so‘rovlarda birlashtirishlar ko‘proq.

```sql
-- «Yulduz» sxemasida bir oy uchun kanallar bo‘yicha tushum
SELECT c.channel, SUM(f.amount) AS revenue
FROM fact_sales f
JOIN dim_channel c ON c.channel_id = f.channel_id
JOIN dim_date d ON d.date_id = f.date_id
WHERE d.year = 2026 AND d.month = 9
GROUP BY c.channel;
```

Amalda tahlil uchun ko‘proq «yulduz» tanlanadi: ustunli bazalarda saqlash arzon, so‘rovlarning soddaligi esa joyni tejashdan muhimroq.

## Mashhur variantlar

| Yechim | Model | Qachon mos keladi |
|---|---|---|
| **Google BigQuery** | Serversiz bulut xizmati, saqlash va so‘rovlar qayta ishlagan ma’lumotlar uchun to‘lov | Google Cloud, GA4 yoki Looker Studio’dan foydalanasiz va serverlarni boshqarishni xohlamaysiz |
| **Snowflake** | Saqlash va hisoblash alohida to‘lanadigan bulut platformasi, AWS, Azure va GCP’da ishlaydi | Ko‘p jamoa va yuklamalar, resurslarni alohida ajratish kerak |
| **ClickHouse** | Ochiq kodli ustunli MBBT, o‘z serveringizda yoki bulut versiyasida | Hodisalar hajmi katta, tezkor javob va infratuzilma ustidan nazorat kerak |

Kichik hajmlar uchun **PostgreSQL**’ning alohida tahliliy replikasi ko‘pincha xuddi shunday yaxshi ishlaydi va soddaroq.

## DWH kerakligini qanday bilish mumkin

- Hisobotlar bir nechta tizimdan qo‘lda yig‘iladi va doim bir-biriga mos kelmaydi.
- Reklamadan to‘lovgacha bo‘lgan uchidan-uchigacha (end-to-end) tahlil kerak.
- Tahliliy so‘rovlar ishchi bazani sekinlashtiradi.
- Rahbariyat tarixni ko‘rmoqchi, tizimlar esa faqat joriy holatni saqlaydi.

Ko‘p uchraydigan xatolar: savollar ro‘yxatidan emas, texnologiya tanlashdan boshlash, ma’lumot egasisiz «hamma narsani» yuklash, yuklashlar sifatini kuzatmaslik. 3–5 ta asosiy ko‘rsatkich va ular uchun kerakli manbalardan boshlang.

## FAQ

### DWH o‘rniga oddiy bazadan foydalansa bo‘ladimi?

Ha, boshida bo‘ladi. Hisobotlar uchun alohida sxemaga ega PostgreSQL yoki MySQL replikasi ko‘p vazifalarni yopadi. Tarixiy ma’lumotlar bo‘yicha so‘rovlar sekinlasha boshlaganda ustunli omborga o‘tish mantiqiy.

### Ma’lumotlar ombori qancha turadi?

Narx ma’lumotlar hajmi, yangilanish chastotasi, manbalar soni va foydalanuvchilar qancha so‘rov bajarishiga bog‘liq. Bulut xizmatlarida asosiy xarajat odatda so‘rovlar uchun hisoblash, shuning uchun vitrinalarni to‘g‘ri loyihalash muhim.

### DWH BI’dan nimasi bilan farq qiladi?

DWH ma’lumotlarni saqlaydi va tayyorlaydi, BI-vosita esa ularni hisobot va dashbordlar ko‘rinishida ko‘rsatadi. Odatda ular juftlikda ishlaydi.
