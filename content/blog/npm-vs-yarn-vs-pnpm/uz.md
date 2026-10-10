---
title: npm, Yarn yoki pnpm: qaysi paket menejerini tanlash kerak
description: package.json, lockfile va semver nima, npm, Yarn va pnpm tezlik, disk hajmi, workspaces va bog‘liqliklar qat’iyligi bo‘yicha qanday farq qiladi.
summary: npm — ishonchli standart tanlov, pnpm diskni tejaydi va bog‘liqliklarni qat’iyroq nazorat qiladi, bu ayniqsa monorepolarda qadrli, Yarn esa uning maxsus rejimlari kerak bo‘lgan jamoalarga qulay; eng muhimi — loyihada bitta menejer va bitta lockfile.
---

## Qisqa javob

- **npm** Node.js bilan birga keladi, hech narsa o‘rnatish shart emas. Ko‘pchilik loyihalarga mos.
- **pnpm** paketlarni umumiy omborda saqlaydi va havolalar orqali ulaydi: diskda kamroq joy, tez qayta o‘rnatish va bog‘liqliklarga qat’iy kirish. Monorepolar uchun yaxshi.
- **Yarn** (zamonaviy versiyalari) `node_modules` papkasisiz Plug’n’Play rejimini va puxta o‘ylangan workspaces’ni taklif qiladi, lekin jamoadan uning xususiyatlarini tushunishni talab qiladi.

Tanlovning o‘zidan muhimrog‘i — **menejerlarni aralashtirmaslik**: repozitoriyda bitta lockfile bo‘lishi kerak.

## Asos: package.json, semver va lockfile

**package.json** loyihani tasvirlaydi: bog‘liqliklar, skriptlar, Node.js versiyasi. Bog‘liqlik versiyalari **semver** qoidalari bo‘yicha beriladi — `MAJOR.MINOR.PATCH`:

- `^1.4.2` — 1.4.2 dan boshlab `1.x.x` ruxsat etiladi (yangi minor va patch versiyalar);
- `~1.4.2` — faqat `1.4.x` patchlari;
- `1.4.2` — aynan shu versiya.

Diapazon bugun va bir oydan keyin `install` turli versiyalarni o‘rnatishi mumkinligini bildiradi. Shuning uchun **lockfile** mavjud — butun bog‘liqliklar daraxtining aniq versiyalari yozilgan fayl:

| Menejer | Lockfile |
|---|---|
| npm | `package-lock.json` |
| Yarn | `yarn.lock` |
| pnpm | `pnpm-lock.yaml` |

Lockfile’ni **commit qilish kerak**. CI’da qat’iy unga ko‘ra o‘rnating: `npm ci`, `yarn install --immutable` (Yarn’ning zamonaviy versiyalarida), `pnpm install --frozen-lockfile`.

## Uchala menejerni taqqoslash

| Mezon | npm | Yarn | pnpm |
|---|---|---|---|
| O‘rnatish | Node.js bilan keladi | Corepack orqali yoki alohida | Corepack orqali yoki alohida |
| Diskdagi joy | Har loyihada nusxa | Rejimga bog‘liq | Umumiy ombor, havolalar |
| Qat’iylik | Tekis `node_modules` | PnP qat’iy | Standart bo‘yicha qat’iy |
| Workspaces | Bor | Bor, rivojlangan | Bor, rivojlangan |
| Moslik | Eng yuqori | PnP ba’zan sozlashni talab qiladi | Yuqori, kam uchraydigan paketlarni sozlash kerak |

Tezlik ko‘p jihatdan kesh, tarmoq va loyiha hajmiga bog‘liq, shuning uchun begona benchmarklarga emas, o‘z repozitoriyingizda solishtirgan ma’qul.

## Qat’iylik nimani anglatadi

npm **tekis** `node_modules` yaratadi: bog‘liqliklaringizning bog‘liqliklari yuqori darajada turadi va kod sizning `package.json`ingizda yo‘q paketni import qila oladi. Bu **fantom bog‘liqlik** — daraxtda yuqoriroqdagi kimdir uni olib tashlamaguncha ishlaydi.

pnpm `node_modules` ildiziga faqat to‘g‘ridan-to‘g‘ri bog‘liqliklarni qo‘yadi, qolganlari yashirin. Xato yangilanishdan keyin emas, darhol namoyon bo‘ladi. PnP rejimidagi Yarn modullarni aniqlashni o‘zi nazorat qiladi.

## Workspaces va monorepolar

Uchalasi ham **workspaces**ni qo‘llab-quvvatlaydi — bitta repozitoriyda umumiy o‘rnatishga ega bir nechta paket. pnpm uchun misol:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

Ichki paketlar havolalar orqali ulanadi, umumiy lockfile bitta. Katta monorepolarda pnpm ko‘pincha joy tejashi va qat’iyligi uchun, paketlar kam bo‘lsa esa npm soddaligi uchun tanlanadi.

## Qanday tanlash kerak

1. **Kichik loyiha yoki maxsus talablarsiz jamoa** — npm.
2. **Monorepo, bitta kompyuterda ko‘p loyiha, qat’iylik kerak** — pnpm.
3. **Jamoa allaqachon Yarn’da va mamnun** — qoling, migratsiya uchun migratsiya shart emas.
4. Menejerni `package.json`dagi `packageManager` maydonida qayd eting va hammada bir xil versiya bo‘lishi uchun Corepack’ni yoqing.

## Ko‘p uchraydigan xatolar

- **Repozitoriyda ikkita lockfile** — jamoaning yarmi bir versiyalarni, yarmi boshqalarini o‘rnatadi.
- **Lockfile `.gitignore`da** — yig‘ishlar takrorlanuvchan bo‘lmay qoladi.
- **CI’da `npm ci` o‘rniga `npm install`** — lockfile sezdirmasdan o‘zgarishi mumkin.
- **package.json’da yo‘q paketlarni import qilish** — birinchi yangilanishgacha ishlaydi.

## FAQ

### npm’dan pnpm’ga muammosiz o‘tish mumkinmi?

Odatda ha: pnpm mavjud lockfile’ni `pnpm import` buyrug‘i bilan import qila oladi. Agar kod fantom bog‘liqliklarga tayansa, muammolar chiqadi — ularni package.json’ga aniq qo‘shish kerak bo‘ladi.

### Branchlarni birlashtirishda lockfile’dagi konfliktlar bilan nima qilish kerak?

Uni qo‘lda tahrirlamang. Konfliktni package.json’da hal qiling, so‘ng o‘rnatishni qayta bajaring — menejer lockfile’ni qayta yaratadi.

### Paket menejeri yakuniy ilovaga ta’sir qiladimi?

Yo‘q, bir xil versiyalar o‘rnatilgan bo‘lsa, brauzer yoki serverdagi kodga ta’sir qilmaydi. U o‘rnatish tezligi, takrorlanuvchanlik va tasodifiy bog‘liqliklardan himoyani belgilaydi.
