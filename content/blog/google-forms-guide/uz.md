---
title: Google Forms: so‘rovnoma yaratish va javoblarni yig‘ish
description: Google Forms’da so‘rovnoma tuzish: savol turlari, bo‘limlar va tarmoqlanish, testlar, javoblarni tekshirish, Google Sheets bilan bog‘lash va xabarnomalar.
summary: forms.google.com’da forma yarating, mos savol turlarini tanlang, javoblarni tekshirish va bo‘limlar orasidagi o‘tishlarni sozlang, Google Sheets jadvalini ulang va yangi javoblar haqida xabarnomalarni yoqing.
---
## Qisqa javob

Google Forms — dasturchisiz javob yig‘ishning bepul usuli. Asosiy tartib:

1. forms.google.com’ni oching va bo‘sh forma yoki shablon yarating.
2. Kerakli turdagi savollarni qo‘shing va majburiylarini belgilang.
3. Uzun formani **bo‘limlarga** ajrating va o‘tishlarni sozlang.
4. Format muhim bo‘lgan joylarda **javoblarni tekshirish**ni yoqing.
5. «Javoblar» bo‘limida **Google Sheets** jadvalini ulang va xabarnomalarni yoqing.
6. «Yuborish»ni bosing va havola yoki joylashtirish kodini ulashing.

## Savol turlari

| Tur | Qachon ishlatiladi |
|---|---|
| Qisqa javob | Ism, telefon, email, qisqa matn |
| Abzats | Fikr-mulohazalar, batafsil izohlar |
| Bir nechtadan biri | Bitta variant, hammasi birdan ko‘rinadi |
| Bayroqchalar | Bir nechta variant tanlash mumkin |
| Ochiladigan ro‘yxat | Uzun ro‘yxat, masalan shaharlar |
| Shkala | Baholash oralig‘i, masalan mamnunlik |
| Jadval (grid) | Bir nechta bandni bitta shkala bo‘yicha baholash |
| Sana va vaqt | Bron, uchrashuvga yozilish, muddatlar |
| Fayl yuklash | Rezyume, rasm, hujjatlar |

E’tibor bering: **fayl yuklash** uchun respondent Google akkauntiga kirishi kerak, fayllar esa forma egasining Diskiga saqlanadi.

## Bo‘limlar va tarmoqlanish

Bo‘limlar formani sahifalarga ajratadi. Tarmoqlanish har bir odamga faqat unga tegishli savollarni ko‘rsatadi:

1. «Bo‘lim qo‘shish» tugmasi bilan bo‘limlar qo‘shing.
2. «Bir nechtadan biri» yoki «Ochiladigan ro‘yxat» savolida uch nuqtali menyuni oching va **«Javobga qarab bo‘limga o‘tish»**ni tanlang.
3. Har bir variant uchun qaysi bo‘limga olib borishini belgilang.

Misol: «Siz bizning mijozimizmisiz?» — «Ha» xizmat sifati bo‘limiga, «Yo‘q» esa biz haqimizda qayerdan bilgani haqidagi bo‘limga olib boradi.

## Testlar

Sozlamalarda **«Test qilish»**ni yoqing. Keyin har bir savol uchun to‘g‘ri javob kalitini va ballni belgilang, xohlasangiz to‘g‘ri va noto‘g‘ri javoblarga izoh qo‘shing. Natijalarni yuborilgandan so‘ng darhol yoki qo‘lda tekshirilgandan keyin ko‘rsatish mumkin — bu ochiq javobli savollar bo‘lsa qulay.

## Javoblarni tekshirish

Tekshirish ma’lumotlarni keraksiz yozuvlardan himoya qiladi. Savolning uch nuqtali menyusini oching va «Javoblarni tekshirish»ni tanlang:

- **Raqam**: katta, kichik, oraliqda — yosh yoki miqdor uchun.
- **Matn**: o‘z ichiga oladi, email, URL — kontaktlar uchun.
- **Uzunlik**: belgilarning minimal va maksimal soni.
- **Muntazam ifoda** (regex): qat’iy formatlar uchun.
- «Bayroqchalar» uchun: kamida, ko‘pi bilan yoki aynan N ta variant tanlash.

+998XXXXXXXXX formatidagi O‘zbekiston telefon raqami uchun muntazam ifoda:

```text
^\+998\d{9}$
```

## Google Sheets bilan bog‘lash

«Javoblar» bo‘limida **«Sheets bilan bog‘lash»**ni bosing. Har bir yangi javob vaqt belgisi bilan jadvalda alohida qator bo‘lib paydo bo‘ladi. Maslahatlar:

- javob ustunlarini o‘zgartirmang, ularni alohida varaqda formulalar orqali tahlil qiling;
- formadagi savol nomini o‘zgartirsangiz, ustun sarlavhasi ham o‘zgaradi va sarlavhaga tayangan formulalar buzilishi mumkin.

## Pochtaga xabarnomalar

**O‘rnatilgan usul:** «Javoblar» bo‘limi → uch nuqtali menyu → **«Yangi javoblar haqida email xabarnomalarini olish»**. Xat forma egasiga keladi.

**O‘z matningiz yoki bir nechta qabul qiluvchi:** bog‘langan jadvalda Apps Script’dan foydalaning (Kengaytmalar → Apps Script):

```javascript
function notifyTeam(e) {
  const lines = Object.entries(e.namedValues)
    .map(([question, answer]) => question + ': ' + answer.join(', '));
  MailApp.sendEmail('team@example.com', 'Formada yangi javob', lines.join('\n'));
}
```

So‘ng «Triggerlar» bo‘limida `notifyTeam` uchun trigger qo‘shing: manba — «Jadvaldan», hodisa — «Forma yuborilganda».

## Keng tarqalgan xatolar

- Bo‘limlarsiz juda uzun forma: odamlar uni yarmida tashlab ketadi.
- Kontaktlar uchun majburiy maydonlar yo‘q, natijada javob bo‘yicha bog‘lanadigan odam yo‘q.
- Nima uchun kerakligini tushuntirmasdan shaxsiy ma’lumotlarni yig‘ish.
- Javoblar varag‘idagi qo‘lda kiritilgan o‘zgarishlar keyinchalik hisobotlarni buzadi.

## FAQ

### Bir kishiga faqat bitta javob berishni cheklasa bo‘ladimi?

Ha, sozlamalarda «Faqat 1 ta javob» cheklovi bor. Lekin buning uchun respondent Google akkauntiga kirishi kerak, bu esa auditoriyaning bir qismini qaytarishi mumkin.

### Formani saytga qanday joylashtirish mumkin?

«Yuborish»ni bosing, kod belgisi bor yorliqni tanlang va iframe’ni nusxalang. Uni istalgan sayt konstruktori yoki HTML sahifaga qo‘yish mumkin.

### Javoblar kela boshlagandan keyin formani tahrirlasa bo‘ladimi?

Bo‘ladi, eski javoblar saqlanib qoladi. Ammo o‘chirilgan savol umumiy natijalardan yo‘qoladi, jadvalda esa uning ustuni qoladi — tahlilda buni hisobga oling.
