---
title: Offline-first ilovalar: ma’lumotlarni lokal saqlash va sinxronlash
description: Offline-first mobil ilova qanday quriladi: SQLite, Room, Core Data va Realm, sinxronlash strategiyalari, ziddiyatlar, so‘rovlar navbati va tarmoq testlari.
summary: Offline-first ilovada interfeys faqat lokal bazadan o‘qiydi va unga yozadi, server bilan sinxronlash esa o‘zgarishlar navbati orqali fonda ishlaydi. Qiyinchilik saqlashda emas, ziddiyatlarni hal qilish va dublikatlarsiz qayta yuborishda.
---

## Offline-first nimani anglatadi

**Offline-first** — interfeys uchun haqiqat manbai **qurilmadagi lokal baza** bo‘lgan arxitektura. Ekran ma’lumotlarni lokal o‘qiydi va yozadi, tarmoqni kutmaydi. Alohida sinxronlash qatlami fonda o‘zgarishlarni serverga yuboradi va yangilarini oladi.

Bu yondashuv odamlar yomon aloqa sharoitida ishlaganda kerak: kuryerlar, savdo vakillari, dala xodimlari, omborlar, eslatma va vazifa ilovalari. Server ma’lumotlarini shunchaki ko‘rsatadigan katalog uchun odatda kesh yetarli.

## Lokal baza: nimani tanlash

| Yechim | Platforma | Qachon mos keladi |
|---|---|---|
| **SQLite** | Hamma joyda | Sxema va so‘rovlar ustidan to‘liq nazorat; GRDB, SQLDelight, drift, sqflite kabi o‘ramlar orqali |
| **Room** | Android | Android uchun standart: kompilyatsiyada so‘rovlarni tekshiradigan va migratsiyali SQLite |
| **Core Data / SwiftData** | iOS | Apple’ning nativ steki, SwiftUI va CloudKit bilan integratsiya |
| **Realm** | iOS, Android, Flutter, React Native | SQL’siz obyekt modeli. MongoDB Atlas Device Sync qo‘llab-quvvatlanishini to‘xtatishini e’lon qildi, shuning uchun Realm uchun sinxronlashni o‘zingiz qurishingiz kerak bo‘ladi |

Flutter’da ko‘pincha **drift** (SQLite asosida), React Native’da SQLite o‘ramlari yoki WatermelonDB tanlanadi.

Bazadan qat’i nazar:

- **sxema migratsiyalarini** birinchi relizdan rejalashtiring — foydalanuvchilarda ma’lumotlarning eski versiyalari bo‘ladi;
- har bir yozuvda **server ID, lokal ID, o‘zgartirilgan vaqt va sinxronlash holatini** saqlang;
- o‘chirishni **yumshoq** (tombstone) qiling, aks holda server yozuv oflayn o‘chirilganini bilmay qoladi.

## Sinxronlash strategiyalari

**O‘zgarishlarni olish (pull):**

- **Delta-sinxronlash**: mijoz kursor yoki oxirgi sinxronlash belgisini yuboradi, server faqat undan keyingi o‘zgarishlarni qaytaradi. Asosiy variant.
- **To‘liq qayta yuklash**: kichik ma’lumotnomalar uchun yoki ma’lumotlar buzilganda zaxira yo‘l sifatida.
- **Signal sifatida push-bildirishnoma**: server «o‘zgarishlar bor» deydi, ilova pull qiladi.

**O‘zgarishlarni yuborish (push)** — **chiquvchi o‘zgarishlar navbati (outbox)** orqali: har bir o‘zgarish avval navbatdagi yozuv bilan birga bazaga saqlanadi, fon ishlovchisi esa navbatni tartib bilan yuboradi.

```sql
CREATE TABLE outbox (
  id TEXT PRIMARY KEY,        -- idempotentlik kaliti (UUID)
  entity TEXT NOT NULL,
  operation TEXT NOT NULL,    -- create | update | delete
  payload TEXT NOT NULL,      -- JSON
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
```

## Dublikatlarsiz so‘rovlar navbati

