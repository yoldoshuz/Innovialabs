---
title: API xavfsizligi: dasturchi uchun eng yaxshi amaliyotlar chek-listi
description: OWASP API Top 10 asosidagi API xavfsizligi chek-listi: autentifikatsiya, obyektlarga kirish huquqi, validatsiya, so‘rov limitlari, xatolar, CORS va loglash.
summary: Xavfsiz API har bir so‘rovni autentifikatsiya qiladi, foydalanuvchining har bir aniq obyekt va maydonga huquqini serverda tekshiradi, kiritilgan ma’lumotni qat’iy sxemalar bo‘yicha validatsiya qiladi, so‘rovlar hajmini cheklaydi va xavfsizlik hodisalarini loglaydi.
---
## Qisqa javob

API’dagi jiddiy zaifliklarning aksariyati g‘ayrioddiy emas. API shunchaki mijozga haddan tashqari ishonadi: ID to‘g‘ri bo‘lgani uchun obyektni qaytaradi, so‘rov tanasidagi barcha maydonlarni saqlaydi yoki cheksiz so‘rovlarga ruxsat beradi. **OWASP API Security Top 10** shu andozalarni jamlaydi. Quyidagi chek-listdan ishlab chiqish va kod review paytida foydalaning.

## OWASP API Top 10 bitta jadvalda

| Xavf | Nima noto‘g‘ri ketadi | Nima qilish kerak |
|---|---|---|
| **API1 Broken Object Level Authorization** | Foydalanuvchi `/orders/123` ni `/orders/124` ga o‘zgartirib, boshqaning buyurtmasini ko‘radi | Har bir obyekt egasini serverda tekshirish |
| **API2 Broken Authentication** | Zaif tokenlar, terib ko‘rishdan himoya yo‘q, muddatsiz tokenlar | Sinalgan kutubxonalar, qisqa muddatli tokenlar, kirishga limitlar |
| **API3 Broken Object Property Level Authorization** | API ortiqcha maydonlarni qaytaradi yoki `role`, `balance` ni o‘rnatishga ruxsat beradi | Kirish va javob uchun aniq sxemalar |
| **API4 Unrestricted Resource Consumption** | So‘rovlar, sahifa hajmi, fayl hajmiga limit yo‘q | Rate limit, paginatsiya cheklovi, taymautlar |
| **API5 Broken Function Level Authorization** | Oddiy foydalanuvchi administrator endpointini chaqiradi | Har bir endpointda rolni tekshirish, standart bo‘yicha taqiqlash |
| **API6 Unrestricted Access to Sensitive Business Flows** | Botlar tovarni sotib olib tugatadi yoki ro‘yxatdan o‘tishni spam qiladi | Biznes-mantiq darajasidagi limitlar va botlardan himoya |
| **API7 Server Side Request Forgery** | API foydalanuvchi bergan URL’ni yuklaydi va ichki servislarga yetib boradi | Manzillar oq ro‘yxati, ichki tarmoqlarni bloklash |
| **API8 Security Misconfiguration** | Batafsil xatolar, ochiq CORS, TLS yo‘q | Xavfsiz standart sozlamalar, konfiglar review’si |
| **API9 Improper Inventory Management** | Eski `/v1` yoki test endpointlari hali ishlayapti | Reyestr yuritish, eski versiyalarni o‘chirish |
| **API10 Unsafe Consumption of APIs** | Uchinchi tomon API ma’lumotlariga ko‘r-ko‘rona ishonish | Tashqi ma’lumotni foydalanuvchi kiritgani kabi validatsiya qilish |

## Autentifikatsiya

- Har bir endpoint, agar u **aniq** ommaviy deb e’lon qilinmagan bo‘lsa, autentifikatsiya talab qiladi.
- Standart mexanizmlar (OAuth 2.0 / OpenID Connect, sessiyalar, to‘g‘ri sozlangan JWT) va qo‘llab-quvvatlanadigan kutubxonalardan foydalaning — o‘z token formatingizni o‘ylab topmang.
- Access tokenlar qisqa yashaydi; yangilash va bekor qilish o‘ylab chiqilgan.
- Kirish, parolni tiklash va OTP endpointlarida qat’iy limitlar.
- Serverlararo integratsiyalar uchun API kalitlar huquqlar bo‘yicha cheklangan, muntazam almashtiriladi va hech qachon mobil ilova yoki frontend kodiga tushmaydi.

## Obyekt darajasidagi avtorizatsiya

