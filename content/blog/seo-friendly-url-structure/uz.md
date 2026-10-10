---
title: SEO uchun qulay URL qanday tuziladi: tuzilma va qoidalar
description: Tushunarli URL tuzish: kirillni transliteratsiya qilish, ichma-ichlik, parametrlar, oxiridagi slesh va manzilni 301-redirekt bilan xavfsiz o‘zgartirish.
summary: Yaxshi URL qisqa, o‘qiladigan, kichik harflarda, so‘zlar defis bilan ajratilgan va ortiqcha parametrsiz bo‘ladi; uni faqat eski manzildan 301-redirekt bilan o‘zgartirish mumkin.
---

## SEO uchun qulay URL nima va u nima uchun kerak

**SEO uchun qulay URL** — bosishdan oldinoq sahifada nima borligini tushuntirib beradigan manzil. Solishtiring:

- `/catalog/noutbuklar/lenovo-thinkpad-x1/`
- `/index.php?cat=12&id=8841&sort=2`

Birinchisi qidiruv natijalarida, messenjerda va forumdagi havolada o‘qiladi. Qidiruv tizimlari URL’dagi so‘zlarni sahifa mavzusi haqidagi kuchsiz signal sifatida ishlatadi, lekin asosiy foyda — ishonch, bosilish va analitika qulayligi: manzildan bo‘lim darhol ko‘rinadi.

## Asosiy qoidalar

- **Kichik harflar.** Server `/Blog/Post` va `/blog/post`ni turli sahifa deb hisoblashi mumkin — bu dublikat.
- **So‘zlar orasida defis.** Pastki chiziq yoki bo‘sh joy (`%20`) emas.
- **Qisqa va aniq.** Ma’no yo‘qolmasa, ortiqcha so‘zlarni olib tashlang: `/hostingni-qanday-tanlash-kerak/` o‘rniga `/hosting-tanlash/`.
- **Bitta sahifa — bitta manzil.** `www` bilan yoki usiz ekanini hal qiling, doim `https`, qolgan variantlardan redirekt sozlang.
- **Keraksiz sana va ID yo‘q.** Maqola manzilidagi sana materialni yangilashga xalaqit beradi: tahrirdan keyin ham manzil eskicha ko‘rinadi.
- **Kalit so‘z — ha, spam — yo‘q.** `/seo/seo-xizmati-seo-sayt/` spamga o‘xshaydi.

## Kirill harflarini transliteratsiya qilish

URL’da kirill harflari ruxsat etilgan, lekin nusxa olinganda `%D0%BA%D0%B0...` kabi uzun qatorga aylanadi. Shu sababli rus tilidagi saytlar odatda **transliteratsiya**dan foydalanadi. O‘zbek lotin yozuvida esa ‘ belgisini URL’dan chiqarib tashlash qulay: `o‘zbekiston` → `ozbekiston`.

| Variant | Misol | Izoh |
|---|---|---|
| Transliteratsiya | `/dostavka-po-tashkentu/` | Eng keng tarqalgan, hamma o‘qiy oladi |
| Inglizcha tarjima | `/delivery-tashkent/` | Ko‘p tilli saytlar uchun qulay |
| Kirill yozuvi | `/доставка-по-ташкенту/` | Brauzerda chiroyli, nusxalashda xunuk |

Eng muhimi — **bitta transliteratsiya tizimini** tanlab, hamma joyda qo‘llash. Slug’ni CMS’da bitta funksiya orqali sarlavhadan avtomatik yaratish yaxshiroq.

## Ichma-ichlik chuqurligi

URL tuzilmasi odatda sayt tuzilmasini takrorlaydi: `/bolim/kichik-bolim/sahifa/`. Bu qulay, lekin mantiq uchun besh-olti daraja qurish shart emas.

- Ko‘pchilik saytlarga **2–3 daraja** yetarli.
- Manzildagi chuqurlik emas, **bosh sahifadan bosishlar soni** muhim — sahifaga ichki havolalar orqali yetib borish kerak.
- Mahsulot bir nechta kategoriyada bo‘lsa, har biri ostida manzil yaratmang — bitta asosiy yo‘lni tanlang.

## GET-parametrlar, filtrlar va UTM

Parametrlar (`?sort=price&page=2`) saralash, sahifalash va filtrlar uchun normal, lekin bitta sahifaning minglab variantini yaratadi.

- Saralash va texnik parametrlar uchun asosiy versiyaga **canonical** ko‘rsating.
- Odamlar qidiradigan filtrlarni («Lenovo noutbuklari») alohida sarlavha va matnli toza URL sahifalar qilish yaxshiroq.
- UTM-teglar indeksga tushmasligi kerak: buni canonical hal qiladi, Yandex uchun robots.txt’dagi `Clean-param` direktivasi ham yordam beradi.

## Oxiridagi slesh: bilan yoki usiz

Texnik jihatdan `/page` va `/page/` — turli URL. SEO uchun ikkalasi ham teng, muhimi — **bir xillik**. Bittasini tanlang va ikkinchisidan 301-redirekt qiling. Sleshni olib tashlaydigan nginx misoli:

```nginx
rewrite ^/(.*)/$ /$1 permanent;
```

Qo‘llashdan oldin qoida sayt ildizini va haqiqiy kataloglarni buzmasligini tekshiring.

## URL’ni xavfsiz o‘zgartirish

Ishlab turgan saytda manzillarni o‘zgartirish — trafik tushishining keng tarqalgan sababi. Tartib:

1. Har bir sahifa uchun «eski URL → yangi URL» **moslik jadvalini** tuzing.
2. Zanjirsiz (A → B → C) va hammasini bosh sahifaga yubormasdan, birga-bir **301-redirektlar** sozlang.
3. **Ichki havolalar**, canonical, hreflang va sitemap.xml’ni yangi manzillarga yangilang.
4. Eski manzillar ro‘yxatini krauler bilan tekshiring: har biri 301 qaytarib, 200 kodli sahifaga olib borishi kerak.
5. Google Search Console va Yandex Vebmaster’da indeksatsiyani kuzating, redirektlarni uzoq vaqt saqlang.

Ko‘chishdan keyin vaqtinchalik pasayish bo‘lishi mumkin, shuning uchun URL’ni faqat chiroy uchun o‘zgartirmang. Eski manzillar ishlasa va dublikat bo‘lmasa, ularni qoldirish mumkin.

## FAQ

### Eski xunuk URL’larni toza URL’ga almashtirish kerakmi?

Faqat haqiqiy muammo bo‘lsa: dublikatlar, indeksdagi parametrlar, chalkash tuzilma. Manzilni o‘zgartirish doim xavf tug‘diradi, shuning uchun buni bir marta, to‘liq redirekt xaritasi bilan qiling.

### Rus tilidagi sayt uchun transliteratsiya yaxshimi yoki inglizcha so‘zlar?

Ikkalasi ham ishlaydi. Transliteratsiya foydalanuvchi so‘rovlariga yaqinroq, inglizcha ko‘p tilli loyihalar uchun qulayroq. Asosiysi — bitta yondashuvni tanlab, aralashtirmaslik.

### URL’dagi so‘zlar pozitsiyaga ta’sir qiladimi?

Ta’siri kichik. Toza URL’ning asosiy foydasi — odamlar uchun tushunarlilik, analitika qulayligi va dublikatlar yo‘qligi, to‘g‘ridan-to‘g‘ri pozitsiya o‘sishi emas.
