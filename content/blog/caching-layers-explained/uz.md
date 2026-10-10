---
title: Keshlash darajalari: brauzer, CDN, reverse proxy va ilova keshi
description: So‘rov yo‘lida ma’lumotlar qayerda keshlanadi: brauzer, CDN, reverse proxy, ilova. Har bir darajada nimani keshlash va eskirgan ma’lumotdan qanday qochish.
summary: Kesh to‘rt darajada ishlaydi — brauzer, CDN, reverse proxy va ilova; statika foydalanuvchiga imkon qadar yaqin keshlanadi, shaxsiy ma’lumotlar faqat ilovada, asosiy qiyinchilik esa hamma joyda bitta: eskirganini o‘z vaqtida tozalash.
---
## Kesh qayerda yashaydi

Foydalanuvchi so‘rovi uzoq yo‘l bosib o‘tadi: brauzer → CDN → reverse proxy (masalan, nginx) → ilova → ma’lumotlar bazasi. Har bir qadamda javobni saqlab, keyingi safar uzoqroqqa bormasdan berish mumkin. Kesh **foydalanuvchiga qanchalik yaqin** ishlasa, javob shunchalik tez va serverga yuklama shunchalik kam.

| Daraja | Qayerda joylashgan | Nimani keshlash | Nima bilan boshqariladi |
|---|---|---|---|
| **Brauzer** | Foydalanuvchi qurilmasida | JS, CSS, shriftlar, rasmlar | `Cache-Control`, `ETag` sarlavhalari |
| **CDN** | Dunyo bo‘ylab tugunlar | Statika, ommaviy sahifalar | Sarlavhalar + CDN sozlamalari |
| **Reverse proxy** | Ilovangiz oldida | Ommaviy HTML sahifalar, API javoblari | nginx/Varnish konfiguratsiyasi |
| **Ilova** | Redis, Memcached, jarayon xotirasi | Bazaga so‘rovlar natijalari, hisob-kitoblar | Ilova kodi |

## Brauzer

Brauzer saqlangan fayldan foydalanish-foydalanmaslikni javob sarlavhalariga qarab hal qiladi:

- `Cache-Control: max-age=...` — fayl necha soniya yangi hisoblanadi;
- `immutable` — fayl hech qachon o‘zgarmaydi, qayta tekshirish shart emas;
- `no-cache` — saqlash mumkin, lekin ishlatishdan oldin serverdan so‘rash kerak;
- `no-store` — umuman saqlamaslik (shaxsiy va maxfiy ma’lumotlar uchun);
- `ETag` / `Last-Modified` — serverga faylni qayta yubormasdan `304 Not Modified` deb javob berish imkonini beradi.

**Ishlaydigan sxema:** nomida xesh bor fayllar (`app.3f9a1c.js`) `immutable` bilan uzoq muddatga keshlanadi, HTML esa `no-cache` bilan, shunda deploy’dan keyin foydalanuvchi darhol yangi versiyani oladi. Zamonaviy yig‘uvchilar xeshlarni avtomatik qo‘shadi.

## CDN

**CDN** fayllar nusxalarini turli mintaqalardagi serverlarda saqlaydi va foydalanuvchiga eng yaqin tugundan beradi.

- Statika, rasmlar, video va ommaviy sahifalar uchun juda mos.
- `Cache-Control` va `s-maxage` (umumiy keshlar uchun alohida muddat) sarlavhalarini hisobga oladi.
- Tozalash uchun **purge** bor — URL, teg bo‘yicha yoki to‘liq.

Xavf: CDN keshlamasligi kerak bo‘lgan narsani, masalan avtorizatsiyadan o‘tgan foydalanuvchi ma’lumotlari bor sahifani keshlashi mumkin. Shaxsiy ma’lumotli javoblarni `private` yoki `no-store` bilan belgilang.

## Reverse proxy

Ilova oldidagi nginx yoki Varnish tayyor javoblarni saqlab, har bir so‘rovda backend’ga murojaat qilmasligi mumkin. Bu ayniqsa og‘ir ommaviy sahifalar uchun foydali: katalog, maqolalar, lendinglar.

