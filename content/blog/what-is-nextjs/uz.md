---
title: Next.js nima va u React’ga nima qo‘shadi
description: Next.js oddiy tilda: marshrutlash, serverda render qilish, API, rasm va shriftlarni optimallashtirish, deploy hamda u eng mos keladigan loyihalar.
summary: Next.js — React ustiga qurilgan freymvork bo‘lib, sayt tez yuklanishi va yaxshi indekslanishi uchun tayyor marshrutlash, serverda render, backend endpointlar va optimallashtirishni qo‘shadi.
---
## Qisqa javob: React — kutubxona, Next.js — freymvork

**React** bitta vazifani bajaradi: interfeysni komponentlar orqali tasvirlash va ma’lumot o‘zgarganda uni yangilash. Qolgan hammasi — marshrutlar, ma’lumot yuklash, yig‘ish (build), SEO, server — alohida vositalardan o‘zingiz yig‘asiz.

**Next.js** React’ni olib, shu savollarni siz uchun hal qiladi. Har bir papka sahifa bo‘lgan loyiha tuzilmasi, serverda tayyorlanadigan HTML hamda avtomatik optimallashtiriladigan rasmlar, shriftlar va skriptlarni olasiz.

## Fayllar orqali marshrutlash

Oddiy React ilovasida marshrutlar alohida kutubxona yordamida kodda yoziladi. Next.js’da marshrut — bu fayl yoki papka:

```text
app/
  page.tsx             -> /
  about/page.tsx       -> /about
  blog/[slug]/page.tsx -> /blog/istalgan-maqola
```

Bu yondashuvning afzalliklari:

- sayt tuzilmasi fayllar daraxtida darhol ko‘rinadi;
- **ichma-ich layoutlar** (sarlavha, menyu, futer) bir marta yoziladi va sahifalar almashganda qayta chizilmaydi;
- kod sahifalar bo‘yicha avtomatik bo‘linadi — foydalanuvchi faqat hozir kerak bo‘lgan qismni yuklaydi.

## Serverda render qilish

Next.js React’ga qo‘shadigan eng asosiy narsa — **serverda render qilish**. Bir nechta rejim bor:

| Rejim | HTML qachon yaratiladi | Nima uchun mos |
|---|---|---|
| Statik generatsiya (SSG) | build vaqtida | lendinglar, bloglar, hujjatlar |
| Bosqichma-bosqich yangilash (ISR) | build vaqtida, keyin davriy | kataloglar, yangiliklar |
| Serverda render (SSR) | har bir so‘rovda | shaxsiy va tez o‘zgaradigan ma’lumotlar |
| Mijoz tomonida render | brauzerda | interfeysning interaktiv qismlari |

Nega bu muhim: qidiruv tizimi ham, foydalanuvchi ham JavaScript yuklangandan keyin to‘ladigan bo‘sh sahifani emas, balki matnli tayyor HTML’ni darhol oladi. Bu **SEO** va birinchi ko‘rinish tezligiga yordam beradi.

## Loyiha ichidagi backend

Next.js frontend yonida server kodini yozish imkonini beradi:

- **Route Handlers** (avval API routes deyilgan) — oddiy HTTP endpointlar, masalan ariza formasi yoki webhook uchun;
- **Server Actions** — formadan chaqiriladigan va qo‘lda API yozmasdan serverda bajariladigan funksiyalar.

Kichik loyihalarda bu alohida backend xizmatiga ehtiyojni yo‘qotadi. Murakkab biznes-mantiq uchun esa alohida backend baribir oqilonaroq bo‘lishi mumkin.

## Rasmlar, shriftlar va skriptlar

O‘rnatilgan komponentlar odatiy unumdorlik muammolarini hal qiladi:

- **next/image** — rasmlarni kerakli o‘lchamda va zamonaviy formatda beradi, ularni dangasa yuklaydi va sahifa «sakramasligi» uchun joy ajratadi;
- **next/font** — shriftlarni uchinchi tomon serverlariga ortiqcha so‘rovlarsiz va matn miltillamasdan ulaydi;
- **next/script** — analitika kabi tashqi skriptlar qachon yuklanishini boshqaradi.

Bularning barchasi **Core Web Vitals** ko‘rsatkichlariga bevosita ta’sir qiladi.

## Deploy

Joylashtirish variantlari:

- **Vercel** — Next.js mualliflarining platformasi, bir necha bosishda deploy;
- **o‘z Node.js serveringiz** — `next build` va `next start`, ko‘pincha nginx ortidagi Docker’da;
- **statik eksport** — saytga server kerak bo‘lmasa, uni HTML fayllar to‘plami sifatida istalgan hostingga chiqarish mumkin.

## Next.js qaysi loyihalarga mos

**Yaxshi mos keladi:**

- indekslanish muhim bo‘lgan korporativ saytlar, lendinglar va bloglar;
- internet-do‘konlar va kataloglar;
- ko‘p tilli saytlar;
- marketing sahifalari va shaxsiy kabinet bitta loyihada yashaydigan mahsulotlar.

**Ortiqcha bo‘lishi mumkin:**

- SEO kerak bo‘lmagan, login ortidagi ichki admin panel;
- server qismi yo‘q kichik vidjet yoki bir sahifali ilova.

## FAQ

### Next.js’ni o‘rganishdan oldin React’ni bilish kerakmi?

Ha, hech bo‘lmaganda asoslarini: komponentlar, props, holat (state) va hooklar. Next.js React ustiga qurilgan va bu tushunchalarsiz uning imkoniyatlarini tushunish qiyin.

### Next.js frontendmi yoki backendmi?

Ikkalasi ham. Asosiy vazifasi — interfeys, ammo unda server kodini ham yozish mumkin: render, endpointlar, ma’lumotlar bazasi bilan ishlash. Og‘ir mantiq ko‘pincha alohida backendga chiqariladi.

### Next.js’ni albatta Vercel’da joylashtirish shartmi?

Yo‘q. Loyihani Node.js o‘rnatilgan istalgan serverda, Docker konteynerida ishga tushirish yoki server funksiyalari bo‘lmasa, statik sayt sifatida eksport qilish mumkin.
