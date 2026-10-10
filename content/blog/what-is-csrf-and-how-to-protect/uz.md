---
title: CSRF nima va veb-ilovani undan qanday himoya qilish kerak
description: CSRF oddiy tilda: soxta forma foydalanuvchi nomidan qanday amal bajaradi va saytni nima himoya qiladi — tokenlar, double-submit cookie, Origin va SameSite.
summary: CSRF — begona sayt foydalanuvchi brauzerini uning cookie’lari bilan sizning ilovangizga so‘rov yuborishga majbur qiladigan hujum. Himoya: ma’lumotni o‘zgartiruvchi har bir so‘rovda CSRF-token yoki Origin tekshiruvi, qo‘shimcha qatlam sifatida esa SameSite cookie.
---

## CSRF nima

**CSRF (Cross-Site Request Forgery, saytlararo so‘rovni qalbakilashtirish)** — tajovuzkor tizimga kirgan foydalanuvchining brauzerini sizning ilovangizga so‘rov yuborishga majbur qiladigan hujum. Brauzer sessiya cookie’sini so‘rovga avtomatik qo‘shadi va server amalni qonuniy deb hisoblaydi: email o‘zgaradi, pul o‘tkaziladi, ma’lumotlar o‘chiriladi.

Asosiy jihat: hujumchi **javobni ko‘rmaydi** va cookie’ni o‘g‘irlamaydi. Unga so‘rov bajarilishining o‘zi yetarli.

## Soxta forma misoli

Aytaylik, bankda emailni o‘zgartirish formasi bor va u `POST /account/email` yuboradi. Hujumchi o‘z saytiga quyidagi sahifani joylaydi:

```html
<form action="https://bank.example/account/email" method="POST" id="f">
  <input type="hidden" name="email" value="attacker@evil.example">
</form>
<script>document.getElementById('f').submit();</script>
```

Bankka kirgan foydalanuvchi bu sahifani ochadi va forma o‘zi yuboriladi. Agar server faqat cookie’ni tekshirsa, email o‘zgaradi, keyin hujumchi parolni o‘z manziliga tiklaydi.

Holatni o‘zgartiradigan va faqat cookie’ga tayanadigan har qanday amal zaif: formalar, qo‘shimcha ta’sirli `GET` havolalar, o‘z tekshiruvi bo‘lmagan API’lar.

## Himoya usullari

### CSRF-token (synchronizer token)

Server tasodifiy, oldindan aytib bo‘lmaydigan token yaratadi, uni sessiyaga bog‘laydi va har bir formaga qo‘shadi. `POST`, `PUT`, `PATCH`, `DELETE` so‘rovlarida server so‘rov tanasi yoki sarlavhadagi tokenni saqlangani bilan solishtiradi.

Begona sayt sizning sahifangizni o‘qiy olmaydi (buni Same-Origin Policy taqiqlaydi), shuning uchun tokenni bilmaydi. Bu klassik va eng ishonchli variant — ko‘p freymvorklarda (Django, Laravel, Rails, Spring Security) u tayyor holda yoqilgan.

### Double-submit cookie

Serverda sessiya ombori bo‘lmaganda qulay. Token cookie’ga yoziladi va bir vaqtda sarlavha yoki forma maydonida yuboriladi; server ikki qiymat mos kelishini tekshiradi. Muhim: token **imzolangan** (HMAC) va sessiyaga bog‘langan bo‘lishi kerak, aks holda subdomen orqali cookie yoza oladigan hujumchi himoyani aylanib o‘tadi.

### Origin va Referer tekshiruvi

Brauzer saytlararo va `POST` so‘rovlariga `Origin` sarlavhasini qo‘shadi. Server, agar `Origin` sizning domenlaringiz ro‘yxatida bo‘lmasa, o‘zgartiruvchi so‘rovlarni rad etishi mumkin. `Origin` bo‘lmasa, `Referer`ga qarash mumkin. Zamonaviy brauzerlar `Sec-Fetch-Site` ham yuboradi, u orqali `same-origin`ni `cross-site`dan oson ajratish mumkin.

Bu yaxshi qo‘shimcha qatlam va API uchun oddiy variant, lekin bu sarlavhalarsiz kelgan so‘rovlarga qat’iy yondashing — rad eting.

### SameSite cookie

`SameSite` atributi brauzerga cookie’ni saytlararo so‘rovlarda yuborish-yubormaslikni aytadi:

| Qiymat | Xatti-harakat | CSRF’dan himoya |
|---|---|---|
| `Strict` | hech qanday saytlararo so‘rovda yuborilmaydi | kuchli |
| `Lax` | faqat havola orqali o‘tishda (yuqori darajadagi `GET`) yuboriladi | `POST` formalardan himoya qiladi |
| `None` | har doim yuboriladi (`Secure` talab qiladi) | yo‘q |

## Qachon faqat SameSite yetarli

`SameSite=Lax` yoki `Strict` ko‘p ssenariylarni yopadi, lekin faqat unga tayanish quyidagi shartlarning barchasi bajarilganda o‘rinli:

- o‘zgartiruvchi **barcha** amallar `GET` orqali emas, `POST`/`PUT`/`DELETE` orqali bajariladi;
- boshqa birov boshqaradigan subdomenlar yo‘q: SameSite aniq origin’ni emas, butun saytni (`*.example.com`) «o‘ziniki» deb hisoblaydi;
- cookie’larda `SameSite` brauzer standartiga qoldirilmay, aniq belgilangan;
- foydalanuvchilar bu atributni qo‘llaydigan brauzerlardan foydalanadi.

Agar birortasi bajarilmasa — token yoki Origin tekshiruvini qo‘shing. Bank, admin panel va to‘lov operatsiyalari uchun to‘g‘ri tanlov — **token va SameSite birgalikda**.

## Ko‘p uchraydigan xatolar

- Ma’lumotni `GET` orqali o‘zgartirish (`/delete?id=5`) — bunday havolalar `SameSite=Lax`da ham ishlaydi.
- Token faqat yuborilgan bo‘lsa tekshiriladi: token yo‘qligi rad etishni anglatishi kerak.
- Barcha foydalanuvchilar uchun bitta token yoki loglar va `Referer` orqali sizib chiqadigan URL’dagi token.
- CORS himoya qiladi deb o‘ylash — CORS so‘rov yuborishni emas, javobni kim o‘qishini boshqaradi.
- Formalar himoyalangan, lekin `text/plain` yoki `application/x-www-form-urlencoded`ni ham qabul qiladigan JSON API unutilgan.

Batafsil tahlil — [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) hujjatida.

## FAQ

### API Authorization sarlavhasidagi tokendan foydalansa, CSRF himoyasi kerakmi?

Agar token JavaScript’da saqlansa va sarlavhaga qo‘lda qo‘shilsa, brauzer uni avtomatik qo‘shmaydi, shuning uchun klassik CSRF ishlamaydi. Autentifikatsiya cookie’ga o‘tishi bilan xavf qaytadi.

### HTTPS CSRF’dan himoya qiladimi?

Yo‘q. HTTPS trafikni shifrlaydi, lekin soxta so‘rovni foydalanuvchining o‘z brauzeri xuddi shu himoyalangan kanal orqali yuboradi.

### CSRF XSS’dan nimasi bilan farq qiladi?

XSS’da begona kod sizning saytingiz ichida ishlaydi va sahifani, jumladan CSRF-tokenni ham o‘qiy oladi. Shuning uchun XSS CSRF’ga qarshi ko‘p himoyalarni aylanib o‘tadi va ikkala zaiflikni ham yopish kerak.
