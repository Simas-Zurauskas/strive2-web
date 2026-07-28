---
title: AI course generators compared — what actually differs
slug: ai-course-generators-compared
summary: Every AI learning tool now promises a personalised course. Most of the differences that matter are invisible on the pricing page. Here are the seven axes that actually separate them, and where we sit on each — including where we come off worse.
category: guide
author: Simas Zurauskas
published: 2026-07-28
tags:
  - ai learning
  - course generators
  - comparison
  - buying guide
---

If you go looking for an AI tool that will build you a course, you will find perhaps thirty of them inside an afternoon, and their landing pages will be close to interchangeable. Personalised. Adaptive. Powered by AI. Learn anything. The screenshots all show a tidy list of modules. The pricing pages all show three tiers.

This is a genuinely hard category to shop in, because the things that determine whether you will still know the material in six weeks are not the things that appear on the comparison table. They are architectural, and they are mostly invisible until you have used the product for a month.

What follows is the framework I wish had existed when we started building [Strive](https://strive-learning.com) — seven axes along which these tools actually differ. I have tried to write it so it is useful even if you pick something else, and I have been specific about where we are the wrong answer. I am not going to tell you what any named competitor does under the hood, because I do not know, and neither does anyone else writing those comparison posts.

## 1. Is the curriculum retrieved, or is it written for you?

The first and largest fork.

**Catalogue tools** have a library. You search it, you pick "Introduction to Python", you get the same course as everyone else. The AI, where it exists, is a recommendation layer and possibly a chat tutor bolted to the side. This is most of the incumbent e-learning market.

**Generative tools** have no catalogue. There is nothing to browse, because the course does not exist until you ask for it.

The distinction matters most when your goal is narrow. "Learn Python" is served perfectly well by a catalogue — the canonical Python course has been written a thousand times and some of those are excellent. But *"I need to automate the monthly reconciliation report my finance team does by hand, and I last wrote code at university"* has no catalogue entry, and never will. Generative tools exist for the long tail. If your goal is in the head of the distribution, a catalogue is very likely cheaper and better.

Worth knowing: a lot of tools that market themselves as generative are really catalogue tools with a generated *outline* on top — the structure is bespoke, the content behind each lesson is stock. Which brings us to the next axis.

## 2. What exactly gets generated — the outline, or the lessons?

Generating a plausible course outline is easy. Any competent model will produce twelve module titles for any subject you name, and they will look right.

Generating the *lessons* is the expensive part, and it is where products diverge sharply. Ask yourself, of any tool: when I click into lesson 4, is that prose written for my course, or is it a stock article, or is it a live model call happening now?

You can usually tell within two lessons. Generated-for-you content refers backwards ("in the last lesson you saw why the naive approach fails here"). Stock content does not, because it cannot — it was written without knowing what lesson 3 was.

An outline-only tool is a search tool wearing a curriculum costume. It is not useless. It is just a different product from the one you thought you bought.

## 3. When is it written — upfront, or on demand?

Among tools that genuinely generate lessons, there are two models.

**Batch:** you ask for the course, the system generates all of it, you wait, then you have a finished artefact. Simple to reason about. It also means paying — in time and in the tool's own costs — for the twenty-eight lessons you will never open. Most people do not finish courses. This is not a moral failing; it is the base rate.

**On demand:** the structure is generated up front, and each lesson is written the moment you open it. Nothing is spent on lessons you never reach, and the lesson can take into account what you have done since the course was designed.

We chose on demand, and wrote up the mechanics in [lesson streaming, block by block](/blog/lesson-streaming-block-by-block). The honest tradeoff is that you cannot hand someone a completed PDF of a course that has not been written yet, and there is a short wait at the start of each lesson rather than one long wait at the beginning.

## 4. How much does it actually know about you?

"Personalised" spans an enormous range, and the word does no work at all on a landing page.

- **Topic-level.** You typed "React". That is the entire personalisation. This is the majority.
- **Level-level.** You also picked beginner / intermediate / advanced from a dropdown. Slightly better, and still a single ordinal for a thing that is not ordinal — a senior backend engineer learning React is not "intermediate", they are *expert at some of it and naive about the rest*.
- **Goal-and-background.** The system asks you questions generated for your specific goal, and the answers change the curriculum, not just the tone.

The test for which one you are looking at: does it ever *remove* something? Real personalisation is subtractive. If a tool never decides to skip a module because you already know it, it is styling output, not designing a course.

## 5. What happens after the lesson ends

This is the axis I would weight highest, and it is the one almost nobody puts on a comparison table.

Reading a well-written explanation produces a strong feeling of understanding and a weak memory. That is not a claim about AI; it is one of the most replicated findings in cognitive psychology, and it is the reason re-reading remains the most popular and least effective study method. We went through the studies in [active recall vs re-reading](/blog/active-recall-vs-rereading), and the forgetting side in [the forgetting curve, 140 years on](/blog/the-forgetting-curve-140-years-on).

AI arguably makes this worse rather than better, because AI-generated explanations are unusually fluent, and fluency is precisely the cue people misread as mastery.

So the question to ask of any learning tool is: **what does it make me do after I have read the thing?**

- Nothing. You read, you move on. Most tools.
- A quiz at the end of the lesson. Better — but a quiz taken sixty seconds after reading tests your short-term buffer, not your memory.
- Something that brings the material back *days later*, when you have started to forget it. This is the only version supported by the evidence.

Spacing is the mechanism, and it is not a subtle effect. The [Cepeda et al. 2006 meta-analysis](https://pubmed.ncbi.nlm.nih.gov/16719566/) covered hundreds of experiments and found distributed practice reliably beating massed practice on delayed tests; Dunlosky and colleagues' [2013 review of learning techniques](https://journals.sagepub.com/doi/10.1177/1529100612453266) rated practice testing and distributed practice as the only two techniques with *high* utility, out of ten commonly recommended ones.

Strive seeds recall cards from each lesson and returns them at 1, 3, 7, 14 and 30 days. Plenty of dedicated spaced-repetition tools do this better in isolation — Anki has two decades of head start and a far more sophisticated scheduler. The thing we are trying to get right is that the cards come from the course you are actually studying, without you having to write them.

## 6. Do the questions test recall, or synthesis?

Generated questions default to the easy kind: definitions, single facts, things that appear verbatim in one paragraph. They are easy to generate and easy to answer, and answering them correctly tells you approximately nothing.

The useful question is the one that requires two lessons at once. *Given what you learned about indexes in lesson 3 and about query planning in lesson 6, why is this query slow?*

Karpicke and Blunt's [2011 Science paper](https://www.science.org/doi/10.1126/science.1199327) is instructive here, because it scored final tests on verbatim *and* inferential questions separately, and retrieval practice won on both — beating elaborate concept mapping. The inferential gap is the one that matters for anything you intend to use.

When evaluating a tool, generate one course and read its quiz. It takes five minutes and tells you more than the pricing page.

## 7. How you pay, and what runs out

Two models, and they fail differently.

**Seat-based.** A flat monthly fee, unlimited or soft-limited use. Predictable. The provider's incentive is for you to use it *less* than you pay for, which is why heavy users often notice quality quietly degrading.

**Usage-based.** You buy an allowance and generation draws it down. Less predictable, but the incentive is aligned — the provider is paid for what it produces, so there is no reason to make the expensive thing worse.

We are usage-based: an allowance denominated in credits, every plan unlocking every feature, tiers differing only in how much you can generate. What I would tell you to check, on any usage-based tool, is what happens when you run out. Ours stops *new* generation and leaves everything already generated permanently yours, and refunds the allowance on any generation that fails. That is the part worth reading the terms for, whoever you buy from.

---

## Where Strive is the wrong answer

A comparison post that concludes "and that is why our product wins" is an ad. So, concretely:

- **You want a recognised credential.** We have no certificates, no accreditation, no credits. If the outcome you need is a line on a CV that an employer recognises, buy the accredited thing.
- **You are learning to speak a language.** Our lessons are text-first. There is no speaking practice, no listening, no shadowing. A course on Spanish grammar is genuinely useful; it is not going to make you conversational, and I would rather say so than take the subscription.
- **You want to learn on a phone, offline, on a commute.** It runs in a mobile browser. There is no native app, and there is no offline mode.
- **Your subject is in the head of the distribution and you want the canonical treatment.** For "learn Python from scratch", a well-made catalogue course written by a human who has taught it for ten years is a strong option. Our advantage is proportional to how specific and unusual your goal is.
- **You want to browse before committing.** There is nothing to browse. Every course is generated for one person, so the only way to see what a Strive course looks like is to describe a goal and look at what comes back.

## A five-minute evaluation, for whatever you are choosing between

1. Give it a goal that is specific and slightly awkward. Not "learn marketing" — *"run Meta ads for my handmade jewellery shop, I have never run an ad"*. Generic goals hide the difference.
2. Look at whether the outline reflects the awkward part, or quietly reverts to the generic category course.
3. Open lesson four, not lesson one. Lesson one is always good. Does it reference lesson three?
4. Read one quiz question. Recall, or synthesis?
5. Find out what it will ask you to do about this material a week from now. If the answer is nothing, you are buying content, not learning.

That fifth one is the whole ballgame, and it is the reason we built the thing the way we did. Everything else on the list is a preference. That one is the difference between a course you enjoyed and a course you can still use.

If you want to try the awkward-goal test on us, [describe a goal](https://strive-learning.com) and see what the curriculum looks like. The free tier is enough to see the structure and read a couple of lessons, which is enough to run steps 1 through 4.
