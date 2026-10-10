---
title: ETL va ELT: ma’lumotlar konveyerlari qanday ishlaydi
description: Extract, transform va load bosqichlari, nega bulutli omborlar ELT’ni standartga aylantirdi va Airflow, dbt hamda Airbyte qanday vazifalarni bajaradi.
summary: ETL avval ma’lumotlarni o‘zgartirib, keyin omborga yuklaydi, ELT esa avval xom ma’lumotlarni yuklab, ularni ombor ichida o‘zgartiradi. Bulutli DWH’lar uchun ko‘pincha ELT tanlanadi, chunki u yerda hisoblash arzon va masshtablanadi.
---

## Farq qisqacha

**Ma’lumotlar konveyeri (data pipeline)** — ma’lumotlarni manbalardan olib, ular tahlil qilinadigan joyga yetkazadigan avtomatik jarayon. U uch qadamdan iborat:

- **Extract** — CRM, ilova bazasi, reklama tizimlari API’si va fayllardan ma’lumotlarni olish.
- **Transform** — tozalash, turlarni to‘g‘rilash, dublikatlarni olib tashlash, jadvallarni birlashtirish, ko‘rsatkichlarni hisoblash.
- **Load** — natijani ma’lumotlar omboriga yozish.

Yondashuvlar o‘rtasidagi farq qadamlar tartibida:

- **ETL**: oldik → alohida serverda o‘zgartirdik → tayyorini yukladik.
- **ELT**: oldik → boricha yukladik → ombor ichida SQL so‘rovlar bilan o‘zgartirdik.

## Har bir bosqich qanday tuzilgan

**Extract.** Ma’lumotlar to‘liq (full load) yoki faqat oxirgi ishga tushirishdan keyingi o‘zgarishlar (incremental) olinadi. Inkremental yuklash tezroq, lekin ishonchli o‘zgarish belgisini talab qiladi: `updated_at` maydoni, avtoinkrement ID yoki bazaning o‘zgarishlar jurnali (CDC).

**Transform.** Biznes-mantiq shu yerda paydo bo‘ladi: faol mijoz deb kimni hisoblash, valyutalarni qanday qayta hisoblash, arizani to‘lov bilan qanday bog‘lash. Aynan shu bosqich ko‘proq buziladi va testlarni talab qiladi.

**Load.** Ma’lumotlar qo‘shiladi, to‘liq qayta yoziladi yoki kalit bo‘yicha yangilanadi (upsert). Qayta ishga tushirish dublikat yaratmasligi muhim — buni **idempotentlik** deyiladi.

## Nega bulutli omborlar ELT’ni tanladi

Ilgari omborlar qimmat va sekin edi, shuning uchun ma’lumotlar oldindan alohida ETL-serverda tayyorlanib, faqat keragi yuklanardi. BigQuery, Snowflake va ClickHouse kabi bulutli ustunli omborlar hisob-kitobni o‘zgartirdi:

- **Hisoblash masshtablanadi** — og‘ir o‘zgartirish DWH ichida alohida mashinadagidan tezroq bajariladi.
- **Xom ma’lumotlar saqlanadi** — hisoblash mantiqi o‘zgarsa, vitrinalarni manbalardan qayta yuklamasdan qayta qurish mumkin.
- **O‘zgartirishlar — bu SQL** — ularni nafaqat muhandislar, balki tahlilchilar ham yozishi va tekshirishi mumkin.
- **Manbalarni ulash osonroq** — yuklash tayyor konnektorlar uchun odatiy vazifaga aylanadi.

Shu bilan birga ETL eskirmagan. Ma’lumotlarni **yuklashdan oldin tozalash** kerak bo‘lganda u o‘rinli: DWH’da saqlab bo‘lmaydigan shaxsiy ma’lumotlarni olib tashlash yoki yuborishdan oldin hajmni keskin qisqartirish.

## Vositalar

| Vosita | Vazifasi | Qayerda ishlatiladi |
|---|---|---|
| **Airbyte** | Olish va yuklash uchun tayyor konnektorlar (E va L) | ELT: ko‘plab manbalardan omborga ma’lumot ko‘chirish |
| **dbt** | Testlar, hujjatlar va bog‘liqliklarga ega SQL-modellar ko‘rinishidagi o‘zgartirishlar (T) | ELT: DWH ichidagi o‘zgartirishlar qatlami |
| **Apache Airflow** | Orkestrator: vazifalarni jadval bo‘yicha ishga tushiradi, tartib va qayta urinishlarni nazorat qiladi | ETL’da ham, ELT’da ham: butun konveyerni boshqaradi |

Odatiy ELT to‘plami: Airbyte xom jadvallarni yuklaydi, dbt ulardan vitrinalar quradi, Airflow ikkala qadamni to‘g‘ri tartibda ishga tushiradi va xatolar haqida xabar beradi.

dbt modeli — oddiy SQL-fayl:

```sql
-- models/marts/revenue_by_day.sql
SELECT
  DATE(paid_at) AS day,
  SUM(amount)   AS revenue
FROM {{ ref('stg_payments') }}
WHERE status = 'paid'
GROUP BY 1
```

## Yondashuvni qanday tanlash kerak

- **Bulutli DWH va odatiy manbalar** — tayyor konnektorlar bilan ELT.
- **Shaxsiy ma’lumotlarga qat’iy talablar** — ETL yoki yuklash bosqichida maskalash bilan ELT.
- **Bir-ikki manba va kichik hajm** — jadval bo‘yicha ishlaydigan skript yetarli, Airflow’ni keyinroq qo‘shish mumkin.

Ko‘p uchraydigan xatolar: monitoring yo‘q va konveyer bir hafta jimgina ishlamay turadi; biznes-mantiq testsiz skriptlarga tarqalib ketgan; ishga tushirishlar takrorlanuvchan emas va nosozlikdan keyin dublikatlar paydo bo‘ladi.

## FAQ

### Kichik loyiha uchun Airflow kerakmi?

Shart emas. Ikki-uchta vazifa uchun cron yoki konnektorning o‘rnatilgan rejalashtiruvchisi yetarli. Vazifalar ko‘payib, ular o‘rtasida bog‘liqliklar paydo bo‘lganda orkestrator o‘zini oqlaydi.

### ETL va ELT’ni birga qo‘llasa bo‘ladimi?

Ha, bu keng tarqalgan amaliyot. Masalan, shaxsiy ma’lumotlar yuklashdan oldin maskalanadi, asosiy hisob-kitoblar esa ombor ichida bajariladi.

### dbt oddiy SQL-skriptlardan nimasi bilan farq qiladi?

dbt SQL’ga bog‘liqliklar bo‘yicha bajarilish tartibi, ma’lumotlar testlari, hujjatlar va Git’da versiyalashni qo‘shadi. Mantiq SQL’da qoladi, lekin boshqariladigan bo‘ladi.
