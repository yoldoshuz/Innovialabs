---
title: Ichki xaridlar yoki Payme va Click: qachon qaysi biri mumkin
description: Mobil ilovada qaysi to‘lovlar In-App Purchase va Google Play Billing orqali o‘tishi shart, qayerda esa Payme, Click va bank kartalarini ulash mumkin.
summary: Ilova ichida iste’mol qilinadigan raqamli narsalar (obunalar, premium funksiyalar, o‘yin valyutasi) do‘konning ichki xaridlari orqali sotiladi; jismoniy tovarlar va real xizmatlar uchun Payme, Click yoki kartalar ishlatiladi.
---

## Qisqa javob

App Store va Google Play’da bitta asosiy qoida bor: **raqamli narsalar — ichki xaridlar orqali, jismoniy tovarlar va real xizmatlar — istalgan to‘lov tizimi orqali**.

- Agar foydalanuvchi **ilova ichida** iste’mol qilinadigan narsa uchun to‘lasa — premium funksiyalar, obuna, o‘yin valyutasi, raqamli kontent — **In-App Purchase** (Apple) va **Google Play Billing** (Google) ishlatilishi shart.
- Agar to‘lov **jismoniy tovarlar** yoki **real hayotdagi xizmatlar** uchun bo‘lsa — yetkazib berish, taksi, bron qilish, ta’mirlash, hisoblarni to‘lash — ichki xaridlar kerak emas, Apple esa bunday holatlarda ularga ruxsat bermaydi. Bu yerda Payme, Click, bank ekvayringi, provayder orqali Apple Pay va Google Pay ulanadi.

Ayrim mamlakatlarda istisnolar bor: muqobil billing, ruxsat etilgan tashqi havolalar. Ular hamma joyda amal qilmaydi va shartlari bor, shuning uchun O‘zbekistonga mo‘ljallangan ilovada asosiy qoidaga tayaning.

## Chegara qayerdan o‘tadi

| Nima sotasiz | To‘lovni qanday qabul qilish |
|---|---|
| Ilovaning premium funksiyalariga obuna | IAP / Google Play Billing |
| O‘yin valyutasi, bustlar, skinlar | IAP / Google Play Billing |
| Ilovada ko‘riladigan videokurs | IAP / Google Play Billing |
| Yetkazib beriladigan internet-do‘kon tovarlari | Payme, Click, kartalar |
| Taksi, ovqat yetkazish, shifokorga yozilish, mehmonxona broni | Payme, Click, kartalar |
| Hisoblarni to‘lash, o‘tkazmalar, balansni to‘ldirish | Payme, Click, kartalar |

Bahsli holatlarda bitta savol bering: **to‘langan narsa qayerda iste’mol qilinadi?** Natija faqat ilovada mavjud bo‘lsa — bu raqamli tovar. Uni kuryer olib kelsa, odam oflayn bajarsa yoki ilovadan tashqarida amalga oshsa — bu real xizmat.

Oraliq toifalar ham bor. Masalan, Apple real vaqtdagi «birga-bir» xizmatlarni (repetitor, shifokor maslahati) alohida tasvirlaydi: ular uchun tashqi to‘lov usullariga ruxsat bor, guruhli onlayn darslar esa odatda IAP talab qiladi. Google qoidalarni boshqacha ifodalaydi, shuning uchun bunday holatlarda ikkala siyosatni ham tekshiring: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#payments) va [Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738).

## Ilovalar nima uchun rad etiladi

