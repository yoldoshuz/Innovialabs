---
title: SQLite nima va qachon u yetarli bo‘ladi
description: SQLite butun bazani ilova ichidagi bitta faylda saqlaydi. U qayerda ideal, parallel yozuvda qayerda cheklanadi va qachon server bazasiga o‘tish kerak.
summary: SQLite — alohida server talab qilmaydigan, hamma narsani bitta faylda saqlaydigan kutubxona ko‘rinishidagi to‘laqonli SQL-baza. Ma’lumotlar bilan bitta mashina ishlasa va yozuvlar ko‘p bo‘lmasa, u yetarli; bir vaqtda ko‘plab jarayonlar yoki serverlar yozishi kerak bo‘lsa, PostgreSQL yoki MySQL ga o‘tish vaqti keldi.
---

## SQLite qisqacha

**SQLite** — alohida server sifatida emas, balki ilovangiz ichidagi kutubxona sifatida ishlaydigan relyatsion ma’lumotlar bazasi. Butun baza — jadvallar, indekslar, ma’lumotlar — diskdagi **bitta oddiy faylda** saqlanadi. O‘rnatish va sozlash kerak emas: demon, foydalanuvchilar va portlar yo‘q. Ilova faylni ochadi va SQL so‘rovlarini bajaradi.

Shu bilan birga bu jiddiy dvijok: **ACID** kafolatli tranzaksiyalar, indekslar, view’lar, triggerlar, JSON funksiyalari va standart SQL ning katta qismi mavjud.

## O‘rnatilgan model qanday ishlaydi

PostgreSQL yoki MySQL da ilova so‘rovlarni tarmoq orqali ma’lumotlarga egalik qiluvchi server jarayoniga yuboradi. SQLite da esa **so‘rovlar dvijogi ilovaning o‘ziga o‘rnatilgan** va faylni bevosita o‘qiydi hamda yozadi.

Bu nima beradi:

- **Administratsiya yo‘q** — alohida ishga tushirish, yangilash va monitoring qilish kerak emas.
- **Tez lokal o‘qish** — har bir so‘rov uchun tarmoq almashinuvi yo‘q.
- **Oson ko‘chirish** — faylni nusxaladingiz, bazani nusxaladingiz.
- **Qulay testlar** — har bir test uchun yangi baza bu yangi fayl yoki xotiradagi baza.

Buning evaziga:

- Faqat fayl turgan **o‘sha mashinadagi** jarayonlar kira oladi.
- **O‘rnatilgan foydalanuvchilar va rollar yo‘q** — faylni o‘qiy oladigan har kim ma’lumotlarni ko‘radi.
- **Bir vaqtda faqat bitta jarayon yoza oladi.** Yozuv bazani bloklaydi, qolganlar kutadi.

## SQLite qayerda to‘g‘ri tanlov

| Holat | Nega mos keladi |
|---|---|
| **Mobil ilovalar** (Android, iOS) | Platformalarga o‘rnatilgan: oflayn ma’lumotlar, kesh, sozlamalar |
| **Desktop dasturlar** | Brauzerlar, muharrirlar va ko‘plab ilovalar ma’lumotlarini SQLite fayllarida saqlaydi |
| **Kichik va o‘rta saytlar** | Bitta server, asosan o‘qish: bloglar, kataloglar, ichki servislar |
| **Prototiplar va MVP** | Bir necha daqiqada start, kerak bo‘lsa keyinroq migratsiya |
| **O‘rnatilgan qurilmalar, IoT** | Ixcham, ishonchli, server jarayonisiz |
| **Ma’lumot almashish** | Bitta fayl — ma’lumotlar to‘plamini uzatish uchun qulay format |

## Yoqib qo‘yish kerak bo‘lgan sozlamalar

Bir nechta `PRAGMA` buyrug‘i SQLite ni real ilovada ancha qulay qiladi:

```sql
PRAGMA journal_mode = WAL;    -- o‘quvchilar endi yozuvni bloklamaydi
PRAGMA busy_timeout = 5000;   -- darhol xato o‘rniga blokni 5 soniyagacha kutish
PRAGMA foreign_keys = ON;     -- tashqi kalitlar standart holatda o‘chiq, har bir ulanish uchun
```

Eng muhimi — **WAL rejimi** (write-ahead logging): o‘quvchilar va yagona yozuvchi bir vaqtda ishlaydi, veb-ilovalardagi «database is locked» xatolarining ko‘pchiligi yo‘qoladi. Turlarni tekshirish kerak bo‘lsa, `STRICT` jadvallarga e’tibor bering — standart holatda SQLite ustun turlariga erkin munosabatda bo‘ladi.

## Server bazasiga o‘tish vaqti kelganining belgilari

SQLite «o‘yinchoq» baza emas, lekin uning real chegaralari bor. PostgreSQL yoki MySQL ga o‘tishni o‘ylab ko‘ring, agar:

- **Bir nechta ilova serveri** bir xil ma’lumotlar bilan ishlashi kerak. Tarmoq diskidagi (NFS, SMB) baza fayli — bloklash muammolari va ma’lumotlar buzilishining ma’lum manbai.
- WAL va busy timeout bilan ham **«database is locked» xatolari** takrorlanadi — bitta yozuvchi endi yetmaydi.
- **Bir vaqtdagi yozuvlar ko‘p**: chatlar, buyurtmalarni qayta ishlash, doimiy qo‘shishlar bo‘ladigan yuklangan API.
- **Kirish huquqlarini ajratish** kerak: alohida foydalanuvchilar, rollar, tahlilchilar uchun faqat o‘qish huquqi.
- **Replikatsiya va nosozlikda avtomatik almashtirish** kerak.
- Og‘ir analitik so‘rovlar asosiy ilovani sekinlashtira boshlaydi.

## Ko‘p uchraydigan xatolar

- Baza faylini bir nechta mashina murojaat qiladigan tarmoq diskida saqlash.
- Har bir kichik so‘rov uchun yangi ulanish ochish va WAL ni yoqmaslik.
- Yozuv paytida faylni nusxalash — izchil nusxa uchun `sqlite3` konsolidagi `.backup` yoki `VACUUM INTO` dan foydalaning.
- `foreign_keys` standart holatda o‘chiq ekanini unutish.

## FAQ

### SQLite ishlayotgan saytni ko‘tara oladimi?

Ha, agar sayt bitta serverda ishlasa va yuklama asosan o‘qishdan iborat bo‘lsa. Ko‘plab kontent saytlari va ichki servislar yillar davomida SQLite da ishlaydi. Qiyinchiliklar bir vaqtdagi yozuvlar ko‘payganda yoki bitta faylga bir nechta server murojaat qilganda boshlanadi.

### Keyinchalik SQLite dan PostgreSQL ga o‘tish qiyinmi?

Bu ancha real, ayniqsa boshidanoq ORM yoki migratsiya vositasidan foydalansangiz. Ma’lumot turlari, sanalar bilan ishlash va SQL dialektidagi farqlarni to‘g‘rilash kerak bo‘ladi, migratsiyaning o‘zini esa avval nusxada sinab ko‘ring.

### SQLite dagi ma’lumotlar qanchalik himoyalangan?

Faylning o‘zida parollar va rollar yo‘q, shuning uchun himoya faylga kirish huquqlari va diskni shifrlashga tayanadi. Baza faylini shifrlash uchun kengaytmalar va maxsus yig‘malar mavjud, lekin server bazalaridagidek kirish huquqlarini ajratish yo‘q.
