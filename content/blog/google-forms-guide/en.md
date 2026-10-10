---
title: Google Forms: How to Create Surveys and Collect Responses
description: Build a survey in Google Forms: question types, sections and branching, quizzes, response validation, linking to Google Sheets and email notifications.
summary: Create a form at forms.google.com, pick the right question types, add response validation and section branching, link a Google Sheet and turn on email notifications for new responses.
---
## The short answer

Google Forms is a free way to collect responses without a developer. The basic flow:

1. Open forms.google.com and start a blank form or a template.
2. Add questions of the right types and mark the required ones.
3. Split a long form into **sections** and set up branching.
4. Turn on **response validation** where format matters.
5. On the Responses tab, link a **Google Sheet** and enable notifications.
6. Click Send and share the link or the embed code.

## Question types

| Type | When to use |
|---|---|
| Short answer | Name, phone, email, short text |
| Paragraph | Feedback, detailed comments |
| Multiple choice | One option, all visible at once |
| Checkboxes | Several options can be selected |
| Dropdown | Long lists such as cities |
| Linear scale | A rating range, e.g. satisfaction |
| Grid | Rating several items on one scale |
| Date and time | Bookings, appointments, deadlines |
| File upload | CVs, photos, documents |

Note that **file upload** requires respondents to sign in to a Google account, and files are saved to the form owner's Drive.

## Sections and branching

Sections split a form into pages. Branching shows each person only the questions that apply:

1. Add sections with the Add section button.
2. On a Multiple choice or Dropdown question, open the three-dot menu and choose **Go to section based on answer**.
3. For each option, pick the section it leads to.

Example: "Are you already a customer?" Yes leads to a section about service quality, No leads to a section about how they found you.

## Quizzes

In Settings, turn on **Make this a quiz**. Then set an answer key and point value for each question, and optionally add feedback for right and wrong answers. Grades can be released right after submission or after manual review, which helps when you have open-ended questions.

## Response validation

Validation keeps junk out of your data. Open a question's three-dot menu and choose Response validation:

- **Number**: greater than, less than, between, for age or quantity.
- **Text**: contains, email, URL, for contact details.
- **Length**: minimum and maximum characters.
- **Regular expression**: for strict formats.
- For Checkboxes: select at least, at most or exactly N options.

A regular expression for an Uzbek phone number in the +998XXXXXXXXX format:

```text
^\+998\d{9}$
```

## Linking to Google Sheets

On the Responses tab, click **Link to Sheets**. Every new response appears as a timestamped row. Tips:

- do not edit the response columns; analyze them on a separate sheet with formulas;
- renaming a question in the form renames its column, which can break formulas that rely on the header.

## Email notifications

**Built-in:** Responses tab, three-dot menu, **Get email notifications for new responses**. The email goes to the form owner.

**Custom text or several recipients:** use Apps Script in the linked spreadsheet (Extensions, Apps Script):

```javascript
function notifyTeam(e) {
  const lines = Object.entries(e.namedValues)
    .map(([question, answer]) => question + ': ' + answer.join(', '));
  MailApp.sendEmail('team@example.com', 'New form response', lines.join('\n'));
}
```

Then under Triggers, add a trigger for `notifyTeam` with event source From spreadsheet and event type On form submit.

## Common mistakes

- A long form with no sections, so people quit halfway.
- No required contact fields, so there is nobody to follow up with.
- Collecting personal data without explaining why.
- Manual edits in the response sheet that later break reports.

## FAQ

### Can I limit each person to one response?

Yes, the Limit to 1 response setting does that. It requires respondents to sign in to a Google account, which may put off part of your audience.

### How do I embed a form on a website?

Click Send, choose the tab with the code icon and copy the iframe. You can paste it into any website builder or HTML page.

### Can I edit a form after responses start coming in?

Yes, existing responses are kept. A deleted question disappears from the summary, but its column stays in the sheet, so account for that in your analysis.
