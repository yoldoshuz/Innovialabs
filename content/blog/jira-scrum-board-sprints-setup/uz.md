---
title: Jira’da Scrum doskasi va sprintlarni qanday sozlash kerak
description: Jira’da Scrum loyihasini yaratish, bekklogni tartiblash, story points bilan baholash, sprintlarni boshlash va yopish, burndown va velocity’ni o‘qish.
summary: Scrum shablonidan loyiha yarating, bekklogni to‘ldiring va ustuvorlik bo‘yicha tartiblang, vazifalarni story points bilan baholang, sprintni aniq maqsad va real hajm bilan boshlang, uni halol yoping va keyingisini burndown hamda velocity asosida rejalashtiring.
---
## Qisqacha

Jira’da ishlaydigan Scrum besh qadamda sozlanadi: **Scrum loyihasini yaratish**, **bekklogni yig‘ish va tartiblash**, **vazifalarni story points bilan baholash**, **sprintni boshlash**, **uni yopish va hisobotlarni ko‘rish**. Sozlashning o‘zi bir necha daqiqa oladi, foydani esa uning atrofidagi intizom beradi.

## 1-qadam. Scrum loyihasini yaratish

1. Yangi loyiha yarating va ishlab chiqish shablonlari orasidan **Scrum**’ni tanlang.
2. Loyiha turini tanlang. **Team-managed** bitta jamoa uchun tezroq sozlanadi, **company-managed** esa workflow va maydonlar bir nechta loyiha uchun umumiy bo‘lishi kerak bo‘lganda yaxshiroq.
3. Loyihaga tushunarli nom va qisqa kalit bering, masalan `APP`.

Jira **Backlog** ko‘rinishi, **faol sprint** va hisobotlarga ega doska yaratadi.

## 2-qadam. Bekklogni tartibga solish

**Bekklog** — jamoa bajarishi mumkin bo‘lgan barcha ishlarning tartiblangan ro‘yxati. Muntazam gruming (backlog refinement) uni foydali holda saqlaydi:

- **Ustuvorlik bo‘yicha tartib.** Eng muhim vazifalarni yuqoriga suring. Tartibning o‘zi — reja.
- **Yuqoridagi vazifalar ishga tayyor.** Keyingi bir-ikki sprint vazifalarida tushunarli tavsif va **qabul qilish mezonlari** bor.
- **Kattalari bo‘linadi.** Story bitta sprintga sig‘masa, uni bir nechtaga bo‘ling va bitta epik ostida qoldiring.
- **Ortiqchasi olib tashlanadi.** Dublikatlarni va hech kim hech qachon qilmaydigan g‘oyalarni yoping.

Yaxshi qoida: har bir sprint oldidan uzoq uchrashuv o‘tkazish o‘rniga grumingni muntazam va qisqa qilib o‘tkazing.

## 3-qadam. Story points bilan baholash

**Story points** soatlarni emas, ishning nisbiy hajmini — mehnat, murakkablik va noaniqlikni birgalikda o‘lchaydi. 5 ochkolik story 2 yoki 3 ochkolikdan taxminan ikki baravar katta.

Qanday sozlash va ishlatish:

- Doskaning **baholash (estimation)** sozlamasida story points tanlanganiga ishonch hosil qiling. Company-managed loyihalarda bu doska sozlamalarida, team-managed’da — loyiha funksiyalarida.
- Qisqa shkaladan foydalaning, ko‘pincha Fibonachchi asosida: 1, 2, 3, 5, 8, 13.
- Butun jamoa bo‘lib baholang, masalan planning poker orqali, shunda turli fikrlar oldindan yuzaga chiqadi.
- Shkalaning yuqori qismidagi baho — vazifani bo‘lish vaqti kelganining belgisi.

Ochkolarni soatga aylantirmang va turli jamoalar ochkolarini solishtirmang: har bir jamoaning o‘z shkalasi bor.

