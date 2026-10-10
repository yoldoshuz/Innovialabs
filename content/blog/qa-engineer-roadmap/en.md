---
title: QA Engineer Roadmap: From Manual Testing to Automation
description: A plan for aspiring QA engineers: manual testing fundamentals, test documentation, APIs and SQL, then programming, automation frameworks and CI.
summary: Start with manual testing: theory, test cases, bug reports, DevTools, APIs and SQL; then learn one programming language, an automation framework and running tests in CI, building a portfolio at every stage.
---

## The short route

A QA engineer's path splits neatly into two parts:

1. **Manual testing** — knowing what to check and how.
2. **Automation** — turning those checks into code that runs on its own.

Skipping the first part to "go straight into automation" is a common mistake. An automated test is only useful if you know **which scenario** deserves automation and **what** counts as a bug.

## Part 1. Manual testing

### Theory

- The purpose of testing and the difference between **verification** and **validation**.
- Types of testing: functional, regression, smoke, UI, usability.
- Test design techniques: **equivalence partitioning**, **boundary values**, decision tables, state transitions.
- The bug life cycle, from creation to closure.

### Documentation

- **Checklists** for quick checks.
- **Test cases**: steps, expected result, preconditions.
- **Bug reports**: title, steps to reproduce, actual and expected result, environment, screenshot or video.

A good bug report can be reproduced without asking its author a single question.

### Technical skills

- **DevTools**: console, Network tab, inspecting requests and responses.
- **API testing** with Postman or similar tools: methods, status codes, response body checks.
- Basic **SQL** to confirm that data was actually saved.
- **Mobile testing** basics: screen sizes, orientation, interruptions.

**Checkpoint:** you can take any public web app, write a checklist for it and find real defects with clear bug reports.

## Part 2. The road to automation

### Step 1. Programming basics

Pick the language used for test automation at the companies you are interested in; Python, JavaScript/TypeScript and Java are common choices. Learn variables, conditions, loops, functions, classes, exception handling and Git.

### Step 2. A test framework

- Your language's **test runner** (for example pytest, Jest or JUnit).
- **UI automation**: Playwright, Cypress or Selenium.
- **API tests**: an HTTP client plus response assertions.
- The **Page Object** pattern and reusable fixtures.

```python
def test_login_shows_error_for_wrong_password(page):
    page.goto("https://example.com/login")
    page.fill("#email", "user@example.com")
    page.fill("#password", "wrong")
    page.click("button[type=submit]")
    assert page.locator(".error").is_visible()
```

### Step 3. CI

- Running automated tests on every pull request.
- Test run reports.
- Fighting **flaky tests**: explicit waits instead of sleeps, independent test data.

**Checkpoint:** tests run in CI without you, and a failure points to a real problem.

## What to automate first

| Good candidate | Poor candidate |
|---|---|
| Regular regression runs | A feature that changes every week |
| Critical flows: login, payment, checkout | A one-off check |
| API checks with many input combinations | Judging usability and visual appeal |

## Portfolio plan

1. **Manual project:** a checklist, 10-15 test cases and several bug reports for an open web app.
2. **API project:** a request collection for a public API with response checks.
3. **Automation project:** UI and API tests in a GitHub repository with a README on how to run them.
4. **CI:** those tests running automatically on every push.

Practice on training sandboxes and demo apps built for testing practice, not on other people's production services without permission.

Add a short description to every project: what you tested, which techniques you used and which defects you found. For an employer, your reasoning matters as much as the code itself.

## FAQ

### Does a QA engineer need to know how to code?

Deep programming skills are not required to start in manual testing, but basic coding speeds up your growth. For automation, programming becomes the main tool.

### How long should I stay in manual testing before automation?

There is no fixed timeline. Move on once you write solid test cases and clear bug reports and understand how web apps and APIs work.

### Which automation framework should I pick?

Check job listings at the companies you care about and pick the most frequent one. The principles — locators, waits, fixtures, reports — carry over between frameworks.
