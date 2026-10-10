---
title: Sayt ishlashini qanday kuzatish va ogohlantirish olish mumkin
description: Tashqi uptime xizmatini tanlash, tekshiruv oralig‘ini sozlash, Telegram va email ogohlantirishlari hamda ochiq status sahifasini yaratish bo‘yicha qo‘llanma.
summary: Saytni bir necha mintaqadan har 1–5 daqiqada tekshiradigan tashqi uptime xizmatini ulang, ketma-ket 2–3 ta xatodan keyin Telegram yoki emailga ogohlantirish yuborsin va mijozlar uchun status sahifasi bo‘lsin.
---
## Qisqa javob

Sayt mavjudligini **tashqaridan** tekshirish kerak, u ishlayotgan serverning o‘zidan emas. Server o‘chsa, undagi monitoring ham u bilan birga o‘chadi va hech kimni ogohlantirmaydi. Shuning uchun tashqi **uptime-tekshiruvchilar** ishlatiladi: ular har bir necha daqiqada dunyoning turli nuqtalaridan saytingizga so‘rov yuboradi va javob bo‘lmasa yoki noto‘g‘ri bo‘lsa, xabar beradi.

Minimal ishchi sxema:

- bosh sahifa va bitta muhim sahifani tekshirish (masalan, buyurtma berish yoki API);
- 1–5 daqiqalik oraliq;
- **Telegram** va mas’ul shaxs emailiga ogohlantirish;
- mijozlar uchun ochiq **status sahifasi**.

## Tekshiruv turlari

| Tekshiruv turi | Nimani tekshiradi | Qachon kerak |
|---|---|---|
| HTTP(S) | Javob kodi (200, 301 va h.k.) | Doim, asosiy minimum |
| Kalit so‘z | Sahifada kerakli matn borligi | Sayt 200 qaytarib, xato sahifa ko‘rsatishi mumkin bo‘lganda |
| Ping / TCP-port | Server yoki port javob beradimi | Serverlar, ma’lumotlar bazasi, pochta |
| SSL | Sertifikat amal qilish muddati | Muddati o‘tib ketmasligi uchun |
| Domen | Domen ro‘yxatdan o‘tish muddati | Domen kutilmaganda “uzilib qolmasligi” uchun |
| Heartbeat (cron) | Fon vazifasi o‘z vaqtida hisobot berdimi | Zaxira nusxalar, rassilkalar, sinxronizatsiya |

**Kalit so‘z** bo‘yicha tekshiruv ko‘pincha oddiy HTTP tekshiruvdan foydaliroq: sayt 200 kodi bilan javob berib, aslida ma’lumotlar bazasi xatosini ko‘rsatishi mumkin.

## Xizmatni qanday tanlash kerak

Oddiy tashqi xizmatlar ko‘p: UptimeRobot, Better Stack, Pingdom, Freshping, Uptime Kuma (open source, o‘z serveringizga o‘rnatiladi). Ularni nomiga qarab emas, mezonlar bo‘yicha solishtiring:

- Sizga kerakli tarifdagi **minimal tekshiruv oralig‘i**.
- Tekshiruvlar yuboriladigan **mintaqalar soni**. Bir necha nuqtadan tasdiqlash soxta signallarni kamaytiradi.
- **Bildirishnoma kanallari**: Telegram, email, SMS, qo‘ng‘iroq, webhook.
- **Status sahifasi**: bormi, o‘z subdomeningizni ulash mumkinmi.
- Oylik mavjudlik bo‘yicha **tarix va hisobotlar**.

Uptime Kuma kabi self-hosted yechimni o‘rnatsangiz, uni asosiy saytdan **boshqa serverda va boshqa provayderda** joylashtiring.

## Oraliq va ogohlantirishlarni sozlash

**Oraliq.** Tijorat sayti uchun 1–3 daqiqa, ichki servislar uchun 5 daqiqa maqbul. Haddan tashqari tez-tez tekshirish real foyda bermaydi.

