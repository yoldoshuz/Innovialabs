---
title: Noldan o‘z dasturlash jamoangizni qanday yig‘ish mumkin
description: Birinchi kimni yollash, jamoani qaysi tartibda kengaytirish, maoshlar uchun byudjetni rejalashtirish hamda onbording va jarayonlarni yo‘lga qo‘yish.
summary: Arxitektura va yollash uchun mas’ul tajribali texlid bilan boshlang, keyin mahsulotning yaqin vazifalari uchun dasturchilar qo‘shing, jarayon va onbordingni esa jamoa o‘sishidan oldin yo‘lga qo‘ying.
---
## Nimadan boshlash kerak

Jamoaga birinchi bo‘lib eng arzon dasturchini emas, balki **texlid**ni yollang — kod yoza oladigan, arxitektura qarorlarini qabul qiladigan va nomzodlarni baholay oladigan odamni. Usiz yo‘naltiradigan odami yo‘q xodimlarni yollab, keyinchalik qayta yozishga to‘g‘ri keladigan kodga ega bo‘lish xavfi bor.

Yollashdan oldin o‘zingizga uchta savol bering:

- **Jamoa aynan nima qiladi** keyingi 6-12 oyda: yangi mahsulot, mavjudini qo‘llab-quvvatlash, integratsiyalar?
- **Qaysi stack** bu vazifalarga mos — uni texlid bilan birga tanlash ma’qul.
- **Jamoani boshqarishga tayyormisiz** — bir martalik loyiha emas, doimiy xarajat sifatida.

## Yollash tartibi

Kichik mahsulot uchun odatiy ketma-ketlik:

1. **Texlid / senior full-stack** — arxitektura, stack, dastlabki qarorlar, yollashda ishtirok.
2. **Bir-ikki dasturchi** asosiy ish hajmi uchun (mahsulotga qarab backend, frontend yoki mobile).
3. **QA** — relizlar ko‘payib, dasturchilarning qo‘lda tekshiruvi ishni sekinlashtira boshlaganda.
4. **Dizayner** — interfeys mahsulot uchun muhim bo‘lsa, shtatda yoki qisman.
5. **Product manager** — vazifalar siz egasi sifatida ustuvorlashtirib ulgurishingizdan ko‘p bo‘lganda.
6. **DevOps** — ko‘pincha avval bu rolni texlid yoki tashqi mutaxassis bajaradi.

Hammani birdaniga yollamang. Har bir keyingi odamni aniq “tor joy”ni ko‘rganingizda qo‘shing.

## Kichik jamoa tuzilmasi

| Hajm | Tarkib | Kim boshqaradi |
|---|---|---|
| 2-3 kishi | texlid + dasturchilar | texlid va egasi |
| 4-7 kishi | + QA, dizayner | texlid + product manager |
| 8+ kishi | bir nechta mahsulot guruhi | engineering manager, guruh rahbarlari |

Jamoa kichik ekan, ortiqcha ierarxiya faqat xalaqit beradi. Har bir vazifaning aniq mas’uli bo‘lishi muhimroq.

## Maoshlar byudjet moddasi sifatida

Maosh — xarajatlarning faqat bir qismi. **Xodimning to‘liq qiymati**ni rejalashtiring:

- maosh va soliqlar;
- yollash: suhbatlarga ketadigan vaqt, rekruter xizmatlari;
- texnika, litsenziyalar, bulut xizmatlari;
- ofis yoki masofaviy ish uchun kompensatsiyalar;
- o‘qish va konferensiyalar;
- yangi xodim hali to‘liq kuch bilan ishlamaydigan onbording vaqti.

Byudjetni kamida bir yil oldinga rejalashtiring: uch oyga yig‘ilgan jamoani yo‘qotishlarsiz tez tarqatib, qayta yig‘ib bo‘lmaydi.

## Onbording

Yaxshi onbording birinchi foydali vazifagacha bo‘lgan vaqtni qisqartiradi. Minimal to‘plam:

- **hujjatlar**: loyihani lokal ishga tushirish, arxitektura, kod bo‘yicha kelishuvlar;
- **kirish huquqlari** birinchi kuniyoq tayyor: repozitoriy, task-treker, chatlar, muhitlar;
- **birinchi vazifa** kichik va real, tajribali hamkasb tomonidan ko‘rib chiqiladi;
- dastlabki haftalar uchun **murabbiy**;
- bir oydan keyin uchrashuv: nima tushunarsiz, nima xalaqit beryapti.

## Birinchi kundan jarayonlar

Hatto uch kishilik jamoaga ham asosiy qoidalar kerak:

- **Git-flow va code review** — tekshiruvsiz hech qanday kod main’ga tushmaydi.
- **Task-treker** va ustuvorliklari aniq backlog.
- **Qisqa muntazam uchrashuvlar**: rejalashtirish, sinxronlash, retrospektivalar.
- **CI/CD** — relizlar bitta odamga bog‘liq bo‘lmasligi uchun avtomatik testlar va deploy.
- **Qarorlarni hujjatlashtirish** — nega aynan shu yondashuv tanlangani.

## Ko‘p uchraydigan xatolar

- Tejash uchun faqat junior dasturchilarni yollash — murabbiysiz ular sekin ishlaydi va texnik qarz to‘playdi.
- Birinchi oydayoq natija kutish.
- Texlidga yollashda ovoz bermaslik.
- Barcha bilimni bitta odamning boshida saqlash.
- Tashqi yordamdan butunlay voz kechish: boshida gibrid model (o‘z jamoasi + pudratchi) ko‘pincha xavflarni kamaytiradi.

## FAQ

### Qachon o‘z jamoasi pudratchidan foydaliroq?

Dasturlash biznesning doimiy qismi bo‘lsa, mahsulot yillar davomida rivojlansa va kompaniya ichida ekspertiza to‘plash muhim bo‘lsa. Bir martalik loyihalar va tez start uchun odatda pudratchi oddiyroq.

### Jamoani yig‘ish qancha vaqt oladi?

Bozor va talablarga bog‘liq: bitta tajribali mutaxassisni topish bir necha haftadan bir necha oygacha cho‘zilishi mumkin. Shuning uchun texlidni oldindan qidirishni boshlang.

### Texlidsiz boshlash mumkinmi?

Mumkin, agar boshida arxitektura va review’ni tajribali tashqi mutaxassis yoki pudratchi bajarsa. Ammo texnik qarorlar uchun mas’ul odamsiz jamoa tezda yo‘nalishini yo‘qotadi.
