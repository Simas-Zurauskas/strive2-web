---
title: Privacy Policy
slug: privacy-policy
topic: legal
summary: How Strive collects, uses, shares, and protects personal data — documents and links you give us, sub-processors, retention, your GDPR rights, notice and takedown, and your responsibilities.
tags: [privacy, gdpr, data-protection, legal]
order: 10
updated: '2026-07-30'
related: [terms-of-service, your-privacy-on-strive]
---

Strive ("we", "us") is operated by **MB Kūrybinis kodas**, a small partnership registered
in the Republic of Lithuania. We are the data controller for the personal data described
below. Contact: **admin@strive-learning.com**.

## 1. Data we process

| Category | Examples | Legal basis (GDPR Art. 6) |
| --- | --- | --- |
| Account data | name, email, hashed password, OAuth identifiers | Contract (Art. 6(1)(b)) |
| Usage data | learning goals, courses created, lessons completed, quiz answers, review ratings, notes | Contract |
| Inputs to AI | the prompts and answers you submit to generate or refine course content | Contract |
| Source material | the documents you upload and the links you submit, plus everything we derive from them — see § 1.1 | Contract; legitimate interest for third-party data inside a page we fetched (Art. 6(1)(f)) |
| Billing data | plan, billing cycle, Stripe customer + subscription IDs, payment status | Contract; legal obligation for tax records |
| Device & technical data | IP address, browser, device type, request IDs, error events | Legitimate interest (security, fraud prevention, debugging) |
| Marketing preferences | your email address, whether you have objected to product-update email, and when | Art. 81(2) of the Lithuanian Law on Electronic Communications, and legitimate interest (Art. 6(1)(f)) — see § 2 and § 7 |
| Cookie / analytics data | Mixpanel events (including your name and email once you sign in), Google Analytics 4 hits, Google Ads conversion signals, Vercel page views, Sentry error events and error-triggered session replays | Legitimate interest (Art. 6(1)(f)) — these run **unless you turn them off**; see § 6 for exactly what loads and how to stop it |

We do not knowingly process special-category data (health, biometrics, religion, etc.).
**You are responsible for what you submit.** Do not enter, paste, upload or otherwise
submit through any input field (course goals, wizard answers, notes, chat, attachments,
uploaded documents, submitted links) any of the following: special-category data within
the meaning of Art. 9 GDPR; personal data of third parties without lawful basis;
payment-card numbers or full credentials; content protected by copyright that you do not
have the right to submit; or content that is illegal in your jurisdiction. Section 6.1 of our
[Terms of Service](/terms) sets out what you warrant when you give us source material.

### 1.1 Documents you upload and links you submit

When you build a course from your own material we process:

| What | Where it is kept | Legal basis |
| --- | --- | --- |
| The files you upload, as you uploaded them | Amazon S3 (EU) | Contract (Art. 6(1)(b)) |
| The text of a page we fetched because you submitted its link | Amazon S3 (EU) | Contract for your request; **legitimate interests (Art. 6(1)(f))** for any personal data about other people inside the page |
| Text extracted from that material, split into passages | MongoDB Atlas (EU) | Contract |
| Numeric representations (embeddings) of those passages | Pinecone (United States) | Contract |
| A record linking all of the above, so that we can delete every copy together | MongoDB Atlas (EU) | Contract; legal obligation (Art. 17 GDPR) |

**This material is sent to our AI providers.** To build your course, the text of your
documents and of any page we fetched is sent to **Anthropic** and **OpenAI** through their
business APIs. Their terms prohibit them from training models on it. They keep short-lived
operational copies (broadly 7–30 days) for abuse monitoring before deleting them.

**When you submit a link, we — not you — fetch the page, and we use a third party to do
it.** We do not open the address from our own servers. We pass it to **Jina Reader**, an
external reading service (see § 3), which requests the page once and returns its main text
to us. That is a deliberate design choice: our servers never open a web address that
someone has typed into Strive, which is what stops the feature being used to reach systems
it should not. Jina receives the address you submitted; the request carries no name, email
or account identifier of yours.

