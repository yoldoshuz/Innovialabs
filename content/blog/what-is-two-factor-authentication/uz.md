---
title: Ikki bosqichli autentifikatsiya (2FA) nima va uni nega yoqish kerak
description: Autentifikatsiya omillari nima, 2FA parol sizib chiqqanda akkauntni qanday himoya qiladi, uni avval qayerda yoqish va zaxira kodlarni qanday saqlash.
summary: Ikki bosqichli autentifikatsiya paroldan tashqari shaxsni ikkinchi marta tasdiqlashni, masalan telefondagi kodni so‘raydi, shuning uchun o‘g‘irlangan parolning o‘zi yetarli bo‘lmaydi; uni birinchi navbatda pochta, Google yoki Apple, bank va Telegram uchun yoqing.
---
## Qisqa javob

**Ikki bosqichli autentifikatsiya (2FA)** — kirish uchun ikki xil tasdiq kerak bo‘lishi: odatda **parol** va faqat sizda bor narsa, masalan **telefondagi kod** yoki **apparat kalit**. Parol sizib chiqsa yoki topilsa ham, ikkinchi omilsiz hujumchi baribir kira olmaydi.

Sozlash bir necha daqiqa oladi va akkauntlarni o‘g‘irlashning eng keng tarqalgan usulini yopadi.

## Omillarning uch turi

| Omil | Bu nima | Misollar |
|---|---|---|
| **Bilim** | Siz biladigan narsa | Parol, PIN-kod, savolga javob |
| **Egalik** | Sizda bor narsa | Autentifikator ilovasi o‘rnatilgan telefon, SMS-kod, apparat kalit |
| **Xususiyat** | Sizning o‘zingiz | Barmoq izi, yuzni tanish |

2FA **ikki xil guruhdan** omillarni talab qiladi. Parol va maxfiy savol — 2FA emas: ikkalasi ham «bilim»ga tegishli va birga sizib chiqishi mumkin.

Ko‘p servislar buni **ko‘p omilli autentifikatsiya (MFA)** yoki **ikki bosqichli tekshiruv** deb ataydi. Foydalanuvchi uchun mohiyat bir xil.

## Nega u ko‘pchilik buzishlarni to‘xtatadi

Akkauntlar odatda bittalab emas, ommaviy o‘g‘irlanadi:

- eski sizib chiqishlardagi parollar boshqa saytlarda sinaladi (credential stuffing);
- fishing sahifalari login va parollarni yig‘adi;
- zararli dasturlar kompyuterda saqlangan parollarni o‘g‘irlaydi.

Bu holatlarning barchasida hujumchida parolingiz bor, lekin telefoningiz yoki kalitingiz yo‘q. 2FA yoqilgan bo‘lsa, avtomatik hujum ikkinchi bosqichda to‘xtaydi. Himoya mutlaq emas — puxta tayyorlangan fishing sahifa kodni real vaqtda so‘rashi mumkin — lekin u oddiy ommaviy hujumlarni kesib tashlaydi.

## Birinchi navbatda qayerda yoqish kerak

1. **Asosiy pochta.** Deyarli barcha boshqa xizmatlarning parolni tiklash xatlari shu yerga keladi. Pochtani kim boshqarsa, qolgan akkauntlarni ham o‘sha boshqaradi.
2. **Google yoki Apple akkaunti.** Unda pochta, zaxira nusxalar, suratlar, saqlangan parollar va telefonga kirish bor.
3. **Bank va to‘lov ilovalari.** Ko‘pchiligi allaqachon ikkinchi omilni talab qiladi; bildirishnomalar va limitlar yoqilganini tekshiring.
4. **Telegram.** Kirish odatda SMS-kod orqali bo‘ladi, shuning uchun maxfiylik sozlamalarida **bulutli parolni** («Ikki bosqichli tasdiqlash») yoqing: u har bir yangi qurilmada so‘raladi. WhatsApp’da ham PIN-kod bilan xuddi shunday qiling.
5. **Ish akkauntlari:** korporativ pochta, bulut servislari, xosting, domen registratori, GitHub, CRM, sayt admin paneli.
6. **Ijtimoiy tarmoqlar**, ayniqsa ularga biznes sahifa yoki reklama kabineti ulangan bo‘lsa.

## Qanday yoqish

- Akkauntning xavfsizlik sozlamalarini oching va «Ikki bosqichli autentifikatsiya», «Ikki bosqichli tekshiruv» yoki «2-Step Verification» bandini toping.
- Usulni tanlang. **Autentifikator ilovasi** (TOTP) yoki **apparat kalit** SMS’dan yaxshiroq; lekin SMS ham hech narsadan ko‘ra ancha yaxshi.
- QR-kodni ilova bilan skanerlang va tasdiqlash uchun kodni kiriting.
- Sahifani yopishdan oldin **zaxira kodlarni saqlang**.

## Zaxira kodlarni qanday saqlash

Zaxira kodlar — telefoningizni yo‘qotsangiz kirish uchun bir martalik kodlar. Har biri bir marta ishlaydi.

- Ularni **parol menejerida** yoki uyda xavfsiz joyda **qog‘ozda** saqlang.
- Ularni faqat o‘zlari himoya qiladigan pochtada yoki faqat ikkinchi omil bo‘lgan telefonda saqlamang.
- Ishlatilgan kodni o‘chirib qo‘ying; kam qolganda yangi to‘plam yarating.
- Iloji bo‘lsa, **ikkinchi usul** qo‘shing: zaxira kalit, autentifikatorli yana bir qurilma yoki ishonchli telefon raqami.

## FAQ

### Telefonimni yo‘qotsam nima qilaman?

Zaxira kod yoki ikkinchi usul bilan kiring, yo‘qolgan qurilmani akkauntdan o‘chiring va yangi telefonda 2FA’ni sozlang. Zaxira kodlarsiz tiklash servis qo‘llab-quvvatlash xizmati orqali amalga oshadi va ko‘p vaqt olishi mumkin.

### 2FA fishingdan himoya qiladimi?

Qisman. SMS va ilovadagi kodlarni ularni darhol haqiqiy saytga uzatuvchi soxta sahifa o‘g‘irlashi mumkin. Apparat kalitlar va passkeys haqiqiy domenga bog‘langan va soxta saytda ishlamaydi, shuning uchun ancha yaxshi himoya qiladi.

### SMS orqali 2FA yetarlimi?

Bu faqat paroldan yaxshiroq, lekin SMS’ni ushlab qolish yoki SIM-kartani qayta chiqarish orqali boshqa raqamga yo‘naltirish mumkin. Pochta va ish akkauntlari uchun autentifikator ilovasi yoki apparat kalit ishonchliroq.
