---
title: WAF (veb-ilovalar uchun tarmoqlararo ekran) nima va u sizga kerakmi
description: WAF nimani bloklaydi va nimaga qodir emas, bulutli va ModSecurity kabi self-hosted variantlar, yolg‘on signallar va WAF qachon o‘zini oqlaydi.
summary: WAF — sayt oldida turib HTTP so‘rovlarni tekshiradigan va SQL-in’eksiya, XSS kabi tipik hujumlarni to‘sadigan filtr. U xavfni kamaytiradi, lekin yangilanishlar va xavfsiz kod o‘rnini bosmaydi; asosan formalar, shaxsiy kabinet, to‘lovlar bor yoki ko‘p tashrif buyuriladigan saytlar uchun o‘zini oqlaydi.
---

## Qisqa javob: WAF nima

**WAF (Web Application Firewall)** — ilova darajasida ishlaydigan tarmoqlararo ekran. U foydalanuvchilar va sayt o‘rtasida turadi va HTTP so‘rovlar mazmunini ko‘radi: manzil, parametrlar, sarlavhalar, forma tanasi. So‘rov hujumga o‘xshasa, WAF uni bloklaydi, cheklaydi yoki logga yozadi.

Serverdagi oddiy firewall boshqa vazifani bajaradi: ulanishlarni IP-manzil va port bo‘yicha ruxsat beradi yoki taqiqlaydi, so‘rov ichida nima borligi uni qiziqtirmaydi. WAF esa aynan mazmunni tahlil qiladi — shuning uchun qidiruv maydoniga SQL kiritishga urinishni ko‘ra oladi.

## WAF nimani yaxshi bloklaydi

- **Tipik in’eksiyalar**: SQL-in’eksiya, XSS, parametrlar ichidagi OT buyruqlari.
- **Skanerlar va botlar**: `/wp-admin` yoki `/.env` kabi manzillarni ommaviy tekshirish, ma’lum zararli user-agent’lar.
- **Parollarni tanlash va suiiste’mol**: kirish sahifasi, API va formalarga rate limiting.
- **Ma’lum zaifliklar**: ko‘p servislar **virtual patch** chiqaradi — siz yangilashga ulgurmaguningizcha mashhur CMS’dagi teshikni yopib turadigan qoida.
- **Ilova darajasidagi DDoS** (L7): bulutli WAF odatda DDoS himoyasi bilan birga ishlaydi va so‘rovlar oqimini filtrlay oladi.

## WAF nimaga qodir emas

- **Kodni tuzatmaydi.** Ilova mantig‘idagi xatoni u ko‘rmaydi: masalan, foydalanuvchi URL’dagi `id`ni o‘zgartiradi va birovning buyurtmasini ko‘radi. Bunday so‘rov mutlaqo oddiy ko‘rinadi.
- **Zaif parollar**, kalitlar sizib chiqishi va xodimlarga qaratilgan fishingdan himoya qilmaydi.
- **Yangilanishlar o‘rnini bosmaydi.** Virtual patch — vaqtinchalik chora, CMS va plaginlarni yangilamaslik uchun bahona emas.
- **Trafik aylanib o‘tsa, foydasiz.** Serverning haqiqiy IP-manzili ma’lum bo‘lsa, hujumchi unga to‘g‘ridan to‘g‘ri murojaat qiladi. Serverni faqat WAF’dan keladigan trafikni qabul qiladigan qilib sozlang.
- **Shifrlangan trafikni ochishi kerak.** So‘rovlarni tekshirish uchun WAF TLS’ni shifrdan chiqaradi. Bulutli servislar buni o‘z tomonida qiladi — maxfiy ma’lumotlar bilan ishlaganda buni hisobga oling.

## Bulutli yoki self-hosted

| Mezon | Bulutli WAF | Self-hosted (masalan, ModSecurity) |
|---|---|---|
| Qanday ulanadi | DNS o‘zgaradi, trafik servis orqali o‘tadi | Veb-server moduli yoki alohida proksi |
| Ishga tushirish | Tez, tayyor qoidalar | O‘rnatish va sozlash kerak |
| Xizmat ko‘rsatish | Provayder zimmasida | Qoidalarni yangilash va loglarni tahlil qilish — sizda |
| DDoS himoyasi | Odatda kiritilgan | Serveringiz resurslari bilan cheklangan |
| Ma’lumotlar ustidan nazorat | Trafik provayderda shifrdan chiqariladi | Hammasi infratuzilmangizda qoladi |

**ModSecurity** — ochiq kodli WAF dvigateli, odatda **OWASP Core Rule Set (CRS)** qoidalar to‘plami bilan ishlatiladi. Bu moslashuvchan va bepul variant, lekin tajriba talab qiladi: qoidalarni aniq ilovaga moslash kerak. Qoidalar hujjatlari — [coreruleset.org](https://coreruleset.org/docs/) saytida.

## Yolg‘on signallar

WAF’ning asosiy amaliy muammosi — **false positive**: qonuniy so‘rov hujumga o‘xshab ko‘rinadi. Tipik misollar: admin panelda kod namunasi bor maqola, vizual muharrirdan kelgan HTML, ismlardagi g‘ayrioddiy belgilar.

Biznesga zarar yetkazmasdan joriy etish tartibi:

1. WAF’ni avval **monitoring rejimida** (faqat loglash) yoqing.
2. Bir-ikki hafta loglarni kuzating: qaysi qoidalar oddiy foydalanuvchilarda ishlayapti.
3. Aniq istisnolar qo‘shing — qoidani butunlay o‘chirmasdan, muayyan URL va parametr uchun.
4. Bloklash rejimiga o‘ting va shikoyatlar hamda formalar konversiyasini kuzating.
5. Saytdagi katta o‘zgarishlardan keyin tahlilni takrorlang.

## WAF qachon o‘zini oqlaydi

Ehtimol kerak, agar:

- saytda **shaxsiy kabinet, to‘lovlar, shaxsiy ma’lumot yig‘adigan formalar** bo‘lsa;
- sayt plaginlari doim o‘z vaqtida yangilanmaydigan **mashhur CMS**da ishlasa;
- siz allaqachon botlar, parol tanlash yoki DDoS bilan to‘qnashgan bo‘lsangiz;
- hamkorlar yoki regulyatorlar veb-ilovalarni himoya qilishni talab qilsa.

Formasiz va admin panelsiz statik vizitka sayt uchun keyinga qoldirish mumkin — u yerda HTTPS, yangilanishlar va zaxira nusxalar muhimroq. Biroq DDoS himoyali bazaviy bulutli tarif ko‘pincha bir necha daqiqada ulanadi va kamdan kam xalaqit beradi.

## FAQ

### WAF bo‘lsa, pentest kerakmi?

Ha. WAF tipik hujumlarni to‘sadi, pentest esa filtr o‘tkazib yuboradigan mantiq va konfiguratsiya xatolarini qidiradi. Bu choralar bir-birini to‘ldiradi.

### WAF saytni sekinlashtiradimi?

So‘rovlarni tekshirish kichik kechikish qo‘shadi. Bulutli WAF ko‘pincha CDN bilan birlashgan, shuning uchun keshlash hisobiga sayt hatto tezroq ochilishi mumkin.

### Xostingdagi WAF yetarlimi?

Kichik sayt uchun bu yaxshi boshlang‘ich nuqta. U qaysi rejimda ishlashini, loglarni ko‘rish va istisno qo‘shish mumkinligini aniqlang — busiz yolg‘on signallar bilan ishlash qiyin.
