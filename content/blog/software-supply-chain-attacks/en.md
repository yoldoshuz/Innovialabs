---
title: Software Supply Chain Attacks and How to Defend Against Them
description: Typosquatting, compromised maintainers and malicious install scripts: how dependency attacks work and how SBOMs, pinning, signatures and CI hardening help.
summary: A supply chain attack targets not your code but what it is built from — packages, tools and CI; defense relies on pinning versions, blocking install scripts, SBOMs, signature verification and least privilege in CI.
---
## The short answer

A **supply chain attack** is when an attacker does not break into your application directly but tampers with what it is built from: an npm or PyPI package, a GitHub Action, a Docker image, a build tool. The malicious code enters the project through an ordinary `npm install` and runs with the permissions of a developer or a CI job.

The core defenses:

1. **Pin** exact versions and sources of dependencies.
2. **Do not run** third-party install scripts unless needed.
3. **Know what is in** your build — an SBOM.
4. **Verify signatures** and the provenance of artifacts.
5. **Limit CI permissions** so one compromised step does not unlock everything.

## How the attacks work

**Typosquatting.** A package named almost like a popular one: a typo, an extra hyphen, swapped words. One wrong letter in `npm install` is enough.

**Dependency confusion.** If a company has an internal package such as `billing-utils`, an attacker publishes a package with the same name and a higher version to the public registry. A misconfigured package manager picks the public one.

**Compromised maintainers.** The attacker takes over a popular library author's account, or becomes a co-maintainer after slowly earning trust. Well-known examples include event-stream on npm, where a new maintainer added a dependency carrying malicious code, and the xz-utils backdoor discovered in 2024.

**Malicious install scripts.** The `preinstall` and `postinstall` fields in `package.json` run automatically on install. A script can read `.env` files, SSH keys and cloud tokens and send them out — before you have even started the app.

**Tampering in CI.** A third-party GitHub Action referenced by a tag like `@v3` can be changed by pointing the tag at a different commit. Every pipeline using that tag will run the new code with access to its secrets.

## Pinning versions and sources

- Commit the **lockfile** and install with `npm ci` — it never changes versions.
- Use **scoped packages** for internal libraries and bind the scope to your own registry explicitly:

```ini
# .npmrc
@company:registry=https://npm.company.internal/
```

- Do not upgrade to a version released an hour ago: malicious releases are often caught and pulled within days. Renovate has the `minimumReleaseAge` setting for this.
- In CI, reference Actions by **full commit SHA** rather than by tag, and keep them updated with Dependabot or Renovate.

## Install scripts

Most packages do not need install scripts. Disable them by default and allow them selectively for packages that truly require them (for example, those with native builds):

```bash
npm ci --ignore-scripts
```

Some package managers let you maintain an explicit allowlist of packages permitted to run scripts — use it.

## SBOM

An **SBOM** (Software Bill of Materials) is a complete list of components in a build, with versions. It answers "are we affected?" when news breaks about a compromised package: instead of searching by hand, you query the SBOMs of all your services.

The standard formats are **CycloneDX** and **SPDX**. You can generate an SBOM like this:

```bash
npm sbom --sbom-format cyclonedx > sbom.json   # in recent npm versions
syft dir:. -o cyclonedx-json > sbom.json        # for any project or image
```

Generate an SBOM in CI for every build and store it next to the artifact.

## Signature verification

- `npm audit signatures` verifies registry signatures and **provenance attestations** — proof of which repository and pipeline built a package.
- When publishing your own packages, use `npm publish --provenance` from CI.
- For containers, use **Sigstore cosign**: sign images at build time and verify the signature before deploying.

```bash
cosign verify \
  --certificate-identity-regexp "https://github.com/org/app/" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  ghcr.io/org/app:1.4.0
```

## Hardening CI

| Measure | What it gives you |
|---|---|
| Minimal `permissions` for the CI token (`contents: read` by default) | A compromised step cannot write to the repository |
| Secrets only in the jobs and environments that need them | A leak is limited to one stage |
| Care with `pull_request_target` and code from forks | Untrusted code never sees your secrets |
| Ephemeral runners | Malware does not persist between builds |
| Protected branches and required review | Nobody can quietly change the pipeline |
| OIDC instead of long-lived cloud keys | Nothing long-lived to steal |

For a systematic view of maturity, the **SLSA** framework and the **OpenSSF Scorecard** tool are useful.

## FAQ

### Is npm audit enough to protect against these attacks?

No. npm audit finds vulnerabilities that have already been reported, while a malicious package can be brand new and not flagged anywhere yet. You also need pinning, disabled install scripts and CI restrictions.

### Does a small team need an SBOM?

Generating an SBOM in CI takes a few lines of configuration and saves hours of manual searching during the next major incident. So yes, even for one or two services.

### How do I vet a new dependency before installing it?

Check the exact name against the official documentation, look at the repository, its activity and number of maintainers, whether it has install scripts, and whether it has provenance. If the feature takes a few lines to write yourself, sometimes it is better to skip the package.
