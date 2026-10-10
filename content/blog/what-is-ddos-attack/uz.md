---
title: DDoS-hujum nima va u saytlarni qanday ishdan chiqaradi
description: DDoS oddiy tilda: hajmli, protokol va L7 hujumlar, botnetlar, hujumni tashrifchilar oqimidan qanday ajratish va saytning to‘xtab qolishi narxi nimadan iborat.
summary: DDoS-hujum — minglab zararlangan qurilmalardan keladigan so‘rovlar oqimi bo‘lib, u kanalni, tarmoq uskunasini yoki ilovaning o‘zini to‘ldirib qo‘yadi va sayt haqiqiy foydalanuvchilarga javob bermay qo‘yadi. Himoya — trafikni serverga yetmasdan filtrlash: CDN, anti-DDoS va so‘rovlar chastotasini cheklash.
---

## DDoS nima

**DDoS (Distributed Denial of Service)** — bir vaqtning o‘zida ko‘plab manbalardan amalga oshiriladigan «xizmat ko‘rsatishni rad etish» hujumi. Maqsad ma’lumot o‘g‘irlash emas, balki **servisni ishlamaydigan qilish**: sayt ochilmaydi, ilova javob bermaydi, to‘lov o‘tmaydi.

Oddiy DoS bitta manzildan keladi va uni bloklash oson. Taqsimlangan hujumni butun dunyodagi minglab qurilmalar olib boradi, shuning uchun IP bo‘yicha oddiy ban yordam bermaydi.

## Hujumlarning uch turi

| Tur | Nimani to‘ldiradi | Qanday o‘lchanadi | Misollar |
|---|---|---|---|
| **Hajmli (volumetric)** | serverga boradigan internet kanali | sekundiga bitlar | UDP-flud, DNS, NTP orqali amplifikatsiya |
| **Protokol** | serverlar, firewall’lar, balansirovkachilardagi ulanishlar jadvali | sekundiga paketlar | SYN-flud, fragmentlangan paketlar |
| **Amaliy (L7)** | ilovaning o‘zi: CPU, baza, worker’lar | sekundiga so‘rovlar | qidiruv, login, savatga HTTP-flud |

### Hajmli hujumlar

Hujumchi kanal o‘tkaza oladiganidan ko‘proq keraksiz trafik yuboradi. Ko‘pincha **amplifikatsiya** ishlatiladi: qurbon manzili soxtalashtirilgan holda ochiq DNS yoki NTP serverga yuborilgan kichik so‘rov katta javobni keltirib chiqaradi va u qurbonga boradi. Serveringiz ideal sozlangan bo‘lishi mumkin — trafik shunchaki yetib kelmaydi.

### Protokol hujumlari

Bu yerda maqsad — har bir ulanishga sarflanadigan resurslarni tugatish. **SYN-flud**da server ulanish ochishga juda ko‘p so‘rov oladi, har biriga xotira ajratadi va hech qachon kelmaydigan javobni kutadi. Jadval to‘ladi va yangi foydalanuvchilar ulana olmaydi.

### Amaliy hujumlar (L7)

Eng ayyorlari. So‘rovlar oddiydek ko‘rinadi: `GET /search?q=...` yoki kirishga urinishlar. Tarmoq o‘lchovida ular ko‘p bo‘lmasligi mumkin, lekin har biri ilovani ishlashga majbur qiladi — bazaga murojaat qilish, sahifani render qilish. Agar keshsiz qidiruv uzoq bajarilsa, saytni yiqitish uchun nisbatan kichik oqim ham yetadi.

## Botnetlar qayerdan paydo bo‘ladi

**Botnet** — hujumchi boshqaradigan zararlangan qurilmalar tarmog‘i: routerlar, IP-kameralar, zavod parollari qolgan aqlli qurilmalar, buzilgan serverlar va kompyuterlar. Egalari odatda hech narsani sezmaydi. Botnet quvvatlari ijaraga beriladi, shuning uchun hujumni texnik bilimi yo‘q odam ham buyurtma qila oladi — raqobatchi, tovlamachi yoki xafa bo‘lgan foydalanuvchi.

## Hujummi yoki tashrifchilar oqimimi

Trafikning keskin o‘sishi reklama, rassilka yoki OAV’dagi eslatmadan ham bo‘ladi. Ularni ajratishga yordam beradigan belgilar:

