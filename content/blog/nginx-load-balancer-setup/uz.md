---
title: Nginx’da yuklamani taqsimlash (load balancing) qanday sozlanadi
description: Nginx’da load balancing bo‘yicha amaliy qo‘llanma: upstream bloki, taqsimlash usullari, passiv tekshiruvlar, og‘irliklar, zaxira serverlar va sticky sessiyalar.
summary: Ilova serverlarini upstream blokida sanab chiqing, usulni tanlang (round-robin, least_conn, ip_hash yoki hash), max_fails va fail_timeout’ni belgilang va proxy_pass’ni unga yo‘naltiring — Nginx so‘rovlarni taqsimlaydi va ishlamayotgan serverni chetlab o‘tadi.
---

## Qisqa javob

Nginx’da yuklamani taqsimlash ikki qismdan iborat: serverlar ro‘yxati yozilgan **upstream** bloki va so‘rovlarni unga yuboradigan **proxy_pass** direktivasi. Minimal ishlaydigan konfiguratsiya:

```nginx
upstream app_backend {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Standart holatda so‘rovlar navbat bilan (**round-robin**) yuboriladi. Keyin konfiguratsiyani o‘z yuklamangizga moslashtirasiz.

## Taqsimlash usulini qanday tanlash kerak

Usul `upstream` ichidagi birinchi qatorda ko‘rsatiladi.

| Usul | Qanday ishlaydi | Qachon mos keladi |
|---|---|---|
| round-robin (standart) | Navbat bilan, og‘irliklarni hisobga olib | Bir xil serverlar, qisqa so‘rovlar |
| `least_conn` | Faol ulanishlari eng kam serverga | Davomiyligi turlicha so‘rovlar, WebSocket, fayl yuklash |
| `ip_hash` | Bitta mijoz IP’si — bitta server | Cookie’siz oddiy bog‘lash |
| `hash $key consistent` | Server istalgan kalit bo‘yicha tanlanadi | Cookie, URL yoki sarlavha bo‘yicha bog‘lash; keshlar |
| `random two least_conn` | Ikki tasodifiy serverdan kamroq yuklangani | Bitta pul oldida bir nechta balanser |

Ko‘pchilik veb-ilovalar uchun `least_conn` yaxshi boshlang‘ich nuqta.

## Passiv sog‘liq tekshiruvlari

Nginx’ning bepul versiyasi serverlarni **passiv** tekshiradi: haqiqiy so‘rovlar natijasiga qarab. Parametrlar har bir server uchun beriladi:

```nginx
upstream app_backend {
    least_conn;
    server 10.0.0.11:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:3000 max_fails=3 fail_timeout=30s;
}
```

- **max_fails** — `fail_timeout` davomida nechta muvaffaqiyatsiz urinishdan keyin server «mavjud emas» deb belgilanadi.
- **fail_timeout** — xatolarni hisoblash oynasi ham, server chetlatiladigan vaqt ham.

Nima xato hisoblanishini `proxy_next_upstream` belgilaydi. Standart holatda bu ulanish xatosi va taymaut. Javob kodlarini ham qo‘shish mumkin:

```nginx
proxy_next_upstream error timeout http_502 http_503;
proxy_next_upstream_tries 2;
```

Idempotent bo‘lmagan so‘rovlarga e’tibor bering: POST’ni boshqa serverda takrorlash buyurtmaning dublikatini yaratishi mumkin. Nginx standart holatda ularni takrorlamaydi, `non_idempotent`ni faqat ongli ravishda yoqing. Faol tekshiruvlar (`health_check`) faqat tijoriy NGINX Plus’da bor; bepul versiyada ularning o‘rnini tashqi monitoring bosadi.

## Og‘irliklar va zaxira serverlar

Serverlar quvvati turlicha bo‘lsa, **weight**dan foydalaning:

```nginx
upstream app_backend {
    server 10.0.0.11:3000 weight=3;
    server 10.0.0.12:3000 weight=1;
    server 10.0.0.13:3000 backup;
    server 10.0.0.14:3000 down;
}
```

- `weight=3` — server taxminan uch baravar ko‘p so‘rov oladi.
- `backup` — faqat barcha asosiy serverlar ishlamay qolganda yoqiladi. `hash`, `ip_hash` va `random` bilan birga ishlamaydi.
- `down` — server vaqtincha rotatsiyadan chiqarilgan, texnik xizmat paytida qulay.

## Sticky sessiyalar

Foydalanuvchini bitta serverga bog‘lash sessiyalar ilova xotirasida saqlanganda kerak bo‘ladi. Bepul Nginx’da ikki yo‘l bor:

```nginx
# mijoz IP’si bo‘yicha
ip_hash;

# sessiya cookie’si bo‘yicha
hash $cookie_sessionid consistent;
```

Ko‘p foydalanuvchi bitta IP orqali chiqsa (ofis, mobil operator), `ip_hash` yomon ishlaydi. Cookie bo‘yicha bog‘lash aniqroq. Lekin eng yaxshi variant — sticky sessiyalardan umuman voz kechib, sessiyalarni **Redis** yoki bazada saqlash: shunda istalgan server istalgan so‘rovni qayta ishlaydi, masshtablash va yangilash osonlashadi.

## Backend bilan ulanishlar

Har bir so‘rov uchun yangi TCP ulanish ochmaslik uchun **keepalive**ni yoqing:

```nginx
upstream app_backend {
    least_conn;
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
    keepalive 32;
}

location / {
    proxy_pass http://app_backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
}
```

## Ko‘p uchraydigan xatolar

- `Host` va `X-Forwarded-For` uzatilmagan — ilova noto‘g‘ri domenni va balanser IP’sini ko‘radi.
- `max_fails=0` — tekshiruvlar o‘chirilgan, so‘rovlar ishlamayotgan serverga ketaveradi.
- Sessiyalar xotirada, lekin bog‘lash yo‘q — foydalanuvchi tasodifan tizimdan chiqib ketadi.
- Konfiguratsiya tekshirilmasdan o‘zgartirilgan: doim avval `nginx -t`, keyin `nginx -s reload` ishga tushiring.

## FAQ

### Load balancing uchun nechta server kerak?

Kamida ikkita, aks holda taqsimlanadigan narsa yo‘q. Lekin Nginx’ning o‘zi ham yagona nosozlik nuqtasi bo‘lib qoladi — muhim tizimlarda umumiy suzuvchi IP’ga ega ikkita balanser qo‘yiladi yoki bulut provayderining balanseridan foydalaniladi.

### least_conn nima uchun round-robin’dan yaxshiroq?

Round-robin bir so‘rov millisekund, boshqasi esa daqiqalab davom etishini hisobga olmaydi. `least_conn` yangi so‘rovni hozir faol ulanishlar kamroq bo‘lgan joyga yuboradi, shuning uchun davomiyligi turlicha so‘rovlarda yuklama tekisroq taqsimlanadi.

### WebSocket’ni ham taqsimlash mumkinmi?

Ha. Kerakli location uchun `proxy_http_version 1.1` hamda `Upgrade` va `Connection` sarlavhalarini qo‘shing. Uzoq davom etadigan ulanishlar uchun `least_conn` yaxshiroq mos keladi.
