---
title: "Lesson streaming, block by block: building real-time AI UX without spinners"
slug: lesson-streaming-block-by-block
summary: Most AI products show a spinner while the model writes. Strive doesn't. Here's the engineering behind streaming structured lesson blocks to the browser as they generate.
category: engineering
author: Simas Zurauskas
published: 2026-05-10
tags:
  - llm engineering
  - streaming
  - ux
  - server-sent events
  - generative ai
---

Every AI product has, at some point, made a quiet choice about what the user sees while a model is thinking.

Most pick the spinner. The pattern is: button click → a translucent overlay → some loading copy that tries to be charming → the finished artifact appears all at once when generation finishes. Easy to ship. Almost always the wrong call.

Strive generates entire courses (modules, lessons, code blocks, callouts, quizzes) using LangGraph agents on Anthropic Claude. A lesson is not a one-shot text completion. It's a tree of generation that can take real wall-clock time. We had a fork in the road early on: spinner-and-wait, or stream-as-it-generates. We picked streaming. This post is about why, what it actually took to build, and the parts we got wrong on the first pass.

## The default is a spinner because the default is easier

Spinner UX has one virtue: it lets the backend be a black box. The endpoint returns when it returns. The frontend renders a single payload. There is one happy path and one error path. Errors are clean. You either got the artifact or you didn't.

Streaming is the opposite. You commit to rendering partial state. Errors land mid-paint. The "thing" the user is looking at is changing under their cursor. Every layer (model, transport, parser, renderer) has to tolerate incompleteness. You sign up for a meaningfully harder UX problem in exchange for a meaningfully better one.

The trade is worth it for one reason: spinners are how you communicate *waiting*. Streaming is how you communicate *progress*. Different promises.

## The UX claim: people are happy to wait if they can see it's working

There's a well-trodden HCI result that perceived performance is not the same as actual performance, and the variable that closes the gap is *observable progress*. Determinate progress bars feel faster than indeterminate spinners even when the wall-clock time is identical. Skeleton screens beat spinners on perceived load even when nothing has actually rendered yet. The pattern is consistent — when humans can see effort, they tolerate latency. When they can't, every second is a second of doubt.

That's exactly the situation a generative-AI UI lives in. Models are slow on the time scale of human attention. There is no engineering trick coming that will make a coherent multi-thousand-token lesson appear in 200ms. The wall-clock budget is what it is. The lever you actually have is what the user sees during it.

A spinner during generation is a one-bit signal — *something is happening*. A streaming render is a continuous signal — *here's what just got produced; here's what's coming next*. The cost of generation didn't change. The cost of waiting did.

## The setup, end to end

The high-level shape of the pipeline:

```
LangGraph agent ─► structured block events
       │
       ▼
   API server (Express) ──── SSE ────► Browser
       │                                  │
       ▼                                  ▼
   per-user socket room              block-typed renderer
   (job:* events)                    (heading | prose | code | quiz | …)
```

A few things matter about this picture that don't show up in a casual reading:

- **The model isn't streaming free text.** Each block has a type (`heading`, `prose`, `code`, `callout`, `quiz`, and so on) and a known shape. The agent emits typed blocks; the frontend has a registered renderer per type. This is the single highest-leverage decision in the whole design.
- **The transport is one-way push from server to browser.** SSE for the lesson stream itself, Socket.io for per-user job lifecycle events (`job:started`, `job:progress`, `job:completed`, `job:failed`) on a `user:<userId>` room. Two channels for two jobs: structured content vs. job state.
- **The renderer treats a block as the atomic unit.** A block either renders completely or shows a skeleton in its place. Within a block, partial text is allowed; across blocks, the order is stable.

One thing to call out: most "GPT-style" streaming you see in the wild is plain-text token streaming. Fine for chat. Not fine for a lesson, because a lesson is structured. If the renderer doesn't know whether the next chunk is the third line of a code block or the start of a new paragraph, it can't lay it out, can't syntax-highlight, can't show a quiz card with the right affordances. Plain-text streaming forces you back into a single monospaced typewriter. Useful for vibes, useless for a real product surface.

## The hard parts (three of them)

### 1. Partial blocks

Imagine a 12-line code block. The model has produced 5 lines so far. What do you render?

Naive answer: render the 5 lines as plain text and re-paint when more arrive. This is what plain-text streaming does and it's noticeably bad. The layout reflows, the syntax highlighter flickers, the eye snaps to whichever character just arrived.

Better answer: the block has a *committed* shape — it is a code block, in language `X`, of expected size `Y` — before its content is complete. Once the renderer knows it's looking at a code block, it can mount a code-block component immediately, with a skeleton fill, and stream content into a stable container. No layout reflow, no highlighter flicker, no jumping.

This is the principle: **structure first, content second**. As soon as the agent commits to "the next thing is a code block," the renderer can lay out the slot. The bytes that arrive afterward fill the slot. If the model is mid-thought, the slot has a skeleton; it never has the wrong shape.

For a quiz block, the principle is the same. Render the shell (prompt area + four answer slots) with skeletons, then drop the actual content in as it arrives. The user sees a quiz appearing, not a paragraph mysteriously turning into a quiz at the end.

### 2. Errors mid-stream

Spinner UX has the easier failure story — the request 500s, you show an error, the user retries from zero. Streaming UX doesn't get to do that. The model fails 30 seconds in. The user has read three paragraphs and the start of a code example. What now?

There are three honest options, and we use a mix:

