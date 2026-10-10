---
title: Python’da tip annotatsiyalari: mypy bilan amaliy qo‘llanma
description: Python’da oddiy va generic annotatsiyalar, Optional va Union, TypedDict va Protocol hamda mavjud loyihaga mypy tekshiruvini bosqichma-bosqich ulash.
summary: Tip annotatsiyalari Python ishlashini o‘zgartirmaydi, lekin mypy’ga xatolarni ishga tushirishdan oldin topish imkonini beradi; yangi va muhim modullardan boshlab, tekshiruvlarni asta-sekin kuchaytiring.
---

## Tip annotatsiyalari nima beradi

**Tip annotatsiyalari** — kod qanday ma’lumot qabul qilishi va qaytarishi haqidagi ko‘rsatmalar. Python ularni bajarilish vaqtida tekshirmaydi, lekin ularni mypy kabi **statik analizatorlar** va kod muharrirlari o‘qiydi.

Amaliy foydasi:

- «satr kutilgan joyga `None` uzatildi» kabi xatolar **ishga tushirishdan oldin** topiladi;
- avtoto‘ldirish va ta’rifga o‘tish aniqroq ishlaydi;
- funksiya signaturasi o‘zi hujjat vazifasini bajaradi;
- refaktoring xavfsizroq: analizator buzilgan barcha joylarni ko‘rsatadi.

## Oddiy annotatsiyalar

```python
def greet(name: str, times: int = 1) -> str:
    return ", ".join([f"Hello, {name}"] * times)

scores: dict[str, int] = {"alice": 10}
tags: list[str] = []
```

Python’ning zamonaviy versiyalarida `list`, `dict`, `set`, `tuple` kabi o‘rnatilgan kolleksiyalarni to‘g‘ridan-to‘g‘ri parametrlash mumkin, ular uchun `typing`dan import shart emas.

## Optional va Union

Agar qiymat bo‘lmasligi mumkin bo‘lsa, buni aniq ko‘rsating:

```python
def find_user(user_id: int) -> User | None:
    ...

def parse(value: str | bytes) -> str:
    return value.decode() if isinstance(value, bytes) else value
```

`User | None` — `Optional[User]` bilan bir xil, `str | bytes` esa `Union[str, bytes]` bilan bir xil. Bunday annotatsiyadan keyin mypy natijani ishlatishdan oldin `None`ga tekshirishga majbur qiladi — asosiy qadr ham shunda.

## Generic funksiyalar

Natija tipi argument tipiga bog‘liq bo‘lsa, `TypeVar`dan foydalaning:

```python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T | None:
    return items[0] if items else None
```

`first([1, 2])` `int | None` qaytaradi, `first(["a"])` esa `str | None`.

## TypedDict: tuzilishi ma’lum lug‘atlar

API’dan kelgan JSON ko‘pincha lug‘atlar ko‘rinishida bo‘ladi. `TypedDict` kalitlar va ularning tiplarini tavsiflaydi:

```python
from typing import TypedDict

class UserDTO(TypedDict):
    id: int
    name: str
    email: str | None
```

Kalitdagi xato yoki noto‘g‘ri qiymat tipi tekshiruv xatosiga aylanadi.

## Protocol: tekshiruvli «o‘rdak tiplash»

`Protocol` obyekt **nima qila olishini** merosxo‘rliksiz tavsiflaydi:

```python
from typing import Protocol

class Notifier(Protocol):
    def send(self, text: str) -> None: ...

def alert(notifier: Notifier) -> None:
    notifier.send("Server is down")
```

`send(text: str)` metodi bor har qanday klass mos keladi — testlarda bog‘liqliklarni almashtirish uchun qulay.

## Mavjud loyihaga mypy’ni qanday ulash

Butun kodda birdaniga qat’iy rejimni yoqish befoyda: yuzlab xatolar va hammasini o‘chirib qo‘yish istagi paydo bo‘ladi. Bosqichma-bosqich harakat qiling.

1. **mypy’ni** dev-bog‘liqlik sifatida **o‘rnating** va loyihada ishga tushiring. Standart holatda u faqat annotatsiyalangan funksiyalarni tekshiradi, shuning uchun start yumshoq.
2. `pyproject.toml`ga **asosiy konfiguratsiyani qo‘shing**.
3. **Tekshiruvlarni modullar bo‘yicha kuchaytiring**: yangi va muhim paketlarni qat’iy, eskilarini keyinroq.
4. Yangi xatolar asosiy branchga tushmasligi uchun **mypy’ni CI’ga qo‘shing**.

```toml
[tool.mypy]
ignore_missing_imports = true

[[tool.mypy.overrides]]
module = "app.billing.*"
disallow_untyped_defs = true
```

Tiplari yo‘q tashqi kutubxonalar uchun stub-paketlarni qidiring, `ignore_missing_imports`ni esa vaqtinchalik chora sifatida ishlating.

## Keng tarqalgan xatolar

- **Hamma joyda `Any`.** U tekshiruvni o‘chiradi va annotatsiya ma’nosini yo‘qotadi.
- **Izohsiz `# type: ignore`.** Yarim yildan keyin u nimani yashirganini hech kim eslamaydi.
- **Runtime’da tekshiruv kutish.** Kiruvchi ma’lumotlarni validatsiya qilish uchun alohida vositalar kerak, annotatsiyalar ularning o‘rnini bosmaydi.
- **Hammasini bir urinishda tiplashtirish.** Bosqichma-bosqich yondashuv ishonchliroq.

## FAQ

### Annotatsiyalar dasturni sekinlashtiradimi?

Yo‘q, ular bajarilish tezligiga sezilarli ta’sir qilmaydi: interpretator ularni tekshirmaydi.

### mypy pyright’dan nimasi bilan farq qiladi?

Ikkalasi ham statik tip analizatorlari. Ba’zi holatlarni biroz boshqacha talqin qiladi, lekin asosiy tamoyillar bir xil. Bittasini tanlab, uni muharrirda ham, CI’da ham ishlating.

### Kichik skriptlarda annotatsiyalar kerakmi?

Shart emas. Ular uzoq yashaydigan va bir necha kishi tahrirlaydigan kodda eng ko‘p foyda beradi.
