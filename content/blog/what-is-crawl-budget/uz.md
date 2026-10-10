---
title: Crawl budget nima va u qachon muammoga aylanadi
description: Crawl budget oddiy tilda: u nimadan iborat, qaysi saytlar uchun muhim va uni nima behuda sarflaydi — URL parametrlari, redirekt zanjirlari, bo‘sh sahifalar.
summary: Crawl budget — qidiruv roboti saytingizda qancha sahifani aylanib chiqa olishi va chiqishni xohlashi; u yirik va tez yangilanadigan saytlar uchun muhim, kichik saytlarga esa keraksiz URL’lar yaratmaslik kifoya.
---
## Qisqacha asosiysi

**Crawl budget (skanerlash byudjeti)** — qidiruv roboti ma’lum vaqt ichida saytda aylanib chiqadigan sahifalar hajmi. U ikki qismdan iborat:

- **Skanerlash tezligi chegarasi (crawl rate)** — robot serverni ortiqcha yuklamasdan qancha so‘rov yubora oladi. Sayt tez va xatosiz javob bersa, chegara oshadi. Sekinlashsa yoki 5xx xatolar qaytarsa — kamayadi.
- **Skanerlashga ehtiyoj (crawl demand)** — qidiruv tizimi sahifalaringizni aylanib chiqishga qanchalik qiziqadi. Mashhur va tez-tez yangilanadigan URL’larga robot ko‘proq, eskirgan va ahamiyatsizlariga kamroq kiradi.

Robot vaqtini keraksiz manzillarga sarflasa, muhim sahifalar indeksga kechikib tushadi.

## Bu kimlar uchun haqiqatan muhim

Ko‘pchilik kichik saytlar uchun crawl budget muammo emas: robot bir necha yuz yoki ming sahifani bemalol aylanib chiqadi. Google o‘z hujjatlarida bu mavzu birinchi navbatda **juda yirik saytlar** va **kontenti tez o‘zgaradigan saytlar** uchun dolzarb ekanini aytadi.

Quyidagi hollarda e’tibor berish kerak:

- filtrlar va o‘n minglab mahsulotlarga ega **internet-do‘kon**;
- sahifalar har kuni paydo bo‘lib, yo‘qoladigan **agregator yoki e’lonlar sayti**;
- indeksga tez tushish muhim bo‘lgan **yangiliklar sayti**;
- hisobotlarda «Topilgan, lekin indekslanmagan» holatidagi sahifalar ko‘p.

## Byudjetni nima behuda sarflaydi

| Manba | Nima uchun zararli |
|---|---|
| URL parametrlari va filtrlar | `?color=red&sort=price` kabi cheksiz kombinatsiyalar minglab dublikat yaratadi |
| Redirekt zanjirlari | Har bir ortiqcha o‘tish — robotning alohida so‘rovi |
| Yupqa va bo‘sh sahifalar | Bo‘sh kategoriyalar, bitta yozuvli teglar, sayt ichidagi qidiruv sahifalari |
| Dublikatlar | `www` bilan va usiz, slesh bilan va usiz, http va https |
| Soft 404 | 200 kodi bilan qaytuvchi «mahsulot topilmadi» sahifasi |
| Cheksiz bo‘shliqlar | Kalendarlar, oxiri yo‘q paginatsiya, avtomatik havolalar |
| Sekin server | Robot so‘rovlar chastotasini kamaytiradi |

## Qanday tartibga keltirish mumkin

1. Google Search Console va Yandex Vebmasterda **skanerlash statistikasini ko‘ring**: robot qancha so‘rov yuborayotgani va qanday javoblarga duch kelayotgani ko‘rinadi.
2. **Server loglarini tahlil qiling.** Robot qaysi URL’larga haqiqatan kirayotganini bilishning eng aniq yo‘li.
3. Keraksiz parametrlarni `robots.txt` da **yoping**. Yandex uchun ahamiyatsiz parametrli URL’larni birlashtiradigan `Clean-param` direktivasi bor.
4. **Redirekt zanjirlarini olib tashlang** — to‘g‘ridan-to‘g‘ri yakuniy manzilga yo‘naltiring.
5. Dublikatlar uchun **canonical**, xizmat sahifalari uchun **noindex** sozlang. Esda tuting: robots.txt aylanib chiqishni taqiqlaydi, noindex esa faqat sahifani aylanib chiqish mumkin bo‘lsa ishlaydi.
6. **sitemap.xml ni toza saqlang** — faqat 200 kodli kanonik sahifalar.
7. **Server javobini tezlashtiring** va 5xx xatolarni tuzating.

`robots.txt` qoidalariga misol:

```text
User-agent: *
Disallow: /search
Disallow: /*?sort=

User-agent: Yandex
Clean-param: utm_source&utm_medium&utm_campaign
```

## Ko‘p uchraydigan xatolar

- Sahifani robots.txt da yopib, robot undagi noindex ni ko‘rishini kutish.
- Sitemap’ga redirektlar, 404 va kanonik bo‘lmagan URL’larni qo‘shish.
- Noyob kontentsiz minglab landing sahifalar yaratish.
- Keraksiz URL’lar sonini kamaytirish o‘rniga «byudjetni oshirishga» urinish.

## FAQ

### Saytda crawl budget bilan muammo borligini qanday bilish mumkin?

Yangi va yangilangan sahifalar indeksga uzoq tushmasa, loglarda esa robot asosan parametrlar va dublikatlar bo‘ylab yursa, muammo bo‘lishi ehtimoli yuqori. Kichik saytlarda kechikishlar odatda byudjet emas, sahifalar sifati bilan bog‘liq.

### Google’dan saytni tez-tez skanerlashni so‘rash mumkinmi?

Byudjetni to‘g‘ridan-to‘g‘ri oshirib bo‘lmaydi. Tez va barqaror server, foydali yangilanadigan kontent va keraksiz URL’larning yo‘qligi yordam beradi.

### noindex crawl budget’ni tejaydimi?

Robot noindex sahifalarni baribir aylanib chiqadi, garchi vaqt o‘tishi bilan kamroq qilishi mumkin. Tejash uchun bunday URL’larni umuman yaratmaslik yoki ularga havola bermaslik yaxshiroq.
