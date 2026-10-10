---
title: E-commerce’da to‘lovlarni solishtirishni qanday avtomatlashtirish mumkin
description: Buyurtmalar, to‘lov shlyuzi hisobotlari va bank tushumlarini moslashtirish, komissiya, qaytarish va qisman to‘lovlarni hisobga olish, nomuvofiqliklarni topish.
summary: Avtomatik solishtirish uchta manbani — buyurtmalar, shlyuz hisobotlari va bank ko‘chirmalarini — umumiy identifikatorlar bo‘yicha bog‘laydi, komissiya va qaytarishlarni hisobga oladi va alohida navbatga faqat haqiqiy nomuvofiqliklarni chiqaradi.
---
## Solishtirish nima va uni nega avtomatlashtirish kerak

**To‘lovlarni solishtirish** — har bir to‘langan buyurtma haqiqatan to‘langanini, pul hisobga kutilgan summada tushganini, barcha komissiya va qaytarishlar hisobga olinganini tekshirish.

Qo‘lda bu jadvallarda qilinadi: buyurtmalar, shlyuz hisoboti va bank ko‘chirmasi yuklab olinadi va qatorlar solishtiriladi. Buyurtmalar kam bo‘lsa, bunga chidash mumkin. Hajm o‘sishi bilan qo‘lda solishtirish ortda qola boshlaydi, xatolar yig‘iladi, nomuvofiqliklar esa haftalar o‘tib topiladi.

Avtomatlashtirish uchta vazifani hal qiladi: **yozuvlarni moslashtiradi**, **kutilgan summalarni hisoblaydi** va **faqat istisnolarni ko‘rsatadi**.

## Uchta ma’lumot manbai

| Manba | Nimani o‘z ichiga oladi | Asosiy maydonlar |
|---|---|---|
| Sizning tizimingiz (buyurtmalar) | Mijoz nima to‘lashi kerak edi | Buyurtma ID, summa, status, sana |
| To‘lov shlyuzi hisoboti | Qaysi tranzaksiyalar o‘tdi | Tranzaksiya ID, buyurtma ID, summa, komissiya, status |
| Bank ko‘chirmasi | Haqiqatda nima tushdi | Tushum summasi, sana, to‘lov maqsadi, to‘lov ID |

Qiyinchilik shundaki, ular orasidagi bog‘lanishlar bir xil emas. Buyurtma va tranzaksiya ko‘pincha birga-bir bog‘langan, bank esa davr uchun tranzaksiyalar to‘plamini komissiyalarni ayirib, **bitta summada** o‘tkazadi.

## Jarayonni qanday qurish kerak

1. **Ma’lumotlarni avtomatik yig‘ing.** Buyurtmalar — bazangizdan, tranzaksiyalar — API yoki shlyuz hisobotini muntazam yuklash orqali, ko‘chirmalar — bank API’si yoki fayl importi orqali.
2. **Normallashtiring.** Sana va vaqt mintaqalarining yagona formati, summalar valyutaning eng kichik birliklarida (butun sonlar), yagona statuslar.
3. **Buyurtma va tranzaksiyalarni moslashtiring.** To‘lov yaratishda shlyuzga uzatadigan buyurtma ID bo‘yicha. Bu asosiy kalit — usiz solishtirish summa va vaqt bo‘yicha taxmin qilishga aylanadi.
4. **Tranzaksiyalarni to‘lovlarga guruhlang.** Agar shlyuz to‘lov (settlement) ID’sini ko‘rsatsa, u bo‘yicha guruhlang. Bo‘lmasa — shartnoma shartlariga ko‘ra hisob-kitob sanasi bo‘yicha.
5. **Kutilgan tushumni hisoblang.** Tranzaksiyalar summasi − komissiyalar − qaytarishlar ± tuzatishlar.
6. **Ko‘chirma bilan solishtiring.** Mos keldi — to‘lov yopildi. Mos kelmadi — istisno.

## Komissiyalar, qaytarishlar va qisman to‘lovlar

