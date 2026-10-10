---
title: Ko‘p tilli Telegram-bot qanday yasaladi: rus, o‘zbek, ingliz
description: Ko‘p tilli Telegram-botda tilni language_code orqali aniqlash, tanlov berish, matnlarni gettext yoki Fluent fayllariga chiqarish va buyruqlarni tarjima qilish.
summary: language_code ni faqat taxmin sifatida oling, darhol til tanlashni taklif qiling va tanlovni bazada saqlang, barcha matnlarni gettext yoki Fluent fayllarida tuting, buyruqlar tavsifini esa setMyCommands orqali har bir til uchun bering.
---
## Qisqa javob

Ko‘p tilli bot to‘rt qismdan iborat:

1. **Tilni aniqlash** — birinchi `/start` da foydalanuvchining `language_code` qiymatini standart til sifatida oling.
2. **Aniq tanlov** — darhol tugmalar orqali tilni almashtirishni taklif qiling va tanlovni bazaga yozing.
3. **Tarjima fayllari** — barcha matnlarni koddan gettext (`.po`) yoki Fluent (`.ftl`) fayllariga chiqaring.
4. **Tarjima qilingan buyruqlar** — buyruqlar va botning tavsifi Bot API orqali har bir til uchun alohida beriladi.

## 1-qadam. language_code dan til

Har bir update’da Telegram `from.language_code` maydonini yuboradi — bu foydalanuvchidagi Telegram interfeysi tili: `ru`, `en`, `uz`, ba’zan mintaqa bilan, masalan `en-GB`. Uch narsani hisobga oling:

- maydon **majburiy emas** va bo‘lmasligi mumkin;
- u ilova tilini ko‘rsatadi, odamga o‘qish qulay bo‘lgan tilni emas: O‘zbekistonda ko‘pchilik Telegram’ni rus yoki ingliz tilida ishlatadi;
- demak, bu yakuniy qaror emas, faqat taxmin.

Tilni tanlash tartibi: **saqlangan tanlov → qo‘llab-quvvatlansa language_code → standart til**.

## 2-qadam. Foydalanuvchi tilni tanlaydi

Birinchi ishga tushirishda salomlashuv va «Русский», «O‘zbekcha», «English» inline-tugmalarini ko‘rsating. Tugma yozuvini o‘sha tilning o‘zida yozing: qolgan matn tushunarsiz bo‘lsa ham, odam o‘z tilini topadi. Tilni istalgan vaqtda almashtirish uchun `/language` buyrug‘i va sozlamalarda alohida bandni qo‘shing.

Tanlovni jarayon xotirasida emas, foydalanuvchi profili bilan birga bazada saqlang — aks holda qayta ishga tushgandan keyin bot tilni «unutadi». aiogram 3 uchun middleware namunasi:

```python
from aiogram.utils.i18n import I18n, I18nMiddleware

class UserLocaleMiddleware(I18nMiddleware):
    async def get_locale(self, event, data) -> str:
        user = data.get("event_from_user")
        if user is None:
            return self.i18n.default_locale
        saved = await get_saved_locale(user.id)  # bazadan o‘qish
        if saved:
            return saved
        code = (user.language_code or "").split("-")[0]
        if code in self.i18n.available_locales:
            return code
        return self.i18n.default_locale

i18n = I18n(path="locales", default_locale="ru", domain="messages")
UserLocaleMiddleware(i18n).setup(dp)
```

Tanlovdan so‘ng darhol yangi tilda javob bering — masalan, `with i18n.use_locale(code):` ichida.

## 3-qadam. Tarjima fayllari: gettext yoki Fluent

| | gettext (.po / .mo) | Fluent (.ftl) |
|---|---|---|
| Format | asl satr va uning tarjimasi | kalit va xabar |
| Ko‘plik shakli | .po sarlavhasidagi qoidalar, ngettext | CLDR kategoriyalari bo‘yicha variantlar xabarning o‘zida |
| Vositalar | Babel, Poedit, ko‘pchilik tarjima servislari | vositalar kamroq, fayllarni o‘qish osonroq |
| aiogram’da | o‘rnatilgan `aiogram.utils.i18n` | uchinchi tomon paketlari orqali |

