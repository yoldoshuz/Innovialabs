---
title: Funksional dasturlash nima: yangi boshlovchilar uchun asoslar
description: Birinchi darajali va yuqori tartibli funksiyalar, map, filter, reduce hamda deklarativ uslub JavaScript va Python’dagi oddiy misollarda.
summary: Funksional dasturlash dasturni ma’lumot qabul qilib, yangi ma’lumot qaytaradigan kichik funksiyalardan quradi, funksiyalarning o‘zi esa qiymat kabi uzatiladi. Siz qadamma-qadam sikl qanday aylanishini emas, nimani hisoblash kerakligini tasvirlaysiz.
---

## Qisqa javob

**Funksional dasturlash (FP)** — dastur funksiyalardan quriladigan uslub: ular kirish ma’lumotini qabul qiladi va natija qaytaradi, ideal holatda atrofidagi hech narsani o‘zgartirmaydi. O‘zgaruvchilarni qadamma-qadam o‘zgartiradigan sikllar o‘rniga siz kichik funksiyalarni birlashtirasiz: «ro‘yxatni ol, to‘langan buyurtmalarni qoldir, summalarini ol, qo‘shib chiq».

Maxsus til shart emas. JavaScript, Python, Kotlin, C# va boshqa ko‘plab tillar FP’ning asosiy g‘oyalarini qo‘llab-quvvatlaydi, zamonaviy kodning katta qismi esa FP’ni boshqa uslublar bilan aralashtiradi.

## 1-g‘oya: funksiyalar — bu qiymatlar

FP’ni qo‘llab-quvvatlaydigan tillarda funksiyalar **birinchi darajali**: ularni o‘zgaruvchiga saqlash, argument sifatida uzatish va boshqa funksiyadan qaytarish mumkin.

```javascript
const greet = (name) => `Hello, ${name}`;
const actions = { greet };
console.log(actions.greet("Aziza"));
```

```python
def greet(name):
    return f"Hello, {name}"

say = greet
print(say("Aziza"))
```

## 2-g‘oya: yuqori tartibli funksiyalar

**Yuqori tartibli funksiya** argument sifatida funksiya qabul qiladi yoki funksiya qaytaradi. Bu *nima qilish kerakligini* *qanday aylanib chiqishdan* ajratish imkonini beradi.

```javascript
const multiplier = (factor) => (x) => x * factor;
const double = multiplier(2);
double(5); // 10
```

Qaytarilgan funksiya `factor` ni eslab qoladi — bu **closure (yopilma)** deb ataladi.

## 3-g‘oya: map, filter, reduce

Bu uchta yuqori tartibli funksiya ro‘yxatlar bilan kundalik ishning katta qismini qamrab oladi:

| Funksiya | Nima qiladi | Natija |
|---|---|---|
| `map` | har bir elementni o‘zgartiradi | xuddi shu uzunlikdagi ro‘yxat |
| `filter` | tekshiruvdan o‘tgan elementlarni qoldiradi | qisqaroq yoki teng ro‘yxat |
| `reduce` | barcha elementlarni bitta qiymatga yig‘adi | bitta qiymat |

### Imperativ versiya

```javascript
const orders = [
  { total: 120, paid: true },
  { total: 80, paid: false },
  { total: 50, paid: true },
];

let sum = 0;
for (let i = 0; i < orders.length; i++) {
  if (orders[i].paid) {
    sum += orders[i].total;
  }
}
```

### Funksional versiya

```javascript
const sum = orders
  .filter((o) => o.paid)
  .map((o) => o.total)
  .reduce((acc, t) => acc + t, 0);
```

Xuddi shu narsa Python’da, bu yerda generator ifodalari ko‘proq idiomatik hisoblanadi:

```python
orders = [
    {"total": 120, "paid": True},
    {"total": 80, "paid": False},
    {"total": 50, "paid": True},
]

total = sum(o["total"] for o in orders if o["paid"])
```

