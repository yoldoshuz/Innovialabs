---
title: rel=canonical nima va undan qachon foydalanish kerak
description: Canonical teg nima, u parametrlar, saralash va dublikatlar uchun qachon kerak hamda qaysi xatolar sahifalarni indeksdan chiqarib yuborishi haqida.
summary: rel=canonical — bir xil yoki deyarli bir xil sahifalar orasida qaysi URL asosiy ekanini qidiruv tizimiga bildiruvchi ishora. U signallarni bitta versiyada jamlaydi va dublikatlarni natijalardan olib tashlaydi, lekin xato sozlansa kerakli sahifalarni indeksdan chiqarib yuborishi mumkin.
---
## Qisqacha: canonical nima qiladi

**Kanonik URL** — sahifaning qidiruvda ko‘rinishini xohlaydigan asosiy versiyasi. Agar bir xil kontent bir nechta manzilda ochilsa, `rel="canonical"` tegi qidiruv tizimiga aytadi: «mana shu manzilni indekslab, reytingga qo‘y, qolganlari uning nusxalari».

Teg `<head>` ichiga qo‘yiladi:

```html
<link rel="canonical" href="https://example.com/catalog/shoes/" />
```

Muhim: canonical — **buyruq emas, ishora**. Google va Yandex uni boshqa signallar (redirektlar, ichki havolalar, sitemap) bilan birga hisobga oladi va signallar bir-biriga zid bo‘lsa, boshqa versiyani tanlashi mumkin.

## Dublikatlar qayerdan paydo bo‘ladi

Sayt ko‘pincha dublikatlarni o‘zi yaratadi:

- **URL parametrlari**: `?utm_source=...`, `?ref=...`, sessiya identifikatorlari;
- **saralash va ko‘rinish**: `?sort=price`, `?view=grid`;
- `www` bilan va `www` siz, `http` va `https`, oxirida slesh bilan va slesh siz;
- bitta mahsulot bir nechta kategoriyada: `/men/sneakers/model-x` va `/sale/model-x`;
- chop etish versiyalari, AMP sahifalar, boshqa saytlarda qayta e’lon qilingan kontent.

Canonical bo‘lmasa, qaysi versiya asosiy ekanini qidiruv tizimi o‘zi hal qiladi, havola vazni va xulq-atvor signallari esa nusxalar orasida taqsimlanib ketadi.

## Canonical qachon kerak

| Vaziyat | Nima qilish kerak |
|---|---|
| UTM-teglar va xizmat parametrlari | toza URL’ga canonical |
| Xuddi shu mahsulotlar ro‘yxatini saralash | saralanmagan sahifaga canonical |
| Mahsulot bir nechta kategoriyada | bitta asosiy manzilga canonical |
| Kontent boshqa saytda qayta e’lon qilingan | nusxadan originalga canonical (kross-domen) |
| Har qanday oddiy sahifa | o‘ziga ishora qiluvchi canonical |

**O‘ziga ishora qiluvchi canonical** sahifaning o‘zini ko‘rsatadi. Uni hamma joyga qo‘ying: u siz oldindan ko‘rmagan parametrli dublikatlardan himoya qiladi.

## Canonical qachon mos kelmaydi

- **Kontenti har xil sahifalar.** Agar «qizil krossovkalar» filtri alohida so‘rov uchun to‘laqonli sahifa bo‘lsa, uni umumiy katalog bilan birlashtirmang.
- **Paginatsiya.** Ikkinchi va keyingi sahifalardan birinchisiga canonical qo‘yish — ko‘p uchraydigan xato: uzoq sahifalardagi mahsulotlar indeksga yo‘lini yo‘qotadi. Odatda har bir paginatsiya sahifasiga o‘z canonical’i kerak.
- **Butunlay ko‘chish.** Eski manzil endi kerak bo‘lmasa, canonical emas, **301-redirekt** ishlating.
- **Sahifani indeksdan yopish.** Buning uchun `noindex` bor; canonical chiqarib tashlashni kafolatlamaydi.

## Sahifalarni indeksdan chiqaradigan xatolar

- **Barcha sahifalar bosh sahifaga ishora qiladi.** Ko‘pincha canonical statik yozilgan CMS shabloni sababli. Qidiruv tizimi butun saytni bosh sahifaning dublikati deb hisoblashi mumkin.
- **Redirekt, 404 yoki noindex sahifaga canonical.** Signallar bir-biriga zid, qidiruv tizimi ishorani e’tiborsiz qoldiradi yoki ikkala versiyani ham yo‘qotadi.
- **Nisbiy yoki noto‘g‘ri manzillar.** Protokol, domendagi xato yoki canonical’dagi ortiqcha parametr chalkashlik keltirib chiqaradi. Absolyut URL’lardan foydalaning.
- **Bitta sahifada bir nechta canonical.** Masalan, birini mavzu (theme), ikkinchisini SEO-plagin qo‘ygan. Bunday holatda qidiruv tizimlari ikkalasini ham e’tiborsiz qoldirishi mumkin.
- **JavaScript orqali qo‘shilgan va HTML’dan farq qiladigan canonical.** Uni dastlabki HTML kodda ko‘rsating.
- **Zanjirlar.** A sahifa B ga, B esa C ga ishora qiladi. To‘g‘ridan-to‘g‘ri yakuniy manzilni ko‘rsating.

## Qanday tekshirish mumkin

1. Sahifaning manba kodini oching va `rel="canonical"` ni toping — u bitta va absolyut URL bilan bo‘lishi kerak.
2. **Google Search Console**’da URL tekshiruvidan foydalaning: u siz ko‘rsatgan va Google tanlagan canonical’ni ko‘rsatadi.
3. **Yandex Vebmaster**’da qidiruvdagi sahifalar bo‘limini ko‘ring: chiqarib tashlangan nokanonik sahifalar alohida belgilanadi.
4. Saytni krauler bilan tekshirib, canonical’i redirekt, 404 yoki noto‘g‘ri shablonga olib boradigan sahifalarni toping.

## FAQ

### Saytda dublikatlar bo‘lmasa ham canonical kerakmi?

Ha, har bir indekslanadigan sahifaga o‘ziga ishora qiluvchi canonical qo‘ying. Parametrli dublikatlar siz ularni yaratmagan bo‘lsangiz ham reklama, ijtimoiy tarmoqlar va tashqi havolalardan paydo bo‘ladi.

### Canonical 301-redirektdan nimasi bilan farq qiladi?

Redirekt foydalanuvchi va robotni boshqa manzilga yo‘naltiradi, canonical esa ikkala sahifani ham ochiq qoldirib, qaysi birini ko‘rsatishni faqat ishora qiladi. Agar nusxa odamlarga kerak bo‘lmasa, redirektni tanlang.

### Nega Google mening emas, boshqa canonical’ni tanladi?

Ehtimol, boshqa signallar tegingizga zid: ichki havolalar boshqa versiyaga olib boradi, sitemap’da boshqa manzil ko‘rsatilgan yoki sahifalar mazmuni farq qiladi. Barcha signallarni bitta URL’ga moslashtiring.
