---
title: "Grounding AI lessons in your own sources: the pipeline, and where it stops"
slug: grounding-ai-lessons-in-your-own-sources
summary: Grounding a generated lesson in a user's own documents is five stages, not one — parse, screen, assess, retrieve, attribute. Here is how each works in Strive, and the specific things it can't do.
category: engineering
author: Simas Zurauskas
published: 2026-07-30
tags:
  - llm engineering
  - rag
  - retrieval
  - document parsing
  - grounding
---

"Grounded in your documents" is one of those phrases that sounds like a single feature and is actually five, each of which can fail on its own terms.

Strive builds courses two ways. From a goal, where the curriculum is generated and there is nothing to be grounded in. And from material a learner uploads, where there is — and where the interesting engineering lives. This post is the second path, stage by stage, with the limits stated rather than implied.

## The shape of the problem

A learner drops in ten files and a few links and asks for a course. Between that and a first lesson sit some awkward requirements:

- **You cannot trust the input.** Not its format, not its contents, not its legality, not whether the person had the right to give it to you.
- **You cannot know in advance whether it is teachable.** Three hundred pages might be one lesson's worth of ideas repeated, or thirty lessons' worth of specification.
- **You should not spend the expensive work before the learner has committed.** Transcribing three hours of audio to tell someone their material is thin is the wrong order of operations.
- **The output must be honest about its own footing.** A lesson the model wrote from general knowledge and a lesson built out of the learner's chapter four should not look identical on the page.

Those four constraints produce the pipeline. Nothing in it is clever. All of it is ordering.

## Stage 1 — parse

Bytes land in object storage under a key scoped to the user and the course, and a database row is created alongside. Before any of that, the file is sniffed: the type is decided from its actual leading bytes, not from its extension or its declared MIME type. A renamed executable is refused here, at the boundary, before anything else in the system has an opinion about it.

Extraction then forks by kind. Text-shaped documents go through a document extractor. Audio is transcribed. Images — and scanned pages that turn out to have no text layer — go through a vision model.

The vision fork is the expensive one, and it gets a budget. On the first pass, extraction runs in **triage** mode: enough to know what the corpus contains, with a cap on how many pages get the vision treatment. The full pass happens later, and only if the learner goes ahead. This is the cheapest structural decision in the whole design and the one I would keep if I could only keep one.

Links are their own fork. Before any fetch, we read two files on the origin: `robots.txt`, matched against our product token, and `/.well-known/tdmrep.json`, the text-and-data-mining reservation. The verdict is deliberately three-way rather than two:

- No `robots.txt`, a 404, no reservation file → **no reservation expressed → allow**.
- An explicit disallow for our token, or a TDM reservation → **block**.
- A 5xx, a timeout, or a reservation document we cannot parse → **fail closed**.

The third case is the one that matters. An unreadable reservation is not the same as an absent one, and treating "I couldn't tell" as "yes" is how a compliance feature quietly becomes decorative.

The fetch itself doesn't happen from our servers. The address goes to an external reading service, which requests the page and returns its main text. That started as a security decision — our infrastructure never opens an address a stranger typed into a form — and it stays one.

## Stage 2 — screen

Everything is safety-screened, and the ordering here is the whole point.

For an image, the screen runs **before** the vision call, not after it. Screening the output of a vision model tells you what the model was willing to describe. Screening the input tells you what you were sent. Those are different questions and only one of them is the one you need answered.

Container formats — a slide deck, a document with embedded images — get their images enumerated and screened individually before extraction proceeds, for the same reason.

Extracted text is then screened as a whole, with an adjudication step over borderline results. This stage is **fail-closed**: if screening cannot complete, the document does not proceed. That is the opposite of the posture in stage 4, and the asymmetry is deliberate. Failing open on safety means shipping unscreened content. Failing closed on retrieval means shipping a slightly worse lesson.

Refusals are per document. A refused source doesn't take its siblings down; it lands as a rejected row with a category-level reason, and the corpus carries on with what survived.

## Stage 3 — assess

Once the surviving documents are chunked and embedded, one pass runs over the corpus as a whole and answers the question the learner actually has: what can this teach?

The output is deliberately shaped:

- The topics present across the set.
- A **size band** — a range of lessons, never a point estimate.
- A mode: the material is self-sufficient, it needs supplementing, or it is large enough to be worth splitting.
- Up to three questions the material leaves open.
- A suggested course goal, written from the documents.

Two design notes. First, the band counts **distinct teachable points**, not tokens or pages — an instruction the assessment prompt is explicit about, along with an instruction not to pad a thin corpus into a longer course. Second, the assessment carries internal signals that never reach the client. A density figure exists in the pipeline; it is not rendered anywhere, because a decimal on a screen implies a measurement, and this is a model's judgement wearing a number's clothing.

The band clamps the depth options offered afterwards. A corpus assessed at three to six lessons does not get offered a forty-lesson course, whatever the learner picks.

