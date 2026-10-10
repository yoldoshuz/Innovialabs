---
title: Kompaniyani to‘lov talab qiluvchi dasturlardan qanday himoyalash
description: Ransomware qanday kiradi (fishing, RDP, eski dasturlar), qanday himoya qatlamlari kerak, nega zaxiralar izolyatsiyada bo‘lishi va ilk soatlarda nima qilinadi.
summary: Asosiy kirish yo‘llarini — fishing, ochiq RDP va yangilanmagan dasturlarni yoping, ikki bosqichli autentifikatsiyani yoqing, huquqlarni cheklang, izolyatsiya qilingan zaxira nusxalarni saqlang, zararlanganda esa qurilmalarni darhol tarmoqdan uzing.
---
## Qisqa javob

**To‘lov talab qiluvchi dastur (ransomware)** kompaniyaning fayllari va serverlarini shifrlaydi va kalit uchun to‘lov talab qiladi. Ko‘pincha hujumchilar ma’lumotlarni oldindan nusxalab oladi va ularni e’lon qilish bilan tahdid qiladi.

Himoya bir necha qatlamdan iborat:

- **Kirish yo‘llarini yopish**: fishing, himoyasiz masofaviy kirish, yangilanmagan dasturlar.
- **Tarqalishni cheklash**: minimal huquqlar, tarmoq segmentatsiyasi, administratorlar uchun alohida hisoblar.
- **Tiklashni ta’minlash**: hujumchi o‘chira yoki shifrlay olmaydigan zaxira nusxalar.
- Zararlanishdan keyingi ilk soatlar uchun **reja**.

## Ransomware ichkariga qanday kiradi

| Yo‘l | Qanday ko‘rinadi | Nima yordam beradi |
|---|---|---|
| **Fishing** | Ilovada «hisob-faktura», «dalolatnoma» yoki «rezyume» bo‘lgan yoki soxta kirish sahifasiga havola bo‘lgan xat | Pochtani filtrlash, makroslarni bloklash, xodimlarni o‘qitish, 2FA |
| **Ochiq RDP va masofaviy kirish** | Internetga ochiq RDP ga parol tanlash yoki o‘g‘irlangan VPN paroli bilan kirish | RDP faqat VPN orqali, VPN da 2FA, urinishlar limiti, ishlatilmaydigan kirishlarni o‘chirish |
| **Zaif dasturlar** | VPN shlyuzlari, pochta serverlari, CMS, plaginlardagi ma’lum zaifliklardan foydalanish | Muntazam yangilanishlar, birinchi navbatda internetdan ochiq bo‘lgan hamma narsa |
| **O‘g‘irlangan hisob ma’lumotlari** | Boshqa saytdan sizib chiqqan parol korporativ servislarga kirish uchun ishlatiladi | Noyob parollar, parollar menejeri, 2FA |
| **Litsenziyasiz dasturlar** | Zararli yuklamaga ega «aktivatorlar» va buzilgan dasturlar | Oddiy foydalanuvchilarga dastur o‘rnatishni taqiqlash |

## Ko‘p qatlamli himoya

**Bazaviy minimum:**

- Pochta, VPN, bulutli servislar va administrator panellarida **2FA**.
- OT, brauzerlar, ofis paketlari va ayniqsa tarmoq qurilmalari hamda serverlar uchun **yangilanishlar**.
- Barcha kompyuter va serverlarda markazlashgan nazoratli **antivirus yoki EDR**.
- Oddiy foydalanuvchilarda **administrator huquqlari yo‘q**.

**Keyingi daraja:**

- Kundalik ish va administrlash uchun **alohida hisoblar**.
- Har bir kompyuterda **mahalliy administratorning noyob paroli** (Windows da buning uchun LAPS bor).
- **Tarmoq segmentatsiyasi**: buxgalteriya, serverlar, mehmon Wi-Fi va kameralar — turli segmentlarda.
- **Hodisalar jurnallari** bir joyda yig‘iladi va hujumga uchrashi mumkin bo‘lgan serverlardan tashqarida saqlanadi.
- Haqiqiy xat namunalari asosida **xodimlarni o‘qitish** va shubhali narsa haqida xabar berishning oddiy usuli.

