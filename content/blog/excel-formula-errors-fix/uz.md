---
title: Formulalardagi #N/A, #REF!, #VALUE! va boshqa xatolarni tuzatish
description: Excel va Google Sheets’dagi #N/A, #REF!, #VALUE!, #DIV/0!, #NAME? va boshqa xatolar nimani bildiradi, nega paydo bo‘ladi va manbasini qanday topish mumkin.
summary: Har bir xato aniq muammoga ishora qiladi: #N/A — qiymat topilmadi, #REF! — o‘chirilgan kataklarga havola, #VALUE! — noto‘g‘ri ma’lumot turi; avval formulalarni tekshirish vositalari bilan manbani toping, so‘ng xatoni ushlash kerakmi yoki yo‘qligini hal qiling.
---
## Qisqa javob

Katakdagi xato — nosozlik emas, balki ishora: kod nima noto‘g‘ri ketganini aytadi. Harakatlar tartibi doim bir xil: **kodni tushunish → manba katakni topish → ma’lumot yoki formulani tuzatish**. Formulani IFERROR bilan o‘rash faqat xato kutilgan holatda o‘rinli.

Rus tilidagi Excel’da xatolar ruscha ko‘rinadi: #Н/Д, #ССЫЛКА!, #ЗНАЧ! va hokazo. Google Sheets va ingliz tilidagi Excel’da — inglizcha.

## Xatolar ma’lumotnomasi

| Xato | Ma’nosi | Odatiy sabablari |
|---|---|---|
| #N/A | Qiymat topilmadi | VLOOKUP yoki MATCH kalitni topmadi; son va matn; ortiqcha bo‘sh joylar |
| #REF! | Mavjud bo‘lmagan kataklarga havola | Qator, ustun yoki varaq o‘chirilgan; VLOOKUP’dagi ustun raqami diapazondan katta |
| #VALUE! | Argument turi noto‘g‘ri | Arifmetikada matn; SUMIFS’da har xil o‘lchamdagi diapazonlar; matn ko‘rinishidagi sana |
| #DIV/0! | Nolga bo‘lish | Bo‘luvchi nol yoki bo‘sh katak |
| #NAME? | Noma’lum nom | Funksiya nomida xato; qo‘shtirnoqsiz matn; funksiya bu versiyada yo‘q |
| #NUM! | Yaroqsiz son | Manfiy sondan ildiz; iteratsion funksiya natija bermadi; juda katta qiymat |
| #NULL! | Diapazonlar kesishmasi bo‘sh | Havolalar orasida vergul yoki ikki nuqta o‘rniga bo‘sh joy (faqat Excel) |
| #SPILL! | Massivga joy yo‘q | Dinamik massiv formulasi ostidagi yoki yonidagi kataklar band (Excel 365) |
| #ERROR! | Formula tahlil qilinmadi | Sintaksis xatosi: qavslar, qo‘shtirnoqlar, ajratuvchilar (Google Sheets) |

Alohida: **#####** — xato emas, ustun juda tor yoki sana manfiy. Ustunni kengaytiring.

## Eng ko‘p uchraydigan xatolarni tuzatish

**#N/A.** Qidirilayotgan qiymat jadvalda haqiqatan borligini va harfma-harf mos kelishini tekshiring. Kataklarni `=A2=Lookup!A5` formulasi bilan solishtiring. TRIM bilan bo‘sh joylarni olib tashlang va turlarni moslang: son kalit matn sifatida saqlangan bo‘lsa, VALUE yordam beradi. VLOOKUP’da aniq moslik — to‘rtinchi argumentda FALSE turganini ham tekshiring.

**#REF!** Formulani oching: unda manzil o‘rniga `#REF!` yozilgan bo‘ladi. Agar o‘chirish hozirgina bo‘lgan bo‘lsa, Ctrl+Z bilan bekor qiling yoki havolani qayta yozing. Takrorlanmasligi uchun qattiq yozilgan ustun raqamlari o‘rniga INDEX MATCH yoki XLOOKUP’dan foydalaning va boshqa formulalar bog‘liq bo‘lgan varaqlarni o‘chirmang.

