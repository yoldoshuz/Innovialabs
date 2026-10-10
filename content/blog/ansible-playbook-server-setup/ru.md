---
title: Как автоматизировать настройку сервера с помощью Ansible playbook
description: Пишем inventory и playbook Ansible, который создаёт пользователей, ставит пакеты, раскладывает конфиги через шаблоны и использует handlers и роли.
summary: Ansible по SSH приводит серверы к описанному в YAML состоянию: inventory перечисляет хосты, playbook — задачи, шаблоны генерируют конфиги, handlers перезапускают сервисы только при изменениях, а роли делают всё это переиспользуемым.
---
## Зачем Ansible и как он работает

Настраивать сервер вручную по инструкции — значит каждый раз рисковать пропустить шаг. **Ansible** описывает нужное состояние сервера в YAML и применяет его по **SSH**, без агентов на машинах. Нужны только Python на целевом сервере и доступ по ключу.

Главное свойство — **идемпотентность**: повторный запуск ничего не ломает. Если пакет уже установлен, Ansible его пропустит и покажет `ok`, а не `changed`.

## Шаг 1. Inventory

Inventory — список серверов и их групп:

```ini
[web]
web1 ansible_host=203.0.113.10
web2 ansible_host=203.0.113.11

[web:vars]
ansible_user=root
```

Проверьте связь: `ansible web -i inventory.ini -m ping`. Ответ `pong` от каждого хоста значит, что SSH и Python в порядке.

## Шаг 2. Структура проекта

```text
inventory.ini
site.yml
roles/
  base/
    tasks/main.yml
    handlers/main.yml
  nginx/
    tasks/main.yml
    handlers/main.yml
    templates/site.conf.j2
    defaults/main.yml
```

**Роль** — папка с задачами, шаблонами, handlers и переменными по умолчанию для одной ответственности. Роль `base` готовит любой сервер, роль `nginx` — только веб-серверы.

## Шаг 3. Пользователи и пакеты

`roles/base/tasks/main.yml`:

```yaml
- name: Install base packages
  ansible.builtin.apt:
    name: [curl, git, ufw, fail2ban]
    state: present
    update_cache: true

- name: Create deploy user
  ansible.builtin.user:
    name: deploy
    groups: sudo
    append: true
    shell: /bin/bash

- name: Add SSH key for deploy
  ansible.posix.authorized_key:
    user: deploy
    key: "{{ lookup('file', 'files/deploy.pub') }}"

- name: Disable SSH password login
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    regexp: '^#?PasswordAuthentication'
    line: 'PasswordAuthentication no'
  notify: Restart ssh
```

`roles/base/handlers/main.yml`:

```yaml
- name: Restart ssh
  ansible.builtin.service:
    name: ssh
    state: restarted
```

**Handler** запускается только если задача, которая его уведомила (`notify`), что-то изменила, и выполняется один раз в конце play. Так сервис не перезапускается без причины. Имя службы SSH отличается в разных дистрибутивах — проверьте его для вашей ОС.

## Шаг 4. Конфиги через шаблоны

Шаблоны пишутся на **Jinja2** и заполняются переменными. `roles/nginx/defaults/main.yml`:

```yaml
server_name: example.com
app_port: 3000
```

`roles/nginx/templates/site.conf.j2`:

```nginx
server {
    listen 80;
    server_name {{ server_name }};

    location / {
        proxy_pass http://127.0.0.1:{{ app_port }};
        proxy_set_header Host $host;
    }
}
```

`roles/nginx/tasks/main.yml`:

```yaml
- name: Install nginx
  ansible.builtin.apt:
    name: nginx
    state: present

- name: Deploy site config
  ansible.builtin.template:
    src: site.conf.j2
    dest: /etc/nginx/sites-available/site.conf
  notify: Reload nginx

- name: Enable site
  ansible.builtin.file:
    src: /etc/nginx/sites-available/site.conf
    dest: /etc/nginx/sites-enabled/site.conf
    state: link
  notify: Reload nginx
```

И handler `Reload nginx` в `roles/nginx/handlers/main.yml` с `state: reloaded`.

## Шаг 5. Playbook

`site.yml`:

```yaml
- name: Base setup for all servers
  hosts: all
  become: true
  roles:
    - base

- name: Web servers
  hosts: web
  become: true
  roles:
    - nginx
```

Запуск: сначала `ansible-playbook -i inventory.ini site.yml --check --diff` (покажет изменения без применения), затем без `--check`.

## Частые ошибки

- **Модуль `shell` вместо специализированных модулей.** `shell` не идемпотентен; используйте `apt`, `user`, `template`, `service`.
- **Секреты в открытом виде.** Пароли и токены храните в **Ansible Vault**.
- **Запрет входа по паролю до проверки ключа.** Убедитесь, что вход по ключу работает, иначе потеряете доступ.
- **Ручные правки на сервере.** Всё, что не описано в playbook, исчезнет или разойдётся при следующей настройке.

## FAQ

### Чем Ansible отличается от Terraform?

Terraform создаёт инфраструктуру: серверы, сети, базы в облаке. Ansible настраивает то, что уже создано: пакеты, пользователей, конфиги. Их часто используют вместе.

### Нужно ли ставить что-то на сервер?

Агента — нет. Нужны SSH-доступ и Python, который в большинстве дистрибутивов Linux уже есть.

### Где брать готовые роли?

В Ansible Galaxy есть роли и коллекции сообщества. Перед использованием читайте их код: роль выполняется с правами root.
