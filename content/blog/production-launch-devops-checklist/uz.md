---
title: Loyihani production’ga chiqarishdan oldingi DevOps cheklisti
description: Ishga tushirishdan oldingi DevOps cheklisti: avtomatik deploy, monitoring va alertlar, loglar, tekshirilgan backup, quvvat zaxirasi va orqaga qaytish rejasi.
summary: Ishga tushirishdan oldin deploy avtomatlashtirilganiga, nosozliklar aniq odamga alert yuborishiga, loglarda qidirish mumkinligiga, backup kamida bir marta tiklanganiga, quvvat zaxirasi borligiga, orqaga qaytish daqiqalar olishiga va runbook’lar yozilganiga ishonch hosil qiling.
---

## Qisqa javob

Jamoa yettita savolga «ha» deb javob bera olsa, loyiha production’ga tayyor:

1. Serverlarda qo‘lda ish qilmasdan, bitta buyruq yoki tugma bilan deploy qila olamizmi?
2. Nosozlik haqida foydalanuvchilar yozishidan oldin bilib olamizmi?
3. Nima bo‘lganini loglardan bir necha daqiqada topa olamizmi?
4. Backup’ni faqat yaratibgina qolmay, haqiqatan tiklab ko‘rganmizmi?
5. Tizim kutilgan cho‘qqidan ko‘proq yuklamaga bardosh beradimi?
6. Muvaffaqiyatsiz relizni tez orqaga qaytara olamizmi?
7. Navbatchi odatiy hodisalarda nima qilishni biladimi?

Quyida har bir savol bo‘yicha cheklist. Uni ishga tushirish kunida emas, bir-ikki hafta oldin ko‘rib chiqing.

## Avtomatik deploy

- Build va deploy asosiy branch yoki teg bo‘yicha CI/CD’da ishlaydi; hech kim fayllarni serverga qo‘lda ko‘chirmaydi.
- Bitta artefakt (masalan, Docker image) avval staging’ga, keyin production’ga boradi.
- **Konfiguratsiya va maxfiy kalitlar** repozitoriyda emas, muhit o‘zgaruvchilari yoki secret manager’da saqlanadi.
- Baza migratsiyalari loglanadigan alohida qadam sifatida bajariladi.
- Staging production’ga yetarlicha o‘xshash, shuning uchun u yerdagi muvaffaqiyatli reliz nimanidir anglatadi.
- Deploy to‘xtalishga olib kelmaydi: health checks va graceful shutdown mavjud.

## Monitoring va alertlar

- Tarmog‘ingizdan tashqaridagi **uptime tekshiruvlari** asosiy sahifalar va API’ni so‘raydi.
- Asosiy metrikalar yig‘iladi: CPU, xotira, disk, tarmoq, shuningdek ilova metrikalari — so‘rovlar chastotasi, xatolar ulushi, kechikish.
- Biznes uchun muhim ssenariylar ham kuzatiladi: ro‘yxatdan o‘tish, to‘lovlar, buyurtma yaratish.
- **Alertlar** haqiqatan o‘qiladigan kanalga keladi va aniq navbatchi bor.
- Chegaralar real muammolarda ishlaydigan qilib sozlangan: shovqinli alert kanalini o‘qimay qo‘yishadi.
- Disk to‘lishi va SSL sertifikati muddati tugashi uchun alohida alertlar bor.

## Loglar

- Barcha servislarning loglari bir joyda yig‘iladi va ularda qidirish mumkin.
- Loglar tuzilmali (masalan, JSON) va so‘rov yoki trace ID’sini o‘z ichiga oladi.
- Shaxsiy ma’lumotlar, parollar va tokenlar loglarga yozilmaydi.
- Loglar diskni to‘ldirmasligi uchun saqlash muddati va rotatsiya sozlangan.
- Faqat server emas, frontend xatolari ham yig‘iladi.

## Tiklanishi tekshirilgan backup

Hech qachon tiklanmagan backup — bu shunchaki umid.

- Ma’lumotlar bazalari, yuklangan fayllar va muhim konfiguratsiya avtomatik zaxiralanadi.
- Nusxalar asosiy serverdan tashqarida va, ideal holda, asosiy provayder yoki regiondan tashqarida saqlanadi.
- Siz o‘z **RPO** (qancha ma’lumot yo‘qotish mumkin) va **RTO** (tiklash qancha davom etishi mumkin) ko‘rsatkichlaringizni bilasiz va backup jadvali ularga mos.
- To‘liq tiklash alohida muhitda bajarilgan, qadamlar yozib qo‘yilgan.
- Backup muvaffaqiyatsiz bo‘lsa, alert keladi.

## Quvvat zaxirasi

- Muhim ssenariylar kutilgan cho‘qqi va undan yuqori darajada yuklama testidan o‘tgan.
- Qaysi komponent birinchi bo‘lib chegaraga yetishini bilasiz: ilova serverlari, baza, kesh yoki tashqi API.
- Quvvatni qanday oshirish rejasi bor: ko‘proq nusxalar, kuchliroq baza, avtomasshtablash.
- Tashqi chaqiruvlar uchun rate limit va timeout’lar belgilangan, sekin hamkor butun ilovani qotirib qo‘ymaydi.
- Statik fayllar va media CDN orqali beriladi yoki hech bo‘lmaganda to‘g‘ri keshlanadi.

## Orqaga qaytish rejasi

- Oldingi versiyani xuddi shu pipeline bilan deploy qilish mumkin.
- Migratsiyalar orqaga mos, shuning uchun orqaga qaytish bazani buzmaydi.
- **Feature flag’lar** xavfli funksiyalarni deploysiz o‘chirishga imkon beradi.
- Orqaga qaytish haqida kim va qanday mezonlar bo‘yicha qaror qilishi oldindan kelishilgan.

## Runbook’lar va kirish huquqlari

**Runbook** — muayyan vaziyat uchun qisqa yozma yo‘riqnoma. Ularni kamida quyidagi holatlar uchun tayyorlang:

- sayt ochilmaydi yoki xato qaytaradi;
- baza haddan tashqari yuklangan yoki diskda joy qolmagan;
- deploy yarmida to‘xtab qolgan;
- backup’ni tiklash kerak;
- maxfiy kalit sizib chiqqan va uni almashtirish kerak.

Kirish huquqlarini ham tekshiring: kamida ikki kishi serverlar, bulut akkaunti, domen registratori va DNS’ga kira oladi; akkauntlar bitta xodimga emas, kompaniyaga tegishli; ikki bosqichli autentifikatsiya yoqilgan.

## FAQ

### Kichik loyiha uchun bu ortiqcha emasmi?

Ko‘lam o‘zgaradi, savollar emas. Kichik loyiha managed platforma, oddiy uptime monitor va provayder backup’laridan foydalanishi mumkin, lekin tekshirilgan tiklash, alertlar va orqaga qaytish yo‘li baribir kerak.

### Vaqt kam bo‘lsa, nimadan boshlash kerak?

Tiklanishi tekshirilgan backup, uptime alertlari va orqaga qaytish imkoni bor avtomatik deploydan. Bu uchtasi eng og‘riqli ssenariylarni yopadi: ma’lumot yo‘qotish, sezilmagan to‘xtalish va buzilgan reliz.

### Bu cheklist uchun kim mas’ul bo‘lishi kerak?

Odatda DevOps muhandisi yoki texnik lider, lekin mahsulot egasi ham uni ko‘rishi kerak. Ayrim bandlar — RPO, RTO, navbatchilik tartibi — sof texnik emas, balki biznes qarorlari.
