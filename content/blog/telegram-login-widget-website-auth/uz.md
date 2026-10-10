---
title: Saytga Telegram orqali kirishni qanday qo‘shish mumkin
description: Telegram Login Widget ni bosqichma-bosqich ulaymiz: bot va domen sozlamasi, serverda hash tekshiruvi, akkauntlarni bog‘lash va xavfsiz sessiyalar.
summary: Bot yarating, BotFather orqali unga domenni bog‘lang, saytga vidjetni joylang, serverda esa bot tokenidan olingan SHA-256 yordamida hash imzosini va auth_date yangiligini tekshiring — shundan keyingina sessiya yarating.
---
## Bu qanday ishlaydi

**Telegram Login Widget** — Telegram saytingizda chizadigan «Telegram orqali kirish» tugmasi. Foydalanuvchi kirishni Telegram ichida tasdiqlaydi, vidjet esa sizga quyidagilarni qaytaradi:

- `id` — foydalanuvchining doimiy identifikatori;
- `first_name`, `last_name`, `username`, `photo_url` — profil (ayrim maydonlar bo‘lmasligi mumkin);
- `auth_date` — avtorizatsiya vaqti, Unix formatida;
- `hash` — ma’lumot Telegram dan kelganini server tekshiradigan imzo.

Asosiy qoida: **server `hash` ni tekshirmaguncha brauzerdan kelgan ma’lumot hech narsani anglatmaydi**. Begona `id` bilan JSON ni istalgan odam yasashi mumkin.

## 1-qadam. Bot va domen

1. **@BotFather** da bot yarating yoki mavjudidan foydalaning. Kirish shu bot nomidan so‘raladi.
2. BotFather ga `/setdomain` buyrug‘ini yuboring va sayt domenini kiriting. Vidjet faqat bog‘langan domenda ishlaydi.
3. **Bot tokenini** server muhit o‘zgaruvchilarida saqlang. U imzoni tekshirish uchun kerak va frontendga tushmasligi shart.

Lokal ishlab chiqishda vidjetga haqiqiy domen kerak, shuning uchun odatda tunnel yoki test subdomeni ishlatiladi.

## 2-qadam. Sahifadagi vidjet

Ikki rejim bor: ma’lumotlarni query-parametrlarda URL manzilingizga **redirect** qilish yoki JavaScript dagi **callback**.

```html
<script async src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="your_bot"
  data-size="large"
  data-auth-url="https://example.com/auth/telegram"
  data-request-access="write"></script>
```

- `data-auth-url` — Telegram foydalanuvchini `id`, `auth_date`, `hash` va boshqa parametrlar bilan shu manzilga yo‘naltiradi.
- Uning o‘rniga `data-onauth="onTelegramAuth(user)"` ni ko‘rsatib, `user` obyektini serverga POST so‘rov bilan yuborish mumkin.
- `data-request-access="write"` — botga foydalanuvchiga yozish ruxsatini so‘raydi. Bildirishnomalar rejalashtirilgan bo‘lsa kerak.

## 3-qadam. Serverda hash ni tekshirish

Algoritm:

1. `hash` dan tashqari barcha olingan maydonlarni oling.
2. Ularni kalit bo‘yicha saralang va `\n` bilan ajratilgan `key=value` qatorlaridan satr yig‘ing.
3. Maxfiy kalit — **bot tokenidan olingan SHA-256** (xom baytlar).
4. Satrning shu kalit bilan HMAC-SHA-256 qiymatini hisoblang va hex natijani `hash` bilan solishtiring.
5. `auth_date` juda eski emasligini tekshiring.

```python
import hashlib, hmac, time

def verify_telegram_login(data: dict, bot_token: str, max_age: int = 86400) -> bool:
    received_hash = data.pop("hash", "")
    check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret = hashlib.sha256(bot_token.encode()).digest()
    expected = hmac.new(secret, check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, received_hash):
        return False
    return time.time() - int(data["auth_date"]) < max_age
```

Muhim jihatlar:

- **Doimiy vaqtli solishtirish**dan foydalaning (`hmac.compare_digest`, `crypto.timingSafeEqual`).
- Satrga faqat o‘zingiz bilgan maydonlarni emas, **barcha olingan maydonlarni** kiriting: Telegram yangilarini qo‘shishi mumkin.
- Mini App bilan adashtirmang: u yerda maxfiy kalit boshqacha — `WebAppData` kalitli HMAC orqali hisoblanadi.

## 4-qadam. Akkauntlarni bog‘lash

Bog‘lanishni `username` bo‘yicha emas, **`id`** bo‘yicha saqlang: foydalanuvchi nomini o‘zgartirish yoki o‘chirish mumkin.

Odatiy ssenariylar:

- **Yangi foydalanuvchi** — `telegram_id` bilan akkaunt yaratasiz.
- **Boshqa usulda kirgan** — profil sozlamalarida «Telegram ni bog‘lash» ni bosadi, siz joriy akkauntga `telegram_id` ni qo‘shasiz.
- **Email akkaunti bor, lekin birinchi marta Telegram orqali kirdi** — avtomatik birlashtirmang. Vidjet email va telefonni bermaydi, shuning uchun ismning mos kelishi hech narsani isbotlamaydi. Eski usulda kirib, Telegram ni bog‘lashni taklif qiling.

Bitta Telegram akkaunti ikki profilga bog‘lanib qolmasligi uchun `telegram_id` ga unikal indeks qo‘ying.

## 5-qadam. Sessiya

Muvaffaqiyatli tekshiruvdan so‘ng server **o‘z sessiyasini** yaratadi — Telegram endi ishtirok etmaydi.

- `HttpOnly`, `Secure`, `SameSite=Lax` yoki `Strict` bayroqli cookie.
- `hash` yoki `auth_date` ni sessiya tokeni sifatida ishlatmang.
- Ushlab qolingan parametrli havoladan uzoq vaqt o‘tib qayta foydalanib bo‘lmasligi uchun `auth_date` oynasini cheklang.
- Redirectdan keyin parametrlarni manzil satridan olib tashlang, shunda ular brauzer tarixi va loglarga tushmaydi.
- Foydalanuvchiga chiqish va Telegram ni uzish imkonini bering.

## Ko‘p uchraydigan xatolar

- `onTelegramAuth` dan kelgan ma’lumotga server tekshiruvisiz ishonish.
- Bot tokeni frontend kodida.
- Barcha olingan maydonlar o‘rniga faqat ma’lum maydonlarni tekshirish.
- `auth_date` tekshiruvi yo‘qligi.

## FAQ

### Foydalanuvchining telefoni yoki emailini olish mumkinmi?

Yo‘q, vidjet ularni bermaydi. Telefon kerak bo‘lsa, uni alohida so‘rang — masalan, bot orqali kontakt yuborish tugmasi bilan, foydalanuvchi roziligi asosida.

### Nega vidjet ko‘rinmayapti?

Ko‘pincha domen `/setdomain` orqali bog‘lanmagan yoki sahifa boshqa domenda ochilgan. Shuningdek, skript sayt CSP siyosati tomonidan bloklanmayotganini tekshiring.

### Kirish uchun ishlab turgan bot kerakmi?

Avtorizatsiyaning o‘zi uchun alohida bot serveri shart emas — token va bog‘langan domenga ega bot yetarli. Foydalanuvchilarga xabar yubormoqchi bo‘lsangiz, bot serveri kerak bo‘ladi.
