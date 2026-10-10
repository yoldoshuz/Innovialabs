---
title: REST API loyihalash: nomlash, versiyalar, xatolar
description: REST API uchun aniq qoidalar: URL nomlash, paginatsiya, filtrlash, versiyalash, yagona xato formati va idempotentlik kalitlari misollar bilan.
summary: Yaxshi REST API oldindan bashorat qilinadi: URL’larda ko‘plikdagi otlar, paginatsiya va filtrlar uchun yagona qoidalar, aniq versiya, barcha endpoint’lar uchun bitta xato formati va takrorlanmasligi kerak bo‘lgan amallar uchun idempotentlik kalitlari.
---
## Asosiy tamoyil: bashorat qilinuvchanlik

Yaxshi API har bir endpoint hujjatini o‘qimasdan ham tushunarli bo‘ladi. Dasturchi ikkita manzilni ko‘rib, uchinchisi qanday tuzilganini taxmin qila oladi. Quyidagi qoidalar aynan shunday natija beradi.

## URL nomlash

Qoidalar:

- **Ko‘plikdagi otlar**: `/products`, `/orders`.
- **Fe’llarsiz**: amalni HTTP metodi belgilaydi.
- **kebab-case va kichik harflar**: `/DeliveryZones` emas, `/delivery-zones`.
- **Ichma-ichlik bir darajadan oshmasin**: `/orders/15/items` — normal, `/users/3/orders/15/items/2/reviews` — allaqachon og‘ir.

| Yomon | Yaxshi |
|---|---|
| `GET /getAllProducts` | `GET /products` |
| `POST /createOrder` | `POST /orders` |
| `POST /deleteUser?id=3` | `DELETE /users/3` |
| `GET /Product_List` | `GET /products` |

CRUD’ga sig‘maydigan amallar uchun ichki resurs ishlatish mumkin: `POST /orders/15/cancel`. Eng muhimi — butun API uchun bitta uslub.

## Paginatsiya

Kolleksiyani hech qachon to‘liq qaytarmang: ma’lumotlar o‘sadi va bir kun javob juda katta bo‘lib ketadi.

Ikki keng tarqalgan yondashuv:

- **Offset**: `GET /products?limit=20&offset=40`. Oddiy, kerakli sahifaga o‘tish mumkin, lekin katta jadvallarda sekinlashadi va yangi yozuvlar qo‘shilganda ba’zilarini «tushirib qoldirishi» mumkin.
- **Cursor**: `GET /products?limit=20&cursor=eyJpZCI6NDJ9`. Lentalar va katta hajmlar uchun barqaror, lekin to‘g‘ridan-to‘g‘ri 10-sahifaga o‘tib bo‘lmaydi.

Javobda ma’lumotlar va keyingi qadam uchun kerakli axborot bo‘lishi kerak:

```json
{
  "data": [{ "id": 41, "name": "Choynak" }],
  "pagination": { "nextCursor": "eyJpZCI6NDJ9", "hasMore": true }
}
```

Mijoz million yozuv so‘ramasligi uchun serverda **maksimal limit** belgilang.

## Filtrlash va saralash

Tushunarli nomli query-parametrlardan foydalaning:

```text
GET /products?category=kitchen&minPrice=100000&sort=-createdAt
```

- Filtrlar — maydon nomlari bilan atalgan oddiy parametrlar.
- Saralash — bitta `sort` parametri, minus kamayish tartibini bildiradi.
- Qidiruv — alohida parametr, masalan `q`.
- Noma’lum parametrni jimgina e’tiborsiz qoldirgandan ko‘ra 400 bilan rad etgan yaxshiroq.

## Versiyalash

Tashqi mijozlar foydalanadigan API ertami-kechmi mos kelmaydigan tarzda o‘zgaradi. Versiya eski mijozlarni buzmaslikka imkon beradi.

- **URL’da**: `/v1/products` — eng ko‘rinarli va oddiy variant.
- **Sarlavhada**: `Accept: application/vnd.example.v2+json` — URL toza qoladi, lekin debug qilish qiyinroq.

Buzuvchi o‘zgarish nima: maydonni o‘chirish yoki nomini o‘zgartirish, turini almashtirish, so‘rovga yangi majburiy maydon qo‘shish. Javobga yangi ixtiyoriy maydon qo‘shish odatda yangi versiyani talab qilmaydi. Eski versiya eskirganini oldindan e’lon qiling va mijozlarga o‘tish uchun vaqt bering.

## Yagona xato formati

Barcha endpoint’lar xatolarni bir xil qaytarishi kerak. Qulay asos — **Problem Details** standarti (RFC 9457):

```json
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "price maydoni noldan katta bo‘lishi kerak",
  "errors": [{ "field": "price", "message": "must be > 0" }]
}
```

Qoidalar:

- Har doim to‘g‘ri HTTP kodi, ichida xato bilan 200 emas.
- Mijoz unga javob bera olishi uchun mashina o‘qiy oladigan xato turi yoki kodi.
- Dasturchi uchun tushunarli xabar.
- Javobda stack trace va SQL so‘rovlari bo‘lmasin.

## Idempotentlik kalitlari

Takrorlanishi xavfli amallar — to‘lov, buyurtma yaratish — uchun mijoz noyob kalit yuboradi:

```http
POST /payments
Idempotency-Key: 7f3c2a90-1b4e-4d2a-9c11-5e8f0a6b7d21
```

Server natijani shu kalit bo‘yicha saqlaydi. So‘rov qayta kelsa — timeout yoki ikki marta bosish sababli — server ikkinchi to‘lovni yaratmaydi, balki saqlangan javobni qaytaradi.

## Ko‘p uchraydigan xatolar

- **Bitta API’da turli uslublar**: ba’zi javoblarda `camelCase`, boshqalarida `snake_case`.
- **Sanalar lokal formatda.** Vaqt zonasi bilan ISO 8601’dan foydalaning.
- **Ichki id’lar va baza maydonlarini o‘zgarishsiz berish.** API — bu shartnoma, jadval dampi emas.
- **Hujjatlar yo‘q.** OpenAPI spetsifikatsiyasi buni hal qiladi va mijozlarni generatsiya qilishga imkon beradi.

## FAQ

### Offset yoki cursor paginatsiyasini tanlash kerakmi?

Admin panellar va sahifalar bo‘yicha o‘tiladigan jadvallar uchun offset mos keladi. Lentalar, cheksiz aylantirish va katta ma’lumotlar uchun cursor ishonchliroq.

### API’dan faqat o‘z frontend’imiz foydalansa, versiya kerakmi?

Frontend va backend birga chiqarilsa, URL’dagi versiya kerak bo‘lmasligi mumkin. Lekin foydalanuvchilar kechikib yangilaydigan mobil ilovalar uchun versiyalash deyarli majburiy.

### JSON’da camelCase yoki snake_case?

Ikkalasi ham ishlaydi. Muhimi — bittasini tanlab, barcha endpoint’larda unga amal qilish.
