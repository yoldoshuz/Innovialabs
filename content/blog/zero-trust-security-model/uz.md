---
title: Zero Trust modeli: bu nima va joriy etishni nimadan boshlash kerak
description: «Hech kimga ishonma, doim tekshir» tamoyili: shaxsga asoslangan kirish, qurilma holati, mikrosegmentatsiya, VPN o‘rnini bosish va dastlabki reja.
summary: Zero Trust — foydalanuvchi ham, qurilma ham faqat ichki tarmoqda bo‘lgani uchun ishonchga ega bo‘lmaydigan yondashuv: resursga har bir so‘rov shaxs, qurilma holati va kontekst bo‘yicha tekshiriladi. Ish «quti» sotib olishdan emas, inventarizatsiya, MFA bilan yagona kirish va eng qimmatli tizimlarni himoyalashdan boshlanadi.
---

## Mohiyati bir daqiqada

Klassik xavfsizlik modeli xandaqli qal’aga o‘xshaydi: tashqarida — dushmanlar, ichkarida — o‘zimiznikilar. VPN yoki ofis Wi-Fi orqali ichki tarmoqqa kirgan kishi deyarli hamma narsani ko‘radi. Muammo shundaki, bitta o‘g‘irlangan parol yoki zararlangan noutbuk hujumchini «o‘zimizniki»ga aylantiradi.

**Zero Trust** bu farazdan voz kechadi. Tamoyil — **never trust, always verify**: har bir resursga har bir so‘rov qayerdan kelganidan qat’i nazar qaytadan tekshiriladi. Kirish to‘g‘risidagi qaror quyidagilarga asoslanadi:

- **kim** so‘rayapti (shaxs va rol);
- **qaysi qurilmadan** (uning holati va kompaniyaga tegishliligi);
- **nimaga** va **qanday kontekstda** (vaqt, joy, ma’lumotlarning maxfiyligi).

Zero Trust — mahsulot emas, arxitektura yondashuvi. Konsepsiya NIST SP 800-207 hujjatida batafsil yoritilgan.

## Asosiy tamoyillar

### Shaxsga asoslangan kirish

Tizim markazida yagona kirish (SSO) imkonini beruvchi **identifikatsiya provayderi** (IdP) turadi. Xodimlar korporativ servislarga u orqali kiradi va hamma joyda **ko‘p omilli autentifikatsiya** majburiy. SMS kodlardan ko‘ra fishingga chidamli usullar — xavfsizlik kalitlari va passkey’lar afzal.

Huquqlar **minimal imtiyozlar** tamoyili bo‘yicha beriladi: ish uchun aynan kerakli narsa va imkon qadar cheklangan muddatga.

### Qurilma holati

Zararlangan shaxsiy noutbukdan to‘g‘ri login bilan kirish ham xavf. Shuning uchun **device posture** tekshiriladi: qurilma kompaniyada ro‘yxatdan o‘tgan, OT yangilangan, disk shifrlangan, himoya ishlayapti. Shart bajarilmasa, kirish cheklanadi yoki taqiqlanadi.

### Mikrosegmentatsiya

Ichki tarmoq kichik zonalarga bo‘linadi va ular orasidagi trafikka faqat aniq ruxsat beriladi. Buxgalteriya serveriga test muhiti serveridan kirib bo‘lmasligi kerak. Hujumchi bitta tizimni egallasa ham, unga tarmoq bo‘ylab **yanada siljish** qiyin bo‘ladi.

### Doimiy tekshiruv va jurnallash

Ishonch «butun kunga» berilmaydi. Sessiyalar vaqt bilan cheklangan, shubhali xatti-harakat qayta tekshiruvni chaqiradi, kirish bo‘yicha barcha qarorlar logga yoziladi.

## Zero Trust va VPN

| | Klassik VPN | Zero Trust kirish (ZTNA) |
|---|---|---|
| Foydalanuvchi nimaga ega bo‘ladi | Butun tarmoqqa kirish | Muayyan ilovaga kirish |
| Tekshiruv | Ulanishda bir marta | Har bir so‘rovda, qurilmani hisobga olib |
| Hisob o‘g‘irlanishi oqibatlari | Ichki tizimlarga keng kirish | Alohida resurslarga huquqlar bilan cheklangan |
| Qulaylik | Ulanish va uzilish kerak | Brauzer yoki agent orqali sezilmasdan ishlaydi |

VPN’ni birinchi kunning o‘zida o‘chirish shart emas. Odatda ilovalar yangi kirish sxemasiga bosqichma-bosqich o‘tkaziladi, VPN esa hali tayyor bo‘lmagan tizimlar uchun qoladi.

## Real yo‘l xaritasi

Hammasini birdaniga joriy etishga urinmang. Ko‘pchilik kompaniyalar uchun ishlaydigan ketma-ketlik:

1. **Inventarizatsiya.** Foydalanuvchilar, qurilmalar, ilovalar va ma’lumotlar ro‘yxati. Eng qimmatlisi nima, unga kim va qayerdan kiradi.
2. **Yagona kirish va MFA.** Asosiy servislarni (pochta, CRM, bulut, repozitoriylar) bitta IdP’ga ulang. Umumiy hisoblarni o‘chiring.
3. **Huquqlarni qayta ko‘rib chiqish.** Ortiqcha administratorlar, faol bo‘lmagan hisoblar, ishdan ketganlar va pudratchilarning kirish huquqlarini olib tashlang.
4. **Qurilmalarni boshqarish.** Korporativ qurilmalarni ro‘yxatga olish, majburiy yangilanishlar va shifrlash, kirishning bazaviy shartlari.
5. **Eng qimmatli tizimlarni himoyalash.** Bir-ikkita ilovani — masalan, admin panel va CRM’ni — shaxs va qurilmani tekshiradigan proksi orqali kirishga o‘tkazing.
6. **Segmentatsiya.** Prodakshen, test muhitlari va ofis tarmog‘ini ajrating; ma’lumotlar bazalariga to‘g‘ridan to‘g‘ri kirishni yoping.
7. **Monitoring.** Kirishlarning markazlashgan loglari va g‘ayrioddiy hodisalar haqida ogohlantirishlar.

## Tez-tez uchraydigan xatolar

- Zero Trust’ni bitta mahsulot xaridi deb hisoblash.
- Qat’iy qoidalarni xodimlarga tushuntirmasdan joriy etish — odamlar aylanib o‘tish yo‘llarini qidira boshlaydi.
- Servis hisoblari va API kalitlarini unutish: mashinalar ham tekshiruvdan o‘tishi kerak.
- «Vaqtinchalik» istisnolarni abadiy qoldirish.

## FAQ

### Zero Trust kichik kompaniyaga mos keladimi?

Ha, ayniqsa bulutli infratuzilmada. Kichik jamoa uchun dastlabki qadamlar — MFA bilan yagona kirish, minimal huquqlar va qurilmalar nazorati — o‘rtacha kuch sarflab asosiy foydani beradi.

### Joriy etish qancha vaqt oladi?

Bu yakuniy sanasi bor loyiha emas, bosqichma-bosqich jarayon. Muddat tizimlar soni, eskirgan ilovalar borligi va jamoaning tayyorligiga bog‘liq. Dastlabki qadamlarni tez qilish mumkin, to‘liq o‘tish esa cho‘ziladi.

### VPN’dan darhol voz kechish kerakmi?

Yo‘q. Ilovalarni birma-bir o‘tkazish va hozircha yangi kirish sxemasi orqali chiqarib bo‘lmaydigan tizimlar uchun VPN’ni qoldirish xavfsizroq.
