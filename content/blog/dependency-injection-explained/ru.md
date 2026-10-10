---
title: "Внедрение зависимостей (DI): зачем и как использовать"
description: Что такое dependency injection на примере связанного кода и его рефакторинга через конструктор, как работают DI-контейнеры и почему DI упрощает тесты.
summary: Внедрение зависимостей — это когда класс не создаёт свои зависимости сам, а получает их снаружи, обычно через конструктор. Так код легче тестировать и менять, а DI-контейнер лишь автоматизирует сборку объектов.
---

## Суть за одну минуту

**Dependency injection (DI)** — приём, при котором объект получает нужные ему зависимости извне, а не создаёт их внутри себя. Чаще всего через **конструктор**.

Что это даёт:

- **Слабая связанность.** Класс зависит от интерфейса, а не от конкретной реализации.
- **Тестируемость.** В тесте вместо настоящей базы или почтового сервиса можно передать заглушку.
- **Гибкость.** Чтобы сменить реализацию, достаточно изменить одно место сборки.

DI — частный случай более общего принципа **инверсии зависимостей**: модули верхнего уровня не должны зависеть от деталей нижнего уровня, оба зависят от абстракций.

## Как выглядит сильно связанный код

```typescript
class OrderService {
  private db = new PostgresOrderRepository();
  private mailer = new SmtpMailer();

  async place(order: Order) {
    await this.db.save(order);
    await this.mailer.send(order.email, "Заказ принят");
  }
}
```

Проблемы:

- Нельзя протестировать `place`, не подняв базу данных и SMTP-сервер.
- Чтобы заменить почтовый сервис, придётся править `OrderService`.
- Зависимости спрятаны внутри: по сигнатуре класса не видно, что ему нужно.

## Рефакторинг: внедрение через конструктор

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
    await this.mailer.send(order.email, "Заказ принят");
  }
}

// Точка сборки (composition root)
const service = new OrderService(new PostgresOrderRepository(), new SmtpMailer());
```

Теперь `OrderService` ничего не знает о Postgres и SMTP. Все конкретные классы создаются в одном месте — **composition root**, обычно при старте приложения.

## Как DI упрощает тесты

```typescript
test("заказ сохраняется и отправляется письмо", async () => {
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

Ни базы, ни сети — тест быстрый и стабильный.

## DI-контейнеры

Когда классов десятки, собирать их вручную утомительно. **DI-контейнер** — библиотека, которая хранит правила «интерфейс → реализация» и сама создаёт объекты с нужными зависимостями, а также управляет их **временем жизни**.

В ASP.NET Core контейнер встроен:

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

Основные времена жизни в .NET:

| Lifetime | Когда создаётся |
|---|---|
| **Transient** | Новый экземпляр при каждом запросе зависимости |
| **Scoped** | Один экземпляр на область, в веб-приложении — на HTTP-запрос |
| **Singleton** | Один экземпляр на всё приложение |

В TypeScript-мире контейнеры есть во фреймворках (например, NestJS, Angular) и в отдельных библиотеках. Но в небольшом проекте ручной сборки в composition root часто достаточно.

## Частые ошибки

- **Service Locator вместо DI**: класс сам достаёт зависимости из контейнера — зависимости снова скрыты.
- **Конструктор с восемью параметрами** — сигнал, что класс делает слишком много.
- **Scoped-зависимость внутри Singleton** — объект живёт дольше, чем должен.
- **Интерфейс на каждый класс** без нужды — абстракции стоит вводить там, где реально нужна подмена.

## FAQ

### Нужен ли DI-контейнер, чтобы использовать DI?

Нет. DI — это принцип передачи зависимостей извне. Контейнер лишь автоматизирует сборку, и в небольших проектах вполне хватает ручной.

### Чем DI отличается от инверсии зависимостей?

Инверсия зависимостей — принцип проектирования: зависеть от абстракций. DI — конкретный способ его реализовать, передавая реализации снаружи.

### Можно ли внедрять зависимости не через конструктор?

Можно — через свойства или параметры метода. Но конструктор предпочтительнее: зависимости явные, и объект нельзя создать в неполном состоянии.
