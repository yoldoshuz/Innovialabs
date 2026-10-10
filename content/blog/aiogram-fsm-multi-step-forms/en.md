---
title: FSM in aiogram: How to Build Multi-Step Forms in a Bot
description: Build a multi-step lead form in aiogram 3 with FSM: states, memory or Redis storage, answer validation, going back a step and cancelling.
summary: FSM in aiogram remembers which step of a form the user is on: you list the steps in a StatesGroup, attach handlers to states, collect answers with update_data and keep it all in Redis so nothing is lost on restart.
---
## The short answer

**FSM** (finite state machine) answers one question: "which form question is this user filling in right now". In aiogram 3 it comes down to three things:

- **`StatesGroup`**: the list of form steps.
- **Handlers filtered by state**: each one accepts an answer only on its own step.
- **`FSMContext`**: the object you use to switch steps (`set_state`), save answers (`update_data`) and finish the form (`clear`).

Below is a lead form: name, phone, service, confirmation.

## States

```python
from aiogram.fsm.state import State, StatesGroup

class Lead(StatesGroup):
    name = State()
    phone = State()
    service = State()
    confirm = State()
```

## Cancel and Back come first

Register these handlers **before** the form steps. Otherwise "Cancel" would be accepted as an answer to the current question.

```python
from aiogram import F, Router
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove

router = Router()

QUESTIONS = {
    Lead.name.state: "What is your name?",
    Lead.phone.state: "Your phone in the format +998901234567:",
    Lead.service.state: "Which service do you need?",
}
ORDER = [Lead.name, Lead.phone, Lead.service, Lead.confirm]

@router.message(StateFilter(Lead), F.text.casefold().in_({"cancel", "/cancel"}))
async def cancel(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("Form cancelled.", reply_markup=ReplyKeyboardRemove())

@router.message(StateFilter(Lead), F.text.casefold() == "back")
async def back(message: Message, state: FSMContext):
    current = await state.get_state()
    idx = [s.state for s in ORDER].index(current)
    if idx == 0:
        await message.answer("This is the first question. " + QUESTIONS[current])
        return
    prev = ORDER[idx - 1]
    await state.set_state(prev)
    await message.answer(QUESTIONS[prev.state])
```

- `StateFilter(Lead)` matches **any step** in the group.
- "Back" simply switches to the previous state and asks the question again. The old answer stays in the data and is overwritten by the new one.

## Form steps and validation

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
        f"Please check: {data['name']}, {data['phone']}, {data['service']}.\n"
        "Send it? Reply 'yes' or 'back'."
    )

@router.message(Lead.confirm, F.text.casefold() == "yes")
async def confirm(message: Message, state: FSMContext):
    data = await state.get_data()
    # send the lead to your CRM or team chat here
    await state.clear()
    await message.answer("Request sent, we will get in touch.")

@router.message(StateFilter(Lead))
async def invalid(message: Message, state: FSMContext):
    current = await state.get_state()
    hint = QUESTIONS.get(current, "Reply 'yes', 'back' or 'cancel'.")
    await message.answer("Could not read that answer. " + hint)
```

How **validation** works: the filter (`F.text.len() >= 2`, `F.text.regexp(...)`) only lets a valid answer through. Everything else falls into the last handler, `invalid`, which repeats the question. The state does not change, so the user stays on the same step.

For the phone it is more convenient to add a `KeyboardButton(text="Share phone", request_contact=True)` button and a separate `@router.message(Lead.phone, F.contact)` handler.

## Storage: memory or Redis

| | MemoryStorage | RedisStorage |
|---|---|---|
| Setup | Default, `Dispatcher()` | `Dispatcher(storage=RedisStorage.from_url(...))` |
| Bot restart | All unfinished forms are lost | Data survives |
| Several processes | Does not work: each has its own memory | Shared data for all processes |
| Fits | Development and tests | Production |

```python
from aiogram import Dispatcher
from aiogram.fsm.storage.redis import RedisStorage

storage = RedisStorage.from_url("redis://localhost:6379/0")
dp = Dispatcher(storage=storage)
```

Redis storage needs the `redis` package. You can set a key lifetime so abandoned forms do not pile up forever.

## Common mistakes

- **Cancel registered after the form steps**, so it never fires.
- **No handler for invalid answers**: the bot stays silent and the user thinks it is broken.
- **Forgetting `state.clear()`** after submission, so the user is stuck on the last step.
- **Storing large data in FSM.** Keep form answers there; files and history belong in a database.

## FAQ

### Can the same form run in several chats at once?

Yes. State is stored per chat and user pair, so different people's forms never mix.

### What should I use for long forms with branching?

The same FSM: switch to different states depending on the answer. If there are many branches, keep the step order in a separate structure, like `ORDER` in the example, so "Back" behaves predictably.

### How do I avoid losing a lead if the CRM is down?

Save the lead to your own database first, then send it to the CRM with retries. Clear the state only after the save succeeds.
