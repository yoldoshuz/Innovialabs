---
title: Domenni boshqa registratorga uzilishlarsiz qanday o‘tkazish mumkin
description: Domenni bosqichma-bosqich o‘tkazish: blokni ochish, avtorizatsiya kodi, muddatlar, DNS ishlashini saqlash va muddat tugashidan oldin nimani tekshirish.
summary: Avval DNS eski registratorga bog‘liq bo‘lmasligini ta’minlang, so‘ng blokni oching, auth-kodni oling va o‘tkazishni muddat tugashiga bir necha kun qolganda emas, oldindan boshlang.
---
## Qisqa javob

O‘tkazish faqat **domen ro‘yxatini qaysi kompaniya yuritishi** va uzaytirish uchun to‘lovni kim olishini o‘zgartiradi. Sayt va pochta o‘tkazishning o‘zi tufayli emas, DNS tufayli buziladi: agar domen zonasi eski registratorning DNS serverlarida bo‘lsa, domen ketgandan keyin ular javob bermay qo‘yishi mumkin.

Deyarli har doim ishlaydigan tartib:

1. DNS zonasini mustaqil DNS provayderga yoki yangi registratorga ko‘chiring va u to‘g‘ri javob berayotganiga ishonch hosil qiling.
2. Eski registratorda **o‘tkazish blokini** (transfer lock) o‘chiring.
3. **Avtorizatsiya kodini** (auth-kod, EPP-kod) oling.
4. Yangi registratorda o‘tkazishni rasmiylashtiring va tasdiqlang.
5. Keyin domen, DNS va ro‘yxat tugash sanasini tekshiring.

## 0-qadam: o‘tkazish mumkinligini tekshiring

- **Yaqinda ro‘yxatdan o‘tgan yoki o‘tkazilgan domen.** Umumiy zonalarda (.com, .net, .org va boshqalar) ro‘yxatdan o‘tish yoki oldingi o‘tkazishdan keyin ma’lum muddat o‘tkazish taqiqlanadi — an’anaviy ravishda 60 kun. Aniq qoidani registratoringizdan so‘rang.
- **Egasi ma’lumotlarini o‘zgartirish.** Egasi haqidagi ma’lumotlar yangilangandan keyin registrator o‘tkazishni vaqtincha bloklashi mumkin.
- **Milliy zonalar** (.uz, .ru, .kz va boshqalar) o‘z reyestrlari qoidalari bo‘yicha ishlaydi. Bir joyda auth-kod kerak, boshqasida ariza yoki pochta orqali tasdiq. Tartibni yangi registratordan oldindan aniqlang.
- **Egasining pochtasi.** Tasdiqlash xatlari domenning kontakt email manziliga keladi. Agar bu quti shu domenning o‘zida bo‘lsa yoki ishlatilmayotgan bo‘lsa, o‘tkazishdan oldin ishlaydigan manzilni kiriting.

## 1-qadam: DNSni eski registratordan ajrating

Domen hozir qaysi NS serverlardan foydalanayotganini ko‘ring:

```bash
dig NS example.com +short
```

Agar ular eski registratorga tegishli bo‘lsa, bu uzilishning asosiy xavfi. Zonani mustaqil DNS xizmatiga (Cloudflare, hosting yoki bulut DNS) yoki yangi registratorga ko‘chiring.

Buni uzilishsiz qilish uchun:

1. **Barcha yozuvlarni** nusxalang: A, AAAA, CNAME, MX, TXT (SPF, DKIM, DMARC, xizmatlar tasdiqlari), SRV. Pochtani ko‘pincha unutilgan MX va TXT yozuvlari buzadi.
2. Almashtirishdan oldin yangi va eski DNS javoblarini solishtiring:

```bash
dig @ns1.new-dns.example MX example.com +short
dig @ns1.old-dns.example MX example.com +short
```

3. Faqat shundan keyin NS serverlarni almashtiring va keshlar yangilanishini kuting. NS yozuvlari uchun bu odatda bir-ikki sutkagacha davom etadi, shuning uchun eski zonani hozircha o‘chirmang.