**#VALUE!** Noto‘g‘ri turdagi argumentni toping. Ko‘p uchraydigan holat — boshqa tizimdan eksport qilingandan keyin bo‘sh joyli yoki noto‘g‘ri kasr ajratuvchili sonlar. Katakda son borligini ISNUMBER bilan tekshiring va shartli funksiyalardagi barcha diapazonlar o‘lchamini solishtiring.

**#DIV/0!** Bo‘luvchini aniq tekshiring:

```
=IF(B2=0, "", A2/B2)
```

**#NAME?** Funksiya nomini va matn atrofidagi qo‘shtirnoqlarni tekshiring. Excel’ingiz rus tilida bo‘lsa, inglizcha qo‘llanmalardan ko‘chirilgan formulalarni moslashtirish kerak: funksiyalar ruscha yoziladi, ajratuvchi esa nuqtali vergul.

## IFERROR va IFNA

- **IFERROR** istalgan xatoni ushlaydi: `=IFERROR(A2/B2, 0)`.
- **IFNA** faqat #N/A’ni ushlaydi: `=IFNA(VLOOKUP(A2, Products!A:C, 3, FALSE), "Katalogda yo‘q")`.

Qoida oddiy: qidiruv uchun **IFNA**’dan foydalaning. IFERROR #REF! va #NAME?’ni ham, ya’ni formuladagi haqiqiy buzilishlarni ham yashiradi va natijada indamay noto‘g‘ri hisobot olasiz. «Topilmadi» va «nol» turli ma’noni anglatadigan joyda 0 qaytarmang — bu yig‘indi va o‘rtacha qiymatlarni buzadi.

## Formulalarni tekshirish vositalari

**Excel**, Formulas yorlig‘i:

- **Trace Precedents** va **Trace Dependents** — strelkalar formula ma’lumotni qayerdan olishini va natija qayerga ketishini ko‘rsatadi.
- **Evaluate Formula** — qadamma-qadam tahlil: xato aynan qaysi qadamda paydo bo‘lishi ko‘rinadi.
- **Error Checking** — varaqdagi xatolarni birma-bir ko‘rib chiqadi va tuzatish variantlarini taklif qiladi.
- **Show Formulas** (Ctrl+`) — barcha kataklarda qiymat o‘rniga formulani ko‘rsatadi.
- **Watch Window** — boshqa varaqlardagi muhim kataklarni kuzatib boradi.

**Google Sheets:**

- kursorni xato katak ustiga olib boring — sababi tushuntirilgan izoh chiqadi;
- katakni tanlab F2 ni bosing: formuladagi havolalar rangli ramkalar bilan ajratiladi;
- **View → Show formulas** (Ctrl+`);
- qadamma-qadam hisoblagich yo‘q, shuning uchun uzun formulani yordamchi kataklarda qismlarga bo‘lib, qaysi qism xato berayotganini toping.

Xatolar tarqaladi: manba katak #N/A qaytarsa, unga bog‘liq barcha formulalar ham shuni ko‘rsatadi. Shuning uchun birinchi xatoni topguningizcha bog‘liqliklar zanjiri bo‘ylab **natijadan manbaga** qarab yuring.

## FAQ

### Ishlab turgan formula yangi ma’lumot qo‘yilgandan keyin nega buzildi?

Ko‘pincha tuzilma o‘zgargan bo‘ladi: ustunlar o‘chirilgan yoki qo‘shilgan, varaq qayta nomlangan yoki yangi ma’lumotlar boshqa formatda kelgan, masalan sanalar matnga aylangan. Bog‘liq kataklarni va yangi qatorlardagi ma’lumot turlarini tekshiring.

### Barcha xatolarni shunchaki yashirsa bo‘ladimi?

Texnik jihatdan ha, lekin bu xavfli: xatolar ma’lumotlardagi muammolardan darak beradi. Faqat kutilgan holatlarni ushlang, masalan ma’lumotnomada hali yo‘q yangi mahsulot uchun #N/A’ni.

### Aylanma havola bo‘lsa nima qilish kerak?

Bu xato kodi emas, ogohlantirish: formula to‘g‘ridan-to‘g‘ri yoki boshqa kataklar orqali o‘ziga ishora qilyapti. Excel’da uni Formulas → Error Checking → Circular References orqali toping va hisobni alohida katakka ko‘chiring.
