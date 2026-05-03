---
title: How spaced review works
slug: how-spaced-review-works
topic: how-strive-teaches
summary: Strive extracts atomic ideas from each lesson into small retrieval-practice cards and resurfaces them on a Leitner schedule. Here's why and how.
tags: [spaced-review, retrieval-practice, leitner, mastery]
order: 10
updated: 2026-05-02
related: [why-retrieval-practice-works, how-mastery-is-measured]
---

Reading a lesson once is not the same as remembering it. Cognitive scientists have known this for over a hundred years — material decays from memory unless you retrieve it, and retrieval gets harder the longer you wait. Strive's spaced-review queue is built around this reality.

## What the queue is

When a lesson is generated, Strive automatically extracts a handful of *insight cards* — small, atomic facts or relationships from that lesson, framed as a question on the front and an answer on the back. The cards land in your Insights queue and start showing up daily for retrieval practice.

Each morning, the queue surfaces a small number of due cards. You see the question, try to answer from memory, then reveal the answer and rate how confident you were:

- **Again** — you didn't know it. The card resets to its earliest interval.
- **Hard** — you got it but it was a struggle. The interval grows slowly.
- **Good** — you got it cleanly. The interval grows on the standard schedule.
- **Easy** — trivial. The interval grows quickly and the card may be flagged as mastered.

## Why this works (and re-reading doesn't)

Three things drive the design:

**The testing effect.** Pulling an answer out of your head builds memory more strongly than reading the same content again. This is one of the most replicated findings in cognitive psychology. Studying *as if* you're being tested moves material into long-term storage faster than passive review.

**Spacing.** A card you reviewed yesterday is easier to recall than one from a week ago — and *that's the point*. Successfully retrieving an item just before you would have forgotten it strengthens it more than retrieving it while it's still easy. Strive's intervals (currently 1d, 3d, 7d, 14d, 30d) put cards back in front of you near the edge of your forgetting curve.

**Atomicity.** Cards are small. One idea per card. This sounds trivial but is the difference between flashcards that work and flashcards that don't. A card that asks "explain how transformers work" is too big to retrieve cleanly; a card that asks "what does the attention mechanism multiply by what?" is the right size.

## Where cards come from

You don't write cards. Strive's content pipeline writes them automatically as lessons are generated. The cards are paraphrases, not direct copies of the lesson — paraphrasing forces you to think semantically rather than match surface form.

You can review your full insight queue on the Insights page from the navbar.

## What's coming next

The current scheduler is Leitner-based — a fixed interval ladder per card. We're working on a more sophisticated scheduler (FSRS) that models your memory of each card individually and adapts intervals to your actual forgetting rate. The Leitner schedule already works well; FSRS will tune it tighter.
