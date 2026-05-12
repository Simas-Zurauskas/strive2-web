---
title: What 1,820 people told us they wanted to learn — and what it changed about Strive
slug: what-1820-people-want-to-learn
summary: We pulled the onboarding goals from 1,820 v1 signups and ran the cluster analysis. Here's what people actually want from an AI course product, and what we changed because of it.
category: product
author: Simas Zurauskas
published: 2026-05-10
tags:
  - data
  - user research
  - product
  - learner personas
---

When you ship the first version of a product, the most useful thing you collect isn't usage. It's the sentence each person types into the very first input field — before they know what the product is good at, before they know what it costs, before they've been nudged anywhere. That sentence is what they showed up wanting.

Strive's v1 asked two questions on signup: *what do you want to learn?* and *what do you already know about it?* By the time we shut v1 down, 1,820 people had answered the first one. We pulled the dataset and clustered it. This post is the publication-ready version of what we found.

Two things to set up before the data.

**One:** this is a *demand-side* dataset. It tells you what people typed when arriving. It does not tell you who finished a course, who came back the next week, or who paid us anything. Treat every conclusion below as a hypothesis about what people walked in wanting, not a verdict on what worked.

**Two:** there are no names, no emails, no identifiers in any of this. The unit of analysis is a goal string, paraphrased and bucketed. Where I quote, I quote one phrase that's already public elsewhere; everything else is described in aggregate.

With that out of the way.

## The shape of the dataset

1,820 goals. Average length 88 characters — a sentence, not a phrase. About 52% of people left the second field (*what do you already know about it?*) completely blank. Of the rest, roughly a quarter described themselves as beginners, with intermediate and advanced each accounting for low single digits. The remainder wrote something specific: a degree, a job title, a number of years.

Two operational facts came out of that immediately. First, **auto-leveling on empty input is mandatory**. If the modal user gives you no signal about their level, the generator can't ask the user for one mid-flow; it has to infer it or default sensibly and let them adjust. Second, **soft validation matters**. Around 14 of the inputs were junk strings: three or four characters of nothing, fragments of game names, keyboard mash. Today we generate something for every input we receive. We're going to stop doing that, and gate sub-eight-character or non-classifiable goals with a re-prompt.

That's the boring half of the data quality story. The interesting half is what people actually wanted.

## The clusters

I ran a primary-topic, first-match clustering over the goal strings. Manual rules, then a few rounds of cleanup. Here are the top buckets.

| Rank | Cluster | Count | Share |
| --- | --- | --- | --- |
| 1 | Marketing & Sales (SEO, ads, copy, cold outreach) | 196 | 10.8% |
| 2 | Creator economy / personal brand / social media | 144 | 7.9% |
| 3 | Software, web, mobile, game development | 143 | 7.9% |
| 4 | Human language learning | 102 | 5.6% |
| 5 | Academic subjects (STEM + humanities) | 86 | 4.7% |
| 6 | Data analytics, BI, Excel, SQL | 59 | 3.2% |
| 7 | Practical AI / prompt / no-code / automations | 56 | 3.1% |

Below the top seven, things tail off into smaller buckets: creative work, personal finance, AI/ML engineering, product/PM, exam prep, e-commerce, design, devops, and a long tail of single-mention topics. About a third of the dataset is unclassified. Too short to bucket, non-English fragments, or just genuinely unique goals.

A few observations about that table that aren't obvious from the numbers themselves.

## Cluster 1: Marketing & Sales is the biggest, and it's not what you think

People trying to sell something. That's the plurality cluster. Around 200 goals sit here: SEO, paid ads, cold email, copywriting, lead generation, sales cycles. About 11% of the dataset.

What it isn't: people asking for *the fundamentals of digital marketing*. Almost nobody phrased it that way. The phrasings that recur are job-shaped and product-shaped: "grow my [thing] for [audience]," "get my first [outcome] from [channel]," "fix my [funnel stage] for [niche]." The one verbatim example we're comfortable sharing publicly is the canonical one — *"how do I run Meta ads for my silver-jewelry ecomm store in India."*

That goal contains a tactic, a product, a market, and a country. Generic chapters titled *Introduction to Performance Marketing* are useless to someone arriving with that sentence. They don't want a syllabus; they want a playbook with their product threaded through it.

