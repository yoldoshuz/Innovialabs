---
title: Vercel nima va u oddiy hostingdan nimasi bilan farq qiladi
description: Vercel qanday ishlaydi: git’dan deploy, preview-havolalar, edge-tarmoq va serverless funksiyalar, tarif cheklovlari va unga yaxshi mos kelmaydigan loyihalar.
summary: Vercel — git’ga har bir push’da frontend va serverless funksiyalarni o‘zi yig‘ib, nashr qiladigan platforma, serverlarni sozlash shart emas. Next.js va shunga o‘xshash freymvorklardagi saytlar uchun juda mos, lekin uzoq fon jarayonlari va og‘ir backend uchun yaramaydi.
---

## Qisqa javob

**Vercel** — frontend va yengil backendni deploy qilish uchun platforma. Oddiy hosting yoki VPS’da siz server ijaraga olasiz, unga dasturlar o‘rnatasiz, veb-serverni sozlaysiz va yangilanishlarni o‘zingiz joylaysiz. Vercel’da siz boshqaradigan server yo‘q: git-repozitoriyni ulaysiz, platforma esa loyihani o‘zi yig‘adi va global tarmog‘i orqali tarqatadi.

Vercel’ni Next.js’ni rivojlantirayotgan kompaniya yaratgan, shuning uchun Next.js u yerda ayniqsa yaxshi qo‘llab-quvvatlanadi. Boshqa freymvorklar ham ishlaydi: Nuxt, SvelteKit, Astro va statik saytlar.

## Qanday ishlaydi

### Git’dan deploy

GitHub, GitLab yoki Bitbucket repozitoriyini ulaysiz. Keyin:

1. Asosiy branch’ga push yig‘ishni ishga tushiradi va **production versiyani** joylaydi.
2. Boshqa istalgan branch’ga push yoki pull request alohida **preview-deploy** yaratadi.
3. Har bir deploy o‘zgarmas, shuning uchun orqaga qaytish — shunchaki oldingi versiyaga o‘tish.

### Preview-havolalar

Har bir preview-deploy’ning o‘z havolasi bor. Dizayner, menejer yoki buyurtmachi uni ochib, o‘zgarishlar asosiy saytga tushishidan oldin ko‘rib chiqadi. Jamoa uchun bu eng foydali vositalardan biri: muhokama skrinshotlarda emas, jonli versiyada bo‘ladi.

### Edge-tarmoq

Statik fayllar va keshlangan sahifalar foydalanuvchiga yaqin tarmoq tugunlaridan beriladi. Shuningdek, so‘rov asosiy qayta ishlanishidan oldin bajariladigan **middleware** bor: qayta yo‘naltirishlar, avtorizatsiyani tekshirish, A/B-testlar, tilni aniqlash.

### Serverless funksiyalar

API-marshrutlar va server tomonidagi rendering **funksiyalar** sifatida bajariladi: ular so‘rov bo‘yicha ishga tushadi va avtomatik masshtablanadi. Nechta server saqlashni o‘ylashingiz shart emas: trafik keskin oshsa, platforma ko‘proq nusxa ishga tushiradi.

## Klassik hostingdan farqi

| | Klassik hosting / VPS | Vercel |
|---|---|---|
| Server | Ijaraga olasiz va boshqarasiz | Sizning mas’uliyatingizda emas |
| Deploy | Qo‘lda yoki o‘z CI/CD orqali | Git’dan avtomatik |
| O‘zgarishlarni oldindan ko‘rish | Alohida sozlash kerak | Tayyor holda bor |
| Masshtablash | Resursni oldindan sotib olasiz | Avtomatik |
| Uzoq jarayonlar | Muammosiz ishlaydi | Mos emas |
| Narxning oldindan ma’lumligi | Qat’iy ijara | Iste’molga bog‘liq |

## Tariflar va cheklovlar

- **Hobby** — faqat shaxsiy notijorat loyihalar uchun bepul tarif. Kompaniya sayti uchun pullik tarif kerak.
- **Pro** — jamoa a’zolari uchun to‘lov va kiritilgan limitlardan ortiq iste’mol.
- **Enterprise** — individual shartlar, kengaytirilgan xavfsizlik va kafolatlar.

Barcha tariflarda limitlar bor: funksiya bajarilish vaqti, trafik hajmi, yig‘ish vaqti, funksiya hajmi. Aniq qiymatlar o‘zgaradi, shuning uchun hujjatlarni tekshiring. Asosiysi: trafik o‘sgani sari **hisob ham o‘sadi**, shuning uchun xarajatlar haqida bildirishnomalarni yoqing.

## Vercel kimga yaxshi mos kelmaydi

- **Uzoq fon vazifalari**: videoni qayta ishlash, katta importlar, soatlab ishlaydigan navbatlar. Funksiyalarning bajarilish vaqti cheklangan.
- **Doimiy ulanishlar**: o‘z WebSocket-serveringiz, o‘yin serverlari, long polling’dagi bot. Telegram-bot uchun webhook yoki alohida serverdan foydalanish yaxshiroq.
- **Ma’lumotlar bazalari**: Vercel bazangizni o‘zi saqlamaydi — tashqi xizmat kerak bo‘ladi, iloji bo‘lsa funksiyalar bilan bir regionda.
- **Og‘ir backend** — o‘z jarayonlari, cron-vazifalari va lokal diski bilan.
- **Oq ro‘yxatlar uchun qat’iy chiquvchi IP talab qiladigan integratsiyalar**: odatiy holatda u yo‘q.

Ko‘p qo‘llaniladigan ishchi sxema: frontend va yengil API — Vercel’da, asosiy backend, navbatlar va baza — VPS’da yoki bulutda.

## FAQ

### Vercel’da Next.js’da bo‘lmagan saytni joylash mumkinmi?

Ha. Vercel ko‘plab freymvorklarni va oddiy statik saytlarni qo‘llab-quvvatlaydi. Next.js shunchaki ko‘proq maxsus imkoniyatlarga ega, chunki uni o‘sha kompaniya rivojlantiradi.

### O‘z domenimni ulasam bo‘ladimi?

Ha, barcha tariflarda. Domenni loyihaga qo‘shib, Vercel ko‘rsatgan DNS-yozuvlarni kiritish kerak. SSL-sertifikat avtomatik chiqariladi.

### Saytga birdan ko‘p trafik kelsa nima bo‘ladi?

Platforma o‘zi masshtablanadi va sayt ishlashda davom etadi. Lekin pullik tariflarda iste’mol uchun hisob o‘sadi, shuning uchun limitlar va xarajatlar haqida bildirishnomalarni oldindan sozlang.
