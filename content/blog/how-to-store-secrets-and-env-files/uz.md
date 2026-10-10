---
title: API kalitlar va maxfiy ma’lumotlarni saqlash: nafaqat .env
description: API kalitlar, baza parollari va tokenlarni qayerda saqlash kerak: muhit o‘zgaruvchilari, CI/CD maxfiy omborlari, har bir muhit uchun alohida kalit, rotatsiya.
summary: Maxfiy ma’lumotlar kod va repozitoriyga tushmasligi kerak: ilova ularni muhit o‘zgaruvchilaridan oladi, qiymatlarning o‘zi esa CI/CD yoki bulutdagi maxfiy omborda, har bir muhit uchun alohida, minimal huquqlar va muntazam rotatsiya bilan saqlanadi.
---
## Qisqa javob

**Secret** (maxfiy ma’lumot) — kirish huquqini beradigan har qanday narsa: API kalitlar, ma’lumotlar bazasi parollari, bot tokenlari, imzo kalitlari. To‘g‘ri sxema quyidagicha:

1. Kodda faqat o‘zgaruvchining **nomi** bo‘ladi, masalan `DATABASE_URL`.
2. Qiymatlar **maxfiy omborda** saqlanadi: CI/CD yoki hosting sozlamalarida, yoki bulutdagi secret manager’da.
3. Har bir muhitning **o‘z kalitlari** bor: development, staging va production bitta kalitni bo‘lishmaydi.
4. Har bir kalitda **minimal huquqlar** va aniq **rotatsiya** tartibi bor.

`.env` fayli — lokal ishlab chiqish uchun qulay vosita, lekin jamoada maxfiy ma’lumotlarni saqlash usuli emas.

## Maxfiy ma’lumotlar qanday sizib chiqadi

- **Kalit kod ichida.** Kimdir uni «vaqtincha» qo‘ydi va u commit’ga tushdi. Git tarixi qatorni o‘chirgandan keyin ham uni saqlab qoladi.
- **`.env` repozitoriyda.** `.gitignore` unutilgan — fayl kodga kirish huquqi bor hammaga, jumladan pudratchilar va fork’larga ko‘rinadi.
- **Kalit frontend’da.** Brauzer yoki mobil ilovaga tushgan hamma narsani ajratib olish mumkin. To‘lov tizimining maxfiy kaliti JavaScript bandle ichida bo‘lsa, bu allaqachon sizib chiqish.
- **Loglar va xatolar.** Ilova ishga tushganda konfiguratsiyani chiqaradi yoki xatolar trekeri so‘rov sarlavhalarini saqlaydi.
- **Messenjerlarda yuborish.** Kalit hamkasbga chatda yuborilgan va u yerda abadiy qolgan.

Ochiq repozitoriylarni botlar doimiy skanerlaydi, shuning uchun ochiq koddagi kalitni darhol oshkor bo‘lgan deb hisoblash kerak.

## Muhit o‘zgaruvchilari — to‘g‘ri usul

Ilova konfiguratsiyani muhitdan o‘qiydi va majburiy qiymat bo‘lmasa, **ishga tushishda to‘xtaydi**. Shunda xato birinchi to‘lov paytida emas, darhol ko‘rinadi.

