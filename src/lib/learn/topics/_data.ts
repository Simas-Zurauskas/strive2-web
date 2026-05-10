import type { LearnTopic } from '../types';

// Data & analyst cluster — five topics covering the analyst-track persona
// (Excel, Data analysis, Data science, Power BI, Machine learning).
//
// Privacy: hand-authored marketing copy only. None of this is derived
// from any individual learner's generated course.

const UPDATED = '2026-05-10';

export const TOPICS_DATA: readonly LearnTopic[] = [
  {
    slug: 'excel',
    title: 'Excel',
    category: 'data',
    eyebrow: 'Data · For analysts and ops',
    headline: 'Learn Excel — the spreadsheet skills your job actually rewards.',
    subhead:
      'Strive builds an Excel course around the work you do — finance models, ops dashboards, marketing reports, or the weekly file that lands in your inbox. Lessons stream live with worked formula examples, and a daily recall queue keeps lookup syntax and shortcuts at your fingertips.',
    metaDescription:
      'Personal AI-built Excel course — formulas, pivots, lookups, dynamic arrays, and light Power Query. Daily spaced recall keeps the syntax in your head.',
    keywords: [
      'learn excel',
      'excel course',
      'excel for analysts',
      'pivot tables',
      'excel formulas',
      'power query',
      'personalized excel course',
    ],
    outcomes: [
      'Wire up VLOOKUP, XLOOKUP, INDEX/MATCH, and know which to reach for when.',
      'Build pivot tables that answer a real business question, not a vanity one.',
      'Tame messy data with TEXT, IFS, dynamic arrays, and structured references.',
      'Set up data validation, conditional formatting, and protected ranges that survive other people.',
      'Pull, clean, and refresh source data with light Power Query.',
      'Audit a workbook you inherited without breaking it.',
      'Build a small ops or finance model you could actually hand to a colleague.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Excel',
      modules: [
        { title: 'Cells, references, and the spreadsheet mental model', lessonCount: 4 },
        { title: 'Lookups — VLOOKUP, XLOOKUP, INDEX/MATCH and when to use which', lessonCount: 5 },
        { title: 'Pivot tables that answer real questions', lessonCount: 4 },
        { title: 'Dynamic arrays — FILTER, SORT, UNIQUE, SEQUENCE', lessonCount: 4 },
        { title: 'Cleaning messy data with TEXT and Power Query basics', lessonCount: 4 },
        { title: 'Data validation, conditional formatting, and workbook hygiene', lessonCount: 3 },
        { title: 'Build a small finance or ops model end-to-end', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Will the course teach the new dynamic arrays (FILTER, XLOOKUP)?',
        answer:
          'Yes. Modern Excel — XLOOKUP, FILTER, SORT, UNIQUE, SEQUENCE — is treated as the default. The wizard asks which Excel version you’re on, and if you’re stuck on Excel 2019 or earlier the examples fall back to INDEX/MATCH and array-formula equivalents.',
      },
      {
        question: 'Is this Excel for Mac, Windows, or web?',
        answer:
          'All three. Shortcuts and Power Query coverage shift depending on the platform you pick during the wizard — Power Query is fully covered on Windows desktop, partially on Mac, and the course is honest about which features your version actually has.',
      },
      {
        question: 'Does it cover VBA or macros?',
        answer:
          'Lightly. The default course skips VBA — most analysts get further with Power Query and dynamic arrays. If you select an automation-heavy goal in the wizard, a short VBA module is added.',
      },
    ],
    estimatedHours: 'Typically 10–16 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'data-analysis',
    title: 'Data analysis',
    category: 'data',
    eyebrow: 'Data · End-to-end for analysts',
    headline: 'Learn data analysis — from a vague question to a clear answer.',
    subhead:
      'Strive shapes a data-analysis course around your tools and your work — Excel, SQL, Python, or a mix. You learn to turn fuzzy business questions into queries, queries into insight, and insight into something a stakeholder will actually act on. Lessons stream live; recall keeps the patterns sharp.',
    metaDescription:
      'Personal AI-built data analysis course — framing questions, querying, exploring, and communicating results. Tool-agnostic with daily spaced recall.',
    keywords: [
      'learn data analysis',
      'data analysis course',
      'business analytics',
      'analytics for beginners',
      'data analyst tutorial',
      'personalized data analysis course',
    ],
    outcomes: [
      'Translate a vague stakeholder ask into a question data can actually answer.',
      'Pull, clean, and shape data using Excel, SQL, or Python — whichever you’ve chosen.',
      'Explore distributions and relationships without being misled by averages.',
      'Spot the classic analyst foot-guns — Simpson’s paradox, survivorship bias, look-ahead leaks.',
      'Build a chart that makes the point in three seconds, not thirty.',
      'Write a one-page memo a non-technical stakeholder will read end-to-end.',
      'Run a small analysis project from question to recommendation.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Data analysis',
      modules: [
        { title: 'From a vague ask to a sharp question', lessonCount: 3 },
        { title: 'Pulling and cleaning data — your tool, your rules', lessonCount: 5 },
        { title: 'Exploratory analysis — distributions, groups, outliers', lessonCount: 4 },
        { title: 'The classic foot-guns — bias, leakage, and bad denominators', lessonCount: 4 },
        { title: 'Charts that make a point', lessonCount: 4 },
        { title: 'Writing the one-pager — memo, not deck', lessonCount: 3 },
        { title: 'A worked analysis from question to recommendation', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Which tool does the course use — Excel, SQL, or Python?',
        answer:
          'You choose during the wizard. The framing modules are tool-agnostic; the cleaning, querying, and analysis examples then run in whichever stack you picked. You can also choose "a mix" and the course alternates by lesson.',
      },
      {
        question: 'Is this the same as the data science course?',
        answer:
          'No. Data science leans into stats foundations, Python, and modelling toward a portfolio project. Data analysis is broader and more communication-led — framing, cleaning, exploring, and writing the memo. Pick this one if your job title has "analyst" in it.',
      },
      {
        question: 'Will I build a portfolio project?',
        answer:
          'You build one worked end-to-end analysis inside the course. It’s not pitched as a portfolio piece — but it’s a complete arc you can adapt to your own dataset afterwards.',
      },
    ],
    estimatedHours: 'Typically 12–18 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'data-science',
    title: 'Data science',
    category: 'data',
    eyebrow: 'Data · For career-switchers and analysts levelling up',
    headline: 'Learn data science — stats, Python, and a project arc that holds together.',
    subhead:
      'Strive builds a data-science course around where you are: career-switcher, analyst going deeper, or engineer crossing over. Stats foundations, pandas and scikit-learn, and a portfolio-shaped project arc. Lessons stream with runnable code, and a daily recall queue keeps the formulas and APIs in your head.',
    metaDescription:
      'Personal AI-built data science course — stats, pandas, scikit-learn, and a portfolio project arc. Daily spaced recall keeps the toolkit alive.',
    keywords: [
      'learn data science',
      'data science course',
      'pandas',
      'scikit-learn',
      'data science portfolio',
      'data science for analysts',
      'personalized data science course',
    ],
    outcomes: [
      'Wrangle real-world data in pandas — joins, group-bys, time series, missing values.',
      'Reason about distributions, sampling, and the bits of probability you’ll actually use.',
      'Train a regression and a classifier in scikit-learn and explain what they’re doing.',
      'Evaluate a model honestly — train/test splits, cross-validation, the right metric for the job.',
      'Diagnose under- and overfitting and pick a fix that isn’t "more data".',
      'Communicate a model the way an analyst should — what it does, what it misses.',
      'Ship a portfolio-shaped project from raw data to a written write-up.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Data science',
      modules: [
        { title: 'The stats you can’t skip — distributions, sampling, inference', lessonCount: 4 },
        { title: 'pandas as your daily driver', lessonCount: 5 },
        { title: 'Exploratory analysis and feature thinking', lessonCount: 4 },
        { title: 'Regression — fit, interpret, and don’t lie with R²', lessonCount: 4 },
        { title: 'Classification — logistic regression, trees, and the right metric', lessonCount: 4 },
        { title: 'Evaluation, leakage, and honest validation', lessonCount: 3 },
        { title: 'A portfolio-shaped project from raw data to write-up', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Do I need a stats background?',
        answer:
          'No, but you’ll spend the first module building one. The course teaches the stats you’ll actually use — distributions, inference, evaluation — not a full degree’s worth. If you already have it, the wizard lets you skip ahead.',
      },
      {
        question: 'Is this Python-only or does it touch R?',
        answer:
          'Python-only by design — pandas and scikit-learn. R is a fine choice for some teams, but the data-science job market overwhelmingly hires Python, and the course is honest about that.',
      },
      {
        question: 'Does it cover deep learning?',
        answer:
          'Lightly. Classical ML is the spine of the course. The wizard offers a short PyTorch primer at the end if you ask for it; for serious deep-learning work, run the machine-learning course next.',
      },
      {
        question: 'Will Strive find me a job?',
        answer:
          'No, and we’ll never claim that. What you’ll have at the end is a working toolkit and one finished project — that’s the part you can actually point at in an interview.',
      },
    ],
    estimatedHours: 'Typically 25–40 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'power-bi',
    title: 'Power BI',
    category: 'data',
    eyebrow: 'Data · For analysts in Microsoft shops',
    headline: 'Learn Power BI — dashboards your stakeholders will actually open.',
    subhead:
      'Strive builds a Power BI course around the company you work in — finance, ops, sales, or a mixed analyst role. Data modelling, DAX where it counts, visual choices that survive the boardroom, and the publish-and-govern workflow. Lessons stream live; the recall queue keeps DAX patterns at hand.',
    metaDescription:
      'Personal AI-built Power BI course — modelling, DAX basics, visuals, publishing, and governance. Built for analysts in Microsoft shops.',
    keywords: [
      'learn power bi',
      'power bi course',
      'dax basics',
      'power bi dashboards',
      'power query',
      'data modelling',
      'personalized power bi course',
    ],
    outcomes: [
      'Model data properly — star schema, fact and dimension tables, relationships that don’t lie.',
      'Write the DAX you’ll actually reach for — CALCULATE, FILTER, time-intelligence, measures vs columns.',
      'Pick visuals that make a point and avoid the ones that obscure it.',
      'Shape source data with Power Query without breaking the refresh next month.',
      'Publish to the Service, set up workspaces, and share without leaking permissions.',
      'Set row-level security and basic governance so the dashboard scales beyond you.',
      'Diagnose a slow report instead of staring at it.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Power BI',
      modules: [
        { title: 'Power BI Desktop — the surface and the moving parts', lessonCount: 3 },
        { title: 'Modelling — star schemas and relationships that hold up', lessonCount: 5 },
        { title: 'Power Query — shaping source data without regret', lessonCount: 4 },
        { title: 'DAX foundations — measures, CALCULATE, time-intelligence', lessonCount: 5 },
        { title: 'Visual choice and dashboard layout', lessonCount: 4 },
        { title: 'Publish, share, and the Power BI Service', lessonCount: 3 },
        { title: 'Row-level security, governance, and performance', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is the course for Power BI Desktop, Service, or both?',
        answer:
          'Both. Modelling and DAX live in Desktop; publishing, sharing, workspaces, and governance live in the Service. The course covers the workflow end-to-end so you’re not stuck the moment you hit "Publish".',
      },
      {
        question: 'How deep does it go on DAX?',
        answer:
          'Deep enough for analyst work — measures, CALCULATE, filter context, time-intelligence — without pretending to make you a DAX consultant. If you select "advanced DAX" in the wizard, the final module digs into context transition and variables.',
      },
      {
        question: 'Does it compare Power BI to Tableau or Looker?',
        answer:
          'In passing. The course is Power-BI-shaped because that’s what you’re here for. It points out where the patterns transfer to other tools, but doesn’t do a full comparison.',
      },
    ],
    estimatedHours: 'Typically 12–20 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'machine-learning',
    title: 'Machine learning',
    category: 'programming',
    eyebrow: 'Data · Classical ML, then a glance at deep',
    headline: 'Learn machine learning — classical models first, deep learning second.',
    subhead:
      'Strive builds an ML course that earns each technique before reaching for the next — regression and classification, then trees and ensembles, then a careful look at deep learning. Hands-on with scikit-learn, lessons stream live with runnable code, and the recall queue keeps the math and the APIs in working memory.',
    metaDescription:
      'Personal AI-built machine learning course — regression, classification, trees, ensembles, and a glance at deep learning. Hands-on with scikit-learn.',
    keywords: [
      'learn machine learning',
      'machine learning course',
      'scikit-learn',
      'classical ml',
      'ml for analysts',
      'pytorch primer',
      'personalized machine learning course',
    ],
    outcomes: [
      'Frame a problem as supervised, unsupervised, or "probably not ML at all".',
      'Train, tune, and interpret linear and logistic regression beyond plug-and-pray.',
      'Use decision trees, random forests, and gradient boosting where they earn their keep.',
      'Evaluate models honestly — cross-validation, the right metric, and the right baseline.',
      'Diagnose bias, variance, leakage, and class imbalance — and fix them.',
      'Engineer features that beat fancier models on real-world data.',
      'Read a deep-learning paper without panicking and run a small PyTorch model.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Machine learning',
      modules: [
        { title: 'When ML is the answer — and when it isn’t', lessonCount: 3 },
        { title: 'Linear and logistic regression — beyond plug-and-pray', lessonCount: 5 },
        { title: 'Decision trees, random forests, and gradient boosting', lessonCount: 5 },
        { title: 'Honest evaluation — cross-validation, metrics, baselines', lessonCount: 4 },
        { title: 'Bias, variance, leakage, and class imbalance', lessonCount: 4 },
        { title: 'Feature engineering that beats fancier models', lessonCount: 3 },
        { title: 'A glance at deep learning — a small PyTorch project', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Do I need a stats background for ML?',
        answer:
          'A working one helps — distributions, inference, the meaning of a p-value. The course teaches what it needs as it goes, but if "standard deviation" feels unfamiliar, run the statistics course first. The wizard can also bake a stats refresher into the opening modules.',
      },
      {
        question: 'How much math will the course show?',
        answer:
          'Enough to understand each model — gradient descent, the loss being minimised, why regularisation works. Formulas render in TeX. The course doesn’t derive every theorem, but it doesn’t hand-wave either.',
      },
      {
        question: 'Is this scikit-learn or PyTorch?',
        answer:
          'scikit-learn for the spine of the course — that’s where classical ML lives. The final module touches PyTorch with a small worked example. If you want a deep-learning-first course, the wizard can flip the emphasis, but classical ML still anchors the early modules.',
      },
      {
        question: 'Does it cover LLMs and generative AI?',
        answer:
          'Not as the main course. LLMs sit on top of decades of classical ML, and this course teaches that foundation. A dedicated LLM course is a separate run of the wizard.',
      },
    ],
    estimatedHours: 'Typically 22–35 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
];
