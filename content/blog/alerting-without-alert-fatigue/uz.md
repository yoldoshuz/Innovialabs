---
title: Bildirishnomalardan charchamasdan alertlarni qanday sozlash kerak
description: Simptom va sabab bo‘yicha alertlar, jiddiylik darajalari, Telegram va on-call servislarga yo‘naltirish, dublikatlar va shovqinli alertlar tahlili.
summary: Odamni faqat foydalanuvchilar allaqachon qiynalayotganda yoki tez orada qiynalishi mumkin bo‘lganda va harakat talab qilinganda uyg‘oting; qolganini tiket yoki dashboardga yuboring, shovqinli alertlarni esa muntazam tozalang.
---

## Alerting’ning asosiy qoidasi

Navbatchiga keladigan har bir alert **shoshilinch, muhim va odamdan harakat talab qiladigan** bo‘lishi kerak. Agar bildirishnomaga e’tibor bermaslik mumkin bo‘lsa, bu alert emas, shovqin.

**Alert fatigue** (alertlardan charchash) bildirishnomalar shunchalik ko‘p bo‘lganda paydo bo‘ladiki, odamlar ularni o‘qimay qo‘yadi. Natijada haqiqiy insident yolg‘on signallar orasida yo‘qolib ketadi.

## Simptom va sabab bo‘yicha alertlar

- **Simptomlar** — foydalanuvchi ko‘radigan narsa: xatolar ulushi oshmoqda, sahifalar sekin yuklanmoqda, buyurtmalar o‘tmayapti.
- **Sabablar** — ichki holatlar: CPU yuklamasi yuqori, xotira tugayapti, pod qayta ishga tushdi.

| | Simptom bo‘yicha | Sabab bo‘yicha |
|---|---|---|
| Nimani ko‘rsatadi | Foydalanuvchilarga yomon | Nimadir noto‘g‘ri ketishi mumkin |
| Yolg‘on signallar | Kam | Ko‘p |
| Qayerga yuborish | Navbatchiga, shoshilinch | Tiket yoki dashboardga |

**Odamlarni simptomlar bo‘yicha uyg‘oting.** Sabab bo‘yicha alertlar diagnostika uchun kontekst va ish vaqtida ko‘rib chiqiladigan ogohlantirish sifatida foydali. Istisno — tez orada albatta nosozlikka olib keladigan sabablar, masalan, disk bir necha soatda to‘lib qolishi.

Simptom alertlari uchun yaxshi asos — **SLO va burn rate**: error budget juda tez sarflanganda alert ishga tushadi.

## Jiddiylik darajalari

Aniq qoidalarga ega uch-to‘rtta daraja yetarli:

- **Critical** — foydalanuvchilar hozir zarar ko‘rmoqda. Istalgan vaqtda navbatchiga qo‘ng‘iroq yoki push.
- **Warning** — tez orada muammoga aylanadi. Jamoa kanaliga xabar, ish vaqtida ko‘rib chiqiladi.
- **Info** — tarix va dashboardlar uchun. Bildirishnomasiz.

Agar jamoa critical warning’dan nimasi bilan farq qilishini tushuntira olmasa, darajalar ishlamayapti.

## Bildirishnomalarni yo‘naltirish

Prometheus Alertmanager bilan odatiy sxema:

```yaml
route:
  receiver: telegram-team
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers:
        - severity="critical"
      receiver: oncall-pager
```

- **Telegram yoki Slack** — warning va umumiy kontekst uchun qulay, lekin tunda o‘tkazib yuborish oson.
- **On-call vositalari** (PagerDuty, Opsgenie, Grafana OnCall va o‘xshashlari) — critical uchun: navbatchilik jadvali, eskalatsiya, qabul qilinganini tasdiqlash.
- Har bir alertning **egasi** bo‘lishi kerak — jamoa yoki servis.

## Dublikatlarni yo‘qotish va guruhlash

Ma’lumotlar bazasidagi bitta nosozlik turli servislardan yuzlab alertlarni keltirib chiqarishi mumkin. Buning oldini olish uchun:

- Alertlarni servis va tur bo‘yicha **guruhlang**.
- **Inhibition**dan foydalaning: butun klaster ishdan chiqqan bo‘lsa, har bir pod bo‘yicha alert kerak emas.
- Qisqa muddatli sakrashlar odamlarni uyg‘otmasligi uchun qoidalarga `for:` kechikishini qo‘shing.
- Bir xil alert har besh daqiqada kelmasligi uchun **oqilona repeat_interval** sozlang.

## Shovqinli alertlarni muntazam tahlil qilish

Alerting — bir martalik sozlash emas. Haftada yoki har sprintda bir marta tekshiring:

1. Qaysi alertlar eng ko‘p ishga tushdi?
2. Ulardan qaysilariga haqiqatda reaksiya bildirildi?
3. Qaysilari hech qanday harakatsiz o‘zi yopildi?

Shovqinli alertni **tuzatish, darajasini pasaytirish yoki o‘chirish** kerak. Har bir alertda **runbook**ka havola bo‘lishi kerak — nimani tekshirish va nima qilish haqida qisqa yo‘riqnoma.

## FAQ

### Bir smenada qancha alert normal hisoblanadi?

Universal raqam yo‘q. Mo‘ljal: navbatchi har bir critical alertni tahlil qilib, sababini bartaraf etishga ulgurishi kerak. Agar alertlar qaramasdan tasdiqlanayotgan bo‘lsa, ular juda ko‘p.

### Navbatchilik uchun faqat Telegram’dan foydalansa bo‘ladimi?

Kichik jamoa uchun bu ishlaydigan boshlanish, lekin Telegram’da eskalatsiya va qabul qilinganini tasdiqlash yo‘q. Muhim servislar uchun qo‘ng‘iroqlar va jadvalga ega on-call vositasini qo‘shgan ma’qul.

### CPU yuklamasi bo‘yicha alert kerakmi?

Odatda odamni uyg‘otadigan alert sifatida yo‘q: yuqori CPU o‘z-o‘zidan foydalanuvchilarda muammo borligini anglatmaydi. Uni dashboardda ko‘rsating, alertni esa kechikish va xatolar bo‘yicha sozlang.
