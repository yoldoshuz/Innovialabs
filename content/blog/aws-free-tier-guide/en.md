---
title: AWS Free Tier: What Is Free and How to Avoid Surprise Bills
description: What the AWS Free Tier actually covers, which services quietly add charges and how to set up budgets and billing alerts from the very first day.
summary: The AWS Free Tier covers limited usage of specific services, not your whole account: anything beyond the limits and many supporting resources are billed. The fix is simple — a budget with alerts on day one and a regular look at the Billing console.
---

## What the Free Tier really is

The **AWS Free Tier** is a set of limits on specific services, not a free account. If a resource is not part of the program, or you exceed its limit, you pay the standard rate and the charge goes to your card.

There are several kinds of offers:

- **Always Free** — permanent monthly allowances for some services (for example, a number of Lambda invocations or some DynamoDB capacity). They apply as long as you stay within the limit.
- **Short-term trials** — free use of a particular service for a limited period after you first start it.
- **Credits and starter plans** — the terms for new accounts have changed: recent accounts receive starter credits and choose between a free and a paid plan, while older accounts have offers that last 12 months from sign-up.

Limits and durations change, so check the official [AWS Free Tier](https://aws.amazon.com/free/) page before you launch anything.

## What quietly turns into a bill

Money usually leaks not through the main server but through everything around it:

| Resource | Why it costs money |
|---|---|
| **Public IPv4 addresses** | AWS charges hourly for public IPv4 addresses, including idle Elastic IPs |
| **NAT Gateway** | Hourly fee plus a fee per gigabyte processed |
| **Load Balancer** | Hourly fee even with almost no traffic |
| **EBS volumes and snapshots** | They stay and keep billing after the instance is gone |
| **Outbound traffic** | Data transfer to the internet beyond the free amount |
| **RDS** | Multi-AZ, larger instance classes and storage above the limit |
| **CloudWatch Logs** | Logs kept forever grow month after month |
| **Secrets Manager, KMS, Route 53** | Monthly fee per secret, key or hosted zone |

Another trap is **other regions**. A resource created by mistake in a different region is easy to miss when you glance at the console.

## Protection from day one, step by step

1. **Lock down the root user.** Turn on MFA and stop using root for daily work: create a user through IAM Identity Center or IAM.
2. **Turn on Free Tier alerts.** In Billing → Billing preferences, enable emails when you approach the limits.
3. **Create a budget in AWS Budgets.** The ready-made **Zero spend budget** template emails you as soon as any spending appears. For real projects, create a monthly budget with thresholds on actual and forecasted cost.
4. **Enable Cost Anomaly Detection.** It compares spending with your usual pattern and flags spikes.
5. **Open Cost Explorer weekly** and group costs by service and region.

You can also create a budget from the command line:

```bash
aws budgets create-budget \
  --account-id 111122223333 \
  --budget '{"BudgetName":"monthly-limit","BudgetLimit":{"Amount":"10","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
  --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":80,"ThresholdType":"PERCENTAGE"},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"you@example.com"}]}]'
```

Replace the amount and email with your own. Keep in mind that **a budget warns you but does not shut anything down**. For an automatic response, set up Budget actions — for example, apply a restrictive IAM policy or stop selected EC2 and RDS instances.

## Common mistakes

- Launching a bigger instance "so it is not slow" — it may fall outside the free offers.
- Terminating an instance but leaving its volume, snapshots and Elastic IP behind.
- Keeping logs with no retention period.
- Adding a NAT Gateway to a learning project where a public subnet would do.
- Checking costs once a month, after the bill is already final.

## FAQ

### Will AWS stop charging when the free limit runs out?

On a paid plan, no: anything above the limits is simply billed. On the free plan for new accounts you are not charged until you upgrade yourself, but after upgrading the normal rules apply. That is why a budget and alerts are needed either way.

### How do I find forgotten resources across all regions?

Use AWS Resource Explorer or Tag Editor — both list resources across regions. Also group costs by region in Cost Explorer: if spending shows up somewhere unexpected, that is where the resource lives.

### Can I learn AWS with no risk of charges at all?

You can bring the risk close to zero: the Zero spend budget template, MFA, deleting resources right after each experiment and checking snapshots, volumes and IP addresses. For one-off experiments, describing infrastructure as code makes it easy to tear everything down with a single command.