Babel bilan gettext sikli:

```bash
pybabel extract -k _ -k __ -o locales/messages.pot .
pybabel init -i locales/messages.pot -d locales -D messages -l uz
pybabel compile -d locales -D messages
```

Kod o‘zgargandan keyin `init` o‘rniga `pybabel update` dan foydalaning. Fluent’da ko‘plik shakli xabarning ichida yoziladi:

```ftl
cart-items = { $count ->
    [one] В корзине { $count } товар
    [few] В корзине { $count } товара
   *[many] В корзине { $count } товаров
}
```

Bu aynan shu uch til uchun muhim: rus tilida uchta shakl, ingliz tilida ikkita, o‘zbek tilida esa sondan keyin ot o‘zgarmaydi («5 ta mahsulot»).

Vaqtni tejaydigan qoidalar:

- **gaplarni bo‘laklardan yopishtirmang** — placeholder’lardan foydalaning, tillarda so‘z tartibi turlicha;
- **tarjimonga kontekst bering**: menyudagi va buyurtma holatidagi «Ochish» turlicha tarjima qilinishi mumkin;
- **`callback_data` ni tarjima qilmang** — bu texnik identifikator;
- reply-tugmalar uchun matnni dangasa tarjima orqali solishtiring, masalan `F.text == __("Katalog")`, yaxshisi esa `callback_data` li inline-tugmalardan foydalaning.

## 4-qadam. Buyruqlarni tarjima qilish

`setMyCommands` metodi `language_code` parametrini qabul qiladi. Telegram foydalanuvchiga interfeys tili uchun ro‘yxatni ko‘rsatadi, bunday ro‘yxat bo‘lmasa — standart ro‘yxatni. `setMyName`, `setMyDescription` va `setMyShortDescription` ham xuddi shunday ishlaydi.

```python
from aiogram.types import BotCommand

COMMANDS = {
    "ru": [BotCommand(command="start", description="Начать"),
           BotCommand(command="language", description="Сменить язык")],
    "uz": [BotCommand(command="start", description="Boshlash"),
           BotCommand(command="language", description="Tilni o‘zgartirish")],
    "en": [BotCommand(command="start", description="Start"),
           BotCommand(command="language", description="Change language")],
}

async def setup_commands(bot):
    await bot.set_my_commands(COMMANDS["en"])  # standart ro‘yxat
    for lang, commands in COMMANDS.items():
        await bot.set_my_commands(commands, language_code=lang)
```

Agar foydalanuvchi botda ilova tilidan farqli tilni tanlagan bo‘lsa, unga buyruqlarni `scope=BotCommandScopeChat(chat_id=...)` orqali shaxsan bering.

## Ko‘p uchraydigan xatolar

- matnlar to‘g‘ridan-to‘g‘ri handlerlarda — yangi til qo‘shish butun kod bo‘yicha qidiruvga aylanadi;
- tugmalar barcha tillarda tekshirilmagan — uzun yozuvlar kesilib qoladi;
- sana, summa va telefon raqamlari hamma uchun bir xil formatlanadi — lokalga mos formatlashdan foydalaning, masalan Babel orqali;
- menejerlarga bildirishnomalar qabul qiluvchining emas, mijozning tilida ketadi.

## FAQ

### Buyruqlarning o‘zini tarjima qilish kerakmi?

Yo‘q. Buyruq lotin harflarida yoziladi va hamma uchun bir xil, masalan `/start`. Faqat menyuda ko‘rinadigan tavsiflar tarjima qilinadi.

### gettext yoki Fluent — qaysi biri?

Bot aiogram’da bo‘lsa va tarjimonlar uchun tanish vositalar muhim bo‘lsa — gettext. Sonlar va kelishiklar bilan xabarlar ko‘p bo‘lsa hamda fayllarning o‘qilishi muhim bo‘lsa — Fluent.

### Keyinroq to‘rtinchi tilni qanday qo‘shish mumkin?

Matnlar allaqachon fayllarga chiqarilgan bo‘lsa, yangi tarjima faylini yarating, tanlash tugmasini va shu til uchun buyruqlar to‘plamini qo‘shing — handlerlar kodini o‘zgartirish shart emas.
