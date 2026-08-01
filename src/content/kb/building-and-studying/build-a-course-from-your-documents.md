---
title: Build a course from your own documents
slug: build-a-course-from-your-documents
topic: building-and-studying
summary: How to turn PDFs, slides, notes, recordings and links into a course — what Strive accepts, what the free analysis shows you before anything is generated, how the fidelity setting works, and how to read the provenance badges.
tags: [documents, sources, uploads, links, wizard]
order: 20
updated: '2026-07-30'
related: [the-course-creation-wizard, your-documents-and-privacy, lesson-blocks-and-content]
---

There are two ways into a Strive course. You can describe a goal and let Strive design the curriculum, or you can hand it the material you already have — a syllabus and its readings, a folder of lecture slides, the notes you took at work — and have the course built on top of that.

This article covers the second path.

## Where to start

Open the course creation wizard as normal. Under the goal box, beneath an *or* divider, there is a card marked **Build from your own materials**. That swaps the first step for a place to add files and links.

You can change your mind. A **Switch to standard creation** link at the bottom of the step takes you back to describing a goal, and the sources you have already added stay saved on the draft.

## What you can add

Strive reads these:

- **Documents** — PDF, Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`), OpenDocument text, presentations and spreadsheets (`.odt`, `.odp`, `.ods`), and ePub.
- **Text** — Markdown, plain text, HTML and CSV.
- **Images** — PNG, JPEG, WebP and HEIC. A photographed or scanned page is read as an image.
- **Audio** — MP3, M4A and WAV recordings, which are transcribed.
- **Links** — addresses of pages that are openly available on the web.

The limits, which the step states above the drop zone: **up to 10 files, 50 MB each, and 10 links** per course. Audio has its own ceiling of three hours across the whole course. There is also an overall ceiling on how much text one course takes in, at roughly 300 pages' worth. Past it, the document that crossed the line is left out and marked as such; the rest of the set carries on.

Some things are deliberately not accepted: the older Office formats (`.doc`, `.ppt`, `.xls`), archives, and video. Strive also checks what a file actually contains rather than trusting its extension, so a file that has been renamed will be refused with a note that its content doesn't match its type.

## What the free analysis tells you

Nothing is generated when you add your sources. Instead Strive reads them and reports back, under the heading **What your sources can teach**:

- **Topic chips** — the subjects it found across the whole set.
- **An estimated course size**, given as a range of lessons.
- **Notes** where the material is thin, or large enough to be worth splitting across more than one course.
- **Up to three questions** under *Worth clarifying as you go* — the gaps a course built from this material would run into.
- **A suggested course goal**, written from your documents, which you can edit freely before continuing.

The analysis doesn't draw on your allowance. Like any generation step, it won't start if your balance is empty. You can re-run it up to three times a day on the same course, which is enough to add a missing document and look again.

Each file gets a status of its own while this happens — *Uploaded*, *Analyzing*, *Analyzed*, *Rejected* or *Failed* — so a problem with one source is visible without hunting for it.

Two things the analysis deliberately does not show you: a word or page count, and a score. Counting words is not the same as counting what can be taught from them, and a number that looked precise would be misleading.

## What the size estimate means

The estimate is a range — *"Estimated course size: 9–14 lessons"* — and it is a count of distinct teachable ideas, not of pages. Fifty pages of dense reference material can support more lessons than three hundred pages of repetition.

It is a range rather than a single number because the honest answer is a range. You are not committed to it: the depth you pick later still shapes how long the course runs.

## How closely the course follows your material

Before you continue you choose a fidelity, under *How closely should we follow your documents?* There are three settings:

- **Strict** — stays inside your documents; nothing is added beyond what they say. Where your material doesn't cover something, a lesson says so rather than filling the gap.
- **Guided** — the default, and the one we recommend. Grounded in your documents, with connective explanations where they help. Additions are marked in the lesson.
- **Enrich** — your documents as the backbone, enriched with wider context and examples.

Pick Strict when the material is the syllabus and departing from it would be wrong — a set exam, an internal standard, a specific edition of a text. Pick Enrich when your documents are a starting point rather than the whole story.

Fidelity only exists on a documents course. A course built from a goal has no source material to follow, so the setting doesn't apply to it.

## Which lesson came from where

Every lesson in a documents course carries one of two badges:

- **From your documents** — the lesson draws on passages from the material you gave us.
- **AI-supplemented** — it doesn't, and the model wrote it around your material.

The badge appears on the lesson itself and against each lesson in the structure preview, so you can see the shape of the course before you generate any of it. It is deliberately one or the other rather than a percentage: a figure like *"73% from your sources"* would imply a precision the underlying measurement doesn't have.

Alongside it sits the standing note that Strive's output is AI-generated and worth verifying. That applies to a grounded lesson too. Strive teaches from a source; it is not a substitute for reading it.

## When your material is thin

If your sources cover less ground than a full course needs, the analysis says so: *your documents are thin in places — where they run out, lessons will be openly AI-supplemented rather than stretched.*

That is the whole design. Thin material does not get padded into a longer course. It gets a shorter course, with the supplemented parts labelled, and you decide whether that is what you wanted. If it isn't, add more material and re-run the analysis.

## When a file or a link is refused

Sources are handled one at a time, so one refusal doesn't take the rest down with it. A refused source shows a short reason on its row, and the warning icon beside it holds the sentence explaining what happened. The usual causes:

- **The file couldn't be read** — it is corrupt, or its contents don't match its extension.
- **A safety check refused it.** Every upload is screened before anything else happens to it.
- **The site asked automated systems to stay away.** Before fetching a link we read the site's `robots.txt` and its `/.well-known/tdmrep.json` reservation. If either one reserves the page, we don't fetch it. Nothing you can do at our end changes that; the site owner has asked, and we honour the request.
- **The page couldn't be fetched.** It may be unreachable, or behind a login or a paywall. We only fetch pages that are openly available — we don't log in, don't pay, and don't work around access controls. There is no separate "paywalled" message, so a page behind one will usually appear here as a page we simply couldn't read.

If nothing at all survives, the step says so, with a count of what was rejected and two ways forward: try again with different material, or start from a goal instead.

## Deleting a source later

Deleting a document removes the file, the text we pulled out of it and everything derived from it. It does **not** delete the course that was generated from it — that course is yours and it stays. Deleting the course removes both.

What happens to your material while we hold it, who processes it, and how long any of it is kept is covered in [Your documents and your privacy](/help/plans-and-account/your-documents-and-privacy).
