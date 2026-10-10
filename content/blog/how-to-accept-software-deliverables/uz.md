---
title: Dasturchilardan ishni muammolarsiz qanday qabul qilish kerak
description: Buyurtmachi uchun dasturiy ta’minotni qabul qilish jarayoni: test ssenariylari, qurilmalar, to‘g‘ri bag-report, qabul dalolatnomasi va kafolat davri.
summary: Ishni oldindan kelishilgan ssenariylar bo‘yicha haqiqiy qurilmalarda qabul qiling, xatolarni trekerda yagona shablon bo‘yicha qayd eting va dalolatnomani faqat tuzatishlar tekshirilgandan keyin, kafolat davrini saqlagan holda imzolang.
---

## To‘g‘ri qabul qilish qanday ko‘rinadi

Qabul qilish — «chiroyli ko‘rinyaptimi» deb qarash emas, balki **oldindan kelishilgan mezonlar** bo‘yicha tekshirish. Ishchi jarayon quyidagicha:

1. Ishlab chiqish boshlanishidan oldin har bir funksiya uchun **qabul mezonlarini** kelishib oling.
2. Yig‘mani jangovar serverda emas, **test stendida** oling.
3. Kerakli qurilmalarda **test ssenariylaridan** o‘ting.
4. Xatolarni **trekerda** yagona shablon bo‘yicha qayd eting.
5. Tuzatishlarni tekshiring va **qabul dalolatnomasini** imzolang.
6. Ishga tushirilgandan keyin topilgan xatolar uchun **kafolat davridan** foydalaning.

Mezonlar oldindan kelishilmagan bo‘lsa, qabul qilish did haqidagi bahsga aylanadi.

## Test ssenariylari

Ssenariy — foydalanuvchining boshidan oxirigacha bo‘lgan yo‘li. Ularni oddiy tilda yozing:

- «Yangi foydalanuvchi telefon raqami orqali ro‘yxatdan o‘tadi, kod oladi, shaxsiy kabinetga kiradi».
- «Xaridor ikkita mahsulot qo‘shadi, promokod qo‘llaydi, to‘laydi, bildirishnoma oladi».
- «Menejer buyurtma holatini o‘zgartiradi, mijoz yangi holatni ko‘radi».

Faqat muvaffaqiyatli yo‘lni emas, **salbiy holatlarni** ham tekshiring:

- noto‘g‘ri parol, bo‘sh maydonlar, juda uzun matn;
- to‘lovni bekor qilish va qayta urinish;
- harakat o‘rtasida internet uzilishi;
- yuborish tugmasini ikki marta bosish;
- turli foydalanuvchi rollari va ularning huquqlari.

## Qurilmalar va muhit

Qurilmalar ro‘yxatini oldindan, auditoriyangizga qarab kelishib oling.

| Nimani tekshirish | Nega muhim |
|---|---|
| Ommabop Android smartfonlar, arzonlari ham | Kuchsiz qurilmalar tezlik muammolarini ko‘rsatadi |
| Dolzarb iOS bilan iPhone | Safari Chrome’dan boshqacha ishlaydi |
| Desktop brauzerlar | Keng ekranlardagi verstka |
| Sekin mobil internet | Yuklanish va tarmoq xatolarini qayta ishlash |
| Til versiyalari | Uzun tarjimalar verstkani buzadi |

## Bag-reportni qanday yozish kerak

Yomon report: «Hech narsa ishlamayapti». Yaxshisi quyidagilarni o‘z ichiga oladi:

- **Sarlavha**: nima va qayerda buzildi.
- **Takrorlash qadamlari**: raqamlangan harakatlar.
- **Kutilgan natija** va **haqiqiy natija**.
- **Muhit**: qurilma, brauzer, ilova versiyasi, akkaunt.
- **Skrinshot yoki ekran videosi**.
- **Muhimlik darajasi**: ishni to‘xtatadi, xalaqit beradi, kosmetik.

Bitta bag — bitta vazifa. Bitta xabarda beshta turli muammoni aralashtirmang.

## Qabul dalolatnomasi

Imzolashdan oldin tekshiring:

- barcha kritik va jiddiy xatolar **tuzatilgan va qayta tekshirilgan**;
- kosmetik izohlar tuzatilgan yoki muddat kelishilgan holda ro‘yxatga kiritilgan;
- **manba kodi, kirish huquqlari, hujjatlar** va joylashtirish bo‘yicha yo‘riqnomalar topshirilgan;
- dalolatnomada shunchaki «ishlar bajarildi» emas, qabul qilingan funksiyalar yoki bosqich sanab o‘tilgan.

Imzolangan dalolatnoma odatda ko‘rinadigan kamchiliklar bo‘yicha da’volar endi qabul qilinmasligini anglatadi. Shuning uchun uni «oldindan» imzolamang.

## Kafolat davri

Shartnomada **kafolatni** yozib qo‘ying: kelishilgan muddat davomida pudratchi ishlab chiqishda yo‘l qo‘yilgan xatolarni bepul tuzatadi. Aniqlang:

- kafolat muddati qancha;
- nima kafolat holati, nima yangi vazifa hisoblanadi;
- kafolat murojaatlariga reaksiya vaqti;
- kodni boshqa jamoa o‘zgartirsa, kafolat yo‘qoladimi.

## Ko‘p uchraydigan xatolar

- Faqat o‘z telefoningizda va administrator akkauntingizda tekshirish.
- Jonli stendda emas, skrinshotlar bo‘yicha qabul qilish.
- Izohlarni ovozli xabarlar bilan yuborish.
- «To‘lovni kechiktirmaslik» uchun ishga tushirishdan oldin dalolatnomani imzolash.

## FAQ

### Qabul qilishga qancha vaqt ajratish kerak?

Bu funksiyalar hajmiga bog‘liq. Rejaga test uchun alohida vaqt va kamida bitta tuzatish siklini kiriting, qabul muddatini esa ikki tomon qoidalarni bilishi uchun shartnomada belgilang.

### Buyurtmachi tomonida alohida testchi kerakmi?

Katta loyihalarda bu foydali: mustaqil QA mutaxassisi dasturchilar ham, biznes ham o‘tkazib yuboradigan narsalarni topadi. Kichik loyihalarda yaxshi yozilgan ssenariylar va e’tiborli mahsulot egasi odatda yetarli.

### Dalolatnoma imzolangandan keyin xato topilsa nima qilish kerak?

Agar bu yashirin kamchilik bo‘lsa va kafolat davriga to‘g‘ri kelsa, xuddi shu bag-report shabloni bo‘yicha kafolat murojaatini rasmiylashtiring. Agar bu yangi talab bo‘lsa, u alohida vazifa.
