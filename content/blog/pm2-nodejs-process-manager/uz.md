---
title: "PM2: Node.js ilovalarini prodakshnda qanday ishga tushirish"
description: PM2 orqali Node.js’ni prodakshnda ishga tushirish - cluster mode, ecosystem fayli, uzilishsiz qayta yuklash, avtoyuklanish, loglar va qachon Docker yaxshiroq.
summary: PM2 Node.js ilovasini doim ishlab turishini ta’minlaydi, yiqilganda qayta ishga tushiradi, cluster mode’da yuklamani yadrolar bo‘ylab taqsimlaydi va server qayta yuklangandan keyin jarayonlarni tiklaydi.
---

## Qisqa javob: PM2 nima uchun kerak

Ilovani `node server.js` buyrug‘i bilan ishga tushirsangiz, u terminal yopilganda, xatolikda yoki server qayta yuklanganda to‘xtaydi. **PM2** — Node.js uchun jarayonlar menejeri bo‘lib, u:

- ilovani fonda ushlab turadi va yiqilganda qayta ishga tushiradi;
- turli CPU yadrolarida bir nechta nusxani ishga tushiradi (**cluster mode**);
- kodni uzilishsiz qayta yuklaydi;
- server qayta ishga tushgandan keyin jarayonlarni tiklaydi;
- loglarni yig‘adi va resurs sarfini ko‘rsatadi.

## O‘rnatish va birinchi ishga tushirish

```bash
npm install -g pm2
pm2 start server.js --name api
```

Asosiy buyruqlar:

| Buyruq | Nima qiladi |
|---|---|
| `pm2 list` | jarayonlar ro‘yxati va holati |
| `pm2 logs api` | real vaqtdagi loglar |
| `pm2 monit` | terminalda CPU va xotira |
| `pm2 restart api` | qattiq qayta ishga tushirish |
| `pm2 reload api` | uzilishsiz qayta ishga tushirish |
| `pm2 stop api` / `pm2 delete api` | to‘xtatish / ro‘yxatdan olib tashlash |

## Uzun buyruqlar o‘rniga ecosystem fayli

Sozlamalarni repozitoriyda, `ecosystem.config.js` faylida saqlash qulayroq:

```js
module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

Ishga tushirish: `pm2 start ecosystem.config.js`. Shunda konfiguratsiya barcha serverlarda bir xil bo‘ladi va Git tarixida ko‘rinadi. Maxfiy ma’lumotlarni bu faylga qo‘ymang — ularni server muhit o‘zgaruvchilari yoki repozitoriyga tushmaydigan `.env` orqali uzating.

## Cluster mode

Node.js JavaScript’ni bitta oqimda bajaradi, ya’ni bitta jarayon bitta yadrodan foydalanadi. **Cluster mode** da PM2 bir nechta nusxani ishga tushiradi va kiruvchi ulanishlarni ular o‘rtasida taqsimlaydi. `instances: "max"` — yadrolar soniga ko‘ra.

Muhim shartlar:

- ilova **stateless** bo‘lishi kerak: sessiyalar, kesh va navbatlar jarayon xotirasida emas, tashqi xotirada (Redis, baza) saqlanadi;
- ilova ichidagi jadvalli vazifalar har bir nusxada bajariladi — ularni alohida chiqaring yoki faqat bittasida ishga tushiring;
- klasterda WebSocket sticky-sessiyalar yoki tashqi adapterga e’tibor talab qiladi.

## Uzilishsiz qayta yuklash

`pm2 reload api` nusxalarni navbat bilan qayta ishga tushiradi: biri qayta yuklanayotganda boshqalari so‘rovlarga xizmat qiladi. Bu cluster mode’da ishlaydi. Qayta yuklash haqiqatan ham silliq bo‘lishi uchun:

- `SIGINT` signalini qayta ishlang — server va baza ulanishlarini to‘g‘ri yoping;
- kerak bo‘lsa, PM2 ilova haqiqatan tayyor bo‘lishini kutishi uchun `wait_ready: true` va `process.send("ready")` dan foydalaning.

## Server qayta yuklangandan keyin avtomatik ishga tushish

```bash
pm2 startup
# PM2 chiqargan buyruqni bajaring
pm2 save
```

`pm2 startup` tizim xizmatini yaratadi, `pm2 save` esa joriy jarayonlar ro‘yxatini eslab qoladi. Ilovalarni qo‘shgan yoki o‘chirgandan keyin `pm2 save` ni takrorlang.

## Loglarni boshqarish

Odatda loglar `~/.pm2/logs` ga yoziladi va o‘z-o‘zidan o‘chirilmaydi. Rotatsiya modulini o‘rnating:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 10
```

Aks holda loglar ertami-kechmi diskni to‘ldiradi.

## PM2 yoki Docker

| | PM2 | Docker |
|---|---|---|
| Kirish darajasi | past | yuqoriroq |
| Muhit | serverga bog‘liq | hamma joyda bir xil |
| Bir nechta til va xizmatlar | noqulay | tabiiy |
| Ko‘p serverlarga masshtablash | qo‘lda | orkestrator orqali |
| Kimga mos | bitta server, kichik loyiha | jamoalar, mikroservislar, CI/CD |

Agar sizda bitta VPS va bir-ikkita Node.js ilovasi bo‘lsa, PM2 — oddiy va ishonchli tanlov. Loyiha o‘sib, bir nechta xizmat paydo bo‘lsa va muhitni takrorlanuvchan qilish kerak bo‘lsa, **Docker** ga o‘ting. Konteyner ichida PM2 odatda kerak emas: qayta ishga tushirishni Docker yoki orkestratorning o‘zi bajaradi, bir nechta nusxa esa alohida konteynerlar sifatida ishga tushiriladi.

## FAQ

### restart va reload o‘rtasidagi farq nima?

`restart` barcha jarayonlarni to‘xtatib, qaytadan ishga tushiradi — qisqa uzilish bo‘ladi. `reload` nusxalarni navbat bilan qayta ishga tushiradi va cluster mode’da uzilishsiz ishlaydi.

### Server qayta yuklangandan keyin nega ilova ishga tushmadi?

Ehtimol `pm2 startup` va `pm2 save` bajarilmagan. Shuningdek, xizmat jarayonlarni ishga tushirgan o‘sha foydalanuvchi uchun yaratilganini tekshiring.

### PM2 bo‘lsa, nginx kerakmi?

Odatda ha. PM2 jarayonlarni boshqaradi, nginx esa trafikni qabul qiladi, HTTPS’ni yakunlaydi, statik fayllarni beradi va so‘rovlarni ilovaga proksilaydi.
