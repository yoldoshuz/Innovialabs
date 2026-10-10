---
title: Meta Conversions API: qanday sozlash va hodisalar dublidan qochish
description: Meta Conversions API ni ulash usullari, event_id orqali piksel bilan deduplikatsiya, Event Match Quality, ma’lumotlarni xeshlash va Events Managerda tekshirish.
summary: Conversions API hodisalarni piksel bilan parallel ravishda serveringizdan Metaga yuboradi; ular ikki marta hisoblanmasligi uchun ikkala manba bir xil event_name va event_id yuborishi, yaxshi moslashtirish uchun esa normallashtirilgan va SHA-256 bilan xeshlangan mijoz ma’lumotlari kerak.
---
## Qisqa javob: bu qanday ishlaydi

**Meta Conversions API (CAPI)** — hodisalarni (ariza, xarid, ro‘yxatdan o‘tish) Metaga brauzerdan emas, serverdan yuborish. Odatda CAPI **piksel bilan birga** ishlaydi:

- piksel brauzerdagi hodisalarni ushlaydi va saytdagi xatti-harakat haqida ma’lumot beradi;
- CAPI xuddi shu hodisalarni serverdan yuboradi va brauzer so‘rovi bloklangan yoki yo‘qolgan bo‘lsa ham yetkazadi;
- Meta juftliklarni **deduplikatsiya** qiladi va har bir hodisani bir marta hisoblaydi — agar bir xil identifikatorlarni yuborgan bo‘lsangiz.

Bundan tashqari, server brauzerda umuman bo‘lmagan hodisalarni ham yuborishi mumkin: masalan, CRMda tasdiqlangan to‘lov.

## Ulash variantlari

| Usul | Qachon mos | Nimaga e’tibor berish kerak |
|---|---|---|
| **Hamkor integratsiyasi** (CMS, konstruktorlar, e-commerce platformalar) | Sayt mashhur platformada | Moslashuvchanlik cheklangan, event_id uzatilishini tekshiring |
| **Conversions API Gateway** | Backend ishlab chiqmasdan tez kerak | Sizning bulutingizda joylashadi, hosting talab qiladi |
| **Server GTM** | Server tomonida kuzatish allaqachon ishlatilmoqda | Veb-konteynerdan event_id to‘g‘ri uzatilishi kerak |
| Graph API orqali **to‘g‘ridan-to‘g‘ri integratsiya** | O‘z ishlanmangiz, backend va CRMdan hodisalar | Maksimal moslashuvchanlik, lekin hammasi sizning zimmangizda |

## event_id orqali deduplikatsiya

Meta ikki hodisani, agar ularning **event_name** va **event_id** si mos kelsa va ular bitta pikselga tegishli bo‘lsa, dubl deb hisoblaydi. Demak, ID bir marta yaratilib, ikkala kanalga uzatilishi kerak.

Brauzerda:

```js
const eventId = crypto.randomUUID();
fbq('track', 'Lead', { value: 0, currency: 'USD' }, { eventID: eventId });
// xuddi shu eventId forma ma’lumotlari bilan birga serveringizga yuboriladi
```

Serverda xuddi shu qiymat `event_id` maydoniga yoziladi:

```json
{
  "data": [{
    "event_name": "Lead",
    "event_time": 1760000000,
    "event_id": "ayni-uuid",
    "action_source": "website",
    "event_source_url": "https://example.com/contacts",
    "user_data": {
      "em": ["<sha256 email>"],
      "ph": ["<sha256 phone>"],
      "client_ip_address": "203.0.113.10",
      "client_user_agent": "Mozilla/5.0 ...",
      "fbp": "fb.1.1700000000000.123456789",
      "fbc": "fb.1.1700000000000.AbCdEf"
    }
  }]
}
```

Dubllarning ko‘p uchraydigan sabablari: hodisa nomining turlicha yozilishi (`Lead` va `lead`), event_id brauzer va serverda alohida yaratilishi, server hodisasi juda katta kechikish bilan yuborilishi.

## Event Match Quality

**Event Match Quality (EMQ)** — Events Managerdagi baho bo‘lib, Meta server hodisalaringizni foydalanuvchi akkauntlari bilan qanchalik yaxshi moslashtira olishini ko‘rsatadi. U qancha yuqori bo‘lsa, atributsiya va optimallashtirish shuncha aniq.

Qanday yaxshilash mumkin:

- foydalanuvchi qoldirgan bo‘lsa, **email va telefon**ni yuboring;
- **fbp** (`_fbp` cookie) va **fbc** (`_fbc` cookie yoki URLdagi `fbclid` parametri) ni yuboring;
- serveringizning emas, mijozning **IP-manzili va user agent**ini qo‘shing;
- **external_id** dan foydalaning — piksel va CAPIda bir xil bo‘lgan ichki foydalanuvchi ID.

## Mijoz ma’lumotlarini xeshlash

Shaxsiy ma’lumotlar (email, telefon, ism, shahar va boshqalar) yuborishdan oldin **normallashtirilishi va SHA-256 bilan xeshlanishi** kerak. IP, user agent, fbp va fbc xeshlanmaydi.

```js
import { createHash } from 'node:crypto';

const sha256 = (v) => createHash('sha256').update(v).digest('hex');

const em = sha256(' User@Example.com '.trim().toLowerCase());
const ph = sha256('+998 90 123-45-67'.replace(/\D/g, '')); // faqat raqamlar, mamlakat kodi bilan
```

Normallashtirishdagi xato (bo‘sh joy, bosh harf, raqamdagi plyus belgisi) boshqa xesh beradi va moslik bo‘lmaydi.

## Events Managerda tekshirish

1. **Test Events** ni oching, `test_event_code` ni oling va nosozliklarni tuzatish vaqtida uni server so‘roviga qo‘shing.
2. Saytda harakat bajaring va hodisa ham brauzerdan, ham serverdan kelganiga ishonch hosil qiling.
3. Hodisa tafsilotlarida **deduplikatsiya** holatini tekshiring: juftlik qayta ishlangan deb belgilanishi kerak.
4. Biroz vaqtdan keyin **EMQ** va xatolar hamda tavsiyalar ko‘rsatilgan **Diagnostics** bo‘limini ko‘ring.
5. Prodakshnga chiqarishdan oldin `test_event_code` ni olib tashlang.

So‘rov formati tafsilotlari — [Meta hujjatlarida](https://developers.facebook.com/docs/marketing-api/conversions-api).

## FAQ

### Pikselsiz faqat CAPI dan foydalansa bo‘ladimi?

Texnik jihatdan ha, lekin Meta ikkalasini birga ishlatishni tavsiya qiladi: piksel brauzerdan xatti-harakat signallarini, CAPI esa ishonchli yetkazish va server hodisalarini beradi.

### CAPI uchun foydalanuvchi roziligi kerakmi?

Ha. Serverdan yuborish rozilik va shaxsiy ma’lumotlarni qayta ishlash talablarini o‘zgartirmaydi. Hodisalarni faqat qonuniy asos bo‘lganda yuboring.

### Hammasi sozlangan bo‘lsa ham EMQ nega past?

Ko‘pincha email yoki telefon yuborilmaydi, ma’lumotlar xeshlashdan oldin noto‘g‘ri normallashtiriladi yoki mijoz IP si o‘rniga server IP si yuboriladi.