- **Keep what was rendered.** This is the most important one. If we've shown 800 words of correct content, we don't blank the page. We freeze the state, mark the lesson as incomplete, and surface a retry affordance for the *remaining* generation. The user keeps what was already correct.
- **Surface the failure inline.** Where generation stopped, we render a small error block ("this lesson didn't finish generating; retry?") in the document flow itself, not as a toast. The user can see exactly where the break happened.
- **Resume, don't restart, where the agent supports it.** Some generation steps are cheap to redo from scratch; others are not. The retry path is granular. We can re-run the failed node in the LangGraph without redoing the work that already succeeded.

The second-order point: streaming makes failures more legible, not less. With a spinner, a failed lesson is "the request failed, please try again." With streaming, it's "the lesson got partway and then stopped." The user has more information. This is good, but it also means the failure-state UI has to be designed, not bolted on. Which is the part we got wrong; more on that below.

### 3. Block-type discrimination

The single trickiest engineering question in the whole pipeline: how does the renderer know what kind of block it's looking at?

Three patterns we considered, in increasing order of reliability:

1. **Sniff the text.** Look for triple backticks, `# heading` markers, `Q:` prefixes. This works for prose-y output and falls apart the second the model decides to be creative with formatting.
2. **Markers in the stream.** The agent emits `<<BLOCK:code>>` and `<<END>>` sentinels. Better, but you're now layering a homemade protocol on top of a model that doesn't owe you anything.
3. **Structured streaming.** The agent doesn't emit free text. It emits typed events (block opens, block content deltas, block closes) over a transport that preserves the structure. The model is constrained (via tool-use / structured-output features) to produce blocks of a known schema, and the streaming layer surfaces those events as they're committed.

We use the third pattern. It is more work to set up. You need the agent, the schema, the transport, and the renderer to all agree on the same block taxonomy. But it removes an entire category of bug. The renderer never has to *guess* what kind of block it's seeing. The "kind" arrives before the content does.

This is the part most teams skip when they ship streaming. You can ship something that *looks* like Strive in an afternoon by token-streaming a markdown blob and rendering it with `react-markdown`. You will hit the wall the first time you want a quiz, an interactive code runner, a math expression, or any other block that needs more than a `<p>` tag. Structure first is not optional once your blocks have behavior.

## The latency math

Here's the punchline that justifies the whole project.

Suppose a lesson takes 45 seconds to fully generate. With a spinner, the user experiences 45 seconds of nothing followed by a finished lesson. The cognitive cost is 45 seconds of doubt (*is it stuck, did it fail, should I refresh*) followed by an artifact they trust less because they didn't see it being made.

With block-by-block streaming, the user sees the first heading at the moment the agent commits to it, the first paragraph a beat later, a code block mounting with a skeleton and filling in, the next heading, more prose, a quiz card appearing. The wall-clock is still 45 seconds. The *experience* is 43 seconds of progress — two seconds of wait, then a continuous signal that the system is working and getting closer.

The cost of generation didn't change. The user's relationship with the wait did. That's the entire UX dividend. There is no shortcut to a fast model. There is a shortcut to making the wait feel honest — structured streaming is it.

## What this unlocked elsewhere in Strive

Once the streaming pipeline is solid, the same principle applies anywhere the product asks the user to wait on a model:

- **Quiz generation** streams blocks the same way lessons do. The prompt area appears first, then the options, then the explanations.
- **Module-level reveal** lets a user see the shape of an upcoming module (titles, summaries) before the lesson bodies are fully ready.
- **Recall cards** in the daily insights queue surface as soon as their prompts are committed; the answer reveal happens client-side regardless of whether the model has finished generating downstream metadata.

Each of these used to be a spinner-shaped problem. The pattern transferred for free, because the underlying primitive (typed blocks streaming over an authenticated channel) was already in place.

## What we'd do differently

The honest one — we under-invested in failure-state UX for the first six months.

Streaming doesn't reduce error rates. It surfaces them. A spinner-and-wait product can hide a flaky model behind a generic "something went wrong, please try again." A streaming product can't. The failure happens in front of the user, mid-paint, with three correct paragraphs above it. That puts more weight on the design of the inline-failure state, the retry affordance, the resume semantics. We treated those as edge cases for too long. They are not edge cases. They are the price of streaming, and the right time to design them is before launch, not after the first user complaint.

Second one — we should have made the typed-block taxonomy a first-class artifact earlier. For a while we had a loose understanding of which block types existed, with the canonical list living in the renderer's switch statement. That's fine until you want a fourth client (mobile, a print export, a markdown dump for sharing). The block taxonomy is a contract; treat it like one.

## Takeaway for engineers building generative AI products

If you're shipping anything where a model writes and a human waits:

1. **Pick streaming, but pick structured streaming.** Token-by-token markdown looks impressive in a demo and runs out of room the moment you want behavior on top of the rendered output. Commit to typed blocks early; the renderer cost amortizes the moment you have more than one block type.
2. **Render the slot before the content.** Skeletons inside known-shape blocks are the difference between "things appearing in order" and "the layout is jumping around as bytes arrive." The user reads the former as progress and the latter as instability.
3. **Design the failure state before the success state.** Streaming makes errors more visible; that's a feature for the user and a forcing function for you. Inline error blocks, granular retry, partial-keep semantics: these are not polish, they are the contract.
4. **Stop optimizing for first-byte-out and start optimizing for first-useful-render.** A 200ms first byte that is a meaningless `{` doesn't help anyone. A 2-second first byte that is a real heading the user can read does.

The reason we don't show a spinner isn't that we have a faster model. It's that we don't trust the wait when nothing's happening, and we assume our users don't either. Streaming is the way to make a wait honest. The engineering it asks for is real, but it's the kind of work that compounds. Once your pipeline can stream typed blocks reliably, every subsequent feature that involves a model and a wait is an easier problem.

That's the engineering bet. Six months in, we'd make it again.
