---
title: Twelve-Factor App metodologiyasi: qulay deploy tamoyillari
description: Twelve-Factor App’ning o‘n ikki omili sodda tilda: konfiguratsiya muhit o‘zgaruvchilarida, holatsiz jarayonlar, loglar oqim sifatida va dev/prod o‘xshashligi.
summary: Twelve-Factor App — ilovani istalgan muhitda bir xil ishga tushirish uchun o‘n ikki qoida: bitta kod bazasi, konfiguratsiya muhit o‘zgaruvchilarida, holatsiz jarayonlar, loglar stdout’ga va dev bilan prod o‘rtasida minimal farq.
---
## Qisqa javob

**Twelve-Factor App** — bulutda, konteynerlarda yoki oddiy serverlarda ishlaydigan veb-ilovalar va servislar uchun o‘n ikki tamoyil. Maqsad bitta: ilova hamma joyda — dasturchi noutbukida, staging’da va production’da — **bir xil yig‘ilishi, sozlanishi va ishga tushishi** hamda yangi jarayonlar qo‘shish orqali oson masshtablanishi kerak.

Metodologiya biror til yoki freymvorkka bog‘liq emas. Uning g‘oyalari Docker, Kubernetes va ko‘pchilik PaaS platformalar asosida yotadi.

## O‘n ikki omil

| № | Omil | Mohiyati |
|---|------|----------|
| 1 | Codebase | Versiyalar nazoratida bitta kod bazasi, ko‘plab deploy’lar |
| 2 | Dependencies | Bog‘liqliklar aniq e’lon qilingan va izolyatsiya qilingan |
| 3 | Config | Konfiguratsiya muhit o‘zgaruvchilarida saqlanadi |
| 4 | Backing services | Ma’lumotlar bazasi, kesh, navbatlar — URL orqali ulanadigan resurslar |
| 5 | Build, release, run | Yig‘ish, reliz va ishga tushirish qat’iy ajratilgan |
| 6 | Processes | Jarayonlar holatsiz, lokal hech narsa saqlanmaydi |
| 7 | Port binding | Servis portni o‘zi tinglaydi va HTTP’ni taqdim etadi |
| 8 | Concurrency | Qo‘shimcha jarayonlar orqali masshtablash |
| 9 | Disposability | Tez ishga tushish va to‘g‘ri to‘xtash |
| 10 | Dev/prod parity | Muhitlar iloji boricha o‘xshash |
| 11 | Logs | Loglar — stdout’ga yoziladigan hodisalar oqimi |
| 12 | Admin processes | Bir martalik vazifalar xuddi shu kod va muhitda bajariladi |

## Konfiguratsiya muhit o‘zgaruvchilarida

Muhitlar orasida o‘zgaradigan hamma narsa — ma’lumotlar bazasi manzili, API kalitlari, flaglar — **koddan tashqarida** turadi. Oddiy tekshiruv: repozitoriyni hozir ochiq qilsangiz, birorta sir oshkor bo‘lmaydimi?

```python
import os

DATABASE_URL = os.environ["DATABASE_URL"]
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
DEBUG = os.environ.get("DEBUG", "false") == "true"
```

Lokal muhitda qiymatlarni `.gitignore`’ga qo‘shilgan `.env` faylida saqlash mumkin, serverda esa ular orkestrator yoki sirlar menejeri orqali uzatiladi. Qiymatlari kodga yozib qo‘yilgan `config.production.py` kabi fayllardan qoching: bu ham sirlarning sizib chiqishi, ham “alohida” muhitlarning ko‘payishi demak.

## Holatsiz jarayonlar

Ilova jarayoni so‘rovlar orasida muhim hech narsani saqlamasligi kerak: **sessiyalar, yuklangan fayllar, kesh** Redis, ma’lumotlar bazasi yoki obyektli omborga chiqariladi.

