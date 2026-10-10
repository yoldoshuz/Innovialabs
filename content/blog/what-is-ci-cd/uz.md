---
title: CI/CD nima: uzluksiz integratsiya va yetkazib berish oddiy tilda
description: Continuous integration, delivery va deployment qanday farqlanadi, odatiy pipeline qanday ko‘rinadi va avtomatik relizlar biznesga nima beradi.
summary: CI/CD — har bir kod o‘zgarishida loyihani yig‘adigan, testlarni o‘tkazadigan va serverlarga chiqaradigan avtomatik konveyer. Relizlar tez-tez, kichik va oldindan aytib bo‘ladigan bo‘ladi, xatolar esa ertaroq topiladi.
---
## CI/CD oddiy tilda

**CI/CD** — kodning dasturchidan foydalanuvchilarga yetib borish yo‘lini xotiraga tayanadigan odam emas, avtomatika bajaradigan amaliyot. Har bir o‘zgarish bir xil konveyerdan (**pipeline**) o‘tadi: yig‘ish, testlar, tekshiruvlar, joylashtirish.

Qisqartma uchta tushunchani birlashtiradi:

- **Continuous Integration (CI)** — uzluksiz integratsiya. Dasturchilar o‘zgarishlarni umumiy branch’ga tez-tez qo‘shadi va har bir o‘zgarishda yig‘ish va testlar avtomatik ishga tushadi. Maqsad — buzilish haqida bir haftadan keyin emas, bir necha daqiqada bilish.
- **Continuous Delivery** — uzluksiz yetkazib berish. Tekshiruvlardan o‘tgan har bir versiya chiqarishga tayyor. Production’ga chiqarish — bitta tugma, qarorni odam qabul qiladi.
- **Continuous Deployment** — uzluksiz joylashtirish. Yana bir qadam oldinga: barcha tekshiruvlardan o‘tgan versiya qo‘lda tasdiqlashsiz production’ga avtomatik chiqadi.

## Delivery va deployment farqi

| | Continuous Delivery | Continuous Deployment |
|---|---|---|
| Yig‘ish va testlar | avtomatik | avtomatik |
| Staging’ga chiqarish | avtomatik | avtomatik |
| Production’ga chiqarish | tugma bilan | avtomatik |
| Nima kerak | ishonchli testlar | juda ishonchli testlar va monitoring |
| Kimga mos | ko‘pchilik jamoalarga | testlar bilan yaxshi qoplangan tajribali jamoalarga |

Deyarli har doim CI va continuous delivery’dan boshlash kerak. To‘liq avtomatik deploy — jamoa o‘z testlariga ishonganda keyingi qadam.

## Odatiy pipeline bosqichma-bosqich

1. **Trigger.** Dasturchi kodni yuboradi yoki pull request ochadi.
2. **Yig‘ish.** Bog‘liqliklar o‘rnatiladi, loyiha kompilyatsiya qilinadi, Docker obrazi yig‘iladi.
3. **Statik tekshiruvlar.** Linterlar, formatlash, tiplarni tekshirish, bog‘liqliklarni ma’lum zaifliklarga skanerlash.
4. **Testlar.** Avval modul testlari, keyin integratsion testlar. Biror narsa yiqilsa — pipeline to‘xtaydi, muallif xabar oladi.
5. **Artefakt.** Tayyor yig‘ma noyob versiya bilan saqlanadi, masalan, kommit xeshi bilan teglangan obraz.
6. **Staging’ga deploy.** Xuddi shu yig‘ma production’ga o‘xshash test muhitiga chiqariladi.
7. **Qabul tekshiruvlari.** Ssenariylarning avtotestlari yoki qo‘lda tekshirish.
8. **Production’ga deploy.** Tugma bilan yoki avtomatik, iloji bo‘lsa bosqichma-bosqich.
9. **Monitoring va orqaga qaytarish.** Metrikalar yomonlashsa — oldingi versiyaga tezda qaytish.

GitHub Actions’dagi minimal pipeline misoli:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

Shunga o‘xshash pipeline’lar GitLab CI, Jenkins va boshqa tizimlarda ham quriladi — tamoyil bir xil.

## Bu biznesga nima beradi

- **Funksiyalar tezroq chiqadi.** Tayyor funksiya «katta reliz»ni kutmasdan, tekshiruvdan o‘tishi bilan foydalanuvchilarga yetib boradi.
- **Xavf kamroq.** Kichik va tez-tez bo‘ladigan relizlarni kamdan-kam bo‘ladigan katta relizlarga qaraganda tekshirish va orqaga qaytarish osonroq.
- **Qo‘l mehnati kamroq.** Hech kim fayllarni serverga qo‘lda ko‘chirmaydi va yo‘riqnomadagi qadamni unutmaydi.
- **Oldindan aytib bo‘ladiganlik.** Har bir versiya bir xil yig‘iladi va production’da hozir nima ishlayotgani doim aniq.
- **Bitta odamga bog‘liq emaslik.** Reliz jarayoni bitta dasturchining boshida emas, kodda tasvirlangan.

## Joriy qilishdagi keng tarqalgan xatolar

- **Testsiz pipeline.** Tekshirilmagan kodni avtomatik deploy qilish shunchaki xatolarni tezroq yetkazadi.
- **Sekin pipeline.** Tekshiruvlar juda uzoq davom etsa, ularni chetlab o‘ta boshlashadi. Bog‘liqliklarni keshlang, qadamlarni parallel ishga tushiring.
- **Beqaror testlar.** Tasodifan yiqiladigan testlar qizil statusni e’tiborsiz qoldirishga o‘rgatadi.
- **Repozitoriydagi maxfiy ma’lumotlar.** Parollar va kalitlar kodda emas, CI’ning himoyalangan o‘zgaruvchilarida saqlanadi.
- **Staging va production uchun turli yig‘malar.** Production’ga tekshiruvdan o‘tgan aynan o‘sha artefakt chiqishi kerak.
- **Orqaga qaytarish rejasi yo‘q.** Orqaga qaytarish deploy kabi oddiy amal bo‘lishi kerak.

Sintaksis bo‘yicha ma’lumot — [GitHub Actions hujjatlarida](https://docs.github.com/en/actions).

## FAQ

### Kichik jamoaga CI/CD kerakmi?

Ha, hech bo‘lmaganda asosiysi: har bir pull request uchun avtomatik testlar va bitta buyruq bilan deploy. Oddiy pipeline’ni sozlash odatda tez o‘zini oqlaydi, chunki chiqarishdagi qo‘lda qilinadigan xatolarni yo‘q qiladi.

### Qaysi vositani tanlash kerak?

Eng qulayi — kodingiz saqlanadigan tizimga o‘rnatilgani: GitHub uchun GitHub Actions, GitLab uchun GitLab CI. Jenkins kabi alohida server infratuzilmaga maxsus talablar bo‘lganda o‘zini oqlaydi.

### CI/CD DevOps bilan qanday bog‘liq?

DevOps — ishlab chiqish va ekspluatatsiyaning birgalikdagi ishiga kengroq yondashuv. CI/CD uning asosiy amaliyotlaridan biri bo‘lib, kodning production’gacha bo‘lgan yo‘lini avtomatlashtiradi.
