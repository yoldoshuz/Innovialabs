---
title: Biznes dashbordlar uchun Metabase’ni qanday sozlash
description: Metabase’ni Docker’da o‘rnatish, bazani faqat o‘qish huquqli foydalanuvchi orqali ulash, savollar, dashbordlar, huquqlar va pochtaga muntazam hisobotlar.
summary: Metabase’ni xizmat ma’lumotlari uchun alohida PostgreSQL bilan Docker’da ishga tushiring, bazani faqat o‘qish huquqli foydalanuvchi orqali ulang, savollarni dashbordlarga yig‘ing, kirishni guruhlar bilan cheklang va hisobotlarni jadval bo‘yicha yuboring.
---

## Nimaga ega bo‘lasiz

**Metabase** — open-source BI vositasi: menejerlar vizual konstruktor orqali ma’lumotlarga savol beradi, analitiklar SQL yozadi, natijalar esa grafik va dashbordlarga aylanadi. Asosiy sozlash bir necha qadamdan iborat: konteynerni ishga tushirish, bazani xavfsiz ulash, birinchi dashbordni yig‘ish, huquqlar va obunalarni sozlash.

## 1-qadam. Docker’da o‘rnatish

Tezkor sinov uchun bitta buyruq yetarli:

```bash
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

Standart holatda Metabase o‘z sozlamalari, foydalanuvchilari va dashbordlarini ichki H2 faylida saqlaydi — production uchun bu **tavsiya etilmaydi**. Haqiqiy ish uchun unga alohida PostgreSQL xizmat bazasini bering:

```yaml
services:
  metabase:
    image: metabase/metabase
    ports:
      - "3000:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: metabase-db
      MB_DB_PORT: 5432
      MB_DB_DBNAME: metabase
      MB_DB_USER: metabase
      MB_DB_PASS: ${METABASE_DB_PASSWORD}
      JAVA_TIMEZONE: Asia/Tashkent
    depends_on:
      - metabase-db
  metabase-db:
    image: postgres:16
    environment:
      POSTGRES_DB: metabase
      POSTGRES_USER: metabase
      POSTGRES_PASSWORD: ${METABASE_DB_PASSWORD}
    volumes:
      - metabase-db-data:/var/lib/postgresql/data
volumes:
  metabase-db-data:
```

So‘ng uni HTTPS’li reverse proxy ortiga qo‘ying, saytni oching va birinchi administratorni yarating. Xizmat bazasining backup’ini oling: unda barcha savollar va dashbordlaringiz saqlanadi. Obrazni aniq versiyaga bog‘lang va ongli ravishda yangilang.

## 2-qadam. Faqat o‘qish huquqli foydalanuvchi

Metabase’ni hech qachon baza egasi nomidan ulamang. Faqat o‘qiy oladigan alohida rol yarating:

```sql
CREATE ROLE metabase_ro WITH LOGIN PASSWORD 'use-a-strong-password';
GRANT CONNECT ON DATABASE shop TO metabase_ro;
GRANT USAGE ON SCHEMA public TO metabase_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_ro;
ALTER ROLE metabase_ro SET statement_timeout = '60s';
```

- `ALTER DEFAULT PRIVILEGES` kelajakdagi jadvallarga ham tatbiq etiladi, lekin faqat buyruqni bajargan rol yaratganlariga. Uni migratsiyalar ishlaydigan rol nomidan bajaring.
- `statement_timeout` og‘ir so‘rov bazani osib qo‘yishiga yo‘l qo‘ymaydi.
- Yana yaxshisi — **o‘qish uchun replikaga** ulanish, shunda hisobotlar ilova bilan raqobatlashmaydi.
- Shaxsiy va maxfiy ma’lumotli jadvallarni (parol xeshlari, tokenlar) yashiring yoki ularga umuman kirish bermang.

Metabase’da **Admin settings → Databases → Add database** bo‘limini oching va host hamda faqat o‘qish huquqli foydalanuvchi ma’lumotlarini kiriting. Lokalizatsiya sozlamalarida hisobotlar vaqt mintaqasini tekshiring, shunda «bugun» hamma uchun bir xil kunni bildiradi.

## 3-qadam. Savollar va dashbordlar

- **Savol (question)** — bitta so‘rov: vizual konstruktor orqali (filtr, agregatsiya, guruhlash) yoki SQL’da.
- **Model** — tozalangan ma’lumotlar to‘plami (masalan, «To‘langan buyurtmalar»), boshqalar savollarni shu asosda quradi; ustunlar nomi va tavsifi tushunarli bo‘ladi.
- **Dashbord** — kerakli ustunlarga bog‘langan umumiy **filtrlar** (davr, shahar, menejer) bilan savollar to‘plami.

Amaliy birinchi dashbord: kunlik tushum, buyurtmalar soni, o‘rtacha chek, top mahsulotlar, holatlar bo‘yicha buyurtmalar. Hamma narsani biznes tilida nomlang va qisqa tavsiflar qo‘shing — shunda raqamlarga ishonishadi.

## 4-qadam. Kirish huquqlari

Metabase kirishni **guruhlar** orqali boshqaradi:

- **Ma’lumotlarga huquqlar** guruh qaysi baza va jadvallarni ko‘rishi va SQL yoza olishini belgilaydi.
- **Kolleksiyalarga huquqlar** saqlangan savol va dashbordlarni kim ko‘rishi yoki tahrirlashi mumkinligini belgilaydi.

Oddiy sxema: analitiklar SQL yozadi; menejerlar faqat tayyorlangan kolleksiyalarni ko‘radi; shaxsiy ma’lumotli xom jadvallarni administratorlardan boshqa hech kim ko‘rmaydi. Standart «All Users» guruhidan ortiqcha huquqlarni olib tashlang — unga har bir foydalanuvchi kiradi. Ba’zi ilg‘or imkoniyatlar, masalan qatorlar darajasidagi cheklovlar, faqat pullik versiyalarda mavjud.

## 5-qadam. Jadval bo‘yicha pochtaga hisobotlar

1. **Admin settings → Email** bo‘limida SMTP’ni sozlang va test xat yuboring.
2. Dashbordni oching, **Subscriptions**ni tanlang, qabul qiluvchilar va jadvalni qo‘shing (masalan, har dushanba ertalab).
3. Alohida savol uchun **alert** sozlang: natijalar paydo bo‘lganda yoki maqsad chizig‘i kesib o‘tilganda Metabase xabar yuboradi.

Umumiy sozlamalarda sayt manzilini ko‘rsating, shunda xatlardagi havolalar to‘g‘ri joyga olib boradi.

## FAQ

### Metabase bepulmi?

Open-source versiyani o‘z serveringizda bepul o‘rnatish mumkin. Pullik tariflar bulutli versiya va qatorlar darajasidagi huquqlar, kengaytirilgan SSO kabi ilg‘or funksiyalarni qo‘shadi.

### Metabase ishchi bazani sekinlashtirmaydimi?

Og‘ir dashbordlar sekinlashtirishi mumkin. O‘qish uchun replika yoki alohida analitik bazadan foydalaning, so‘rovlar uchun taymaut belgilang va tez-tez ochiladigan dashbordlar uchun natijalarni keshlashni yoqing.

### Metabase, Power BI yoki Looker Studio?

Metabase SQL bazalar ustida o‘z serverida oddiy vosita kerak bo‘lgan jamoalarga mos. Power BI — murakkab ma’lumot modellashtirishli Microsoft ekotizimidagi kompaniyalarga, Looker Studio — asosan Google servislari bilan ishlaydigan jamoalarga.
