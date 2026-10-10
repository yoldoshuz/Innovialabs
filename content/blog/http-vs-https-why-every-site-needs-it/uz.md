---
title: HTTP yoki HTTPS: nega har qanday saytga shifrlash kerak
description: Shifrlanmagan HTTP’ning real xavflari, brauzerlar va qidiruv tizimlari bunday saytlarga qanday qaraydi va saytni HTTPS’ga o‘tkazish nimalardan iborat.
summary: HTTP orqali bir tarmoqdagi yoki trafik yo‘lidagi har kim ma’lumotlarni o‘qiy va o‘zgartira oladi, brauzerlar bunday saytlarni «Xavfsiz emas» deb belgilaydi va ko‘plab zamonaviy funksiyalar ishlamaydi — shuning uchun HTTPS har qanday saytga, hatto oddiy lendingga ham kerak.
---

## Qisqacha javob

**HTTP** hamma narsani ochiq matn sifatida uzatadi. **HTTPS** xuddi shu trafikni TLS shifrlashiga o‘raydi: uni yo‘lda o‘qib yoki o‘zgartirib bo‘lmaydi, brauzer esa haqiqiy server bilan muloqot qilayotganiga ishonch hosil qila oladi.

Ko‘p uchraydigan e’tiroz: «Saytimda kirish ham, to‘lov ham yo‘q, menga bu nima uchun?» Javob: HTTPS nafaqat foydalanuvchilar ma’lumotlarini, balki **sizning kontentingizni** ham ularga yetib borguncha o‘zgartirilishdan himoya qiladi. Sertifikat esa bugun bepul bo‘lishi mumkin.

## HTTP orqali aslida nima noto‘g‘ri ketadi

**Ommaviy Wi-Fi’da ushlab qolish.** Kafe, aeroport yoki mehmonxonada shu tarmoqdagi boshqa foydalanuvchilar — yoki kirish nuqtasi egasi — HTTP trafikni ushlab qolishi mumkin. Ular ko‘radi:

- barcha sahifalar va qidiruv so‘rovlarini;
- aloqa, kirish va buyurtma formalari mazmunini;
- sessiya cookie’larini — ular yordamida buzg‘unchi parolsiz akkauntga kiradi.

**Begona kontent qo‘shish.** Foydalanuvchi va server o‘rtasidagi har qanday vositachi — buzilgan router, insofsiz kirish nuqtasi, zararli proksi — HTTP sahifani qayta yozishi mumkin. Amalda bu qo‘shilgan reklama, ortiqcha trekerlar va zararli saytlarga yo‘naltirishlar. Tashrif buyuruvchi esa tarmoqni emas, sizning saytingizni ayblaydi.

**Fayllarni almashtirish.** HTTP orqali berilgan narxlar PDF’i yoki ilova o‘rnatuvchisini boshqa fayl bilan almashtirish mumkin.

**Soxta sahifalar orqali fishing.** HTTPS bo‘lmasa, foydalanuvchi sahifa aynan sizning serveringizdan kelganini tekshira olmaydi.

## Brauzerlar va qidiruv tizimlari qanday munosabatda

| Nima | HTTP | HTTPS |
|---|---|---|
| Manzil satri | **«Xavfsiz emas»** belgisi, formalarda ogohlantirishlar | Oddiy ko‘rinish |
| Brauzerning zamonaviy API’lari | Geolokatsiya, kamera, service worker, push-bildirishnomalar mavjud emas | Mavjud (ularga himoyalangan kontekst kerak) |
| HTTP/2 va HTTP/3 | Brauzerlar ularni shifrlashsiz ishlatmaydi | Mavjud |
| Qidiruv | Google HTTPS’ni reyting omili deb aytgan, garchi kuchsiz bo‘lsa ham | Asosiy talab bajarilgan |
| Analitika | HTTPS saytlardan o‘tishlar ko‘pincha refererlarsiz keladi | Manba ko‘proq saqlanadi |

SEO uchun ta’sir o‘z-o‘zidan kamtarona. Asosiy yo‘qotish — ishonch: formaning yonida «Xavfsiz emas» yozuvini ko‘rgan tashrif buyuruvchi ko‘pincha chiqib ketadi.

## HTTPS’ga o‘tish nimalardan iborat

1. **Sertifikat olish.** Ko‘pchilik saytlarga Let’s Encrypt’ning bepul avtomatik sertifikatlari yetarli. Hosting panellari va CDN’lar ularni ko‘pincha bir bosishda chiqaradi.
2. **O‘rnatish va avtomatik yangilashni sozlash.** Muddati o‘tgan sertifikat saytni butunlay buzadi, shuning uchun yangilash kimningdir xotirasiga bog‘liq bo‘lmasligi kerak.
3. **Butun HTTP trafikni HTTPS’ga** doimiy 301-redirekt bilan yo‘naltirish.
4. **Aralash kontentni (mixed content) tuzatish.** Rasmlar, skriptlar, shriftlar va iframe’larga barcha `http://` havolalarni `https://` yoki nisbiy yo‘llarga almashtiring. Brauzerlar himoyalangan sahifalardagi xavfsiz bo‘lmagan resurslarni bloklaydi yoki belgilaydi.
5. **Canonical, sitemap va ichki havolalarni yangilash**, so‘ng HTTPS versiyani Google Search Console va Yandex Webmaster’ga qo‘shish.
6. **Cookie’larni `Secure` bayrog‘i bilan belgilash**, toki ular hech qachon HTTP orqali ketmasin.
7. **Hammasi ishlagach, HSTS’ni yoqish** — shunda brauzerlar HTTP’ni umuman sinab ko‘rmaydi.

nginx’dagi minimal redirekt:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}
```

## Ko‘p uchraydigan xatolar

- Redirekt faqat bosh sahifa uchun sozlangan, ichki sahifalar HTTP’da qolgan.
- 301 o‘rniga 302 (vaqtinchalik) redirekt ishlatilgan.
- Eski maqolalarda yoki CMS bazasida rasmlarga qattiq yozilgan `http://` havolalar.
- Unutilgan subdomenlar: `www`, `api`, `admin`.
- HSTS barcha subdomenlar HTTPS’da ishlashidan oldin yoqilgan.

## FAQ

### Saytda formalar bo‘lmasa ham HTTPS kerakmi?

Ha. Shifrlash bo‘lmasa, har qanday vositachi sahifalaringizni o‘zgartirishi, reklama yoki skript qo‘shishi mumkin, brauzerlar esa baribir saytni «Xavfsiz emas» deb belgilaydi.

### Bepul sertifikat pulliknikidan yomonroqmi?

Shifrlash nuqtai nazaridan — yo‘q, ulanish himoyasi bir xil. Pullik sertifikatlar tekshiruv turi, kafolatlar va qo‘llab-quvvatlash bilan farq qiladi — bu ba’zi tashkilotlar uchun muhim, lekin trafik xavfsizligining o‘zi uchun emas.

### O‘tishdan keyin qidiruvdagi o‘rinlar tushib ketmaydimi?

301-redirektlar, yangilangan canonical va sitemap bilan to‘g‘ri bajarilgan ko‘chish odatda muammosiz o‘tadi. Qidiruv tizimlari saytni qayta aylanib chiqayotgan paytdagi qisqa tebranishlar — normal holat.
