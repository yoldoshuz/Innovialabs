---
title: DNS qanday ishlaydi: manzilni kiritishdan saytni ochishgacha
description: DNS sayt manzilini IP-ga qanday aylantiradi: rezolver, ildiz, TLD va avtoritativ serverlar, keshlash, TTL va yo‘lda nima buzilishi mumkinligi haqida.
summary: DNS — internetning taqsimlangan ma’lumotnomasi: rezolver ketma-ket ildiz serveridan, zona serveridan va domenning avtoritativ serveridan so‘rab, IP-manzilni oladi va javobni TTL muddatiga keshlaydi.
---
## Qisqa javob

Kompyuterlar **IP-manzillar** orqali muloqot qiladi, odamlar esa **nomlarni** eslab qoladi. **DNS (Domain Name System)** — `example.uz` kabi nomni server IP-manziliga aylantiradigan tizim. Bu bitta baza emas, balki **serverlarning taqsimlangan ierarxiyasi**: har biri faqat o‘z qismini biladi va keyingi qayerdan so‘rash kerakligini ko‘rsatadi.

## Nomni aniqlash zanjiri bosqichma-bosqich

Aytaylik, siz `www.example.uz` ni birinchi marta ochyapsiz.

1. **Mahalliy kesh.** Brauzer va operatsion tizim manzilni allaqachon bilish-bilmasligini tekshiradi. Bilsa, so‘rov shu yerda tugaydi.
2. **Rekursiv rezolver.** Bilmasa, so‘rov rezolverga yuboriladi — odatda internet provayderingizniki yoki `1.1.1.1` va `8.8.8.8` kabi ommaviy rezolver. Rezolver butun qidiruvni bajarib, tayyor javob qaytaradi.
3. **Ildiz serveri.** Rezolver ildiz serverlaridan biridan so‘raydi: «`.uz` ni qayerdan qidirish kerak?» Ildiz sayt IP-sini bilmaydi, lekin `.uz` zonasiga xizmat ko‘rsatadigan serverlarni aytadi.
4. **Zona serveri (TLD).** Rezolver `.uz` serveridan so‘raydi: «`example.uz` uchun kim javobgar?» U domenning **NS-serverlari** ro‘yxatini qaytaradi — registratorda ko‘rsatilganlarini.
5. **Avtoritativ server.** Rezolver domenning NS-serveriga murojaat qiladi va u yakuniy javobni beradi: `www.example.uz` ning IP-manzili.
6. **Keshlash va javob.** Rezolver javobni o‘zida saqlaydi va brauzerga uzatadi. Brauzer serverga IP orqali ulanadi.

Odatda butun zanjir millisekundlarni oladi, takroriy so‘rovlar esa kesh tufayli yanada tezroq.

## DNS yozuvlarining asosiy turlari

| Yozuv | Nima uchun |
|---|---|
| **A** | Nomni IPv4-manzil bilan bog‘laydi |
| **AAAA** | Nomni IPv6-manzil bilan bog‘laydi |
| **CNAME** | Nomni boshqa nomning taxallusiga aylantiradi |
| **MX** | Domenning pochta serverlarini ko‘rsatadi |
| **TXT** | Matnli ma’lumotlar: SPF, DKIM, domen egaligini tasdiqlash |
| **NS** | Domenning avtoritativ serverlarini ko‘rsatadi |

## Keshlash va TTL

Har bir yozuvning **TTL (time to live)** qiymati bor — rezolverlar javobni qayta so‘ramasdan necha soniya saqlashi mumkinligi. Masalan, TTL `3600` — bu bir soat.

- **Katta TTL** yuklamani kamaytiradi va takroriy so‘rovlarni tezlashtiradi, lekin o‘zgarishlar foydalanuvchilarga sekinroq yetib boradi.
- **Kichik TTL** tez almashtirish imkonini beradi, lekin so‘rovlar sonini oshiradi.

Amaliy maslahat: **yangi serverga ko‘chishdan oldin kerakli yozuvlarning TTL qiymatini oldindan kamaytiring**, eski TTL tugashini kuting, so‘ng IP-ni o‘zgartiring. Ko‘chgandan keyin TTL’ni qaytarish mumkin.

«DNS tarqalishi» deb ataladigan narsa — aslida butun dunyo bo‘ylab keshlangan eski javoblar muddati tugashini kutish.

## DNS’ni o‘zingiz qanday tekshirasiz

`dig` (Linux, macOS) va `nslookup` (Windows’da ham bor) utilitalari DNS nima javob berayotganini ko‘rsatadi:

```bash
# Domenning A-yozuvi
dig example.uz A +short

# Pochta serverlari
dig example.uz MX +short

# Ildizdan boshlab butun zanjirni o‘tish
dig www.example.uz +trace
```

```bash
nslookup example.uz
```

## Yo‘lda nima buzilishi mumkin

- **Registratorda noto‘g‘ri NS.** Yozuvlar bitta DNS-provayderda sozlangan, domen esa boshqasiga delegatsiya qilingan.
- **Yozuvdagi xato** yoki ko‘chgandan keyin yozuv hali ham eski IP’ga yo‘naltirilgan.
- **Ko‘chishda yuqori TTL:** foydalanuvchilarning bir qismi uzoq vaqt eski serverga tushadi.
- **CNAME ziddiyati** — xuddi shu nomdagi boshqa yozuvlar bilan, standart buni taqiqlaydi.
- **Domen muddati tugagan:** reyestr delegatsiyani olib tashlaydi, sayt va pochta ishlamay qoladi.
- **DNSSEC xatolari:** noto‘g‘ri imzolar yoki kalitlar — tekshiruvchi rezolverlar javoblarni rad etadi.
- **Foydalanuvchi provayderidagi rezolver nosozligi:** sizda hammasi ishlaydi, tashrif buyuruvchilarning bir qismida esa yo‘q.
- **Buzilgan pochta:** MX, SPF, DKIM yo‘q yoki noto‘g‘ri — xatlar yetib bormaydi yoki spamga tushadi.

## FAQ

### DNS o‘zgarishlari ishlashi uchun qancha kutish kerak?

Bu eski yozuvlarning TTL qiymatiga bog‘liq: eng yomon holatda o‘zgarishdan oldingi TTL qancha bo‘lsa, shuncha. Registratorda NS-serverlarni almashtirish uzoqroq davom etishi mumkin, chunki zona delegatsiyasi yozuvlarining o‘z TTL’i bor.

### Kompyuterdagi DNS-rezolverni nega almashtirish kerak?

Ommaviy rezolverlar provayderlarnikidan tezroq va barqarorroq bo‘lishi mumkin, ba’zilari so‘rovlarni shifrlashni qo‘llab-quvvatlaydi. Lekin bu saytingizning tashrif buyuruvchilar uchun ishlashiga ta’sir qilmaydi — ularning har biri o‘z rezolveridan foydalanadi.

### DNS’ni registratordan boshqa joyda saqlash mumkinmi?

Ha. Ko‘pchilik tezlik, himoya va qulay boshqaruv uchun DNS’ni alohida provayderga — masalan, Cloudflare yoki bulutli DNS xizmatiga — ko‘chiradi. Buning uchun registratorda yangi provayderning NS-serverlari ko‘rsatiladi.
