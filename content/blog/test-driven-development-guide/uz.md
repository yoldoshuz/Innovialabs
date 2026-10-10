---
title: Test orqali ishlab chiqish (TDD): bosqichma-bosqich qo‘llanma
description: Red-green-refactor sikli jonli misolda, TDD qayerda o‘zini oqlaydi, qayerda xalaqit beradi va yangi boshlovchilar qanday xatolarga yo‘l qo‘yadi.
summary: TDD — qisqa sikl: avval yiqiladigan test yozasiz, keyin uni o‘tkazadigan minimal kod, so‘ng testlar himoyasida kodni yaxshilaysiz.
---

## TDD qisqacha

**Test-Driven Development** — test koddan oldin yoziladigan yondashuv. Ish uch qadamli qisqa sikllarda boradi:

1. **Red** — kichik bir xatti-harakat uchun test yozasiz, ishga tushirasiz va yiqilganini ko‘rasiz.
2. **Green** — test o‘tishi uchun minimal kod yozasiz. Chiroyli emas, oddiy.
3. **Refactor** — xatti-harakatni o‘zgartirmasdan kod va testlar tuzilishini yaxshilaysiz. Testlar yashil qolishi kerak.

Bitta sikl bir necha daqiqa oladi. Maqsad «qamrov» emas, balki har bir kod bo‘lagi aniq talabga javoban paydo bo‘lishidir.

## Misol: promokodli savat summasi

Vazifa: savat summasini hisoblash, `SALE10` promokodi 10% chegirma beradi. Python va pytest ishlatamiz.

**1-sikl, red.** Eng oddiy holatdan boshlaymiz:

```python
# test_cart.py
from cart import cart_total

def test_empty_cart_costs_zero():
    assert cart_total([]) == 0
```

Test yiqiladi: `cart` moduli hali yo‘q. Bu to‘g‘ri qizil — kutilgan sabab bilan yiqilish.

**Green.** Minimal kod:

```python
# cart.py
def cart_total(items):
    return 0
```

Ha, bu «aldov». Lekin keyingi test haqiqiy mantiqni yozishga majbur qiladi.

**2-sikl.** Pozitsiyalar summasi uchun test qo‘shamiz:

```python
def test_sums_price_times_quantity():
    items = [{"price": 100, "qty": 2}, {"price": 50, "qty": 1}]
    assert cart_total(items) == 250
```

Qizil. Yashil qilamiz:

```python
def cart_total(items):
    return sum(i["price"] * i["qty"] for i in items)
```

**3-sikl.** Promokod:

```python
def test_sale10_gives_ten_percent_off():
    items = [{"price": 200, "qty": 1}]
    assert cart_total(items, promo="SALE10") == 180

def test_unknown_promo_is_ignored():
    items = [{"price": 200, "qty": 1}]
    assert cart_total(items, promo="WRONG") == 200
```

**Green va refactor.** Testlar o‘tgach, chegirmalarni lug‘atga chiqaramiz — yangi promokod bitta qator bilan qo‘shiladi:

```python
DISCOUNTS = {"SALE10": 0.10}

def cart_total(items, promo=None):
    subtotal = sum(i["price"] * i["qty"] for i in items)
    return subtotal * (1 - DISCOUNTS.get(promo, 0))
```

To‘rtala test yashil — refaktoring xavfsiz. Haqiqiy loyihada pul uchun float emas, `Decimal` yoki butun tiyinlardan foydalanish kerak; buni ham alohida test bilan qayd etish qulay.

## TDD qayerda o‘zini oqlaydi

- **Aniq qoidali biznes-mantiq**: hisob-kitoblar, chegirmalar, tariflar, validatsiya, buyurtma statuslari.
- **Baglarni tuzatish**: avval xatoni takrorlaydigan test, keyin tuzatish. Bag sezdirmay qaytmaydi.
- **Tez-tez o‘zgaradigan kod**: testlar refaktoring qilishga jasorat beradi.
- **Ommaviy API va kutubxonalar**: test avval interfeys qulayligi haqida o‘ylashga majbur qiladi.

## TDD qayerda xalaqit beradi

- Ertaga tashlab yuboriladigan **prototip va tajribalar**. Avval nima qurishni aniqlang.
- **Vyorstka va vizual qism**: natija assert bilan emas, ko‘z bilan tekshiriladi.
- **Tashqi servislar ustidagi yupqa o‘ramlar**: u yerda integratsion testlar foydaliroq.
- **Notanish texnologiya**: avval testsiz qisqa spike, keyin toza versiyada TDD.

TDD — din emas, vosita. Ko‘p jamoalar uni mantiq yadrosi uchun qo‘llaydi, qolganiga testlarni «keyin» yozadi.

## Yangi boshlovchilarning keng tarqalgan xatolari

- **Juda katta qadam.** Butun funksiyaga bitta test — va yarim soat qizilda qolasiz. Bitta xatti-harakatgacha bo‘ling.
- **Qizil bosqichni o‘tkazib yuborish.** Yiqilishni ko‘rmagan bo‘lsangiz, test noto‘g‘ri narsani tekshirayotgan yoki umuman ishga tushmayotgan bo‘lishi mumkin.
- **Refaktoringni o‘tkazib yuborish.** Uchinchi qadamsiz TDD tezda ishlaydigan, lekin chalkash kod beradi.
- **Implementatsiyani test qilish.** Qaysi private metodlar chaqirilganini emas, natija va xatti-harakatni tekshiring.
- **Ortiqcha moklar.** Test uchun beshta bog‘liqlikni almashtirish kerak bo‘lsa, bu kod dizaynidagi muammo belgisi.

## Jamoada qanday boshlash kerak

1. Aniq qoidali bitta modulni tanlang.
2. Har bir bag avval test bilan yopilishini kelishib oling.
3. Testlarni CI’da ishga tushiring — qizil yig‘ma birlashtirishni to‘xtatsin.
4. Ikki haftadan so‘ng yondashuv qayerda yordam bergani va qayerda ortiqcha bo‘lganini muhokama qiling.

## FAQ

### TDD ishlab chiqishni sekinlashtiradimi?

Boshida — ha, odatlanish uchun vaqt kerak. Keyinchalik odatda qo‘lda tekshirish va regressiyalarni qidirishga ketadigan vaqt tejaladi, lekin foyda kod turiga bog‘liq.

### TDD’da 100% qamrov kerakmi?

Yo‘q. Qamrov — maqsad emas, yon natija. Muhimi, har bir ahamiyatli xatti-harakat test bilan qayd etilgan bo‘lsin.

### Legacy kodda TDD qo‘llash mumkinmi?

Ha, lekin joriy xatti-harakatni qayd etadigan xarakterlovchi testlardan boshlang, yangi o‘zgarishlarni esa red-green-refactor sikli orqali kiriting.