- **Komissiyalar.** Ularni o‘z tarifingiz bo‘yicha hisoblamang, shlyuz hisobotidan oling: haqiqiy komissiya karta turi, to‘lov usuli yoki shartnoma shartlariga bog‘liq bo‘lishi mumkin. O‘z hisobingiz nazorat sifatida foydali.
- **Qaytarishlar.** Bular o‘z ID va sanalariga ega alohida operatsiyalar. Qaytarish boshqa davr to‘lovini kamaytirishi mumkin — uni sanaga emas, asl tranzaksiyaga bog‘lang.
- **Qisman to‘lovlar.** Bitta buyurtma — bir nechta tranzaksiya. Buyurtma bo‘yicha barcha muvaffaqiyatli tranzaksiyalar summasini uning summasi bilan solishtiring.
- **Qisman qaytarishlar.** Shunchaki «qaytarilgan» belgisini emas, qaytarish summasini saqlang.
- **Valyuta va yaxlitlash.** Suzuvchi nuqtali sonlar tufayli tiyinlardagi farqlar chiqmasligi uchun eng kichik birliklardagi butun sonlar bilan ishlang.

## Qaysi nomuvofiqliklarni avtomatik ushlash kerak

- Buyurtma tizimda to‘langan, lekin tranzaksiya yo‘q.
- Tranzaksiya bor, buyurtma esa yo‘q yoki bekor qilingan.
- Tranzaksiya summasi buyurtma summasiga teng emas.
- Tranzaksiya muvaffaqiyatli, lekin kutilgan to‘lovga tushmagan.
- Bankdagi tushum kutilgan to‘lov summasiga mos kelmaydi.
- Shlyuzda qaytarish bor, tizimda esa buyurtma hamon «to‘langan».

Har bir tur uchun **qoida va ruxsat etilgan chetlanish** belgilang. Masalan, yaxlitlash tufayli farq avtomatik yopiladi, buyurtma summasidagi farq esa buxgalterga yuboriladi.

## Istisnolar bilan ishlashni qanday tashkil qilish kerak

- CRM yoki admin panelda nomuvofiqliklar ro‘yxati bilan alohida navbat yoki bo‘lim.
- Har bir istisnoda: tur, bog‘liq yozuvlar, farq summasi, mas’ul shaxs, status.
- Kunlik hisobot: qanchasi solishtirildi, nechta ochiq istisno bor, eng eskilari qaysi.
- Takrorlanadigan holatlarni yangi qoidalarga aylantirish uchun qarorlar tarixi.

## Ko‘p uchraydigan xatolar

- Shlyuzga buyurtma ID’sini uzatmaslik — keyin summa bo‘yicha moslashtirish.
- Summalarni float’da saqlash.
- Faqat buyurtmalarni shlyuz bilan solishtirib, bankni tekshirmaslik.
- Vaqt mintaqalarini e’tiborsiz qoldirish: yarim tunga yaqin tranzaksiya «begona» kunga tushadi.
- Solishtirishni muntazam jarayon emas, bir martalik yuklash sifatida qurish.

## FAQ

### Solishtirishni qanchalik tez-tez ishga tushirish kerak?

Buyurtma va tranzaksiyalarni moslashtirishni har kuni yoki tez-tez qilish qulay, bank bilan solishtirishni esa shlyuz to‘lovlari jadvali bo‘yicha. Eng muhimi — muntazamlik, shunda nomuvofiqliklar hali oson tahlil qilinadigan paytda topiladi.

### Solishtirishni 1C yoki CRM’da qilish mumkinmi?

Ha, agar tizim shlyuz hisobotlari va ko‘chirmalarni yuklab, ularni buyurtmalar bilan bog‘lay olsa. Ko‘pincha moslashtirish logikasi alohida servisga chiqariladi, 1C yoki CRM’ga esa tayyor natija uzatiladi.

### Shlyuzda hisobotlar uchun API bo‘lmasa nima qilish kerak?

Fayl importini avtomatlashtiring: muntazam yuklab olish, jadval bo‘yicha yuklash, format tekshiruvi. Bu API’dan kamroq qulay, lekin baribir qatorlarni qo‘lda solishtirishni yo‘q qiladi.
