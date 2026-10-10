---
title: Content Security Policy (CSP): sozlash bo‘yicha amaliy qo‘llanma
description: CSP direktivalari, nonce va xeshlar, report-only rejimi, uchinchi tomon skriptlari va analitika hamda yumshoq siyosatdan qat’iysiga bosqichma-bosqich yo‘l.
summary: CSP — brauzer sahifada qaysi skriptlar va boshqa resurslarni ishga tushirishi mumkinligini sanab beruvchi javob sarlavhasi; eng ishonchli variant — strict-dynamic bilan nonce’ga asoslangan siyosat bo‘lib, unga hech narsani buzmaslik uchun report-only rejimi orqali asta-sekin o‘tiladi.
---

## Qisqacha javob

**Content Security Policy** — brauzerga skriptlar, stillar, rasmlar, freymlar va tarmoq so‘rovlarini qayerdan yuklash mumkinligini aytadigan sarlavha. Agar buzg‘unchi XSS zaifligi orqali sahifaga `<script>` qo‘sha olsa, yaxshi siyosat brauzerga uni bajarishga yo‘l qo‘ymaydi.

Siyosatlar ikki xil bo‘ladi:

- **Allowlist** — ishonchli domenlar ro‘yxati (`script-src 'self' cdn.example.com`). Boshlash oson, lekin bunday siyosat ko‘pincha JSONP endpoint yoki ruxsat etilgan domendagi eski kutubxona orqali chetlab o‘tiladi.
- **Qat’iy (strict)** — har bir ruxsat etilgan skript **nonce** olib yuradi yoki **xesh** bilan mos keladi. Chetlab o‘tish ancha qiyin, aynan shu tavsiya etilgan maqsad.

## Asosiy direktivalar

| Direktiva | Nimani nazorat qiladi | Odatiy qiymat |
|---|---|---|
| `default-src` | Belgilanmagan fetch-direktivalar uchun zaxira qiymat | `'self'` |
| `script-src` | JavaScript | Nonce + `'strict-dynamic'` |
| `style-src` | CSS | `'self'`, boshida ko‘pincha `'unsafe-inline'` bilan |
| `img-src`, `font-src`, `media-src` | Rasmlar, shriftlar, media | `'self'` va CDN’ingiz, kerak bo‘lsa `data:` |
| `connect-src` | fetch, XHR, WebSocket, analitika ma’lumotlarini yuborish | `'self'` va API hamda analitika manzillari |
| `frame-src` | Siz joylashtiradigan iframe’lar | Faqat ishlatiladigan xizmatlar (xaritalar, video, to‘lovlar) |
| `frame-ancestors` | **Sizning** sahifangizni kim joylashtira oladi | `'self'` yoki `'none'` |
| `object-src` | Flash davri plaginlari | `'none'` |
| `base-uri` | `<base>` tegi | `'none'` yoki `'self'` |
| `form-action` | Formalarni qayerga yuborish mumkin | `'self'` va to‘lov xizmatlari |

E’tibor bering: `frame-ancestors` `default-src` qiymatini meros qilib olmaydi va `<meta>` tegida ishlamaydi — faqat HTTP sarlavhada.

## Nonce va xeshlar

**Nonce:** server har bir javob uchun yangi tasodifiy qiymat yaratadi va uni ham sarlavhaga, ham har bir qonuniy script tegiga qo‘yadi.

```http
Content-Security-Policy: script-src 'nonce-R4nd0mBase64' 'strict-dynamic'; object-src 'none'; base-uri 'none'
```

```html
<script nonce="R4nd0mBase64" src="/app.js"></script>
```

Qo‘shilgan skriptda to‘g‘ri nonce yo‘q, shuning uchun u bajarilmaydi. Nonce oldindan bilib bo‘lmaydigan va **har bir javobda boshqacha** bo‘lishi kerak — kodga qattiq yozilgan nonce foydasiz. Shuning uchun nonce server tomonda render qilinadigan sahifalarga mos keladi; to‘liq statik keshlangan HTML yangi qiymatni olib yura olmaydi.

**Xesh:** statik inline skriptlar uchun ularning aniq mazmunidan olingan `'sha256-...'` ga ruxsat berish mumkin. Skriptdagi har qanday o‘zgarish, hatto bo‘sh joy ham, xeshni o‘zgartiradi. Xeshlar statik saytlarga mos keladi.

