---
title: DevOps nima: tamoyillar, amaliyotlar va vositalar sodda tilda
description: DevOps sodda tilda: madaniyat va avtomatlashtirish, yig‘ishdan ekspluatatsiyagacha yetkazib berish sikli, har bosqich vositalari va jamoada nima o‘zgaradi.
summary: DevOps — bu ishlab chiqish va ekspluatatsiya bitta jamoa bo‘lib ishlaydigan, yig‘ish, test, deploy va monitoring esa avtomatlashtirilgan yondashuv. Maqsad — o‘zgarishlarni tez-tez, kichik qismlarda va avariyasiz chiqarish.
---
## Qisqa javob

**DevOps** — lavozim ham, aniq bir dastur ham emas, balki ishlash usuli. Ilgari dasturchilar kod yozib, uni administratorlarga «oshirib» berishardi, ular esa serverlar va nosozliklar uchun javob berishardi. DevOps bu devorni olib tashlaydi: bitta jamoa mahsulot uchun commit’dan production’gacha javobgar.

Yondashuv ikki ustunga tayanadi:

- **Madaniyat** — umumiy mas’uliyat, aybdor qidirmasdan xatolarni ochiq tahlil qilish, qisqa qayta aloqa.
- **Avtomatlashtirish** — takrorlanadigan hamma ishni mashina bajaradi: yig‘ish, testlar, deploy, server yaratish, ogohlantirishlar.

Madaniyatsiz avtomatlashtirish hech kim ishonmaydigan chiroyli pipeline beradi. Avtomatlashtirishsiz madaniyat esa qo‘l mehnatiga borib taqaladi.

## Yetkazib berish sikli: to‘rt bosqich

Har bir o‘zgarish bir xil yo‘ldan o‘tadi. DevOps bu yo‘lni tez va oldindan bashorat qilinadigan qiladi.

1. **Build (yig‘ish).** Repozitoriydagi kod artefaktga aylanadi: binar fayl, paket yoki Docker-image. Yig‘ish istalgan mashinada bir xil natija berishi kerak.
2. **Test (tekshiruv).** Avtomatik testlar, linterlar va xavfsizlik tekshiruvlari har bir commit yoki pull request’da ishga tushadi. Xato production’da emas, bir necha daqiqada aniqlanadi.
3. **Deploy (chiqarish).** Tekshirilgan artefakt avval staging’ga, keyin production’ga chiqariladi — bitta buyruq bilan yoki avtomatik, fayllarni SSH orqali qo‘lda ko‘chirmasdan.
4. **Operate (ekspluatatsiya).** Monitoring, loglar va alertlar tizim real foydalanuvchilarda qanday ishlayotganini ko‘rsatadi. Bu ma’lumotlar keyingi o‘zgarishlarni rejalashtirishga qaytadi.

Build-test-deploy zanjiri **CI/CD** deb ataladi: Continuous Integration (kodni tekshiruvlar bilan doimiy birlashtirish) va Continuous Delivery/Deployment (chiqarishga doimiy tayyorlik yoki avtomatik chiqarish).

## Bosqichlar bo‘yicha vositalar

| Bosqich | Vazifa | Odatiy vositalar |
|---|---|---|
| Kod | Saqlash va review | Git, GitHub, GitLab |
| Yig‘ish | Takrorlanadigan artefaktlar | Docker, til yig‘uvchilari |
| CI/CD | Avtomatik tekshiruv va chiqarish | GitHub Actions, GitLab CI, Jenkins |
| Infratuzilma | Serverlar kod sifatida | Terraform, Ansible |
| Ishga tushirish | Konteynerlarni boshqarish | Docker Compose, Kubernetes |
| Ekspluatatsiya | Metrikalar, loglar, alertlar | Prometheus, Grafana, Loki, ELK |

Vositalar ikkinchi darajali. Moda texnologiyalar ro‘yxatidan emas, eng ko‘p og‘riq beradigan muammodan boshlang.

## Asosiy amaliyotlar

- **Infrastructure as Code.** Serverlar, tarmoqlar va bazalar fayllarda tasvirlanadi va Git’da saqlanadi. Muhitni qayta yaratish mumkin, o‘zgarishlar esa tarixda ko‘rinadi.
- **Kichik va tez-tez relizlar.** Kichik o‘zgarishni tekshirish ham, orqaga qaytarish ham osonroq.
- **Bir xil muhitlar.** Staging production kabi tuzilgan bo‘lishi kerak, aks holda undagi testlar ko‘p narsani isbotlamaydi.
- **Kuzatuvchanlik.** Muammo haqida mijozdan emas, alertdan bilasiz.
- **Insidentlar tahlili.** Nosozlikdan keyin jamoa sababni qayd etadi va xato takrorlanmasligi uchun jarayonni o‘zgartiradi.

## Jamoada nima o‘zgaradi

- Dasturchi kodi production’da qanday ishlayotganini ko‘radi va muammolarni hal qilishda qatnashadi.
- Reliz «tun bo‘yi» davom etadigan voqea bo‘lmay qoladi — bu ish vaqtidagi oddiy operatsiya.
- Serverlar haqidagi bilimlar bitta administratorning boshida emas, repozitoriyda saqlanadi.
- Rutinani avtomatlashtirish olgani uchun mahsulotni rivojlantirishga vaqt paydo bo‘ladi.

O‘tish bosqichma-bosqich bo‘ladi. Real birinchi qadam — har bir pull request uchun avtomatik yig‘ish va testlarni sozlash, keyin staging’ga deploy’ni avtomatlashtirish, so‘ng monitoring qo‘shish.

## Ko‘p uchraydigan xatolar

- **«DevOps-muhandis» yollab, vazifani hal bo‘ldi deb hisoblash.** Ishlab chiqish va ekspluatatsiya hamon alohida yashasa, hech narsa o‘zgarmaydi.
- **Darhol Kubernetes joriy qilish.** Kichik loyiha uchun murakkablik foydadan oshib ketishi mumkin.
- **Tartibsizlikni avtomatlashtirish.** Qo‘lda bajariladigan jarayon tushunarsiz bo‘lsa, skript uni xatolari bilan birga tezlashtiradi xolos.
- **Monitoringni unutish.** Kuzatuvchanliksiz tez relizlar — bu tez avariyalar.

## FAQ

### DevOps — kasbmi yoki metodologiya?

Avvalo metodologiya va madaniyat. DevOps-muhandis deb odatda pipeline va infratuzilmani quradigan mutaxassisni aytishadi, lekin yondashuvning o‘zi butun jamoaga tegishli.

### Kichik loyihaga DevOps kerakmi?

Asosiy amaliyotlar — ha: Git, avtomatik yig‘ish, testlar va oddiy deploy hatto ikki kishilik jamoaning ham vaqtini tejaydi. Murakkab infratuzilma esa shart emas.

### DevOps SRE’dan nimasi bilan farq qiladi?

SRE (Site Reliability Engineering) — DevOps g‘oyalarining ishonchlilikka urg‘u berilgan aniq ko‘rinishi: mavjudlik bo‘yicha maqsadli ko‘rsatkichlar, xatolar byudjeti va ekspluatatsiyaga muhandislik yondashuvi.
