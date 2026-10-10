---
title: Ozon’da savdoni qanday boshlash kerak: bosqichma-bosqich qo‘llanma
description: Ozon’da sotuvchi sifatida ro‘yxatdan o‘tish, katalog yuklash, FBO, FBS yoki realFBS sxemasini tanlash, narx va aksiya vositalari hamda Seller API.
summary: Ozon sotuvchi kabinetida ro‘yxatdan o‘ting, katalogni qo‘lda, shablon yoki API orqali yuklang, ishlash sxemasini (FBO, FBS yoki realFBS) tanlang, aksiyalar uchun minimal narx belgilang va qoldiq, narx hamda buyurtmalarni Seller API orqali avtomatlashtiring.
---
## Qisqa javob: birinchi buyurtmalargacha besh qadam

1. Sotuvchi kabinetida **ro‘yxatdan o‘tish**: davlat, kompaniya ma’lumotlari, rekvizitlar, ofertani qabul qilish. Ozon faqat Rossiya sotuvchilari bilan ishlamaydi — davlatingiz uchun shartlar ro‘yxatdan o‘tishda ko‘rsatiladi.
2. **Katalog:** tovar kartochkalari, rasmlar, xususiyatlar, kerak bo‘lsa brend huquqi va sertifikatlar.
3. **Ishlash sxemasi:** Ozon ombori, o‘z omboringiz yoki o‘z yetkazishingiz.
4. **Narx va reklama:** narx, minimal narx, aksiyalarda ishtirok, reklama.
5. **Avtomatlashtirish:** tovarlar qo‘lda yuritish noqulay darajaga yetganda Seller API yoki hisob tizimi bilan tayyor integratsiyani ulaysiz.

## Sotuvchini ulash

- **Ro‘yxat hujjatlari**, bank rekvizitlari va mas’ul shaxs kontaktlarini tayyorlang.
- **Tekshiruvdan** o‘ting. U davom etayotganda kartochkalarni tayyorlashingiz mumkin.
- **Kabinet bo‘limlari** bilan tanishing: tovarlar, narxlar, logistika, buyurtmalar, moliya, analitika. Eng ko‘p vaqtni «Tovarlar» va «Moliya»da o‘tkazasiz.
- Brendlar va tartibga solinadigan toifalar uchun **brend huquqi** va **muvofiqlik hujjatlarini** oldindan yuklang, aks holda kartochkalar moderatsiyadan o‘tmaydi.

## Katalogni yuklash

Uch usul bor va ularni birlashtirish mumkin:

| Usul | Qachon qulay |
|---|---|
| Kabinetda qo‘lda | Bir nechta tovar, platformani sinash |
| Toifa uchun XLS-shablon | O‘nlab va yuzlab pozitsiyalar jadvalda tayyor |
| Seller API | Katta katalog, tez-tez o‘zgarishlar, hisob tizimi yoki 1C bor |

Agar tovaringiz Ozon’da boshqa sotuvchilarda allaqachon sotilayotgan bo‘lsa, yangisini yaratish o‘rniga **mavjud kartochkaga qo‘shilishingiz** mumkin.

Har bir kartochkada nimani tekshirish kerak:

- **toifa va tovar turi** — majburiy atributlar va komissiya shunga bog‘liq;
- **sotuvchi artikuli** — noyob va o‘zgarmas: qoldiq va narxlarni shu orqali sinxronlaysiz;
- har bir variant uchun **shtrix-kod**;
- **qadoqdagi og‘irlik va o‘lchamlar** — logistika narxiga ta’sir qiladi, xatolar qimmatga tushadi;
- **rasm, tavsif va atributlar** — qidiruv va filtrlar ular asosida ishlaydi.

## Ishlash sxemasini tanlash

| Sxema | Kim saqlaydi | Kim yetkazadi | Qachon mos |
|---|---|---|---|
| FBO | Ozon | Ozon | Tez sotiladigan tovar, tez yetkazish va minimal operatsion ish |
| FBS | Siz | Ozon (yig‘ilgan buyurtmani topshirasiz) | Keng assortiment, zaxiralarni nazorat qilmoqchisiz |
| realFBS | Siz | Siz yoki yetkazish xizmatingiz | Katta gabarit, maxsus yetkazish shartlari, o‘z logistikangiz |

Sxemalarni birlashtirish mumkin: bitta tovar ham Ozon omboridan, ham sizning omboringizdan sotilishi mumkin.

## Narx va aksiyalar

- **Narx va chegirmagacha narx.** Chizilgan narx halol bo‘lishi kerak — platforma chegirmalarni tekshiradi.
- **Minimal narx.** Aksiyalarga avtomatik qo‘shilganda tovar undan pastga tushmaydigan chegara. Uni taxminan emas, unit-iqtisodiyotdan hisoblang.
- **Aksiyalar.** Platforma muntazam aksiyalar taklif qiladi. Ular trafik beradi, lekin marjani kamaytiradi — faqat chegirmadan keyin ham foydali qoladigan tovarlarni qo‘shing.
- **Narx indeksi.** Ozon narxingizni boshqa platformalardagi narxlar bilan solishtiradi va bu tovar ko‘rinishiga ta’sir qiladi.
- **Reklama.** Qidiruvda va kartochkalarda klik yoki buyurtma uchun to‘lovli reklama. Eng yaxshi konversiyali tovarlarga kichik byudjet bilan boshlang.

## Seller API orqali ulanish

**Seller API** o‘z tizimingizdan tovarlar, narxlar, qoldiqlar va buyurtmalarni boshqarish hamda moliyaviy hisobotlarni olish imkonini beradi. Kalit kabinet sozlamalarida yaratiladi. Har bir so‘rov — JSON va ikkita avtorizatsiya sarlavhasi bilan POST:

```bash
curl -X POST "https://api-seller.ozon.ru/<hujjatdagi-metod>" \
  -H "Client-Id: <client-id>" \
  -H "Api-Key: <api-key>" \
  -H "Content-Type: application/json" \
  -d "{}"
```

Odatda birinchi navbatda nimalar avtomatlashtiriladi:

1. Hisob tizimi bilan **qoldiqlarni sinxronlash** — yo‘q tovarni sotmaslik uchun.
2. Qoidalar bo‘yicha **narxlarni yangilash**.
3. **FBS-buyurtmalarni qabul qilish va qayta ishlash.**
4. Solishtirish uchun **moliyaviy hisobotlarni yuklab olish**.

Metodlar va ularning versiyalari yangilanib turadi — [Seller API rasmiy hujjatlari](https://docs.ozon.ru/api/seller/) bilan tekshiring va kalitni paroldek ehtiyot qilib saqlang.

## FAQ

### O‘zbekistondan Ozon’da sotish mumkinmi?

Ha, platforma bir qator davlatlar, jumladan O‘zbekiston sotuvchilari bilan ishlaydi. Mavjud sxemalar, to‘lov valyutasi va hujjat talablari ro‘yxatdan o‘tgan davlatga bog‘liq — ularni ro‘yxatdan o‘tishda tekshiring.

### Yangi boshlovchi qaysi sxemadan boshlashi kerak?

Tovarlar kam va tez sotiladigan bo‘lsa — FBO’dan: operatsion ish kamroq. Assortiment keng yoki talab sinalmagan bo‘lsa — FBS’dan, shunda pul yetkazib berishda muzlab qolmaydi.

### API ulash majburiymi?

Yo‘q. Kichik katalog uchun kabinet va XLS-shablonlar yetarli. Qoldiq va narxlarni qo‘lda yangilash xatolar va bekor qilingan buyurtmalarga olib kela boshlaganda API kerak bo‘ladi.
