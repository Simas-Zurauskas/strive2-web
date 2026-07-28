---
title: How to study for an exam with AI without fooling yourself
slug: study-for-an-exam-with-ai
summary: AI explanations are unusually fluent, and fluency is exactly the cue we misread as knowing something. Here is the failure mode, the evidence behind it, and a protocol for using AI to prepare for a real exam on a real deadline.
category: learning-science
author: Simas Zurauskas
published: 2026-07-28
tags:
  - exam preparation
  - retrieval practice
  - spaced repetition
  - study techniques
  - ai learning
---

There is a specific and slightly humiliating experience available to anyone revising with an AI tutor. You ask it to explain something you find hard. It produces a clear, well-organised, patient explanation. You read it and feel the thing click. You move on, satisfied.

Three days later you cannot reproduce any of it.

Nothing malfunctioned. The explanation was good — that was the problem. This post is about why that happens, why AI makes it more likely rather than less, and what to do instead when there is an actual exam and an actual date.

## The feeling of understanding is not evidence of understanding

The relevant concept is **fluency**. When information is easy to process — well-structured, clearly written, logically ordered — our brains read that ease as a signal that we have learned it. The judgement is made automatically and it is systematically wrong.

Researchers have poked at this from many angles. Koriat and Bjork described an "[illusion of competence](https://pubmed.ncbi.nlm.nih.gov/15755238/)" in which learners' confidence during study bears little relation to later recall. The most-cited demonstration in practice is the re-reading literature: students who re-read consistently rate themselves as knowing the material better than students who tested themselves, and consistently remember less of it. I went through those studies in detail in [active recall vs re-reading](/blog/active-recall-vs-rereading).

Now consider what an AI explanation is optimised for. It is fluent by construction. It never rambles, never loses the thread, never says "hang on, let me start again". It restructures the material into exactly the shape that is easiest to follow.

Which is to say: **AI is an unusually efficient generator of the illusion of competence.** The tool is not broken. It is very good at the thing that produces the false signal.

There is a second, sharper version of the problem, which is that a model will occasionally be confidently wrong, and a fluent wrong explanation is much harder to catch than a confused wrong one. Under exam pressure you will not have the slack to notice.

## The one behaviour that separates the two outcomes

Everything below reduces to a single distinction:

> **Did the information move from the page into your head, or did it move from the page past your eyes?**

The only reliable test is to *try to produce it without looking*. Not recognise it. Not follow it. Produce it, from nothing, into a blank page or out loud to a wall.

This is uncomfortable, which is the point — Robert Bjork's framing of "[desirable difficulties](https://bjorklab.psych.ucla.edu/research/)" is that the conditions which make learning feel harder in the moment are frequently the ones that make it stick. Retrieval is effortful. The effort *is* the mechanism, not a cost you pay for it.

Dunlosky and colleagues' [2013 review](https://journals.sagepub.com/doi/10.1177/1529100612453266) assessed ten widely-recommended study techniques against the evidence. Eight came out low or moderate utility — including highlighting, summarisation, and re-reading, which is to say most of what people actually do. Two came out high: **practice testing** and **distributed practice**. That is the entire recipe, and it has been the entire recipe for a while.

## The protocol

The following assumes you have a syllabus and a date. It is written for a two-to-six week horizon, which is where most exam prep actually lives.

### Step 1 — Map the syllabus before you learn anything

Get the actual syllabus or past papers. Turn it into a list of topics, and mark each one honestly: *solid* / *shaky* / *never seen it*.

Do this before you touch any AI tool, because this is the one step where the tool's helpfulness works against you. An AI asked "what should I study for this exam" will produce a comprehensive, balanced, well-proportioned plan — and a balanced plan is wrong. You need a lopsided one, weighted to the things you cannot do.

### Step 2 — Ask for explanation, then immediately close it

Use the AI for what it is genuinely excellent at: explaining a specific confusion, at a level you choose, as many times as you need, without judgement. This is a real advantage over a textbook and it is worth a lot.

Then close the window and write down what it said. From memory. Badly.

The rule is: **never finish an explanation by feeling satisfied.** Finish it by producing something. The gap between what you just read and what you can write down thirty seconds later is the actual state of your knowledge, and it is always wider than it feels.

This is the generation effect and it is old, robust, and free.