If the learner goes ahead, a second corpus pass runs and does the work triage skipped: full vision extraction, full audio transcription, screening again on everything new, and only then re-chunking and re-embedding. Everything expensive lives behind the commitment.

## Stage 4 — retrieve, per lesson

Course structure is generated with the corpus digest in context, and each lesson comes back carrying chunk ids the model claims it will draw on. Those ids are validated against the ids that actually exist and capped per lesson; invented ones are dropped silently. A model citing a chunk id it invented is not an edge case, it is Tuesday.

At lesson-generation time, retrieval runs in two moves. **Refs first** — pull the chunks the structure step nominated, straight out of the manifest, no vector search needed. **Then top up** with a semantic search over that course's chunks, up to a small fixed number, within a fixed byte budget for the assembled source section.

Refs-first matters more than it sounds like it should. The structure step already made a judgement about which part of the corpus a lesson is about, at a moment when it could see the whole shape of the course. Throwing that away and re-deriving it from a similarity score against the lesson title is strictly worse — and it is what you get if you build this as pure retrieval-augmented generation with no memory of the planning step.

This stage is **fail-open**. If retrieval breaks, the lesson generates without a source section rather than not generating. The learner gets a lesson marked as AI-supplemented instead of an error page, which is the right trade for a study product and the wrong one for, say, a legal tool. Worth being explicit about which kind you are building.

The fidelity setting is a prompt-level instruction layered on top: stay inside the sources and say so when they run out; stay grounded but connect; or use the sources as a backbone and go wider. It is guidance to a model, not a constraint on one. Strict mode makes a strict lesson considerably more likely. It does not make one certain.

## Stage 5 — attribute

Provenance is derived, not declared. A lesson that ended up with validated source references renders **From your documents**; one that didn't renders **AI-supplemented**. That badge is per lesson, binary, and shown both on the lesson and against every lesson in the structure preview, before any of them is generated.

The temptation is to go finer — per block, or a percentage. We didn't, for one reason: neither can be computed honestly. Generated prose is not a quotation with a citation attached; it is prose written with passages in context. You can say truthfully that a lesson had sources in front of it. You cannot say truthfully that 73% of it came from them. A number that specific would be a guess with a decimal point on it.

## What this doesn't do

The honest list, since the rest of the post is the flattering version.

**Chunks lose arguments.** Retrieval returns passages. A claim that only holds across forty pages of a book — the shape of a whole argument rather than any sentence in it — is not reliably recoverable from a passage window, and grounding does not fix that.

**A page is not what a browser shows you.** The reader returns main text. A page whose substance lives in an interactive widget, a video or a table image comes back thinner than it looks, and nothing downstream knows what it missed.

**There is no paywall category.** A page behind an access control surfaces as a generic fetch failure. It is honest but coarse, and it is on the list to fix.

**Reservation checks are point-in-time.** We record the signal we read at fetch time. A site that adds a reservation afterwards is not retroactively honoured until something re-ingests. We keep the audit field precisely so that we know what we saw and when.

**The press-domain shortlist is hand-maintained.** Fetched pages from news sites get a shorter retention window, matched against a list that covers the large publishers and is not exhaustive by construction. Anything not on it gets the ordinary window. We would rather say that than imply a classifier we don't have.

**Grounding is not verification.** Nothing in this pipeline checks whether the learner's documents are correct. Garbage in, faithfully-grounded garbage out. The AI-generated notice stays on every lesson for this reason.

## The embeddings question

Earlier this year I wrote [a post arguing against vector embeddings for course generation](/blog/why-we-dont-use-vector-embeddings), and it ended with a list of the places we *would* reach for them: deduplication, recommendation, and search over a corpus the user owns.

This feature is the third one arriving, and the distinction in that post held up better than I expected. The curriculum is still generated, not retrieved — the structure step plans a course, it does not assemble one out of nearest neighbours. What retrieval does here is supply evidence to a generation step that has already decided what it is writing about. Retrieval around generation, not instead of it.

That is also why refs-first beats pure similarity search. The planning step knows something the embedding space doesn't: what this lesson is *for*.

## Takeaways

1. **Order the stages by what they cost and what they protect.** Screen before you interpret. Triage before you commit. Assess before you generate.
2. **Pick your failure direction per stage and write it down.** Safety fails closed. Retrieval fails open. If you can't say which each of your stages does, it's whatever the last person to touch it assumed.
3. **Validate what the model claims.** Chunk ids, source references, anything the model hands back that maps onto a real object — check it against the real objects. Drop what doesn't resolve.
4. **Don't publish a precision you don't have.** Binary provenance is less impressive than a percentage and considerably more defensible.

If you want the user-facing version of all this, [the practical guide is here](/blog/turn-your-own-material-into-a-course). And the streaming layer that renders these lessons is [its own post](/blog/lesson-streaming-block-by-block).
