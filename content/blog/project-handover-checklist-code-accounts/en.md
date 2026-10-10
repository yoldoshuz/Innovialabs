---
title: "Project Handover Checklist: Code, Accounts and Access"
description: What a client must receive at project handover: repositories, domains, hosting, app store accounts, API keys, documentation and account ownership.
summary: At handover the client must become the owner of every account — repository, domain, hosting, app stores and external services — and receive the code, keys and documentation needed to work without the previous contractor.
---

## The short answer

A project is handed over when **every key account is owned by the client**, not by the contractor or one of their employees, and when a new team can deploy, change and release the product using only what you received. The test is simple: imagine the previous contractor is unavailable tomorrow. Anything you could not do yourself has not been handed over yet.

## The core principle: owner, not guest

The most common problem is accounts registered to a developer's email, with the client given "access". As long as someone else is the owner, they can lose the password, leave the company or simply stop responding.

The rule: the account **owner** is the client's company (corporate email, legal entity, client's payment method). The contractor receives an **invitation with a limited role** and is removed once the work is done.

## Code and repositories

- The repository (GitHub, GitLab, Bitbucket) lives in the **client's organization**, not in a developer's personal account.
- The **full commit history** and all active branches are transferred, not an archive of the latest version.
- The repository contains no plain-text passwords or keys; secrets are moved to environment variables.
- There is an example config file (for instance, `.env.example`) listing all required variables without values.
- **CI/CD** settings and pipelines are accessible to the client.

## Domains and DNS

- The domain is registered **to the client**, with a corporate contact email.
- Access to the registrar panel and to the DNS provider, if they differ.
- Auto-renewal is on and the expiry date is known.
- DNS records are documented: website, email, service verifications.

## Hosting and infrastructure

- The cloud or hosting account is in the client's name and billed to the client's card.
- Server access: the client's SSH keys are added, and the contractor's keys are removed after handover.
- It is documented **where and how** the application runs: servers, containers, databases, file storage.
- **Backups** are configured, and the restore procedure is known.
- SSL certificates renew automatically.

## Mobile app stores

- **Google Play Console** and **Apple Developer** accounts belong to the client's company.
- App signing keys are kept by the client. Losing a signing key can make it impossible to ship updates to an already published app, so this item is critical.
- Access to certificates and profiles for push notifications.

## External services and API keys

Build a register of every service the project depends on:

| Service | Purpose | Account owner | Where the key lives |
|---|---|---|---|
| Payment provider | Accepting payments | Client | Environment variables |
| Email service | Emails to users | Client | Environment variables |
| Telegram bot | Notifications | Client | Environment variables |
| Analytics | Website metrics | Client | Website settings |
| Maps, SMS, AI APIs | Per project | Client | Environment variables |

After handover, **rotate the keys** the contractor has seen if the contract and your risk profile call for it.

## Documentation

- How to **run the project locally**, step by step.
- How to **deploy** a new version to the server.
- An architecture overview: which parts exist and how they connect.
- API documentation, if there is an API.
- A list of known issues and technical debt.
- Contacts: who answers questions about the project, and until when.

## How to run the handover

1. Build a register of all accounts and services.
2. Transfer ownership to the client and verify billing.
3. Receive the code, secrets and documentation.
4. Ask an **independent developer** to deploy the project from the documentation.
5. Revoke the contractor's access and change shared passwords.
6. Sign a handover act listing everything transferred.

## FAQ

### Where should passwords and keys be stored after handover?

In a corporate password manager with access control, and application secrets in environment variables or the cloud provider's secrets manager. Spreadsheets and messenger chats are not suitable for this.

### What if the domain is registered to the contractor?

Request a change of the domain registrant or a transfer to the client's account. The procedure depends on the registrar and the domain zone, so start early while the contractor is still reachable.

### Should the contractor's access be removed right away?

Yes, once you have confirmed everything works without them. If the contractor stays on for support, give them the minimum role they need, not owner rights.
