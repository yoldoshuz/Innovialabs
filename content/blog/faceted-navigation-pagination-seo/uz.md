---
title: Katta kataloglar uchun SEO: filtrlar va sahifalash
description: Qaysi filtr kombinatsiyalarini indeksatsiyaga ochish, parametrlarni skanerlashni cheklash va rel=prev/next’siz sahifalashni to‘g‘ri sozlash.
summary: Faqat haqiqiy qidiruv talabi bor filtr kombinatsiyalarini indekslang, qolganlarini skanerlashdan yoping, sahifalash sahifalariga esa alohida URL, o‘ziga canonical va oddiy havolalar bering.
---
## Qisqa javob

Katta katalogdagi filtrlar deyarli cheksiz URL hosil qiladi: rang, o‘lcham, brend, narx, saralash va ularning kombinatsiyalari. Bularning hammasi indeksga tushsa, qidiruv tizimi **crawl budget**ni dublikatlarga sarflaydi, muhim mahsulot sahifalari esa kamroq skanerlanadi.

Ishlaydigan sxema:

- **Landing sahifalar** — faqat qidiruv talabi bor kombinatsiyalar uchun («erkaklar uchun Nike krossovkalari»).
- **Qolgan filtrlar** — indekslanmaydi va iloji bo‘lsa skanerlanmaydi.
- **Sahifalash** — alohida indekslanadigan URL’lar, har birida o‘ziga ko‘rsatuvchi canonical.

## Qaysi kombinatsiyalar indeksatsiyaga loyiq

Qaror filtrlar tuzilmasiga emas, ma’lumotlarga qarab qabul qilinadi. Har bir kombinatsiyani tekshiring:

1. **Talab bor** — u bo‘yicha qidirishadi (Google Keyword Planner, Yandex Wordstat).
2. **Assortiment bor** — sahifada bir-ikkita emas, yetarlicha mahsulot bor.
3. **Noyoblik bor** — o‘z title, H1, meta teglari va iloji bo‘lsa qisqa matni.
4. **Chuqurlik oqilona** — odatda bir-ikki o‘lchov yetarli: kategoriya + brend, kategoriya + tur. Bir vaqtda uch va undan ortiq filtr kamdan-kam talab beradi.

«Kombinatsiya shabloni → qaror» jadvalini yuritish qulay:

| Kombinatsiya turi | Misol | Qaror |
|---|---|---|
| Kategoriya + brend | /sneakers/nike/ | Indekslash, toza URL |
| Kategoriya + rang | /sneakers/?color=red | Talabga qarab |
| Saralash | ?sort=price_asc | Indekslamaslik |
| Narx oralig‘i | ?price=1000-5000 | Indekslamaslik |
| 3+ filtr | ?brand=x&color=y&size=z | Indekslamaslik |

Indekslanadigan kombinatsiyalarga **statik, toza URL** bering va ularga faqat JavaScript filtr orqali emas, menyu yoki ichki havolalar bloklaridan ham havola qo‘ying.

## Parametrlarni skanerlashni qanday cheklash

Indekslanmaydigan kombinatsiyalar uchun bir nechta vosita bor va ular turli vazifalarni bajaradi:

- **robots.txt (Disallow)** — bot URL’ni skanerlamaydi. Byudjetni tejaydi, lekin ko‘p havola bo‘lsa, sahifa mazmunsiz holda indeksga tushishi mumkin.
- **meta robots noindex** — sahifa indeksga tushmaydi, lekin tegni ko‘rish uchun bot sahifani yuklashi kerak. Disallow bilan birga ishlatmang: yopilgan sahifani bot o‘qiy olmaydi.
- **canonical** — direktiva emas, maslahat. Saralash kabi deyarli bir xil sahifalar uchun mos, lekin skanerlashni tejashni kafolatlamaydi.
- **robots.txt’dagi Clean-param** — mazmunni o‘zgartirmaydigan parametrlar (utm, sessiya, saralash) uchun Yandex direktivasi.
- **Havolasiz filtrlar** — parametrlar `<a href>`’siz forma yoki JavaScript orqali o‘zgaradi va bot bu URL’larni topmaydi.

```text
User-agent: *
Disallow: /*?*sort=
Disallow: /*?*price=

User-agent: Yandex
Clean-param: sort&utm_source&utm_medium /catalog/
```

Shuningdek:

- **Parametrlar tartibini** qat’iy belgilang, shunda `?color=red&size=42` va `?size=42&color=red` ikki xil URL bo‘lib qolmaydi.
- Natijasi bo‘sh filtrlar uchun **404** qaytaring yoki ularga umuman havola bermang.

## rel=prev/next’siz sahifalash

Google ancha oldin `rel="prev"` va `rel="next"`’ni signal sifatida ishlatishni to‘xtatgan, Yandex esa o‘z mexanizmlariga tayanadi. Shuning uchun sahifalash o‘zi mustaqil ishlashi kerak:

- **Har bir sahifa — alohida URL**: `/catalog/?page=2` yoki `/catalog/page/2/`.
- **Canonical o‘ziga**, birinchi sahifaga emas. Aks holda chuqur sahifalardagi mahsulotlar yomonroq topilishi mumkin.
- Qo‘shni va yaqin sahifalarga **oddiy `<a href>` havolalar**.
- **Cheksiz scroll va «Yana ko‘rsatish»** mumkin, lekin parallel ravishda havolalar orqali ochiladigan sahifalangan URL’lar ham bo‘lishi kerak.
- **Kategoriya matnini** barcha sahifalarda takrorlamang — uni birinchi sahifada qoldiring.
- 2+ sahifalar title’iga raqam qo‘shish mumkin: «Krossovkalar — 2-sahifa».

## Ko‘p uchraydigan xatolar

- Barcha filtrlar indekslanadi va natijada minglab deyarli bo‘sh sahifalar paydo bo‘ladi.
- Bir URL’da bir vaqtda Disallow va noindex.
- Barcha sahifalash sahifalarining canonical’i birinchi sahifaga.
- Indekslanadigan filtrlar faqat JavaScript orqali, HTML havolalarsiz.
- Nol natijali filtrlarga havolalar.

## FAQ

### Sahifalash sahifalarini indeksatsiyadan yopish kerakmi?

Odatda yo‘q. 2+ sahifalar botga mahsulotlarni topishga yordam beradi. O‘ziga canonical, sahifa raqami bilan noyob title va takrorlanuvchi matn yo‘qligi yetarli.

### Filtrlar uchun nima yaxshi: robots.txt yoki noindex?

Maqsad juda ko‘p URL’da skanerlashni tejash bo‘lsa, robots.txt’dan foydalaning yoki bunday filtrlarga havolalarni olib tashlang. URL’lar allaqachon indeksda bo‘lsa va ularni olib tashlash kerak bo‘lsa, avval noindex qo‘ying, indeksdan chiqqandan keyingina Disallow qo‘shing.

### Filtrlar crawl budget’ni sarflayotganini qanday bilish mumkin?

Google Search Console’dagi Crawl Stats hisobotini, Yandex Webmaster’dagi skanerlash ma’lumotlarini va server loglarini ko‘ring. Botlar asosan parametrli URL’larni aylansa, yangi mahsulotlar esa sekin indekslansa, bu aniq signal.
