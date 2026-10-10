---
title: Saytni yangi hostingga to‘xtalishsiz qanday ko‘chirish mumkin
description: Yangi hostingga ko‘chish rejasi: TTLni pasaytirish, fayl va bazani nusxalash, hosts orqali test, yakuniy sinxronlash, DNS almashtirish va orqaga qaytish.
summary: DNS TTLni oldindan pasaytiring, yangi serverda saytning to‘liq nusxasini yarating, uni hosts fayli orqali tekshiring, ma’lumotlarni yakuniy sinxronlang va shundan keyingina DNSni almashtiring, eski serverni orqaga qaytish uchun tayyor saqlang.
---
## Qisqa javob

To‘xtalishsiz ko‘chish mumkin, chunki **eski va yangi server bir muddat parallel ishlaydi**. Siz yangisini tayyorlab, tekshirayotganingizda foydalanuvchilar eski serverdan foydalanishda davom etadi. Keyin DNSni almashtirasiz va trafik asta-sekin yangi serverga o‘tadi. Muvaffaqiyat kaliti — qisqa **TTL**, tekshirilgan nusxa va aniq orqaga qaytish rejasi.

## Bosqichma-bosqich reja

### 1. Inventarizatsiya

Boshlashdan oldin nimalar ko‘chishini ro‘yxat qiling:

- sayt fayllari va foydalanuvchilar yuklagan fayllar;
- ma’lumotlar bazalari;
- cron vazifalari, fon jarayonlari, navbatlar;
- dasturlash tili, kengaytmalar va veb-server versiyalari;
- SSL sertifikatlari;
- pochta (agar u shu hostingda bo‘lsa) va barcha DNS yozuvlari: A, AAAA, CNAME, MX, TXT.

Pochta va DNS ko‘pincha unutiladi, natijada ko‘chishdan keyin xatlar kelmay qoladi.

### 2. TTLni pasaytirish

**TTL** rezolverlar DNS javobini qancha vaqt keshlashini belgilaydi. Agar u katta bo‘lsa, foydalanuvchilarning bir qismi hali uzoq vaqt eski serverga tushadi.

Ko‘chishdan kamida joriy TTL muddatidan oldin (bir-ikki kun oldin yaxshiroq) kerakli yozuvlarning TTLni bir necha daqiqagacha, masalan 300 soniyagacha pasaytiring. Joriy qiymatni shunday tekshirish mumkin:

```bash
dig +noall +answer example.com A
```

Ikkinchi ustundagi raqam — soniyalarda qolgan TTL.

### 3. Yangi serverni tayyorlash va nusxalash

Eski serverdagi muhitni o‘rnating, keyin fayllar va bazani nusxalang:

```bash
rsync -avz --progress user@old-server:/var/www/site/ /var/www/site/
mysqldump -u user -p dbname > dump.sql   # eski serverda
mysql -u user -p dbname < dump.sql       # yangi serverda
```

PostgreSQL uchun `pg_dump` va `pg_restore` ishlatiladi. Yangi serverda SSL sertifikatini oldindan chiqaring yoki mavjudini ko‘chiring.

### 4. Hosts fayli orqali tekshirish

DNS hali eski serverga ishora qiladi, lekin siz saytni yangi serverda ochishingiz mumkin. Kompyuteringizdagi hosts fayliga yangi server IP manzili bilan qator qo‘shing:

```text
203.0.113.10  example.com www.example.com
```

Linux va macOSda bu `/etc/hosts`, Windowsda — `C:\Windows\System32\drivers\etc\hosts`. Asosiy ssenariylarni sinab ko‘ring: kirish, formalar, to‘lov, fayl yuklash, xat yuborish. Keyin qatorni o‘chiring.

### 5. Yakuniy sinxronizatsiya

Siz test qilayotganingizda eski serverda yangi buyurtmalar, izohlar va fayllar paydo bo‘ldi. Almashtirishdan oldin:

1. Ma’lumotlar muhim bo‘lsa, yozish amallari uchun “faqat o‘qish” rejimini yoki qisqa texnik oynani yoqing.
2. `rsync`ni qayta ishga tushiring (u faqat o‘zgarishlarni uzatadi) va bazaning yangi dampini oling.
3. Katta va faol bazalar uchun eski bazadan yangisiga **replikatsiya**ni ko‘rib chiqing — shunda ma’lumotlar uzluksiz sinxronlanadi.

### 6. DNSni almashtirish

A/AAAA yozuvlarini yangi server IP manziliga o‘zgartiring. Qisqa TTL tufayli trafikning asosiy qismi tez o‘tadi, lekin **eski serverni o‘chirmang**: ba’zi rezolverlar eski yozuvlarni uzoqroq saqlashi mumkin. Ikkala server loglarini kuzating — eskisiga so‘rovlar kelmay qolganda, ko‘chish tugagan bo‘ladi.

Vaziyat barqarorlashgach, TTLni odatiy qiymatiga qaytaring.

### 7. Orqaga qaytish rejasi

Qaysi belgilarda orqaga qaytishni (xatolar, buyurtmalar kamayishi, pochta muammolari) va qarorni kim qabul qilishini oldindan belgilang. Orqaga qaytish — DNS yozuvlarini eski IPga qaytarish. Bu faqat eski server ishlab turgan va yangi serverga yozilgan ma’lumotlarni qaytarib ko‘chirish mumkin bo‘lgandagina ishlaydi.

## Ko‘p uchraydigan xatolar

- TTL oxirgi daqiqada pasaytirilgan va kesh eski IPni soatlab saqlaydi.
- MX va TXT yozuvlari (SPF, DKIM) unutilgan — pochta buziladi.
- Cron vazifalari va zaxira nusxalar ko‘chirilmagan.
- DNS almashtirilgandan so‘ng darhol eski hosting o‘chirilgan.
- Fayl huquqlari va konfiguratsiyadagi yo‘llar tekshirilmagan.

## FAQ

### Umuman texnik oynasiz ko‘chish mumkinmi?

Ha, agar sayt asosan statik kontent bersa yoki baza replikatsiyasini sozlagan bo‘lsangiz. Tez-tez yoziladigan do‘konlar va servislar uchun qisqa “faqat o‘qish” oynasi odatda almashtirishdan keyin ma’lumotlarni moslashtirishga urinishdan oddiyroq va xavfsizroq.

### Ko‘chishdan keyin eski serverni qancha saqlash kerak?

Kamida uning loglarida real so‘rovlar paydo bo‘lishi to‘xtaguncha, ustiga orqaga qaytish uchun zaxira vaqt. Aniq muddat avvalgi TTLga va yangi server qanchalik ishonchli ishlayotganiga bog‘liq.

### Ko‘chishda NS serverlarni almashtirish kerakmi?

Shart emas. DNS registratorda yoki alohida xizmatda bo‘lsa, A/AAAA yozuvlarini o‘zgartirish yetarli. NS almashtirishni ikki xavfli amalni aralashtirmaslik uchun alohida qadam sifatida qiling.
