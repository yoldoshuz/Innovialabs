---
title: TypeScript в React: типизация пропсов, состояния, событий и хуков
description: Готовые паттерны TypeScript для React: пропсы и children, useState, события, ref, generic-компоненты и типизация ответов API без лишнего кода.
summary: Описывайте пропсы через type, доверяйте выводу типов в хуках, берите типы событий из React и проверяйте ответы API на границе — этого хватает для большинства задач.
---
## Коротко: что типизировать и как

В React-проекте на TypeScript почти все сводится к пяти вещам: **пропсы**, **состояние**, **события**, **ref** и **данные с сервера**. Правило простое: явно описывайте то, что приходит снаружи (пропсы, API), и позволяйте TypeScript выводить остальное.

## Пропсы и children

Описывайте пропсы обычным `type` и типизируйте аргумент функции. `React.FC` не обязателен — прямая типизация читается проще.

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  children?: React.ReactNode;
};

export function Button({ label, variant = "primary", onClick, children }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children ?? label}</button>;
}
```

- **`React.ReactNode`** — для любого содержимого: текст, элементы, массивы, `null`.
- **Union-литералы** (`"primary" | "ghost"`) лучше, чем `string`: редактор подсказывает варианты, опечатки ловятся сразу.
- Чтобы принять все атрибуты нативной кнопки, расширьте тип: `React.ComponentProps<"button"> & { variant?: ... }`.

## Состояние: useState и useReducer

Если начальное значение говорит само за себя, тип не нужен: `useState(0)` уже `number`. Явно указывайте тип, когда значение может быть пустым или сложным.

```tsx
type User = { id: number; name: string };
const [user, setUser] = useState<User | null>(null);
```

Для `useReducer` опишите действия как **discriminated union** — TypeScript сам сузит тип внутри `switch`:

```tsx
type Action =
  | { type: "add"; item: string }
  | { type: "remove"; index: number };
```

## События

Типы событий берутся из React. Самые частые:

| Ситуация | Тип |
|---|---|
| Ввод в поле | `React.ChangeEvent<HTMLInputElement>` |
| Отправка формы | `React.FormEvent<HTMLFormElement>` |
| Клик | `React.MouseEvent<HTMLButtonElement>` |
| Клавиатура | `React.KeyboardEvent<HTMLInputElement>` |

Если обработчик написан прямо в JSX (`onChange={(e) => ...}`), тип выводится автоматически. Указывать его нужно, только когда функция объявлена отдельно.

## Ref

Для DOM-элемента передайте тип элемента и `null` как начальное значение:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();
```

Для изменяемого значения, не связанного с DOM (например, id таймера), укажите тип хранимого значения: `useRef<number | null>(null)`.

## Generic-компоненты

Когда компонент работает с любыми данными — списки, таблицы, селекты, — сделайте его generic. Тогда тип элемента выводится из переданного массива.

```tsx
type ListProps<T> = {
  items: T[];
  render: (item: T) => React.ReactNode;
};

export function List<T>({ items, render }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{render(item)}</li>)}</ul>;
}
```

## Ответы API

`fetch` возвращает `any` после `res.json()`, и приведение `as User` ничего не проверяет — это просто обещание компилятору. Надежный вариант — **валидировать данные на границе** схемой (например, Zod) и выводить тип из нее:

```ts
import { z } from "zod";

const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;

const user: User = UserSchema.parse(await res.json());
```

Так тип и проверка в рантайме не расходятся.

## Частые ошибки

- **`any` везде, где сложно.** Лучше `unknown` и явное сужение.
- **Дублирование типов.** Выводите их: `z.infer`, `ReturnType`, `ComponentProps`.
- **Лишние аннотации.** Не пишите тип, если TypeScript и так его знает.
- **`!` вместо проверки.** Non-null assertion скрывает реальные `null`.
- **Выключенный `strict`.** Без него половина пользы TypeScript теряется.

## FAQ

### Нужно ли использовать React.FC?

Не обязательно. Прямая типизация пропсов в аргументе функции короче и одинаково хорошо работает с generic-компонентами, поэтому многие команды выбирают ее.

### type или interface для пропсов?

Оба варианта рабочие. `type` удобнее для union и пересечений, `interface` — для расширения через `extends`. Главное — выбрать один стиль и держаться его в проекте.

### Как типизировать кастомный хук?

Обычно достаточно типизировать аргументы, а возвращаемое значение TypeScript выведет сам. Если хук возвращает кортеж, добавьте `as const`, чтобы элементы не превратились в массив union-типов.
