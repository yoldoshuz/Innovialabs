---
title: GitHub Actions orqali Docker image yig‘ish va nashr qilish
description: GitHub Actions’da buildx, layer cache, multi-platform build va commit hamda versiya teglari bilan Docker image yig‘ib, GHCR yoki Docker Hub’ga yuborish.
summary: Docker’ning rasmiy action’laridan (setup-buildx, login, metadata, build-push) type=gha cache bilan foydalaning — image tez yig‘iladi, commit va versiya teglarini oladi va GHCR yoki Docker Hub’ga chiqadi.
---
## Qisqa javob

GitHub Actions’da Docker image uchun ishonchli pipeline to‘rtta tayyor qadamdan iborat:

1. **docker/setup-buildx-action** — BuildKit va buildx’ni yoqadi.
2. **docker/login-action** — registry’ga kirish (GHCR yoki Docker Hub).
3. **docker/metadata-action** — teg va label’larni avtomatik yaratadi.
4. **docker/build-push-action** — image’ni layer cache bilan yig‘adi va yuboradi.

`docker build` va `docker push` bilan qo‘lda shell skript yozish shart emas: bu action’lar teglar, cache va multi-platform masalalarini allaqachon hal qiladi.

## Tayyor workflow

```yaml
name: docker

on:
  push:
    branches: [main]
    tags: ["v*"]

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      - uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Nimalar muhim

**Registry.** GHCR uchun ichki `GITHUB_TOKEN` va `packages: write` huquqi yetarli. Docker Hub uchun akkaunt sozlamalarida **access token** yarating, uni repozitoriy secret’lariga saqlang va login qadamidan `registry`ni olib tashlang.

**Teglar.** Metadata action Git hodisalarini image teglariga aylantiradi:

| Hodisa | Teglar |
|---|---|
| main’ga push | `main`, `sha-<qisqa hash>` |
| `v1.4.2` tegi | `1.4.2`, `1.4` |

Commit tegi image’ni aniq kodga bog‘laydi — deploy va rollback’da shundan foydalaning. Semantik teglar image’ni versiya bo‘yicha oladiganlar uchun.

**Layer cache.** `type=gha` cache’ni GitHub Actions cache’da saqlaydi. `mode=max` multi-stage build’ning oraliq layer’larini ham keshlaydi. Muqobil variant — `type=registry`: cache registry’da alohida teg sifatida turadi, bu boshqa tizimlarga ham kerak bo‘lsa qulay.

**Multi-platform.** QEMU oddiy `amd64` runner’da `arm64` image yig‘ish imkonini beradi. Bu sekin: emulyatsiya kompilyatsiyani sekinlashtiradi. ARM build juda uzoq cho‘zilsa, ARM runner’lardan foydalanib, image’larni manifest’ga birlashtiring yoki Dockerfile ichida cross-compile qiling.

## Yaxshi keshlanadigan Dockerfile

Cache faqat layer’lar barqaror bo‘lganda ishlaydi:

- Avval dependency fayllarini (`package.json`, `go.mod`, `requirements.txt`) nusxalang, dependency’larni o‘rnating, shundan keyingina manba kodni nusxalang.
- **Multi-stage build** ishlating: bir stage’da yig‘ing, yakuniy image’ga faqat artefaktlarni qo‘ying.
- `.dockerignore` qo‘shing, shunda `node_modules`, `.git` va lokal fayllar kontekstga tushmaydi va cache’ni buzmaydi.

## Ko‘p uchraydigan xatolar

- **Pull request’dan nashr qilish.** Fork’lardan kelgan PR’lar secret’larga kira olmaydi. `push: ${{ github.event_name != 'pull_request' }}` qo‘ying — image tekshiruv uchun yig‘iladi, lekin yuborilmaydi.
- **Faqat `latest` tegi.** Production’da qaysi versiya turganini bilib bo‘lmaydi, rollback qiyinlashadi.
- **Build args’dagi secret’lar.** Ular image tarixida qoladi. Build paytidagi secret’lar uchun build-push-action’dagi `secrets` va `RUN --mount=type=secret`dan foydalaning.
- **`packages: write` yo‘q.** GHCR’ga push avtorizatsiya xatosi bilan tushadi.

Parametrlar haqida batafsil — [GitHub Actions uchun Docker hujjatlarida](https://docs.docker.com/build/ci/github-actions/).

## FAQ

### GHCR yoki Docker Hub — qaysi birini tanlash kerak?

Kod allaqachon GitHub’da bo‘lsa, GHCR qulay: avtorizatsiya ichki token orqali, huquqlar repozitoriydan meros qilinadi. Docker Hub ochiq image’lar uchun odatiyroq, lekin anonim yuklab olishlarga limit qo‘yadi. Metadata action’da ikkita image ko‘rsatib, ikkalasiga ham nashr qilish mumkin.

### Nega cache build’ni tezlashtirmayapti?

Ko‘pincha Dockerfile’dagi tartib aybdor: manba kod dependency’lar o‘rnatilishidan oldin nusxalansa, koddagi har qanday o‘zgarish undan keyingi barcha layer’larni bekor qiladi. `.dockerignore`ni va `mode=max` ko‘rsatilganini ham tekshiring.

### Multi-platform build doim kerakmi?

Yo‘q. Serverlar va dasturchilar `amd64`da ishlasa, bitta platforma yetarli va build sezilarli tezroq bo‘ladi. ARM serverlar bo‘lsa yoki Apple Silicon’dagi dasturchilar image’ni lokal ishga tushirsa, ARM qo‘shing.
