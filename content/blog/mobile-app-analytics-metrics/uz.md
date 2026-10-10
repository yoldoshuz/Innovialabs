---
title: Mobil ilova metrikalari: retention, DAU/MAU, LTV va churn
description: Retention, DAU/MAU, LTV va churn nima, ular qanday hisoblanadi, nima bilan solishtiriladi va mobil ilova o‘sishining har bosqichida qaysi metrikalar muhim.
summary: Yosh ilovaning asosiy metrikasi — retention: odamlar bir kun, bir hafta va bir oydan keyin qaytadimi; DAU/MAU odat kuchini, churn ketayotganlarni, LTV esa foydalanuvchidan butun davr davomida keladigan daromadni ko‘rsatadi va uni retention barqarorlashgandan keyin hisoblash mantiqli.
---

## Qisqacha: hal qiluvchi to‘rt metrika

O‘rnatishlar va ro‘yxatdan o‘tishlar hisobotda chiroyli ko‘rinadi, lekin mahsulot sog‘lig‘i haqida deyarli hech narsa aytmaydi. Haqiqiy manzarani to‘rt ko‘rsatkich beradi:

- **Retention (ushlab qolish)** — yangi foydalanuvchilarning qancha qismi N kundan keyin qaytadi.
- **DAU/MAU (stickiness)** — odamlar oy davomida ilovadan qanchalik tez-tez foydalanadi.
- **Churn (ketish)** — davr ichida foydalanuvchilar yoki obunachilarning qancha qismi ketadi.
- **LTV (lifetime value)** — bitta foydalanuvchi ilovadan foydalangan butun davrda o‘rtacha qancha pul olib keladi.

Retention yomon bo‘lsa, qolgan metrikalarni optimallashtirishdan foyda yo‘q: teshik chelakka suv quyayotgan bo‘lasiz.

## Qanday hisoblanadi

| Metrika | Formula | Nimani ko‘rsatadi |
|---|---|---|
| Retention Day N | N-kunda qaytganlar / 0-kunda o‘rnatganlar | Mahsulotning yangi foydalanuvchilar uchun qiymati |
| DAU/MAU | oy bo‘yicha o‘rtacha DAU / MAU | Foydalanish chastotasi, odat kuchi |
| Churn | davrda ketganlar / davr boshidagi faollar | Auditoriyani yo‘qotish tezligi |
| LTV | davr uchun ARPU × foydalanuvchining o‘rtacha umri | Jalb qilishga sarflash mumkin bo‘lgan chegara |

Bir nechta muhim aniqlik:

- **Retention kogortalar bo‘yicha hisoblanadi** — bir kun yoki bir haftada kelgan foydalanuvchilar guruhlari. Butun baza bo‘yicha o‘rtacha retention eski sodiq va yangi tasodifiy foydalanuvchilarni aralashtirib yuboradi va hech narsa ko‘rsatmaydi.
- Klassik nuqtalar — **D1, D7, D30**. Kam ishlatiladigan ilovalar (sayohat, ko‘chmas mulk) uchun haftalik yoki oylik retention qulayroq.
- Obuna uchun **soddalashtirilgan LTV formulasi**: oylik ARPU / oylik churn. U taxminiy, lekin birinchi baho uchun yetarli.
- **ARPU** — davr uchun bir foydalanuvchiga o‘rtacha daromad: tushum / faol foydalanuvchilar soni.

## Nimani me’yor deb hisoblash kerak

Universal me’yorlar yo‘q: hammasi kategoriyaga va ilova hal qiladigan vazifa odamlarga qanchalik tez-tez kerakligiga bog‘liq.

- **Messenjerlar, ijtimoiy tarmoqlar, o‘yinlar** — har kunlik foydalanish kutiladi, shuning uchun yuqori DAU/MAU va kuchli D1 muhim.
- **Banking, yetkazib berish, taksi** — haftada yoki oyda bir necha marta ishlatiladi; bu yerda past DAU/MAU normal holat.
- **Sayohat, uy-joy xaridi, tadbir servislari** — foydalanish epizodik, oylik retention va takroriy xaridlarga qarang.

