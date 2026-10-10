---
title: Nginx’da keshlash: backend javoblarini qanday keshlash mumkin
description: Nginx’da proxy_cache sozlash: kesh zonasi va kaliti, avtorizatsiyadan o‘tganlar uchun keshni chetlash, nosozlikda eski javobni berish va tozalash.
summary: proxy_cache_path orqali kesh zonasini e’lon qiling, proxy_cache va proxy_cache_valid’ni yoqing, avtorizatsiyadan o‘tganlarni proxy_cache_bypass va proxy_no_cache bilan chetlang, proxy_cache_use_stale esa backend ishlamay qolganda ham saytni ochiq saqlaydi.
---

## Qisqa javob

**proxy_cache** — bu backend javoblari uchun Nginx’ning diskdagi keshi. Xuddi shu sahifaga takroriy so‘rov keshdan beriladi va ilova umuman chaqirilmaydi. Asosiy sozlama ikki qismdan iborat:

```nginx
# http blokida
proxy_cache_path /var/cache/nginx/app levels=1:2 keys_zone=app_cache:10m
                 max_size=1g inactive=60m use_temp_path=off;

server {
    location / {
        proxy_pass http://app_backend;
        proxy_cache app_cache;
        proxy_cache_valid 200 301 10m;
        proxy_cache_valid 404 1m;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

- **keys_zone** — kalitlar va metama’lumotlar saqlanadigan xotira zonasining nomi va hajmi.
- **max_size** — diskdagi joy chegarasi; eski yozuvlar avtomatik o‘chiriladi.
- **inactive** — shu vaqt ichida murojaat bo‘lmasa, yozuv hali «yangi» bo‘lsa ham o‘chiriladi.
- **proxy_cache_valid** — muayyan kodli javoblar qancha vaqt saqlanadi.

`X-Cache-Status` sarlavhasi `HIT`, `MISS`, `BYPASS`, `STALE` va boshqa holatlarni ko‘rsatadi — keshni `curl -I` bilan tekshirish qulay.

## Kesh kaliti

Kalit qaysi so‘rovlar «bir xil» hisoblanishini belgilaydi. Standart qiymat — `$scheme$proxy_host$request_uri`. Bitta upstream ortida bir nechta domen bo‘lsa, hostni aniq qo‘shing:

```nginx
proxy_cache_key "$scheme$request_method$host$request_uri";
```

Kalitga javob bog‘liq bo‘lgan hamma narsani qo‘shing: masalan, til URL’dan emas, cookie’dan aniqlansa — tilni ham. Aks holda foydalanuvchi sahifani boshqa tilda oladi.

## Avtorizatsiyadan o‘tgan foydalanuvchilarni keshlamang

Keshlashning asosiy xavfi — bir foydalanuvchiga boshqasining shaxsiy ma’lumotlarini ko‘rsatib qo‘yish. Sessiya cookie’si bor so‘rovlar uchun keshni o‘qishda ham, yozishda ham chetlab o‘tish kerak:

```nginx
proxy_cache_bypass $cookie_sessionid $http_authorization;
proxy_no_cache     $cookie_sessionid $http_authorization;
```

- **proxy_cache_bypass** — javobni keshdan olmaslik.
- **proxy_no_cache** — javobni keshga saqlamaslik.

O‘zgaruvchilardan biri bo‘sh bo‘lmasa va `0` ga teng bo‘lmasa, qoida ishlaydi. `/admin`, savat, buyurtma rasmiylashtirish va shaxsiy ma’lumotli API’larni ham keshlamang — ularni `proxy_cache`siz alohida `location`larga ajratish eng oson yo‘l.

Nginx standart holatda backend sarlavhalarini hisobga oladi: `Set-Cookie` yoki `Cache-Control: private, no-store` bor javoblar keshga tushmaydi. Bu himoya mexanizmi, uni `proxy_ignore_headers` orqali faqat oqibatlarini tushungan holda o‘chiring.

## Nosozlikda eskirgan keshni berish

Backend ishlamay qolganda yoki ortiqcha yuklanganda kesh saytni qutqarishi mumkin:

```nginx
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
proxy_cache_background_update on;
proxy_cache_lock on;
```

- **proxy_cache_use_stale** — backend xato bersa, xato o‘rniga eskirgan nusxani berish.
- **updating** va **proxy_cache_background_update** — yozuv fonda yangilanayotganda foydalanuvchilar kutmasdan eski versiyani oladi.
- **proxy_cache_lock** — kesh bo‘lmaganda backend’ga faqat bitta so‘rov boradi, qolganlari uning natijasini kutadi. Bu mashhur yozuv muddati tugaganda so‘rovlar ko‘chkisidan himoya qiladi.

## Keshni qanday tozalash mumkin

`proxy_cache_purge` direktivasi faqat tijoriy NGINX Plus’da bor. Bepul versiyada boshqa yondashuvlar qo‘llanadi:

| Usul | Qanday ishlaydi | Kamchiliklari |
|---|---|---|
| Qisqa TTL | Ma’lumotlar bir necha daqiqada o‘zi yangilanadi | O‘zgarishlar darhol ko‘rinmaydi |
| Majburiy yangilash | `proxy_cache_bypass $http_x_refresh` — sarlavhali so‘rov yozuvni qayta yozadi | Sarlavhani begonalardan himoyalash kerak |
| Fayllarni o‘chirish | Kesh katalogini tozalash | Butun kesh o‘chadi |
| Uchinchi tomon moduli | Masalan, ngx_cache_purge | Nginx’ni modul bilan yig‘ish kerak |
| URL’dagi versiyalar | Statika uchun: `app.3f2a.js` | Faqat assetlar uchun mos |

Kontent saytlar uchun ko‘pincha qisqa TTL va `proxy_cache_use_stale` kombinatsiyasi yetarli: sahifalar tez yangilanadi, sayt esa nosozlikda ham ochiq qoladi.

## Ko‘p uchraydigan xatolar

- Shaxsiy ma’lumotli sahifalarni keshlash — eng xavfli xato.
- `X-Cache-Status` yo‘q, kesh umuman ishlayaptimi — noma’lum.
- Kalitda host yoki til yo‘q — foydalanuvchilar sahifaning boshqa versiyasini ko‘radi.
- Kesh katalogiga Nginx ishlayotgan foydalanuvchi yoza olmaydi.

## FAQ

### proxy_cache brauzer keshidan nimasi bilan farq qiladi?

Brauzer keshi har bir foydalanuvchida saqlanadi va `Cache-Control` sarlavhalari bilan boshqariladi. proxy_cache sizning serveringizda saqlanadi va barcha tashrif buyuruvchilar uchun umumiy, shuning uchun yangi foydalanuvchilar uchun ham backend yuklamasini kamaytiradi.

### Qanday TTL tanlash kerak?

Bu ma’lumotlar qanchalik tez-tez o‘zgarishi va yangilanish kechikishi qanchalik muhimligiga bog‘liq. Bosh sahifa va maqolalar uchun odatda daqiqalar mos keladi, narx va qoldiqli katalog uchun — kamroq yoki umuman keshsiz.

### API’ni keshlash mumkinmi?

Ha, agar javob hamma uchun bir xil bo‘lsa, masalan kategoriyalar ro‘yxati yoki ochiq katalog. Shaxsiy endpointlar va GET hamda HEAD’dan boshqa so‘rovlarni keshlash mumkin emas.
