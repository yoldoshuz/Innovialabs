---
title: HSTS nima va uni qanday xavfsiz yoqish mumkin
description: HSTS SSL stripping’dan qanday himoya qiladi, max-age va includeSubDomains’ni qanday tanlash, preload ro‘yxati va subdomenlarni buzmasdan joriy etish.
summary: HSTS — brauzerga belgilangan muddat davomida domeningizga faqat HTTPS orqali kirishni buyuradigan javob sarlavhasi, u pasaytirish hujumlarini bloklaydi; uni bosqichma-bosqich yoqing: max-age’ni asta oshiring, includeSubDomains va preload’ni esa barcha subdomenlar HTTPS’da ishlagandan keyingina qo‘shing.
---

## Qisqacha javob

**HSTS (HTTP Strict Transport Security)** — bitta javob sarlavhasi:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Uni HTTPS orqali olgan brauzer keyingi `max-age` soniya davomida:

- domeningizga har qanday `http://` so‘rovni tarmoqqa yuborishdan oldin o‘zi `https://` ga aylantiradi;
- shu domendagi sertifikat xatosida foydalanuvchiga «baribir davom etish» imkonini bermaydi.

## HSTS qaysi hujumdan himoya qiladi

HTTP’dan HTTPS’ga redirekt yetarli emas. Foydalanuvchi `example.com` deb yozganda yoki eski `http://` havolani ochganda, **brauzerning birinchi so‘rovi shifrlanmasdan ketadi**. Shu Wi-Fi’dagi yoki buzilgan routerdagi buzg‘unchi uni ushlab qolib, **SSL stripping** qilishi mumkin:

1. Hujumchi foydalanuvchiga oddiy HTTP orqali javob beradi.
2. Bir vaqtda u haqiqiy serveringiz bilan HTTPS orqali muloqot qiladi va sahifalarni uzatib turadi.
3. Foydalanuvchi qulfsiz ishlayotgan saytni ko‘radi va parolini kiritadi, hujumchi esa uni o‘qiydi.

HSTS bilan brauzer birinchi HTTP so‘rovni umuman yubormaydi — ushlab qoladigan narsa yo‘q. Faqat eng birinchi tashrif qoladi, brauzer hali sarlavhani ko‘rmagan payt — uni **preload ro‘yxati** yopadi.

## Direktivalar

| Direktiva | Nima qiladi | Tavsiya |
|---|---|---|
| `max-age` | Brauzer qoidani necha soniya eslab qoladi | Asta-sekin bir yoki ikki yilgacha oshiring |
| `includeSubDomains` | Qoidani barcha subdomenlarga tatbiq etadi | Faqat barcha subdomenlar tekshirilgandan keyin |
| `preload` | Brauzerlarning ichki ro‘yxatlariga kiritishga rozilikni bildiradi | Faqat barqaror joriy etilgandan keyin, quyida qarang |

Brauzerlar oddiy HTTP orqali kelgan sarlavhani e’tiborsiz qoldiradi, shuning uchun uni HTTPS javoblarida berish kerak.

## Xavfsiz joriy etish rejasi

1. **Subdomenlar ro‘yxatini tuzing.** DNS yozuvlari, eski admin panellar, pochtaning veb-interfeyslari, staging, ichki xizmatlar, uskunalar. Har birida amaldagi sertifikat va ishlaydigan HTTPS bo‘lishi kerak.
2. **Kichikdan boshlang:** `includeSubDomains`siz `max-age=300`. Sayt, kirish, to‘lov va ichki vidjetlarni tekshiring.
3. **Bosqichma-bosqich oshiring:** bir kun (`86400`), bir hafta (`604800`), bir oy (`2592000`). Bosqichlar orasida xatolarni kuzating.
4. **`includeSubDomains` qo‘shing**, yana qisqa max-age bilan, so‘ng uni oshiring.
5. **Bir yilga** (`31536000`) yoki ikki yilga (`63072000`) yeting.
6. **Preload’ni** faqat butun domen HTTPS’da qolishiga ishonchingiz komil bo‘lganda ko‘rib chiqing.

Agar biror narsa buzilsa, `max-age=0` bering. Bu qoidani faqat qayta kiradigan brauzerlarda tozalaydi — uzun max-age olgan va qaytmagan foydalanuvchilar uning muddati tugaguncha HTTPS’ga bog‘langan bo‘lib qoladi. Shuning uchun bosqichma-bosqichlik muhim.

## Preload ro‘yxati

Brauzerlar birinchi tashrifdanoq faqat HTTPS orqali ishlaydigan domenlarning ichki ro‘yxati bilan keladi. Domenni hstspreload.org’ga topshirish uchun odatda quyidagilar kerak:

- amaldagi sertifikat va o‘sha xostda HTTP’dan HTTPS’ga redirekt;
- barcha subdomenlar HTTPS orqali ishlaydi;
- asosiy domenda kamida bir yillik `max-age`, shuningdek `includeSubDomains` va `preload` bilan sarlavha.

O‘chirish mumkin, lekin sekin: u foydalanuvchilarga faqat brauzerlarning yangi versiyalari bilan yetib boradi. Preload’ni butun domen, jumladan kelajakda yaratiladigan subdomenlar uchun uzoq muddatli majburiyat deb hisoblang.

## nginx’da sozlash va ko‘p uchraydigan tuzoq

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

- `always` nginx’ni sarlavhani xato javoblarida ham berishga majbur qiladi.
- Agar `location` blokida o‘zining `add_header`i bo‘lsa, nginx `server` darajasidagi sarlavhalarni **meros qilib olmaydi** va HSTS u yerda jimgina yo‘qoladi. Uni takrorlang yoki umumiy sarlavhalarni alohida include faylga chiqaring.

Tekshirish:

```bash
curl -sI https://example.com | grep -i strict-transport-security
```

Chrome’da domen uchun saqlangan qoidani `chrome://net-internals/#hsts` sahifasida ko‘rish va o‘chirish mumkin.

## Ko‘p uchraydigan xatolar

- `includeSubDomains` yoqilgan, ichki yoki eski subdomen esa faqat HTTP’da ishlaydi.
- Darhol bir yillik max-age qo‘yilgan.
- Domen kelajakdagi subdomenlar uchun rejasiz, «har ehtimolga qarshi» preload’ga topshirilgan.
- Sarlavha faqat ilovada berilgan, statik fayllar va xato sahifalari esa usiz qaytariladi.
- Lokal ishlab chiqish uchun `.dev` yoki `.app` ishlatiladi: bu zonalar to‘liq preload ro‘yxatida va HTTPS talab qiladi.

## FAQ

### HTTPS’ga 301-redirekt yetarli emasmi?

Yo‘q. Redirektning o‘zi oddiy HTTP orqali keladi va uni ushlab qolish mumkin. HSTS brauzerni HTTP so‘rovni umuman o‘tkazib yuborishga majbur qiladi.

### Oxir-oqibat max-age qancha bo‘lishi kerak?

Bir yil — keng tarqalgan maqsad va preload uchun minimum; ikki yil ham ko‘p ishlatiladi. Bunga daqiqalardan boshlab, asta-sekin yeting.

### HSTS’ni bekor qilish mumkinmi?

Ha, max-age=0 berib, lekin qoidani faqat qayta kiradigan brauzerlar unutadi. Preload ro‘yxatidagi domenlar uchun o‘chirish ancha ko‘p vaqt oladi.
