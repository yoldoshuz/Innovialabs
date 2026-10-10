---
title: Google Apps Script: Automating Google Sheets
description: Practical Google Apps Script for Sheets: custom functions, simple and installable triggers, sending emails from a sheet, fetching API data and quota limits.
summary: Apps Script is JavaScript that runs on Google servers next to your spreadsheet: it can add your own formulas, react to edits or a schedule, send emails and pull data from APIs, within daily quotas and a time limit per run.
---
## What Apps Script is

**Google Apps Script** is a JavaScript platform built into Google Workspace. Open a spreadsheet and go to **Extensions → Apps Script**: an editor appears with a project bound to that file. The code runs on Google servers, so nothing has to be installed and the script works even when your computer is off.

What it is good for:

- your own formulas that are missing in Sheets;
- actions on edit, on form submit or on a schedule;
- emails and notifications based on table data;
- loading data from external APIs into a sheet.

The main objects you will use are `SpreadsheetApp` (sheets and ranges), `MailApp` (email), `UrlFetchApp` (HTTP requests) and `PropertiesService` (settings and secrets).

## Custom functions

Any function you write can be called from a cell like a regular formula. The `@customfunction` tag adds it to autocomplete.

```javascript
/**
 * Returns the price with tax added.
 * @param {number} price Net price
 * @param {number} rate Tax rate, for example 0.15
 * @return {number}
 * @customfunction
 */
function WITH_TAX(price, rate) {
  if (Array.isArray(price)) {
    return price.map(row => row.map(p => p * (1 + rate)));
  }
  return price * (1 + rate);
}
```

In a cell: `=WITH_TAX(B2:B100, 0.15)`. Passing a whole range once is much faster than copying the formula into hundreds of cells.

Limitations: a custom function must finish quickly (around 30 seconds), and it **cannot use services that need authorization**, such as sending email. It only computes and returns a value.

## Triggers

**Simple triggers** are functions with reserved names: `onOpen(e)`, `onEdit(e)`. They work without setup, but they run briefly and cannot call services that need permission. Example: put a timestamp when column C changes on the Tasks sheet.

```javascript
function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Tasks' || e.range.getColumn() !== 3) return;
  sheet.getRange(e.range.getRow(), 4).setValue(new Date());
}
```

Note that `onEdit` fires on edits made by a person, not on changes made by other scripts or the API.

**Installable triggers** are created in the editor (Triggers → Add Trigger) or in code. They can run on a schedule, on form submit or on change, and they have the permissions of the user who created them.

```javascript
function createHourlyTrigger() {
  ScriptApp.newTrigger('loadRates').timeBased().everyHours(1).create();
}
```

Run such a function once, otherwise each run creates another trigger.

## Sending emails from a sheet

Sheet "Invoices": A email, B name, C amount, D status, E sent date. The script sends a reminder for every unpaid row that has not been sent yet:

```javascript
function sendReminders() {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Invoices');
  const data = sheet.getDataRange().getValues();
  const sent = data.map(row => [row[4]]);
  for (let i = 1; i < data.length; i++) {
    const [email, name, amount, status, sentAt] = data[i];
    if (status !== 'Unpaid' || sentAt) continue;
    MailApp.sendEmail(email, 'Payment reminder',
      `Hello ${name}, the invoice for ${amount} is still unpaid.`);
    sent[i][0] = new Date();
  }
  sheet.getRange(1, 5, sent.length, 1).setValues(sent);
}
```

The "sent date" column protects against duplicate emails if the script runs again. Test on your own address first.

## Fetching data from an API

```javascript
function loadRates() {
  const key = PropertiesService.getScriptProperties().getProperty('API_KEY');
  const res = UrlFetchApp.fetch('https://api.example.com/rates', {
    headers: { Authorization: `Bearer ${key}` },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error(res.getContentText());
  const rows = JSON.parse(res.getContentText()).items.map(r => [r.code, r.rate]);
  const sheet = SpreadsheetApp.getActive().getSheetByName('Rates');
  sheet.getRange('A2:B').clearContent();
  if (rows.length) sheet.getRange(2, 1, rows.length, 2).setValues(rows);
}
```

Keep keys in **Script Properties** (Project Settings), not in the code: anyone with edit access to the spreadsheet can open the script.

## Quotas and limits

Apps Script is free, but it has quotas. They differ between personal Google accounts and Workspace accounts and change over time, so check the official [quotas page](https://developers.google.com/apps-script/guides/services/quotas).

What to plan for:

- **Execution time per run** is limited (about six minutes). Process long jobs in chunks, save progress in `PropertiesService` and continue on the next trigger.
- **Daily limits** apply to email recipients, URL fetch calls and total trigger runtime. `MailApp.getRemainingDailyQuota()` shows how many emails are left.
- **Speed.** Read and write ranges in batches with `getValues()` and `setValues()`. Calling `getValue()` cell by cell in a loop is the most common reason scripts are slow.
- **Concurrency.** If two triggers can run at once, use `LockService` so they do not overwrite each other.

## FAQ

### Do I need to know JavaScript?

The basics are enough: variables, loops, arrays and objects. Most scripts follow the same pattern: read a range, process the array, write the result back.

### Why does the script ask for permissions on the first run?

Google shows which data the script will access, such as spreadsheets, email or external requests. Review the list carefully, especially for scripts copied from the internet.

### When is Apps Script no longer enough?

When runs regularly hit time limits, when data lives in several systems or when you need reliable error handling and logging. At that point a separate backend or an integration platform is usually the better option.
