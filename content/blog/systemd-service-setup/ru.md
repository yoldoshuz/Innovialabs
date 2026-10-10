---
title: Как запустить приложение как systemd-сервис в Linux
description: Как написать unit-файл systemd: пользователь, рабочая папка, переменные окружения, политика перезапуска, автозапуск и чтение логов через journalctl.
summary: Создайте unit-файл в /etc/systemd/system с ExecStart, User, WorkingDirectory, EnvironmentFile и Restart=on-failure, затем выполните daemon-reload и enable --now, а логи смотрите через journalctl -u.
---
## Короткий ответ

Чтобы приложение работало в фоне, стартовало вместе с сервером и поднималось после падения, оформите его как **systemd-сервис**:

1. Создайте файл `/etc/systemd/system/myapp.service`.
2. Укажите команду запуска, пользователя, рабочую папку и политику перезапуска.
3. Выполните `systemctl daemon-reload` и `systemctl enable --now myapp`.
4. Логи читайте через `journalctl -u myapp`.

Запуск через `nohup`, `screen` или `&` не переживает перезагрузку и не перезапускает упавший процесс — systemd решает обе задачи.

## Unit-файл

```ini
[Unit]
Description=My web app
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp/env
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Разберём ключевые параметры.

## Что означает каждый параметр

**[Unit]**

- **Description** — понятное имя, оно видно в `systemctl status`.
- **After / Wants** — запускать после того, как сеть готова. Если приложению нужна база на том же сервере, добавьте её сервис в `After=`.

**[Service]**

- **ExecStart** — полная команда запуска с **абсолютными путями**. systemd не использует ваш `PATH` из shell.
- **User / Group** — отдельный системный пользователь без прав root. Создаётся так: `sudo useradd --system --no-create-home myapp`.
- **WorkingDirectory** — папка, относительно которой приложение ищет файлы.
- **EnvironmentFile** — файл с переменными `KEY=value`. Храните там секреты с правами `600`, а не в самом unit-файле. Для пары несекретных значений подойдёт `Environment=`.
- **Restart** — политика перезапуска.
- **RestartSec** — пауза перед перезапуском, чтобы не крутить быстрый цикл падений.

**[Install]**

- **WantedBy=multi-user.target** — запускать при обычной загрузке системы.

## Политики перезапуска

| Значение | Когда перезапускает |
|---|---|
| `no` | никогда |
| `on-failure` | при ненулевом коде выхода, сигнале, таймауте |
| `always` | всегда, даже после нормального завершения |

Для веб-сервисов обычно выбирают `on-failure` или `always`. Если процесс падает слишком часто, systemd перестаёт его перезапускать — это регулируют `StartLimitIntervalSec` и `StartLimitBurst` в секции `[Unit]`.

## Управление сервисом

```bash
sudo systemctl daemon-reload        # после любого изменения unit-файла
sudo systemctl enable --now myapp   # автозапуск + старт сейчас
sudo systemctl status myapp
sudo systemctl restart myapp
sudo systemctl stop myapp
```

## Логи через journalctl

Всё, что приложение пишет в stdout и stderr, попадает в журнал:

```bash
journalctl -u myapp -f                  # следить в реальном времени
journalctl -u myapp -n 100              # последние 100 строк
journalctl -u myapp --since "1 hour ago"
journalctl -u myapp -p err              # только ошибки
```

Пишите логи в stdout — отдельные лог-файлы и их ротация тогда не нужны.

## Частые ошибки

- **Забыли `daemon-reload`** — systemd продолжает использовать старую версию файла.
- **Относительные пути** в `ExecStart` — сервис падает с ошибкой «not found».
- **Запуск под root** без необходимости.
- **Секреты прямо в unit-файле** — его может прочитать любой пользователь системы.
- **Приложение уходит в фон само** (daemonize) при `Type=simple` — systemd считает, что процесс завершился. Запускайте приложение в foreground-режиме.

Полный список параметров — в документации [systemd.service](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html).

## FAQ

### Чем systemd лучше pm2 или supervisor?

systemd уже есть в большинстве дистрибутивов, не требует отдельного runtime и интегрирован с журналом и загрузкой системы. pm2 удобен для Node.js-специфичных функций, но для одного-двух сервисов на сервере systemd обычно достаточно.

### Как запустить несколько экземпляров одного приложения?

Используйте шаблонный unit `myapp@.service` и `%i` в параметрах, например для порта. Затем запускайте `myapp@3000` и `myapp@3001` как отдельные сервисы.

### Сервис сразу падает — где искать причину?

Выполните `systemctl status myapp` и `journalctl -u myapp -n 50`. Чаще всего причина — неверный путь, нехватка прав у пользователя сервиса или отсутствующая переменная окружения.
