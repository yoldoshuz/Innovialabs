---
title: Inkrementallik testlari: reklamaning haqiqiy samarasini o‘lchash
description: Atributsiya reklama hissasini nega oshirib ko‘rsatadi va haqiqiy samarani qanday o‘lchash: holdout guruhlar, geo-lift va platformalarning lift tadqiqotlari.
summary: Inkrementallik — reklamani ko‘rganlar va uni ko‘rmagan taqqoslanadigan guruh o‘rtasidagi konversiyalar farqi. Uni faqat eksperiment bilan o‘lchash mumkin: holdout guruh, geo-test yoki platforma lift tadqiqoti, chunki atributsiya reklamasiz ham bo‘ladigan xaridlarni ham reklamaga yozadi.
---

## Atributsiya va inkrementallik — bir narsa emas

**Atributsiya** «xariddan oldin qaysi teginish bo‘lgan» degan savolga javob beradi. **Inkrementallik** esa «reklamasiz qancha xarid bo‘lmas edi» degan savolga. Bular turli savollar va javoblar keskin farq qilishi mumkin.

Atributsiya qilingan konversiyalar reklama hissasini nega oshirib ko‘rsatadi:

- **Brend qidiruvi** aynan sizni izlayotgan va organik yo‘l bilan baribir keladigan odamlarni ushlaydi.
- **Retargeting** xaridga allaqachon yaqin bo‘lganlarga ko‘rsatiladi.
- **Ko‘rishdan keyingi konversiyalar** odam faqat bannerni ko‘rgan bo‘lsa ham xaridni reklamaga yozadi.
- **Har bir platforma o‘zini hisoblaydi**: kabinetlardagi konversiyalar yig‘indisi odatda real buyurtmalardan ko‘p.
- **Optimallashtirish algoritmlari** baribir sotib olishi ehtimoli yuqori bo‘lganlarni topadi — bu hisobot uchun yaxshi, lekin biznes uchun shart emas.

Atributsiya kundalik optimallashtirish uchun foydali. «Bu byudjetni umuman sarflash kerakmi» degan savolga javob uchun esa eksperiment kerak.

## Asosiy g‘oya: nazorat guruhi

Har qanday inkrementallik testi ikkita taqqoslanadigan guruhni solishtiradi:

- **test guruhi** — reklamani ko‘radi;
- **nazorat guruhi** — ko‘rmaydi, qolgan jihatdan esa bir xil.

Inkremental konversiyalar = test guruhi konversiyalari − nazorat guruhi konversiyalari (guruhlar hajmiga tuzatish bilan). Bundan **iROAS** — xarajat birligiga inkremental tushum — va **inkrementallik koeffitsiyenti**, ya’ni atributsiya qilingan konversiyalarning qancha qismi haqiqatan reklama tufayli ekani hisoblanadi.

## 1-usul. Holdout guruh

Auditoriyaning bir qismi tasodifiy ravishda ko‘rsatishlardan chiqariladi.

- **Qachon mos**: sizda o‘z auditoriyangiz bor — mijozlar bazasi, email obunachilari, retargeting auditoriyalari. Ro‘yxatni yuklab, tasodifiy bo‘lasiz.
- **Qanday**: ishga tushirishdan oldin foydalanuvchilarni tasodifiy bo‘ling, nazorat qismini targetingdan chiqaring, xaridlarni kabinet emas, o‘z ma’lumotlaringiz (CRM) bo‘yicha solishtiring.
- **Qiyinchiliklar**: ochiq auditoriyalarda odamlarni o‘zingiz chiqara olmaysiz; nazorat guruhi yetarlicha katta bo‘lishi kerak.

Email va push uchun bu eng oddiy va toza test: hammaga emas, kichik tasodifiy qismini xabarsiz qoldirib yuboring.

## 2-usul. Geo-lift eksperiment

Odamlarni emas, **hududlarni** bo‘lasiz: ba’zi shaharlarda reklama ishlaydi (yoki kuchaytiriladi), boshqalarida — yo‘q.

