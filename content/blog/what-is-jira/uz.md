---
title: Jira nima va u qanday ishlaydi
description: Jira oddiy tilda: loyihalar, vazifa turlari, epiklar, doskalar va workflow, vosita kimga mos va Jira Software Jira Work Management’dan qanday farq qiladi.
summary: Jira — Atlassian’ning vazifalarni hisobga olish tizimi: har bir vazifa loyiha ichidagi issue, vazifalar epiklarga birlashtiriladi, Scrum yoki Kanban doskalarida ko‘rsatiladi va statuslardan iborat workflow bo‘ylab harakatlanadi; tuzilma, hisobotlar va shaffof jarayon kerak bo‘lgan jamoalarga mos.
---
## Jira qisqacha

**Jira** — Atlassian kompaniyasining vazifalarni hisobga olish tizimi. Dastlab u bag-treker bo‘lgan, bugun esa dasturiy ta’minot ishlab chiqishni boshqarishda eng keng tarqalgan vositalardan biri. G‘oya oddiy: har qanday ish birligi — **issue** (vazifa), vazifalar **loyihalarda** yashaydi, **doskalarda** ko‘rsatiladi va **workflow** — «To Do»dan «Done»gacha bo‘lgan statuslar to‘plami bo‘ylab harakatlanadi.

## Jira nimalardan iborat

### Loyihalar

**Loyiha** — bitta mahsulot, jamoa yoki mijoz vazifalari uchun konteyner. Loyihaning qisqa **kaliti** bor, masalan `APP`, va har bir vazifa shunga asoslangan raqam oladi: `APP-123`. Bu raqamlar hamma joyda — kommitlarda, chatlarda va hujjatlarda ishlatiladi.

Loyihalar ikki xil bo‘ladi:

- **Team-managed** — jamoa hamma narsani o‘zi, tez va administratorsiz sozlaydi. Boshlash uchun yaxshi.
- **Company-managed** — sozlamalar (workflow, maydonlar, huquqlar) bir nechta loyiha uchun umumiy va administratorlar tomonidan boshqariladi. Ko‘p jamoalar uchun jarayonlarni standartlashtirish kerak bo‘lganda mos.

### Vazifa turlari

Vazifa turi bu qanday ish ekanini ko‘rsatadi. Ishlab chiqish jamoasi uchun odatiy to‘plam:

| Tur | Ma’nosi |
|---|---|
| **Epic** | Ko‘p vazifa va ko‘pincha bir nechta sprint talab qiladigan yirik maqsad yoki funksiya |
| **Story** | Foydalanuvchi nuqtai nazaridan qiymatning bir qismi |
| **Task** | Texnik yoki tashkiliy ish |
| **Bug** | Nimadir noto‘g‘ri ishlayapti |
| **Sub-task** | Story, task yoki bug ichidagi kichik qadam |

O‘z turlaringizni qo‘shish mumkin, lekin har bir yangi tur tizimni murakkablashtiradi, shuning uchun buni faqat ish haqiqatan farq qilganda qiling.

### Epiklar va ierarxiya

**Epiklar** bog‘liq vazifalarni birlashtiradi: «Onlayn to‘lov», «Push-bildirishnomalar», «Admin panel». Epik ostida story, task va bug, ularning ostida esa sub-task joylashadi. Bunday ierarxiya o‘nlab alohida vazifalarni ochmasdan katta funksiya bo‘yicha jarayonni ko‘rish imkonini beradi.

### Doskalar

**Doska** — vazifalarning ustunlardagi kartochkalar ko‘rinishidagi vizual tasviri.

- **Scrum doskasi** — ish belgilangan davrlar — **sprintlar** bilan rejalashtiriladi. Bekklog, sprintni rejalashtirish hamda burndown va velocity kabi hisobotlar bor.
- **Kanban doskasi** — sprintlarsiz uzluksiz oqim. Qo‘llab-quvvatlash, operatsion ishlar va doimiy so‘rovlar oqimi bor jamoalar uchun mos.

