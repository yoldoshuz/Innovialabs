---
title: MongoDB’da sxema loyihalash: joylash yoki havola
description: MongoDB’da foydalanuvchilar, mahsulotlar va buyurtmalarni qanday modellash: qachon joylash, qachon havola qilish, cheksiz massivlardan qochish va indekslar.
summary: Birga o‘qiladigan va hajmi cheklangan ma’lumotlarni hujjat ichiga joylang, umumiy, katta yoki cheksiz o‘sadigan ma’lumotlarga havola qiling, sxemani esa eng ko‘p bajariladigan so‘rovlar atrofida quring.
---

## Qoida bitta xatboshida

MongoDB’da sxema abstrakt obyektlar atrofida emas, **ilova ma’lumotlarni qanday o‘qishi va yozishi** atrofida loyihalanadi. Ma’lumot ota hujjat bilan birga o‘qilsa, faqat unga tegishli bo‘lsa va kichik bo‘lib qolsa, uni hujjat ichiga **joylang** (embedding). Ma’lumot ko‘p hujjatlar uchun umumiy bo‘lsa, mustaqil o‘zgarsa, katta bo‘lsa yoki cheksiz o‘sishi mumkin bo‘lsa, unga `_id` orqali **havola qiling** (referencing).

## Joylash va havola: taqqoslash

| Savol | Joylash | Havola |
|---|---|---|
| Ota hujjat bilan birga o‘qiladimi? | Deyarli doim | Ko‘pincha alohida |
| Bitta ota hujjatga tegishlimi? | Ha | Ko‘pchilik foydalanadi |
| Hajmi cheklanganmi? | Kichik, chegarasi bor | Vaqt o‘tishi bilan o‘sadi |
| Mustaqil o‘zgaradimi? | Kamdan-kam | Tez-tez |
| Voqea paytidagi holat kerakmi? | Ha, nusxasini joylaymiz | — |

Hujjat hajmining qat’iy limitini — 16 MB — yodda tuting. Unga yetmasdan ancha oldin katta hujjatlar har bir o‘qish va yangilashni sekinlashtiradi.

## Model: foydalanuvchilar, mahsulotlar, buyurtmalar

### Foydalanuvchilar

Manzillar va bildirishnoma sozlamalari kam va doim profil bilan birga o‘qiladi — joylaymiz.

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  name: "Aziza",
  addresses: [
    { label: "home", city: "Tashkent", street: "..." }
  ],
  settings: { language: "uz", notifications: true }
}
```

Buyurtmalarni foydalanuvchi ichiga joylamaymiz: ularning soni cheksiz o‘sadi.

### Mahsulotlar

Mahsulotdan ko‘plab buyurtmalar va savatlar foydalanadi, shuning uchun u alohida kolleksiyada turadi. Kategoriyaga qarab o‘zgaradigan xususiyatlarni ichki obyektda saqlash qulay.

```javascript
{
  _id: ObjectId("..."),
  sku: "TSHIRT-001",
  title: "Futbolka",
  price: 120000,
  categoryId: ObjectId("..."),
  attributes: { size: ["S", "M", "L"], color: "black" },
  stock: 42
}
```

### Buyurtmalar

Buyurtma foydalanuvchiga havola qiladi, lekin pozitsiyalarning **xarid paytidagi holatini joylaydi**: nomi va narxi. Ertaga mahsulot narxi o‘zgarsa, eski buyurtma o‘zgarmasligi kerak.

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  status: "paid",
  createdAt: ISODate("..."),
  items: [
    { productId: ObjectId("..."), title: "Futbolka", price: 120000, qty: 2 }
  ],
  total: 240000,
  shipping: { city: "Tashkent", street: "..." }
}
```

Bu **extended reference** patterni: bog‘lanish uchun `_id` saqlanadi va ko‘rsatish uchun kerakli bir nechta maydon nusxalanadi.

## Cheksiz massivlardan qoching

Chegarasiz o‘sadigan massiv — postdagi barcha izohlar, qurilmaning barcha hodisalari, foydalanuvchining barcha buyurtmalari — MongoDB’dagi eng ko‘p uchraydigan xato. Bu ulkan hujjatlar, sekin yangilanishlar va hajm limitiga yetib qolish xavfiga olib keladi.

Uning o‘rniga:

- **Ota hujjatga havolali alohida kolleksiya**: `postId` maydoni va unga indeksli `comments`.
- **Subset patterni**: faqat oxirgi bir nechta elementni (masalan, yangi sharhlarni) joylaymiz, to‘liq ro‘yxat esa alohida saqlanadi.
- Vaqt qatorlari uchun **bucket patterni**: hodisalarni har bir qurilma uchun soatlik yoki kunlik bitta hujjatga guruhlaymiz.

## Murojaat stsenariylari uchun indekslar

Avval asosiy so‘rovlarni yozib chiqing, keyin ular uchun indeks yarating.

```javascript
db.orders.createIndex({ userId: 1, createdAt: -1 })  // foydalanuvchi buyurtmalari tarixi
db.orders.createIndex({ status: 1, createdAt: -1 })  // admin panelda holat bo‘yicha ro‘yxat
db.products.createIndex({ sku: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

Amaliy qoidalar:

- Tarkibiy indekslarda **ESR** tartibiga rioya qiling: aniq moslik maydonlari (Equality), keyin saralash (Sort), keyin oraliq (Range).
- Massivlar bo‘yicha indekslar (multikey) ishlaydi, lekin katta massivlar ularni og‘irlashtiradi.
- So‘rovlarni `explain("executionStats")` orqali tekshiring: `COLLSCAN` emas, `IXSCAN` bo‘lishi kerak.
- Har bir indeks yozishni sekinlashtiradi va xotira egallaydi — ishlatilmaydiganlarini o‘chiring.

## Ko‘p uchraydigan xatolar

- Relyatsion sxemani aynan ko‘chirish va JOIN’ni ko‘plab `$lookup` orqali taqlid qilish.
- Umumiy ma’lumotlarni (masalan, butun mahsulotni) hamma joyga joylash, keyin minglab nusxalarni yangilashga majbur bo‘lish.
- Pulni butun sonlarda minimal birlikda yoki `Decimal128` o‘rniga suzuvchi nuqtali sonlarda saqlash.
- Validatsiyadan voz kechish: MongoDB kolleksiyalar uchun `$jsonSchema` validatorlarini qo‘llaydi.

## FAQ

### MongoDB’da JOIN bormi?

Ha, `$lookup` agregatsiya bosqichi orqali. Kamdan-kam so‘rovlar uchun bu normal, lekin o‘qishlarning ko‘pchiligiga birlashtirish kerak bo‘lsa, ma’lumotlar relyatsion bo‘lishi ehtimoli katta va SQL baza yaxshiroq mos keladi.

### Ma’lumotlarni takrorlash qachon joiz?

Takrorlanadigan maydonlar kamdan-kam o‘zgarsa yoki vaqtda qotirilishi kerak bo‘lsa, masalan buyurtmadagi mahsulot nomi va narxi. Manba o‘zgarsa, nusxalarni qanday yangilashni oldindan o‘ylab qo‘ying.

### Moslashuvchanlik uchun barcha bog‘lanishlarni havola qilsa bo‘ladimi?

Yo‘q. Hammasi havolada bo‘lsa, har bir ekran bir nechta so‘rovga aylanadi. Ilovaning eng ko‘p bajariladigan so‘rovlaridan kelib chiqing va ortiqcha o‘qishlarni xavfsiz olib tashlaydigan joylarda joylang.
