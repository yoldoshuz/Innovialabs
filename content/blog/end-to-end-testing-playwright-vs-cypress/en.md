---
title: End-to-End Testing for Web Apps: Playwright vs Cypress
description: What E2E tests should cover, how Playwright and Cypress compare on speed, browsers and developer experience, and how to write your first login test.
summary: E2E tests check key user journeys end to end in a real browser. Playwright is stronger in cross-browser support, parallelism and multiple tabs; Cypress shines in interactive debugging. For new projects Playwright is the more common pick.
---

## The short answer

An **E2E test** (end-to-end) opens the app in a real browser and walks through a scenario the way a user would: visits, clicks, fills forms, checks the result. It catches what unit tests miss: a broken link between frontend, API and database.

In short:

- **Playwright** — when you need several browsers (including WebKit, the Safari engine), free built-in parallel runs, or multiple tabs and domains in one test.
- **Cypress** — when the team values visual interactive debugging and tests mostly run in one browser.

## What E2E tests should cover

E2E tests are slower and flakier than unit tests, so keep them few and focused on the most important journeys:

- **login, sign-up, password recovery**;
- **the money path**: cart, checkout, payment in test mode;
- **the key form**: request, booking, creating an entity;
- **access control**: users cannot see other people's data or admin pages.

Do not use E2E to check every validation branch or every screen's layout — unit and component tests are for that.

## Comparison

| Criterion | Playwright | Cypress |
|---|---|---|
| Browsers | Chromium, Firefox, WebKit | Chrome family, Firefox, Edge; WebKit experimental |
| Languages | JS/TS, Python, Java, .NET | JS/TS |
| Parallelism | Built-in workers | Via a paid cloud service or third-party tools |
| Multiple tabs and domains | Supported | Limited; `cy.origin` for domains |
| Debugging | UI mode, trace viewer | Interactive runner with "time travel" |
| Waiting | Automatic | Automatic |

**Speed** depends heavily on the app and infrastructure, but built-in parallel runs usually give Playwright an edge on large suites.

**Developer experience**: Cypress has a very visual runner — you see every step and the page state. Playwright has codegen (records actions into code), UI mode and traces that are convenient to inspect after a CI failure.

## First login test: Playwright

Installation creates a config and a sample test:

```bash
npm init playwright@latest
```

Set your app's `baseURL` in `playwright.config.ts`, then the test:

```ts
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Password").fill(process.env.TEST_PASSWORD!);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
```

Run it with `npx playwright test`.

## The same test: Cypress

```js
describe("login", () => {
  it("user can log in", () => {
    cy.visit("/login");
    cy.get('[data-testid="email"]').type("user@example.com");
    cy.get('[data-testid="password"]').type(Cypress.env("TEST_PASSWORD"), { log: false });
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});
```

## How to keep tests stable

- **Find elements by role and label** or by `data-testid`, not by CSS classes.
- **No fixed sleeps** — rely on auto-waiting.
- **A separate test database** and test users; each test prepares its own data.
- **Log in via API** in other tests: check UI login once, then reuse the saved session.
- **Passwords in environment variables**, not in code.
- **Run in CI** on every pull request.

## FAQ

### How many E2E tests do I need?

As many as you have critical journeys. Start with the five to ten most important paths and grow the suite when you find bugs a test could have caught.

### Can I migrate from Cypress to Playwright?

Yes, but there is no automatic conversion: tests are rewritten. Teams usually migrate gradually — new tests in Playwright, old ones as they are touched.

### Do E2E tests replace manual testing?

No. They reliably check repetitive scenarios, but new features, usability and visual issues are still best reviewed by a person.
