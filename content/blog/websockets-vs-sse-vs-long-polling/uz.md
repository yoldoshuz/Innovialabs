---
title: WebSockets, SSE yoki polling: real-time uchun nimani tanlash kerak
description: WebSockets, Server-Sent Events va long polling qanday ishlaydi, proksi va masshtablashda nimani hisobga olish kerak, chat, bildirishnoma va AI uchun qaysi mos.
summary: Ikki tomonlama almashinuv (chatlar, birgalikda tahrirlash, o‘yinlar) uchun WebSockets, faqat serverdan keladigan hodisalar oqimi (bildirishnomalar, dashboardlar, AI javobini striming) uchun SSE oling, polling’ni esa oddiy zaxira variant sifatida qoldiring.
---
## Qisqa javob

| Vazifa | Eng yaxshi tanlov |
|---|---|
| Chat, birgalikda tahrirlash, multipleyer | **WebSockets** |
| Bildirishnomalar, hodisalar lentasi, live dashboard | **SSE** |
| LLM javobini tokenlab striming qilish | **SSE** (yoki HTTP javob strimingi) |
| Kam yangilanishlar, fon vazifasi statusi | **Polling** |
| Oddiy HTTP’dan boshqa hech narsa o‘tmaydigan muhit | **Long polling** |

Asosiy savol — **kim kimga yozadi**. Agar ma’lumot faqat serverdan klientga ketsa, WebSockets odatda ortiqcha.

## Har bir mexanizm qanday ishlaydi

**Short polling.** Klient har N soniyada «yangilik bormi?» deb so‘raydi. Oddiy va ishonchli, lekin kechikish intervalga teng va ko‘pchilik so‘rovlar bo‘sh qaytadi.

**Long polling.** Klient so‘rov yuboradi, server esa ma’lumot paydo bo‘lguncha yoki taymaut tugaguncha uni ochiq ushlab turadi. Javobdan keyin klient darhol yangi so‘rov yuboradi. Kechikish pastroq, lekin har bir xabar sarlavhalari bilan yangi HTTP sikli.

**Server-Sent Events (SSE).** Klient oddiy HTTP so‘rov ochadi, server `Content-Type: text/event-stream` bilan javob beradi va ulanishni yopmay, hodisalarni matn ko‘rinishida yuboradi. Yo‘nalish — faqat serverdan klientga. Brauzerda avtomatik qayta ulanadigan o‘rnatilgan `EventSource` bor.

```javascript
const es = new EventSource("/api/events");
es.onmessage = (e) => console.log(JSON.parse(e.data));
```

**WebSockets.** Ulanish HTTP sifatida boshlanadi va alohida protokolga o‘tadi (Upgrade). Shundan keyin ikkala tomon istalgan vaqtda matnli yoki binar xabarlarni minimal xarajat bilan yuboradi.

```javascript
const ws = new WebSocket("wss://example.com/chat");
ws.onmessage = (e) => render(JSON.parse(e.data));
ws.send(JSON.stringify({ text: "Salom" }));
```

## Taqqoslash

| | Polling | Long polling | SSE | WebSockets |
|---|---|---|---|---|
| Yo‘nalish | Klientdan serverga | Klientdan serverga | Serverdan klientga | Ikkala tomon |
| Kechikish | So‘rov intervali | Past | Past | Past |
| Protokol | HTTP | HTTP | HTTP | Upgrade’dan keyin alohida |
| Qayta ulanish | Kerak emas | Qo‘lda | `EventSource`ga o‘rnatilgan | Qo‘lda |
| Binar ma’lumot | Ha | Ha | Yo‘q, faqat matn | Ha |
| Proksi bilan moslik | A’lo | Yaxshi | Buferlash o‘chirilsa yaxshi | Sozlash kerak |

## Proksilar, balanslovchilar va infratuzilma

Real-time ko‘pincha aynan shu yerda buziladi.

