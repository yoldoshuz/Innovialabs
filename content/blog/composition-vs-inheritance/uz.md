---
title: Kompozitsiya yoki meros: qachon qaysi birini tanlash kerak
description: Chuqur klass ierarxiyalari nega buziladi, mo‘rt bazaviy klass muammosi qanday paydo bo‘ladi va kompozitsiya hamda meros orasida qanday tanlash kerak.
summary: Odatiy holatda kompozitsiyani tanlang: obyektlarni kichik, almashtiriladigan qismlardan yig‘ing. Merosni faqat haqiqiy va barqaror «bu — shu» munosabati hamda sayoz ierarxiya uchun qoldiring.
---

## Qisqa javob

**Kompozitsiya** — obyekt boshqa obyektlarni *o‘z ichiga oladi* va ishni ularga topshiradi. **Meros (inheritance)** — klass boshqa klassning xususiy holati *hisoblanadi* va uning kodidan qayta foydalanadi.

«Merosdan ko‘ra kompozitsiyani afzal ko‘ring» qoidasi bejiz paydo bo‘lmagan: meros quyi klassni ota klassning ichki xatti-harakatiga bog‘lab qo‘yadi, kompozitsiya esa obyektlarni faqat kichik interfeyslar orqali bog‘laydi. Meros foydali vosita bo‘lib qoladi, lekin odatda qo‘llanilganidan torroq vazifalar uchun.

## Mo‘rt bazaviy klass muammosi

Quyi klass ota klassning faqat public API’siga emas, ko‘pincha uni *qanday* amalga oshirganiga ham bog‘liq bo‘ladi. Ota klassni o‘zgartirasiz — merosxo‘rlar buziladi, garchi ularning kodiga hech kim tegmagan bo‘lsa ham.

```python
class Collection:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def add_all(self, items):
        for item in items:
            self.add(item)


class CountingCollection(Collection):
    def __init__(self):
        super().__init__()
        self.count = 0

    def add(self, item):
        self.count += 1
        super().add(item)

    def add_all(self, items):
        self.count += len(items)
        super().add_all(items)
```

Ota klassdagi `add_all` qayta aniqlangan `add` ni chaqiradi, shuning uchun har bir element **ikki marta** sanaladi. Bundan ham yomoni: ota klass muallifi keyinchalik `add_all` ni to‘g‘ridan-to‘g‘ri qo‘shishga o‘zgartirsa, xato yo‘qoladi — yoki boshqa xato paydo bo‘ladi. Quyi klass o‘zi ko‘rmaydigan amalga oshirish detaliga bog‘langan.

## Chuqur ierarxiyalar va kombinatsiyalar portlashi

Ikkinchi odatiy muammo — bir nechta mustaqil o‘lchamni tasvirlashga urinadigan ierarxiya:

- `Notification` → `EmailNotification`, `SmsNotification`
- keyin `UrgentEmailNotification`, `UrgentSmsNotification`
- keyin `ScheduledUrgentEmailNotification`...

Har bir yangi o‘lcham (kanal, ustuvorlik, jadval) klasslar sonini ko‘paytiradi. Xatti-harakat besh darajaga yoyilgan, bitta metodni tushunish uchun butun `super()` chaqiruvlar zanjirini o‘qishga to‘g‘ri keladi.

## Kompozitsiyaga refaktoring

Har bir o‘lchamni alohida komponentga ajrating va ularni birga yig‘ing:

```typescript
interface Channel {
  send(to: string, text: string): Promise<void>;
}

interface Formatter {
  format(text: string): string;
}

class EmailChannel implements Channel {
  async send(to: string, text: string) { /* SMTP orqali yuborish */ }
}

class UrgentFormatter implements Formatter {
  format(text: string) { return `[URGENT] ${text}`; }
}

class Notifier {
  constructor(private channel: Channel, private formatter: Formatter) {}

  notify(to: string, text: string) {
    return this.channel.send(to, this.formatter.format(text));
  }
}

const notifier = new Notifier(new EmailChannel(), new UrgentFormatter());
```

Nimaga ega bo‘lasiz:

- **N × M o‘rniga N + M klass**: yangi kanal ustuvorlikning yangi variantlarini talab qilmaydi.
- **Runtime’da almashtirish**: kanalni konfiguratsiyadan tanlash mumkin.
- **Oson testlash**: ota klassni mock qilish o‘rniga soxta `Channel` uzatasiz.
- **Aniq kontraktlar**: `Notifier` faqat ikkita kichik interfeysga bog‘liq.

