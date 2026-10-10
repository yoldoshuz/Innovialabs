---
title: Trello’da Butler bilan avtomatlashtirish: qoidalar, tugmalar, misollar
description: Trello’ni Butler bilan avtomatlashtirish: qoidalar, jadval va muddat buyruqlari, tugmalar hamda kartochkalarni siljitish va eslatmalar uchun tayyor retseptlar.
summary: Butler — Trello’ning ichki no-code avtomatlashtirishi: qoidalar hodisalarga javob beradi, jadval va muddat buyruqlari vaqt bo‘yicha, tugmalar esa bosilganda ishga tushadi; takroriy bosishlarni olib tashlaydigan ikki-uchta qoidadan boshlang va har birini doska nusxasida sinab ko‘ring.
---
## Butler nima qiladi

**Butler** — Trello’ga o‘rnatilgan avtomatlashtirish mexanizmi; hozir doska menyusida u odatda shunchaki **Automation** deb ataladi. U siz uchun amallarni bajaradi: kartochkalarni siljitadi, ishtirokchi qo‘shadi, muddat belgilaydi, izoh yozadi. Kod kerak emas — har bir buyruq muharrirda tayyor bloklardan yig‘iladi.

Avtomatlashtirishning to‘rt turi bor:

| Tur | Qachon ishga tushadi | Odatiy qo‘llanish |
|---|---|---|
| **Qoida (rule)** | Doskada biror narsa sodir bo‘lganda | Kartochka «Tayyor»ga o‘tdi — muddat bajarilgan deb belgilanadi |
| **Jadval bo‘yicha buyruq** | Kalendar bo‘yicha: har kuni, har hafta, har oy | Har dushanba rejalashtirish kartochkasi paydo bo‘ladi |
| **Muddat bo‘yicha buyruq** | Kartochka muddatiga nisbatan | Dedlayndan bir kun oldin eslatma |
| **Tugma** | Uni bosganda | «Olaman» sizni tayinlaydi va kartochkani «Jarayonda»ga o‘tkazadi |

Tugmalar ikki xil bo‘ladi: **kartochka tugmalari** har bir kartochka ichida ko‘rinadi, **doska tugmalari** doska sarlavhasida turadi va bir vaqtda ko‘p kartochkaga ta’sir qiladi.

## Qoidani qanday yaratish kerak

1. Doskani oching va doska menyusida **Automation**’ni tanlang.
2. **Rules** bo‘limiga o‘ting va yangi qoida yarating.
3. **Trigger** tanlang: kartochka siljitildi, qo‘shildi, belgi qo‘yildi, chek-list yakunlandi, muddat belgilandi va hokazo.
4. Triggerni filtrlar bilan toraytiring: qaysi ro‘yxat, kim tomonidan, qaysi belgi bilan.
5. Kerakli tartibda bir yoki bir nechta **amal** qo‘shing.
6. Saqlang va triggerni o‘zingiz bajarib, tekshirib ko‘ring.

Muharrir har bir buyruqni o‘qiladigan gap shaklida ko‘rsatadi. Quyidagi retseptlar ham shunday yozilgan (Butler interfeysi odatda ingliz tilida), shuning uchun ularni bloklar bo‘yicha oson yig‘ish mumkin.

## Retseptlar: kartochkalarni siljitish

Vazifa «Tayyor»ga tushganda uni to‘g‘ri yopish:

```text
when a card is moved into list "Done" by anyone,
mark the due date as complete and remove all the members from the card
```

Chek-list bajarilishi bilan kartochkani tekshiruvga yuborish:

```text
when all the checklists in a card are completed,
move the card to the top of list "Review"
```

Haftalik tozalash uchun doska tugmasi:

```text
archive all the cards in list "Done"
```

## Retseptlar: ishtirokchilarni tayinlash

Yangi baglarni ularni saralaydigan odamga yo‘naltirish:

```text
when a card with the "bug" label is added to list "Inbox" by anyone,
add member @qa-lead to the card
```

Vazifani o‘ziga olish uchun kartochka tugmasi:

```text
join the card, move the card to the top of list "In Progress"
```

O‘zgaruvchilar amallarni shaxsiy qiladi. Masalan, `{username}` buyruqni ishga tushirgan odamning ismini qo‘yadi — «{username} ishga oldi» kabi izohlarda qulay.

## Retseptlar: eslatmalar va muntazam ishlar

Kartochka ishtirokchilarini ogohlantiruvchi muddat buyrug‘i:

```text
1 day before a card is due,
post comment "@card the deadline is tomorrow"
```

Bu yerda `@card` kartochkaning barcha ishtirokchilarini eslatadi va ular bildirishnoma oladi.

Muntazam uchrashuv uchun jadval bo‘yicha buyruq:

```text
every monday at 9:00 am,
create a new card with title "Weekly planning" in list "To Do"
```

## Keng tarqalgan xatolar

- **Qoidalar bir-birini ishga tushiradi.** A qoida kartochkani ro‘yxatga o‘tkazadi, B qoida shu ro‘yxatga javob berib, uni qaytaradi. Saqlashdan oldin zanjirlarni tekshiring.
- **Juda keng trigger.** Ro‘yxat filtri bo‘lmagan «kartochkani har kim siljitganda» har bir sudrashda ishlaydi.
- **Ro‘yxat va belgilar nomini o‘zgartirish.** Buyruqlar nomlarga tayanadi, shuning uchun nomni o‘zgartirgandan keyin qoidalar hali ham ishlashini tekshiring.
- **Kvotani unutish.** Har bir tarifda oylik ishga tushirishlar limiti bor. Shovqinli qoida uni tugatib qo‘yishi mumkin; sarf Automation panelida ko‘rinadi.
- **Noaniq jarayonni avtomatlashtirish.** Jamoa «Tekshiruv» nimani anglatishini kelishib olmagan bo‘lsa, qoida faqat chalkashlikni tezlashtiradi.

## Nimadan boshlash kerak

Bir hafta davomida jamoa ishini kuzating va qaysi bosishlar eng ko‘p takrorlanishini yozib boring. Eng tez-tez uchraydigan ikki-uchtasini avtomatlashtiring, buyruqlarga tushunarli nom bering va jamoaga har biri nima qilishini aytib bering. Kutilmagan siljishlar odamlarni qo‘lda ishlashdan ham ko‘proq chalg‘itadi.

## FAQ

### Butler bepul tarifda mavjudmi?

Ha, avtomatlashtirish bepul tarifga kiradi, lekin pullik tariflarga qaraganda oylik ishga tushirishlar limiti kichikroq. Amaldagi limitlarni rasmiy tariflar sahifasida ko‘ring.

### Butler Trello’ni boshqa xizmatlar bilan bog‘lay oladimi?

Avtomatlashtirishda tashqi xizmatlar uchun bir nechta amal bor, masalan xat yoki Slack’ga xabar yuborish — to‘plam tarifga bog‘liq. Bir nechta tizim o‘rtasidagi murakkab integratsiyalar uchun odatda Zapier, Make yoki n8n moslashuvchanroq.

### Butler’dan foydalanish uchun dasturlashni bilish kerakmi?

Yo‘q. Har bir buyruq vizual muharrirda trigger va amallardan yig‘iladi. Muhimrog‘i — tushunarli jarayon: qanday ro‘yxatlar bor, har biri nimani anglatadi va kartochkalarni siljitishga kim mas’ul.
