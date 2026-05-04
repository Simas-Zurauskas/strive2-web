---
title: How a lesson is built
slug: lesson-blocks-and-content
topic: building-and-studying
summary: Every Strive lesson is a sequence of typed blocks — explanation, code, math, diagrams, inline checks, exercise, summary. Here's what each does.
tags: [lessons, content, blocks]
order: 10
updated: 2026-05-02
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

## Personal layer

While you read, three private tools follow you:

- **Notes.** A panel beside the lesson that autosaves as you type. Notes are *yours* — they never feed into generation, recommendations, or another learner's view.
- **Bookmarks.** Star a lesson to pin it in your library's Bookmarks tab.
- **Font scaling.** Make the text bigger or smaller; preferences persist.

Notes and bookmarks are also content that you can return to later when reviewing — the queue surfaces *recall cards* automatically, but your notes are where your interpretation lives.
