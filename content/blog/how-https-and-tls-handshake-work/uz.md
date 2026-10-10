---
title: HTTPS qanday ishlaydi: TLS handshake, sertifikatlar va kalitlar
description: HTTPS’da brauzer va server o‘rtasida nima sodir bo‘lishini bosqichma-bosqich ko‘rib chiqamiz: TLS handshake, sertifikatlar zanjiri va sessiya kalitlari.
summary: HTTPS — TLS tunneli ichidagi oddiy HTTP: handshake paytida server sertifikat orqali o‘zini tasdiqlaydi, tomonlar yangi sessiya kalitlarini kelishib oladi va shundan keyin butun trafik shifrlanadi hamda o‘zgartirishdan himoyalanadi.
---

## Qisqacha javob

**HTTPS = HTTP + TLS.** Brauzer so‘rovning birinchi baytini yuborishidan oldin server bilan qisqa muzokara o‘tkazadi — bu **TLS handshake** deyiladi. Uning uchta vazifasi bor:

1. **Autentifikatsiya** — server sertifikat yordamida domen haqiqatan unga tegishli ekanini isbotlaydi.
2. **Kalit almashinuvi** — brauzer va server tarmoqni kuzatayotgan hech kim hisoblay olmaydigan umumiy sirni kelishib oladi.
3. **Sessiya kalitlari** — shu sirdan ikkala tomon simmetrik kalitlarni chiqaradi va ular har bir so‘rov va javobni shifrlaydi hamda himoyalaydi.

Shundan so‘ng odatiy HTTP trafik shifrlangan kanal ichida yuradi.

## Handshake bosqichma-bosqich (TLS 1.3)

TLS 1.3 — protokolning amaldagi versiyasi, ma’lumot uzatishdan oldin unga bor-yo‘g‘i bitta «so‘rov-javob» aylanishi kerak.

1. **ClientHello.** Brauzer qo‘llab-quvvatlanadigan TLS versiyalari va shifr to‘plamlarini, tasodifiy sonni, kerakli domenni (**SNI** maydoni) hamda **key share** — Diffie-Hellman almashinuvining o‘z yarmini yuboradi.
2. **ServerHello.** Server versiya va shifrni tanlaydi va o‘z yarmini yuboradi. Shu paytdan ikkala tomon bir xil umumiy sirni hisoblay oladi, bundan keyingi hamma narsa shifrlanadi.
3. **Certificate va CertificateVerify.** Server sertifikatlar zanjirini yuboradi va handshake tarixini yopiq kaliti bilan imzolaydi. Shu bilan sertifikatga mos kalit unda ekanini isbotlaydi.
4. **Finished.** Tomonlar butun handshake’ning nazorat summasini almashadi. Agar kimdir yo‘lda xabarni o‘zgartirgan bo‘lsa, summalar mos kelmaydi va ulanish uziladi.
5. **Ilova ma’lumotlari.** Brauzer sessiya kalitlari bilan shifrlangan HTTP so‘rovning o‘zini yuboradi.

Eski **TLS 1.2** ham shu mantiqda ishlaydi, lekin ikki aylanishni talab qiladi va zaifroq variantlarga ruxsat beradi, shuning uchun zamonaviy sozlamalar 1.3 ni afzal ko‘radi.

## Sertifikatlar zanjiri qanday tekshiriladi

Sertifikat domen nomini ochiq kalit bilan bog‘laydi va **sertifikatlash markazi (CA)** tomonidan imzolanadi. Brauzer server sertifikatiga to‘g‘ridan-to‘g‘ri ishonmaydi, balki zanjir bo‘ylab yuradi:

| Daraja | Qayerda turadi | Brauzer nimani tekshiradi |
|---|---|---|
| **Yakuniy sertifikat** | Sizning serveringizda | Domen Subject Alternative Name bilan mos, muddati o‘tmagan |
| **Oraliq CA** | Server uni yakuniy sertifikat bilan birga yuboradi | Uning yakuniy sertifikatdagi imzosi to‘g‘ri |
| **Ildiz CA** | OT yoki brauzerning ishonch omboriga o‘rnatilgan | Uning oraliq sertifikatdagi imzosi to‘g‘ri |

