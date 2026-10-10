---
title: What Does a QA Engineer Do? Testing as an IT Career
description: What a QA engineer does: manual versus automated testing, daily responsibilities, career paths inside QA and why testing is a common way into the IT industry.
summary: A QA engineer safeguards product quality: checking that everything works as required, finding and describing bugs, and in automation, writing code that runs the checks automatically.
---
## The short answer

A **QA engineer** (Quality Assurance) makes sure a product works as intended and that as few bugs as possible reach users.

This is not someone who "just clicks buttons". A good QA engineer **thinks like a user and like an attacker at the same time**: they test not only the main flow but also odd, edge-case and incorrect actions. Even more importantly, they get involved early so bugs are prevented, not only caught at the end.

## Manual versus automated testing

| | Manual QA | QA Automation |
|---|---|---|
| **How checks are done** | You walk through scenarios in the product yourself | You write code that walks through them |
| **Strengths** | New features, usability, unusual scenarios | Regression, repetitive checks, large volumes |
| **What you need** | Test design techniques, bug trackers, web basics | The same plus a programming language and a test framework |
| **Entry barrier** | Lower | Higher |

In practice the two complement each other. Many people start with manual testing and gradually move into automation.

A simple automated test in Playwright:

```javascript
import { test, expect } from "@playwright/test";

test("login page shows error for wrong password", async ({ page }) => {
  await page.goto("/login");
  await page.fill("#email", "user@example.com");
  await page.fill("#password", "wrong");
  await page.click("button[type=submit]");
  await expect(page.locator(".error")).toBeVisible();
});
```

## Daily responsibilities

- **Reviewing requirements**: spotting contradictions and gaps before development starts.
- **Test design**: writing test cases and checklists that define what to check and how.
- **Testing new features** across devices and browsers.
- **Regression testing**: making sure new changes did not break existing behavior.
- **Writing bug reports** and verifying fixes.
- **API testing**: checking server requests and responses, for example in Postman.
- **Taking part in planning and retrospectives** with the team.

## How to write a good bug report

The bug report is the core QA tool. A developer should understand the problem without follow-up questions:

- **Title**: what is broken and where.
- **Steps to reproduce**: numbered and precise.
- **Expected result** and **actual result**.
- **Environment**: device, browser, app version.
- **Attachments**: screenshot, video, logs.

Keep one problem per bug report. When several bugs are bundled into one report, they are harder to track and harder to verify once fixed.

## Career paths inside QA

- **Junior → Middle → Senior QA**: from running prepared test cases to designing a project's whole testing approach.
- **QA Automation**: automated tests and integrating checks into CI/CD.
- **Specializations**: performance, security or mobile testing.
- **QA Lead**: organizing the quality process and leading a testing team.
- **Moving to neighboring roles**: development, business analysis, project management.

## Why QA is a common entry point into IT

- **A lower technical barrier** for manual testing: you can start without deep programming.
- **You see the whole product**: QA works with requirements, design, frontend and backend.
- **Team experience** and an inside view of how software is built.
- **A natural path** into automation and development for those who want to write code.

Keep in mind that the lower barrier means junior manual-testing roles can be highly competitive. Knowing the basics of SQL, APIs and some programming makes a candidate stand out.

## FAQ

### Does a QA engineer need to know how to program?

Not necessarily for manual testing, though a basic understanding of code, SQL and HTTP helps a lot. For automation, programming is the core skill.

### What is the difference between QA and a tester?

In everyday speech the terms are often used interchangeably. Strictly speaking, testing is checking the product, while QA is broader: it is about improving the process so bugs are prevented.

### What should I learn to start a career in QA?

Testing fundamentals and test design techniques, working with a bug tracker, web and HTTP basics, API testing and basic SQL. Then practice on real websites and apps and collect sample test cases and bug reports into a portfolio.
