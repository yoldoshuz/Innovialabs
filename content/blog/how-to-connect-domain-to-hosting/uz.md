---
title: Domenni hosting yoki serverga qanday ulash mumkin
description: Domenni hostingga ulashning ikki usuli: NS serverlarni almashtirish yoki A va CNAME yozuvlarini sozlash. Qadamlar, dig bilan tekshirish va xatolar.
summary: Yoki domen NS serverlarini hosting serverlariga almashtirib, DNSni o‘sha yerda boshqaring, yoki DNSni joyida qoldirib, server IP manziliga A yozuvi va www uchun CNAME qo‘shing, so‘ng natijani dig bilan tekshiring.
---
## Qisqa javob: ikki usul

Domenni hostingga ulash — DNSga tashrif buyuruvchilarni qayerga yuborishni aytish demakdir. Ikki yo‘l bor:

1. **NS serverlarni almashtirish.** Registratorda hosting DNS serverlarini ko‘rsatasiz va bundan buyon butun DNS zonasini hosting boshqaradi. Sayt uchun kerakli yozuvlarni u o‘zi yaratadi.
2. **Yozuvlarni qo‘lda qo‘shish.** NS serverlar o‘zgarmaydi, joriy zonaga server IP manzili bilan **A yozuvi** (IPv6 bo‘lsa, **AAAA** ham) va `www` yoki bulut platformasi uchun **CNAME** qo‘shasiz.

| | NSni almashtirish | A/CNAME yozuvlari |
|---|---|---|
| DNS qayerda | hostingda | hozirgi joyida |
| Qo‘llanish tezligi | sekinroq, odatda bir-ikki sutkagacha | yozuv TTL’i bo‘yicha, ko‘pincha daqiqalar |
| Pochta va boshqa yozuvlar | yangi zonada qayta yaratish kerak | o‘z joyida qoladi |
| Qachon mos | hammasi bitta hostingda, domen yangi | pochta, xizmatlar yoki bir nechta server bor |

Agar domenda korporativ pochta allaqachon ishlayotgan bo‘lsa, ikkinchi usul xavfsizroq: faqat sayt yozuvlarini o‘zgartirasiz va hech narsa yo‘qotmaysiz.

## 1-usul: NS serverlarni almashtirish

1. Domenni hosting paneliga qo‘shing («Domenlar» yoki «Saytlar» bo‘limi). NS serverlar shu yerda yoki xush kelibsiz xatida ko‘rsatilgan, masalan `ns1.hosting.example` va `ns2.hosting.example`.
2. **Almashtirishdan oldin** domenda pochta va boshqa yozuvlar bor-yo‘qligini tekshiring. Bo‘lsa, hosting zonasida xuddi shunday MX, TXT (SPF, DKIM, DMARC) va boshqa yozuvlarni yarating.
3. Registrator panelida «Nameservers» yoki «DNS serverlar» maydonini toping, eski qiymatlarni yangilariga almashtiring va saqlang.
4. Yangilanishni kuting. NS o‘zgarishlari yuqori darajadagi zona va keshlar orqali o‘tadi, shuning uchun odatda bir-ikki sutka ichida qo‘llanadi.

## 2-usul: A va CNAME yozuvlari

1. Server IP manzilini hosting yoki bulut panelidan bilib oling. Bulut platformalari (Vercel, Netlify va shunga o‘xshashlar) uchun qiymatlarni ularning yo‘riqnomasidan oling — har bir xizmatda o‘zinikidir.
2. O‘zgarishlardan bir kun oldin joriy yozuvlar TTL’ini 300 soniyagacha kamaytiring — shunda almashtirish tezroq o‘tadi.
3. Domenning DNS zonasida yozuvlarni yarating yoki o‘zgartiring:

| Tur | Nom | Qiymat |
|---|---|---|
| A | `@` | `203.0.113.10` |
| AAAA | `@` | server IPv6 manzili, faqat mavjud bo‘lsa |
| CNAME | `www` | `example.com.` |

4. Shu nomlar uchun eski A va AAAA yozuvlarini, masalan registratorning «parkovka» yozuvlarini o‘chiring.

**Muhim:** CNAME’ni domenning o‘ziga (`@`) qo‘yib bo‘lmaydi, faqat subdomenlarga. Agar platforma ildiz uchun CNAME so‘rasa, DNS provayderingiz qo‘llab-quvvatlasa **ALIAS/ANAME** yoki **CNAME flattening**dan, yoki platforma beradigan A yozuvidan foydalaning.

## Serverni unutmang

DNS tashrif buyuruvchini faqat serverga olib keladi. Server qaysi saytni ko‘rsatishni bilishi kerak:

- panelli hostingda — domen va `www`ni saytga qo‘shing;
- o‘z serveringizda — nomlarni veb-server konfiguratsiyasida ko‘rsating, masalan Nginx’da:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example;
}
```

Shundan keyin SSL sertifikat chiqaring, aks holda brauzerlar ogohlantirish ko‘rsatadi.

## Natijani qanday tekshirish

```bash
dig NS example.com +short
dig A example.com +short
dig CNAME www.example.com +short
dig @8.8.8.8 A example.com +short
curl -I http://example.com
```

Windows’da `dig` o‘rniga `nslookup example.com 8.8.8.8` mos keladi. Buyruqlar qatori va ommaviy rezolverlar orqali tekshiring: brauzer va provayder keshdagi eski javobni ko‘rsatishi mumkin.

## Ko‘p uchraydigan xatolar

- **NS almashtirildi, pochta yo‘qoldi** — MX va TXT yangi zonaga ko‘chirilmagan.
- **Ikkita A yozuvi** — eski va yangi. Sayt goh bir serverdan, goh boshqasidan ochiladi.
- **`www` unutilgan** — domen ishlaydi, `www` ishlamaydi yoki aksincha.
- **Eski AAAA yozuvi** — IPv6 foydalanuvchilari avvalgi serverga tushadi.
- **Domen serverga qo‘shilmagan** — DNS to‘g‘ri, lekin hostingning zaglushka sahifasi ochiladi.

## FAQ

### Domen ishlashi uchun qancha kutish kerak?
A va CNAME o‘zgarishlari odatda yozuv TTL’i doirasida qo‘llanadi. NS serverlarni almashtirish ko‘proq vaqt oladi, odatda bir-ikki sutkagacha.

### Domen bir provayderda, sayt boshqasida, pochta uchinchisida bo‘lishi mumkinmi?
Ha. Ikkinchi usul aynan shu uchun: DNS bir joyda qoladi, yozuvlar esa turli xizmatlarga ishora qiladi — A hostingga, MX pochta xizmatiga.

### Yangi boshlovchi uchun qaysi usul yaxshiroq?
Agar domen yangi bo‘lsa va hammasi bitta hostingda bo‘lsa, NSni almashtirish osonroq. Pochta yoki boshqa xizmatlar allaqachon bo‘lsa, faqat A va CNAME’ni o‘zgartirish ishonchliroq.
