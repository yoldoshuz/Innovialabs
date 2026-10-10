---
title: To‘xtovsiz deploy: usullar va bosqichma-bosqich sozlash
description: Relizlarni to‘xtalishsiz chiqarish: rolling restart, health checks, graceful shutdown, ulanishlarni bo‘shatish va orqaga mos ma’lumotlar bazasi migratsiyalari.
summary: Yangi nusxalar eskilari to‘xtashidan oldin ishga tushib, tayyorlik tekshiruvidan o‘tishi, eskilari joriy so‘rovlarni tugatib chiqishi, baza sxemasi esa ikkala versiya bilan bir vaqtda ishlashi kerak.
---

## To‘xtovsiz deploy uchun aslida nima kerak

To‘xtalishsiz reliz bitta usul emas, balki birgalikda ishlaydigan to‘rtta qoida:

- **Bosqichma-bosqich almashtirish**: yangi nusxalar eskilari olib tashlanishidan oldin ishga tushadi, shuning uchun quvvat hech qachon nolga tushmaydi.
- **Health checks**: trafik faqat tayyorligini bildirgan nusxalarga yuboriladi.
- **Graceful shutdown va ulanishlarni bo‘shatish**: eski nusxa yangi so‘rovlarni qabul qilishni to‘xtatadi, joriylarini tugatadi va shundan keyingina yopiladi.
- **Orqaga mos migratsiyalar**: deploy paytida eski va yangi kod bitta baza bilan parallel ishlaydi, shuning uchun sxema ikkalasiga ham mos bo‘lishi kerak.

Agar bulardan bittasi bo‘lmasa, infratuzilma qanchalik yaxshi bo‘lmasin, foydalanuvchilar har bir deployda xatolarni ko‘radi.

## Rolling restart

Rolling update’da orkestrator (Kubernetes, Docker Swarm, Nomad yoki balanser ortidagi skript) nusxalarni kichik guruhlar bilan almashtiradi:

1. Bitta yangi nusxani ishga tushiradi.
2. U readiness tekshiruvidan o‘tishini kutadi.
3. Uni balanserga qo‘shadi.
4. Bitta eski nusxani balanserdan chiqaradi, ulanishlarni bo‘shatishga vaqt beradi va to‘xtatadi.
5. Barcha nusxalar yangi versiyaga o‘tguncha takrorlaydi.

Asosiy sozlamalar: yangilanish paytida **qancha qo‘shimcha nusxa bo‘lishi mumkin** va **qanchasi ishlamay turishi mumkin**. To‘xtalishsiz ishlash uchun — nol ishlamaydigan va kamida bitta qo‘shimcha.

Xuddi shu maqsaddagi muqobillar: **blue-green** (ikkita to‘liq muhit, trafik birdaniga o‘tkaziladi) va **canary** (avval trafikning kichik qismi yangi versiyaga yo‘naltiriladi). Ikkalasi ham health checks va ulanishlarni bo‘shatishga tayanadi.

## Health checks: liveness va readiness

Bu ikki tekshiruvni aralashtirmang:

- **Readiness** «hozir trafik qabul qila olamanmi?» degan savolga javob beradi. U ishga tushish, keshni qizdirish va to‘xtash paytida xato qaytarishi kerak.
- **Liveness** «qotib qoldimmi, meni qayta ishga tushirish kerakmi?» degan savolga javob beradi. Uni oddiy saqlang va bazani tekshirmang, aks holda bazadagi qisqa nosozlik barcha nusxalarni birdaniga qayta ishga tushiradi.

Har doim 200 qaytaradigan readiness endpoint — «to‘xtovsiz» deploy baribir so‘rovlarni yo‘qotishining eng ko‘p uchraydigan sababi.

## Graceful shutdown va ulanishlarni bo‘shatish

Konteynerni to‘xtatayotganda orkestrator **SIGTERM** yuboradi, grace period davomida kutadi, keyin SIGKILL yuboradi. Ilova shu oynadan foydalanishi kerak. Node.js’dagi minimal misol:

