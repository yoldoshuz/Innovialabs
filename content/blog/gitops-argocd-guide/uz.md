---
title: GitOps nima va uni Argo CD bilan qanday joriy qilish mumkin
description: GitOps sodda tilda: Git yagona haqiqat manbai, pull modelida deploy, Argo CD o‘rnatish, muhitlar repozitoriylari tuzilmasi va relizlarni ko‘chirish.
summary: GitOps — infratuzilmaning kerakli holati Git’da tavsiflanadigan yondashuv; klaster ichidagi agent (masalan, Argo CD) o‘zgarishlarni o‘zi tortib oladi va klasterni shu holatga keltiradi.
---

## GitOps qisqacha nima

**GitOps** — ilovalar va infratuzilmani boshqarish usuli bo‘lib, unda **Git yagona haqiqat manbai** hisoblanadi. Barcha Kubernetes manifestlari, Helm chartlar yoki Kustomize overlaylari repozitoriyda saqlanadi. Muhitni o‘zgartirish — bu qo‘lda `kubectl apply` emas, balki commit yoki pull request.

Klassik CI/CD’dan asosiy farqi — **pull modeli**:

- **Push modeli:** CI pipeline klasterga kirish huquqini oladi va o‘zgarishlarni o‘zi chiqaradi.
- **Pull modeli:** klaster ichidagi agent Git’ni kuzatadi va o‘zgarishlarni o‘zi qo‘llaydi. CI faqat image yig‘adi va manifestni yangilaydi.

Pull modelining afzalliklari: klaster ma’lumotlari tashqariga chiqmaydi, har qanday qo‘lda kiritilgan o‘zgarish **drift** (nomuvofiqlik) sifatida ko‘rinadi, orqaga qaytarish esa oddiy `git revert`.

## Argo CD qanday ishlaydi

**Argo CD** — Kubernetes uchun controller bo‘lib, klaster holatini Git’dagi tavsif bilan doimiy solishtiradi.

- **Application** — repozitoriydagi yo‘lni klasterdagi namespace bilan bog‘lovchi resurs.
- **Sync** — klasterni Git’dagi holatga keltirish, qo‘lda yoki avtomatik.
- **Self-heal** — klasterdagi qo‘lda qilingan tahrirlarni avtomatik bekor qilish.
- **Prune** — Git’da endi mavjud bo‘lmagan resurslarni o‘chirish.

## Tezkor o‘rnatish

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

So‘ng ilovani deklarativ tarzda tavsiflang — bu ham Git’da turadi:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: shop-api-staging
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/acme/deploy.git
    targetRevision: main
    path: apps/shop-api/overlays/staging
  destination:
    server: https://kubernetes.default.svc
    namespace: shop-staging
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Batafsil ma’lumot — [Argo CD rasmiy hujjatlarida](https://argo-cd.readthedocs.io/).

## Repozitoriylarni qanday tuzish kerak

**Ilova kodi va deploy manifestlarini alohida saqlang**. Aks holda koddagi har bir commit ortiqcha sinxronizatsiyalarni ishga tushiradi, kirish huquqlari esa aralashib ketadi.

Kustomize bilan deploy repozitoriysining odatiy tuzilmasi:

```text
apps/
  shop-api/
    base/
    overlays/
      dev/
      staging/
      production/
```

| Yondashuv | Qachon mos keladi |
|---|---|
| Bitta branchda har bir muhit uchun papka | Ko‘pchilik jamoalar: hammasi ko‘rinib turadi, muhitlar orasidagi diff tushunarli |
| Har bir muhit uchun branch | Kamdan-kam oqlanadi: merge qilish qiyin, nomuvofiqliklar paydo bo‘ladi |
| Production uchun alohida repozitoriy | Prodga kirishni qat’iy nazorat qilish kerak bo‘lganda |

Ilovalar ko‘p bo‘lsa, har bir Application’ni qo‘lda yaratmaslik uchun **App of Apps** patterni yoki **ApplicationSet**’dan foydalaning.

## Muhitlar orasida ko‘chirish

Ko‘chirish (promotion) — tekshirilgan versiyani bir muhitdan keyingisiga o‘tkazish. GitOps’da bu har doim Git’dagi o‘zgarish:

1. CI o‘zgarmas tegli image yig‘adi (masalan, commit SHA).
2. CI yoki Argo CD Image Updater kabi vosita `dev` overlayidagi tegni yangilaydi.
3. Tekshiruvdan so‘ng aynan shu teg pull request orqali `staging`ga o‘tkaziladi.
4. `production` uchun — majburiy review bilan alohida PR va kerak bo‘lsa qo‘lda sinxronizatsiya.

Asosiy qoida: **productionga aynan staging’dan o‘tgan artefakt tushadi**, qaytadan yig‘ilgani emas.

## Ko‘p uchraydigan xatolar

- **Git’da ochiq holdagi sirlar.** Sealed Secrets, SOPS yoki External Secrets Operator’dan foydalaning.
- **`latest` tegi.** Argo CD o‘zgarishlarni ko‘rmaydi, orqaga qaytarish esa imkonsiz bo‘ladi.
- **Self-heal yoqilganda klasterda qo‘lda tahrir qilish** — ular jimgina bekor qilinadi.
- **Hammasi uchun bitta ulkan Application**: uzoq sinxronizatsiya va qiyin diagnostika.

## FAQ

### Kichik jamoaga GitOps kerakmi?

Agar siz allaqachon Kubernetes ishlatayotgan bo‘lsangiz, ha: Argo CD tez o‘rnatiladi, o‘zgarishlar tarixini shaffof qiladi va orqaga qaytarishni osonlashtiradi. Kubernetes’siz bu ko‘rinishdagi GitOps odatda ortiqcha.

### Argo CD Flux’dan nimasi bilan farq qiladi?

Ikkalasi ham pull modelidagi GitOps’ni amalga oshiradi. Argo CD rivojlangan veb-interfeys va Application modelini beradi, Flux esa majburiy UI’siz controllerlar to‘plamiga yaqinroq. Tanlov ko‘pincha jamoa afzalligiga bog‘liq.

### Muvaffaqiyatsiz relizni qanday orqaga qaytarish mumkin?

Versiyani o‘zgartirgan commit uchun `git revert` qiling, Argo CD klasterni sinxronlaydi. Interfeys orqali ham qaytarish mumkin, lekin avtosinxronizatsiya yoqilgan bo‘lsa, Git o‘z holatini yana tiklaydi.
