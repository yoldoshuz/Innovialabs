---
title: Noindex yoki robots.txt dagi Disallow: qaysi birini tanlash kerak
description: Disallow skanerlashni, noindex esa indeksatsiyani taqiqlaydi. Farqni, ularni birga ishlatish nega xato ekanini va sahifa turlari uchun tanlovni ko‘ramiz.
summary: Robots.txt dagi Disallow robotga sahifaga kirishni, noindex esa uni qidiruvda ko‘rsatishni taqiqlaydi; sahifani natijalardan olib tashlash uchun noindex va skanerlash uchun ochiq URL kerak.
---
## Qisqa javob

- Robots.txt dagi **Disallow** **skanerlashni** taqiqlaydi: robot sahifani yuklamaydi.
- **noindex** (meta teg yoki HTTP sarlavha) **indeksatsiyani** taqiqlaydi: robot sahifani yuklaydi, lekin uni qidiruvda ko‘rsatmaydi.

Maqsad — sahifa qidiruv natijalarida bo‘lmasligi bo‘lsa, **noindex** dan foydalaning. Maqsad — robot resurslarini foydasiz URL larga sarflamaslik bo‘lsa, **Disallow** dan foydalaning.

## Nega Disallow sahifani qidiruvdan olib tashlamaydi

Disallow faqat «kirma» deydi. Lekin yopilgan sahifaga sizning yoki boshqa saytlardan havolalar bo‘lsa, Google uning URL manzilini mazmunini bilmagan holda indeksga qo‘shishi mumkin. Natijalarda normal tavsifsiz oddiy manzil paydo bo‘ladi.

Shuning uchun robots.txt — sahifani yashirish usuli emas, balki skanerlashni boshqarish vositasi.

## Noindex qanday ishlaydi

Noindex HTML da beriladi:

```html
<meta name="robots" content="noindex">
```

Yoki HTTP sarlavha orqali — shu yo‘l bilan PDF, rasmlar va HTML siz boshqa fayllarni yopish mumkin:

```text
X-Robots-Tag: noindex
```

Direktiva ishlashi uchun robot **sahifani yuklashi** va uni ko‘rishi kerak. Google ham, Yandex ham meta tegdagi noindex ni hisobga oladi. Robots.txt ichidagi `noindex` direktivasini Google qo‘llab-quvvatlamaydi.

## Nega Disallow + noindex birga ishlamaydi

Bu eng keng tarqalgan xato: sahifa robots.txt da yopiladi va «ishonchlilik uchun» noindex qo‘shiladi. Natijada:

1. Robots.txt sahifani yuklashni taqiqlaydi.
2. Robot uni yuklamaydi va noindex ni ko‘rmaydi.
3. URL ga havolalar bo‘lsa, u indeksda qolishi mumkin.

Allaqachon indekslangan sahifani olib tashlashning to‘g‘ri tartibi:

1. Noindex qo‘shing va URL ni robots.txt da **yopmang**.
2. Sahifa indeksdan chiqib ketishini kuting (Search Console yoki Yandex Vebmaster da tekshiring).
3. Shundan keyingina, kerak bo‘lsa, skanerlash resurslarini tejash uchun uni Disallow orqali yoping.

## Tipik sahifalar uchun nimani tanlash kerak

| Sahifa turi | Nimadan foydalanish |
|---|---|
| Savat, buyurtma rasmiylashtirish, shaxsiy kabinet | noindex yoki Disallow; ular odatda o‘zi indeksga tushmaydi |
| Sayt ichidagi qidiruv | noindex; bunday URL lar juda ko‘p bo‘lsa, Disallow |
| Parametrli filtrlar va saralashlar | asosiy sahifaga canonical, cheksiz kombinatsiyalar uchun Disallow |
| «Arizangiz uchun rahmat» sahifasi | noindex |
| Qidiruvda kerak bo‘lmagan PDF va fayllar | X-Robots-Tag: noindex |
| Sahifa dublikatlari | Disallow emas, canonical |
| Test (staging) sayt | parol bilan yopish; robots.txt va noindex kirishdan himoya qilmaydi |
| Texnik URL lar, xizmat skriptlari | Disallow |

## Keng tarqalgan xatolar

- **CSS va JS ni robots.txt da yopish.** Robot sahifani chiza olmaydi va uni noto‘g‘ri baholashi mumkin.
- **Staging dagi `Disallow: /` ni prod ga ko‘chirish.** Butun sayt skanerlanmay qoladi. Har bir relizdan keyin robots.txt ni tekshiring.
- **Ishlab chiqishdan keyin shablonda noindex qoldirish.** Sahifalar jimgina qidiruvdan yo‘qoladi.
- **Maxfiy bo‘limlar uchun robots.txt dan foydalanish.** Fayl ochiq, istalgan odam qaysi yo‘llarni yashirayotganingizni o‘qiy oladi.

## FAQ

### Sahifani qidiruvdan qaysi biri tezroq olib tashlaydi: noindex yoki Disallow?

Noindex: navbatdagi skanerlashdan keyin sahifa indeksdan o‘chiriladi. Disallow o‘chirishni kafolatlamaydi. Shoshilinch holatlar uchun Search Console da URL ni vaqtincha o‘chirish vositasi bor.

### Noindex va canonical ni bir vaqtda ishlatish mumkinmi?

Tavsiya etilmaydi. Canonical «buning o‘rniga boshqa sahifani indeksla» deydi, noindex esa «buni indekslama». Aralash signallar oldindan aytib bo‘lmaydigan natijaga olib kelishi mumkin. Bitta yondashuvni tanlang.

### Yandex bu qoidalarni Google kabi hisobga oladimi?

Umuman olganda, ha: Yandex Disallow va noindex meta tegini qo‘llab-quvvatlaydi. Qo‘shimcha ravishda, Yandex uchun robots.txt da ahamiyatsiz GET parametrli sahifalar uchun Clean-param direktivasi mavjud.
