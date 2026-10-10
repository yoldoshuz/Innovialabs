---
title: Managed vs Unmanaged Hosting: Who Takes Care of the Server
description: Managed vs unmanaged hosting explained: who handles updates, backups, security and monitoring, and how to choose based on your team skills and budget.
summary: With managed hosting the provider handles server updates, backups, security and monitoring; with unmanaged hosting you do it yourself, so the choice depends on whether someone on your team can and will administer the server.
---
## The core difference

**Unmanaged hosting** means the provider gives you a server with an operating system installed and guarantees that the hardware, power and network work. Everything above the OS is your responsibility: configuration, updates, security, backups and incident response.

**Managed hosting** means the provider or a contractor handles administration: applies updates, configures security, runs backups, monitors the server and responds to incidents. You focus on your application and your business.

There are options in between, such as a VPS with a control panel and automatic backups but no administrator help. So always read **what is actually included**, not just the plan name.

## Who does what

| Task | Unmanaged | Managed |
|---|---|---|
| Hardware, power, network | Provider | Provider |
| Software installation and setup | You | Provider or by agreement |
| OS and package updates | You | Provider |
| Backups | You | Provider (check frequency and retention) |
| Firewall, brute-force protection | You | Provider |
| SSL certificates | You | Usually the provider |
| Monitoring and alerts | You | Provider |
| Responding to an outage at night | You | Provider, under the SLA |
| Application code and logic | You | You |

Note the last row: even on managed hosting, **bugs in your code are still yours**. The provider is responsible for the server, not the application.

## Updates

On an unmanaged server, security updates have to be installed regularly. On Linux part of this can be automated, for example on Debian and Ubuntu:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Automation does not replace a person, though: major upgrades and changes of database or language versions need testing and sometimes manual work.

## Backups

The most common problem on unmanaged hosting is backups that nobody configured or nobody ever tested. Minimum rules:

- copies are stored **somewhere other than the server** that holds the data;
- you keep several generations of backups, not just the latest one;
- restoring is **tested in practice** from time to time.

On managed hosting, ask how often backups run, how many are kept and what a restore costs.

## Security and monitoring

A server exposed to the internet starts getting scanned almost immediately. The basic minimum: SSH key login instead of passwords, unused ports closed, a firewall, timely updates. Plus monitoring: someone should learn that the site is down or the disk is full before your customers do.

## How to choose

**Unmanaged hosting fits when:**
- someone on the team has Linux administration experience and the time to do it;
- you need full freedom to configure the environment;
- the project is for learning, testing or is not business-critical.

**Managed hosting fits when:**
- there is no administrator on the team, or they are overloaded;
- downtime of the site or service directly costs money;
- you handle personal or payment data and need discipline in updates and security.

When comparing prices, look beyond the plan. An unmanaged server has a smaller bill, but the time of the person maintaining it costs money too. And a single serious failure without a backup can cost more than many months of a managed plan.

## Common mistakes

- **Assuming the provider "handles everything anyway".** On an unmanaged plan it does no backups or updates inside your system.
- **Not reading the SLA.** Response times, availability guarantees and compensation terms should be written down.
- **Leaving the server without an owner.** If the administrator leaves and the access details and notes were only with them, trouble starts at the first failure.

## FAQ

### Can I start unmanaged and switch to managed later?

Yes. Many providers and contractors take over existing servers. They usually start with an audit of the configuration, updates and backups.

### Does managed hosting include support for my website?

Usually not. Managed hosting covers the server and environment. Feature work, fixing bugs in code and CMS updates are typically a separate technical support service.

### Do I need managed hosting for a simple business card website?

Not necessarily. A small site often runs fine on shared hosting or a platform where the provider already takes care of the server. A dedicated managed VPS makes sense when load and reliability requirements grow.
