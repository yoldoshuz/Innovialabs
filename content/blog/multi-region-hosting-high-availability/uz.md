---
title: Ko‘p mintaqali hosting: ma’lumotlar markazi ishdan chiqqanda
description: Active-passive va active-active farqi, DNS failover qanday ishlashi, ma’lumotlar replikatsiyasidagi murosalar va ikkinchi mintaqa qachon o‘zini oqlashi.
summary: Ko‘p mintaqali hosting — bu ilovaning boshqa mintaqadagi ishlaydigan nusxasi va nosozlikda trafikni avtomatik o‘tkazish; active-passive bilan boshlang, active-active esa faqat to‘xtab qolish ikki baravar infratuzilmadan qimmatroq bo‘lsa kerak.
---

## Qisqa javob

Bitta ma’lumotlar markazi — bu yagona nosozlik nuqtasi. Yong‘in, elektr ta’minotidagi muammo, provayder tarmog‘idagi xato yoki butun bulut mintaqasidagi nosozlik ichida nechta server bo‘lishidan qat’i nazar saytni to‘xtatadi. **Ko‘p mintaqali hosting** — bu ilovaning geografik jihatdan boshqa joydagi ishlaydigan nusxasi va asosiy maydon ishlamay qolganda foydalanuvchilarni u yerga yo‘naltiruvchi mexanizm.

Ikki vazifani farqlash muhim:

- **Mintaqa ichidagi yuqori mavjudlik** — bir nechta server va mavjudlik zonalari (availability zones). Alohida mashina yoki stoyka ishdan chiqishini yopadi.
- **Mintaqalararo barqarorlik** — butun maydon ishdan chiqishini yopadi. Bu qimmatroq va murakkabroq, asosan ma’lumotlar sababli.

Loyihalashdan oldin ikki ko‘rsatkichni belgilang: **RTO** (servis qancha vaqtda tiklanishi kerak) va **RPO** (oxirgi ma’lumotlarning qanchasini yo‘qotish mumkin). Arxitekturani aynan shular belgilaydi, «hech qachon to‘xtamasin» degan istak emas.

## Active-passive va active-active

| | Active-passive | Active-active |
|---|---|---|
| Trafik | Hammasi asosiy mintaqaga, zaxira kutib turadi | Doimiy ravishda mintaqalar o‘rtasida taqsimlanadi |
| O‘tkazish | Nosozlikda, bir necha daqiqada | Trafik shunchaki ishdan chiqqan mintaqaga bormay qo‘yadi |
| Ma’lumotlar | Bitta asosiy BD, zaxirada replika | Bir nechta mintaqada yozish yoki yozuvlarni ehtiyotkor yo‘naltirish |
| Murakkablik | O‘rtacha | Yuqori |
| Narx | Zaxirani kichraytirilgan holda saqlash mumkin | Har bir mintaqada to‘liq quvvat |

**Active-passive** ko‘pchilik loyihalarga mos keladi. Zaxira mintaqa **issiq** (hammasi ishlab turibdi, faqat trafikni o‘tkazish kerak), **iliq** (minimal serverlar, avariyada kengaytiriladi) yoki **sovuq** (faqat zaxira nusxalar va infratuzilma kod sifatida, qo‘lda ko‘tariladi) bo‘lishi mumkin.

**Active-active** eng qisqa to‘xtab qolishni va qo‘shimcha ravishda dunyoning turli qismlaridagi foydalanuvchilar uchun past kechikishni beradi. Lekin har bir mintaqa butun yuklamani o‘zi ko‘tara olishi, ilova esa bir nechta joyda o‘zgaradigan ma’lumotlar bilan to‘g‘ri ishlashi kerak.

## DNS failover: trafik qanday o‘tkaziladi

Eng keng tarqalgan mexanizm — **sog‘liq tekshiruvlari (health checks) bilan DNS**. DNS provayder har bir mintaqadagi ilova endpoint’ini muntazam so‘rab turadi va asosiysi javob bermay qolsa, zaxira manzilini qaytara boshlaydi.

E’tibor berish kerak bo‘lgan jihatlar:

- **Yozuv TTL’i.** Rezolverlar javobni TTL davomida keshlaydi, shuning uchun failover yozuvlari uchun qisqa TTL qo‘yiladi. Ba’zi mijozlar va provayderlar baribir eski manzilni uzoqroq ushlab turishi mumkin.
- **Tekshiruv chuqurligi.** Doim `200` qaytaradigan `/health` endpoint foydasiz. U servis usiz ishlamaydigan narsalarni — bazani, keshni, muhim bog‘liqliklarni — tekshirishi, lekin ikkinchi darajali narsalar tufayli yiqilmasligi kerak.
- **Ishga tushish chegarasi.** Bitta muvaffaqiyatsiz tekshiruvda o‘tkazish «sakrashlarga» olib keladi. Turli nuqtalardan ketma-ket bir nechta muvaffaqiyatsiz tekshiruv talab qiling.
- **Muqobillar.** Global balanserlar va anycast (masalan, CDN provayderlarida) trafikni DNS’dan tezroq o‘tkazadi, chunki rezolver keshiga bog‘liq emas.

