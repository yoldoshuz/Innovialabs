---
title: 'Brauzerda event loop qanday ishlaydi: task, microtask, rendering'
description: Event loop sirsiz: chaqiruvlar steki, task va microtask navbatlari, requestAnimationFrame, rendering o‘rni va interfeys qotishini tushuntiruvchi masalalar.
summary: Brauzer bitta task’ni oladi, uni oxirigacha bajaradi, so‘ng butun microtask navbatini bo‘shatadi va shundan keyingina kadrni chizishi mumkin; kodingiz ishlayotganda sahifa qayta chizilmaydi va bosishlarga javob bermaydi.
---

## Qisqa javob

Sahifada bitta asosiy oqim bor. Unda JavaScript bajariladi, hodisalar qayta ishlanadi va chizish amalga oshadi. **Event loop** — keyin nima qilishni hal qiluvchi sikl:

1. Navbatdan **bitta task**ni olib, uni to‘liq bajarish.
2. **Barcha microtask**larni, jumladan jarayonda paydo bo‘lganlarini ham bajarish.
3. Kadr vaqti kelgan bo‘lsa — **requestAnimationFrame** callback’larini bajarish, uslublar va layout’ni qayta hisoblash va sahifani **chizish**.
4. Takrorlash.

Bundan asosiy qoida kelib chiqadi: **kodingiz bajarilayotganda brauzer chizmaydi va bosishlarni qayta ishlamaydi**.

## Chaqiruvlar steki

Funksiya chaqirilganda u **chaqiruvlar stekiga** (call stack) qo‘yiladi, natija qaytarganda olib tashlanadi. Event loop keyingi task’ni faqat stek **bo‘sh** bo‘lganda oladi. Uzoq sinxron funksiya stekni band qilib turadi va qolgan hamma narsa kutadi.

## Task va microtask

| | Task’lar | Microtask’lar |
|---|---|---|
| Manbasi | `setTimeout`, `setInterval`, foydalanuvchi hodisalari, tarmoq callback’lari, `MessageChannel` | `Promise.then/catch/finally`, `await`, `queueMicrotask`, `MutationObserver` |
| Bir aylanishda nechta | Bitta | Butun navbat |
| Ular orasida rendering | Mumkin | Mumkin emas |

## 1-masala: chiqarish tartibi

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

Natija: `1, 4, 3, 2`.

- `1` va `4` — joriy task’dagi sinxron kod.
- `3` — microtask: joriy task tugashi bilan darhol bajariladi.
- `2` — yangi task: siklning keyingi aylanishini kutadi. `setTimeout(fn, 0)` “darhol” emas, “undan oldin emas” degan ma’noni bildiradi.

## 2-masala: spinner nega aylanmaydi

```js
button.addEventListener("click", () => {
  spinner.hidden = false;
  heavyCalculation(); // bir necha soniyalik sinxron ish
  spinner.hidden = true;
});
```

Spinner umuman ko‘rinmaydi. DOM o‘zgaradi, lekin **chizish** faqat ishlovchi tugagandan keyin bo‘ladi, o‘sha paytda esa spinner yana yashirilgan. Shu vaqt davomida sahifa qotib turadi.

## 3-masala: microtask’lar ham qotirishi mumkin

```js
function loop() {
  Promise.resolve().then(loop);
}
loop();
```

Har bir microtask yangisini qo‘yadi, microtask navbati esa **oxirigacha** bajariladi. Brauzer hech qachon renderinggacha yetib bormaydi — tab xuddi `while (true)` dagidek qotadi. `setTimeout(loop, 0)` bilan esa tab tirik qoladi: task’lar orasida kadr chizish imkoniyati bor.

## requestAnimationFrame qayerda turadi

`requestAnimationFrame(callback)` funksiyani **keyingi kadr chizilishidan bevosita oldin** chaqiradi. Shuning uchun kadr bilan mos kelishi kerak bo‘lgan animatsiya va o‘lchovlar `setTimeout`da emas, unda bajariladi:

- rAF callback’lari ekran yangilanish chastotasi bilan sinxronlangan;
- fon tabida ular odatda to‘xtatiladi va resurs sarflamaydi;
- bir nechta rAF callback’idagi uslub o‘zgarishlari bitta kadrga tushadi.

## Interfeysni qotirmaslik uchun

- **Uzoq ishni qismlarga bo‘ling** va ular orasida boshqaruvni qaytaring — `setTimeout` yoki qo‘llab-quvvatlansa `scheduler.yield()` orqali. Shunda brauzer bosishlarni qayta ishlashga va kadr chizishga ulguradi.
- **Og‘ir hisob-kitoblarni Web Worker’ga o‘tkazing.** Worker alohida oqimda ishlaydi va asosiy oqim bilan xabarlar orqali muloqot qiladi.
- **Siklda layout’ni o‘qish va yozishni aralashtirmang**: uslub o‘zgargandan keyin `offsetHeight`ni o‘qish brauzerni layout’ni sinxron qayta hisoblashga majbur qiladi.
- Indikator ko‘rsatish kerak bo‘lsa, **UI’ni og‘ir ishdan oldin yangilang**: avval uni ko‘rsating, kadrni kuting, keyin hisoblashni boshlang.

```js
async function run() {
  spinner.hidden = false;
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  heavyCalculation();
  spinner.hidden = true;
}
```

rAF’ni, so‘ng `setTimeout`ni kutish spinnerli kadr chizilishiga kafolat beradi. Ammo hisoblash vaqtida interfeys baribir qotadi — muammoni haqiqatan faqat Web Worker yoki ishni qismlarga bo‘lish hal qiladi.

## Buni qanday ko‘rish mumkin

DevTools’dagi **Performance** bo‘limi asosiy oqimdagi task’larni ko‘rsatadi. Taxminan 50 ms dan uzun task’lar **long task** deb belgilanadi — aynan ular interfeysni javobsiz qiladi va INP metrikasini yomonlashtiradi.

## FAQ

### async/await — task’mi yoki microtask?

`await`dan keyingi davom microtask sifatida bajariladi. Shuning uchun `await`ning o‘zi brauzerga kadr chizishga imkon bermaydi: renderingga yo‘l berish kerak bo‘lsa, task yoki kadrni aniq kuting.

### setTimeout(fn, 0) nega darhol ishlamaydi?

U navbatga yangi task qo‘yadi va u faqat joriy task va barcha microtask’lardan keyin bajariladi. Brauzer ichma-ich taymerlar va fon tablari uchun kechikishni oshirishi ham mumkin.

### Node.js’dagi event loop ham shundaymi?

G‘oya umumiy — bitta hodisalar navbati va microtask’lar, — lekin sikl fazalari boshqacha va rendering yo‘q. Node.js’da taymerlar va `setImmediate` xatti-harakatini alohida o‘rganish kerak.