- Foydalanuvchi avatar yukladi — fayl diskdagi `uploads/` papkasiga emas, S3 bilan mos omborga tushadi.
- Sessiya jarayon xotirasida emas, Redis’da yoki imzolangan cookie’da saqlanadi.

Shunda istalgan nusxani qayta ishga tushirish yoki o‘chirish mumkin, yuklama esa “yopishqoq” sessiyalarsiz bir nechta nusxa orasida taqsimlanadi.

## Loglar oqim sifatida

Ilova **log fayllarini o‘zi boshqarmaydi**. U hodisalarni `stdout`/`stderr`’ga yozadi, yig‘ish, rotatsiya va saqlash bilan esa muhit shug‘ullanadi: Docker, systemd, Fluent Bit yoki Vector kabi agent, Loki yoki ELK kabi tizim.

```javascript
console.log(JSON.stringify({ level: "info", msg: "order created", orderId }));
```

Tuzilgan JSON’ni filtrlash va qidirish qulay. Konteyner ichida fayllarni rotatsiya qilish esa yo‘qolgan loglar va to‘lib qolgan diskka olib keladi.

## Dev va prod o‘xshashligi

O‘n ikki omilli ilova uchta uzilishni qisqartiradi: **vaqt** (kod production’ga tez yetib boradi), **odamlar** (dasturchilar deploy’da ishtirok etadi) va **vositalar**.

Odatiy xato — lokal SQLite va serverda PostgreSQL. SQL’dagi kichik farqlar faqat production’da namoyon bo‘ladi. Yechim — Docker Compose orqali lokalda xuddi shu servislarni xuddi shu asosiy versiyalarda ko‘tarish.

## Qolgan omillar amalda

- **Bog‘liqliklar:** lock-fayllar (`package-lock.json`, `poetry.lock`) repozitoriyda, “global o‘rnatilgan” utilitalarga tayanmaslik.
- **Build, release, run:** obraz bir marta yig‘iladi, teg oladi va aynan shu obraz staging’dan production’ga o‘tadi. Serverda kodni tahrirlash mumkin emas.
- **Port binding:** ilova `PORT` o‘zgaruvchisidagi portda HTTP serverni o‘zi ko‘taradi, uning oldida nginx yoki balanslovchi turadi.
- **Disposability:** `SIGTERM`’ni qayta ishlang — joriy so‘rovlarni tugating, ulanishlarni yoping va chiqing.
- **Admin processes:** migratsiyalar va skriptlar xuddi shu relizdan alohida jarayon sifatida ishga tushadi, masalan `docker compose run app python manage.py migrate`.

## Ko‘p uchraydigan xatolar

- Sirlar repozitoriyda yoki Docker obrazi ichida.
- Foydalanuvchi fayllari konteynerning lokal diskida.
- Dev va prod’da ma’lumotlar bazasining turli versiyalari.
- Reliz jarayonini chetlab o‘tib, production serverda qo‘lda tuzatish kiritish.

## FAQ

### Barcha o‘n ikki omilga birdaniga amal qilish shartmi?

Yo‘q. Eng foydalilaridan boshlang: konfiguratsiya muhitda, holatsiz jarayonlar, loglar stdout’ga va dev hamda prod’da bir xil servislar. Qolganlari odatda konteynerlar va CI/CD’ga o‘tganingizda o‘z-o‘zidan joyiga tushadi.

### Metodologiya monolit uchun ham mos keladimi?

Ha. Twelve-Factor ilovaning ichki arxitekturasini emas, balki qanday ishga tushirilishi va sozlanishini tasvirlaydi. Bu tamoyillarga amal qiladigan monolitni ham xuddi shunday oson deploy qilish va masshtablash mumkin.

### Kodda bo‘lmasa, sirlarni qayerda saqlash kerak?

Himoyalangan manbadan to‘ldiriladigan muhit o‘zgaruvchilarida: CI/CD sirlari, Kubernetes Secrets, Vault yoki bulut provayderining sirlar menejeri.
