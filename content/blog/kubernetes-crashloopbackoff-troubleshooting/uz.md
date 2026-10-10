---
title: Kubernetes’da nosozliklarni aniqlash: CrashLoopBackOff, Pending, OOMKilled
description: Kubernetes’da ishlamay qolgan podlarni describe, logs, events va probes yordamida tekshirish tartibi hamda CrashLoopBackOff, Pending, OOMKilled sabablari.
summary: Pod holati qayerdan qidirishni ko‘rsatadi: Pending — rejalashtirish muammosi, CrashLoopBackOff — konteyner ishga tushib qulaydi, OOMKilled — xotira yetmadi. Ko‘p holatlar to‘rtta buyruq bilan aniqlanadi: get, describe, logs --previous va get events.
---

## Avval holat, keyin sabab

Pod holati tashxis emas, balki qidiruv yo‘nalishi:

| Holat | Nima bo‘lyapti | Qayerga qarash kerak |
|---|---|---|
| **Pending** | Podni node’ga joylashtirib bo‘lmayapti | `describe`, events |
| **CrashLoopBackOff** | Konteyner ishga tushadi va qulaydi, Kubernetes qayta ishga tushirishlar orasidagi pauzani oshiradi | `logs --previous`, exit code |
| **OOMKilled** | Memory limit oshgani uchun yadro jarayonni o‘ldirgan | `describe`, xotira metrikalari |
| **ImagePullBackOff** | Image yuklab olinmayapti | `describe`, events |

## Asosiy buyruqlar to‘plami

Deyarli har qanday tekshiruv bir xil qadamlardan boshlanadi:

```bash
kubectl get pods -n <ns> -o wide
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -n <ns> --previous
kubectl get events -n <ns> --sort-by=.lastTimestamp
```

- **describe** konteynerlar holati, `Last State`, **exit code**, sabab va pod hodisalarini ko‘rsatadi.
- **logs --previous** oldingi, qulagan konteyner nusxasining loglarini chiqaradi. Bu flag’siz ko‘pincha endigina qayta ishga tushgan jarayonning bo‘sh logini ko‘rasiz.
- **events** — xronologiya: rejalashtirish, image yuklash, probe tekshiruvlari, chiqarib yuborishlar.

## CrashLoopBackOff: konteyner ishga tushib qulaydi

Avval `describe`’dagi **exit code**’ga qarang:

- **1** yoki ilovaning boshqa kodi — xato ilovaning o‘zida. `logs --previous`’dan stack trace qidiring.
- **137** — jarayon SIGKILL oldi. Ko‘pincha bu OOMKilled yoki liveness probe muvaffaqiyatsiz bo‘lgani uchun o‘ldirish.
- **0** — jarayon «muvaffaqiyatli» tugagan, lekin Kubernetes uzoq ishlaydigan servis kutadi. Masalan, ishga tushirish buyrug‘i bajarilib chiqib ketgan.

Odatiy sabablar:

1. **Konfiguratsiya yo‘q.** Muhit o‘zgaruvchisi, Secret yoki ConfigMap mavjud emas, ilova ishga tushishda qulaydi.
2. **Bog‘liq servis mavjud emas.** Ma’lumotlar bazasi yoki boshqa servis javob bermaydi, ilova esa kutishni bilmaydi.
3. **Noto‘g‘ri buyruq yoki entrypoint.** `command`/`args`’da xato yoki noto‘g‘ri ishchi katalog.
4. **Juda qattiq liveness probe.** Ilova `initialDelaySeconds`’dan uzoqroq ishga tushadi va tayyor bo‘lmasdan o‘ldiriladi. Yechim — sekin start uchun **startupProbe**.
5. **Kirish huquqlari.** Konteyner noto‘g‘ri foydalanuvchi nomidan ishlaydi va kerakli katalogga yoza olmaydi.

Agar umuman log bo‘lmasa, buyruqni vaqtincha `sleep`’ga almashtiring va muhitni qo‘lda tekshirish uchun `kubectl exec` orqali ichkariga kiring. Buni production’da qoldirmang.

## Pending: pod node topa olmayapti

`describe`’ning Events bo‘limida scheduler xabari bo‘ladi. Ko‘p uchraydigan variantlar:

- **Insufficient cpu/memory** — hech bir node’da pod requests uchun joy yo‘q. Requests’ni kamaytiring, node qo‘shing yoki autoscaler’ni tekshiring.
- **didn’t match node selector / affinity** — kerakli label’li node yo‘q.
- **had taint that the pod didn’t tolerate** — node’larda taint bor, podda esa toleration yo‘q.
- **unbound PersistentVolumeClaim** — volume yaratilmagan yoki mos StorageClass yo‘q.

## OOMKilled: xotira uchun o‘ldirilgan

`describe`’da `Reason: OOMKilled` va exit code 137 ko‘rinadi. Keyin:

1. Qulashdan oldingi davr uchun metrikalarda real xotira iste’molini ko‘ring.
2. Agar cho‘qqi barqaror va oldindan aytib bo‘ladigan bo‘lsa, **memory limit**’ni zaxira bilan oshiring.
3. Agar iste’mol doimiy o‘sib borsa, **xotira sizib chiqishini** qidiring — limitni oshirish faqat qulashni kechiktiradi.
4. Runtime konteyner limitini bilishini tekshiring: JVM, Node.js, Go’dagi heap sozlamalari.

Konteyner OOMKilled’ini **chiqarib yuborish (Evicted)**dan farqlang: ikkinchisida butun node’ga xotira yetmagan va kubelet podlarni QoS sinflari bo‘yicha chiqaradi.

## Tekshiruvdagi ko‘p uchraydigan xatolar

- `kubectl logs`’ni `--previous`’siz ishlatib, log yo‘q degan xulosaga kelish.
- Exit code’ni o‘qimasdan CrashLoopBackOff’ni resurslarni oshirish bilan «davolash».
- Bir xil liveness va readiness probes: bog‘liq servisdagi muammo podni trafikdan vaqtincha chiqarish o‘rniga qayta ishga tushirishlarga olib keladi.
- Events’ni e’tiborsiz qoldirish: ular cheklangan vaqt saqlanadi, shuning uchun darhol ko‘ring yoki log tizimiga yig‘ing.

## FAQ

### Liveness, readiness va startup probes nimasi bilan farq qiladi?

**Liveness** konteynerni qayta ishga tushirish kerakligini hal qiladi. **Readiness** — unga trafik yuborish mumkinligini. **Startup** sekin ishga tushadigan ilovani himoya qiladi: u o‘tmaguncha boshqa probes bajarilmaydi.

### Bir zumda qulaydigan podni qanday tekshirish mumkin?

`kubectl logs --previous`’dan foydalaning, yetarli bo‘lmasa — ephemeral konteynerli `kubectl debug` yoki muhitni ichkaridan o‘rganish uchun buyruqni vaqtincha `sleep`’ga almashtiring.

### Node’lar kam yuklangan bo‘lsa ham pod nega Pending?

Scheduler haqiqiy yuklamaga emas, **requests** yig‘indisiga qaraydi. Agar requests oshirib yuborilgan bo‘lsa, node’lar qog‘ozda «to‘la». Requests’ni real iste’mol bilan solishtiring.
