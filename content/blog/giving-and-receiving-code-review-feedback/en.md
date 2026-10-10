---
title: How to Give and Receive Code Review Feedback Professionally
description: The communication side of code review: tone and framing of comments, separating ego from code, handling remarks and resolving disagreements in a team.
summary: Comment on the code, not the person, explain the reason and label how important each remark is; when receiving feedback, separate yourself from the code, ask about anything unclear and take long debates to a call or to team conventions.
---
## The gist in two paragraphs

Code review is not an exam. It is how a team **keeps code quality up together and shares knowledge**. A technically correct comment written in a harsh tone works worse than a gentle one: the author starts defending instead of thinking about the solution.

Good feedback is **specific, explains the reason and shows how important the remark is**. Receiving feedback well means curiosity instead of defence.

## How to give feedback

**Comment on the code, not the author.** "You forgot error handling again" sounds like an accusation. "The request error is not handled here — if the API fails, the user sees an empty screen" describes the problem and its consequence.

**Explain the why.** Without a reason, a remark looks like personal taste. With a reason, it becomes knowledge the author can apply next time.

**Label the importance.** Many teams use prefixes:

| Prefix | Meaning |
|---|---|
| **blocker** | Must be fixed before merging: a bug, vulnerability, data loss |
| **suggestion** | An improvement idea, at the author's discretion |
| **nit** | A minor detail: naming, formatting |
| **question** | I want to understand the decision; not a request for change |

**Ask when you are not sure.** "What happens if the list is empty?" invites a conversation and is often more useful than a statement.

**Offer an alternative.** Instead of "this is bad", show a short example:

```ts
// suggestion: extract to a constant so the value is not duplicated
const MAX_RETRIES = 3;
```

**Point out what is good.** A short "nice caching approach" is feedback too: it shows which practices are worth repeating.

**Do not turn review into style policing.** Anything a linter or formatter can check should be checked by tools, not people.

## How to receive feedback

- **Separate yourself from your code.** A remark about a function is not a verdict on you as a professional.
- **Assume good intent.** Text loses tone: a short comment usually signals haste, not irritation.
- **Clarify instead of defending.** "Can you explain which scenario worries you?" moves the discussion forward; "it works on my machine" does not.
- **Reply to every comment**: fixed, let us discuss, or why you kept it as is.
- **Say thanks** for problems found — it encourages careful reviews.

## How to resolve disagreements

1. **Separate facts from taste.** Bugs, performance and security are facts you can verify. Style and structure are often a matter of preference.
2. **Use arguments, not authority**: a test, an example, a link to documentation.
3. **Do not argue endlessly in comments.** If the thread drags on, switch to a short call and then record the outcome in the PR.
4. **Rely on team agreements**: the style guide, architecture decisions, established approaches.
5. **If you still cannot agree**, bring in a third person — the team lead or module owner — and accept their decision.
6. **Turn recurring debates into rules** so the same topic does not come up in every PR.

## Common mistakes

- Sarcasm and loaded words: "obviously", "just", "why would you do this".
- A hundred small remarks without importance labels — the author cannot tell what is critical.
- Reviews that block a PR for days without a response.
- Silently accepting every remark, even when you disagree.

## FAQ

### How do I review code from a more experienced colleague?

The same way as anyone else's: ask questions, point out risks and unclear parts. A fresh view is valuable, and asking "why this approach?" is a good way to learn.

### What if a reviewer writes harshly?

Focus on the substance of the remark, and talk about tone separately and privately, describing how the comment reads rather than accusing. If it is a recurring problem, raise it with the team lead.

### Do I have to fix every nit?

Not necessarily. A nit is a suggestion left to the author. But if the fix takes a minute, it is often simpler to make it and close the discussion.
