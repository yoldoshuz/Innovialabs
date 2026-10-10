---
title: Yangi boshlovchilar uchun Figma: interfeys va birinchi maket
description: Figma noldan: freymlar, qatlamlar, shakllar, matn, constraints va birgalikda ishlash. Oxirida oddiy mobil ekranni bosqichma-bosqich yig‘amiz.
summary: Figma — brauzerda ishlaydigan interfeys muharriri, unda hamma narsa freym, shakl va matndan quriladi; ularni, qatlamlarni, constraints va Share tugmasini o‘rgansangiz, birinchi mobil ekraningizni bir oqshomda yig‘a olasiz.
---

## Qisqacha: Figma nima

**Figma** — interfeyslarni loyihalash uchun muharrir: saytlar, ilovalar, taqdimotlar. U brauzerda va kompyuter ilovasida ishlaydi, fayllar bulutda saqlanadi, bitta maket ustida bir vaqtda bir necha kishi ishlay oladi.

Boshlash uchun ro‘yxatdan o‘tish, yangi **Design file** yaratish va bir nechta asosiy tushunchani o‘zlashtirish kifoya. Quyida birinchi maket uchun kerak bo‘lgan hamma narsa.

## Bir daqiqada interfeys

- **Kanvas (canvas)** — markazdagi cheksiz maydon, siz unda chizasiz.
- **Asboblar paneli** — freym, shakllar, pero, matn, izohlar.
- **Chap panel** — fayl sahifalari va qatlamlar daraxti.
- **O‘ng panel** — tanlangan obyekt xususiyatlari: o‘lcham, rang, shrift, oraliqlar. **Prototype** yorlig‘i ekranlar orasidagi o‘tishlarga javob beradi.

Kanvas bo‘ylab probel tugmasini bosib turgan holda harakatlanish, Ctrl (Mac’da Cmd) va sichqoncha g‘ildiragi bilan masshtabni o‘zgartirish qulay.

## Freymlar: hamma narsaning asosi

**Freym (Frame)** — konteyner, odatda ekran yoki interfeys bloki. Asbob **F** tugmasi bilan chaqiriladi. Shundan so‘ng o‘ng panelda tayyor o‘lchamlar ro‘yxati chiqadi: telefonlar, planshetlar, desktop.

Freym to‘rtburchakdan nimasi bilan farq qiladi:

- freym ichiga boshqa obyektlarni joylashtirish mumkin;
- freymda ichki elementlar uchun **constraints**, **to‘rlar** va **auto layout** bor;
- freym ichidagi kontentni o‘z chegaralari bo‘yicha kesib ko‘rsatishi mumkin.

Freymlarni bir-birining ichiga joylash mumkin: ekran → kartochka → tugma.

## Qatlamlar va guruhlar

Har bir obyekt — chap paneldagi **qatlam**. Qatlamlar tartibi nima ustda turishini belgilaydi.

- **Ctrl/Cmd + G** — tanlanganlarni guruhlash.
- **Ctrl/Cmd + Alt + G** — tanlanganlarni freymga o‘rash.
- Qatlam nomiga ikki marta bosish — nomini o‘zgartirish.

Qatlamlarga «Rectangle 47» deb qoldirmasdan, ma’noli nom bering («header», «button-primary»). Bu sizning ham, dasturchining ham vaqtini tejaydi.

## Shakllar va matn

- **R** — to‘rtburchak, **O** — ellips, **L** — chiziq, **P** — erkin konturlar uchun pero.
- **T** — matn. Bosish bitta qator yaratadi, cho‘zish esa qat’iy kenglikdagi matn blokini yaratadi.

O‘ng panelda to‘ldirish (**Fill**), chegara (**Stroke**), burchak yumaloqligi, soya va xiralik (**Effects**) sozlanadi. Matn uchun — shrift, o‘lcham, qatorlar oralig‘i va tekislash.

Takrorlanadigan rang va shriftlarni **uslub** (style) yoki **o‘zgaruvchi** (variable) sifatida saqlang, keyin ularni bir joyda o‘zgartirasiz.

