---
title: MongoDB nima va undan qachon foydalanish kerak
description: MongoDB oddiy tilda: hujjatlar, kolleksiyalar va BSON, asosiy CRUD amallari, u qachon mos kelishi va qachon relyatsion baza ishonchliroq ekani.
summary: MongoDB — ma’lumotlarni kolleksiyalarda qat’iy sxemasiz JSONga o‘xshash hujjatlar sifatida saqlaydigan hujjatli NoSQL baza. U moslashuvchan va ichma-ich joylashgan ma’lumotlar uchun qulay, bog‘langan moliyaviy va hisob ma’lumotlari uchun esa odatda relyatsion baza ishonchliroq.
---

## MongoDB haqida qisqacha

**MongoDB** — mashhur **hujjatli** ma’lumotlar bazasi. Qatorli jadvallar o‘rniga u **hujjatlarni** — ichki maydonlar va massivlarga ega JSONga o‘xshash obyektlarni saqlaydi. Bu eng taniqli NoSQL tizimlardan biri.

Asosiy g‘oya: ilova birga ishlatadigan ma’lumotlar birga saqlanadi. Barcha xususiyatlari, variantlari va rasmlari bilan mahsulot kartochkasi beshta bog‘langan jadval emas, bitta hujjat bo‘lishi mumkin.

## Hujjatlar, kolleksiyalar va BSON

Relyatsion baza bilan o‘xshatish:

| Relyatsion baza | MongoDB |
|-----------------|---------|
| Ma’lumotlar bazasi | Ma’lumotlar bazasi |
| Jadval | Kolleksiya |
| Qator | Hujjat |
| Ustun | Maydon |
| Birlamchi kalit | `_id` maydoni |

Hujjat namunasi:

```json
{
  "_id": "665f1c2a9b1e8a3f4c2d1a10",
  "name": "Shahar ryukzagi",
  "price": 350000,
  "tags": ["sumkalar", "shahar"],
  "specs": { "volume": 20, "color": "qora" }
}
```

- **Kolleksiya** — hujjatlar guruhi, masalan `products`. Undagi hujjatlar bir xil maydonlar to‘plamiga ega bo‘lishi shart emas.
- **`_id`** — noyob identifikator. Agar uni ko‘rsatmasangiz, MongoDB o‘zi yaratadi (`ObjectId` turida).
- **BSON** (Binary JSON) — MongoDB hujjatlarni diskda saqlaydigan ikkilik format. U matnli JSONga qaraganda tezroq tahlil qilinadi va qo‘shimcha turlarni qo‘llab-quvvatlaydi: sanalar, `ObjectId`, aniq o‘nli sonlar `Decimal128`, ikkilik ma’lumotlar.

## Asosiy CRUD amallari

`mongosh` qobig‘i uchun misollar. Node.js, Python va boshqa tillar drayverlarida metodlar xuddi shunday yoki juda o‘xshash nomlanadi.

```javascript
// Create — hujjat qo‘shish
db.products.insertOne({ name: "Termokrujka", price: 120000, tags: ["idishlar"] })

// Read — hujjatlarni topish
db.products.find({ price: { $lt: 200000 } })
db.products.findOne({ name: "Termokrujka" })

// Update — maydonni o‘zgartirish
db.products.updateOne(
  { name: "Termokrujka" },
  { $set: { price: 110000 } }
)

// Delete — hujjatni o‘chirish
db.products.deleteOne({ name: "Termokrujka" })
```

E’tibor bering: so‘rov shartlari ham hujjat shaklida yoziladi. `$lt` — «kichik», `$set` — «maydon qiymatini o‘rnatish» degani. `$set` kabi operatorlar orqali alohida maydonlarni o‘zgartiradigan `updateOne` bilan hujjatni butunlay almashtiradigan `replaceOne`ni adashtirmang — bu yangi boshlovchilarning keng tarqalgan xatosi.

MongoDBda indekslar SQLdagi kabi muhim: `db.products.createIndex({ price: 1 })` narx bo‘yicha qidiruvni tezlashtiradi.

## MongoDB qachon yaxshi mos keladi

- **Turli-tuman ma’lumotlar.** Kiyim, texnika va mebelning xususiyatlari butunlay farq qiladigan katalog.
- **Butunligicha o‘qiladigan ichki tuzilmalar:** sozlamalari bilan foydalanuvchi profili, kontent bloklaridan iborat maqola.
- **Tezkor prototiplash**, ma’lumotlar tuzilmasi hali o‘zgarib turganda.
- **Hodisalar, loglar, qurilmalardan keladigan ma’lumotlar** — yozuvlar ko‘p, bog‘lanishlar kam.
- **Gorizontal masshtablash** — shardlash orqali, agar hajmlar haqiqatan ham katta bo‘lsa.

## Qachon relyatsion baza ishonchliroq

- **Obyektlar o‘rtasida bog‘lanishlar ko‘p.** Mijozlar, buyurtmalar, mahsulotlar, omborlar, to‘lovlar doimo bir-biriga havola qiladi. MongoDBda kolleksiyalarni birlashtirish uchun `$lookup` bor, lekin bu yerda JOINli SQL tabiiyroq.
- **Pul va hisob.** MongoDB ko‘p hujjatli tranzaksiyalarni qo‘llab-quvvatlaydi, ammo relyatsion bazalarda tranzaksiyalar va yaxlitlik cheklovlari modelning asosi va kutilmagan muammolar kamroq.
- **Ko‘p jadvallar bo‘yicha guruhlashli murakkab hisobotlar.**
- **Qat’iy ma’lumot qoidalari.** MongoDBda sxema validatsiyasini yoqish mumkin, lekin standart holatda baza deyarli har qanday hujjatni qabul qiladi.

## Keng tarqalgan xatolar

- Sxema kerak emas deb hisoblash. U baribir bor — faqat endi uni kod qo‘llab-quvvatlaydi. Validatsiyani yoqing.
- Relyatsion modelni ko‘chirish: o‘nlab kolleksiyalar va doimiy `$lookup`lar.
- Hujjat ichida cheksiz o‘sadigan massivlar, masalan postga yozilgan barcha izohlar. Hujjat hajmi cheklangan, shuning uchun bunday ma’lumotlarni alohida kolleksiyaga chiqargan ma’qul.
- Indekslar va zaxira nusxalarni unutish.

## FAQ

### MongoDB bepulmi?

O‘zingiz o‘rnatishingiz mumkin bo‘lgan bepul Community versiyasi, shuningdek bepul boshlang‘ich darajasi va pullik tariflari bor MongoDB Atlas bulut xizmati mavjud. Litsenziya va tarif shartlarini rasmiy hujjatlarda tekshirgan ma’qul.

### MongoDBni PostgreSQL bilan birga ishlatish mumkinmi?

Ha, bu odatiy amaliyot. Masalan, buyurtmalar va to‘lovlar PostgreSQLda, moslashuvchan xususiyatli katalog yoki hodisalar jurnali esa MongoDBda saqlanadi. Asosiysi, buning uchun real sabab bo‘lsin, chunki har bir baza qo‘llab-quvvatlashni talab qiladi.

### MongoDB mobil ilovalar uchun mos keladimi?

Mobil ilova backend’i uchun server bazasi sifatida — ha, ayniqsa ma’lumotlar hujjatlarga yaxshi tushsa. Ilovaning o‘zi odatda bazaga to‘g‘ridan-to‘g‘ri emas, serverdagi API bilan bog‘lanadi.
