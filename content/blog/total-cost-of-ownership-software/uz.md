---
title: Dasturiy ta’minotga egalik qilishning umumiy narxi
description: Ishga tushirilgandan keyin dasturiy ta’minotga egalik narxi nimalardan iborat: hosting, litsenziyalar, qo‘llab-quvvatlash, yangilanish va xodimlar.
summary: Ishlab chiqish narxi dasturiy mahsulot xarajatlarining faqat birinchi qismi. Ishga tushirilgandan keyin hosting, litsenziyalar, qo‘llab-quvvatlash, yangilanishlar, odamlar va uzilishlar uchun to‘lash kerak, shuning uchun variantlarni bir necha yillik umumiy egalik narxi (TCO) bo‘yicha solishtiring.
---

## TCO nima va u nega muhim

**Egalik qilishning umumiy narxi (Total Cost of Ownership, TCO)** — tizimga uning butun hayoti davomida sarflaydigan barcha pulingiz: ishlab chiqish yoki sotib olish, ishga tushirish, ekspluatatsiya, rivojlantirish va oxirida almashtirish yoki ishdan chiqarish.

Ko‘plab loyihalarning xatosi — faqat ishlab chiqish smetasini solishtirish. Arzon yechim qo‘llab-quvvatlashda qimmat bo‘lishi, boshida qimmatroq yechim esa bir necha yilda arzonroq bo‘lishi mumkin. «Qurish yoki sotib olish», pudratchi va stek tanlovini aynan TCO bo‘yicha qilish kerak.

## Ishga tushirilgandan keyingi xarajatlar

### Infratuzilma va hosting

- serverlar yoki bulut, ma’lumotlar bazalari, fayl ombori;
- CDN, domenlar, SSL-sertifikatlar;
- zaxira nusxalar va ularni saqlash;
- monitoring va loglash.

Bulut xarajatlari yuklama bilan birga o‘sadi va ko‘pincha ishga tushirishda kutilganidan sezilarliroq bo‘ladi.

### Litsenziyalar va uchinchi tomon servislari

- pullik kutubxonalar, SDK, shriftlar;
- SaaS-vositalar: pochta jo‘natmalari, SMS, xaritalar, analitika;
- to‘lov tizimlari va AI-modellarning foydalanishga qarab to‘lanadigan API lari;
- ilova do‘konlari va dasturchi akkauntlari.

Obunalar sezdirmay yig‘iladi: har biri alohida mayda ko‘rinadi.

### Qo‘llab-quvvatlash va tuzatishlar

- foydalanuvchilar topgan xatolarni tuzatish;
- insidentlarga, jumladan ish vaqtidan tashqari javob berish;
- foydalanuvchilarni texnik qo‘llab-quvvatlash.

### Yangilanishlar va moslik

- freymvorklar va bog‘liqliklarni yangilash, zaifliklarni yopish;
- mobil ilovalarni iOS va Android ning yangi versiyalariga moslash;
- siz bog‘liq bo‘lgan tashqi API lardagi o‘zgarishlar;
- qonunchilik talablari, masalan shaxsiy ma’lumotlarni saqlash bo‘yicha.

Yangilanishlardan voz kechish pulni tejamaydi, balki keyinga suradi: vaqt o‘tib tizim eskiradi va o‘tish qimmatlashadi.

### Odamlar

- dasturchilar, DevOps, testerlar — shtatda yoki qo‘llab-quvvatlash shartnomasi bo‘yicha;
- mahsulot menejerining vaqti;
- tizimda ishlaydigan xodimlarni o‘qitish;
- jamoa almashganda bilimlarni topshirish.

### Uzilishlar va risklar

- servis ishlamay qolganda yo‘qotilgan daromad;
- nosozlik paytida xodimlarning qo‘lda ishlashi;
- obro‘ yo‘qotish;
- insidentdan keyin ma’lumotlarni tiklash.

