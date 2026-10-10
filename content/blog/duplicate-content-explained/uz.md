---
title: Dublikat sahifalar: bu nima va SEO’ga qanday zarar qiladi
description: To‘liq va qisman dublikat sahifalar nima, ular qayerdan paydo bo‘ladi (www, slesh, parametrlar, chop etish sahifalari) va har birini qanday tuzatish mumkin.
summary: Dublikat — bu turli URL’lardagi bir xil yoki deyarli bir xil kontent. U qidiruv tizimini qaysi sahifani ko‘rsatishda chalg‘itadi, havola signallarini bo‘lib yuboradi va skanerlash resursini sarflaydi; 301-redirekt, rel=canonical va parametrlarni to‘g‘ri sozlash bilan tuzatiladi.
---
## Dublikat nima va nega bu muammo

**Dublikat** — kontenti saytdagi boshqa sahifa bilan to‘liq yoki deyarli to‘liq mos keladigan, lekin boshqa manzilda ochiladigan sahifa.

- **To‘liq dublikatlar** — turli URL’larda bir xil kontent: `site.uz/page` va `site.uz/page/`.
- **Qisman dublikatlar** — umumiy matni ko‘p bo‘lgan sahifalar: faqat rangi bilan farq qiladigan mahsulot kartochkalari, filtr va paginatsiya sahifalari, bir xil kategoriya tavsiflari.

Zarari nimada:

- qidiruv tizimi qaysi versiyani ko‘rsatishni o‘zi tanlaydi va noto‘g‘risini tanlashi mumkin;
- tashqi va ichki havolalar bitta sahifani kuchaytirish o‘rniga nusxalar orasida taqsimlanadi;
- robot yangi sahifalar o‘rniga nusxalarni skanerlashga vaqt sarflaydi;
- qidiruvda sahifalar o‘rin almashib, pozitsiyalar «sakraydi».

Texnik dublikatning o‘zi odatda sanksiyaga olib kelmaydi. Sanksiya nusxalash manipulyatsiya uchun qilinganda mumkin — masalan, turli so‘rovlar uchun sahifalar ommaviy klonlansa.

## Odatiy texnik sabablar va yechimlar

| Sabab | Misol | Yechim |
|---|---|---|
| www va www’siz | `www.site.uz` va `site.uz` | Bitta versiyaga 301-redirekt |
| http va https | `http://` va `https://` | https’ga 301-redirekt |
| Oxiridagi slesh | `/catalog` va `/catalog/` | Bitta formatni tanlab, unga 301 |
| index fayllar | `/` va `/index.php` | Asosiy manzilga 301 |
| GET-parametrlar | `?utm_source=...`, `?sort=price` | Asosiy sahifaga rel=canonical, Yandex uchun Clean-param |
| Chop etish versiyalari | `/page/print` | noindex yoki asl sahifaga canonical |
| Harf registri | `/Page` va `/page` | Kichik harflarga 301 |

## Asosiy vositalar qanday ishlaydi

**301-redirekt** — nusxa foydalanuvchiga kerak bo‘lmaganda eng ishonchli usul. Tashrif buyuruvchi ham, robot ham darhol to‘g‘ri manzilga tushadi, signallar ham unga o‘tadi.

**rel=canonical** — nusxa ochiq qolishi kerak bo‘lganda (saralash, UTM-belgilar) qidiruv tizimiga qaysi versiya asosiy ekanini bildiradi:

```html
<link rel="canonical" href="https://site.uz/catalog/">
```

Google ham, Yandex ham canonical’ni qat’iy buyruq emas, tavsiya sifatida qabul qiladi. Sahifalar juda farq qilsa, qidiruv tizimi uni e’tiborsiz qoldirishi mumkin.

**Clean-param** — Yandex tushunadigan robots.txt direktivasi. U parametr sahifa mazmunini o‘zgartirmasligini bildiradi:

```text
User-agent: Yandex
Clean-param: utm_source&utm_medium&utm_campaign
```

**noindex** — sahifani indeksdan olib tashlaydi, lekin uning signallarini boshqa sahifaga o‘tkazmaydi. Qidiruvga chiqmasligi kerak bo‘lgan xizmat sahifalari uchun mos.

## Qisman dublikatlar bilan ishlash

- **Mahsulot variantlari:** rang va o‘lchamlarni variant tanlovi bor bitta kartochkaga birlashtiring yoki noyob tavsiflar yozing.
- **Filtrlar:** faqat real talab bor kombinatsiyalarni indekslang, qolganlarini canonical yoki noindex bilan yoping.
- **Paginatsiya:** turli mahsulotlar bor har bir paginatsiya sahifasida birinchi sahifaga emas, o‘ziga canonical bo‘lishi kerak.
- **Shablon matn:** bir xil katta SEO-blokni barcha kategoriya sahifalarida takrorlamang.

## Dublikatlarni qanday topish mumkin

1. Sayt krauleri orqali mos keladigan title, description va H1’larni toping.
2. Search Console’dagi indekslash hisobotlarini tekshiring — Google qaysi sahifalarni nusxa deb hisoblashi u yerda ko‘rinadi.
3. Yandex Vebmasterdagi «Qidiruvdagi sahifalar» va diagnostika bo‘limini ko‘rib chiqing.
4. Saytni www bilan va www’siz, slesh bilan va sleshsiz qo‘lda oching — redirekt ishlashi kerak.

## Ko‘p uchraydigan xatolar

- Barcha paginatsiya sahifalaridan birinchi sahifaga canonical qo‘yish.
- Dublikatlarni robots.txt’da Disallow bilan yopish — robot yopilgan sahifadagi canonical’ni ko‘rmaydi.
- Ichki havolalarda bitta manzilning turli versiyalaridan foydalanish.
- Sitemap’da kanonik bo‘lmagan URL’larni ko‘rsatish.

## FAQ

### Kichik saytda dublikatlar bilan kurashish kerakmi?

Ha, ayniqsa texnik dublikatlar bilan: www, https va slesh uchun redirektlarni sozlash — bir martalik ish. Kichik saytda sahifalar kam bo‘lgani uchun noto‘g‘ri asosiy sahifa tanlanishi ko‘proq seziladi.

### Qaysi biri yaxshiroq: 301-redirektmi yoki canonical?

Nusxa foydalanuvchilarga kerak bo‘lmasa — 301. Sahifa ochiq qolishi kerak bo‘lsa (saralash, UTM-belgilar, chop etish versiyasi) — canonical.

### Turli tillardagi bir xil matn dublikat hisoblanadimi?

Yo‘q. Tarjimalar — alohida sahifalar. Til versiyalarini hreflang atributlari bilan bog‘lang, shunda qidiruv tizimi har bir foydalanuvchiga kerakli tilni ko‘rsatadi.
