---
title: Tilda’da saytni ishga tushirish chek-listi
description: Tilda saytini ishga tushirishdan oldin tekshiruv: domen va HTTPS, favicon va meta-teglar, formalar, analitika, mobil versiya, tezlik va 404 sahifa.
summary: Tilda’da saytni ishga tushirishdan oldin HTTPS bilan domenni ulang, har bir sahifa uchun favicon va meta-teglarni to‘ldiring, formalarni qabul qiluvchilarga bog‘lab test ariza yuboring, analitikani o‘rnating, mobil versiya va tezlikni tekshiring hamda 404 sahifani belgilang.
---
## Qisqa javob

Sayt ishga tushirishga tayyor, agar yettita band bajarilgan bo‘lsa:

1. O‘z domeningiz ulangan, HTTPS ishlaydi.
2. Favicon bor, har bir sahifada title, description va ijtimoiy tarmoqlar uchun rasm to‘ldirilgan.
3. Barcha formalar qabul qiluvchilarga bog‘langan, test arizalar yetib kelgan.
4. Analitika hisoblagichlari o‘rnatilgan, arizalar bo‘yicha maqsadlar ishlaydi.
5. Sayt telefonda tekshirilgan — Zero Block’da barcha breakpoint’larda.
6. Sahifalar tez yuklanadi, rasmlar optimallashtirilgan.
7. 404 sahifa belgilangan, barcha sahifalar e’lon qilingan.

Quyida har bir bandda nimani tekshirish kerakligi.

## Domen va HTTPS

- Sayt sozlamalarida domenni ko‘rsating, registratorda esa Tilda ko‘rsatgan DNS yozuvlarini qo‘shing: odatda asosiy domen uchun **A yozuv** va `www` uchun **CNAME**.
- Asosiy ko‘zguni tanlang: `www` bilan yoki usiz. Ikkinchi variant asosiysiga yo‘naltirishi kerak.
- SSL sertifikat chiqarilishini kuting va **HTTPS**’ga yo‘naltirishni yoqing.
- Sayt manzilning barcha variantlarida ochilishi va oxir-oqibat bittasiga tushishini tekshiring.

DNS yangilanishi bir necha soatgacha cho‘zilishi mumkin, shuning uchun domenni ishga tushirish kunida emas, oldindan ulang.

## Favicon, meta-teglar va ijtimoiy tarmoqlar uchun prevyu

- Sayt sozlamalarida **favicon** yuklang — usiz brauzer vkladkasi tugallanmagandek ko‘rinadi.
- Har bir sahifa sozlamalarida **title** va **description**’ni to‘ldiring: noyob va sahifani aniq tasvirlaydigan.
- **Sahifa manzilini** lotincha va qisqa bering: `/page12345.html` emas, `/services`.
- Ijtimoiy tarmoqlar va messenjerlar uchun prevyu rasmini yuklang va havola Telegram’da qanday ko‘rinishini tekshiring.

## Formalar va ariza qabul qiluvchilari

Ishga tushirishdan keyingi eng ko‘p uchraydigan muammo — hech qayerga yetib bormaydigan arizalar.

- Sayt sozlamalarida **ma’lumot qabul qiluvchilarni** ulang: pochta, Telegram, Google Sheets, CRM.
- **Formali har bir blokni** oching va unda kerakli qabul qiluvchilarni belgilang. Servisni sozlamalarda ulash yetarli emas — qabul qiluvchi belgilanmagan forma ma’lumot yubormaydi.
- Shaxsiy ma’lumotlarni qayta ishlashga rozilik va maxfiylik siyosatiga havola qo‘shing.
- Muvaffaqiyatli yuborilganlik haqida xabar yoki «Rahmat» sahifasini sozlang.
- **Har bir formadan test ariza yuboring** va u barcha qabul qiluvchilarga yetib kelganiga ishonch hosil qiling.

## Analitika

- Sayt sozlamalarida Google Analytics, Yandex Metrika va Google Tag Manager identifikatorlari uchun maydonlar bor. Boshqa hisoblagichlar uchun `head`’ga kod qo‘shishdan foydalaning.
- Google Search Console va Yandex Vebmaster’da saytga huquqingizni meta-teg yoki DNS yozuv orqali tasdiqlang.
- Forma yuborish hodisalari analitikada ko‘rinishini tekshiring va ularga **maqsadlar** sozlang.

`head` kodiga qo‘shiladigan tasdiqlash meta-tegiga misol:

```html
<meta name="google-site-verification" content="tasdiqlash-kodingiz" />
```

## Mobil versiya

- Saytni faqat prevyu rejimida emas, haqiqiy telefonda oching.
- Zero Block’da barcha breakpoint’larni tekshiring: 1200, 960, 640, 480 va 320 piksel. Hech narsa ustma-ust tushmasligi va kesilmasligi kerak.
- Menyu, tugmalar, forma maydonlari va matn o‘lchamini tekshiring — ularni barmoq bilan bosish qulay bo‘lishi kerak.
- Og‘ir animatsiyalar skrollga xalal bermasligiga ishonch hosil qiling.

## Yuklanish tezligi

- Rasmlarni yuklashdan oldin siqing, kichik bloklar uchun bir necha megabaytli fotolardan foydalanmang.
- Agar o‘chirilgan bo‘lsa, sozlamalarda rasmlarni kechiktirib yuklashni yoqing.
- Shriftlar va ularning qalinlik variantlari sonini cheklang.
- Birinchi ekranni video va animatsiyalar bilan ortiqcha yuklamang.
- Asosiy sahifalarni PageSpeed Insights’da tekshiring va eng ko‘p sekinlashtirayotgan narsani tuzating.

## 404 sahifa va yakuniy tekshiruvlar

- Tushunarli matn va bosh sahifaga havolali 404 sahifa yarating va uni sayt sozlamalarida belgilang.
- Sozlamalarda indekslash **taqiqlanmaganiga** ishonch hosil qiling.
- Agar eski saytni almashtirayotgan bo‘lsangiz, qidiruvdan keladigan trafikni yo‘qotmaslik uchun eski manzillarni yangilariga moslang.
- Oxirgi tahrirlardan keyin **barcha sahifalarni e’lon qiling**: e’lon qilinmagan o‘zgarishlar saytga tushmaydi.
- Menyu va futerdagi barcha havolalarni bosib chiqing.

## FAQ

### Tilda’ga domen ulash qancha vaqt oladi?

Sozlashning o‘zi bir necha daqiqa oladi, lekin DNS yozuvlari bir necha daqiqadan bir necha soatgacha yangilanadi, SSL sertifikat esa shundan keyin chiqariladi. Shuning uchun domenni ishga tushirishdan bir-ikki kun oldin ulang.

### Nima uchun formadagi arizalar pochtaga kelmayapti?

Ko‘pincha forma blokida qabul qiluvchi belgilanmagan yoki xatlar spamga tushadi. Blok sozlamalarini va «Spam» papkasini tekshiring hamda Telegram yoki Google Sheets kabi ikkinchi kanalni ulang.

### Sitemap va robots.txt’ni qo‘lda qilish kerakmi?

Yo‘q, Tilda ularni avtomatik yaratadi. Indekslashni taqiqlamaslik va sayt xaritasini vebmaster panellariga yuborish yetarli.
