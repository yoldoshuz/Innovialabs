---
title: Aralash kontent (mixed content) xatolari: sabablari va yechimi
description: Nega HTTPS’dagi sayt hali ham resurslarni HTTP orqali yuklaydi, ularni kod va CMS bazasida qanday topish va upgrade-insecure-requests qanday sug‘urta qiladi.
summary: Mixed content — HTTPS sahifa skript, stil yoki rasmlarni oddiy HTTP orqali yuklashi; ularni DevTools’da toping, kod va ma’lumotlar bazasida manzillarni HTTPS’ga almashtiring, upgrade-insecure-requests’ni esa sug‘urta sifatida qo‘shing.
---
## Aralash kontent nima

**Mixed content** sahifa HTTPS orqali ochilganda, lekin uning ayrim resurslari — skriptlar, stillar, rasmlar, shriftlar, iframe, API so‘rovlari — hali ham `http://` orqali so‘ralganda yuzaga keladi. Sahifaning o‘zi shifrlangan, bu so‘rovlar esa yo‘q, shuning uchun o‘sha tarmoqdagi hujumchi ularni o‘qishi yoki almashtirishi mumkin.

Brauzerlar ikki xil munosabatda bo‘ladi:

- **Faol kontent** (skriptlar, stillar, iframe, `fetch`/XHR so‘rovlari) **bloklanadi**. Aynan shu sababli HTTPS’ga o‘tgandan keyin saytning stillari to‘satdan yo‘qoladi yoki vidjet ishlamay qoladi.
- **Passiv kontent** (rasmlar, audio, video) zamonaviy brauzerlar tomonidan odatda avtomatik HTTPS’ga o‘tkaziladi. Agar resurs HTTPS orqali mavjud bo‘lmasa, u shunchaki yuklanmaydi, manzil satridagi qulfda esa ogohlantirish chiqishi mumkin.

Yechim doim bitta: har bir resurs HTTPS orqali so‘ralishi kerak.

## HTTPS’ga o‘tgandan keyin u qayerdan paydo bo‘ladi

- Shablonlar, CSS (`background: url(http://...)`) va JavaScript’da **qattiq yozilgan manzillar**.
- **CMS ma’lumotlar bazasi** yozuvlar, sozlamalar va vidjetlarda mutlaq havolalarni saqlaydi. Masalan, WordPress rasmlarning `http://` manzillarini to‘g‘ridan-to‘g‘ri post matnida saqlaydi.
- **Konfigda noto‘g‘ri sayt manzili** — ilova havolalarni hali ham `http://` bilan boshlanadigan asosiy URL’dan quradi.
- **Reverse proxy yoki balansirovkachi** TLS’ni o‘zida yechadi, ilova oddiy HTTP so‘rovni ko‘radi va `http://` havolalar yaratadi. Unga `X-Forwarded-Proto` sarlavhasiga ishonishni o‘rgatish kerak.
- **Uchinchi tomon qo‘shimchalari** — yillar oldin qo‘shilgan eski hisoblagichlar, vidjetlar va CDN’lar.

## Xavfsiz bo‘lmagan resurslarni qanday topish

1. Sahifani oching, so‘ng **DevTools → Console**. Har bir bloklangan yoki o‘zgartirilgan so‘rov aniq manzil bilan «Mixed Content» ogohlantirishi sifatida ko‘rinadi.
2. **Network** bo‘limini tekshiring: barcha so‘rovlarning sxemasiga qarang, jumladan bosish va aylantirishdan keyin paydo bo‘ladiganlariga ham.
3. Kod bo‘yicha qidiring:

```bash
grep -rn "http://" --include=*.{html,css,js,php,tsx,twig} .
```

4. Ma’lumotlar bazasi dampida o‘z domeningizni `http://` bilan qidiring.
5. Katta saytlarda barcha sahifalarni kraulyer bilan aylanib chiqing yoki **report-only rejimidagi Content Security Policy** orqali hisobotlar yig‘ing: brauzer hech narsani bloklamasdan buzilishlar haqida xabar beradi.

