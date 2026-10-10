---
title: "Singleton, Factory, Strategy, Observer: amaliyotda patternlar"
description: Eng ko‘p ishlatiladigan to‘rt pattern real vazifalarda — to‘lov provayderlari va bildirishnomalar — TypeScript misollari va qachon kerak emasligi bilan.
summary: Strategy algoritmni almashtiradi, Factory kerakli realizatsiyani tanlaydi, Observer hodisani obunachilarga tarqatadi, Singleton yagona nusxani kafolatlaydi. Har biri faqat aniq muammoda foydali, Singleton o‘rniga esa ko‘pincha dependency injection yaxshiroq.
---

## To‘rt pattern qisqacha

| Pattern | Nimani yechadi | Tipik vazifa |
|---|---|---|
| **Strategy** | Bitta interfeys ortidagi almashtiriladigan algoritmlar | Turli to‘lov provayderlari |
| **Factory** | Butun kod bo‘ylab `if/else` siz kerakli realizatsiyani yaratish | Sozlama bo‘yicha provayder tanlash |
| **Observer** | Bitta hodisa haqida ko‘p obunachilarni xabardor qilish | Buyurtma to‘langandan keyingi bildirishnomalar |
| **Singleton** | Butun ilova uchun aynan bitta nusxa | Ulanishlar puli, konfiguratsiya |

Quyidagi misollar TypeScript da, lekin g‘oyalar istalgan til uchun bir xil.

## Strategy: to‘lov provayderlari

Do‘kon to‘lovni bir nechta provayder orqali qabul qiladi. Patternsiz buyurtma rasmiylashtirish kodi har bir provayder uchun shoxlar bilan to‘lib ketadi. Strategy bilan barcha provayderlar umumiy interfeysni amalga oshiradi:

```typescript
interface PaymentProvider {
  charge(orderId: string, amount: number): Promise<string>;
}

class CardProvider implements PaymentProvider {
  async charge(orderId: string, amount: number) {
    // provayder API siga so‘rov
    return `card-${orderId}`;
  }
}

class WalletProvider implements PaymentProvider {
  async charge(orderId: string, amount: number) {
    return `wallet-${orderId}`;
  }
}

async function checkout(provider: PaymentProvider, orderId: string, amount: number) {
  return provider.charge(orderId, amount);
}
```

**Qachon ishlatish:** ikki va undan ortiq xulq varianti bor va ularning soni ko‘payishi mumkin.
**Qachon kerak emas:** variant bitta yoki farq bitta parametrga sig‘adi.

## Factory: realizatsiyani tanlash

Qaysi provayderni yaratishni kimdir hal qilishi kerak. Fabrika bu qarorni bir joyga yig‘adi:

```typescript
type ProviderName = "card" | "wallet";

function createProvider(name: ProviderName): PaymentProvider {
  switch (name) {
    case "card": return new CardProvider();
    case "wallet": return new WalletProvider();
  }
}

const provider = createProvider(order.paymentMethod);
await checkout(provider, order.id, order.total);
```

Yangi provayder qo‘shganda fabrikani o‘zgartirasiz va yangi klass yozasiz — qolgan kodga tegmaysiz.

**Qachon ishlatish:** obyekt yaratish ma’lumot yoki konfiguratsiyaga bog‘liq yoki murakkab sozlashni talab qiladi.
**Qachon kerak emas:** tur doim bitta — oddiy `new` soddaroq va tushunarliroq.

## Observer: to‘lovdan keyingi bildirishnomalar

Muvaffaqiyatli to‘lovdan keyin xat yuborish, messenjerga xabar jo‘natish va CRM ni yangilash kerak. Agar bularning hammasi to‘g‘ridan-to‘g‘ri to‘lov kodidan chaqirilsa, u har bir kanal haqida bilishga majbur. Observer bog‘liqlikni teskari aylantiradi:

```typescript
type Listener<T> = (payload: T) => void | Promise<void>;

class EventBus<T> {
  private listeners: Listener<T>[] = [];

  subscribe(fn: Listener<T>) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  async emit(payload: T) {
    await Promise.all(this.listeners.map(l => l(payload)));
  }
}

const orderPaid = new EventBus<{ orderId: string }>();
orderPaid.subscribe(e => sendEmail(e.orderId));
orderPaid.subscribe(e => notifyMessenger(e.orderId));
```

To‘lov kodi faqat `orderPaid.emit(...)` ni chaqiradi va kanallar haqida hech narsa bilmaydi.

**Qachon ishlatish:** bitta hodisa tizimning bir nechta mustaqil qismlari uchun muhim.
**Qachon kerak emas:** obunachi bitta va boshqasi paydo bo‘lmaydi — to‘g‘ridan-to‘g‘ri chaqiruv osonroq o‘qiladi. Xotira sizib chiqmasligi uchun **obunani bekor qilishni** va obunachilardagi xatolarni qayta ishlashni unutmang.

## Singleton: yagona nusxa

Klassik variant — konstruktori yashirilgan klass. JavaScript/TypeScript da osonroq: modul bir marta bajariladi, shuning uchun nusxani eksport qilishning o‘zi yagona obyekt beradi.

```typescript
// db.ts
import { createPool } from "./driver";

export const db = createPool({ url: process.env.DATABASE_URL });
```

**Qachon ishlatish:** resurs haqiqatan ham bitta nusxada bo‘lishi kerak — ulanishlar puli, kesh, logger.
**Qachon kerak emas:** deyarli boshqa barcha holatlarda. Singleton — global holat: kod unga yashirin bog‘lanadi, testlarda esa uni almashtirish qiyin. Ko‘pincha obyektni ishga tushishda bir marta yaratib, **konstruktor orqali uzatgan** (dependency injection) ma’qul.

## Ko‘p uchraydigan xatolar

- Muammo paydo bo‘lishidan oldin pattern kiritish: bitta turli fabrika, bitta strategiyali Strategy.
- «Qulaylik uchun» hamma narsani Singleton qilish.
- Observer dagi xatolarni e’tiborsiz qoldirish: bitta yiqilgan obunachi qolganlarini sezdirmasdan buzmasligi kerak.
- Factory ni biznes-mantiq bilan aralashtirish — fabrika faqat obyekt yaratishi kerak.

## FAQ

### Strategy Factory dan nimasi bilan farq qiladi?

Strategy almashtiriladigan algoritmlar umumiy interfeys orqali qanday qo‘yilishini tasvirlaydi. Factory esa ulardan qaysi birini yaratishni hal qiladi. Ular ko‘pincha birga ishlatiladi: fabrika strategiyani tanlaydi.

### Nega Singleton ni antipattern deyishadi?

Chunki u yashirin global holat yaratadi va test qilishni qiyinlashtiradi. O‘z-o‘zidan u xato emas, lekin ko‘p hollarda dependency injection xuddi shu vazifani tozaroq hal qiladi.

### Observer xabarlar navbati bilan bir xilmi?

G‘oya o‘xshash, ammo Observer bitta jarayon ichida ishlaydi. Xabarlar navbati hodisalarni servislar o‘rtasida uzatadi va qabul qiluvchi mavjud bo‘lmasa, ularni saqlab turadi.
