---
title: Why most courses don't stick — and what spaced retrieval does about it
slug: why-most-courses-dont-stick
summary: You finish a course feeling smart, then three weeks later most of it is gone. Here's what the research actually says about why that happens, and the design choice we built Strive around.
category: learning-science
author: Simas Zurauskas
published: 2026-05-10
tags:
  - spaced repetition
  - retrieval practice
  - forgetting curve
  - learning science
featured: true
---

You finish an online course on Tuesday. By the following Tuesday you can still talk about it. Three weeks later, you'd struggle to explain it to a friend without re-watching a lesson. Three months later, you remember the *vibe* of having learned it more than the content. Most of it is gone.

This is the most common learning failure mode online, and it has very little to do with your discipline, your interest, or the quality of the course. It's a cognitive default. And it's been measured, over and over, since 1885.

I'm going to lay out three things in this post:

1. What the research actually says about how memory fades.
2. Why most "courses" (including most AI-generated ones) make this worse, not better.
3. The single design choice that makes the difference, and why we built Strive around it.

## 1. The forgetting curve is real, and unkind

In 1885, Hermann Ebbinghaus published [*Über das Gedächtnis*](https://archive.org/details/berdasgedchtni00ebbi/page/n1/mode/2up), a study where he memorised lists of nonsense syllables, waited, and re-tested himself. The result became one of the most replicated findings in psychology: without intervention, you lose roughly half of what you've just learned within an hour, and 70–80% within a day. The curve flattens after that — but the floor is low.

The numbers vary a bit by content type. Meaningful prose decays slower than nonsense syllables. Skills decay slower than facts. Things you care about hang on longer than things you don't. But the *shape* (fast initial decay, slow asymptotic floor) is universal. ([Murre & Dros, 2015](https://doi.org/10.1371/journal.pone.0120644) replicated Ebbinghaus's original findings 130 years later, with the curves matching almost perfectly.)

This is not a personal failing. It's how memory works. The brain's default is to forget — that's the feature, not the bug. Without it you'd be drowning in trivia from age four.

The interesting question is what to do about it.

## 2. What most courses do — and why it doesn't help

The standard online-course shape is: video lectures, sometimes a quiz at the end of each module, a final assessment, a certificate. Most of the learner's time is spent **reading or watching** content.

Two findings from cognitive psychology should change how you feel about that:

**Re-reading is one of the least effective study techniques ever measured.**
A 2013 review by [Dunlosky et al.](https://journals.sagepub.com/doi/10.1177/1529100612453266) graded ten common study techniques on a A–D scale based on the experimental evidence. Re-reading scored a D. Highlighting scored a D. Summarisation scored a C. The technique that scored A (the one with the largest effect on long-term retention across the largest body of evidence) was **practice testing**. Trying to recall the material before seeing it again.

**Retrieval practice is roughly twice as effective as restudy.**
Roediger and Karpicke's [2006 paper](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PPS.pdf) is the canonical demonstration. Students studied a passage, then either re-read it or took a recall test on it. Days later, the group that *recalled* remembered substantially more than the group that *re-read*, even when the re-read group spent more time. A meta-analysis by [Adesope et al. (2017)](https://journals.sagepub.com/doi/abs/10.3102/0034654316689306) found mean effect sizes between Hedges' g = +0.51 and +0.93 across 118 studies. That's enormous in education research.

Put those together: the typical course has the learner *watching* when they should be *recalling*, and *reviewing once* when they should be *reviewing across spaced intervals*.

This isn't the course's fault, exactly — it's what learners ask for. Watching feels productive. Recalling feels like work. The mismatch between what feels effective and what *is* effective is one of the most studied phenomena in this field, and it has a name: **judgement of learning** is a poor predictor of actual learning ([Bjork & Bjork, 2011](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf)).

If you've ever closed a tab on a great article thinking "yes, I get it" and then couldn't summarise it the next morning — that gap is what they're measuring.

## 3. The single design choice that matters

When you boil this down, two things have to happen for course material to stick:

1. The learner has to **try to retrieve** the material from their own head, not re-encounter it.
2. The retrieval has to happen **at expanding intervals** so each successful pull strengthens the memory at increasing horizons. This is what Bjork calls *desirable difficulty*.

Small claim, large consequences. Most edtech products optimise for the wrong thing because they design for the feeling of progress: streaks, completion percentages, certificates. Those are fine, but they're orthogonal to whether anything sticks. What sticks is retrieval, repeated at the right times.

Call this **spaced retrieval practice**. Read once. Then on a schedule (typically something like 1, 3, 7, 14, 30 days) try to recall. Each successful recall pushes the next interval out further. Each failure resets you closer.

This is the engine behind Anki, Quizlet, RemNote, Readwise, and dozens of memory apps. It works. The research is solid. The catch is that *making the cards is annoying*. People drop off. The systems work for the people who stick with them; most don't.

## What we built into Strive

When you generate a course on Strive, the lessons aren't just lessons. Each lesson seeds 3–5 retrieval-practice cards automatically, phrased as questions, not as summaries. Those cards land in your daily recall queue at expanding intervals. Tomorrow, three days from now, a week from now, two weeks from now, a month from now.

You don't have to make the cards. You don't have to set the intervals. You just answer questions that show up.

The design choices that follow from the research:

- **Question-first, not summary-first.** Every card asks before it tells. The retrieval *attempt* is what does the work, even when you fail.
- **Spaced, not piled.** A finite daily queue tied to what's actually due. No infinite scroll. Some days the queue is small. That's fine.
- **The wording on the card isn't the wording from the lesson.** That's deliberate. If you can pattern-match a phrase, you're not retrieving. You're recognising.
- **Across courses, not within them.** If you're learning Python and Spanish, your queue mixes them. Interleaving is pedagogically correct (Brunmair & Richter's 2019 meta-analysis put Hedges' g ≈ 0.42 for category learning across [73 studies](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf)).

None of these are clever inventions. They're consequences of taking the research seriously when designing the learning loop, instead of treating "completion" as the unit of progress.

## What this means for you, even if you don't use Strive

If you're learning anything online and you want it to stick:

1. **Stop re-reading.** When you finish a lesson, close it and try to recall the three or four key ideas. Write them down. Then check.
2. **Review on a schedule, not on a vibe.** Same material, day 3, day 7, day 14, day 30. Even rough adherence beats none.
3. **Phrase your notes as questions.** A good recall card looks like *"What does FSRS optimise that SM-2 doesn't?"* not *"FSRS is better than SM-2 because…"*. The question is the engine.
4. **Mix your subjects.** If you're studying two things, alternate. Blocked practice feels easier and produces less durable knowledge.

This is the closest thing to a free lunch in learning. It isn't easy — retrieval feels harder than re-reading because it *is* harder, and that's the point. But the effect size is real and persistent across decades of evidence.

We built Strive around it. Most of the cognitive load of running a spaced-retrieval system (making cards, scheduling them, maintaining them) is taken off your hands. You read the lesson. The cards are there. The schedule is there. Your job is to show up and answer.

That's the design choice. Everything else in the product follows from it.

---

*If you want to read deeper: Roediger & Karpicke's [2006 paper](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PPS.pdf) is short and excellent. Bjork & Bjork's [chapter on desirable difficulty](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf) is the clearest framing of why hard practice produces durable learning. The [FSRS-6 benchmark](https://expertium.github.io/Benchmark.html) is the most rigorous open-source comparison of spaced-repetition algorithms I know of.*
