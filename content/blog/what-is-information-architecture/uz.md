---
title: UX’da axborot arxitekturasi nima
description: Axborot arxitekturasi nima: tashkil etish, nomlash va navigatsiya, sayt xaritasi va user flow, yaxshi tuzilma kerakli narsani topishga qanday yordam beradi.
summary: Axborot arxitekturasi — mahsulot kontenti qanday bo‘limlarga ajratilgani, ular qanday nomlangani va ular orasida qanday harakatlanilishi; yaxshi IA odamga kerakli narsani o‘ylab o‘tirmasdan topish imkonini beradi.
---

## Qisqacha: bu nima

**Axborot arxitekturasi (IA)** — mahsulotning tuzilmasi: unda qanday kontent bor, u qanday guruhlangan, guruhlar qanday nomlangan va odam ular orasida qaysi yo‘llar bilan harakatlanadi.

Saytni binoga qiyoslasak, vizual dizayn — bu pardoz va mebel, IA esa — reja: kirish joylari, yo‘laklar, ko‘rsatkichlar va qaysi xonalar yonma-yon joylashgani. Chiqish yo‘lini topib bo‘lmaydigan binoni chiroyli pardoz qutqara olmaydi.

Yomon IA’ni tanish oson: odam menyuni ochadi, bandlarni ko‘zdan kechiradi va qayerni bosishni tushunmaydi. Yaxshi IA odatda sezilmaydi — kerakli narsa shunchaki uni qidirgan joyda bo‘ladi.

## IA nimalardan iborat

Odatda birgalikda ishlaydigan bir nechta tizim ajratiladi.

### Tashkil etish tizimi

Kontent qanday guruhlarga bo‘linadi. Asosiy yondashuvlar:

- **Mavzu bo‘yicha** — «Yetkazib berish», «To‘lov», «Qaytarish».
- **Auditoriya bo‘yicha** — «Biznes uchun», «Jismoniy shaxslar uchun».
- **Vazifa bo‘yicha** — «Hisob ochish», «Pul o‘tkazish».
- **Alifbo, vaqt yoki geografiya bo‘yicha** — odam nimani qidirayotganini oldindan bilganda: ma’lumotnoma, arxiv, filiallar ro‘yxati.

Muhimi — kompaniyaning tashkiliy tuzilmasini takrorlaydigan emas, **foydalanuvchiga tushunarli mantiqni** tanlash. Yetkazib berishga qaysi bo‘lim javob berishi odam uchun ahamiyatsiz.

### Nomlash tizimi

Bo‘limlar, tugmalar va havolalar qanday ataladi. Yaxshi nom:

- ichki jargon bilan emas, foydalanuvchi tilida gapiradi;
- bir ma’noli — ichida nima borligi tushunarli;
- izchil — bir narsa hamma joyda bir xil ataladi.

Bitta saytda «Yechimlar», «Mahsulotlar» va «Xizmatlar» bo‘lishi — chalkashlikning keng tarqalgan sababi: odamlar ularning farqini tushunmaydi.

### Navigatsiya tizimi

Tuzilma bo‘ylab qanday harakatlanish:

- **Global** — hamma joyda mavjud asosiy menyu.
- **Lokal** — bo‘lim ichidagi o‘tishlar.
- **Kontekstli** — kontent ichidagi havolalar: «O‘xshash mahsulotlar», «Shuningdek o‘qing».
- **Yordamchi** — «non ushoqlari» (breadcrumbs), futer, qidiruv.

### Qidiruv

Katta mahsulotlarda qidiruv alohida tizim: nima indekslanadi, natijalar qanday ko‘rsatiladi, hech narsa topilmasa nima bo‘ladi. Qidiruv tushunarli tuzilmani almashtirmaydi, balki uni to‘ldiradi.

## Sayt xaritasi va user flow

IA qog‘ozda qayd etiladigan ikki asosiy artefakt.

| Artefakt | Nimani ko‘rsatadi | Qachon kerak |
|---|---|---|
| **Sayt xaritasi (sitemap)** | Barcha sahifa va bo‘limlar ierarxiyasini daraxt ko‘rinishida | Tuzilmani to‘liq ko‘rish va bo‘limlar tarkibini kelishib olish uchun |
| **User flow** | Foydalanuvchining maqsad sari ekranlar orqali yo‘li, tarmoqlanishlar va xatolar bilan | Aniq ssenariyni loyihalash uchun: ro‘yxatdan o‘tish, xarid, yozilish |

Sayt xaritasi «nima qayerda turadi» degan savolga, user flow esa «odam maqsadga qanday yetadi» degan savolga javob beradi. Odatda ikkalasi ham kerak.

## IA’ni qanday loyihalash: qadamlar

1. **Butun kontentni yig‘ing.** Mahsulotda bo‘lishi kerak bo‘lgan sahifalar, funksiyalar va materiallar ro‘yxatini tuzing.
2. **Foydalanuvchilarni tushuning.** Ular qanday vazifalarni hal qiladi, qidirayotgan narsasini qanday so‘zlar bilan ta’riflaydi.
3. **Kartochkali saralash (card sorting) o‘tkazing.** Ishtirokchilar mavzular yozilgan kartochkalarni guruhlarga ajratadi va ularni nomlaydi — shunda ularning tafakkur modelini ko‘rasiz.
4. **Natijalar asosida sayt xaritasini chizing.**
5. **Tree testing bilan tekshiring.** Ishtirokchilarga faqat bo‘limlarning matnli daraxti ko‘rsatiladi va kerakli narsa qayerda ekanini topish so‘raladi. Bu tuzilmani vizual dizayndan alohida tekshiradi.
6. **Asosiy user flow’larni tavsiflang** va shundan keyingina maketlarga o‘ting.

## Ko‘p uchraydigan xatolar

- Tuzilma foydalanuvchi vazifalarini emas, kompaniya ichki tuzilishini takrorlaydi.
- Juda chuqur ichma-ichlik: kerakli narsaga ko‘p darajalar orqali yetib boriladi.
- Juda keng menyu: bir darajada o‘nlab bandlar, ular orasidan tanlash qiyin.
- «Turli», «Resurslar», «Foydali» kabi noaniq nomlar.
- Bir xil kontent bir nechta joyda turli nomlar bilan yashaydi.
- IA maketlarni chizishdan oldin emas, chizish jarayonida o‘ylab topiladi.

## FAQ

### Axborot arxitekturasi UX-dizayndan nimasi bilan farq qiladi?

IA — UX-dizaynning bir qismi. UX mahsulot bilan o‘zaro ta’sirning butun tajribasini qamrab oladi, IA esa aynan tuzilma, nomlar va navigatsiyaga javob beradi. Bu maketlar quriladigan poydevor.

### Kichik sayt uchun IA kerakmi?

Ha, lekin sodda shaklda. Hatto lending yoki bir necha sahifali sayt uchun ham qanday bo‘limlar bo‘lishi, ular qanday atalishi va odam ularni qaysi tartibda ko‘rishini hal qilib olish kerak. Bu ko‘p vaqt olmaydi va qayta ishlashdan qutqaradi.

### Card sorting tree testing’dan nimasi bilan farq qiladi?

Card sorting tuzilmani **yaratishga** yordam beradi: odamlar kontentni o‘zlari qanday guruhlashini bilib olasiz. Tree testing tayyor tuzilmani **tekshirishga** yordam beradi: odamlar taklif qilingan bo‘limlar daraxtida kerakli narsani topa oladimi.
