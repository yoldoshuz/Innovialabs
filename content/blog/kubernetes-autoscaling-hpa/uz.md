---
title: Kubernetes’da avtomasshtablash: HPA, VPA va Cluster Autoscaler
description: HPA, VPA va Cluster Autoscaler qanday ishlaydi, HPA’ni CPU va maxsus metrikalar bo‘yicha qanday sozlash va avtoskeylerlar o‘rtasidagi ziddiyatlardan qochish.
summary: HPA pod’lar sonini, VPA har bir pod’ning CPU va xotira so‘rovlarini o‘zgartiradi, Cluster Autoscaler esa node qo‘shadi yoki olib tashlaydi; HPA’ni Cluster Autoscaler bilan birga ishlating va HPA bilan VPA’ni bitta resurs metrikasida ishlatmang.
---

## Uchta avtoskeyler — uchta turli vazifa

Kubernetes uch darajada masshtablanadi va har bir vosita o‘z savoliga javob beradi:

| Vosita | Nimani o‘zgartiradi | Nimaga reaksiya qiladi | Odatiy qo‘llanish |
|---|---|---|---|
| **HPA** (Horizontal Pod Autoscaler) | Pod replikalari soni | CPU, xotira, maxsus yoki tashqi metrikalar | Stateless veb-servislar va worker’lar |
| **VPA** (Vertical Pod Autoscaler) | Pod’larning CPU va xotira requests’i | Vaqt davomidagi real resurs iste’moli | Requests’ni to‘g‘ri tanlash, kenglikka yomon masshtablanadigan servislar |
| **Cluster Autoscaler** | Node’lar soni | Pending holatidagi pod’lar, kam yuklangan node’lar | Yangi pod’larga joy, tejash |

HPA Kubernetes’ga o‘rnatilgan. VPA va Cluster Autoscaler — alohida o‘rnatiladigan komponentlar (bulut provayderlari node avtoskeylerini ko‘pincha opsiya sifatida taklif qiladi; node ajratish uchun mashhur muqobil — Karpenter).

## HPA qanday ishlaydi

HPA muntazam interval bilan metrikani o‘qiydi, uni maqsadli qiymat bilan solishtiradi va kerakli replikalar sonini taxminan shunday hisoblaydi:

`desiredReplicas = ceil(currentReplicas × currentValue / targetValue)`

Agar 4 ta pod o‘rtacha 90% CPU’da ishlasa va maqsad 60% bo‘lsa, HPA 6 tasini xohlaydi. Kichik tolerantlik uning mayda og‘ishlarga reaksiya qilishiga yo‘l qo‘ymaydi.

Ikki shartni e’tibordan chetda qoldirish oson:

- CPU va xotira metrikalari uchun **metrics-server** o‘rnatilgan bo‘lishi kerak.
- Konteynerlarda **CPU requests** belgilangan bo‘lishi kerak. Utilizatsiya request’ga nisbatan foizda hisoblanadi; usiz HPA hech narsani hisoblay olmaydi.

