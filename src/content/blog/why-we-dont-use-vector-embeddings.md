---
title: Why we don't use vector embeddings for course generation (yet)
slug: why-we-dont-use-vector-embeddings
summary: Most "AI tutor" demos are RAG over course material. That pattern is a great fit for Q&A and a poor fit for generating coherent curricula. Here's the trade-off.
category: engineering
author: Simas Zurauskas
published: 2026-05-10
tags:
  - llm engineering
  - rag
  - vector search
  - langgraph
  - course generation
---

If you've shipped anything LLM-shaped in the last two years, the default reference architecture has been the same diagram: chunk a corpus, embed the chunks, store them in a vector database, retrieve the top-k at query time, stuff them into the prompt, return the answer. RAG. It is the duct tape of the AI engineering era, and like duct tape it works for a surprising number of things.

It is also the wrong default for what we do.

Strive generates personalised courses from a learner's stated goal — a complete curriculum, ordered modules, lessons that build on each other, quizzes that test synthesis, a spaced-retrieval queue. There is no canonical corpus we are searching against. There is a structural target we are trying to *produce*. That's a different problem class. It's also one of the more common mistakes I see in LLM systems: reaching for retrieval when the actual job is generation under constraints.

This post is about why we don't currently use vector embeddings for the curriculum itself, what we use instead, where embeddings are still a clear win, and the conditions under which we'd revisit.

## Why RAG dominates right now

Before criticising RAG, it helps to be honest about why it became the default in the first place.

1. **Context windows used to be small.** When the production model you could afford had 8k or 32k tokens of context, you had to be ruthless about what you put in front of it. Retrieval was the only way to get domain-specific facts into a generation. Models like Claude with 200k–1M context have changed the calculus, but the habit is sticky.
2. **It's auditable.** Every claim in the response can be traced to a chunk. For enterprise compliance, legal, and medical use cases, that audit trail is the product.
3. **The infrastructure is mature.** pgvector, Pinecone, Weaviate, Qdrant, the Postgres extensions. There is a buy-in path with no algorithmic invention required.
4. **It composes well with hosted "talk to your docs" interfaces.** Half the LLM startups in 2024 were a wrapper around RAG over a customer's PDF folder. That pattern has a real market.

So RAG is not a fad. It has earned its place. The question is whether *your* problem looks like the problems RAG is good at, and that question is doing a lot of work.

## What course generation actually requires

When a learner says "teach me Bayesian statistics, I have a CS background and I've seen frequentist hypothesis testing but never priors," the system has to make decisions that are explicitly *not* retrieval:

- **Choose a curriculum shape.** How many modules? What order? Does the user need a measure-theory aside, or would that derail them? When is the right point to introduce conjugate priors?
- **Calibrate to the learner's prior knowledge.** Skip what they know. Don't skip what they only think they know. Adjust depth without adjusting the destination.
- **Maintain coherence across the whole course.** Lesson 7 needs to refer back to a metaphor introduced in lesson 2. The quiz at the end of module 3 needs to test the synthesis of lessons 9, 10, and 11 — not just memorisation of any one of them.
- **Budget content.** A lesson is roughly 800–2000 words. A module is roughly five lessons. A course is roughly five modules. Inside those budgets the system has to decide what is in and what is out.

These are constraints over an *output structure*. None of them are answered by "find the top-5 most semantically similar chunks of pre-written course material." There are no chunks. No course yet either.

Say you tried to RAG this anyway, by retrieving from a corpus of existing Bayesian textbooks and using those chunks as the substrate for generation. Two failure modes show up almost immediately, and they're worth being concrete about.

**Failure mode 1: incoherence at the seams.** Each lesson generates fine in isolation. The transitions don't. Lesson 4 introduces a notation for posterior updates; lesson 5, generated from a different cluster of retrieved chunks, uses a slightly different one. Lesson 6 references "the earlier example" — which was actually trimmed for length two lessons back. Each piece is plausible. The whole reads like a stitched-together reader, because that's exactly what it is.

**Failure mode 2: the average textbook problem.** Retrieval, by construction, surfaces the centroid. The top-k chunks for "introduce Bayesian inference" will look like every introduction to Bayesian inference ever written: the same coin-flip example, the same MCMC hand-wave at the end, the same disclaimers. Personalisation collapses. The CS-background learner gets the same chapter the philosophy-major learner gets — the embedding space doesn't care who's asking.

You can patch both of these. You can add a planning step that retrieves a fresh slice per lesson with the running outline in context. You can add a coherence pass at the end. You can train a re-ranker. None of these patches are wrong. They're just incrementally rebuilding, in a more brittle way, what direct generation gives you for free: a single model holding a single intent across a single contiguous output.

## Generation problems vs retrieval problems

When I'm triaging an LLM design, the distinction I keep coming back to is this.

**Retrieval problem:** the answer exists somewhere in a known corpus, the user wants to find it, and the system's job is to locate and present it. Customer support over a docs site. Legal discovery. "What did our CFO say about Q3?" These are search problems with natural-language input/output.

**Generation problem:** the artefact does not exist yet, has structural requirements, and the system's job is to produce a coherent whole that meets a specification. A pull request from an issue. A meeting summary from a transcript. A course from a goal.

Embeddings are a near-perfect fit for the first class. They are at best an ingredient for the second — and often a distraction.

Course generation sits squarely in the second class. The "corpus" we'd be retrieving from would either be (a) a third-party set of textbooks we don't own and can't legally use as substrate, or (b) the course we're currently generating, which doesn't exist until we generate it. Both are dead ends.

## Cost and latency aren't on RAG's side here

