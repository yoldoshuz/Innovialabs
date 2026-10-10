---
title: Vayrfreym, maket va prototip: asosiy farqlar
description: Vayrfreym, maket va prototip detallashtirish darajasi, maqsadi va loyiha bosqichi bilan farqlanadi. Taqqoslash, misollar va qaysi birini qachon qilish kerak.
summary: Vayrfreym — ekran tuzilmasining kulrang sxemasi, maket (mokap) — o‘sha ekranning yakuniy vizual ko‘rinishi, prototip esa mahsulot ishlashini taqlid qiluvchi bosiladigan versiya. Ular turli savollarga javob beradi: nima qayerda turadi, qanday ko‘rinadi va o‘zini qanday tutadi.
---
## Qisqa javob

- **Vayrfreym** — past detallashtirilgan sxema: bloklar, o‘rinbosarlar va qoralama matn. U «**ekranda nima bor va qanday tartibda?**» degan savolga javob beradi.
- **Maket (mokap)** — haqiqiy ranglar, shriftlar, rasmlar va matnlar bilan statik batafsil ekran. U «**bu qanday ko‘rinadi?**» degan savolga javob beradi.
- **Prototip** — bosish, ekranlar orasida o‘tish va animatsiyalarni ko‘rish mumkin bo‘lgan interaktiv model. U «**bu qanday ishlaydi?**» degan savolga javob beradi.

Bular raqobatdosh variantlar emas, odatda bitta jarayonning qadamlari: avval tuzilma, keyin vizual, so‘ng xatti-harakat.

## Har biri qanday ko‘rinadi

Mahsulot sahifasining vayrfreymi shunchaki shunday bo‘lishi mumkin:

```text
+--------------------------------------+
| [logo]           [menyu]  [savatcha] |
+--------------------------------------+
| [   rasm    ]   Mahsulot nomi        |
| [           ]   Narx                 |
| [           ]   [ Savatchaga ]       |
+--------------------------------------+
| Tavsif matn matn matn matn           |
| Sharhlar --------------------------- |
+--------------------------------------+
```

Rang yo‘q, haqiqiy rasm yo‘q, brend yo‘q. Asosiysi — joylashuv va ustuvorlik.

O‘sha sahifaning **maketi** yakuniy palitra va tipografikadan, mahsulotning haqiqiy rasmidan, haqiqiy narxlar va tugma yozuvlaridan, ikonlar va to‘r bo‘yicha bo‘shliqlardan foydalanadi. U tayyor mahsulot skrinshotiga o‘xshaydi, lekin hech narsa ishlamaydi.

**Prototip** bu maketni boshqa ekranlar bilan bog‘laydi: «Savatchaga» bosilganda savatcha ochiladi, menyu chiqadi, galereya varaqlanadi. Agar faqat ssenariyni tekshirish kerak bo‘lsa, prototipni vayrfreymlardan ham yig‘ish mumkin.

## Taqqoslash jadvali

| | Vayrfreym | Maket | Prototip |
|---|---|---|---|
| Detallashtirish | Past | Yuqori (vizual) | Pastdan yuqorigacha (interaktiv) |
| Asosiy maqsad | Tuzilma, kontent ustuvorligi, ssenariy | Vizual uslub, brend, detallar | Xatti-harakat, o‘tishlar, foydalanuvchilar bilan testlash |
| Interaktivlik | Yo‘q yoki minimal | Yo‘q | Bosiladigan |
| Tayyorlash vaqti | Tez | Uzoqroq | Chuqurligiga bog‘liq |
| Odatiy vositalar | Qog‘oz, doska, Figma, Balsamiq | Figma, Sketch, Adobe XD | Figma’da prototiplash, ProtoPie, Framer, kod |
| Loyiha bosqichi | Tadqiqot, erta UX | Tuzilma kelishilgandan keyin | Ishlab chiqishdan oldin, testlar va namoyishlar uchun |
| Kim ko‘rib chiqadi | Jamoa, buyurtmachi | Buyurtmachi, brend egalari, dasturchilar | Foydalanuvchilar, buyurtmachi, dasturchilar |

## Qaysi birini qachon qilish kerak

**Vayrfreym qiling, agar:**

- sahifaga qaysi bloklar va qanday tartibda kerakligini hal qilayotgan bo‘lsangiz;
- jamoa ranglar haqida emas, mazmun haqida bahslashayotgan bo‘lsa;
- did muhokamasisiz tezkor fikr-mulohaza kerak bo‘lsa.

**Maket qiling, agar:**

- tuzilma kelishilgan va brend uslubi aniqlangan bo‘lsa;
- dasturchilarga aniq o‘lchamlar, ranglar va holatlar kerak bo‘lsa;
- buyurtmachi vizual yo‘nalishni tasdiqlashi kerak bo‘lsa.

**Prototip qiling, agar:**

- kod yozishdan oldin yuzabiliti-test o‘tkazish kerak bo‘lsa;
- ssenariy bir necha qadamdan iborat bo‘lsa (buyurtma rasmiylashtirish, onbording, bron qilish) va uni boshidan oxirigacha tekshirish kerak bo‘lsa;
- o‘zaro ta’sirlar nostandart va ularni so‘z bilan tasvirlash qiyin bo‘lsa;
- g‘oyani investorlar yoki rahbariyatga ishonarli ko‘rsatish kerak bo‘lsa.

## Amaliy maslahatlar

- **Vayrfreymlarni kulrang saqlang.** Erta qo‘shilgan rang muhokamani did masalasiga olib ketadi.
- **Haqiqiy kontentni iloji boricha erta ishlating.** O‘rinbosar matn uzun nomlar, narxlar va tarjimalar bilan bog‘liq muammolarni yashiradi.
- **Hamma narsani prototiplamang.** Faqat testlanayotgan ssenariy ekranlarini bog‘lang.
- **Maketlarda barcha holatlarni chizing:** bo‘sh, yuklanish, xato, uzun matn, ruxsat yo‘q.
- **Versiyalarni aniq nomlang**, shunda jamoa qaysi fayl tasdiqlanganini biladi.

## Ko‘p uchraydigan xatolar

- Vayrfreymni buyurtmachiga u ataylab uslubsiz ekanini tushuntirmasdan ko‘rsatish.
- Murakkab ekranlarda vayrfreymlarni o‘tkazib yuborish va tayyor maketlarni bir necha marta qayta chizish.
- Prototipni tayyor mahsulot deb qabul qilish va «deyarli hammasi tayyor» deb va’da berish.
- Faqat navigatsiyani tekshirish uchun batafsil prototip qilish, holbuki kulrangi yetarli edi.

## FAQ

### Vayrfreymlarni o‘tkazib yuborib, darhol maket qilsa bo‘ladimi?

Tayyor dizayn-tizimdagi kichik sahifa uchun — ha. Yangi mahsulot yoki murakkab ekranlar uchun tuzilmani o‘tkazib yuborish odatda tayyor vizualni qayta qilishni anglatadi.

### Prototip MVP bilan bir xilmi?

Yo‘q. Prototip mahsulotni taqlid qiladi, odatda haqiqiy ma’lumotlar va backend’siz. MVP — haqiqiy odamlar foydalanadigan minimal funksionallikka ega ishlaydigan mahsulot.

### Hammasini bitta vositada qilish mumkinmi?

Ha. Zamonaviy interfeys dizayni vositalari bitta faylda vayrfreymlar chizish, ularni maketga aylantirish va ekranlarni prototipga bog‘lash imkonini beradi. Alohida vositalar asosan murakkab animatsiya yoki kodga asoslangan prototiplar uchun kerak.
