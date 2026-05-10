import { TOPICS_AI } from './topics/_ai';
import { TOPICS_BUSINESS } from './topics/_business';
import { TOPICS_CREATOR } from './topics/_creator';
import { TOPICS_DATA } from './topics/_data';
import { TOPICS_EXAMS } from './topics/_exams';
import { TOPICS_MARKETING } from './topics/_marketing';
import { TOPICS_MISC } from './topics/_misc';
import { TOPICS_PROGRAMMING } from './topics/_programming';
import type { LearnTopic } from './types';

// Seed topic set — the original 12 entries covering the four landing-page
// personas (Monetiser, Exam crammer, Language learner, Self-directed
// professional). The cluster files under topics/ extend this with topic
// pages prioritised by v1 demand evidence (wiki/working/USER_BASE.md).
//
// Privacy: hand-authored marketing copy only. Never seed from learner data.
//
// Display order matters — the /learn hub iterates LEARN_TOPICS as written.
// Foundation first (recognisable seed), then AI (highest v1 demand), then
// programming, data, marketing, creator, business, exams, misc.

const UPDATED = '2026-05-10';

const TOPICS_FOUNDATION: readonly LearnTopic[] = [
  {
    slug: 'python',
    title: 'Python',
    category: 'programming',
    eyebrow: 'Programming · Beginner-friendly',
    headline: 'Learn Python — your way, in one personal course.',
    subhead:
      "Tell Strive what you want Python for — a job switch, an analytics role, automating your work, or shipping a side project — and AI builds the curriculum around your goal. Lessons stream live; a daily recall queue keeps what you learn from fading.",
    metaDescription:
      'Learn Python with a personal AI course built around your goal. Modules, lessons, runnable code samples, and daily spaced recall. Free to start.',
    keywords: [
      'learn python',
      'python course',
      'python for beginners',
      'python tutorial',
      'AI python tutor',
      'personalized python course',
    ],
    outcomes: [
      'Read and write idiomatic Python — variables, control flow, functions, modules.',
      'Work with the standard library: dates, files, JSON, the shell.',
      'Use lists, dicts, sets and comprehensions to model real data.',
      'Handle errors and write small, testable functions.',
      'Choose between scripts, notebooks, and packages for your work.',
      'Read other people’s Python without flinching.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Python',
      modules: [
        { title: 'Foundations — values, names, control flow', lessonCount: 6 },
        { title: 'Data structures that pull their weight', lessonCount: 5 },
        { title: 'Functions, modules, and how Python imports', lessonCount: 5 },
        { title: 'Files, JSON, and the standard library you’ll actually use', lessonCount: 4 },
        { title: 'Errors, debugging, and writing small tests', lessonCount: 4 },
        { title: 'Where to go next — packages, notebooks, or production', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'I’ve never coded before — is Python a good first language?',
        answer:
          'Yes. Python’s syntax is closer to plain English than most languages, and Strive will adjust pacing for a true beginner: more explanation, more checkpoints, smaller code samples per lesson.',
      },
      {
        question: 'Will the lessons include code I can actually run?',
        answer:
          'Yes. Code samples render with syntax highlighting, and many lessons include short runnable cells so you can see the output without leaving the lesson.',
      },
      {
        question: 'Can the course focus on data analysis / web / scripting specifically?',
        answer:
          'Yes — that’s the whole idea. The wizard asks what you want Python for, and the curriculum is shaped around that. The outline above is one of many shapes a Python course can take.',
      },
    ],
    estimatedHours: 'Typically 12–20 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    category: 'programming',
    eyebrow: 'Programming · Web essentials',
    headline: 'Learn JavaScript — the language that runs the web.',
    subhead:
      'Strive builds a JavaScript curriculum that matches where you are — total beginner, returning after a break, or moving from another language. Lessons stream live, examples run in the browser, and a daily recall queue makes the syntax stick.',
    metaDescription:
      'Personal AI-built course on JavaScript — the language, the DOM, async, and modules. Live-streaming lessons and daily spaced recall.',
    keywords: [
      'learn javascript',
      'javascript course',
      'js tutorial',
      'modern javascript',
      'AI javascript tutor',
      'personalized javascript course',
    ],
    outcomes: [
      'Read and write modern JavaScript — let/const, arrow functions, modules.',
      'Manipulate the DOM with confidence; understand events and bubbling.',
      'Work with async code — promises, async/await, fetch.',
      'Use arrays, objects, and destructuring like a working developer.',
      'Set up a tiny project with modules, npm, and a bundler.',
      'Read someone else’s code without getting lost.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on JavaScript',
      modules: [
        { title: 'How JavaScript thinks — values, scopes, types', lessonCount: 5 },
        { title: 'Arrays, objects, and destructuring', lessonCount: 4 },
        { title: 'The DOM, events, and the browser runtime', lessonCount: 5 },
        { title: 'Async — promises, async/await, fetch', lessonCount: 5 },
        { title: 'Modules, npm, and a small project', lessonCount: 4 },
        { title: 'Where to go next — frameworks, Node, TypeScript', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Do I need any setup before starting?',
        answer:
          'For the first few modules, no — code runs in your browser. Later lessons walk you through installing Node and a code editor when the curriculum benefits from it.',
      },
      {
        question: 'Does Strive cover React / Vue / Svelte?',
        answer:
          'Frameworks are separate courses you can build on top — start with JavaScript fundamentals here, then run the wizard again for the framework you care about.',
      },
    ],
    estimatedHours: 'Typically 14–22 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'react',
    title: 'React',
    category: 'programming',
    eyebrow: 'Programming · Modern frontend',
    headline: 'Learn React — modern, component-driven, hooks-first.',
    subhead:
      'A personal React course built around what you want to ship — a side project, a job switch, a feature at work. Strive shapes the curriculum, streams lessons live, and uses spaced recall so the patterns stick beyond week one.',
    metaDescription:
      'Personal AI-built React course with hooks, state, effects, and a real project arc. Live-streaming lessons and spaced recall.',
    keywords: [
      'learn react',
      'react course',
      'react hooks',
      'react tutorial',
      'AI react tutor',
      'personalized react course',
    ],
    outcomes: [
      'Build components, lift state, and pass props without spaghetti.',
      'Use the core hooks: useState, useEffect, useMemo, useReducer.',
      'Fetch and cache data with a modern data layer (react-query, SWR).',
      'Handle forms, validation, and accessibility basics.',
      'Reason about renders — when, how often, and what to memoize.',
      'Ship a small but real project end-to-end.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on React',
      modules: [
        { title: 'Components, props, and the mental model', lessonCount: 4 },
        { title: 'State, events, and the core hooks', lessonCount: 5 },
        { title: 'Effects and the lifecycle (without the lifecycle)', lessonCount: 4 },
        { title: 'Data fetching, caching, and async UI', lessonCount: 4 },
        { title: 'Forms, accessibility, and the shape of a good UI', lessonCount: 4 },
        { title: 'Performance, renders, and what to memoize', lessonCount: 3 },
        { title: 'Ship the project — deploy and review', lessonCount: 2 },
      ],
    },
    faq: [
      {
        question: 'How much JavaScript do I need before starting?',
        answer:
          'Comfortable with arrays, objects, async/await, and ES module imports. If that sentence felt shaky, run the JavaScript course first — the React course will assume it.',
      },
      {
        question: 'TypeScript — covered or not?',
        answer:
          'You can choose. The wizard asks. With TypeScript on, examples and the project use it throughout; without, plain JS.',
      },
    ],
    estimatedHours: 'Typically 16–24 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'sql',
    title: 'SQL',
    category: 'data',
    eyebrow: 'Data · Analyst-ready',
    headline: 'Learn SQL — from SELECT to window functions.',
    subhead:
      'Strive builds a SQL course aimed at your work: analytics, product, engineering, or just learning the language of data. Lessons render real query examples, and a daily recall queue cements the syntax and the joins.',
    metaDescription:
      'Personal AI-built SQL course — joins, aggregations, window functions, and the patterns analysts actually use. Daily recall keeps it.',
    keywords: [
      'learn sql',
      'sql course',
      'sql for analysts',
      'sql tutorial',
      'window functions',
      'personalized sql course',
    ],
    outcomes: [
      'Read and write SELECT, JOIN, GROUP BY, and HAVING with confidence.',
      'Aggregate, filter, and pivot data without leaving the database.',
      'Use window functions to rank, partition, and accumulate.',
      'Reason about indexes and why a query is slow.',
      'Avoid the common foot-guns: NULL handling, implicit casts, duplicate joins.',
      'Translate a business question into a query that answers it.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on SQL',
      modules: [
        { title: 'SELECT, FROM, WHERE — the literal building blocks', lessonCount: 4 },
        { title: 'Joins, set operations, and shape changes', lessonCount: 5 },
        { title: 'Aggregations, GROUP BY, and HAVING', lessonCount: 4 },
        { title: 'Window functions — rank, partition, lead/lag', lessonCount: 4 },
        { title: 'NULLs, casts, and the foot-guns', lessonCount: 3 },
        { title: 'Reading EXPLAIN — why is this slow?', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Does the course assume a specific dialect?',
        answer:
          'You pick during the wizard — Postgres, MySQL, SQLite, BigQuery, Snowflake, or generic ANSI SQL. Examples and quizzes use that dialect throughout.',
      },
      {
        question: 'Do I need a database installed?',
        answer:
          'No. Examples run in-browser against an embedded SQLite for the course — you can copy them into your own database when you’re ready.',
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'spanish',
    title: 'Spanish',
    category: 'language',
    eyebrow: 'Language · A1–B2 conversational',
    headline: 'Learn Spanish — for the trip, the move, or the conversation.',
    subhead:
      'Tell Strive when you need Spanish and what for, and AI builds a course around exactly that. Vocab and grammar arrive in lessons, and the recall queue (1 / 3 / 7 / 14 / 30 days) is what makes them stay.',
    metaDescription:
      'Personal AI-built Spanish course tuned to your goal and timeline. Streaming lessons plus a daily spaced-recall queue so vocab and grammar stick.',
    keywords: [
      'learn spanish',
      'spanish course',
      'spanish for beginners',
      'spanish a2',
      'AI spanish tutor',
      'personalized spanish course',
    ],
    outcomes: [
      'Hold a basic café / shop / hotel conversation without freezing.',
      'Use the present, preterite, and imperfect for real situations.',
      'Recognise ser vs estar, por vs para, and other classic forks.',
      'Build vocabulary that matches your goal — travel, work, or culture.',
      'Read short native texts (menus, signs, simple posts) without a dictionary.',
      'Keep what you learn — recall queue brings forms and phrases back over weeks.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Spanish (A1 → A2)',
      modules: [
        { title: 'Sound, rhythm, and the first 200 words', lessonCount: 5 },
        { title: 'The present tense — regular and the early irregulars', lessonCount: 5 },
        { title: 'Asking, ordering, and getting around', lessonCount: 4 },
        { title: 'The past — preterite vs imperfect', lessonCount: 5 },
        { title: 'Ser, estar, hay, and the small words that do the work', lessonCount: 4 },
        { title: 'Reading a short native text — what you already know', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Latin American or Castilian?',
        answer:
          'You choose during the wizard. Examples, vocabulary, and the model conversations all reflect that choice — vosotros stays out unless you’re learning Castilian.',
      },
      {
        question: 'Is this a speaking course?',
        answer:
          'It is text-first today. You read, write, and recall — the recall queue surfaces whole phrases, not just words. Live speaking practice is on the roadmap, not shipped.',
      },
    ],
    estimatedHours: 'Typically 20–35 hours to A2',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'french',
    title: 'French',
    category: 'language',
    eyebrow: 'Language · A1–B2 conversational',
    headline: 'Learn French — built around your timeline and your reasons.',
    subhead:
      'A French course shaped by your goal: travel, work, citizenship, or just curiosity. Strive picks the vocabulary and grammar that matter for *you*, streams lessons live, and a daily recall queue keeps it all.',
    metaDescription:
      'Personal AI-built French course shaped to your goal — vocab, grammar, and a daily spaced-recall queue. Free to start.',
    keywords: [
      'learn french',
      'french course',
      'french for beginners',
      'french a2',
      'personalized french course',
    ],
    outcomes: [
      'Hold a short conversation — café, shop, asking the way.',
      'Use present, passé composé, and imparfait in real settings.',
      'Tell the difference between similar verbs and similar prepositions.',
      'Build vocabulary aimed at your reason for learning.',
      'Read short native texts and pick out the meaning without translating word-for-word.',
      'Retain what you learned — recall queue brings forms and phrases back.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on French (A1 → A2)',
      modules: [
        { title: 'Sound, gender, and the first 200 words', lessonCount: 5 },
        { title: 'Present tense — regular and the verbs you’ll actually use', lessonCount: 5 },
        { title: 'In a café, in a shop, on the street', lessonCount: 4 },
        { title: 'The past — passé composé vs imparfait', lessonCount: 5 },
        { title: 'Articles, prepositions, and the small words', lessonCount: 4 },
        { title: 'Reading a short native text — making sense of it', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this for European French or Québécois?',
        answer:
          'European French by default; you can flag Québécois during the wizard and the course will tilt vocabulary and pronunciation notes accordingly.',
      },
      {
        question: 'Can it teach the writing exam for visas?',
        answer:
          'Yes — set citizenship/visa as the goal in the wizard and the curriculum will include written-prompt patterns (TCF / TEF–style) and timed writing practice.',
      },
    ],
    estimatedHours: 'Typically 20–35 hours to A2',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'german',
    title: 'German',
    category: 'language',
    eyebrow: 'Language · A1–B2 conversational',
    headline: 'Learn German — without the textbook torture.',
    subhead:
      'Strive builds a German course around your reason: a move, a job, a relationship, an exam. The cases come in slowly. The recall queue makes them stay. Lessons stream live, and you read native examples from day one.',
    metaDescription:
      'Personal AI-built German course tuned to your goal. Streaming lessons, four cases without the panic, and a daily spaced-recall queue.',
    keywords: [
      'learn german',
      'german course',
      'german for beginners',
      'german a2',
      'personalized german course',
    ],
    outcomes: [
      'Hold a short conversation in everyday situations.',
      'Use the four cases without freezing — nominative, accusative, dative, genitive.',
      'Conjugate present and the perfect tense for the verbs you’ll really use.',
      'Build vocabulary aimed at *your* reason for learning German.',
      'Read short native texts and pick up meaning by structure, not translation.',
      'Retain it — recall queue brings the cases and the gendered articles back.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on German (A1 → A2)',
      modules: [
        { title: 'Sound, gender, and the first 200 words', lessonCount: 5 },
        { title: 'Present tense and word order — the rule that explains it all', lessonCount: 5 },
        { title: 'Cases without the panic — nominative & accusative', lessonCount: 4 },
        { title: 'Dative — when “to” and “for” get a case of their own', lessonCount: 4 },
        { title: 'The perfect tense — talking about yesterday', lessonCount: 4 },
        { title: 'Reading a short native text — enough already', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this Hochdeutsch or a regional variant?',
        answer:
          'Hochdeutsch (standard German) by default. The wizard lets you flag Austrian or Swiss German, and the course will note differences where they matter.',
      },
      {
        question: 'Will it teach the genitive properly or skip it?',
        answer:
          'Properly — but later. The genitive doesn’t earn its place until you’ve worked through the other three cases, so it lands as a refinement, not a confusion.',
      },
    ],
    estimatedHours: 'Typically 22–40 hours to A2',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'calculus',
    title: 'Calculus',
    category: 'math',
    eyebrow: 'Math · Single & multi-variable',
    headline: 'Learn calculus — for the exam, the degree, or the comeback.',
    subhead:
      'Strive shapes a calculus course around your level and your goal — JEE / SAT / AP, a CS degree, or a return after years away. TeX-rendered formulas, worked problems, and a daily recall queue that makes the techniques second nature.',
    metaDescription:
      'Personal AI-built calculus course — limits, derivatives, integrals, and a daily spaced-recall queue. Built for exam prep and degree-level work.',
    keywords: [
      'learn calculus',
      'calculus course',
      'calculus for beginners',
      'JEE calculus',
      'AP calculus',
      'personalized calculus course',
    ],
    outcomes: [
      'Reason about limits and continuity — what they mean and where they fail.',
      'Differentiate fluently — chain rule, product rule, implicit, logarithmic.',
      'Integrate using substitution, parts, and partial fractions.',
      'Apply calculus to motion, area, optimization, and curve sketching.',
      'Recognise common exam patterns and which technique they call for.',
      'Retain what you learned — recall queue keeps techniques alive between modules.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Calculus (single-variable)',
      modules: [
        { title: 'Limits and continuity — what they really mean', lessonCount: 4 },
        { title: 'Derivatives — rules, intuition, and graphs', lessonCount: 5 },
        { title: 'Applications of differentiation', lessonCount: 5 },
        { title: 'Integration — antiderivatives and area', lessonCount: 4 },
        { title: 'Techniques of integration', lessonCount: 4 },
        { title: 'Applications of integration', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: 'Does it cover multi-variable calculus?',
        answer:
          'You choose during the wizard. The default outline is single-variable; selecting "multi-variable" adds modules on partial derivatives, multiple integrals, and vector calculus.',
      },
      {
        question: 'Are the formulas readable on mobile?',
        answer:
          'Yes — formulas are TeX-rendered (KaTeX) and lay out cleanly down to phone widths. Diagrams use Mermaid where they help.',
      },
    ],
    estimatedHours: 'Typically 18–30 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'statistics',
    title: 'Statistics',
    category: 'math',
    eyebrow: 'Data · For analysts and PMs',
    headline: 'Learn statistics — without the textbook dread.',
    subhead:
      'A statistics course shaped by your job: PM, analyst, researcher, or engineer who keeps reaching for an A/B test. Strive teaches the intuition first, the formulas second, and the recall queue keeps both.',
    metaDescription:
      'Personal AI-built statistics course — distributions, inference, A/B testing, and the intuition behind each tool. Daily spaced recall.',
    keywords: [
      'learn statistics',
      'statistics course',
      'A/B testing',
      'inferential statistics',
      'personalized statistics course',
    ],
    outcomes: [
      'Read a distribution and know what it’s telling you.',
      'Use mean, median, std-dev, and quantiles without confusing them.',
      'Run and interpret a t-test, χ² test, and a simple regression.',
      'Reason about sample size, power, and what "statistically significant" really means.',
      'Spot the classic mistakes in dashboards and A/B tests.',
      'Pick the right tool for a question you actually have at work.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Statistics for analysts',
      modules: [
        { title: 'Describing data — distributions and summaries', lessonCount: 4 },
        { title: 'Probability — just enough for the rest of the course', lessonCount: 3 },
        { title: 'Inference — confidence intervals and hypothesis tests', lessonCount: 5 },
        { title: 'A/B testing in practice', lessonCount: 4 },
        { title: 'Regression — fitting a line and what it’s really saying', lessonCount: 4 },
        { title: 'Common mistakes and how to spot them', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Frequentist or Bayesian?',
        answer:
          'Frequentist by default — that’s what most workplaces use. The wizard lets you switch to Bayesian, in which case the inference and A/B-testing modules are reframed accordingly.',
      },
      {
        question: 'Does it use Python / R for examples?',
        answer:
          'You pick during the wizard. Default is Python (pandas + scipy + statsmodels); R is available, and you can also opt for "no code, just intuition" if you want a non-technical course.',
      },
    ],
    estimatedHours: 'Typically 12–20 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'meta-ads',
    title: 'Meta Ads',
    category: 'business',
    eyebrow: 'Marketing · For e-commerce & creators',
    headline: 'Learn Meta Ads — for your store, your service, or your client.',
    subhead:
      'Strive builds a Meta Ads course around your business — DTC store, services, lead-gen, or app installs. Hooks, creative, audience strategy, ad-set structure, and the daily recall queue that keeps the playbook in your head.',
    metaDescription:
      'Personal AI-built Meta Ads course — hooks, creative, audiences, structure, and the metrics that move the auction. Daily spaced recall.',
    keywords: [
      'learn meta ads',
      'facebook ads course',
      'instagram ads',
      'meta ads tutorial',
      'AI meta ads course',
      'meta ads for ecommerce',
    ],
    outcomes: [
      'Write hooks that survive the first 1.5 seconds of a Reel.',
      'Build creative that fits the platform — UGC, statics, story, Reels.',
      'Structure campaigns for prospecting and retargeting without overlap.',
      'Read the auction signals — hold-rate, frequency, ROAS, and what they mean.',
      'Diagnose a struggling ad without burning more budget.',
      'Apply the playbook to *your* product or your client’s.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Meta Ads',
      modules: [
        { title: 'How the auction actually works', lessonCount: 3 },
        { title: 'Audience strategy — broad vs interest vs LAL', lessonCount: 4 },
        { title: 'Creative — hooks, statics, UGC, Reels', lessonCount: 5 },
        { title: 'Ad-set structure and budget logic', lessonCount: 4 },
        { title: 'Reading the metrics that matter', lessonCount: 4 },
        { title: 'Diagnose a struggling ad — a worked playbook', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Can the course focus on my exact business?',
        answer:
          'Yes — that’s the wizard’s whole job. Tell it the product, the offer, and where you are today (zero ads run, scaling, or pre-launch) and the curriculum reshapes around that.',
      },
      {
        question: 'Does it cover the ads manager UI step-by-step?',
        answer:
          'It covers the *decisions* in the ads manager — what to set, why, and how to tell when to change it. UI screenshots get out of date fast; the patterns don’t.',
      },
    ],
    estimatedHours: 'Typically 8–14 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'public-speaking',
    title: 'Public speaking',
    category: 'business',
    eyebrow: 'Soft skills · Talks, pitches, meetings',
    headline: 'Learn public speaking — for the talk, the pitch, the room.',
    subhead:
      'Strive builds a public-speaking course around the situations you actually face — a conference talk, a sales pitch, a TEDx, an investor meeting, a panel. Drills, structure, and a recall queue that keeps the principles practiced.',
    metaDescription:
      'Personal AI-built public-speaking course — structure, story, presence, and Q&A. Practical drills with a daily spaced-recall queue.',
    keywords: [
      'learn public speaking',
      'public speaking course',
      'pitch course',
      'TED talk preparation',
      'AI speech coach',
    ],
    outcomes: [
      'Open a talk with a hook that earns the next sixty seconds.',
      'Structure a 10-minute talk and a 60-second pitch using the same skeleton.',
      'Use story to land a point that data alone can’t.',
      'Manage breath, pace, and presence under pressure.',
      'Handle Q&A without losing the room or the thread.',
      'Refine a real talk you’re actually preparing.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Public Speaking',
      modules: [
        { title: 'Structure — the skeleton every talk needs', lessonCount: 3 },
        { title: 'Hooks and openings', lessonCount: 3 },
        { title: 'Story — when, why, and how much', lessonCount: 4 },
        { title: 'Voice, breath, and presence', lessonCount: 4 },
        { title: 'Slides that don’t fight the speaker', lessonCount: 3 },
        { title: 'Q&A and the curveballs', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Can I prepare a specific talk inside the course?',
        answer:
          'Yes. The wizard lets you point the course at a real talk you’re preparing — drills and worked examples will use your topic so the practice is the work, not parallel to it.',
      },
      {
        question: 'Is there video / live coaching?',
        answer:
          'Not yet. Today the course is text-and-drills. Live coaching is on the roadmap, not shipped.',
      },
    ],
    estimatedHours: 'Typically 6–10 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'negotiation',
    title: 'Negotiation',
    category: 'business',
    eyebrow: 'Soft skills · For deals, salary, partnerships',
    headline: 'Learn negotiation — for the salary, the deal, the partnership.',
    subhead:
      'Strive builds a negotiation course around the negotiations you actually face — comp, vendor contracts, partnerships, real estate, founder conflicts. Frameworks, drills, and a recall queue that keeps the moves at hand.',
    metaDescription:
      'Personal AI-built negotiation course — anchoring, BATNA, concession patterns, and worked drills. Daily spaced recall.',
    keywords: [
      'learn negotiation',
      'negotiation course',
      'salary negotiation',
      'negotiation tactics',
      'AI negotiation coach',
    ],
    outcomes: [
      'Prepare a negotiation properly — interests, BATNA, opening, walk-away.',
      'Anchor without alienating; concede without leaking value.',
      'Recognise classic moves — flinch, nibble, good cop / bad cop — and counter them.',
      'Negotiate over comp, contracts, or partnerships using the same framework.',
      'Read tone, silence, and pacing as signals, not noise.',
      'Apply the playbook to a real negotiation you’re heading into.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Negotiation',
      modules: [
        { title: 'Preparation — interests, BATNA, opening', lessonCount: 4 },
        { title: 'Anchoring and the first move', lessonCount: 3 },
        { title: 'Concession patterns — how value leaks', lessonCount: 3 },
        { title: 'Tactics and counter-tactics', lessonCount: 4 },
        { title: 'Reading tone, silence, and pacing', lessonCount: 3 },
        { title: 'Working drills — comp, vendor, partnership', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: 'Can I rehearse a real negotiation inside the course?',
        answer:
          'Yes. Tell the wizard which negotiation you’re preparing for, and the worked drills in the final module will use that scenario.',
      },
      {
        question: 'Is the framework adversarial or collaborative?',
        answer:
          'Both — the course teaches when to use which. Most negotiations are collaborative under the surface; some are not. The course is honest about the difference.',
      },
    ],
    estimatedHours: 'Typically 6–10 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
];

export const LEARN_TOPICS: readonly LearnTopic[] = [
  ...TOPICS_FOUNDATION,
  ...TOPICS_AI,
  ...TOPICS_PROGRAMMING,
  ...TOPICS_DATA,
  ...TOPICS_MARKETING,
  ...TOPICS_CREATOR,
  ...TOPICS_BUSINESS,
  ...TOPICS_EXAMS,
  ...TOPICS_MISC,
];
