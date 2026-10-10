---
title: Git, GitHub va GitLab: farqi nimada
description: Git — versiyalarni boshqarish vositasi, GitHub, GitLab va Bitbucket — repozitoriylar uchun hosting platformalari. Farqlar va o‘z serveringiz qachon kerakligi.
summary: Git — kompyuteringizda kod o‘zgarishlari tarixini saqlaydigan dastur; GitHub, GitLab va Bitbucket esa Git-repozitoriylarni saqlaydigan va ular atrofida jamoaviy ishni quradigan onlayn servislar.
---

## Qisqa javob

- **Git** — **versiyalarni boshqarish tizimi**: fayllardagi har bir o‘zgarishni eslab qoladigan, parallel tarmoqlarda ishlash va ularni birlashtirish imkonini beradigan dastur. U lokal ishlaydi va internet talab qilmaydi.
- **GitHub, GitLab, Bitbucket** — Git-repozitoriylarni serverda saqlaydigan va jamoaga kerakli hamma narsani qo‘shadigan **platformalar**: pull/merge request, kod-revyu, vazifalar, CI/CD, kirish huquqlari.

O‘xshatish: Git — matn muharriri kabi format va dvigatel, GitHub esa uning ustiga qurilgan hamkorlikdagi bulutli ombor. Git’ni GitHub’siz ishlatish mumkin, GitHub’ni esa Git’siz — yo‘q.

## Git o‘zi nima qiladi

- kommitlar tarixini saqlaydi va istalgan versiyaga qaytish imkonini beradi;
- funksiyalar va tuzatishlar uchun **tarmoqlar**ni (branch) qo‘llab-quvvatlaydi;
- o‘zgarishlarni birlashtiradi (`merge`, `rebase`) va konfliktlarni ko‘rsatadi;
- `push` va `pull` orqali masofaviy repozitoriylar bilan sinxronlashadi.

```bash
git init
git add .
git commit -m "Birinchi kommit"
git remote add origin <repozitoriy manzili>
git push -u origin main
```

Oxirgi ikki buyruq — bu platforma bilan aloqa. Ulardan oldingi hamma narsa to‘liq oflayn ishlaydi.

## Platformalar nima qo‘shadi

- **Pull request / merge request** — birlashtirishdan oldin o‘zgarishlarni muhokama va revyu qilish.
- **CI/CD** — har bir push’da testlar va deployni avtomatik ishga tushirish.
- **Vazifalar va doskalar** — ishni kod yonida kuzatish.
- **Kirish huquqlari** — kim o‘qishi, push qilishi, birlashtirishni tasdiqlashi mumkin.
- **Tarmoqlarni himoyalash** — `main`ga to‘g‘ridan-to‘g‘ri push taqiqi, majburiy revyu.
- **Wiki, relizlar, paket va konteyner omborlari**.

## GitHub, GitLab va Bitbucket taqqoslovi

| | GitHub | GitLab | Bitbucket |
|---|---|---|---|
| Kuchli tomoni | Eng katta hamjamiyat, open source | Bitta mahsulotda to‘liq DevOps sikli | Jira va Atlassian mahsulotlari bilan integratsiya |
| CI/CD | GitHub Actions | GitLab CI/CD | Bitbucket Pipelines |
| Revyu | Pull requests | Merge requests | Pull requests |
| O‘z serveri | GitHub Enterprise Server (pullik) | Self-managed, bepul Community Edition bor | Data Center (pullik) |
| Kimga mos | Open source, ko‘pchilik jamoalar | Hammasi-bittada va self-hosting kerak bo‘lgan jamoalar | Jira’da ishlaydigan jamoalar |

Tariflar va bepul rejalar limitlari muntazam o‘zgaradi, shuning uchun tanlashdan oldin dolzarb shartlarni platformalar saytlarida tekshiring.

## Platformani qanday tanlash kerak

1. **Jamoa hozir qayerda ishlaydi?** Vazifalar Jira’da bo‘lsa — Bitbucket qulay bog‘lanishlar beradi. Hamjamiyat va open source muhim bo‘lsa — GitHub.
2. **CI/CD tayyor holda kerakmi?** Uchalasi ham beradi, lekin konfiguratsiyalar mos emas: ko‘chish paypalaynlarni qayta yozishni talab qiladi.
3. **Ma’lumotlarga talablar.** Kodni begona bulutda saqlab bo‘lmasa — self-hosted variantlarga qarang.
4. **Integratsiyalar.** Messenjerlar, trekerlar va deploy servislaringiz platforma bilan ishlashini tekshiring.

Yaxshi xabar: Git-repozitoriy platformalar o‘rtasida tarixini yo‘qotmasdan ko‘chadi. Vazifalar, revyular va paypalaynlarni ko‘chirish qiyinroq.

## O‘z serveringiz qachon mantiqli

Self-hosting quyidagi hollarda o‘zini oqlaydi:

- **regulyator yoki buyurtmachi talablari** kodni tashqi provayderda saqlashni taqiqlaydi;
- internetga chiqishsiz **yopiq tarmoqda** ishlash kerak;
- zaxira nusxalar, yangilanishlar va kirish ustidan to‘liq nazorat kerak.

Kamchiliklari ham real: server, xavfsizlik yangilanishlari, bekaplar va monitoring uchun siz javobgarsiz. Maxsus talablari yo‘q kichik jamoa uchun bulutli variant odatda soddaroq va ishonchliroq. GitLab self-managed’dan tashqari, kichik o‘rnatmalar uchun mos **Gitea** va **Forgejo** kabi yengil open source yechimlar ham bor.

## FAQ

### Git’dan GitHub’siz foydalanish mumkinmi?

Ha. Git to‘liq lokal ishlaydi. Masofaviy repozitoriy istalgan server, tarmoq papkasi yoki boshqa platforma bo‘lishi mumkin.

### GitHub’dan GitLab’ga yoki aksincha ko‘chish qiyinmi?

Kodning o‘zi tarixi bilan yangi repozitoriyga oddiy `git push` orqali ko‘chadi, platformalarda import vositalari ham bor. Eng ko‘p ish odatda CI/CD konfiguratsiyalari va integratsiyalarni ko‘chirishga ketadi.

### Yangi boshlovchi nimani tanlashi kerak?

Avval Git’ning o‘zini o‘rganing, hosting uchun esa istalgan mashhur platformani oling — asosiy ko‘nikmalar uchalasida ham bir xil asqotadi.
