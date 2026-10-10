---
title: Mijozlar bazasini Excel dan CRM ga qanday ko‘chirish mumkin
description: Mijozlarni Excel dan CRM ga ko‘chirish rejasi: audit, dublikatlarni tozalash, maydonlarni moslash, sinov importi, tekshiruv va bitimlar tarixini saqlash.
summary: Avval barcha jadvallarni yig‘ib tekshiring, dublikatlarni o‘chirib ma’lumotlarni yagona formatga keltiring, ustunlarni CRM maydonlari bilan moslang, kichik namunada sinov importini qiling, natijani tekshiring va shundan keyingina butun bazani bitimlar tarixi bilan birga ko‘chiring.
---
## Qisqa javob

Bazani Excel dan CRM ga ko‘chirish — «faylni yuklash» emas, balki olti qadamdan iborat kichik loyiha:

1. **Audit** — barcha manbalarni topish va ularda nima borligini tushunish.
2. **Tozalash** — dublikatlarni olib tashlash va formatlarni bir xil qilish.
3. **Maydonlarni moslash** — qaysi ustun qayerga tushishini hal qilish.
4. **Sinov importi** — kichik qismini yuklab, natijaga qarash.
5. **Tekshiruv** — son, bog‘lanishlar va tanlangan yozuvlarni solishtirish.
6. **To‘liq ko‘chirish va o‘tish** — hammasini yuklash va eski jadvallarni yopish.

## 1-qadam. Ma’lumotlar auditi

**Barcha** manbalarni yig‘ing: umumiy jadvallar, menejerlarning shaxsiy fayllari, buxgalteriya va internet-do‘kondan eksportlar. Har bir fayl uchun aniqlang:

- qaysi ustunlar bor va ular qanchalik to‘ldirilgan;
- bitta qator nimani anglatadi — mijoz, kompaniya yoki xarid;
- qaysi ma’lumotlar eskirgan va ularni ko‘chirish shart emas;
- fayl egasi kim va savollarga kim javob bera oladi.

Shu qadamda **nimani ko‘chirmasligingizni** hal qiling. Bo‘sh kontaktlar, ancha eskirgan yozuvlar va xizmat belgilarini arxivda qoldirgan ma’qul.

## 2-qadam. Tozalash va dublikatlar

- **Telefonlar** — mamlakat kodi bilan yagona formatga: `+998901234567`. Ustunni matn sifatida saqlang, aks holda Excel boshidagi belgilarni kesib tashlashi yoki uzun sonni eksponensial ko‘rinishda ko‘rsatishi mumkin.
- **Email** — kichik harflarda, bo‘sh joylarsiz.
- **F.I.Sh.** — agar CRM ism va familiyani alohida saqlasa, alohida ustunlarga ajrating.
- **Dublikatlar** — ism bo‘yicha emas, telefon va email bo‘yicha qidiring. Birlashtirishda qaysi yozuv asosiy ekanini va ikkinchisidan qaysi maydonlarni saqlash kerakligini hal qiling.
- **Ma’lumotnoma qiymatlari** (shahar, manba, holat) — bir xil yozilishga keltiring: «Toshkent», «Toshkent sh.» va «Tashkent» bitta qiymatga aylanishi kerak.

## 3-qadam. Maydonlarni moslash

Importdan oldin moslik jadvalini tuzing:

| Excel dagi ustun | CRM ob’ekti | CRM maydoni | Izoh |
|---|---|---|---|
| Kompaniya | Kompaniya | Nomi | |
| Aloqa shaxsi | Kontakt | Ism, Familiya | ajratish |
| Telefon | Kontakt | Telefon | normallashtirish |
| Holat | Bitim | Bosqich | voronka bosqichlari bilan moslash |
| Menejer | Bitim | Mas’ul | foydalanuvchi CRM da mavjud bo‘lishi kerak |
| Birinchi murojaat sanasi | Kontakt | Foydalanuvchi maydoni | asl sana |

Fayldagi ro‘yxat qiymatlari CRM dagi qiymatlar bilan **aynan mos kelishi** kerak, aks holda maydon bo‘sh qoladi yoki import xato beradi.

Agar sizda kompaniyalar, kontaktlar va bitimlar bo‘lsa, **alohida fayllar** tayyorlang va ularni tartib bilan yuklang: kompaniyalar → kontaktlar → bitimlar. Fayllar orasida yozuvlarni bog‘lash va kerak bo‘lsa asl qatorni topish uchun Excel dan tashqi identifikator ustunini qo‘shing.

## 4-qadam. Sinov importi

- Kirill va o‘zbek belgilari yo‘qolmasligi uchun faylni **CSV UTF-8** formatida saqlang. CRM qaysi ajratuvchini kutishini tekshiring.
- «Qiyin» qatorlarni ham o‘z ichiga olgan kichik namunani yuklang: bir nechta telefonli, email siz, uzun izohli.
- Agar CRM da import paytida dublikat tekshiruvi bo‘lsa — uni yoqing.

## 5-qadam. Tekshiruv

- CRM dagi yozuvlar soni tozalashdan keyingi qatorlar soniga teng.
- Kontaktlar kompaniyalarga, bitimlar kontaktlarga bog‘langan.
- Har bir yozuvning mas’uli bor.
- Tanlab yozuvlarni oching va Excel bilan solishtiring.
- Filtrlar va hisobotlar ko‘chirilgan maydonlar bo‘yicha ishlaydi.

Biror narsa noto‘g‘ri bo‘lsa — sinov yozuvlarini o‘chiring, faylni tuzating va takrorlang.

## Bitimlar va kontaktlar tarixini saqlash

Odatda CRM yozuv yaratilgan sana sifatida import sanasini qo‘yadi. Tarixni yo‘qotmaslik uchun:

- asl sanalarni **alohida maydonlarda** saqlang («Birinchi murojaat sanasi», «Bitim sanasi»);
- o‘tgan xaridlarni summa va «Muvaffaqiyatli» yoki «Yutqazildi» bosqichi bilan **yopilgan bitimlar** sifatida yuklang;
- izoh va qaydlarni maydonga yoki, CRM izohlarni import qilishni qo‘llab-quvvatlasa, yozuv lentasiga ko‘chiring;
- asl fayllarni faqat o‘qish uchun arxivda saqlang.

## CRM ga o‘tish

Sanani belgilang: shundan keyin yangi ma’lumotlar **faqat CRM ga** kiritiladi. Jadvallarni faqat o‘qish rejimiga o‘tkazing, tayyorgarlik davridagi o‘zgarishlarni esa alohida yakuniy import bilan yuklang.

## FAQ

### Excel faylini o‘z holicha yuklab qo‘ysa bo‘ladimi?

Texnik jihatdan ko‘pincha mumkin, lekin dublikatlar, bo‘sh maydonlar va bog‘lanmagan yozuvlar paydo bo‘ladi. Ma’lumotlarni importdan oldin tozalash keyin tozalashdan ancha oson.

### CRM da maydoni yo‘q ma’lumotlar bilan nima qilish kerak?

Avval ular ish yoki hisobot uchun kerakmi, hal qiling. Kerak bo‘lsa — foydalanuvchi maydonini yarating. Kerak bo‘lmasa — izohga o‘tkazing yoki arxivda qoldiring.

### Ko‘chirish vaqtida sotuvni to‘xtatish kerakmi?

Yo‘q. Importni kundalik ish bilan parallel tayyorlang va tekshiring, o‘tish kuni esa shu vaqt ichida to‘plangan o‘zgarishlarni yuklab, jadvallarni tahrirlash uchun yoping.
