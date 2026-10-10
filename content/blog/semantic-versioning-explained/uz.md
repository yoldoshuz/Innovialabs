---
title: Semantik versiyalash (SemVer): versiyalarni qanday raqamlash
description: MAJOR.MINOR.PATCH qoidalari, pre-release teglar, paket menejerlaridagi ^ va ~ diapazonlari hamda lock-fayllar loyihani buzuvchi yangilanishlardan qanday himoya qiladi.
summary: SemVer — MAJOR.MINOR.PATCH formati: MAJOR mos kelmaydigan o‘zgarishlarda, MINOR buzmaydigan yangi imkoniyatlarda, PATCH xato tuzatishlarida oshadi; lock-fayl esa bog‘liqliklarning aniq versiyalarini qotirib qo‘yadi.
---
## SemVer qisqacha

**Semantik versiyalash** — versiya raqami yangilanish qanchalik xavfli ekanini bildirishi haqidagi kelishuv. Format — `MAJOR.MINOR.PATCH`, masalan `2.5.1`:

| Qism | Qachon oshadi | Foydalanuvchi uchun ma’nosi |
|---|---|---|
| **MAJOR** | ommaviy API’dagi mos kelmaydigan o‘zgarishlar | yangilanish kodingizni buzishi mumkin |
| **MINOR** | orqaga mos yangi funksionallik | yangilash mumkin, eski kod ishlashda davom etadi |
| **PATCH** | API o‘zgarmagan holda xato tuzatish | xavfsiz yangilanish |

Katta qism oshganda kichiklari nolga tushadi: `1.4.7` → `2.0.0`, `1.4.7` → `1.5.0`.

Asosiy tushuncha — **ommaviy API**. SemVer faqat nima «interfeys» hisoblanishi aniq belgilanganda ma’noga ega: kutubxona funksiyalari, endpointlar, konfiguratsiya formati. Tashqaridan hech kim chaqirmaydigan ichki kodni o‘zgartirish moslikni buzmaydi.

## Maxsus holatlar

- **`0.x.y` versiyalari** — boshlang‘ich ishlab chiqish. Spetsifikatsiyaga ko‘ra bu davrda istalgan narsa o‘zgarishi mumkin, API barqarorligi va’da qilinmaydi.
- **`1.0.0`** — ommaviy API’ni barqaror deb e’lon qilgan payt.
- **Pre-release** — chiziqcha orqali qo‘shimcha: `2.0.0-alpha.1`, `2.0.0-beta.3`, `2.0.0-rc.1`. Bunday versiya yakuniy `2.0.0` dan *kichik* hisoblanadi va barqarorlikni va’da qilmaydi.
- **Build metadata** — plyus orqali qo‘shimcha: `1.0.0+20261010`. Versiyalar tartibiga ta’sir qilmaydi.

Pre-release tartibi: `1.0.0-alpha` < `1.0.0-alpha.1` < `1.0.0-beta` < `1.0.0-rc.1` < `1.0.0`.

## Paket menejerlaridagi ^ va ~ diapazonlari

`package.json` da (va boshqa ekotizimlardagi analoglarida) bog‘liqlik ko‘pincha aniq versiya emas, diapazon bilan ko‘rsatiladi:

| Yozuv | Nimaga ruxsat | `1.4.2` uchun misol |
|---|---|---|
| `1.4.2` | faqat shu versiya | `1.4.2` |
| `~1.4.2` | PATCH yangilanishlari | `>=1.4.2 <1.5.0` |
| `^1.4.2` | MINOR va PATCH yangilanishlari | `>=1.4.2 <2.0.0` |
| `*` yoki `latest` | istalgan narsa | tavsiya etilmaydi |

npm’ning muhim jihati: `1.0.0` dan past versiyalarda `^` ehtiyotkorroq ishlaydi. `^0.3.1` faqat `>=0.3.1 <0.4.0` ga ruxsat beradi, chunki nolinchi major versiyada MINOR amalda MAJOR rolini o‘ynaydi.

Diapazonlarni tahlil qilishning aniq qoidalari npm hujjatlarida: [semver ranges](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies).

## Lock-fayllar: «kecha ishlagan edi»dan himoya

`^1.4.2` diapazoni yangi o‘rnatishda sizga `1.9.0` tushishi mumkinligini bildiradi. Agar kutubxona muallifi MINOR versiyada tasodifan moslikni buzgan bo‘lsa, kodingizda birorta ham o‘zgarishsiz loyiha yiqiladi.

**Lock-fayl** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock`, `composer.lock`) butun bog‘liqliklar daraxtining, jumladan tranzitiv bog‘liqliklarning ham aniq versiyalarini qayd etadi. Amalda muhimi:

1. Ilovalar uchun **lock-faylni repozitoriyga commit qiling**.
2. CI’da qat’iy o‘rnatishdan foydalaning: `npm install` o‘rniga `npm ci` — u aynan lock-fayldagi narsani o‘rnatadi va `package.json` bilan mos kelmasa, xato beradi.
3. Bog‘liqliklarni **ongli ravishda** yangilang: alohida vazifa sifatida, testlarni ishga tushirib va MAJOR versiyalar uchun changelog’ni o‘qib.
4. Dependabot yoki Renovate kabi avtomatik yangilash vositalari alohida pull request’lar ochadi — loyihada testlar bo‘lsa, bu qulay.

## O‘z loyihangizni qanday versiyalash kerak

- Ommaviy API nima ekanini aniqlang va hujjatlashtiring.
- **CHANGELOG** yuriting: nima qo‘shildi, tuzatildi, nima moslikni buzadi.
- Funksionallikni ikki bosqichda olib tashlang: avval MINOR versiyada deprecated deb belgilang, keyingi MAJOR’da o‘chiring.
- MAJOR versiya chiqarishdan qo‘rqmang: halol raqam PATCH’dagi «jim» buzilishdan yaxshiroq.
- Tashqi iste’molchilari yo‘q saytlar va ichki ilovalar uchun qat’iy SemVer shart emas — ko‘pincha sana yoki build raqami yetarli.

## FAQ

### Kutubxonada lock-faylni commit qilish kerakmi?

Ilovalar uchun — albatta. Kutubxonalarda lock-fayl uni o‘rnatuvchilarga ta’sir qilmaydi, ammo kutubxonaning o‘zini takrorlanadigan ishlab chiqish va CI uchun baribir foydali.

### Bog‘liqlik MINOR versiyada API’ni buzsa nima qilish kerak?

Oxirgi ishlagan versiyani aniq raqam bilan qotiring, muallifga muammo haqida xabar bering va tuzatilgach diapazonga qayting. Lock-fayl aynan bunga to‘satdan duch kelmaslikka yordam beradi.

### ^ va ~ farqi oddiy tilda nima?

`~` faqat joriy MINOR versiya ichidagi xato tuzatishlarga ruxsat beradi, `^` esa joriy MAJOR versiya ichidagi yangi imkoniyatlarga ham.
