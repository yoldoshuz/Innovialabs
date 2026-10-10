---
title: 301 va 302 redirektlar: farqi va SEO ga ta’siri
description: Doimiy va vaqtinchalik redirektlar, 307 va 308 kodlari, meta refresh, yo‘naltirish zanjirlari va sikllari hamda qaysi holatda qaysi turni tanlashni ko‘ramiz.
summary: 301 qidiruv tizimiga sahifa butunlay ko‘chganini va indeksda eski manzilni yangisiga almashtirish kerakligini, 302 esa ko‘chish vaqtinchalik ekanini bildiradi; manzil o‘zgarganda deyarli har doim 301 kerak.
---
## Asosiy farq

**Redirekt** — brauzer va robotni bir URL dan boshqasiga yuboradigan server javobi.

- **301 Moved Permanently** — sahifa **butunlay** ko‘chgan. Qidiruv tizimi indeksda eski manzilni yangisiga almashtiradi va signallarni unga o‘tkazadi.
- **302 Found** — ko‘chish **vaqtinchalik**. Qidiruv tizimi odatda indeksda eski URL ni qoldiradi, chunki uning qaytishini kutadi.

Oddiy qoida: eski manzil boshqa qaytmasa, **301** kerak. Qaytsa — **302**.

## 307 va 308 nima

307 va 308 kodlari HTTP metodlari bilan bog‘liq noaniqlikni bartaraf etish uchun paydo bo‘lgan. Brauzerlar tarixan 301 va 302 da POST so‘rovini GET ga aylantirishi mumkin edi.

| Kod | Turi | So‘rov metodi saqlanadi |
|---|---|---|
| 301 | doimiy | kafolatlanmaydi |
| 302 | vaqtinchalik | kafolatlanmaydi |
| 307 | vaqtinchalik | ha |
| 308 | doimiy | ha |

SEO uchun **308 xuddi 301 kabi**, **307 esa 302 kabi** ishlaydi. GET orqali ochiladigan oddiy sahifalar uchun farq deyarli sezilmaydi. 307/308 API va formalar uchun muhim.

Alohida eslatma: domen uchun HSTS yoqilgan bo‘lsa, brauzer «307 Internal Redirect» ni ko‘rsatishi mumkin. Bu serveringiz javobi emas, brauzerning ichki xatti-harakati.

## Qachon qaysi redirekt kerak

| Vaziyat | Kod |
|---|---|
| Yangi domenga ko‘chish | 301 |
| HTTP dan HTTPS ga o‘tish | 301 |
| www va www siz manzilni birlashtirish | 301 |
| URL tuzilmasini o‘zgartirish, muqobili bor eski sahifani o‘chirish | 301 |
| Vaqtinchalik aksiya yoki texnik xizmat sahifasi | 302 |
| Turli URL lar bilan A/B test | 302 |
| Til yoki geolokatsiya bo‘yicha yo‘naltirish | 302, foydalanuvchiga tanlash imkonini bergan ma’qul |
| API da POST so‘rovlarini yo‘naltirish | 307 yoki 308 |

Agar vaqtinchalik 302 oylab turib qolsa, Google vaqt o‘tib uni doimiy deb qabul qila boshlashi mumkin. Lekin bunga tayanmang: darhol to‘g‘ri kodni qo‘ying.

## Meta refresh va JavaScript redirektlar

Yo‘naltirishni sahifa tomonida ham qilish mumkin:

```html
<meta http-equiv="refresh" content="0; url=https://example.com/new-page">
```

Google odatda darhol ishlaydigan meta refresh ni doimiy, kechikishli variantni esa vaqtinchalik deb talqin qiladi. JavaScript redirektni robot faqat sahifa chizilgandan keyin ko‘radi. Ikkala variant ham server sozlamalariga kirish imkoni bo‘lmaganda zaxira yo‘l. **Server redirekti har doim ishonchliroq.**

## Zanjirlar va sikllar

**Zanjir** — A sahifa B ga, B esa C ga, C esa D ga olib boradi. Har bir qadam yuklanishni sekinlashtiradi, robot resurslarini sarflaydi, qidiruv tizimlari esa cheklangan miqdordagi o‘tishlarni bosib o‘tadi.

**Sikl** — A sahifa B ga, B esa yana A ga olib boradi. Sahifa umuman ochilmaydi, brauzer xato ko‘rsatadi.

Qanday oldini olish mumkin:

- Eski URL larni oraliq manzillar orqali emas, **to‘g‘ridan-to‘g‘ri yakuniy manzilga** yo‘naltiring.
- Har bir migratsiyadan keyin eski qoidalarni yangilang, ular o‘zi ham redirektga aylangan manzillarga ishora qilmasin.
- Redirektlarga tayanmasdan, ichki havolalarni yangi URL larga almashtiring.
- Zanjirlarni sayt krauleri yoki buyruq satri orqali tekshiring:

```bash
curl -sIL http://example.com/old-page | grep -iE "^(HTTP|location)"
```

## nginx dagi sozlash misoli

HTTP va www ni bitta o‘tishda bitta manzilga birlashtirish:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}
```

## Keng tarqalgan xatolar

- Sayt ko‘chganda «har ehtimolga qarshi» 302 qo‘yish.
- Barcha o‘chirilgan sahifalarni bosh sahifaga yo‘naltirish. Qidiruv tizimlari buni soft 404 deb hisoblashi mumkin; mazmunan yaqin bo‘limga yo‘naltirgan yoki 404/410 qaytargan ma’qul.
- 301 ni brauzerda keshni tozalamasdan sinash: brauzerlar doimiy redirektlarni uzoq vaqt eslab qoladi.
- sitemap.xml ni unutish: unda faqat yakuniy URL lar bo‘lishi kerak.

## FAQ

### 301 redirektda sahifa vazni yo‘qoladimi?

Google 3xx redirektlar reyting signallarining yo‘qolishiga olib kelmasligini ta’kidlaydi. Ammo zanjirlar va nomuvofiq sahifalarga noaniq yo‘naltirishlar baribir zarar qiladi, shuning uchun puxta sozlash muhim.

### Ko‘chishdan keyin 301 redirektni qancha vaqt saqlash kerak?

Imkon qadar uzoq, kamida yangi URL lar indeksda eskilarini to‘liq almashtirgunga va eski manzillarga trafik kelishi to‘xtaguncha. Odamlar boshqa saytlardagi eski havolalar orqali yillar davomida o‘tishi mumkin.

### API uchun nimani tanlash kerak: 301 yoki 308?

API va formalar uchun doimiy ko‘chishda 308, vaqtinchalikda esa 307 yaxshiroq: ular so‘rov metodi va tanasi o‘zgarmasligini kafolatlaydi.
