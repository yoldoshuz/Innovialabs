---
title: Сборка и публикация Docker-образов через GitHub Actions
description: Как собрать Docker-образ в GitHub Actions с buildx, кешем слоёв, мультиплатформенной сборкой и тегами по коммиту и версии и отправить его в GHCR или Docker Hub.
summary: Используйте официальные actions от Docker (setup-buildx, login, metadata, build-push) с кешем type=gha — так образ собирается быстро, получает теги по коммиту и версии и публикуется в GHCR или Docker Hub.
---
## Короткий ответ

Рабочий пайплайн для Docker-образа в GitHub Actions состоит из четырёх готовых шагов:

1. **docker/setup-buildx-action** — включает BuildKit и buildx.
2. **docker/login-action** — вход в реестр (GHCR или Docker Hub).
3. **docker/metadata-action** — автоматически генерирует теги и labels.
4. **docker/build-push-action** — собирает и публикует образ, с кешем слоёв.

Писать shell-скрипты с `docker build` и `docker push` вручную не нужно: эти actions уже решают теги, кеш и мультиплатформенность.

## Готовый workflow

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

## Что здесь важно

**Реестр.** Для GHCR достаточно встроенного `GITHUB_TOKEN` и права `packages: write`. Для Docker Hub создайте **access token** в настройках аккаунта, сохраните его в секретах репозитория и уберите `registry` из шага логина.

**Теги.** Metadata-action превращает события Git в теги образа:

| Событие | Тег |
|---|---|
| Пуш в main | `main`, `sha-<короткий хеш>` |
| Тег `v1.4.2` | `1.4.2`, `1.4` |

Тег по коммиту даёт точную привязку образа к коду — его удобно указывать при деплое и откате. Семантические теги нужны тем, кто подтягивает образ по версии.

**Кеш слоёв.** `type=gha` хранит кеш в GitHub Actions cache. `mode=max` кеширует и промежуточные слои multi-stage сборки, а не только финальные. Альтернатива — `type=registry`, когда кеш лежит отдельным тегом в реестре; это удобно, если кеш нужен и другим системам.

**Мультиплатформенность.** QEMU позволяет собрать образ для `arm64` на обычном `amd64`-раннере. Это медленно: эмуляция тормозит компиляцию. Если сборка под ARM занимает слишком долго, используйте ARM-раннеры и объединяйте образы в manifest, либо кросс-компиляцию внутри Dockerfile.

## Dockerfile, который хорошо кешируется

Кеш работает только тогда, когда слои стабильны:

- Сначала копируйте файлы зависимостей (`package.json`, `go.mod`, `requirements.txt`), устанавливайте зависимости, и только потом копируйте исходники.
- Используйте **multi-stage build**: сборка в одном stage, в финальный образ — только артефакты.
- Добавьте `.dockerignore`, чтобы `node_modules`, `.git` и локальные файлы не попадали в контекст и не ломали кеш.

## Частые ошибки

- **Публикация из pull request.** PR из форков не имеют доступа к секретам. Для PR ставьте `push: ${{ github.event_name != 'pull_request' }}` — образ соберётся для проверки, но не отправится.
- **Только тег `latest`.** По нему невозможно понять, какая версия сейчас в проде, и сложно откатиться.
- **Секреты в build args.** Они остаются в истории образа. Для секретов на этапе сборки используйте `secrets` в build-push-action и `RUN --mount=type=secret`.
- **Нет прав `packages: write`.** Пуш в GHCR упадёт с ошибкой авторизации.

Подробности по параметрам — в [документации Docker по GitHub Actions](https://docs.docker.com/build/ci/github-actions/).

## FAQ

### GHCR или Docker Hub — что выбрать?

GHCR удобен, если код уже на GitHub: авторизация через встроенный токен, права наследуются от репозитория. Docker Hub привычнее для публичных образов, но у него есть лимиты на скачивания для анонимных пользователей. Можно публиковать в оба реестра, указав два образа в metadata-action.

### Почему кеш не ускоряет сборку?

Чаще всего виноват порядок инструкций в Dockerfile: если исходники копируются до установки зависимостей, любое изменение кода сбрасывает кеш всех следующих слоёв. Также проверьте `.dockerignore` и что указан `mode=max`.

### Нужна ли мультиплатформенная сборка всегда?

Нет. Если сервера и разработчики работают на `amd64`, достаточно одной платформы — сборка будет заметно быстрее. ARM добавляют, когда есть серверы на ARM или разработчики на Apple Silicon запускают образ локально.
