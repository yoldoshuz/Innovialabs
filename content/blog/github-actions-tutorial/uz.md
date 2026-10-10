---
title: Yangi boshlovchilar uchun GitHub Actions: birinchi CI-payplayn
description: GitHub Actions’da workflow, trigger, job va step nima va birinchi CI-payplaynni qanday yig‘ish: bog‘liqliklar, linter, testlar va build.
summary: GitHub Actions repozitoriyadagi hodisalarda .github/workflows’dagi YAML faylni ishga tushiradi; birinchi CI-payplayn — har bir push va pull request’da kodni yuklab, bog‘liqliklarni o‘rnatib, linter, testlar va build’ni ishga tushiradigan bitta job.
---

## GitHub Actions nima

**GitHub Actions** — GitHub’ga o‘rnatilgan avtomatlashtirish tizimi. Siz YAML faylda repozitoriyada hodisa yuz berganda nima qilish kerakligini yozasiz, GitHub esa buni o‘z virtual mashinasida bajaradi. Eng ko‘p qo‘llanilishi — **CI** (continuous integration): har bir o‘zgarish avtomatik ravishda linter va testlar bilan tekshiriladi, shunda buzilgan kod asosiy branch’ga bilinmasdan tushib qolmaydi.

## Asosiy tushunchalar

| Tushuncha | Bu nima |
|---|---|
| **Workflow** | `.github/workflows` papkasidagi `.yml` fayl. Repozitoriyada bir nechta bo‘lishi mumkin |
| **Trigger** (`on`) | Workflow’ni ishga tushiradigan hodisa: push, pull request, jadval, qo‘lda ishga tushirish |
| **Job** | Bitta mashinada bajariladigan qadamlar to‘plami. Job’lar standart holatda parallel ishlaydi |
| **Step** | Alohida buyruq (`run`) yoki tayyor amal (`uses`) |
| **Runner** | Job bajariladigan mashina, masalan `ubuntu-latest` |
| **Action** | Marketplace’dagi qayta ishlatiladigan qadam, masalan `actions/checkout` |

## Birinchi payplayn qadamma-qadam

Node.js loyihasi uchun misol. `.github/workflows/ci.yml` faylini yarating:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

Bu yerda nima sodir bo‘ladi:

1. **on** — payplayn `main`ga push qilinganda va har bir pull request’da ishga tushadi.
2. **actions/checkout** — repozitoriya kodini runner’ga yuklaydi. Bu qadamsiz mashina bo‘sh bo‘ladi.
3. **actions/setup-node** — Node.js’ni o‘rnatadi va npm paketlarini keshlaydi, keyingi ishga tushirishlar tezroq bo‘ladi.
4. **npm ci** — qat’iy `package-lock.json` bo‘yicha toza o‘rnatish. CI uchun bu `npm install`dan yaxshiroq.
5. Linter, testlar va build. Biror qadam noldan farqli kod bilan tugasa, job muvaffaqiyatsiz bo‘ladi va GitHub commit yonida qizil belgi ko‘rsatadi.

Commit va push qiling — ishga tushirish repozitoriyaning **Actions** bo‘limida paydo bo‘ladi.

## Foydali yaxshilashlar

**Eskirgan ishga tushirishlarni bekor qilish.** Ketma-ket bir necha marta push qilsangiz, eski commit’larni tekshirishning ma’nosi yo‘q:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

**Versiyalar matritsasi.** Bitta konfiguratsiya bilan bir nechta Node.js versiyasida tekshirish:

```yaml
strategy:
  matrix:
    node: [18, 20, 22]
```

va setup-node qadamida `node-version: ${{ matrix.node }}`.

**Job’lar orasidagi bog‘liqlik.** `needs: check` kaliti, masalan, deploy job’ini muvaffaqiyatli tekshiruvni kutishga majbur qiladi.

**Branch himoyasi.** Repozitoriya sozlamalarida `main` uchun pull request’ni birlashtirishdan oldin CI muvaffaqiyatli o‘tishini talab qiladigan qoida yoqing. Aynan shu CI’ni «bildirishnoma»dan haqiqiy himoyaga aylantiradi.

## Marketplace’dan action’larni qanday tanlash

- Rasmiy action’larni (`actions/*`) va vositaning o‘z mualliflari chiqargan action’larni afzal ko‘ring.
- Versiyani qotiring: kamida asosiy versiyani (`@v4`), maksimal xavfsizlik uchun esa commit’ning to‘liq SHA’sini.
- Action secret’lar bilan nima qilishini tekshiring: uchinchi tomon kodiga token’larni sababsiz bermang.

## Ko‘p uchraydigan xatolar

- Fayl `.github/workflows`da emas yoki YAML chekinishlarida xato bor.
- `actions/checkout` unutilgan va buyruqlar loyiha fayllarini topa olmaydi.
- `npm ci` o‘rniga `npm install` — build lokal build’dan farq qilishi mumkin.
- Secret’lar `echo` orqali logga chiqarilgan. Ularni **Settings → Secrets**da saqlang va `${{ secrets.NAME }}` ko‘rinishida murojaat qiling.

## FAQ

### GitHub Actions pullikmi?

Ochiq repozitoriyalar uchun standart runner’lar bepul. Yopiq repozitoriyalar uchun tarifga qarab oylik daqiqalar limiti bor, undan ortig‘i pullik. Amaldagi shartlarni GitHub hujjatlarida tekshiring.

### Workflow’ni qo‘lda ishga tushirish mumkinmi?

Ha, `on` ostiga `workflow_dispatch` trigger’ini qo‘shing. Shundan so‘ng Actions bo‘limida qo‘lda ishga tushirish tugmasi paydo bo‘ladi.

### GitHub Actions GitLab CI yoki Jenkins’dan nimasi bilan farq qiladi?

Tamoyil bir xil — payplayn kod yonidagi faylda tasvirlanadi. Actions’ning asosiy afzalligi — GitHub’ga to‘liq integratsiyasi va tayyor action’larning katta Marketplace’i. Jenkins o‘z serverini talab qiladi, GitLab CI esa kod GitLab’da saqlansa mantiqiy.
