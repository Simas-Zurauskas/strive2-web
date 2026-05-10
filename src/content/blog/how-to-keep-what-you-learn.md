---
title: "How to keep what you learn: a working spaced-repetition routine"
slug: how-to-keep-what-you-learn
summary: A 5-minute routine for keeping what you just learned, without setting up Anki, building 500 cards, or learning a scheduling algorithm. Just a calendar and a notebook.
category: guide
author: Simas Zurauskas
published: 2026-05-10
tags:
  - spaced repetition
  - learning routine
  - retrieval practice
  - study habits
---

There's a gap between *I just finished learning this* and *I can use this six months from now*. Most of what you learn falls into that gap. You read the book, you take the course, you finish the tutorial, and a few weeks later you'd struggle to explain it to a friend. The information was there. It just didn't take root.

Spaced repetition is the most reliable way to fix that. The research is unusually clean (we've known how it works since the 1880s), and the effect sizes are big enough to change careers. But almost everyone who hears about it bounces off, because the standard advice involves setting up Anki, learning FSRS, building hundreds of cards, and reviewing forever.

That bar is too high for 99% of people. Including me, half the time.

This post is the much lower bar. You don't need an app. You don't need an algorithm. You need a notebook, a calendar, and roughly 25 minutes spread across two weeks per topic. That's enough to capture most of the benefit. If you decide later you want to go deeper, the upgrade path is short.

## Why the standard advice fails

The textbook recommendation goes something like: install Anki, learn the keyboard shortcuts, study card-writing best practices, build a deck of 200–500 cards as you read, review every day for the rest of your life. This works — Anki is genuinely excellent — but it asks you to make three commitments simultaneously: a tool, a card-authoring habit, and a daily review habit. Most people break under one of those, and once one breaks the rest follow.

The deeper issue is that it's pitched as the *only* legitimate way. So when someone reads about spaced repetition, tries to do it properly, and stalls at "okay, now I have to learn the app," they conclude the whole approach isn't for them.

It is. You just don't need any of that scaffolding to start. You need the two ideas underneath.

## The two ideas that actually matter

There are exactly two things that have to be true for the material to stick: you have to attempt to *recall* it, and you have to do that more than once, on a *schedule*.

**Retrieval.** When you try to pull a fact out of your own head — and especially when you fail and then check — you encode it more durably than if you re-read it. Roediger and Karpicke's [2006 paper](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PPS.pdf) is the canonical demonstration: students who self-tested on a passage remembered substantially more days later than students who re-read the same passage, even when the re-readers spent more time. Dunlosky's [2013 review](https://journals.sagepub.com/doi/10.1177/1529100612453266) graded ten common study techniques. Re-reading and highlighting both got a D. Practice testing got an A. This is one of the most replicated findings in education research.

**Spacing.** Reviewing the same material across separated sessions beats massing all the practice into one go. Cepeda et al.'s [2008 study](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf) mapped the effect across thousands of trials and found the optimal gap is roughly 10–20% of how long you want to remember something. The good news is that the curve is forgiving. Any spacing beats none. Reviewing tomorrow, then next week, then two weeks later is well inside the zone where the effect is strong.

Together, these are doing 90% of the work in any spaced-repetition system. Everything else (algorithms, apps, custom decks) is optimisation on top.

## The minimal routine

Three steps. None of them require an app.

### 1. At the end of every learning session, write 3–5 questions in your own words

Not summaries. Questions. The phrasing matters more than people think.

A summary looks like: "Bayes' theorem updates a prior with evidence to produce a posterior."

A question looks like: "Given a prior probability and a likelihood, what does Bayes' theorem produce?"

The summary lets you nod along when you re-read it. The question forces you to *try* before you check, which is where the encoding happens. Three to five per session is enough — the friction of writing more than that is usually what kills the habit, not the reviewing itself.

Keep them somewhere you can find later. A dedicated notebook, a Notion page per topic, the back of the book. Format doesn't matter.

### 2. Schedule four reviews on your calendar: tomorrow, day 3, day 7, day 14

Block them as 5-minute slots. They are 5-minute slots. The whole point of these intervals is that they're short and almost cost nothing.

Use whatever calendar you already use. Title the event "Review: [topic]". You will be tempted to skip the calendar step and "just remember to review them." Don't. The calendar is the routine — without it you'll review the topic that's freshest in your mind and ignore the one from last week, which is exactly backwards.

If you want to be more rigorous later, push the intervals out: 1, 3, 7, 14, 30, 90 days. For now, four reviews over two weeks is enough to capture most of the benefit.

| When | Effort | Why |
| --- | --- | --- |
| Day 1 (tomorrow) | 5 minutes | Catches the steepest part of the forgetting curve |
| Day 3 | 5 minutes | First spaced repetition; consolidation begins |
| Day 7 | 5 minutes | Pushes the memory into the medium term |
| Day 14 | 5 minutes | Most of what survives this is durable |

### 3. At each review, try to answer your own questions before looking

This is the only step where most people cheat. It's tempting to flip straight to the answer because that *feels* more efficient. It isn't.

Sit with the question for ten or fifteen seconds. Try to recall the answer out loud or on paper. Then check.

Failure is good. When you can't remember, that's the moment your brain learns the most from the subsequent correction. Bjork calls this *desirable difficulty*. The fluent feeling of "yes, I know this" while skimming is precisely what doesn't transfer.

Keep a tiny tally next to each question: a tick for "got it," a dot for "didn't." Questions that keep getting dots are the ones to repeat at the next review. Questions that have three ticks in a row can be retired.

That's the whole routine.

## Three optional upgrades, in order of effort

Once the base routine becomes a habit (it might take a couple of topics before it does), these are the natural next steps. Don't try to adopt them all at once.

**Use a notes app that supports recurring tasks.** Things, Todoist, Linear, Apple Reminders, anything that lets you set a task to recur in 1, 3, 7, 14 days. This removes the calendar bookkeeping. The questions still live in your notebook; the reminders just nudge you on the right days.

**Mix subjects in one review session.** This is *interleaving*. If you're learning two or three things at once, alternate the questions between them rather than blocking them. It feels harder and slower, and it produces more durable knowledge. Brunmair & Richter's 2019 meta-analysis put the effect size around Hedges' g = 0.42 for category learning, which is a meaningful boost for a free change.

**Move to a real spaced-repetition app once you have 100+ cards.** At that scale, manual scheduling stops working — you'll need an algorithm. Anki, RemNote, and Mochi are all competent options with different trade-offs. Anki is the most powerful and least friendly; RemNote integrates with your notes; Mochi is the most pleasant to look at. Pick one, import your existing questions over a weekend, and let the scheduler take it from there.

Until you cross that threshold, an app is mostly overhead.

## Common failure modes

**You miss a week.** This is the most common one. Don't restart from scratch. That punishes consistency. Just pick up at the next interval and add one extra review at the end. If you've missed more than two weeks, treat the topic as new and rebuild your questions before reviewing.

**Your questions are too vague.** "What is Bayes' theorem?" is too broad to retrieve a specific answer for. If you find yourself answering "uh, the prior thing," your question is doing too much. Split it. Two or three more specific questions beat one fuzzy one.

**You're recognising the answer instead of recalling it.** If you only ever check the answer and nod, you're testing recognition, not memory. Force yourself to write or speak the answer first, even if it's wrong. The wrongness is informative.

**You're piling up questions without ever reviewing.** Capture and review are equally important. If you generate 30 questions a week and review none, you have a notebook, not a system. Cap yourself at 3–5 questions per session until the review habit is solid.

**It feels like it's not working.** It probably is. Retrieval feels harder than re-reading because it *is* harder, and that's why it works. The judgement of "I know this" while reading is famously decoupled from actual recall a week later. Trust the schedule, not the feeling.

## When this matters most

The routine is overkill for things you'll use every day at work — the work itself does the spaced retrieval for you. Where it pays off is the gap cases:

- **Career switches.** You're learning a new field while still working in the old one. There's no daily forcing function.
- **Exams and certifications.** You need durable recall on a deadline several months away.
- **Domain shifts at work.** A new framework, a new product area, a regulation you have to know but not use weekly.
- **Returning to study after a break.** You want to be the person who can actually use the course material, not the person who finished it.

In all of these, the gap between watching and remembering is where most of the dropout happens. A week of half-paid attention to your calendar fixes most of it.

## A note on Strive

Most of this post is the manual version. If you want it automated, Strive does the same thing in the background while you take a course — every lesson seeds 3–5 retrieval questions, scheduled at expanding intervals, surfaced in a finite daily queue. The point isn't that you have to use Strive. The routine above works on its own. We just got tired of doing it manually.

The smaller point: the techniques predate every app, including ours. If you take nothing else from this post, take the calendar entries.

---

*If you want to read deeper: Roediger & Karpicke's [2006 paper](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PPS.pdf) is short and clear on the testing effect. Dunlosky et al.'s [2013 review](https://journals.sagepub.com/doi/10.1177/1529100612453266) is the most cited summary of which study techniques actually work. Cepeda et al.'s [2008 spacing study](https://laplab.ucsd.edu/articles/Cepeda%20et%20al%202008_psychsci.pdf) is the cleanest demonstration that the gap between reviews is doing real work.*
