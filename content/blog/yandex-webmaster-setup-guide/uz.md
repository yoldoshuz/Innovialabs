---
title: Yandex Webmaster’ni qanday sozlash kerak: to‘liq qo‘llanma
description: Saytni Yandex Webmaster’ga qo‘shish va tasdiqlash, hududni ko‘rsatish, indeksatsiya, diagnostika va so‘rovlar hisobotlari hamda sahifalarni qayta aylanishga yuborish.
summary: Saytni qo‘shib, huquqlarni tasdiqlang, hudud va sitemap’ni ko‘rsating, so‘ng diagnostika, indeksatsiya va so‘rovlarni kuzating, o‘zgarishlardan keyin esa muhim sahifalarni qayta aylanishga yuboring.
---
## Qisqacha: nima qilish kerak

**Yandex Webmaster** — bepul kabinet bo‘lib, u orqali Yandex saytning qidiruvdagi holati haqida xabar beradi. Asosiy sozlash:

1. Webmaster’ga kompaniyaning Yandex ID’si orqali kiring.
2. Saytni protokoli bilan aniq manzilda qo‘shing: `https://example.com`.
3. Huquqlarni tasdiqlang.
4. Hududni ko‘rsating, sitemap yuklang va asosiy ko‘zguni tekshiring.
5. Haftada bir marta diagnostika va indeksatsiya hisobotlarini oching.

Agar auditoriyangiz Yandex’dan foydalansa, Webmaster’siz ko‘p muammolarni trafik tushmaguncha bilmay qolasiz.

## Saytni qo‘shish va huquqlarni tasdiqlash

Yandex `http://` va `https://`, shuningdek www’li va www’siz versiyalarni turli saytlar deb hisoblaydi. **Asosiy ko‘zgu** bo‘lgan versiyani qo‘shing — odatda redirektlaringizga qarab www’li yoki www’siz https.

Tasdiqlash usullari:

- Bosh sahifaning `<head>` qismidagi **meta-teg**.
- Sayt ildizidagi **HTML fayl**.
- Domen registratoridagi **DNS TXT yozuvi**.

```html
<meta name="yandex-verification" content="sizning_kodingiz" />
```

Tekshiruvdan keyin tasdiqlash kodini o‘chirmang: Yandex huquqlarni vaqti-vaqti bilan qayta tekshiradi va kod yo‘qolsa, kirish huquqi bekor qilinishi mumkin.

## Hudud va sayt haqidagi ma’lumotlar

Tijorat saytlari uchun **hududiylik** muhim: Yandex joylashuvga bog‘liq so‘rovlarni saralashda hududni hisobga oladi. Saytning qidiruvdagi ko‘rinishi sozlamalarida ishlayotgan shahar yoki mamlakatingizni ko‘rsating. Odatda hududni asoslash kerak bo‘ladi — masalan, manzil ko‘rsatilgan kontaktlar sahifasi bilan.

Kompaniyaning ofisi yoki savdo nuqtasi bo‘lsa, Yandex Biznes orqali tashkilot ma’lumotlarini ham to‘ldirish foydali.

## Indeksatsiya

**«Indeksatsiya»** bo‘limida asosiy hisobotlar jamlangan:

- **Aylanish statistikasi** — robot qaysi sahifalarni so‘ragani va qanday javob kodlarini olgani. 404 yoki 5xx javoblar ko‘p bo‘lsa, tekshirish kerak.
- **Qidiruvdagi sahifalar** — qidiruvga nima qo‘shilgani va nima chiqib ketgani, chiqarilish sababi bilan.
- **Sitemap fayllari** — sayt xaritasi manzilini qo‘shing va u xatosiz qayta ishlanayotganini tekshiring.
- **Saytni ko‘chirish va ko‘zgular** — asosiy ko‘zgu sifatida to‘g‘ri versiya tanlanganiga ishonch hosil qiling.

Har bir istisno muammo emas. Dublikatlar, `noindex` sahifalar va kanonik bo‘lmagan manzillar qidiruvda bo‘lmasligi kerak. Natijalarda ko‘rishni istagan sahifalaringizga e’tibor bering.

## Sayt diagnostikasi

**«Diagnostika»** bo‘limi Yandex topgan muammolarni jiddiylik belgisi bilan ko‘rsatadi: sayt ochilmasligi, robots.txt’dagi xatolar, sitemap yo‘qligi, SSL sertifikat muammolari, server javobining sekinligi. **«Xavfsizlik va qoidabuzarliklar»** bo‘limini alohida tekshiring: bu yerda pozitsiyalarni yo‘qotishga olib keladigan zararli kod yoki qoidabuzarliklar haqida xabarlar chiqadi.

Jiddiy muammolar haqida darhol bilish uchun pochta orqali bildirishnomalarni yoqing.

## Qidiruv so‘rovlari

**«Qidiruv so‘rovlari»** hisoboti ko‘rsatishlar, kliklar, CTR va o‘rtacha pozitsiyani ko‘rsatadi. Foydali usullar:

- so‘rovlarni mavzular bo‘yicha guruhlang va guruhlar dinamikasini kuzating;
- ko‘rsatishi yaxshi, lekin CTR’i past so‘rovlarni toping va ularning title va description’ini yaxshilang;
- saytdagi o‘zgarishlardan oldingi va keyingi davrlarni solishtiring.

## Sahifalarni qayta aylanish

Kontentni tahrirlagan yoki xatolarni tuzatgandan keyin URL’larni **«Sahifalarni qayta aylanish»** bo‘limiga yuboring. Robot ularga tezroq kiradi, lekin natijalar bir zumda yangilanmaydi. Sutkalik manzillar soni cheklangan, shuning uchun muhimlarini tanlang: yangi xizmatlar, tuzatilgan mahsulot kartochkalari, yangilangan maqolalar. Ommaviy o‘zgarishlar uchun yangilangan sitemap ishonchliroq.

## FAQ

### Sayt Google Search Console’da bo‘lsa, Webmaster kerakmi?

Ha, agar auditoriyangiz Yandex’dan foydalansa. Qidiruv tizimlarining robotlari, qoidalari va hisobotlari har xil, birida ko‘ringan muammo boshqasida doim ham ko‘rinmaydi.

### Nega sayt qo‘shilgandan keyin qidiruvda chiqmayapti?

Yangi saytni indekslash vaqt talab qiladi. Diagnostika, robots.txt va sitemap’ni tekshiring, sahifalar 200 kodini qaytarishi va `noindex` bilan yopilmaganiga ishonch hosil qiling.

### Nechta hudud ko‘rsatish mumkin?

Haqiqatda ishlayotgan hududingizni ko‘rsating. Kompaniya butun mamlakat yoki bir necha shaharda ishlasa, buni matnlarda shaharlarni sanash bilan emas, saytdagi kontaktlar bilan tasdiqlang.
