---
title: IaaS, PaaS va SaaS: bulut modellari tushunarli misollarda
description: IaaS, PaaS va SaaS modellari: kim nimaga javob beradi, qaysi mahsulotlar ularga tegishli va tanlov xarajat hamda jamoa yukiga qanday ta’sir qiladi.
summary: IaaS o‘zingiz sozlaydigan virtual jihozni beradi, PaaS kodni shunchaki yuklaydigan tayyor platformani, SaaS esa brauzer orqali foydalaniladigan tayyor dasturni beradi.
---
## Qisqa javob

Uchta model **provayder ishning qaysi qismini o‘z zimmasiga olishi** va qaysi qismini sizga qoldirishi bilan farq qiladi. Qulay o‘xshatish — ovqat:

- **IaaS** — plita va idishlari bor oshxonani ijaraga olasiz, lekin ovqatni o‘zingiz pishirasiz.
- **PaaS** — sizga yordamchi oshpazi bilan tayyor oshxona beriladi: retseptni olib kelasiz, qolganini ular qiladi.
- **SaaS** — restoranga borib, shunchaki taom buyurtma qilasiz.

## Kim nimaga javob beradi

| Daraja | O‘z serveringiz | IaaS | PaaS | SaaS |
|---|---|---|---|---|
| Ma’lumotlar va kirish huquqlari | Siz | Siz | Siz | Siz |
| Ilova (kod) | Siz | Siz | Siz | Provayder |
| Ishga tushirish muhiti, kutubxonalar | Siz | Siz | Provayder | Provayder |
| Operatsion tizim | Siz | Siz | Provayder | Provayder |
| Virtualizatsiya, tarmoq, xotira | Siz | Provayder | Provayder | Provayder |
| Jismoniy serverlar, data-markaz | Siz | Provayder | Provayder | Provayder |

Birinchi qatorga e’tibor bering: **o‘z ma’lumotlaringiz va kirish huquqlari uchun har doim siz javobgarsiz**, istalgan modelda. Bu taqsimlangan mas’uliyat modeli deb ataladi.

## IaaS: xizmat sifatidagi infratuzilma

Siz virtual mashinalar, disklar, tarmoqlar va balanslovchilarni olasiz. OT’ni o‘rnatasiz, muhitni sozlaysiz, ilovani deploy qilasiz va barchasini o‘zingiz qo‘llab-quvvatlaysiz.

**Misollar:** Amazon EC2, Google Compute Engine, Azure Virtual Machines, shuningdek hosting provayderlardagi VPS.

**Qachon tanlash kerak:**

- muhit va tarmoq ustidan to‘liq nazorat kerak bo‘lsa;
- nostandart stek yoki xavfsizlikka maxsus talablar bo‘lsa;
- DevOps muhandisi yoki tizim administratori bo‘lsa.

**Jamoa va byudjetga ta’siri:** eng moslashuvchan model, lekin qo‘l mehnati ham eng ko‘p — yangilanishlar, monitoring, zaxira nusxalar, kengaytirish. Xarajatlar faqat resurslar hisobidan emas, mutaxassislar vaqtidan ham iborat.

## PaaS: xizmat sifatidagi platforma

Siz kodni yuklaysiz, platforma esa muhitni o‘zi yig‘adi, ishga tushiradi, kengaytiradi va yangilaydi. Ko‘pincha PaaS boshqariladigan ma’lumotlar bazalari, navbatlar va loglarni ham o‘z ichiga oladi.

**Misollar:** Heroku, Google App Engine, Azure App Service, AWS Elastic Beanstalk, Vercel, Render.

**Qachon tanlash kerak:**

- serverlar bilan emas, mahsulot bilan shug‘ullanishni xohlaydigan kichik jamoa bo‘lsa;
- stek standart bo‘lsa: Node.js, Python, PHP, Go, Java;
- yangilanishlarni tez chiqarish muhim bo‘lsa.

