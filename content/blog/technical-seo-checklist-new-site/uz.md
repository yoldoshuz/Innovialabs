---
title: Yangi saytni ishga tushirishdan oldingi SEO chek-list
description: Sayt ishga tushishidan oldin nimani tekshirish kerak: stenddagi noindex, sitemap va robots, eski URL’lardan redirectlar, analitika, tezlik va mobil versiya.
summary: Ishga tushirishdan oldin sayt indeksatsiya uchun ochiq, eski URL’larda 301-redirectlar bor, sitemap va robots to‘g‘ri, analitika ma’lumot yig‘ayotgani va sahifalar telefonda tez hamda qulay ekaniga ishonch hosil qiling.
---

## Qisqa javob

Ishga tushirishdagi SEO muvaffaqiyatsizliklarining aksariyati strategiya emas, unutilgan mayda narsalar: **stenddan qolgan noindex**, eski manzillardan **redirectlar** yo‘qligi, yopiq `robots.txt`. Quyidagi chek-listni DNS almashtirishdan oldin va darhol keyin yana bir bor o‘ting.

## Indeksatsiya

- Qidiruvda bo‘lishi kerak bo‘lgan barcha sahifalardan `noindex`ni olib tashlang. Meta-tegni ham, `X-Robots-Tag` HTTP sarlavhasini ham tekshiring.
- Stendda bo‘lgan bo‘lsa, oddiy HTTP-avtorizatsiyani olib tashlang.
- `robots.txt`ni qayta yozing: stendda ko‘pincha butun sayt uchun `Disallow: /` turadi.
- **Stendning o‘zi** indeksatsiyadan yopiq ekani va asosiy sayt bilan raqobatlashmasligiga ishonch hosil qiling.

Minimal ishlaydigan `robots.txt`:

```txt
User-agent: *
Disallow: /admin/
Disallow: /cart/

Sitemap: https://example.com/sitemap.xml
```

## Sitemap

- `sitemap.xml` avtomatik generatsiya qilinadi va nashr qilinganda yangilanadi.
- Unda faqat 200 kodli kanonik URL’lar — redirectlar, 404 va yopiq sahifalarsiz.
- Manzillar stend emas, asosiy saytning to‘g‘ri protokoli va domeni bilan ko‘rsatilgan.
- Sitemap Google Search Console va Yandex Webmaster’ga qo‘shilgan.

## Ko‘chishdagi redirectlar

Agar yangi sayt eskisining o‘rnini egallasa, bu eng xavfli band.

1. Eski saytning barcha URL’larini yuklab oling: kraulerdan, sitemap’dan, Search Console va analitikadan.
2. Har bir eski manzilni ma’nosi bo‘yicha eng yaqin yangi manzilga moslang.
3. Zanjirlarsiz, to‘g‘ridan-to‘g‘ri **301-redirectlar** sozlang.
4. Hammasini bosh sahifaga yubormang: qidiruv tizimlari bunday redirectlarni "yumshoq 404" deb hisoblashi mumkin.
5. Ishga tushgandan keyin eski URL’lar ro‘yxatini krauler orqali o‘tkazing va javob kodlarini tekshiring.

## Domen va dublikatlar

- Bitta asosiy versiya: `www` bilan yoki siz, faqat `https`.
- Qolgan variantlar unga 301-redirect qiladi.
- URL oxiridagi slesh uchun yagona format.
- Har bir sahifada to‘g‘ri `rel="canonical"`.
- Ko‘p tilli sayt uchun — `hreflang` teglari va har bir til uchun alohida URL’lar.

## On-page va razmetka

- Barcha shablonlarda noyob `title` va `description`, "Yangi sahifa" kabi zaglushkalarsiz.
- Har bir sahifada bitta `H1`.
- Mazmunli rasmlarda `alt`.
- Schema.org mikrorazmetkasi (Organization, BreadcrumbList, Product, Article) validatordan o‘tadi.
- Messenjerlarda to‘g‘ri preview uchun Open Graph teglari.
- Haqiqiy 404 javob kodini qaytaradigan foydali 404 sahifasi.

## Tezlik va mobil versiya

- Asosiy shablonlarni **PageSpeed Insights**’da tekshiring: bosh sahifa, kategoriya, kartochka, maqola.
- Rasmlar siqilgan, zamonaviy formatlarda, o‘lchamlari ko‘rsatilgan.
- Birinchi chizishni sekinlashtiradigan bloklovchi skriptlar yo‘q.
- Sayt telefonda qulay: o‘qiladigan shrift, bosiladigan tugmalar, gorizontal skroll yo‘q.
- Mobil versiya kontenti desktop bilan bir xil.

## Analitika

- **Google Analytics** va **Yandex Metrika** hisoblagichlari barcha sahifalarda o‘rnatilgan.
- Maqsadlar sozlangan: ariza, qo‘ng‘iroq, xarid.
- Search Console va Webmaster’dagi huquqlar asosiy domen uchun tasdiqlangan.
- Sayt ko‘chayotgan bo‘lsa, taqqoslash uchun eski hisoblagichlarga kirishni saqlab qoling.

## Ko‘p uchraydigan xatolar

- Muammoni tuzatadigan odam yo‘q paytda, juma kuni kechqurun ishga tushirish.
- Redirectlarni "keyin qilamiz" deb qoldirish.
- Indeksatsiyasi ochiq stend asosiy saytdan oldin qidiruvga tushib qolishi.
- Trafigi bor sahifalarni o‘rnini bosmasdan o‘chirib yuborish.

## FAQ

### Qidiruv tizimlari yangi saytni qancha vaqtda indekslaydi?

Aniq muddat yo‘q: bu sayt hajmiga, unga olib boruvchi havolalarga va sahifalar sifatiga bog‘liq. Yuborilgan sitemap, Search Console’da asosiy URL’larni indekslash so‘rovi va Yandex uchun IndexNow protokoli jarayonni tezlashtiradi.

### Tuzilma juda o‘zgargan bo‘lsa ham redirectlar majburiymi?

Ha. Aniq moslik bo‘lmasa ham, eski URL’ni ma’nosi bo‘yicha eng yaqin sahifa yoki bo‘limga yo‘naltiring. Redirectlarsiz to‘plangan pozitsiyalar va tashqi havolalarni yo‘qotasiz.

### Ishga tushgandan keyin trafik tushib ketsa nima qilish kerak?

Avval blokerlarni tekshiring: noindex, robots.txt, javob kodlari va redirectlar. Keyin ko‘rsatishlarni yo‘qotgan sahifalarni topish uchun Search Console hisobotlarini ishga tushirishdan oldin va keyin solishtiring.
