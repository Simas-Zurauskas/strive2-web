---
title: Your material is not training data
slug: your-material-is-not-training-data
summary: When you upload documents to an AI product, the question underneath every other question is what happens to them. Here is the full answer for Strive — where files go, who processes them, how long anything is kept, what deletion actually deletes, and the places where the honest answer is a hedge.
category: product
author: Simas Zurauskas
published: 2026-07-30
tags:
  - privacy
  - data protection
  - documents
  - gdpr
  - product
---

Strive can now build a course from material you upload. The first question people ask about that feature is not about the course. It is some version of: *and then what happens to my files?*

It is the right question, and most products answer it with a sentence on a landing page. What follows is the long answer, written so that every line of it can be checked against our [Privacy Policy](/privacy) and our [Terms](/terms). Where those documents hedge, this post hedges in the same place. That is the only version worth publishing.

## What happens to a file you upload

Four things come into existence when you add a document to a course.

**The file itself**, exactly as you uploaded it, goes to Amazon S3 in the EU. So does the text of any page we fetched because you submitted a link.

**The text we pull out of it**, split into passages, goes to our primary database — MongoDB Atlas, in the EU.

**Numeric representations of those passages** — embeddings — go to Pinecone, in the United States. These are what let a lesson find the relevant part of your material rather than the whole of it.

**A record linking all of the above**, so that every copy can be found and deleted together. That record exists specifically so that deletion is a single operation rather than a hopeful sweep.

Storage is scoped to your account and to the course the material belongs to. We do not pool identical files across users: if two people upload the same PDF, there are two copies, each reachable only from its own account.

## Who sees it

A short list, and the whole list. Each of these is bound by a data-processing agreement, and Section 3 of the Privacy Policy names every one of them:

- **Anthropic** receives the text of your documents and of pages we fetched, plus the image bytes of pictures you upload and of scanned pages we cannot read as text.
- **OpenAI** receives embeddings of your material, the text and image bytes of everything you upload for safety screening, and audio files for transcription.
- **Pinecone** holds the embeddings.
- **Amazon Web Services** holds the files and the fetched page text, in the EU.
- **MongoDB Atlas** holds the extracted passages, in the EU.
- **Jina Reader** receives the address behind a link you submit — it is the service that actually fetches the page. It gets the address and nothing that identifies you.

Two of those deserve a sentence each. Images leave as images: a photograph or a scanned page is sent as image data, not as text someone transcribed first. And audio leaves as audio, to be transcribed. People are often surprised by both, so we say them plainly rather than letting "we process your documents" do the work.

Anthropic, OpenAI and Pinecone are in the United States. Transfers there rely on the EU Standard Contractual Clauses and, where the recipient is certified, the EU–US Data Privacy Framework.

## What "we don't train on it" actually rests on

The claim has two halves, and they are load-bearing in different ways.

**We do not use your material to train models ourselves.** That one is entirely within our control. We do not fine-tune on user content, and nothing you upload feeds generation for anyone else. Your notes, your quiz answers, your review history and your documents are private to you.

**The providers we send it to are contractually prohibited from training on it.** That rests on their business API terms. It is a real commitment and it is the industry-standard one for API access as distinct from consumer chat products. Those providers do keep short-lived operational copies — broadly 7 to 30 days — for abuse monitoring, and then delete them.

Here is the hedge, in the same words the Privacy Policy uses: we cannot and do not guarantee third-party provider behaviour beyond their published terms. We are not in a position to audit Anthropic or OpenAI. What we can tell you is which companies receive what, what their terms say, and that we chose the API route rather than anything cheaper precisely because those terms exist. Anyone claiming more certainty than that about a third party's internals is telling you something they cannot know.

## How long any of it stays

**Documents you upload** — the file, the extracted text, the passages, the embeddings — are kept for as long as the course built from them exists. An upload that never becomes a course is deleted after 30 days.

**Pages we fetched from links** are on a shorter clock. We delete the fetched text 90 days after your course is built, or when you delete the document, the course or your account, whichever comes first. Where the page comes from a news or press site we shorten that to 30 days.

That press-site distinction runs off a hand-maintained list of publisher domains. It covers the large publishers and it is not exhaustive, so a news site we have not listed gets the ordinary 90-day window rather than the shorter one. We would rather tell you the mechanism is a list than imply a classifier we don't have.

