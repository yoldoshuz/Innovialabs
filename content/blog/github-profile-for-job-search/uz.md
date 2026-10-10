---
title: Ish qidirish uchun GitHub profilini qanday tayyorlash kerak
description: Profile README’ni sozlash, repozitoriylarni biriktirish, loyihalarga tushunarli tavsif yozish va rekruterlar e’tibor beradigan commit tarixi signallari.
summary: Profil ma’lumotlarini to‘ldiring, qisqa profile README qo‘shing, tushunarli tavsif va README bilan 4–6 ta eng yaxshi repozitoriyni biriktiring, commit’larda esa muntazam va mazmunli ishni ko‘rsating.
---
## GitHub profilida nimaga qarashadi

Rekruter yoki texlid odatda profilingizga ko‘p vaqt sarflamaydi. Shu vaqt ichida u quyidagilarni tushunmoqchi:

- **siz kimsiz** va qaysi stek bilan ishlaysiz;
- **qaysi loyihalarni** birinchi ochish kerak;
- **kodni qanday yozasiz** va ishni qanday rasmiylashtirasiz;
- **qanchalik muntazam** nimadir qilasiz.

Profilning vazifasi — bu savollarga tez javob berish va odamni eng yaxshi loyihalaringizga olib borish.

## 1-qadam. Profilning asosiy ma’lumotlari

Profil sozlamalarida to‘ldiring:

- **ism** — rezyumedagi bilan bir xil;
- **surat** — yuzingiz ko‘rinadigan neytral surat;
- **bio** — bir qator: rol va stek, masalan «Backend dasturchi: Python, Django, PostgreSQL»;
- **shahar yoki vaqt mintaqasi**;
- portfolio sayti va LinkedIn’ga **havolalar**;
- ko‘rsatishga tayyor bo‘lsangiz, aloqa uchun **email**.

## 2-qadam. Profile README

Agar **loginingiz bilan bir xil nomdagi ommaviy repozitoriy** yaratib, unga `README.md` faylini qo‘shsangiz, GitHub uni profil sahifasida ko‘rsatadi.

Uni qisqa tuting. Tuzilma namunasi:

```markdown
### Salom, men Aziz — frontend dasturchiman

React va TypeScript’da tez va qulay interfeyslar yarataman.

**Hozir:** interfeys testlash va qulaylikni o‘rganyapman.

**Stek:** React, TypeScript, Next.js, Tailwind CSS, Git

**Loyihalar:**
- [Loyiha nomi](havola) — nima qilishi, bitta gapda
- [Loyiha nomi](havola) — nima qilishi, bitta gapda

**Aloqa:** email · LinkedIn · Telegram
```

Nimadan qochish kerak: o‘nlab texnologiya nishonlari, animatsiyali hisoblagichlar va statistika vidjetlari ekranni egallaydi, lekin ko‘nikmalaringiz haqida hech narsa demaydi.

## 3-qadam. Biriktirilgan repozitoriylar

Profilda oltitagacha repozitoriyni biriktirish mumkin — bu sizning vitrinangiz. Istalgan rolga mos **4–6 ta eng yaxshi loyihani** tanlang. O‘quv mashqlari va o‘zgarishsiz fork’larni biriktirmagan ma’qul.

Har bir biriktirilgan repozitoriyga kerak:

- «test-project-2» yoki «final-final» o‘rniga **tushunarli nom**;
- **About maydonida tavsif** — loyiha nima qilishi haqida bitta gap;
- Website maydonida **demo havolasi**;
- **topics** — stek teglari: `react`, `typescript`, `postgresql`.

## 4-qadam. Har bir loyiha uchun README

Repozitoriyni ochgan odam bir necha soniyada bu nima ekanini va natijani qanday ko‘rishni tushunishi kerak:

1. Loyiha nima qiladi va kim uchun.
2. Skrinshot, GIF yoki demo havolasi.
3. Stek.
4. Lokal ishga tushirish — haqiqatan ishlaydigan buyruqlar.
5. Asosiy qarorlar va nima qiyin bo‘lgani.

Shuningdek, repozitoriyda `.env` fayllari, kalitlar va parollar yo‘qligini, `.gitignore` esa bog‘liqliklar va build fayllarini chiqarib tashlashini tekshiring.

## 5-qadam. Commit tarixi

Rekruterlar va muhandislar Git bilan qanday ishlashingizga e’tibor berishadi.

| Yaxshi signal | Yomon signal |
|---|---|
| Tushunarli xabarli kichik commit’lar | Butun loyiha bitta commit’da |
| «Add search filter by date» kabi xabarlar | «fix», «asdf», «update» |
| Branch va pull request’lar bilan ishlash | Hammasi tarixsiz to‘g‘ridan-to‘g‘ri main’ga |
| Loyiha vaqt o‘tishi bilan rivojlanadi | Barcha commit’lar bir kechada |

Tushunarli xabarlar namunasi:

```bash
git commit -m "Add pagination to product list"
git commit -m "Fix crash when cart is empty"
git commit -m "Refactor auth service into separate module"
```

Faollik grafigi har kuni «yashil» bo‘lishi shart emas — miqdor emas, mazmunli ish muhim. Agar asosan yopiq repozitoriylarda ishlasangiz, profil sozlamalarida xususiy faollikni ko‘rsatishni yoqish mumkin: mazmun yashirin qoladi, grafik esa haqqoniyroq bo‘ladi.

## Ko‘p uchraydigan xatolar

- Ism, surat va tavsifsiz profil.
- O‘z o‘zgarishlarisiz begona loyihalarning fork’lari biriktirilgan.
- README’siz yoki standart README bilan repozitoriylar.
- Commit tarixidagi maxfiy kalitlar. Faylni yangi commit’da o‘chirish uni tarixdan olib tashlamaydi — kalitni bekor qilib, yangisini chiqarish kerak.

## FAQ

### Butun kodim NDA ostida bo‘lsa, GitHub kerakmi?

Kerak bo‘lgani ma’qul. Stekingizni ko‘rsatadigan bir-ikkita kichik ommaviy loyiha qiling va profilni bezang. Shunda ish beruvchida kodingizdan hech bo‘lmasa namuna bo‘ladi.

### Yulduzlar soni ish topishga ta’sir qiladimi?

Yulduzlar yoqimli, lekin junior va middle lavozimlar uchun kod sifati, bezash va loyihalarning tushunarli tavsifi muhimroq.

### Open source’da qatnashish kerakmi?

Vaqtingiz bo‘lsa — ha. Hujjatlar yoki xatolardagi kichik tuzatishlar ham begona kod va review jarayoni bilan ishlay olishingizni ko‘rsatadi.