Before that happens, our servers do read two fixed files on the site itself — its
`robots.txt` and its `/.well-known/tdmrep.json` text-and-data-mining reservation — so that
we can honour a publisher's machine-readable opt-out. We fetch each page once, on your
request, only if it is openly available. We do not crawl sites and we do not get around
paywalls or logins. What we fetch may contain personal data about other people.
Where it does, we rely on our legitimate interest in providing the learning service you
asked for, weighed against those people's interests, and we keep that assessment on file.
Notifying everyone mentioned in a fetched page individually is not possible, so this notice
is how we tell you what we do.

**Objecting.** If you are mentioned in a page we fetched, or you publish a site you do not
want us to fetch from, email **admin@strive-learning.com** — see § 12.

## 2. Why we process it

To provide and operate the service, run AI-generated lessons, build courses from the
documents and links you give us, gate paid features, send account and security email,
**tell you about new Strive features by email**, prevent abuse, comply with tax and
accounting law, and measure how the product is used and how people find it — that last one
on the basis of our legitimate interest, and running unless you turn it off (§ 6), not on
the basis of your consent. We may also process your data to enforce our Terms of Service and
to defend legal claims.

**Product-update email.** If you have registered a Strive account and confirmed your email
address, we may occasionally email you about new Strive features and improvements to the
service you signed up for. We only ever send you our own similar services — never a third
party's offer, and never a product unrelated to Strive.

Our basis is **Article 81(2) of the Lithuanian Law on Electronic Communications**. That
provision lets a supplier email direct marketing for its **own similar** products or
services to a person **whose contact details it obtained from that person in the course of
supplying a product or service to them**, provided the person is given a clear and free
opportunity to object **both when the details are collected and in every message**. We rely
on it on the footing that registering for Strive and using it makes you our customer for
this purpose. That reading of "customer" follows the Court of Justice's judgment in
*Inteligo Media* (C-654/23); the Lithuanian supervisory authority has taken a narrower view
of who counts. And if you registered before we began giving that notice at signup, you were
not given the opportunity to object at the point of collection — you have it now, in every
message we send and in your profile. Alongside that we rely on our **legitimate interest**
in telling you what the product you registered for can now do (Art. 6(1)(f)). We do not
claim that you consented to this. **You can stop it at any time**:
use the one-click unsubscribe link in any such email — no login needed — or the toggle in
**Profile → Account**. We act on it at once and keep a record that you objected, so that we
keep honouring it. Stopping product-update email never affects account, security or billing
email, which we must send you either way. Your right to object is set out in § 7.

## 3. Recipients (sub-processors)

Personal data is shared only with the third parties strictly required to deliver the
service. Each is bound by a data-processing agreement under GDPR Art. 28.