- **Buferlash.** nginx va boshqa proksilar javobni buferlashi mumkin, shunda SSE hodisalari to‘da bo‘lib keladi. SSE uchun buferlashni o‘chiring (nginx’da — `proxy_buffering off` yoki `X-Accel-Buffering: no` sarlavhasi).
- **Faolsizlik taymautlari.** Proksi va balanslovchilar «jim» ulanishlarni yopadi. Heartbeat yuboring — SSE’da `:` izohi yoki WebSockets’da ping/pong — va `proxy_read_timeout`ni oshiring.
- **WebSockets uchun Upgrade.** Proksi `Upgrade` va `Connection` sarlavhalarini uzatishi kerak, aks holda handshake o‘tmaydi.
- **HTTP/1.1 va ulanishlar limiti.** Brauzer HTTP/1.1 bo‘yicha bitta domenga bir vaqtdagi ulanishlar sonini cheklaydi, SSE ochilgan bir nechta tab uni tugatib qo‘yishi mumkin. HTTP/2’da oqimlar multiplekslanadi va muammo yo‘qoladi.
- **Serverless.** Ko‘plab serverless platformalar so‘rov davomiyligini cheklaydi va uzoq yashovchi WebSocket ulanishlari uchun yomon mos keladi. Davomiyligi cheklangan SSE ko‘proq ishlaydi.

## Masshtablash

Uzoq yashovchi ulanish ma’lum serverga bog‘langan. Serverlar bir nechta bo‘lganda:

1. **Umumiy xabar shinasi.** A serverda paydo bo‘lgan hodisa B serverga ulangan klientga yetib borishi kerak. Redis Pub/Sub, NATS, Kafka yoki boshqariladigan servislar ishlatiladi.
2. **Sticky sessions.** Long polling va fallback mexanizmli ba’zi kutubxonalar uchun kerak, klient so‘rovlari o‘sha serverga tushishi uchun.
3. **Resurs limitlari.** Har bir ulanish xotira va fayl deskriptorini egallaydi. OT limitlarini tekshiring va asinxron server tanlang.
4. **Silliq deploy.** Qayta ishga tushirishda barcha klientlar bir vaqtda qayta ulanadi. Qayta ulanishga tasodifiy kechikish (jitter) qo‘shing.

## Qayta ulanish va xabarlar yo‘qolishi

Ulanishlar uziladi: tarmoq almashadi, noutbuk uxlaydi, deploy bo‘ladi. Buni oldindan rejalashtiring.

- **SSE**: hodisalarga `id:` maydonini yuboring. Qayta ulanishda brauzer `Last-Event-ID` sarlavhasini yuboradi va server o‘tkazib yuborilganini qayta jo‘nata oladi.
- **WebSockets**: qayta ulanish qo‘lda yoziladi — eksponensial kechikish va jitter bilan. Qayta ulangandan keyin klient oxirgi ma’lum nuqtadan beri o‘zgarishlarni so‘raydi.
- **Haqiqat manbai — server.** Real-time kanalni yangilanishlarni yetkazish usuli deb hisoblang, joriy holatni esa alohida so‘rov bilan oling.

## Ko‘p uchraydigan xatolar

- SSE yetarli bo‘ladigan joyda WebSockets va ular bilan birga ortiqcha infratuzilma.
- Heartbeat yo‘q, ulanishlar proksida bir daqiqadan keyin jimgina o‘ladi.
- Ulanishda avtorizatsiya yo‘q yoki token soatlab ishlash uchun faqat bir marta tekshiriladi.
- Umumiy shinasiz bir nechta serverga masshtablash: klientlarning bir qismi hodisalarni olmaydi.

## FAQ

### Nega ChatGPT’ga o‘xshash servislar javoblarni ko‘pincha SSE orqali strim qiladi?

Model javobi bir tomonga — serverdan klientga ketadi, foydalanuvchi so‘rovi esa oddiy HTTP orqali yuboriladi. SSE HTTP ustida ishlaydi, proksilardan osonroq o‘tadi va alohida protokol talab qilmaydi.

### SSE orqali serverga ma’lumot yuborish mumkinmi?

Yo‘q, SSE bir tomonlama. Serverga ma’lumot oddiy HTTP so‘rovlar (`POST`, `fetch`) bilan yuboriladi. Ko‘p ilovalar uchun bu kombinatsiya WebSockets’ni to‘liq almashtiradi.

### Polling qachon normal yechim?

Yangilanishlar kam va kichik kechikish muhim bo‘lmaganda: to‘lov statusi, hisobot tayyorligini tekshirish, daqiqada bir marta yangilash. Polling’ni debug qilish eng oson va u istalgan muhitda ishlaydi.