**Nosozlikni tasdiqlash.** Ogohlantirishni birinchi xatodan keyin emas, ketma-ket 2–3 ta xatodan yoki bir necha mintaqadan tasdiqlangandan keyin yuboring. Aks holda qisqa tarmoq uzilishlari sizni tunda uyg‘otadi va jamoa bildirishnomalarga e’tibor bermay qo‘yadi.

**Timeout.** Javob kutish vaqtini oqilona belgilang. Juda uzoq yuklanadigan sahifa foydalanuvchi uchun deyarli ishlamayotgan sahifa bilan bir xil.

**Telegram ogohlantirishlari.** Ko‘pchilik xizmatlar Telegramga to‘g‘ridan-to‘g‘ri yoki bot orqali xabar yubora oladi. Qulay sxema:

1. Ogohlantirishlar uchun alohida chat yoki kanal yarating.
2. Unga monitoring xizmatining botini (yoki webhook orqali o‘z botingizni) qo‘shing.
3. Ham uzilish, ham tiklanish haqidagi bildirishnomalarni yoqing.

**Email**ni zaxira kanal sifatida qoldiring: Telegramda muammo bo‘lsa ham, xat baribir yetib boradi.

Agar xizmat faqat webhookni qo‘llasa, Telegramga Bot API orqali xabar yuborish mumkin:

```bash
curl -s "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d chat_id=<CHAT_ID> \
  -d text="example.com sayti ishlamayapti"
```

## Ochiq status sahifasi

Status sahifasi nosozlik paytida qo‘llab-quvvatlash xizmatiga keladigan savollar oqimini kamaytiradi: mijozlar siz muammodan xabardor ekaningizni va uning ustida ishlayotganingizni ko‘radi.

Unda nimalar bo‘lishi kerak:

- komponentlar ro‘yxati (sayt, API, shaxsiy kabinet, to‘lov);
- har birining joriy holati;
- qisqa izohlar bilan hodisalar tarixi;
- oldindan e’lon qilingan rejali ishlar.

Uni `status.example.com` kabi subdomenda va **tashqi platformada** joylashtiring, sayt bilan bitta serverda emas. Aks holda nosozlikda sayt ham, nosozlik haqidagi sahifa ham yo‘qoladi.

## Ko‘p uchraydigan xatolar

- Monitoring sayt bilan bitta serverda turibdi.
- Faqat bosh sahifa tekshiriladi, buzilayotgani esa buyurtma berish sahifasi.
- Ogohlantirishlar ta’tildagi bitta odamga boradi.
- Tiklanish haqida bildirishnoma yo‘q — muammo qachon hal bo‘lgani noma’lum.
- SSL sertifikat va domen muddatlari kuzatilmaydi.

## FAQ

### Tekshiruv oralig‘ini qanday tanlash kerak?

Ko‘pchilik saytlar uchun 1–5 daqiqa yetarli. Biznes uchun har bir daqiqa to‘xtash qanchalik muhim bo‘lsa, oraliq shunchalik qisqa bo‘ladi, lekin soxta signallar bo‘lmasligi uchun nosozlikni tasdiqlashni albatta yoqing.

### Bepul tarif yetadimi?

Kichik sayt uchun bepul tarif ko‘pincha asosiy HTTP tekshiruvlar va bildirishnomalarga yetadi. Pullik tariflar odatda qisqaroq oraliq, ko‘proq mintaqa, SMS va qo‘ng‘iroqlar hamda brendlangan status sahifasini beradi.

### Uptime monitoring server monitoringidan nimasi bilan farq qiladi?

Uptime monitoring saytga foydalanuvchi ko‘zi bilan qaraydi: u tashqaridan ochiladimi. Server monitoringi (CPU, xotira, disk) muammolar sababini ichkaridan ko‘rsatadi. Ikkalasi bo‘lgani yaxshi, lekin tashqi tekshiruvdan boshlash kerak.
