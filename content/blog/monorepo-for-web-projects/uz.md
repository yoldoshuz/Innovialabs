---
title: Veb-loyihalar uchun monorepozitoriy: Turborepo, Nx va pnpm
description: Monorepozitoriyda UI va tiplarni sayt, admin panel va API o‘rtasida qanday bo‘lishish, vazifalar keshi va pnpm workspaces, Turborepo, Nx farqlari.
summary: Monorepozitoriy sayt, admin panel, API va umumiy paketlarni bitta repozitoriyda saqlaydi; pnpm workspaces paketlarni bog‘laydi, Turborepo yoki Nx esa kesh va faqat ta’sirlangan vazifalarni ishga tushirish orqali yig‘ishni tezlashtiradi.
---

## Monorepozitoriy nima beradi

**Monorepozitoriy** — bir nechta ilova va kutubxonalar yashaydigan bitta Git-repozitoriy. Odatiy veb-loyiha: ommaviy sayt, admin panel, API va umumiy paketlar — UI komponentlar, tiplar, konfiglar.

Asosiy foydalari:

- **Frontend va API o‘rtasida umumiy tiplar.** Modeldagi maydonni o‘zgartirdingiz — TypeScript buzilgan barcha joylarni darhol ko‘rsatadi.
- Sayt va admin panel uchun npm ga paket chiqarmasdan **yagona dizayn-tizim**.
- **Atomar o‘zgarishlar**: API va klient tuzatishi bitta kommit va bitta pull request da.
- **Yagona qoidalar**: bitta linter, formatlash va bog‘liqlik versiyalari to‘plami.

Narxi — vositalar: ularsiz har o‘zgarishda barcha paketlarni yig‘ish va test qilish sekinlashadi.

## Tuzilma namunasi

```text
my-project/
├── apps/
│   ├── web/          # ommaviy sayt (Next.js)
│   ├── admin/        # admin panel
│   └── api/          # backend (Node.js)
├── packages/
│   ├── ui/           # umumiy komponentlar
│   ├── types/        # umumiy tiplar va sxemalar
│   └── config/       # eslint, tsconfig
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Qoida: **ilovalar paketlarga bog‘liq, lekin bir-biriga emas**. Agar admin panelga sayt kodi kerak bo‘lsa — uni `packages/` ga chiqaring.

## 1-qatlam: pnpm workspaces

**pnpm workspaces** repozitoriy ichidagi paketlarni bog‘laydi. Ular qayerda joylashganini ko‘rsatish kifoya:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

Va ilovada lokal paketni ulash:

```json
{
  "dependencies": {
    "@acme/ui": "workspace:*"
  }
}
```

pnpm lokal papkaga havola yaratadi, shuning uchun `packages/ui` dagi o‘zgarishlar `apps/web` da darhol ko‘rinadi. pnpm o‘zi nimani qayta yig‘ish va keshlashni bilmaydi — bu orkestratorlar vazifasi.

## 2-qatlam: vazifalar orkestratori va kesh

Orkestrator paketlar orasidagi bog‘liqliklar grafini tushunadi va quyidagilarni qila oladi:

- vazifalarni (`build`, `test`, `lint`) to‘g‘ri tartibda va parallel ishga tushirish;
- **natijalarni keshlash**: paketning kirish fayllari o‘zgarmagan bo‘lsa, natija qayta hisoblanmasdan keshdan olinadi;
- vazifalarni **faqat o‘zgarish ta’sir qilgan** paketlar uchun ishga tushirish;
- **masofaviy kesh** orqali keshni dasturchilar va CI o‘rtasida bo‘lishish.

Turborepo konfiguratsiyasi namunasi:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "test": { "dependsOn": ["^build"] }
  }
}
```

`^build` — «avval shu paketning bog‘liqliklarini yig‘» degani. Konfiguratsiya formati major versiyalar orasida o‘zgaradi, shuning uchun o‘z versiyangiz hujjatlari bilan solishtiring.

## Turborepo, Nx yoki faqat pnpm

| Mezon | pnpm workspaces | Turborepo | Nx |
|---|---|---|---|
| Bu nima | Paket menejeri | Yengil vazifalar orkestratori | Monorepozitoriylar uchun to‘liq platforma |
| Vazifalar keshi | Yo‘q | Ha, lokal va masofaviy | Ha, lokal va masofaviy |
| O‘rganish qiyinligi | Minimal | Past | Yuqoriroq |
| Kod generatorlari, plaginlar | Yo‘q | Minimal | Ko‘p |
| Paketlar chegarasini nazorat qilish | Yo‘q | Cheklangan | Bog‘liqlik qoidalari bor |
| Kimga mos | 2–3 paket, oddiy skriptlar | Ko‘pchilik JS/TS loyihalar | Yirik repozitoriylar, ko‘p jamoalar |

Amaliy yo‘l: **pnpm workspaces** dan boshlang, yig‘ish sezilarli sekinlashganda **Turborepo** qo‘shing, qat’iy chegaralar, generatorlar va katta miqyos kerak bo‘lsa **Nx** ga qarang.

## Ko‘p uchraydigan xatolar

- Paketlar orasida **siklik bog‘liqliklar**: `ui` `types` dan import qiladi, `types` esa `ui` dan.
- Kodni umumiy paketga chiqarish o‘rniga **qo‘shni ilovadan import qilish**.
- Kesh sozlamalarida **noto‘g‘ri `outputs`**: kesh noto‘g‘ri fayllarni tiklaydi yoki hech narsani tiklamaydi.
- **Muhit o‘zgaruvchilari keshda hisobga olinmagan**: boshqa qiymatlar bilan yig‘ish eski natijani oladi.
- Turli ilovalarda sababsiz **bitta kutubxonaning turli versiyalari**.
- **Umumiy paketlardagi maxfiy kalitlar**: `packages/` dagi kod klient bandliga tushib qolishi mumkin.

## FAQ

### Bitta sayt uchun monorepozitoriy kerakmi?

Yo‘q. U umumiy kodga ega bir nechta ilova bo‘lganda foydali: sayt va admin panel, veb va API, bitta dizayn-tizimdagi bir nechta sayt.

### Monorepozitoriyda mobil ilovani saqlasa bo‘ladimi?

Ha, agar u JavaScript yoki TypeScript da bo‘lsa, masalan React Native: tiplar, validatsiya sxemalari va API-klient umumiy bo‘lishi mumkin. Veb va mobil uchun UI komponentlar odatda farq qiladi.

### Monorepozitoriydagi ilovalarni alohida qanday deploy qilish kerak?

Har bir ilova paket bo‘yicha filtrlangan o‘z buyrug‘i bilan yig‘iladi, CI esa faqat o‘zgarish ta’sir qilgan ilovalarni deploy qiladi. Orkestratorlar ularni bog‘liqliklar grafi bo‘yicha aniqlay oladi.
