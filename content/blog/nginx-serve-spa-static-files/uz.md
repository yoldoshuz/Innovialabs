---
title: Statik saytlar va SPA uchun Nginx sozlamalari
description: Statika va SPA uchun tayyor Nginx server bloklari: klient marshrutlash uchun try_files, assetlar uchun kesh sarlavhalari va bitta serverda bir nechta sayt.
summary: SPA uchun Nginx’da yig‘ilgan fayllar bilan root va try_files $uri $uri/ /index.html ko‘rsatish yetarli; heshlangan assetlarga uzoq kesh beriladi, index.html esa keshlanmaydi.
---
## Qisqa javob

Yig‘ilgandan keyin statik sayt yoki SPA (React, Vue, Angular, Svelte) — bu `index.html`, JS, CSS va rasmlar joylashgan papka. Nginx ularni backend’siz to‘g‘ridan-to‘g‘ri diskdan beradi. SPA uchun bitta muhim jihat bor: `/profile/settings` kabi to‘g‘ridan-to‘g‘ri havolalar 404 qaytarmasligi uchun **index.html’ga fallback**.

## SPA uchun asosiy server bloki

```nginx
server {
    listen 80;
    server_name app.example.com;

    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**try_files** variantlarni tartib bilan tekshiradi: fayl mavjudmi, papka mavjudmi, hech narsa topilmasa — `/index.html` ni beradi. Keyin marshrutni brauzerdagi ilova routeri qayta ishlaydi.

## Assetlarni keshlash

Yig‘uvchilar (Vite, webpack va boshqalar) fayl nomiga tarkib heshini qo‘shadi: `app.3f9a1c.js`. Fayl o‘zgarsa, nomi ham o‘zgaradi. Demak, bunday fayllarni uzoq muddat keshlash mumkin, `index.html` ni esa yo‘q, aks holda foydalanuvchilar yangi versiyani ko‘rmaydi.

```nginx
server {
    listen 80;
    server_name app.example.com;
    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

| Fayl turi | Kesh siyosati |
|---|---|
| Heshlangan JS, CSS, shriftlar | Uzoq kesh, `immutable` |
| `index.html` | `no-cache` — brauzer har safar qayta tekshiradi |
| Nomida heshi yo‘q rasmlar | O‘rtacha kesh yoki nomga hesh qo‘shish |

`/assets/` dagi `try_files $uri =404` ga e’tibor bering: mavjud bo‘lmagan JS fayl 200 kodli `index.html` emas, halol 404 qaytarishi kerak. Aks holda brauzer skript o‘rniga HTML oladi va tushunarsiz xato chiqaradi.

`/assets/` yo‘li yig‘uvchiga bog‘liq — u fayllarni qayerga joylashini tekshiring.

## Ko‘p sahifali statik sayt

Har bir sahifa alohida HTML fayl bo‘lgan sayt uchun (statik sayt generatorlari, lendinglar) index.html’ga fallback kerak emas. Uning o‘rniga kengaytmasiz manzillar va o‘z 404 sahifasini qo‘llab-quvvatlash kerak:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    error_page 404 /404.html;
}
```

## Bitta serverda bir nechta sayt

Nginx blokni Host sarlavhasi va **server_name** direktivasi bo‘yicha tanlaydi. Har bir saytga alohida fayl:

- `/etc/nginx/sites-available/app.example.com` va `sites-enabled` da unga havola, yoki
- `/etc/nginx/conf.d/app.example.com.conf` — distributivga qarab.

Har bir faylda o‘z `server_name` va `root` ga ega alohida `server` bo‘ladi. Noma’lum domenlarga so‘rovlar tasodifiy saytga tushmasligi uchun `listen 80 default_server;` va `return 444;` bilan alohida blok qo‘shing.

## Ko‘p uchraydigan xatolar

- **SPA uchun fallback yo‘q.** Bosh sahifa ishlaydi, lekin `/dashboard` da sahifani yangilash 404 beradi.
- **index.html’ga uzoq kesh.** Deploydan keyin foydalanuvchilar keshni tozalamaguncha eski versiyani ko‘radi.
- **Yo‘qolgan sarlavhalar.** Location ichidagi `add_header` server darajasidagi barcha `add_header` larni bekor qiladi. Agar server darajasida xavfsizlik sarlavhalari berilgan bo‘lsa, ularni location’da takrorlang yoki umumiy include’ga chiqaring.
- **Noto‘g‘ri huquqlar.** Nginx ishlaydigan foydalanuvchi sayt papkasini o‘qish huquqiga ega bo‘lishi kerak.
- **Tekshirmasdan qo‘llash.** `systemctl reload nginx` dan oldin har doim `nginx -t` ni ishga tushiring.

## FAQ

### Nega SPA sahifa yangilanganda 404 qaytaradi?

Brauzer serverdan `/orders/42` kabi yo‘lni so‘raydi, diskda esa bunday fayl yo‘q. `try_files $uri $uri/ /index.html` index.html’ni beradi va marshrutni ilova routeri qayta ishlaydi.

### Deploydan keyin foydalanuvchilar yangi versiyani darhol olishi uchun nima qilish kerak?

`index.html` ni `Cache-Control: no-cache` bilan, assetlarni esa nomida hesh va uzoq kesh bilan bering. Yangi index.html yangi fayllarga havola qiladi.

### Sayt CDN yoki statik hostingda joylashgan bo‘lsa, Nginx kerakmi?

Shart emas: bunday platformalar fallback va keshlashni o‘z sozlamalari orqali hal qiladi. Nginx sayt o‘zingizning serveringiz yoki VPS’da joylashganda kerak.
