---
title: Google umumiy disklari: papkalar tuzilmasi va kirish huquqlari
description: Google umumiy diski Mening diskimdan nimasi bilan farq qiladi, qanday rollar bor, kompaniya papkalarini qanday tuzish va xodim ketganda fayllarni yo‘qotmaslik.
summary: Kompaniyaning ishchi fayllarini xodimlarning Mening diskida emas, umumiy disklarda saqlang: fayllar tashkilotga tegishli, kirish guruhlarga rollar bo‘yicha beriladi va xodim ketganda hech narsa yo‘qolmaydi.
---
## Qisqa javob

**Mening diskim** (My Drive) — xodimning shaxsiy maydoni. Undagi fayl, hatto butun kompaniya foydalansa ham, shu odamga tegishli. **Umumiy disk** (shared drive) esa tashkilotga tegishli: a’zolar almashadi, fayllar qoladi.

Qoida oddiy: aniq bir odam ketganidan keyin ham kompaniyaga kerak bo‘ladigan hamma narsa umumiy diskda turishi kerak.

## Mening diskim va umumiy disk: farqi

| | Mening diskim | Umumiy disk |
|---|---|---|
| Fayllar egasi | Xodim | Tashkilot |
| Xodim ketsa | Akkaunt o‘chirilishidan oldin fayllarni topshirish kerak | Fayllar joyida qoladi |
| Huquqlar | Har bir faylga alohida | Disk a’zolariga beriladi va pastga meros bo‘lib o‘tadi |
| Nima uchun | Qoralamalar va shaxsiy qaydlar | Bo‘lim va loyiha hujjatlari |

## Umumiy diskdagi rollar

Umumiy disk a’zosi beshta roldan biriga ega bo‘ladi:

- **Menejer** — a’zolar va disk sozlamalarini boshqaradi, qolgan hamma narsani ham qila oladi.
- **Kontent-menejer** — fayllarni qo‘shadi, tahrirlaydi, ko‘chiradi va o‘chiradi.
- **Muallif** (Contributor) — fayllarni qo‘shadi va tahrirlaydi, lekin o‘chira olmaydi va ko‘chira olmaydi.
- **Izohlovchi** — o‘qiydi va izoh qoldiradi.
- **O‘quvchi** — faqat ko‘radi.

Muhim: huquqlar **pastga meros bo‘lib o‘tadi** va faqat kengayadi. Ichki papkaga qo‘shimcha odamlarga kirish berish mumkin, lekin diskning o‘z a’zolaridan kirishni olib qo‘yib bo‘lmaydi. Shuning uchun maxfiy ma’lumotlarni umumiy disk ichidagi «yopiq» papkaga emas, alohida diskka joylang.

## Kompaniya uchun tuzilma

Hamma uchun bitta ulkan disk qilmang. **Bir xil kirishga ega har bir guruh uchun bitta disk** qulayroq:

```text
Umumiy disklar
├── 00 Kompaniya       barcha xodimlar: O‘quvchi
├── Sotuv              sotuv bo‘limi: Kontent-menejer
├── Marketing          marketing: Kontent-menejer, sotuv: O‘quvchi
├── Moliya             buxgalteriya va rahbariyat
├── HR                 faqat HR va rahbariyat
└── Alfa loyihasi      loyiha jamoasi, pudratchilar: Muallif
```

Disk ichida tuzilmani sayoz saqlang: ikki-uch daraja papka, tushunarli nomlar, kerak bo‘lsa yil yoki raqam prefikslari.

## Kirishni qanday berish kerak

1. **Huquqlarni odamlarga emas, guruhlarga bering.** Admin console’da sales@ yoki finance@ kabi guruhlar yarating va ularni diskka qo‘shing. Yangi xodim guruhga qo‘shiladi va kerakli kirishni darhol oladi.
2. **Menejerlar kam bo‘lsin.** Bitta diskka odatda ikki kishi yetarli: asosiy va zaxira.
3. **Kontent-menejer rolini o‘ylab bering.** Fayllarni o‘chirish va ko‘chirish — «yo‘qolgan» hujjatlarning asosiy sababi.
4. **Har chorakda a’zolarni tekshiring.** Ishdan ketganlar, ishini tugatgan pudratchilar va tasodifiy mehmonlar tez-tez uchraydi.

## Tashqi kirish

Administrator qoidalarni Admin console’da belgilaydi, disk menejeri esa disk sozlamalarida. Quyidagilarni hal qiling:

- tashkilotdan tashqariga umuman fayl ulashish mumkinmi yoki faqat ishonchli domenlar bilanmi;
- tashqi odamlar umumiy disk a’zosi bo‘la oladimi;
- «Havolasi bor har kim» turidagi havolalarga ruxsat berilganmi.

Pudratchilar uchun **Muallif** rolli alohida loyiha diski qulay: ish tugagach, ularni a’zolikdan olib tashlaysiz, xolos.

## Xodim ketganda fayllarni qanday yo‘qotmaslik

- Ishchi fayllarni Mening diskimdan umumiy diskka xodimning oxirgi ish kunidan **oldin** ko‘chiring.
- Agar nimadir qolib ketsa, administrator Admin console orqali Mening diskim ma’lumotlarini boshqa foydalanuvchiga topshira oladi. Buni **akkauntni o‘chirishdan oldin** qiling: o‘chirilgandan keyin ma’lumotlarni faqat cheklangan vaqt ichida tiklash mumkin.
- Akkauntni darhol o‘chirmang: avval kirishni bloklang, fayllar va pochtani topshiring, keyin o‘chiring.

## Keng tarqalgan xatolar

- Shartnomalar va hisobotlarni rahbarning shaxsiy Mening diskimda saqlash.
- Alohida disk yaratish o‘rniga umumiy disk ichidagi papkani yopishga urinish.
- Hammaga «har ehtimolga qarshi» Menejer rolini berish.
- Shaxsiy ma’lumotlar bor hujjatlarda «Havolasi bor har kim» kirishini qoldirish.

## FAQ

### Mening diskimdagi papkani umumiy diskka ko‘chirsa bo‘ladimi?

Ha, uni sudrab o‘tkazing yoki «Ko‘chirish» buyrug‘idan foydalaning. Buning uchun maqsadli diskda fayl qo‘shish huquqi kerak, administrator esa boshqa odamlarga tegishli fayllarni ko‘chirishni cheklashi mumkin.

### Umumiy diskda o‘chirilgan fayllar bilan nima bo‘ladi?

Ular shu diskning savatiga tushadi va mos rolga ega a’zo ularni tiklay oladi. Ma’lum vaqtdan so‘ng fayllar butunlay o‘chiriladi, shuning uchun tiklashni kechiktirmang.

### Nechta umumiy disk yaratish kerak?

Kirishi har xil bo‘lgan guruhlaringiz qancha bo‘lsa, shuncha. Agar ikki papkada odamlar va huquqlar bir xil bo‘lsa, ular bitta diskda turishi kerak.
