---
title: How to Build an AI Voice Agent for Phone Calls
description: What an AI voice agent is made of: the ASR-LLM-TTS pipeline, telephony integration, latency budget, interruption handling and handoff to a human.
summary: A voice agent is a "speech recognition → LLM → speech synthesis" pipeline connected to telephony via SIP or a cloud PBX; success depends on low latency, correct interruption handling and clear rules for handing off to a human.
---

## How a voice agent works

An AI voice agent is not a single model but a **three-stage pipeline** running in streaming mode:

1. **ASR** (speech-to-text) turns the caller's speech into text.
2. **LLM** understands the request, calls the right functions (check an order, book an appointment) and writes a reply.
3. **TTS** (text-to-speech) speaks the reply.

Around the pipeline sit **telephony** (how the call reaches the agent), **VAD** (detecting when a person starts or stops speaking), **tools** (your CRM, scheduling and order APIs) and **logging**.

There are also speech-to-speech models that take and return audio directly. They react faster but are harder to control. The classic pipeline is easier to debug and lets you swap individual stages.

## Connecting to telephony

Main options:

- **SIP trunk** from your carrier or cloud PBX → media server (for example Asterisk or FreeSWITCH) → audio stream to the agent.
- **Cloud voice platforms** that deliver call audio over WebSocket.
- **Ready-made voice agent platforms** with built-in telephony, where you configure the logic.

Note that phone audio is usually narrowband (8 kHz). Test ASR and VAD on exactly that kind of audio.

## The latency budget

People notice pauses in conversation very quickly. So latency is broken down by stage and each stage is optimized:

| Stage | What affects it | How to speed it up |
|---|---|---|
| End-of-utterance detection | VAD settings | Tune the silence threshold, not too long |
| ASR | Streaming vs batch | Use streaming recognition |
| LLM | Model size, prompt length | Fast model, short context, token streaming |
| TTS | Time to first audio | Streaming synthesis, speak sentence by sentence |
| Network | Server location | Keep services close to each other and to telephony |

The key technique is **streaming at every stage**: TTS starts speaking the first sentence while the LLM is still writing the second. For slow operations (database lookup) the agent can say a short filler phrase.

## Interruptions (barge-in)

Callers interrupt, and that is normal. The agent must:

- **stop TTS playback immediately** when VAD hears the caller;
- **record in context** that its reply was cut off and how much was actually heard;
- **ignore noise**: coughs, "uh-huh", background voices. Tune VAD sensitivity and minimum speech duration for this.

Without proper interruption handling, the agent talks over the caller and the conversation falls apart quickly.

## When to hand off to a human

Write explicit rules instead of relying on the model:

- the caller directly asks for an operator;
- the agent failed to understand several times in a row;
- the topic is out of scope: complaints, legal questions, conflict;
- sensitive operations: refunds, changes to payment details;
- ASR confidence is low because of noise or language.

On handoff, pass the operator a **short summary** and the data the agent collected, so the caller does not have to repeat everything.

## Launch sequence

1. Pick **one narrow scenario**: appointment booking, order status, delivery confirmation.
2. Describe the dialog, functions and handoff rules.
3. Build a prototype and run it on recorded and live test calls.
4. Launch on part of the traffic, listen to recordings, adjust prompts and thresholds.
5. Add scenarios only after the first one is stable.

Remember to tell callers they are talking to an AI and follow the rules for storing call recordings.

## FAQ

### Which model does a voice agent need?

Any LLM with fast responses and function calling will do. For voice, speed often matters more than maximum intelligence: short answers and a quick first reply beat perfect wording.

### Can the agent speak Uzbek and Russian?

Yes, if ASR and TTS support both languages and the LLM is instructed to reply in the caller's language. Check the quality of Uzbek recognition and synthesis on real calls before launch.

### How is a voice agent different from IVR?

IVR guides the caller through a rigid menu of buttons or keywords. A voice agent understands free speech, asks clarifying questions and performs actions in your systems.
