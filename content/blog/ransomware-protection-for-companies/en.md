---
title: How to Protect Your Company from Ransomware
description: How ransomware gets in (phishing, RDP, unpatched software), the layers of protection you need, why backups must be isolated and what to do in the first hours.
summary: Close the main entry points — phishing, exposed RDP and unpatched software — enable two-factor authentication, limit privileges, keep isolated backups, and disconnect infected devices from the network immediately if an attack happens.
---
## The short answer

**Ransomware** encrypts a company's files and servers and demands payment for the key. Attackers often copy data beforehand as well and threaten to publish it.

Protection comes in layers:

- **Close the entry points**: phishing, unprotected remote access, unpatched software.
- **Limit the spread**: least privilege, network segmentation, separate admin accounts.
- **Make recovery possible**: backups the attacker cannot delete or encrypt.
- **Have a plan** for the first hours after infection.

## How ransomware gets in

| Path | What it looks like | What helps |
|---|---|---|
| **Phishing** | An email with an "invoice", "contract" or "CV" attached, or a link to a fake login page | Email filtering, blocking macros, staff training, 2FA |
| **Exposed RDP and remote access** | Password guessing against RDP open to the internet, or a login with a stolen VPN password | RDP only through a VPN, 2FA on the VPN, attempt limits, removing unused access |
| **Unpatched software** | Exploiting known vulnerabilities in VPN gateways, mail servers, CMSs, plugins | Regular updates, starting with everything reachable from the internet |
| **Stolen credentials** | A password leaked from another site is reused to log in to company services | Unique passwords, a password manager, 2FA |
| **Pirated software** | "Activators" and cracked programs bundled with malware | Regular users cannot install software |

## Layered protection

**The baseline:**

- **2FA** on email, VPN, cloud services and admin panels.
- **Updates** for operating systems, browsers, office suites and especially network devices and servers.
- **Antivirus or EDR** on every computer and server, centrally managed.
- **No admin rights** for regular users.

**The next level:**

- **Separate accounts** for everyday work and administration.
- **Unique local administrator passwords** on each computer (Windows offers LAPS for this).
- **Network segmentation**: accounting, servers, guest Wi-Fi and cameras in different segments.
- **Event logs** collected in one place and stored away from the servers that could be attacked.
- **Staff training** with real email examples and a simple way to report anything suspicious.

## Isolated backups

Modern ransomware deliberately hunts down and destroys backups. A backup protects you only if it is:

- **Immutable** (storage with Object Lock or similar) or **offline** (a drive disconnected after the backup).
- Accessible under a **separate account** that is not in the domain and is protected with 2FA.
- Stored on a backup server or NAS that is **not domain-joined** and not reachable from regular computers via network shares.
- **Regularly restore-tested**, so you know how long it takes to get back to work.

## The first hours after infection

1. **Isolate**: disconnect infected computers from the network (cable, Wi-Fi). Do not power them off unless necessary — memory may hold traces useful for the investigation.
2. **Stop the spread**: disable remote access and, if needed, links between segments and to cloud storage.
3. **Assemble the team**: management, IT, legal; if you have a contract with a security provider, call them right away.
4. **Preserve evidence**: the ransom note, samples of encrypted files, logs. Do not wipe or reinstall systems before assessment.
5. **Check your backups**: are they intact, and when were the last clean copies made?
6. **Change passwords** from a clean device — administrators, email and VPN first.
7. **Restore into a clean environment**: close the entry point first, or the infection will return.
8. **Report** to law enforcement and, if personal data is affected, assess your legal obligations.

Paying the ransom does not guarantee you get a key, nor that stolen data will not be published. Free decryptors exist for some ransomware families — the No More Ransom project collects them.

## FAQ

### Is antivirus enough to protect against ransomware?

No. Antivirus is one layer. Attacks often start with a login using a stolen password, after which the attacker uses legitimate admin tools. You also need 2FA, updates, limited privileges and isolated backups.

### Should we pay the ransom?

That is a management decision to make with legal counsel. Keep in mind that payment guarantees neither decryption nor deletion of stolen data, and may mark the company as a target for repeat attacks. The best position is having backups that let you avoid paying.

### Where should a small company with a limited budget start?

With 2FA on email and remote access, closing RDP to the internet, automatic updates, and one offline or immutable backup with a tested restore. These steps cover the most common attack scenarios.
