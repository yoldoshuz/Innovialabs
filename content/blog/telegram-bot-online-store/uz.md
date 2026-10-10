---
title: Telegram-bot ichida internet-do‘konni qanday ishga tushirish mumkin
description: Telegram-botda katalog, savat, buyurtma, to‘lov va statuslar: do‘konni bosqichma-bosqich qurish va Mini App vitrinasiga qachon o‘tish kerakligi.
summary: Botdagi do‘kon — bu kategoriya va kartochkalardan iborat katalog, ma’lumotlar bazasidagi savat, qisqa rasmiylashtirish, Telegram Payments yoki to‘lov tizimi havolasi orqali to‘lov va status xabarlari; qidiruv va filtrlar kerak bo‘lganda vitrina Mini App’ga ko‘chiriladi.
---
## Qisqa javob

Telegram-bot ichidagi internet-do‘kon besh qismdan iborat:

1. **Katalog**: kategoriyalar, kichik kategoriyalar va rasm, narx hamda «Savatga» tugmasi bor mahsulot kartochkalari.
2. **Savat** — yozishmada emas, serverda saqlanadi.
3. **Buyurtmani rasmiylashtirish**: kontakt, manzil yoki olib ketish, to‘lov usuli — bir necha qadamda.
4. **To‘lov**: Telegram’ning ichki to‘lovlari, to‘lov tizimi havolasi yoki qabul qilganda to‘lash.
5. **Buyurtma statuslari** — bot ular haqida xaridorga o‘zi yozadi.

Mahsulotlar kam va tanlov oddiy bo‘lsa, bularning hammasini chatdagi tugmalar bilan qilish qulay. Qidiruv, filtr va solishtirish kerak bo‘lganda vitrina **Mini App**’ga ko‘chiriladi, bot esa xabarnomalar uchun qoladi.

## Katalog: xaridorni tugmalarga ko‘mib tashlamang

- **Ikki darajadan ortiq** ichma-ichlik qilmang: kategoriya → mahsulot. Chuqur «menyu ichida menyu» tez adashtiradi.
- Mahsulotlarni **bittadan kartochka** qilib «‹ Orqaga» va «Oldinga ›» tugmalari bilan yoki **sahifalash** bilan ro‘yxat qilib ko‘rsating.
- Varaqlashda yangi xabar yubormasdan, bitta xabarni tahrirlang — chat to‘lib ketmaydi.
- Tugmalarda nomlarni emas, **qisqa identifikatorlarni** uzating: inline-tugma ma’lumoti (callback_data) 64 bayt bilan cheklangan.
- Birinchi yuklashdan keyin rasmlarni **file_id** orqali qayta ishlating — kartochkalar tezroq ochiladi.

## Savat va rasmiylashtirish

Savatni foydalanuvchi ID’si bo‘yicha **ma’lumotlar bazasida** saqlang. Shunda u bot qayta ishga tushganda ham yo‘qolmaydi, tashlab ketilgan savat haqida eslatish ham mumkin bo‘ladi.

Rasmiylashtirishni qisqa qiling:

- **Telefon** — qo‘lda kiritish emas, «Kontaktni ulashish» tugmasi orqali.
- **Yetkazib berish** — tugmalar bilan tanlov: kuryer, olib ketish, topshirish punkti. Manzil — matn yoki geolokatsiya.
- **Buyurtmani tekshirish** — tarkib, summa, yetkazib berish va «Tasdiqlash», «O‘zgartirish» tugmalari bor yakuniy xabar.

To‘lovdan oldin serverda **mavjudlik va narxni qayta tekshiring**: xaridor tanlayotganda mahsulot tugab qolgan bo‘lishi mumkin.

## To‘lov: uchta variant

