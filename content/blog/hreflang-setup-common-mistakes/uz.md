---
title: hreflang’ni qanday sozlash va odatiy xatolardan qochish
description: HTML, HTTP sarlavhalari va sitemap’da hreflang sintaksisi, x-default, o‘zaro havolalar, til va mintaqa kodlari hamda belgilashni buzadigan xatolar.
summary: hreflang qidiruv tizimiga qaysi sahifalar bir-birining tarjimasi ekanini bildiradi. Har bir versiya qolgan barcha versiyalarga va o‘ziga to‘g‘ri kodlar va absolyut URL bilan havola qilishi kerak, aks holda belgilash e’tiborsiz qoladi.
---
## hreflang nima qiladi

**hreflang** atributi bitta sahifaning til va mintaqaviy versiyalarini bog‘laydi. Uning yordamida qidiruv tizimi foydalanuvchiga tasodifiy emas, uning tilidagi versiyani ko‘rsatadi. hreflang o‘z-o‘zidan pozitsiyalarni oshirmaydi va indeksatsiyani taqiqlamaydi — bu qaysi URL’ni kimga ko‘rsatish haqidagi ishora.

Belgilashni uch usuldan biri bilan joylashtirish mumkin. Bittasini tanlang va zarurat bo‘lmasa aralashtirmang.

## 1-usul: HTML teglari

Sahifaning har bir versiyasi `<head>` qismida barcha versiyalar, jumladan o‘zi ham sanab o‘tiladi:

```html
<link rel="alternate" hreflang="ru" href="https://site.com/ru/pricing/" />
<link rel="alternate" hreflang="en" href="https://site.com/en/pricing/" />
<link rel="alternate" hreflang="uz" href="https://site.com/uz/pricing/" />
<link rel="alternate" hreflang="x-default" href="https://site.com/en/pricing/" />
```

Bu blok uchala sahifada bir xil. Tillar soni kam bo‘lgan saytlar uchun eng ko‘rgazmali variant.

## 2-usul: HTTP sarlavhasi

HTML bo‘lmagan fayllar, masalan PDF uchun mos:

```http
Link: <https://site.com/ru/guide.pdf>; rel="alternate"; hreflang="ru",
      <https://site.com/en/guide.pdf>; rel="alternate"; hreflang="en"
```

## 3-usul: sitemap

Katta saytlar uchun qulay: belgilash sahifalarni og‘irlashtirmaydi va markazlashgan holda boshqariladi.

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://site.com/ru/pricing/</loc>
    <xhtml:link rel="alternate" hreflang="ru" href="https://site.com/ru/pricing/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://site.com/en/pricing/"/>
    <xhtml:link rel="alternate" hreflang="uz" href="https://site.com/uz/pricing/"/>
  </url>
  <!-- /en/ va /uz/ uchun ham xuddi shunday <url> -->
</urlset>
```

## Til va mintaqa kodlari

- **Til** — ISO 639-1 kodi: `ru`, `en`, `uz`.
- **Mintaqa** (ixtiyoriy) — defisdan keyin ISO 3166-1 alpha-2 mamlakat kodi: `ru-UZ`, `en-GB`.
- Tilsiz mintaqa ruxsat etilmaydi: `hreflang="UZ"` — xato.
- Tartib muhim: avval til, keyin mamlakat. `uz-RU` «Rossiya uchun o‘zbek tili» degani, aksincha emas.
- Ikkala versiya bo‘lsa, yozuvni ham ko‘rsatish mumkin: `uz-Latn`, `uz-Cyrl`.

## x-default

`x-default` — sanab o‘tilganlarning hech biri mos kelmagan barcha uchun versiya. Odatda bu inglizcha sahifa yoki til tanlash sahifasi. U majburiy emas, lekin shunday «zaxira» variant bo‘lsa foydali.

## To‘g‘ri sozlash uchun chek-list

- **O‘zaro bog‘liqlik.** Agar A sahifa B’ga havola qilsa, B ham A’ga havola qilishi shart. Qaytuvchi havolasiz juftlik e’tiborsiz qoladi.
- **O‘ziga havola.** Har bir sahifa ro‘yxatga o‘zini ham kiritadi.
- **Absolyut URL’lar** protokol bilan: `/en/` emas, `https://site.com/en/`.
- **Kanonik manzillar.** hreflang’dagi URL’lar shu sahifalarning canonical’iga mos kelishi va 200 kodini qaytarishi kerak.
- **Sahifalar mosligi.** Barcha sahifalar bosh sahifa bilan emas, aynan bitta sahifaning tarjimalari bog‘lanadi.

## Odatiy xatolar

| Xato | Oqibati |
|---|---|
| Qaytuvchi havolalar yo‘q | Bog‘lanish hisobga olinmaydi |
| `hreflang="en-UK"` | Noto‘g‘ri mamlakat kodi, to‘g‘risi `en-GB` |
| Barcha versiyalarning canonical’i bittasiga ishora qiladi | Tarjimalar indeksdan tushib qoladi |
| hreflang’da redirekt yoki 404 qaytaradigan URL | Signal yo‘qoladi |
| Belgilash faqat bosh sahifaga qo‘shilgan | Ichki sahifalar bog‘lanmagan qoladi |
| Turli versiyalarda turli til to‘plamlari | Qarama-qarshi signallar |

## Qanday tekshirish kerak

- Har bir versiyaning bir nechta sahifasi manba kodini oching va havolalar to‘plamini solishtiring.
- hreflang o‘zaro bog‘liqligini tekshira oladigan sayt krauleridan foydalaning.
- Vebmaster panellaridagi xalqaro nishonlash va indeksatsiya hisobotlarini kuzating.

Batafsil spetsifikatsiya [Google hujjatlarida](https://developers.google.com/search/docs/specialty/international/localized-versions) bor.

## FAQ

### Saytda faqat ikki til bo‘lsa, hreflang kerakmi?

Ha, agar versiyalar aynan bir xil sahifalarning tarjimalari bo‘lsa. Ikki til bo‘lganda ham belgilash qidiruv tizimiga natijalarda versiyalarni adashtirmaslikka yordam beradi.

### hreflang’ni canonical o‘rniga ishlatsa bo‘ladimi?

Yo‘q, bular turli vositalar. Canonical dublikatlar orasidan asosiy nusxani ko‘rsatadi, hreflang esa tarjimalarni bog‘laydi. Har bir til versiyasi o‘zi uchun kanonik bo‘lishi kerak.

### Nimani tanlash kerak: HTML teglari yoki sitemap?

Kichik saytlar uchun HTML teglari soddaroq. Kattalari uchun sitemap yaxshiroq: u sahifalar hajmini oshirmaydi va avtomatik generatsiya qilish osonroq.
