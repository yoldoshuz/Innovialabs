---
title: DNS yozuvlari turlari: A, AAAA, CNAME, MX, TXT va NS
description: A, AAAA, CNAME, MX, TXT va NS DNS yozuvlari nima qiladi, ularning odatiy qiymatlari qanday va sayt, pochta hamda domenni tasdiqlash uchun qaysilari kerak.
summary: DNS yozuvlari domenga kelgan so‘rovlarni qayerga yo‘naltirishni belgilaydi: A va AAAA server IP manziliga, CNAME boshqa nomga, MX pochta serveriga ishora qiladi, TXT tekshiruvlar va pochta siyosatlarini saqlaydi, NS esa zonani kim boshqarishini aniqlaydi.
---
## Qisqa javob

DNS — domen nomini kompyuterlar tushunadigan manzilga aylantiruvchi ma’lumotnoma. **DNS yozuvi** — shu ma’lumotnomadagi bitta qator: nom, tur, qiymat va **TTL** (javobni keshda necha soniya saqlash mumkinligi).

Domenning barcha yozuvlari DNS provayderingizdagi **DNS zonasida** saqlanadi. Bu registrator, hosting yoki Cloudflare kabi alohida xizmat bo‘lishi mumkin. Yozuv turlari ko‘p, lekin oddiy biznes uchun oltitasi yetarli.

## Oltita asosiy tur

| Tur | Nima qiladi | Qiymat namunasi |
|---|---|---|
| **A** | Nomni IPv4 manzilga bog‘laydi | `203.0.113.10` |
| **AAAA** | Nomni IPv6 manzilga bog‘laydi | `2001:db8::10` |
| **CNAME** | Nomni boshqa nomning taxallusiga aylantiradi | `myapp.hosting-provider.com` |
| **MX** | Pochtani qaysi server qabul qilishini ko‘rsatadi | `10 mx.mail-provider.com` |
| **TXT** | Erkin matn: tasdiqlashlar, SPF, DKIM, DMARC | `v=spf1 include:_spf.mail-provider.com ~all` |
| **NS** | Zona uchun qaysi serverlar javobgarligini bildiradi | `ns1.dns-provider.com` |

### A va AAAA

**A** — eng asosiy yozuv: «example.com sayti mana shu IP’li serverda joylashgan». **AAAA** xuddi shu ishni IPv6 uchun bajaradi. Serveringizda IPv6 manzil bo‘lmasa, AAAA kerak emas, noto‘g‘ri AAAA yozuvi esa saytni ayrim tashrif buyuruvchilar uchun ochilmaydigan qilib qo‘yishi mumkin.

### CNAME

**CNAME** «bu nom — anavi nomning o‘zi» deydi. Odatda `www` yoki subdomenni o‘z IP manzillarini o‘zi o‘zgartiradigan bulut platformasiga ulash uchun ishlatiladi. Muhim cheklovlar:

- Standartga ko‘ra CNAME’ni domen ildiziga (`example.com`) qo‘yib bo‘lmaydi — buning uchun provayderlar ALIAS, ANAME yoki «CNAME flattening»ni taklif qiladi.
- Nomda CNAME bo‘lsa, o‘sha nomda boshqa yozuvlar bo‘lmasligi kerak.

### MX

**MX** domen uchun pochta serverini ko‘rsatadi. Nom oldidagi raqam — **ustuvorlik**: qanchalik kichik bo‘lsa, shunchalik yuqori. MX qiymati IP manzil yoki CNAME emas, balki host nomi bo‘lishi shart.

### TXT

**TXT** — matn uchun universal maydon. Amalda unda quyidagilar saqlanadi:

- Google Search Console, pochta xizmatlari va SSL provayderlari uchun **domenga egalikni tasdiqlash**;
- **SPF** — domen nomidan xat yuborishga ruxsat berilgan serverlar ro‘yxati;
- **DKIM** — xatlarni imzolash uchun ochiq kalit (odatda `selector._domainkey` ko‘rinishidagi nomda);
- **DMARC** — tekshiruvdan o‘tmagan xatlar bilan nima qilish siyosati (`_dmarc` nomida).

