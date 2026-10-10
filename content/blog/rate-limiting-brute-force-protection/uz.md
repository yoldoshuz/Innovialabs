---
title: Kirish va API uchun rate limiting va parol tanlashdan himoya
description: Rate limiting algoritmlari, IP va akkaunt bo‘yicha limitlar, bloklash va kechikishlar, CAPTCHA qayerda kerak hamda nginx va Redis da amalga oshirish.
summary: Urinishlarni bir vaqtda IP va akkaunt bo‘yicha cheklang, qattiq bloklash o‘rniga bir necha xatodan keyin o‘sib boruvchi kechikish va CAPTCHA dan foydalaning, hisoblagichlarni Redis kabi umumiy omborda saqlang va ustidan nginx da umumiy limit qo‘ying.
---
## Qisqa javob

**Rate limiting** — bitta manbadan ma’lum vaqt ichida keladigan so‘rovlar sonini cheklash. Kirish shakli va API uchun bu **parolni tanlab topish** (brute-force), SMS kodlarni taxmin qilish va API dan suiiste’mol qilishga qarshi asosiy himoya.

Ko‘pchilik loyihalar uchun ishlaydigan sxema:

- **Ikkita hisoblagich**: IP bo‘yicha va akkaunt (login, email, telefon) bo‘yicha.
- Bir necha muvaffaqiyatsiz urinishdan keyin — abadiy bloklash emas, **CAPTCHA** yoki **o‘sib boruvchi kechikish**.
- Limitlar barcha serverlarda ishlashi uchun **umumiy omborda** (Redis) saqlanadi.
- Ustidan — **nginx** yoki CDN da umumiy limit, u aniq keraksiz trafikni ilovaga yetmasdan kesib tashlaydi.
- Limit oshganda javob — **HTTP 429** va `Retry-After` sarlavhasi.

## Algoritmlar

| Algoritm | Qanday ishlaydi | Qachon mos |
|---|---|---|
| **Fixed window** | Interval (masalan, bir daqiqa) uchun hisoblagich, yangisi boshlanganda nolga tushadi | Oddiy va arzon; oynalar chegarasida ikki baravar sakrash bo‘lishi mumkin |
| **Sliding window** | Kalendar daqiqasi emas, oxirgi N soniyadagi so‘rovlarni hisoblaydi | Kirish va muhim amallar uchun aniqroq |
| **Token bucket** | «Chelak» doimiy tezlikda to‘ladi, har bir so‘rov bitta token oladi | API: o‘rtacha tezlikni cheklab, qisqa sakrashlarga ruxsat beradi |
| **Leaky bucket** | So‘rovlar belgilangan tezlikda o‘tadi, ortiqchasi navbatda kutadi yoki tashlanadi | Yuklamani tekislash; nginx dagi `limit_req` shunday ishlaydi |

Kirish shakli uchun odatda fixed yoki sliding window yetarli, ochiq API uchun — token bucket.

## IP bo‘yicha yoki akkaunt bo‘yicha

- **Faqat IP bo‘yicha** — hujumchi bitta foydalanuvchining parolini minglab manzillardan (botnet, proksi) tanlaydi va limitga urilmaydi. Bundan tashqari, bitta IP ortida butun ofis yoki mobil operator bo‘lishi mumkin.
- **Faqat akkaunt bo‘yicha** — hujumchi bitta mashhur parolni minglab akkauntlarda sinaydi (**password spraying**), har bir akkauntda atigi bitta urinish.

Shuning uchun **ikkalasi ham** kerak: akkaunt bo‘yicha qattiq limit (15 daqiqada bir necha xato), IP bo‘yicha yumshoqroq va kengroq limit (daqiqasiga o‘nlab urinish), hamda ommaviy hujumni aniqlash uchun butun servis bo‘yicha muvaffaqiyatsiz kirishlarning umumiy limiti.

Akkaunt mavjudligini oshkor qilmang: «bunday foydalanuvchi yo‘q» va «parol noto‘g‘ri» holatlarida xato xabari va javob vaqti bir xil bo‘lishi kerak.

## Bloklash yoki kechikish