### Step 3 — Make it ask you, not tell you

Flip the direction of the conversation. Rather than *"explain hypothesis testing"*, try:

> "Quiz me on hypothesis testing at the level of a second-year statistics exam. One question at a time. Do not give me the answer until I have committed to one. After I answer, tell me what my answer reveals about what I have misunderstood, then ask the next one."

The "one at a time" and "do not give me the answer" clauses matter enormously. Without them, models tend to produce a question and its answer in the same breath, which converts a retrieval exercise back into a reading exercise. You have to keep insisting.

Ask for a mix of question types. If everything you are being asked is a definition, you are being tested on the easiest possible thing.

### Step 4 — Get past recall onto synthesis

Exams above school level do not mostly ask you to define terms. They ask you to apply two ideas at once to a situation you have not seen.

So ask for that explicitly:

> "Give me a scenario question that requires combining [topic A] and [topic B]. Do not tell me which concepts it uses."

That last clause is doing the heavy lifting. Half of exam difficulty is *identifying which tool applies*, and a question that names the tool has removed the hard part. This is also the single best diagnostic of whether a study tool is any good: does it ever ask you something that spans two lessons without telling you it is doing so?

Karpicke and Blunt's [2011 study in *Science*](https://www.science.org/doi/10.1126/science.1199327) is the reference point — retrieval practice beat elaborate concept mapping not just on verbatim questions but on inferential ones, which is the category exams actually live in.

### Step 5 — Space it, and compress the schedule to fit the deadline

Spacing is the second high-utility technique, and it is the one people skip because it requires planning rather than effort.

The canonical intervals — 1, 3, 7, 14, 30 days — assume a horizon of a month or more. With a nearer exam, compress rather than abandon:

| Time until exam | Workable intervals |
| --- | --- |
| 4+ weeks | 1, 3, 7, 14, 30 days |
| 2 weeks | 1, 2, 4, 7, 11 days |
| 1 week | 1, 2, 3, 5 days |
| 3 days | Same day, next day, exam morning |

Even at three days, two spaced passes beat one long block containing the same total minutes. The [Cepeda meta-analysis](https://pubmed.ncbi.nlm.nih.gov/16719566/) found the effect across a very wide range of intervals; what changes with a short horizon is the size of the win, not its direction.

The practical failure here is administrative, not cognitive: keeping track of which of two hundred facts is due today is genuinely tedious, which is why people abandon it around day four. Any scheduler will do — paper, Anki, a spreadsheet. The [longer write-up on keeping what you learn](/blog/how-to-keep-what-you-learn) goes into how the queue actually behaves.

### Step 6 — Do one timed paper under real conditions

Not optional, and not the same as any of the above. A past paper, timed, no notes, no tool, in one sitting.

It tests the two things nothing else tests: whether you can retrieve *without a prompt*, and whether you can do it fast enough. Plenty of people who know the material fail on the second.

Do this at the two-thirds mark, not the day before. The point is to find out what is broken while there is still time to fix it.

## Four ways people fool themselves, ranked by how often I have watched it happen

1. **Asking for a summary and reading it.** Summarising is a low-utility technique when someone else does the summarising. If a summary is going to help, you have to write it.
2. **Confusing "I follow this" with "I could produce this".** Following is recognition. Exams are recall. These are different memory operations and the gap between them is enormous.
3. **Studying what is comfortable.** The topics you revisit are the ones that feel good to revisit, which are the ones you already know. This is why step 1 is a written, honest, lopsided list — it is the only defence.
4. **Treating the AI as an oracle rather than a study partner.** Check anything load-bearing against the actual syllabus or textbook. A fluent wrong answer is the worst possible failure mode, because it is indistinguishable from a fluent right one until you are being marked.

## The short version

Use AI for explanation, patience, and unlimited re-explanation at whatever level you need. That part is genuinely better than what students had before.

Then do the uncomfortable part yourself: close it, retrieve from nothing, get quizzed on things that span topics, and space the repetitions across days. All of the learning is in that second half. The first half only feels like it is.

---

*Strive builds courses this way on purpose — the curriculum is designed against your goal, and every lesson seeds recall cards that come back at 1, 3, 7, 14 and 30 days rather than leaving the scheduling to you. If you are revising for something with a date on it, [start with the syllabus](https://strive-learning.com) and tell it your deadline.*