A soft assumption hangs over a lot of design conversations: that retrieval is "lighter" than generation. Fewer tokens in the prompt, faster responses, lower cost. That holds for chat-style Q&A on big corpora. It does not hold when your generation is itself bounded.

A Strive course generation runs through a directed graph of LLM calls. Outline, then lessons in parallel, then quizzes, then retrieval-practice cards, with validation passes between stages. The total token spend is bounded by the size of the course, not the size of any external corpus. Adding a vector store on top of that would add:

- An embedding pass at ingestion (whatever the source corpus would be).
- A retrieval call per generation step (network hop, top-k decode, possibly a re-ranker).
- An indexing service to operate, version, and re-embed when the embedding model changes.
- A new failure mode: stale or low-relevance retrievals quietly degrading output without anyone noticing until quizzes start to feel "off."

For us, that is *more* infrastructure for *worse* results on the actual job. Direct generation with a high-context, structured prompt is the cheaper architecture — counterintuitively. The model already knows how Bayesian statistics is taught; we just need to commit it to a specific user, in a specific order, with specific examples.

## What we actually do

The architecture is not exotic. It's a LangGraph state machine over Anthropic Claude calls, with each node owning a discrete responsibility:

```
goal + prior knowledge
        │
        ▼
  course-shape planner ──▶ outline (modules + lesson titles)
        │
        ▼
   per-lesson agent ──▶ content blocks ──▶ validation
        │                                       │
        ├──▶ insights (retrieval cards)         │
        ├──▶ links / further reading            │
        └──▶ image prompt                       │
        │                                       │
        ▼                                       ▼
   per-module quiz agent ◀──── synthesis context
        │
        ▼
       course
```

No vector store in this picture. What does the work is a **shared state object** that LangGraph threads through every node — outline, prior lessons, the user's goal, the user's stated background — so each generation step has the full course-so-far in its prompt. That's the load-bearing piece. It's what stops the lesson-7-references-lesson-2 problem we saw with the RAG approach.

LangGraph earns its place here for three reasons specifically:

1. **State across steps.** We need every lesson generation to see the outline and the previous lesson summaries. A state graph is the cleanest expression of that.
2. **Branching by goal type.** A goal like "learn Spanish" demands a different graph topology than "build intuition for transformers." LangGraph lets us pick the topology at the planner stage rather than forcing one shape on every course.
3. **Replay and partial regeneration.** When a single lesson fails validation we can re-run that node with the same state, instead of regenerating the course. That pays for the abstraction by itself.

None of which requires retrieval. All of which requires structure.

## Where we WOULD reach for embeddings

None of this is to say embeddings are a bad tool. They are an excellent tool for the right problem. At least three places inside Strive are either already using them or will:

**1. Deduplication of generated insights.** Two different courses can produce near-identical retrieval-practice cards. "What does FSRS optimise that SM-2 doesn't?" generated from a course on spaced repetition will closely match a similar card generated months later from a memory-systems course. You don't want both in a learner's queue. A small embedding model with a cosine threshold catches these cleanly. This is a textbook semantic-similarity problem and embeddings are the right hammer.

**2. Related-lesson surfacing in the dashboard.** "You're learning about gradient descent. You also have a lesson on convex optimisation from three months ago — want a refresher?" That recommendation is a nearest-neighbour query over lessons the user already owns. Tiny corpus, tiny index, real value.

**3. Semantic search over a learner's own history.** A user with twelve courses and several thousand cards eventually wants to type "what did I learn about Bayes factors?" and find the relevant lessons. That's literally a search problem on a known, owned corpus. RAG, as it was originally meant.

In all three, the corpus is the user's *own generated content*, not external textbook material, and the job is "find," not "create." Different problem class. Different tool.

## The general rule, for anyone designing this stuff

If I had to compress this into one heuristic for engineers building LLM products:

> Pick retrieval when you have a known answer space and the user is searching it. Pick generation when you have a structural target and the user is asking you to produce one.

The error mode in both directions is the same: you reach for the architecture you've used before, instead of the one your problem actually wants. RAG-everything is the current incumbent of that error. Five years ago it was "fine-tune everything." Five years before that it was "rule-based system everything." The pattern repeats.

Concretely: before you reach for a vector store, ask whether a single sufficiently-rich prompt to a long-context model would do the same job. Often it will. When it won't — when you genuinely have a corpus the user is searching — embeddings are great. But "the user is asking for a thing" is not the same as "the answer is in a corpus."

## What this means for Strive's roadmap

We will add embeddings. We won't add them to the curriculum-generation path. They'll show up first in deduplication of insights across a user's library, then in dashboard recommendations, and eventually in semantic search over a learner's own course history. Each of those is a clean retrieval problem against a corpus the user owns, and each is genuinely improved by vectors.

The curriculum itself will keep being generated, not retrieved. As long as long-context models keep getting better at holding state across a multi-step generation, that decision will get more correct over time, not less. If it stops being correct, if we hit a coherence ceiling that contextual prompting can't break through, or a personalisation ceiling that planning agents can't break through, we'll revisit. That isn't a hypothetical we have to plan around today.

The takeaway for anyone reading this who's about to bolt RAG onto an LLM product: ask first what shape your output is. If it has structure, generate it. If it lives in a corpus, retrieve it. The decision feels obvious in retrospect and is surprisingly easy to get wrong in the moment.

---

*If you want to read deeper: the [LangGraph docs](https://langchain-ai.github.io/langgraph/) are the clearest articulation of the state-machine pattern for LLM orchestration. Anthropic's [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) write-up is the most honest piece I've seen on what RAG breaks under load and how to patch it — useful even if you're deciding not to use RAG. And Hamel Husain's posts on [evaluating LLM systems](https://hamel.dev/blog/posts/evals/) are the antidote to vibes-based architecture decisions in this space.*
