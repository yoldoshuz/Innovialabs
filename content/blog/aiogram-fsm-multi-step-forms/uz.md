---
title: aiogram’da FSM: botda ko‘p bosqichli anketalar yaratish
description: aiogram 3 da FSM orqali ko‘p bosqichli ariza anketasini yig‘amiz: holatlar, xotira yoki Redis ombori, javoblarni tekshirish, orqaga qaytish va bekor qilish.
summary: aiogram’dagi FSM foydalanuvchi anketaning qaysi bosqichida ekanini eslab qoladi: bosqichlarni StatesGroup’da yozasiz, handlerlarni holatlarga bog‘laysiz, javoblarni update_data bilan yig‘asiz va qayta ishga tushganda yo‘qolmasligi uchun Redis’da saqlaysiz.
---
## Qisqa javob

**FSM** (finite state machine, holatlar mashinasi) bitta savolga javob beradi: «foydalanuvchi hozir anketaning qaysi savolini to‘ldiryapti». aiogram 3 da bu uchta narsa:

- **`StatesGroup`** — anketa bosqichlari ro‘yxati.
- **Holat bo‘yicha filtrli handlerlar** — har biri javobni faqat o‘z bosqichida qabul qiladi.
- **`FSMContext`** — bosqichni almashtirish (`set_state`), javoblarni saqlash (`update_data`) va anketani yakunlash (`clear`) uchun obyekt.

Quyida ariza anketasi: ism, telefon, xizmat, tasdiqlash.

## Holatlar

```python
from aiogram.fsm.state import State, StatesGroup

class Lead(StatesGroup):
    name = State()
    phone = State()
    service = State()
    confirm = State()
```

## Bekor qilish va «Orqaga» — birinchi

Bu handlerlar anketa bosqichlaridan **oldin** ro‘yxatdan o‘tkaziladi. Aks holda «Bekor qilish» matni joriy savolga javob sifatida qabul qilinadi.

```python
from aiogram import F, Router
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, ReplyKeyboardRemove

router = Router()

QUESTIONS = {
    Lead.name.state: "Ismingiz nima?",
    Lead.phone.state: "Telefoningiz +998901234567 formatida:",
    Lead.service.state: "Qaysi xizmat kerak?",
}
ORDER = [Lead.name, Lead.phone, Lead.service, Lead.confirm]

@router.message(StateFilter(Lead), F.text.casefold().in_({"bekor qilish", "/cancel"}))
async def cancel(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("Anketa bekor qilindi.", reply_markup=ReplyKeyboardRemove())

@router.message(StateFilter(Lead), F.text.casefold() == "orqaga")
async def back(message: Message, state: FSMContext):
    current = await state.get_state()
    idx = [s.state for s in ORDER].index(current)
    if idx == 0:
        await message.answer("Bu birinchi savol. " + QUESTIONS[current])
        return
    prev = ORDER[idx - 1]
    await state.set_state(prev)
    await message.answer(QUESTIONS[prev.state])
```

- `StateFilter(Lead)` shu guruhning **istalgan bosqichida** ishlaydi.
- «Orqaga» shunchaki holatni oldingisiga almashtiradi va savolni qayta beradi. Eski javob ma’lumotlarda qoladi va yangisi bilan almashtiriladi.

## Anketa bosqichlari va tekshiruv

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
        f"Tekshiring: {data['name']}, {data['phone']}, {data['service']}.\n"
        "Yuboraymi? «ha» yoki «orqaga» deb javob bering."
    )

@router.message(Lead.confirm, F.text.casefold() == "ha")
async def confirm(message: Message, state: FSMContext):
    data = await state.get_data()
    # shu yerda arizani CRM yoki ishchi chatga yuborish
    await state.clear()
    await message.answer("Ariza yuborildi, siz bilan bog‘lanamiz.")

@router.message(StateFilter(Lead))
async def invalid(message: Message, state: FSMContext):
    current = await state.get_state()
    hint = QUESTIONS.get(current, "«ha», «orqaga» yoki «bekor qilish» deb javob bering.")
    await message.answer("Javobni tushunib bo‘lmadi. " + hint)
```

**Tekshiruv** qanday ishlaydi: filtr (`F.text.len() >= 2`, `F.text.regexp(...)`) faqat to‘g‘ri javobni o‘tkazadi. Qolgan hammasi oxirgi `invalid` handleriga tushadi va u savolni takrorlaydi. Holat o‘zgarmaydi, shuning uchun foydalanuvchi o‘sha bosqichda qoladi.

Telefon uchun `KeyboardButton(text="Raqamni yuborish", request_contact=True)` tugmasini va alohida `@router.message(Lead.phone, F.contact)` handlerini qo‘shish qulayroq.

## Ombor: xotira yoki Redis

| | MemoryStorage | RedisStorage |
|---|---|---|
| Ulanishi | Standart holatda, `Dispatcher()` | `Dispatcher(storage=RedisStorage.from_url(...))` |
| Bot qayta ishga tushsa | Tugallanmagan barcha anketalar yo‘qoladi | Ma’lumotlar saqlanadi |
| Bir nechta jarayon | Ishlamaydi: har birining o‘z xotirasi bor | Barcha jarayonlar uchun umumiy ma’lumot |
| Qachon mos | Ishlab chiqish va testlar | Production |

```python
from aiogram import Dispatcher
from aiogram.fsm.storage.redis import RedisStorage

storage = RedisStorage.from_url("redis://localhost:6379/0")
dp = Dispatcher(storage=storage)
```

Redis uchun `redis` paketi kerak. Tashlab ketilgan anketalar cheksiz to‘planmasligi uchun kalitlarning yashash muddatini belgilash mumkin.

## Ko‘p uchraydigan xatolar

- **Bekor qilish anketa bosqichlaridan keyin ro‘yxatdan o‘tgan** va hech qachon ishlamaydi.
- **Noto‘g‘ri javob uchun handler yo‘q** — bot jim turadi va foydalanuvchi u buzilgan deb o‘ylaydi.
- Yuborilgandan keyin **`state.clear()` unutilgan** — foydalanuvchi oxirgi bosqichda qolib ketadi.
- **FSM’da katta ma’lumotlarni saqlash.** U yerda anketa javoblarini saqlang, fayllar va tarix esa ma’lumotlar bazasida bo‘lsin.

## FAQ

### Bitta anketani bir vaqtda bir nechta chatda ishlatsa bo‘ladimi?

Ha. Holat «chat + foydalanuvchi» juftligi uchun alohida saqlanadi, shuning uchun turli odamlarning anketalari aralashib ketmaydi.

### Tarmoqlanuvchi uzun anketalar uchun nima tanlash kerak?

O‘sha FSM: javobga qarab turli holatlarga o‘tkazing. Tarmoqlar ko‘p bo‘lsa, «Orqaga» oldindan aytib bo‘ladigan tarzda ishlashi uchun bosqichlar tartibini misoldagi `ORDER` kabi alohida tuzilmaga chiqaring.

### CRM ishlamay qolsa, arizani qanday yo‘qotmaslik mumkin?

Avval arizani o‘z ma’lumotlar bazangizga saqlang, keyin CRM’ga qayta urinishlar bilan yuboring. Holatni faqat muvaffaqiyatli saqlangandan keyin tozalang.