**`'strict-dynamic'`** ishonchli skriptga barcha domenlarni sanab o‘tirmasdan boshqa skriptlarni yuklash imkonini beradi. Uni qo‘llab-quvvatlaydigan brauzerlar `script-src`dagi xostlar ro‘yxatini e’tiborsiz qoldiradi, shuning uchun eski brauzerlar uchun zaxira sifatida `https:` ni qoldirish mumkin.

## Report-only rejimi

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-to csp
Reporting-Endpoints: csp="https://example.com/csp-reports"
```

Brauzer buzilishlarni qayd etadi va hisobot yuboradi, lekin hech narsani bloklamaydi. Ba’zi brauzerlarga hali ham eski `report-uri` direktivasi kerak, shuning uchun ko‘p saytlar ikkalasini yuboradi. Shovqinga tayyor bo‘ling: brauzer kengaytmalari va qo‘shilgan panellar sizga aloqasi bo‘lmagan hisobotlarni yaratadi.

## Uchinchi tomon skriptlari va analitika

- **Analitika, chat-vidjetlar, piksellar** o‘z skriptlarini yuklaydi, so‘ng ma’lumotlarni o‘z domenlariga yuboradi. Odatda ularga `script-src` (yoki `strict-dynamic` bilan birga yuklovchida nonce), `connect-src` va `img-src`da yozuvlar kerak. Domenlar ro‘yxatini xizmat hujjatlaridan oling va hisobotlar bilan solishtiring.
- Marketologlar ixtiyoriy HTML joylaydigan **teg menejerlari** aslida har qanday kodga ruxsat beradi. Teglarni kim nashr qila olishini cheklang.
- **Inline ishlovchilar** (`onclick="..."`) va `javascript:` havolalarini qat’iy siyosat bloklaydi. Ularni `addEventListener` bilan almashtiring.
- **`eval` va `new Function`** `'unsafe-eval'` ni talab qiladi. eval’ga global ruxsat berish o‘rniga, ularni ishlatayotgan kutubxonani toping va yangilang yoki almashtiring.

## Yumshoqdan qat’iy siyosatga — bosqichma-bosqich

1. **Inventarizatsiya.** Asosiy sahifa turlarini DevTools bilan oching va barcha tashqi skriptlar, stillar, shriftlar, freymlar va API xostlarini yozib oling.
2. **Report-only’da bazaviy siyosat.** Ko‘rganingizga yaqin report-only siyosatni chiqaring. Real trafikda bir muddat hisobotlar to‘plang.
3. **Avval xavfsiz direktivalarni yoqing:** `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'self'`, `form-action 'self'`. Ular kamdan-kam narsani buzadi.
4. **Kodni tozalang:** inline skriptlarni fayllarga chiqaring yoki ularga nonce bering, inline ishlovchilar va `eval`ni olib tashlang.
5. **`script-src`ni nonce + `'strict-dynamic'`ga** report-only’da o‘tkazing, topilganlarni tuzating, so‘ng bloklashni yoqing.
6. **Stillar va qolganlarini** keyinroq qat’iylashtiring va har bir relizdan keyin hisobotlarni kuzatishda davom eting.

Yakuniy sarlavhani Google CSP Evaluator’da va brauzer konsolida tekshiring.

## FAQ

### CSP’ni sarlavha o‘rniga meta-teg orqali berish mumkinmi?

Qisman. `<meta http-equiv>`dagi siyosat ko‘pchilik direktivalar uchun ishlaydi, lekin frame-ancestors, hisobotlar va sandbox uchun emas. HTTP sarlavha afzalroq.

### style-src 'unsafe-inline' jiddiy teshikmi?

Bu qat’iy siyosatdan zaifroq, lekin qo‘shilgan CSS qo‘shilgan skriptdan ancha kam xavfli. Ko‘p saytlar uni vaqtincha qoldiradi va birinchi navbatda skriptlarni yopadi.

### CSP foydalanuvchi kiritgan ma’lumotlarni ekranlash o‘rnini bosadimi?

Yo‘q. CSP — ekranlash ishlamay qolgan holat uchun sug‘urta. Koddagi chiqishni kodlash va kiritishni tekshirish XSS’dan asosiy himoya bo‘lib qoladi.
