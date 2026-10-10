---
title: "Loyihani topshirish chek-listi: kod, kirish huquqlari va akkauntlar"
description: Loyiha topshirilganda buyurtmachi nimalarni olishi kerak: repozitoriylar, domenlar, hosting, store akkauntlari, API kalitlari, hujjatlar va egalik huquqi.
summary: Loyiha topshirilganda buyurtmachi barcha akkauntlar — repozitoriy, domen, hosting, store’lar va tashqi servislar — egasiga aylanishi hamda avvalgi pudratchisiz ishlash uchun yetarli kod, kalitlar va hujjatlarni olishi kerak.
---

## Qisqa javob

Loyiha **barcha asosiy akkauntlar pudratchi yoki uning xodimi emas, buyurtmachi nomiga rasmiylashtirilganda** va yangi jamoa faqat siz olgan narsalar yordamida mahsulotni joylashtira, o‘zgartira va chiqara olganda topshirilgan hisoblanadi. Tekshirish oddiy: avvalgi pudratchi ertaga aloqaga chiqmaydi deb tasavvur qiling. O‘zingiz qila olmaydigan har qanday narsa hali topshirilmagan.

## Asosiy tamoyil: mehmon emas, ega

Eng ko‘p uchraydigan muammo — akkauntlar dasturchining pochtasiga ro‘yxatdan o‘tkazilgan, buyurtmachiga esa «kirish huquqi» berilgan. Ega boshqa odam ekan, u parolni yo‘qotishi, ishdan ketishi yoki shunchaki javob bermay qo‘yishi mumkin.

Qoida: akkaunt **egasi** — buyurtmachi kompaniyasi (korporativ pochta, yuridik shaxs, buyurtmachining to‘lov usuli). Pudratchi **cheklangan rolli taklifnoma** oladi va ishlar tugagach olib tashlanadi.

## Kod va repozitoriylar

- Repozitoriy (GitHub, GitLab, Bitbucket) dasturchining shaxsiy akkauntida emas, **buyurtmachi tashkilotida** joylashgan.
- Oxirgi versiya arxivi emas, kommitlarning **to‘liq tarixi** va barcha ishchi branch’lar topshirilgan.
- Repozitoriyda ochiq ko‘rinishdagi parollar va kalitlar yo‘q; maxfiy ma’lumotlar muhit o‘zgaruvchilariga chiqarilgan.
- Barcha kerakli o‘zgaruvchilar qiymatsiz sanab o‘tilgan konfiguratsiya namunasi fayli bor (masalan, `.env.example`).
- **CI/CD** sozlamalari va payplaynlar buyurtmachi uchun ochiq.

## Domenlar va DNS

- Domen **buyurtmachi nomiga** ro‘yxatdan o‘tkazilgan, aloqa pochtasi — korporativ.
- Registrator paneliga va, agar ular turlicha bo‘lsa, DNS-provayderga kirish huquqi.
- Avtomatik uzaytirish yoqilgan, ro‘yxatdan o‘tish tugash sanasi ma’lum.
- DNS yozuvlari hujjatlashtirilgan: sayt, pochta, servislar verifikatsiyasi.

## Hosting va infratuzilma

- Bulut yoki hosting akkaunti buyurtmachi nomiga rasmiylashtirilgan va uning kartasidan to‘lanadi.
- Serverlarga kirish: buyurtmachining SSH-kalitlari qo‘shilgan, pudratchi kalitlari topshirilgandan keyin o‘chiriladi.
- Ilova **qayerda va qanday** ishga tushirilgani tasvirlangan: serverlar, konteynerlar, ma’lumotlar bazalari, fayl omborlari.
- **Zaxira nusxalash** sozlangan va bekapdan qanday tiklanish ma’lum.
- SSL-sertifikatlar avtomatik yangilanadi.

## Mobil store’lar

- **Google Play Console** va **Apple Developer** — buyurtmachi kompaniyasining akkauntlari.
- Ilova imzo kalitlari buyurtmachida saqlanadi. Imzo kalitini yo‘qotish allaqachon nashr etilgan ilova uchun yangilanishlarni chiqarishni imkonsiz qilishi mumkin, shuning uchun bu band juda muhim.
- Push-bildirishnomalar uchun sertifikat va profillarga kirish huquqi.

## Tashqi servislar va API kalitlari

Loyiha bog‘liq bo‘lgan barcha servislar reyestrini tuzing:

| Servis | Nima uchun | Akkaunt egasi | Kalit qayerda saqlanadi |
|---|---|---|---|
| To‘lov tizimi | To‘lovlarni qabul qilish | Buyurtmachi | Muhit o‘zgaruvchilari |
| Pochta servisi | Foydalanuvchilarga xatlar | Buyurtmachi | Muhit o‘zgaruvchilari |
| Telegram-bot | Bildirishnomalar | Buyurtmachi | Muhit o‘zgaruvchilari |
| Analitika | Sayt metrikalari | Buyurtmachi | Sayt sozlamalari |
| Xaritalar, SMS, AI-API | Loyihaga qarab | Buyurtmachi | Muhit o‘zgaruvchilari |

Topshirilgandan keyin, agar shartnoma va xavflar buni talab qilsa, pudratchi ko‘rgan **kalitlarni qayta chiqaring**.

## Hujjatlar

- Loyihani **lokal ishga tushirish** — qadamma-qadam.
- Yangi versiyani serverga **joylashtirish** tartibi.
- Arxitektura sxemasi: qanday qismlar bor va ular qanday bog‘langan.
- Agar API bo‘lsa, uning tavsifi.
- Ma’lum muammolar va texnik qarz ro‘yxati.
- Kontaktlar: loyiha bo‘yicha savollarga kim va qaysi muddatgacha javob beradi.

## Topshirishni qanday o‘tkazish kerak

1. Barcha akkaunt va servislar reyestrini tuzing.
2. Egalikni buyurtmachiga o‘tkazing va to‘lovni tekshiring.
3. Kod, maxfiy kalitlar va hujjatlarni oling.
4. **Mustaqil dasturchi**dan loyihani hujjatlar bo‘yicha joylashtirib ko‘rishni so‘rang.
5. Pudratchining kirish huquqlarini bekor qiling va umumiy parollarni almashtiring.
6. Topshirilgan narsalar ro‘yxati bilan topshirish dalolatnomasini imzolang.

## FAQ

### Topshirilgandan keyin parol va kalitlarni qayerda saqlash kerak?

Kirish huquqlari ajratilgan korporativ parol menejerida, ilova maxfiy kalitlarini esa muhit o‘zgaruvchilarida yoki bulut provayderining secrets omborida. Jadvallar va messenjerdagi yozishmalar bunga mos emas.

### Domen pudratchi nomiga ro‘yxatdan o‘tgan bo‘lsa nima qilish kerak?

Domen administratorini almashtirish yoki buyurtmachi akkauntiga transfer qilishni so‘rang. Tartib registrator va domen zonasiga bog‘liq, shuning uchun pudratchi aloqada ekanida oldindan boshlash yaxshiroq.

### Pudratchining kirish huquqlarini darhol o‘chirish kerakmi?

Ha, hammasi usiz ishlashiga ishonch hosil qilganingizdan keyin. Agar pudratchi qo‘llab-quvvatlashda qolsa, unga ega huquqlarini emas, minimal zarur rolni qoldiring.