Oldingi bo‘limdagi sanovchi kolleksiya ham shunday tuzatiladi: undan meros olmang, balki kolleksiyani o‘rab, chaqiruvlarni unga topshiring. Shunda sizning `add_all` ichki kolleksiya o‘z metodlarini qanday amalga oshirganiga bog‘liq bo‘lmaydi.

## Bosqichma-bosqich refaktoring rejasi

1. Ierarxiyadagi **o‘zgaruvchan o‘lchamlarni toping** (kanal, saqlash, format, siyosat).
2. Har bir o‘lcham uchun minimal metodli **interfeys ajrating**.
3. Quyi klasslardagi **xatti-harakatni** shu interfeyslarning kichik implementatsiyalariga ko‘chiring.
4. **Qismlarni** bitta klass konstruktori orqali uzating.
5. Faqat qismlarni birlashtirgan **bo‘sh quyi klasslarni o‘chiring**.
6. Xatti-harakat o‘zgarmasligi uchun oldin va keyin **testlar bilan qoplang**.

## Meros qachon hali ham o‘rinli

| Vaziyat | Meros mos keladimi? |
|---|---|
| O‘zgarmaydigan haqiqiy «bu — shu» munosabati | Ha |
| Framework bazaviy klassni kengaytirishni talab qiladi (UI komponentlar, istisnolar, test-keyslar) | Ha |
| Shablon metod: ota klass algoritmni belgilaydi, merosxo‘r bir-ikki qadamni to‘ldiradi | Ko‘pincha ha |
| Bir nechta yordamchi metoddan qayta foydalanish | Yo‘q — kompozitsiya yoki funksiyalar |
| Bir nechta mustaqil variatsiya | Yo‘q — kompozitsiya |
| Ota klass uchinchi tomon kutubxonasidan va kengaytirishga mo‘ljallanmagan | Yo‘q — uni o‘rab oling |

Amaliy qoidalar:

- **Ierarxiyalarni sayoz saqlang** — odatda bir-ikki daraja yetarli.
- **Klassni meros uchun loyihalang yoki uni taqiqlang**: kengaytirish uchun hujjatlashtirilmagan klasslarni `final` deb belgilang (Java; Kotlin’da klasslar sukut bo‘yicha yopiq; C#’da `sealed`).
- **Ota klass o‘z ichida chaqiradigan metodlarni qayta aniqlamang**, agar bunga aniq ruxsat berilmagan bo‘lsa.
- **Liskov tekshiruvi**: quyi klass ota klass ishlaydigan har qanday joyda ishlashi kerak. Agar u meros qilingan metodda «qo‘llab-quvvatlanmaydi» xatosini tashlasa — ierarxiya noto‘g‘ri qurilgan.

## Keng tarqalgan xatolar

- Turni ifodalash uchun emas, faqat **kodni qayta ishlatish** uchun meros olish.
- Bir-biriga aloqasiz helper’lar to‘planadigan `BaseService`, `BaseController`, `BaseManager` klasslari.
- Teskari chekka: oddiy quyi klass tushunarliroq bo‘ladigan joyda delegatsiya qatlamlari.
- Merosxo‘rlar to‘g‘ridan-to‘g‘ri o‘zgartiradigan `protected` maydonlardagi ichki holat.

## FAQ

### Meros — antipatternmi?

Yo‘q. Bu kuchli bog‘liqlik vositasi bo‘lib, ko‘pincha noo‘rin qo‘llaniladi. Barqaror «bu — shu» munosabati, framework kengaytirish nuqtasi yoki shablon metod uchun meros sodda va o‘qilishi oson.

### Kompozitsiya ko‘proq kod degani-mi?

Boshida ba’zan biroz ko‘proq: interfeyslar va konstruktor orqali yig‘ish. Buning evaziga yangi variatsiyalar arzon qo‘shiladi, testlar esa ota klassning ichki tuzilishiga bog‘liq bo‘lmaydi.

### Mixin va trait’lar bunga qanday aloqador?

Ular chuqur zanjirsiz xatti-harakatdan qayta foydalanadi, lekin baribir klassga kod aralashtiradi va to‘qnashishi mumkin. Ularni kichik mustaqil imkoniyatlar uchun ishlating, xatti-harakatning o‘z holati bo‘lsa — oddiy kompozitsiyani tanlang.
