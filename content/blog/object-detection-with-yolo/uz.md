---
title: YOLO bilan obyektlarni aniqlash: datasetdan ishga tushirishgacha
description: Rasmlarni yig‘ish va belgilash, YOLO’ni o‘qitish, sifatni mAP bilan baholash va modelni kamera yoki edge qurilmada real vazifa uchun ishga tushirish.
summary: YOLO loyihasi asosan ma’lumotlar bilan ishlashdir: real sharoitdan kadrlar yig‘ing, ehtiyotkorlik bilan belgilang, tayyor modelni qayta o‘qiting, mAP’ni alohida to‘plamda tekshiring va kerakli qurilmaga eksport qiling.
---
## Qisqa javob

**YOLO** (You Only Look Once) — rasmdagi obyektlarni bir o‘tishda topib, ularni sinf va ishonch darajasi bilan ramkaga oladigan modellar oilasi. Biznes vazifasi uchun — ishchidagi kaska, mashina raqami, javondagi tovar — odatda modelni noldan o‘qitishmaydi. Tayyor modelni o‘z ma’lumotlaringizda **qayta o‘qitasiz** (fine-tuning). Yo‘l shunday: ma’lumotlar → belgilash → o‘qitish → baholash → ishga tushirish.

## 1-qadam. Rasmlarni yig‘ish

Model sifati ma’lumotlar real ishlash sharoitiga qanchalik o‘xshashligiga bog‘liq.

- Model ishlaydigan **kamera va burchakdan** suratga oling.
- Turli yoritishni qo‘shing: kunduz, tun, yaltirash, yomg‘ir.
- Murakkab kadrlarni kiriting: qisman yopilgan obyektlar, olomon, uzoqdagi kichik obyektlar.
- **Obyektsiz** kadrlar qo‘shing — shunda model kamroq yolg‘on signal beradi.
- Videodan ketma-ket deyarli bir xil kadrlarni olmang: har N-kadrni oling.

## 2-qadam. Belgilash

Har bir obyektga ramka chiziladi va sinf beriladi. CVAT yoki Label Studio kabi vositalar belgilarni YOLO formatida eksport qiladi.

Haftalarni tejaydigan qoidalar:

- Belgilovchilar uchun **yo‘riqnoma** yozing: nimani obyekt deb hisoblash, qisman ko‘ringanlarni qanday belgilash.
- Ramka obyektni ortiqcha fonsiz zich o‘rashi kerak.
- Tanlab qayta tekshiring — belgilash xatolari sifatni to‘g‘ridan-to‘g‘ri pasaytiradi.
- Ma’lumotlarni oldindan **train / val / test** ga ajrating, bitta sahna kadrlarini bitta qismda saqlang.

YOLO formatidagi dataset tavsifi:

```yaml
path: datasets/helmets
train: images/train
val: images/val
names:
  0: helmet
  1: no_helmet
```

## 3-qadam. O‘qitish

Ultralytics kutubxonasi bilan oddiy fine-tuning bir necha qatordan iborat:

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")          # oldindan o‘qitilgan kichik model
model.train(data="data.yaml", epochs=100, imgsz=640)
metrics = model.val()                # val’da baholash
model.export(format="onnx")          # ishga tushirish uchun eksport
```

Model hajmini tanlash — murosa: **kichiklari** (n, s) tez va edge qurilmalarga mos, **kattalari** (l, x) aniqroq, lekin kuchli GPU talab qiladi.

## 4-qadam. Baholash: mAP nima

- **Precision** — topilgan obyektlarning qancha qismi haqiqatan to‘g‘ri.
- **Recall** — real obyektlarning qancha qismini model topdi.
- **mAP@0.5** — ramkalar 50% va undan ko‘p mos kelgandagi o‘rtacha aniqlik.
- **mAP@0.5:0.95** — bir nechta moslik chegaralari bo‘yicha o‘rtachalangan qat’iyroq metrika.

Faqat umumiy mAP’ga emas, **har bir sinf bo‘yicha metrikalarga** ham qarang va xatolarni ko‘z bilan ko‘rib chiqing. Xavfsizlik vazifalarida ko‘pincha recall muhimroq (qoidabuzarlikni o‘tkazib yubormaslik), avtomatik jarimalarda — precision (bekorga jazolamaslik).

## 5-qadam. Ishga tushirish

| Variant | Qachon mos |
|---|---|
| GPU’li server | Ko‘p kamera, aniqlik muhim, barqaror tarmoq bor |
| Edge qurilma (Jetson va o‘xshashlar) | Joyida ishlov berish, kam trafik, maxfiylik |
| CPU / mini-PK | Kam oqim, kichik model, past FPS maqbul |

Tezlashtirish uchun model qurilmaga qarab **ONNX**, **TensorRT** yoki **OpenVINO** formatiga eksport qilinadi. Keyin model atrofida kod kerak: RTSP oqimini o‘qish, signallarni bir nechta kadrda tasdiqlash, hodisalarni CRM, Telegram yoki hisob tizimiga yuborish.

## Ko‘p uchraydigan xatolar

- Internetdagi rasmlarda o‘qitib, boshqa burchakdagi kamerada ishga tushirish.
- Modelni o‘quv kadrlariga juda o‘xshash kadrlarda baholash — metrikalar oshirib ko‘rsatiladi.
- Ishga tushgandan keyin monitoring qilmaslik: yoritish yoki kamera o‘zgardi — sifat tushdi.
- Har bir signalga bir nechta kadrda tasdiqlamasdan reaksiya qilish.

## FAQ

### Fine-tuning uchun nechta rasm kerak?

Bu obyektlar murakkabligi va sahna xilma-xilligiga bog‘liq. Kichik, lekin xilma-xil to‘plamdan boshlang, birinchi versiyani o‘qiting, xatolarini ko‘ring va aynan shu holatlar uchun ma’lumot to‘plang.

### YOLO’ni videokartasiz ishga tushirish mumkinmi?

Ha, kichik modellar CPU’da ishlaydi, ayniqsa OpenVINO yoki ONNX’ga eksport qilingandan keyin. Lekin FPS pastroq bo‘ladi, shuning uchun ko‘p kamera uchun odatda GPU yoki edge tezlatgich kerak.

### Modelni qanchalik tez-tez qayta o‘qitish kerak?

Sharoit o‘zgarganda: yangi kameralar, yoritish, forma yoki obyektlar. Ishlash jarayonidagi xato kadrlarni saqlang — ular keyingi versiya uchun eng yaxshi material.
