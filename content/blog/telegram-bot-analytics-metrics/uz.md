---
title: Telegram-bot analitikasini qanday hisoblash: metrikalar va vositalar
description: Bot metrikalari — startlar, ushlab qolish, voronka qadamlari, bloklashlar, start parametri orqali manbalarni kuzatish va ma’lumot yig‘ish vositalari.
summary: Foydalanuvchining har bir harakatini serveringizda hodisa sifatida yozing, trafik manbaini bot havolasidagi start parametri orqali uzating, so‘ng startlar, faollashish, ushlab qolish, voronka konversiyasi va bloklashlar ulushini o‘z bazangizda yoki mahsulot analitikasi tizimida hisoblang.
---
## Qisqa javob

Botda hisoblagichli saytdagidek tayyor batafsil analitika yo‘q. Uni o‘zingiz yig‘asiz:

1. **Bot serveri hodisalarni yozadi**: start, tugma bosish, ssenariy qadami, buyurtma, to‘lov, bloklash.
2. **Trafik manbai** bot havolasida **start parametri** orqali uzatiladi.
3. Hodisalardan **metrikalar** hisoblanadi: startlar, faollashish, ushlab qolish, voronka, bloklashlar.
4. Ma’lumotlar **dashbordli o‘z bazangizda** yoki **mahsulot analitikasi tizimida** ko‘riladi.

## Asosiy metrikalar

| Metrika | Nimani ko‘rsatadi | Qanday hisoblanadi |
|---|---|---|
| Startlar | Qancha yangi odam keldi | Davr ichida noyob foydalanuvchilar bo‘yicha birinchi /start |
| Faollashish | Odam birinchi qiymatga yetdimi | Start bosganlarning asosiy harakatni bajarganlar ulushi |
| Ushlab qolish | Foydalanuvchilar qaytadimi | Startdan 1, 7, 30 kun o‘tib faol bo‘lgan foydalanuvchilar ulushi |
| Voronka | Odamlar qayerda yo‘qoladi | Ssenariy qadamlari orasidagi konversiya |
| Bloklashlar | Bot qanchalik g‘ashga tegadi | Botni bloklagan foydalanuvchilar ulushi, ayniqsa rassilkalardan keyin |
| Manbalar | Qaysi kanal eng yaxshilarni olib keladi | Start parametri kesimida startlar, faollashish va xaridlar |

**Asosiy harakatni** o‘zingiz belgilang: do‘kon uchun — buyurtma, yozilish uchun — tasdiqlangan tashrif, qo‘llab-quvvatlash uchun — hal qilingan savol.

## Voronka bosqichma-bosqich

Asosiy ssenariyni qadamlarga bo‘ling va har birini loglang:

- start → kategoriya tanlash → mahsulot kartochkasi → savat → kontakt → to‘lov;
- start → xizmat tanlash → vaqt tanlash → yozilishni tasdiqlash.

Faqat yakuniy konversiyaga emas, qo‘shni qadamlar orasidagi **eng katta yo‘qotishga** ham qarang. Odatda aynan o‘sha yerda tushunarsiz tugma, ortiqcha savol yoki noqulay kiritish bo‘ladi.

## Bloklashlarni qanday kuzatish kerak

Foydalanuvchi botni bloklaganda Telegram **kicked** statusli **my_chat_member** yangilanishini yuboradi. Agar odam botni blokdan chiqarsa, status orqaga o‘zgaradi. Bundan tashqari, botni bloklagan foydalanuvchiga xabar yuborishga urinish kirish xatosini qaytaradi.

Ikkala signalni ham hodisa sifatida yozing. Rassilkadan so‘ng darhol bloklashlar ko‘payishi — xabarlar juda tez-tez yoki keraksiz ekanining aniq belgisi.

## Start parametri orqali trafik manbalari

`https://t.me/your_bot?start=ads_spring` ko‘rinishidagi havola botga `/start ads_spring` buyrug‘ini uzatadi. Parametr 64 tagacha belgidan iborat bo‘lishi mumkin: lotin harflari, raqamlar, `_` va `-`. Mini App uchun xuddi shunday **startapp** parametri bor.

aiogram 3’da qayta ishlash shunday ko‘rinadi:

```python
from aiogram import Router
from aiogram.filters import CommandStart, CommandObject
from aiogram.types import Message

router = Router()

@router.message(CommandStart())
async def on_start(message: Message, command: CommandObject):
    source = command.args or "direct"
    await track_event(message.from_user.id, "bot_start", source=source)  # hodisani yozuvchi funksiyangiz
    await message.answer("Assalomu alaykum!")
```

Amaliy qoidalar:

- **Nomlash sxemasini** joriy qiling: `kanal_kampaniya_variant`, masalan `tgads_spring_a`, `site_footer`, `qr_store1`.
- Foydalanuvchining **birinchi manbaini** alohida saqlang, takroriy startlarni esa alohida hodisalar sifatida yozing.
- Parametrga **shaxsiy ma’lumotlarni** qo‘ymang: u havolada ko‘rinib turadi.

## Vositalar

- **O‘z bazangiz + dashbord.** PostgreSQL yoki analitik MBBTdagi hodisalar jadvali va grafiklar uchun BI-vosita. To‘liq nazorat va ma’lumotlar bo‘yicha hech qanday cheklov yo‘q.
- **Mahsulot analitikasi tizimlari.** Server hodisalarni ularning API yoki SDK’si orqali yuboradi, voronkalar, kogortalar va ushlab qolish tayyor hisobotlarda quriladi.
- **Mini App’dagi veb-analitika.** Mini App — bu veb-sahifa, shuning uchun unga odatiy tashriflar hisoblagichini o‘rnatish mumkin.
- **Botlar analitikasi bo‘yicha ixtisoslashgan servislar** — tez boshlash, lekin moslashuvchanlik kamroq.

Hodisaning minimal maydonlari: **foydalanuvchi ID’si, hodisa nomi, vaqt, manba, parametrlar** (summa, mahsulot, qadam). Tashqi servislarga ma’lumot yuborganda telefon yoki ismni emas, ichki ID’ni uzating.

## Ko‘p uchraydigan xatolar

- Bloklashlarni hisobga olmay, qachondir start bosgan hammani «foydalanuvchi» deb hisoblash.
- Oraliq qadamlarsiz faqat yakuniy buyurtmalarni loglash.
- Barcha reklama kampaniyalari uchun botga bitta havola.
- Hodisalar nomini hujjatlashtirmasdan o‘zgartirish — grafiklar bir-biriga to‘g‘ri kelmay qoladi.

## FAQ

### Start parametrisiz foydalanuvchi qayerdan kelganini bilish mumkinmi?

Ishonchli tarzda — yo‘q. Parametrsiz bot faqat start bo‘lganini ko‘radi. Shuning uchun har bir manbaga alohida havola kerak.

### Metrikalarni qanchalik tez-tez ko‘rish kerak?

Startlar va bloklashlarni — har bir kampaniya va rassilkadan keyin, voronka va ushlab qolishni — haftada yoki oyda bir marta, tasodifiy tebranishlarni emas, trendni ko‘rish uchun.

### Boshlash uchun nimani tanlash kerak: o‘z bazangiznimi yoki tayyor servisnimi?

Agar hodisalar allaqachon bot bazasiga yozilayotgan bo‘lsa, uning ustida oddiy dashborddan boshlang. Hisobotlarni alohida ishlab chiqmasdan kogortalar va murakkab voronkalar kerak bo‘lganda tashqi servis mantiqli.
