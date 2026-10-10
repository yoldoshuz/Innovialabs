---
title: Pentest nima va kirib borishga testlash qanday o‘tkaziladi
description: Pentest oddiy tilda: black, grey va white box yondashuvlari, testlash bosqichlari, scope va qoidalar, yakuniy hisobot hamda biznes qanday tayyorlanishi kerak.
summary: Pentest — ruxsat berilgan hujum imitatsiyasi: mutaxassislar kelishilgan chegarada tizimingizni buzishga urinadi va isbotlangan zaifliklar, ularning oqibatlari hamda tuzatish yo‘llari yozilgan hisobot topshiradi.
---
## Qisqa javob

**Pentest (kirib borishga testlash)** — saytingiz, ilovangiz, API yoki tarmog‘ingizga sizning yozma roziligingiz bilan o‘tkaziladigan nazorat ostidagi hujum. Avtomatik skanerlashdan farqli o‘laroq, pentester «bu yerda zaiflik bo‘lishi mumkin» degan fikrda to‘xtab qolmaydi — u zaiflikdan **haqiqatan foydalanib ko‘radi**, bir nechta kichik muammoni haqiqiy hujumga birlashtiradi va buzg‘unchi nimagacha yetib borishini ko‘rsatadi: mijozlar ma’lumotlari, admin panel, to‘lovlar, serverlar.

Natija buzilgan tizim emas, balki **hisobot**: nima topildi, qanday isbotlandi, qanchalik xavfli va nimani tuzatish kerak.

## Black, grey va white box

Yondashuv testerlar ish boshida tizim haqida qancha bilishiga bog‘liq.

| Yondashuv | Testerlar nimani oladi | Kimni imitatsiya qiladi | Kuchli tomonlari | Cheklovlari |
|---|---|---|---|---|
| **Black box** | Faqat domen yoki ilova nomi | Tashqi hujumchini | Internetdan qaragandagi real manzara | Ko‘p vaqt razvedkaga ketadi, chuqur mantiq tekshirilmay qolishi mumkin |
| **Grey box** | Har bir rol uchun akkauntlar, asosiy hujjatlar, API tavsifi | Ro‘yxatdan o‘tgan foydalanuvchi yoki hamkorni | Ko‘pchilik veb va mobil loyihalar uchun chuqurlik va realizmning eng yaxshi muvozanati | Sizdan tayyorgarlik talab qiladi |
| **White box** | Manba kodi, arxitektura, konfiglar, admin kirish | Ichki xodim yoki juda qat’iyatli hujumchini | Bir kunlik ishda eng ko‘p topilma | Hujum ssenariysi sifatida eng kam real |

Avtorizatsiya va rollari bor odatiy mahsulot uchun ko‘pincha **grey box** foydaliroq: foydalanuvchilar o‘rtasidagi kirish huquqlari xatolari eng ko‘p uchraydigan jiddiy topilmalardan biri, akkauntlarsiz esa ularga yetib borish qiyin.

## Pentest bosqichlari

1. **Scope va qoidalarni kelishish** — nima, qanday, qachon testlanadi va kimga qo‘ng‘iroq qilinadi.
2. **Razvedka** — subdomenlar, ochiq portlar, texnologiyalar, ochiq kod, sizib chiqqan ma’lumotlar.
3. **Zaifliklarni qidirish** — avtomatik vositalar va mantiq, rollar hamda ma’lumot oqimlarini qo‘lda tekshirish.
4. **Ekspluatatsiya** — zaifliklarni xavfsiz tarzda ishlatib tasdiqlash, ko‘pincha bir nechta kichik topilmalar zanjiri orqali.
5. **Oqibatlarni baholash** — hujumchi qanchalik uzoqqa bora oladi: boshqalarning ma’lumotlari, imtiyozlarni oshirish, infratuzilmaga kirish.
6. **Hisobot** — barcha topilmalarni dalillar va tavsiyalar bilan yozish.
7. **Qayta test** — tuzatishlaringizdan keyin jamoa zaifliklar haqiqatan yopilganini tekshiradi.

## Scope va o‘tkazish qoidalari

Bu hujjat ikkala tomonni ham himoya qiladi. Unda aniq yozilishi kerak:

- **Scope ichida**: aniq domenlar, IP diapazonlari, ilova versiyalari, API endpointlari.
- **Scope tashqarisida**: uchinchi tomon servislari, to‘lov provayderlari, sizga tegishli bo‘lmagan shared hosting.
- **Ruxsat etilgan usullar**: masalan, alohida kelishilmagan bo‘lsa, DoS va xodimlarga ijtimoiy muhandislik yo‘q.
- **Vaqt oynalari** va muhit: staging, production yoki ikkalasi.
- **Ma’lumotlar bilan ishlash**: nimani yuklab olish mumkin, dalillar qanday saqlanadi va qachon o‘chiriladi.
- Ikkala tomondan **kontaktlar** va biror narsa buzilsa, to‘xtatish tartibi.
- Shu tizimlarni testlashga haqiqatan ruxsat bera oladigan shaxsdan **yozma ruxsat**.

## Yakunda nima olasiz

- Rahbariyat uchun oddiy tilda **qisqacha xulosa**.
- **Topilmalar ro‘yxati**: har birida xavf darajasi (ko‘pincha CVSS bo‘yicha), ta’sirlangan komponent, takrorlash qadamlari va dalillar.
- Har bir muammo va uning asl sababini tuzatish bo‘yicha **tavsiyalar**.
- Qayta testdan keyin — yangilangan hisobot yoki qaysi topilmalar yopilgani haqida xat.

## Qanday tayyorlanish kerak

- **Maqsadni aniqlang**: ishga tushirishdan oldingi tekshiruv, mijoz yoki investor talabi, muvofiqlik, incidentdan keyingi xavotir.
- **Muhitni tanlang**. Production’ni takrorlaydigan staging xavfsizroq, production esa realroq. Production testlansa, cheklovlarni kelishib oling.
- **Yangi backup qiling** va ular tiklanishini tekshiring.
- Barcha rollar uchun **test akkauntlari** yarating, haqiqiy mijoz ma’lumotlari o‘rniga ishonarli test ma’lumotlari bilan.
- **Hosting yoki bulut qoidalarini** xavfsizlik testlari bo‘yicha tekshiring va testerlar IP manzillarini WAF’dan o‘tkazish kerakmi, hal qiling.
- Test davomida **deploylarni to‘xtating yoki qayd eting**, toki topilmalar versiyalar orasida yo‘qolmasin.
- Tuzatishlar uchun **dasturchilar vaqtini oldindan ajrating** — tuzatishsiz pentest faqat xavfni hujjatlashtiradi.

## Ko‘p uchraydigan xatolar

- Bir oydan keyin butunlay o‘zgaradigan xom mahsulotga pentest buyurtma qilish.
- Haqiqiy ma’lumotlar API va mobil ilovada bo‘lsa ham, scope’ga faqat landingni kiritish.
- Arzon avtomatik skanerlashni pentest deb hisoblash.
- Sababni bartaraf etmasdan topilmalarni birma-bir yopish, masalan butun API bo‘ylab kirish tekshiruvlari yo‘qligini.

## FAQ

### Pentest qancha davom etadi?

Bu scope’ga bog‘liq: ilovalar, rollar, API endpointlari va integratsiyalar soni hamda tanlangan yondashuv. Kichik saytni bir necha kunda, murakkab platformani bir necha haftada tekshirish mumkin. Ijrochidan bahoni ish hajmi orqali tushuntirib berishni so‘rang.

### Production’ni testlash xavfsizmi?

Aniq qoidalar bilan xavfsiz bo‘lishi mumkin: buzuvchi harakatlar yo‘q, kelishilgan vaqt oynalari, backuplar va to‘xtatish uchun kontakt. Ko‘p jamoalar staging’ni chuqur testlaydi, production’da esa yengilroq va ehtiyotkor tekshiruv o‘tkazadi.

### Uni qanchalik tez-tez o‘tkazish kerak?

Keng tarqalgan amaliyot — yirik relizlar yoki arxitektura o‘zgarishlaridan keyin, shaxsiy yoki to‘lov ma’lumotlari bilan ishlaydigan tizimlar uchun esa kamida yiliga bir marta.
