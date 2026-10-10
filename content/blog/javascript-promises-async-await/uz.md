---
title: JavaScript’da Promise va async/await: amaliy qo‘llanma
description: Callback’lardan promise va async/await’gacha: xatolarni ushlash, Promise.all, allSettled va race, parallel va ketma-ket so‘rovlar.
summary: Promise — kelajakdagi natijani saqlovchi obyekt, async/await esa uning ustidagi qulay sintaksis; mustaqil so‘rovlarni Promise.all bilan parallel ishga tushiring, xatolarni try/catch bilan ushlang.
---
## Eng asosiysi

**Promise** — asinxron amal natijasini ifodalovchi obyekt: u yoki qiymat bilan bajariladi (fulfilled), yoki xato bilan rad etiladi (rejected). **async/await** — promise’lar ustidagi sintaksis bo‘lib, asinxron kodni xuddi sinxron koddek yozish imkonini beradi.

Ko‘p holatlarni uchta qoida yopadi:

- xatolarni `await` atrofidagi `try/catch` bilan ushlang;
- mustaqil amallarni `Promise.all` orqali **parallel** ishga tushiring;
- `await`’ni unutmang — aks holda ma’lumot o‘rniga promise olasiz.

## Callback’lardan promise’larga

Avval asinxronlik callback’larga qurilgan va ichma-ichlik tez o‘sgan:

```js
getUser(id, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handle(err);
    render(orders);
  });
});
```

Promise bilan bu bitta xato ishlovchisiga ega tekis zanjirga aylanadi:

```js
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => render(orders))
  .catch(handle);
```

## async/await: o‘sha kod, faqat o‘qilishi osonroq

```js
async function showOrders(id) {
  try {
    const user = await getUser(id);
    const orders = await getOrders(user.id);
    render(orders);
  } catch (err) {
    handle(err);
  } finally {
    hideLoader();
  }
}
```

Yodda tuting: **async funksiya doim promise qaytaradi**. Hatto ichidagi `return 5` ham `Promise<5>` beradi.

Agar server 404 kabi xato status bilan javob bersa, `fetch` promise’ni rad etmaydi — `response.ok`’ni o‘zingiz tekshiring:

```js
const res = await fetch('/api/items');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const items = await res.json();
```

## Parallelmi yoki ketma-ket

Ko‘p uchraydigan xato — mustaqil so‘rovlarni birin-ketin kutish:

```js
// ketma-ket: ikkinchi so‘rov faqat birinchisidan keyin boshlanadi
const user = await getUser(id);
const news = await getNews();
```

Agar so‘rovlar bir-biriga bog‘liq bo‘lmasa, ularni birga ishga tushiring:

```js
const [user, news] = await Promise.all([getUser(id), getNews()]);
```

Ketma-ketlik faqat keyingi qadam oldingisining natijasidan foydalanganda kerak.

## Promise.all, allSettled, race, any

| Metod | Qachon yakunlanadi | Qachon ishlatiladi |
|---|---|---|
| `Promise.all` | hammasi muvaffaqiyatli yoki birinchi xato | barcha natijalar majburiy |
| `Promise.allSettled` | hammasi yakunlanganda | muvaffaqiyat ham, xato ham kerak |
| `Promise.race` | birinchi yakunlangani, qanday bo‘lishidan qat’i nazar | timeout’lar |
| `Promise.any` | birinchi muvaffaqiyatlisi | bitta resursning bir nechta ko‘zgusi |

`race` orqali timeout:

```js
const timeout = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

const data = await Promise.race([fetchData(), timeout(5000)]);
```

`fetch`’ni haqiqatan bekor qilish uchun `AbortController`’dan foydalaning — `race` faqat kutishni to‘xtatadi, so‘rov esa davom etadi.

## Ko‘p uchraydigan xatolar

- **`forEach` ichida `await`.** `forEach` promise’larni kutmaydi. Ketma-ket ishlov uchun `for...of`, parallel uchun `map` bilan `Promise.all` ishlating.
- **Unutilgan `await`.** O‘zgaruvchida promise qoladi, xato esa ushlanmagan bo‘lib ketadi.
- **Bo‘sh `catch`.** Yutib yuborilgan xato — eng yomon bag turi. Hech bo‘lmasa log’ga yozing.
- **Juda ko‘p parallel so‘rov.** Ming elementli `Promise.all` API’ni ortiqcha yuklashi mumkin. Partiyalarga bo‘lib ishlang.
- **Uslublarni aralashtirish.** Bitta funksiyada yo `then`, yo `await`’ni tanlang.

```js
// noto‘g‘ri
items.forEach(async (item) => await save(item));

// parallel
await Promise.all(items.map((item) => save(item)));

// ketma-ket
for (const item of items) {
  await save(item);
}
```

## FAQ

### Qaysi biri yaxshiroq: then yoki async/await?

Ular bir xil ishlaydi, async/await shunchaki osonroq o‘qiladi, ayniqsa shartlar va sikllar bilan. `then` qisqa zanjirlar uchun va `await` ishlatib bo‘lmaydigan joylarda qulay.

### Promise.all’dagi bitta promise xato bersa nima bo‘ladi?

`Promise.all` darhol shu xato bilan rad etiladi, qolganlarining natijasini olmaysiz. Xatolardan qat’i nazar barcha natijalar kerak bo‘lsa, `Promise.allSettled`’dan foydalaning.

### await’ni async funksiyadan tashqarida ishlatsa bo‘ladimi?

ES-modullarda top-level await bor, uni modulning yuqori darajasida yozish mumkin. Oddiy funksiyalarda esa `await` faqat `async` funksiya ichida ishlaydi.
