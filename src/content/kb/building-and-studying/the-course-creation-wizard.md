---
title: The four-step wizard, in detail
slug: the-course-creation-wizard
topic: building-and-studying
summary: A deeper look at each step of the course-creation wizard — what to type, what each answer does to the resulting course, and how to use the agent chat.
tags: [wizard, courses, generation]
order: 10
updated: 2026-05-02
related: [creating-your-first-course]
---

The wizard exists because a sentence isn't enough information to build a good course. The four steps are the smallest set of questions that produces a curriculum tailored to *you* rather than to *people who Googled this topic*.

## Step 1 — Goal

A free-text field. Two or three sentences is the right length. Bad goals are vague (*"machine learning"*); good goals state both the topic and the use case (*"I want to understand modern ML well enough to interview at a research-adjacent company"*).

The goal text is preserved verbatim and used as the starting context for every later AI call in the pipeline.

## Step 2 — Why and what for

Strive asks two follow-ups:

- **Why now?** The motivation. Job change, exam, hobby, business idea, curiosity. This biases the course's tone — exam prep gets more drilled-detail content; curiosity gets more breadth-and-context.
- **What does success look like?** The outcome. *"Pass the AWS exam"*, *"Build a working RAG pipeline"*, *"Read a research paper without getting lost"*. Outcomes shape which lessons get included and which get cut.

This step is where most learners under-invest. The more honest you are about why and what, the better the course.

## Step 3 — Where you're starting

This step is dynamic — the agent generates a personalized questionnaire based on Step 1 and Step 2. If your goal involves Python, you'll get a Python question. If it involves linear algebra, a linear-algebra question. The point isn't a test — there's no grade — it's to know which fundamentals to skip.

Be honest. Saying you know things you don't will produce a course that skips foundations you actually need. Saying you don't know things you do will produce a course that bores you with material you've seen.

## Step 4 — Depth and format

Pick a depth tier:

- **Quick** — a small course (typically 4–6 modules). Appropriate when you want orientation, not mastery.
- **Standard** — the default. A serious self-study course of 8–12 modules calibrated to your other answers.
- **Deep** — a long course (12+ modules) with extensive depth. Use when the topic warrants it.

You can also pick a goal-type chip — Master, Monetize, Pass an exam, Build something, Achieve fluency — which biases the course in characteristic ways. *Master* leans theoretical; *Build* leans hands-on; *Pass* skews toward question-shaped material.

## The depth-override gate

If your stated goal and the chosen depth seem mismatched (you ask for *"a quick intro"* but pick Deep, or you ask for *"deep mastery"* but pick Quick), the agent surfaces a gate before it generates. You confirm — *"yes, I really do want a Deep course on a Quick-feeling topic"* — and the structure proceeds. The gate exists because expensive mistakes upstream are common with learners who are new to self-study.

## The agent chat

After generation, you see a draft structure and can chat with the agent to refine it. The agent can add, remove, merge, split, and reorder modules. It does not write lesson content — that comes later, on demand. Use this step generously. Iterating the structure once now is much cheaper than discovering the wrong shape after generating five lessons.

When the structure looks right, click Generate. One unit of allowance is debited and the course lands in your library.
