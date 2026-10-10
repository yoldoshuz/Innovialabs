---
title: 404 xatolari va buzilgan havolalarni qanday topish va tuzatish
description: Buzilgan ichki va tashqi havolalarni qanday topish, har bir 404 uchun redirect, tiklash yoki o‘z holicha qoldirishni tanlash va foydali 404 sahifasini yaratish.
summary: Buzilgan havolalar krauler va Search Console hamda Webmaster hisobotlari orqali topiladi, keyin har bir 404 uchun qaror qilinadi: sahifani tiklash, eng yaqin o‘rinbosarga 301 qo‘yish yoki foydali xato sahifasi bilan 404 ni qoldirish.
---

## Qisqa javob

404 xatosining o‘zi saytga zarar yetkazmaydi: bu mavjud bo‘lmagan sahifa uchun oddiy javob. Muammo 404 ga **o‘zingizning havolalaringiz**, boshqa saytlardan **tashqi havolalar** olib borsa yoki sahifa ilgari trafik olgan bo‘lsa paydo bo‘ladi. Bunday holatlarni topib tuzatish kerak, qolganlarini qoldirish mumkin.

## Buzilgan havolalarni qayerdan qidirish kerak

| Manba | Nimani ko‘rsatadi |
|---|---|
| Krauler (Screaming Frog, Sitebulb va h.k.) | 404 ga olib boruvchi ichki havolalar va ular turgan sahifalar |
| Google Search Console, "Sahifalar" hisoboti | Google biladigan "Topilmadi (404)" URL’lar |
| Yandex Webmaster, qidiruvdagi sahifalar va diagnostika | chiqarib tashlangan sahifalar va aylanib chiqish xatolari |
| Tashqi havolalar hisobotlari | boshqa saytlar havola qiladigan buzilgan URL’lar |
| Server loglari | mavjud bo‘lmagan manzillarga real so‘rovlar |
| Analitika | 404 sahifasiga tashriflar va o‘tish manbalari |

**Chiquvchi tashqi havolalar** (saytingizdan boshqa saytlarga) uchun kraulerda tashqi URL’larni tekshirishni yoqing: boshqa saytlar ham ko‘chadi va sahifalarni o‘chiradi.

## Har bir 404 bilan nima qilishni qanday hal qilish

Har bir buzilgan URL uchun uchta savol bering:

1. **Sahifa xato bilan o‘chirilganmi?** Uni tiklang.
2. **Ma’nosi yaqin o‘rinbosar bormi?** Unga **301-redirect** qo‘ying: mahsulotning yangi versiyasi, yangilangan maqola, ota kategoriya.
3. **O‘rinbosar ham, havolalar ham yo‘qmi?** 404 ni qoldiring yoki sahifa butunlay o‘chirilgan bo‘lsa **410** qaytaring.

Nima qilmaslik kerak:

- **Hammasini bosh sahifaga redirect qilish.** Foydalanuvchi qidirganini topmaydi, qidiruv tizimlari esa ko‘pincha buni "yumshoq 404" deb hisoblaydi.
- **"Topilmadi" sahifasida 200 kodini qaytarish.** Bu klassik soft 404: qidiruv tizimi bo‘sh sahifani haqiqiy sahifa deb ko‘radi.
- **A → B → C kabi zanjirlar qurish.** To‘g‘ridan-to‘g‘ri yakuniy manzilga yo‘naltiring.

nginx’da 301-redirect misoli:

```nginx
location = /old-product {
    return 301 /catalog/new-product;
}
```

## Ichki havolalarni manbaning o‘zida tuzating

Redirect — tashqi dunyo uchun sug‘urta. Agar buzilgan havola **menyuingizda, matnda yoki shablonda** tursa, uni o‘sha yerning o‘zida dolzarb URL’ga almashtiring. Aks holda robot har safar ortiqcha qadam bosadi, foydalanuvchi esa uzoqroq kutadi.

Shablonlarga alohida e’tibor bering: futerdagi bitta noto‘g‘ri havola saytning barcha sahifalariga ko‘payadi.

## Foydali 404 sahifasini qanday yaratish

Yaxshi 404 sahifasi odamning saytdan chiqib ketmasligiga yordam beradi:

- Texnik jargonsiz **tushunarli xabar**: sahifa yo‘q, mana nima qilish mumkin.
- Sahifaning o‘zida **sayt bo‘yicha qidiruv**.
- Bosh sahifa, asosiy bo‘limlar va mashhur materiallarga **havolalar**.
- Odam adashmaganini tushunishi uchun saytning qolgan qismi kabi **navigatsiya va dizayn**.
- 200 yoki redirect emas, **to‘g‘ri 404 javob kodi**.

404 ko‘rsatilganda manzil va o‘tish manbai bilan analitikaga hodisa qo‘shing. Shunda yangi buzilgan havolalarni foydalanuvchilar sezishidan oldin ko‘rasiz.

## Yangi 404 larning oldini qanday olish

- Sahifani o‘chirganda yoki nomini o‘zgartirganda darhol redirect qo‘shing.
- Shablonlardagi havolalarni qo‘lda yozmasdan, marshrutlardan generatsiya qiling.
- Kraulerni yirik yangilanishlardan keyin va jadval bo‘yicha ishga tushiring.
- O‘chirilgan URL’lar qolib ketmasligi uchun `sitemap.xml`ni avtomatik saqlang.

## FAQ

### 404 xatolari sayt pozitsiyalariga zarar yetkazadimi?

O‘z-o‘zidan yo‘q: qidiruv tizimlari ularni o‘chirilgan sahifalar uchun normal holat deb hisoblaydi. Zarar 404 ga ichki yoki qimmatli tashqi havolalar olib borganda, ularning og‘irligi yo‘qolganda va foydalanuvchilar boshi berk ko‘chaga kirganda paydo bo‘ladi.

### Qachon 404 o‘rniga 410 qaytarish kerak?

410 kodi sahifa butunlay o‘chirilgani va qaytmasligini bildiradi. U kontentni aniq olib tashlaganingizda va o‘rinbosar rejalashtirmaganingizda ishlatiladi. Ko‘pchilik saytlar uchun farq kichik, ikkala javob ham to‘g‘ri.

### Search Console’dagi eski yoki keraksiz URL’lardagi 404 larni tuzatish kerakmi?

Agar ularga havolalar va trafik bo‘lmasa, yo‘q. Bunday manzillar ko‘pincha xato yozilgan yoki spam havolalardan paydo bo‘ladi. Foydalanuvchilar uchun muhim va havolalari bor URL’larga e’tibor qarating.
