---
title: Google Analytics 4 nima va uning ma’lumotlar modeli qanday ishlaydi
description: Google Analytics 4 oddiy tilda: hodisalarga asoslangan model, foydalanuvchilar, seanslar, asosiy hodisalar, hisobotlar va Universal Analytics’dan farqi.
summary: Google Analytics 4 — Google’ning saytlar va ilovalar uchun bepul analitikasi bo‘lib, unda sahifani ko‘rishdan xaridgacha hamma narsa parametrli hodisa sifatida yoziladi; biznes uchun muhim hodisalarni asosiy deb belgilaysiz va natijani standart hisobotlar hamda tadqiqotlarda ko‘rasiz.
---
## Qisqa javob

**Google Analytics 4 (GA4)** — Google’ning saytlar va mobil ilovalar uchun analitika xizmati. U uchta asosiy savolga javob beradi: sizga **kim** keladi, **qayerdan** keladi va **nima qiladi** — sahifalarni ko‘radi, bosadi, forma yuboradi, xarid qiladi.

Asosiy g‘oya: **har qanday o‘zaro ta’sir — bu hodisa**. Sahifani ko‘rish, aylantirish, telefon raqamini bosish va xarid bir xil tarzda yoziladi: hodisa nomi va tafsilotlar beruvchi parametrlar.

GA4 2023-yilda ma’lumotlarni qayta ishlashni to‘xtatgan **Universal Analytics** o‘rnini egalladi. Asosiy o‘zgarish — seanslar va sahifa ko‘rishlariga asoslangan modeldan hodisalar va foydalanuvchilarga asoslangan modelga o‘tish.

## Ma’lumotlar modeli: to‘rtta g‘isht

### Hodisalar

**Hodisa** — foydalanuvchining har qanday harakati. GA4’da ularning to‘rt turi bor:

- **Avtomatik yig‘iladigan:** masalan, `first_visit`, `session_start`.
- **Kengaytirilgan o‘lchov** (enhanced measurement): kodsiz, bitta tugma bilan yoqiladi — sahifa ko‘rishlari, aylantirish, tashqi kliklar, sayt bo‘yicha qidiruv, fayl yuklab olish, video va formalar bilan ishlash.
- **Tavsiya etilgan:** Google odatiy harakatlar uchun taklif qiladigan nomlar — `generate_lead`, `sign_up`, `purchase`.
- **Maxsus:** yuqoridagilarning hech biri mos kelmaganda o‘zingizning hodisalaringiz.

Har bir hodisada **parametrlar** bor: sahifa manzili, tugma matni, buyurtma summasi. O‘z parametringizni hisobotlarda ishlatish uchun uni **maxsus o‘lcham** (custom dimension) yoki ko‘rsatkich sifatida ro‘yxatdan o‘tkazish kerak.

GA4 gtag.js orqali o‘rnatilgan saytdan ariza hodisasini yuborish:

```js
gtag('event', 'generate_lead', {
  form_name: 'contact',
  value: 1
});
```

### Foydalanuvchilar

GA4 **foydalanuvchilarni** qurilma va brauzer identifikatori bo‘yicha, xohlasangiz, avtorizatsiyadan o‘tganlar uchun o‘zingizning **User-ID** bo‘yicha ham sanaydi. Hisobotlarda standart holatda **faol foydalanuvchilar** hamda **yangi foydalanuvchilar** ko‘rsatiladi.

### Seanslar

**Seans** `session_start` hodisasi bilan boshlanadi va faolsizlik davridan keyin tugaydi — standart bo‘yicha 30 daqiqa. GA4 **faol seans** (engaged session) tushunchasini kiritadi: u 10 soniyadan uzoq davom etgan, asosiy hodisani o‘z ichiga olgan yoki kamida ikkita sahifa ko‘rilgan seans. **Faollik darajasi** — shunday seanslar ulushi, GA4’dagi **rad etish ko‘rsatkichi** esa shunchaki uning teskarisi.

### Asosiy hodisalar

**Asosiy hodisalar** (key events) — biznes uchun muhim hodisalar: ariza, qo‘ng‘iroq, ro‘yxatdan o‘tish, xarid. Istalgan hodisani sozlamalarda asosiy deb belgilash mumkin, shundan so‘ng GA4 uni barcha hisobotlarda ko‘rsatadi va trafik manbalariga bog‘laydi. Ilgari GA4’da ular konversiyalar deb atalgan; Google Ads’da bu so‘z hamon ishlatiladi.

