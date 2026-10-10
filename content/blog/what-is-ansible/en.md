---
title: What Is Ansible: Agentless Server Configuration Explained
description: Ansible configures servers over SSH with no agents to install. Learn inventory, modules, playbooks, idempotency and the routine work it takes off your hands.
summary: Ansible is an automation tool that runs YAML-described tasks on servers over SSH; nothing has to be installed on the servers, and re-running it is safe thanks to idempotency.
---
## What Ansible is

**Ansible** is a tool for automated server configuration (configuration management). You describe in a YAML file what a server should look like: which packages are installed, which users exist, what the nginx config is. Ansible connects to servers over **SSH** and brings them to that state.

Its defining feature is that it is **agentless**: you install nothing on managed servers. All you need is SSH access and Python, which ships with almost every Linux distribution. Ansible is installed only on the machine you run commands from (a laptop or a CI server).

## Four core concepts

### Inventory

A list of servers grouped by role:

```ini
[web]
web1.example.com
web2.example.com

[db]
db1.example.com ansible_user=deploy
```

Groups let you say "run this on all web servers" with a single command.

### Modules

A **module** is a ready-made building block for a specific action: `apt` installs packages, `copy` and `template` place files, `user` manages users, `service` or `systemd` run services. There are hundreds of modules, and most tasks can be done without hand-written shell scripts.

### Playbook

A **playbook** is a YAML file with a scenario: which hosts and which tasks to run.

```yaml
- name: Configure web servers
  hosts: web
  become: true
  tasks:
    - name: Install nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Deploy site config
      ansible.builtin.template:
        src: site.conf.j2
        dest: /etc/nginx/sites-enabled/site.conf
      notify: Reload nginx

  handlers:
    - name: Reload nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded
```

Run it with `ansible-playbook -i inventory.ini site.yml`. The `--check` flag shows what would change without changing anything.

### Roles

A **role** packages tasks, templates and variables for one purpose (for example "nginx" or "postgres") so you can reuse them across projects.

## Idempotency is the key property

**Idempotency** means that running again gives the same result and breaks nothing. A task with `state: present` installs nginx if it is missing and does nothing if it is already there. Ansible reports tasks as `ok` (already in the desired state) or `changed` (something was modified).

That is why playbooks can run regularly, as a check that servers have not drifted from the baseline.

Note: idempotency is guaranteed by modules, not by Ansible itself. Tasks using `shell` or `command` run every time, and you have to add conditions yourself (`creates`, `when`, `changed_when`).

## The routine work Ansible removes

- initial setup of a new server: users, SSH keys, firewall, updates;
- installing and updating software on dozens of machines at once;
- rolling out nginx, PostgreSQL and systemd configs from templates;
- deploying an application: fetch code, build, restart the service;
- bulk operations: rotating a key or certificate, applying a security patch;
- identical environments for staging and production.

## Common mistakes

- **Everything through `shell`.** You lose idempotency and readability. Look for a suitable module first.
- **Plain-text passwords in variables.** Use **Ansible Vault** or an external secrets manager.
- **Running straight on production.** Use `--check --diff` and staging first.
- **Manual edits on servers after Ansible.** The next run will overwrite them; put every change into the playbook.
- **One huge flat playbook.** Split it into roles.

## Ansible vs Terraform

| | Terraform | Ansible |
|---|---|---|
| Main job | Provision infrastructure: servers, networks, DNS | Configure what runs inside servers |
| Approach | Declarative, with a state file | Ordered tasks, no separate state |
| How it works | Through cloud APIs | Over SSH |

They are often used together: Terraform creates the servers, Ansible configures them.

Documentation: [docs.ansible.com](https://docs.ansible.com/).

## FAQ

### Does Ansible work with Windows servers?

Yes, but the connection usually goes through WinRM or OpenSSH for Windows instead of plain SSH, and it uses separate modules prefixed with `win_`. It is a workable option for mixed infrastructure.

### Do I need Ansible if everything runs in Docker?

Less so, but often still yes: someone has to install Docker itself and set up users, firewall, monitoring and updates on the hosts. Ansible covers that layer well.

### Where should I start?

Pick one routine task you do by hand, such as setting up a new server, and describe it in a single playbook. Then move repeated parts into roles and add Vault for secrets.