| Sub-processor | Purpose | Region |
| --- | --- | --- |
| Anthropic (Claude) | LLM that generates course, lesson, quiz and chat content — receives the text of documents you upload and of pages we fetch, and the **image bytes** of pictures you upload and of scanned pages we cannot read as text | United States (SCCs / DPF) |
| OpenAI | Embeddings of lesson content and of your source material, used for retrieval; **safety screening** of the text and the **image bytes** of everything you upload; **transcription of audio files** you upload | United States (SCCs / DPF) |
| Black Forest Labs (BFL) | Image-generation model for lesson hero illustrations | Germany (HQ); API region pending verification |
| Pinecone | Vector store for retrieval over lesson content and your source material | United States (SCCs / DPF) |
| Amazon Web Services (S3) | Hosting of generated assets (audio, images) and of your uploaded documents and fetched page text | EU |
| MongoDB Atlas | Primary database | EU |
| Stripe | Payments and subscription billing | EU + United States (SCCs / DPF) |
| Mailjet | Transactional email always; product-update email to registered users on the basis in § 2, which you can stop at any time | EU |
| Google (Sign in with Google) | Authenticates you if you choose Google sign-in — Google sees that you signed in to Strive and returns your name, email address and Google account id | United States (SCCs / DPF) |
| Mixpanel | Product analytics — receives your name and email address once you are signed in. Runs unless you choose essential-only (§ 6) | EU host |
| Google Analytics 4 + Google Ads | Web analytics and advertising-conversion measurement. Runs unless you choose essential-only (§ 6) | United States (SCCs / DPF) |
| Vercel (Web Analytics) | Page-view and visitor measurement on every page of the site. **Not covered by the cookie choice** — it loads regardless (§ 6) | United States (SCCs) |
| Sentry | Error and performance monitoring, and **session replay**: when an error occurs, a recording of that browsing session may be uploaded (roughly one in ten error sessions) so we can see what led to it | EU |
| Google Cloud (Text-to-Speech) | Lesson narration audio synthesis | EU/US (SCCs / DPF) |
| Judge0, reached through RapidAPI | Sandboxed code execution for code-running exercises. The code **leaves your browser**: it is sent from our servers to RapidAPI, which routes it to Judge0 | United States (RapidAPI). Judge0's own execution region is not published, and the endpoint we use is configurable |
| Jina (Reader) | URL reader — this is the service that actually fetches the page behind a link you submit, and pages our AI agents look up (§ 1.1) | United States (SCCs) |
| Tavily | External web search for AI agents | United States (SCCs) |
| Appzi | In-app feedback widget, in the signed-in area. Runs unless you choose essential-only (§ 6) | United States (SCCs) |

We do not sell personal data and do not share it for any third-party advertising other
than the conversion tracking listed above. AI prompts you submit, the text of documents you
upload and the text of pages we fetch are sent to the LLM providers via API. Their API
terms prohibit training on that input, and we do not use your material to train models
ourselves. We cannot and do not guarantee third-party provider behaviour beyond their
published terms.

## 4. International transfers

Where a sub-processor is outside the European Economic Area, we rely on the EU
Standard Contractual Clauses and, where the recipient is certified, the EU–US Data
Privacy Framework.

## 5. Retention

Account, usage, billing and AI-input data are kept while your account exists. **Deleting
your account deletes them immediately** — there is no recovery window and we cannot undo
it. That includes your allowance ledger and our per-request usage records.

**Billing records.** We do not keep our own copy of your transactions after you delete your
account. The records we have to keep for accounting purposes — which under Lithuanian law
run to **10 years** — are held by **Stripe**, our payment processor, against the Stripe
customer record rather than against your Strive account. Deleting your Strive account does
not delete them, and we cannot delete them without breaching that obligation.

**Analytics and error data.** Mixpanel: when you delete your account we ask Mixpanel to
delete your **profile**, which removes the profile properties we set — including your name
and email address. That request does **not** retroactively erase the individual events
already recorded against your id, and we do not claim it does. Erasing those as well is a
request under § 7. Sentry error events and any session replays expire on the
retention period set on our Sentry organisation, which we do not state here as a promise
because it is an account setting rather than something built into the product; if the exact
window matters to you, ask us and we will tell you what it is currently set to.

**Documents you upload.** The file, the text we extracted from it, the passages and the
embeddings are kept for as long as the course built from them exists. They are deleted when
you delete the document, the course or your account. Uploads that never produce a course are
deleted after 30 days.

**Pages we fetched from links you submitted.** We delete the fetched text **90 days after
your course is built**, or when you delete the document, the course or your account,
whichever comes first. Where the page comes from a news or press site we shorten that to
**30 days**. We recognise press sites from a hand-maintained list of publisher domains: it
covers the large publishers and it is not exhaustive, so a news site we have not listed
gets the ordinary 90-day window rather than the shorter one. A daily job does the deleting.
After it runs we keep only the link, when we fetched it, a fingerprint of the text, the
rights-reservation signal we read before fetching, and the specific excerpts your lessons
draw on.

**Copies held by others.** Copies held by our AI providers expire on their own cycles
(broadly 7–30 days). Copies in our backups expire on our normal backup cycle.

