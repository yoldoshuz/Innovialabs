---
title: Email avtomatlashtirish: sotadigan trigger xatlar va zanjirlar
description: Qanday avtomatik email zanjirlari kerak: salomlashuv, tashlab ketilgan savat, reaktivatsiya va xariddan keyingi xatlar — triggerlar, vaqt va metrikalar.
summary: To‘rtta asosiy zanjir — salomlashuv, tashlab ketilgan savat, xariddan keyin va reaktivatsiya — kalendar bo‘yicha emas, odamning harakati bilan ishga tushadi, shuning uchun qiziqish paytida yetib boradi; har birini ochilishlar bo‘yicha emas, o‘z maqsadli metrikasi bo‘yicha baholang.
---
## Qisqa javob

**Trigger xat** odamning harakati yoki harakatsizligiga javoban avtomatik yuboriladi: obuna bo‘ldi, savatni tashlab ketdi, sotib oldi, g‘oyib bo‘ldi. **Zanjir** — pauza va shartlar bilan bir nechta shunday xat.

To‘rtta zanjirdan boshlang:

| Zanjir | Trigger | Maqsad |
|---|---|---|
| Salomlashuv | Obuna yoki ro‘yxatdan o‘tish | Tanishtirish va birinchi maqsadli harakatgacha olib borish |
| Tashlab ketilgan savat | Savatda mahsulot bor, xarid yo‘q | Rasmiylashtirishga qaytarish |
| Xariddan keyin | To‘langan buyurtma | Xavotirni kamaytirish, sharh va takroriy xarid olish |
| Reaktivatsiya | Uzoq vaqt ochilish, bosish yoki xarid yo‘q | Qiziqishni qaytarish yoki bazadan ehtiyotkorlik bilan chiqarish |

## Ishga tushirish uchun nima kerak

- **Avtomatlashtirishli rassilka servisi**: triggerlar, kechikishlar, shartlar, zanjirdan chiqish.
- Sayt yoki CRM’dan **hodisalarni uzatish**: ro‘yxatdan o‘tish, savat, buyurtma. Odatda CMS yoki do‘kon bilan tayyor integratsiya, yoki API va vebxuklar orqali.
- **Chiqish shartlari**: odam sotib olsa, savat haqidagi zanjir darhol to‘xtashi kerak.
- **Rassilkaga rozilik**: buyurtma haqidagi tranzaksion xatlar bir narsa, marketing eslatmalari esa boshqa — ular uchun obuna kerak.

## Salomlashuv zanjiri

Obunadan so‘ng darhol ishga tushadi. Tuzilma namunasi:

1. **Darhol** — minnatdorlik, va’da qilingan material, keyin nima bo‘lishi.
2. **Bir-ikki kundan keyin** — mahsulotning asosiy foydasi yoki eng yaxshi kontent.
3. **Yana bir necha kundan so‘ng** — ijtimoiy isbot: sharhlar, foydalanish misollari.
4. **Keyin** — yumshoq taklif yoki birinchi harakatga taklif.

**Metrikalar**: birinchi maqsadli harakatgacha (xarid, ariza, faollashtirish) yetganlar ulushi, xatlardagi bosishlar, har bir qadamdagi obunadan chiqishlar.

## Tashlab ketilgan savat

Foydasi eng aniq ko‘rinadigan zanjir, lekin bu yerda haddan oshirish oson.

1. **Bir necha soatdan keyin** — mahsulot, rasm va savatga qaytish tugmasi bilan eslatma.
2. **Bir kundan so‘ng** — shubhalarga javoblar: yetkazib berish, qaytarish, to‘lov usullari, sharhlar.
3. **Yana keyinroq** — agar tayyor bo‘lsangiz, rag‘bat: bepul yetkazib berish yoki sovg‘a. Har bir zanjirda chegirma bermang, aks holda mijozlar savatni ataylab tashlab ketishni o‘rganib oladi.