Python’da ham `map`, `filter` va `functools.reduce` bor, lekin generator ifodalari va `sum` kabi o‘rnatilgan funksiyalar odatda o‘qishga qulayroq.

## Imperativ va deklarativ uslub

- **Imperativ** kod *qanday* qilishni tasvirlaydi: hisoblagich yarat, sikl aylan, tekshir, yangila.
- **Deklarativ** kod *nima* kerakligini tasvirlaydi: to‘langan buyurtmalar, ularning summalari, jami.

Deklarativ kod odatda qisqaroq, unda indeks bilan bog‘liq xatolar uchun joy kamroq va maqsad bitta qatorda ko‘rinadi. Imperativ kod murakkab qadamma-qadam algoritmlarda yoki nozik optimallashtirish muhim bo‘lganda tushunarliroq bo‘lishi mumkin.

## Bilish kerak bo‘lgan boshqa asosiy g‘oyalar

- **Toza funksiyalar**: bir xil kirish doim bir xil natija beradi, yon ta’sirlarsiz. Ularni testlash va tushunish oson.
- **Immutabellik**: ma’lumotni o‘zgartirish o‘rniga uning yangi versiyasi yaratiladi. Bu kodning bir qismi boshqa qism tayanadigan ma’lumotni sezdirmay o‘zgartirib qo‘yadigan xatolardan himoya qiladi.
- **Funksiyalar kompozitsiyasi**: katta funksiyalar kichiklar zanjiridan yig‘iladi, bunda birining chiqishi keyingisining kirishi bo‘ladi.

## Oddiy kodda FP’ni qanday qo‘llashni boshlash

1. Yangi ro‘yxat yig‘adigan oddiy `for` sikllarni `map` / `filter` yoki list comprehension bilan almashtiring.
2. Hisob-kitoblarni faqat o‘z argumentlaridan foydalanadigan kichik funksiyalarga chiqaring.
3. Argumentlarni o‘zgartirish o‘rniga yangi obyektlar qaytaring.
4. Yon ta’sirlarni (ma’lumotlar bazasi, tarmoq, loglar) dasturning chekkalarida saqlang.
5. Haddan oshirmang: zanjirni o‘qish qiyinlashsa, uni nomlangan qadamlarga bo‘ling.

## Keng tarqalgan xatolar

- `map` ni yon ta’sirlar uchun oddiy sikl sifatida ishlatish — buning uchun `forEach` yoki oddiy sikl bor.
- Hech kim debug qila olmaydigan juda uzun zanjirlar qurish.
- `reduce` da boshlang‘ich qiymatni unutish — JavaScript’da bu bo‘sh massivda xatoga olib keladi.
- FP’ni «hammasi yoki hech narsa» deb hisoblash. Uslublarni aralashtirish normal holat.

## FAQ

### FP’ni o‘rganish uchun Haskell yoki boshqa funksional til kerakmi?

Yo‘q. Asosiy g‘oyalarni siz allaqachon ishlatayotgan bo‘lishingiz mumkin bo‘lgan JavaScript yoki Python’da o‘zlashtirish mumkin. Sof funksional tillar keyinroq, chuqurroq o‘rganmoqchi bo‘lsangiz foydali bo‘ladi.

### Funksional kod sekinroqmi?

`filter` va `map` zanjirlari oraliq ro‘yxatlar yaratadi, bu juda katta ma’lumotlarda sezilishi mumkin. Oddiy amaliy kodda farq kamdan-kam muhim bo‘ladi, o‘qilishi esa yutadi. Avval o‘lchang, keyin optimallashtiring.

### FP OOP’dan yaxshiroqmi?

Ular turli vazifalarni hal qiladi va birgalikda yaxshi ishlaydi. Ko‘p loyihalarda obyektlar tuzilmani belgilaydi, funksional usullar esa ma’lumotlarni o‘zgartirish uchun ishlatiladi.
