---
title: Nginx’da Gzip va Brotli siqishni qanday yoqish mumkin
description: Javoblarni siqish qanday ishlaydi, Nginx’da gzip va brotli’ni mos daraja va MIME turlari bilan sozlash, oldindan siqilgan fayllar va curl orqali tekshirish.
summary: Gzip o‘rnatilgan gzip on va gzip_types direktivalari bilan yoqiladi, Brotli uchun ngx_brotli moduli kerak; matnli formatlarni o‘rta darajada siqing, statikani oldindan siqing va natijani Content-Encoding sarlavhasi orqali tekshiring.
---
## Siqish qanday ishlaydi

Brauzer har bir so‘rovda qaysi algoritmlarni tushunishini bildiradi: `Accept-Encoding: gzip, deflate, br`. Server mosini tanlab, javobni siqadi va uni `Content-Encoding` sarlavhasi bilan belgilaydi. Brauzer ma’lumotni o‘zi ochadi.

Eng ko‘p **matnli formatlar** yutadi: HTML, CSS, JavaScript, JSON, SVG. **Brotli** odatda matnni gzip’dan zichroq siqadi, **gzip** esa deyarli barcha mijozlar tomonidan qo‘llab-quvvatlanadi. Shuning uchun ikkalasini ham yoqish oqilona: zamonaviy brauzerlar uchun Brotli, zaxira variant sifatida gzip.

## Gzip’ni sozlash

Gzip Nginx’ga o‘rnatilgan. `http` blokiga qo‘shing:

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_vary on;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

Bu yerda nima muhim:

- **gzip_comp_level** — 1 dan 9 gacha. Daraja qanchalik yuqori bo‘lsa, hajmdagi kichik yutuq uchun shuncha ko‘p CPU sarflanadi. Tezkor siqish uchun odatda o‘rta qiymatlar tanlanadi.
- **gzip_min_length** — juda kichik javoblarni siqishning ma’nosi yo‘q.
- **gzip_vary** — `Vary: Accept-Encoding` qo‘shadi, shunda CDN va proxy’lar siqilgan nusxani uni tushunmaydigan mijozga bermaydi.
- **gzip_proxied any** — proxy yoki CDN orqali kelgan so‘rovlarga javoblarni ham siqish.
- **text/html** ni `gzip_types` da ko‘rsatish shart emas: u har doim siqiladi.

## Brotli’ni sozlash

Brotli Nginx’ning standart yig‘masiga kirmaydi. **ngx_brotli** moduli kerak: ba’zi distributivlarda u paket ko‘rinishida bor, aks holda Nginx versiyangiz uchun dinamik modul sifatida yig‘iladi. O‘rnatgandan keyin modullar `nginx.conf` boshida ulanadi:

```nginx
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

Va `http` blokida:

```nginx
brotli on;
brotli_comp_level 5;
brotli_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

Mijoz ikkala algoritmni qo‘llab-quvvatlasa, Brotli ishlaydi; faqat gzip’ni qo‘llasa — gzip.

## Nimani siqish kerak emas

JPEG, PNG, WebP, AVIF, MP4, WOFF2 va arxivlar allaqachon siqilgan. Ularni qayta siqish CPU’ni behuda sarflaydi va hajmni deyarli kamaytirmaydi. Shuning uchun hammasini emas, turlarni aniq ko‘rsating.

## Oldindan siqilgan fayllar

Statika uchun (yig‘ilgandan keyingi JS va CSS) fayllarni oldindan maksimal darajada siqib qo‘yish foydaliroq, Nginx esa tayyor natijani beradi:

```bash
gzip -k -9 dist/assets/*.js dist/assets/*.css
brotli -q 11 dist/assets/*.js dist/assets/*.css
```

`app.js` yonida `app.js.gz` va `app.js.br` paydo bo‘ladi. Ularni berishni yoqing:

```nginx
gzip_static on;
brotli_static on;
```

Nginx kerakli kengaytmali fayl bor-yo‘qligini tekshiradi va uni tezkor siqishsiz beradi. `gzip_static` uchun `ngx_http_gzip_static_module` kerak; u sizning yig‘mangizda bor-yo‘qligini `nginx -V` ko‘rsatadi.

## Qanday tekshirish mumkin

1. `sudo nginx -t` va `sudo systemctl reload nginx`.
2. Kerakli sarlavha bilan so‘rov yuboring:

```bash
curl -s -o /dev/null -D - -H "Accept-Encoding: br" https://example.com/assets/app.js
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip" https://example.com/assets/app.js
```

Javobda `content-encoding: br` yoki `content-encoding: gzip` ni qidiring.

3. Brauzer DevTools’ida Network yorlig‘ida Content-Encoding ustunini yoqing va fayllarning uzatilgan hamda haqiqiy hajmini solishtiring.

## Ko‘p uchraydigan xatolar

- **Kerakli MIME turi yo‘q.** Masalan, API `application/json` qaytaradi, lekin u `gzip_types` da yo‘q.
- **Brotli moduli yuklanmagan.** Modulsiz `brotli` direktivasi `nginx -t` da xato beradi.
- **Tezkor siqishda maksimal daraja.** Har bir so‘rovda CPU’ni yuklaydi; maksimumni oldindan siqilgan statika uchun qoldiring.
- **Ikki marta siqish.** Agar backend javoblarni allaqachon siqsa va oldida CDN tursa, siqish qayerda bo‘layotganini tekshiring va bitta joyda qoldiring.

## FAQ

### Qaysi biri yaxshiroq: gzip yoki Brotli?

Brotli odatda kichikroq fayllar beradi, ayniqsa yuqori darajadagi statikada. Lekin ikkalasini ham yoqing: gzip Brotli’ni qo‘llab-quvvatlamaydigan mijozlar va vositalar uchun kerak.

### Siqish sayt tezligi va SEO’ga ta’sir qiladimi?

Siqish uzatiladigan ma’lumotlar hajmini kamaytiradi, shuning uchun sahifalar va skriptlar tezroq yuklanadi, ayniqsa mobil internetda. Bu qidiruv tizimlari hisobga oladigan yuklanish metrikalariga yordam beradi.

### Sayt oldida CDN tursa, siqish kerakmi?

Ko‘plab CDN’lar o‘zi siqa oladi. Shunga qaramay, Nginx’da `gzip_vary on` bilan siqishni yoqish foydali: CDN allaqachon siqilgan kontentni oladi va turli versiyalarni to‘g‘ri keshlaydi.
