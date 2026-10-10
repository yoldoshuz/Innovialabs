---
title: "Bog‘liqliklarni kiritish (DI): nima uchun va qanday ishlatish"
description: Dependency injection qattiq bog‘langan kod va uni konstruktor orqali refaktoring qilish misolida, DI-konteynerlar qanday ishlashi va DI testlarni qanday osonlashtirishi.
summary: Dependency injection — klass o‘z bog‘liqliklarini o‘zi yaratmay, ularni tashqaridan, odatda konstruktor orqali olishi. Shunda kodni test qilish va o‘zgartirish osonlashadi, DI-konteyner esa obyektlarni yig‘ishni avtomatlashtiradi xolos.
---

## Mohiyati bir daqiqada

**Dependency injection (DI)** — obyekt o‘ziga kerakli bog‘liqliklarni ichida yaratmasdan, tashqaridan oladigan usul. Ko‘pincha **konstruktor** orqali.

Bu nima beradi:

- **Kuchsiz bog‘liqlik.** Klass aniq realizatsiyaga emas, interfeysga bog‘liq bo‘ladi.
- **Test qilish qulayligi.** Testda haqiqiy ma’lumotlar bazasi yoki pochta servisi o‘rniga zaglushka uzatish mumkin.
- **Moslashuvchanlik.** Realizatsiyani almashtirish uchun bitta yig‘ish joyini o‘zgartirish kifoya.

DI — umumiyroq **bog‘liqliklar inversiyasi** tamoyilining xususiy holi: yuqori darajadagi modullar quyi darajadagi detallarga bog‘liq bo‘lmasligi kerak, ikkalasi ham abstraksiyalarga bog‘liq.

## Qattiq bog‘langan kod qanday ko‘rinadi

```typescript
class OrderService {
  private db = new PostgresOrderRepository();
  private mailer = new SmtpMailer();

  async place(order: Order) {
    await this.db.save(order);
    await this.mailer.send(order.email, "Buyurtma qabul qilindi");
  }
}
```

Muammolar:

- Ma’lumotlar bazasi va SMTP-serverni ishga tushirmasdan `place` ni test qilib bo‘lmaydi.
- Pochta servisini almashtirish uchun `OrderService` ni tahrirlash kerak.
- Bog‘liqliklar ichkarida yashiringan: klass imzosidan unga nima kerakligi ko‘rinmaydi.

## Refaktoring: konstruktor orqali kiritish

```typescript
interface OrderRepository { save(order: Order): Promise<void>; }
interface Mailer { send(to: string, text: string): Promise<void>; }

class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly mailer: Mailer,
  ) {}

  async place(order: Order) {
    await this.repo.save(order);
    await this.mailer.send(order.email, "Buyurtma qabul qilindi");
  }
}

// Yig‘ish nuqtasi (composition root)
const service = new OrderService(new PostgresOrderRepository(), new SmtpMailer());
```

Endi `OrderService` Postgres va SMTP haqida hech narsa bilmaydi. Barcha aniq klasslar bitta joyda — **composition root** da, odatda ilova ishga tushganda yaratiladi.

## DI testlarni qanday osonlashtiradi

```typescript
test("buyurtma saqlanadi va xat yuboriladi", async () => {
  const saved: Order[] = [];
  const sent: string[] = [];
  const service = new OrderService(
    { save: async o => { saved.push(o); } },
    { send: async to => { sent.push(to); } },
  );

  await service.place({ id: "1", email: "a@example.com" } as Order);

  expect(saved).toHaveLength(1);
  expect(sent).toEqual(["a@example.com"]);
});
```

Na baza, na tarmoq — test tez va barqaror.

## DI-konteynerlar

Klasslar o‘nlab bo‘lsa, ularni qo‘lda yig‘ish zerikarli. **DI-konteyner** — «interfeys → realizatsiya» qoidalarini saqlaydigan, obyektlarni kerakli bog‘liqliklar bilan o‘zi yaratadigan va ularning **yashash muddatini** boshqaradigan kutubxona.

ASP.NET Core da konteyner o‘rnatilgan:

```csharp
builder.Services.AddScoped<IOrderRepository, PostgresOrderRepository>();
builder.Services.AddSingleton<IMailer, SmtpMailer>();
builder.Services.AddScoped<OrderService>();

public class OrderService
{
    private readonly IOrderRepository _repo;
    private readonly IMailer _mailer;

    public OrderService(IOrderRepository repo, IMailer mailer)
    {
        _repo = repo;
        _mailer = mailer;
    }
}
```

.NET dagi asosiy yashash muddatlari:

| Lifetime | Nusxa qachon yaratiladi |
|---|---|
| **Transient** | Bog‘liqlik har safar so‘ralganda yangi nusxa |
| **Scoped** | Har bir soha uchun bitta nusxa, veb-ilovada — har bir HTTP-so‘rov uchun |
| **Singleton** | Butun ilova uchun bitta nusxa |

TypeScript olamida konteynerlar freymvorklarda (masalan, NestJS, Angular) va alohida kutubxonalarda bor. Ammo kichik loyihada composition root da qo‘lda yig‘ish ko‘pincha yetarli.

## Ko‘p uchraydigan xatolar

- **DI o‘rniga Service Locator**: klass bog‘liqliklarni konteynerdan o‘zi oladi — ular yana yashirin bo‘lib qoladi.
- **Sakkiz parametrli konstruktor** — klass juda ko‘p ish qilayotganining belgisi.
- **Singleton ichidagi Scoped-bog‘liqlik** — obyekt keragidan uzoqroq yashaydi.
- **Har bir klass uchun interfeys** ehtiyojsiz — abstraksiyalarni haqiqatan almashtirish kerak bo‘lgan joyda kiriting.

## FAQ

### DI dan foydalanish uchun DI-konteyner kerakmi?

Yo‘q. DI — bog‘liqliklarni tashqaridan uzatish tamoyili. Konteyner faqat yig‘ishni avtomatlashtiradi, kichik loyihalarda qo‘lda yig‘ish bemalol yetadi.

### DI bog‘liqliklar inversiyasidan nimasi bilan farq qiladi?

Bog‘liqliklar inversiyasi — loyihalash tamoyili: abstraksiyalarga bog‘lanish. DI esa uni realizatsiyalarni tashqaridan uzatish orqali amalga oshirishning aniq usuli.

### Bog‘liqliklarni konstruktordan boshqa yo‘l bilan kiritish mumkinmi?

Mumkin — xususiyatlar yoki metod parametrlari orqali. Lekin konstruktor afzalroq: bog‘liqliklar aniq ko‘rinadi va obyektni to‘liq bo‘lmagan holatda yaratib bo‘lmaydi.
