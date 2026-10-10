---
title: Boshqariladigan va boshqarilmaydigan hosting: serverni kim kuzatadi
description: Boshqariladigan va boshqarilmaydigan hosting farqi: yangilanish, zaxira nusxa, xavfsizlik va monitoring kimning zimmasida va qaysi birini tanlash kerak.
summary: Boshqariladigan hostingda server yangilanishlari, zaxira nusxalari, himoyasi va monitoringini provayder o‘z zimmasiga oladi, boshqarilmaydiganida esa buni o‘zingiz qilasiz; tanlov jamoangizda serverni boshqara oladigan va bunga vaqti bor odam bor-yo‘qligiga bog‘liq.
---
## Asosiy farq

**Boshqarilmaydigan hosting (unmanaged)** — provayder sizga operatsion tizim o‘rnatilgan server beradi va uskuna, elektr ta’minoti hamda tarmoq ishlashini kafolatlaydi. OS darajasidan yuqoridagi hamma narsa sizning mas’uliyatingiz: sozlash, yangilanishlar, himoya, zaxira nusxalar, nosozliklarga javob berish.

**Boshqariladigan hosting (managed)** — provayder yoki pudratchi ma’muriyatchilikni o‘z zimmasiga oladi: yangilanishlarni kuzatadi, himoyani sozlaydi, zaxira nusxa oladi, serverni monitoring qiladi va hodisalarga javob beradi. Siz esa ilovangiz va biznesingiz bilan shug‘ullanasiz.

Ular orasida oraliq variantlar ham bor: masalan, boshqaruv paneli va avtomatik zaxira nusxalari bor, lekin administrator yordami yo‘q VPS. Shuning uchun faqat tarif nomini emas, **xizmatga aynan nima kirishini** o‘qing.

## Kim nima qiladi

| Vazifa | Boshqarilmaydigan | Boshqariladigan |
|---|---|---|
| Uskuna, elektr, tarmoq | Provayder | Provayder |
| Dasturlarni o‘rnatish va sozlash | Siz | Provayder yoki kelishuv bo‘yicha |
| OS va paketlarni yangilash | Siz | Provayder |
| Zaxira nusxalash | Siz | Provayder (chastota va saqlash muddatini aniqlang) |
| Firewall, parol tanlashdan himoya | Siz | Provayder |
| SSL sertifikatlari | Siz | Odatda provayder |
| Monitoring va ogohlantirishlar | Siz | Provayder |
| Tunda nosozlikka javob berish | Siz | Provayder, SLA doirasida |
| Ilova kodi va mantig‘i | Siz | Siz |

Oxirgi qatorga e’tibor bering: boshqariladigan hostingda ham **kodingizdagi xatolar sizniki bo‘lib qoladi**. Provayder ilova uchun emas, server uchun javob beradi.

## Yangilanishlar

Boshqarilmaydigan serverda xavfsizlik yangilanishlarini muntazam o‘rnatib borish kerak. Linuxda buning bir qismini avtomatlashtirish mumkin, masalan Debian va Ubuntuda:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Ammo avtomatlashtirish odamning o‘rnini bosmaydi: yirik yangilanishlar, ma’lumotlar bazasi yoki dasturlash tili versiyasini almashtirish tekshiruv va ba’zan qo‘lda aralashuvni talab qiladi.

## Zaxira nusxalar

Boshqarilmaydigan hostingdagi eng ko‘p uchraydigan muammo — hech kim sozlamagan yoki hech qachon tekshirilmagan zaxira nusxalar. Minimal qoidalar:

- nusxalar ma’lumotlar turgan **o‘sha serverda saqlanmaydi**;
- faqat oxirgi nusxa emas, bir necha avlod nusxalar saqlanadi;
- tiklash vaqti-vaqti bilan **amalda tekshirib turiladi**.

Boshqariladigan hostingda nusxalar qanchalik tez-tez olinishi, nechtasi saqlanishi va tiklash qancha turishini aniqlang.

## Xavfsizlik va monitoring

Internetga ochiq server ishga tushgan zahoti skanerlana boshlaydi. Asosiy minimum: parol o‘rniga SSH-kalit orqali kirish, ortiqcha portlarni yopish, firewall, o‘z vaqtida yangilanish. Bundan tashqari monitoring: sayt to‘xtagani yoki disk to‘lganini mijozlardan oldin kimdir bilishi kerak.

## Qanday tanlash kerak

**Boshqarilmaydigan hosting mos keladi, agar:**
- jamoada Linuxni boshqarish tajribasiga ega va bunga vaqti bor odam bo‘lsa;
- muhitni sozlashda to‘liq erkinlik kerak bo‘lsa;
- loyiha o‘quv, sinov yoki biznes uchun muhim bo‘lmasa.

**Boshqariladigan hosting mos keladi, agar:**
- jamoada administrator bo‘lmasa yoki u haddan tashqari band bo‘lsa;
- sayt yoki xizmatning to‘xtab qolishi to‘g‘ridan-to‘g‘ri pulga tushsa;
- shaxsiy yoki to‘lov ma’lumotlari bilan ishlasangiz va yangilanish hamda himoyada intizom muhim bo‘lsa.

Narxlarni solishtirganda faqat tarifga qaramang. Boshqarilmaydigan server hisobi kichikroq, lekin unga xizmat ko‘rsatayotgan xodimning vaqti ham pul turadi. Zaxira nusxasiz bitta jiddiy avariya esa boshqariladigan tarifning ko‘p oyligidan qimmatga tushishi mumkin.

## Ko‘p uchraydigan xatolar

- **Provayder «baribir hammasini qiladi» deb o‘ylash.** Boshqarilmaydigan tarifda u tizimingiz ichida na zaxira nusxa, na yangilanish qiladi.
- **SLAni o‘qimaslik.** Javob berish vaqti, mavjudlik kafolatlari va kompensatsiya tartibi yozib qo‘yilishi kerak.
- **Serverni egasiz qoldirish.** Administrator ketib, kirish ma’lumotlari va yo‘riqnomalar faqat unda qolgan bo‘lsa, muammolar birinchi nosozlikdayoq boshlanadi.

## FAQ

### Boshqarilmaydigan hostingdan boshlab, keyin boshqariladiganiga o‘tsa bo‘ladimi?

Ha. Ko‘plab provayderlar va pudratchilar mavjud serverlarni xizmatga oladi. Odatda bundan oldin audit o‘tkaziladi: sozlamalar, yangilanishlar va zaxira nusxalar tekshiriladi.

### Boshqariladigan hostingga saytimni qo‘llab-quvvatlash kiradimi?

Odatda yo‘q. Boshqariladigan hosting server va muhitni qamrab oladi. Yangi funksiyalar, koddagi xatolarni tuzatish va CMSni yangilash ko‘pincha alohida texnik qo‘llab-quvvatlash xizmati sifatida rasmiylashtiriladi.

### Oddiy sayt-vizitka uchun boshqariladigan hosting kerakmi?

Shart emas. Kichik sayt uchun ko‘pincha virtual hosting yoki provayder server uchun allaqachon javob beradigan platforma yetarli. Alohida boshqariladigan VPS yuklama va ishonchlilik talablari o‘sganda o‘zini oqlaydi.
