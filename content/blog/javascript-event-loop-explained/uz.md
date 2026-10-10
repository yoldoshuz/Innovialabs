---
title: JavaScript’da Event Loop qanday ishlaydi: task va microtask
description: JavaScript’dagi call stack, task va microtask navbatlarini tushunib, setTimeout, Promise va async/await chiqish tartibini oldindan aytishni o‘rganamiz.
summary: JavaScript kodni bitta oqimda bajaradi: avval sinxron kod, keyin barcha microtask’lar (promise, await) va shundan so‘ng keyingi task (setTimeout, hodisalar).
---
## Qisqa javob

JavaScript kodni **bitta oqimda** bajaradi. Event Loop keyin nima bajarilishini hal qiladi va bitta qoidaga amal qiladi:

1. Joriy **task**’ni (macrotask) oxirigacha bajarish — masalan, butun skriptni.
2. Navbatdagi **barcha microtask**’larni bajarish, jarayonda qo‘shilganlarini ham.
3. Brauzerga sahifani chizish imkonini berish.
4. Keyingi task’ni olib, takrorlash.

Asosiy xulosa: agar ikkalasi bitta task ichida rejalashtirilgan bo‘lsa, `Promise.then` doim `setTimeout(..., 0)`’dan oldin bajariladi.

## Uch ishtirokchi: stack, task’lar, microtask’lar

- **Call stack** — chaqiruvlar steki. Unda biror narsa bor ekan, boshqa hech narsa bajarilmaydi.
- **Task navbati** — `setTimeout`, `setInterval` callback’lari, DOM hodisalari, tarmoq javoblari, `postMessage`.
- **Microtask navbati** — `.then/.catch/.finally` callback’lari, `await`’dan keyingi davomi, `queueMicrotask`, `MutationObserver`.

| Manba | Navbat |
|---|---|
| `setTimeout`, `setInterval` | task |
| klik, kiritish, yuklanish | task |
| `Promise.then`, `await` | microtask |
| `queueMicrotask` | microtask |

E’tibor bering: `setTimeout(fn, 0)` «darhol» degani emas. Bu «0 ms’dan oldin emas va faqat stack bo‘sh, microtask’lar tugaganda» degani.

## 1-misol: asosiy tartib

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

Natija: **1, 4, 3, 2**. Avval sinxron kod (1, 4), keyin microtask (3), so‘ng keyingi task (2).

## 2-misol: async/await

```js
async function a() {
  console.log('a1');
  await null;
  console.log('a2');
}

console.log('start');
setTimeout(() => console.log('timeout'), 0);
a();
Promise.resolve().then(() => console.log('then'));
console.log('end');
```

Natija: **start, a1, end, a2, then, timeout**.

Asosiy nuqta: async funksiya tanasi **birinchi `await`’gacha sinxron bajariladi**. `await`’dan keyingi hamma narsa microtask’ga aylanadi. U `then`’dan oldin navbatga tushgani uchun `a2` birinchi chiqadi.

## 3-misol: ichma-ich microtask’lar

```js
setTimeout(() => console.log('t1'), 0);

Promise.resolve().then(() => {
  console.log('p1');
  setTimeout(() => console.log('t2'), 0);
  Promise.resolve().then(() => console.log('p2'));
});
```

Natija: **p1, p2, t1, t2**. Microtask ichida qo‘shilgan microtask o‘sha siklning o‘zida bajariladi — navbat to‘liq bo‘shatiladi. Yangi `setTimeout` task navbatining oxiriga, `t1`’dan keyin tushadi.

## Suhbatda bunday masalalarni qanday yechish kerak

1. Barcha **sinxron** chiqishni yuqoridan pastga yozib chiqing.
2. **Microtask**’ga nima tushganini qo‘yilish tartibida belgilang.
3. **Task**’ga nima tushganini belgilang.
4. Sinxron koddan so‘ng barcha microtask’larni bajaring, yangilarini oxiriga qo‘shib boring.
5. Task’larni bittadan oling, har biridan keyin microtask’larni yana bo‘shating.

## Ko‘p uchraydigan xatolar va amaliy oqibatlar

- **`await` oqimni bloklaydi deb o‘ylash.** U faqat joriy funksiyani to‘xtatib turadi, qolgan kod ishlashda davom etadi.
- **Cheksiz microtask’lar.** Agar microtask doim yangisini qo‘ysa, brauzer chizishga yetib bormaydi va sahifa qotib qoladi.
- **Stack’dagi og‘ir hisob-kitoblar.** Uzoq sikl kliklar va animatsiyalarni bloklaydi. Ishni bo‘laklarga bo‘ling yoki Web Worker’ga chiqaring.
- **Taymer aniqligiga tayanish.** `setTimeout` kechikishi minimal, kafolatlangan emas.

Node.js’da siklning o‘z fazalari va `process.nextTick` bor, lekin «microtask’lar keyingi task’dan oldin» qoidasi u yerda ham amal qiladi.

## FAQ

### Qaysi biri oldin bajariladi: setTimeout(0) yoki Promise.then?

`Promise.then`. Bu microtask, barcha microtask’lar esa sikl keyingi task’ga o‘tishidan oldin bajariladi, `setTimeout` callback’i aynan o‘sha task’da.

### await butun JavaScript’ni bloklaydimi?

Yo‘q. `await` faqat o‘z async funksiyasini to‘xtatadi va boshqaruvni chaqiruvchi kodga qaytaradi. Funksiyaning davomi keyinroq microtask sifatida bajariladi.

### Promise ishlatsam ham sahifa nega qotib qoladi?

Promise kodni boshqa oqimga ko‘chirmaydi. Agar `then` ichida og‘ir hisob-kitob bo‘lsa yoki microtask zanjiri tugamasa, brauzer kadrni chiza olmaydi. Ishni bo‘lish yoki Web Worker yordam beradi.
