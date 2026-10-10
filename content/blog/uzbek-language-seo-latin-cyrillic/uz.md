---
title: O‘zbek tilida SEO: lotin yoki kirill yozuvi
description: Odamlar o‘zbek tilida ikki alifboda qanday qidiradi, qidiruv tizimlari lotin va kirill bilan qanday ishlaydi va uz-kontentni qanday tuzish va belgilash kerak.
summary: Asosiy versiyani lotin yozuvidagi o‘zbek tilida qiling — bu rasmiy alifbo. Kirill versiyasini auditoriyangiz haqiqatan kirillda qidirsa qo‘shing va uni uz-Cyrl hreflang bilan alohida sahifa sifatida rasmiylashtiring.
---
## Qisqa javob

O‘zbek tili ikki alifboda yashaydi. **Lotin yozuvi** — rasmiy yozuv hamda yosh auditoriya, davlat xizmatlari va ko‘pchilik yangi saytlar uchun standart. **Kirill yozuvi** hali ham katta yoshdagi odamlarning so‘rovlarida, ayrim OAVda va odatiy so‘zlarda uchraydi.

Ko‘pchilik loyihalar uchun strategiya shunday: **asosiy versiya lotinda**, kirill versiyasi esa faqat ma’lumotlarda unga talab ko‘rinsa. Qidiruv tizimi uchun `o‘zbek` va `ўзбек` — turli satrlar, shuning uchun bitta versiya boshqa alifbodagi so‘rovlar bo‘yicha avtomatik ravishda reytingga chiqmaydi.

## Odamlar aslida qanday qidiradi

O‘zbek tilidagi so‘rovlar juda xilma-xil:

- **Ikki alifbo:** «telefon ta’mirlash» va «телефон таъмирлаш».
- **Turli apostroflar:** `o‘` bilan bir qatorda oddiy apostrof, teskari tirnoq yoki umuman belgisiz — `ozbek`, `togri`.
- **Rus tili bilan aralash:** bitta nishada «ремонт телефона Ташкент» va «telefon remont toshkent».
- **Transliteratsiya:** kirill harflari o‘rniga `sh`, `ch`, `ng`, ba’zan esa aksincha.

Shuning uchun boshlashdan oldin haqiqiy so‘rovlarni tekshiring: qidiruvdagi takliflar, kalit so‘zlarni tanlash vositalari, vebmaster panellari ma’lumotlari va sayt ichidagi qidiruv.

## Qidiruv tizimlari bu bilan qanday ishlaydi

- Qidiruv tizimlari yozilish variantlarini qisman moslashtira oladi, lekin **bunga tayanib bo‘lmaydi**: xatti-harakat tizimlar orasida farq qiladi va vaqt o‘tishi bilan o‘zgaradi.
- Sahifa avvalo unda mavjud bo‘lgan matn bo‘yicha reytingga chiqadi. Sahifada kirill bo‘lmasa, kirill so‘rovlarida u sust ko‘rinadi.
- `lang` atributi va hreflang qidiruv tizimiga sahifaning tili va yozuvini tushunishga yordam beradi.

## uz-kontentni qanday tuzish kerak

| Vaziyat | Nima qilish kerak |
|---|---|
| Auditoriya asosan yosh yoki B2B | Faqat lotin, `/uz/` |
| Kirill so‘rovlari sezilarli ulushda | Ikki versiya: `/uz/` va `/uz-cyrl/` |
| Rusiyzabonlarni qamrab olish kerak | Alohida `/ru/` versiyasi |

Ikkita o‘zbekcha versiya qilsangiz, ular bitta URL’da skript orqali alifboni almashtirish emas, **to‘laqonli alohida sahifalar** bo‘lishi kerak.

## Belgilash

```html
<!-- lotin versiyasida -->
<html lang="uz-Latn">
<link rel="alternate" hreflang="uz-Latn" href="https://site.com/uz/" />
<link rel="alternate" hreflang="uz-Cyrl" href="https://site.com/uz-cyrl/" />
<link rel="alternate" hreflang="ru" href="https://site.com/ru/" />
```

Kirill versiyasi bo‘lmasa, `lang="uz"` va `hreflang="uz"` yetarli.

## Amaliy qoidalar

- **Apostrof uchun bitta belgi.** `o‘` va `g‘` uchun bitta belgini tanlang (masalan, `‘`) va butun saytda shuni ishlating. Turli belgilar aralashmasi ichki qidiruvni buzadi va beparvo ko‘rinadi.
- **Yozilish variantlari — tabiiy tarzda.** Odamlar ham «ta’mirlash», ham «tamirlash» deb qidirsa, ikkinchi variantni matnda yoki FAQ’da eslatish mumkin, lekin kalit so‘zlar bilan to‘ldirmasdan.
- **URL — apostrofsiz lotinda:** `/uz/telefon-tamirlash/`. Manzillardagi maxsus belgilar kodlanadi va o‘qib bo‘lmaydigan ko‘rinishga keladi.
- **Tekshiruvsiz avtotransliteratsiyadan foydalanmang.** Lotinni kirillga mexanik o‘girish apostrofli so‘zlarda va o‘zlashma so‘zlarda xatolar beradi.
- **Hammasini tarjima qiling:** title, description, alt, menyu, tuzilgan ma’lumotlar.

## Ko‘p uchraydigan xatolar

- O‘zbekcha versiya — rus tilidan tahrirsiz mashina tarjimasi.
- Bitta sahifada lotin va kirill aralash.
- Alifbo tugma bilan almashadigan bitta URL — qidiruv tizimi faqat bitta variantni ko‘radi.
- Shablon tufayli o‘zbekcha sahifa `lang="ru"` deb belgilangan.

## FAQ

### Kirill versiyasini boshidanoq qilish kerakmi?

Ko‘pincha yo‘q. Lotin versiyasini ishga tushiring, so‘rovlar haqida ma’lumot to‘plang va kirillga sezilarli talab ko‘rsangiz, uni qo‘shing.

### o‘ va g‘ uchun qaysi apostrof to‘g‘ri?

Rasmiy imloda maxsus belgi nazarda tutilgan, lekin amalda turli belgilar ishlatiladi. SEO uchun izchillik muhimroq: bittasini tanlang va hamma joyda shuni ishlating.

### Rus va o‘zbek tilini bitta sahifada birlashtirsa bo‘ladimi?

Arzimaydi. Qidiruv tizimi bunday sahifaning tilini aniqlashda qiynaladi, foydalanuvchiga esa o‘qish noqulay. hreflang bilan bog‘langan alohida versiyalar yaxshiroq.
