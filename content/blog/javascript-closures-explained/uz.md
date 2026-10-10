---
title: JavaScript’da closure nima: misollar bilan tushuntirish
description: JavaScript’dagi leksik ko‘rinish sohasi va closure’larning sodda tushuntirishi: hisoblagich, yopiq holat, memoizatsiya va sikldagi var xatosi.
summary: Closure — yaratilgan joyidagi o‘zgaruvchilarni eslab qoladigan va tashqi funksiya ishini tugatgandan keyin ham ularga kirish huquqini saqlaydigan funksiya.
---
## Closure nima

**Closure** (yopilish) — bu funksiya va u yaratilgan muhitdagi o‘zgaruvchilar birgaligi. Funksiya bu o‘zgaruvchilarni «eslab qoladi» va tashqi funksiya ishini tugatgandan keyin ham ularni o‘qiy va o‘zgartira oladi.

```js
function makeGreeting(name) {
  return function () {
    return `Salom, ${name}!`;
  };
}

const hiAnna = makeGreeting('Anna');
hiAnna(); // "Salom, Anna!"
```

`makeGreeting` allaqachon tugagan, ammo ichki funksiya hali ham `name`’ni ko‘radi. Mana shu closure.

## Leksik ko‘rinish sohasi

Closure’ni tushunish uchun bitta qoida yetarli: **funksiya o‘zgaruvchilarni qayerda chaqirilganiga qarab emas, kodda qayerda yozilganiga qarab ko‘radi**. Bu leksik ko‘rinish sohasi (lexical scope) deyiladi.

```js
const color = 'ko‘k';

function show() {
  console.log(color);
}

function run() {
  const color = 'qizil';
  show();
}

run(); // "ko‘k"
```

`show` yuqori darajada e’lon qilingan, shuning uchun u `run` ichidagi emas, tashqi `color`’ni ko‘radi.

O‘zgaruvchi zanjir bo‘ylab qidiriladi: avval joriy funksiya, keyin tashqisi va shu tariqa global sohagacha.

## Amaliy qo‘llanilishi

### Hisoblagich

```js
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    get: () => count,
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
counter.get(); // 2
```

`createCounter`’ning har bir chaqiruvi **o‘zining** `count`’ini yaratadi. Ikki hisoblagich bir-biriga xalaqit bermaydi.

### Yopiq holat

Tashqaridan `count`’ga faqat metodlar orqali yetish mumkin. Bu klasslarsiz ma’lumotni yashirish usuli. Modullar, React hook’lari (`useState` closure’larga tayanadi) va hodisa ishlovchilari ham shunga o‘xshash ishlaydi.

### Memoizatsiya

Closure natijalar keshini saqlashi mumkin:

```js
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) return cache.get(n);
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const slowSquare = (n) => n * n;
const fastSquare = memoize(slowSquare);
```

`cache` closure ichida yashaydi va chaqiruvlar orasida saqlanib qoladi.

## Klassik xato: sikldagi var

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3
```

Nega 0, 1, 2 emas? `var`’ning ko‘rinish sohasi **funksiya** darajasida: butun sikl uchun bitta `i`. Taymerlar ishga tushganda sikl allaqachon tugagan va `i` 3 ga teng. Uchala funksiya ham bitta o‘zgaruvchini yopib olgan.

Yechim — `let`. Uning ko‘rinish sohasi **blok** darajasida, shuning uchun har bir iteratsiyada yangi `i` yaratiladi:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

## Ko‘p uchraydigan xatolar

- **Qiymat nusxasini kutish.** Closure o‘zgaruvchiga havolani saqlaydi, yaratilgan paytdagi qiymatini emas. O‘zgaruvchi o‘zgarsa, funksiya yangi qiymatni ko‘radi.
- **React’dagi eskirgan qiymatlar.** Bitta render’da yaratilgan ishlovchi o‘sha render’ning state’ini ko‘radi. `useEffect` va `setInterval`’dagi «stale closure» shundan kelib chiqadi.
- **Xotira sizib chiqishi.** Closure tirik ekan, u havola qilgan o‘zgaruvchilar ham tirik. Keraksiz hodisa ishlovchilari va taymerlarni olib tashlang.

## FAQ

### JavaScript’dagi har bir funksiya closure’mi?

Texnik jihatdan ha: har qanday funksiya o‘zi yaratilgan muhitni eslab qoladi. Lekin odatda «closure» deb funksiya o‘sha muhitdan tashqarida ishlatilib, uning o‘zgaruvchilariga murojaat qilishda davom etgan holatni aytishadi.

### Closure’lar kodni sekinlashtiradimi?

Oddiy vazifalarda sezilarli darajada yo‘q. Xarajat closure aks holda axlat yig‘uvchi tozalab yuboradigan katta obyektlarni ushlab turganda paydo bo‘ladi.

### Closure klassdan nimasi bilan farq qiladi?

Ikkalasi ham holatni metodlar bilan birga saqlash imkonini beradi. Closure haqiqiy yopiqlikni beradi va kichik vazifalar uchun soddaroq, klass esa meros va ko‘p metodlar bilan qulayroq. Zamonaviy klasslarda `#` orqali yopiq maydonlar ham bor.