A daily job does the deleting. After it runs we keep only the link, when we fetched it, a fingerprint of the text, the rights-reservation signal we read before fetching, and the specific excerpts your lessons draw on — that last one so a lesson already built on the page doesn't lose its footing.

Copies held by our AI providers expire on their own cycles. Copies in our backups expire on our normal backup cycle. Both of those are ordinary and both are worth stating, because "deleted immediately" is not true of a system with backups and it would be easy to say anyway.

## What deletion actually deletes

Deleting a document removes the file, the extracted text, the passages and the embeddings. The course generated from it stays — it is your course, and it outlives the source.

Deleting a course removes every source attached to it, across all three stores: the objects in S3, the passage rows in the database, and the vectors in Pinecone.

Deleting your account does both for every course you have, and takes with it your courses, lessons, chats, notes, progress, allowance ledger and per-request usage records. It happens immediately. There is no recovery window and we cannot undo it. You can do it yourself, from **Profile → Account**, without asking us.

## What survives deletion, and why

Four things do not go, and we would rather you read that here than discover it later.

**An abuse-prevention record** holds a one-way hash of your email address — not the address — plus how many times it has signed up and how much free allowance it has been granted. No name, no content. It exists so the free allowance cannot be farmed by re-registering. Kept 365 days from the last signup with that address.

**Cookie-choice records** hold the choice you made, the policy version, a truncated IP address, your browser string and your user id. They are the proof of what you chose, which is exactly why account deletion doesn't remove them. Kept 24 months.

**Illegal-content flags.** If an automated safety check matches an upload against a child-sexual-abuse-material hash database, we keep an evidence record and a quarantined copy of the file. This is a legal preservation obligation and it overrides deletion. The record expires after a year; the quarantined copy is removed once the preservation period ends.

**Your transaction records at Stripe**, kept 10 years under Lithuanian accounting law. We do not keep our own copy after you delete your account, but Stripe holds them against the payment record and we cannot delete them without breaching that obligation.

Every item on that list is a one-way hash, a legal obligation, or the proof of a choice you made. None of it is used to build a profile of you or to market to you.

## What we deliberately don't do

Some of this feature is defined by things we chose not to build.

**There is no public course and no shared library.** A course you generate is visible to you. Your material is never shown to another learner, never published, and never shown back to you as an article in its own right — it exists to build your course and for nothing else.

**We don't pool your files with anyone else's.** Two identical uploads are two copies. Content-addressed deduplication across accounts would save us money and would mean one person's file being reachable through another person's record. We didn't do it.

**We don't crawl.** When you submit a link we fetch that page, once, on your request. We don't follow links from it, don't re-fetch on a schedule, and don't build a corpus out of anyone's site. And before every fetch we read the site's `robots.txt` and its text-and-data-mining reservation file, and refuse the page if either one reserves it.

**We don't check your rights, and we don't pretend to.** Section 6.1 of the Terms asks you to warrant that you own the material or may lawfully use it, and we do not verify that. We run automated safety checks and we may refuse material, but a safety filter is not a rights clearance and calling it one would be a lie of convenience.

**We don't sell data.** Not to advertisers, not to brokers.

## The parts we hedge, and why we hedge them

Three, so the picture is complete rather than flattering.

**Provider internals.** Covered above. Their terms are the boundary of what we can promise.

**Analytics are opt-out, not opt-in.** This has nothing to do with your documents and everything to do with whether we get to describe ourselves as a privacy-first product without qualification. On your first visit — before you touch the cookie banner — Google Analytics, Google Ads conversion measurement, Mixpanel, Vercel Web Analytics and Sentry error monitoring are already running. Choosing *essential only* stops some of them and not others, and Section 6 of the Privacy Policy lists exactly which. Our basis there is legitimate interest, not consent, and we are not going to describe as consent something you were never asked for.

**There is no export button.** You have a right of access and a right to data portability, and we have not built self-service tooling for either. Email **admin@strive-learning.com** and we will assemble your data and send it to you within 30 days. Saying "we haven't built it yet" is worse marketing than saying nothing and better than implying a button that isn't there.

That is the whole of it. If you want the practical side — what to upload and what comes back — [the guide is here](/blog/turn-your-own-material-into-a-course), and the [engineering write-up](/blog/grounding-ai-lessons-in-your-own-sources) covers the pipeline that does the work.
