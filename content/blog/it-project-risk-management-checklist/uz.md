---
title: IT loyiha xavflarini boshqarish: buyurtmachi uchun chek-list
description: IT loyihaning odatiy xavflari — odamlar, ish hajmi, texnologiya, integratsiyalar va muddatlar — hamda buyurtmachi uchun oddiy xavflar reyestri.
summary: Xavflarni beshta guruhga ajrating (odamlar, hajm, texnologiya, integratsiyalar, muddatlar), har birining ehtimoli va ta’sirini baholang, mas’ul va harakatni belgilang hamda ro‘yxatni har bir uchrashuvda qayta ko‘rib chiqing.
---

## Asosiy gap

Xavflarni boshqarish — qalin hujjat emas, balki **nima noto‘g‘ri ketishi mumkinligi haqidagi qisqa ro‘yxat** va «bu sodir bo‘lmasligi uchun nima qilyapmiz» degan savolga aniq javob. Buyurtmachi kodni tushunishi shart emas: odatiy xavflarni bilish, oddiy reyestr yuritish va uni jamoa bilan muntazam yangilab borish kifoya.

## Xavflarning beshta guruhi

### Odamlar

- Asosiy dasturchi ketadi va bilim ham u bilan ketadi.
- Buyurtmachi tomonida tez qaror qabul qiladigan odam yo‘q.
- Jamoa parallel loyihalar bilan band.

**Nima qilish kerak:** bilim bir kishining boshida qolmasligi uchun hujjatlar va code review; biznes tomonidan qaror qabul qilish huquqiga ega bitta mas’ul.

### Ish hajmi

- Talablar jarayonda o‘zgaradi va loyiha «kengayib» ketadi.
- Ishtirokchilar vazifani turlicha tushunadi.

**Nima qilish kerak:** birinchi versiya hajmini qayd eting, yangi g‘oyalarni bekklogga yozing, har bir o‘zgarishni alohida baholang.

### Texnologiya

- Jamoa yaxshi bilmaydigan stek tanlangan.
- Yuklama, xavfsizlik yoki bekaplar o‘ylab chiqilmagan.

**Nima qilish kerak:** xavfli qismlar uchun kichik texnik prototip, asosiy ishlab chiqishdan oldin arxitektura tekshiruvi.

### Integratsiyalar

- Tashqi servis (to‘lov tizimi, 1C, CRM, davlat servisi) hujjatlarida yozilganidek ishlamaydi.
- Hamkorning test muhitiga kirish kech beriladi.

**Nima qilish kerak:** kirish huquqlarini birinchi haftadayoq so‘rang, integratsiyalarni oxiriga qoldirmay, erta boshlang.

### Muddatlar

- Baho zaxirasiz bitta raqam bilan berilgan.
- Testlash va xatolarni tuzatish rejaga kiritilmagan.

**Nima qilish kerak:** bahoni oraliq ko‘rinishida so‘rang, testlash uchun vaqt ajrating, loyihani oraliq demolar bilan bosqichlarga bo‘ling.

## Oddiy xavflar reyestri

Oddiy jadval yetarli. Ehtimol va ta’sirni «past / o‘rta / yuqori» shkalasida baholang.

| Xavf | Ehtimol | Ta’sir | Harakat | Mas’ul |
|---|---|---|---|---|
| Bank API’siga kirish kechikishi | O‘rta | Yuqori | Birinchi haftada so‘rash | Buyurtmachi menejeri |
| Yetakchi dasturchining ketishi | Past | Yuqori | Hujjatlar, kod tekshiruvi | Tex lid |
| Ish hajmining o‘sishi | Yuqori | O‘rta | Bekklog va har o‘zgarishni baholash | Mahsulot egasi |

**Ta’siri yuqori** bo‘lgan xavflardan boshlang: aynan ular loyihani to‘xtatib qo‘yishi mumkin.

## Buyurtmachi chek-listi

- Loyiha bo‘yicha qaror qabul qiladigan bitta odam tayinlangan.
- Birinchi versiya hajmi yozilgan va kelishilgan.
- Barcha tashqi servislarga kirish so‘ralgan.
- Kod sizning repozitoriyingizda saqlanadi.
- Faqat hisobotlar emas, ishlaydigan mahsulotning muntazam demolari bor.
- Xavflar reyestri kamida bir-ikki haftada bir qayta ko‘riladi.
- Asosiy muddat buzilgan holat uchun reja bor.

## Keng tarqalgan xatolar

- Reyestrni bir marta tuzib, unga boshqa qaytmaslik.
- Xavflarni aniq harakat va mas’ulsiz yozish.
- Xavflarni faqat pudratchining vazifasi deb hisoblash.

## FAQ

### Xavflar reyestrini kim yuritishi kerak — buyurtmachimi yoki pudratchimi?

Odatda uni pudratchi tomonidagi loyiha menejeri yuritadi, lekin buyurtmachi muhokamada qatnashadi: ko‘p xavflar (qarorlar, kirish huquqlari, talablar) uning tomonida bo‘ladi.

### Xavflarni qanchalik tez-tez qayta ko‘rish kerak?

Buni muntazam loyiha uchrashuvlarida qilish qulay. Eng muhimi — har bir sezilarli o‘zgarishda ro‘yxatni yangilash: yangi talablar, odamlar almashishi yoki muddat siljishi.

### Kichik loyihaga xavflar reyestri kerakmi?

Ha, soddalashtirilgan ko‘rinishda: jadvalda besh-o‘n qator. Hatto shunday ro‘yxat ham muammoni ishga tushirish kunida emas, oldindan ko‘rishga yordam beradi.
