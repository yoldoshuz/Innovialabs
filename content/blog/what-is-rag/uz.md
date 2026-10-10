---
title: RAG (qidiruv bilan generatsiya) nima — oddiy tilda
description: RAG qanday ishlaydi: avval hujjatlardan qidiruv, keyin model javobi. Nega u o‘ylab topishni kamaytiradi va biznesda qayerda qo‘llanadi.
summary: RAG — javob berishdan oldin tizim hujjatlaringizdan kerakli bo‘laklarni topib, modelga uzatadigan sxema, shuning uchun model xotiradan emas, sizning dolzarb ma’lumotlaringiz asosida javob beradi.
---
## Qisqacha mohiyati

**RAG (Retrieval-Augmented Generation)** — oldindan qidiruv bilan javob yaratish. Model «xotiradan» javob berish o‘rniga savol bilan birga hujjatlaringizdan bir nechta mos bo‘lakni oladi va javobni ular asosida tuzadi.

O‘xshatish: ochiq kitob bilan imtihon. Talaba hammasini eslab qolishi shart emas — u kerakli sahifani topadi va unga qarab javob beradi.

## Bosqichma-bosqich qanday ishlaydi

**Bazani tayyorlash (bir marta va yangilanishlarda):**

1. Hujjatlar — reglamentlar, FAQ, katalog, shartnomalar — bo‘limlar yoki xatboshilar bo‘yicha **bo‘laklarga** (chunks) ajratiladi.
2. Har bir bo‘lak **embedding**ga — matn ma’nosini aks ettiruvchi sonli vektorga aylantiriladi.
3. Vektorlar **vektor bazasida** yoki vektor qidiruvini qo‘llab-quvvatlaydigan oddiy MBda saqlanadi.

**Savolga javob berish:**

1. Foydalanuvchi savoli ham vektorga aylantiriladi.
2. **Qidiruv** ma’no jihatidan yaqin bo‘laklarni topadi (ko‘pincha kalit so‘zlar bo‘yicha oddiy qidiruv bilan birlashtiriladi).
3. Topilgan bo‘laklar savol bilan birga promptga qo‘yiladi.
4. Model faqat shu bo‘laklar asosida **javob yaratadi** va imkon qadar manbalarni ko‘rsatadi.

## Nega RAG o‘ylab topishni kamaytiradi

Ma’lumotsiz til modeli ishonarli ko‘rinadigan javobni taxmin qiladi — **gallyutsinatsiyalar** shundan paydo bo‘ladi. RAGda model aniq matn va unga tayanib javob berish ko‘rsatmasini oladi. Agar topilgan matnda javob bo‘lmasa, model buni ochiq aytishi mumkin.

Muhim: RAG xatolarni **kamaytiradi**, lekin butunlay yo‘q qilmaydi. Qidiruv noto‘g‘ri bo‘laklarni topsa, model o‘z ishini mukammal bajarsa ham javob noto‘g‘ri bo‘ladi.

## Nega javoblar dolzarb qoladi

Modelning bilimlari o‘qitilgan sanasida qotib qolgan. RAGda haqiqat manbai — sizning bazangiz:

- narx yoki reglamentni o‘zgartirdingiz — hujjatni yangiladingiz va javoblar darhol yangi versiyaga tayanadi;
- modelni qayta o‘qitish kerak emas;
- kirish huquqlarini cheklash mumkin: xodim faqat o‘z darajasidagi hujjatlar bo‘yicha javob oladi.

## Biznesda RAG qayerda qo‘llanadi

- Xodimlar uchun **bilimlar bazasi assistenti** — reglamentlar, yo‘riqnomalar, HR siyosatlari.
- Telegram yoki saytdagi **qo‘llab-quvvatlash chat-boti**, u yetkazib berish, to‘lov va kafolat bo‘yicha dolzarb qoidalarga tayanib javob beradi.
- Shartnomalar va hujjatlar bo‘yicha tabiiy tilda javob beradigan **qidiruv**.
- Katalog va tovar xususiyatlari bo‘yicha **sotuvchi yordamchisi**.

## Sifatga nimalar ta’sir qiladi

| Omil | Nimaga e’tibor berish kerak |
|---|---|
| Hujjatlar sifati | Eskirgan va bir-biriga zid matnlar xuddi shunday javoblar beradi |
| Bo‘laklarga ajratish | Jadval va ro‘yxatlarni o‘rtasidan kesmaslik, bo‘lim sarlavhalarini saqlash |
| Qidiruv | Ma’noviy va kalit so‘z qidiruvining gibridi, natijalarni qayta saralash |
| Prompt | Faqat bo‘laklar asosida javob berish, javob yo‘qligini tan olish, manbaga havola |
| Tillar | Embedding modeli rus va o‘zbek tillari bilan yaxshi ishlashini tekshirish |
| Baholash | Muntazam tekshiruv uchun namunaviy javobli real savollar to‘plami |

## Ko‘p uchraydigan xatolar

- **Hamma narsani tozalamasdan yuklash** — dublikatlar va eski versiyalar qidiruvni chalkashtiradi.
- **Qidiruvni emas, faqat modelni baholash**: ko‘pincha muammo nima topilganida bo‘ladi.
- **Manbalarni ko‘rsatmaslik** — foydalanuvchiga javobni tekshirish qiyin.

## FAQ

### RAG modelni qo‘shimcha o‘qitishdan nimasi bilan farq qiladi?

Qo‘shimcha o‘qitish modelning xulqi va uslubini o‘zgartiradi, lekin tez-tez o‘zgaradigan faktlar uchun yomon mos keladi. RAG dolzarb faktlarni so‘rov paytida beradi va ularni qayta o‘qitishsiz yangilash mumkin.

### Alohida vektor bazasi kerakmi?

Shart emas. Kichik hajmlar uchun odatiy MBlarga kengaytmalar yetarli, masalan PostgreSQL uchun pgvector. Ixtisoslashgan vektor bazalari katta hajmlarda va qidiruvga murakkab talablar bo‘lganda mantiqli.

### Ichki hujjatlarni RAGga yuklash xavfsizmi?

Bu arxitekturaga bog‘liq: baza qayerda saqlanadi, qaysi modeldan foydalanasiz va kirish huquqlari qanday sozlangan. Maxfiy ma’lumotlar uchun ma’lumotlarni qayta ishlash shartlari mos provayderni yoki o‘z infratuzilmangizda joylashtirilgan modelni tanlang.
