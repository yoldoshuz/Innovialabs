---
title: Dev, staging va production muhitlari: har biri nima uchun kerak
description: Nega alohida dev, staging va production muhitlari kerak, ularni qanday bir xil saqlash, staging’dagi ma’lumotlar va kichik jamoa nimadan boshlashi.
summary: Dev — ishlab chiqish uchun, staging — relizni jangovarga yaqin sharoitda tekshirish uchun, production — haqiqiy foydalanuvchilar uchun. Muhitlarni ajratish xatolarni mijozlardan oldin topadi, staging esa bir xil konfiguratsiya va haqiqiy shaxsiy ma’lumotlarsiz foydali bo‘ladi.
---

## Qisqacha: nega uchta muhit

**Muhit** (environment) — ilovaning o‘z serveri, bazasi, sozlamalari va domeniga ega alohida nusxasi.

- **Dev (development)** — dasturchilar kod yozadigan va sinab ko‘radigan joy. Istalgan payt buzilishi mumkin.
- **Staging** — «bosh repetitsiya». Bu yerda tayyor reliz jangovar sharoitga imkon qadar o‘xshash muhitda tekshiriladi.
- **Production** — haqiqiy foydalanuvchilar va pullar bilan ishlaydigan tizim.

Ajratishning mazmuni oddiy: xato mijoz ko‘rishidan **oldin** topilishi kerak.

## Muhitlar nimasi bilan farq qiladi

| | Dev | Staging | Production |
|---|---|---|---|
| Kim foydalanadi | Dasturchilar | QA, menejerlar, buyurtmachi | Mijozlar |
| Barqarorlik | Past | Tekshiruv paytida yuqori | Maksimal |
| Ma’lumotlar | Test, sidlar | Test yoki anonimlashtirilgan | Haqiqiy |
| Deploy | Tez-tez, ishchi branchlardan | Reliz nomzodi | Tekshirilgan reliz |
| Tashqi servislar | Sandbox, zaglushkalar | To‘lov va API sandbox’lari | Jangovar kalitlar |

## Muhitlarni qanday bir xil saqlash

Staging faqat production’ga haqiqatan o‘xshash bo‘lsa foydali. Aks holda «staging’da ishlagan edi» hech narsani anglatmaydi.

- **Bitta artefakt.** Docker obrazini bir marta yig‘ing va har bir muhit uchun qayta yig‘masdan, uni muhitlar bo‘ylab olg‘a suring.
- **Infratuzilma kod sifatida.** Serverlar va servislarni Docker Compose, Terraform yoki Kubernetes manifestlarida tavsiflang, shunda muhitlar bir xil yaratiladi.
- **Farq — faqat konfiguratsiyada.** Manzillar, kalitlar va flaglarni muhit o‘zgaruvchilariga chiqaring:

```bash
# .env.staging
APP_ENV=staging
DATABASE_URL=postgres://app@staging-db:5432/app
PAYMENT_MODE=sandbox
```

- **Bir xil versiyalar.** Ma’lumotlar bazasi, runtime va asosiy servislar staging va production’da mos kelishi kerak.
- **Migratsiyalar o‘sha pipeline orqali.** Migratsiya staging’da o‘tsa, production’da ham o‘tadi — ma’lumotlar hajmi va tuzilishi o‘xshash bo‘lsa.

## Staging’dagi ma’lumotlar

Jangovar bazani staging’ga «boricha» ko‘chirish — keng tarqalgan va xavfli xato: mijozlarning shaxsiy ma’lumotlari kamroq himoyalangan joyga tushib qoladi.

Variantlar:

- **Sidlar va fikstura** — generatsiya qilingan test ma’lumotlari, ko‘pchilik tekshiruvlar uchun yetarli.
- **Anonimlashtirilgan nusxa** — ismlar, telefonlar, email va to‘lov ma’lumotlari almashtirilgan yoki o‘chirilgan production bazasi.
- **Kerakli hajmdagi sintetik ma’lumotlar** — unumdorlikni tekshirish uchun.

Alohida e’tibor bering: staging **haqiqiy xatlar va SMS yubormasin** va haqiqiy to‘lovlarni o‘tkazmasin — servislarning sandbox rejimlaridan foydalaning.

## Kichik jamoa uchun minimal sxema

1. Umumiy dev-server o‘rniga har bir dasturchida Docker Compose orqali **lokal ishlab chiqish**.
2. Testlardan o‘tgach asosiy branch avtomatik deploy qilinadigan **bitta staging server**.
3. Staging’da tekshirilgandan so‘ng o‘sha obraz yuboriladigan **production** — tugma orqali qo‘lda yoki reliz tegi bo‘yicha.
4. Staging’ni qidiruv tizimlari va begonalardan yoping: basic auth yoki faqat VPN orqali kirish.

Bu infratuzilmani shishirmasdan ko‘pchilik xatolarni ushlash uchun yetarli.

## Ko‘p uchraydigan xatolar

- Staging yillar davomida versiya va sozlamalar bo‘yicha production’dan orqada qoladi.
- Sirlar va kalitlar barcha muhitlar uchun umumiy.
- Hotfix’lar pipeline’ni chetlab, to‘g‘ridan-to‘g‘ri production serverida tuzatiladi.
- Staging qidiruv tizimlarida indekslanib, sahifalar dublini yaratadi.

## FAQ

### Staging’siz ishlash mumkinmi?

Juda kichik loyihada — ha, testlar bilan yaxshi qamrov va tez orqaga qaytarish bo‘lsa. Lekin to‘lovlar, integratsiyalar yoki ishni qabul qiladigan buyurtmachi bo‘lsa, staging tez o‘zini oqlaydi.

### Staging preview-muhitlardan nimasi bilan farq qiladi?

Preview har bir branch yoki pull request uchun avtomatik yaratiladi va qisqa yashaydi. Staging — aynan reliz nomzodi tekshiriladigan doimiy muhit.

### Staging production bilan bir xil quvvatda bo‘lishi kerakmi?

Odatda yo‘q: serverlar o‘lchamidan ko‘ra versiyalar va konfiguratsiyaning mosligi muhimroq. Istisno — yuklama testlari, ular uchun muhit taqqoslanadigan bo‘lishi kerak.
