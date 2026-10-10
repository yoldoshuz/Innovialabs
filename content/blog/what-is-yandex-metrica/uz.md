---
title: Yandex Metrica nima va u nimalarni kuzata oladi
description: Yandex Metrica oddiy tilda: hisoblagich, maqsadlar, Vebvizor, kliklar xaritasi, hisobotlar, maxfiylik va u MDH auditoriyasi uchun qachon foydali.
summary: Yandex Metrica — tashriflar, manbalar va maqsadlarni sanaydigan bepul veb-analitika xizmati bo‘lib, ko‘pchilik bepul vositalardan farqli o‘laroq seans yozuvlari (Vebvizor) hamda kliklar va aylantirish xaritalarini o‘z ichiga oladi, shuning uchun MDH auditoriyasiga ega saytlar uni ko‘p ishlatadi.
---
## Qisqa javob

**Yandex Metrica** — bepul veb-analitika xizmati. Uning kodi (**hisoblagich**) saytga o‘rnatilgach, qancha odam kelayotgani, qayerdan kelayotgani, nima qilayotgani va ulardan kim maqsadlaringizni bajarayotgani ko‘rinadi.

Asosiy xususiyati — xulq-atvorni tahlil qilish vositalari ichiga o‘rnatilgan: **Vebvizor** haqiqiy tashriflarni video kabi qayta ko‘rsatadi, **xaritalar** esa odamlar qayerni bosayotgani va sahifani qayergacha aylantirayotganini ko‘rsatadi. Boshqa ko‘plab yechimlarda buning uchun alohida mahsulot kerak bo‘ladi.

## Hisoblagich

Hisoblagich — Metrica interfeysida yaratiladigan va barcha sahifalarga, odatda `<head>` ichiga qo‘shiladigan JavaScript parchasi. Yaratishda quyidagi opsiyalar tanlanadi:

- **Vebvizor** — tashriflarni ko‘rish uchun yozib olish.
- **Kliklar xaritasi** — kliklar haqida ma’lumot yig‘ish.
- **Aniq rad etish ko‘rsatkichi** — odam sahifada ma’lum vaqt qolgan bo‘lsa, tashrif rad etish deb hisoblanmaydi.
- **Elektron tijorat** — buyurtmalar haqidagi ma’lumotlarni `dataLayer`dan o‘qish.

Hisoblagichni to‘g‘ridan-to‘g‘ri kodga, Google Tag Manager orqali yoki CMS plagini yordamida o‘rnatish mumkin. O‘rnatgandan keyin interfeysda hisoblagich holatini tekshiring va saytni oching — tashrif paydo bo‘lishi kerak.

## Maqsadlar

**Maqsad** — siz sanamoqchi bo‘lgan harakat: ariza, qo‘ng‘iroq, xarid. Asosiy turlari:

- **Sahifaga tashrif** — «Rahmat» yoki buyurtmani rasmiylashtirish sahifasi ochildi.
- **JavaScript-hodisa** — sayt koddan signal yuboradi, masalan, forma muvaffaqiyatli yuborilgandan keyin.
- **Kontaktlarni bosish** — telefon raqami, email yoki messenjer havolasini bosish.
- **Forma yuborish** — sahifadagi istalgan forma.
- **Ko‘rishlar soni** — tashrifchi kamida N ta sahifani ochdi.
- **Tarkibiy maqsad** — ketma-ket bir nechta qadam, aslida kichik voronka.

JavaScript-maqsadni yuborish (raqamni o‘z hisoblagichingiz raqamiga almashtiring):

```js
ym(12345678, 'reachGoal', 'lead_form');
```

Maqsadlar barcha hisobotlarda o‘lcham sifatida mavjud: qaysi manbalar, sahifalar va qurilmalar natija berayotgani ko‘rinadi.

## Vebvizor va xaritalar

- **Vebvizor** sichqoncha harakatlari, kliklar, aylantirish va sahifalar orasidagi o‘tishlarni yozib oladi. Buyurtma formasini tashlab ketgan odamlarning bir necha o‘nta yozuvi ko‘pincha har qanday jadvaldan ko‘ra ko‘proq narsani tushuntiradi.
- **Kliklar xaritasi** odamlar qayerni bosayotganini, jumladan, havola bo‘lmagan elementlarni ham ko‘rsatadi.
- **Havolalar xaritasi** — har bir havoladan qanchalik tez-tez foydalanilishi.
- **Aylantirish xaritasi** — odamlar sahifani qayergacha varaqlashi va qayerda ko‘proq to‘xtashi.
- **Formalar analitikasi** — qaysi maydonlar to‘ldirilishi va forma qaysi maydonda tashlab ketilishi.

