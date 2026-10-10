---
title: How to Automate Server Setup with an Ansible Playbook
description: Write an Ansible inventory and playbook that creates users, installs packages, deploys configs with templates and uses handlers and roles.
summary: Ansible brings servers over SSH to a state described in YAML: the inventory lists hosts, the playbook lists tasks, templates generate configs, handlers restart services only on change, and roles make it all reusable.
---
## Why Ansible and how it works

Setting up a server by hand from a checklist means risking a missed step every time. **Ansible** describes the desired server state in YAML and applies it over **SSH**, with no agents on the machines. All you need is Python on the target server and key-based access.

Its core property is **idempotency**: running it again breaks nothing. If a package is already installed, Ansible skips it and reports `ok` instead of `changed`.

## Step 1. Inventory

The inventory is a list of servers and their groups:

```ini
[web]
web1 ansible_host=203.0.113.10
web2 ansible_host=203.0.113.11

[web:vars]
ansible_user=root
```

Test connectivity: `ansible web -i inventory.ini -m ping`. A `pong` from every host means SSH and Python are fine.

## Step 2. Project structure

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

A **role** is a folder with tasks, templates, handlers and default variables for one responsibility. The `base` role prepares any server; the `nginx` role handles web servers only.

## Step 3. Users and packages

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

A **handler** runs only if the task that notified it (`notify`) actually changed something, and it runs once at the end of the play. That way a service is never restarted for no reason. The SSH service name differs between distributions — check it for your OS.

## Step 4. Configs from templates

Templates are written in **Jinja2** and filled with variables. `roles/nginx/defaults/main.yml`:

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

Add a `Reload nginx` handler in `roles/nginx/handlers/main.yml` with `state: reloaded`.

## Step 5. The playbook

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

Run `ansible-playbook -i inventory.ini site.yml --check --diff` first (it shows changes without applying them), then run it without `--check`.

## Common mistakes

- **Using `shell` instead of dedicated modules.** `shell` is not idempotent; use `apt`, `user`, `template`, `service`.
- **Plain-text secrets.** Keep passwords and tokens in **Ansible Vault**.
- **Disabling password login before the key works.** Confirm key-based login first, or you will lock yourself out.
- **Manual edits on the server.** Anything not described in the playbook will vanish or drift on the next run.

## FAQ

### How is Ansible different from Terraform?

Terraform creates infrastructure: servers, networks, managed databases in the cloud. Ansible configures what already exists: packages, users, configs. They are often used together.

### Do I need to install anything on the server?

No agent. You need SSH access and Python, which most Linux distributions already include.

### Where can I find ready-made roles?

Ansible Galaxy has community roles and collections. Read their code before using them: a role runs with root privileges.
