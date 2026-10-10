---
title: What Are UTM Tags and Why Every Ad Link Needs Them
description: The five UTM parameters explained, how Google Analytics 4 and Yandex Metrica read them, naming rules and what breaks in reports when links are untagged.
summary: UTM tags are parameters added to a link that tell analytics where a visit came from: source, medium, campaign, keyword and ad variant; without them paid traffic often shows up as direct or referral and you cannot tell which ad worked.
---
## Short answer

**UTM tags** are parameters added to the end of a link after a question mark. When someone opens the link, the analytics script on your site reads them and records where the visit came from.

```text
https://example.com/course?utm_source=instagram&utm_medium=paid_social&utm_campaign=autumn_intake&utm_content=video_a
```

The page is the same for the visitor. For analytics, though, this visit is no longer "somewhere from the internet" but "Instagram, paid social, autumn intake campaign, video A".

## The five parameters

| Parameter | Answers the question | Example values | Required |
|---|---|---|---|
| **utm_source** | Where exactly? | google, instagram, telegram, newsletter | Yes |
| **utm_medium** | What type of traffic? | cpc, paid_social, email, referral | Yes |
| **utm_campaign** | Which campaign? | autumn_intake, black_friday | Yes |
| **utm_term** | Which keyword or audience? | crm_development, lookalike_buyers | No |
| **utm_content** | Which ad or link variant? | video_a, banner_blue, header_button | No |

Source, medium and campaign are the base. **utm_term** is mostly used in search ads, **utm_content** helps compare creatives or several links inside one email.

## How analytics reads them

1. A person clicks a tagged link and lands on your page.
2. The analytics counter (Google Analytics 4, Yandex Metrica) reads the parameters from the URL.
3. The session, and the actions inside it such as a form submission, are attributed to that source, medium and campaign.

Where to look:

- **GA4:** Traffic acquisition report with dimensions like Session source / medium and Session campaign.
- **Yandex Metrica:** the UTM tags report in the Sources section.

Google Ads and Yandex Direct can also mark clicks automatically (Google Ads uses the gclid parameter). Auto-tagging works well within each vendor's own analytics, but explicit UTM tags keep the data readable in every system, including your CRM.

## What goes wrong without UTM tags

- **Paid traffic becomes "direct".** Apps and in-app browsers, messengers and email clients often do not pass the referring site. A click from a Telegram post or an Instagram story can look like someone typed your address manually.
- **Campaigns merge.** Even if the source is recognised, all Instagram campaigns end up in one line, and you cannot tell the autumn sale from the brand campaign.
- **Creatives cannot be compared.** Without utm_content you will not know which video or banner brought leads.
- **The CRM loses the source.** If the form does not save UTM values with the lead, you cannot connect sales to channels.

The result: budget decisions are made on incomplete data, and the channel that actually sells may get cut.

## Naming rules that keep reports clean

- **Use lowercase only.** Analytics treats `Instagram` and `instagram` as different values.
- **No spaces.** Use `_` or `-` consistently.
- **Agree on a dictionary.** Keep a shared table of allowed sources, mediums and campaign names, so the whole team tags the same way.
- **Use standard medium values** such as `cpc`, `email`, `paid_social`. GA4 assigns traffic to default channel groups based on these, and custom values may land in "Unassigned".
- **Do not tag internal links** between pages of your own site: the tag overwrites the original source of the visit.
- **Never put personal data** such as emails or phone numbers into UTM values.
- **Check the final link** before launch: open it and confirm the page loads and the visit appears in real-time reports.

Ad platforms support dynamic values, so you do not have to tag every ad manually. For example, Meta Ads can insert `{{campaign.name}}` and `{{ad.name}}`, and Yandex Direct can insert `{campaign_id}` and `{keyword}`.

## FAQ

### Do UTM tags affect SEO or page speed?

No noticeable effect on speed. For SEO, tagged URLs are usually handled through a canonical tag pointing to the clean page address, which most modern site builders and frameworks set up.

### Should I tag links in my own Telegram channel or Instagram bio?

Yes. These are exactly the places where the referrer is often lost. Tagging them lets you see how much traffic and how many leads your own channels bring.

### Can a user see or change UTM tags?

Yes, they are visible in the address bar and can be removed or edited. This rarely matters at scale, but it is another reason to never put sensitive data in them.
