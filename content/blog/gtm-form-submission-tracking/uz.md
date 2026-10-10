---
title: Google Tag Manager orqali forma yuborilishini qanday kuzatish
description: Google Tag Managerda forma yuborilishini kuzatishning to‘rt usuli va hodisani GA4, Yandex Metrika hamda reklama piksellariga takrorlarsiz uzatish.
summary: Eng ishonchli usul — dasturchidan forma muvaffaqiyatli yuborilgandan keyin dataLayerga hodisa jo‘natishni so‘rash va uni GTMda «Maxsus hodisa» triggeri bilan ushlash. Shu bitta triggerdan GA4, Yandex Metrika va reklama piksellari uchun teglar ishga tushadi.
---
## Qisqa javob

Google Tag Manager forma yuborilishini to‘rt xil usulda ushlay oladi. Eng yaxshisi — **dataLayer hodisasi**: sayt uni faqat server arizani qabul qilganini tasdiqlagandan keyin yuboradi. Boshqa usullar kodga kirish imkoni bo‘lmaganda yordam beradi, lekin har birining zaif tomoni bor.

## Usullarni solishtirish

| Usul | Qanday ishlaydi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| **«Forma yuborish» triggeri** | Standart submit hodisasini ushlaydi | Dasturchisiz | AJAX-formalarda ko‘pincha ishlamaydi; muvaffaqiyatsiz yuborishlarni ham hisoblashi mumkin |
| **Element ko‘rinishi** | Ekranda «Rahmat» xabari paydo bo‘lganda ishlaydi | AJAX-formalar bilan ishlaydi | Vyorstka yoki matn o‘zgarsa buziladi |
| **Rahmat sahifasi** | `/thank-you` sahifasini ko‘rish | Oddiy va tushunarli | Redirekt kerak; yangilanganda takrorlanadi |
| **dataLayer push** | Sayt muvaffaqiyatli yuborish haqida o‘zi xabar beradi | Eng aniq, parametr uzatish mumkin | Dasturchi kerak |

## 1-usul: dataLayer — tavsiya etiladi

Dasturchi server muvaffaqiyatli javob bergandagi ishlovchiga quyidagini qo‘shadi:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_submit_success',
  form_name: 'brief',
  form_location: 'contacts'
});
```

GTMda:

1. **O‘zgaruvchilar → Foydalanuvchi o‘zgaruvchilari → Data Layer Variable**: `form_name` va `form_location` ni yarating.
2. **Triggerlar → Custom Event**, hodisa nomi `form_submit_success`.
3. Ushbu triggerni quyidagi teglarda ishlating.

dataLayerga ism, telefon va emailni uzatmang — shaxsiy ma’lumotlarni analitikaga yuborish mumkin emas.

## 2-usul: «Forma yuborish» triggeri

Ichki Form o‘zgaruvchilarini (Form ID, Form Classes) yoqing. **Form Submission** turidagi trigger yarating va **Check Validation** belgisini qo‘ying, shunda tekshiruv skripti to‘xtatgan formalar hisoblanmaydi. Triggerni Form ID bo‘yicha kerakli forma bilan cheklang. Preview rejimida albatta tekshiring — JavaScript-freymvorklardagi formalarda bu trigger ko‘pincha jim turadi.

## 3-usul: element ko‘rinishi

Muvaffaqiyat xabarining CSS-selektori bo‘yicha **Element Visibility** triggeri, masalan `.form-success`. «Sahifada bir marta» variantini tanlang va **DOM o‘zgarishlarini kuzatish** ni yoqing — xabar sahifa yuklangandan keyin paydo bo‘ladi. Dasturchi bilan bu klass nomi o‘zgartirilmasligini kelishib oling.

## 4-usul: rahmat sahifasi

`Page Path` `/thank-you` ga teng sharti bilan **Page View** triggeri. Takrorlanmasligi uchun sahifani to‘g‘ridan-to‘g‘ri ochib bo‘lmasligi, yangilanganda esa ariza qayta yuborilmasligi kerak. Bir nechta forma uchun alohida sahifalar yoki manzildagi parametrdan foydalaning.

## Hodisani GA4, Metrika va piksellarga uzatish

Bitta `form_submit_success` triggeriga bir nechta teg bog‘lang.

**GA4.** **Google Analytics: GA4 Event** tegi, hodisa nomi `generate_lead` — bu arizalar uchun Google tavsiya etgan hodisa. Parametr: `form_name` = `{{form_name}}`. So‘ng GA4 interfeysida hodisani **kalit hodisa** (konversiya) deb belgilang.

**Yandex Metrika.** Agar hisoblagich saytda o‘rnatilgan bo‘lsa, **Custom HTML** tegi yetarli:

```html
<script>
  ym(XXXXXXXX, 'reachGoal', 'form_submit_success');
</script>
```

Metrikada xuddi shu identifikator bilan **JavaScript-hodisa** turidagi maqsad yarating.

**Meta Pixel.** Standart hodisani chaqiruvchi Custom HTML:

```html
<script>
  fbq('track', 'Lead');
</script>
```

**Google Ads.** Kabinetdagi konversiya ID va yorlig‘i bilan **Google Ads Conversion Tracking** tegi.

Saytda cookie roziligi banneri bo‘lsa, teglarni Consent Mode bilan sozlang, shunda rozilik talab qilinadigan joylarda ular foydalanuvchi ruxsat bermaguncha ishlamaydi.

## Qanday tekshirish

1. GTMda **Preview** ni bosing va saytda formani yuboring.
2. Tag Assistantda hodisa paydo bo‘lganini va barcha teglar «Fired» holatida ekanini tekshiring.
3. GA4 da **DebugView** hisobotini, Metrika uchun esa `?_ym_debug=1` rejimini tekshiring.
4. Formani validatsiya xatosi bilan yuboring — teglar ishlamasligi kerak.
5. Shundan keyingina konteynerni versiyaning tushunarli tavsifi bilan nashr qiling.

## FAQ

### Nega «Forma yuborish» triggeri ishlamaydi?

Ehtimol, forma standart submit hodisasisiz JavaScript orqali yuboriladi yoki skript hodisaning tarqalishini to‘xtatadi. dataLayer yoki element ko‘rinishiga o‘ting.

### GA4 ning avtomatik forma kuzatuvi yetarli emasmi?

GA4 kengaytirilgan statistikasi `form_start` va `form_submit` hodisalarini yig‘a oladi, ammo yuborish muvaffaqiyatli bo‘lganini bilmaydi. Konversiyalar uchun server javobidan keyin yuboriladigan o‘z hodisangiz yaxshiroq.

### Har bir forma uchun alohida teg kerakmi?

Yo‘q. Har bir tizim uchun bitta trigger va bitta teg yetarli, formalarni esa `form_name` parametri farqlaydi. Bu konteynerni qo‘llab-quvvatlashni osonlashtiradi.
