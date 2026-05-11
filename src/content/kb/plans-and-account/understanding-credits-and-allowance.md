---
title: Understanding credits and allowance
slug: understanding-credits-and-allowance
topic: plans-and-account
summary: Strive runs on a metered allowance — every plan grants the same features, only the size of the monthly allowance differs. Here's how it works.
tags: [billing, credits, allowance, plans]
order: 10
updated: 2026-05-02
related: [running-out-of-allowance]
---

Strive is consumption-based, not feature-tiered. Every plan — Free, Starter, Pro, Studio — gives you full access to course creation, lesson generation, module quizzes, audio narration, and code execution. The only thing that changes between tiers is the size of your monthly allowance.

## The plan ladder

| Plan | Monthly price | Annual-equivalent monthly | Monthly allowance |
| --- | --- | --- | --- |
| Free | $0 | — | One unit / month |
| Starter | $12.99 | $10.39 | Five units / month |
| Pro | $24.99 | $19.99 | Twelve units / month |
| Studio | $49.99 | $39.99 | Thirty units / month |

A "unit" is a fixed quantity of generation calibrated against real provider cost. In practice, **one unit covers roughly four to five typical lesson generations**, with headroom for the cheaper one-off steps (clarifying questions, course structure, module quizzes). A course structure is cheap — usually a small fraction of a unit. Heavy actions (very long lessons, narration of long lessons, structural revisions in the design chat) consume more.

## Two balances

Allowance is split into two buckets:

- **Monthly allowance.** Granted on signup, refreshed on every subscription renewal, and reset to your plan's monthly grant at the start of each thirty-day period. Unspent allowance does *not* roll over.
- **Top-up allowance.** Bought any time in whole-dollar amounts between $5 and $500. Never expires and never resets.

When a paid action runs, monthly allowance is spent first; top-up is only touched once the monthly bucket is empty. Your billing surface shows whichever bucket is currently being spent — one number at a time, even though two are tracked.

## What costs allowance

Anything that calls an AI model:

- Building a new course (small — a course structure is usually under a quarter of one unit)
- Generating a lesson (the main cost — a typical lesson runs about a fifth of one unit, longer or denser lessons more)
- Running a module quiz generation
- Regenerating a hero image
- Synthesizing audio narration for a lesson

Reading, reviewing recall cards, taking already-generated quizzes, taking notes, and changing settings cost nothing.

## How charges actually settle

When you start a paid action, Strive checks that you have *any* remaining allowance — that's the gate; you don't need a full unit to start. The actual cost depends on how many tokens the model used during the job, and is computed and debited at the *end* of the job, not at the start. If a job fails or is cancelled, you're not charged at all; Strive absorbs whatever cost it incurred before the failure.

Occasionally the actual cost slightly exceeds your remaining balance. When that happens, Strive clamps the debit at your balance and absorbs the difference — you never get an overage charge or a mid-job abort. It's a deliberate, bounded design choice that keeps the rule simple: *if you have any allowance, you can run the action*.

## Where to see it all

The Billing tab on your profile shows your current plan, your allowance bar, your top-up balance in dollar-equivalent, your renewal date, and a recent-activity ledger of every credit event. The ledger uses human-readable reasons — "Lesson generation: Module 3 / Lesson 2", "Plan upgrade bonus", "Period reset", "Top-up purchase" — rather than raw credit numbers, so you can see exactly where your allowance went.
