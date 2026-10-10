---
title: Yaxshi commit xabarlarini yozish: Conventional Commits
description: Tushunarli commit xabarlari qoidalari, Conventional Commits formati misollar bilan hamda u changelog va versiyalarni avtomatik yangilashga qanday yordam beradi.
summary: Yaxshi commit nima va nega o‘zgarganini bitta qisqa qatorda aytadi; Conventional Commits unga feat yoki fix kabi tur qo‘shadi va vositalar shu turlar bo‘yicha versiyani hisoblab, changelog yozadi.
---
## Qisqa javob

Yaxshi commit xabari — bu **buyruq maylidagi qisqa qator**, undan yarim yildan keyin ham nima o‘zgarganini tushunish mumkin, agar sabab aniq bo‘lmasa, «nega»ni tushuntiruvchi tana ham bo‘ladi. **Conventional Commits** — shu qator formati haqidagi kelishuv:

```text
<tur>(<soha>): <tavsif>

<tana — ixtiyoriy>

<futer — ixtiyoriy>
```

Masalan: `fix(cart): sahifa yangilanganda savatni tozalamaslik`.

## Har qanday commit uchun asosiy qoidalar

- **Bitta commit — bitta mantiqiy o‘zgarish.** Bug tuzatish, qayta nomlash va bog‘liqliklarni yangilashni aralashtirmang.
- **Sarlavha qisqa**, taxminan 50–72 belgigacha, shunda u `git log --oneline` va interfeyslarda kesilmaydi.
- **Buyruq mayli:** «add», «fix», «remove» — go‘yo kod bazasiga buyruq berayotgandek. O‘zbek tilida «qo‘shish», «tuzatish» kabi yoziladi.
- **Sarlavha oxirida nuqta qo‘yilmaydi.**
- **Sarlavha va tana orasida bo‘sh qator.**
- **Tana «nega» savoliga javob beradi**, diff’ni qayta hikoya qilmaydi. Nima o‘zgargani kodda ko‘rinadi, nega — yo‘q.
- **Vazifaga havolalar** — futerda: `Refs: #123`.

Yomon: `fix`, `tuzatishlar`, `wip`, `update files`.
Yaxshi: `fix(auth): tokenni muddati tugagandan keyin emas, oldin yangilash`.

## Conventional Commits formati

Spetsifikatsiya faqat `feat` va `fix` turlarini majburiy deb ataydi, qolganlari keng tarqalgan kelishuv (masalan, commitlint konfiglari ularni taklif qiladi):

| Tur | Qachon ishlatiladi |
|---|---|
| `feat` | foydalanuvchi uchun yangi funksionallik |
| `fix` | bug tuzatish |
| `docs` | faqat hujjatlar |
| `style` | formatlash, mantiq o‘zgarmaydi |
| `refactor` | yangi funksiya ham, tuzatish ham bo‘lmagan kod o‘zgarishi |
| `perf` | unumdorlikni yaxshilash |
| `test` | testlarni qo‘shish yoki tuzatish |
| `build` | build tizimi, bog‘liqliklar |
| `ci` | CI sozlamalari |
| `chore` | boshqa xizmat o‘zgarishlari |

Qavs ichidagi **soha** (scope) ixtiyoriy va modulni ko‘rsatadi: `feat(api)`, `fix(checkout)`.

### Breaking changes

Mos kelmaydigan o‘zgarish ikki usulda belgilanadi — undov belgisi yoki futer bilan:

```text
feat(api)!: eskirgan /v1/orders endpoint’ini olib tashlash

BREAKING CHANGE: mijozlar /v2/orders ga o‘tishi kerak.
```

## Misollar

```text
feat(search): narx bo‘yicha filtr qo‘shish
fix(payments): provayderning takroriy callback’ini to‘g‘ri qayta ishlash
docs: loyihani Docker’da ishga tushirishni tavsiflash
refactor(user): validatsiyani alohida modulga chiqarish
perf(catalog): kategoriyalar ro‘yxatini keshlash
```

## Bu nima uchun kerak: changelog va versiyalar

Tuzilgan xabarlarni mashina tahlil qila oladi. Bu commit’larni **semantik versiyalash** (SemVer) bilan bog‘laydi:

| Oxirgi relizdan beri commit’lar | Yangi versiya |
|---|---|
| faqat `fix` | patch: 1.4.2 → 1.4.3 |
| kamida bitta `feat` | minor: 1.4.2 → 1.5.0 |
| `!` yoki `BREAKING CHANGE` | major: 1.4.2 → 2.0.0 |

**semantic-release**, **release-please** yoki **standard-version** kabi vositalar tarixni o‘qiydi, keyingi versiyani hisoblaydi, «Features» va «Bug Fixes» bo‘limlari bilan `CHANGELOG.md` yaratadi va teg qo‘yadi. `docs`, `chore`, `style` turlari odatda changelog’ga tushmaydi.

Qo‘shimcha foyda — tarixda qidirish qulay bo‘ladi: `git log --grep "^fix(payments)"`.

## Jamoaga qanday joriy qilish

1. **Turlar va sohalar ro‘yxatini kelishib oling** va ularni README yoki CONTRIBUTING’ga yozing.
2. **Tekshiruv qo‘shing**: `@commitlint/config-conventional` konfigli commitlint’ni git hook orqali yoki CI’da.
3. **Squash merge ishlatsangiz**, PR sarlavhasini tekshiring — aynan u main’dagi commit xabariga aylanadi.
4. **Format o‘rnashgach, avtomatik relizni ulang.**

## Ko‘p uchraydigan xatolar

- **Hamma narsa `chore` deb belgilanadi.** Changelog bo‘sh qoladi, versiyalar o‘smaydi.
- **Ichki o‘zgarishlar uchun `feat`.** `feat` — mahsulot yoki API foydalanuvchisi sezadigan narsa.
- **Unutilgan `BREAKING CHANGE`.** Iste’molchilar mos kelmaydigan yangilanishni minor sifatida oladi.
- **Tur bor, ma’no yo‘q:** `fix: fix bug` oddiy `fix`dan yaxshi emas.

## FAQ

### Commit’larni ingliz tilida yozish shartmi?

Yo‘q. Spetsifikatsiya tilni talab qilmaydi, lekin turlar (`feat`, `fix`) inglizcha qoladi, chunki vositalar ularga tayanadi. Asosiysi — butun loyihada bitta til.

### Bitta commit’da ham ficha, ham tuzatish bo‘lsa-chi?

Imkon bo‘lsa, uni ikkita commit’ga ajrating. Bo‘lmasa, eng muhim o‘zgarish bo‘yicha tur tanlang — versiya uchun `feat` muhimroq.

### Conventional Commits kichik loyihalarga mos keladimi?

Ha, avtomatik relizlarsiz ham u tarixni o‘qiladigan qiladi. `feat`, `fix`, `docs`, `refactor` va `chore`dan boshlang, qolganlarini kerak bo‘lganda qo‘shasiz.
