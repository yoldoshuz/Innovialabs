---
title: Core Web Vitals nima: LCP, INP va CLS sodda tilda
description: Core Web Vitals metrikalari — LCP, INP va CLS nimani o‘lchaydi, qaysi qiymatlar yaxshi hisoblanadi va ularni qayerda tekshirish mumkinligi haqida.
summary: Core Web Vitals — sahifaning yuklanish tezligi (LCP), javob berish tezligi (INP) va vizual barqarorligi (CLS) bo‘yicha uchta Google metrikasi. Yaxshi qiymatlar: LCP 2,5 s gacha, INP 200 ms gacha, CLS 0,1 gacha.
---
## Qisqacha: Core Web Vitals nima

**Core Web Vitals** — Google sahifadagi real foydalanuvchi tajribasini baholaydigan uchta metrika:

- **LCP** (Largest Contentful Paint) — asosiy kontent qanchalik tez paydo bo‘ladi;
- **INP** (Interaction to Next Paint) — sahifa harakatlarga qanchalik tez javob beradi;
- **CLS** (Cumulative Layout Shift) — yuklanish paytida sahifa elementlari qanchalik «sakraydi».

Metrikalar faqat laboratoriya testlarida emas, real tashrif buyuruvchilar ma’lumotlarida (field data) o‘lchanadi. Sahifa yaxshi hisoblanadi, agar chegaralar tashriflarning **75-persentilida** bajarilsa — ya’ni o‘rtacha emas, balki ko‘pchilik foydalanuvchilar uchun.

## Chegara qiymatlari

| Metrika | Yaxshi | Yaxshilash kerak | Yomon |
|---|---|---|---|
| LCP | 2,5 s gacha | 2,5–4 s | 4 s dan ko‘p |
| INP | 200 ms gacha | 200–500 ms | 500 ms dan ko‘p |
| CLS | 0,1 gacha | 0,1–0,25 | 0,25 dan ko‘p |

## LCP: asosiy kontentning yuklanish tezligi

LCP birinchi ekrandagi eng katta ko‘rinadigan element chizilgan paytni qayd etadi: odatda bu banner, mahsulot surati yoki katta sarlavha.

LCP ni ko‘pincha nima yomonlashtiradi:

- serverning sekin javobi (yuqori **TTFB**);
- siqilmagan, eski formatdagi og‘ir rasmlar;
- render’ni bloklaydigan CSS va JavaScript;
- lazy yuklanadigan (`loading="lazy"`) yoki skript orqali qo‘shiladigan hero-rasm.

## INP: interfeysning javob berishi

INP foydalanuvchi harakati (bosish, teginish, klaviaturadan kiritish) va ekranning keyingi chizilishi orasidagi kechikishni ko‘rsatadi. 2024-yilda INP avvalgi FID metrikasini almashtirdi, chunki u faqat birinchisini emas, tashrif davomidagi barcha o‘zaro ta’sirlarni hisobga oladi.

Yomon INP ning odatiy sabablari:

- asosiy oqimni band qiladigan uzun JavaScript vazifalari;
- og‘ir uchinchi tomon skriptlari: vidjetlar, chatlar, trekerlar;
- React va boshqa freymvorklardagi ortiqcha qayta chizishlar;
- bir vaqtda juda ko‘p ish bajaradigan event handler’lar.

## CLS: sahifa tuzilishining barqarorligi

CLS kutilmagan siljishlarni jamlaydi. Klassik misol: tugmani bosmoqchi bo‘lasiz, tepada banner yuklanadi va barmog‘ingiz boshqa joyga tegadi.

Siljishlarning oldini olish:

- rasm va videolar uchun `width` va `height` (yoki `aspect-ratio`) belgilang;
- reklama, embed bloklar va cookie bannerlari uchun joy ajrating;
- shriftlarni almashtirish matn o‘lchamini o‘zgartirmaydigan qilib yuklang;
- foydalanuvchi harakatisiz ko‘rinib turgan kontent ustiga yangi kontent qo‘shmang.

## Core Web Vitals reytingga qanday ta’sir qiladi

Core Web Vitals Google’ning **page experience** signallari tarkibiga kiradi. Lekin miqyosni tushunish muhim: bu asosiy omil emas. Relevant va foydali kontent baribir muhimroq, kuchsiz kontentli tez sahifa kuchli, ammo sekinroq sahifadan o‘zib keta olmaydi.

Metrikalar qayerda haqiqatan hal qiladi:

- sifati yaqin raqobatchilar orasida;
- konversiyada: sekin va beqaror sayt pozitsiyasidan qat’i nazar arizalarni yo‘qotadi;
- mobil qurilmalar va sust internetda, bu yerda muammolar eng ko‘p seziladi.

## Metrikalarni qayerda tekshirish mumkin

- **PageSpeed Insights** — field data (trafik yetarli bo‘lsa) va aniq URL uchun Lighthouse laboratoriya testi.
- **Google Search Console**, Core Web Vitals hisoboti — sayt bo‘yicha muammoli sahifalar guruhlari.
- **Chrome DevTools**, Performance paneli — aniq sabablarni topish uchun.
- **web-vitals kutubxonasi** — real foydalanuvchilardan metrikalarni o‘z analitikangizga yig‘ish uchun.

Esda tuting: laboratoriya testi — emulyatsiya qilingan qurilmada bitta yuklanish. Baholashda field data’ga tayaning, laboratoriyadan esa diagnostika uchun foydalaning.

## Ko‘p uchraydigan xatolar

- **Faqat bosh sahifani optimallashtirish.** Foydalanuvchilar mahsulot kartochkalari va maqolalarga ham kiradi — barcha sahifa shablonlarini tekshiring.
- **Lighthouse’da 100 ball ortidan quvish.** Lighthouse bali — bu Core Web Vitals emas; real ma’lumotlardagi chegaralar muhim.
- **Natijani darhol kutish.** Field data taxminan 28 kunlik davr bo‘yicha yig‘iladi, shuning uchun yaxshilanishlar kechikib ko‘rinadi.

## FAQ

### Uchala metrika ham «yashil» bo‘lishi shartmi?

Ha, sahifa faqat uchala metrika 75-persentilda «yaxshi» zonada bo‘lsagina baholashdan o‘tadi. Eng ko‘p ortda qolgan metrikadan boshlang.

### Nega PageSpeed Insights’da field data yo‘q?

Field data Chrome UX Report’dan olinadi, u esa faqat yetarli real trafikka ega sahifa va saytlar uchun shakllanadi. Yangi yoki kam tashrif buyuriladigan sahifalar uchun faqat laboratoriya bahosi mavjud.

### Core Web Vitals Yandex uchun muhimmi?

Yandex Core Web Vitals’ni rasmiy metrikalar to‘plami sifatida ishlatmaydi, ammo sayt tezligi va qulayligi foydalanuvchilar xulq-atvoriga ta’sir qiladi, bu esa istalgan qidiruv tizimidagi natijalarga ta’sir ko‘rsatadi.