| Belgi | Haqiqiy oqim | Hujum |
|---|---|---|
| Sabab | bor: ishga tushirish, rassilka, post | aniq sabab yo‘q |
| Sahifalar | turli xil, mantiqiy ketma-ketlikda | bitta-ikkita, ko‘pincha «og‘ir» sahifalar |
| Xatti-harakat | rasmlar, CSS, JS yuklanadi | faqat HTML yoki bitta endpoint |
| Manbalar | odatiy mamlakatlaringiz va provayderlar | g‘ayrioddiy mamlakatlar, xostinglar, bir xil tarmoqlar |
| User-Agent va Referer | xilma-xil | bir xil, bo‘sh yoki g‘alati |
| Konversiya | trafik bilan birga o‘sadi | o‘zgarmaydi yoki tushadi |

Veb-server loglari, analitika va CDN metrikalarini birga ko‘ring. JavaScript’dagi analitika ko‘pincha botlarni umuman ko‘rmaydi, shuning uchun «analitikada jimjitlik, server esa yotibdi» ham signal.

## To‘xtab qolish qanchaga tushadi

Aniq raqam har bir biznesda o‘zgacha. U bir nechta omillardan tashkil topadi:

- **To‘g‘ridan-to‘g‘ri yo‘qotishlar** — sayt ishlamay turganda amalga oshmagan buyurtmalar va arizalar.
- **Behuda ketgan reklama** — kampaniyalar byudjetni sarflashda va odamlarni ishlamaydigan sahifaga olib kelishda davom etadi.
- **Jamoaga yuklama** — qo‘llab-quvvatlash xizmati shikoyatlarni ko‘rib chiqadi, dasturchilar rejadagi vazifalarni tashlab qo‘yadi.
- Agar siz B2B-servis bo‘lsangiz, mijozlaringiz oldida **SLA bo‘yicha jarimalar**.
- **Obro‘** — to‘lov qila olmagan foydalanuvchi raqobatchiga butunlay o‘tib ketishi mumkin.
- **SEO** — uzoq yoki tez-tez ishlamay qolishda qidiruv robotlari xatolarga duch keladi.

Ba’zan DDoS — **chalg‘ituvchi manevr**: jamoa yuklama bilan kurashayotganda buzib kirishga urinish bo‘ladi. Yana bir ssenariy — tovlamachilik: «to‘lang, aks holda hujum davom etadi».

## Umumiy tarzda qanday himoyalanadi

- Trafikni serveringizga yetmasdan filtrlaydigan **CDN yoki anti-DDoS servisini** ulang va origin’ning haqiqiy IP manzilini yashiring.
- Login, qidiruv, formalar va API uchun **rate limiting** sozlang.
- Og‘ir sahifalar har bir so‘rovda bazaga murojaat qilmasligi uchun iloji boricha hammasini **keshlang**.
- Hujum paytida xosting nima qilishini oldindan bilib oling va harakatlar rejasini tayyorlang.

Avtomasshtablash cho‘qqidan o‘tishga yordam beradi, lekin hujum paytida infratuzilma uchun katta hisobga aylanishi mumkin, shuning uchun limitlar qo‘ying.

## FAQ

### DDoS’dan faqat serverdagi firewall bilan himoyalansa bo‘ladimi?

Faqat kichik hujumlardan. Hajmli hujum serverga boradigan kanalni to‘ldiradi va undagi firewall biror narsani filtrlashga imkon ham topmaydi. Provayder yoki CDN tomonida filtrlash kerak.

### DDoS saytni buzadimi yoki ma’lumotlarni o‘g‘irlaydimi?

O‘z-o‘zidan yo‘q: hujum davom etayotgan paytda u servisni ishlamaydigan qiladi. Lekin undan parallel buzib kirish uchun niqob sifatida foydalanish mumkin, shuning uchun hujum paytida loglarga diqqat bilan qarang.

### Saytga hujum bo‘layotganini xosting shunchaki sekin ishlashidan qanday ajratish mumkin?

Server metrikalari va loglarni solishtiring: hujumda so‘rovlar va ulanishlar soni oshadi, bir xil manbalar va URL’lar paydo bo‘ladi. Agar trafik odatiy bo‘lib, server baribir sekin bo‘lsa, muammo ko‘proq infratuzilma yoki kodda.