The implication is structural, not cosmetic. The course-generation agent has to treat the user's *product or niche* as a first-class variable that flows through every lesson, every example, every quiz distractor. We've started building that. It's the difference between a course about Meta ads and a course about *running Meta ads for the user's actual business*.

## Cluster 2: Creators want their channel to grow, not to learn YouTube

About 8% of goals are creator-economy: YouTube, Instagram, TikTok, podcasts, Substack, personal brand. Same shape as the marketers. Almost nobody asks for *the fundamentals of YouTube*. They ask for help growing *their* channel in *their* niche: fitness coach, finance educator, language tutor, indie musician, indie game studio.

These two clusters together — call them the **Monetiser** persona — are the single largest group in the dataset by a wide margin. They share a posture: they're not here to study, they're here to ship. Course content that reads like a textbook fails them. Course content that reads like an action checklist with their product threaded through it is what they came for.

This is also the group most likely to pay, in the sense that the ROI of the course is revenue-linked. If a 90-minute course helps someone unlock their first paying customer for an e-commerce store, the math on what that course was worth is straightforward.

## Cluster 7: the Practical-AI surprise

This one we didn't see coming. v1 onboarding asked users to pick a domain (programming, business, language, STEM, creative, humanities, life-skills, practical). There was no Practical-AI bucket.

Then around 55 goals — call it 3% — didn't fit cleanly into any of those eight. Prompt engineering. n8n flows. ChatGPT for specific workflows. Building agents. Connecting tools without writing code. These goals leaked into "programming" and "business" because there was nowhere else for them to go, and the agent's per-domain prompting served them poorly as a result. A no-code automation builder doesn't want a programming course's distractors in a quiz. They want *wrong prompt shapes* and *wrong tool for the job* as wrong-answer options.

So we redesigned the taxonomy to make Practical AI a first-class option. 3% as a primary cluster understates the demand. That same intent shows up inside the marketing and creator clusters, where people want to use AI to do their job, not become AI engineers.

## Geography: India + Asia + ESL Europe, not North America

The geographic signal in the dataset (picked up from country mentions in the goal text, language fragments, and proper-noun cues) skews hard away from where most edtech assumes its users live.

Around 55 goals reference India explicitly or use Indian context cues. Around 50 reference East Asia (Japan, Korea, China, Taiwan), often through language-learning goals or country-specific certifications. Around 40 reference Europe, with a strong ESL bias: people writing in English about a non-English context. Middle East, Latin America, and the US/Canada/UK each account for fewer than 20 explicit mentions.

Two things follow from that.

Pricing first. A flat €12.99 / €24.99 / €49.99 plan ladder works for Western Europe and the US. It does not work for India, where the same product needs to clear a much lower price-of-the-decision bar before someone tries it. We're now on a track to do PPP-adjusted pricing for the subscription tiers rather than a single global ladder. That's a non-trivial bit of Stripe and entitlement work, and we haven't shipped it yet. But the data made the decision obvious.

The second is content. India shows up not just as a country but as a market for *specific* learning intents: competitive exams, e-commerce sellers, freelancers building agency-style businesses. That bleeds into the next cluster.

## The Language Learner cluster: a clean honest "we're not built for this"

About 100 goals, over 5% of the dataset, are language-learning. English is by far the largest, with smaller groups around Japanese, Spanish, German, French, and a long tail.

I'll say the awkward thing directly. Strive's lesson medium is text: generated lesson content with embedded retrieval-practice cards, code execution where relevant, math and diagram rendering. That's a great medium for conceptual learning, and a *poor* medium for language acquisition past the very early stages. Language learners need vocabulary SRS decks, listening comprehension audio with transcripts, speaking-practice prompts, CEFR-leveled drills, shadowing tools. Reading lessons about Japanese is not how anyone learns Japanese.

We have two coherent options. One: commit to building a language-specific lesson-block set (vocab card, cloze deletion, listening prompt, speaking record-and-score with feedback). That's a real product bet, not a feature. Two: route language-learning goals to a clear *this isn't what we do well* message at onboarding and recommend the existing tools that do.

We have not shipped speaking practice. We are not, today, a good product for language learners. The honest call would be to gate that intent at onboarding rather than serve it badly. We haven't done that yet either, and the longer it sits unshipped the more it bothers me. It's one of the open items this analysis explicitly surfaces and we're working on it for the next version of onboarding.

