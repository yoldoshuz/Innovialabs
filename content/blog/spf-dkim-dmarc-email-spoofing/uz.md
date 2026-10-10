---
title: SPF, DKIM va DMARC: domeningizni soxta xatlardan himoya qilish
description: SPF, DKIM va DMARC nima qiladi, DNS yozuvlari misollari, DMARCni none’dan reject’ga o‘tkazish, hisobotlarni o‘qish va bir nechta jo‘natuvchidagi xatolar.
summary: SPF domeningiz nomidan xat yuborishga ruxsat berilgan serverlarni sanab o‘tadi, DKIM xatlarni imzolaydi, DMARC esa tekshiruvdan o‘tmagan xatlar bilan nima qilishni qabul qiluvchilarga aytadi va sizga hisobot yuboradi. Uchalasi birgalikda firibgarlarga domeningiz nomidan xat tarqatishga yo‘l qo‘ymaydi.
---

## Har bir yozuv nima qiladi

Pochta protokolining o‘zi «Kimdan» maydonida kim ko‘rsatilganini tekshirmaydi. Istalgan server `director@kompaniyangiz.uz` nomidan xat yuborishi mumkin. Uchta DNS yozuvi bu muammoni birgalikda hal qiladi:

| Yozuv | Nimani tekshiradi | O‘xshatish |
|---|---|---|
| **SPF** | Xat qaysi serverdan (IP) kelgani va u domen uchun ruxsat etilganmi | Ruxsatnomasi bor xodimlar ro‘yxati |
| **DKIM** | Kriptografik imzo: xatni domen egasi yuborgan va u yo‘lda o‘zgartirilmagan | Hujjatdagi muhr |
| **DMARC** | Tekshirilgan domen «Kimdan» manziliga mos keladimi va muvaffaqiyatsizlikda nima qilish kerak | Qo‘riqchiga yo‘riqnoma va hisobot |

DMARCning asosiy tushunchasi — **moslik (alignment)**. SPF yoki DKIM o‘tishi yetarli emas: ular tekshirgan domen «Kimdan» manzilidagi domenga mos kelishi kerak. Xat DMARCdan o‘tadi, agar tekshiruvlardan kamida bittasi o‘tgan **va** mos kelgan bo‘lsa.

## DNS yozuvlari misoli

Aytaylik, korporativ pochta Google Workspace’da, xabarnomalar esa email-marketing servisi orqali yuboriladi.

**SPF** — domen ildizida bitta TXT yozuvi:

```dns
example.com.  TXT  "v=spf1 include:_spf.google.com include:spf.newsletter-service.example ~all"
```

- `include:` provayder serverlarini qo‘shadi;
- `~all` — «qolganlari, ehtimol, bizniki emas» (softfail), `-all` — qat’iy taqiq. DMARC bilan odatda `~all` yetarli.

**DKIM** — pochta servisingiz beradigan ochiq kalit. Yozuv nomi **selektor** va `_domainkey`dan iborat:

```dns
google._domainkey.example.com.  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqh...IDAQAB"
```

Har bir servisning o‘z selektori bor, shuning uchun bir nechta DKIM yozuvi bo‘lishi normal holat.

**DMARC** — `_dmarc` subdomenidagi yozuv:

```dns
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

## DMARCni none’dan reject’ga qanday o‘tkazish mumkin

Darhol `p=reject` qo‘yish xavfli: o‘zingiz unutgan qonuniy xatlaringizni bloklab qo‘yasiz. Bosqichma-bosqich harakat qiling:

1. **`p=none`** — hech narsa bloklanmaydi, lekin hisobotlar kela boshlaydi. Bir necha hafta ma’lumot to‘plang va sizning nomingizdan xat yuborayotgan hammani toping.
2. Topilgan har bir qonuniy jo‘natuvchi uchun SPF va DKIMni sozlang.
3. **`p=quarantine; pct=25`** — o‘tmagan xatlarning bir qismi spamga tushadi. Hisobotlarni kuzatib, `pct`ni asta-sekin 100 gacha oshiring.
4. **`p=reject`** — DMARCdan o‘tmagan xatlar rad etiladi. Bu maqsad.

Subdomenlar uchun `sp=` tegi amal qiladi. Umuman xat yuborilmaydigan domenlar uchun darhol qat’iy siyosatni e’lon qiling:

```dns
parked.example.         TXT  "v=spf1 -all"
_dmarc.parked.example.  TXT  "v=DMARC1; p=reject"
```

## Agregat hisobotlarni qanday o‘qish kerak

`rua`dagi manzilga hisobotlar pochta provayderlaridan, odatda kuniga bir marta, arxivlangan XML ko‘rinishida keladi. Ularni qo‘lda o‘qish noqulay, shuning uchun analizator servislar yoki skriptlardan foydalaniladi. Har bir hisobotda muhim:

- **manba IP-manzili** va undan kelgan xatlar soni;
- **SPF** va **DKIM** natijasi va ular mos kelganmi;
- **qo‘llangan harakat**: yetkazildi, spamga tushdi, rad etildi.

Qanday talqin qilish kerak:

- Noma’lum IP, hammasi muvaffaqiyatsiz — katta ehtimol bilan soxtalashtirish. DMARC aynan shundan himoya qiladi.
- Tanish servis (CRM, xabarnoma, helpdesk) moslikdan o‘tmayapti — uning DKIM imzosini sizning domeningizga sozlash kerak.
- Qayta yo‘naltirish (forwarding) ko‘pincha SPFni buzadi, lekin DKIMni saqlaydi. Shuning uchun DKIM juda muhim.

## Bir nechta jo‘natuvchi bo‘lganda odatiy xatolar

- Bitta domenda **ikkita SPF yozuvi**. Bu xato, tekshiruv `permerror` qaytaradi. Barcha `include`lar bitta yozuvga birlashtiriladi.
- SPFda **10 tadan ortiq DNS so‘rovi**. Har bir `include`, `a`, `mx` hisobga olinadi, ichma-ichlari ham. Limitdan oshsa, SPF buziladi — ortiqchasini olib tashlang yoki xabarnomalarni subdomenga chiqaring.
- **SPF o‘tdi, lekin mos kelmadi.** Xabarnoma servisi Return-Path’da o‘z domenini ishlatadi. Yechim — sizning domeningiz bilan DKIM imzosi yoki o‘z qaytarish domeningiz.
- **Unutilgan jo‘natuvchilar**: hostingning `mail()` funksiyasi orqali bildirishnoma yuboradigan sayt, buxgalteriya dasturi, billing, tiket tizimlari.
- SPFdagi **`+all`** — istalgan kishiga xat yuborishga ruxsat beradi.
- **Hisobotlar begona domenga** tasdiqlashsiz: agar `rua` boshqa kompaniya domeniga ishora qilsa, unga maxsus ruxsat yozuvi kerak.
- **Uzun DKIM kaliti bitta qatorda.** TXT satrlari 255 belgi bilan cheklangan; uzun kalit qo‘shtirnoq ichidagi bir nechta satrga bo‘linadi, ko‘pchilik DNS panellari buni o‘zi bajaradi.

## FAQ

### Faqat SPF yetarlimi?

Yo‘q. SPF odam ko‘radigan «Kimdan» manzilini tekshirmaydi va qayta yo‘naltirishda buziladi. DMARCsiz qabul qiluvchi SPFdan o‘tmagan xat bilan nima qilishni bilmaydi. To‘liq himoya — uchala yozuv birgalikda.

### DMARC xabarnomalarimiz yetkazilishiga ta’sir qiladimi?

Odatda ijobiy: yirik pochta servislari ommaviy jo‘natuvchilardan SPF, DKIM va DMARC sozlangan bo‘lishini talab qiladi. Xavf faqat barcha qonuniy jo‘natuvchilar sozlanmasidan oldin shoshilib `reject`ga o‘tishda paydo bo‘ladi.

### Hammasi to‘g‘ri sozlanganini qanday tekshirish mumkin?

Gmail yoki boshqa yirik servisdagi pochta qutisiga xat yuboring va xatning asl matnini oching: `Authentication-Results` sarlavhasida `spf=pass`, `dkim=pass` va `dmarc=pass` bo‘lishi kerak. Yozuvlar sintaksisini onlayn validatorlar bilan ham tekshirish mumkin.
