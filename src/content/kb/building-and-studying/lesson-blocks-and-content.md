---
title: How a lesson is built
slug: lesson-blocks-and-content
topic: building-and-studying
summary: Every Strive lesson is a sequence of typed blocks — explanation, code, math, diagrams, inline checks, exercise, summary. Here's what each does, and how to download a lesson or a whole course as a PDF.
tags: [lessons, content, blocks, download, pdf, export, audio, transcript]
order: 10
updated: '2026-08-19'
related: [creating-your-first-course]
---

A Strive lesson is not a wall of text. It's a sequence of typed *blocks*, each with a specific job. When you press Create lesson, the AI generates each block in order and streams it onto the page — you watch the lesson take shape rather than waiting for a final document.

## The block types

**Hero.** A short headline and a one-sentence framing. Sets the question the lesson is going to answer.

**Introduction.** Two to four paragraphs of context. Why this lesson, why now, what it depends on, what comes after.

**Sections.** The body of the lesson. Each section makes one argument or explains one idea. Sections can contain code, math (rendered with KaTeX), tables, callouts, and prose.

**Code blocks.** Syntax-highlighted, copy-buttoned. For supported languages, executable in-browser so you can try variations without leaving the page.

**Diagrams.** Mermaid charts for flow, sequence, state, and architecture diagrams. Generated as text and rendered live, so they stay editable and re-flowable rather than being baked into images.

**Callouts.** Boxed asides — note, warning, success, info. Used for caveats, common mistakes, and "if you take one thing away from this section…" moments.

**Inline quizzes.** Multiple-choice checks that appear next to the concept they test. They're not graded — they're for you, mid-lesson, to confirm the idea landed before you read on.

**Exercise.** A small applied task at the end. Not graded either, but the answer is checked against a model solution and the lesson is more useful if you actually do it.

**Summary.** Three to five bullet takeaways. The thing you'd want to glance at a week later.

**Reading list.** An optional short list of curated external links if the topic warrants further reading.

## Streaming, not waiting

The first time you click into a lesson, generation begins live. You see the hero arrive, then the intro stream in, then sections build out one block at a time. You can start reading immediately — you don't have to wait for the lesson to "finish" before engaging.

If generation fails partway through (rare, but possible — model hiccups, network blips), the lesson preserves what was already built and you can resume. You're not charged for a failed generation.

## Taking a lesson with you

A generated lesson doesn't have to stay in the browser.

**Lesson PDF.** *Download PDF* sits under the lesson title. You get the lesson as a typeset document: the hero image, the introduction, every section with its formatting, callouts, code, maths, the diagrams redrawn as sharp vector art rather than screenshots, the exercise, the summary and the reading list, with the external links still clickable.

**Course PDF.** The same button on the course overview builds the whole course as one document, opening with a contents page you can click to jump to any lesson. Lessons you haven't generated yet aren't invented to fill the gap — they're named in a short "Not included" list so you can see what the course still holds.

**Audio and transcript.** Where a lesson has narration, the player's ⋮ menu offers *Download audio* for the MP3 and *Download transcript* for the spoken text as a plain `.txt` file. The transcript is the script the narration was read from, so it matches what you hear.

### What a PDF leaves out, and why

Two kinds of block are deliberately absent from every export:

- **Inline quizzes.** A quiz works by making you retrieve the answer before you see it. On paper the question and the answer sit in the same glance, which turns a retrieval exercise into a reading exercise — the precise thing [spaced review](/help/how-strive-teaches/how-spaced-review-works) exists to avoid. Quizzes stay in the app.
- **Exercise starter code and expected output.** The exercise's *instructions* are in the PDF; the runnable scaffold isn't, because it's meant to be executed and edited in the browser rather than copied off a page.

Everything else in the lesson makes it into the file.

## Personal layer

While you read, three private tools follow you:

- **Notes.** A panel beside the lesson that autosaves as you type. Notes are *yours* — they never feed into generation, recommendations, or another learner's view.
- **Bookmarks.** Star a lesson to pin it in your library's Bookmarks tab.
- **Font scaling.** Make the text bigger or smaller; preferences persist.

Notes and bookmarks are also content that you can return to later when reviewing — the queue surfaces *recall cards* automatically, but your notes are where your interpretation lives.
