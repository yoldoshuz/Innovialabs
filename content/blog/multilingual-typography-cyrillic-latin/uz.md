---
title: Kirill va lotin uchun dizayn: ko‘p tilli tipografiya
description: Rus va o‘zbek tillari uchun shriftni (o‘, g‘, қ, ғ) qanday tanlash, matn uzunligi farqini hisobga olish va tarjimadan keyin buzilmaydigan maket yaratish.
summary: Kengaytirilgan kirillni ham o‘z ichiga olgan to‘liq kirill yozuvli shriftni tanlang, unda o‘zbekcha o‘, g‘ va tutuq belgisini tekshiring, maketni qat’iy kengliklarsiz eng uzun til uchun loyihalang va uni inglizcha qoralama emas, real tarjimalar bilan sinang.
---

## Qisqacha javob

Rus, o‘zbek va ingliz tilidagi interfeys uchta muammoga duch keladi:

1. **Shrift** kirill va lotinni, jumladan o‘zbek tiliga xos belgilarni bir xil sifatda ko‘rsatishi kerak.
2. **Matn uzunligi** tillarda turlicha, va bitta tugmaga tarjima sig‘masligi mumkin.
3. **Til qoidalari** — ko‘plik shakli, raqam va sana formatlari — satrlarning tuzilishiga ta’sir qiladi.

Ular tarjimadan keyin emas, dizayn bosqichida hal qilinadi.

## Shriftni qanday tanlash

Shriftni aniq ro‘yxat bo‘yicha tekshiring:

- **Kirill yozuvi «shunchaki qo‘shilmagan», haqiqatan chizilgan.** «ж», «ы», «д», «л» harflarini xuddi shu qalinlikdagi lotin harflari bilan solishtiring — ular qalinlik, kenglik va xarakter bo‘yicha bitta oilaga o‘xshashi kerak.
- **Kirill kursivi bor.** Haqiqiy kirill kursivida harflar shakli o‘zgaradi («т», «д», «и»). Kursiv chizilmagan bo‘lsa, brauzer oddiy shriftni shunchaki qiyshaytiradi va bu sezilib turadi.
- **Kengaytirilgan kirill.** O‘zbek kirill yozuvi uchun «ў», «қ», «ғ», «ҳ» kerak. Google Fonts’da bu harflarning bir qismi asosiy cyrillic’da emas, **cyrillic-ext** to‘plamida — uni alohida ulash kerak.
- **O‘zbek lotin yozuvi belgilari.** O‘ va g‘ harflarida teskari vergulga o‘xshash belgi, tutuq belgisida (ma’lumot) esa apostrof ishlatiladi. Siz tanlagan belgilar shriftda borligiga va tizimning zaxira shriftidan begona glif bo‘lib chiqmasligiga ishonch hosil qiling.
- **Yetarli variantlar.** Kamida oddiy, yarim qalin va qalin. Brauzer sun’iy yasagan «qalin» qo‘pol ko‘rinadi.

Xavfsiz tanlov — keng til qo‘llab-quvvatlashiga ega shriftlar: Inter, Manrope, Roboto, Noto Sans, IBM Plex Sans, PT Sans. Lekin baribir o‘z matnlaringizda tekshirish kerak.

Tekshirish uchun qulay test satri:

```text
O‘zbekiston, g‘oya, ma’lumot, sun’iy intellekt
Ўзбекистон, қоғоз, ғоя, ҳаёт
Съешь же ещё этих мягких французских булок
The quick brown fox jumps over the lazy dog
```

## O‘zbekcha apostrof: nimani bilish muhim

Foydalanuvchilar o‘ ni turlicha kiritadi: oddiy apostrof, teskari shtrix yoki to‘g‘ri tipografik belgi bilan. Bundan amaliy qoidalar kelib chiqadi:

- **Interfeys va kontentda** bitta belgiga kelishib oling va uni hamma joyda ishlating.
- **Qidiruv va filtrlarda** barcha variantlarni bittaga normallashtiring, aks holda ikki xil yozilgan «g‘oya» ikki xil so‘zga aylanadi.
- **Formalarda** «oddiy» apostrof kiritilishini xato deb hisoblamang.
- **Bosh harflarda** sarlavhalarda O‘ va G‘ qanday ko‘rinishini tekshiring — ba’zi shriftlarda belgi juda past yoki juda uzoqda turadi.

