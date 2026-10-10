---
title: OWASP Top 10 oddiy tilda: veb-ilovalarning asosiy zaifliklari
description: OWASP Top 10 ning barcha o‘nta toifasi tushunarli misollarda: veb-ilovada nima noto‘g‘ri ketishi mumkin va har bir xavfni qaysi himoya yopadi.
summary: OWASP Top 10 — veb-ilovalardagi eng ko‘p uchraydigan va xavfli zaiflik turlari ro‘yxati. Tekshiruvni kirish huquqlari, sozlamalar, bog‘liqliklar, inyeksiyalar va tizimga kirishdan boshlash kerak.
---

## OWASP Top 10 nima

**OWASP** — ilovalar xavfsizligini o‘rganadigan notijorat hamjamiyat. Uning **Top 10** ro‘yxati real loyihalar ma’lumotlari asosida tuzilgan eng keng tarqalgan va xavfli zaiflik toifalari reytingidir. Ro‘yxat bir necha yilda bir yangilanadi; quyida 2025 yilgi tahrir. Tahrirlar orasida raqamlar o‘zgaradi, lekin xavflarning o‘zi deyarli eskirmaydi.

Bu standart ham, to‘liq chek-list ham emas, balki xarita: u xatolar qayerda ko‘proq uchrashini ko‘rsatadi.

## O‘nta toifa

### A01. Kirish nazoratining buzilishi

**Misol:** foydalanuvchi manzildagi `/orders/1001` ni `/orders/1002` ga o‘zgartiradi va boshqa birovning buyurtmasini ko‘radi. SSRF ham shu yerga kiradi — serverni ichki manzilga so‘rov yuborishga majburlash.
**Himoya:** huquqlarni har bir so‘rovda serverda tekshirish, standart holatda hammasini taqiqlash.

### A02. Konfiguratsiya xatolari

**Misol:** production’da debug rejimi yoqilgan, admin panel standart parol bilan ochiq, fayllar ombori hammaga ochiq.
**Himoya:** har bir muhit uchun sozlash chek-listi va konfiguratsiyani avtomatik tekshirish.

### A03. Dasturiy ta’minot yetkazib berish zanjiridagi nosozliklar

**Misol:** mashhur npm paketi buzib kirilgan va zararli kod sizning yig‘ilmangizga tushgan.
**Himoya:** lock-fayllar, bog‘liqliklarni ma’lum zaifliklarga tekshirish, ortiqcha paketlarni kamaytirish.

### A04. Kriptografik xatolar

**Misol:** sayt HTTP orqali ishlaydi, parollar esa MD5 da saqlanadi.
**Himoya:** hamma joyda HTTPS, zamonaviy algoritmlar, parollar uchun sekin xeshlar.

### A05. Inyeksiyalar

**Misol:** qidiruv maydoni orqali SQL-inyeksiya yoki izoh orqali XSS.
**Himoya:** parametrlangan so‘rovlar va chiqishni kontekstga qarab ekranlash.

### A06. Xavfsiz bo‘lmagan dizayn

**Misol:** promokodni cheklovsiz tanlash mumkin, parolni tiklash esa taxmin qilinadigan «maxfiy savol» orqali ishlaydi.
**Himoya:** suiiste’mol ssenariylarini loyihalash bosqichidayoq o‘ylab chiqish (threat modeling).

### A07. Autentifikatsiya xatolari

**Misol:** kirish formasi urinishlar sonini cheklamaydi va hujumchi sizib chiqqan login–parol juftliklarini qo‘yib ko‘radi.
**Himoya:** rate limiting, 2FA, parollarni sizib chiqqanlar ro‘yxati bo‘yicha tekshirish.

### A08. Dasturiy ta’minot va ma’lumotlar yaxlitligining buzilishi

**Misol:** ilova yangilanishlarni imzoni tekshirmasdan yuklaydi yoki foydalanuvchidan kelgan ma’lumotlarni deserializatsiya qiladi.
**Himoya:** imzolarni tekshirish, CI/CD ni himoyalash, tashqaridan kelgan serializatsiyalangan obyektlarga ishonmaslik.

### A09. Loglash va ogohlantirish muammolari

**Misol:** buzib kirish oylar o‘tib aniqlangan, chunki muvaffaqiyatsiz kirishlarni hech kim yozib bormagan.
**Himoya:** xavfsizlik hodisalarini loglash va shubhali faollik bo‘yicha ogohlantirishlarni sozlash.

### A10. Favqulodda holatlarni noto‘g‘ri qayta ishlash

**Misol:** xatolik yuz berganda avtorizatsiya servisi foydalanuvchini «o‘tkazib yuboradi», xato sahifasi esa chaqiruvlar steki va serverdagi yo‘llarni ko‘rsatadi.
**Himoya:** nosozlikda kirishni yopish (fail closed), foydalanuvchiga umumiy xabar, tafsilotlar — faqat logga.

## Birinchi navbatda nimani tekshirish kerak

Vaqt kam bo‘lsa, shulardan boshlang:

1. **Kirish huquqlari:** foydalanuvchi boshqa ID ni qo‘yib, birovning ma’lumotlarini ola oladimi?
2. **Production sozlamalari:** debug o‘chirilganmi, standart parollar almashtirilganmi, xizmat panellari yopilganmi?
3. **Bog‘liqliklar:** stekingiz uchun `npm audit`, `pip-audit` yoki shunga o‘xshash vositani ishga tushiring.
4. **Ma’lumot kiritish:** bazaga barcha so‘rovlar parametrlanganmi?
5. **Kirish:** urinishlar cheklovi va administratorlar uchun 2FA bormi?
6. **HTTPS va parollarni saqlash.**

## Ko‘p uchraydigan xatolar

- Freymvork «hammasini o‘zi himoya qiladi» deb o‘ylash. U xavflarning bir qismini yopadi, lekin biznes-mantiqni tekshirmaydi.
- Huquqlarni faqat interfeysda tekshirish: yashirilgan tugma so‘rovni to‘g‘ridan-to‘g‘ri yuborishga xalaqit bermaydi.
- Chek-listni bir marta o‘tib, unutish. Xavfsizlik — muntazam jarayon.

## FAQ

### Top 10 ning barcha bandlarini yopish yetarlimi?

Yo‘q. Bu minimal asos va ustuvorliklarni belgilash usuli. Chuqurroq tekshiruv uchun OWASP ASVS standarti, audit va pentest bor.

### Jamoada buni kim bilishi kerak?

Dasturchilar — kodda xato qilmaslik uchun, mahsulot rahbari — xavfsizlikka vaqt ajratish uchun, testerlar — suiiste’mol ssenariylarini tekshirish uchun.

### Rasmiy ro‘yxatni qayerdan ko‘rish mumkin?

[OWASP Top 10](https://owasp.org/www-project-top-ten/) loyihasi sahifasida — u yerda har bir toifaning tavsifi va batafsil qo‘llanmalarga havolalar bor.
