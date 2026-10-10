---
title: Nginx yoki Apache: unumdorlik, sozlash va qo‘llash holatlari
description: Nginx va Apache taqqoslanadi: ulanishlarni qayta ishlash modellari, .htaccess va markaziy konfiguratsiya, statik va dinamik kontent hamda Nginx Apache oldida.
summary: Nginx statik fayllar va ko‘plab bir vaqtdagi ulanishlar bilan yaxshiroq ishlaydi va odatda teskari proksi sifatida qo‘yiladi, Apache esa .htaccess va o‘rnatilgan modullar kerak joyda, masalan shared-xostingda va eski PHP loyihalarda qulay.
---
## Qisqa javob

Yangi loyiha uchun ko‘pincha **Nginx** tanlanadi: u statik fayllarni tez beradi, ko‘p ulanishlarni kam resurs bilan ushlab turadi va ilova oldida teskari proksi sifatida a’lo ishlaydi.

Agar loyiha `.htaccess`ga bog‘langan bo‘lsa, Apache’ning maxsus modullaridan foydalansa yoki asosiy konfiguratsiyaga kirish imkoni yo‘q shared-xostingda joylashgan bo‘lsa, **Apache** hamon oqilona tanlov.

## Ulanishlarni qayta ishlash modellari

### Apache: MPM

Apache so‘rovlarni **MPM** (Multi-Processing Modules) orqali qayta ishlaydi:

- **prefork** — har bir ulanish uchun alohida jarayon. Ishonchli, eski `mod_php` bilan mos, lekin xotirani ko‘p sarflaydi.
- **worker** — har birida bir nechta oqim bo‘lgan jarayonlar.
- **event** — worker’ning rivoji: bo‘sh turgan keep-alive ulanishlar alohida qayta ishlanadi, bu resurslarni sezilarli tejaydi.

### Nginx: hodisalar sikli

Nginx boshidanoq **asinxron, hodisalarga asoslangan model** asosida qurilgan: bir nechta worker jarayon, har biri bloklanmasdan ko‘plab ulanishlarga xizmat qiladi. Bir vaqtdagi va sekin mijozlar ko‘p bo‘lganda xotira sarfi ancha sekin o‘sadi.

## .htaccess va markaziy konfiguratsiya

**Apache** sayt papkalarida `.htaccess` fayllarini qo‘llab-quvvatlaydi. Ularni asosiy konfiguratsiyaga tegmasdan va serverni qayta yoqmasdan o‘zgartirish mumkin.

- Afzallik: shared-xostingda va o‘z qoidalarini o‘zi yozadigan CMS’lar uchun qulay (WordPress, ko‘plab PHP freymvorklar).
- Kamchilik: Apache har bir so‘rovda so‘rov yo‘lidagi barcha papkalarda bu fayllarni tekshiradi, bu ortiqcha ish. Qoidalar loyiha bo‘ylab tarqalib ketadi va ularni tuzatish qiyinroq.

**Nginx** `.htaccess`ni qo‘llab-quvvatlamaydi. Butun konfiguratsiya markaziy fayllarda va `reload` orqali qo‘llanadi.

- Afzallik: tezroq, oldindan aytib bo‘ladigan, tekshirish va Git’da saqlash oson.
- Kamchilik: serverga kirish kerak, mavjud `.htaccess` qoidalarini esa qo‘lda qayta yozishga to‘g‘ri keladi.

## Statik va dinamik kontent

| Vazifa | Nginx | Apache |
|---|---|---|
| Statik fayllar | Juda samarali | Yaxshi, lekin resurs ko‘proq ketadi |
| PHP | PHP-FPM (FastCGI) orqali | `mod_php` yoki PHP-FPM orqali |
| Node.js, Python, Go | Teskari proksi | `mod_proxy` orqali teskari proksi |
| Papkadagi qoidalar | Yo‘q | `.htaccess` |
| Modullar | Yig‘ishda yoki dinamik ulanadi | Boy to‘plam, oson yoqiladi |

Asosiy farq: **Apache PHP’ni o‘z ichida bajara oladi** (`mod_php`), **Nginx esa dinamik so‘rovlarni doim tashqi jarayonga uzatadi**. Ikkalasi uchun ham zamonaviy amaliyot — PHP-FPM.

## Nginx’ni Apache oldiga qachon qo‘yish kerak

Bu sxemada Nginx barcha so‘rovlarni qabul qiladi, statik fayllar va HTTPS’ni o‘zi qayta ishlaydi, dinamik so‘rovlarni esa Apache’ga proksilaydi.

U quyidagi hollarda o‘zini oqlaydi:

- `.htaccess` va Apache modullariga qattiq bog‘langan eski PHP ilovangiz bor va qoidalarni qayta yozish qimmat;
- Apache’ni statik fayllar va sekin mijozlardan tezda bo‘shatish kerak;
- Nginx’ga bosqichma-bosqich, qismlarga bo‘lib o‘tmoqchisiz.

Kamchiliklari: zanjirda ikkita server, ikki xil konfiguratsiya va loglar, ko‘proq nosozlik nuqtalari. Yangi loyihaga odatda bu kerak emas.

## Qanday tanlash kerak

- **Yangi loyiha, SPA, Node.js/Python/Go’dagi API** — teskari proksi sifatida Nginx.
- **O‘z serveringizdagi WordPress yoki boshqa PHP loyiha** — Nginx va PHP-FPM, qoidalar bir marta qayta yoziladi.
- **`.htaccess` majburiy bo‘lgan shared-xosting** — Apache.
- **Tegish qiyin bo‘lgan eski tizim** — oraliq bosqich sifatida Apache oldida Nginx.

## Ko‘p uchraydigan xatolar

- `.htaccess` qoidalarini Nginx’ga so‘zma-so‘z ko‘chirish — sintaksis va mantiq boshqacha.
- event yaxshiroq mos kelsa ham, Apache’ni sababsiz prefork’da qoldirish.
- Bitta Nginx yetarli bo‘lgan joyda «tezlik uchun» ikki serverli zanjir qurish.

## FAQ

### Nginx har doim Apache’dan tezmi?

Statik fayllar va ko‘plab bir vaqtdagi ulanishlarda Nginx odatda samaraliroq. Dinamik kontentda tezlik asosan veb-serverga emas, ilovaning o‘zi va ma’lumotlar bazasiga bog‘liq.

### Nginx’da .htaccess ishlatish mumkinmi?

Yo‘q. Qoidalarni server konfiguratsiyasiga ko‘chirish kerak. Onlayn konvertorlar bor, lekin natijani doim qo‘lda tekshirib, sinab ko‘ring.

### WordPress uchun qaysi biri yaxshiroq?

Ikkalasi ham ishlaydi. Apache soddaroq, chunki WordPress `.htaccess`ni o‘zi boshqaradi. PHP-FPM bilan Nginx odatda resurslarni tejaydi, lekin qayta yozish qoidalarini bir marta qo‘lda sozlashni talab qiladi.