Ishga tushirish uchun sayt odamning manzilini bilishi kerak — demak, u akkauntga kirgan yoki rasmiylashtirish bosqichida email kiritgan.

**Metrikalar**: tiklangan savatlar ulushi, zanjirdan tushgan tushum, obunadan chiqishlar va shikoyatlar.

## Xariddan keyin

Xaridor sizga allaqachon ishongan — munosabat qurish uchun eng yaxshi payt.

1. **Darhol** — muddatlari tushunarli bo‘lgan buyurtma tasdig‘i (tranzaksion xat).
2. **Qabul qilingandan keyin** — yo‘riqnoma, foydalanish bo‘yicha maslahatlar, qo‘llab-quvvatlash kontaktlari.
3. **Biroz vaqt o‘tgach** — sharh qoldirish iltimosi.
4. **Mahsulotingiz sikliga qarab** — qo‘shimcha mahsulotlar yoki zaxirani to‘ldirish eslatmasi.

**Metrikalar**: sharhlar soni, takroriy xaridlar ulushi, qo‘llab-quvvatlashga murojaatlar (yaxshi yo‘riqnoma ularni kamaytiradi).

## Reaktivatsiya

Odam uzoq vaqt xatlarni ochmasa va bosmasa yoki ancha vaqtdan beri hech narsa sotib olmagan bo‘lsa ishga tushadi. Chegarani o‘z siklingizga qarab belgilang: kundalik mahsulot uchun qisqaroq, kam xarid qilinadigani uchun uzunroq.

1. «Ancha vaqt ko‘rishmadik» — nima yangilik, davr ichidagi eng yaxshilari.
2. Qaytish uchun sabab: to‘plam, foydali material, taklif.
3. To‘g‘ridan-to‘g‘ri savol: «Rassilkada qolasizmi?» — «Ha» va «Obunadan chiqish» tugmalari bilan.

Javob bermaganlarni muntazam rassilkadan chiqaring — bu yetkazib berishni himoya qiladi.

**Metrikalar**: faollikka qaytganlar ulushi, obunadan chiqishlar (bu yerda ular normal va hatto foydali).

## Zanjirlarni qanday baholash kerak

- Har bir zanjirni ochilishlar bo‘yicha emas, **o‘z maqsadli metrikasi** bo‘yicha baholang: ochilishlar pochta ilovalarining maxfiylik himoyasi tufayli buziladi.
- Tushumni analitikada ko‘rish uchun havolalarni **UTM-teglar** bilan belgilang.
- Zanjir yuborilmaydigan **nazorat guruhi** bilan solishtiring: shunda xatlarsiz ham bo‘ladigan xaridlar emas, haqiqiy o‘sish ko‘rinadi.
- Bir vaqtda bitta narsani o‘zgartiring: vaqt, mavzu, taklif.

## Ko‘p uchraydigan xatolar

- Chiqish sharti yo‘q: mijoz sotib oldi, savat haqidagi xatlar esa kelishda davom etadi.
- Bir nechta zanjir bir vaqtda bitta odamga hujum qiladi.
- Zanjir sozlanib, unutilgan: havolalar ishlamaydi, mahsulotlar sotuvdan olingan.

## FAQ

### Resurs kam bo‘lsa, qaysi zanjirdan boshlash kerak?

Salomlashuv zanjiridan: uni har bir yangi obunachi oladi. Internet-do‘kon uchun ikkinchi navbatda — tashlab ketilgan savat.

### Zanjirda nechta xat bo‘lishi kerak?

Maqsad uchun qancha kerak bo‘lsa, shuncha, ortiq emas. Ikki-uchta xatdan boshlang va obunadan chiqishlarni kuzating: agar oxirgi qadamda ular keskin oshsa, bu qadam ortiqcha.

### Tashlab ketilgan savat xatida chegirma kerakmi?

Shart emas. Ko‘pincha eslatma va shubhalarga javoblar yetarli. Rag‘bat ishlatsangiz, uni oxirgi xatga qo‘ying va o‘sishni test bilan tekshiring.
