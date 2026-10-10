---
title: Xatolarni qayta ishlash: istisnolar yoki qaytariladigan qiymatlar
description: Python va Java’dagi istisnolar, Go’dagi xato-qiymatlar va Rust’dagi Result’ni solishtiramiz, tushunarli xabarlar, o‘z xato turlari va xatolarni yashirmaslik qoidalari.
summary: Istisnolar xatoni stek bo‘ylab uzoqqa uzatish kerak bo‘lganda qulay, xato-qiymatlar va Result esa har bir nosozlikni signaturada aniq ko‘rsatadi. Yondashuvdan muhimrog‘i — xatolarni yo‘qotmaslik, kontekst qo‘shish va ularni qaror qabul qilish mumkin bo‘lgan joyda qayta ishlash.
---
## Qisqa javob

Hamma holatga mos eng yaxshi yondashuv yo‘q — odatda til siz uchun tanlaydi. **Istisnolar** (Python, Java, C#, JavaScript) bajarilishni to‘xtatadi va kimdir ushlamaguncha stek bo‘ylab yuqoriga ko‘tariladi. **Xato-qiymatlar** (Go) va **Result turi** (Rust) oddiy natija kabi qaytariladi va chaqiruvchi kod ular bilan nimadir qilishi shart.

Yaxshi xato qayta ishlash uchta qoidaga tayanadi: **nosozliklarni yashirmaslik**, **kontekst qo‘shish** va **xatoni qaror qabul qilish mumkin bo‘lgan joyda qayta ishlash**.

## Turli tillarda bu qanday ko‘rinadi

**Python — istisnolar:**

```python
def load_config(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError as e:
        raise ConfigError(f"config not found: {path}") from e
```

**Go — xato qiymat sifatida:**

```go
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }
    // ...
}
```

**Rust — Result va `?` operatori:**

```rust
fn load_config(path: &str) -> Result<Config, ConfigError> {
    let data = std::fs::read_to_string(path)?;
    let config = parse(&data)?;
    Ok(config)
}
```

## Yondashuvlarni solishtirish

| | Istisnolar | Xato-qiymatlar (Go) | Result (Rust) |
|---|---|---|---|
| Signaturada ko‘rinadimi | qisman (Java’da checked exceptions) | ha | ha |
| Qayta ishlashni unutish oson | juda oson | `err` ni e’tiborsiz qoldirish mumkin | kompilyator ogohlantiradi |
| Kod hajmi | kamroq | ko‘proq `if err != nil` | `?` bilan ixcham |
| Yuqoriga uzatish | avtomatik | qo‘lda | `?` orqali |

Istisnolar haqiqatan ham favqulodda holatlar uchun yaxshi. Xato-qiymatlar nosozlik oddiy ssenariy bo‘lgan joyda qulay: fayl yo‘q, foydalanuvchi noto‘g‘ri ma’lumot kiritdi, servis ishlamayapti.

## Har qanday tilda ishlaydigan qoidalar

1. **Xatolarni yashirmang.** Bo‘sh `except: pass` yoki `_ = err` muammoni yashiradi va u keyinroq tushunarsiz joyda paydo bo‘ladi.
2. **Aniq turlarni ushlang.** `except Exception` sizning o‘z xatolaringizni ham ushlab qoladi. `FileNotFoundError`, `TimeoutError` kabi haqiqatan qayta ishlay oladigan narsalarni ushlang.
3. **Kontekst qo‘shing.** «file not found» xabari fayl nomi va amalsiz foydasiz. Asl sababni saqlang: Python’da `raise ... from e`, Go’da `%w`, Java va JavaScript’da `cause`.
4. **Biznes holatlar uchun o‘z xato turlaringizni yarating:** `InsufficientFundsError`, `OrderNotFound`. Shunda chaqiruvchi kod ularni texnik nosozliklardan ajrata oladi.
5. **To‘g‘ri darajada qayta ishlang.** Past darajadagi funksiya xatoni kontekst bilan yuqoriga uzatadi. Qayta urinish, xabar ko‘rsatish yoki HTTP 404 qaytarish haqidagi qarorni ssenariyni biladigan qatlam qabul qiladi.
6. **Bir marta log yozing.** Agar har bir qatlam xatoni logga yozib, yana uzatsa, loglarda bitta nosozlikning beshta nusxasi bo‘ladi.
7. **Xabarlarni ajrating.** Foydalanuvchiga — amalga oshirish tafsilotlarisiz tushunarli matn. Logga — stek, parametrlar, so‘rov identifikatori.

## Ko‘p uchraydigan xatolar

- Xato o‘rniga `null` yoki `-1` qaytarish: chaqiruvchi kod sababni bilmaydi.
- Istisnolardan oddiy boshqaruv oqimi uchun, masalan sikldan chiqish uchun foydalanish.
- Foydalanuvchiga stek yoki SQL xatosi matnini ko‘rsatish — bu xavfsizlik uchun ham xavf.
- So‘rovni pauza va urinishlar chegarasisiz cheksiz takrorlash.

## FAQ

### Yangi loyiha uchun nima yaxshi: istisnolar yoki Result?

Tanlangan til idiomalariga amal qiling. Python va Java’da istisnolar, Go’da xato-qiymatlar, Rust’da Result bilan ishlang. Bitta loyihada uslublarni aralashtirish ulardan birini izchil qo‘llashdan yomonroq.

### Barcha istisnolarni yuqori darajada ushlash kerakmi?

Ha, ilova chegarasida bitta umumiy ishlov beruvchi kerak: u nosozlikni logga yozadi va foydalanuvchiga toza javob qaytaradi. Lekin u kod ichidagi kutilgan xatolarni qayta ishlash o‘rnini bosmaydi.

### Yaxshi xato xabarlarini qanday yozish kerak?

Uchta savolga javob bering: nima qilishga urindingiz, qaysi ma’lumotlar bilan va nima noto‘g‘ri ketdi. «1024-buyurtma bo‘yicha to‘lovni yechib bo‘lmadi: mablag‘ yetarli emas» xabari «operation failed» dan ancha tushunarli.