## 4-qadam. Sprintni boshlash

1. Backlog ko‘rinishida **sprint yarating**.
2. Unga bekklog yuqorisidan vazifalarni suring. Sprintdagi story points yig‘indisi hajmni odatiy sur’at bilan solishtirishga yordam beradi.
3. **Start sprint** tugmasini bosing va **nom**, **davomiylik**, **boshlanish va tugash sanalari** hamda **sprint maqsadi**ni kiriting — bu sprint nima uchun kerakligi haqida bitta gap.
4. Faol sprint doskasida ishlang va vazifalar harakatlangani sari statuslarni yangilang.

Sprint o‘rtasida yangi vazifalar qo‘shmang. Shoshilinch ish paydo bo‘lsa, hajmi taqqoslanadigan boshqa ishni olib tashlang.

## 5-qadam. Sprintni yopish

Oxirida **Complete sprint**’ni bosing. Jira tugallanmagan vazifalar bilan nima qilishni so‘raydi: **bekklogga** qaytarish yoki **keyingi sprintga** o‘tkazish. Ongli qaror qabul qiling — tugallanmagan ishni avtomatik ko‘chirish emas, qaytadan ustuvorlashtirish kerak.

So‘ng bajarilgan ishlar **sharhini** va jamoa qanday ishlagani haqida **retrospektiva** o‘tkazing.

## Burndown va velocity’ni qanday o‘qish kerak

| Hisobot | Nimani ko‘rsatadi | Nimaga e’tibor berish kerak |
|---|---|---|
| **Sprint burndown** | Sprintdagi qolgan ishni kunma-kun ideal chiziqqa nisbatan | Gorizontal chiziq va oxirida keskin tushish — ish kichik qismlarda yopilmayapti. Chiziq yuqoriga ketsa — sprint o‘rtasida hajm qo‘shilgan |
| **Velocity** | Oxirgi sprintlardagi rejalashtirilgan va bajarilgan story points | Bajarilganning barqaror qiymati — rejalashtirish uchun asos. Reja va fakt o‘rtasidagi doimiy katta farq — ortiqcha rejalashtirish |
| **Sprint report** | Sprint davomida nima bajarilgani, nima bajarilmagani va nima qo‘shilgani | Hajm o‘zgarishlari va ko‘chirishlar darhol ko‘rinadi |

Velocity — jamoa uchun rejalashtirish vositasi, samaradorlik bahosi emas. U maqsadga aylanishi bilan baholar sun’iy oshiriladi va raqamlar ma’nosini yo‘qotadi.

## Keng tarqalgan xatolar

- Tartiblanmagan bekklog bilan sprintni boshlash.
- Ochko niqobi ostida soatlarda baholash.
- Sprintni muhokamasiz hammasini oldinga ko‘chirib yopish.
- Odamlarni ularning story points yig‘indisi bo‘yicha baholash.

## FAQ

### Sprint qancha davom etishi kerak?

Ko‘p jamoalar bir yoki ikki haftani tanlaydi. Qisqa sprintlar tez qayta aloqa beradi, uzunlari esa bo‘lish qiyin bo‘lgan ishlarga mos. Bitta uzunlikni tanlang va velocity’ni solishtirish mumkin bo‘lishi uchun uni barqaror saqlang.

### Burndown bo‘sh bo‘lsa nima qilish kerak?

Odatda sprintdagi vazifalarda baho yo‘q yoki doska boshqa baholash ko‘rsatkichidan foydalanadi. Estimation sozlamasini tekshiring va sprint vazifalarida story points qo‘yilganiga ishonch hosil qiling.

### Scrum’ni story points’siz yuritsa bo‘ladimi?

Ha. Ba’zi jamoalar vazifalar sonini sanaydi va ularni taxminan bir xil hajmda saqlaydi. Asosiysi — sprintlarni solishtirish uchun doimiy o‘lchov birligi.