## Tillardagi matn uzunligi

Rus va o‘zbek tilidagi iboralar ko‘pincha inglizchadan uzunroq. O‘zbek tili — agglyutinativ til: so‘zga qo‘shimchalar qo‘shiladi va bitta so‘z juda uzun bo‘lib ketishi mumkin («foydalanuvchilarimizga»). Bundan nima kelib chiqadi:

| Qayerda buziladi | Qanday loyihalash |
|---|---|
| Tugmalar | Kenglik qat’iy emas, kontentga qarab; ikki qatorga ko‘chishga ruxsat bering |
| Navigatsiya | Zaxira joy yoki joy yetmaganda menyuga yig‘ish |
| Jadvallar | Ustun sarlavhalarini kesmasdan, keyingi qatorga ko‘chirish |
| Kartochkalar | Qat’iy balandliksiz; qatordagi bir xil balandlikni setka orqali bering |
| Katta sarlavhalar | Uzun so‘zlarni tekshirish, `overflow-wrap` yoki ehtiyotkor bo‘g‘in ko‘chirish |

Vaqtni tejaydigan odat: **maketni darhol eng uzun tilda yig‘ing** yoki psevdolokalizatsiyadan foydalaning — real tarjima paydo bo‘lishidan oldin zaif joylarni ko‘rsatadigan sun’iy uzaytirilgan satrlar.

## Maketga ta’sir qiladigan til qoidalari

- **Ko‘plik shakli.** Rus tilida uchta shakl bor («1 файл», «2 файла», «5 файлов»), o‘zbek tilida son bilan kelgan ot o‘zgarmaydi («5 ta fayl»), ingliz tilida ikkita shakl. Satrlarni bo‘laklardan yopishtirmang — ko‘plikni hisobga oladigan shablonlardan foydalaning.
- **So‘z tartibi.** «Удалить файл» va «Faylni o‘chirish» turlicha tuziladi, shuning uchun satrdagi o‘zgaruvchi boshqa joyda bo‘lib qolishi mumkin.
- **Raqam va sanalar.** Minglik va kasr ajratgichlari, sana formati farq qiladi: ularni qattiq yozilgan satr bilan emas, lokalizatsiya vositalari orqali ko‘rsating.
- **Rasmdagi matn.** Rasm ichidagi har qanday yozuv har bir til uchun alohida versiyani talab qiladi — imkon qadar matnni vyorstkaga chiqaring.

## Ko‘p uchraydigan xatolar

- Shriftni kirillni tekshirmasdan, lotincha namunasiga qarab tanlash.
- Faqat asosiy kirill to‘plamini ulash — natijada «қ» va «ғ» boshqa shriftda ko‘rinadi.
- Ingliz matniga moslab tanlangan qat’iy tugma kengliklari.
- To‘liq nom muhim bo‘lgan joyda matnni ko‘p nuqta bilan kesish.
- Maketni faqat to‘ldiruvchi matn bilan tekshirish.

## FAQ

### Kirill va lotin uchun turli shriftlardan foydalansa bo‘ladimi?

Bo‘ladi, agar ular kichik harflar balandligi, qalinligi va xarakteri bo‘yicha juft qilib tanlangan bo‘lsa. Lekin bu qo‘llab-quvvatlashni murakkablashtiradi va aralash matnda nomuvofiqlik xavfini tug‘diradi, shuning uchun ikkala alifboni yaxshi qo‘llab-quvvatlaydigan bitta shrift odatda ishonchliroq.

### Maketni birinchi navbatda qaysi til uchun loyihalash kerak?

Auditoriyaning asosiy tili uchun, lekin eng uzun tilda tekshiring. Interfeys o‘zbek yoki rus tilida yaxshi ko‘rinsa, ingliz tili odatda muammosiz sig‘adi.

### Shrift kerakli belgilarni qo‘llab-quvvatlashini qanday tekshirish mumkin?

Barcha maxsus harflar bor test satrini Figma’da va brauzerda tering. Agar biror belgi qalinligi yoki uslubi bo‘yicha boshqacha ko‘rinsa, demak u zaxira shriftdan olinmoqda.