**Marketing records.** If you object to product-update email we keep a record of the
objection for as long as we hold your email address, because that record is what stops us
emailing you again.

### 5.1 What survives account deletion

Deleting your account removes your courses, lessons, chats, notes, progress, uploaded
documents, fetched page text, embeddings, allowance ledger and usage records. A few things are
deliberately not removed with it, and you should know what they are:

| What stays | What it contains | How long |
| --- | --- | --- |
| Abuse-prevention record | A one-way **hash** of your email address (not the address itself), plus how many times it has signed up and how much free allowance it has been granted and used. No name, no content. | 365 days from the last signup with that address |
| Cookie-choice records | The choice you made about cookies, the policy version, a truncated IP address, your browser string — and **your user id**. These are the record that demonstrates what you chose, and account deletion does not remove them. | 24 months from when each choice was recorded |
| Illegal-content flags | If an automated safety check matches an upload against a child-sexual-abuse-material hash database, we keep an evidence record (your user id, the document id, the provider's match reference) and a quarantined copy of the file. This is a legal preservation obligation and it overrides deletion. | The record expires automatically after 1 year; the quarantined copy is removed once the preservation period ends |
| Records held by Stripe | Your transactions, under the accounting rule above. | 10 years |

Everything in that table is either a one-way hash, a legal obligation, or the proof of a
choice you made. None of it is used to build a profile of you or to market to you.

## 6. Cookies, analytics and what loads when

**Strive runs on an opt-out model, not an opt-in one.** We are describing it plainly here
rather than claiming otherwise, because what the banner does and what a policy says should
match.

**Before you make any choice**, on your first visit, the following are already running:
Google Analytics 4 and Google Ads conversion measurement (loaded in the page head, with all
six Google consent signals set to *granted*); Mixpanel product analytics; Vercel Web
Analytics; Sentry error monitoring including error-triggered session replay; and, once you
are signed in, the Appzi feedback widget. Only your authentication session and your theme
preference are genuinely unavoidable.

**Choosing "essential only"** in the banner flips Google's four analytics- and
advertising-storage signals to *denied*, so gtag.js continues to run but cookielessly; it
stops Mixpanel initialising at all; and it stops the Appzi widget loading on subsequent page
loads. **It does not stop Vercel Web Analytics**, which runs on every page either way, and
it does not stop Sentry error monitoring or session replay.

One limitation worth stating: if a script has already loaded in that browsing session,
turning it off stops us loading it again but does not retract cookies it has already set.
Closing the tab and clearing site data does.

| What | What it is for | What "essential only" does to it |
| --- | --- | --- |
| Authentication session, theme preference | Keeps you signed in; remembers light/dark | Nothing — always on, and the service does not work without it |
| Google Analytics 4, Google Ads | Web analytics and advertising-conversion measurement | Switches its four storage signals to *denied* — gtag.js keeps running, but cookielessly |
| Mixpanel | Product analytics; receives your name and email once signed in | Turns it off |
| Appzi | In-app feedback widget in the signed-in area | Turns it off |
| Vercel Web Analytics | Page views and visitor counts | **Nothing — it keeps running** |
| Sentry | Error monitoring, plus session replay on roughly one in ten error sessions | **Nothing — it keeps running** |

**Our basis for the analytics and advertising-measurement processing is legitimate interest
(Art. 6(1)(f))** — understanding how the product is used and how people find it — not your
consent. We are not going to describe as consent something you were never asked for.

**How to change it.** Use the **Cookie preferences** button in the site footer: it clears
your stored choice and brings the banner back, so you can pick "essential only". You can
also clear the `strive:cookie-consent` key in your browser's storage, which has the same
effect. We keep a record of the choice you make — see § 5.1.

## 7. Your rights

Under the GDPR you have the right to: access, rectify, erase, restrict, object to, and
port your personal data; to withdraw any consent you have given; and to lodge a
complaint with a supervisory authority.

Two of these you can exercise yourself, straight away, from **Profile → Account**: editing
your details, and deleting your account. **There is no self-service export button** — we
have not built one. To exercise your right of access or your right to data portability
(Articles 15 and 20), email **admin@strive-learning.com** and we will put the data together
and send it to you. For any of the other rights, write to the same address. We will respond
within 30 days.

**Product-update email.** You can stop it at any time: use the unsubscribe link in any such
email — one click, no login — or turn it off in **Profile → Account**. We act on it at once
and keep a record that you objected, so that we keep honouring it. This is your right to
object under Articles 21(2) and (3) GDPR, and you never need to give us a reason.

The Lithuanian supervisory authority is the **State Data Protection Inspectorate**
(Valstybinė duomenų apsaugos inspekcija, **vdai.lrv.lt**). You can also lodge a
complaint with the supervisory authority of the EU/EEA member state where you live or
work.

## 8. Aggregated and de-identified data

We may create aggregated, statistical, or de-identified data from your usage of the
service (data that cannot reasonably be used to identify you). Aggregated and
de-identified data is not personal data and we may use, retain and disclose it for any
lawful purpose, including service improvement, research, benchmarking and external
publication.

## 9. Automated decision-making and AI transparency

Strive does not make automated decisions that produce legal or similarly significant
effects on you (Art. 22 GDPR). The AI generates course content and grades free-recall
answers, but you remain in full control of how you use these outputs. **AI-generated
output may be incorrect, incomplete, biased or out of date; you should verify anything
you act on.**

Strive's lessons, quizzes, recall cards, chat replies, illustrations and narration are
**generated by artificial intelligence**, and our lesson and course mentors are AI systems
rather than people. We are working towards marking AI-generated output in a machine-readable
form so that it can be recognised as artificially generated. That marking obligation —
Article 50(2) of Regulation (EU) 2024/1689 (the AI Act) — applies to systems already on the
market from **2 December 2026**, under Article 111(4) as amended by Regulation (EU)
2026/1744, and we intend to meet it by then. Section 2.1 of our
[Terms of Service](/terms) carries the same disclosure.

## 10. Children

Strive is not directed at children under **16**. We do not knowingly create accounts for
children under that age. If you believe a child has registered, contact us and we will
delete the account.

## 11. Changes to this policy

We may update this policy. The "last updated" date at the top reflects the current
version. Material changes will be notified by email or in-product before they take effect.

## 12. Notice and takedown

**Reporting content.** If you believe content on Strive is illegal, or infringes your
rights, email **admin@strive-learning.com** with: what the content is and where it is; why
you believe it is illegal or infringing; what right you hold, if you are asserting one;
your name and contact details; and a statement that your notice is accurate and made in
good faith. This is our notice mechanism under Article 16 of the Digital Services Act. We
aim to acknowledge within **2 working days** and to decide within **7 days**, faster where
the content is plainly unlawful. We will tell you what we decided and why.

**If we act on your content.** Where we remove or restrict content, or suspend or close an
account, we tell the affected user what we did, on what ground, whether the decision was
automated, and how to challenge it — as Article 17 of the Digital Services Act requires.
Write to the same address and a person will review it again.

**Publishers and site owners.** If you do not want Strive to fetch pages from your site, the
fastest and most reliable route is a machine-readable reservation. Before every fetch — for
links a learner submits and for pages our AI agents look up — we read two files on your
site: **`/robots.txt`**, matched against our product token `StriveFetch` per RFC 9309, and
**`/.well-known/tdmrep.json`**, the W3C TDM Reservation Protocol. A reservation in either
one means we refuse the page. Those two are the signals we read today: we do not currently
read the per-response `Content-Signal` header, and we do not parse reservations written in
prose in a site's terms and conditions. If your reservation is expressed some other way,
email the address above with your domain and we will stop fetching from it and delete the
copies we hold, within **7 days**. You do not need to give a reason.

**If you are mentioned in a page we fetched.** Email the same address. We will delete the
stored copy of that page and tell you what we did.