**Jamoa va byudjetga ta’siri:** administrlash ishi kamroq va ishga tushirish tezroq. Evaziga nazorat kamayadi, platforma cheklovlari va provayderga bog‘lanib qolish (vendor lock-in) xavfi paydo bo‘ladi. Yuklama oshganda PaaS IaaS’dagi shunga o‘xshash infratuzilmadan qimmatroq tushishi mumkin, shuning uchun xarajatlarni vaqti-vaqti bilan qayta ko‘rib chiqing.

## SaaS: xizmat sifatidagi dastur

Brauzer yoki ilova orqali obuna asosida foydalaniladigan tayyor mahsulot. Hech narsani o‘rnatish yoki qo‘llab-quvvatlash shart emas.

**Misollar:** Google Workspace, Microsoft 365, Slack, Notion, Salesforce, amoCRM, Bitrix24’ning bulutli versiyasi.

**Qachon tanlash kerak:**

- vazifa odatiy bo‘lsa: pochta, hujjatlar, CRM, buxgalteriya, vazifalar trekeri;
- tayyor yechim ehtiyojlarni qoplasa, o‘zingiznikini ishlab chiqishning ma’nosi yo‘q.

**Jamoa va byudjetga ta’siri:** minimal texnik ish, oldindan bilinadigan obuna. Cheklovlar — moslashtirish faqat mahsulot ruxsat bergan doirada, ma’lumotlar esa provayderda saqlanadi. Ketishga qaror qilsangiz, ma’lumotlarni eksport qilish mumkinligini albatta tekshiring.

## Modelni qanday tanlash kerak

1. **Odatiy biznes vazifasimi?** Avval SaaS qidiring.
2. **O‘z mahsulotingiz yoki xizmatingiz kerakmi?** Stek standart va jamoa kichik bo‘lsa, PaaS’dan boshlang.
3. **Maxsus sozlamalar, tarmoq nazorati yoki katta yuklamada xarajatlarni optimallashtirish kerakmi?** IaaS’ga o‘ting.

Amalda kompaniyalar modellarni birlashtiradi: CRM — SaaS’da, sayt — PaaS’da, og‘ir ma’lumotlarni qayta ishlash — IaaS’da.

## Ko‘p uchraydigan xatolar

- **Bulutda xavfsizlik provayderning ishi deb hisoblash.** Noto‘g‘ri sozlangan kirish huquqlari — sizning mas’uliyatingiz.
- **Boshqaradigan odam bo‘lmasa ham IaaS’ni tanlash.**
- **SaaS’da allaqachon bor narsani noldan ishlab chiqish** va byudjetni noyob bo‘lmagan funksiyalarga sarflash.
- **PaaS yoki SaaS’dan chiqishni oldindan o‘ylamaslik:** ma’lumotlarni eksport qilish va kodni ko‘chirish.

## FAQ

### Serverless — bu IaaS, PaaS yoki SaaS?

Serverless (masalan, AWS Lambda yoki Google Cloud Functions) odatda PaaS’ning rivoji hisoblanadi: siz funksiyalarni yozasiz, provayder esa ishga tushirish va kengaytirishni to‘liq boshqaradi. Ba’zan u alohida model — FaaS (Function as a Service) deb ajratiladi.

### Keyinchalik PaaS’dan IaaS’ga o‘tsa bo‘ladimi?

Ha, agar ilova platformaning o‘ziga xos xizmatlariga qattiq bog‘lanmagan bo‘lsa. Konteynerlar va standart ma’lumotlar bazalaridan foydalanish bunday ko‘chishni osonlashtiradi.

### Qaysi model eng arzon?

Universal javob yo‘q. Umumiy egalik qiymatini hisoblash kerak: provayder hisobi va jamoaning qo‘llab-quvvatlashga sarflagan vaqti. Resurslar bo‘yicha arzon IaaS administratorlar ishini hisobga olganda PaaS’dan qimmatroq bo‘lib chiqishi mumkin.
