---
title: Ilovaga ichki xaridlar va obunalarni qanday joriy qilish
description: StoreKit va Google Play Billing, mahsulot turlari, xaridlarni serverda tekshirish, bepul sinov davrlari, xaridlarni tiklash va RevenueCat qachon kerakligi.
summary: Mahsulotlarni App Store Connect va Play Console’da yarating, xaridlarni StoreKit va Google Play Billing orqali o‘tkazing, ularni serverda tekshirib kirish holatini saqlang, sinov davrlari va xaridlarni tiklashni har bir do‘kon qoidalari bo‘yicha yoki RevenueCat orqali sozlang.
---

## Qisqacha: ichki xaridlar nimalardan iborat

Ichki xaridlar (in-app purchases, IAP) — raqamli kontent va funksiyalarni do‘konning to‘lov tizimi orqali sotish. Ishlaydigan sxema quyidagilarni o‘z ichiga oladi:

1. App Store Connect va Google Play Console’dagi **mahsulotlar**.
2. StoreKit (iOS) va Google Play Billing Library (Android) asosidagi **mijoz kodi**.
3. Xaridlarni tekshiradigan va kimda qanday kirish borligini saqlaydigan **server**.
4. Uzaytirish, bekor qilish va qaytarishlar haqidagi **do‘kon bildirishnomalari**.

## Mahsulot turlari

| Apple | Google Play | Misol |
|---|---|---|
| Consumable | Bir martalik sarflanadigan | Tangalar, kreditlar |
| Non-consumable | Bir martalik sarflanmaydigan | Reklamani butunlay o‘chirish |
| Auto-renewable subscription | Subscription (base plan + offers) | Oylik yoki yillik premium |
| Non-renewing subscription | Yo‘q (o‘zingiz amalga oshirasiz) | Kurs mavsumiga kirish |

Google Play’da obuna **base plan** (davr va narx) va **offers** (chegirmalar va sinov davrlari) dan iborat. Apple obunalarni **subscription group**’ga birlashtiradi: foydalanuvchida guruhdan faqat bitta faol obuna bo‘lishi mumkin.

## iOS: StoreKit

Zamonaviy **StoreKit 2** async/await bilan ishlaydi va imzolangan tranzaksiyalarni qaytaradi:

```swift
let products = try await Product.products(for: ["premium_monthly"])
if let product = products.first {
    let result = try await product.purchase()
    if case .success(let verification) = result,
       case .verified(let transaction) = verification {
        // kirish bering va serverga xabar qiling
        await transaction.finish()
    }
}
```

- Ilova ishga tushganidan boshlab `Transaction.updates`’ni tinglang — xaridlar joriy sessiyadan tashqarida yakunlanishi mumkin.
- Mahalliy sinov uchun Xcode’dagi **StoreKit Configuration File**’dan, keyin Sandbox akkauntlaridan foydalaning.

## Android: Google Play Billing

- **Google Play Billing Library**’ni ulang va `BillingClient` o‘rnating.
- Mahsulotlarni `queryProductDetailsAsync` orqali yuklang, xaridni `launchBillingFlow` bilan boshlang.
- Xaridni **tasdiqlang** (acknowledge) yoki sarflang (consume). Tasdiqlanmagan xaridlarni Google bir necha kundan keyin avtomatik qaytaradi.
- Play Console’dagi **litsenziya testerlari** orqali sinang.

## Serverda tekshirish

Mijozga ishonib bo‘lmaydi: kirishni server beradi.

- **Apple**: tranzaksiyalarni **App Store Server API** orqali tekshiring va uzaytirish, bekor qilish hamda qaytarishlar haqidagi **App Store Server Notifications**’ni qabul qiling.
- **Google**: xarid tokenini **Google Play Developer API** orqali tekshiring va Cloud Pub/Sub orqali **Real-time developer notifications**’ga obuna bo‘ling.
- Ma’lumotlar bazasida obuna holati, tugash sanasi va asl tranzaksiya identifikatorini foydalanuvchi akkauntiga bog‘lab saqlang.

## Bepul sinov davrlari

- **Apple**: introductory offers — bepul sinov davri, har bir davr uchun pasaytirilgan narx yoki bir martalik to‘lov. Introductory offer huquqi odatda subscription group uchun bitta.
- **Google**: sinov davri va chegirma base plan ichida **offer** sifatida, kimga huquq borligi qoidalari bilan sozlanadi.
- To‘lov ekranida **to‘lov qachon boshlanishini** va sinovdan keyingi narxni ko‘rsating. Yashirin shartlar — ko‘rikda rad etishning ko‘p uchraydigan sababi.

## Xaridlarni tiklash

- Apple sarflanmaydigan xaridlar va obunalar uchun **Restore Purchases** imkoniyatini talab qiladi. StoreKit 2’da buning uchun `AppStore.sync()` va `Transaction.currentEntitlements` bor.
- Android’da faol xaridlarni olish uchun ishga tushishda `queryPurchasesAsync`’ni chaqiring.
- O‘z akkauntlaringiz bo‘lsa, xaridlarni ularga bog‘lang — shunda yangi qurilmada ham kirish saqlanadi.

## RevenueCat va o‘xshashlarini qachon tanlash kerak

**RevenueCat**, Adapty, Qonversion serverda tekshirish, webhook’lar, iOS va Android uchun yagona kirish holati hamda obunalar analitikasini o‘z zimmasiga oladi.

- **Mos keladi**, agar tez ishga tushirish kerak bo‘lsa va obunalar uchun o‘z backend’ingizga resurs bo‘lmasa.
- **O‘z serveringiz** — ma’lumotlar va mantiq ustidan to‘liq nazorat muhim bo‘lsa yoki rivojlangan billing tizimi allaqachon bo‘lsa.

Bunday xizmatlarning o‘z to‘lov modeli bor — uni o‘zingiz ishlab chiqish va qo‘llab-quvvatlash xarajatlari bilan solishtiring.

## FAQ

### Raqamli funksiyalar uchun to‘lovni o‘z to‘lov tizimim orqali qabul qilsam bo‘ladimi?

Odatda yo‘q: ilova ichidagi raqamli kontent uchun do‘konlar o‘z to‘lov tizimlarini talab qiladi. Istisnolar ilova kategoriyasi va hududga bog‘liq va muntazam o‘zgaradi — joriy qoidalarni tekshiring.

### Xaridlar qurilmada tekshirilsa, server kerakmi?

Akkauntlari yo‘q kichik ilova qurilmadagi tekshiruvdan boshlashi mumkin. Ammo obunalar, bir nechta platforma va soxtalashtirishdan himoya uchun server yoki RevenueCat kabi xizmat kerak.

### Xaridlarni haqiqiy pul to‘lamasdan qanday sinash mumkin?

iOS’da Xcode’dagi StoreKit Configuration File va Sandbox akkauntlaridan, Android’da Play Console’dagi litsenziya testerlaridan foydalaning. Test akkauntlaridan pul yechilmaydi.
