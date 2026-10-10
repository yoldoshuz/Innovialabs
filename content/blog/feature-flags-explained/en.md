---
title: What Are Feature Flags and How They Make Releases Safer
description: How feature flags separate deploy from release, the main flag types, tooling options and how to avoid accumulating feature flag debt.
summary: A feature flag is a switch in your code that turns a feature on or off without a new deploy. It lets you ship code early, open a feature to some users first and turn it off instantly if something breaks.
---

## The short answer

A **feature flag** (feature toggle) is a condition in your code that decides whether a user sees a new feature. The flag value lives outside the code — in config, a database or a dedicated service — and can change without rebuilding or redeploying.

```ts
if (flags.isEnabled("new-checkout", user)) {
  return renderNewCheckout();
}
return renderOldCheckout();
```

The core idea is to **decouple deploy from release**. Deploy is getting code onto servers. Release is the moment users get access to the feature. With flags, these become two independent decisions.

## Why releases become safer

- **Instant rollback.** If a feature breaks, you flip the flag off instead of rolling back the whole deploy.
- **Gradual rollout.** First the team, then a small share of users, then everyone.
- **Fewer long-lived branches.** Unfinished code can be merged into main behind a disabled flag (trunk-based development).
- **Release on a business signal.** Marketing can open a feature on the right day without developers.

## Types of flags

| Type | Purpose | Lifespan |
|---|---|---|
| **Release** | Hide an unfinished or new feature until launch | Short: remove after full release |
| **Experiment** | A/B test: different variants for different groups | Until the experiment ends |
| **Ops / kill switch** | Disable a heavy or risky part of the system in an emergency | Long, often permanent |
| **Permission** | Open a feature to specific plans or customers | Long |

The distinction matters: a release flag forgotten for a year is debt, while a kill switch living for years is normal.

## Tooling options

- **Config or environment variables.** Simplest for a couple of flags, but changing a value often needs a restart.
- **Your own database table plus admin panel.** Flexible, but you build targeting, auditing and rollout percentages yourself.
- **Open-source tools** such as Unleash, Flagsmith or GrowthBook. You can self-host them.
- **SaaS services** such as LaunchDarkly. Ready SDKs, targeting and audit logs, but an external dependency and a subscription.
- **The OpenFeature standard** — a vendor-neutral API for flags that lets you switch providers without rewriting code.

The choice depends on how many flags you have, whether you need per-user targeting and whether you are ready to maintain a solution yourself.

## How to avoid flag debt

Every flag is an extra `if` branch in the code and an extra scenario to test. Without discipline, you end up with hundreds.

- **Owner and expiry.** Each flag has a responsible person and an expected removal date.
- **Clear names.** `checkout-v2-release`, not `flag1` or `test_new`.
- **Removal is part of the task.** After full release, create a ticket to delete the flag and the old code path.
- **Regular audits.** Every sprint or month, review flags that have sat at 100% or 0% for a long time.
- **Safe defaults.** If the flag service is unavailable, the code should fall back to predictable behavior.

## Common mistakes

- Nesting flags inside each other — too many combinations to test.
- Checking a flag only on the frontend while the backend endpoint stays open.
- Using flags instead of a proper permission system.
- Not logging who flipped a flag and when.

## FAQ

### How is a feature flag different from a Git branch?

A branch isolates code before merging; a flag isolates it after. With flags, code lives in main and gets deployed, but the feature stays off until you decide to open it.

### Do flags slow the application down?

Checking a flag is usually cheap because SDKs cache values locally. Problems appear only if every check makes a network call, which you should avoid.

### Does a small team need a paid service?

Not necessarily. A few flags work fine with config or a database table. A service or open-source tool pays off when you need rollout percentages, targeting and audit logs.
