---
title: Nega DNS darhol yangilanmaydi: TTL va tarqalish
description: Nega DNS o‘zgarishlari darhol ko‘rinmaydi, bunga TTL va rezolver keshlari qanday ta’sir qiladi, tarqalishni qanday tekshirish va ko‘chishga tayyorlanish.
summary: Rezolverlar DNS javoblarini TTL muddati davomida keshda saqlaydi, shuning uchun yozuv o‘zgargandan keyin ayrim foydalanuvchilar kesh tugaguncha eski qiymatni ko‘radi; rejali almashtirish tez o‘tishi uchun TTL oldindan pasaytiriladi.
---
## Qisqa javob

Aslida DNS hech narsani «tarqatmaydi». Provayderingizda yozuvni o‘zgartirsangiz, u **vakolatli serverlarda** darhol yangilanadi. Kechikish millionlab **rezolverlar** — internet provayderlari serverlari, 8.8.8.8 kabi ochiq DNS’lar, shuningdek brauzer va operatsion tizimlar — eski javobni eslab qolgani va uni **TTL** tugaguncha saqlagani sababli yuzaga keladi.

Kesh muddati tugamaguncha rezolver qayta so‘ramaydi. Shuning uchun kimdir yangi saytni, kimdir esa hali eskisini ko‘radi.

## TTL nima

**TTL (time to live)** — har bir yozuvga biriktirilgan soniyalar soni. U rezolverga javobni qancha vaqt saqlash mumkinligini aytadi.

- `300` — 5 daqiqa;
- `3600` — 1 soat;
- `86400` — bir sutka.

Muhim jihat: TTL **keshda allaqachon turgan qiymatga** amal qiladi. Agar yozuv TTL 86400 bilan turgan bo‘lsa va siz IP’ni almashtirib, bir vaqtda TTL’ni 300 qilsangiz, eski javobni olgan rezolverlar uni baribir bir sutkagacha saqlaydi.

## Kechikish yana qayerdan keladi

- **Brauzer va OT keshi.** Rezolver yangi manzilni bilsa ham, qurilma eskisini eslab qolgan bo‘lishi mumkin.
- **NS serverlarni almashtirish.** DNS’ni boshqa provayderga ko‘chirganda yuqori darajali zonadagi (.com, .uz va h.k.) NS yozuvlarining o‘z TTL’i bor va uni siz boshqara olmaysiz. Bu odatda A yozuvini tahrirlashdan ko‘ra uzoqroq davom etadi.
- **Negativ kesh.** Agar kimdir nomni siz yaratishingizdan oldin so‘ragan bo‘lsa, rezolver «bunday nom yo‘q» javobini zonaning SOA yozuvida ko‘rsatilgan muddatga eslab qoladi.
- **TTL’ga rioya qilmaydigan rezolverlar.** Ayrimlari keshni e’lon qilinganidan uzoqroq saqlaydi. Bunga to‘liq ta’sir qilib bo‘lmaydi.

## O‘zgarishlar qo‘llanganini qanday tekshirish

Avval yangi qiymatni **vakolatli server** qaytarayotganiga ishonch hosil qiling — bu paneldagi xatoni istisno qiladi:

```bash
# domenning NS serverlarini bilish
dig example.com NS +short

# vakolatli serverdan to‘g‘ridan-to‘g‘ri so‘rash
dig @ns1.dns-provider.com example.com A +short
```

So‘ng ochiq rezolverlarni tekshiring va ularda qancha TTL qolganini ko‘ring:

```bash
dig @8.8.8.8 example.com A
dig @1.1.1.1 example.com A
```

Javobning ikkinchi ustunidagi raqam — keshning qolgan soniyalari. Turli mamlakatlar bo‘yicha tezkor manzara uchun turli hududlardagi rezolverlarni so‘raydigan onlayn DNS tekshirish xizmatlari mos keladi.

Mahalliy keshni tozalash uchun:

```bash
# Windows
ipconfig /flushdns
```

macOS va Linux’da buyruqlar tizim versiyasiga bog‘liq — brauzer keshini chetlab o‘tadigan `dig` bilan tekshirish osonroq.

## Rejali ko‘chishga qanday tayyorlanish

Server almashtirish sanasini oldindan bilsangiz, kechikishni deyarli nolga tushirish mumkin.

1. O‘zgartiriladigan yozuvlarning **joriy TTL’ini ko‘ring**.
2. Ko‘chishdan kamida bitta eski TTL oldin **TTL’ni 300 soniyagacha pasaytiring**. Bir sutka turgan bo‘lsa — bir sutka oldin (zaxira bilan bo‘lsa yanada yaxshi).
3. Eski keshlar muddati tugashini **kuting**. Endi barcha rezolverlar yozuvni ko‘pi bilan 5 daqiqa saqlaydi.
4. Yozuv **qiymatini yangi manzilga almashtiring**.
5. **Eski serverni** yana bir muddat yoqilgan holda qoldiring: trafikning bir qismi qaysar keshlardan u yerga kelishi mumkin.
6. Hammasi ishlayotganiga ishonch hosil qilgach, **TTL’ni** odatiy qiymatga qaytaring.

## Ko‘p uchraydigan xatolar

- **TTL’ni IP almashtirish bilan bir vaqtda pasaytirish.** Keshida uzun TTL’li eski qiymat turganlar uchun hech qanday samara bermaydi.
- **Almashtirishdan so‘ng eski serverni darhol o‘chirish.** Eskirgan keshli foydalanuvchilar xato ko‘radi.
- **Doimiy juda past TTL saqlash.** Bu DNS so‘rovlari sonini oshiradi va saytning birinchi ochilishini biroz sekinlashtiradi. Barqaror yozuvlar uchun bir soatdan boshlab TTL maqbul.
- **Faqat o‘z brauzeringizda tekshirish.** Mahalliy keshingiz boshqalar nimani ko‘rayotganini ko‘rsatmaydi.

## FAQ

### DNS o‘zgartirilgandan keyin qancha kutish kerak?

Eski yozuvning TTL’i qancha bo‘lsa, shuncha, ustiga qurilmalar keshi uchun ozgina zaxira. NS serverlar almashtirilganda yuqori darajali zonaning TTL’iga qarang — odatda bu oddiy yozuvlarnikidan uzoqroq.

### Muayyan internet provayderida yangilanishni tezlashtirish mumkinmi?

Yo‘q, birovning rezolver keshini tozalay olmaysiz. Ayrim ochiq DNS xizmatlari o‘z rezolveri uchun keshni tozalash shaklini taklif qiladi, lekin bu faqat ularning foydalanuvchilariga ta’sir qiladi.

### Standart holatda qanday TTL qo‘yish kerak?

Kam o‘zgaradigan yozuvlar uchun — 3600 soniyadan boshlab. Rejali o‘zgarishlardan oldin vaqtincha 300 gacha pasaytiring.
