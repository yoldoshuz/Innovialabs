---
title: CI pipeline’ni tezlashtirish: keshlash, parallelizm va boshqalar
description: CI’ni tezlashtirishning amaliy usullari: tor joylarni o‘lchash, dependency’larni keshlash, parallel job’lar, faqat ta’sirlangan testlar va yengil image’lar.
summary: Avval qaysi qadamlar vaqt olishini o‘lchang, keyin dependency’larni keshlang, ishni parallel job’larga bo‘ling, faqat ta’sirlangan testlarni ishga tushiring va Docker image’larni kichraytiring.
---
## Qisqa javob

Sekin CI deyarli har doim vaqtni bir xil narsalarga sarflaydi: **dependency’larni yuklab olish**, **hammasini ketma-ket ishga tushirish** va **og‘ir image’larni yig‘ish**. Harakatlar tartibi:

1. Vaqt qayerga ketayotganini o‘lchash.
2. Dependency’lar va build artefaktlarini keshlash.
3. Mustaqil vazifalarni parallel qilish.
4. Faqat o‘zgarish ta’sir qilgan narsani ishga tushirish.
5. Image’lar va runner muhitini yengillashtirish.

## 1-qadam. Optimallashtirishdan oldin o‘lchang

Oxirgi bir nechta ishga tushirishni oching va har bir qadam qancha davom etganini yozib chiqing. Odatda vaqtning katta qismini bir-ikki qadam egallashi darhol ko‘rinadi. Ular hal qilinmaguncha qolganini optimallashtirish befoyda.

Nimalarga qarash kerak:

- **Runner kutish vaqti** — job bajarilmasdan navbatda turibdi.
- **Dependency o‘rnatish** — `npm ci`, `pip install`, `go mod download`.
- **Testlar** — qaysi to‘plamlar eng uzoq, alohida sekin testlar bormi.
- **Image yig‘ish** — layer cache haqiqatan ishlayaptimi.

## 2-qadam. Keshlash

Cache — eng arzon yutuq. Cache kaliti lock fayldan tuziladi: dependency’lar o‘zgarmaguncha ular cache’dan olinadi.

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
- run: npm ci
```

Yana nimalarni keshlash foydali:

- kompilyator va bundler cache’lari (masalan, `.next/cache`, Gradle cache, Go build cache);
- BuildKit orqali **Docker layer’lari** (`cache-from` / `cache-to`);
- e2e testlar uchun yuklab olingan brauzerlar.

Tiklashdan ko‘ra yuklab olish tezroq bo‘lgan narsani keshlamang va dependency’lar o‘zgarganda cache kaliti ham o‘zgarishini kuzating.

## 3-qadam. Parallelizm

Linter, type check, unit testlar va build odatda bir-biriga bog‘liq emas — ularni bir vaqtda **alohida job’lar** sifatida ishga tushiring.

Katta test to‘plamini matrix orqali qismlarga (**sharding**) bo‘lish mumkin:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npx playwright test --shard=${{ matrix.shard }}/4
```

Yodda tuting: har bir parallel job ishga tushish va dependency o‘rnatishga vaqt sarflaydi. Yutuq shu qo‘shimcha xarajatdan katta bo‘lgandagina bo‘lish mantiqli.

## 4-qadam. Faqat ta’sirlanganini ishga tushiring

Faqat README o‘zgargan bo‘lsa, to‘liq test to‘plamini ishlatishga hojat yo‘q.

- **Path filtrlari** (`paths`, `paths-ignore`) aloqasiz o‘zgarishlar uchun workflow’ni o‘tkazib yuboradi.
- Monorepo’larda Nx va Turborepo kabi vositalar dependency grafi bo‘yicha **ta’sirlangan paketlarni** aniqlaydi va vazifa natijalarini keshlaydi.
- Jest `--changedSince=origin/main`ni qo‘llab-quvvatlaydi.

Hech narsa o‘tkazib yuborilmasligi uchun to‘liq ishga tushirishni main branch yoki tungi jadval uchun qoldiring.

## 5-qadam. Yengil image’lar va muhit

- Dependency’larni buzmaydigan joylarda **slim/alpine** bazaviy image’lardan foydalaning.
- Multi-stage build: yakuniy image’da faqat ishga tushirish uchun kerakli narsa.
- Vositalar har safar o‘rnatilsa, ularni oldindan o‘z runner image’ingizga joylang.
- Git tarixi kerak bo‘lmasa, checkout’da `fetch-depth: 1` qo‘ying.

## Ko‘p uchraydigan xatolar

- Qadamlar davomiyligiga qaramay **ko‘r-ko‘rona optimallashtirish**.
- Avtomatik qayta ishga tushiriladigan **beqaror (flaky) testlar** — ular muammoni yashiradi va vaqtni yeydi.
- **Takrorlarni bekor qilish sozlanmagan.** Yangi push o‘sha branch’dagi eski ishga tushirishni bekor qilishi uchun `concurrency` va `cancel-in-progress`dan foydalaning.
- Dependency o‘rnatish ishning o‘zidan uzoqroq davom etadigan **haddan tashqari mayda job’lar**.

## FAQ

### Vaqt kam bo‘lsa, nimadan boshlash kerak?

Dependency’larni keshlash va `concurrency` orqali eskirgan ishga tushirishlarni bekor qilishdan. Bu bir necha qator konfiguratsiya, ta’siri esa deyarli har qanday loyihada seziladi.

### Hamma testlarni ishga tushirmaslik xavfli emasmi?

Bilvosita bog‘liqlikni o‘tkazib yuborish xavfi bor, shuning uchun tanlab ishga tushirish main’ga merge qilishdan oldin yoki jadval bo‘yicha to‘liq ishga tushirish bilan birga qo‘llanadi. Dependency grafidan foydalanadigan vositalar bu xavfni kamaytiradi.

### Kuchliroq runner’lar yordam beradimi?

Tor joy CPU’da — kompilyatsiya yoki testlarda bo‘lsa, ha. Vaqt yuklab olish va kutishga ketsa, quvvat deyarli hech narsa bermaydi. Shuning uchun avval o‘lchov, keyin qaror.