### Rivojlantirish

Ishlayotgan mahsulotga deyarli har doim yangi funksiyalar kerak. Rivojlantirish byudjeti alohida loyiha emas, egalikning bir qismi.

## TCO ni oldindan qanday baholash kerak

1. **Muddatni tanlang** — odatda tizimdan foydalanishni rejalashtirgan bir necha yil.
2. **Har bir variant uchun** yuqoridagi ro‘yxat bo‘yicha xarajat moddalarini yozing.
3. **Bir martalik** (ishlab chiqish, migratsiya, joriy qilish) va **muntazam** (hosting, obunalar, qo‘llab-quvvatlash) xarajatlarni ajrating.
4. **O‘sishni hisobga oling**: foydalanuvchilar ko‘paysa, yuklama, ombor va murojaatlar ham ko‘payadi.
5. **Risklarni baholang**: biznesingiz uchun bir soatlik uzilish qancha turadi.
6. **Variantlarni boshlang‘ich narx emas, umumiy summa bo‘yicha solishtiring.**

| Variant | Boshida odatda arzonroq | Xarajatlar qayerda yig‘iladi |
|---|---|---|
| Tayyor SaaS | Ha | Foydalanuvchi boshiga obuna, cheklovlar, yetkazib beruvchiga bog‘liqlik |
| Buyurtma asosida ishlab chiqish | Yo‘q | Qo‘llab-quvvatlash, yangilanishlar, jamoa |
| Moslashtirilgan open source | Ko‘pincha | Integratsiya, ekspertiza, fork ni yangilash |

## TCO ni qanday kamaytirish mumkin

- Modali emas, **oddiy arxitektura**: komponentlar kamroq — qo‘llab-quvvatlash kamroq.
- **Keng tarqalgan stek**: dasturchi topish osonroq.
- **Avtomatlashtirish**: CI/CD, avtotestlar va monitoring har bir o‘zgarish narxini pasaytiradi.
- **Hujjatlar va kirish huquqlari** faqat pudratchida emas, sizda ham bo‘lsin.
- Obunalar va bulut resurslarini **muntazam audit** qiling.
- Javob vaqti aniq bo‘lgan **qo‘llab-quvvatlash shartnomasi**.

## Keng tarqalgan xatolar

- byudjetni faqat ishlab chiqishga ajratib, ekspluatatsiyaning birinchi yiliga hech narsa qoldirmaslik;
- kod sifatini baholamasdan eng arzon pudratchini tanlash;
- yangilanishlarni shoshilinch bo‘lib qolguncha keyinga surish;
- tizim kamchiliklarini qo‘lda to‘ldirayotgan xodimlar vaqtini hisoblamaslik.

## FAQ

### Ishga tushirilgandan keyin qo‘llab-quvvatlashga byudjetning qancha qismini ajratish kerak?

Universal raqam yo‘q. U tizim murakkabligi, integratsiyalar soni, yuklama va rivojlanish sur’atiga bog‘liq. Aniq xarajat moddalarini yozib, pudratchidan qo‘llab-quvvatlashni ishlab chiqishdan alohida baholashni so‘rash ishonchliroq.

### Nima foydaliroq: tayyor SaaS yoki o‘z ishlanmamiz?

Bir xil muddat uchun TCO ni solishtiring. SaaS odatda boshida arzonroq, lekin obuna foydalanuvchilar soni bilan o‘sadi. O‘z ishlanmangiz boshida qimmatroq, ammo jarayonlar noyob yoki foydalanuvchilar ko‘p bo‘lsa, o‘zini oqlashi mumkin.

### Yangilanishlardan voz kechib tejash mumkinmi?

Faqat vaqtincha. Eskirgan bog‘liqliklar zaiflik va nomuvofiqliklarni to‘playdi, keyinchalik yangilash yoki qayta yozish muntazam qo‘llab-quvvatlashdan qimmatroq tushadi.
