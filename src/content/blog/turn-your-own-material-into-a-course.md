---
title: "Turn your own material into a course: what to upload, and what to expect"
slug: turn-your-own-material-into-a-course
summary: You already have the syllabus, the slides and the readings. Turning that pile into something you can actually study from is the hard part. Here is what to give Strive, what makes a source set work, and what happens when the material runs thin.
category: guide
author: Simas Zurauskas
published: 2026-07-30
tags:
  - study material
  - course generation
  - documents
  - ai learning
  - study techniques
---

Most people arrive at a subject already holding the material. A syllabus and eleven PDFs. A folder of lecture slides from a course you sat through and didn't retain. The internal documentation nobody has read end to end. A recording of a talk you meant to take notes on.

The material is not the problem. The problem is that a pile of documents is not a course. It has no order, no entry point, no checks along the way, and no opinion about what matters. Reading it front to back is the obvious move and also the one that reliably [doesn't stick](/blog/why-most-courses-dont-stick).

Strive can now take that pile and build a course on top of it. This post is the practical version: what to give it, what it does with what you give it, and where the honest edges are.

## What to upload

The accepted list is specific rather than universal, and it is worth knowing which side of the line your material falls on.

**Documents** — PDF, Word, PowerPoint, Excel, OpenDocument text, presentations and spreadsheets, and ePub. **Text** — Markdown, plain text, HTML and CSV. **Images** — PNG, JPEG, WebP and HEIC; a photographed or scanned page is read as an image. **Audio** — MP3, M4A and WAV, which get transcribed. And **links** to pages that are openly available on the web.

The ceilings: ten files, fifty megabytes each, ten links per course, and up to three hours of audio across the whole set.

Some formats are deliberately out. The older Office formats — `.doc`, `.ppt`, `.xls` — are not read. Neither are archives or video. And the file is checked by its actual contents rather than its extension, so renaming something into a `.pdf` gets it refused with a note saying exactly that.

## What makes a good source set

Volume is not the variable. The variable is how much *distinct* teachable ground the set covers.

Three patterns work well:

**The syllabus plus its readings.** The syllabus supplies structure and priorities; the readings supply substance. This is the strongest possible input, because the ordering problem is already solved by somebody who knew the subject.

**A slide deck plus the notes you took against it.** Slides are compressed to the point of being useless on their own — that is what a speaker is for. Your notes carry the connective tissue the slides omit. Together they reconstruct something teachable.

**A small set of dense primary documents.** A specification, a standard, a manual, a long paper. Dense material supports far more lessons per page than narrative material does.

Two patterns work badly. The first is **near-duplicates**: four overlapping drafts of the same document add pages and add nothing teachable. The second is **a single overview document**, the ten-slide summary deck, which contains a course's worth of headings and none of a course's substance.

If you are choosing between adding a marginal document and leaving it out, add it. Overlap costs you very little. Absence costs you a topic.

## Thin material, rich material

This is the part worth setting expectations on, because the alternative is quiet disappointment.

Thin material does not produce a thin course that pretends to be a thick one. It produces a shorter course, and the parts the model had to write on its own are labelled as such. There is no padding step. If you upload one summary deck, you get a short primer built around it, and the analysis will tell you before you commit that your documents are thin in places and that lessons will be openly supplemented where they run out.

Rich material has the opposite risk, which is being asked to carry too much. A very large set will produce a note suggesting the material is better served across more than one course. Take the suggestion seriously; a forty-lesson course covering four subjects is a worse artifact than four courses.

There is also a hard ceiling — roughly three hundred pages' worth of text per course. A document that crosses it is left out and marked, rather than the whole set being refused.

## What the analysis tells you before anything is generated

Nothing is generated when you add your material. Strive reads it first and reports back, and the report is free — it doesn't draw on your allowance. You can re-run it up to three times a day on the same course, which is enough to add the document you forgot and look again.

What comes back:

- **The topics it found**, as chips, across the whole set. This is the fastest way to catch a document that failed quietly, because a subject you know is in the pile will be missing from the list.
- **An estimated course size**, given as a range of lessons.
- **Notes** where the material runs thin, or is large enough to be worth splitting.
- **Up to three questions** it would want answered — the gaps a course built from this material would run into.
- **A suggested course goal**, written from your documents, which you can and probably should edit.

Each file also carries its own status while this runs, so a rejection is visible on the row rather than discovered later.

Two things the analysis does not give you: a word count and a score. Neither would mean anything. The estimate counts distinct teachable ideas, not pages, which is why fifty pages of specification can support more lessons than three hundred pages of a textbook that repeats itself.

And it is a range, not a number, because the honest answer is a range.

## Choosing how closely the course follows you

Before generating, you pick a fidelity. Three settings, and the choice matters more than it looks:

**Strict** stays inside your documents. Nothing is added beyond what they say, and where the material doesn't cover something, the lesson says so instead of filling the gap. Choose this when the material *is* the authority — a set exam, an internal standard, a specific edition of a text. The cost is that you will meet lessons that stop short, and that is the intended behaviour rather than a failure.

**Guided** is the default. Grounded in your documents, with connective explanations where they help, and additions marked in the lesson. This is the right setting for most sets, because most sets have gaps their author never intended to fill.

**Enrich** treats your documents as the backbone and brings in wider context and examples around them. Choose it when your material is a starting point rather than the whole story — a reading list you want situated, a spec you want taught with examples it doesn't contain.

The mistake to avoid is picking Strict because it sounds safest and then being annoyed that the course has holes. Strict is not a quality setting. It is a fidelity setting, and holes are what fidelity to an incomplete document looks like.

## Where the AI supplements, and how you know

Every lesson in a documents course carries one of two badges: **From your documents**, or **AI-supplemented**. The badge shows on the lesson and against every lesson in the structure preview, so you can see the balance of the course before generating any of it.

It is binary on purpose. A percentage would look precise and wouldn't be — there is no honest way to compute *"73% from your sources"* for a piece of written prose, so we don't print a number we can't stand behind.

Use the badges while you read. On a Strict course, an AI-supplemented lesson is a signal that your material didn't cover that ground, which is often useful information about the material. On an Enrich course it is expected and unremarkable.

The standing note that Strive's output is AI-generated and worth verifying applies to grounded lessons too. Grounding raises the floor. It does not turn the model into a citation. Strive teaches from a source; it isn't a substitute for reading it.

## When something gets refused

Sources are handled one at a time, so one refusal doesn't take the rest down. The row shows a short reason, and the warning icon next to it holds the sentence. What actually happens:

- **The file couldn't be read** — corrupt, or its contents don't match its extension.
- **A safety check refused it.** Everything is screened before anything else happens to it.
- **The site asked automated systems to stay away.** Before fetching a link we read the site's `robots.txt` and its text-and-data-mining reservation file. If either reserves the page, we don't fetch it. That is not a bug and there is no way round it at our end — the publisher has asked, and honouring the request is the point.
- **The page couldn't be fetched.** Unreachable, or behind a login or a paywall. We only fetch openly available pages: no logging in, no paying, no working around access controls. There is no separate "paywalled" message, so a page behind one usually shows up here as a page we simply couldn't read.

One honest caveat on links generally: what comes back is the page's main text. A page whose substance lives in an interactive widget or a video will arrive thinner than it looks in a browser.

## A short checklist

1. **Add the syllabus if you have one.** Structure is the scarcest thing in most source sets.
2. **Prefer dense primary material to summaries.** Summaries produce summaries.
3. **Run the analysis and read the topic chips** before you generate. A missing subject means a source failed.
4. **Edit the suggested goal.** It is written from your documents, so it knows what is in them and nothing about why you are here.
5. **Pick fidelity on purpose.** Strict for authority, Guided by default, Enrich when your material is a starting point.
6. **Watch the badges while you study**, particularly on a Strict course.

What you get out is a course you can work through in order, with retrieval practice attached, built on material you already trusted enough to keep. The next question most people ask is what happens to that material once we have it — [we wrote that one down too](/blog/your-material-is-not-training-data). If you want the engineering underneath, [the pipeline is here](/blog/grounding-ai-lessons-in-your-own-sources).
