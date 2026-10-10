---
title: Google sanksiyalari va Yandex filtrlari: sayt nega pozitsiya yo‘qotadi
description: Qo‘lda choralar va algoritmik pasaytirish farqi, Minusinsk, AGS va Baden-Baden filtrlari hamda saytga aynan nima ta’sir qilganini aniqlash usullari.
summary: Sayt pozitsiyani yo‘qotishining ikki sababi bor: qo‘lda qo‘llangan chora (qidiruv tizimi bu haqda vebmaster panelida xabar beradi) yoki spam, sotib olingan havolalar va haddan tashqari optimallashtirilgan matnlarni jimgina pasaytiradigan algoritm. Avval Search Console va Yandex Vebmasterni tekshiring, so‘ng pasayish sanasini o‘zgarishlaringiz bilan solishtiring.
---
## Qisqacha: sanksiyalarning ikki turi

Qidiruv tizimlari saytlarni ikki usulda jazolaydi:

- **Qo‘lda qo‘llanadigan choralar (manual actions)** — qidiruv tizimi xodimi saytni tekshirib, uni qo‘lda pasaytirgan yoki sahifalarni indeksdan chiqargan. Bu haqda vebmaster panelidagi xabardan bilib olasiz.
- **Algoritmik pasaytirish** — avtomatik tizim sayt qoidalarni buzadi yoki raqobatchilardan kamroq foydali deb hisoblagan. Odatda xabar bo‘lmaydi, faqat trafik tushadi.

Farq muhim: qo‘lda qo‘llangan chora qayta tekshiruv so‘rovi orqali olib tashlanadi, algoritmik pasaytirish esa algoritm tuzatilgan saytni qaytadan baholagandan keyingina yo‘qoladi.

## Google: qo‘lda choralar va algoritmlar

**Qo‘lda choralar** Google Search Console’dagi «Security & Manual Actions» bo‘limida ko‘rinadi. Odatiy sabablar:

- g‘ayritabiiy kiruvchi yoki chiquvchi havolalar (sotib olingan, almashilgan);
- yashirin matn va kalit so‘zlar bilan to‘ldirish;
- klouking — robot va foydalanuvchiga turli kontent ko‘rsatish;
- avtomatik yaratilgan yoki ko‘chirilgan, qiymatsiz kontent;
- buzilgan sayt yoki foydalanuvchilar qoldirgan spam.

**Algoritmik pasaytirishlar** reyting yangilanishlari bilan bog‘liq: asosiy (core updates) va spamga qarshi yangilanishlar. Ular aniq qoidabuzarlik uchun «jazolamaydi» — qaysi sahifalar foydaliroq ekanini qayta hisoblaydi. Shuning uchun sayt hech narsani buzmasdan ham pasayishi mumkin.

## Yandexning asosiy filtrlari

| Filtr | Nima uchun | Nima bo‘ladi |
|---|---|---|
| **Minusinsk** | Reytingni manipulyatsiya qilish uchun SEO havolalar sotib olish | Sayt qidiruvda pasayadi |
| **AGS** | Sifatsiz kontent, havola sotish uchun yaratilgan sayt | Sahifalar indeksdan chiqadi, saytdan chiquvchi havolalar hisobga olinmaydi |
| **Baden-Baden** | Kalit so‘zlar bilan to‘ldirilgan, haddan tashqari optimallashtirilgan matnlar | Alohida sahifalar yoki butun xost pasayadi |

Bundan tashqari, Yandex **xulq-atvor omillarini sun’iy oshirish**, foydalanuvchilarni aldash (klikander, zararli kod) va ortiqcha reklama uchun ham pasaytiradi. Qoidabuzarliklar haqida Yandex Vebmasterda «Diagnostika» → «Xavfsizlik va qoidabuzarliklar» bo‘limida ma’lumot beriladi.

## Aynan nima bo‘lganini qanday aniqlash mumkin

1. **Xabarlarni tekshiring.** Search Console (qo‘lda choralar, xavfsizlik muammolari) va Yandex Vebmaster (xavfsizlik va qoidabuzarliklar). Agar ikkalasi ham bo‘sh bo‘lsa, ehtimol bu algoritm yoki texnik muammo.
2. **Texnik sabablarni istisno qiling.** Tasodifiy `noindex`, robots.txt’da yopish, redirektsiz URL o‘zgarishi yoki server ishlamay qolishi ko‘pincha «filtr»ga o‘xshaydi, lekin u emas.
3. **Pasayish sanasini toping.** Uni saytdagi o‘zgarishlar, havola xaridi va qidiruv tizimlarining yangilanishlar haqidagi ochiq e’lonlari bilan solishtiring.
4. **Ko‘lamini aniqlang.** Butun sayt pasaydimi yoki alohida sahifalarmi? Masalan, Baden-Baden faqat haddan tashqari optimallashtirilgan sahifalarga ta’sir qilishi mumkin.
5. **Qidiruv tizimlarini solishtiring.** Faqat Yandexda pasayish uning filtrlariga, faqat Google’da esa uning algoritmlari yoki qo‘lda choralariga ishora qiladi.

## Sanksiyadan qanday chiqish mumkin

- **Havolalar:** imkon qadar sotib olingan havolalarni olib tashlang. Google uchun qolgan spam havolalarni Disavow tool orqali rad etish mumkin.
- **Matnlar:** sahifalarni odamlar uchun qayta yozing — kalit so‘z takrorlari, yashirin bloklar va sahifa oxiridagi uzun «SEO matnlar»ni olib tashlang.
- **Kontent:** bo‘sh va ko‘chirilgan sahifalarni o‘chiring yoki birlashtiring.
- **Xavfsizlik:** buzilish va zararli kodni tozalang, CMS va parollarni yangilang.
- **Qayta tekshiruv:** tuzatishdan so‘ng Search Console’da so‘rov yuboring yoki Vebmasterda tuzatilganini bildiring.

## Ko‘p uchraydigan xatolar

- Har qanday trafik pasayishini filtr deb hisoblab, texnik tomonni tekshirmaslik.
- Barcha kiruvchi havolalarni, shu jumladan tabiiylarini ham olib tashlash.
- Muammoni qisman tuzatib, qayta tekshiruv so‘rash.
- Xuddi shu amaliyotni yangi domenda davom ettirish — tarix takrorlanadi.

## FAQ

### Filtrdan chiqish uchun qancha vaqt kerak?

Qo‘lda qo‘llangan chora muvaffaqiyatli qayta tekshiruvdan keyin olib tashlanadi, muddat qidiruv tizimining navbatiga bog‘liq. Algoritmik pasaytirish algoritm saytni qayta baholaganda yo‘qoladi, shuning uchun aniq muddat yo‘q — asosiysi sababni to‘liq tuzatish.

### Raqobatchi sotib olgan havolalar sababli filtrga tushish mumkinmi?

Qidiruv tizimlari spam havolalarning katta qismini e’tiborsiz qoldira olishini aytadi. Agar ko‘plab shubhali havolalarni ko‘rsangiz, xabarlarni kuzatib boring va kerak bo‘lsa Google’da Disavow’dan foydalaning.

### Yangi domenga ko‘chish yordam beradimi?

Odatda yo‘q. Xuddi shu kontent va amaliyotni ko‘chirsangiz, muammo qaytadi, siz esa domenning to‘plangan tarixini yo‘qotasiz.
