---
title: "Toza kod: nomlash va funksiya yozish qoidalari"
description: Toza kodning aniq qoidalari — nomlar, funksiya hajmi, argumentlar, izohlar va erta qaytish — har biri TypeScript da «oldin» va «keyin» misoli bilan.
summary: Toza kod matn kabi o‘qiladi: nomlar nima saqlanishi va nima qilinishini aytadi, funksiyalar qisqa va bitta ish qiladi, argumentlar kam, ichma-ichlik esa erta qaytish bilan olib tashlanadi. Izohlar «nima»ni emas, «nega»ni tushuntiradi.
---

## Asosiy qoida

Kod yozilganidan ko‘ra ancha ko‘p o‘qiladi. Shuning uchun maqsad — boshqa dasturchi (yoki olti oydan keyin siz) kod qismini **ortiqcha kuch sarflamasdan** tushunishi. Quyida qoidalar, har biri «oldin» va «keyin» misoli bilan.

## Nomlar ma’noni ochib beradi

Nom «bu nima va nima uchun» degan savolga izohsiz javob berishi kerak.

```typescript
// Oldin
const d = 30;
const arr = users.filter(u => u.a);

// Keyin
const trialPeriodDays = 30;
const activeUsers = users.filter(user => user.isActive);
```

Amaliy qoidalar:

- **O‘zgaruvchilar — otlar**: `invoice`, `totalAmount`.
- **Funksiyalar — fe’llar**: `calculateTotal`, `sendInvoice`.
- **Mantiqiy qiymatlar — savol**: `isPaid`, `hasAccess`, `canEdit`.
- **Sehrli sonlarsiz**: ularni nomlangan konstantalarga chiqaring.
- **Yagona lug‘at**: loyihada `fetch` ishlatilsa, bir xil narsa uchun `get`, `load` va `retrieve` ni aralashtirmang.
- Nom uzunligi ko‘rinish sohasiga mos: uch qatorlik siklda `i` maqbul, modul darajasida — yo‘q.

## Funksiya bitta ish qiladi

Funksiyani tasvirlash uchun «va» so‘zi kerak bo‘lsa, ehtimol uni bo‘lish kerak.

```typescript
// Oldin
function processOrder(order: Order) {
  if (!order.items.length) throw new Error("Empty order");
  let total = 0;
  for (const item of order.items) total += item.price * item.qty;
  db.save({ ...order, total });
  mailer.send(order.email, `Jami: ${total}`);
}

// Keyin
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order.items);
  saveOrder(order, total);
  notifyCustomer(order.email, total);
}
```

Endi yuqori funksiya mundarija kabi o‘qiladi, har bir qismni esa alohida test qilish mumkin. Qat’iy qatorlar chegarasi yo‘q, lekin funksiyani aylantirib o‘qishga to‘g‘ri kelsa — bu o‘ylab ko‘rish uchun sabab.

## Argumentlar kam

Parametrlar qancha ko‘p bo‘lsa, tartibini adashtirish shuncha oson. Mantiqiy bayroqlar ayniqsa xavfli: chaqiruvdan `true` nimani anglatishini tushunib bo‘lmaydi.

```typescript
// Oldin
createUser("Ali", "ali@example.com", true, false, "uz");

// Keyin
createUser({
  name: "Ali",
  email: "ali@example.com",
  isAdmin: true,
  sendWelcomeEmail: false,
  locale: "uz",
});
```

Mo‘ljal: ikki-uchtagacha argument. Undan ko‘p bo‘lsa, nomlangan maydonli obyekt uzating. Funksiya xulqini o‘zgartiradigan bayroq ko‘pincha bu aslida ikki xil funksiya ekanini bildiradi.

## Ichma-ichlik o‘rniga erta qaytish

Chuqur `if` lar barcha shartlarni bir vaqtda yodda tutishga majbur qiladi. Maxsus holatlarni darhol qayta ishlab, chiqib keting.

```typescript
// Oldin
function getDiscount(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.orders > 10) {
        return 0.1;
      }
    }
  }
  return 0;
}

// Keyin
function getDiscount(user: User | null) {
  if (!user || !user.isActive) return 0;
  if (user.orders <= 10) return 0;
  return 0.1;
}
```

Asosiy ssenariy yuqori chekinish darajasida qoladi, «himoya» tekshiruvlari esa boshida turadi.

## Izohlar «nega»ni tushuntiradi

Kodni qayta aytib beradigan izoh eskiradi va xalaqit beradi. Foydali izoh noaniq sababni tushuntiradi.

```typescript
// Oldin
// hisoblagichni 1 ga oshiramiz
retries++;

// Keyin
// Provayder API si yuqori yuklamada ba’zan 503 qaytaradi,
// shuning uchun xatoni darhol ko‘rsatmay, so‘rovni takrorlaymiz
retries++;
```

«Bu blok nima qiladi» degan izoh yozgingiz kelsa, avval blokni tushunarli nomli funksiyaga chiqarib ko‘ring.

## Kommitdan oldingi chek-list

- Nomdan o‘zgaruvchi nimani saqlashi va funksiya nima qilishi tushunarlimi?
- Har bir funksiya bitta ish qiladimi?
- Uch va undan ortiq argumentli yoki mantiqiy bayroqli funksiyalar bormi?
- Ichma-ichlikni erta qaytish bilan olib tashlash mumkinmi?
- Izohlar kodni qayta aytib bermayaptimi?
- Izohga olingan kod qolmadimi? Tarix uchun Git bor.

## FAQ

### Funksiya qanchalik qisqa bo‘lishi kerak?

Universal son yo‘q. Mo‘ljal — funksiya bitta abstraksiya darajasida bitta ish qiladi va ekranga aylantirmasdan sig‘adi.

### Uzun nomlar yomonmi?

Yo‘q, agar ular aniq bo‘lsa. `calculateMonthlyRevenue` `calc` dan yaxshiroq. Nom takrorlar yoki `Data`, `Info`, `Manager` kabi ortiqcha so‘zlar hisobiga uzun bo‘lsa — yomon.

### Bu qoidalarni eski loyihaga qo‘llash mumkinmi?

Ha, asta-sekin: vazifa doirasida baribir o‘zgartirayotgan kodingizni yaxshilang. Testlarsiz ommaviy refaktoring xavfli.
