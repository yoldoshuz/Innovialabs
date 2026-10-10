---
title: Veb-ilovani trafikning keskin o‘sishiga qanday tayyorlash kerak
description: Aksiya yoki reklama kampaniyasidan oldingi reja: tor joylarni topish, kesh, ulanishlar puli, navbatlar, avtomasshtablash va funksiyalarni o‘chirish.
summary: Yuklama testi bilan tor joyni toping, kesh va ulanishlar puli orqali bazani yengillating, og‘ir ishlarni navbatlarga chiqaring, avtomasshtablashni sozlang va qaysi funksiyalarni o‘chirish mumkinligini oldindan hal qiling.
---
## Qisqa javob

Trafik cho‘qqisi «serverni umuman» emas, balki bitta aniq **tor joyni** buzadi. Ko‘pincha bu ma’lumotlar bazasi, tashqi API yoki sekin endpoint bo‘ladi. Shuning uchun tayyorgarlik shu tartibda boradi:

1. O‘lchash: real ssenariy bo‘yicha yuklama testi.
2. Bazani yengillatish: **kesh** va **ulanishlar puli**.
3. Og‘ir ishni so‘rovdan chiqarish: **navbatlar**.
4. Tizimga o‘sish imkonini berish: **gorizontal masshtablash** va avtoskeyling.
5. Ortiqcha yuklamada nimani o‘chirishni hal qilish: **graceful degradation**.

## 1-qadam. Tor joyni toping

O‘lchovsiz siz noto‘g‘ri narsani tezlashtirasiz. Aksiya paytidagi foydalanuvchining real yo‘lini oling: bosh sahifa, katalog, mahsulot kartochkasi, savat, buyurtmani rasmiylashtirish.

- Yuklama testini (k6, Locust, JMeter) prodga imkon qadar o‘xshash stejingda ishga tushiring.
- Yuklamani bosqichma-bosqich oshiring va javob vaqti birinchi qayerda o‘sishini kuzating.
- Bir vaqtda metrikalarni kuzating: CPU, xotira, BD ulanishlari soni, sekin so‘rovlar, 5xx xatolar.

Odatiy topilmalar: indekssiz so‘rov, ORM’dagi N+1 so‘rovlar, to‘lov yoki SMS shlyuziga sinxron murojaat, PDF’ni to‘g‘ridan-to‘g‘ri handler ichida yaratish.

## 2-qadam. Mumkin bo‘lgan hamma narsani keshlang

Kesh cho‘qqiga bardosh berishning eng arzon usuli.

| Daraja | Nimani keshlash | Vosita |
|---|---|---|
| CDN | Statika, rasmlar, ochiq sahifalar | Istalgan CDN |
| Reverse proxy | Shaxsiylashtirilmagan javoblar | nginx, Varnish |
| Ilova | Og‘ir so‘rovlar natijalari, ma’lumotnomalar | Redis, Memcached |
| Brauzer | Nomida xeshi bor assetlar | Cache-Control sarlavhalari |

**Invalidatsiyani** puxta o‘ylang: narx yoki qoldiq o‘zgarganda kesh yangilanishi kerak. Katalog uchun ko‘pincha qisqa TTL yetarli, hatto bir necha soniyalik kesh ham bir xil so‘rovlarning katta qismini olib tashlaydi.

**Cache stampede**’dan himoyalaning: kalit muddati tugaganda yuzlab so‘rovlar bir vaqtda bazaga boradi. Qayta hisoblashga blokirovka yoki keshni muddati tugashidan oldin fonda yangilash yordam beradi.

## 3-qadam. Bazaga ulanishlar puli

PostgreSQL yoki MySQL bilan har bir yangi ulanish resurs talab qiladi, ularning chegarasi esa cheklangan. Ilovani o‘nlab instanslarga kengaytirsangiz va har birida o‘z puli bo‘lsa, baza CPU’dan oldin ulanishlar limitiga tiraladi.

- Ilovadagi pulni har bir instans uchun oqilona maksimum bilan sozlang.
- PostgreSQL uchun umumiy puler sifatida **PgBouncer**’ni ko‘rib chiqing.
- Og‘ir hisobotlarni **read-replika**ga chiqaring.