## HPA’ni CPU va maxsus metrika bo‘yicha sozlash

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Pods
          value: 4
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
```

Bir nechta metrika bo‘lsa, HPA har biri uchun replikalar sonini hisoblab, **eng kattasini** tanlaydi. Bu yerdagi qiymatlar shartli — ularni yuklama testlari natijasiga ko‘ra tanlang.

Soniyasiga so‘rovlar yoki navbat uzunligi kabi **maxsus metrikalar** standart holatda mavjud emas. Ularni Kubernetes metrics API’ga uzatadigan adapter kerak, masalan Prometheus Adapter yoki navbat uzunligi, cron jadvali va ko‘plab tashqi manbalar bo‘yicha masshtablay oladigan **KEDA**. Navbat worker’lari uchun navbat chuqurligi odatda CPU’dan yaxshiroq signal.

## VPA qanday ishlaydi

VPA uch qismdan iborat: iste’molni kuzatadigan **recommender**, requests’i juda noto‘g‘ri pod’larni chiqarib yuborishi mumkin bo‘lgan **updater** va pod yaratilganda yangi requests’ni qo‘yadigan **admission controller**. Yangilash rejimlari `Off`’dan (faqat tavsiyalar) ularni avtomatik qo‘llaydigan rejimlargacha bo‘ladi.

Xavfsiz boshlanish — `Off` rejimi: tavsiyalarni o‘qing va requests’ni qo‘lda tuzating. Avtomatik rejimlar pod’larni qayta ishga tushirishi mumkin, shuning uchun servislarni PodDisruptionBudget bilan himoyalang.

## Cluster Autoscaler qanday ishlaydi

Cluster Autoscaler CPU yuklamasiga qaramaydi. U **rejalashtirishga** reaksiya qiladi:

- Agar hech bir node’da so‘ralgan bo‘sh resurs yetmagani uchun pod’lar Pending’da tursa, u guruhdan yangi node qo‘shadi.
- Agar node uzoq vaqt kam yuklangan bo‘lsa va uning pod’larini boshqa joyga ko‘chirish mumkin bo‘lsa, uni bo‘shatib, o‘chiradi.

Shuning uchun aniq requests juda muhim: aynan ularni rejalashtiruvchi ham, avtoskeyler ham hisoblaydi. Requests’siz, lokal xotirali yoki qat’iy PodDisruptionBudget’li pod’lar klasterni kichraytirishga xalaqit berishi mumkin.

## Tebranish va ziddiyatlardan qanday qochish

- **Bitta yuklama uchun HPA va VPA’ni bir xil CPU yoki xotira metrikasida ishlatmang.** VPA requests’ni oshiradi, utilizatsiya tushadi, HPA pod’larni olib tashlaydi, har bir pod’ga yuklama oshadi — va sikl takrorlanadi. Ikkalasi ham kerak bo‘lsa, HPA maxsus metrika bo‘yicha, VPA esa resurslar bo‘yicha ishlasin yoki VPA’ni `Off` rejimida saqlang.
- **Stabilizatsiya oynalaridan foydalaning**, ayniqsa kichraytirish uchun, shunda qisqa pasayishlar bir daqiqadan keyin kerak bo‘ladigan pod’larni olib tashlamaydi.
- **O‘zgarish tezligini** `behavior` siyosatlari bilan cheklang.
- **Ishga tushish vaqtini hisobga oling.** Pod’lar uzoq vaqt tayyor bo‘lmasa, yangi replikalar kech keladi va HPA yana qo‘shishda davom etadi. Readiness va startup probe’lardan foydalaning, image’larni yengil saqlang.
- **Oqilona minReplicas belgilang**, shunda yangi pod’lar va node’lar ko‘tarilguncha keskin o‘sish uchun zaxira bo‘ladi.
- **Butun zanjirni tekshiring**: HPA 20 ta pod so‘rashi mumkin, lekin klaster node qo‘sha olmasa yoki baza ko‘proq ulanishni qabul qilmasa, masshtablash faqat tor joyni boshqa joyga ko‘chiradi.

## FAQ

### Uchala avtoskeyler ham kerakmi?

Yo‘q. Ko‘p klasterlar HPA va Cluster Autoscaler bilan ishlaydi, VPA’dan esa faqat requests’ni sozlash uchun tavsiya rejimida foydalanadi. Vositalarni aniq muammo talab qilgandagina qo‘shing.

### Nega HPA metrikalar o‘rniga unknown ko‘rsatadi?

Odatda metrics-server o‘rnatilmagan yoki ishlamayapti, konteynerda CPU request yo‘q yoki maxsus metrika nomi adapter uzatayotgan nom bilan mos emas. `kubectl describe hpa` orqali hodisalarni ko‘ring.

### HPA nolgacha masshtablay oladimi?

O‘rnatilgan HPA standart sozlamada kamida bitta replikani saqlaydi. KEDA kabi hodisaga asoslangan vositalar nolgacha va qaytadan masshtablay oladi — bu bo‘sh davrlari bor navbat worker’lari uchun qulay. Batafsil: [Kubernetes hujjatlari](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/).
