---
title: Live Coding Interview: How to Solve Problems Under Pressure
description: A step-by-step approach to live coding interviews: clarify the problem, think out loud, start with a simple solution, test your code and practice beforehand.
summary: In a live coding interview, first clarify the problem and examples, narrate your reasoning, write a simple working solution, test it on edge cases and only then optimize.
---
## The short answer: the main rule

Live coding is judged not only on the final code but on **the process**: how you understand the problem, reason, write and verify a solution. A perfect solution written in silence often scores lower than clear reasoning with a simple working version. So follow this order: **clarify, discuss the approach, write something simple, test, improve**.

## Step by step

### 1. Clarify the problem

Do not start coding right away. Restate the task in your own words and ask:

- What does the input look like? Can it be empty, very large, contain duplicates or negative numbers?
- What should be returned when there is no answer?
- What matters most: speed, memory or readability?
- Can the input be modified in place?

Walk through **one or two examples** by hand. This confirms you understood the task.

### 2. Think out loud

The interviewer cannot see your thoughts. Say out loud:

- which idea you are considering and why;
- its time and space complexity;
- where it might break.

If the interviewer gives a hint, that is not a failure; it is part of the conversation. Listen and use it.

### 3. Start with a simple solution

Name the **brute-force solution** even if it is slow: "I could check every pair, which is quadratic. I'll write that first, then speed it up." A simple working solution beats an unfinished optimal one. If time is short, ask whether to code the simple version or go straight to discussing optimization.

### 4. Write clean code

- Clear variable names instead of `a`, `b`, `tmp`.
- Small helper functions when the logic grows.
- Do not get stuck on syntax details: if you forget an exact method name, say so and move on.

### 5. Test it

Do not say "done" before checking. Trace the code by hand on an example, then on **edge cases**:

- empty input, a single element;
- identical elements;
- minimum and maximum values;
- the case with no valid answer.

Found a bug? Fix it calmly. Catching your own bug is a good signal for the interviewer.

### 6. Discuss improvements

State the complexity of your final solution and how it could be improved: a different data structure, sorting, two pointers, caching. Even if there is no time to implement it, the discussion shows your level.

## If you get stuck

- Go back to the example and solve it by hand; the algorithm often shows up in your own steps.
- Simplify the problem: solve a special case first.
- Say it directly: "I'm stuck here, I'm thinking in the direction of..." Silence is worse.
- If you panic, pause and reread the problem. That is fine.

## How to practice beforehand

- **Solve problems out loud**, even alone. The habit of narrating will not appear by itself in the interview.
- **Use a timer** to get used to time limits.
- **Code without autocomplete** sometimes: some interview platforms do not have it.
- **Run mock interviews** with a friend, taking turns as candidate and interviewer.
- **Review common patterns**: hash maps, two pointers, sliding window, tree and graph traversal, recursion, basic dynamic programming.
- **Study other solutions** after your own attempts to see different approaches.

## Common mistakes

- Coding before understanding the problem.
- Staying silent for minutes at a time.
- Chasing the optimal solution and ending with nothing that works.
- Declaring "done" without testing.
- Arguing with hints instead of thinking them through.

## FAQ

### Can I use documentation during live coding?

It depends on the company, so just ask at the start. Checking syntax or a method name is often allowed and perfectly normal: they are testing your thinking, not your memory.

### Which language should I use?

The one you know best, unless the company requires a specific one. A familiar language lowers stress and lets you focus on the algorithm.

### What if I do not finish in time?

Explain what is left and how you would complete it. A clear plan and a partly working solution with good reasoning are often valued more than you might expect.