## Ma’lumotlar: asosiy murosa

Kod va statik fayllarni nusxalash oson. Qiyinchilik har doim ma’lumotlar bazasida.

- **Asinxron replikatsiya.** Asosiy BD yozuvni darhol tasdiqlaydi, replika esa kechikish bilan yetib oladi. Tez, lekin avariyada oxirgi tranzaksiyalar yetib ulgurmasligi mumkin — bu sizning RPO’ingiz.
- **Sinxron replikatsiya.** Yozuv faqat ikkala mintaqada saqlangandan keyin tasdiqlanadi. Yo‘qotish yo‘q, lekin har bir yozuv mintaqalararo kechikishni kutadi, aloqa uzilsa yozish to‘xtab qolishi mumkin.
- **Multimaster.** Istalgan mintaqada yozish mumkin. Ziddiyatlarni hal qilish strategiyasi kerak va har bir ma’lumotlar modeli bunga mos kelmaydi.

**Qaytarib o‘tkazishni** (failback) alohida o‘ylab chiqing: asosiy mintaqa tiklanganda uning ma’lumotlari eskirgan bo‘ladi va trafikni yo‘qotishlarsiz qaytarish — alohida protsedura.

## Ko‘p uchraydigan xatolar

- Zaxira mintaqa hech qachon real yuklama ostida tekshirilmagan va avariya paytida u ishga tushmasligi ma’lum bo‘ladi.
- Maxfiy kalitlar, sertifikatlar, tashqi servislarning DNS yozuvlari yoki navbatlar faqat asosiy mintaqada mavjud.
- Foydalanuvchi fayllari replikatsiyali obyekt omborida emas, server diskida saqlanadi.
- Yordamchi servislar (avtorizatsiya, to‘lovlar, pochta) bitta mintaqaga bog‘langan va yangi yagona nosozlik nuqtasiga aylanadi.
- Runbook yo‘q: o‘tkazish haqida kim qaror qiladi va qanday qadamlar bajariladi — noma’lum.

## Ikkinchi mintaqa qachon o‘zini oqlaydi

Ko‘p mintaqalilik ikki marta pul talab qiladi: infratuzilma uchun va uni qo‘llab-quvvatlashga ketadigan muhandislik vaqti uchun. U quyidagi hollarda o‘zini oqlaydi:

- bir soatlik to‘xtab qolish zaxirani saqlashdan qimmatroq tushsa;
- mijozlar oldida mavjudlik bo‘yicha shartnomaviy majburiyatlar (SLA) bo‘lsa;
- regulyator talablari zaxira maydonni majburiy qilsa;
- foydalanuvchilar dunyo bo‘ylab tarqalgan va kechikishning o‘zi biznesga ta’sir qilsa.

Bularning hech biri bo‘lmasa, oqilona qadam — bitta mintaqada bir nechta mavjudlik zonasi, boshqa mintaqaga muntazam zaxira nusxalar va hammasini oldindan aytib bo‘ladigan vaqtda qayta ko‘tarish uchun infratuzilma kod sifatida.

## FAQ

### Ma’lumotlar markazi ishdan chiqqanda CDN yetarlimi?

Statik sayt uchun qisman: manba ishlamayotganda CDN keshlangan sahifalarni berishda davom etishi mumkin. Lekin dinamik funksiyalar, formalar, shaxsiy kabinet va API ishlaydigan backend’siz to‘xtaydi.

### O‘tkazishni qanchalik tez-tez tekshirish kerak?

Muntazam, jadval bo‘yicha, shuningdek infratuzilmadagi har bir yirik o‘zgarishdan keyin. Tekshirilmagan zaxirani zaxira deb hisoblab bo‘lmaydi: faqat mashqlar haqiqiy RTO va RPO’ni ko‘rsatadi.

### Zaxira mintaqani boshqa bulut provayderida qilish mumkinmi?

Mumkin, bu muayyan provayderdagi muammolardan ham himoya qiladi. Lekin murakkablik oshadi: turli API, servislar va tarmoqlar sababli infratuzilmani iloji boricha ko‘chiriladigan tarzda tavsiflash kerak bo‘ladi.
