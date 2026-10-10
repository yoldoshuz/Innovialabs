---
title: Mock, stub va fake: testlarda kodni qanday izolyatsiya qilish
description: Dummy, stub, spy, mock va fake farqi, pytest va Jest’da HTTP so‘rovlar va ma’lumotlar bazasini almashtirish, ortiqcha moklar testlarni qanday buzishi.
summary: Test double — haqiqiy bog‘liqlik o‘rniga qo‘yiladigan obyekt: stub tayyor ma’lumot qaytaradi, mock chaqiruvlarni tekshiradi, fake — soddalashtirilgan ishchi implementatsiya. Faqat sekin va tashqi narsalarni almashtiring.
---

## Bog‘liqliklarni nega almashtirish kerak

Unit-test **tez, barqaror va bitta narsani tekshiradigan** bo‘lishi kerak. Haqiqiy tarmoq, ma’lumotlar bazasi yoki to‘lov shlyuzi bunga xalaqit beradi: ular sekin, ishlamay qolishi va har xil ma’lumot qaytarishi mumkin. Shuning uchun testlarda ular **test doubles** — kinodagi kaskadyorlar kabi «dublyorlar» bilan almashtiriladi.

## Dublyorlarning besh turi

| Tur | Nima qiladi | Qachon kerak |
|---|---|---|
| **Dummy** | Faqat argument o‘rnini egallaydi, ishlatilmaydi | Parametr majburiy, lekin testda ahamiyatsiz |
| **Stub** | Tayyor javob qaytaradi | Bog‘liqlikdan keladigan kirish ma’lumotini berish kerak |
| **Spy** | Stub kabi ishlaydi va chaqiruvlarni eslab qoladi | Keyin qanday chaqirilganini ko‘rish kerak |
| **Mock** | Kutilgan chaqiruvlarni oldindan biladi va tekshiradi | O‘zaro ta’sir faktining o‘zi muhim: xat yuborildi, to‘lov yaratildi |
| **Fake** | Soddalashtirilgan, lekin ishlaydigan implementatsiya | Mantiq kerak: in-memory baza, lokal fayl ombori |

Kundalik nutqda bularning hammasini ko‘pincha «mok» deyishadi, `unittest.mock` va Jest kabi kutubxonalar esa istalgan rolni bajara oladigan obyektlar yaratadi. Muhimi — aniq testdagi **rol**: siz ma’lumot berayapsizmi (stub) yoki xatti-harakatni tekshirayapsizmi (mock).

## pytest’da HTTP so‘rovni almashtirish

Funksiya tashqi API’dan haroratni oladi:

```python
# weather.py
import requests

def get_temp(city):
    r = requests.get("https://api.example.com/weather",
                     params={"q": city}, timeout=5)
    r.raise_for_status()
    return r.json()["temp"]
```

Test `requests.get`ni u **ishlatiladigan** joyda — `weather` modulida almashtiradi:

```python
from unittest.mock import Mock, patch
from weather import get_temp

def test_get_temp_reads_temp_field():
    response = Mock()
    response.json.return_value = {"temp": 21}
    with patch("weather.requests.get", return_value=response) as get:
        assert get_temp("Tashkent") == 21
        get.assert_called_once()
```

Keng tarqalgan xato — `requests.get`ni test qilinayotgan modul uni import qiladigan yo‘l bo‘yicha emas, boshqa joyda patch qilish.

## Jest’da fetch’ni almashtirish

```js
// user.js
export async function getUserName(id) {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return data.name;
}
```

```js
// user.test.js
import { getUserName } from './user';

test('returns user name', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ name: 'Aziz' }),
  });
  await expect(getUserName(1)).resolves.toBe('Aziz');
  expect(fetch).toHaveBeenCalledWith('/api/users/1');
});
```

Butun modullar uchun Jest’da `jest.mock('./db')` bor: barcha eksportlar boshqariladigan zaglushka-funksiyalarga aylanadi.

## Ma’lumotlar bazasi: mock o‘rniga fake

Har bir SQL so‘rovni moklash — mo‘rt testlarga yo‘l. Bazani repozitoriy interfeysi ortiga yashirib, testlarda **fake** qo‘yish qulayroq:

```python
class FakeUserRepo:
    def __init__(self):
        self.users = {}

    def save(self, user):
        self.users[user["email"]] = user

    def find_by_email(self, email):
        return self.users.get(email)
```

Ro‘yxatdan o‘tish mantiqi `FakeUserRepo`da test qilinadi, haqiqiy baza bilan ishlash esa alohida integratsion testlar bilan tekshiriladi — masalan, Docker’dagi test bazasida.

## Ortiqcha moklash xavfi

Moklar juda ko‘pligining belgilari:

- test implementatsiyani satrma-satr takrorlaydi: «A’ni chaqir, keyin B’ni shu argumentlar bilan»;
- xatti-harakatni o‘zgartirmaydigan har qanday refaktoring testlarni buzadi;
- barcha testlar yashil, lekin prodakshnda xato — chunki mok haqiqiy servis kabi ishlamagan;
- bitta test uchun beshta va undan ko‘p almashtirish sozlanadi.

Qanday oldini olish mumkin:

- **Faqat tizim chegaralarini almashtiring**: tarmoq, baza, vaqt, fayl tizimi, uchinchi tomon SDK’lari.
- O‘zingizning sof mantiqingizni **moklamang** — uni haqiqatan chaqiring.
- Agar o‘zaro ta’sirning o‘zi talab bo‘lmasa, ichki chaqiruvlar ketma-ketligini emas, **natijani** tekshiring.
- Yonida haqiqiy bog‘lanishni tekshiradigan **integratsion testlar** bo‘lsin.

## FAQ

### Mock stub’dan nimasi bilan farq qiladi?

Stub faqat ma’lumot beradi, test esa funksiya natijasini tekshiradi. Mock tekshiruvda qatnashadi: test u kerakli marta va kerakli argumentlar bilan chaqirilganini tasdiqlaydi.

### Har bir testda bazani moklash kerakmi?

Yo‘q. Biznes-mantiq unit-testlari uchun fake-repozitoriy qulay, bazaga so‘rovlarning o‘zini esa haqiqiy test bazasidagi integratsion testlar bilan tekshirgan ma’qul.

### Joriy vaqtni qanday moklash mumkin?

Vaqtni yoki «soat»ni funksiyaga bog‘liqlik sifatida uzating yoki soxta taymerlardan foydalaning: Jest’da `jest.useFakeTimers()`, Python’da vaqt funksiyasini `patch` yoki maxsus kutubxonalar orqali almashtirish.
