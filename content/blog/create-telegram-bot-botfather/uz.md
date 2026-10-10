---
title: BotFather orqali Telegram-bot yaratish: bosqichma-bosqich yo‘riqnoma
description: BotFather’da Telegram-botni bosqichma-bosqich yaratamiz: nom va username, tavsif, avatar, buyruqlar, menyu tugmasi va tokenni xavfsiz saqlash.
summary: @BotFather ni oching, /newbot yuboring, nom va bot bilan tugaydigan username tanlang va token oling; so‘ng tavsif, avatar, buyruqlar va menyu tugmasini sozlang, tokenni esa faqat server muhit o‘zgaruvchilarida saqlang.
---
## Qisqacha: nima qilish kerak

1. Telegram’da rasmiy **@BotFather** ni (ko‘k belgili) toping va «Start» ni bosing.
2. `/newbot` yuboring, botning **nomi** va **username**ini kiriting.
3. **Token**ni oling va darhol ishonchli joyda saqlang.
4. Tavsif, avatar, buyruqlar va menyu tugmasini sozlang.
5. Tokenni bot kodiga ulang.

Yaratilgandan keyin botning o‘zi hech narsa qila olmaydi: BotFather uni faqat ro‘yxatdan o‘tkazadi. Mantiqni dasturchi yozadi yoki konstruktorda sozlanadi.

## 1-qadam. Nom va username

`/newbot` dan keyin BotFather ikkita qiymat so‘raydi:

- **Nom (name)** — foydalanuvchilar chatlar ro‘yxati va profilda ko‘radigan nom. Istalgan tilda, bo‘sh joylar bilan bo‘lishi mumkin, keyinroq `/setname` orqali oson o‘zgartiriladi.
- **Username** — `@shop_helper_bot` ko‘rinishidagi bot manzili. Talablar: lotin harflari, raqamlar va pastki chiziq, uzunligi 5 dan 32 belgigacha, oxiri `bot` bilan tugashi kerak (masalan, `ShopBot` yoki `shop_bot`). Username band bo‘lmasligi lozim.

Username’ni darhol yakuniy variant sifatida tanlang: u `t.me/nom` havolalarida, vizitkalarda va reklamada ishlatiladi.

## 2-qadam. Token

BotFather javobida `123456789:AAH...` ko‘rinishidagi **token** keladi. Token — botga to‘liq kirish huquqi: uni bilgan kishi bot nomidan xabar yubora oladi va uning yangilanishlarini o‘qiy oladi.

Token ishlayotganini `getMe` so‘rovi bilan tekshirish mumkin — u botingiz ma’lumotlarini qaytaradi.

## 3-qadam. Tavsif va avatar

- `/setdescription` — foydalanuvchi bo‘sh chatda **«Start» ni bosishdan oldin** ko‘radigan matn. Bot nima qila olishi va uni nima uchun ishga tushirish kerakligini tushuntiring.
- `/setabouttext` — bot **profilidagi** qisqa matn, 120 belgigacha.
- `/setuserpic` — **avatar**. Kichik doirada ham yaxshi o‘qiladigan kvadrat rasm yuboring.

Yaxshi tavsif uchta savolga javob beradi: bot nima qiladi, kim uchun va «Start» dan keyin nima bo‘ladi.

## 4-qadam. Buyruqlar

`/setcommands` foydalanuvchi `/` yozganda va menyu tugmasida chiqadigan buyruqlar ro‘yxatini belgilaydi. Format — har bir qatorda bitta buyruq:

```text
start - Ishni boshlash
catalog - Mahsulotlar katalogi
orders - Buyurtmalarim
help - Yordam va kontaktlar
```

Qoidalar: buyruq nomi — kichik lotin harflari, raqamlar va pastki chiziq, 32 belgigacha. Ro‘yxatni qisqa tuting: 3–6 ta buyruq yigirmatadan yaxshiroq o‘qiladi. Buyruqlarni koddan `setMyCommands` metodi bilan ham berish mumkin — turli tillar uchun turli ro‘yxatlar qilish shunday qulay.

## 5-qadam. Menyu tugmasi

Kiritish maydonining chap tomonida botning **menyu tugmasi** bor. Standart holatda u buyruqlar ro‘yxatini ochadi. BotFather’dagi bot sozlamalarida (`/mybots` → bot → Bot Settings → Menu Button) uni **Mini App** — Telegram ichidagi veb-ilovani ishga tushiruvchi tugmaga aylantirish mumkin. Koddan buni `setChatMenuButton` metodi bajaradi.

`/mybots` dagi boshqa foydali sozlamalar: guruhlardagi maxfiylik, botni guruhlarga qo‘shishga ruxsat, inline rejim.

## Tokenni xavfsiz saqlash

- Tokenni kodda emas, **muhit o‘zgaruvchilarida** yoki maxfiy ma’lumotlar menejerida saqlang.
- `.env` faylini birinchi commit’dan oldin `.gitignore` ga qo‘shing.
- Tokenni hech qachon Mini App yoki sayt kodiga qo‘ymang: brauzerga tushgan hamma narsa foydalanuvchiga ko‘rinadi.
- Tokenni chatlarda yubormang va skrinshotlarda ko‘rsatmang.
- Ishlab chiqish va production uchun **alohida botlar** oching.
- Token sizib chiqsa, darhol **bekor qiling**: `/mybots` → bot → API Token → Revoke current token. Eski token ishlamay qoladi, serverda yangisini yangilang.

```bash
# .env (commit qilinmasin)
BOT_TOKEN=123456789:replace_with_your_token
```

## Keng tarqalgan xatolar

- BotFather’ga o‘xshash soxta akkauntga yozish. Rasmiysi faqat belgili `@BotFather`.
- Tokenni ochiq repozitoriyda e’lon qilish.
- Tavsifni bo‘sh qoldirish — foydalanuvchi «Start» ni nega bosishini tushunmaydi.
- BotFather’da buyruqlarni qo‘shib, kodda ular uchun handler yozmaslik.

## FAQ

### Bitta akkauntda nechta bot yaratish mumkin?

BotFather’da bitta akkauntga to‘g‘ri keladigan botlar soni cheklangan. Unga yetsangiz, yangi bot yaratishga uringaningizda BotFather xabar beradi — keraksiz botlarni `/deletebot` buyrug‘i bilan o‘chirish mumkin.

### Botni boshqa odamga topshirish mumkinmi?

Ha, BotFather’dagi bot sozlamalarida egalikni topshirish bor. Buning uchun akkauntlarda ikki bosqichli autentifikatsiya yoqilgan bo‘lishi kerak.

### Bot ishlashi uchun server kerakmi?

Ha. BotFather botni faqat ro‘yxatdan o‘tkazadi, foydalanuvchilarga esa server yoki bulutda ishga tushirilgan va Bot API’ga token orqali ulangan dasturingiz javob berishi kerak.
