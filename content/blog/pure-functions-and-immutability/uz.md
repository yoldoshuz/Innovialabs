---
title: Toza funksiyalar va immutabellik: oldindan aytsa bo‘ladigan kod
description: Yon ta’sirlar va umumiy o‘zgaruvchan holat qanday xatolarga olib keladi, ularni qanday ajratish va JavaScript, Python, Kotlin’da immutabellikni qo‘llash.
summary: Toza funksiya bir xil ma’lumot uchun bir xil natija qaytaradi va tashqarida hech narsani o‘zgartirmaydi. Toza funksiyalarni o‘zgarmas ma’lumotlar bilan birlashtiring, yon ta’sirlarni chekkaga chiqaring — «qayerdadir nimadir o‘zgarib qoldi» xatolarining ko‘pi yo‘qoladi.
---

## Qisqa javob

**Toza funksiya**ning ikki xususiyati bor:

1. **Bir xil kirish — bir xil chiqish**: u faqat o‘z argumentlariga bog‘liq.
2. **Yon ta’sirlar yo‘q**: u argumentlarni, global o‘zgaruvchilarni, fayllarni, ma’lumotlar bazasini yoki ekranni o‘zgartirmaydi.

**Immutabellik** yaratilgan ma’lumot o‘zgartirilmasligini anglatadi — o‘rniga yangi versiya yaratiladi. Birgalikda ular kodni oldindan aytsa bo‘ladigan qiladi: funksiyani alohida o‘qish, muhit tayyorlamasdan testlash va istalgan joydan xavotirsiz chaqirish mumkin.

## Umumiy o‘zgaruvchan holat qanday xatolarga olib keladi

```javascript
function applyDiscount(cart) {
  cart.items.forEach((item) => {
    item.price = item.price * 0.9;
  });
  return cart;
}

const preview = applyDiscount(cart);
// asl cart ham chegirmali bo‘lib qoldi — qayta chaqirilsa chegirma ikki marta qo‘llanadi
```

Chaqiruvchi kod oldindan ko‘rishni xohlagan edi, lekin asl savat o‘zgarib ketdi. `cart` ga havolasi bor boshqa har qanday komponent endi noto‘g‘ri narxlarni ko‘rsatadi. Bunday xatolarni topish qiyin: ma’lumot o‘zgaradigan joy xato namoyon bo‘ladigan joydan uzoqda.

Muammolarning odatiy manbalari:

- **o‘z argumentlarini o‘zgartiradigan** funksiyalar;
- turli joylardan o‘zgartiriladigan **global yoki modul darajasidagi o‘zgaruvchilar**;
- bir nechta oqim yoki asinxron vazifalar uchun umumiy obyektlar;
- hammaga bitta o‘zgaruvchan obyektni qaytaradigan keshlar va singleton’lar.

## Toza versiya

```javascript
function applyDiscount(cart, rate) {
  return {
    ...cart,
    items: cart.items.map((item) => ({ ...item, price: item.price * (1 - rate) })),
  };
}
```

Asl obyekt tegilmagan, natija faqat `cart` va `rate` ga bog‘liq, qayta chaqiruv bir xil javob beradi.

## Yon ta’sirlarni ajratish

Yon ta’sirlarsiz dastur foydasiz: buyurtmalarni saqlash, xat yuborish, log yozish kerak. Maqsad ularni olib tashlash emas, balki **chekkalarga chiqarish**: yupqa qatlam kirishni o‘qiydi va chiqishni yozadi, toza yadro esa qarorlar qabul qiladi.

```python
# toza yadro: testlash oson
def calculate_invoice(order, tax_rate):
    subtotal = sum(i["price"] * i["qty"] for i in order["items"])
    return {"subtotal": subtotal, "tax": subtotal * tax_rate}

# toza bo‘lmagan qobiq: faqat kiritish-chiqarish
def handle_order(order_id, repo, mailer):
    order = repo.get(order_id)
    invoice = calculate_invoice(order, tax_rate=0.12)
    repo.save_invoice(order_id, invoice)
    mailer.send(order["email"], invoice)
```

Bu yerdagi soliq stavkasi shunchaki argument misoli. `calculate_invoice` dagi biznes-mantiq oddiy ma’lumotlarda testlanadi, mock’lar faqat kichik qobiq uchun kerak.

