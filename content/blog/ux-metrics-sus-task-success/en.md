---
title: UX Metrics: SUS, Task Success and How to Measure UX
description: What SUS, task success rate, time on task, error rate and SEQ are, how to collect them and how to use them to compare design iterations reliably.
summary: Usability is measured with behavioral metrics (task success, time, errors) and perception metrics (SEQ after each task, SUS at the end of a session). You can compare iterations only when tasks, success criteria and participants stay comparable.
---

## The short answer

UX is measured with two groups of metrics:

- **behavioral**: what people did, whether they completed the task, how long it took and how many errors they made;
- **perception**: how they rated it, how easy the task felt (SEQ) and how usable the system feels overall (SUS).

Together they show what no single metric can: a user may finish a task but struggle, or finish quickly but with a mistake.

## The five core metrics

| Metric | What it shows | When to collect |
|---|---|---|
| Task success rate | share of successful attempts | per task |
| Time on task | how long a task takes | per task |
| Error rate | how often mistakes happen | per task |
| SEQ | perceived ease of a task | right after the task |
| SUS | overall perceived usability | end of the session |

## Task success

**Task success rate** = successful attempts / all attempts. Before testing, write down a **success criterion**, for example "order placed with the correct delivery address". Without one, moderators will score results inconsistently.

You can track partial success (completed with a hint), but agree in advance how it is scored and keep the same rule across iterations.

## Time on task

Measure from the start of the task to the moment the success criterion is met. Practical rules:

- focus on **successful** attempts, since failed ones distort the picture;
- task times are usually skewed to the right, so report the **median** rather than the mean;
- think-aloud sessions run longer, so compare only sessions in the same format.

## Error rate

First define what counts as an **error**: a wrong navigation click, an incorrectly filled field, submitting a form with invalid data. Then count either errors per task or the share of participants who made at least one error. The type matters as much as the count: group errors by cause and turn them into design tasks.

## SEQ: one question after each task

The **Single Ease Question** asks "Overall, how difficult or easy was this task to complete?" on a scale from 1 (very difficult) to 7 (very easy), right after each task. SEQ quickly shows which flows feel heavy even when people technically complete them.

## SUS: the overall questionnaire

The **System Usability Scale** has 10 statements answered from 1 to 5. Odd items are worded positively, even items negatively. Scoring:

- odd items: answer − 1;
- even items: 5 − answer;
- multiply the sum by 2.5 to get a score from 0 to 100.

```js
function sus(answers) { // array of 10 answers from 1 to 5
  const sum = answers.reduce((acc, a, i) =>
    acc + (i % 2 === 0 ? a - 1 : 5 - a), 0);
  return sum * 2.5;
}
```

A SUS score is **not a percentage**. Published research often cites roughly 68 as an average reference point, but the most reliable comparison is against your own previous measurements.

## How to compare iterations

1. **Same tasks and success criteria** for every version.
2. **Comparable participants** in experience and segment.
3. **Same test format**: moderated or unmoderated, same device.
4. **Look at variance.** On small samples a difference of a few points can be noise, so report confidence intervals or at least the range.
5. **Pair numbers with observation.** The metric tells you something got worse; session recordings tell you why.

## Common mistakes

- Rewording tasks between rounds.
- Averaging time across failed attempts.
- Presenting SUS as a "satisfaction percentage".
- Claiming significance from a handful of participants.

## FAQ

### How many participants do I need for UX metrics?

It depends on the goal. A small qualitative test is enough to find problems. To claim with confidence that one version beats another, you need a larger sample and confidence intervals.

### Can I collect these metrics without a moderator?

Yes. Unmoderated testing platforms record success, time and SEQ and SUS answers. Set up success criteria with extra care, because you cannot ask the participant to clarify.

### Which matters more, SUS or behavioral metrics?

They answer different questions. Behavioral metrics show exactly where the interface gets in the way, while SUS shows how the product is perceived overall. Use both.