## Standart hisobotlar

- **Manbalar** — trafik manbalari, qidiruv tizimlari, ijtimoiy tarmoqlar, reklama tizimlari va UTM-teglar bo‘yicha jamlanma.
- **Konversiyalar** — manbalar va vaqt bo‘yicha maqsadlarga erishish.
- **Tashriflar** — tashriflar, tashrifchilar, ko‘rishlar, rad etishlar.
- **Auditoriya** — geografiya, jins va yoshning taxminiy bahosi, qiziqishlar.
- **Texnologiyalar** — qurilmalar, brauzerlar, ekran o‘lchamlari.
- **Elektron tijorat** — sozlangan bo‘lsa, buyurtmalar va daromad.

Metrica’da **rad etish** — bitta sahifa ko‘rilgan va 15 soniyadan kam davom etgan tashrif. Katta hajmlarda hisobotlar **tanlanma** (sampling) asosida qurilishi mumkin; tezlik hisobiga aniqlikni oshiradigan sozlama bor. Tashriflar va xitlar bo‘yicha xom ma’lumotlar **Logs API** orqali olinadi.

## Maxfiylik

Vebvizor foydalanuvchilar harakatlarini ko‘radi, shuning uchun unga ehtiyotkorlik bilan yondashish kerak:

- Shaxsiy ma’lumotlar kiritiladigan maydonlar tarkibini yozib olmang. Vebvizorning maydonlar tarkibi sozlamalaridan foydalaning va maxfiy bloklarni `ym-hide-content` klassi bilan belgilang.
- **Maxfiylik siyosatida** analitika va cookie’lar haqida yozing, auditoriya yoki qonun talab qilgan joyda cookie haqida bildirishnoma ko‘rsating.
- Shaxsiy ma’lumotlar haqidagi mahalliy qonunchilik talablarini, jumladan, ular qayerda qayta ishlanishini tekshiring. O‘zbekistonda bu «Shaxsga doir ma’lumotlar to‘g‘risida»gi Qonun.
- Hisoblagichga kirish huquqini faqat kerakli odamlarga, iloji bo‘lsa, faqat ko‘rish uchun bering.

## Metrica qachon ayniqsa foydali

- Auditoriyangiz O‘zbekiston, Qozog‘iston va boshqa MDH mamlakatlarida bo‘lib, u yerda Yandex qidiruvi va servislaridan keng foydalaniladi.
- Siz **Yandex Direct** reklamasini yuritasiz: Metrica maqsadlari reklamani optimallashtirish va auditoriyalar yig‘ish uchun ishlatiladi.
- Alohida vosita uchun pul to‘lamasdan seans yozuvlari va kliklar xaritasi kerak.
- Jamoaga rus tilidagi interfeys qulayroq.

Ko‘plab saytlar Metrica’ni Google Analytics 4 bilan birga ishlatadi: har biri o‘z reklama ekotizimini qamrab oladi, ma’lumotlarni solishtirish esa kuzatuvdagi xatolarni topishga yordam beradi.

## FAQ

### Yandex Metrica bepulmi?

Ha, xizmat, jumladan, Vebvizor va xaritalar bepul. Cheklovlar asosan ma’lumotlar hajmi va ularning bir qismini, masalan, Vebvizor yozuvlarini saqlash muddatiga tegishli.

### Metrica hisoblagichi saytni sekinlashtiradimi?

Kod asinxron yuklanadi va sahifa chizilishini bloklamaydi. Vebvizor yoqilganda skript ko‘proq ish bajaradi, shuning uchun o‘rnatgandan keyin, ayniqsa mobil qurilmalarda, tezlikni tekshiring.

### Metrica’dan Yandex Direct’siz foydalansa bo‘ladimi?

Ha. Metrica har qanday trafik bilan ishlaydi: Google Ads, Meta Ads, SEO, tarqatmalar, messenjerlar. Direct bilan integratsiya — majburiy shart emas, qo‘shimcha imkoniyat.
