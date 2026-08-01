---
title: Your privacy on Strive
slug: your-privacy-on-strive
topic: plans-and-account
summary: What Strive stores, what we do with it, and the things we explicitly don't do — like training models on your study data or the documents you upload.
tags: [privacy, data, account]
order: 10
updated: '2026-07-30'
related: [understanding-your-allowance, privacy-policy, terms-of-service]
---

We take privacy seriously. This page is the friendlier sibling of our [privacy policy](/privacy) — it explains, in plain language, what Strive stores about you and what we do with it.

## What we store

- **Account information.** Your name, email, and authentication provider details (Google or password) when you create an account.
- **Course and learning data.** Your generated courses, lessons you've studied, your notes, your bookmarks, your recall-card review history, and your quiz attempts. This data is stored so that *you* can come back to it.
- **Documents you upload and links you submit.** If you build a course from your own material, we keep the file itself, the text we pull out of it, that text split into passages, and numeric representations (embeddings) of those passages. Files and fetched page text live in Amazon S3 in the EU; the passages live in our EU database; the embeddings live in Pinecone (United States).
- **Billing data.** Your subscription tier, allowance balance, ledger entries, and top-up history. Card details themselves are stored by Stripe, our payment processor — Strive never sees or stores your card.
- **Usage telemetry.** Analytics events about which features are used and how often, so we can improve the product. Worth knowing how this actually works: **analytics run by default and stop only if you turn them off.** On your first visit — before you touch the cookie banner — Google Analytics, Google Ads conversion measurement, Mixpanel, Vercel Web Analytics and Sentry error monitoring are already running. Choosing **essential only** in the banner stops Mixpanel and the Appzi feedback widget outright and tells Google to run cookielessly; Vercel Web Analytics and Sentry keep running either way. Mixpanel receives your name and email address once you are signed in, and Sentry records a replay of the browsing session on roughly one in ten sessions where an error occurs. You can bring the banner back any time with **Cookie preferences** in the site footer. Section 6 of the [privacy policy](/privacy) is the full list.

## What we don't do with your data

A few promises that matter:

- **We don't train AI models on your private study content.** Your notes, bookmarks, quiz attempts, review history and the documents you upload are private to you. They never feed back into model fine-tuning or content generation for other users, and the AI providers we send them to are contractually prohibited from training on them.
- **We don't sell your data.** Not to advertisers, not to brokers, not to anyone. The one thing that goes to an advertising platform is conversion measurement — Google Ads is told that a signup or a purchase happened — and that runs unless you choose essential-only cookies. Nothing else is shared for advertising.
- **Your private content stays private to you.** Notes, bookmarks, and ratings never appear in another learner's view. Course structures are private to the learner who created them. A document you upload is never shown to another user.

## What does feed AI generation

When *you* are studying, your goal text and your wizard answers are sent to AI providers (Anthropic for course design, OpenAI for embeddings) to generate course structure, lesson content, and quiz questions. If you built the course from your own material, the text of your documents and of any page we fetched goes to the same providers. These calls are scoped to your active session — they're not used to train the providers' models, and they're not shared with other users.

Two things about uploads that people don't expect, so we'll say them plainly. **Images leave as images**: a picture you upload, or a scanned page we can't read as text, is sent as image data — to OpenAI for the safety check, and to Anthropic to be transcribed. **Audio leaves as audio**: an audio file you upload is sent to OpenAI to be transcribed. Every upload is safety-screened by OpenAI before anything else happens to it. Same rule applies — no training, not shared with other users.

## When you submit a link

You paste a link; **we** fetch the page, once — you don't. But we don't open it from our own servers: we hand the address to **Jina Reader**, an external reading service, which requests the page and sends us back its main text. That's deliberate. Our servers never open a web address someone typed into Strive, which is what keeps the feature from being pointed at things it shouldn't reach.

We only fetch pages that are openly available — we don't log in, don't pay, and don't get around paywalls. Before the fetch, our servers do read two fixed files on the site itself: its `robots.txt` and its `/.well-known/tdmrep.json` text-and-data-mining reservation. If either one asks automated systems to stay away, we refuse the link and show you why in the course builder. Those two signals are the ones we read — not the `Content-Signal` header, and not a reservation written out in a site's terms. We don't crawl sites and we don't re-fetch on a schedule.

## How long we keep things

As long as your account is active, your data stays with you. Some specifics:

- **Uploaded documents** and everything we derive from them live as long as the course built from them does. Delete the document, the course or your account and they go. An upload that never becomes a course is deleted after 30 days.
- **Pages we fetched from your links** are deleted 90 days after the course is built, or when you delete the course, whichever comes first. If the page came from a news or press site we cut that to 30 days — we spot those from a hand-maintained list of publisher domains, which covers the big publishers but isn't every news site on the web; anything not on it gets the ordinary 90 days. A daily job does the deleting. After it runs we keep only the link, when we fetched it, a fingerprint of the text, and the excerpts your lessons draw on.
- **Almost everything else** goes the moment you delete your account — courses, lessons, notes, bookmarks, recall-card history, quiz attempts, your allowance ledger. Deletion is immediate; there's no grace period and we can't undo it. Active subscriptions are cancelled and any unspent top-up balance is forfeit (we make this explicit on the deletion confirmation screen so you can use up the balance first if you want). If *we* ever close your account for a reason other than something you did, that is different — the [Terms](/terms) say we refund the unused part of what you paid.
- **Four things deliberately outlive deletion**, and it's better you hear it here than find out later: a one-way **hash** of your email address with signup counters, kept a year, so the free-allowance grant can't be farmed by re-registering; your recorded **cookie choice** (with your user id, a truncated IP and your browser string), kept 24 months, because it's the proof of what you chose; any **illegal-content flag** raised by the automated child-safety check, kept a year, with the quarantined copy of the file removed once that preservation period ends — a legal duty we cannot waive; and your **transaction records at Stripe**, kept 10 years under accounting law. Section 5.1 of the [privacy policy](/privacy) has the detail.

## Email from us

Account and security email — verification, password resets, security alerts — always comes to you; it is part of running your account. Separately, we may occasionally email you about new Strive features. You can turn that off at any time from **Profile → Account**, or with the one-click unsubscribe link in any such email — no login needed. Turning it off never stops the account and security email.

## Reporting something

If content on Strive is illegal or infringes your rights, or you publish a site you do not want us to fetch from, email **admin@strive-learning.com**. We aim to acknowledge within 2 working days and act within 7 days. Section 12 of the [Privacy Policy](/privacy) sets out exactly what to include.

## Asking us anything

If you have a privacy-specific question, email **admin@strive-learning.com**. For general questions, the help center search and the AI guide can usually answer without needing a human in the loop. The full legal text — including sub-processors, retention periods, your GDPR rights and our data-handling commitments — lives in the [Privacy Policy](/privacy).

**Want a copy of your data?** There's no download button — we haven't built one. Email the address above and we'll assemble your data and send it to you. Same address for anything else on the GDPR list; we answer within 30 days.