## Ma’lumotlar GA4’ga qanday tushadi

1. Sayt yoki ilova uchun **resurs** (property) va **ma’lumotlar oqimi** (data stream) yarating.
2. Tegni o‘rnating: oqim identifikatori bilan gtag.js kodini qo‘ying (u `G-` bilan boshlanadi), Google Tag Manager yoki CMS integratsiyasidan foydalaning.
3. Kengaytirilgan o‘lchov sozlamalarini tekshiring.
4. Kerakli hodisalarni yuboring va muhimlarini asosiy deb belgilang.
5. **Google Ads**ni va kerak bo‘lsa, xom ma’lumotlarni eksport qilish uchun **BigQuery**ni ulang.

## Standart hisobotlar

- **Realtime** — hozir nima bo‘layotgani; kuzatuv ishlayotganini tekshirish uchun qulay.
- **Acquisition** — foydalanuvchilar va seanslar qayerdan keladi: kanallar, manbalar, kampaniyalar.
- **Engagement** — hodisalar, sahifalar va ekranlar, asosiy hodisalar.
- **Monetization** — elektron savdo sozlangan bo‘lsa, xaridlar va daromad.
- **Retention** — foydalanuvchilar qanchalik tez-tez qaytadi.
- **User attributes va Tech** — geografiya, til, qurilmalar, brauzerlar.

Standart hisobotlar javob bermaydigan savollar uchun **Explorations** (tadqiqotlar) bor: erkin jadvallar, voronkalar va yo‘llar tahlili.

## GA4 Universal Analytics’dan nimasi bilan farq qiladi

| | Universal Analytics | GA4 |
|---|---|---|
| Asosiy birlik | Seans va sahifa ko‘rish | Hodisa |
| Maqsadlar | Alohida «maqsadlar» sozlamasi | Asosiy deb belgilangan istalgan hodisa |
| Sayt va ilova | Alohida mahsulotlar | Bitta resurs, bir nechta oqim |
| Rad etishlar | Bitta sahifali seanslar | Faollik darajasining teskarisi |
| Xom ma’lumotlar | Faqat pullik versiyada | BigQuery’ga eksport bepul versiyada ham mavjud |

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- Birorta ham asosiy hodisa belgilanmagan: hisobotlar trafikni ko‘rsatadi, natijani esa yo‘q.
- Bitta forma ikki marta sanaladi: kengaytirilgan o‘lchov va o‘zingizning hodisangiz orqali.
- O‘z parametrlaringiz maxsus o‘lcham sifatida ro‘yxatdan o‘tkazilmasdan ishlatiladi.
- Ma’lumotlarni saqlashning qisqa standart muddati qoldirilgan va tadqiqotlar faqat so‘nggi oylar uchun mavjud.
- Jamoaning ichki trafigi filtrlanmagan.

## FAQ

### GA4 bepulmi?

Ha, standart versiya bepul va ko‘pchilik kichik va o‘rta kompaniyalarga mos keladi. Pullik versiya katta hajmdagi ma’lumotlar va xizmatga alohida talablari bo‘lgan yirik kompaniyalar uchun mavjud.

### Nega GA4’dagi raqamlar reklama kabineti yoki CRM bilan mos kelmaydi?

Har bir tizim o‘zicha sanaydi: reklama kabineti — kliklarni, GA4 — saytdagi foydalanuvchilar va seanslarni, CRM — haqiqiy arizalarni. Cookie’larning bloklanishi, reklama blokerlari va atributsiya qoidalari ham ta’sir qiladi. Har bir tizimdan o‘z savoli uchun foydalaning, bir xil raqamlarni kutmang.

### Universal Analytics ma’lumotlarini GA4’da ko‘rish mumkinmi?

Yo‘q. Mahsulotlarning ma’lumotlar modellari turlicha va Universal Analytics tarixi GA4’ga ko‘chirilmaydi. Eski va yangi davrlarni to‘g‘ridan-to‘g‘ri solishtirish ham ishonchli emas, chunki metrikalar turlicha hisoblanadi.
