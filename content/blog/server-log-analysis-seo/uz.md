---
title: SEO uchun server loglari tahlili: botlar saytni qanday aylanadi
description: Loglardan bot so‘rovlarini ajratish, haqiqiy Googlebot va YandexBot’ni tekshirish, ortiqcha skanerlash va o‘tkazib yuborilgan sahifalarni topish.
summary: Server loglari Googlebot va YandexBot qaysi URL’larni haqiqatda aylanishini ko‘rsatadi: ularni user-agent bo‘yicha ajrating, teskari DNS orqali tasdiqlang va muhim sahifalar ro‘yxati bilan solishtiring.
---
## Search Console bo‘lsa, loglar nega kerak

Search Console va Yandex Webmaster tanlanma va umumlashtirilgan ma’lumotlarni ko‘rsatadi. **Server logi** esa har bir so‘rovni yozadi: qaysi URL, qachon, qanday javob kodi va qaysi bot. Faqat loglar aniq javob beradi:

- bot qaysi bo‘limlarni ko‘p aylanadi, qaysilarini e’tiborsiz qoldiradi;
- qancha so‘rov keraksiz URL’larga ketadi: parametrlar, dublikatlar, redirektlar;
- bot yangi va muhim sahifalarni ko‘radimi va qanchalik tez;
- qaysi URL’lar botga 4xx va 5xx xatolarini qaytaradi.

## 1-qadam. Loglarni oling va tayyorlang

Odatda bu combined formatidagi nginx yoki Apache access loglari. Tahlil uchun kerakli maydonlar: IP, sana, metod, URL, javob kodi, hajm, user-agent.

- Kamida bir necha haftalik davrni oling — botlar notekis skanerlaydi.
- Sayt oldida CDN yoki balanser bo‘lsa, logda proksi IP emas, **mijozning haqiqiy IP**si yozilishiga ishonch hosil qiling.
- Loglarda foydalanuvchilarning shaxsiy ma’lumotlari bo‘lishi mumkin, shuning uchun SEO tahlili uchun faqat bot qatorlari yetarli.

## 2-qadam. Bot so‘rovlarini ajrating

Birinchi ko‘rish uchun buyruq qatori yetarli:

```bash
# Googlebot va YandexBot qatorlari
grep -E "Googlebot|YandexBot" access.log > bots.log

# Bot so‘rovlari soni bo‘yicha top URL’lar
awk '{print $7}' bots.log | sort | uniq -c | sort -rn | head -50

# Javob kodlari taqsimoti
awk '{print $9}' bots.log | sort | uniq -c | sort -rn
```

Muntazam ish uchun loglarni maxsus log analizatoriga, jadvalga yoki ma’lumotlar bazasiga yuklab, sayt bo‘limlari bo‘yicha hisobot tuzish qulayroq.

## 3-qadam. Bot haqiqiy ekanini tekshiring

User-agent’ni soxtalashtirish oson: parserlar va spam-botlar ko‘pincha o‘zini Googlebot deb ko‘rsatadi. Tekshiruv ikki qadamda bajariladi:

1. IP bo‘yicha **teskari DNS**: host nomi Google uchun `googlebot.com` yoki `google.com` bilan, Yandex uchun `yandex.ru`, `yandex.net` yoki `yandex.com` bilan tugashi kerak.
2. Shu nomning **to‘g‘ri DNS**i o‘sha IP’ni qaytarishi kerak.

```bash
host 66.249.66.1
# ... domain name pointer crawl-66-249-66-1.googlebot.com.
host crawl-66-249-66-1.googlebot.com
# ... has address 66.249.66.1
```

Google o‘z kraulerlarining IP diapazonlari ro‘yxatini ham e’lon qiladi — ommaviy tekshiruv uchun qulay. Batafsil [Google hujjatlarida](https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot). Tekshiruvdan o‘tmagan so‘rovlarni SEO tahlilidan chiqarib tashlang.

## 4-qadam. Ortiqcha skanerlashni toping

URL’larni shablonlar bo‘yicha guruhlang va so‘rovlar qayerga ketayotganini ko‘ring:

| Nimani qidirish | Muammo belgisi |
|---|---|
| Parametrli URL’lar | Saralash, filtrlar, utm skanerlashning sezilarli qismini oladi |
| 301/302 redirektlar | Bot eski manzillar va zanjirlar bo‘ylab tez-tez yuradi |
| 404 xatolar | Buzilgan ichki havolalar yoki eskirgan sitemap |
| 5xx xatolar | Server yuklamaga bardosh bermaydi yoki ayrim shablonlarda yiqiladi |
| Texnik URL’lar | Sayt ichidagi qidiruv, savat, xizmat sahifalari |

Har bir bunday klaster — havolalarni tuzatish, parametrlarni robots.txt’da yopish, sitemap’ni yangilash yoki serverni tezlashtirish uchun sabab.

## 5-qadam. O‘tkazib yuborilgan muhim sahifalarni toping

Indeksda bo‘lishi kerak bo‘lgan URL’lar ro‘yxatini (sitemap’dan yoki sayt bazasidan) oling va bot loglaridagi URL’lar bilan solishtiring:

- **Sitemap’da bor, logda yo‘q** — bot sahifani topa olmaydi. Ichki havolalar va joylashuv chuqurligini tekshiring.
- **Logda bor, sitemap’da yo‘q** — bot siz muhim deb hisoblamagan narsaga vaqt sarflayapti.
- **Muhim sahifalar kam skanerlanadi** — bot tez-tez kiradigan bo‘limlardan ichki havolalarni kuchaytiring.

**Javob vaqti**ga ham qarang: u oshsa, botlar ko‘pincha skanerlash intensivligini pasaytiradi.

## Ko‘p uchraydigan xatolar

- DNS tekshiruvisiz tahlil: hisobotga soxta botlar tushadi.
- Juda qisqa davr — bir-ikki kunlik ma’lumotdan xulosa.
- Balanser ortida bir nechta node bo‘lsa-da, faqat bitta server loglari.
- Google’ning barcha botlarini (rasmlar, reklama, asosiy krauler) bitta raqamga aralashtirish.

## FAQ

### Loglarni qanchalik tez-tez tahlil qilish kerak?

Katta saytlar uchun hisobotni avtomatlashtirib, muntazam ko‘rib borish, shuningdek ko‘chish, redizayn yoki URL’larning ommaviy o‘zgarishidan keyin albatta tekshirish ma’qul. Kichik saytlar uchun indeksatsiyada muammo gumon qilinganda bir martalik tekshiruv yetarli.

### Sayt Cloudflare yoki boshqa CDN ortida bo‘lsa, loglarni tahlil qilsa bo‘ladimi?

Ha, lekin mijozning haqiqiy IP’si kerak. Asl IP’ni sarlavhada uzatib, logga yozishni sozlang yoki tarifingizda bo‘lsa, CDN’ning o‘z loglaridan foydalaning.

### Nima muhimroq: bot so‘rovlari sonimi yoki ularning taqsimotimi?

Taqsimot. So‘rovlar ko‘p bo‘lishi, agar ular dublikat va redirektlarga ketsa, hech narsani anglatmaydi. Maqsad — skanerlashning asosiy qismi reytingda chiqishi kerak bo‘lgan sahifalarga to‘g‘ri kelishi.
