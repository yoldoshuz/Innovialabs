---
title: Domen nomi nima: zonalar, registratorlar va egalik
description: Domen nomi tuzilishi, umumiy zonalar va .uz kabi milliy zonalar farqi, reyestr va registrator roli hamda nega domen kompaniya nomida bo‘lishi kerak.
summary: Domen nomi — reyestrdan registrator orqali ijaraga olinadigan tushunarli sayt manzili; uni o‘z kompaniyangiz nomiga rasmiylashtiring, chunki yuridik jihatdan u egasi sifatida ko‘rsatilgan shaxsga tegishli.
---
## Qisqa javob

Internetdagi har bir serverning `203.0.113.10` kabi raqamli **IP-manzili** bor. Bunday raqamlarni eslab qolish noqulay, shuning uchun **domen nomlari** — `example.uz` kabi tushunarli manzillar o‘ylab topilgan. **DNS** tizimi nomni IP-manzilga aylantiradi va brauzer kerakli serverni topadi.

Muhim jihat: domen **abadiy sotib olinmaydi**. Siz undan ro‘yxatdan o‘tkazish muddati davomida — odatda bir yildan boshlab — foydalanish huquqini olasiz va uni uzaytirib borasiz.

## Domen nomi nimadan iborat

Domen o‘ngdan chapga, umumiydan xususiyga qarab o‘qiladi. `shop.example.uz` misolida:

- **`.uz`** — **yuqori darajali domen** (TLD, zona).
- **`example`** — **ikkinchi darajali domen**, aynan siz ro‘yxatdan o‘tkazadigan nom.
- **`shop`** — **subdomen**. Ularni DNS sozlamalarida o‘zingiz bepul va istalgancha yaratasiz.

Texnik jihatdan har qanday nom oxirida yana bir nuqta — DNS ildizi bor, lekin brauzerda u yozilmaydi.

## Qanday zonalar bor

| Zona turi | Misollar | Xususiyatlari |
|---|---|---|
| **Umumiy (gTLD)** | `.com`, `.net`, `.org` | Xalqaro, deyarli hamma uchun ochiq |
| **Yangi umumiy** | `.app`, `.dev`, `.shop`, `.tech` | Mavzuli; ba’zilarida maxsus qoidalar bor, masalan `.app` va `.dev` da HTTPS majburiy |
| **Milliy (ccTLD)** | `.uz`, `.kz`, `.ru`, `.de` | Davlatga bog‘langan, ro‘yxatdan o‘tkazish qoidalarini milliy administrator belgilaydi |

**Zonani qanday tanlash kerak:**

- Asosan O‘zbekistonda ishlasangiz — **`.uz`** mahalliy biznes ekanini ko‘rsatadi va mahalliy auditoriyaga tanish.
- Xalqaro bozorga yo‘naltirilgan bo‘lsangiz — **`.com`** yoki mos mavzuli zona.
- Asosiy nomni raqobatchilar egallab olmasligi uchun bir nechta zonada ro‘yxatdan o‘tkazib, asosiy saytga yo‘naltirish ma’qul.

## Reyestr va registrator: kim kim

- **ICANN** — domen nomlari tizimini umuman muvofiqlashtiradigan xalqaro tashkilot.
- **Reyestr (registry)** — muayyan zonani boshqaradigan va uning bazasini yurituvchi tashkilot. Masalan, `.com` ni Verisign boshqaradi, `.uz` zonasini esa UZINFOCOM Markazi administratsiya qiladi.
- **Registrator (registrar)** — domenni ro‘yxatdan o‘tkazadigan akkreditatsiyalangan kompaniya. U ma’lumotlarni reyestrga uzatadi, to‘lovni qabul qiladi va boshqaruv panelini beradi.
- **Reseller** — registrator hamkori, masalan, domenlarni registrator nomidan sotadigan hosting provayder.

Siz egasi sifatida domenning **administratori** yoki **registranti** deb ataladi.

## Nega domen o‘z kompaniyangiz nomida bo‘lishi kerak

Yuridik jihatdan domen ro‘yxatdan o‘tkazish ma’lumotlarida administrator sifatida ko‘rsatilgan shaxsga tegishli. Ko‘p uchraydigan holat: domenni dasturchi, sobiq xodim yoki agentlik o‘z nomiga ro‘yxatdan o‘tkazadi. Munosabatlar yaxshi ekan, muammo yo‘q. Ammo nizo chiqsa yoki pudratchi ketsa, kompaniya o‘z sayti va pochtasiga kirish huquqini yo‘qotishi mumkin.

**Egasi uchun chek-list:**

1. **Domen administratori — sizning yuridik shaxsingiz**, jismoniy shaxs yoki pudratchi emas.
2. **Registratordagi akkaunt** bir nechta mas’ul shaxs kira oladigan korporativ pochtaga ochilgan.
3. Registrator akkauntida **ikki bosqichli autentifikatsiya yoqilgan**.
4. **Avtomatik uzaytirish yoqilgan**, aloqa pochtasi esa dolzarb, shunda eslatmalar keladi.
5. **Kirish ma’lumotlari hujjatlashtirilgan** va korporativ parollar menejerida saqlanadi.

Agar domen allaqachon boshqa shaxs nomida bo‘lsa, uni yangi administratorga o‘tkazish mumkin. Tartib registrator va zonaga bog‘liq bo‘lib, odatda joriy egasining tasdig‘ini talab qiladi.

## Domen uzaytirilmasa nima bo‘ladi

Muddat tugagach, domen odatda darhol bo‘shatilmaydi: registrator uning ishlashini to‘xtatadi va uzaytirish uchun vaqt beradi. Keyin domenni faqat qo‘shimcha to‘lov evaziga tiklash mumkin bo‘lgan davr kelishi mumkin. Shunda ham uzaytirilmasa, nom bo‘shatiladi va uni istalgan kishi ro‘yxatdan o‘tkazishi mumkin. Aniq muddatlar zona va registratorga bog‘liq.

## FAQ

### Registratorni almashtirsa bo‘ladimi?

Ha. Umumiy zonalarda joriy registrator beradigan avtorizatsiya kodi (auth-code yoki EPP-kod) bilan transfer tartibi qo‘llaniladi. Milliy zonalarda tartib farq qilishi mumkin. Ro‘yxatdan o‘tkazilgandan yoki oldingi transferdan so‘ng ko‘chirish vaqtincha bloklangan bo‘lishi mumkin.

### WHOIS nima?

Bu domenlar haqidagi ochiq baza: ro‘yxatdan o‘tkazilgan sana, tugash muddati, registrator, DNS-serverlar. Jismoniy shaxs egalarning shaxsiy ma’lumotlari ko‘pincha yashirilgan, lekin WHOIS orqali domen muddati va registratorini har doim tekshirish mumkin.

### Subdomen alohida domenmi?

Yo‘q. Subdomen sizning domeningiz ichida DNS yozuvlari orqali yaratiladi va alohida ro‘yxatdan o‘tkazish yoki to‘lovni talab qilmaydi. Masalan, `blog.example.uz` asosiy saytdan butunlay boshqa serverga yo‘naltirilishi mumkin.
