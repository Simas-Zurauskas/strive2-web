---
title: Understanding your allowance
slug: understanding-your-allowance
topic: plans-and-account
summary: Strive runs on a metered allowance — every plan grants the same features, only the size of the monthly allowance differs. Here's how it works.
tags: [billing, allowance, plans]
order: 10
updated: 2026-05-12
related: [running-out-of-allowance]
---

Strive is consumption-based, not feature-tiered. Every plan — Free, Starter, Pro, Studio — gives you full access to course creation, lesson generation, module quizzes, audio narration, and code execution. The only thing that changes between tiers is the size of your monthly allowance.

## The plan ladder

| Plan | Monthly price | Annual-equivalent monthly | Roughly per month |
| --- | --- | --- | --- |
| Free | {{freeMonthlyUsd}} | — | {{lessonsPerFree}} |
| Starter | {{starterMonthlyUsd}} | {{starterAnnualMonthlyUsd}} | {{lessonsPerStarter}} |
| Pro | {{proMonthlyUsd}} | {{proAnnualMonthlyUsd}} | {{lessonsPerPro}} |
| Studio | {{studioMonthlyUsd}} | {{studioAnnualMonthlyUsd}} | {{lessonsPerStudio}} |

Lesson counts are estimates for a standard lesson. Optional enrichments — hero image, curated links, audio narration — draw a bit more from your allowance when enabled.

## Two balances

Your allowance is split into two buckets:

- **Monthly allowance.** Granted on signup, refreshed on every subscription renewal, and reset to your plan's monthly grant at the start of each {{freePeriodDays}} period. Unspent allowance does *not* roll over.
- **Top-up allowance.** Bought any time in whole-dollar amounts between {{topupMinUsd}} and {{topupMaxUsd}}. Never expires and never resets.

When a paid action runs, monthly allowance is spent first; top-up is only touched once the monthly bucket is empty. Your billing surface shows whichever bucket is currently being spent — one number at a time, even though two are tracked.

## What draws on your allowance

Anything that calls an AI model:

- Building a new course (small — a course structure is a fraction of a typical lesson's cost)
- Generating a lesson (the main draw)
- Running a module quiz generation
- Regenerating a hero image
- Synthesizing audio narration for a lesson

Reading, reviewing recall cards, taking already-generated quizzes, taking notes, and changing settings draw nothing.

## How charges actually settle

When you start a paid action, Strive checks that you have *any* remaining allowance — that's the gate; you don't need a full lesson's worth to start. The actual cost depends on how many tokens the model used during the job, and is computed and debited at the *end* of the job, not at the start. If a job fails or is cancelled, you're not charged at all; Strive absorbs whatever cost it incurred before the failure.

Occasionally the actual cost slightly exceeds your remaining balance. When that happens, Strive clamps the debit at your balance and absorbs the difference — you never get an overage charge or a mid-job abort. It's a deliberate, bounded design choice that keeps the rule simple: *if you have any allowance, you can run the action*.

## Where to see it all

The Billing tab on your profile shows your current plan, your allowance bar, your top-up balance in dollar-equivalent, your renewal date, and a recent-activity ledger. The ledger uses human-readable reasons — "Lesson generation: Module 3 / Lesson 2", "Plan upgrade bonus", "Period reset", "Top-up purchase" — so you can see exactly where your allowance went.
