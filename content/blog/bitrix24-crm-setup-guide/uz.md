---
title: Bitrix24 da CRM ni qanday sozlash kerak: amaliy qo‘llanma
description: Bitrix24 CRM ni sozlash: lidli yoki lidsiz rejim, voronkalar, maydonlar, robotlar va triggerlar, kirish huquqlari, CRM-formalar va ochiq liniyalar.
summary: Avval ish rejimini tanlang (lidli yoki lidsiz), so‘ng bitimlar voronkasini tasvirlang, faqat kerakli maydonlarni qo‘shing, odatiy ishlarni robotlar va triggerlar bilan avtomatlashtiring, huquqlarni rollar bo‘yicha bering hamda formalar va ochiq liniyalarni ulang — shunda arizalar CRM ga o‘zi tushadi.
---
## Qisqa javob

Bitrix24 da CRM ni quyidagi tartibda sozlang:

1. **Ish rejimi** — klassik (lidlar bilan) yoki oddiy (faqat bitimlar).
2. **Voronkalar va bosqichlar** — mijozning arizadan to‘lovgacha bo‘lgan haqiqiy yo‘lini aks ettiradi.
3. **Maydonlar** — faqat qaror qabul qiladigan yoki hisobot tuzadigan ma’lumotlar uchun.
4. **Robotlar va triggerlar** — vazifalar, bildirishnomalar va bosqichlar orasidagi o‘tishlarni avtomatlashtirish.
5. **Kirish huquqlari** — kim nimani ko‘radi va tahrirlaydi.
6. **Ariza manbalari** — saytdagi CRM-formalar hamda messenjerlar va chatlar uchun ochiq liniyalar.

Tartib muhim: tasvirlanmagan jarayonni avtomatlashtirish faqat tartibsizlikni mustahkamlaydi.

## Lidlar yoki darhol bitimlar

Bitrix24 da CRM ning ikki rejimi bor.

| Rejim | Qanday ishlaydi | Kimga mos |
|---|---|---|
| **Klassik** | Ariza avval lid bo‘ladi, saralangandan keyin kontakt, kompaniya va bitimga aylanadi | Kiruvchi arizalar ko‘p, ularning bir qismi maqsadsiz, alohida saralash bosqichi bor |
| **Oddiy** | Har bir murojaat darhol bitim va kontakt yaratadi | Oqim kichik, deyarli barcha murojaatlar maqsadli, bitta menejer mijozni boshidan oxirigacha olib boradi |

Ikkilansangiz, oddiy rejimdan boshlang: unda ob’ektlar kam va chalkashlik ham kam. Keyinroq almashtirish mumkin, lekin buni ma’lumotlarni ommaviy import qilishdan oldin qilgan ma’qul.

## Voronkalar va bosqichlar

**Voronka** (bitimlar yo‘nalishi) — bitta biznes-jarayon bosqichlarining ketma-ketligi. Alohida voronkalarni faqat haqiqatan ham turli jarayonlar uchun oching: masalan, yangi sotuvlar, takroriy sotuvlar, servis arizalari.

Bosqichlar uchun qoidalar:

- Har bir bosqich — **tekshirsa bo‘ladigan voqea**: «Taklif yuborildi», «Hisob-faktura berildi», «Ishlayapmiz» emas.
- Odatda 5–8 bosqich yetarli; uzun voronka intizomni pasaytiradi.
- **Yo‘qotish sabablarini** albatta sozlang — ularsiz mijozlar qayerda yo‘qolayotganini tushunib bo‘lmaydi.

## Foydalanuvchi maydonlari

Maydonlar lid, bitim, kontakt yoki kompaniya kartochkasi sozlamalarida qo‘shiladi. Har bir maydonni yaratishdan oldin so‘rang: uni kim va qachon to‘ldiradi, qaysi hisobotda ishlatiladi?

