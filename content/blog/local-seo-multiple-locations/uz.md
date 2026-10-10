---
title: Bir nechta filialli kompaniyalar uchun lokal SEO
description: Filiallar tarmog‘ini qanday targ‘ib qilish: lokatsiya sahifalari tuzilmasi, xarita kartochkalari, har bir nuqta uchun LocalBusiness, sharhlar va dublikatlar.
summary: Har bir filialga saytda o‘z noyob sahifasi, Google va Yandex xaritalarida bir xil ma’lumotli o‘z kartochkasi, alohida LocalBusiness belgilashi va sharhlar bilan tizimli ish kerak — shablon dublikatlarsiz.
---

## Asosiy tamoyil

Qidiruv tizimi uchun har bir filial — **alohida joydagi alohida biznes**. Shuning uchun har bir nuqtada quyidagilar bo‘lishi kerak:

- saytda noyob mazmunli o‘z sahifasi;
- Google Business Profile va Yandex Biznes’da (Yandex Xaritalar) o‘z kartochkasi;
- hamma joyda bir xil ma’lumotlar: nom, manzil, telefon, ish vaqti (bu **NAP** deb ataladi).

Agar ma’lumotlar sayt, xaritalar va kataloglar orasida farq qilsa, qidiruv tizimi har bir nuqtaga kamroq ishonadi.

## Lokatsiya sahifalari arxitekturasi

Tarmoq uchun ishlaydigan sxema:

```text
/locations/                    — xaritali barcha filiallar ro‘yxati
/locations/tashkent/           — shahar sahifasi (agar shaharlar bir nechta bo‘lsa)
/locations/tashkent/chilanzar/ — aniq filial sahifasi
```

Filial sahifasida nima bo‘lishi kerak:

- aniq manzil, mo‘ljallar, xarita, qanday yetib borish;
- aynan shu nuqtaning telefoni va ish vaqti;
- shu yerda mavjud xizmatlar va assortiment (agar farq qilsa);
- filial va jamoaning suratlari;
- shu nuqta mijozlarining sharhlari;
- tuman yoki shahar nomi bilan noyob title va description.

Filial sahifalariga menyu yoki futerdan va ro‘yxat sahifasidan havola qo‘ying, toki ular ichki havolasiz «yetim» bo‘lib qolmasin.

## Dublikatlardan qanday qochish kerak

Tarmoqning asosiy xavfi — faqat manzil o‘zgaradigan **o‘nlab bir xil sahifalar**. Qidiruv tizimlari bunday sahifalarni kam foydali deb hisoblaydi.

- Har bir nuqta uchun o‘z matningizni yozing: tuman xususiyatlari, avtoturargoh, metroga yaqinlik, filial ixtisosligi.
- Jismoniy nuqtangiz bo‘lmagan shaharlar uchun sahifa yaratmang — bu dorveylarga o‘xshaydi.
- Bir xil sharhlar blokini barcha sahifalarda takrorlamang.
- Agar ikki nuqta yonma-yon bo‘lsa va hech narsa bilan farq qilmasa, deyarli bo‘sh sahifalar ko‘paytirgandan ko‘ra ma’lumotni birlashtirgan ma’qul.

## Xaritalardagi kartochkalar

Har bir filial uchun:

1. Alohida kartochka yarating va uni **tasdiqlang**.
2. Aniq kategoriya va ish vaqtini, jumladan bayram kunlarini ko‘rsating.
3. Sayt maydoniga bosh sahifaga emas, **shu filial sahifasiga** havola qo‘ying.
4. Haqiqiy suratlarni yuklang va yangilab turing.
5. Barcha kartochkalarni markazlashgan holda boshqaring: Google ham, Yandex ham nuqtalar tarmog‘i bilan bitta tashkilot akkauntidan ishlash imkonini beradi.

## Har bir nuqta uchun LocalBusiness belgilashi

Har bir filial sahifasida aynan shu nuqta ma’lumotlari bilan Schema.org belgilashini joylashtiring. Eng aniq kichik turdan foydalaning (masalan, `Restaurant`, `Dentist`, `Store`).

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Brand — Chilonzor",
  "url": "https://example.uz/locations/tashkent/chilanzar/",
  "telephone": "+998-00-000-00-00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Namuna ko‘chasi, 1",
    "addressLocality": "Toshkent",
    "addressCountry": "UZ"
  },
  "openingHours": "Mo-Sa 09:00-20:00",
  "parentOrganization": { "@type": "Organization", "name": "Brand" }
}
```

Belgilashdagi ma’lumotlar sahifadagi ko‘rinadigan matn va xaritadagi kartochka bilan mos kelishi kerak. Natijani Rich Results Test’da tekshiring.

## Tarmoq miqyosida sharhlar

- **Sharhlarni nuqtalar bo‘yicha yig‘ing**: chekdagi havola yoki QR-kod aniq filial kartochkasiga olib borishi kerak.
- **Barcha sharhlarga javob bering**, ayniqsa salbiylariga — har bir nuqta uchun mas’ul tayinlang yoki yagona javob standartini belgilang.
- **Reytingni filiallar bo‘yicha kuzating**: reytingi tushgan nuqta ko‘pincha SEO emas, operatsion muammoni ko‘rsatadi.
- Sharhlarni sotib olmang va chegirma evaziga so‘ramang — bu platforma qoidalarini buzadi.

## Keng tarqalgan xatolar

- Har bir nuqta uchun alohida emas, butun tarmoq uchun bitta kartochka.
- Barcha kartochkalardan bosh sahifaga havola.
- Sayt va xaritalarda manzil va telefonning turli formati.
- Yopilgan filiallar xaritalarda va saytda qolib ketadi — ularni yopilgan deb belgilash va sahifalarini olib tashlash yoki yo‘naltirish kerak.

## FAQ

### Filial kichik bo‘lsa, alohida sahifa kerakmi?

Ha, agar bu mijozlar keladigan jismoniy nuqta bo‘lsa. Noyob ma’lumotlar, suratlar va sharhlarga ega qisqa sahifa ham sahifa yo‘qligidan foydaliroq.

### Barcha filiallar uchun bitta telefon ishlatsa bo‘ladimi?

Bo‘ladi, lekin har bir nuqtaning lokal raqami joylashuv haqida aniqroq signal beradi va mijozlarga qulayroq. Asosiysi — raqam saytda va kartochkada bir xil bo‘lsin.

### Filial ko‘chib o‘tsa nima qilish kerak?

Manzilni kartochkada, filial sahifasida va belgilashda bir vaqtda yangilang. Sahifa URL’ini saqlab qolgan ma’qul, agar o‘zgarsa — 301-redirekt qo‘ying.
