---
title: Saytni ishga tushirishdan oldin xavfsizlik chek-listi
description: Sayt ishga tushishidan oldingi xavfsizlik chek-listi: HTTPS, sarlavhalar, admin kirish, standart parollar, debug, backup, yangilanish va monitoring.
summary: Ishga tushirishdan oldin HTTPS va xavfsizlik sarlavhalarini yoqing, admin panelni yoping, standart akkauntlar va debug rejimini olib tashlang, hammasini yangilang, formalarni himoyalang va backuplar tiklanishiga, xatolar sizga yetib borishiga ishonch hosil qiling.
---
## Qisqa javob

Saytlarning ko‘p buzilishlari murakkab hujumsiz amalga oshadi — ochiq qolgan narsadan foydalaniladi: standart parol, unutilgan `.env` fayli, eskirgan plagin, debug sahifasi. Quyidagi ro‘yxatni ishga tushirishdan bir necha kun oldin o‘z noutbukingizda emas, **production serverda** tekshirib chiqing.

## HTTPS

- Amaldagi sertifikat foydalanilayotgan barcha domen va subdomenlarni, jumladan `www`ni qamraydi.
- **Barcha HTTP so‘rovlar doimiy redirect bilan HTTPS’ga yo‘naltiriladi**.
- Sertifikatni avtomatik yangilash sozlangan va tekshirilgan.
- Aralash kontent yo‘q: rasmlar, skriptlar va shriftlar HTTPS orqali yuklanadi.
- Eski protokollar o‘chirilgan, server yoki CDN TLS 1.2 va 1.3 da ishlaydi.

## Xavfsizlik sarlavhalari

Sarlavhalar brauzerga foydalanuvchilarni qanday himoya qilishni aytadi. nginx uchun oqilona boshlang‘ich nuqta:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "DENY" always;
add_header Content-Security-Policy "default-src 'self'; frame-ancestors 'none'" always;
```

Bu misoldagi **Content-Security-Policy** qat’iy va ehtimol analitika, shriftlar yoki vidjetlarni bloklaydi — haqiqatan ishlatayotgan manbalaringizni sanab o‘ting. HSTS’ni faqat barcha subdomenlar HTTPS’da ishlashiga ishonchingiz komil bo‘lganda yoqing.

## Admin panelga kirish

- Admin panel oson topiladigan manzilda emas, yaxshisi faqat VPN yoki IP oq ro‘yxati orqali ochiladi.
- Har bir administrator uchun **ikki bosqichli autentifikatsiya**.
- Har bir xodimning o‘z akkaunti bor, umumiy «admin» login yo‘q.
- Kirishga urinishlar chastotasi cheklangan.
- SSH kalitlar orqali ishlaydi, parol bilan kirish va to‘g‘ridan-to‘g‘ri root kirishi o‘chirilgan.
- Ma’lumotlar bazasi portlari internetdan yopiq.

## Standart akkauntlar va test ma’lumotlari

- CMS, ma’lumotlar bazalari, routerlar va boshqaruv panellaridagi standart parollar o‘zgartirilgan.
- `test@test.com` kabi test foydalanuvchilar va demo-kontent o‘chirilgan.
- API kalitlar va parollar repozitoriyda emas, muhit o‘zgaruvchilari yoki sirlar menejerida saqlanadi; ishlab chiqishda ishlatilgan kalitlar qayta chiqarilgan.

## Debug rejimi va ochiq fayllar

- **Debug o‘chirilgan**: foydalanuvchi stack trace emas, neytral xato sahifasini ko‘radi.
- Bu yo‘llar 404 yoki 403 qaytaradi: `/.git`, `/.env`, backup arxivlari, `phpinfo`, baza dumplari.
- Kataloglar ro‘yxatini ko‘rsatish o‘chirilgan.
- Source map’lar ongli ravishda qaror qilinmagan bo‘lsa, ommaga berilmaydi.
- Server va freymvork versiyalari ko‘rsatilgan bannerlar imkon qadar yashirilgan.

## Yangilanishlar va bog‘liqliklar

- CMS, plaginlar, mavzular, freymvork va server paketlari dolzarb, qo‘llab-quvvatlanadigan versiyalarda.
- Ishlatilmaydigan plaginlar va modullar shunchaki o‘chirib qo‘yilmagan, balki olib tashlangan.
- Bog‘liqliklar auditi (`npm audit`, `composer audit`, `pip-audit` yoki shunga o‘xshash) ma’lum kritik muammolarni ko‘rsatmaydi.
- Ishga tushirishdan keyin xavfsizlik yangilanishlarini o‘rnatish uchun mas’ul shaxs tayinlangan.

## Formalarni himoyalash

- Har bir maydonni **server tomonida validatsiya qilish**; brauzerdagi tekshiruvlar faqat qulaylik uchun.
- Bazaga so‘rovlar satrlarni ulash orqali emas, parametrlar bilan yuboriladi.
- Foydalanuvchi kiritgan ma’lumot chiqarilganda ekranlanadi.
- Ma’lumotlarni o‘zgartiradigan formalarda CSRF himoyasi.
- Aloqa, kirish, ro‘yxatdan o‘tish va parolni tiklash formalarida chastota cheklovi va antispam.
- Fayl yuklash: turi va hajmi serverda tekshiriladi, fayllar veb-ildizdan tashqarida yoki obyekt omborida saqlanadi va hech qachon ishga tushirilmaydi.

## Backuplar

- Ma’lumotlar bazasi **va** yuklangan fayllarning avtomatik backuplari.
- Nusxalar asosiy serverdan alohida saqlanadi.
- **Sinov tariqasida tiklash o‘tkazilgan** — hech kim tiklab ko‘rmagan backup bu shunchaki umid.

## Loglar va monitoring

- Kirish va ilova loglari incidentni tekshirish uchun yetarlicha uzoq saqlanadi.
- Loglarda parollar, tokenlar va to‘liq karta raqamlari yo‘q.
- Ishlash monitoringi tirik odamni ogohlantiradi.
- Ilova xatolari jamoa haqiqatan kuzatadigan vositaga yig‘iladi.
- Admin panelga kirishlar va huquqlar o‘zgarishi loglanadi.

## FAQ

### Bepul sertifikat yetarlimi?

Ha. Let’s Encrypt kabi bepul sertifikatlar pullik sertifikatlar bilan bir xil shifrlashni ta’minlaydi. Pulliklar trafikni himoyalash sifati bilan emas, tekshiruv turi, kafolat va qo‘llab-quvvatlash bilan farq qiladi.

### Ishga tushirishdan oldin WAF kerakmi?

Majburiy emas, lekin sayt oldidagi CDN yoki WAF botlar, parollarni terib ko‘rish va oddiy hujumlarni filtrlashga yordam beradi hamda server IP manzilini yashiradi. Ommaviy saytlar uchun bu yuqoridagi bandlarning o‘rnini bosmaydigan, arzon qo‘shimcha qatlam.

### Ishga tushirish ertaga — eng muhimi nima?

HTTPS, hech qanday standart parol yo‘q, debug o‘chirilgan, `.env` va `.git` yopiq, administratorlar uchun 2FA va ishlaydigan backup. Bu eng ko‘p uchraydigan va eng oson foydalaniladigan teshiklarni yopadi.
