---
title: What Is Penetration Testing and How It Is Done
description: Penetration testing explained: black, grey and white box approaches, testing phases, scope and rules of engagement, the final report and how to prepare.
summary: A penetration test is an authorized, simulated attack in which specialists try to break into your system within an agreed scope, then hand over a report with proven vulnerabilities, their impact and how to fix them.
---
## Short answer

A **penetration test (pentest)** is a controlled attack on your website, app, API or network, carried out with your written permission. Unlike an automated scan, a pentester does not stop at "this might be vulnerable" — they try to **actually exploit** the weakness, chain several small issues into a real attack and show what an intruder could reach: customer data, admin panel, payments, servers.

The result is not a hacked system but a **report**: what was found, how it was proven, how serious it is and what to change.

## Black, grey and white box

The approach depends on how much the testers know before they start.

| Approach | What testers get | Simulates | Strengths | Limits |
|---|---|---|---|---|
| **Black box** | Only the domain or app name | An outside attacker | Realistic view from the internet | Time goes into reconnaissance; deep logic may stay untouched |
| **Grey box** | User accounts for each role, basic docs, API description | A registered user or a partner | Best balance of depth and realism for most web and mobile projects | Needs preparation on your side |
| **White box** | Source code, architecture, configs, admin access | An insider or a very determined attacker | Finds the most issues per day of work | Least realistic as an attack scenario |

For a typical product with logins and roles, **grey box** is usually the most useful choice: authorization flaws between users are among the most common serious findings, and they are hard to reach without accounts.

## Phases of a pentest

1. **Scoping and rules of engagement** — what is tested, how, when and who to call.
2. **Reconnaissance** — subdomains, open ports, technologies, public code, leaked data.
3. **Vulnerability discovery** — automated tools plus manual checks of logic, roles and data flows.
4. **Exploitation** — confirming issues by safely using them, often chaining several low-risk findings.
5. **Impact assessment** — how far an attacker could go: other users' data, privilege escalation, access to infrastructure.
6. **Reporting** — documenting everything with evidence and recommendations.
7. **Retest** — after your fixes, the team checks that the vulnerabilities are really closed.

## Scope and rules of engagement

This document protects both sides. It should state clearly:

- **In scope**: exact domains, IP ranges, app versions, API endpoints.
- **Out of scope**: third-party services, payment providers, shared hosting you do not own.
- **Allowed techniques**: for example, no denial-of-service, no social engineering of staff unless agreed.
- **Time windows** and the environment: staging, production, or both.
- **Data handling**: what testers may download, how evidence is stored and when it is deleted.
- **Contacts** on both sides and a stop procedure if something breaks.
- **Written authorization** from someone who actually has the right to approve testing of these systems.

## What you get at the end

- An **executive summary** in plain language for management.
- A **list of findings**, each with a severity rating (often based on CVSS), affected component, reproduction steps and evidence.
- **Recommendations** for fixing each issue and for the root cause behind it.
- After the retest — an updated report or a letter confirming which findings are closed.

## How to prepare

- **Define the goal**: a pre-launch check, a client or investor requirement, compliance, or worry after an incident.
- **Choose the environment**. Staging that mirrors production is safer; production is more realistic. If production is tested, agree on limits.
- **Make fresh backups** and check that they restore.
- **Create test accounts** for every role, with realistic test data instead of real customer data.
- **Check your hosting or cloud provider's policy** on security testing and decide whether testers' IPs should bypass the WAF.
- **Freeze or log deployments** during the test so findings are not lost between versions.
- **Reserve developer time** for fixes right after the report — a pentest without fixes only documents the risk.

## Common mistakes

- Ordering a pentest of an unfinished product that will change completely next month.
- Scoping only the marketing site while the real data lives in the API and the mobile app.
- Treating a cheap automated scan as a pentest.
- Fixing findings one by one without addressing the cause, such as missing authorization checks across the whole API.

## FAQ

### How long does a pentest take?

It depends on the scope: the number of applications, roles, API endpoints and integrations, plus the chosen approach. A small site may take days, a complex platform several weeks. Ask the provider to explain their estimate in terms of scope.

### Is it safe to test production?

It can be, with clear rules: no destructive actions, agreed time windows, backups and a stop contact. Many teams test staging in depth and run a lighter, careful check on production.

### How often should we do it?

A common practice is after major releases or architecture changes and at least once a year for systems that handle personal or payment data.