O‘zingizni shu kategoriyadagi ilovalar bilan va eng muhimi — o‘zingizning oldingi kogortalaringiz bilan solishtiring. Sog‘liqning eng muhim belgisi — **retention egri chizig‘i platoga chiqadi**: birinchi haftalardan keyin qolganlar ulushi kamayishdan to‘xtaydi. Agar egri chiziq nolga intilsa, mahsulot hali o‘z asosiy auditoriyasini topmagan.

## Har bir bosqichda qaysi metrikalarga qarash kerak

**MVP va product-market fit izlash:**
- kogortalar bo‘yicha retention va egri chiziq shakli;
- **aktivatsiya** — asosiy harakatni bajargan foydalanuvchilar ulushi (birinchi buyurtma, birinchi xabar);
- sifatiy fikr-mulohaza: intervyular, do‘kondagi sharhlar.

**O‘sish:**
- DAU/MAU va sessiyalar chastotasi;
- o‘rnatishdan birinchi to‘lovgacha bo‘lgan voronka;
- reklama kanallari bo‘yicha retention va jalb qilish narxi (**CAC**);
- LTV va CAC nisbati.

**Yetuk mahsulot:**
- obunachilar churn’i va bekor qilish sabablari;
- LTV, ARPU, ushlab qolingan kogortalardan tushum;
- texnik metrikalar: nosozliksiz sessiyalar ulushi (**crash-free**), ishga tushish tezligi.

## Ma’lumot yig‘ishni qanday sozlash kerak

1. **Hodisalar rejasini (tracking plan) tuzing**: o‘rnatish, ro‘yxatdan o‘tish, asosiy harakat, xarid, obunani bekor qilish. Har bir hodisa uchun nom va parametrlar.
2. **iOS va Android’da bir xil hodisa nomlaridan foydalaning**, aks holda hisobotlar mos kelmaydi.
3. **Bitta vosita tanlang**: Google Analytics for Firebase, AppMetrica, Amplitude yoki Mixpanel. Boshlash uchun bittasi yetarli.
4. **To‘lov ma’lumotlarini ulang** — do‘kon yoki o‘z billingingizdan, shunda ARPU va LTV haqiqiy tushum bo‘yicha hisoblanadi.
5. **Maxfiylikni hisobga oling**: iOS’da ilovalar o‘rtasida kuzatish foydalanuvchi roziligini talab qiladi (App Tracking Transparency), maxfiylik siyosatida esa qanday ma’lumot yig‘ishingizni yozish kerak.

## Ko‘p uchraydigan xatolar

- Retention’ga qaramay, o‘rnatishlar o‘sishidan xursand bo‘lish.
- Kogortalar o‘rniga butun baza bo‘yicha o‘rtacha retention’ni hisoblash.
- Mahsulot hayotining birinchi oyida, ma’lumot juda kam bo‘lganda LTV hisoblash.
- Ish davomida «faol foydalanuvchi» ta’rifini o‘zgartirib, solishtirib bo‘lmaydigan raqamlarni solishtirish.
- Hech kim qaramaydigan yuzlab hodisalarni yig‘ib, bitta asosiysini yig‘maslik.

## FAQ

### Boshida nima muhimroq: DAU yoki retention?

Retention. DAU’ni reklama bilan vaqtincha ko‘tarish mumkin, retention esa mahsulot odamlarga kerakmi-yo‘qmi, shuni ko‘rsatadi. Retention egri chizig‘i platoga chiqmaguncha, jalb qilishni kengaytirish erta.

### Churn retention’dan nimasi bilan farq qiladi?

Bular bitta jarayonning ikki tomoni. Retention kogortaning qancha qismi ma’lum kunga qadar qolganini, churn esa faol auditoriyaning qancha qismi davr ichida ketganini ko‘rsatadi. Retention yangi foydalanuvchilar uchun, churn esa obunalar va yetuk baza uchun qulayroq.

### LTV’ni qanchalik tez-tez qayta hisoblash kerak?

Odatda oyiga bir marta yoki narx va mahsulotdagi katta o‘zgarishlardan keyin. Dastlabki LTV baholarini prognoz deb qabul qiling va kogortalar bo‘yicha ma’lumot to‘planishi bilan aniqlashtiring.