- N ta xatodan keyin **akkauntni qattiq bloklash** oddiy, lekin xavfli: istalgan kishi noto‘g‘ri parol kiritib, boshqa birovning akkauntini bloklashi mumkin. Bu xizmat ko‘rsatishni to‘xtatish uchun tayyor qurol.
- **Progressiv kechikish** — har bir xatodan keyin pauza o‘sadi (1, 2, 4, 8 soniya...). Parol tanlash befoyda bo‘lib qoladi, haqiqiy foydalanuvchi esa deyarli sezmaydi.
- Egasiga email orqali xabar yuborilgan holda 15-30 daqiqaga **vaqtinchalik bloklash** — oqilona murosa.

## CAPTCHA ni qayerga qo‘yish kerak

- Birinchi kirish urinishiga emas: bir necha kishi uchun hammani bezovta qiladi.
- Uni akkaunt yoki IP bo‘yicha **2-3 xatodan keyin**, shuningdek ro‘yxatdan o‘tish, parolni tiklash va SMS yuborishda ko‘rsating.
- Faqat shubhali tashrif buyuruvchilarga topshiriq ko‘rsatadigan «ko‘rinmas» tekshiruvlarni afzal ko‘ring.
- CAPTCHA limitlarni almashtirmaydi, balki to‘ldiradi: uni yechib beradigan servislar mavjud.

## nginx da amalga oshirish

Bazaviy qatlam — bitta IP dan kirishga so‘rovlar chastotasini cheklash:

```nginx
http {
    limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
    limit_req_status 429;

    server {
        location = /api/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
        }
    }
}
```

`rate=10r/m` — o‘rtacha tezlik, `burst=5` — ruxsat etilgan qisqa sakrash. Agar sayt CDN yoki balanslovchi ortida bo‘lsa, `realip` modulini sozlang, aks holda barcha so‘rovlar proksi IP si bo‘yicha hisoblanadi.

## Redis da amalga oshirish

Ilovada akkaunt bo‘yicha hisoblagich. Lua skripti Redis ichida atomar bajariladi, shuning uchun hisoblagich amal qilish muddatisiz qolib ketmaydi:

```javascript
const script = `
  local c = redis.call("INCR", KEYS[1])
  if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
  return c
`;

async function tooManyAttempts(login) {
  const key = `login:fail:${login.toLowerCase()}`;
  const count = await redis.eval(script, 1, key, 900); // 15 daqiqalik oyna
  return count > 5;
}
```

Muvaffaqiyatsiz kirishda hisoblagichni oshiring, muvaffaqiyatli kirishda nolga tushiring. IP kaliti bilan xuddi shunday hisoblagich — ikkinchi qatlam.

## Ko‘p uchraydigan xatolar

- Limit jarayon xotirasida saqlanadi — bir nechta serverda u ishlamaydi.
- Faqat `/login` himoyalangan, parolni tiklash, SMS kodni tekshirish va API tokenlar esa yo‘q.
- Bir martalik kodni kiritishda limit yo‘q: qisqa raqamli kod tez topiladi.
- Proksi ortida mijozning haqiqiy IP si aniqlanmaydi va limit hammani birdaniga bloklaydi.

## FAQ

### Kirish shakli uchun qanday limitlarni tanlash kerak?

Universal raqamlar yo‘q. Haqiqiy foydalanuvchilarning xatti-harakatidan kelib chiqing: odam kamdan-kam hollarda ketma-ket bir necha martadan ko‘p xato qiladi. Akkaunt bo‘yicha qattiq va IP bo‘yicha yumshoq limitdan boshlang, keyin loglarni kuzatib, to‘g‘rilang.

### Ikki bosqichli autentifikatsiya yoqilgan bo‘lsa, rate limiting kerakmi?

Ha. 2FA taxmin qilingan parol bilan kirishdan himoya qiladi, lekin parolning o‘zini va bir martalik kodlarni tanlashdan, serverga yuklamadan va sizning hisobingizdan SMS yuborilishidan himoya qilmaydi.

### Limit oshganda mijozga nima qaytarish kerak?

429 Too Many Requests kodi va kutish vaqti ko‘rsatilgan `Retry-After` sarlavhasi. Kirish shakli uchun — qaysi limit ishlaganini batafsil aytmaydigan tushunarli xabar.
