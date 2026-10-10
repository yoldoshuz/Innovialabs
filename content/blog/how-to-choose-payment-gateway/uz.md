---
title: Internet-do‘kon uchun to‘lov shlyuzini qanday tanlash kerak
description: To‘lov shlyuzini tanlash ro‘yxati: kartalar va hamyonlar, komissiyalar, to‘lov tezligi, valyutalar, API sifati, takroriy to‘lovlar, qaytarishlar va hujjat talablari.
summary: Shlyuzni xaridorlaringiz nima bilan to‘lashi, barcha komissiyalar bilan har bir to‘lov qanchaga tushishi, pul qanchalik tez kelishi va API bekor qilish, qaytarish va obunalarni qanchalik qulay qilishiga qarab tanlang; faqat komissiya stavkasi bo‘yicha solishtirish deyarli har doim chalg‘itadi.
---
## Qisqa javob

To‘g‘ri shlyuz — **xaridorlaringiz to‘lay oladigan va to‘lashni xohlaydigan**, serveringiz esa to‘lov natijasini ishonchli biladigan shlyuz. Sakkiz mezonni tekshiring:

1. Kartalar va hamyonlar.
2. Komissiyalar.
3. To‘lovlar tezligi.
4. Valyutalar.
5. API va hujjatlar sifati.
6. Takroriy to‘lovlar.
7. Bekor qilish va qaytarish.
8. Ulanish talablari.

O‘zbekistondagi do‘kon odatda **Payme** va **Click**ni birga ulaydi, xorijga sotish uchun esa, kompaniyangiz talablarga mos kelsa, Stripe kabi xalqaro shlyuzni.

## 1. Kartalar va hamyonlar

Shlyuzdan emas, auditoriyadan boshlang.

- Mijozlaringiz qaysi kartalar bilan to‘laydi: mahalliy **Uzcard** va **Humo** yoki xalqaro Visa va Mastercard?
- Hamyonlar va to‘lov tizimi ilovasidan to‘lash kerakmi?
- O‘rtacha chekingiz uchun muddatli to‘lov yoki QR orqali to‘lov muhimmi?

Agar shlyuz auditoriyaning yarmi ishlatadigan kartani qabul qilmasa, qolgan mezonlarning ahamiyati yo‘q.

## 2. Komissiyalar

Bitta stavkaga emas, **to‘lovning to‘liq narxiga** qarang:

- tranzaksiya foizi va, agar bo‘lsa, qat’iy qism;
- turli karta turlari uchun turli stavkalar;
- ulanish to‘lovi, oylik to‘lov;
- qaytarish va nizoli to‘lovlar uchun komissiya;
- valyuta konvertatsiyasi xarajatlari.

Tariflarni yozma ravishda so‘rang va o‘z o‘rtacha chekingizda hisoblang.

## 3. To‘lovlar tezligi

Aylanma mablag‘ uchun pul hisob raqamiga **necha kunda** kelishi va minimal to‘lov summasi borligi muhim. Dam olish va bayram kunlarida to‘lovlar qanday ishlashini aniqlang.

## 4. Valyutalar

- Faqat so‘mda qabul qilsangiz, mahalliy shlyuz yetarli.
- Xorijga sotsangiz, ko‘p valyutali va konvertatsiyasi tushunarli shlyuz kerak.
- To‘lovlar qaysi valyutada kelishini va konvertatsiyaga kim to‘lashini tekshiring.

## 5. API va hujjatlar sifati

Bu integratsiya muddati va narxini belgilaydi. Yaxshi belgilar:

- so‘rov va javob misollari bilan batafsil hujjatlar;
- sinov kartalari bilan **sinov muhiti**;
- imzo yoki avtorizatsiyali to‘lov natijasi haqidagi server bildirishnomalari (callback yoki webhook);
- tushunarli xato kodlari;
- CMS’da bo‘lsangiz, mashhur CMS’lar uchun tayyor modullar;
- dasturchilar uchun jonli texnik yordam.

## 6. Takroriy to‘lovlar

Obunalar, servis modeli yoki bir bosishda takroriy xaridlar bo‘lsa, **kartani tokenlashtirish** kerak — keyingi yechib olishlar uchun kartani shlyuz tomonida saqlash. Shlyuz buni qo‘llab-quvvatlashini va qanday shartlarda ekanini tekshiring.

## 7. Bekor qilish va qaytarish

- To‘lovni API orqali bekor qilsa bo‘ladimi yoki faqat shaxsiy kabinetdami?
- **Qisman qaytarish** qo‘llab-quvvatlanadimi?
- Pul mijozga qancha vaqtda qaytadi?
- Shlyuz serveringizga qaytarish haqida qanday xabar beradi?

## 8. Ulanish talablari

Odatda shlyuz yuridik shaxs yoki YaTT ma’lumotlarini, bank rekvizitlarini va oferta, kontaktlar hamda qaytarish siyosati bor ishlaydigan saytni so‘raydi. Xalqaro shlyuzlar qo‘shimcha ravishda kompaniya ro‘yxatdan o‘tgan mamlakatni tekshiradi. Hujjatlar ro‘yxatini oldindan bilib oling: tekshiruv vaqt olishi mumkin, uni ishlab chiqish bilan parallel boshlagan ma’qul.

## Solishtirish uchun jadval

| Mezon | Nimani so‘rash kerak |
|---|---|
| To‘lov usullari | Qaysi kartalar va hamyonlar qabul qilinadi? |
| Narx | O‘rtacha chekimdagi komissiyalarning to‘liq ro‘yxati? |
| To‘lovlar | Necha kunda va minimum bormi? |
| Valyutalar | Qaysi valyutalar, konvertatsiyaga kim to‘laydi? |
| API | Sinov muhiti va imzolangan bildirishnomalar bormi? |
| Takroriy | Kartani tokenlashtirish bormi? |
| Qaytarish | API orqalimi, qisman, qancha muddatda? |
| Ulanish | Qaysi hujjatlar, tekshiruv qancha davom etadi? |

## Ko‘p uchraydigan xatolar

- Qaytarish va konvertatsiyani hisoblamay, eng past stavka bo‘yicha tanlash.
- Mijozlar ikki xil ilovaga o‘rganib qolgan paytda bitta shlyuz ulash.
- Shlyuz muvaffaqiyatsiz to‘lovlar haqida qanday xabar berishini tekshirmaslik.
- Ulanishni ishlab chiqish bilan parallel emas, sayt tayyor bo‘lgach boshlash.

## FAQ

### Bir nechta shlyuz ulash kerakmi?

Ko‘pincha ha. Xaridorlar muayyan ilovaga o‘rganadi va ikkala mashhur variantning bo‘lishi tashlab ketilgan savatlar sonini kamaytiradi. Buyurtmalar va holatlar har bir shlyuzda alohida emas, o‘z bazangizda saqlansa, texnik jihatdan bu murakkab emas.

### Keyinroq shlyuzni almashtirsa bo‘ladimi?

Bo‘ladi, lekin takroriy to‘lovlar bilan bu qiyinroq: saqlangan kartalar odatda provayderlar o‘rtasida ko‘chirilmaydi va mijozlar kartani qaytadan kiritishiga to‘g‘ri keladi.

### Kartalarni qabul qilish uchun PCI DSS sertifikati kerakmi?

Karta ma’lumotlari shlyuz sahifasida yoki formasida kiritilsa, PCI DSS bo‘yicha asosiy yuk shlyuz zimmasida va sizning talablaringiz minimal. Karta raqamlarini o‘z serveringizda yig‘sangiz, talablar ancha qat’iylashadi.
