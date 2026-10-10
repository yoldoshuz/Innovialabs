---
title: SLI, SLO va error budget: SRE ishonchliligi asoslari amalda
description: SLI, SLO, SLA va error budget nima, foydali metrikalarni qanday tanlash, real maqsad qo‘yish va yangi funksiyalar bilan barqarorlikni muvozanatlash.
summary: SLI — servis sifatining o‘lchanadigan ko‘rsatkichi, SLO — unga qo‘yilgan maqsad, error budget esa jamoa relizlar va tajribalarga «sarflashi» mumkin bo‘lgan ruxsat etilgan nosozliklar ulushi.
---

## Qisqa javob

- **SLI (Service Level Indicator)** — foydalanuvchi tajribasini aks ettiruvchi metrika. Masalan, muvaffaqiyatli so‘rovlar ulushi yoki belgilangan chegaradan tezroq bajarilgan so‘rovlar ulushi.
- **SLO (Service Level Objective)** — ma’lum davr uchun SLI maqsadi. Masalan, 30 kun ichida 99,9% muvaffaqiyatli so‘rovlar.
- **SLA (Service Level Agreement)** — buzilganda oqibatlari bo‘lgan mijoz bilan shartnoma. Jamoada zaxira bo‘lishi uchun SLA odatda SLO’dan yumshoqroq bo‘ladi.
- **Error budget** — bu `100% − SLO`. SLO 99,9% bo‘lsa, byudjet 0,1% muvaffaqiyatsiz so‘rov yoki 30 kunda taxminan 43 daqiqa ishlamay qolish.

Maqsad — **qancha ishonchlilik yetarli** ekanini kelishib olish va hissiyotga asoslangan bahslarni to‘xtatish.

## Yaxshi SLI’ni qanday tanlash kerak

Yaxshi SLI server holatini emas, **foydalanuvchi his qiladigan narsani** o‘lchaydi. CPU yuklamasi — yomon SLI: u yuqori bo‘lishi mumkin, foydalanuvchilar esa mamnun.

Servis turiga qarab odatiy SLI’lar:

| Servis turi | SLI |
|---|---|
| API, veb-sayt | Mavjudlik (5xx bo‘lmagan javoblar ulushi), kechikish (chegaradan tez so‘rovlar ulushi) |
| Navbat, fon vazifalari | Ma’lumotlar yangiligi, o‘z vaqtida bajarilgan vazifalar ulushi |
| Saqlash tizimi | Ishonchli saqlanish, muvaffaqiyatli o‘qishlar ulushi |

Amaliy maslahatlar:

- SLI’ni **yaxshi hodisalarning barcha hodisalarga nisbati** sifatida ifodalang: `yaxshi / jami`.
- Foydalanuvchiga imkon qadar yaqin joyda o‘lchang: balanslovchi yoki sintetik tekshiruvlar ilova loglaridan yaxshiroq.
- Har bir asosiy foydalanuvchi yo‘li uchun **2–3 ta SLI**dan boshlang: kirish, to‘lov, qidiruv.
- Kechikish uchun o‘rtacha qiymat emas, **persentillar** (p95, p99) dan foydalaning.

## Real SLO’ni qanday qo‘yish kerak

1. **Tarixga qarang.** Agar servis ma’lum darajani barqaror ushlab tursa, hozirgi faktdan biroz pastroq maqsaddan boshlang.
2. **100% qo‘ymang.** Bu erishib bo‘lmaydigan maqsad va har qanday o‘zgarishni to‘sib qo‘yadi. Har bir qo‘shimcha «to‘qqiz» narxni keskin oshiradi.
3. **Bog‘liqliklarni hisobga oling.** Zaxiralashsiz servisingiz u ishlaydigan bulut yoki ma’lumotlar bazasidan ishonchliroq bo‘la olmaydi.
4. **Davrni tanlang.** 28 yoki 30 kunlik siljuvchi oyna — keng tarqalgan tanlov.
5. SLO’larni har chorakda mahsulot jamoasi bilan birga **qayta ko‘rib chiqing**.

## Error budget’dan qanday foydalanish kerak

Error budget ishonchlilikni **sarflash mumkin bo‘lgan resursga** aylantiradi:

- Byudjet bor — jamoa bemalol funksiyalar chiqaradi va tajriba qiladi.
- Byudjet tugayapti — ustuvorlik barqarorlikka o‘tadi: tuzatishlar, testlar, xavfsizroq deploy.
- Byudjet tugadi — tiklanguncha xavfli relizlar muzlatiladi.

Buni **error budget policy** sifatida yozib qo‘ying — biznes bilan oldindan kelishilgan qisqa hujjat. Shunda «relizlarni sekinlashtirish» qarori nizodan keyin emas, qoida bo‘yicha qabul qilinadi.

Foydali amaliyot — **burn rate** (byudjet sarflanish tezligi) bo‘yicha alertlar: agar byudjet me’yordan bir necha barobar tez sarflanayotgan bo‘lsa, SLO rasman hali buzilmagan bo‘lsa ham, hozir harakat qilish kerak.

## Ko‘p uchraydigan xatolar

- **Juda ko‘p SLO.** Hech kim yigirmata maqsadni kuzatmaydi.
- **Foydalanuvchi tajribasi o‘rniga ichki metrikalarga asoslangan SLI.**
- **Siyosatsiz SLO.** Agar byudjet oshib ketishi hech narsaga ta’sir qilmasa, bu shunchaki grafik.
- **Hamma narsa uchun bir xil maqsad.** Admin panel va to‘lov turli darajadagi ishonchlilikni talab qiladi.

## FAQ

### SLO SLA’dan nimasi bilan farq qiladi?

SLO — jamoaning ichki maqsadi, SLA esa kompensatsiyalar bilan mijoz oldidagi tashqi majburiyat. Ichki maqsad buzilishi darhol shartnoma buzilishini anglatmasligi uchun SLA SLO’dan pastroq qo‘yiladi.

### Error budget oy boshida tugab qolsa nima qilish kerak?

Oldindan kelishilgan siyosat bo‘yicha harakat qiling: xavfli relizlarni to‘xtating, nosozliklar sabablarini tahlil qiling va ishonchlilikka sarmoya kiriting. Byudjet tiklangach, odatiy sur’atga qayting.

### Kichik loyihaga SLO kerakmi?

Ha, soddalashtirilgan ko‘rinishda: asosiy ssenariy uchun bir-ikkita SLI va tushunarli maqsad. Bu mazmunli alertlarni sozlashga va biznesga haqiqatda qancha ishonchlilik kerakligini tushuntirishga yordam beradi.
