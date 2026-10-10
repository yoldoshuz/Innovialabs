---
title: OOP nima: kod misollari bilan to‘rtta tamoyil
description: Inkapsulyatsiya, vorislik, polimorfizm va abstraksiya Python va Java’dagi bitta umumiy misolda, shuningdek OOP ortiqcha qo‘llaniladigan holatlar.
summary: OOP — dasturni ma’lumot va xatti-harakatni birlashtiruvchi obyektlardan qurish usuli; uning to‘rtta tamoyili (inkapsulyatsiya, vorislik, polimorfizm, abstraksiya) tafsilotlarni yashirish va bir realizatsiyani boshqasiga almashtirishga yordam beradi.
---
## Qisqacha javob

**Obyektga yo‘naltirilgan dasturlash (OOP)** — dastur **obyektlardan** tashkil topadigan yondashuv: har bir obyekt o‘z ma’lumotlarini (maydonlarini) saqlaydi va ular bilan ishlay oladi (metodlar). Obyekt shabloni **klass** deb ataladi.

OOP’ning mohiyati klasslarning o‘zida emas, balki **tizimni aniq chegarali qismlarga ajratishda**: tashqaridan obyekt nima qila olishi ko‘rinadi, buni qanday qilishi esa uning ichki ishi.

Quyida to‘rtala tamoyil bitta misolda ko‘rsatilgan: servis email va SMS orqali bildirishnomalar yuboradi.

## Python’dagi umumiy misol

```python
from abc import ABC, abstractmethod

class Notifier(ABC):
    def __init__(self, recipient: str):
        self._recipient = recipient
        self._sent = 0

    @property
    def sent(self) -> int:
        return self._sent

    def notify(self, text: str) -> None:
        self._deliver(text)
        self._sent += 1

    @abstractmethod
    def _deliver(self, text: str) -> None: ...

class EmailNotifier(Notifier):
    def _deliver(self, text: str) -> None:
        print(f"Email to {self._recipient}: {text}")

class SmsNotifier(Notifier):
    def _deliver(self, text: str) -> None:
        print(f"SMS to {self._recipient}: {text}")

for n in [EmailNotifier("user@example.com"), SmsNotifier("+998000000000")]:
    n.notify("Your order has shipped")
```

## Xuddi shu misol Java’da

```java
abstract class Notifier {
    private final String recipient;
    private int sent = 0;

    Notifier(String recipient) { this.recipient = recipient; }

    public int getSent() { return sent; }
    protected String recipient() { return recipient; }

    public void notify(String text) {
        deliver(text);
        sent++;
    }

    protected abstract void deliver(String text);
}

class EmailNotifier extends Notifier {
    EmailNotifier(String r) { super(r); }
    protected void deliver(String text) {
        System.out.println("Email to " + recipient() + ": " + text);
    }
}

class SmsNotifier extends Notifier {
    SmsNotifier(String r) { super(r); }
    protected void deliver(String text) {
        System.out.println("SMS to " + recipient() + ": " + text);
    }
}
```

Eslatma: Java’da `Object` klassida allaqachon `notify()` metodi bor, shuning uchun real kodda metodni boshqacha, masalan `send` deb nomlash ma’qul. Bu yerda solishtirish qulay bo‘lishi uchun nom bir xil qoldirilgan.

## Shu misoldagi to‘rtta tamoyil

### Inkapsulyatsiya

`sent` hisoblagichini tashqaridan o‘zgartirib bo‘lmaydi: Java’da u `private`, Python’da esa `@property` orqali faqat o‘qish mumkin bo‘lgan `_sent`. U faqat `notify` ichida oshadi. **Inkapsulyatsiya ma’lumotlarni noto‘g‘ri o‘zgarishlardan himoya qiladi** va holat o‘zgaradigan yagona joyni beradi.

Python’da maxfiylik — taqiq emas, kelishuv (pastki chiziq). Java’da esa kompilyator `private` maydonga murojaat qilishga haqiqatan yo‘l qo‘ymaydi.

### Vorislik

`EmailNotifier` va `SmsNotifier` umumiy mantiqni `Notifier`’dan **meros qilib oladi**: qabul qiluvchini saqlash, yuborishlarni sanash, `notify` metodi. Ularga faqat o‘z qismini — `deliver`’ni yozish qoladi.

### Polimorfizm

Sikl har bir obyektning aniq klassini bilmasdan `notify`’ni chaqiradi. **Bitta interfeys — turli xatti-harakat.** Telegram bildirishnomalarini sikl va boshqa kodga tegmasdan yangi klass bilan qo‘shish mumkin.

### Abstraksiya

`Notifier` — abstrakt klass: u bildirishnoma yuboruvchi **nima** qilishini tasvirlaydi va **qanday** qilishini yashiradi. «Shunchaki Notifier» yaratib bo‘lmaydi, faqat aniq realizatsiyani. Bildirishnoma yuboradigan kod SMS shlyuzi tafsilotlariga emas, abstraksiyaga bog‘liq.

## OOP qayerda ortiqcha ishlatiladi

- **Chuqur vorislik ierarxiyalari.** Besh darajali klasslarni tushunish va o‘zgartirish qiyin. Ko‘pincha **kompozitsiya** yaxshiroq: obyekt boshqa obyektdan meros olmaydi, uni o‘z ichida saqlaydi.
- **Klass uchun klass.** Agar klassda bitta metod bo‘lsa va holati bo‘lmasa, oddiy funksiya soddaroq.
- **Anemik modellar.** Xatti-harakatsiz, faqat getter va setter’lardan iborat klasslar OOP foydasisiz uning ortiqcha yukini beradi.
- **Ma’lumotlarga ishlov berish.** Ro‘yxatlarni o‘zgartirish, hisobotlar va pipeline’lar ko‘pincha funksional uslubda yaxshiroq o‘qiladi.
- **«Kelajak uchun» abstraksiyalar.** Bitta realizatsiyali va ikkinchisini rejalashtirmagan interfeys kodni hozirdanoq murakkablashtiradi.

Yaxshi qoida: abstraksiyani **ikkinchi real realizatsiya** paydo bo‘lganda yoki testlarda almashtirish kerak bo‘lganda kiriting.

## FAQ

### Python obyektga yo‘naltirilgan tilmi?

Ha, Python’da hamma narsa obyekt va klasslar to‘liq qo‘llab-quvvatlanadi. Lekin til OOP uslubida yozishga majburlamaydi: funksiyalar va modullar ham teng huquqli vositalar.

### Abstraksiya inkapsulyatsiyadan nimasi bilan farq qiladi?

Abstraksiya obyekt foydalanuvchilari qaysi interfeysni ko‘rishini belgilaydi. Inkapsulyatsiya esa shu interfeysni amalga oshiruvchi ichki holatni yashiradi va himoya qiladi.

### Vorislikmi yoki kompozitsiyami?

Standart holatda kompozitsiya. Vorislik voris klass haqiqatan ota klassning xususiy holi bo‘lsa va uni u ishlatiladigan har qanday joyda almashtira olsa, o‘zini oqlaydi.
