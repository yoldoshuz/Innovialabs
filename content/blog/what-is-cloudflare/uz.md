---
title: Cloudflare nima va u saytingizga nima beradi
description: Cloudflare oddiy tilda: DNS, proksi, CDN, SSL va hujumlardan himoya, bepul tarifga nimalar kiradi va trafik Cloudflare orqali o‘tganda nima o‘zgaradi.
summary: Cloudflare — tashrif buyuruvchilar va serveringiz o‘rtasida turadigan tarmoq: DNS’ga xizmat qiladi, statikani keshlaydi, SSL beradi va hujumlarning bir qismini to‘sadi. Asosiy imkoniyatlar bepul, lekin ulangandan keyin SSL va serverni to‘g‘ri sozlash kerak.
---

## Bu nima

**Cloudflare** — saytingiz trafigi o‘tadigan global data-markazlar tarmog‘i. Brauzer serveringizga to‘g‘ridan-to‘g‘ri murojaat qilish o‘rniga eng yaqin Cloudflare tuguniga tushadi, u esa qaror qiladi: javobni keshdan berish, shubhali so‘rovni bloklash yoki uni serveringizga (u **origin** deb ataladi) uzatish.

Ulanish odatda shunday bo‘ladi: domenni Cloudflare’ga qo‘shasiz va registratorda NS-serverlarni Cloudflare bergan serverlarga almashtirasiz. Shu paytdan boshlab domeningiz DNS’iga Cloudflare xizmat qiladi.

## Cloudflare’ning beshta vazifasi

- **DNS.** Qulay panelga ega tezkor avtoritativ DNS. Yozuvlar tez yangilanadi, DNS esa proksisiz ham ishlaydi.
- **Proksi.** Proksi yoqilgan yozuvlar (to‘q sariq bulut) uchun DNS serveringiz emas, Cloudflare IP-manzillarini qaytaradi. Origin’ning haqiqiy manzili yashirin qoladi.
- **CDN.** Statik fayllar — rasmlar, CSS, JS — tarmoq tugunlarida keshlanadi va tashrif buyuruvchiga eng yaqin tugundan beriladi. Serverga yuklama kamayadi.
- **SSL.** Cloudflare domen uchun sertifikatni avtomatik chiqaradi va sayt qo‘shimcha sozlashsiz HTTPS orqali ochiladi.
- **Himoya.** DDoS hujumlarini filtrlash, firewall’ning asosiy qoidalari, botlardan himoya va so‘rovlar chastotasini cheklash.

## Bepul tarifga nimalar kiradi

Ko‘plab kichik va o‘rta saytlar uchun bepul tarif yetarli. Unda quyidagilar bor:

- DNS-hosting;
- proksi va CDN;
- domen uchun bepul SSL-sertifikat;
- DDoS’dan himoya;
- xavfsizlik va keshlashning asosiy qoidalari, trafik analitikasi.

Pullik tariflar kengaytirilgan WAF, ko‘proq qoidalar, rasmlarni moslashuvchan optimallashtirish, ustuvor qo‘llab-quvvatlash va kafolatlarni qo‘shadi. Aniq tarkib o‘zgarib turadi — tariflar sahifasini tekshiring.

## Ulangandan keyin nima o‘zgaradi

Bu eng muhim qism: muammolarning ko‘pchiligi aynan shu yerda paydo bo‘ladi.

**1. SSL rejimi.** Tashrif buyuruvchi va Cloudflare o‘rtasida doim HTTPS bo‘ladi, Cloudflare va serveringiz o‘rtasida esa rejimga bog‘liq:

| Rejim | Nima sodir bo‘ladi | Qachon mos |
|---|---|---|
| Flexible | Servergacha oddiy HTTP | Deyarli hech qachon, origin’gacha trafik shifrlanmaydi |
| Full | Servergacha HTTPS, sertifikat tekshirilmaydi | Vaqtincha, normal sertifikat bo‘lmaguncha |
| Full (strict) | Sertifikat tekshiriladigan HTTPS | Tavsiya etilgan variant |

Flexible rejimi serverdagi HTTPS’ga yo‘naltirish bilan birga ko‘pincha **cheksiz qayta yo‘naltirish** sikliga olib keladi.

**2. Tashrif buyuruvchilar IP’si.** Server Cloudflare IP-manzillarini ko‘radi. Haqiqiy manzil `CF-Connecting-IP` sarlavhasida keladi. Sozlanmasa, serverdagi loglar, limitlar va geolokatsiya noto‘g‘ri ishlaydi. nginx uchun misol:

```nginx
# set_real_ip_from qatorini cloudflare.com/ips dagi barcha diapazonlar uchun takrorlang
set_real_ip_from 173.245.48.0/20;
real_ip_header CF-Connecting-IP;
```

**3. Hamma narsa proksilanmaydi.** Proksi veb-trafik uchun ishlaydi. Pochta (MX-yozuvlar), SSH va boshqa protokollar to‘g‘ridan-to‘g‘ri o‘tadi, ularning yozuvlari proksisiz qoldiriladi. `mail.example.com` kabi subdomen o‘sha serverga yo‘naltirilgan bo‘lsa, haqiqiy IP’ni oshkor qilishi mumkin.

**4. Kesh.** Odatda statika keshlanadi, HTML esa yo‘q. Deploy’dan keyin eski stillar yoki skriptlarni ko‘rsangiz, paneldan keshni tozalang yoki fayl nomlarida versiyalardan foydalaning.

**5. Serverga to‘g‘ridan-to‘g‘ri kirish.** Agar origin’ga IP orqali to‘g‘ridan-to‘g‘ri kirish mumkin bo‘lsa, hujumchi himoyani chetlab o‘tishi mumkin. Kiruvchi veb-trafikni faqat Cloudflare diapazonlaridan ruxsat berish oqilona.

## Ko‘p uchraydigan xatolar

- Flexible SSL’ni tanlab, qayta yo‘naltirish sikliga tushish.
- Loglar va antifrodda tashrif buyuruvchilarning haqiqiy IP’sini unutish.
- Veb uchun ishlatilmaydigan yozuvni proksilash.
- Serverni hammaga ochiq qoldirib, Cloudflare to‘liq himoya qiladi deb o‘ylash.

## FAQ

### Cloudflare saytimni tezlashtiradimi?

Odatda statika yuklanishini tezlashtiradi, ayniqsa serverdan uzoqdagi tashrif buyuruvchilar uchun. Sekin backend va ma’lumotlar bazasiga og‘ir so‘rovlarni u tuzatmaydi: dinamik sahifalar baribir serveringizda yaratiladi.

### Faqat DNS’dan proksisiz foydalansa bo‘ladimi?

Ha. Kerakli yozuvlarda proksini o‘chiring (kulrang bulut) — Cloudflare bu yozuvlar uchun CDN va himoyasiz oddiy DNS-provayder sifatida ishlaydi.

### DNS ko‘chirilgandan keyin pochta buzilmaydimi?

Barcha yozuvlarni — MX, SPF, DKIM, DMARC — ko‘chirsangiz, buzilmaydi. Cloudflare ulanishda mavjud yozuvlarni import qilishga harakat qiladi, lekin NS-serverlarni almashtirishdan oldin ularni qo‘lda tekshirib chiqing.