- Qiymatlar takrorlanadigan joyda erkin matn o‘rniga **ro‘yxatlardan** foydalaning (manba, shahar, mijoz turi).
- Maydonni darhol emas, **muayyan bosqichda majburiy** qiling: masalan, «Summa» «Hisob-faktura berildi» bosqichiga o‘tishda majburiy bo‘lsin.
- Maydonlarni takrorlamang: inson haqidagi ma’lumot — kontaktda, xarid haqidagi ma’lumot — bitimda.

## Robotlar va triggerlar

**Avtomatlashtirish** bo‘limida voronkaning har bir bosqichi uchun amallar belgilanadi.

- **Robot** bitim bosqichga tushganda amal bajaradi: vazifa yaratadi, mijozga xabar yuboradi, mas’ulni almashtiradi, eslatma qo‘yadi.
- **Trigger** tashqi voqea bo‘yicha bitimni bosqichga o‘tkazadi: forma to‘ldirildi, mijoz chatga yozdi, qo‘ng‘iroq keldi, hisob to‘landi.

Birinchi foydali ssenariylar:

- yangi ariza → menejerga muddatli qo‘ng‘iroq vazifasi;
- bitimda bir necha kun faollik yo‘q → rahbarga bildirishnoma;
- «Hisob-faktura berildi» bosqichiga o‘tish → mijozga avtomatik xat.

Avtomatlashtirishni asta-sekin qo‘shing va har bir robotni test bitimida tekshiring.

## Kirish huquqlari

Huquqlar CRM sozlamalaridagi **rollar** orqali beriladi. Odatiy sxema:

- **Menejer** — o‘z bitimlari va kontaktlarini ko‘radi va tahrirlaydi.
- **Bo‘lim rahbari** — o‘z bo‘limining bitimlarini ko‘radi.
- **Administrator** — sozlamalar va eksport bilan birga to‘liq kirish.

**Eksport va o‘chirishni** alohida cheklang: bu mijozlar bazasi uchun eng xavfli amallar.

## CRM-formalar va ochiq liniyalar

- **CRM-formalar** CRM bo‘limida yaratiladi va saytga kod orqali joylanadi yoki havola orqali ochiladi. Har bir to‘ldirish manbasi ko‘rsatilgan lid yoki bitim yaratadi.
- **Ochiq liniyalar** messenjerlar, ijtimoiy tarmoqlar va saytdagi onlayn-chatdan kelgan murojaatlarni yagona interfeysga yig‘adi va dialoglarni mijoz kartochkalariga bog‘laydi.

Ulangandan so‘ng har bir kanal orqali test ariza yuboring va tekshiring: yozuv yaratildimi, mas’ul tayinlandimi, robotlar ishladimi?

## Ko‘p uchraydigan xatolar

- O‘z jarayonini tasvirlash o‘rniga birovning voronkasini ko‘chirib olish.
- «Har ehtimolga qarshi» o‘nlab maydon qo‘shish.
- Jamoa CRM da qo‘lda ishlashni o‘zlashtirmasidan avtomatlashtirishni yoqish.
- Hammaga administrator huquqini berish.

## FAQ

### Ish boshlangandan keyin CRM rejimini o‘zgartirish mumkinmi?

Ha, rejim CRM sozlamalarida almashtiriladi. Lekin bunda yozuvlar yaratilish mantig‘i o‘zgaradi, shuning uchun bazani import qilish va jamoani o‘qitishdan oldin qaror qilgan yaxshi.

### Kichik kompaniyaga nechta voronka kerak?

Odatda bitta yoki ikkita. Yangi voronkani faqat jarayonning bosqichlari haqiqatan boshqacha bo‘lganda yarating, shunchaki boshqa mahsulot uchun emas.

### Robot biznes-jarayondan nimasi bilan farq qiladi?

Robot — bosqichga bog‘langan oddiy amal. Biznes-jarayon — shartlar va tarmoqlanishlarga ega murakkab ssenariy; u kamroq kerak bo‘ladi va sozlash hamda qo‘llab-quvvatlash uchun ko‘proq vaqt talab qiladi.
