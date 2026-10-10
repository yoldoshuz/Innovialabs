---
title: Dashboard dizayni: murakkab ma’lumotni tushunarli qilish
description: Admin panel va CRM uchun dashboard loyihalash: asosiy metrikalarni tanlash, joylashuv ustuvorligi, grafik turlari, jadvallar, filtrlar va zichlik.
summary: Tushunarli dashboard grafiklardan emas, u javob beradigan savoldan boshlanadi: tepada 3–5 ta asosiy metrika, pastda tafsilotlar, vazifaga mos grafik turi, harakat qiladiganlar uchun esa jadval va filtrlar.
---

## Asosiysi: dashboard hamma narsani ko‘rsatmaydi, savolga javob beradi

Yaxshi dashboard foydalanuvchiga bir necha soniyada aniq savolga javob beradi: «hammasi joyidami?», «muammo qayerda?», «keyin nima qilish kerak?». Agar ekran shunchaki barcha mavjud ma’lumotni chiqarsa, odam ma’noni o‘zi qidirishga majbur bo‘ladi va ko‘pincha topa olmaydi.

Shuning uchun dashboard ustidagi ish uchta savoldan boshlanadi:

- **Kim qaraydi** — rahbar, savdo menejeri, qo‘llab-quvvatlash operatori.
- **Qanchalik tez-tez** — haftada bir marta umumiy ko‘rib chiqish uchunmi yoki kun bo‘yi ishchi vosita sifatidami.
- **Qanday qaror qabul qiladi** ko‘rib chiqqandan keyin.

Rahbar dashboardi va CRM operatorining ishchi ekrani — ma’lumotlar bir xil bo‘lsa ham, ikki xil mahsulot.

## Asosiy metrikalarni aniqlang

Har bir rol uchun qarorlarga haqiqatan ta’sir qiladigan **3–5 ta metrika** tanlang. Qolganlari — bosilganda ochiladigan ikkinchi daraja.

Har bir metrikani tekshiring:

- Qiymat **yaxshimi yoki yomonmi** — tushunarlimi? Kontekstsiz raqam foydasiz. Taqqoslash qo‘shing: o‘tgan davr, maqsad yoki me’yor bilan.
- Foydalanuvchi unga **ta’sir qila oladimi**? Agar yo‘q bo‘lsa, uning joyi asosiy ekranda emas, hisobotda.
- Uni **hamma bir xil tushunadimi**? «Faol mijoz» savdo bo‘limi va buxgalteriya uchun ko‘pincha turlicha. Ta’rifni dizayndan oldin kelishib oling.

Metrika kartochkasida odatda nom, joriy qiymat, davrga nisbatan o‘zgarish va kerak bo‘lsa trendni ko‘rsatuvchi mini-grafik (sparkline) bo‘ladi.

## Joylashuvdagi ustuvorlik

Nigoh yuqoridan pastga va chapdan o‘ngga harakatlanadi, shuning uchun ekranni muhimlik kamayishi tartibida quring:

1. **Yuqori qator** — kartochkalardagi asosiy metrikalar.
2. **O‘rta qism** — shu metrikalarni tushuntiruvchi grafiklar: dinamika, segmentlar bo‘yicha taqsimot.
3. **Pastki qism** — ish uchun batafsil jadvallar va ro‘yxatlar.

Amaliy qoidalar:

- **To‘r** (masalan, 12 ustun) va bir xil oraliqlardan foydalaning — vizual tartib kognitiv yukni kamaytiradi.
- Bog‘liq ma’lumotlarni ekranning turli burchaklariga emas, yonma-yon joylashtiring.
- Barcha bloklarni bir xil o‘lchamda qilmang: **o‘lcham muhimlikni bildiradi**.
- Urg‘u rangini og‘ishlar va ogohlantirishlar uchun saqlang. Hamma narsa yorqin bo‘lsa, hech narsa ajralib turmaydi.

## Grafik turini qanday tanlash kerak

Grafik turi foydalanuvchi nimani ko‘rishi kerakligiga bog‘liq.

| Vazifa | Mos grafik | Nimadan qochish kerak |
|---|---|---|
| Vaqt bo‘yicha dinamika | Chiziqli grafik, davrlar bo‘yicha ustunlar | Doiraviy diagramma |
| Toifalarni taqqoslash | Qiymat bo‘yicha saralangan gorizontal ustunlar | 3D effektlar |
| Butunning ulushi (2–4 qism) | Stacked bar, ba’zan halqasimon diagramma | O‘nta sektorli doira |
| Bosqichlar voronkasi | Voronka yoki konversiyali bosqich ustunlari | Tarqoq kartochkalar |
| Taqsimot | Gistogramma | Tarqalishsiz o‘rtacha qiymat |
| Maqsadga erishish | Progress shkalasi, bullet chart | Spidometrlar |