Bu API’dagi eng ko‘p uchraydigan kritik xato. Qoida: **obyektni hech qachon faqat ID bo‘yicha yuklamang** — doim kim so‘rayotganini hisobga oling.

```ts
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});
```

Ketma-ket ID’lar o‘rniga tasodifiy UUID’lar taxmin qilishni qiyinlashtiradi, lekin bu tekshiruvning **o‘rnini bosmaydi**.

## Validatsiya va mass assignment

- So‘rov tanasi, query parametrlar va sarlavhalarni **qat’iy sxema** bo‘yicha tekshiring: turlar, uzunliklar, formatlar, ruxsat etilgan qiymatlar.
- Noma’lum maydonlarni jimgina saqlamang, rad eting. Aks holda foydalanuvchi profilni yangilash bilan birga `"role": "admin"` yuboradi.
- Ma’lumotlarni bazaga aniq o‘tkazing; `req.body`ni to‘g‘ridan-to‘g‘ri ORM update’ga bermang.
- Javob sxemasi tashqariga aynan qaysi maydonlar chiqishini sanab o‘tadi — bazadagi yozuvni butunlay serializatsiya qilmang.

```ts
const UpdateProfile = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
}).strict();

const data = UpdateProfile.parse(req.body);
```

## So‘rov va resurs limitlari

- Foydalanuvchi, API kalit va IP bo‘yicha limitlar, qimmat va sezgir endpointlar uchun qat’iyroq.
- Sahifa, so‘rov tanasi, yuklanadigan fayl hajmi va so‘rov murakkabligining maksimal chegarasi (GraphQL uchun — chuqurlik va narx cheklovlari).
- Bazaga va tashqi so‘rovlarga taymautlar.
- Vijdonli mijozlar sekinlashishi uchun `429 Too Many Requests` qaytaring.

## Xato xabarlari

- Mijoz qisqa xabar va xato ID’sini oladi, tafsilotlar loglarga yoziladi.
- Javoblarda stack trace, SQL bo‘laklari va ichki xost nomlari yo‘q.
- Kirish va parolni tiklashda bunday email mavjudligini oshkor qilmang.
- Obyekt mavjudligini tasdiqlamaslik uchun «topilmadi» va «sizniki emas» holatlariga bir xil javob bering.

## CORS

- Avtorizatsiyali API uchun `*` emas, faqat brauzerdan kirish haqiqatan kerak bo‘lgan origin’larga ruxsat bering.
- Hech qachon har qanday kiruvchi `Origin`ni `Access-Control-Allow-Credentials: true` bilan birga qaytarmang.
- Esda tuting: CORS **faqat brauzerlarni** boshqaradi. U API’ni skriptlar, serverlar va curl’dan himoya qilmaydi.

## Loglar va API reyestri

- Muvaffaqiyatsiz kirishlar, kirish rad etilishi, validatsiya xatolari va limit ishga tushishini foydalanuvchi ID va so‘rov ID bilan loglang.
- Loglarga hech qachon parollar, tokenlar va to‘liq shaxsiy ma’lumotlarni yozmang.
- G‘ayrioddiy andozalar uchun ogohlantirishlar sozlang, masalan bitta foydalanuvchi minglab turli obyekt ID’larini terib ko‘rganda.
- API versiyalari, muhitlar va endpointlarning dolzarb ro‘yxatini yuriting; endi ishlatilmaydiganlarini o‘chiring.

## FAQ

### Autentifikatsiya uchun API kalit yetarlimi?

Ishonchli hamkor bilan server–server integratsiyasi uchun, agar kalit huquqlar bo‘yicha cheklangan, muntazam almashtirilsa va faqat HTTPS orqali yuborilsa, yetarli bo‘lishi mumkin. Oxirgi foydalanuvchilar uchun ilovaga joylangan kalit sir emas — foydalanuvchi autentifikatsiyasi kerak.

### GraphQL alohida himoyaga muhtojmi?

Xuddi shu tamoyillar amal qiladi, qo‘shimcha ravishda maxsus limitlar: so‘rov chuqurligi va narxi, batching cheklovi hamda faqat kirish nuqtasida emas, har bir resolver’da avtorizatsiya. API ommaviy bo‘lmasa, production’da introspection’ni o‘chirishni ko‘rib chiqing.

### API shlyuzi yoki WAF yetarlimi?

Shlyuz autentifikatsiya, limitlar va loglashda yordam beradi, lekin 124-buyurtma shu foydalanuvchiga tegishlimi, buni bilmaydi. Obyekt va maydon darajasidagi avtorizatsiya ilova kodida bo‘lishi kerak.
