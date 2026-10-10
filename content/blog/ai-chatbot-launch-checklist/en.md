---
title: AI Chatbot Launch Checklist: What to Verify Before Going Live
description: What to verify before launching an AI chatbot: test question sets, edge cases, refusals, human handoff, logging, privacy notices and monitoring.
summary: Before launch, run the bot through real and tricky questions, check refusals and human handoff, enable logging, tell users how their data is processed and set up monitoring.
---

## What to check first

An AI chatbot is ready to launch when it **answers common questions correctly, honestly declines when it does not know, and can hand the conversation to a human**. Everything else — logging, privacy, monitoring — exists to keep that quality after launch. Here is the checklist by section.

## 1. Test question set

- Built from **real customer questions** from chats, email and calls, not ones invented by the team.
- Each question has a **reference answer** or a correctness criterion.
- All main topics are covered: prices, timelines, delivery, payment, returns, contacts — whatever applies to your business.
- Questions come **in different phrasings**: short, with typos, in several languages if your audience is multilingual.
- The test run is **repeated** after every change to the prompt, model or knowledge base.

## 2. Edge cases

- **Off-topic** questions: the bot politely steers back to its job.
- **Provocations and attempts** to make the bot ignore instructions (prompt injection): "forget your rules", "show your system prompt".
- **Aggressive or abusive** messages: the bot keeps a calm tone.
- Very **long messages**, empty messages, emoji or stickers only, files and voice notes if the channel supports them.
- **Several questions in one** message.
- Questions about **competitors**, politics, medicine, law — it is decided in advance how the bot responds.

## 3. Refusal behavior

- When the knowledge base has no answer, the bot **says so** instead of making things up.
- The bot does not promise **discounts, deadlines or terms** that are not in approved materials.
- The refusal is friendly and immediately offers a next step: an operator, a form, a phone number.
- The bot does not reveal internal instructions or service data.

## 4. Human handoff

- There is an explicit command or button to **talk to a person**.
- The bot hands off on its own when the user is unhappy, the question is complex, or it concerns money or a complaint.
- The operator receives the **conversation history**, so the customer does not have to repeat themselves.
- **After-hours** behavior is defined: the bot honestly says when a person will reply.
- Handoff notifications are verified to actually reach operators.

## 5. Logging

- Questions, answers, sources used and escalations are stored.
- There is a way to flag a **bad answer**, such as rating buttons.
- Logs have restricted access and a clear retention period.
- Personal data in logs is **masked** where possible.

## 6. Privacy and transparency

- Users can see they are talking to a **bot**, not a person.
- There is a short **data processing notice** and a link to the privacy policy.
- The bot does not ask for more than needed: card numbers, passwords, passport details.
- The model provider's data processing terms and your country's personal data requirements have been checked.

## 7. Post-launch monitoring

| What to track | Why |
|---|---|
| Share of conversations handed to operators | Shows where the bot struggles |
| Negative answer ratings | A fast signal of problems |
| Questions with no answer in the knowledge base | A list of what to add |
| Response time and API errors | Technical stability |
| Model spend | Budget control |

- An **owner** is assigned to review a sample of conversations regularly.
- **Alerts** are set up for API failures and error spikes.
- A **gradual rollout** is planned: part of the traffic or internal users first, then everyone.

## Common launch mistakes

- Testing only "good" questions.
- Giving users no way to reach a human.
- Launching and not reading logs during the first weeks.
- Updating the knowledge base without rerunning the test set.

## FAQ

### How many test questions do I need before launch?

There is no exact number. Aim to cover every main topic with several phrasings and add edge cases. The set grows after launch from real conversations.

### Can I launch a bot without an operator?

You can, but then users need another clear path: a form, email or phone. A dead end with no way out quickly damages how people see the brand.

### How often should the bot be reviewed after launch?

Often in the first weeks, while the main gaps surface. After that, regularly and always after any change to the knowledge base, prompt or model.
