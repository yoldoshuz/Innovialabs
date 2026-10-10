---
title: DNSSEC nima va uni yoqish kerakmi
description: DNSSEC yozuvlarni qanday imzolab soxtalashtirishdan himoya qiladi, DS orqali ishonch zanjiri, uni registratorda yoqish va nimalar buzilishi mumkin.
summary: DNSSEC DNS yozuvlariga raqamli imzolar qo‘shadi, shunda rezolver javob o‘zgartirilmaganini tekshira oladi; DNS provayderingiz va registratoringiz uni qo‘lda ovora bo‘lmasdan qo‘llasa, yoqing, lekin provayder almashtirishda DS yozuviga ehtiyot bo‘ling.
---
## Qisqa javob

**DNSSEC** — DNS kengaytmasi bo‘lib, u yozuvlarga **raqamli imzolar** qo‘shadi. Tekshiruvchi rezolver javob zonaning haqiqiy egasidan kelganiga va yo‘lda o‘zgartirilmaganiga ishonch hosil qila oladi. Bu DNS javoblarini soxtalashtirish va keshni zaharlashdan himoya qiladi — bunda hujumchi foydalanuvchiga sizning IP manzilingiz o‘rniga boshqasini beradi.

Yoqish kerakmi? Agar DNS provayderingiz zonani avtomatik imzolasa va registrator DS yozuvini qo‘shishga imkon bersa — ha, bu nisbatan arzon qo‘shimcha himoya. Asosiysi — provayderni ehtiyotsiz almashtirishda nima buzilishini tushunish.

## DNSSEC nima qilmaydi

- DNS so‘rovlarini **shifrlamaydi**. Buning uchun DNS-over-HTTPS va DNS-over-TLS bor.
- **HTTPS o‘rnini bosmaydi.** Sertifikat baribir kerak.
- Hujumchi registrator yoki DNS provayderdagi akkauntingizga kirib olgan bo‘lsa, **himoya qilmaydi**. Ularni ikki bosqichli autentifikatsiya bilan himoyalang.

## Bu qanday ishlaydi

Imzolangan zonada yangi yozuv turlari paydo bo‘ladi:

| Yozuv | Vazifasi |
|---|---|
| **DNSKEY** | Zonaning ochiq kalitlari. Odatda ikkita: kalitlarni imzolash kaliti (KSK) va zonani imzolash kaliti (ZSK) |
| **RRSIG** | Har bir yozuvlar to‘plami (A, MX, TXT va h.k.) uchun imzo |
| **DS** | KSK kalitining xeshi, u **ota** zonada saqlanadi (masalan, `.com` zonasida) |
| **NSEC / NSEC3** | So‘ralgan yozuv mavjud emasligining imzolangan isboti |

## DS orqali ishonch zanjiri

Imzoning o‘zi hech narsani isbotlamaydi: hujumchi soxta yozuvni o‘z kaliti bilan imzolashi mumkin. Shuning uchun kalitlar **ishonch zanjiri**ga bog‘langan:

1. Rezolver ildiz zona kalitiga ishonadi — u oldindan uning sozlamalariga kiritilgan.
2. Ildiz zonada yuqori darajali domen zonasi, masalan `.com` uchun imzolangan DS yozuvi bor.
3. `.com` zonasida `example.com` uchun imzolangan DS yozuvi bor.
4. DS yozuvi `example.com` zonasining DNSKEY kaliti xeshiga mos keladi.
5. Shu kalit bilan `example.com`ning barcha yozuvlari imzolangan.

Agar biror qadamda imzo mos kelmasa, tekshiruvchi rezolver javob o‘rniga **SERVFAIL** xatosini qaytaradi. Aynan shu soxtalashtirishdan himoya qiladi va bir vaqtning o‘zida nosozliklarning asosiy sababi hisoblanadi.

## DNSSEC’ni qanday yoqish kerak

1. **Qo‘llab-quvvatlashni tekshiring.** Domeningizning yuqori darajali zonasi, registrator va DNS provayder DNSSEC’ni qo‘llashi kerak.
2. **DNS provayderda imzolashni yoqing.** Odatda bu panelda bitta tugma. Provayder kalitlarni yaratadi va DS yozuvi ma’lumotlarini ko‘rsatadi: key tag, algoritm, dayjest turi va dayjestning o‘zi.
3. **DS yozuvini registratorda qo‘shing.** Qiymatlarni tegishli bo‘limga nusxalang. DNS va ro‘yxatdan o‘tkazish bitta provayderda bo‘lsa, bu qadam ko‘pincha avtomatik bajariladi.
4. Ota zona yangilangandan keyin **natijani tekshiring**:

```bash
dig DS example.com +short
dig example.com A +dnssec
delv example.com A
```

Tekshiruvchi rezolverdan kelgan `dig +dnssec` javobida `ad` bayrog‘i paydo bo‘lishi, `delv` esa to‘liq tekshirilgan javob haqida xabar berishi kerak. DNSSEC zanjirining onlayn analizatorlaridan ham foydalanish mumkin.

## Nima buzilishi mumkin

- **DNS provayderni almashtirish.** Eng ko‘p uchraydigan muammo. NS serverlarni almashtirib, registratorda eski DS yozuvini qoldirsangiz, tekshiruvchi rezolverlar kalitlar mos emasligini ko‘radi va domen foydalanuvchilarning bir qismida ochilmay qoladi.
- **DS yozuvidagi xato.** Xato yozilgan qiymat yoki noto‘g‘ri algoritm zanjirni e’lon qilingan zahoti buzadi.
- **Muddati o‘tgan imzolar.** RRSIG’larning amal qilish muddati bor. Boshqariladigan provayderlar ularni o‘zlari yangilaydi, o‘z DNS serveringizda esa bu sizning mas’uliyatingiz.
- **Kalitlarni almashtirish (rollover).** KSK’ni almashtirish registratordagi DS’ni to‘g‘ri tartibda yangilashni talab qiladi.

**Provayderni xavfsiz almashtirish:** avval registratordagi DS yozuvini o‘chiring, ota zonadagi uning TTL muddati tugashini kuting, keyin NS’ni ko‘chiring, yangi provayderda imzolashni yoqing va yangi DS qo‘shing. Himoyani o‘chirmasdan murakkabroq variant — ikkala provayder qo‘llasa, ikki kalitlar to‘plami bilan ko‘chish.

## FAQ

### Kichik saytga DNSSEC kerakmi?

Bu majburiy talab emas, lekin foydali himoya, ayniqsa domenda pochta, to‘lovlar yoki akkauntga kirish bo‘lsa. Provayder uni bir-ikki bosishda yoqsa, yoqing, lekin loyiha hujjatlariga DNS almashtirishdan oldin DS yozuvini o‘chirish kerakligini yozib qo‘ying.

### Nega DNSSEC yoqilgandan keyin sayt ba’zi foydalanuvchilarda ochilmayapti?

Ehtimol, ishonch zanjiri buzilgan: registratordagi DS zona kalitlariga mos emas. Tekshiruvchi rezolverlar bunday javobni rad etadi, tekshirmaydiganlari esa ishlashda davom etadi, shuning uchun muammoni faqat foydalanuvchilarning bir qismi ko‘radi. DS va DNSKEY’ni tekshirib, nomuvofiqlikni tuzating.

### DNSSEC saytni sekinlashtiradimi?

Imzolar tufayli DNS javoblari kattalashadi va rezolver qo‘shimcha tekshiruv bajaradi, lekin keshlash tufayli amalda bu odatda foydalanuvchilarga sezilmaydi.
