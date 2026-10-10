---
title: Sayt qanday ishlaydi: klient, server, HTTP va brauzer
description: Sayt qanday ishlashi haqida oddiy tushuntirish: brauzer, server, DNS va HTTP vazifalari hamda HTML, CSS, JavaScript va ma’lumotlar bazasining o‘rni.
summary: Sayt — bu muloqot: brauzer (klient) DNS orqali serverni topadi, unga HTTP so‘rov yuboradi, server esa HTML, CSS, JavaScript va ma’lumotlarni qaytaradi, brauzer ulardan sahifa yig‘adi.
---
## Qisqa javob: so‘rov va javob

Har qanday sayt **klient — server** modeli bo‘yicha ishlaydi. **Klient** — bu sizning brauzeringiz (yoki mobil ilova). **Server** — data-markazdagi kompyuter bo‘lib, unda sayt kodi va ma’lumotlari saqlanadi. Ular **HTTP** protokoli orqali muloqot qiladi: klient so‘rov yuboradi, server javob qaytaradi.

Qolgan hamma narsa — DNS, ma’lumotlar bazasi, CSS, JavaScript — shu muloqotni tez, chiroyli va foydali qilish uchun kerak.

## Ishtirokchilar va ularning vazifalari

| Ishtirokchi | Nima qiladi |
|---|---|
| **Brauzer** | So‘rov yuboradi, fayllarni oladi va sahifani chizadi |
| **DNS** | Domen nomini (masalan, example.com) server IP-manziliga aylantiradi |
| **Server** | So‘rovlarni qabul qiladi, kodni bajaradi, javob qaytaradi |
| **Ilova (backend)** | Sayt mantiqi: avtorizatsiya, buyurtmalar, hisob-kitoblar |
| **Ma’lumotlar bazasi** | Foydalanuvchilar, mahsulotlar, arizalar va o‘zgaruvchan hamma narsani saqlaydi |

## Butun yo‘l bitta sxemada

```text
[Siz] --manzil kiritasiz--> [Brauzer]
                               |
                               | 1. "example.com ning IP-si qanday?"
                               v
                             [DNS] --> 203.0.113.10
                               |
                               | 2. HTTP so‘rov: GET /catalog
                               v
                            [Server] --3. so‘rov--> [Ma’lumotlar bazasi]
                               |      <--4. mahsulotlar--
                               | 5. HTTP javob: 200 OK + HTML
                               v
                           [Brauzer] --6. CSS, JS, rasmlarni yuklaydi
                               |
                               v
                       [Tayyor sahifa]
```

## HTTP so‘rov va javob nima

**So‘rov** metod, manzil va sarlavhalardan (headers) iborat. Eng ko‘p ishlatiladigan metodlar:

- **GET** — ma’lumot olish (sahifani ochish, rasm yuklash);
- **POST** — ma’lumot yuborish (ariza formasi, to‘lov);
- **PUT/PATCH** va **DELETE** — ma’lumotni o‘zgartirish yoki o‘chirish, odatda API orqali.

**Javob** status kodi va tanadan iborat. Bilish foydali bo‘lgan kodlar:

- **200** — hammasi joyida;
- **301/302** — sahifa ko‘chgan, brauzer yangi manzilga o‘tadi;
- **404** — bunday sahifa yo‘q;
- **500** — server tomonida xatolik.

Bugun deyarli barcha saytlar **HTTPS** dan foydalanadi — bu shifrlangan kanal ichidagi o‘sha HTTP. Usiz brauzer saytni xavfsiz emas deb belgilaydi.

## HTML, CSS, JavaScript va baza qayerda joylashgan

- **HTML** — sahifaning tuzilishi va mazmuni: sarlavhalar, matn, havolalar, formalar.
- **CSS** — tashqi ko‘rinish: ranglar, shriftlar, setka, telefonga moslashish.
- **JavaScript** — xatti-harakat: menyular, slayderlar, sahifani qayta yuklamasdan forma yuborish.

Bu uchtasi **brauzerda** bajariladi — bu **frontend**. Serverdagi, foydalanuvchiga aynan nimani berishni hal qiladigan va **ma’lumotlar bazasi** bilan ishlaydigan kod — bu **backend**. Foydalanuvchi bazani hech qachon to‘g‘ridan-to‘g‘ri ko‘rmaydi, faqat server ko‘rsatishga qaror qilgan narsani ko‘radi.

## Statik va dinamik sayt

- **Statik** — server oldindan tayyorlangan fayllarni beradi. Tez, hostingi arzon, lendinglar va bloglar uchun mos.
- **Dinamik** — sahifa so‘rov paytida bazadagi ma’lumotlardan yig‘iladi. Shaxsiy kabinetlar, do‘konlar, CRM uchun kerak.

Zamonaviy freymvorklar ko‘pincha ikkalasini birlashtiradi: ba’zi sahifalar oldindan, ba’zilari so‘rov bo‘yicha yaratiladi.

## Keng tarqalgan xato tushunchalar

- **«Sayt brauzerda saqlanadi».** Yo‘q, brauzer fayllarni faqat vaqtincha keshlaydi, asl nusxa serverda.
- **«Domen va hosting — bir narsa».** Domen — bu nom, hosting — server ishlaydigan joy. DNS ularni bog‘laydi.
- **«Sahifa ochildi — demak server joyida».** Sahifa kesh yoki CDN dan olingan bo‘lishi mumkin, API esa bu paytda ishlamayotgan bo‘lishi mumkin.

## FAQ

### Server o‘chib qolsa nima bo‘ladi?

Sayt ochilmay qoladi, faqat brauzer yoki CDN keshida turgan sahifalar bundan mustasno. Shuning uchun muhim loyihalarda monitoring va zaxira serverlar sozlanadi.

### Saytni IP orqali ochish mumkin bo‘lsa, DNS nima uchun kerak?

IP-manzillarni eslab qolish qiyin va boshqa serverga ko‘chganda ular o‘zgaradi. DNS doimiy nomni saqlab, manzilni foydalanuvchilarga sezdirmasdan almashtirishga imkon beradi.

### Har bir saytga ma’lumotlar bazasi kerakmi?

Yo‘q. Vizitka sayt yoki lendingga kerak emas. Baza foydalanuvchilar yoki administratorlar ma’lumot yaratib, o‘zgartirganda kerak bo‘ladi: buyurtmalar, profillar, katalog.