Umumiy qoidalar: ustunli grafiklarda Y o‘qi noldan boshlanadi, yozuvlar qiyshaymasdan o‘qiladi, legenda ma’lumot yonida turadi yoki to‘g‘ridan-to‘g‘ri yozuvlar bilan almashtiriladi, bitta grafikdagi ranglar soni esa minimal bo‘ladi. **Daltonizmni** hisobga oling: ma’noni faqat qizil va yashil bilan kodlamang, belgi, ikonka yoki yozuv qo‘shing.

## Jadvallar: admin panelning asosiy ish quroli

Admin panel va CRM’larda foydalanuvchi vaqtining katta qismini aynan jadvallar bilan o‘tkazadi. Ularni qulay qiladigan narsalar:

- **Raqamlar o‘ng tomonga**, matn chap tomonga tekislanadi; tabular (bir xil kenglikdagi) raqamlardan foydalaning.
- Eng muhim ustunlar chapda; kam ishlatiladiganlarini yashirish va ustunlar to‘plamini sozlash imkonini bering.
- Aylantirishda **qotirilgan sarlavha** va birinchi ustun.
- Sarlavhani bosib saralash, yo‘nalishning aniq ko‘rsatkichi bilan.
- Statuslar — faqat rang emas, matnli qisqa rangli belgilar.
- Ommaviy amallar qatorlar tanlanganda paydo bo‘ladi, doim ko‘rinib turmaydi.
- O‘ylangan **bo‘sh va yuklanish holatlari**: «bu davr uchun ma’lumot yo‘q» bo‘sh jadvaldan yaxshiroq.

## Filtrlar va zichlik

**Filtrlarni** bitta oldindan bilinadigan joyga qo‘ying — kontent ustiga yoki yon panelga. Faol filtrlar doim ko‘rinib turishi, har birini alohida va hammasini birdaniga bekor qilish imkoni bo‘lishi kerak. Odatda asosiy filtr — sana davri, uni ko‘zga tashlanadigan qiling va tezkor variantlar qo‘shing: «bugun», «7 kun», «oy». Filtrlar holatini URL’da saqlash foydali — shunda ekranni boshqalar bilan ulashish mumkin.

**Zichlik** ssenariyga bog‘liq. Umumiy ko‘rinish dashboardiga bo‘sh joy kerak. Kun bo‘yi arizalarni qayta ishlaydigan operatorga esa yuqori zichlik kerak: ekranda ko‘proq qator, kamroq aylantirish. Yaxshi yechim — zichlik almashtirgichi (ixcham / oddiy) va dizayn tizimidagi yagona oraliqlar shkalasi.

## Ko‘p uchraydigan xatolar

- Birinchi ekranda «har ehtimolga qarshi» o‘nlab metrikalar.
- Taqqoslash va o‘lchov birligisiz raqamlar.
- Chiroyli ko‘rinadigan, lekin o‘qib bo‘lmaydigan dekorativ grafiklar.
- Bitta ekranda turli sana va raqam formatlari.
- Faqat ideal ma’lumotlar uchun dizayn: uzun nomlar, nollar, bo‘shliqlar va juda katta qiymatlarni tekshiring.
- «Keyin nima qilish kerak» degan savolga javob yo‘q — na tafsilotlarga havola, na amal.

## FAQ

### Bitta dashboardda nechta grafik bo‘lishi kerak?

Belgilangan son yo‘q. Foydalanuvchi savollariga tayaning: har bir grafik kamida bittasiga javob berishi kerak. Agar blokni biror qaror bilan bog‘lab bo‘lmasa, uni olib tashlang yoki hisobotlarga o‘tkazing.

### Barcha rollar uchun bitta dashboard qilsa bo‘ladimi?

Umumiy karkas bo‘lishi mumkin, lekin mazmunni rolga moslash yaxshiroq: turli metrikalar, standart filtrlar va zichlik. Universal ekran odatda hammaga bir xil darajada noqulay bo‘ladi.

### Mavjud admin panel redizaynini nimadan boshlash kerak?

Haqiqiy ishni kuzatishdan: qaysi ekranlar ko‘proq ochiladi, qaysi ustun va filtrlardan foydalaniladi, foydalanuvchilar qayerda ma’lumotni Excel’ga yuklab oladi. Aynan shu joylar eng katta samara beradi.
