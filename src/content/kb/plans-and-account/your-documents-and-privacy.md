---
title: Your documents and your privacy
slug: your-documents-and-privacy
topic: plans-and-account
summary: What happens to a file or a link you give Strive — where it is stored, which companies process it, how long it is kept, what deletion actually deletes, and what you are promising us when you upload something.
tags: [privacy, documents, data, retention, account]
order: 15
updated: '2026-07-30'
related: [your-privacy-on-strive, build-a-course-from-your-documents, privacy-policy]
---

When you build a course from your own material, you are handing us something we know nothing about. This page says plainly what we do with it. The binding version is the [Privacy Policy](/privacy); nothing here is meant to add to it or soften it.

## Where your files live

Four copies exist while your course does:

- **The file exactly as you uploaded it**, and the text of any page we fetched for you, in Amazon S3 in the EU.
- **The text we extracted**, split into passages, in our primary database — MongoDB Atlas, in the EU.
- **Numeric representations (embeddings) of those passages**, in Pinecone, in the United States. These are what let a lesson find the right passage of your material.
- **A record linking all of the above**, so that every copy can be found and deleted together.

Files are stored under your own account and the specific course they belong to. We do not pool identical files across users: if two people upload the same PDF, we hold two separate copies, each reachable only from its own account.

Your material is private to you. It is never shown to another learner, never published, and never shown back to you as an article in its own right.

## Who processes them

Delivering the feature means sending your material to a small number of companies, each bound by a data-processing agreement. The ones that touch source material:

| Who | What they receive |
| --- | --- |
| Anthropic | The text of your documents and of pages we fetched, and the image bytes of pictures you upload and of scanned pages we cannot read as text |
| OpenAI | Embeddings of your material; safety screening of the text and image bytes of everything you upload; transcription of audio files |
| Pinecone | The embeddings, for retrieval |
| Amazon Web Services (S3) | The uploaded files and fetched page text, in the EU |
| MongoDB Atlas | The extracted passages, in the EU |
| Jina (Reader) | The address behind a link you submit — this is the service that actually fetches the page |

Anthropic, OpenAI and Pinecone are in the United States; we rely on the EU Standard Contractual Clauses and, where the recipient is certified, the EU–US Data Privacy Framework. Section 3 of the [Privacy Policy](/privacy) is the full list of everyone we use, source material or otherwise.

A note on links, because it surprises people: **we fetch the page, you don't — and we don't open it from our own servers either.** The address goes to Jina Reader, which requests the page once and returns its main text. That is deliberate; it is what stops the feature being pointed at systems it should never reach. Jina receives the address you typed and nothing that identifies you.

## We do not train models on your material

We do not use your documents, your links or anything derived from them to train AI models. The providers we send that material to are contractually prohibited by their own API terms from training on it. They keep short-lived operational copies — broadly 7 to 30 days — for abuse monitoring, and then delete them.

What we cannot do is audit those companies. We can tell you what their terms say and that we have no reason to doubt them; we cannot and do not guarantee third-party behaviour beyond their published terms. That is the honest boundary of the promise.

## How long we keep it

**Documents you upload** — the file, the extracted text, the passages and the embeddings — are kept for as long as the course built from them exists. An upload that never becomes a course is deleted after 30 days.

**Pages we fetched from links you submitted** are deleted **90 days after your course is built**, or when you delete the document, the course or your account, whichever comes first. Where the page comes from a news or press site we shorten that to **30 days**. We recognise press sites from a hand-maintained list of publisher domains: it covers the large publishers and it is not exhaustive, so a news site we have not listed gets the ordinary 90-day window rather than the shorter one.

A daily job does the deleting. After it has run we keep only the link itself, when we fetched it, a fingerprint of the text, the rights-reservation signal we read before fetching, and the specific excerpts your lessons draw on — the last so that a lesson already grounded in the page does not lose its footing.

Copies held by our AI providers expire on their own cycles. Copies in our backups expire on our normal backup cycle.

## Deleting a document, a course, or your account

**Delete a document** and the file goes, along with the text we extracted, the passages and the embeddings. The course generated from it stays — that course is yours, and it survives the source it came from.

**Delete a course** and every source attached to it goes with it: the stored files, the fetched page text, the passages and the embeddings.

**Delete your account** and both happen for every course you have, immediately. There is no recovery window and we cannot undo it. Deletion is available to you directly, in **Profile → Account**.

## What survives account deletion

A few things are deliberately not removed, and you should know which before you need to. The one that concerns uploads:

**Illegal-content flags.** If an automated safety check matches an upload against a child-sexual-abuse-material hash database, we keep an evidence record — your user id, the document id, the provider's match reference — and a quarantined copy of the file. This is a legal preservation obligation and it overrides deletion. The record expires automatically after a year; the quarantined copy is removed once the preservation period ends.

Three others survive deletion for reasons unrelated to documents: a one-way hash of your email address used to stop free-allowance farming, your recorded cookie choice, and your transaction records at Stripe. Section 5.1 of the [Privacy Policy](/privacy) sets out all four in full, including how long each is kept.

## What you're promising when you upload

Section 6.1 of our [Terms of Service](/terms) asks something of you in return, and it is worth reading before you upload a folder you didn't create. For every file and every link, you warrant that you own it or are otherwise entitled to use it this way; that giving it to us breaches nobody's intellectual-property, confidentiality or privacy rights, and breaches no agreement you are personally bound by — a subscription, a licence, an employment term; and that it contains no special-category personal data about other people.

Please don't give us pirated books or courses, material behind a paywall or a login you aren't entitled to share, other people's confidential or personnel files, or anything unlawful where you are.

**We do not check any of that.** We do not verify who owns your material, whether you are licensed to use it, or whether it is what it appears to be. We run automated safety checks and we may refuse material — but a safety filter is not a rights clearance, and it should not be mistaken for one.

## Getting a copy of your data

There is no download button. We haven't built one, and we would rather say so than imply otherwise. To exercise your right of access or your right to data portability, email **admin@strive-learning.com** and we will assemble your data and send it to you. The same address covers the rest of your rights under the GDPR. We respond within 30 days.

## Reporting infringing material

If you believe material on Strive infringes your rights, email **admin@strive-learning.com** with what the material is and where it is, what right you hold and why you hold it, your contact details, and a statement that your notice is accurate and made in good faith. We aim to acknowledge within **2 working days** and to act within **7 days**, faster where the material is plainly unlawful. Where we restrict or remove anything, we tell the affected user what we did and why.

**If you publish a site and don't want us to fetch from it**, the fastest route is a machine-readable reservation. Before every fetch we read your `/robots.txt`, matched against our product token `StriveFetch`, and your `/.well-known/tdmrep.json`, and we refuse any page either of them reserves. Those two are the signals we read: we do not currently read the `Content-Signal` response header, and we do not parse a reservation written out in prose in your terms. If yours is expressed some other way, email the address above with your domain and we will stop fetching from it and delete the copies we hold, within 7 days. You don't need to give a reason.

**If you are mentioned in a page we fetched**, email the same address. We will delete the stored copy of that page and tell you what we did.
