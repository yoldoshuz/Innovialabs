---
title: How Neural Networks Work: A Simple Explanation
description: Neurons, weights, training with backpropagation and overfitting explained with plain analogies and one small worked example with real numbers.
summary: A neural network is many simple functions with adjustable weights; training compares each answer with the correct one and nudges the weights so the error gets smaller.
---
## The idea in two paragraphs

A **neural network** is a function that turns input numbers (pixels, words, prices) into output numbers (a class, the next word, a forecast). Inside, it is made of many small units called **neurons**, each holding adjustable numbers called **weights**.

At first the weights are random and the network answers badly. **Training** means showing it many examples with correct answers and, after every mistake, slightly adjusting the weights. Nobody writes the rules by hand: the rules end up stored in the weights.

## What a single neuron does

A neuron takes several inputs, multiplies each by its weight, adds them up, adds a **bias** and passes the result through an **activation function**, a simple non-linear function that, for example, turns negative values into zero.

Analogy: you are deciding whether to take an umbrella. Inputs are cloud cover, the forecast and humidity. Weights are how much you trust each signal. If the total is above a threshold, you take the umbrella.

One neuron can do little. Stack many into **layers** (input, several hidden, output) and the network starts capturing complex patterns: early layers notice simple features, later layers combine them into more complex ones.

## How a network learns: a tiny example

Let the network be one neuron with no activation: `output = w × x`. We want it to learn to double a number, without telling it so.

1. Starting weight `w = 0.5`. Example: `x = 3`, correct answer `6`.
2. The network outputs `0.5 × 3 = 1.5`. Error: `1.5 − 6 = −4.5`.
3. We work out which way to move the weight. For squared error the slope is `2 × (−4.5) × 3 = −27`.
4. We take a small step against the slope with a **learning rate** of `0.01`: `w = 0.5 + 0.27 = 0.77`.
5. New output: `0.77 × 3 = 2.31`, already closer to 6.

Repeat this over thousands of examples and `w` approaches 2. A real network has millions of weights or more, and **backpropagation** is the method that efficiently computes this slope for every weight, moving from the output back to the input.

## Overfitting: when the network memorizes

**Overfitting** means the network does great on training examples but poorly on new ones. Like a student who memorized the exam answers without understanding the subject.

How to spot and fight it:

- **Hold-out data.** Keep part of the data away from training and measure quality on it. If training error falls while validation error rises, you are overfitting.
- **More and more varied data.** Harder to memorize, easier to learn the real pattern.
- **Early stopping.** Stop training when validation quality stops improving.
- **Regularization and dropout.** Techniques that stop the network from relying on random details.
- **A simpler model.** With little data, a huge network will almost certainly overfit.

## What this means for a business

- A neural network **does not know rules**; it reflects data. Poor or biased data gives a poor model.
- Quality must be checked **on new examples**, not on the ones used for training.
- Ready-made models (LLMs, image recognition) often already solve the task, so training your own from scratch is needed less often than it seems.

## FAQ

### Does a neural network think like a human brain?

No. The name comes from biology, but an artificial neuron is just a formula of multiplication and addition. The resemblance to the brain is mostly a metaphor.

### How much data is needed for training?

It depends on the task and the model. It is often better to take a pretrained model and fine-tune it on a small set of your own examples than to train from scratch.

### Why are neural network decisions hard to explain?

Knowledge is spread across a huge number of weights, and no single weight maps to a readable rule. There are interpretation methods, but they do not give full transparency.