### NS

**NS** yozuvlari domen uchun qaysi DNS serverlar vakolatli ekanini belgilaydi. DNS boshqaruvini boshqa provayderga ko‘chirganda ular registratorda o‘zgartiriladi. Aniq sabab bo‘lmasa, ularga tegmang.

## Odatiy vazifalar uchun qaysi yozuvlar kerak

**Sayt ochilishi uchun:**

- `example.com` uchun A (IPv6 bo‘lsa, AAAA ham);
- `www` uchun asosiy domen yoki platforma manziliga CNAME.

**Domendagi pochta ishlashi uchun:**

- pochta provayderidan MX;
- SPF bilan TXT;
- DKIM kaliti bilan TXT;
- `_dmarc` nomida DMARC bilan TXT.

**Xizmatda domenni tasdiqlash uchun:**

- xizmat bergan qiymat bilan TXT (ba’zan CNAME).

Minimal zona namunasi:

```text
example.com.          3600  A      203.0.113.10
www.example.com.      3600  CNAME  example.com.
example.com.          3600  MX     10 mx.mail-provider.com.
example.com.          3600  TXT    "v=spf1 include:_spf.mail-provider.com ~all"
_dmarc.example.com.   3600  TXT    "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
```

## Ko‘p uchraydigan xatolar

- Bitta domenda **ikkita SPF yozuvi**. SPF bitta bo‘lishi kerak: bir nechta manba bitta qatorda `include:` orqali birlashtiriladi.
- **Domen ildizida CNAME.** Ko‘p panellar uni yaratishga ruxsat bermaydi, bersa ham pochta buzilishi mumkin.
- **Oxiridagi nuqta.** Ba’zi panellarda nom zonaga nisbatan (`www`), boshqalarida to‘liq (`www.example.com.`) yoziladi. Adashtirsangiz, `www.example.com.example.com` hosil bo‘ladi.
- **Sayt ko‘chirilganda MX yozuvlarini o‘chirib yuborish.** Sayt va pochta bir-biriga bog‘liq emas: hostingni almashtirganda pochta yozuvlariga tegmang.
- **Darhol natija kutish.** O‘zgarishlar TTL hisobga olingan holda qo‘llanadi, shuning uchun eski qiymatlar keshlarda yana bir muddat yashashi mumkin.

## Yozuvlarni qanday tekshirish mumkin

DNS aslida nima qaytarayotganini ko‘rish uchun:

```bash
dig example.com A +short
dig example.com MX +short
dig example.com TXT +short
```

Windows’da muqobili — `nslookup -type=MX example.com`.

## FAQ

### Subdomen uchun nima tanlash kerak: A yoki CNAME?

Subdomen doimiy IP’li aniq serverga ishora qilishi kerak bo‘lsa — A. Manzillarini o‘zi boshqaradigan platformaga (bulutli hosting, sayt konstruktori, CDN) ishora qilsa — CNAME: ularning IP manzili o‘zgarganda sizga hech narsani o‘zgartirish shart bo‘lmaydi.

### Sayt va pochtani turli provayderlarda saqlash mumkinmi?

Ha, bu odatiy holat. A va CNAME sayt hostingiga, MX va pochta TXT yozuvlari esa pochta xizmatiga olib boradi. Ular bir-biriga xalaqit bermaydi.

### Domen tasdiqlangandan keyin TXT yozuvini o‘chirish kerakmi?

Xizmatga bog‘liq. Ba’zilari egalikni vaqti-vaqti bilan qayta tekshiradi va yozuv yo‘qolsa, tasdiqni bekor qiladi. Ishonchingiz komil bo‘lmasa, uni qoldiring — ortiqcha TXT yozuvi hech narsaga zarar qilmaydi.