**DNSSEC.** Agar u yoqilgan bo‘lsa, noto‘g‘ri tartib domenni tekshiruvchi rezolverlar uchun ochilmaydigan qilib qo‘yadi. Eng oddiy xavfsiz yo‘l: DNSSECni o‘chiring (registratordagi DS yozuvini olib tashlang), TTL tugashini kuting, DNSni almashtiring, keyin yangi provayderda DNSSECni qayta yoqing.

## 2–3-qadamlar: blok va auth-kod

Eski registrator panelida:

- **Transfer Lock / Registrar Lock**ni o‘chiring — `clientTransferProhibited` holati yo‘qolishi kerak;
- **auth-kodni** so‘rang. Ba’zi registratorlar uni darhol ko‘rsatadi, boshqalari egasining pochtasiga yuboradi.

Domen holatini WHOIS orqali tekshirish mumkin:

```bash
whois example.com | grep -i status
```

## 4-qadam: o‘tkazishni boshlang

Yangi registratorda «Domenni o‘tkazish» bo‘limini tanlang, domen nomi va auth-kodni kiriting, to‘lovni amalga oshiring. Umumiy zonalarda o‘tkazish odatda **ro‘yxatni bir yilga uzaytiradi**, qolgan muddat esa saqlanadi.

Vaqt bo‘yicha: eski registrator o‘tkazishni darhol tasdiqlashi yoki javob bermasligi mumkin, bu holda u avtomatik tasdiqlanadi, odatda besh kun ichida. Eski registrator xatida yoki panelida o‘tkazishni tasdiqlab, jarayonni tezlashtirish mumkin.

## 5-qadam: o‘tkazishdan keyin nimani tekshirish kerak

- domen yangi registrator panelida to‘g‘ri tugash sanasi bilan ko‘rinadi;
- NS serverlar aynan siz sozlagan serverlar;
- sayt ochiladi, pochta keladi va ketadi;
- o‘tkazish bloki qayta yoqilgan;
- avtomatik uzaytirish yoqilgan va ishlaydigan to‘lov usuli ko‘rsatilgan;
- egasining kontakt ma’lumotlari dolzarb.

## Ko‘p uchraydigan xatolar

- **Muddat tugashiga bir necha kun qolganda o‘tkazish.** Jarayon cho‘zilsa, domen muddati tugab qolishi mumkin. Kamida ikki-uch hafta oldin boshlang. Agar domen muddati allaqachon tugagan bo‘lsa, ko‘p registratorlar o‘tkazishni qabul qilmaydi — avval uni uzaytiring.
- **DNS eski registratorda qolgan.** Uzilishning eng keng tarqalgan sababi.
- **Unutilgan TXT yozuvlari.** Xatlar spamga tusha boshlaydi, xizmatlar tasdiqlari ishlamay qoladi.
- **Egasining pochtasi ishlamaydi.** Tasdiq hech kimga yetib bormaydi, o‘tkazish osilib qoladi.

## FAQ

### O‘tkazish vaqtida sayt ishlamay qoladimi?
Yo‘q, agar DNS zonasi oldindan mustaqil provayderda yoki xuddi shu yozuvlar bilan yangi registratorda bo‘lsa. Ro‘yxatni o‘tkazishning o‘zi saytga ta’sir qilmaydi.

### Allaqachon to‘langan yillar yo‘qoladimi?
Umumiy zonalarda yo‘q: qolgan muddat saqlanadi, o‘tkazish esa odatda bir yil qo‘shadi. Milliy zonalarda o‘z qoidalari bor, ularni registratordan aniqlang.

### Domenni sotib olgandan keyin darhol o‘tkazish mumkinmi?
Odatda yo‘q. Umumiy zonalarda ro‘yxatdan o‘tgandan keyin ma’lum vaqt o‘tkazish taqiqlanadi, shuning uchun boshidanoq qolmoqchi bo‘lgan registratorni tanlang.