## Constraints: o‘lcham o‘zgarganda elementlar o‘zini qanday tutadi

**Constraints** obyekt ota freymning qaysi tomoniga «bog‘langanini» belgilaydi. Masalan:

- ekran pastidagi **Bottom** bog‘lamali tugma ekran balandlashganda ham pastki chetda qoladi;
- **Left & Right** bog‘lamali sarlavha qismi ekran kengayganda butun kenglik bo‘ylab cho‘ziladi.

Tekshirish oson: freymni tanlang va chetidan torting — elementlar o‘zini qanday tutishini ko‘rasiz.

## Birgalikda ishlash va Share

O‘ng yuqori burchakdagi **Share** tugmasi faylga kirish huquqini ochadi. Odamni email orqali taklif qilish yoki havolani nusxalab, huquqni tanlash mumkin: **ko‘rish** yoki **tahrirlash**. Hamkasblar to‘g‘ridan-to‘g‘ri kanvasda izoh qoldiradi (**C** tugmasi), dasturchilar esa o‘lcham va oraliqlarni ko‘rib chiqishi mumkin.

## Amaliyot: birinchi mobil ekran

Oddiy kirish ekranini yig‘amiz.

1. **F** ni bosing va o‘ng panelda telefon o‘lchamini tanlang, masalan 390 × 844. Freym nomini «Login» deb o‘zgartiring.
2. **T** ni bosing va «Kirish» sarlavhasini yozing. Shrift o‘lchamini katta va qalin qiling.
3. Kiritish maydoni uchun to‘rtburchak (**R**) chizing: deyarli butun ekran kengligida, balandligi taxminan 48, yumaloqligi 8, och kulrang chegara bilan. Ichiga «Email» yordamchi matnini qo‘shing.
4. Maydondan nusxa oling (**Ctrl/Cmd + D**) va yordamchi matnni «Parol»ga almashtiring.
5. Tugma yasang: o‘sha kenglikdagi yorqin to‘rtburchak va markazda oq «Kirish» matni. Ikkala qatlamni tanlab **Shift + A** ni bosing — matnga moslashadigan **auto layout** tugmasi hosil bo‘ladi.
6. Elementlarni chap chet bo‘yicha tekislang va ular orasidagi masofani bir xil qiling — sudrash paytida pushti yordamchi chiziqlar yordam beradi.
7. Constraints qo‘ying: sarlavha va maydonlarga — **Left & Right**, tugmani pastga yopishtirmoqchi bo‘lsangiz — **Left & Right** va **Bottom**.
8. **Share** ni bosing, ko‘rish huquqli havolani nusxalang va fikr olish uchun yuboring.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- Ekranlarni freymsiz, to‘g‘ridan-to‘g‘ri kanvasda chizish.
- Qatlamlarni nomsiz va guruhsiz qoldirish.
- Oraliqlarni «ko‘z bilan» qo‘yish, har safar turlicha.
- Uslublar o‘rniga bitta rangning o‘nlab tuslarini ishlatish.
- Constraints va auto layout’ni e’tiborsiz qoldirib, o‘lcham o‘zgarganda hammasini qo‘lda surish.

## FAQ

### Boshlash uchun Figma’ga pul to‘lash kerakmi?

O‘rganish va shaxsiy loyihalar uchun odatda bepul tarif yetarli. Tariflar shartlari va cheklovlari o‘zgarib turadi, shuning uchun ularni Figma’ning rasmiy saytida tekshiring.

### Freym guruhdan nimasi bilan farq qiladi?

Guruh shunchaki obyektlarni birlashtiradi va o‘z xususiyatlariga ega emas. Freym esa o‘lchami, foni, ichki elementlar uchun constraints, to‘rlari va auto layout’i bo‘lgan mustaqil konteyner.

### Asoslardan keyin nimani o‘rganish kerak?

Keyingi qadam — **auto layout**, **komponentlar** va ularning variantlari, so‘ngra oddiy prototiplash: Prototype yorlig‘ida ekranlarni o‘tishlar bilan bog‘lash.
