---
title: Dasturiy ta’minot yetkazib berish zanjiriga hujumlar va himoya
description: Typosquatting, buzilgan maintainer’lar va zararli install-skriptlar qanday ishlaydi va SBOM, pinning, imzolar hamda CI qanday himoya qiladi.
summary: Yetkazib berish zanjiriga hujum sizning kodingizga emas, u nimadan yig‘ilishiga — paketlar, vositalar va CI’ga qaratiladi; himoya versiyalarni qayd etish, install-skriptlarni taqiqlash, SBOM, imzolarni tekshirish va CI’dagi minimal huquqlarga asoslanadi.
---
## Qisqa javob

**Yetkazib berish zanjiriga hujum** (supply chain attack) — hujumchi ilovangizni to‘g‘ridan-to‘g‘ri buzmaydi, balki u nimadan yig‘ilishini almashtiradi: npm yoki PyPI paketi, GitHub Action, Docker image, yig‘ish vositasi. Zararli kod loyihaga oddiy `npm install` orqali kiradi va dasturchi yoki CI huquqlari bilan bajariladi.

Himoya asosi:

1. Bog‘liqliklarning aniq versiyalari va manbalarini **qayd etish**.
2. Begona o‘rnatish skriptlarini zarurat bo‘lmasa **ishga tushirmaslik**.
3. Yig‘ma **tarkibini bilish** — SBOM.
4. Artefaktlarning **imzolari** va kelib chiqishini tekshirish.
5. Bitta qadam buzilsa, hamma narsaga yo‘l ochilmasligi uchun CI **huquqlarini cheklash**.

## Hujumlar qanday ishlaydi

**Typosquatting.** Mashhur paketga o‘xshash nomli paket: imlo xatosi, ortiqcha defis, so‘zlar tartibi boshqacha. `npm install`da bitta harfda adashish kifoya.

**Dependency confusion.** Kompaniyada `billing-utils` kabi ichki paket bo‘lsa, hujumchi ochiq reyestrga shu nomli, lekin yuqoriroq versiyali paketni joylaydi. Noto‘g‘ri sozlangan paket menejeri ochiq paketni tanlaydi.

**Buzilgan maintainer.** Hujumchi mashhur kutubxona muallifining akkauntiga kirish huquqini oladi yoki asta-sekin ishonch qozonib, hammuallifga aylanadi. Mashhur misollar — npm’dagi event-stream, unga yangi maintainer zararli kodli bog‘liqlik qo‘shgan, va 2024-yilda aniqlangan xz-utils’dagi backdoor.

**Zararli install-skriptlar.** `package.json`dagi `preinstall` va `postinstall` maydonlari o‘rnatishda avtomatik bajariladi. Skript `.env`, SSH kalitlari va bulut tokenlarini o‘qib, tashqariga yuborishi mumkin — siz ilovani ishga tushirmasingizdan oldin.

**CI’da almashtirish.** `@v3` kabi teg orqali ulangan uchinchi tomon GitHub Action’ini tegni boshqa commit’ga yo‘naltirib o‘zgartirish mumkin. Shu tegdan foydalanadigan barcha pipeline’lar yangi kodni secret’larga kirish huquqi bilan bajaradi.

## Versiyalar va manbalarni qayd etish

- **Lock-fayl**ni commit qiling va `npm ci` bilan o‘rnating — u versiyalarni o‘zgartirmaydi.
- Ichki kutubxonalar uchun **scoped paketlar**dan foydalaning va scope’ni o‘z reyestringizga aniq bog‘lang:

```ini
# .npmrc
@company:registry=https://npm.company.internal/
```

- Bir soat oldin chiqqan versiyaga yangilanmang: zararli relizlar ko‘pincha dastlabki kunlarda aniqlanib, o‘chiriladi. Renovate’da buning uchun `minimumReleaseAge` sozlamasi bor.
- CI’da Action’larni teg bo‘yicha emas, **commit’ning to‘liq SHA’si** bo‘yicha ulang va ularni Dependabot yoki Renovate orqali yangilang.

## Install-skriptlar