## The Exam Prep cluster: a different product, hiding inside the data

Around 30 goals are explicit exam-prep: the CPA, the bar, college finals, driver's licence theory tests, vendor certifications. A good number more are hidden inside the academic-subjects bucket, where someone's *real* goal is to pass a specific test.

What's specific about this cluster is the time horizon and the feedback loop. A monetiser is happy with a course that drips out across a month. An exam crammer has a date on the calendar, and they want timed mock tests, past-paper coverage, and weak-topic auto-retargeting in the weeks leading up to it. Spaced retrieval at 1, 3, 7, 14, 30 days is the wrong scheduler for someone whose exam is in 21 days. They need a *days-until-exam* scheduler that compresses or expands intervals around the date.

Indian competitive exams — JEE, NEET, UPSC, BITSAT, CAT — came up enough that they deserve dedicated handling. We've put dedicated topic landing pages in for the largest of them, and the next bit of work is a proper exam-prep course template: syllabus-mapped, past-paper-heavy, timed mock quizzes, deadline-aware scheduler. The underlying quiz and retrieval infrastructure can do most of this; what's missing is the timed-exam flow and the deadline scheduler.

## Four personas, fall out of the data cleanly

If I had to compress all of the above into a casting list, four personas account for the bulk of arrivals.

- **The Monetiser.** Marketers, creators, ecomm sellers, freelancers, no-code builders. Want their thing to grow. Care more about an action checklist than a syllabus.
- **The Exam Crammer.** Has a date. Wants past papers and mocks. Spaced retrieval is the wrong default; a deadline scheduler is the right one.
- **The Language Learner.** Needs a different medium. We currently serve them poorly and should either commit or route away.
- **The Self-Directed Professional.** Developers picking up a new framework, analysts learning SQL, designers learning a new tool. Closest fit to the v1 product as we shipped it; smallest design changes needed.

Most v1 product decisions defaulted to the fourth persona. That's a reflection of who built it, not who showed up. The numbers say the first persona is the largest, the second is the highest-urgency, and the third is the one we should stop pretending to serve.

## What this analysis actually changed

To make this concrete — five things shipped or queued because of this dataset.

1. **A `goalType` axis on the course-generation agent.** The same input — *learn Python* — looks different for someone trying to *pass* a test, *build* a side project, or *monetise* a skill. The agent now branches on goal type as well as domain, which changes lesson structure (more case studies for monetisers, more drills for crammers) and quiz distractors (wrong tactic vs. wrong syntax).
2. **Practical AI as a first-class domain.** The taxonomy now reflects what people actually asked for, instead of forcing them into Programming or Business.
3. **Auto-leveling and soft input validation.** No more generated course off a six-character goal. Empty *current knowledge* fields default to a beginner-leaning level with a *skip ahead* affordance per module rather than blocking the user with another form field.
4. **PPP-adjusted pricing on the roadmap.** Not shipped yet. The flat ladder doesn't fit the user base.
5. **Dedicated topic pages for the largest exam-prep niches.** Step zero of an eventual exam-prep course template. The deadline-aware scheduler is the bigger piece and isn't shipped.

Two things on that list (pricing and exam-prep scheduling) haven't shipped. I'd rather list them honestly than pretend the analysis went straight to production.

## What this dataset can't tell us

The most important caveat first: this is who showed up and asked. It is not who finished a course, came back the next week, or paid us. Demand-side data flatters every theory you bring to it. Before betting the rest of the roadmap on the Monetiser cluster, the next pull has to come from the courses, insights, and progress collections: which clusters actually *complete* a course, which cluster's retention curve survives the second week.

That's a different post, with different data, and it'll likely revise some of the conclusions above. The two clusters that look biggest here, Monetisers and Creators, could turn out to be high-intent and low-completion. The smaller, more boring ones, like the self-directed professionals quietly working through a backend course, could turn out to be the ones who actually finish.

We'll know once we have a few months of v2 behaviour data. Until then, the right humility is to treat this as a useful map of *what people came in wanting*, and keep the value-delivered question explicitly open.

---

*The next thing we're watching is which of these clusters actually completes their first course on v2. Same clusters, same 1,820-style intake, but with the goalType branching and the new domain taxonomy live. If you've got a goal that fits one of the clusters above and an opinion about whether we got it right, I'd genuinely like to hear it.*