```http
Content-Security-Policy-Report-Only: default-src https: data: blob: 'unsafe-inline' 'unsafe-eval'; report-uri /csp-report
```

## Kodda qanday tuzatish

- HTTPS’ni qo‘llab-quvvatlaydigan barcha resurslarda `http://` ni `https://` ga almashtiring.
- O‘z fayllaringiz uchun **ildizdan boshlanuvchi yo‘llardan** (`/assets/app.css`) foydalaning — ular sahifa sxemasini avtomatik oladi.
- Asosiy URL’ni muhit o‘zgaruvchisiga chiqaring va unda `https://` ni ko‘rsating.
- Proxy ortida freymvorkda proxy sarlavhalariga ishonchni yoqing, shunda ilova asl so‘rov HTTPS orqali kelganini biladi.
- Agar uchinchi tomon resursining HTTPS versiyasi bo‘lmasa, **uni almashtiring yoki o‘zingizda joylashtiring**. Uni boricha qoldirishning xavfsiz usuli yo‘q.

## CMS ma’lumotlar bazasida qanday tuzatish

WordPress jadvallarida oddiy SQL `REPLACE` ni ishga tushirmang: ayrim qiymatlar satr uzunligini saqlaydigan **seriyalashtirilgan PHP massivlari** ko‘rinishida turadi va ko‘r-ko‘rona almashtirish ularni buzadi. Seriyalashtirishni tushunadigan vositadan foydalaning, masalan WP-CLI:

```bash
wp db export backup.sql
wp search-replace 'http://example.com' 'https://example.com' --all-tables --dry-run
wp search-replace 'http://example.com' 'https://example.com' --all-tables
```

Avval albatta zaxira nusxa oling va sinov ishga tushirish natijasini ko‘rib chiqing. Keyin sozlamalarda sayt manzilini yangilang va barcha keshlarni tozalang (sahifa, CDN, obyekt keshi), aks holda eski HTML berilishda davom etadi.

## upgrade-insecure-requests sug‘urta sifatida

CSP’ning **upgrade-insecure-requests** direktivasi brauzerga sahifadagi barcha `http://` resurs so‘rovlarini yuborishdan oldin `https://` ga qayta yozishni buyuradi. Uni javob sarlavhasi sifatida qo‘shing:

```nginx
add_header Content-Security-Policy "upgrade-insecure-requests" always;
```

Yoki `<head>` ichida meta-teg sifatida:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

Uning cheklovlarini yodda tuting:

- U resursni HTTPS orqali **mavjud qilmaydi**. Serverda HTTPS versiya bo‘lmasa, so‘rov muvaffaqiyatsiz tugaydi.
- Foydalanuvchi bosadigan boshqa saytlarga havolalarni o‘zgartirmaydi.
- U muammolarni tuzatmaydi, balki yashiradi, shuning uchun bu tuzatish emas, sug‘urta.

Tartibga keltirgandan keyin **HSTS** ni yoqing, shunda brauzerlar domeningizni doim HTTPS orqali ochadi.

## FAQ

### Shunchaki upgrade-insecure-requests qo‘shib, hech narsani tozalamasa bo‘ladimi?

Ko‘pchilik ogohlantirishlar yo‘qoladi, lekin HTTPS’siz resurslar baribir buziladi, yangi `http://` havolalar esa bazada to‘planishda davom etadi. Manbalarni tuzating, direktivani esa zaxira sifatida qoldiring.

### //example.com/file.js kabi protokolsiz havolalar to‘g‘ri keladimi?

Ishlaydi, lekin bu eskirgan usul. Bugun deyarli hamma narsa HTTPS orqali mavjud, shuning uchun `https://` ni aniq yozing — bu tushunarliroq va lokal fayllarni ochishda kutilmagan holatlar bo‘lmaydi.

### Hammasini tuzatgan bo‘lsam ham, nega qulfda hali ogohlantirish bor?

Ko‘pincha sahifa yoki CDN keshi, yoki keyinroq JavaScript orqali yuklanadigan resurs sababchi bo‘ladi. Keshlarni tozalang va sahifani bosib chiqib, Console’ni qayta tekshiring.