### Workflow

**Workflow** vazifa qanday statuslarga ega bo‘lishi mumkinligini va ular orasida qaysi o‘tishlarga ruxsat berilganini tasvirlaydi. Eng oddiy variant — To Do, In Progress, Done. Real jamoalar Code Review yoki QA kabi qadamlar qo‘shadi hamda vazifani kim siljitishi va o‘tishdan oldin nimani to‘ldirish kerakligini cheklashi mumkin.

## Jira kimga mos keladi

Jira quyidagi hollarda yaxshi ishlaydi:

- jamoa dasturiy ta’minot ishlab chiqadi va sprintlar yoki tuzilmali Kanban bo‘yicha ishlaydi;
- bir nechta jamoaga umumiy jarayon, kirish huquqlari va hisobotlar kerak;
- kuzatuvchanlik muhim: kim, nima va qachon qilgani, vazifa kod va relizlar bilan qanday bog‘langani;
- Git-xosting, CI/CD, Confluence va boshqa vositalar bilan integratsiyalar kerak.

Kichik jamoaga shunchaki vazifalar doskasi kerak bo‘lsa, Jira og‘irlik qilishi mumkin. Bunday holda ko‘pincha Trello yoki shunga o‘xshash vosita yetarli.

## Jira Software va Jira Work Management

Uzoq vaqt Atlassian ikkita alohida mahsulot sotgan:

- **Jira Software** — ishlab chiqish jamoalari uchun: Scrum va Kanban doskalari, bekklog, sprintlar, ishlab chiqish bilan integratsiyalar va agile hisobotlar.
- **Jira Work Management** — biznes jamoalar uchun: marketing, HR, yuristlar, moliya. Shablonlar soddaroq, «ro‘yxat», «kalendar» va «taymlayn» ko‘rinishlari, kiruvchi so‘rovlar uchun formalar bor, sprint terminologiyasi yo‘q.

Ikkala mahsulot bitta platformada ishlaydi, shuning uchun vazifalar, workflow va qidiruv bir xil tuzilgan. Keyinchalik Atlassian ularni yagona Jira’ga birlashtira boshladi, unda farq alohida litsenziyalarda emas, loyiha shablonlarida namoyon bo‘ladi. Amaliy qoida o‘zgarmagan: ishlab chiqish uchun **dasturiy ta’minot shablonlarini**, so‘rovlar oqimi va operatsion ishlar uchun **biznes shablonlarini** tanlang.

## Boshlashdagi keng tarqalgan xatolar

- Ulkan korporativ konfiguratsiyani kichik jamoaga ko‘chirish.
- Hech kim to‘ldirmaydigan o‘nlab maxsus maydonlar.
- Epiklarni yakuniy maqsad emas, abadiy toifa sifatida ishlatish.
- Ijrochisiz va aniq tayyorlik mezonisiz vazifalar.

## FAQ

### Jira faqat dasturchilar uchunmi?

Yo‘q. Asosiy auditoriya — ishlab chiqish jamoalari, lekin marketing, HR, qo‘llab-quvvatlash va operatsion jamoalar ham Jira’dan biznes shablonlari va soddalashtirilgan doskalar bilan foydalanadi.

### Qaysi loyihani tanlash kerak: team-managed yoki company-managed?

Bitta jamoa boshlayotgan bo‘lsa va hamma narsani o‘zi sozlamoqchi bo‘lsa — team-managed. Kompaniyaga ko‘p loyihalarda yagona jarayon va qoidalar kerak bo‘lsa — company-managed.

### Epik belgidan nimasi bilan farq qiladi?

Epik — o‘z jarayoni va yakuniga ega cheklangan ish hajmi. Belgi (label) esa shunchaki filtrlash uchun teg, uning statusi ham, muddati ham yo‘q.