- **Raqamli funksiyalar ilova ichida Payme, Click yoki karta orqali sotiladi.**
- **Raqamli kontent uchun «saytda arzonroq to‘lang» tugmasi yoki matni.** Ayrim hududlarda bu yumshatilgan, lekin bu umumiy holat emas.
- **Ko‘rib chiqish vaqtida to‘lov yashiriladi** va tasdiqdan keyin yoqiladi. Bu nafaqat rad etish, balki dasturchi akkauntining bloklanishi xavfi.
- **Jismoniy tovar IAP orqali sotiladi.** Ichki xaridlar real mahsulotlar uchun mo‘ljallanmagan, Apple buni rad etadi.
- **Saytda sotib olingan kod orqali kirish**, lekin xuddi shu funksiyalarni IAP orqali sotib olib bo‘lmaydi. Apple boshqa platformalardagi xaridlarga kirishga ruxsat beradi, ammo odatda shu pozitsiyalar ichki xarid sifatida ham mavjud bo‘lishi sharti bilan.

## Payme va Click ilovaga qanday ulanadi

Texnik jihatdan ko‘pchilik mahalliy provayderlarda sxema bir xil:

1. Kompaniya to‘lov tizimi bilan **merchant** sifatida shartnoma tuzadi va ulanish ma’lumotlarini oladi.
2. Buyurtma **sizning serveringizda** yaratiladi: summa, tarkib, foydalanuvchi.
3. Ilova provayderning to‘lov sahifasini (brauzer yoki WebView’da) ochadi yoki, agar mavjud bo‘lsa, uning mobil SDK’sidan foydalanadi.
4. Provayder to‘lov haqidagi xabarni serverga yuboradi, server imzoni tekshiradi va buyurtma holatini o‘zgartiradi.
5. Ilova holatni serverdan oladi, «to‘lov o‘tdi» ekraniga ishonmaydi.

Merchantning maxfiy kalitlari **faqat serverda** saqlanadi, hech qachon ilova kodida emas.

Yuridik jihatdan sotuvchi sizning kompaniyangiz: provayder bilan shartnoma, ommaviy oferta, qaytarish shartlari, O‘zbekiston qonunchiligi talablariga ko‘ra fiskal cheklar. Fiskalizatsiya tafsilotlari va tovar kodlarini provayder hamda buxgalter bilan aniqlang. Ilovalar do‘koni bu hisob-kitoblarda ishtirok etmaydi va ulardan komissiya olmaydi.

## Ko‘p uchraydigan xatolar

- **Ajratilmagan aralash model.** Internet-do‘kon qo‘shimcha ravishda elektron kitoblar yoki video darslarni Payme orqali sotadi. Raqamli qismni IAP’ga o‘tkazishga to‘g‘ri keladi.
- **Ko‘rib chiquvchi uchun bo‘sh izohlar.** Jismoniy tovar yoki xizmat sotilayotganini tushuntiring va test akkaunt bering.
- **IAP’ni kech tayyorlash.** App Store Connect va Play Console’dagi shartnomalar, soliq va bank ma’lumotlari vaqt oladi — oldindan boshlang.
- **Bekor qilish va qaytarish ssenariylari yo‘q.** Ko‘rib chiquvchi ham, foydalanuvchilar ham ularni birinchi bo‘lib tekshiradi.

## FAQ

### Obunani Payme orqali sotsa bo‘ladimi, agar u yerda arzonroq bo‘lsa?

Agar obuna ilovaning raqamli funksiyalarini ochsa — yo‘q. Uni saytda sotish mumkin, lekin qoidalar buni aniq ruxsat bergan hududlardan tashqari, foydalanuvchini ilovadan u yerga yo‘naltirish mumkin emas.

### Internet-do‘konga ichki xaridlar kerakmi?

Yo‘q. Jismoniy tovarlar uchun oddiy to‘lov tizimlari ishlatiladi: Payme, Click, bank ekvayringi, to‘lov provayderi orqali Apple Pay va Google Pay.

### Mahsulot raqamli va jismoniy narsalarni birlashtirsa-chi?

To‘lovlarni turi bo‘yicha ajrating: raqamli qism — IAP va Play Billing orqali, tovarlar va real xizmatlar — Payme yoki Click orqali. Savollarni oldindan yopish uchun bu sxemani ko‘rib chiqish izohlarida tasvirlang.