1. Hududlar bo‘yicha ko‘rinadigan metrikani tanlang: buyurtmalar, tushum, qo‘ng‘iroqlar.
2. Metrika tarixi o‘xshash test va nazorat hududlarini tanlang.
3. Oldindan belgilangan muddatga test hududlarida reklamani yoqing yoki o‘chiring.
4. Haqiqiy natijani **kontrfaktik** natija — nazorat hududlari asosidagi prognoz bilan solishtiring (synthetic control usullari, masalan ochiq GeoLift va CausalImpact kutubxonalari).

Afzalliklari: istalgan kanal, jumladan oflayn va TV uchun ishlaydi, cookie’ga bog‘liq emas. Kamchiliklari: barqaror ma’lumotli yetarlicha hudud kerak. Talab poytaxtda kuchli jamlangan mamlakatlarda hudud juftliklarini tanlash qiyinroq — ba’zan test yetkazib berish zonalari yoki davrlarni almashtirish bo‘yicha qilinadi.

## 3-usul. Platformalarning lift tadqiqotlari

Meta va Google **Conversion Lift** taklif qiladi: platformaning o‘zi auditoriyani tasodifiy bo‘ladi va nazorat guruhiga reklamani ko‘rsatmaydi (yoki shu joyda boshqa reklama beruvchining reklamasini ko‘rsatadi).

- **Afzalliklari**: foydalanuvchilar darajasida haqiqiy randomizatsiya, siz tomondan minimal ish.
- **Kamchiliklari**: mavjudligi byudjet va akkauntga bog‘liq; natijani platforma o‘z ma’lumotlari bo‘yicha o‘lchaydi; bitta test — bitta kanal.

Ulardan foydalaning, lekin natijani buyurtmalar haqidagi o‘z ma’lumotlaringiz bilan solishtiring.

## Testni qanday rejalashtirish

- **Bitta gipoteza**: «hamma reklamamiz ishlaydi» emas, «Meta’dagi retargeting qo‘shimcha savdo beradi».
- **Hajm va davomiylik** oldindan: xarid sikli va kutilgan effektni hisobga olib. Qimmat tovardagi qisqa test kechiktirilgan xaridlarni ushlamaydi.
- **Biznes metrikasi**: kabinet konversiyalari emas, CRM’dagi buyurtmalar va tushum.
- **Barqarorlik**: test davomida narxlar, aksiyalar va boshqa kanallarni test va nazorat guruhlarida turlicha o‘zgartirmang.

## Natijalardan qanday foydalanish

- Real CPA va ROAS olish uchun kanalning atributsiya qilingan konversiyalarini **inkrementallik koeffitsiyentiga** ko‘paytiring.
- Inkrementallik past bo‘lgan joyda (ko‘pincha brend va keng retargeting) byudjetni qisqartiring va pulni jalb qilish kanallariga o‘tkazishni test qiling.
- Testlarni takrorlang: samara mavsum, kreativlar va byudjet hajmi bilan o‘zgaradi.

## FAQ

### Test uchun byudjet qanchalik katta bo‘lishi kerak?

Aniq chegara yo‘q. U konversiyalar soni, kutilgan effekt hajmi va ma’lumotlardagi shovqinga bog‘liq. Konversiyalar kam bo‘lsa, effekt tasodifiy tebranishlarda yo‘qolib ketadi — unda byudjetning kattaroq o‘zgarishlari yoki uzoqroq davr test qilinadi.

### Reklamani bir haftaga o‘chirib, qarab tursa bo‘ladimi?

Bu o‘lchov emas, ishora beradi: o‘sha haftaga mavsum, raqobatchilar va bayramlar ta’sir qilishi mumkin. Shu davrni o‘zgarishsiz o‘tkazadigan nazorat guruhi yoki hudud kerak.

### Inkrementallik atributsiyaning o‘rnini bosadimi?

Yo‘q, ular bir-birini to‘ldiradi. Atributsiya kanal ichidagi kundalik qarorlar uchun, inkrementallik testlari esa uni kalibrlash va byudjetni kanallar o‘rtasida taqsimlash uchun kerak.
