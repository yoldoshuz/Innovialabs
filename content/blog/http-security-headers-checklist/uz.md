---
title: Sayt uchun HTTP xavfsizlik sarlavhalari chek-listi
description: Asosiy HTTP xavfsizlik sarlavhalari: har biri qaysi hujumdan himoya qiladi, tavsiya etilgan qiymatlar, nginx uchun misol va saytni tez tekshirish.
summary: Bir nechta javob sarlavhasi — HSTS, CSP, X-Content-Type-Options, X-Frame-Options yoki frame-ancestors, Referrer-Policy, Permissions-Policy va cookie’lar uchun Secure bayroqlari — brauzerda HTTP’ga pasaytirish, clickjacking, MIME sniffing va ma’lumot sizib chiqishidan himoyani deyarli bepul yoqadi.
---

## Qisqacha javob

Xavfsizlik sarlavhalari — server har bir javob bilan yuboradigan ko‘rsatmalar, ular brauzerga qo‘shimcha himoyani yoqishni buyuradi. Ular koddagi xatolarni tuzatmaydi, lekin hujumlarning butun sinflarini yo‘qotadi va biror narsa o‘tib ketsa, zararni cheklaydi. Sozlash bir necha daqiqa oladi, asosiy ish — hech narsa buzilmaganini tekshirish.

## Chek-list

| Sarlavha | Nimadan himoya qiladi | Tavsiya etilgan qiymat |
|---|---|---|
| **Strict-Transport-Security** | HTTP’ga pasaytirish, SSL stripping | `max-age=31536000; includeSubDomains` (bosqichma-bosqich joriy eting) |
| **Content-Security-Policy** | XSS, qo‘shilgan skriptlar, istalmagan joylashtirish | Aniq saytga moslab; kamida `frame-ancestors 'self'; object-src 'none'; base-uri 'self'` |
| **X-Content-Type-Options** | MIME sniffing: yuklangan fayl skript yoki stil deb qabul qilinadi | `nosniff` |
| **X-Frame-Options** | Saytingizni yashirin iframe’ga joylab clickjacking | `DENY` yoki `SAMEORIGIN` |
| **Referrer-Policy** | Yo‘llar va tokenlar bilan to‘liq URL’larning boshqa saytlarga sizib chiqishi | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Kamera, mikrofon, geolokatsiyadan suiiste’mol, jumladan ichki iframe’lardan | `camera=(), microphone=(), geolocation=()` — faqat foydalanadiganingizga ruxsat bering |
| **Cross-Origin-Opener-Policy** | Begona oynalarning sahifangizga kirishi | `same-origin` (yoki OAuth yoxud to‘lov qalqib chiquvchi oynalari bo‘lsa `same-origin-allow-popups`) |

### Izohlar

- **HSTS** faqat HTTPS orqali ishlaydi va uni tez bekor qilib bo‘lmaydi, shuning uchun max-age bosqichma-bosqich oshiriladi.
- **CSP** — eng kuchli sarlavha va buzilishlarning eng ehtimoliy manbai. `Content-Security-Policy-Report-Only` dan boshlang va asta-sekin qat’iylashtiring.
- **X-Frame-Options** — eski mexanizm; zamonaviy brauzerlarda uni CSP’dagi `frame-ancestors` almashtiradi. Ikkalasini yuborish normal holat, shunda eski mijozlar ham qamrab olinadi.
- **Referrer-Policy**: tavsiya etilgan qiymat zamonaviy brauzerlarda allaqachon standart, lekin uni aniq belgilash brauzerlar orasidagi farqlardan himoya qiladi va maxfiy sahifalarda siyosatni qat’iylashtirishga imkon beradi (`no-referrer`).
- **Permissions-Policy**: bo‘sh ro‘yxat `()` funksiyani sahifangiz va barcha freymlar uchun o‘chiradi.

## Cookie’lar ham sarlavha

Sessiya yoki token uchun har bir `Set-Cookie` quyidagilarni o‘z ichiga olishi kerak:

- **Secure** — faqat HTTPS orqali yuboriladi;
- **HttpOnly** — JavaScript uchun ko‘rinmaydi, shuning uchun XSS uni o‘qiy olmaydi;
- **SameSite=Lax** (yoki `Strict`) — ko‘pchilik saytlararo so‘rovlar bilan yuborilmaydi, bu CSRF xavfini kamaytiradi.

## Nimani olib tashlash va nimani ishlatmaslik kerak

- Versiya raqami bilan **Server** va **X-Powered-By** — hujumchi uchun bepul inventarizatsiya. nginx’da `server_tokens off`, ko‘pchilik freymvorklarda `X-Powered-By`ni o‘chirish opsiyasi bor.
- **X-XSS-Protection** — u boshqargan filtr zamonaviy brauzerlardan olib tashlangan va o‘zi muammolar keltirib chiqarishi mumkin edi. Uni yubormang yoki `0` qo‘ying, CSP’ga tayaning.
- **Public-Key-Pins (HPKP)** va **Expect-CT** — eskirgan. HPKP esa foydalanuvchilarga saytga kirishni butunlay to‘sib qo‘yishi mumkin edi.

## nginx uchun misol

Umumiy sarlavhalarni bitta faylga chiqaring va uni har bir `server`ga hamda o‘zining `add_header`i bor har bir `location`ga ulang — aks holda nginx ularni u yerda meros qilib olmaydi.

```nginx
# /etc/nginx/snippets/security-headers.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
```

```nginx
server {
    listen 443 ssl;
    server_tokens off;
    include snippets/security-headers.conf;
}
```

Agar sayt CDN ortida tursa yoki sarlavhalarni freymvork bersa, ziddiyatli qiymatli dublikatlar bo‘lmasligi uchun ularni bitta joyda belgilang.

## Qanday tekshirish kerak

1. **Buyruqlar qatori:** `curl -sI https://example.com` javob sarlavhalarini chiqaradi.
2. **Brauzer DevTools:** Network yorlig‘i → hujjat → Response Headers. Konsolda CSP va Permissions-Policy buzilishlarini kuzating.
3. **Onlayn skanerlar:** Mozilla HTTP Observatory va securityheaders.com baho qo‘yadi va har bir yetishmayotgan sarlavhani tushuntiradi.
4. **Turli sahifa turlarini tekshiring:** bosh sahifa, API javobi, statik fayl, 404 sahifasi va redirekt. Xatolar va statik fayllarda sarlavhalar ko‘pincha yo‘qolib qoladi.

## FAQ

### Sarlavhalar zaifliklarni tuzatish o‘rnini bosadimi?

Yo‘q. Bu ekspluatatsiyani qiyinlashtiradigan va zararni cheklaydigan ikkinchi qatlam. Kiruvchi ma’lumotlarni tekshirish, chiqishni ekranlash va kodda kirishni nazorat qilish baribir majburiy.

### Qaysi sarlavha saytni buzishi ehtimoli eng yuqori?

Content-Security-Policy, undan keyin esa, agar kirish yoki to‘lov qalqib chiquvchi oynalar orqali ishlasa, Cross-Origin-Opener-Policy. Avval ularni report-only rejimida yoki staging’da tekshiring.

### Bu sarlavhalar API javoblarida ham kerakmi?

Ha, kamida HSTS va X-Content-Type-Options. Freymlar va ruxsatlar haqidagi sarlavhalar sof JSON uchun unchalik muhim emas, lekin hamma joyda bir xil to‘plamni berish oddiyroq va zararsiz.