```nginx
proxy_cache_path /var/cache/nginx keys_zone=pages:10m max_size=1g inactive=60m;

server {
    location / {
        proxy_cache pages;
        proxy_cache_valid 200 5m;
        proxy_cache_bypass $cookie_session;
        proxy_no_cache $cookie_session;
        proxy_pass http://app;
    }
}
```

Bu yerda sahifalar 5 daqiqaga keshlanadi, sessiya cookie’si bor so‘rovlar esa keshni chetlab o‘tadi — shunda tizimga kirgan foydalanuvchi boshqalarning ma’lumotlarini ko‘rmaydi.

## Ilova keshi

Ilova ichida olish qimmat bo‘lgan narsalar keshlanadi: bazaga sekin so‘rovlar natijalari, tashqi API javoblari, murakkab hisob-kitoblar. Odatda kesh ilovaning barcha nusxalari uchun umumiy bo‘lishi uchun **Redis** yoki Memcached ishlatiladi.

Odatiy pattern — **cache-aside**: ilova avval keshga qaraydi, topilmasa bazaga boradi va natijani TTL bilan keshga qo‘yadi.

## Invalidatsiya strategiyalari

Eskirgan keshni tozalash — eng qiyin qism. Asosiy yondashuvlar:

- **TTL (yashash muddati).** Oddiy va ishonchli, lekin muddat tugaguncha ma’lumot eskirgan bo‘lishi mumkin.
- **Kalitlar va URL versiyalash.** Faylning yangi versiyasi — yangi nom (nomda xesh), eski kesh shunchaki ishlatilmay qoladi.
- **O‘zgarishda aniq tozalash.** Mahsulot yangilandi — uning Redis’dagi kalitini o‘chirdik va CDN’da purge qildik.
- **stale-while-revalidate.** Biroz eskirgan javobni darhol beramiz va uni fonda yangilaymiz.

## Ko‘p uchraydigan xatolar

- **Versiyasiz keshlangan HTML.** Deploy’dan keyin foydalanuvchilar o‘chirilgan fayllarga havolali eski sahifani ko‘radi.
- **Umumiy keshda shaxsiy ma’lumotlar.** Eng xavfli xato: bir foydalanuvchi boshqasining ma’lumotlarini ko‘radi.
- **Cache stampede.** Mashhur kalit muddati tugaydi va yuzlab so‘rovlar bir vaqtda bazaga boradi. Bloklashlar, TTL’ni tasodifiy tarqatish va stale-while-revalidate yordam beradi.
- **Kesh yagona xotira sifatida.** Redis tozalanishi mumkin; ma’lumotlar asosiy manbadan tiklanishi kerak.
- **Hamma narsani keshlash.** Har bir kesh darajasi — ma’lumot eskirishi mumkin bo‘lgan yana bir joy. Haqiqatan sekinlashtiradigan narsani keshlang.

Sarlavhalar haqida batafsil — [MDN’ning HTTP keshlash bo‘yicha hujjatlarida](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching).

## FAQ

### Qaysi darajadan boshlash kerak?

Statika uchun brauzer va CDN’dan: to‘g‘ri `Cache-Control` sarlavhalari va fayl nomlaridagi xeshlar deyarli xavfsiz holda sezilarli samara beradi. Ilova keshini profillash aniq tor joyni ko‘rsatgandan keyin nuqtaviy qo‘shing.

### Nega deploy’dan keyin ba’zi foydalanuvchilarda saytning eski versiyasi chiqadi?

Odatda HTML brauzer yoki CDN tomonidan juda uzoq keshlangan. HTML’ni `no-cache` yoki qisqa muddat bilan, statikani nomda xesh bilan bering va relizda CDN purge qiling.

### API javoblarini keshlash mumkinmi?

Ha, agar javob barcha foydalanuvchilar uchun bir xil bo‘lsa yoki kesh kalitiga javob bog‘liq bo‘lgan hamma narsani to‘g‘ri kiritsangiz. Shaxsiy ma’lumotli javoblarni faqat ilova darajasida, foydalanuvchi bo‘yicha kalit bilan keshlang.
