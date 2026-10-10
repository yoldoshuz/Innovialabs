---
title: Kengaytirilgan snippetlar: bu nima va ularni qanday olish mumkin
description: Kengaytirilgan snippet turlari (reyting, narx, non bo‘laklari, FAQ), ular ortidagi mikrorazmetka va to‘g‘ri razmetka nega ko‘rsatishni kafolatlamasligi.
summary: Kengaytirilgan snippet — reyting yulduzchalari, narx yoki non bo‘laklari kabi qo‘shimcha ma’lumotli qidiruv natijasi. Uni olish uchun to‘g‘ri Schema.org razmetkasi (yaxshisi JSON-LD) kerak, lekin ko‘rsatish haqida qarorni baribir qidiruv tizimi qabul qiladi.
---
## Kengaytirilgan snippet nima

**Snippet** — saytingizning qidiruvdagi bloki: sarlavha, manzil va tavsif. **Kengaytirilgan snippet** (rich snippet, rich result) ko‘proq ma’lumot beradi: reyting, narx, mavjudlik, sayt bo‘limlari bo‘yicha yo‘l, tadbir sanasi.

Bunday natija ko‘proq joy egallaydi va foydalanuvchi savolining bir qismiga darhol javob beradi. Uning o‘zi pozitsiyani ko‘tarmaydi, lekin qo‘shni natijalar orasida ajralib turishga yordam beradi.

Bu ma’lumotlarni qidiruv tizimi **strukturalangan ma’lumotlardan** oladi — sahifadagi Schema.org lug‘ati asosidagi maxsus razmetkadan.

## Asosiy turlar

| Tur | Qidiruvda nima ko‘rinadi | Schema.org turi |
|---|---|---|
| Reyting va sharhlar | Yulduzchalar va baholar soni | `Review`, `AggregateRating` |
| Mahsulot | Narx, mavjudlik, reyting | `Product`, `Offer` |
| Non bo‘laklari (breadcrumbs) | Uzun URL o‘rniga yo‘l | `BreadcrumbList` |
| FAQ | Snippet ostida savol-javoblar | `FAQPage` |
| Maqola | Sana, muallif, rasm | `Article` |
| Tashkilot | Logotip, kontaktlar | `Organization`, `LocalBusiness` |
| Tadbirlar | Sana va joy | `Event` |
| Retseptlar | Vaqt, kaloriya, rasm | `Recipe` |

Yodda tuting: Google ko‘rsatadigan turlar to‘plamini asta-sekin qisqartirmoqda. Masalan, FAQ snippetlari hozir faqat cheklangan doiradagi nufuzli saytlar uchun chiqariladi. Joriy qilishdan oldin amaldagi hujjatlarni tekshiring.

## Qaysi razmetkadan foydalanish kerak

Uchta format bor: **JSON-LD**, **Microdata** va **RDFa**. Google JSON-LD’ni tavsiya qiladi: u alohida blokda turadi va HTML bilan aralashmaydi. Yandex ham Schema.org’ni, jumladan JSON-LD’ni qo‘llab-quvvatlaydi.

Non bo‘laklari misoli:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Katalog", "item": "https://site.uz/catalog/" },
    { "@type": "ListItem", "position": 2, "name": "Noutbuklar", "item": "https://site.uz/catalog/laptops/" }
  ]
}
</script>
```

## Bosqichma-bosqich joriy qilish

1. **Sahifa mazmuniga mos turlarni tanlang:** mahsulot kartochkasi uchun `Product`, maqola uchun `Article`.
2. **Majburiy va tavsiya etilgan maydonlarni** qidiruv tizimi hujjatlari bo‘yicha to‘ldiring.
3. **Razmetkani sahifada ko‘rsatiladigan ma’lumotlardan** — CMS yoki bazadan avtomatik yarating, qo‘lda emas.
4. **Tekshiring:** Google’ning Rich Results Test va Yandex Vebmasterdagi mikrorazmetka validatori orqali.
5. **Search Console’dagi yaxshilanishlar hisobotlarini kuzating** — u yerda butun sayt bo‘yicha xato va ogohlantirishlar ko‘rinadi.

## Razmetka bor, snippet esa yo‘q — nega

To‘g‘ri razmetka sahifani faqat kengaytirilgan natija uchun **yaroqli** qiladi. Ko‘rsatish kafolatlanmaydi, chunki:

- qidiruv tizimi kengaytirilgan ko‘rinish aniq qidiruv natijasini yaxshilaydimi-yo‘qmi, o‘zi hal qiladi;
- ayrim turlar faqat ma’lum sayt turlari uchun ruxsat etilgan;
- razmetka sahifaning ko‘rinadigan mazmuniga mos kelmaydi;
- o‘zgarishlardan keyin sahifa hali qayta skanerlanmagan;
- saytda umumiy sifat muammolari yoki qoidabuzarliklar bor.

## Ko‘p uchraydigan xatolar

- **Sahifada yo‘q narsani razmetka qilish.** JSON-LD’dagi reyting yoki narx foydalanuvchiga ko‘rinishi shart.
- **O‘zi haqidagi sharhlar.** Google `Organization` va `LocalBusiness` turlarida kompaniyaning o‘zi haqidagi sharhlari uchun yulduzchalarni ko‘rsatmaydi.
- **Barcha sahifalarda bir xil razmetka**, masalan shablondan olingan FAQ.
- **Eskirgan ma’lumotlar:** sahifadagi narx o‘zgargan, razmetkada esa eskisi qolgan.

Razmetka bilan manipulyatsiya qo‘lda qo‘llanadigan choraga olib kelishi mumkin, shundan so‘ng sayt uchun kengaytirilgan natijalar ko‘rsatilmay qo‘yadi.

## FAQ

### Mikrorazmetka pozitsiyalarga ta’sir qiladimi?

To‘g‘ridan-to‘g‘ri — yo‘q. U qidiruv tizimiga mazmunni tushunishga yordam beradi va snippetni ko‘zga ko‘rinarli qilishi mumkin, bu esa bosish darajasiga ta’sir qiladi.

### Kengaytirilgan snippet qancha vaqtda paydo bo‘ladi?

Aniq muddat yo‘q. Avval sahifa qayta skanerlanishi kerak, so‘ng qidiruv tizimi kengaytirilgan ko‘rinishni chiqarish-chiqarmaslikni hal qiladi. Holatni Search Console hisobotlarida kuzating.

### Yandex uchun alohida razmetka kerakmi?

Odatda yo‘q: Yandex Schema.org’ni tushunadi. Sahifalarni uning validatorida tekshirib, xatolar yo‘qligiga ishonch hosil qilish kifoya.
