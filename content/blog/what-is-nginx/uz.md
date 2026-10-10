---
title: Nginx nima va u veb-server sifatida qanday ishlaydi
description: Nginx nima, uning hodisalarga asoslangan arxitekturasi qanday ishlaydi, qaysi vazifalarni bajaradi va oddiy nginx.conf faylini qanday o‘qish kerakligini tushuntiramiz.
summary: Nginx — hodisalarga asoslangan tezkor veb-server bo‘lib, statik fayllarni beradi hamda ilovangiz oldida teskari proksi, yuklama balanslovchi va kesh vazifasini bajaradi.
---
## Nginx haqida qisqacha

**Nginx** («enjin-iks» deb o‘qiladi) — brauzerlardan HTTP so‘rovlarni qabul qilib, ularga javob beradigan dastur. U faylni to‘g‘ridan-to‘g‘ri diskdan berishi yoki so‘rovni Node.js, Python, PHP yoki Go’dagi ilovangizga uzatib, javobni qaytarishi mumkin.

Nginx uch sababga ko‘ra mashhur: u **tez**, ko‘p ulanishlarda ham **xotirani tejaydi** va bitta matnli konfiguratsiya orqali **moslashuvchan sozlanadi**.

## Hodisalarga asoslangan arxitektura

Klassik serverlar ko‘pincha har bir ulanish uchun alohida jarayon yoki oqim ajratardi. Mingta sekin mijoz — mingta oqim, har birining o‘z xotirasi bor.

Nginx boshqacha ishlaydi:

- **Master jarayon** konfiguratsiyani o‘qiydi va ishchi jarayonlarni ishga tushiradi.
- Bir nechta **worker jarayon**, odatda CPU yadrolari soniga teng, asosiy ishni bajaradi.
- Har bir worker hodisalar siklida **minglab ulanishlarga bir vaqtda** xizmat ko‘rsatadi. U sekin mijoz javobni yuklab olishini kutmaydi, balki tayyor bo‘lgan boshqa ulanishlarga o‘tadi.

Shu sababli Nginx ko‘plab bir vaqtdagi ulanishlarni, jumladan sekin mobil mijozlarni ham, xotira sarfini keskin oshirmasdan ushlab turadi.

## Nginx bajaradigan vazifalar

### Statik fayllar uchun veb-server

HTML, CSS, JavaScript, rasmlar va shriftlarni to‘g‘ridan-to‘g‘ri diskdan beradi. Bu uning eng kuchli tomoni.

### Teskari proksi (reverse proxy)

Ilova oldida turadi va so‘rovlarni unga uzatadi. Shu bilan birga Nginx:

- **HTTPS**ni yakunlashi (TLS-terminatsiya), ya’ni ilova ichkarida oddiy HTTP’da ishlashi;
- javoblarni gzip bilan siqishi;
- so‘rovlar chastotasi va hajmini cheklashi;
- infratuzilmaning ichki tuzilishini yashirishi mumkin.

### Yuklama balanslovchi

So‘rovlarni ilovaning bir nechta nusxasi o‘rtasida taqsimlaydi: navbat bilan (round robin), eng kam ulanishli serverga yoki mijoz IP manziliga qarab.

### Kesh

Ilova javoblarini saqlab qo‘yadi va backend’ga murojaat qilmasdan qayta beradi. Bu ilovadagi yuklamani kamaytiradi va javoblarni tezlashtiradi.

## Oddiy nginx.conf tuzilishi

Konfiguratsiya **direktivalar** va **bloklardan** (kontekstlardan) iborat. API’ni ham proksilaydigan minimal sayt namunasi:

```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    sendfile      on;
    gzip          on;

    upstream app {
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
    }

    server {
        listen 80;
        server_name example.com;

        root /var/www/site;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

Asosiy qismlar:

- **`events`** — ulanishlarni qayta ishlash sozlamalari.
- **`http`** — HTTP’ga oid hamma narsa: fayl turlari, siqish, saytlar.
- **`upstream`** — balanslash uchun backend’lar guruhi.
- **`server`** — virtual xost: qaysi domen va portga xizmat ko‘rsatadi.
- **`location`** — muayyan URL yo‘llari uchun qoidalar.

Real tizimlarda har bir sayt odatda `conf.d/` yoki `sites-enabled/` ichidagi alohida faylga chiqariladi va `include` orqali ulanadi.

## Foydali buyruqlar

```bash
sudo nginx -t                 # konfiguratsiyani xatolarga tekshirish
sudo systemctl reload nginx   # ulanishlarni uzmasdan o‘zgarishlarni qo‘llash
sudo tail -f /var/log/nginx/error.log
```

## Ko‘p uchraydigan xatolar

- `reload` o‘rniga `restart` qilish va konfiguratsiyani `nginx -t` bilan tekshirmaslik.
- `Host` va `X-Real-IP` sarlavhalarini uzatmaslik — ilova noto‘g‘ri domen va IP’ni ko‘radi.
- `proxy_pass` manzili oxirida slesh bor va yo‘qligidagi farqni chalkashtirish.
- Xizmat yo‘llari va kataloglar ro‘yxatini ochiq qoldirish.

## FAQ

### Nginx ilova serverining o‘rnini bosadimi?

Yo‘q. Nginx ilovangiz kodini bajarmaydi. U ilova oldida turadi: statik fayllarni beradi, HTTPS’ni qayta ishlaydi va dinamik so‘rovlarni Node.js, Python yoki PHP-FPM jarayoniga uzatadi.

### reload va restart o‘rtasida qanday farq bor?

`reload` konfiguratsiyani qayta o‘qiydi va joriy ulanishlarni uzmasdan worker jarayonlarni silliq almashtiradi. `restart` serverni to‘liq to‘xtatib, qayta ishga tushiradi, bu qisqa uzilishga olib kelishi mumkin.

### Sayt bulut platformasida ishlasa, Nginx kerakmi?

Har doim emas. Ko‘plab platformalar va CDN’lar proksi hamda balanslovchi vazifasini allaqachon bajaradi. Nginx ayniqsa o‘z serverlaringiz yoki VPS’ni boshqarganingizda foydali.
