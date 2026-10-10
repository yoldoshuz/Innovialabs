---
title: Schema.org mikrorazmetkasi nima va u saytga nima uchun kerak
description: Strukturalangan ma’lumotlar va Schema.org nima, JSON-LD va Microdata farqi, mashhur razmetka turlari va qidiruv tizimlari u bilan nima qiladi.
summary: Mikrorazmetka — sahifa mazmunini Schema.org lug‘ati bo‘yicha mashina o‘qiy oladigan tavsifi: mahsulot, maqola, tashkilot, sharh. U qidiruv tizimlariga sahifani aniqroq tushunishga yordam beradi va kengaytirilgan snippet berishi mumkin, lekin buni kafolatlamaydi va o‘z-o‘zidan o‘rinlarni ko‘tarmaydi.
---
## Qisqa javob

**Strukturalangan ma’lumotlar** — sahifa mazmunining dasturlar oson o‘qiydigan formatdagi tavsifi. Inson sahifada «Noutbuk, 12 000 000 so‘m, mavjud» deb ko‘radi, qidiruv tizimi esa razmetka orqali xuddi shu ma’lumotlarni maydonlar sifatida oladi: turi — mahsulot, narx, valyuta, mavjudlik.

**Schema.org** — Google, Yandex, Bing va boshqa tizimlar qo‘llab-quvvatlaydigan bunday tavsiflarning umumiy lug‘ati. Unda turlar (`Product`, `Article`, `Organization`) va ularning xususiyatlari (`name`, `price`, `author`) belgilangan.

## Razmetka formatlari

| Format | Qanday ko‘rinadi | Qachon ishlatish |
|---|---|---|
| **JSON-LD** | Alohida `<script type="application/ld+json">` bloki | Asosiy tanlov: maketga aralashmaydi, qo‘llab-quvvatlash oson |
| **Microdata** | HTML ichida `itemscope`, `itemprop` atributlari | Shunday qilingan eski shablonlar va CMS’lar |
| **RDFa** | HTML’da `vocab`, `property` atributlari | Kamroq uchraydi, asosan maxsus tizimlarda |

Google JSON-LD’ni tavsiya qiladi, Yandex ham uni qo‘llab-quvvatlaydi. Noldan boshlasangiz, shuni tanlang.

Maqola razmetkasi misoli:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Schema.org mikrorazmetkasi nima",
  "author": { "@type": "Organization", "name": "Kompaniya nomi" },
  "datePublished": "2026-01-15",
  "image": "https://example.com/cover.jpg"
}
</script>
```

## Mashhur turlar

- **Organization / LocalBusiness** — nom, logotip, kontaktlar, manzil, ish vaqti.
- **Product + Offer** — mahsulot, narx, mavjudlik; ko‘pincha **AggregateRating** va **Review** bilan birga.
- **Article / BlogPosting** — sarlavha, muallif, sana, rasm.
- **BreadcrumbList** — snippetda URL o‘rniga ko‘rsatilishi mumkin bo‘lgan «non ushoqlari».
- **FAQPage** — sahifadagi savol va javoblar.
- **Event, Recipe, JobPosting, Course** — tegishli kontent uchun.
- **WebSite** — butun sayt tavsifi.

## Qidiruv tizimlari razmetka bilan nima qiladi

1. **Sahifani yaxshiroq tushunadi.** Qaysi obyekt tasvirlangan, muallif kim, kontent qaysi tashkilotga tegishli.
2. **Kengaytirilgan snippet (rich result) ko‘rsatishi mumkin:** reyting yulduzlari, narx, non ushoqlari, tadbir ma’lumotlari.
3. **Ma’lumotlardan boshqa servislarda foydalanadi:** tashkilot kartochkalari, mahsulot bloklari, bilim panellari.

Razmetka **nima qilmaydi**:

- U to‘g‘ridan-to‘g‘ri reyting omili emas va o‘z-o‘zidan o‘rinlarni ko‘tarmaydi.
- Kengaytirilgan snippetni kafolatlamaydi — qarorni qidiruv tizimi qabul qiladi, qo‘llab-quvvatlanadigan turlar to‘plami esa vaqt o‘tishi bilan o‘zgaradi.
- Zaif sahifani tuzatmaydi.

Bilvosita foyda real: ko‘zga tashlanadigan snippet ko‘proq bosishlar olishi mumkin.

## Xatosiz qanday joriy qilish

1. **Faqat sahifada ko‘rinadigan narsani razmetka qiling.** Razmetkadagi narx sahifadagi narx bilan mos bo‘lishi, sharhlar haqiqiy bo‘lishi kerak.
2. **Razmetkani kontent bilan bir xil ma’lumotlardan yarating** — har sahifada qo‘lda emas, CMS shabloni yoki komponentda.
3. **Kerakli tur uchun majburiy va tavsiya etilgan xususiyatlarni to‘ldiring.**
4. **Tekshiring:** Google’ning Rich Results Test, Schema.org validatori va Yandex Vebmasterdagi tekshirish vositasi.
5. **Nashrdan keyin hisobotlarni kuzating** — Search Console va Vebmasterda.

## Ko‘p uchraydigan xatolar

- Sahifada yo‘q ma’lumotlarni razmetka qilish — bu qidiruv tizimlari qoidalarini buzadi va qo‘lda jazo choralariga olib kelishi mumkin.
- Turli sahifalarda turli ma’lumotlar bilan bir xil `Organization`.
- Natijalarda yulduz olish uchun kompaniyaning o‘z saytida o‘zi haqidagi sharhlarni razmetka qilish — Google ular uchun yulduz ko‘rsatmaydi.
- Narx yoki mavjudlik o‘zgarganda yangilanmaydigan razmetka.

## FAQ

### Kichik saytga mikrorazmetka kerakmi?

Ha, hech bo‘lmaganda bazaviysi: `Organization` yoki `LocalBusiness`, `BreadcrumbList` va asosiy kontent turi razmetkasi. Bu ko‘p vaqt olmaydi, qidiruv tizimlariga esa saytni tushunish osonlashadi.

### Nimani tanlash kerak: JSON-LD yoki Microdata?

Alohida sabab bo‘lmasa, JSON-LD. U maketdan ajratilgan, uni yaratish va tekshirish osonroq. Microdata faqat ishlatilayotgan CMS’ga allaqachon o‘rnatilgan bo‘lsa ma’noga ega.

### Razmetka bor, lekin kengaytirilgan snippet yo‘q — nega?

Uni ko‘rsatish-ko‘rsatmaslikni qidiruv tizimi o‘zi hal qiladi. Razmetkani xatolar va kontentga mosligi bo‘yicha tekshiring; hammasi to‘g‘ri bo‘lsa, sahifa sifati ustida ishlashda davom eting va vaqt bering.