Yashirin kirishlar ham tozalikni buzadi: **joriy vaqt, tasodifiy sonlar, muhit o‘zgaruvchilari**. Funksiya deterministik bo‘lib qolishi uchun ularni argument sifatida uzating (`now`, `seed`, `config`).

## Tillar bo‘yicha immutabellik usullari

### JavaScript / TypeScript

- Bog‘lanishlar uchun `const` (lekin u obyektning o‘zini muzlatmaydi).
- Spread orqali nusxa olish: `{ ...obj, field: value }`, `[...arr, item]`.
- O‘zgartirmaydigan metodlar: `map`, `filter`, `concat`, `slice`, shuningdek muhitingiz qo‘llab-quvvatlasa yangiroq `toSorted`, `toReversed`, `with`. Esda tuting: `sort`, `reverse` va `splice` massivni o‘zgartiradi.
- Konstantalar uchun `Object.freeze` (muzlatish yuzaki).
- TypeScript’da `readonly` va `Readonly<T>` o‘zgartirishlarni kompilyatsiya bosqichida ushlaydi.

### Python

- O‘zgarmas ma’lumotlar uchun ro‘yxat va to‘plamlar o‘rniga kortejlar va `frozenset`.
- `@dataclass(frozen=True)` o‘zgarmas yozuvlar yaratadi, `dataclasses.replace(obj, field=value)` — o‘zgartirilgan nusxa.
- `def f(items=[])` kabi o‘zgaruvchan standart qiymatlardan qoching — ro‘yxat barcha chaqiruvlar uchun umumiy bo‘ladi.

```python
from dataclasses import dataclass, replace

@dataclass(frozen=True)
class Item:
    name: str
    price: float

cheaper = replace(Item("Pen", 10.0), price=9.0)
```

### Kotlin

- `var` o‘rniga `val`.
- `List`, `Map`, `Set` — faqat o‘qish uchun interfeyslar; `MutableList` faqat kerakli joyda.
- `val` xususiyatli `data class` va yangilash uchun `copy()`.

```kotlin
data class Item(val name: String, val price: Double)

val item = Item("Pen", 10.0)
val cheaper = item.copy(price = 9.0)
```

E’tibor bering: Kotlin’dagi read-only `List` boshqa joydagi o‘zgaruvchan ro‘yxatga tayanishi mumkin. Buni «siz uni o‘zgartira olmaysiz» deb tushuning, «hech kim o‘zgartira olmaydi» deb emas.

## Keng tarqalgan xatolar

- **Yuzaki nusxalar**: yuqori darajadan nusxa oldingiz, lekin ichki obyektni o‘zgartiryapsiz.
- «Toza» mantiq ichiga yashirilgan `Date.now()` yoki `Math.random()`.
- O‘lchamasdan turib qizg‘in sikllarda ulkan tuzilmalardan nusxa olish.
- Bitta funksiya ichidagi lokal o‘zgaruvchan o‘zgaruvchi soddaroq va zararsiz bo‘lgan joyda ham majburan immutabellik: tashqariga chiqmaydigan lokal o‘zgarish funksiyani toza bo‘lmagan qilmaydi.

## FAQ

### Ma’lumotlardan nusxa olish sekinmi?

Kichik obyektlardan nusxa olish arzon, tuzilmaviy bo‘lishishda esa faqat o‘zgargan yo‘l yangi bo‘ladi. Juda katta ma’lumotlar va qizg‘in sikllar uchun avval o‘lchang; persistent ma’lumotlar tuzilmalari kutubxonalari yordam berishi mumkin.

### Butun ilovani toza qilish mumkinmi?

Yo‘q, va bunga hojat ham yo‘q. Haqiqiy dasturlar ma’lumotlar bazasi, foydalanuvchilar va tarmoq bilan ishlaydi. Maqsad — katta toza yadro va kichik, aniq belgilangan yon ta’sirlar qatlami.

### Toza funksiya lokal o‘zgaruvchilardan foydalana olmaydimi?

Foydalana oladi. Funksiyadan tashqariga chiqmaydigan lokal o‘zgaruvchini o‘zgartirish tashqaridagi hech narsaga ta’sir qilmaydi, shuning uchun funksiya toza bo‘lib qoladi.
