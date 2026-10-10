---
title: Bug bounty yoki zaifliklarni oshkor qilish dasturini qanday boshlash
description: Zaifliklarni oshkor qilish dasturi yoki bug bounty’ni qanday boshlash: security.txt, siyosat, scope va mukofotlar, platforma yoki o‘zingiz, triaj va tayyorlik.
summary: Zaifliklarni oshkor qilish dasturidan boshlang: security.txt fayli, scope va tadqiqotchilar uchun kafolatlar yozilgan aniq siyosat hamda triaj jarayoni; pullik mukofotlarni jamoa topilganlarni tez tuzata olgandagina qo‘shing.
---
## Qisqa javob

Tadqiqotchilar ommaviy mahsulotlarda baribir zaifliklarni topadi. Savol faqat shundaki, ularda sizga xabar berishning xavfsiz va tushunarli yo‘li bormi. Ikki daraja bor:

- **Zaifliklarni oshkor qilish dasturi (VDP)** — ommaviy va’da: «muammolar haqida shu yerga yozing, biz javob beramiz va vijdonan qilingan tadqiqot uchun da’vo qilmaymiz». Pul shart emas.
- **Bug bounty** — VDP va tasdiqlangan topilmalar uchun **mukofotlar**. Bu ko‘proq tadqiqotchi va ko‘proq hisobot jalb qiladi.

Ko‘pchilik kompaniyalar uchun to‘g‘ri tartib: avval VDP, keyin yopiq bug bounty va eng oxirida ommaviy bug bounty.

## VDP va bug bounty

| | VDP | Yopiq bug bounty | Ommaviy bug bounty |
|---|---|---|---|
| **Kim qatnashadi** | Biror narsa topgan har kim | Taklif qilingan tadqiqotchilar | Istagan har kim |
| **Mukofot** | Minnatdorlik, hall of fame | Pul | Pul |
| **Hisobotlar oqimi** | Kam | Nazorat ostida | Ko‘p, shovqin bilan |
| **Jamoaga yuklama** | Yengil | O‘rtacha | Yuqori |
| **Kimga mos** | Har qanday ommaviy mahsulot | Jarayonni sinab ko‘rish | Yetuk xavfsizlik jamoalari |

## Tayyorlik mezonlari

Quyidagilarga halol «ha» deb javob bera olmaguningizcha pullik dasturni boshlamang:

- Asosiy gigiena bajarilgan: skanerlash, ishga tushirishdan oldingi chek-list, ideal holda pentest. Aks holda har qanday skaner topadigan narsalar uchun pul to‘laysiz.
- Kelayotgan hisobotlar uchun **aniq mas’ul shaxs** va uning o‘rinbosari bor.
- Dasturchilarda zaifliklarni tuzatish uchun «sprint imkon berganda» emas, oldindan ajratilgan vaqt bor.
- **Aktivlar reyestri** bor: qaysi domenlar, ilovalar va API sizniki va production’da ishlaydi.
- Rahbariyat va yuristlar siyosat va byudjetni tasdiqlagan.
- Tuzatishni tez chiqarishni va kerak bo‘lsa foydalanuvchilarni xabardor qilishni bilasiz.

## security.txt

`/.well-known/security.txt` manzilidagi kichik matnli fayl tadqiqotchilarga qayerga yozish kerakligini aytadi. Format RFC 9116 da tavsiflangan, `Contact` va `Expires` maydonlari majburiy.

```text
Contact: mailto:security@example.com
Expires: 2027-10-01T00:00:00.000Z
Policy: https://example.com/security-policy
Preferred-Languages: en, ru, uz
Canonical: https://example.com/.well-known/security.txt
```

`Expires`ni yangilash uchun eslatma qo‘ying — muddati o‘tgan fayl tashlab qo‘yilgan dasturdek ko‘rinadi.

## Oshkor qilish siyosati

Yaxshi siyosat qisqa va bir ma’noli bo‘ladi:

- **Scope** — testlash mumkin bo‘lgan aniq domenlar, ilovalar va API xostlar.
- **Scope tashqarisida** — uchinchi tomon servislari, staging, jismoniy ofislar, xodimlarga ijtimoiy muhandislik.
- **Qoidalar** — DoS yo‘q, isbot uchun zarur minimumdan ortiq boshqalarning ma’lumotlariga kirish yo‘q, ma’lumotlarni o‘chirish yo‘q; isbot olindimi — to‘xtang va xabar bering.
- **Safe harbor** — qoidalar doirasidagi vijdonan tadqiqot huquqiy da’volarga olib kelmasligi haqida aniq bayonot.
- **Qanday xabar berish** — kanal, kerakli tafsilotlar, til.
- **Sizning majburiyatlaringiz** — qabul qilinganini qachon tasdiqlaysiz, tadqiqotchini qanday xabardor qilib turasiz va ommaviy oshkor qilish qanday kelishiladi.
- **Qabul qilinmaydigan topilmalar** — masalan, real ta’sirsiz yetishmayotgan sarlavhalar, self-XSS, dalilsiz avtomatik skaner hisobotlari.

## Scope va mukofotlar jadvali

Mukofot odatda sarflangan kuchga emas, **xavf darajasiga** bog‘lanadi. Tadqiqotchilar nimani kutishni bilishi uchun jadvalni e’lon qiling:

| Xavf darajasi | Odatiy misollar | Mukofot |
|---|---|---|
| Kritik | Masofadan kod bajarish, akkauntni to‘liq egallash, barcha foydalanuvchilar ma’lumotlariga kirish | Eng yuqori daraja |
| Yuqori | Boshqalarning ma’lumotlariga kirish (IDOR), admin paneldagi stored XSS, SQL-in’eksiya | Yuqori daraja |
| O‘rta | Muhim amallardagi CSRF, reflected XSS | O‘rta daraja |
| Past | Cheklangan ta’sirli ma’lumot oshkor bo‘lishi | Past daraja yoki minnatdorlik |

Summalarni byudjetingiz, aktivning muhimligi va bozoringizdagi o‘xshash dasturlar qancha to‘lashidan kelib chiqib belgilang. Asosiy va ikkinchi darajali aktivlar uchun turli jadvallar qilish mumkin.

## Platforma yoki o‘z kuchingiz bilan

**Bug bounty platformasi** tadqiqotchilarga kirish, hisobotlar bilan ishlash interfeysi, to‘lovlar va ko‘pincha dublikatlar va shovqinni saralaydigan triaj xizmatini beradi. Siz platforma komissiyasini to‘laysiz va uning qoidalariga amal qilasiz.

**O‘z dasturingiz** komissiya jihatidan arzonroq va to‘liq nazorat beradi, lekin hamma narsa sizning zimmangizda: qabul qilish, triaj, huquqiy masalalar, turli mamlakatlardagi odamlarga to‘lovlar.

Keng tarqalgan yo‘l — o‘z VDP’ingiz, keyin platformada yopiq dastur.

## Triaj jarayoni

1. Hisobotni shaxsiy pochtada emas, bitta kuzatiladigan kanalda **qabul qiling**.
2. Siyosatda va’da qilingan muddatda qabul qilinganini **tasdiqlang**.
3. Muammoni **takrorlang** va dublikat emasligini tekshiring.
4. **Xavf darajasini** yagona usul bilan baholang, masalan CVSS va biznesga ta’siri.
5. **Tuzating** va tekshiring, ideal holda tadqiqotchidan tasdiqlashni so‘rang.
6. Tadqiqotchini **mukofotlang** va minnatdorlik bildiring.
7. Kelishilgan bo‘lsa, **oshkor qiling** va o‘xshash xatolar takrorlanmasligi uchun asl sababni qayd eting.

## FAQ

### Dastur yo‘q, lekin pul talab qilishsa nima qilish kerak?

Ba’zilar ahamiyati past hisobotlar yuborib, to‘lov so‘raydi. Minnatdorlik bildiring, hisobotni boshqalari kabi baholang va siyosatingizga havola qiling. Qoidalardan tashqaridagi narsalar uchun bosim ostida pul to‘lamang.

### Dublikatlar uchun to‘lash kerakmi?

Odatda faqat birinchi tasdiqlangan hisobot mukofotlanadi. Nizolarni oldini olish uchun buni siyosatda yozib qo‘ying.

### Kichik kompaniya VDP yurita oladimi?

Ha. Boshlash uchun security.txt fayli, qisqa siyosat va bitta mas’ul shaxs yetarli va bu tadqiqotchilarni kimga yozishni taxmin qilishga majburlashdan ancha yaxshi.