Zanjirning biror bo‘g‘ini yo‘q yoki noto‘g‘ri bo‘lsa — sertifikat muddati o‘tgan, domen boshqa, oraliq sertifikat yuborilmagan, ildiz noma’lum — brauzer sayt o‘rniga butun ekranli ogohlantirish ko‘rsatadi.

## Nega ikki xil kalit kerak

- **Asimmetrik kalitlar** (sertifikatdagi ochiq kalit va serverdagi yopiq kalit) sekin ishlaydi va faqat haqiqiylikni tasdiqlash uchun ishlatiladi.
- **Efemer Diffie-Hellman kalitlari** har bir ulanish uchun yangidan yaratiladi va keyin yo‘q qilinadi. Bu **forward secrecy** beradi: server yopiq kaliti keyinroq sizib chiqsa ham, yozib olingan eski trafikni ochib bo‘lmaydi.
- **Simmetrik sessiya kalitlari** (masalan, AES-GCM yoki ChaCha20-Poly1305) tez ishlaydi va asosiy oqimni shifrlaydi. Har bir ma’lumot qismiga haqiqiylik belgisini qo‘shadi, shuning uchun o‘zgartirish aniqlanadi.

## HTTPS nimani himoya qiladi va nimani yo‘q

**Himoyalangan:**

- Sahifalar mazmuni, formalar, cookie’lar, sarlavhalar hamda URL yo‘li va parametrlari.
- Yaxlitlik: tarmoqdagi hech kim sezdirmasdan reklama yoki skript qo‘sha olmaydi, yuklanayotgan faylni almashtira olmaydi.
- Server haqiqiyligi: siz shu domen uchun amaldagi sertifikat egasi bilan muloqot qilyapsiz.

**Himoyalanmagan:**

- **Domen nomi** odatda SNI va DNS so‘rovlari orqali ko‘rinadi, IP manzillar esa doim ko‘rinadi.
- Ma’lumotlar **hajmi va vaqti** hali ham ma’lum qonuniyatlarni oshkor qilishi mumkin.
- HTTPS saytning **halolligi** haqida hech narsa demaydi: fishing saytlar ham sertifikat oladi.
- U ma’lumotlarni **serverda** yoki zararlangan qurilmada himoya qilmaydi — faqat uzatish paytida.

## Ko‘p uchraydigan xatolar

- Server yakuniy sertifikatni oraliqsiz yuboradi: ba’zi brauzerlar uddalaydi, boshqalari yo‘q.
- Sertifikatlarni yangilash esdan chiqadi — buni avtomatlashtirish kerak.
- HTTPS sahifaga HTTP resurslar (rasmlar, skriptlar) ulangan.
- Protokolning eski versiyalari «moslik uchun» yoqilgan holda qoldirilgan.

## FAQ

### Manzil satridagi qulf belgisi sayt xavfsiz ekanini bildiradimi?

U ulanish shifrlanganini va serverda shu domen uchun amaldagi sertifikat borligini bildiradi. Sayt egasining halolligini kafolatlamaydi, shuning uchun domen nomini baribir diqqat bilan tekshiring.

### HTTPS HTTP’dan sekinroq ishlaydimi?

Handshake birinchi ulanishda biroz kechikish qo‘shadi, lekin TLS 1.3, sessiyani tiklash va HTTP/2 yoki HTTP/3 (brauzerlar ularni faqat shifrlash ustida qo‘llab-quvvatlaydi) amalda HTTPS saytlarni odatda sekinroq emas, hatto tezroq qiladi.

### Provayder HTTPS orqali qaysi sahifalarni ochayotganimni ko‘radimi?

Odatda u siz ulanayotgan domenni ko‘radi, lekin aniq sahifalar, qidiruv so‘rovlari yoki formalar mazmunini ko‘rmaydi.
