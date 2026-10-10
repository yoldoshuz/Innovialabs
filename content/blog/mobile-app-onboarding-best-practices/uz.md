---
title: Ilovada onbording: birinchi ishga tushirishdan keyin ushlab qolish
description: Foydalanuvchini ushlab qoladigan onbording: turlar, bosqichma-bosqich ochish, bo‘sh holatlar, ro‘yxatdan o‘tish va ruxsatlar vaqti, aktivatsiyani o‘lchash.
summary: Yaxshi onbording ilova haqida gapirmaydi, balki insonni iloji boricha tez birinchi foydaga olib boradi. Ro‘yxatdan o‘tish va ruxsatlarni ularning qiymati aniq bo‘lgan paytda so‘rang, muvaffaqiyatni esa asosiy harakatni bajargan foydalanuvchilar ulushi bilan o‘lchang.
---

## Onbordingning asosiy vazifasi

Onbording barcha funksiyalarni ko‘rsatish uchun emas, balki inson **birinchi foydani tez olishi** uchun kerak — bu «aha-moment» deb ataladi. Yetkazib berish ilovasi uchun bu birinchi buyurtma, odatlar trekeri uchun birinchi belgilangan odat, bank uchun birinchi o‘tkazma.

O‘rnatish va shu moment orasidagi har bir narsa — ketib qolish ehtimoli bor nuqta. Shuning uchun qoida oddiy: **ekran qo‘shmang, qadamlarni olib tashlang**.

## Onbording patternlari: taqqoslash

| Pattern | Qanday ishlaydi | Qachon mos | Xavflar |
|---|---|---|---|
| **Xush kelibsiz turi** | Afzalliklar haqida 3–4 slayd | G‘oyasi aniq bo‘lmagan mahsulot | Slaydlar o‘qilmasdan o‘tkazib yuboriladi |
| **Bosqichma-bosqich ochish** | Maslahatlar inson funksiyaga yetganda chiqadi | Funksiyalari ko‘p ilovalar | Ko‘p qalqib chiquvchi maslahatlar jonga tegadi |
| **Bo‘sh holatlar** | Bo‘sh ekran bu yerda nima bo‘lishini tushuntiradi va harakat tugmasini beradi | Ro‘yxatlar, eslatmalar, loyihalar, savat | Maslahatsiz bo‘sh ekran xatoga o‘xshaydi |
| **Interaktiv boshlanish** | Inson darhol maslahatlar bilan birinchi harakatni bajaradi | Foydasi harakatdan keyin ko‘rinadigan mahsulotlar | Ko‘p qadamga cho‘zib bo‘lmaydi |
| **Personalizatsiya** | Qiziqish yoki maqsad haqida 1–3 savol | Kontent va tavsiya servislari | Javoblardan ko‘rinadigan foyda yo‘q so‘rovnoma |

Amalda patternlar birlashtiriladi: masalan, maqsad haqida qisqa savol, keyin interaktiv birinchi qadam va boshqa bo‘limlarda maslahatli bo‘sh holatlar.

## Ro‘yxatdan o‘tishni qachon so‘rash kerak

- Mahsulotni akkauntsiz ko‘rsatish mumkin bo‘lsa, **birinchi ekranda emas**.
- **Qiymat paytida**: «To‘plamni saqlang — yo‘qolmasligi uchun kiring».
- Foydani tushuntiring: qurilmalar o‘rtasida sinxronlash, buyurtmalar tarixi, jarayonni saqlash.
- Kirishni tez qiling: Sign in with Apple, Google, SMS kodli telefon raqami.

Agar mahsulot akkauntsiz ishlamasa (bank, korporativ servis), ro‘yxatdan o‘tishni minimal maydonlarga qisqartiring, qolganini keyinroq yig‘ing.

## Ruxsatlarni qachon so‘rash kerak

Tizim ruxsat oynasini ko‘pincha **cheklangan marta** ko‘rsatish mumkin: iOS’da inson rad etgandan keyin ruxsatni faqat sozlamalarda yoqish mumkin. Shuning uchun:

- Ishga tushirishda hamma narsani so‘ramang. **Bildirishnomalar, kamera, geolokatsiyani** aniq bir harakat uchun kerak bo‘lganda so‘rang.
- Tizim oynasidan oldin **o‘zingizning tushuntiruvchi ekraningizni** ko‘rsating: ruxsat nima uchun kerak va inson nima oladi. Masalan: «Kuryer eshik oldiga kelganini bilish uchun bildirishnomalarni yoqing».
- Agar inson rad etsa, ilova ishlashda davom etishi, kerakli joyda esa ruxsatni sozlamalarda yoqishni yumshoq taklif qilishi kerak.

## Aktivatsiyani qanday o‘lchash kerak

1. Inson qaytib kelishi bilan eng ko‘p bog‘liq **asosiy harakatni** (activation event) aniqlang. Uni ma’lumotlarga qarab tanlang: qaytib kelgan foydalanuvchilar birinchi sessiyada nima qilganini solishtiring.
2. **Onbording voronkasini** tuzing: o‘rnatish → birinchi ishga tushirish → har bir qadam → asosiy harakat. Shunda odamlar qayerda yo‘qolayotgani ko‘rinadi.
3. **Birinchi foydagacha bo‘lgan vaqtni** (time to value) kuzating: birinchi ishga tushirishdan asosiy harakatgacha qancha vaqt o‘tadi.
4. **Kogortalar bo‘yicha qaytishni** kuzating: foydalanuvchilarning qancha qismi 1-, 7-, 30-kuni qaytadi.
5. Onbordingni **A/B test** orqali o‘zgartiring va faqat slaydlar o‘tilishini emas, aktivatsiya va qaytishni solishtiring.

## Ko‘p uchraydigan xatolar

- Birinchi ekrandan oldin umumiy iboralardan iborat beshta slayd.
- O‘rnatishdan so‘ng darhol barcha ruxsatlarni so‘rash.
- Nima qilishni ko‘rsatmaydigan bo‘sh ekran.
- Inson hali yetib bormagan funksiyalarni o‘rgatish.
- Onbordingni aktivatsiya bilan emas, turni oxirigacha ko‘rganlar ulushi bilan baholash.

## FAQ

### Xush kelibsiz turi umuman kerakmi?

Har doim emas. Agar qiymat nom va birinchi ekrandan tushunarli bo‘lsa, tur faqat kechiktiradi. U mahsulot g‘oyasi aniq bo‘lmaganda foydali, lekin unda ham «O‘tkazib yuborish» tugmasini qoldiring va bir necha slayd bilan cheklaning.

### Aktivatsiya uchun asosiy harakatni qanday tanlash kerak?

Qolgan va ketgan foydalanuvchilarning xulq-atvorini solishtiring: dastlabki sessiyalarda qaytganlar qaysi harakatni ko‘proq bajargan. Bu gipoteza, uni keyin tajribalar bilan tasdiqlaysiz.

### Bildirishnomalarni birinchi ishga tushirishda so‘rasa bo‘ladimi?

Texnik jihatdan ha, lekin bu ko‘pincha rad etishga olib keladi: inson bildirishnomalar unga nima uchun kerakligini hali tushunmaydi. So‘rovni foyda aniq ko‘rinadigan payt bilan bog‘lash ishonchliroq.