Ko‘pchilik paketlarga o‘rnatish skriptlari kerak emas. Ularni standart holatda o‘chiring va faqat haqiqatan zarur paketlarga (masalan, native yig‘iladiganlarga) alohida ruxsat bering:

```bash
npm ci --ignore-scripts
```

Ba’zi paket menejerlari skript bajarishga ruxsat berilgan paketlarning aniq ro‘yxatini yuritish imkonini beradi — undan foydalaning.

## SBOM

**SBOM** (Software Bill of Materials) — yig‘madagi barcha komponentlarning versiyalari bilan to‘liq ro‘yxati. Buzilgan paket haqida xabar chiqqanda u «bizga ta’sir qildimi» degan savolga javob beradi: qo‘lda qidirish o‘rniga barcha servislar SBOM’i bo‘yicha so‘rov qilinadi.

Standart formatlar — **CycloneDX** va **SPDX**. SBOM’ni masalan shunday yaratish mumkin:

```bash
npm sbom --sbom-format cyclonedx > sbom.json   # npm’ning yangi versiyalarida
syft dir:. -o cyclonedx-json > sbom.json        # istalgan loyiha yoki image uchun
```

SBOM’ni CI’da har bir yig‘ma uchun yarating va artefakt yonida saqlang.

## Imzolarni tekshirish

- `npm audit signatures` reyestrdagi paketlar imzolarini va **provenance attestatsiyalarini** — paket qaysi repozitoriy va pipeline’dan yig‘ilganini tasdiqlovchi hujjatni tekshiradi.
- O‘z paketlaringizni chiqarganda CI’dan `npm publish --provenance` dan foydalaning.
- Konteynerlar uchun **Sigstore cosign**dan foydalaning: image’larni yig‘ishda imzolang va deploy’dan oldin imzoni tekshiring.

```bash
cosign verify \
  --certificate-identity-regexp "https://github.com/org/app/" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/org/app:1.4.0
```

## CI himoyasi

| Chora | Nima beradi |
|---|---|
| CI tokeni uchun minimal `permissions` (standart holatda `contents: read`) | Buzilgan qadam repozitoriyga yoza olmaydi |
| Secret’lar faqat kerakli job va environment’larda | Sizib chiqish bitta bosqich bilan cheklanadi |
| `pull_request_target` va fork’lardan kelgan kod bilan ehtiyotkorlik | Begona kod secret’larga kira olmaydi |
| Bir martalik (ephemeral) runner’lar | Zararli dastur yig‘malar orasida saqlanib qolmaydi |
| Himoyalangan branch’lar va majburiy review | Pipeline’ni jimgina o‘zgartirib bo‘lmaydi |
| Uzoq muddatli bulut kalitlari o‘rniga OIDC | Uzoq muddatga o‘g‘irlanadigan narsa yo‘q |

Yetuklikni tizimli baholash uchun **SLSA** freymvorki va **OpenSSF Scorecard** vositasi foydali.

## FAQ

### Bunday hujumlardan himoyalanish uchun npm audit yetarlimi?

Yo‘q. npm audit allaqachon e’lon qilingan zaifliklarni topadi, zararli paket esa yangi va hali hech qayerda belgilanmagan bo‘lishi mumkin. Versiyalarni qayd etish, install-skriptlarni o‘chirish va CI cheklovlari ham kerak.

### Kichik jamoaga SBOM kerakmi?

CI’da SBOM yaratish bir necha qator konfiguratsiyani talab qiladi, keyingi katta incident paytida esa soatlab qo‘lda qidirishni tejaydi. Shuning uchun ha, hatto bir-ikkita servis uchun ham.

### Yangi bog‘liqlikni o‘rnatishdan oldin qanday tekshirish kerak?

Aniq nomni rasmiy hujjatlar bilan solishtiring, repozitoriyni, uning faolligi va maintainer’lar sonini, install-skriptlar va provenance bor-yo‘qligini ko‘ring. Agar funksiyani bir necha qatorda o‘zingiz yoza olsangiz, ba’zan paketsiz ishlagan ma’qul.
