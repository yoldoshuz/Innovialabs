---
title: IT loyihalarda qabul testlash (UAT) nima
description: UAT nima, uni kim o‘tkazadi, QA dan farqi nimada, tekshiruv ssenariylarini qanday tayyorlash va mahsulotni qabul qilishni to‘g‘ri rasmiylashtirish.
summary: UAT — mahsulotni buyurtmachi va real foydalanuvchilar tomonidan real ssenariylarda yakuniy tekshirish, shundan so‘ng natija rasman qabul qilinadi yoki qayta ishlashga qaytariladi.
---

## UAT oddiy so‘zlar bilan

**User Acceptance Testing (UAT)** yoki qabul testlash — ishga tushirishdan oldin mahsulotni buyurtmachi tomonidan tekshirish. Uning maqsadi — tizim biznes vazifalarini kelishilganidek hal qilishiga va real ishda undan foydalanish qulayligiga ishonch hosil qilish.

UAT eng oxirida o‘tkaziladi: funksiyalar allaqachon amalga oshirilgan va ishlab chiqish jamoasi tomonidan tekshirilgan. UAT natijasi — **qabul qilish to‘g‘risidagi qaror**: mahsulot qabul qilindi, izohlar bilan qabul qilindi yoki qayta ishlashga qaytarildi.

## UAT ni kim o‘tkazadi

Qabulni dasturchilar emas, **buyurtmachi tomoni** o‘tkazadi:

- **mahsulot egasi** yoki mas’ul menejer;
- **kelajakdagi foydalanuvchilar**: operatorlar, buxgalterlar, savdo menejerlari, omborchilar;
- ba’zan jarayon qoidalari va istisnolarini biladigan **soha ekspertlari**.

Ishlab chiqish jamoasi muhitni tayyorlaydi, savollarga javob beradi va topilganlarni tuzatadi, lekin buyurtmachi o‘rniga baho qo‘ymaydi.

## UAT ning QA dan farqi

| | QA testlash | UAT |
|---|---|---|
| Kim tekshiradi | Jamoa testerlari | Buyurtmachi va foydalanuvchilar |
| Qachon | Ishlab chiqish jarayonida | Ishga tushirishdan oldin |
| Nima qidiriladi | Texnik xatolar, baglar | Biznes vazifalariga moslik |
| Asos | Talablar va spetsifikatsiya | Real ish ssenariylari |
| Natija | Bag hisobotlari | Qabul qarori |

QA «bu xatosiz ishlaydimi?» degan savolga, UAT esa «bu bizga kerak narsami?» degan savolga javob beradi. Mahsulot bagsiz bo‘lsa ham, real jarayonga mos kelmasa, qabuldan o‘tmasligi mumkin.

## UAT ga qanday tayyorlanish kerak

1. **Qabul mezonlarini oldindan belgilang**, talablar bosqichidayoq. Har bir user story da ular bo‘lsa yaxshi.
2. **Ishtirokchilarni tanlang** va ularga vaqt ajrating. «Ish orasida» o‘tkazilgan UAT odatda yuzaki bo‘ladi.
3. **Muhitni tayyorlang**: ishchi muhitga imkon qadar o‘xshash, real test ma’lumotlari bilan alohida stend.
4. **Real ish vazifalari asosida ssenariylar yozing.**
5. **Izohlar formatini kelishib oling**: qayerga yozish va muhimlikni qanday baholash.
6. **Muddatlarni belgilang**: tekshiruv qancha davom etadi va tuzatishlarga qancha vaqt ajratiladi.

## Tekshiruv ssenariylarini qanday yozish

Ssenariy — foydalanuvchining real vazifasining kutilgan natija bilan bosqichma-bosqich tavsifi. Internet-do‘kon uchun misol:

- **Ssenariy:** karta orqali to‘lov bilan buyurtma berish.
- **Qadamlar:** mahsulotni topish, savatchaga qo‘shish, manzilni kiritish, to‘lov usulini tanlash, to‘lash.
- **Kutilgan natija:** buyurtma admin panelda «To‘langan» holatida paydo bo‘ldi, xaridor bildirishnoma oldi.
- **Haqiqiy natija:** tekshiruvchi to‘ldiradi.
- **Holat:** o‘tdi / o‘tmadi.

Faqat «baxtli yo‘l»ni emas, odatiy chetga chiqishlarni ham kiriting: buyurtmani bekor qilish, qaytarish, noto‘g‘ri ma’lumotlar.

## Izohlar va qabulni qanday rasmiylashtirish

Har bir izoh uchun qayd eting:

- nima qildingiz (qadamlar);
- nimani kutdingiz va nima oldingiz;
- skrinshot yoki ekran yozuvi;
- **muhimlik**: ishni to‘xtatadi, xalaqit beradi, kosmetik.

**Nuqsonlarni** (kelishilganidek ishlamaydi) **yangi istaklardan** (ishlaydi, lekin boshqacha bo‘lishini xohlaysiz) ajratish muhim. Istaklar odatda alohida rasmiylashtiriladi va qabulni to‘xtatmaydi.

UAT **qabul dalolatnomasini imzolash** yoki yozma tasdiq bilan yakunlanadi. Unda nima tekshirilgani, qaysi izohlar qolgani va ular qachon yopilishi ko‘rsatiladi.

## Keng tarqalgan xatolar

- UAT ni qabul mezonlarisiz boshlash — shunda bahs did haqida ketadi.
- Real ma’lumotlar o‘rniga bo‘sh ma’lumotlarda tekshirish.
- Tizimda har kuni ishlaydiganlarni emas, faqat rahbarni jalb qilish.
- Baglar va yangi g‘oyalarni bitta ro‘yxatda aralashtirish.
- Natijani yozma qayd etmaslik.

## FAQ

### UAT qancha davom etadi?

Mahsulot hajmi, ssenariylar soni va ishtirokchilarning bandligiga bog‘liq. Muhimi — muddatni oldindan kelishib olish va qabulni cheksiz cho‘zmaslik.

### Agar QA hammasini tekshirgan bo‘lsa, UAT ni o‘tkazib yuborish mumkinmi?

Tavsiya etilmaydi. QA talablarga moslikni tekshiradi, lekin tizim real ishga mos kelishini faqat foydalanuvchilar tasdiqlay oladi.

### UAT davomida yangi talablar paydo bo‘lsa nima qilish kerak?

Ularni alohida yozib, baholab, keyingi bosqich sifatida rejalashtiring. Joriy versiya oldindan kelishilgan mezonlar bo‘yicha qabul qilinadi.
