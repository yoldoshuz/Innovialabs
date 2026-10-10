---
title: Nginx’ni reverse proxy sifatida qanday sozlash kerak
description: Nginx’ni reverse proxy sifatida bosqichma-bosqich sozlash: backend’ga proxy_pass, to‘g‘ri sarlavhalar, WebSocket, taymautlar, buferlash va konfiguratsiyani tekshirish.
summary: Nginx location blokidagi proxy_pass direktivasi orqali reverse proxy’ga aylanadi; unga Host va X-Forwarded-* sarlavhalari, WebSocket qo‘llab-quvvatlash va mos taymautlar qo‘shiladi, so‘ng konfiguratsiya nginx -t bilan tekshiriladi.
---
## Minimal ishlaydigan konfiguratsiya

Reverse proxy mijozlardan so‘rovlarni qabul qilib, lokal portda tinglayotgan ilovaga (Node.js, Python, Go va h.k.) uzatadi. Nginx’da buning uchun **proxy_pass** javob beradi. 3000-portdagi ilova uchun minimal blok:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Bunda ilova faqat `127.0.0.1` ni tinglaydi, tashqariga esa faqat Nginx ochiq. Bu HTTPS, siqish, limitlar va loglar uchun yagona nuqta beradi.

## Sarlavhalar nima uchun kerak

Ularsiz ilova har bir so‘rovni 127.0.0.1 manzilidagi Nginx’dan kelgan deb ko‘radi.

- **Host** — asl domen. Havolalar yaratish, ko‘p domenli ilovalar va CORS tekshiruvi uchun kerak.
- **X-Real-IP** va **X-Forwarded-For** — mijozning haqiqiy IP manzili. Loglar, rate limiting va firibgarlikka qarshi tekshiruvlar uchun muhim.
- **X-Forwarded-Proto** — asl so‘rov HTTPS orqali kelganmi. Usiz ilova `http://` havolalar yaratishi yoki cheksiz redirectga tushishi mumkin.

Freymvorkda odatda proxy’ga ishonchni aniq yoqish kerak (masalan, Express’da `trust proxy`), aks holda bu sarlavhalar e’tiborga olinmaydi.

## WebSocket qo‘llab-quvvatlash

WebSocket `Upgrade` sarlavhali HTTP so‘rovdan boshlanadi. Nginx uni sukut bo‘yicha uzatmaydi, shuning uchun ulanish o‘rnatilmaydi. Yechim — `http` blokidagi map va `location` ichidagi ikkita sarlavha:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 1h;
    }
}
```

Uzaytirilgan **proxy_read_timeout** Nginx jim ulanishlarni yopib qo‘ymasligi uchun kerak. Muqobil yo‘l — ilova tomonidan ping/pong.

## Taymautlar va so‘rov hajmi

| Direktiva | Nimani boshqaradi |
|---|---|
| `proxy_connect_timeout` | Backend bilan ulanishni kutish |
| `proxy_send_timeout` | Backend’ga so‘rov yuborishdagi pauzalar |
| `proxy_read_timeout` | Backend javobini o‘qishdagi pauzalar |
| `client_max_body_size` | So‘rov tanasining maksimal hajmi |

Uzoq hisobotlar yoki eksportlar **504 Gateway Timeout** bilan yiqilsa, `proxy_read_timeout` ni global emas, aynan o‘sha location uchun oshiring. Fayl yuklashdagi **413 Request Entity Too Large** xatosi `client_max_body_size` orqali tuzatiladi.

## Buferlash

Sukut bo‘yicha Nginx backend javobini buferlaydi: uni tez olib, ilovani bo‘shatadi va sekin mijozga ma’lumotni o‘zi yetkazadi. Bu oddiy sahifalar va API uchun yaxshi.

Oqimli javoblar — **Server-Sent Events**, LLM javoblarini striming qilish, uzun eksportlar — uchun buferlash o‘chiriladi, aks holda mijoz ma’lumotni oxirida bitta bo‘lak qilib oladi:

```nginx
location /api/stream {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffering off;
    proxy_cache off;
}
```

## proxy_pass’dagi slesh

Keng tarqalgan tuzoq. Agar `proxy_pass` da yo‘l ko‘rsatilgan bo‘lsa (hatto shunchaki `/`), Nginx location’ning mos kelgan qismini almashtiradi:

- `location /api/ { proxy_pass http://127.0.0.1:3000; }` — `/api/users` so‘rovi `/api/users` bo‘lib ketadi.
- `location /api/ { proxy_pass http://127.0.0.1:3000/; }` — `/users` bo‘lib ketadi.

Ilova marshrutlariga mos variantni tanlang va uni alohida tekshiring.

## Konfiguratsiyani tekshirish

1. `sudo nginx -t` — qo‘llashdan oldin sintaksisni tekshirish.
2. `sudo systemctl reload nginx` — joriy ulanishlarni uzmasdan qo‘llash.
3. `curl -I http://example.com` — javob va sarlavhalarni ko‘rish.
4. **502 Bad Gateway** xatosida `/var/log/nginx/error.log` ni ko‘ring: odatda ilova ishga tushmagan yoki boshqa portni tinglayapti.

## FAQ

### 502 va 504 xatolari nimasi bilan farq qiladi?

502 — Nginx backend’dan to‘g‘ri javob ololmadi: ilova ishlamayapti, yiqilgan yoki port noto‘g‘ri. 504 — backend mavjud, lekin belgilangan vaqtda javob bermadi.

### Ilovaning o‘zida HTTPS sozlash kerakmi?

Odatda yo‘q. TLS Nginx’da tugaydi, server ichida esa so‘rov ilovaga HTTP orqali boradi. Asosiysi — ilova asl HTTPS haqida bilishi uchun `X-Forwarded-Proto` ni uzatish.

### Ilovaning bir nechta nusxasiga qanday proxy qilinadi?

Ularni `upstream` blokida sanab, uning nomini `proxy_pass` da ko‘rsating. Nginx so‘rovlarni serverlar o‘rtasida, sukut bo‘yicha navbat bilan taqsimlaydi.
