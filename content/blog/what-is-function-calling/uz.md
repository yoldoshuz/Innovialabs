---
title: LLM’da function calling (vositalarni chaqirish) nima
description: Til modeli funksiya chaqiruvini qanday qaytaradi, kodingiz uni qanday bajaradi va bu qayerda foydali: buyurtma holati, qabulga yozilish, CRM.
summary: Function calling — model amalni o‘zi bajarmaydi, funksiya nomi va argumentlari bilan JSON qaytaradi; kodingiz funksiyani chaqiradi va javob uchun natijani modelga qaytaradi.
---
## Qisqa javob

**Function calling** (yoki **tool use**) — til modelini tizimlaringizga ulash usuli. Siz modelga funksiyalar to‘plamini tasvirlab berasiz: nomi, vazifasi va parametrlari. Foydalanuvchi real ma’lumot talab qiladigan narsa so‘raganda, model matn bilan emas, **tuzilgan chaqiruv** bilan javob beradi: «`get_order_status` ni `order_id = 1042` bilan chaqir».

Muhim: model **hech narsani o‘zi bajarmaydi**. U faqat qaysi funksiyani qanday argumentlar bilan chaqirishni hal qiladi. Bajaruvchi — sizning kodingiz, kirish huquqlarini ham u nazorat qiladi.

## Sikl qanday ishlaydi

1. Modelga foydalanuvchi xabarini va parametrlar uchun JSON Schema bilan **vositalar ro‘yxatini** yuborasiz.
2. Model oddiy javob yoki vositani chaqirish so‘rovini qaytaradi.
3. Kodingiz argumentlarni tekshiradi va haqiqiy funksiyani chaqiradi (ma’lumotlar bazasi, API, CRM).
4. Natija modelga «vosita natijasi» xabari sifatida qaytariladi.
5. Model foydalanuvchiga tushunarli javob yozadi yoki keyingi vositani so‘raydi.

Vosita tavsifi odatda shunday ko‘rinadi:

```json
{
  "name": "get_order_status",
  "description": "Buyurtma raqami bo‘yicha uning holatini qaytaradi",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "Buyurtma raqami" }
    },
    "required": ["order_id"]
  }
}
```

Maydon nomlari provayderlarda farq qiladi, lekin g‘oya bir xil: nom, tavsif, parametrlar sxemasi.

## Amaliy misollar

- **Buyurtma holati.** Mijoz «1042-buyurtmam qayerda?» deb yozadi. Model `get_order_status` ni chaqiradi, «kuryerga topshirildi» javobini oladi va oddiy tilda javob beradi.
- **Qabulga yozilish.** Model avval `get_free_slots(date)` ni chaqiradi, variantlarni taklif qiladi, mijoz tanlagach `book_slot(slot_id, phone)` ni chaqiradi.
- **CRM.** Menejer «Romashka MChJ uchun konsultatsiya bitimini yarat» deb yozadi — model `create_deal` argumentlarini erkin matndan to‘ldiradi.
- **Bilimlar bazasidan qidirish.** `search_docs(query)` vositasi ko‘plab RAG-botlarning asosi.

## Amalda nima muhim

- **Yaxshi tavsiflar.** Model vositani `description` bo‘yicha tanlaydi. Qachon chaqirish va qachon chaqirmaslikni aniq yozing.
- **Argumentlarni tekshirish.** Model sana formatida xato qilishi yoki ID o‘ylab topishi mumkin. Hammasini serverda tekshiring.
- **Kirish huquqlari.** Foydalanuvchi raqamini aytgani uchungina boshqa birovning buyurtmasini ko‘rmasligi kerak. Egasini model so‘zlari bo‘yicha emas, sessiya bo‘yicha tekshiring.
- **Xavfli amallarni tasdiqlash.** To‘lov, o‘chirish, xat yuborish — faqat foydalanuvchining aniq «ha» javobidan keyin.
- **Tushunarli xatolar.** Funksiya ishlamasa, modelga qisqa xato matnini qaytaring — u foydalanuvchidan qayta so‘rashi mumkin.
- **Kam vositalar.** O‘nlab o‘xshash funksiyalar modelni chalg‘itadi. Bir nechta aniq vosita yaxshiroq.

## Ko‘p uchraydigan xatolar

| Xato | Nima qilish kerak |
|---|---|
| Model argumentlariga tekshirmasdan ishonish | Sxema va biznes qoidalari bilan tekshirish |
| Keng huquqli vosita berish | Minimal huquqli tor funksiyalar |
| Qadamlar soni cheklanmagan | Siklda iteratsiyalar limitini qo‘yish |
| Modelga katta API javobini berish | Faqat kerakli maydonlarni qaytarish |

## FAQ

### Function calling va AI-agent bir narsami?

Yo‘q. Function calling — mexanizm, agent esa maqsadga erishish uchun qaysi vositalarni chaqirishni siklda o‘zi hal qiladigan tizim. Agentlar function calling ustiga quriladi.

### Model ro‘yxatda yo‘q funksiyani chaqira oladimi?

U kutilmagan nom yoki noto‘g‘ri argumentlarni qaytarishi mumkin, shuning uchun kodingiz faqat ma’lum funksiyalarni bajarishi va qolganini rad etishi kerak.

### Buning uchun o‘z modelim kerakmi?

Yo‘q. Yirik tijoriy va ko‘plab ochiq modellar API orqali vositalarni chaqirishni qo‘llab-quvvatlaydi. Asosiy ish — funksiyalarni yaxshi tasvirlash va ular atrofida ishonchli kod yozish.
