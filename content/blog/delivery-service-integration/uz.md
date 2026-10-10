---
title: Internet-do‘konga yetkazib berish xizmatlarini qanday integratsiya qilish
description: Yetkazib berish integratsiyasi: checkout’da narxni hisoblash, API orqali jo‘natma yaratish, statuslarni sinxronlash, topshirish punktlari va bir nechta xizmat bilan ishlash.
summary: Yetkazib berish integratsiyasi — xizmat API’si orqali bog‘langan to‘rtta jarayon: checkout’da narx va muddatni hisoblash, to‘lovdan keyin jo‘natmani avtomatik yaratish, statuslarni buyurtmaga sinxronlash va topshirish punktini tanlash, bir nechta xizmat uchun esa do‘kon kodida umumiy adapter qatlami.
---
## Qisqa javob

Yetkazib berish xizmatining to‘liq integratsiyasi to‘rtta vazifani hal qiladi:

1. Narx va muddatni to‘g‘ridan-to‘g‘ri checkout’da **hisoblash**.
2. To‘lovdan keyin xizmat kabinetiga qo‘lda kiritmasdan, API orqali **jo‘natma yaratish**.
3. **Statuslarni sinxronlash**: do‘kon ham, xaridor ham posilka qayerdaligini ko‘radi.
4. **Topshirish punktlari**: xaritada tanlash va punkt kodini xizmatga uzatish.

Xizmatlar bir nechta bo‘lsa, do‘kon va ularning API’lari orasiga **adapter qatlami** qo‘yiladi, shunda tizimning qolgan qismi yagona format bilan ishlaydi.

## Checkout’da narxni hisoblash

Xaridor yetkazib berish narxi va muddatini to‘lovdan oldin ko‘rishi kerak. Hisoblash variantlari:

- **Xizmat API’si orqali** real vaqtda — eng aniq, vazn, o‘lcham va manzilni hisobga oladi.
- **O‘z tariflar jadvalingiz bo‘yicha** — tezroq va begona API’ning ishlashiga bog‘liq emas, lekin jadvalni yangilab turish kerak.
- **Gibrid**: API o‘z vaqtida javob bermasa, jadval zaxira variant sifatida ishlaydi.

Aniq hisob uchun nima kerak:

- katalogdagi har bir tovarning **vazni va o‘lchamlari**;
- qadoqlash qoidalari: bir nechta tovar bitta qutida yoki alohida;
- omborlar bir nechta bo‘lsa, jo‘natish ombori;
- qabul qiluvchining normallashtirilgan manzili yoki koordinatalari.

Hisob natijalarini qisqa muddatga keshlang va so‘rovga taymaut qo‘ying: xizmatning sekin javobi tufayli checkout qotib qolmasligi kerak.

## API orqali jo‘natma yaratish

To‘lovdan keyin (yoki qabul qilganda to‘lanadigan buyurtma tasdiqlangach) do‘kon xizmatga ariza yuboradi: qabul qiluvchi, manzil yoki topshirish punkti, tarkib, vazn, e’lon qilingan qiymat, qabul qilganda to‘lanadigan summa.

Yaxshi amaliyot:

- sinxron chaqiruv o‘rniga **vazifalar navbati**: xizmat API’si ishlamay qolsa, ariza keyinroq qayta yuboriladi;
- **idempotentlik**: qayta urinish ikkinchi jo‘natmani yaratmaydi;
- **trek-raqamni** saqlash va yorliqlarni to‘g‘ridan-to‘g‘ri admin paneldan chop etish;
- xizmat arizani rad etsa, menejerga tushunarli xato xabari.

## Statuslarni sinxronlash

Statuslarni olishning ikki usuli bor:

- **Webhook** — status o‘zgarganda xizmatning o‘zi hodisa yuboradi. Tez va tejamkor.
- **So‘rov (polling)** — do‘kon jadval bo‘yicha faol jo‘natmalar statuslarini so‘raydi. Webhook bo‘lmasa mos keladi.

