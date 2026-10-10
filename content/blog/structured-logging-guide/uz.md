---
title: "Strukturalangan loglash: qidirish oson bo‘lgan loglarni qanday yozish"
description: JSON loglar, loglash darajalari, request ID va correlation ID, loglarga nimani yozib bo‘lmaydi va Node.js, Python hamda Go uchun misollar.
summary: Loglarni doimiy maydonlar to‘plami bilan JSON’da yozing — vaqt, daraja, servis, xabar va request ID; shunda har qanday xato minglab qatorlarni o‘qish bilan emas, filtr bilan topiladi.
---
## Strukturalangan log nima

Oddiy log — bu matn qatori: `User 42 failed to pay order 981`. Inson uchun tushunarli, lekin mashina uni regex’lar bilan tahlil qilishi kerak, ular esa matn biroz o‘zgarsa buziladi.

**Strukturalangan log** — nomlangan maydonlarga ega yozuv, ko‘pincha JSON’da:

```json
{"ts":"2026-03-14T10:22:05Z","level":"error","service":"billing","msg":"payment failed","user_id":42,"order_id":981,"request_id":"a1b2c3"}
```

Log yig‘ish tizimi bunday yozuvni darhol tushunadi: `billing` servisining barcha xatolarini filtrlash, ularni soatlar bo‘yicha sanash yoki bitta so‘rovning barcha hodisalarini topish mumkin.

## Majburiy maydonlar

Barcha servislar uchun yagona maydonlar to‘plamini kelishib oling:

- **ts** — UTC’dagi vaqt, ISO 8601 formatida.
- **level** — yozuv darajasi.
- **service** va **env** — qaysi servis va qaysi muhitda.
- **msg** — hodisaning qisqa va o‘zgarmas tavsifi, o‘zgaruvchilarsiz.
- **request_id** / **trace_id** — bitta so‘rov yozuvlarini bog‘lovchi identifikator.
- **error** — xato turi va matni, stack trace — alohida maydonda.

Asosiy odat: **o‘zgaruvchilar xabar matniga emas, maydonlarga yoziladi**. `msg: "payment failed"` barcha holatlarda bir xil, shuning uchun uni guruhlash oson.

## Loglash darajalari

| Daraja | Qachon ishlatiladi |
|---|---|
| **debug** | Ishlab chiqish uchun tafsilotlar; production’da odatda o‘chirilgan |
| **info** | Muhim odatiy hodisalar: ishga tushish, vazifa tugashi, foydalanuvchi kirishi |
| **warn** | Nimadir noto‘g‘ri ketdi, lekin tizim uddaladi: qayta urinish, fallback |
| **error** | Operatsiya bajarilmadi, reaksiya kerak |
| **fatal** | Jarayon ishni davom ettira olmaydi |

Agar error yozuvlari normal ish paytida paydo bo‘lsa, ularga reaksiya qilishni to‘xtatishadi. Daraja dasturchining kayfiyatini emas, harakatni bildirishi kerak.

## Request ID va correlation ID

So‘rov frontend, API, navbat va worker orqali o‘tganda uni to‘liq kuzatish kerak.

1. Kirish nuqtasida (balanser yoki birinchi servis) header’da ID bo‘lmasa, noyob ID yaratiladi.
2. ID logger kontekstiga qo‘yiladi va har bir yozuvga avtomatik tushadi.
3. Boshqa servislarni chaqirganda ID header’da uzatiladi, masalan `X-Request-ID` yoki W3C Trace Context’dagi standart `traceparent`.
4. ID javobda mijozga qaytariladi — foydalanuvchi uni qo‘llab-quvvatlash xizmatiga aytishi mumkin.

Agar OpenTelemetry ishlatsangiz, `trace_id` ni o‘shandan oling: loglar darhol trace’lar bilan bog‘lanadi.

## Loglarga hech qachon nima yozilmaydi

- Parollar, tokenlar, API kalitlar, sessiya cookie’lari, `Authorization` header’i.
- Karta raqamlari, pasport ma’lumotlari va boshqa sezgir shaxsiy ma’lumotlar.
- So‘rov va javoblarning to‘liq tanasi «har ehtimolga qarshi».
- Fayllar mazmuni va katta binar ma’lumotlar.

Har bir dasturchining e’tiboriga umid qilmasdan, logger darajasida **maskalash** (redaction) ni sozlang.

## Misollar

**Node.js (pino):**

```js
import pino from "pino";

const logger = pino({
  base: { service: "billing" },
  redact: ["req.headers.authorization", "password"],
});

const log = logger.child({ request_id: "a1b2c3" });
log.error({ user_id: 42, order_id: 981 }, "payment failed");
```

**Python (structlog):**

```python
import structlog

structlog.configure(processors=[
    structlog.processors.add_log_level,
    structlog.processors.TimeStamper(fmt="iso", utc=True),
    structlog.processors.JSONRenderer(),
])

log = structlog.get_logger().bind(service="billing", request_id="a1b2c3")
log.error("payment failed", user_id=42, order_id=981)
```

**Go (log/slog):**

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil)).
    With("service", "billing", "request_id", "a1b2c3")
logger.Error("payment failed", "user_id", 42, "order_id", 981)
```

## Ko‘p uchraydigan xatolar

- Turli servislarda bitta maydonning turli nomlari: `userId`, `user_id`, `uid`.
- Siklning har bir iteratsiyasida loglash — shovqin va ortiqcha xarajat.
- Oddiy matndagi ko‘p qatorli stack trace’lar alohida yozuvlarga bo‘linib ketadi.
- Konteyner ichida stdout o‘rniga fayllarga yozish.

## FAQ

### JSON loglarni ko‘z bilan o‘qish qiyin emasmi?

Lokal ishlab chiqishda «chiroyli» chiqishni yoqing (masalan, `pino-pretty` yoki structlog’ning konsol renderer’i), production’da esa JSON’ni qoldiring — uni log yig‘ish tizimi o‘qiydi.

### Loglar metrikalar va trace’lardan nimasi bilan farq qiladi?

Metrikalar vaqt bo‘yicha raqamlarni, trace’lar so‘rovning servislar orqali yo‘lini, loglar esa aniq hodisa tafsilotlarini ko‘rsatadi. Umumiy `trace_id` ularni o‘zaro bog‘laydi.

### Production’da qaysi daraja qo‘yiladi?

Odatda info. Debug aniq muammoni tahlil qilayotganda vaqtincha va nuqtali yoqiladi.