```ts
const required = ["DATABASE_URL", "PAYMENT_API_KEY"] as const;

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing env variable: ${name}`);
  }
}
```

`.env` uchun qoidalar:

- Birinchi commit’dan oldin `.env` va `.env.*` ni `.gitignore`ga qo‘shing.
- Repozitoriyda **`.env.example`** saqlang — faqat o‘zgaruvchi nomlari va xavfsiz namunaviy qiymatlar.
- `process.env`ni to‘liq log’ga chiqarmang.
- Next.js va shunga o‘xshash framework’larda ochiq prefiksli o‘zgaruvchilar (masalan, `NEXT_PUBLIC_`) brauzerga tushadi — u yerga maxfiy ma’lumot qo‘ymang.

## CI/CD va hostingdagi maxfiy ma’lumotlar

GitHub Actions, GitLab CI va boshqa tizimlarda o‘rnatilgan maxfiy ombor bor. Qiymatlar shifrlanadi, log’larda yashiriladi va faqat kerakli vazifalarga uzatiladi.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

Maxfiy ma’lumotlarni **muhitlarga** (environments) bog‘lang va production’ni himoyalang: deploy faqat asosiy branch’dan va mas’ul shaxs tasdig‘i bilan.

Servislar ko‘paygach, **secret manager**ga o‘ting — bulutdagi yoki self-hosted. U markazlashgan audit, versiyalar va rotatsiyani beradi.

## Har bir muhit uchun alohida kalitlar

| Muhit | Qanday kalitlar | Kimda kirish huquqi bor |
|---|---|---|
| Lokal ishlab chiqish | Test kalitlari, to‘lov tizimlari sandbox’i | Dasturchilar |
| Staging | Cheklangan ma’lumotli alohida kalitlar | Jamoa va CI |
| Production | Haqiqiy kalitlar | Faqat CI/CD va bir necha mas’ul shaxs |

Dasturchining kaliti sizib chiqsa, production zarar ko‘rmaydi. Log’larda esa so‘rov qaysi muhitdan kelgani darhol ko‘rinadi.

## Rotatsiya va minimal huquqlar

**Minimal huquqlar (least privilege):** xat yuborish kaliti domenlarni o‘chira olmasligi, hisobotlar uchun baza foydalanuvchisiga esa yozish huquqi kerak emas. Ko‘p servislar kalitni amallar, IP manzillar yoki resurslar bo‘yicha cheklash imkonini beradi — bundan foydalaning.

**Rotatsiya** — kalitni rejali almashtirish. U og‘riqsiz bo‘lishi uchun:

1. Ilova yangi kalit bilan qayta yig‘ishsiz ishlay olishi kerak — maxfiy qiymatni yangilab, qayta ishga tushirish kifoya.
2. Tartib: yangi kalit yaratish, omborni yangilash, deploy qilish, hammasi ishlayotganiga ishonch hosil qilish, eskisini bekor qilish.
3. Kirish huquqi bo‘lgan xodim yoki pudratchi ketganda kalitlarni albatta almashtiring.

## Ko‘p uchraydigan xatolar

- Barcha loyihalarga to‘liq huquqli bitta «universal» kalit.
- Haqiqiy kalitlar dasturchilarning noutbuklarida.
- Maxfiy ma’lumotlar Docker image ichida `ENV` yoki nusxalangan `.env` orqali.
- Qaysi kalit qayerda ishlatilishini hech kim bilmaydi — rotatsiyani o‘tkazib bo‘lmaydi.

## FAQ

### Production serverda .env saqlasa bo‘ladimi?

Bitta server uchun vaqtinchalik yechim sifatida bo‘ladi, agar faylni faqat ilova foydalanuvchisi o‘qiy olsa va u zaxira nusxalarga ochiq holda tushmasa. Loyiha o‘sgani sari hosting maxfiy sozlamalariga yoki secret manager’ga o‘tgan ma’qul: ularda audit va rotatsiya bor.

### Kalitlarni qanchalik tez-tez almashtirish kerak?

Yagona muddat yo‘q. Har qanday sizib chiqish shubhasidan keyin va kirish huquqi bor odamlar almashganda — majburiy. Rejali rotatsiya kalitning muhimligi va kompaniyaning xavfsizlik talablariga qarab tanlanadi.

### Maxfiy ma’lumot Git’ga tushib qolgan bo‘lsa-chi?

Avval kalitni bekor qilib, yangisiga almashtiring, keyin kirish log’larini tekshiring va shundan so‘nggina tarixni tozalang. Faylni yangi commit bilan o‘chirish muammoni hal qilmaydi.