## 4-qadam. Og‘ir ish uchun navbatlar

Foydalanuvchi xat yuborilishini yoki hisob-faktura shakllanishini kutmasligi kerak. So‘rov minimumni bajaradi (buyurtmani saqlaydi) va vazifani navbatga qo‘yadi, workerlar esa uni alohida qayta ishlaydi.

```text
So‘rov -> buyurtmani saqlash -> vazifani navbatga qo‘yish -> 200 javob
                                        |
                       Workerlar: xat, SMS, 1C, PDF
```

RabbitMQ, Redis navbatlari, Kafka yoki bulutli servislar mos keladi. Afzalligi: cho‘qqida navbat shunchaki o‘sadi, saytni yiqitmaydi. Workerlar sonini alohida masshtablash mumkin.

## 5-qadam. Gorizontal masshtablash va avtoskeyling

Instanslar qo‘shish uchun ilova **stateless** bo‘lishi kerak: sessiyalar Redis yoki tokenlarda, fayllar lokal diskda emas, obyekt omborida.

- Balansir trafikni instanslar o‘rtasida taqsimlaydi.
- Avtoskeyling (masalan, Kubernetes’dagi HPA) CPU yoki so‘rovlar soni bo‘yicha podlar qo‘shadi.
- Ishga tushish vaqtini hisobga oling: yangi instanslar bir zumda ko‘tarilmaydi. Rejalashtirilgan aksiyadan oldin avtoskeylerga umid qilmasdan, **minimumni oldindan oshiring**.

## 6-qadam. Graceful degradation

Yadro (katalog, savat, to‘lov) ishlashi uchun nimani qurbon qilish mumkinligini oldindan hal qiling:

- tavsiyalar, sharhlar bo‘yicha qidiruv, jonli hisoblagichlarni o‘chirish;
- backend xatosida sahifaning keshlangan versiyasini ko‘rsatish;
- botlar va og‘ir endpointlar uchun **rate limiting** joriy qilish;
- tashqi API’lar uchun **circuit breaker** ishlatish, shunda osilib qolgan servis oqimlarni ushlab turmaydi;
- haddan tashqari yuklamada 502 xato o‘rniga kutish sahifasini ko‘rsatish.

Bu almashtirgichlarni deploysiz yoqish uchun **feature flag** qiling.

## Aksiyadan oldingi chek-list

- Yuklama testi kutilgan cho‘qqidan yuqori zaxira bilan o‘tdi.
- Dashbordlar va alertlar sozlangan, navbatchi tayinlangan.
- Instanslarning minimal soni oldindan oshirilgan.
- Cho‘qqi vaqtida deploylar muzlatilgan.
- Tashqi servislar (to‘lov tizimlari, SMS) limitlari aniqlangan.
- Orqaga qaytarish rejasi va funksiyalarni o‘chirish uchun flaglar ro‘yxati bor.

## Ko‘p uchraydigan xatolar

- Baza tor joy bo‘lganda ilovani masshtablash.
- Bir nechta mahsulotli bo‘sh bazada test qilish.
- Uchinchi tomon API limitlarini unutish.
- Aksiya kuni yangi reliz chiqarish.

## FAQ

### Shunchaki kuchliroq server olish yetarlimi?

Ba’zan bu tez vaqtinchalik yechim, lekin vertikal o‘sish cheklangan va bitta sekin so‘rov yoki osilib qolgan tashqi API muammosini hal qilmaydi. Tor joyni qidirishdan boshlang.

### Avtoskeyling uchun Kubernetes kerakmi?

Yo‘q. Avtomasshtablash bulutli instans guruhlari va PaaS platformalarida ham bor. Kubernetes servislar ko‘p bo‘lib, yagona platforma kerak bo‘lganda foydali.

### Qancha quvvat zaxirasi kerakligini qanday bilish mumkin?

Kutilgan cho‘qqini o‘tgan aksiyalar yoki marketing prognozi bo‘yicha baholang va tizim qayerda, qanday buzila boshlashini ko‘rish uchun bu bahodan sezilarli yuqori yuklama bilan test qiling.
