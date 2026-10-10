---
title: Yuklamani balansirovka qilish nima va balansirovkachi qanday ishlaydi
description: Yuklamani balansirovka qilish oddiy tilda: L4 va L7, health check, sessiyani bog‘lash va balansirovkachining veb-arxitekturadagi o‘rni, nginx misoli bilan.
summary: Balansirovkachi kiruvchi so‘rovlarni qabul qilib, ularni bir nechta server o‘rtasida taqsimlaydi va nosoz serverlarni chetlab o‘tadi, shunda servis ko‘proq trafikka bardosh beradi va bitta server ishdan chiqqanda to‘xtab qolmaydi.
---
## Qisqa javob

**Balansirovkachi** (load balancer) — bir xil serverlar guruhi oldida turadigan kirish nuqtasi bo‘lib, navbatdagi so‘rovni qaysi serverga berishni hal qiladi. Mijoz bitta manzilni ko‘radi, uning ortida esa ilovaning ikki, o‘n yoki yuzta nusxasi ishlaydi.

U uchta vazifani bajaradi:

- **yuklamani taqsimlash** — boshqalari bo‘sh turganda birorta server ortiqcha yuklanmaydi;
- **nosozlikka chidamlilik** — ishdan chiqqan server avtomatik ravishda rotatsiyadan chiqariladi;
- **moslashuvchanlik** — serverlarni mijozlar uchun manzilni o‘zgartirmasdan qo‘shish, olib tashlash va yangilash mumkin.

## Balansirovkachi arxitekturada qayerda turadi

Veb-ilovada so‘rovning odatiy yo‘li:

1. Foydalanuvchi → DNS → **CDN** (ixtiyoriy).
2. → **Balansirovkachi** (bulutli LB, nginx, HAProxy, Traefik).
3. → **Ilovaning** bir nechta nusxasi.
4. → Ma’lumotlar bazasi, kesh, navbatlar.

Ko‘pincha balansirovkachida **TLS yakunlanadi** (HTTPS sertifikati shu yerda turadi), javoblar siqiladi va so‘rovlar chastotasi cheklanadi. Balansirovkachilar tizim ichida ham bo‘ladi: masalan, mikroservislar o‘rtasida yoki o‘qish uchun baza replikalari oldida.

Muhim: balansirovkachining o‘zi ham yagona nosozlik nuqtasiga aylanishi mumkin. Bulutli balansirovkachilarni provayder zaxiralaydi, o‘zingizning nginx yoki HAProxy uchun esa umumiy suzuvchi IP’ga ega ikki tugun qilinadi.

## L4 va L7: farqi nimada

| | L4 (transport darajasi) | L7 (ilova darajasi) |
|---|---|---|
| Nimani ko‘radi | IP manzillar, portlar, TCP/UDP | HTTP: yo‘l, sarlavhalar, cookie, xost |
| Qarorlar | «Bu ulanish — B serverga» | «`/api` — backendga, `/static` — omborga» |
| Tezlik | Tezroq, qo‘shimcha xarajat kam | Biroz sekinroq, lekin moslashuvchanroq |
| TLS | Odatda shifrlangan trafikni o‘tkazib yuboradi | Odatda shifrni ochadi va mazmunni ko‘radi |
| Misollar | Bulutning tarmoq balansirovkachilari, TCP rejimidagi HAProxy | nginx, HTTP rejimidagi HAProxy, Traefik, bulutli ALB |

**L4** har qanday TCP protokoli uchun mos: bazalar, MQTT, o‘yin serverlari. **L7** esa marshrutlash so‘rov mazmuniga bog‘liq bo‘lganda kerak: turli domenlar, API versiyalari, canary-relizlar.

## Health check

Balansirovkachi har bir serverni muntazam tekshirib turadi:

- **passiv tekshiruvlar** — server real so‘rovlarga xato yoki taymaut bilan javob bersa, chiqariladi;
- **faol tekshiruvlar** — balansirovkachining o‘zi belgilangan oraliqda maxsus manzilni, masalan `GET /health`ni so‘raydi.

Yaxshi health check ilova **haqiqatan so‘rovlarga xizmat qila olishini** tekshiradi, lekin barcha bog‘liqliklarni ortidan sudramaydi. Agar `/health` bazadagi har qanday kechikishda yiqilsa, balansirovkachi barcha serverlarni birdaniga rotatsiyadan chiqarib yuborishi mumkin.

## Sessiyani bog‘lash (session persistence)

Ba’zan bitta foydalanuvchi doim bir serverga tushishi kerak — masalan, sessiya jarayon xotirasida saqlansa. Buni **sticky sessions** deyishadi. Variantlar:

- balansirovkachi o‘rnatadigan cookie bo‘yicha;
- mijoz IP manzilining xeshi bo‘yicha.

Kamchiliklari: yuklama yomonroq taqsimlanadi, server yiqilganda esa foydalanuvchilar sessiyani yo‘qotadi. Sessiyalarni tashqi omborda (Redis, baza) yoki tokenda saqlash ishonchliroq — shunda bog‘lash kerak bo‘lmaydi.

## nginx misoli

```nginx
upstream app {
    server 10.0.0.11:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Bu yerda nginx passiv tekshiruvli L7-balansirovkachi sifatida ishlaydi: bir necha muvaffaqiyatsiz urinishdan so‘ng server vaqtincha chiqariladi.

## Ko‘p uchraydigan xatolar

- **Zaxirasiz bitta balansirovkachi** — ilova chidamli, lekin kirish nuqtasi emas.
- **Haddan tashqari «aqlli» health check**, u hamma narsaga bog‘liq.
- **Mijozning haqiqiy IP manzilini yo‘qotish** — `X-Forwarded-For` uzatish yoki proxy protocol’ni yoqish unutilgan.
- **Balansirovkachi taymautlari ilovaning uzoq so‘rovlaridan qisqa**: fayl yuklash, hisobotlar, WebSocket.

## FAQ

### Bitta serverim bo‘lsa, balansirovkachi kerakmi?

Yuklamani taqsimlovchi sifatida — yo‘q. Lekin ilova oldidagi reverse proxy (nginx, Caddy) bu holatda ham foydali: TLS, siqish, statik fayllar. U keyinchalik bir nechta serverga o‘tishni ham osonlashtiradi.

### Balansirovkachi reverse proxy’dan nimasi bilan farq qiladi?

Reverse proxy so‘rovlarni backend nomidan qabul qiladi. Balansirovkachi esa so‘rovlarni bir nechta backend o‘rtasida taqsimlaydigan reverse proxy. Amalda nginx va HAProxy ikkala rolni ham bajaradi.

### DNS orqali balansirovka qilsa bo‘ladimi?

DNS yozuvida bir nechta IP ko‘rsatish mumkin, mijozlar turli manzillarga murojaat qiladi. Lekin DNS keshlanadi va serverlar holatini bilmaydi, shuning uchun u to‘laqonli balansirovkachi o‘rniga emas, ko‘proq mintaqalar o‘rtasida taqsimlash uchun ishlatiladi.
