---
title: How to Launch a Bug Bounty or Vulnerability Disclosure Program
description: How to start a vulnerability disclosure or bug bounty program: security.txt, disclosure policy, scope and rewards, platforms vs self-run, triage and readiness.
summary: Start with a vulnerability disclosure program: a security.txt file, a clear policy with scope and safe harbor, and a triage process; add paid bug bounty rewards only once your team can fix reported issues quickly.
---
## Short answer

Researchers already find vulnerabilities in public products. The only question is whether they have a safe, clear way to tell you. There are two levels:

- **Vulnerability Disclosure Program (VDP)** — a public promise: "report issues here, we will respond and will not take legal action against good-faith research." No money is required.
- **Bug bounty** — a VDP plus **rewards** for valid findings, which attracts more researchers and more reports.

For most companies the right order is: VDP first, private bug bounty next, public bug bounty last.

## VDP vs bug bounty

| | VDP | Private bug bounty | Public bug bounty |
|---|---|---|---|
| **Who participates** | Anyone who finds something | Invited researchers | Anyone |
| **Rewards** | Thanks, hall of fame | Money | Money |
| **Report volume** | Low | Controlled | High, including noise |
| **Team load** | Light | Medium | Heavy |
| **Good for** | Every public product | Testing the process | Mature security teams |

## Readiness criteria

Do not launch a paid program until you can honestly say yes to these:

- Basic hygiene is done: scans, a pre-launch checklist, ideally a pentest. Otherwise you pay rewards for issues any scanner finds.
- There is a **named owner** of incoming reports and a backup person.
- Developers have time reserved to fix security issues, not "when the sprint allows".
- You have an **asset inventory**: which domains, apps and APIs are yours and in production.
- Management and legal have approved the policy and the budget.
- You know how to deploy a fix quickly and notify users if needed.

## security.txt

A small text file at `/.well-known/security.txt` tells researchers where to report. The format is defined in RFC 9116; `Contact` and `Expires` are required.

```text
Contact: mailto:security@example.com
Expires: 2027-10-01T00:00:00.000Z
Policy: https://example.com/security-policy
Preferred-Languages: en, ru, uz
Canonical: https://example.com/.well-known/security.txt
```

Put a reminder in the calendar to update `Expires` — an expired file signals an abandoned program.

## The disclosure policy

A good policy is short and unambiguous:

- **Scope** — exact domains, apps and API hosts that may be tested.
- **Out of scope** — third-party services, staging environments, physical offices, social engineering of employees.
- **Rules** — no denial-of-service, no access to other users' data beyond the minimum needed to prove the issue, no data destruction, stop and report once you have proof.
- **Safe harbor** — a clear statement that good-faith research within the rules will not lead to legal action.
- **How to report** — channel, required details, language.
- **Your commitments** — when you will acknowledge, how you will keep the researcher informed, and how public disclosure is coordinated.
- **Excluded findings** — for example missing headers without impact, self-XSS, reports from automated scanners without proof.

## Scope and reward table

Rewards are usually tied to **severity**, not to effort. Publish a table so researchers know what to expect:

| Severity | Typical examples | Reward |
|---|---|---|
| Critical | Remote code execution, full account takeover, access to all users' data | Highest tier |
| High | Access to other users' data (IDOR), stored XSS in admin panel, SQL injection | High tier |
| Medium | CSRF on important actions, reflected XSS | Medium tier |
| Low | Information disclosure with limited impact | Low tier or thanks |

Set amounts based on your budget, how critical the asset is and what similar programs in your market pay. You can use different tables for core and secondary assets.

## Platform or self-run

**A bug bounty platform** gives you access to researchers, a report-handling interface, payout handling and often a triage service that filters duplicates and noise. You pay platform fees and follow their terms.

**A self-run program** costs less in fees and gives full control, but you handle everything yourself: intake, triage, legal questions, payments to people in different countries.

A common path is a self-run VDP, then a private program on a platform.

## Triage workflow

1. **Receive** the report in one tracked channel, not a personal inbox.
2. **Acknowledge** receipt within the time promised in the policy.
3. **Reproduce** the issue and check whether it is a duplicate.
4. **Assess severity** with a consistent method, such as CVSS plus business impact.
5. **Fix** and verify, ideally asking the researcher to confirm.
6. **Reward** and thank the researcher.
7. **Disclose** if agreed, and record the root cause to prevent similar bugs.

## FAQ

### What if someone demands money without a program?

Some people send low-value reports and ask for payment. Thank them, assess the report like any other and point to your policy. Do not pay under pressure for issues outside your rules.

### Do we pay for duplicates?

Usually only the first valid report is rewarded. State this in the policy to avoid disputes.

### Can a small company run a VDP?

Yes. A security.txt file, a short policy and one responsible person are enough to start, and they are far better than having researchers guess whom to contact.
