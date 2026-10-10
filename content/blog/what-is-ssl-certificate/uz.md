---
title: SSL sertifikat nima: DV, OV va EV turlari
description: SSL sertifikat nimani isbotlaydi, DV, OV va EV darajalari qanday farq qiladi, sertifikatlash markazi nima va kompaniya saytiga qaysi sertifikat kerak.
summary: SSL sertifikat sayt domen egasiga tegishli ekanini tasdiqlaydi va HTTPS shifrlashni yoqadi; DV faqat domen ustidan nazoratni, OV va EV esa tashkilotni ham tekshiradi, shifrlash esa uchalasida bir xil, shuning uchun ko‘p saytlarga DV yetarli.
---
## Qisqa javob

**SSL sertifikat** (to‘g‘rirog‘i TLS, lekin SSL nomi o‘rnashib qolgan) — server ulanish paytida brauzerga ko‘rsatadigan raqamli hujjat. U ikki vazifani bajaradi:

- **Haqiqiylikni tasdiqlaydi**: brauzer aynan `example.com` bilan muloqot qilayotganiga, soxta sayt bilan emasligiga ishonch hosil qiladi.
- **Ulanishni shifrlash imkonini beradi**: tashrif buyuruvchi va sayt o‘rtasida uzatiladigan hamma narsa — parollar, formalar, to‘lov ma’lumotlari — yo‘lda o‘qib bo‘lmaydigan bo‘ladi.

Sertifikatsiz sayt HTTP orqali ishlaydi va brauzerlar uni «Xavfsiz emas» deb belgilaydi. Bundan tashqari, brauzerning ko‘plab zamonaviy funksiyalari faqat HTTPS orqali ishlaydi.

## Sertifikatlarni kim beradi

Sertifikatlarni **sertifikatlash markazlari (CA, Certificate Authority)** chiqaradi. Brauzerlar va operatsion tizimlar ishonchli ildiz markazlar ro‘yxatini oldindan saqlaydi. Sayt sertifikati ulardan biri tomonidan imzolangan bo‘lsa (odatda oraliq sertifikat orqali), brauzer unga ishonadi.

O‘zi imzolagan sertifikat texnik jihatdan ham shifrlaydi, ammo brauzer uni tan olmaydi va ogohlantirish ko‘rsatadi. Ommaviy sayt uchun u yaramaydi.

## Tekshiruv darajalari: DV, OV va EV

Turlarning asosiy farqi — markaz sertifikat berishdan oldin **aynan nimani tekshirgani**.

| Tur | Nima tekshiriladi | Qanday beriladi | Tashrif buyuruvchi nimani ko‘radi |
|---|---|---|---|
| **DV** (Domain Validation) | Faqat domen ustidan nazorat | Avtomatik: DNS yozuvi, saytdagi fayl yoki email orqali | Qulf belgisi va HTTPS |
| **OV** (Organization Validation) | Domen + tashkilot mavjudligi | Kompaniya hujjatlarini tekshirish | Qulf; tashkilot ma’lumotlari sertifikat tafsilotlarida |
| **EV** (Extended Validation) | Domen + yuridik shaxsni kengaytirilgan tekshirish | Hujjat va kontaktlarni qat’iyroq tekshirish | Qulf; tashkilot ma’lumotlari sertifikat tafsilotlarida |

Asosiy jihat: **DV, OV va EV’da shifrlash bir xil**. Farq faqat markaz egasi haqida qancha ma’lumotni tasdiqlaganida.

Ilgari EV sertifikatlar manzil satrida kompaniya nomi bilan ko‘zga tashlanadigan yashil qator ko‘rsatardi. Asosiy brauzerlar bundan voz kechdi va hozir oddiy foydalanuvchi uchun DV, OV va EV deyarli bir xil ko‘rinadi.

## Biznesga qaysi sertifikat kerak

Ko‘pchilik saytlar uchun — **DV**:

- lendinglar, korporativ saytlar, bloglar;
- to‘lov to‘lov xizmati orqali o‘tadigan internet-do‘konlar;
- veb-ilovalar va API’lar.

DV’ni bepul olish mumkin — masalan, **Let’s Encrypt**’dan — va avtomatik uzaytirishni sozlash mumkin. Ko‘plab hostinglar, CDN’lar va Vercel yoki Cloudflare kabi platformalar uni sizning ishtirokingizsiz o‘zi chiqaradi.

**OV yoki EV**’ni quyidagi hollarda ko‘rib chiqish mantiqli:

- buni regulyator, hamkor bank yoki shartnoma talab qilsa;
- korporativ yoki B2B integratsiyalar uchun sertifikatda tashkilot haqida tasdiqlangan ma’lumot kerak bo‘lsa.

## Qo‘shimcha variantlar

- **Wildcard** (`*.example.com`) bir darajadagi barcha subdomenlarni qamrab oladi. Subdomenlar ko‘p bo‘lsa qulay.
- **Multi-domain (SAN)** — bir nechta turli domen uchun bitta sertifikat.

Bular tekshiruv darajalari emas, formatlar: wildcard yoki SAN ham DV, ham OV bo‘lishi mumkin.

## Ko‘p uchraydigan xatolar

- **Muddati o‘tgan sertifikat.** Brauzerdagi to‘satdan paydo bo‘ladigan ogohlantirishlarning eng ko‘p sababi. Avtomatik uzaytirish va amal qilish muddati monitoringini sozlang.
- **To‘liq bo‘lmagan zanjir.** Server sertifikatni oraliq sertifikatsiz beradi — ba’zi brauzerlarda hammasi ishlaydi, boshqalarida xato chiqadi.
- **Aralash kontent.** Sahifa HTTPS orqali ochilgan, lekin rasmlar yoki skriptlar HTTP orqali yuklanadi. Brauzer ularni bloklaydi yoki qulf belgisini olib tashlaydi.
- **HTTP’dan HTTPS’ga yo‘naltirish yo‘q.** Tashrif buyuruvchilarning bir qismi himoyalanmagan versiyaga kirishda davom etadi.
- **Sertifikat boshqa nomga berilgan.** `example.com` uchun chiqarilgan, sayt esa `www.example.com` orqali ochiladi. Ikkala nomni ham qo‘shing.

Sertifikatni manzil satridagi qulf belgisini bosib yoki buyruq orqali tekshirish mumkin:

```bash
openssl s_client -connect example.com:443 -servername example.com
```

## FAQ

### Bepul sertifikat pullikdan yomonroqmi?

Himoya jihatidan — yo‘q. Let’s Encrypt’ning bepul DV sertifikati pullik DV kabi shifrlaydi. Pullik variantlar tekshiruv darajasi (OV, EV), amal qilish muddati, qo‘llab-quvvatlash yoki markaz kafolatlari bilan farq qiladi.

### HTTPS SEO’ga ta’sir qiladimi?

Google HTTPS’ni kichik bo‘lsa ham reyting signali sifatida hisobga olishini rasman ma’lum qilgan. Muhimrog‘i: HTTPS bo‘lmasa, brauzer ogohlantirish ko‘rsatadi va tashrif buyuruvchilarning bir qismi ketib qoladi.

### Sertifikatni qanchalik tez-tez uzaytirish kerak?

Ommaviy sertifikatlarning amal qilish muddati cheklangan va vaqt o‘tishi bilan qisqarib bormoqda. Shuning uchun qo‘lda uzaytirish o‘rniga hosting, CDN yoki Certbot kabi ACME mijozi orqali avtomatik uzaytirishni sozlagan ma’qul.