```js
const express = require('express');
const app = express();
let shuttingDown = false;

app.get('/healthz/ready', (req, res) => {
  res.status(shuttingDown ? 503 : 200).end();
});

const server = app.listen(3000);

process.on('SIGTERM', () => {
  shuttingDown = true;
  setTimeout(() => {
    server.close(() => process.exit(0));
  }, 5000);
});
```

Tartib muhim: avval nusxani tayyor emas deb belgilang, balanser unga trafik yuborishni to‘xtatishi uchun bir necha soniya kuting, so‘ng serverni yoping — ochiq so‘rovlar tugashga ulguradi. Fon worker’lari yangi vazifalarni olishni to‘xtatib, joriysini tugatishi yoki navbatga qaytarishi kerak.

## Kubernetes uchun ishlaydigan misol

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  template:
    metadata:
      labels:
        app: api
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: api
          image: registry.example.com/api:1.4.2
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /healthz/ready
              port: 3000
            periodSeconds: 5
            failureThreshold: 2
```

`maxUnavailable: 0` to‘liq quvvatni saqlaydi, `maxSurge: 1` pod’larni bittadan qo‘shadi, grace period esa bo‘shatish kechikishi va eng uzoq so‘rov yig‘indisidan katta bo‘lishi kerak.

## Orqaga mos baza migratsiyalari

**Expand and contract** patternidan foydalaning. Misol: `name` ustunini `full_name` deb qayta nomlash.

| Reliz | Ma’lumotlar bazasi | Kod |
|---|---|---|
| 1. Expand | `full_name` qo‘shish, nullable | Ikkala ustunga yozish, `name`’dan o‘qish |
| 2. Backfill | Ma’lumotlarni qismlab ko‘chirish | O‘zgarishsiz |
| 3. Switch | O‘zgarishsiz | Faqat `full_name` bilan ishlash |
| 4. Contract | `name`’ni o‘chirish | O‘zgarishsiz |

Bundan kelib chiqadigan qoidalar:

- Kod ustundan foydalanishni to‘xtatgan relizning o‘zida uni hech qachon qayta nomlamang yoki o‘chirmang.
- Yangi ustunlarni nullable yoki standart qiymat bilan qo‘shing.
- Og‘ir ko‘chirishlarni bitta bloklovchi so‘rov bilan emas, qismlab bajaring.
- Migratsiyalarni har bir nusxa ishga tushganda emas, deploydan oldin alohida qadam sifatida ishga tushiring.

## Ko‘p uchraydigan xatolar

- Readiness tekshiruvi to‘xtash holatini hisobga olmaydi.
- Grace period eng uzoq so‘rov yoki vazifadan qisqa.
- Buzuvchi migratsiya kod bilan birga chiqariladi.
- Sessiyalar nusxa xotirasida saqlanadi va u to‘xtaganda foydalanuvchilar tizimdan chiqib ketadi.
- Orqaga qaytish tekshirilmagan: oldingi versiya ham yangi sxema bilan ishlashi kerak.

## FAQ

### To‘xtovsiz deploy uchun Kubernetes shartmi?

Yo‘q. Xuddi shu qadamlar nginx yoki bulutli balanser va ikki va undan ortiq nusxa bilan ishlaydi. Kubernetes shunchaki rolling update va tekshiruvlarni avtomatlashtiradi.

### Bitta server yetarlimi?

Bitta mashinada ilovaning ikkita jarayonini ishga tushirib, trafikni ular orasida almashtirish mumkin, lekin OS yangilanishi yoki nosozlikda serverning o‘zi yagona nosozlik nuqtasi bo‘lib qoladi.

### Qanday qilib xavfsiz orqaga qaytish mumkin?

Sxemani oldingi reliz bilan mos holda saqlang va eski image’ni qayta deploy qiling. Shu sababli sxemadagi buzuvchi o‘zgarishlar faqat yangi kod bir muddat barqaror ishlagandan keyin qilinadi.
