---
title: How to Connect a Telegram Bot to amoCRM or Bitrix24
description: Two ways to link a Telegram bot with amoCRM or Bitrix24: native connectors and the API. How to map fields, pass the lead source and avoid duplicate deals.
summary: If managers need to chat with customers from inside the CRM, connect the bot via the built-in Telegram channel in amoCRM or Bitrix24 Open Channels; if you need structured leads from a bot scenario, send them via the API after looking up the contact by phone or Telegram ID.
---
## The short answer

There are two paths, and they solve different problems:

- **Native connector.** In amoCRM the bot is connected as a chat channel; in Bitrix24 through **Open Channels**. Customer messages land in the CRM and managers reply from the record. Good when the bot is mainly a communication channel.
- **API integration.** Your bot walks the customer through a scenario, collects the answers and creates the contact and deal or lead with the right fields itself. Good when the bot qualifies leads.

They are often combined: the bot scenario creates a deal via the API, and further conversation goes through the connector.

## Comparing the approaches

| | Connector | API |
|---|---|---|
| Setup | Configured in the CRM interface | Needs code and a server |
| Chat inside the CRM | Yes, out of the box | Only if you build it |
| Custom fields and logic | Minimal | Full control |
| Scenario-driven bot | Limited | Yes |
| Duplicate control | CRM rules | Your logic |

Important: usually you cannot attach both a connector and your own update handler to the same bot. Telegram delivers updates to a single receiver, either a webhook or long polling. If you need both a scenario and chat in the CRM, plan the architecture upfront: for example, your server receives every update and forwards messages to the CRM through its chat API.

## Sending a lead via the API

**amoCRM.** Use REST API v4. For leads, `POST /api/v4/leads/complex` is convenient: one request creates a deal with a contact and tags. Authorization is via an OAuth integration or a long-lived token.

```json
[
  {
    "name": "Telegram lead",
    "_embedded": {
      "contacts": [
        {
          "first_name": "Aziz",
          "custom_fields_values": [
            {
              "field_code": "PHONE",
              "values": [{ "value": "+998901234567", "enum_code": "WORK" }]
            }
          ]
        }
      ],
      "tags": [{ "name": "telegram" }]
    }
  }
]
```

**Bitrix24.** The easiest start is an **inbound webhook** with CRM permissions. A lead is created with `crm.lead.add`, a deal with a contact via `crm.contact.add` and `crm.deal.add`. To find existing customers, use `crm.duplicate.findbycomm`, which searches by phone or email.

## Field mapping

Before writing code, make a table: what the bot asks and where it goes in the CRM.

- **Name**: from the user's answer, not only the Telegram profile, which often holds a nickname.
- **Phone**: via the "Share contact" button, in a single format such as `+998...`.
- **Telegram ID and username**: in dedicated custom contact fields. The ID lets you find the customer even without a phone.
- **Answers**: into deal fields (budget, service, timeline), not as one blob in a note. Otherwise you cannot filter by them.
- **Source and UTM**: from the deep link `start` parameter (`t.me/bot?start=ads_spring`). Save it on first entry and pass it to the deal.
- **Pipeline and stage**: put bot leads into a dedicated stage or pipeline so managers see them right away.

Custom field IDs in amoCRM and field codes in Bitrix24 differ per account. Keep them in config, not in code.

## Avoiding duplicates

1. **Look up the contact before creating one**: by Telegram ID in your database, then by phone in the CRM.
2. **If found, attach** the new deal to the existing contact. If the customer already has an open deal, adding a note or task is usually better than a new deal.
3. **Store the mapping** `telegram_id → contact_id, deal_id` on your side. It is faster than searching the CRM every time.
4. **Make submission idempotent**: a second tap on "Submit" or a retry after a timeout must not create a second deal. A request status in your database helps.
5. **Normalize phone numbers**: `90 123 45 67` and `+998901234567` are different strings to a CRM.

## Reliability

- Send data to the CRM through a queue: if the API is down or you hit the rate limit, the lead is not lost and goes out later.
- Log CRM responses with the IDs of created entities.
- Mirror important leads to the managers' work chat in case the integration fails.
- Refresh tokens ahead of time: amoCRM OAuth tokens have a limited lifetime.

## FAQ

### What should I choose if the bot already runs on my own server?

Most likely the API. A CRM connector usually takes over the bot's updates, and your logic stops receiving them. With the API you keep your scenario and send only the result to the CRM.

### Can I create a deal in Bitrix24 directly instead of a lead?

Yes. If leads are disabled in the portal or you use the simplified mode, create a contact and a deal. The choice depends on how your company handles incoming requests.

### Where should CRM access keys live?

In environment variables or a secrets store on the server. A Bitrix24 inbound webhook grants access to CRM data, so it must never sit in frontend code or a public repository.
