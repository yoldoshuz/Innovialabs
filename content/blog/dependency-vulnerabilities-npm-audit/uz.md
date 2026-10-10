---
title: Zaif bog‘liqliklar: loyihada ularni qanday topish va tuzatish mumkin
description: npm audit, pip-audit, Dependabot va Renovate yordamida zaif bog‘liqliklarni topish, real xavfni baholash va production’ni buzmasdan yangilash.
summary: Bog‘liqliklarni muntazam skanerlang (npm audit, pip-audit), yangilanishlarni Dependabot yoki Renovate bilan avtomatlashtiring, lock-fayllarni commit qiling va avvalo ilovangizda haqiqatan ham ekspluatatsiya qilinishi mumkin bo‘lgan zaifliklarni tuzating.
---
## Qisqa javob

Odatiy loyihadagi kodning katta qismi — begona kutubxonalar, ularda esa zaifliklar doimiy topilib turadi. Ishlaydigan sxema:

1. **Skaner** ma’lum zaifliklarni topadi: `npm audit`, `pip-audit` va o‘xshash vositalar.
2. **Yangilanish boti** (Dependabot yoki Renovate) yangi versiyalar bilan pull request’larni o‘zi ochadi.
3. **Lock-fayl** aniq versiyalarni qayd etadi, shunda production tekshirilgan narsadan yig‘iladi.
4. **Xavfni baholash** hammasini emas, avval haqiqatan xavfli narsani tuzatishga yordam beradi.

## Skanerlash: npm audit va pip-audit

**npm audit** bog‘liqliklar daraxtini ma’lum zaifliklar bazasi bilan solishtiradi:

```bash
npm audit                 # barcha bog‘liqliklar
npm audit --omit=dev      # faqat production’ga tushadiganlari
npm audit fix             # ruxsat etilgan diapazonlar ichida yangilash
```

`npm audit fix --force` bilan ehtiyot bo‘ling: u mos kelmaydigan o‘zgarishlarga ega yangi **major** versiyani o‘rnatishi mumkin. Uni faqat ongli ravishda, testlarni ishga tushirib qo‘llang.

Agar **tranzitiv** bog‘liqlik zaif bo‘lsa-yu, to‘g‘ridan-to‘g‘ri bog‘liqlik hali yangilanmagan bo‘lsa, `package.json`dagi `overrides` orqali versiyani majburan belgilash mumkin:

```json
{
  "overrides": {
    "vulnerable-lib": "^2.3.1"
  }
}
```

Python uchun **pip-audit** bor:

```bash
pip install pip-audit
pip-audit -r requirements.txt
```

Skanerlashni CI’ga qo‘shing — shunda yangi zaifliklar kimdir eslaganda emas, hisobotda o‘z-o‘zidan paydo bo‘ladi.

## Avtomatik yangilanishlar: Dependabot va Renovate

**Dependabot** GitHub’ga o‘rnatilgan. Minimal sozlama:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      minor-and-patch:
        update-types: ["minor", "patch"]
```

Guruhlash kichik yangilanishlarni bitta pull request’ga birlashtiradi, shunda bot jamoani ko‘mib tashlamaydi.

**Renovate** GitHub, GitLab va boshqa platformalar bilan ishlaydi va sozlashda moslashuvchanroq: jadvallar, qoidalar bo‘yicha avtomerj, istalgan belgi bo‘yicha guruhlash.

```json
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true
    }
  ]
}
```

Avtomerj faqat testlar bilan yaxshi qamrov va majburiy CI tekshiruvlari bo‘lganda o‘rinli.

## Real xavfni qanday baholash kerak

Skaner **jiddiylik darajasini** (ko‘pincha CVSS shkalasi bo‘yicha) ko‘rsatadi, lekin kutubxonani qanday ishlatishingizni bilmaydi. O‘zingizga savol bering:

- **Paket production’ga tushadimi?** Yig‘ish yoki test vositasidagi zaiflik odatda kamroq shoshilinch.
- **Zaif funksiya chaqiriladimi?** Muammo siz ishlatmaydigan YAML parserda bo‘lsa, xavf pastroq.
- **Kiruvchi ma’lumotlarni hujumchi boshqaradimi?** Foydalanuvchi yuklagan fayllarni qayta ishlashdagi zaiflik o‘z konfiguratsiyangizni o‘qishdagidan xavfliroq.
- **Ma’lum ekspluatatsiya bormi?** Zaiflik CISA KEV katalogida bormi va uning EPSS ko‘rsatkichi — ekspluatatsiya ehtimoli qanday, tekshiring.

Hozir tuzatmaslikka qaror qilsangiz, ogohlantirishni shunchaki e’tiborsiz qoldirmang — **qaror va sababini qayd eting**.

## Lock-fayllar

- `package-lock.json`, `pnpm-lock.yaml`, `poetry.lock` yoki shunga o‘xshashini har doim commit qiling.
- CI’da bog‘liqliklarni `npm ci` bilan o‘rnating: u qat’iy lock-fayl bo‘yicha o‘rnatadi va nomuvofiqlikda to‘xtaydi.
- Python’da versiyalarni pip-tools, Poetry yoki uv orqali qayd eting; qo‘shimcha himoya uchun paket xeshlaridan foydalaning.

Lock-faylsiz bitta commit turli kunlarda turli versiyalar bilan yig‘iladi va zaiflik kodda birorta o‘zgarishsiz «kirib kelishi» mumkin.

## Xavfsiz yangilanish tartibi

1. Production bog‘liqliklari uchun **xavfsizlik patch’lari** — testlar o‘tishi bilanoq darhol.
2. **Minor va patch versiyalar** — har bir-ikki haftada bir to‘plam qilib.
3. **Major versiyalar** — rejali vazifa sifatida: changelog’ni o‘qish, kodni yangilash, testlarni o‘tkazish, staging’ga chiqarish.
4. Relizdan oldin — **staging va smoke-testlar**, keyin — xatolar monitoringi.
5. Ishlatilmaydigan bog‘liqliklarni olib tashlang: paket yo‘q — zaiflik yo‘q.

## Ko‘p uchraydigan xatolar

- «U yerda doim nimadir qizil» deb hisobotni e’tiborsiz qoldirish.
- Reliz oldidan `npm audit fix --force`ni ishga tushirish.
- Lock-faylni commit qilmaslik.
- Yangilanishlarni yillab yig‘ib, keyin bir necha major versiyadan birdaniga o‘tish.

## FAQ

### npm audit o‘nlab zaiflik ko‘rsatyapti. Nimadan boshlash kerak?

`npm audit --omit=dev` bilan faqat production bog‘liqliklarini ajrating, jiddiylik bo‘yicha saralang va zaif kod ilovangizda haqiqatan chaqirilishini tekshiring. Odatda chindan shoshilinch bandlar kam qoladi.

### Dependabot yoki Renovate — qaysi birini tanlash kerak?

Loyiha GitHub’da bo‘lsa, Dependabot’ni yoqish osonroq. Renovate bir nechta platforma, monorepozitoriylar va guruhlash hamda avtomerjning nozik qoidalari kerak bo‘lganda qulayroq.

### Tuzatilgan versiya hali chiqmagan bo‘lsa-chi?

Zaiflik tavsifida vaqtinchalik yechim bor-yo‘qligini tekshiring: funksiyani o‘chirish, kiruvchi ma’lumotlarni tekshirish, kirishni cheklash. Agar kutubxona tashlab qo‘yilgan bo‘lsa, uni almashtirishni rejalashtiring.
