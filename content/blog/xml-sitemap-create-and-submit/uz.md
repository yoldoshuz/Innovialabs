---
title: XML sayt xaritasini yaratish va qidiruv tizimlariga yuborish
description: sitemap.xml formati, qaysi sahifalarni kiritish va chiqarish, indeks fayllar, CMS va frameworklarda yaratish hamda xaritani Google va Yandex’ga yuborish.
summary: XML sayt xaritasi — kanonik va indekslanadigan URL’lar ro‘yxati; uni CMS yoki framework orqali yarating, robots.txt’da ko‘rsating va Google Search Console hamda Yandex Webmaster’ga yuboring.
---
## Qisqa javob

**Sitemap.xml** — qidiruvda ko‘rinishini istagan sahifalaringiz ro‘yxati joylashgan fayl. U qidiruv tizimlariga yangi va yangilangan URL’larni tezroq topishga yordam beradi, ayniqsa katta saytlarda va ichki havolalari kam bo‘limlarda. Tartib: xaritani yaratish, unda faqat kerakli sahifalar borligini tekshirish, robots.txt’ga havola qo‘shish va vebmaster panellariga yuborish.

## Fayl formati

Minimal xarita quyidagicha ko‘rinadi:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-09-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/services/</loc>
  </url>
</urlset>
```

Asosiy qoidalar:

- protokol bilan to‘liq absolyut URL’lar;
- UTF-8 kodlash;
- bitta faylda **50 000 URL** va siqilmagan holda **50 MB**dan oshmasin;
- `lastmod`ni faqat kontent haqiqatan o‘zgargan bo‘lsa ko‘rsating.

Google `changefreq` va `priority` teglarini e’tiborsiz qoldiradi, shuning uchun ularga vaqt sarflash shart emas.

## Nimani kiritish va nimani chiqarish kerak

| Kiritish | Chiqarish |
|---|---|
| 200 kodli kanonik sahifalar | Redirektlar va xatoli sahifalar |
| Indeksatsiyaga ochiq sahifalar | noindex yoki robots.txt’da yopilgan URL’lar |
| Muhim kategoriyalar, mahsulotlar, maqolalar | Dublikatlar, filtrlar, saralash parametrlari |
| Saytning barcha til versiyalari | Savat, shaxsiy kabinet, sayt ichidagi qidiruv |

Asosiy tamoyil: xarita boshqa signallarga zid bo‘lmasligi kerak. URL sitemap’da bo‘lsa-yu, noindex bilan yopilgan bo‘lsa — bu xato.

## Katta saytlar uchun indeks fayl

URL’lar limitdan oshsa yoki xaritani turlar bo‘yicha ajratmoqchi bo‘lsangiz, **sitemap index** ishlating:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>https://example.com/sitemap-products.xml</loc></sitemap>
</sitemapindex>
```

Turlar bo‘yicha ajratish diagnostikani ham osonlashtiradi: panelda qaysi bo‘lim yomonroq indekslanayotgani ko‘rinadi.

## CMS va frameworklarda yaratish

- **WordPress** — yadroning o‘rnatilgan xaritasi yoki SEO-plaginlar (Yoast, Rank Math).
- **Bitrix, Tilda, Shopify** — xarita standart vositalar bilan yaratiladi, uni yoqish va tekshirish kerak.
- **Next.js** — URL’lar massivini qaytaruvchi `app/sitemap.ts` fayli; sahifalar bazadan yoki CMS’dan olinadi.
- **Boshqa frameworklar** — generator paketlar yoki bazadan XML yasaydigan o‘z endpoint’ingiz.

Xarita sahifalar qo‘shilganda va o‘chirilganda avtomatik yangilanishi kerak, yiliga bir marta qo‘lda yig‘ilmasligi lozim.

## Google va Yandex’ga yuborish

1. robots.txt’ga qator qo‘shing: `Sitemap: https://example.com/sitemap.xml`.
2. **Google Search Console** — «Sitemaps» bo‘limi, xarita URL’ini kiriting.
3. **Yandex Webmaster** — «Indeksatsiya» → «Sitemap fayllari».
4. Bir necha kundan keyin holatni tekshiring: o‘qish xatolari va topilgan URL’lar soni.

## Ko‘p uchraydigan xatolar

- URL’lar https o‘rniga http bilan yoki asosiy oynaga mos kelmaydigan www varianti bilan.
- Redirekt va 404 sahifalar kiritilgan.
- Kontent o‘zgarmasa ham `lastmod` har generatsiyada yangilanadi.
- Xarita robots.txt’da yopilgan yoki server xatosini qaytaradi.

## FAQ

### Sitemap indeksatsiyani kafolatlaydimi?

Yo‘q. Xarita sahifalarni topishga yordam beradi, lekin indeksatsiya haqida qarorni qidiruv tizimi kontent sifati va foydaliligiga qarab qabul qiladi.

### Kichik saytga xarita kerakmi?

Sahifalar kam va hammasi havolalar bilan bog‘langan bo‘lsa, qidiruv tizimlari ularni baribir topadi. Ammo xarita zarar qilmaydi va indeksatsiyani nazorat qilishni osonlashtiradi.

### Uni qanchalik tez-tez yangilash kerak?

Eng yaxshisi — sahifalar to‘plami o‘zgarganda avtomatik ravishda. Har yangilanishdan keyin xaritani panelga qayta yuborish shart emas.
