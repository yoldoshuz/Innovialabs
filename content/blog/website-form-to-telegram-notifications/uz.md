---
title: Saytdagi arizalarni Telegram’ga qanday yuborish mumkin
description: Sayt formasidagi arizalarni serverda Bot API orqali Telegram chat yoki guruhiga yuborish: token frontendga tushmaydi, nosozliklarda esa arizalar yo‘qolmaydi.
summary: Forma ma’lumotlarni serveringizga yuboradi, server ularni tekshiradi, arizani saqlaydi va muhit o‘zgaruvchilaridagi token bilan Bot API sendMessage metodini chaqiradi; xatoda qayta urinadi, ariza esa baribir bazada qoladi.
---
## Qisqa javob

To‘g‘ri sxema quyidagicha:

**brauzer → serverdagi ishlovchi → baza yoki log → Bot API `sendMessage` → chat yoki guruh**.

Bot tokeni faqat serverda saqlanadi. Agar Bot API’ni to‘g‘ridan-to‘g‘ri sahifadagi JavaScript’dan chaqirsangiz, istalgan tashrif buyuruvchi tokenni «Tarmoq» (Network) bo‘limida ko‘radi va bot nomidan yozishi, guruhingizni spam bilan to‘ldirishi yoki botni egallab olishi mumkin.

## 1-qadam. Bot va arizalar uchun chat

1. BotFather’da bot yarating va tokenni saqlab qo‘ying.
2. Arizalar uchun guruh yarating va botni unga qo‘shing. Xabar yuborish uchun administrator huquqlari kerak emas.
3. `chat_id` ni bilib oling: guruhga botni eslatgan xabar yuboring, masalan `/start@your_bot`, so‘ng `https://api.telegram.org/bot<TOKEN>/getUpdates` manzilini oching. Javobdan `chat.id` ni toping.

`chat_id` haqida bilish muhim:

- guruhlarda u manfiy, superguruhlarda `-100` bilan boshlanadi;
- guruh superguruhga aylansa, ID o‘zgaradi — Bot API `migrate_to_chat_id` maydoni bilan xato qaytaradi;
- botda webhook sozlangan bo‘lsa, `getUpdates` ishlamaydi;
- arizalarni shaxsiy chatda olish uchun avval botni o‘zingiz ishga tushiring — aks holda u sizga yoza olmaydi.

## 2-qadam. Muhit o‘zgaruvchilari

```bash
TELEGRAM_BOT_TOKEN=123456789:replace-with-your-token
TELEGRAM_CHAT_ID=-1001234567890
```

Bu o‘zgaruvchilarga ularni brauzerda ochiq qiladigan prefikslarni qo‘shmang, masalan Next.js’dagi `NEXT_PUBLIC_`. `.env` fayli repozitoriyga tushmasligi kerak.

## 3-qadam. Serverdagi ishlovchi

Next.js uchun route handler namunasi. Xuddi shu mantiqni istalgan backend’ga ko‘chirish mumkin.

```ts
// app/api/lead/route.ts
const API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function notifyTelegram(text: string): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return true;
      const data = await res.json().catch(() => ({}));
      if (res.status !== 429 && res.status < 500) {
        console.error("Telegram rejected lead", res.status, data.description);
        return false; // sozlash xatosi: qayta urinish yordam bermaydi
      }
      const wait = data.parameters?.retry_after ?? 2 ** attempt;
      await new Promise((r) => setTimeout(r, wait * 1000));
    } catch {
      // timeout yoki tarmoq xatosi: yana urinib ko‘ramiz
    }
  }
  return false;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ ok: false }, { status: 400 });
  if (body.website) return Response.json({ ok: true }); // honeypot: spam-botni jimgina e’tiborsiz qoldiramiz

  const name = String(body.name ?? "").trim().slice(0, 100);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  if (!name || !phone) return Response.json({ ok: false }, { status: 400 });

  const lead = await saveLead({ name, phone }); // avval arizani saqlaymiz
  const text = `<b>Yangi ariza #${lead.id}</b>\nIsm: ${esc(name)}\nTelefon: ${esc(phone)}`;
  if (!(await notifyTelegram(text))) await markForRetry(lead.id);

  return Response.json({ ok: true });
}
```

`saveLead` va `markForRetry` — baza bilan ishlaydigan o‘z funksiyalaringiz.

## 4-qadam. Nosozliklarni qayta ishlash

Telegram — arizalar ombori emas, bildirishnoma kanali. Shuning uchun:

- **avval arizani saqlang** — bazaga yoki hech bo‘lmaganda logga, keyin bildirishnoma yuboring;
- Bot API so‘roviga **timeout qo‘ying**, shunda forma qotib qolmaydi;
- **qayta urining** faqat `429` (`retry_after` ni kuting) va `5xx` xatolarida, cheklangan urinishlar soni bilan;
- `400` va `403` da **qayta urinmang**: bu noto‘g‘ri `chat_id`, guruhdan o‘chirilgan bot yoki buzilgan belgilash — bu yerda qayta urinish emas, ogohlantirish kerak;
- yuborilmagan arizalar uchun **zaxira kanal** qiling: fondagi qayta urinishlar navbati yoki email;
- foydalanuvchiga bildirishnoma yetib borganda emas, **ariza saqlanganda muvaffaqiyat** haqida javob bering.

Serverless muhitda so‘rov ichida uzoq kutish istalmagan, shuning uchun qayta urinishlarni fondagi vazifaga o‘tkazgan ma’qul.

## Spam va belgilash xatolaridan himoya

- `parse_mode: "HTML"` da `&`, `<` va `>` belgilarini **ekranlang** — aks holda ismdagi bitta belgi xabarni buzadi;
- maydonlar **uzunligini cheklang**: Telegram’da xabar uzunligi limiti bor;
- **yashirin tuzoq maydon** (honeypot) va IP bo‘yicha so‘rovlar chastotasini cheklashni qo‘shing;
- brauzerda tekshirilgan bo‘lsa ham, **ma’lumotlarni serverda tekshiring**.

## FAQ

### Arizalarni guruhga emas, shaxsiy xabarlarga yuborish mumkinmi?

Mumkin, agar botni ishga tushirgan bo‘lsangiz va `chat_id` sifatida o‘z ID’ingizni ko‘rsatsangiz. Ammo jamoa uchun guruh qulayroq: arizalarni barcha menejerlar ko‘radi va ularni javoblarda muhokama qilish mumkin.

### Nega getUpdates bo‘sh ro‘yxat qaytaradi?

Odatda botda webhook yoqilgan yoki guruhda bot ko‘ra oladigan xabarlar bo‘lmagan. Maxfiylik rejimida bot guruhlarda faqat buyruqlar va eslatmalarni oladi, shuning uchun uning nomi bilan buyruq yuboring.

### Alohida server kerakmi?

Yo‘q. Sayt backend’idagi server ishlovchisi yoki serverless-funksiya yetarli — asosiysi, token hech qachon brauzerga tushmasligi kerak.
