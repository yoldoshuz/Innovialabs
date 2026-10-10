---
title: Kubernetes’da requests va limits: resurslarni to‘g‘ri belgilash
description: Kubernetes’da requests va limits farqi, QoS sinflari, OOMKilled va CPU throttling sabablari hamda resurslarni real ma’lumotlar asosida tanlash usuli.
summary: Requests scheduler’ga pod qaysi node’ga sig‘ishini aytadi, limits esa yadroga qancha ishlatish mumkinligini. Requests’ni real foydalanishga qarab qo‘ying, memory limit’ga zaxira bering, CPU limit’ni esa ehtiyotkorlik bilan belgilang — u throttling’ga olib keladi.
---

## Qisqasi: requests rejalashtirish uchun, limits cheklash uchun

**Requests** — pod node’da «band qilib qo‘yadigan» resurs miqdori. Scheduler podni faqat mavjud podlar requests yig‘indisi va yangi pod sig‘adigan node’ga joylashtiradi. Bu bosqichda haqiqiy iste’mol hisobga olinmaydi.

**Limits** — Linux yadrosi cgroups orqali nazorat qiladigan yuqori chegara. Chegaraga yetganda nima bo‘lishi resursga bog‘liq:

- **CPU** — siqiladigan resurs. Konteyner CPU limit’ga yetsa, u sekinlashtiriladi (**throttling**). Jarayon ishlayveradi, lekin sekinroq javob beradi.
- **Xotira** — siqilmaydigan resurs. Memory limit oshsa, yadro jarayonni o‘ldiradi, pod **OOMKilled** holatini oladi va qayta ishga tushadi.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    memory: "512Mi"
```

## QoS sinflari va ularning ahamiyati

Kubernetes har bir podga xizmat sifati sinfini beradi. Node’da xotira tugaganda kim birinchi chiqarib yuborilishi shunga bog‘liq.

| Sinf | Shart | Xotira yetishmaganda ustuvorlik |
|---|---|---|
| **Guaranteed** | Barcha konteynerlarda CPU va xotira bo‘yicha requests = limits | Eng oxirida chiqariladi |
| **Burstable** | Kamida bitta request yoki limit bor, lekin Guaranteed emas | O‘rtacha |
| **BestEffort** | Requests ham, limits ham yo‘q | Birinchi chiqariladi |

Ma’lumotlar bazalari va muhim servislar uchun **Guaranteed** mantiqli. Ko‘pchilik stateless ilovalar uchun **Burstable** yetarli. Production’da **BestEffort** deyarli har doim xato.

## OOMKilled va CPU throttling: qanday aniqlash

**OOMKilled** darhol ko‘rinadi:

```bash
kubectl describe pod <pod> | grep -A3 "Last State"
```

Odatda uchta sabab bo‘ladi: limit real cho‘qqidan past, xotira sizib chiqishi (memory leak) yoki konteyner limitini bilmaydigan runtime (masalan, eski JVM sozlamalari yoki cheklanmagan Node.js heap).

**CPU throttling** ayyorroq: hech narsa qulamaydi, faqat kechikish ortadi. Belgisi — o‘rtacha CPU yuklamasi me’yorida ko‘rinsa ham `container_cpu_cfs_throttled_periods_total` metrikasi o‘sib boradi. Bu yuklama to‘lqinsimon bo‘lganda yuz beradi: qisqa davr uchun kvota tugaydi va oqimlar keyingi oynani kutadi.

## Real ma’lumotlar asosida tanlash usuli

1. **Oqilona taxmindan boshlang.** Servisni o‘rtacha requests va zaxirali memory limit bilan ishga tushiring.
2. **Odatiy yuklama sikli bo‘yicha metrikalar yig‘ing** — kamida bir necha kun, cho‘qqi soatlari bilan. Prometheus va cAdvisor/kubelet metrikalari yoki ularning analogi kerak.
3. **CPU request**’ni cho‘qqiga emas, real iste’molning yuqori persentili (p90–p95) atrofiga qo‘ying.
4. **Memory request** — odatiy ishchi hajm bo‘yicha, **memory limit** — kuzatilgan maksimumdan yuqori va zaxira bilan.
5. **CPU limit**’ni alohida hal qiling. Ko‘p jamoalar kechikishga sezgir servislarda throttling’dan qochish uchun uni qo‘ymaydi va adolatli taqsimot uchun requests’ga tayanadi. Agar limit kerak bo‘lsa (multi-tenant klaster, «shovqinli qo‘shnilar»dan himoya), uni request’dan sezilarli yuqori qo‘ying.
6. **Yuklama bilan tekshiring.** Yuklama testini o‘tkazib, throttling, OOM va kechikishni kuzating.
7. **Muntazam qayta ko‘rib chiqing.** Katta relizlardan keyin iste’mol profili o‘zgaradi.

Tavsiya rejimidagi **Vertical Pod Autoscaler** (`updateMode: "Off"`) yordam beradi: u podlarni o‘zgartirmaydi, faqat qiymatlarni taklif qiladi.

## Ko‘p uchraydigan xatolar

- **Requests juda yuqori.** Node’lar qog‘ozda «band», amalda bo‘sh turadi — siz bo‘sh sig‘im uchun to‘laysiz.
- **Requests juda past.** Scheduler bitta node’ga haddan ortiq pod joylaydi, ular resurs uchun raqobatlashadi, chiqarib yuborish xavfi ortadi.
- **Memory limit request’ga «tiqma-tiq» teng.** Har qanday sakrash — OOMKilled.
- **Barcha servislar uchun bir xil resurslar.** Ko‘chirilgan shablon API’ga ham, navbat worker’iga ham kamdan-kam mos keladi.
- **To‘g‘ri requests’siz CPU bo‘yicha HPA.** Horizontal Pod Autoscaler foydalanishni request’ga nisbatan hisoblaydi, shuning uchun noto‘g‘ri request avtoskeylingni buzadi.

## FAQ

### CPU limit’ni har doim belgilash kerakmi?

Har doim emas. CPU limit node’dagi qo‘shnilarni himoya qiladi, lekin throttling keltirib chiqaradi. Kechikish muhim bo‘lgan servislarda ko‘pincha faqat CPU request qo‘yiladi. Qat’iy kvotali umumiy klasterlarda limit majburiy bo‘lishi mumkin — unda katta zaxira qoldiring.

### Xotira grafigi limitdan past bo‘lsa ham pod nega OOMKilled bo‘ldi?

Grafiklar ko‘pincha ma’lumotlarni o‘rtachalaydi va qisqa cho‘qqilar ko‘rinmaydi. Bundan tashqari, konteyner xotirasi hisobiga page cache’ning bir qismi ham kiradi. `container_memory_working_set_bytes` metrikasini kichik qadam bilan va runtime xotira sozlamalarini tekshiring.

### Namespace uchun standart qiymatlarni qanday belgilash mumkin?

**LimitRange** qiymatlari ko‘rsatilmagan konteynerlarga requests va limits qo‘yadi, **ResourceQuota** esa namespace’ning umumiy iste’molini cheklaydi.
