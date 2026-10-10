---
title: Saytni Cloudflare’ga qanday ulash: bosqichma-bosqich sozlash
description: Saytni Cloudflare’ga ulash: domen qo‘shish, NS-serverlarni almashtirish, to‘g‘ri SSL rejimi, asosiy keshlash va saytni buzadigan xatolar.
summary: Domenni Cloudflare’ga qo‘shing, import qilingan DNS-yozuvlarni tekshiring, registratorda NS-serverlarni almashtiring va Full (strict) SSL rejimini tanlang — shunda sayt CDN va himoyani buzilishlarsiz oladi. Muammolarning aksariyati Flexible rejimi, unutilgan DNS-yozuvlar va yoqilgan DNSSEC tufayli yuzaga keladi.
---
## Qisqa javob: besh qadam

1. Domenni Cloudflare’ga qo‘shish va import qilingan DNS-yozuvlarni tekshirish.
2. Qaysi yozuvlarni proksilash (to‘q sariq bulut), qaysilarini yo‘q (kulrang) ekanini hal qilish.
3. Registratorda DNSSEC’ni o‘chirish va NS-serverlarni Cloudflare bergan serverlarga almashtirish.
4. **Full (strict)** SSL rejimini tanlash va **Always Use HTTPS**’ni yoqish.
5. Standart keshlashni qoldirish va qoidalarni faqat kerakli joyga qo‘shish.

Ko‘pchilik saytlar uchun Cloudflare’ning bepul tarifi yetarli.

## 1-qadam. Domenni qo‘shing va yozuvlarni solishtiring

Cloudflare panelida domen qo‘shishni va bepul tarifni tanlang. Cloudflare mavjud DNS-yozuvlarni skanerlaydi va ularni import qilishni taklif qiladi.

Skanerlash hamma narsani topmaydi. Davom etishdan oldin joriy provayderdagi DNS-zonani oching va qatorma-qator solishtiring:

- sayt va barcha subdomenlar uchun A, AAAA va CNAME;
- **MX**-yozuvlar va pochtaning TXT-yozuvlari (SPF, DKIM, DMARC);
- xizmatlarni tasdiqlash yozuvlari (Google, Microsoft va boshqalar);
- agar bo‘lsa, SRV-yozuvlar.

Eski zonaning nusxasini saqlab qo‘ying — biror narsa noto‘g‘ri ketsa, u kerak bo‘ladi.

## 2-qadam. To‘q sariq yoki kulrang bulut

- **Proxied (to‘q sariq)** — trafik Cloudflare orqali o‘tadi: CDN, hujumlardan himoya ishlaydi, serverning haqiqiy IP-manzili yashiriladi.
- **DNS only (kulrang)** — Cloudflare faqat DNS-so‘rovlarga javob beradi, trafik to‘g‘ridan-to‘g‘ri serverga boradi.

Sayt yozuvlarini proksilang: asosiy domen, `www`, veb-ilovali subdomenlar. HTTP(S) orqali ishlamaydigan hamma narsani kulrang qoldiring: pochta serverlari (masalan, MX ko‘rsatadigan `mail.example.com`), FTP, SSH, o‘yin va VPN xizmatlari.

## 3-qadam. NS-serverlarni almashtiring

Cloudflare ikkita NS-server beradi. Registrator panelida joriy serverlarni ular bilan almashtiring.

**Bundan oldin registratorda DNSSEC’ni o‘chiring** (DS-yozuvni olib tashlang). Aks holda NS almashgach, domen ayrim foydalanuvchilarda ochilmay qolishi mumkin. Cloudflare domenni faollashtirgach, DNSSEC’ni endi Cloudflare’da yoqing va registratorga yangi DS-yozuvni qo‘shing.

NS almashinuvi odatda bir necha soatda kuchga kiradi, ba’zan ko‘proq vaqt oladi. Domen faol bo‘lganda Cloudflare xat yuboradi.

## 4-qadam. To‘g‘ri SSL rejimi

**SSL/TLS → Overview** bo‘limi:

| Rejim | Nima sodir bo‘ladi | Qachon ishlatish kerak |
|---|---|---|
| Off | HTTPS ishlatilmaydi | Hech qachon |
| Flexible | Cloudflare’gacha HTTPS, servergacha HTTP | Faqat serverda SSL umuman bo‘lmasa va vaqtincha |
| Full | Servergacha HTTPS, sertifikat tekshirilmaydi | O‘tish bosqichi sifatida |
| **Full (strict)** | Servergacha sertifikat tekshiruvi bilan HTTPS | **Tavsiya etiladi** |

Full (strict) uchun serverda haqiqiy sertifikat kerak: Let’s Encrypt’dan yoki Cloudflare’ning bepul **Origin CA** sertifikati. Origin CA’ga faqat Cloudflare ishonadi, shuning uchun bunday sertifikatli yozuv proksilangan holda qolishi shart.

So‘ng **Always Use HTTPS**’ni yoqing. HSTS’ni hamma narsa barqaror ishlaganda, eng oxirida yoqing: brauzerlar bu sozlamani eslab qoladi va uni tezda bekor qilib bo‘lmaydi.

## 5-qadam. Asosiy keshlash

Standart holatda Cloudflare statik fayllarni kengaytmasi bo‘yicha (rasmlar, CSS, JS, shriftlar) keshlaydi va **HTML’ni keshlamaydi**. Boshlash uchun bu yetarli.

- **Caching → Configuration** bo‘limida standart keshlash darajasini qoldiring.
- **Cache Rules** orqali versiyalangan fayllar papkalari, masalan `/assets/*` uchun uzoq saqlash muddatini bering.
- HTML’ni faqat to‘liq statik sahifalar uchun keshlang. Admin panel, savat, shaxsiy kabinetni keshdan chiqarib tashlang.
- Relizdan so‘ng keshni tozalang: **Purge Cache** to‘liq yoki URL bo‘yicha. **Development Mode** tahrirlash vaqtida keshni vaqtincha o‘chiradi.

## Saytni buzadigan xatolar

- **Flexible + serverda HTTPS’ga yo‘naltirish** — cheksiz sikl va `ERR_TOO_MANY_REDIRECTS` xatosi.
- NS almashtirishdan oldin **DNSSEC o‘chirilmagan**.
- **Importda unutilgan yozuvlar** — ko‘pincha pochta ishlamay qoladi.
- **Pochta va SSH subdomenlarini proksilash** — bu protokollar proksi orqali o‘tmaydi.
- **Shaxsiy ma’lumotli HTML keshi** — tashrif buyuruvchilar boshqalarning sahifasini ko‘radi.
- **Server fayervoli Cloudflare IP’larini bloklaydi**: endi butun trafik ulardan keladi. Xuddi shu sababdan loglarda Cloudflare manzillari ko‘rinadi. Tashrif buyuruvchining haqiqiy IP-manzili `CF-Connecting-IP` sarlavhasida keladi:

```nginx
# Cloudflare IP-manzillarining rasmiy ro‘yxatidagi barcha diapazonlarni qo‘shing
set_real_ip_from 173.245.48.0/20;
real_ip_header CF-Connecting-IP;
```

- **Rocket Loader va boshqa skript optimizatsiyalari** ba’zan JavaScript’ni buzadi. Ulangandan keyin formalar yoki vidjetlar ishlamay qolsa, birinchi navbatda ularni o‘chiring.

## FAQ

### Bepul tarif yetadimi?

Ko‘pchilik saytlar va kichik ilovalar uchun — ha: unda CDN, SSL, DDoS’dan asosiy himoya va keshlash qoidalari bor. Pullik tariflar kengaytirilgan WAF, ko‘proq qoidalar va ustuvor qo‘llab-quvvatlash uchun kerak.

### Yangilanishdan keyin sayt eski versiyani ko‘rsatyapti. Nima qilish kerak?

Cloudflare’da keshni tozalang (Purge Cache) va server qaytarayotgan keshlash sarlavhalarini tekshiring. Build fayllari uchun xeshli nomlardan foydalaning — shunda tozalash umuman kerak bo‘lmaydi.

### Cloudflare’ni NS-serverlarni almashtirmasdan ulasa bo‘ladimi?

CNAME orqali ulash (partial setup) mavjud, lekin faqat yuqori pullik tariflarda. Bepul tarifda domenni Cloudflare NS-serverlariga delegatsiya qilish kerak.
