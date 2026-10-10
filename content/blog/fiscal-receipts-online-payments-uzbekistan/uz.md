---
title: O‘zbekistonda onlayn to‘lovda fiskal cheklar va MXIK kodlari
description: O‘zbekistonda onlayn to‘lovda MXIK kodlari va fiskal ma’lumotlar nega kerak, ular to‘lov tizimlari orqali qanday uzatiladi va katalogni qanday tayyorlash kerak.
summary: O‘zbekistonda onlayn to‘lovda buyurtmaning har bir pozitsiyasi bo‘yicha fiskal ma’lumotlar — MXIK (IKPU) kodi, qadoq kodi, QQS stavkasi va narx — uzatilishi kerak, shuning uchun bu maydonlar do‘kon katalogida oldindan saqlanishi lozim.
---

## Qisqa javob

Xaridor onlayn to‘laganda xarid bo‘yicha **fiskal chek** shakllanadi va soliq organi aynan nima sotilganini ko‘radi. Chek to‘g‘ri bo‘lishi uchun do‘kon buyurtmaning har bir pozitsiyasi bo‘yicha **MXIK kodi** (mahsulot va xizmatlarning identifikatsiya kodi, ruscha IKPU), **qadoq kodi** (o‘lchov birligi), **QQS stavkasi**, miqdor va narxni uzatadi. Bu ma’lumotlar to‘lov bilan birga yoki undan keyin darhol to‘lov tizimi orqali yuboriladi. Agar katalogda ular bo‘lmasa, to‘lov integratsiyasini oxiriga yetkazib bo‘lmaydi.

## MXIK nima va u nega kerak

**MXIK** — soliq xizmati yuritadigan yagona milliy tovar va xizmatlar katalogidagi kod. U chekdagi pozitsiya nima ekanini aniq aytadi: «Ko‘k futbolka M» emas, balki aniq soliq rejimiga ega muayyan tovar guruhi.

Bu nega muhim:

- soliq organi savdo haqida tuzilgan ma’lumot oladi;
- xaridor tekshirish mumkin bo‘lgan chek oladi;
- do‘kon tushumni tasdiqlaydi va QQS hamda imtiyozlarni to‘g‘ri qo‘llaydi.

Har bir MXIK kodiga **qadoq kodlari** bog‘langan — tovar sotiladigan birliklar (dona, kilogramm, quti va hokazo). Ularni ham aynan shu MXIK uchun ma’lumotnomadan tanlash kerak.

## Ma’lumotlar to‘lov tizimi orqali qanday o‘tadi

Turli provayderlarda umumiy sxema o‘xshash, faqat maydonlar nomi va uzatish vaqti farq qiladi.

1. Do‘kon buyurtma yaratadi va savatcha tarkibini biladi.
2. To‘lov yaratilayotganda yoki to‘lov tizimi so‘raganda do‘kon **chek tafsilotlarini** — fiskal maydonli pozitsiyalar ro‘yxatini yuboradi.
3. To‘lov tizimi to‘lovni o‘tkazadi va ma’lumotlarni fiskallashtirishga yuboradi.
4. Xaridor fiskal chekni oladi — odatda havola ko‘rinishida yoki to‘lov ilovasida.

Bitta pozitsiya taxminan shunday ko‘rinishi mumkin (maydonlar nomi shartli, aniq formatni provayderingiz hujjatlaridan oling):

```json
{
  "title": "Paxta futbolka, M o‘lcham",
  "price": 15000000,
  "count": 1,
  "ikpu": "00000000000000000",
  "package_code": "0000000",
  "vat_percent": 12
}
```

Odatiy tuzoqlarga e’tibor bering:

- ba’zi provayderlar summani so‘mda emas, **tiyinda** qabul qiladi;
- chekdagi pozitsiyalar summasi to‘lov summasi bilan, jumladan yetkazib berish va chegirmalar bilan mos kelishi kerak;
- **yetkazib berish** — o‘z MXIK kodiga ega alohida xizmat, «tovarning bir qismi» emas;
- marketpleyslar va komission savdo uchun pozitsiyaning haqiqiy yetkazib beruvchisi STIR yoki JShShIR talab qilinishi mumkin.

## Katalogni qanday tayyorlash kerak

Asosiy ish integratsiya kodida emas, ma’lumotlarda. Harakatlar tartibi:

1. **Tovar va xizmatlar ro‘yxatini** joriy kategoriyalari bilan eksport qiling.
2. Har bir tovar guruhi uchun rasmiy katalogdan **MXIK tanlang**. Buni har bir pozitsiya bo‘yicha emas, kategoriyalar bo‘yicha qilish qulayroq.
3. Har bir MXIK uchun **qadoq kodini tanlang**.
4. Buxgalter bilan **QQS stavkasi** va imtiyozlarni aniqlang.
5. Yangi tovarlarni bu ma’lumotlarsiz e’lon qilib bo‘lmasligi uchun maydonlarni CMS yoki hisob tizimidagi **tovar kartochkasiga qo‘shing**.
6. Chekka tushadigan yetkazib berish, qadoqlash va boshqa xizmatlar uchun **alohida pozitsiyalar yarating**.

| Maydon | Qayerda saqlash | Kim javobgar |
| --- | --- | --- |
| MXIK | Tovar kartochkasi yoki kategoriya | Buxgalter, kontent-menejer |
| Qadoq kodi | Tovar kartochkasi | Kontent-menejer |
| QQS stavkasi | Tovar kartochkasi yoki sozlamalar | Buxgalter |
| Yetkazib beruvchi STIR/JShShIR | Yetkazib beruvchi kartochkasi | Hamkorlar menejeri |

Agar tovarlar 1C yoki boshqa hisob tizimida yuritilsa, fiskal maydonlarni o‘sha yerda saqlab, sayt bilan sinxronlash ikki joyda to‘ldirishdan yaxshiroq.

## Tez-tez uchraydigan xatolar

- Butun katalog uchun bitta «universal» MXIK — chek rasman o‘tadi, lekin ma’lumotlar noto‘g‘ri.
- Chegirma pozitsiyalar bo‘yicha taqsimlanmagan va chek summasi to‘lov bilan mos kelmaydi.
- Yetkazib berish chekka tushmaydi.
- Yangi tovarlar fiskal maydonlarsiz qo‘shiladi va ular bo‘yicha to‘lov xato bilan to‘xtaydi.
- Qaytarishlar tekshirilmagan, holbuki qaytarishda ham to‘g‘ri chek shakllanishi kerak.

## FAQ

### Tovar uchun MXIK kodini qayerdan topish mumkin?

Soliq xizmatining rasmiy milliy tovar va xizmatlar katalogidan. Qidiruvni tovar nomi yoki guruhi bo‘yicha olib borish mumkin. Tanlovga shubhangiz bo‘lsa, kodni buxgalter bilan kelishib oling.

### Fiskal chekni kim shakllantiradi — do‘konmi yoki to‘lov tizimimi?

Bu ulanish sxemasiga bog‘liq. Ko‘pincha fiskallashtirishni to‘lov tizimi o‘z zimmasiga oladi, ammo pozitsiyalar haqidagi ma’lumotni baribir do‘kon uzatadi. Mas’uliyatning aniq taqsimoti provayder hujjatlari va shartnomasida yozilgan.

### To‘lovdan keyin savatcha tarkibi o‘zgarsa nima qilish kerak?

Buyurtma qisman bekor qilinsa yoki o‘zgartirilsa, to‘g‘ri tafsilotlar bilan qisman qaytarish rasmiylashtiring. Allaqachon yuborilgan chek pozitsiyalarini orqaga qaytib o‘zgartirmang.