## Izolyatsiya qilingan zaxira nusxalar

Zamonaviy ransomware zaxira nusxalarni ataylab qidiradi va yo‘q qiladi. Zaxira nusxa faqat quyidagi hollarda himoya qiladi:

- **O‘zgarmas** (Object Lock yoki shunga o‘xshash ombor) yoki **oflayn** (nusxalashdan keyin uzilgan disk).
- Domenda bo‘lmagan va 2FA bilan himoyalangan **alohida hisob** orqali kirish mumkin.
- Zaxira serveri yoki NAS **domenga kirmaydi** va oddiy kompyuterlardan tarmoq papkalari orqali ochiq emas.
- **Tiklash orqali muntazam tekshiriladi** — ishga qaytish qancha vaqt olishini bilasiz.

## Zararlanishdan keyingi ilk soatlar

1. **Izolyatsiya qiling**: zararlangan kompyuterlarni tarmoqdan uzing (kabel, Wi-Fi). Zarurat bo‘lmasa, ularni o‘chirmang — xotirada tergov uchun foydali izlar qolishi mumkin.
2. **Tarqalishni to‘xtating**: masofaviy kirishni, kerak bo‘lsa, segmentlar o‘rtasidagi va bulutli omborlar bilan aloqani o‘chiring.
3. **Jamoani yig‘ing**: rahbariyat, IT, yurist; agar axborot xavfsizligi bo‘yicha pudratchi bilan shartnoma bo‘lsa — darhol chaqiring.
4. **Dalillarni saqlang**: talab yozilgan xat, shifrlangan fayllar namunalari, loglar. Baholashdan oldin tizimlarni o‘chirmang va qayta o‘rnatmang.
5. **Zaxira nusxalarni tekshiring**: ular butunmi, oxirgi toza nusxalar qachon olingan.
6. Toza qurilmadan **parollarni almashtiring** — birinchi navbatda administratorlar, pochta va VPN.
7. **Toza muhitga tiklang**: avval kirish nuqtasini yoping, aks holda zararlanish takrorlanadi.
8. Huquqni muhofaza qiluvchi organlarga **xabar bering** va shaxsga doir ma’lumotlar zarar ko‘rgan bo‘lsa, qonun bo‘yicha majburiyatlarni baholang.

To‘lov kalit olishingizni ham, o‘g‘irlangan ma’lumotlar e’lon qilinmasligini ham kafolatlamaydi. Ba’zi ransomware oilalari uchun bepul deshifratorlar mavjud — ularni No More Ransom loyihasi to‘playdi.

## FAQ

### Ransomware dan himoyalanish uchun antivirus yetarlimi?

Yo‘q. Antivirus — faqat bitta qatlam. Hujumlar ko‘pincha o‘g‘irlangan parol bilan kirishdan boshlanadi, keyin hujumchi administratorning qonuniy vositalaridan foydalanadi. 2FA, yangilanishlar, huquqlarni cheklash va izolyatsiya qilingan nusxalar ham kerak.

### To‘lovni to‘lash kerakmi?

Bu yurist ishtirokida rahbariyat qabul qiladigan qaror. To‘lov na deshifrlashni, na o‘g‘irlangan ma’lumotlarning o‘chirilishini kafolatlamasligini va kompaniyani takroriy hujumlar nishoniga aylantirishi mumkinligini hisobga oling. Eng yaxshi holat — to‘lamaslikka imkon beradigan nusxalarga ega bo‘lish.

### Byudjeti cheklangan kichik kompaniya nimadan boshlashi kerak?

Pochta va masofaviy kirishda 2FA, internetdan RDP ni yopish, avtomatik yangilanishlar hamda tiklanishi tekshirilgan bitta oflayn yoki o‘zgarmas zaxira nusxadan. Bu qadamlar eng ko‘p uchraydigan hujum ssenariylarini yopadi.
