---
title: FSM в aiogram: как сделать многошаговые анкеты в боте
description: Как собрать многошаговую анкету заявки в aiogram 3 через FSM: состояния, хранилище в памяти или Redis, валидация ответов, шаг назад и отмена.
summary: FSM в aiogram запоминает, на каком шаге анкеты находится пользователь: вы описываете шаги в StatesGroup, вешаете хендлеры на состояния, складываете ответы через update_data и храните всё в Redis, чтобы не терять данные при перезапуске.
---
## Короткий ответ

**FSM** (finite state machine, машина состояний) отвечает на вопрос «какой вопрос анкеты пользователь сейчас заполняет». В aiogram 3 это три вещи:

- **`StatesGroup`** — список шагов анкеты.
- **Хендлеры с фильтром по состоянию** — каждый принимает ответ только на своём шаге.
- **`FSMContext`** — объект, через который вы переключаете шаг (`set_state`), сохраняете ответы (`update_data`) и завершаете анкету (`clear`).

Ниже — анкета заявки: имя, телефон, услуга, подтверждение.

## Состояния

```python
from aiogram.fsm.state import State, StatesGroup

class Lead(StatesGroup):
    name = State()
    phone = State()
    service = State()
    confirm = State()
```

## Отмена и «Назад» — первыми

Эти хендлеры регистрируются **раньше** шагов анкеты. Иначе текст «Отмена» будет принят как ответ на текущий вопрос.

```python
from aiogram import F, Router
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove

router = Router()

QUESTIONS = {
    Lead.name.state: "Как вас зовут?",
    Lead.phone.state: "Ваш телефон в формате +998901234567:",
    Lead.service.state: "Какая услуга нужна?",
}
ORDER = [Lead.name, Lead.phone, Lead.service, Lead.confirm]

@router.message(StateFilter(Lead), F.text.casefold().in_({"отмена", "/cancel"}))
async def cancel(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("Анкета отменена.", reply_markup=ReplyKeyboardRemove())

@router.message(StateFilter(Lead), F.text.casefold() == "назад")
async def back(message: Message, state: FSMContext):
    current = await state.get_state()
    idx = [s.state for s in ORDER].index(current)
    if idx == 0:
        await message.answer("Это первый вопрос. " + QUESTIONS[current])
        return
    prev = ORDER[idx - 1]
    await state.set_state(prev)
    await message.answer(QUESTIONS[prev.state])
```

- `StateFilter(Lead)` срабатывает на **любом шаге** этой группы.
- «Назад» просто переключает состояние на предыдущее и задаёт вопрос заново. Старый ответ остаётся в данных и перезапишется новым.

## Шаги анкеты и валидация

```python
@router.message(Command("lead"))
async def start_lead(message: Message, state: FSMContext):
    await state.set_state(Lead.name)
    await message.answer(QUESTIONS[Lead.name.state])

@router.message(Lead.name, F.text.len() >= 2)
async def get_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text.strip())
    await state.set_state(Lead.phone)
    await message.answer(QUESTIONS[Lead.phone.state])

@router.message(Lead.phone, F.text.regexp(r"^\+?\d{9,15}$"))
async def get_phone(message: Message, state: FSMContext):
    await state.update_data(phone=message.text)
    await state.set_state(Lead.service)
    await message.answer(QUESTIONS[Lead.service.state])

@router.message(Lead.service, F.text)
async def get_service(message: Message, state: FSMContext):
    data = await state.update_data(service=message.text)
    await state.set_state(Lead.confirm)
    await message.answer(
        f"Проверьте: {data['name']}, {data['phone']}, {data['service']}.\n"
        "Отправить? Ответьте «да» или «назад»."
    )

@router.message(Lead.confirm, F.text.casefold() == "да")
async def confirm(message: Message, state: FSMContext):
    data = await state.get_data()
    # здесь отправка заявки в CRM или рабочий чат
    await state.clear()
    await message.answer("Заявка отправлена, мы свяжемся с вами.")

@router.message(StateFilter(Lead))
async def invalid(message: Message, state: FSMContext):
    current = await state.get_state()
    hint = QUESTIONS.get(current, "Ответьте «да», «назад» или «отмена».")
    await message.answer("Не получилось распознать ответ. " + hint)
```

Как устроена **валидация**: фильтр (`F.text.len() >= 2`, `F.text.regexp(...)`) пропускает только корректный ответ. Всё остальное падает в последний хендлер `invalid`, который повторяет вопрос. Состояние не меняется, поэтому пользователь остаётся на том же шаге.

Для телефона удобнее добавить кнопку `KeyboardButton(text="Отправить номер", request_contact=True)` и отдельный хендлер `@router.message(Lead.phone, F.contact)`.

## Хранилище: память или Redis

| | MemoryStorage | RedisStorage |
|---|---|---|
| Подключение | По умолчанию, `Dispatcher()` | `Dispatcher(storage=RedisStorage.from_url(...))` |
| Перезапуск бота | Все незавершённые анкеты теряются | Данные сохраняются |
| Несколько процессов | Не работает: у каждого своя память | Общие данные для всех процессов |
| Когда подходит | Разработка и тесты | Продакшен |

```python
from aiogram import Dispatcher
from aiogram.fsm.storage.redis import RedisStorage

storage = RedisStorage.from_url("redis://localhost:6379/0")
dp = Dispatcher(storage=storage)
```

Для Redis нужен пакет `redis`. Можно задать время жизни ключей, чтобы брошенные анкеты не копились бесконечно.

## Частые ошибки

- **Отмена зарегистрирована после шагов анкеты** и никогда не срабатывает.
- **Нет хендлера для неверного ответа** — бот молчит, и пользователь думает, что он сломался.
- **Забытый `state.clear()`** после отправки: пользователь застревает в последнем шаге.
- **Хранение крупных данных в FSM.** Держите там ответы анкеты, а файлы и историю — в базе.

## FAQ

### Можно ли запустить одну анкету в нескольких чатах сразу?

Да. Состояние хранится отдельно для пары «чат + пользователь», поэтому анкеты разных людей не смешиваются.

### Что выбрать для длинных анкет с ветвлениями?

Та же FSM: в зависимости от ответа переключайте на разные состояния. Если ветвлений много, вынесите порядок шагов в отдельную структуру, как `ORDER` в примере, чтобы «Назад» работал предсказуемо.

### Как не потерять заявку, если CRM недоступна?

Сначала сохраните заявку в свою базу, затем отправляйте в CRM с повторными попытками. Состояние очищайте только после успешного сохранения.