- Ma’lumotlarga va outbox’ga yozish — **bitta tranzaksiyada**.
- Har bir so‘rov **idempotentlik kalitini** olib boradi: javob yo‘qolib, mijoz qayta yuborsa, server dublikat yaratmaydi.
- Qayta urinishlar **eksponensial kechikish** va urinishlar limiti bilan; limitdan keyin foydalanuvchiga o‘zgarish yuborilmaganini ko‘rsating.
- Fonda yuborish Android’da **WorkManager**, iOS’da **BGTaskScheduler** orqali. Vazifani qachon ishga tushirishni tizim o‘zi hal qiladi, shuning uchun navbatni ilova ochilganda ham yuboring.
- **Bog‘liqliklarni** hisobga oling: oflayn yaratilgan mijozdan oldin buyurtmani yuborib bo‘lmaydi. Tartib bilan yuboring yoki lokal ID’larni uzatib, ularni serverda moslang.

## Ziddiyatlarni hal qilish

Ziddiyat — bitta yozuv sinxronlashdan oldin ikki qurilmada o‘zgartirilganda yuzaga keladi.

| Strategiya | Qanday ishlaydi | Xavf |
|---|---|---|
| **Last-write-wins** | Vaqt bo‘yicha oxirgi o‘zgarish yutadi | Ma’lumotlarning jimgina yo‘qolishi; qurilma soatlari noto‘g‘ri bo‘lishi mumkin |
| **Yozuv versiyalari** | Mijoz versiyani yuboradi, server eskirganini rad etadi | Rad etilgandan keyin nima qilishni hal qilish kerak |
| **Maydonlar bo‘yicha birlashtirish** | O‘zgargan maydonlar birlashtiriladi, ziddiyat faqat bitta maydon tahrirlanganda | Amalga oshirish qiyinroq |
| **CRDT** | Ziddiyatsiz birlashadigan ma’lumotlar tuzilmalari | Murakkab, birgalikda tahrirlash uchun mos |
| **Foydalanuvchi hal qiladi** | Ikkala versiya ko‘rsatiladi | Muhim hujjatlar uchun mos, ziddiyatlar tez-tez bo‘lsa charchatadi |

Ko‘pchilik biznes-ilovalar uchun ishlaydigan sxema — **yozuv versiyalari va maydonlar bo‘yicha birlashtirish**, last-write-wins esa faqat muhim bo‘lmagan ma’lumotlar uchun. Solishtirish uchun vaqtni serverdan olgan ma’qul.

## Yomon tarmoqni qanday sinash

- Sekin aloqa va paketlar yo‘qolishini taqlid qilish uchun iOS’da **Network Link Conditioner** va Android emulyatorining tarmoq sozlamalari.
- Tezlikni cheklash va javoblarni almashtirish uchun Charles yoki Proxyman kabi proksilar.
- Qo‘lda ssenariylar: yuborish o‘rtasida avia rejim, navbat bo‘sh bo‘lmaganda ilovani yopish, ikki qurilmada bitta yozuvni tahrirlash, sinxronlanmagan ma’lumotlar bilan ilovani yangilash.
- Xato qaytaradigan, taymautga tushadigan yoki javobni takrorlaydigan soxta tarmoq bilan sinxronlash qatlamining avtotestlari.

## FAQ

### Har bir ilovani offline-first qilish kerakmi?

Yo‘q. Bu ilova va backend’ni sezilarli murakkablashtiradi. Tarmoqsiz ishlash foydalanuvchilarning haqiqiy ssenariysi bo‘lganda shunday qiling, boshqa hollarda kesh va tushunarli xato xabarlari yetarli.

### Sinxronlash uchun tayyor yechimlar bormi?

Ha, ichki sinxronlashga ega xizmatlar va kutubxonalar bor, masalan oflayn rejimli Firebase Firestore. Ular vaqtni tejaydi, lekin sizni o‘z ma’lumotlar modeli va ziddiyatlarni hal qilish qoidalariga bog‘lab qo‘yadi — ular mantiqingizga mos kelishini tekshiring.

### Ma’lumotlar sinxronlanmaganini foydalanuvchiga qanday ko‘rsatish kerak?

Yozuv yonida yoki ekran sarlavhasida bezovta qilmaydigan indikator va yuborish xatolari uchun alohida ekran qo‘shing. Foydalanuvchi o‘zgarishlar qurilmada saqlangani, lekin hali serverga yetib bormaganini tushunishi kerak.
