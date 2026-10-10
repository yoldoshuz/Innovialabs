---
title: Saytning SEO-auditi: bosqichma-bosqich chek-list
description: SEO-audit chek-listi: indeksatsiya, texnik holat, on-page, kontent, havolalar va lokal SEO, har bir tekshiruv uchun vositalar va tuzatishlar ustuvorligi.
summary: SEO-audit yuqoridan pastga boradi: avval qidiruv tizimi sahifalarni ko‘rishi tekshiriladi, keyin texnik holat, on-page, kontent, havolalar va lokal mavjudlik, tuzatishlar esa ta’sir va mehnatga qarab saralanadi.
---

## Audit nimadan boshlanadi

Audit qat’iy tartibda o‘tkaziladi: **indeksatsiya → texnika → on-page → kontent → havolalar → lokal SEO**. Mantiq oddiy: sahifa indeksga tushmagan bo‘lsa, uning sarlavhalarini yaxshilashdan foyda yo‘q. Har bir keyingi bosqich oldingisi tartibga keltirilgandan keyingina ma’noga ega.

Asosiy audit uchun bepul vositalar yetarli:

- **Google Search Console** va **Yandex Webmaster** — qidiruv tizimlarining o‘z ma’lumotlari;
- **krauler** (Screaming Frog, Sitebulb yoki o‘xshashi) — saytni qidiruv roboti kabi aylanib chiqadi;
- **PageSpeed Insights** — tezlik va Core Web Vitals;
- qidiruvdagi `site:` operatori — tezkor taxminiy tekshiruv.

## 1. Indeksatsiya

- Indeksdagi sahifalar sonini qidiruvda bo‘lishi kerak bo‘lgan sahifalar soni bilan solishtiring.
- Muhim URL’lar orasida "Discovered - currently not indexed" va "Crawled - currently not indexed" statuslilarini toping.
- `robots.txt`ni tekshiring: bo‘limlar, CSS yoki JS yopilmaganmi.
- Meta robots va `X-Robots-Tag` HTTP sarlavhasida tasodifiy `noindex` qidiring.
- `sitemap.xml` mavjud, ikkala panelga yuborilgan va faqat 200 javob beradigan kanonik URL’lardan iborat ekaniga ishonch hosil qiling.

## 2. Texnik holat

Kraulerni ishga tushiring va hisobotlarni ko‘rib chiqing:

| Tekshiruv | Nimani qidiramiz |
|---|---|
| Javob kodlari | 404, 5xx, redirect zanjirlari va halqalari |
| Kanonik teglar | boshqa yoki indekslanmaydigan sahifaga canonical |
| Dublikatlar | www bilan/siz, slesh bilan/siz, URL parametrlari |
| HTTPS | aralash kontent, http’dan redirect |
| Tezlik | PageSpeed Insights’da LCP, INP, CLS |
| Mobil versiya | kontent va havolalar desktop bilan bir xil |
| Chuqurlik | muhim sahifalar bosh sahifadan 3–4 klikdan uzoqda |

Server asosiy kontentni HTML’da beradimi yoki u faqat JavaScript bajarilgandan keyin paydo bo‘ladimi — buni alohida tekshiring.

## 3. On-page

- **Title** noyob, so‘rovga mos va qisqartirilmaydi.
- **Description** noyob va sahifani oddiy tilda tasvirlaydi.
- Bitta **H1**, mantiqiy H2–H3 ierarxiyasi.
- Mazmunli rasmlarda **alt** matni.
- **Mikrorazmetka** (Organization, Product, Article, FAQ) validatsiyadan o‘tadi.
- **Ichki havolalar** muhim sahifalarga tushunarli ankorlar bilan olib boradi.

## 4. Kontent

- Har bir kalit so‘rovlar guruhiga bitta sahifa mos keladi — **kannibalizatsiya**siz.
- Bir-ikki qatorli yupqa sahifalar va shablon dublikatlari yo‘q.
- Matnlar kalit so‘zlar bilan to‘ldirilmagan, foydalanuvchi savoliga javob beradi.
- Eskirgan materiallar yangilangan yoki birlashtirilgan.

## 5. Havolalar

- Search Console va Webmaster’dagi tashqi havolalar hisobotini ko‘ring.
- Hozir 404 qaytaradigan sahifalarga olib boruvchi havolalarni toping — bu yo‘qotilgan og‘irlik.
- Ochiq spam donorlar va havolalarning keskin ko‘payishini tekshiring.
- Hech qanday ichki havola olib bormaydigan **yetim sahifalar**ni toping.

## 6. Lokal SEO

Agar biznes oflayn ishlasa:

- **Google Business Profile** va **Yandex Biznes**dagi kartochkalar to‘ldirilgan va tasdiqlangan;
- nom, manzil va telefon (**NAP**) saytda va barcha ma’lumotnomalarda bir xil;
- manzil va xaritali kontaktlar sahifasi bor, bir nechta filial bo‘lsa — alohida sahifalar;
- sharhlarga javob beriladi.

## Ustuvorlikni qanday belgilash kerak

Topilganlarni bitta jadvalga yig‘ing va har bir muammoni ikki o‘q bo‘yicha baholang: **ta’sir** va **mehnat**.

1. **Blokerlar** — indeksatsiyaga xalaqit beradigan hamma narsa: noindex, yopiq robots, 5xx. Birinchi navbatda tuzatiladi.
2. **Ta’siri yuqori, ishi kam** — title, buzilgan havolalar uchun redirectlar, sitemap.
3. **Ta’siri yuqori, ishi ko‘p** — tezlik, arxitektura, kontentni qayta ishlash. Sprintlarga rejalashtiriladi.
4. **Ta’siri past** — kosmetika, vaqt qolganda qilinadi.

Odatiy xato — krauler hisobotidagi yuzlab mayda narsalardan boshlab, butun katalogni yopib qo‘ygan robots.txt’dagi bitta qatorni sezmay qolish.

## FAQ

### SEO-auditni qanchalik tez-tez o‘tkazish kerak?

To‘liq auditni redizayn, ko‘chish yoki CMS almashtirilgandan keyin va profilaktika uchun vaqti-vaqti bilan qilish maqsadga muvofiq. Search Console va Webmaster’dagi indeksatsiya va xatolarni muntazam ko‘rib turish kerak, bu bir necha daqiqa oladi.

### Pullik vositalarsiz audit qilish mumkinmi?

Ha. Search Console, Webmaster, PageSpeed Insights va kraulerning bepul versiyasi kichik sayt uchun tekshiruvlarning ko‘pchiligini qamrab oladi. Pullik servislar havolalarni tahlil qilish va yirik loyihalar uchun foydali.

### Nima muhimroq: texnika yoki kontent?

Avval texnika, chunki indeksatsiyasiz kontentni hech kim ko‘rmaydi. Lekin blokerlar bartaraf etilgach, asosiy o‘sishni odatda so‘rovlarga raqobatchilardan yaxshiroq javob beradigan kontent beradi.
