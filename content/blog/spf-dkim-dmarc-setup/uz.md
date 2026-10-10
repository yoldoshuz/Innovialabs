---
title: Domeningiz uchun SPF, DKIM va DMARC’ni qanday sozlash kerak
description: SPF, DKIM va DMARC yozuvlari nima qiladi, Google Workspace, Microsoft 365 va boshqa xizmatlar uchun qiymatlar va xatlar spamga tushmasligini tekshirish.
summary: SPF domeningiz nomidan xat yuborishga ruxsat berilgan serverlarni sanab o‘tadi, DKIM har bir xatni kalit bilan imzolaydi, DMARC esa tekshiruvdan o‘tmagan xatlar bilan nima qilishni qabul qiluvchiga aytadi. Uchalasi ham DNS-yozuvlar bo‘lib, ularni haqiqiy xat sarlavhalari orqali tekshirasiz.
---
## Qisqa javob

- **SPF** (Sender Policy Framework) — domendagi TXT-yozuv. Unda domen nomidan xat yuborish huquqiga ega serverlar va xizmatlar ro‘yxati bo‘ladi.
- **DKIM** (DomainKeys Identified Mail) — xatning raqamli imzosi. Pochta xizmati xatni yopiq kalit bilan imzolaydi, ochiq kalit DNS’da turadi va qabul qiluvchi imzoni tekshiradi.
- **DMARC** — SPF va DKIM ustidagi siyosat. U qabul qiluvchiga tekshiruvdan o‘tmagan xatni o‘tkazib yuborish, spamga tushirish yoki rad etishni hamda hisobotlarni qayerga yuborishni aytadi.

Bu yozuvlarsiz Gmail, Outlook va boshqa xizmatlar xatlaringizni ancha ko‘p spamga tushiradi, yirik pochta xizmatlari esa ommaviy jo‘natuvchilardan autentifikatsiyani majburiy talab qiladi.

## 0-qadam: barcha jo‘natuvchilar ro‘yxatini tuzing

DNS’ga tegishdan oldin domeningiz nomidan xat yuboradigan barcha xizmatlarni yozib chiqing:

- korporativ pochta (Google Workspace, Microsoft 365, Zoho Mail va hokazo);
- reklama va tranzaksion xatlar xizmatlari (SendGrid, Mailgun, Mailchimp va boshqalar);
- CRM, helpdesk, billing tizimlari;
- agar formalar o‘z SMTP orqali xat yuborsa, saytning o‘zi.

Ularning har biri SPF’ga kiritilishi va imkon qadar domeningiz nomidan DKIM bilan imzolashi kerak.

## SPF: bir domenga bitta yozuv

SPF asosiy domenga TXT-yozuv sifatida qo‘shiladi. Mashhur xizmatlar uchun `include` qiymatlari:

| Xizmat | SPF’ga nima qo‘shiladi |
|---|---|
| Google Workspace | `include:_spf.google.com` |
| Microsoft 365 | `include:spf.protection.outlook.com` |
| Zoho Mail | `include:zohomail.com` |
| SendGrid | `include:sendgrid.net` |
| Mailgun | `include:mailgun.org` |

Google Workspace ishlatadigan va SendGrid orqali xabarnoma yuboradigan domen uchun misol:

```dns
example.com.  TXT  "v=spf1 include:_spf.google.com include:sendgrid.net ~all"
```

Muhim qoidalar:

- **Domenga faqat bitta `v=spf1` yozuvi.** Ikkita yozuv bo‘lsa, tekshiruv butunlay buziladi. Yangi xizmat qo‘shilsa, mavjud yozuvni tahrirlang.
- **Tekshiruvda 10 tadan ortiq DNS-so‘rov bo‘lmasin.** Har bir `include` kamida bittasini sarflaydi, ichki include’lar ham hisobga kiradi.
- **`~all` yoki `-all`.** `~all` (softfail) sozlash bosqichida yumshoqroq, `-all` qat’iy. DMARC sozlangach, farq kamroq seziladi.

## DKIM: kalitni pochta xizmati beradi

DKIM kalitini o‘zingiz o‘ylab topmaysiz — uni xizmat yaratadi, siz esa DNS’da e’lon qilasiz:

- **Google Workspace.** Admin konsol → Apps → Google Workspace → Gmail → Authenticate email. Kalit yarating, `google._domainkey.example.com` manziliga TXT-yozuv qo‘shing, so‘ng Start authentication tugmasini bosing.
- **Microsoft 365.** Microsoft Defender portalidagi DKIM sozlamalarida `selector1._domainkey` va `selector2._domainkey` uchun ikkita CNAME-yozuv olasiz. Ikkalasini qo‘shing va imzolashni yoqing.
- **SendGrid, Mailgun kabi xizmatlar** o‘z selektorlari va yozuvlarini panelidagi domen autentifikatsiyasi bo‘limida ko‘rsatadi.

Kalit uzun bo‘ladi: uni ortiqcha bo‘sh joy va qator ko‘chirishlarsiz to‘liq nusxalang.

## DMARC: monitoringdan boshlang

DMARC — `_dmarc` subdomenidagi TXT-yozuv. Xavfsiz boshlanish:

```dns
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com"
```

- **`p=none`** — hech narsani bloklamaydi, faqat `rua` manziliga hisobot yuboradi.
- **`p=quarantine`** — tekshiruvdan o‘tmagan xatlarni spamga yuboradi.
- **`p=reject`** — ularni rad etadi.

DMARC **moslikni** (alignment) tekshiradi: «Kimdan» maydonidagi domen SPF’dan o‘tgan domen yoki DKIM imzosidagi domen (`d=`) bilan mos kelishi kerak. Xatlarni o‘z domeni bilan imzolaydigan xabarnoma xizmati DKIM’dan o‘tib, DMARC’dan o‘tmasligi mumkin. Shuning uchun unda sizning domeningiz bilan imzolashni sozlang.

Tartib: bir necha hafta `p=none`, hisobotlarni tahlil qilish, barcha qonuniy jo‘natuvchilarni tuzatish, keyin `quarantine` va oxirida `reject`.

## Qanday tekshirish kerak

DNS’da nima e’lon qilinganini ko‘ring:

```bash
dig +short TXT example.com
dig +short TXT google._domainkey.example.com
dig +short TXT _dmarc.example.com
```

Windows’da xuddi shu ishni `nslookup -type=TXT _dmarc.example.com` bajaradi.

So‘ng Gmail qutisiga xat yuboring, uni oching va «Show original» bandini tanlang. Yuqorida **SPF: PASS, DKIM: PASS, DMARC: PASS** ko‘rinishi kerak. Boshqa pochta mijozlarida `Authentication-Results` sarlavhasini qidiring. Buni faqat korporativ pochta uchun emas, har bir jo‘natuvchi xizmat uchun takrorlang.

DMARC hisobotlari arxivlangan XML fayllar ko‘rinishida keladi. Ularni qo‘lda o‘qish noqulay, shuning uchun hisobot tahlil qiluvchi xizmatlardan foydalaning.

## Ko‘p uchraydigan xatolar

- Bitta o‘rniga ikkita SPF-yozuv.
- Domeningiz nomidan xat yuboradigan, lekin unutilgan xabarnoma xizmati yoki CRM.
- SPF’da 10 ta DNS-so‘rov limitidan oshib ketish.
- Monitoringsiz darhol `p=reject` qo‘yish va qonuniy xatlarning yo‘qolishi.
- Yozuvlarni eski DNS-provayderga qo‘shish, holbuki domenning NS-serverlari boshqa joyga ko‘rsatadi.

## FAQ

### Yozuvlar ishlashi uchun qancha kutish kerak?

Odatda bir necha daqiqadan bir necha soatgacha: bu yozuvlarning TTL qiymati va DNS-serverlar keshiga bog‘liq. Agar bir kundan keyin ham tekshiruv yozuvni ko‘rmasa, ehtimol u noto‘g‘ri joyga yoki xato bilan qo‘shilgan.

### Xabarnomalar yubormasam ham DMARC kerakmi?

Ha. DMARC domenni soxtalashtirishdan himoya qiladi: usiz firibgarlar sizning nomingizdan xat yuborishi osonroq. Bundan tashqari, hisobotlar domeningiz bilan aslida kim xat yuborayotganini ko‘rsatadi.

### Barcha tekshiruvlar PASS, lekin xatlar baribir spamda. Nega?

Autentifikatsiya majburiy, ammo yagona shart emas. Yetkazib berishga domen va IP obro‘si, qabul qiluvchilarning shikoyatlari, xat mazmuni, havolalar va domen yoshi ham ta’sir qiladi. Yangi domen jo‘natish hajmini asta-sekin oshirgani ma’qul.
