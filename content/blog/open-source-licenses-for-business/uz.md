---
title: Open source litsenziyalar: biznes egasi nimani bilishi kerak
description: MIT va Apache litsenziyalari GPL va AGPL kopileft litsenziyalaridan nimasi bilan farq qiladi va kutubxona tanlovi mahsulotga qanday ta’sir qiladi.
summary: Ruxsat beruvchi litsenziyalar (MIT, Apache 2.0) koddan yopiq tijorat mahsulotida deyarli cheklovsiz foydalanishga imkon beradi. Kopileft litsenziyalar (GPL, AGPL) manba kodini ochishga majbur qilishi mumkin, shuning uchun ularni mahsulot mijoz yoki investorga yetib borguncha nazorat qiling.
---

## Bir daqiqada asosiysi

Deyarli har qanday zamonaviy mahsulot open source kutubxonalardan yig‘ilgan. Bepul kod «qoidasiz» degani emas: har bir kutubxonaning **litsenziyasi** bor va u koddan foydalansangiz nima qilishingiz shartligini belgilaydi.

Litsenziyalar ikki katta guruhga bo‘linadi:

- **Ruxsat beruvchi (permissive)** — MIT, BSD, Apache 2.0. Yopiq tijorat mahsulotida ishlatish mumkin, faqat mualliflik haqidagi bildirishnoma va litsenziya matnini saqlash kifoya.
- **Kopileft (copyleft)** — GPL, AGPL, yumshoqroq shakli LGPL. Bunday kodli mahsulotni tarqatsangiz, hosila asar ham xuddi shu shartlarda, ya’ni ochiq manba kodi bilan tarqatilishi kerak.

Biznes uchun bu nazariya emas, xarajat masalasi: hisobga olinmagan litsenziya kompaniyani sotishda, investor tekshiruvida yoki mijoz bilan nizoda yuzaga chiqishi mumkin.

## Mashhur litsenziyalarni solishtirish

| Litsenziya | Turi | Yopiq mahsulotda mumkinmi | Asosiy shart |
|---|---|---|---|
| MIT | Ruxsat beruvchi | Ha | Kopirayt va litsenziya matnini saqlash |
| BSD | Ruxsat beruvchi | Ha | Xuddi shunday, mualliflar nomidan foydalanishga cheklov bilan |
| Apache 2.0 | Ruxsat beruvchi | Ha | Bildirishnomalarni saqlash, o‘zgarishlarni belgilash; patent litsenziyasini o‘z ichiga oladi |
| LGPL | Kuchsiz kopileft | Odatda ha, dinamik bog‘lashda | Kutubxonaning o‘ziga kiritilgan o‘zgarishlarni ochish kerak |
| GPL | Kuchli kopileft | Yo‘q, agar tarqatsangiz | Hosila mahsulot GPL ostida manba kodi bilan tarqatiladi |
| AGPL | Kuchli kopileft | Yo‘q, hatto SaaS uchun ham | Tarmoq orqali foydalanuvchilar ham manba kodini olishi kerak |

## Kalit so‘z — «tarqatish»

GPL majburiyatlari odatda dasturni **boshqalarga topshirganingizda** kuchga kiradi: qutili versiyani sotish, mobil ilovani chiqarish, mijoz serveriga dastur o‘rnatish.

Agar kod faqat sizning serveringizda ishlasa va foydalanuvchilar sayt yoki xizmatni ko‘rsa, GPL odatda manba kodini oshkor qilishni talab qilmaydi. Aynan shu bo‘shliqni **AGPL** yopadi: dastur bilan tarmoq orqali o‘zaro ta’sir ham kodni taqdim etishga sabab hisoblanadi.

Amaliy xulosa:

- **mobil yoki desktop ilova** uchun GPL bog‘liqlik jiddiy risk;
- **SaaS** uchun AGPL xavfliroq;
- dasturchilarga sotiladigan **kutubxona yoki SDK** uchun ikkalasi ham muhim.

## Sotish va investitsiyaga ta’siri

Kompaniyani sotib olish yoki investitsiya raundida ko‘pincha texnik due diligence o‘tkaziladi. Unda kodda yopiq tijorat modeliga zid litsenziyali komponentlar bor-yo‘qligi tekshiriladi. Topilgan muammo modulni qayta yozish, kutubxonani almashtirish yoki bahoning pasayishini anglatadi.

Alohida risk — **ikki tomonlama litsenziyalash**. Ba’zi mahsulotlar AGPL ostida bepul, tijorat litsenziyasi ostida esa pullik. Ularni yopiq mahsulotda bepul ishlatib bo‘lmaydi, pullik litsenziya esa doimiy xarajatga aylanadi.

Yana bir jihat: huquq egasi yangi versiyalarda **litsenziyani o‘zgartirishi** mumkin. Eski versiyalar avvalgi litsenziyada qoladi, lekin yangilanishlar boshqa shartlarda bo‘lishi mumkin.

## Biznes egasi uchun chek-list

1. **Pudratchi bilan shartnomada** qaysi litsenziyalar ruxsat etilishini yozing va topshirishda bog‘liqliklar ro‘yxatini talab qiling.
2. **Bog‘liqliklar ro‘yxatini yuriting** (SBOM). Uni litsenziya tahlili vositalari avtomatik yaratadi.
3. **Litsenziyani joriy qilishdan oldin tekshiring**, sotishdan oldin emas.
4. **Bildirishnomalarni saqlang**: LICENSE va NOTICE fayllari, ilovada «Litsenziyalar» bo‘limi.
5. **Kodingizni ochish-ochmasligingizni oldindan hal qiling.** Agar yo‘q bo‘lsa, tarqatiladigan qismlarda GPL va AGPL dan qoching.
6. **Munozarali holatlarda** intellektual mulk bo‘yicha yuristga murojaat qiling.

## Keng tarqalgan xatolar

- **«GitHub da bor, demak mumkin».** Litsenziyasiz kod sukut bo‘yicha mualliflik huquqi bilan himoyalangan va ruxsatsiz ishlatib bo‘lmaydi.
- **Faqat to‘g‘ridan-to‘g‘ri bog‘liqliklarga qarash.** Tranzitiv kutubxonalarning ham o‘z litsenziyalari bor.
- **Bepullik va foydalanish erkinligini chalkashtirish.** Bepul yuklab olish kodni tijorat mahsulotiga joylash huquqi emas.

Bu material umumiy tavsif, yuridik maslahat emas.

## FAQ

### MIT kutubxonalarida qurilgan mahsulotni sotish mumkinmi?

Ha. MIT tijorat maqsadida foydalanish va yopiq kodga ruxsat beradi. Faqat mahsulot bilan birga kopirayt va litsenziya matnini saqlash kerak.

### Mobil ilovada GPL kutubxona topilsa nima bo‘ladi?

Ilovani tarqatar ekansiz, manba kodini GPL shartlarida taqdim etishingiz shart. Odatda kutubxonani almashtirish, modulni qayta yozish yoki muallif taklif qilsa, tijorat litsenziyasini sotib olish bilan hal qilinadi.

### Biznes uchun Apache 2.0 nega MIT dan yaxshiroq bo‘lishi mumkin?

Ikkalasi ham ruxsat beruvchi. Apache 2.0 qo‘shimcha ravishda mualliflardan aniq patent litsenziyasini o‘z ichiga oladi, bu patent da’volari riskini kamaytiradi, lekin bildirishnomalarni saqlash va o‘zgarishlarni belgilashda ehtiyotkorlik talab qiladi.
