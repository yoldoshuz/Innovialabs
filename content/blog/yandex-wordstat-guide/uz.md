---
title: Yandex Wordstat’dan so‘rovlarni tanlashda qanday foydalanish
description: Yandex Wordstat bo‘yicha amaliy qo‘llanma: qo‘shtirnoq, !, +, - operatorlari, hudud filtri, mavsumiylik, qurilmalar kesimi va chastotani to‘g‘ri o‘qish.
summary: Wordstat so‘rov va uning barcha kengaytmalari Yandex’da oyiga necha marta uchraganini ko‘rsatadi; aniq ibora bo‘yicha haqiqiy talabni bilish uchun qo‘shtirnoq, ! kabi operatorlar va hudud filtridan foydalaning.
---

## Wordstat nimani ko‘rsatadi

**Yandex Wordstat** — qidiruv so‘rovlari statistikasini beruvchi Yandex’ning bepul servisi. Eng muhimi: so‘rov yonidagi raqam — bu odamlar soni emas, balki **oy davomida qidiruv natijalarining ko‘rsatilishlar soni**. Standart holatda u so‘zlaringiz istalgan tartib va shaklda qatnashgan **barcha so‘rovlarni** o‘z ichiga oladi.

Masalan, «kvartira ta’miri» chastotasiga «kvartira ta’miri narxlari», «kvartira dizayni va kalit topshirish ta’mir» va hokazolar kiradi. Shuning uchun umumiy raqam deyarli har doim aniq ifodaga bo‘lgan talabni oshirib ko‘rsatadi.

## Operatorlar

| Operator | Misol | Nima qiladi |
|---|---|---|
| `" "` | `"kvartira ta’miri"` | Faqat shu so‘zlardan iborat so‘rovlar, qo‘shimchasiz |
| `!` | `!kvartira !ta’miri` | So‘z shaklini qat’iy belgilaydi |
| `+` | `ta’mir +va bezak` | Yordamchi so‘zni (bog‘lovchi, ko‘makchi) hisobga oladi |
| `-` | `kvartira ta’miri -bepul` | Shu so‘z bor so‘rovlarni chiqarib tashlaydi |
| `[ ]` | `[chipta moskva toshkent]` | So‘zlar tartibini qat’iy belgilaydi |
| `( \| )` | `ta’mir (kvartira \| uy)` | Variantlarni bitta so‘rovda birlashtiradi |

Operatorlarni birlashtirish mumkin. Eng ko‘p ishlatiladigan variant — **undov belgili qo‘shtirnoq**: `"!kvartira !ta’miri"`. Shunday qilib, aynan shu shakldagi iboraning aniq chastotasini olasiz. O‘zbek va rus tillarida so‘zlar shakli o‘zgargani uchun operatorlar ayniqsa muhim.

## Chastotani qanday o‘qish kerak

Uchta darajaga qarash qulay:

1. **Bazaviy** — `kvartira ta’miri`: barcha uzun variantlar bilan mavzuga umumiy qiziqish.
2. **Iboraviy** — `"kvartira ta’miri"`: aynan shu so‘zlar, istalgan shaklda.
3. **Aniq** — `"!kvartira !ta’miri"`: muayyan shakldagi ibora.

Agar bazaviy chastota katta, iboraviy esa nolga yaqin bo‘lsa — bu so‘rovni deyarli hech kim aynan shunday kiritmaydi, talab uzun «dum»larga tarqalgan. Aynan shu dumlarni yig‘ish kerak.

## Hudud

Chastota hududga kuchli bog‘liq. Agar bitta shaharda ishlasangiz, **hudud filtrida uni tanlang** — aks holda Yandex’ning butun auditoriyasi bo‘yicha talabni ko‘rasiz, uning ko‘p qismi sizga aloqasi yo‘q. Mamlakat bo‘ylab yetkazib beradigan biznes uchun umumiy raqamni ham, yirik shaharlar kesimini ham ko‘ring.

Wordstat faqat Yandex auditoriyasini aks ettirishini unutmang. Ko‘pchilik Google’da qidiradigan hududlarda uning ma’lumotlari so‘rovlarni o‘zaro solishtirish uchun foydali, lekin butun bozorni baholash uchun emas.

## Mavsumiylik

**Dinamika** rejimi chastota oylar yoki haftalar bo‘yicha qanday o‘zgarganini ko‘rsatadi. Bu quyidagilarga yordam beradi:

- kontent va reklamani talab cho‘qqisi paytida emas, **undan oldin** ishga tushirish;
- mavsumiy pasayishni sayt muammolari bilan adashtirmaslik;
- o‘sayotgan mavzularni raqobatchilardan oldin payqash.

Qo‘shni oylarni emas, turli yillarning bir xil oylarini solishtiring.

## Qurilmalar

Wordstat statistikani **kompyuterlar, telefonlar va planshetlar** bo‘yicha alohida ko‘rish imkonini beradi. Agar talabning katta qismi telefonlardan kelsa, kerakli sahifalarning mobil versiyasi tez va qulay ekanini tekshiring — ko‘pchilik foydalanuvchilar aynan uni ko‘radi.

## Ish tartibi

1. Marker so‘rovni operatorlarsiz kiriting va chap ustundagi kengaytmalarni o‘rganing.
2. Foydali dumlarni belgilang, maqsadsiz so‘zlarni minus-so‘zlarga qo‘shing.
3. Har bir nomzod uchun iboraviy va aniq chastotani tekshiring.
4. Kerakli hududni o‘rnating.
5. Dinamika va qurilmalar kesimini ko‘ring.
6. Natijalarni semantik yadro jadvaliga o‘tkazing.

## Ko‘p uchraydigan xatolar

- **Bazaviy chastotani** aniq ibora bo‘yicha talab deb qabul qilish.
- **Hududni unutish** va butun mamlakat yoki dunyo raqamlari asosida rejalashtirish.
- **Kam chastotali so‘rovlarni e’tiborsiz qoldirish** — ular bo‘yicha ko‘pincha targ‘ib qilish osonroq va ular niyatni aniqroq aks ettiradi.
- **Natijalarni baholashda mavsumiylikni hisobga olmaslik.**

## FAQ

### Nega dumlar chastotasining yig‘indisi asosiy so‘rovnikidan katta?

Bu xato emas: har bir dum o‘z kengaytmalarini ham o‘z ichiga oladi, shuning uchun bir xil so‘rovlar bir nechta qatorda hisoblanadi. Chap ustundagi chastotalarni qo‘shib bo‘lmaydi.

### Wordstat Google’dagi talabni baholash uchun mos keladimi?

Faqat bilvosita. U Yandex auditoriyasining xulq-atvorini ko‘rsatadi. Google uchun Keyword Planner va Search Console’dan, Wordstat’dan esa ifodalarni o‘zaro solishtirish uchun foydalaning.

### Wordstat’dan foydalanish uchun akkaunt kerakmi?

Yandex ID orqali kirish kerak. Servisning o‘zi bepul.