Har bir xizmatda statuslar turlicha nomlanadi, shuning uchun ular **ichki statuslarga moslashtiriladi**: «Yaratildi», «Yetkazishga topshirildi», «Yo‘lda», «Topshirish punktida», «Yetkazildi», «Qaytarildi». Status o‘zgarishiga harakatlar bog‘lanadi: xaridorga bildirishnoma, buyurtmani yopish, qaytarish jarayonini boshlash.

## Topshirish punktlari

- Punktlar ro‘yxati xizmat API’sidan yuklanadi va **muntazam yangilanadi** — punktlar ochiladi va yopiladi.
- Checkout’da punktlar **xaritada va ro‘yxatda** qidiruv, manzil va ish vaqti bilan ko‘rsatiladi.
- Buyurtmada faqat matnli manzil emas, xizmat tizimidagi **punkt identifikatori** saqlanadi.
- Punkt cheklovlarini hisobga oling: maksimal vazn va o‘lcham, qabul qilganda to‘lashni qabul qilish.

## Bir nechta yetkazib berish xizmati

Yangi xizmatni qo‘shish do‘konni qayta yozishga aylanmasligi uchun umumiy interfeysni tavsiflang va uni har bir xizmat uchun alohida amalga oshiring:

```typescript
interface CarrierAdapter {
  quote(order: ShipmentDraft): Promise<Quote[]>;
  createShipment(order: ShipmentDraft): Promise<{ trackingNumber: string }>;
  getStatus(trackingNumber: string): Promise<ShipmentStatus>;
  listPickupPoints(city: string): Promise<PickupPoint[]>;
}
```

Shunda checkout barcha ulangan xizmatlardan variantlarni parallel so‘raydi va umumiy ro‘yxatni ko‘rsatadi, tanlash qoidalari (eng arzon, eng tez, hudud uchun ustuvor) esa bitta joyda turadi.

Muqobil variant — **yetkazib berish agregatori**: bitta integratsiya bir nechta xizmatga kirish imkonini beradi. Boshlash uchun tezroq, lekin zanjirga vositachi va uning tariflari hamda API’siga bog‘liqlik qo‘shiladi.

## Ko‘p uchraydigan xatolar

- Katalogda vazn va o‘lchamlar yo‘q, hisob noto‘g‘ri chiqadi.
- Kuniga yuzlab buyurtmada jo‘natmalarni qo‘lda yaratish.
- Hisoblashda taymaut yo‘q — checkout xizmat API’si bilan birga qotadi.
- Statuslar sinxronlanmaydi va qo‘llab-quvvatlash «buyurtmam qayerda» savollariga qo‘lda javob beradi.
- Yetkazib berish xizmati orqali qaytarishlar qoldiqlarda aks etmaydi.

## FAQ

### Xizmatlar bir nechta bo‘lsa, qaysi biridan boshlash kerak?

Geografiya va format (kuryer yoki topshirish punktlari) bo‘yicha buyurtmalaringizning ko‘p qismini qamrab oladigan xizmatdan. Birinchi integratsiya barqaror ishlagach, qolganlarini o‘sha adapter orqali ulang.

### Xizmatda API bo‘lmasa nima qilish kerak?

Buyurtmalarni kerakli formatdagi faylga eksport qiling, trek-raqamlarni qo‘lda yuklang, hisobni esa o‘z tariflar jadvalingiz bo‘yicha yuriting. Bu vaqtinchalik yechim: hajm o‘sganda API’si bor xizmat yoki agregatorni tanlagan ma’qul.

### Trekingni do‘kon saytida ko‘rsatish kerakmi?

Ma’qul. Status va trek-raqam ko‘rsatilgan buyurtma sahifasi hamda email yoki Telegram’dagi bildirishnomalar qo‘llab-quvvatlashga murojaatlar sonini sezilarli kamaytiradi.