| Usul | Qanday ishlaydi | Qachon mos |
|---|---|---|
| Telegram Payments | Bot hisob (invoice) yuboradi, to‘lov ulangan provayder orqali Telegram oynasida o‘tadi | Jismoniy mahsulotlar, agar BotFather’da mamlakatingiz va valyutangiz uchun provayder bo‘lsa |
| Telegram Stars | Telegram’ning ichki valyutasidagi hisob | Telegram ichidagi raqamli mahsulot va xizmatlar — ular uchun Telegram aynan Stars’ni talab qiladi |
| To‘lov tizimi havolasi | Bot mahalliy provayderdagi to‘lov havolasini yuboradi, natija serveringizga keladi | Kerakli provayder Telegram Payments’da bo‘lmaganda |

Ichki to‘lovlarda tartib muhim: «To‘lash» bosilgandan so‘ng bot **pre_checkout_query** oladi va uni tezda tasdiqlashi yoki rad etishi kerak — qoldiqni tekshirishning oxirgi imkoniyati shu. Buyurtma faqat **successful_payment** xabaridan keyin to‘langan hisoblanadi. Amaldagi qoidalar — [Telegram Payments hujjatlarida](https://core.telegram.org/bots/payments).

## Buyurtma statuslari va xabarnomalar

Tushunarli statuslar zanjirini belgilang va har bir o‘tishda xaridorga yozing:

- **Yangi** → **To‘langan** (yoki «Qabul qilganda to‘lanadi»)
- **Yig‘ilmoqda** → **Yetkazishga berildi** → **Yetkazildi**
- **Bekor qilindi** — sababi va pulni qaytarish haqidagi ma’lumot bilan

Menejerlarga yangi buyurtmalarni status o‘zgartirish tugmalari bilan **alohida ishchi chatda** olish qulay. Agar sizda CRM yoki hisob tizimi bo‘lsa, bot buyurtmalarni ikkinchi baza yuritmasdan, o‘sha yerga yozishi kerak.

## Mini App’ga qachon o‘tish kerak

Chat-menyu xalaqit bera boshlaganining belgilari:

- mahsulotlar shunchalik ko‘pki, **qidiruv va filtrlarsiz** bo‘lmaydi;
- mahsulotda **variantlar** bor: o‘lcham, rang, komplektatsiya;
- xaridor pozitsiyalarni **solishtirishi** yoki ko‘p rasm ko‘rishi kerak;
- savat va rasmiylashtirish uzun xabarlar zanjiriga aylangan.

Mini App bot menyusi tugmasidan ochiladi va Telegram ichidagi mobil saytga o‘xshaydi. Bot esa yo‘qolmaydi: tasdiqlar, statuslar va eslatmalarni u yuboradi.

## Ko‘p uchraydigan xatolar

- Savatni faqat dialog holatida saqlash — qayta ishga tushirishdan keyin u yo‘qoladi.
- Buyurtmani to‘lov tasdig‘i bo‘yicha emas, tugma bosilgani bo‘yicha to‘langan deb hisoblash.
- Xaridorga jonli menejer bilan bog‘lanish imkonini bermaslik.
- Har bir kartochkani yangi xabar qilib yuborib, chatni lentaga aylantirish.

## FAQ

### Bot orqali sotish uchun sayt kerakmi?

Yo‘q, bot mustaqil savdo kanali bo‘lishi mumkin. Ammo mahsulot va buyurtmalarni yuritish uchun server, ma’lumotlar bazasi va admin-panel yoki CRM kerak.

### Mahalliy bank kartalari orqali to‘lov qabul qilsa bo‘ladimi?

Ha, ularni qabul qiladigan provayderni ulasangiz: agar u BotFather ro‘yxatida bo‘lsa — Telegram Payments orqali, bo‘lmasa — to‘lov tizimi tomonidagi to‘lov havolasi orqali.

### Nimadan boshlash kerak: botdanmi yoki darhol Mini App’danmi?

Assortiment kichik bo‘lsa, botdan boshlang: talabni tekshirishning eng tez yo‘li shu. Mini App’ni keyinroq o‘sha botga qo‘shish mumkin, xaridorlar hech qayerga o‘tishi shart bo‘lmaydi.
