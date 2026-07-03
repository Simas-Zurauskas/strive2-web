// Source-of-truth copy for the public landing page. Every claim here is
// backed by a wiki citation in landing.md §11. When changing these, also
// re-verify counts (e.g. "six WaveNet voices") against current wiki.

export const HERO = {
  eyebrow: 'Your private tutor. Your own course.',
  // Headline reinstates the launch value proposition ("personalised path to
  // mastery") that converted best, hybridised with the "real course on
  // anything" line that kept the breadth promise. `personalised` carries the
  // italic-gold emphasis; the sub-line below it keeps the breadth claim.
  headline: 'Your personalised path to mastery.',
  headlineSub: 'A real course on anything you want to learn.',
  // Outcome-first: leads with what the learner *gets*, not the work they have
  // to do. The old subhead opened on "Tell Strive your goal… answer a
  // questionnaire", which read as effort before reward.
  subhead:
    'Describe what you want to learn and where you’re starting from. Minutes later you have a complete course — modules, lessons, quizzes, and daily recall — shaped around exactly where you are and adapting as you progress.',
  ctaPrimary: 'Build my first course — free',
  ctaMicrocopy: 'Free tier included. No credit card.',
  ctaSecondary: 'See how it works',
  // Order = the four named personas in landing.md §1.2: Monetiser, Exam
  // crammer, Language learner, Self-directed professional. Don't reduce
  // below 4 without re-checking persona coverage in USER_BASE.md.
  // Index parity with LESSONS below — keep them aligned 1:1.
  goalRotations: [
    'Run Meta Ads for my jewellery store',
    'Pass the JEE Mains physics paper',
    'Learn Spanish for a coffee chat by July',
    'Ship a React Native app for my side project',
  ],
} as const;

// ── Demo lesson content that streams onto the hero/step-2 mocks. One
// entry per goal in HERO.goalRotations (parallel index). Keep blocks
// short; the mock card is ~460×540px so 4 blocks max per lesson.

export type Token =
  | { kind: 'kw' | 'str' | 'num' | 'fn' | 'plain' | 'op' | 'comment' | 'tag'; text: string };

export type LessonBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'prose'; text: string }
  | { kind: 'code'; lang: string; lines: Token[][] }
  | { kind: 'callout'; tone: 'tip' | 'formula' | 'phrase'; title?: string; body: string; gloss?: string }
  | { kind: 'quiz'; question: string; options: { text: string; correct?: boolean }[] };

export interface DemoLesson {
  module: string;
  lesson: string;
  blocks: LessonBlock[];
}

export const LESSONS: readonly DemoLesson[] = [
  // 0 — Monetiser (Marketing)
  {
    module: 'Module 1 — Audience & creative',
    lesson: 'Hooking the right scroller',
    blocks: [
      { kind: 'heading', text: 'Why the first 1.5 seconds decide everything' },
      {
        kind: 'prose',
        text: "Meta scores hold-rate before it scores anything else. A viewer who scrolls past in 800 ms costs you the auction.",
      },
      {
        kind: 'callout',
        tone: 'tip',
        title: 'Lead with the wearer',
        body: 'Show the bracelet on a wrist mid-gesture, not a studio shot on white.',
      },
      {
        kind: 'quiz',
        question: 'Which 6-second hook tends to win?',
        options: [
          { text: 'Close-up of the bracelet' },
          { text: "Glance up from the wearer's wrist", correct: true },
          { text: 'Studio shot on white' },
        ],
      },
    ],
  },
  // 1 — Exam crammer (JEE physics)
  {
    module: 'Module 2 — Mechanics',
    lesson: 'Projectile motion on flat ground',
    blocks: [
      { kind: 'heading', text: 'Range as a function of angle' },
      {
        kind: 'prose',
        text: 'On flat ground, ignoring drag, range depends only on launch speed and angle. Symmetry pins the maximum to a single value of θ.',
      },
      {
        kind: 'callout',
        tone: 'formula',
        title: 'Range formula',
        body: 'R = v² · sin(2θ) / g',
        gloss: 'Maximum at θ = 45°.',
      },
      {
        kind: 'quiz',
        question: 'At what angle does R reach its maximum?',
        options: [
          { text: '30°' },
          { text: '45°', correct: true },
          { text: '60°' },
        ],
      },
    ],
  },
  // 2 — Language learner (Spanish)
  {
    module: 'Module 1 — Café básico',
    lesson: 'Ordering at the counter',
    blocks: [
      { kind: 'heading', text: 'The natural opener' },
      {
        kind: 'prose',
        text: "Locals rarely say hola walking into a café. Buenas works for any time of day and lands as 'I'm a regular', not 'I'm a tourist'.",
      },
      {
        kind: 'callout',
        tone: 'phrase',
        title: 'Try this',
        body: 'Buenas. Me pone un cortado, por favor.',
        gloss: '"Hi. I\'ll have a cortado, please."',
      },
      {
        kind: 'quiz',
        question: 'Which sounds most natural at a café counter?',
        options: [
          { text: 'Yo quiero un café.' },
          { text: 'Me pone un café, por favor.', correct: true },
          { text: 'Dame un café.' },
        ],
      },
    ],
  },
  // 3 — Self-directed professional (React Native)
  {
    module: 'Module 1 — Foundations',
    lesson: 'Fetching data without footguns',
    blocks: [
      { kind: 'heading', text: 'useEffect or react-query?' },
      {
        kind: 'prose',
        text: 'Hand-rolled fetches in useEffect re-run on every render, leak on unmount, and never cache. Pick a library that handles all three.',
      },
      {
        kind: 'code',
        lang: 'tsx',
        lines: [
          [
            { kind: 'kw', text: 'const' },
            { kind: 'plain', text: ' { data, isLoading } = ' },
            { kind: 'fn', text: 'useQuery' },
            { kind: 'plain', text: '({' },
          ],
          [
            { kind: 'plain', text: '  queryKey: [' },
            { kind: 'str', text: "'profile'" },
            { kind: 'plain', text: ', userId],' },
          ],
          [
            { kind: 'plain', text: '  queryFn: () => ' },
            { kind: 'fn', text: 'fetchProfile' },
            { kind: 'plain', text: '(userId),' },
          ],
          [{ kind: 'plain', text: '});' }],
        ],
      },
      {
        kind: 'quiz',
        question: 'Which gives you loading + error + cache for free?',
        options: [
          { text: 'useState + useEffect' },
          { text: '@tanstack/react-query', correct: true },
          { text: 'Redux + thunks' },
        ],
      },
    ],
  },
];

// Alias of the OpenAPI-backed `GoalType` so the LandingScreen module and
// the wizard's PurposeStep share one source of truth (per the project
// "no local enum types in client" convention).
import type { GoalType } from '@/api/types';
export type GoalTypeKey = GoalType;

export const GOAL_TYPES_SECTION = {
  eyebrow: 'Built for any reason',
  heading: 'We build courses for five reasons. Pick yours.',
  subhead: "We tune the course to what you'll do with it.",
} as const;

export const GOAL_TYPES: {
  key: GoalTypeKey;
  label: string;
  verb: string;
  example: string;
}[] = [
  {
    key: 'master',
    label: 'Master',
    verb: 'Go deep on a topic',
    example: 'Understand how transformers actually work',
  },
  {
    key: 'monetize',
    label: 'Monetize',
    verb: 'Learn a skill that pays',
    example: 'Run Meta Ads for my jewellery store',
  },
  {
    key: 'pass',
    label: 'Pass',
    verb: 'Prep for an exam',
    example: 'Pass the JEE Mains physics paper',
  },
  {
    key: 'build',
    label: 'Build',
    verb: 'Ship something concrete',
    example: 'Ship a React Native side project',
  },
  {
    key: 'fluency',
    label: 'Fluency',
    verb: 'Get conversational',
    example: 'Order coffee in Spanish by July',
  },
];

// ── Roadmap strip: the compact, scannable "how it works" overview that
// sits directly under the hero. This restores the launch version's
// front-and-center 4-step process (the original's highest-converting
// element) and reinstates the word "roadmap", which had vanished from the
// page. The detailed HOW_IT_WORKS section below is the deeper walk-through.
export type RoadmapStepIcon = 'PenLine' | 'Sparkles' | 'SlidersHorizontal' | 'GraduationCap';

export const ROADMAP_SECTION = {
  eyebrow: 'How it works',
  heading: 'From a goal to a roadmap, in four steps.',
  subhead: "There's no catalogue to browse. You describe the destination; Strive builds the path.",
} as const;

export const ROADMAP_STEPS: {
  n: number;
  icon: RoadmapStepIcon;
  title: string;
  body: string;
}[] = [
  {
    n: 1,
    icon: 'PenLine',
    title: 'Define your goal',
    body: 'Say what you want to learn and where you’re starting from — in one sentence.',
  },
  {
    n: 2,
    icon: 'Sparkles',
    title: 'AI generates your roadmap',
    body: 'Strive shapes a full course — modules, lessons, and quizzes — around your answers.',
  },
  {
    n: 3,
    icon: 'SlidersHorizontal',
    title: 'Customise your path',
    body: 'Refine depth, length, and difficulty by chatting with the AI before you commit.',
  },
  {
    n: 4,
    icon: 'GraduationCap',
    title: 'Start learning',
    body: 'Lessons stream onto the page, and a daily recall queue keeps them from fading.',
  },
];

// ── Use-case grid: concrete, diverse course titles a visitor can scan to
// "find themselves" (the launch version's middle-of-page social proof).
// More than the five abstract goal types — these are specific topics, each a
// clickable entry into sign-up. Scope is limited to domains the FAQ says
// Strive serves well (no medical/legal/clinical). Category tags reuse the
// tertiary eyebrow treatment rather than a rainbow of per-category colours,
// staying within the restrained palette.
export type CourseExampleIcon =
  | 'Code'
  | 'BarChart3'
  | 'Cpu'
  | 'ShieldCheck'
  | 'Megaphone'
  | 'TrendingUp'
  | 'Rocket'
  | 'Compass'
  | 'PenLine'
  | 'Music'
  | 'Palette'
  | 'Camera'
  | 'Languages'
  | 'MessagesSquare'
  | 'Mic'
  | 'Handshake'
  | 'Sigma'
  | 'Brain';

export const COURSE_EXAMPLES_SECTION = {
  eyebrow: 'A course for anything',
  heading: 'See yourself in one of these.',
  subhead:
    'A sample of what learners have generated. Pick one to preview the idea — or start from your own goal.',
} as const;

export const COURSE_EXAMPLES: {
  category: string;
  title: string;
  blurb: string;
  icon: CourseExampleIcon;
}[] = [
  { category: 'Tech', title: 'Web Development', blurb: 'Ship a full-stack app with React, Node, and a real database.', icon: 'Code' },
  { category: 'Tech', title: 'Data Science', blurb: 'Analyse data with Python, pandas, and the statistics behind it.', icon: 'BarChart3' },
  { category: 'Tech', title: 'AI Engineering', blurb: 'Build with LLMs, embeddings, and retrieval pipelines.', icon: 'Cpu' },
  { category: 'Tech', title: 'Cybersecurity', blurb: 'Threat models, penetration testing, and secure-by-design habits.', icon: 'ShieldCheck' },
  { category: 'Business', title: 'Digital Marketing', blurb: 'SEO, paid ads, and content that actually converts.', icon: 'Megaphone' },
  { category: 'Business', title: 'Investment Strategy', blurb: 'Markets, asset classes, and building a portfolio.', icon: 'TrendingUp' },
  { category: 'Business', title: 'Entrepreneurship', blurb: 'From idea validation to first paying customers.', icon: 'Rocket' },
  { category: 'Business', title: 'Product Management', blurb: 'Discovery, roadmaps, and shipping the right thing.', icon: 'Compass' },
  { category: 'Creative', title: 'Creative Writing', blurb: 'Story structure, character, and a voice of your own.', icon: 'PenLine' },
  { category: 'Creative', title: 'Music Production', blurb: 'Composition, arrangement, and mixing your first track.', icon: 'Music' },
  { category: 'Creative', title: 'Digital Art', blurb: 'Illustration, concept art, and colour from the ground up.', icon: 'Palette' },
  { category: 'Creative', title: 'Photography', blurb: 'Light, composition, and editing that makes shots sing.', icon: 'Camera' },
  { category: 'Languages', title: 'Spanish Fluency', blurb: 'Hold a real conversation, not just memorise verbs.', icon: 'Languages' },
  { category: 'Languages', title: 'Business English', blurb: 'Email, meetings, and presentations with confidence.', icon: 'MessagesSquare' },
  { category: 'Skills', title: 'Public Speaking', blurb: 'Structure a talk and command the room.', icon: 'Mic' },
  { category: 'Skills', title: 'Negotiation', blurb: 'Anchoring, framing, and closing without flinching.', icon: 'Handshake' },
  { category: 'Science', title: 'Statistics', blurb: 'From distributions to hypothesis testing, intuitively.', icon: 'Sigma' },
  { category: 'Science', title: 'Cognitive Psychology', blurb: 'Memory, attention, and how decisions really get made.', icon: 'Brain' },
];

// Heading is rendered inline in JSX so italic emphasis on `<em>gone</em>`
// can be placed precisely. The string mirror exists for grep-ability /
// SEO scanning only.
export const PROBLEM = {
  heading: 'Most of what you learn is gone in three weeks.',
  body:
    'Strive is built around that fact. We design the course for your goal, stream the lessons live, and bring the ideas back week after week — so week 6 still feels like week 1.',
} as const;

export const HOW_IT_WORKS = [
  {
    n: 1,
    title: 'Tell us your goal',
    body:
      'One sentence. Then answer a short questionnaire generated for that goal — your background, depth, time budget. We never ask the same questions of two different learners.',
  },
  {
    n: 2,
    title: 'AI builds your course — live',
    body:
      'Watch modules and lesson titles appear, then accept (or refine via chat). Open a lesson and the content streams onto the page block by block — intro, sections, code, diagrams, inline quizzes — as Claude writes it.',
  },
  {
    n: 3,
    title: 'Quizzes that test understanding. Recalls that make it stick.',
    body:
      'Each module ends with a quiz that tests synthesis across lessons, not trivia. Each lesson seeds 3–5 spaced-recall cards that surface daily — 1, 3, 7, 14, 30-day intervals — so what you learned in week 1 is still there in week 6.',
  },
] as const;

export type BentoVisual = 'wizard-tree' | 'streaming-blocks' | 'code' | 'math' | 'narration' | 'recall';

export const BENTO_TILES: {
  size: 'hero' | 'standard';
  title: string;
  body: string;
  visual: BentoVisual;
}[] = [
  {
    size: 'hero',
    title: 'Generated for *your* goal',
    body: 'Module count, depth, and difficulty come from your answers — not from a catalogue.',
    visual: 'wizard-tree',
  },
  {
    size: 'standard',
    title: 'Lessons stream live',
    body: 'Open a lesson, watch blocks appear as the AI writes them. No spinner.',
    visual: 'streaming-blocks',
  },
  {
    size: 'standard',
    title: 'Code that runs',
    body: 'Inline code samples render with syntax highlight; some lessons include runnable cells.',
    visual: 'code',
  },
  {
    size: 'standard',
    title: 'Math + diagrams',
    body: 'TeX-rendered formulas and Mermaid diagrams in line with the prose.',
    visual: 'math',
  },
  {
    size: 'standard',
    title: 'Audio narration',
    body: 'Read or listen — your call. Six voices, same lesson, hands-free for the commute or the walk.',
    visual: 'narration',
  },
  {
    size: 'standard',
    title: 'Spaced-recall queue',
    body: 'Built on Leitner research. 3–5 cards per lesson, scheduled at 1/3/7/14/30 days.',
    visual: 'recall',
  },
];

export type ComparisonCell = 'yes' | 'no' | 'partial' | 'manual' | 'depends' | 'varies';

export type ComparisonRowIcon =
  | 'Target'
  | 'Layers'
  | 'Wand2'
  | 'Repeat'
  | 'Network'
  | 'Lock'
  | 'Infinity';

// Row labels are 3–5 words for parallel scanning. Terminology mirrors the
// rest of the page exactly ("spaced-recall queue", "connect across", etc.)
// so cross-page consistency builds credibility.
//
// One row ("Free, no usage caps") is intentionally a Strive-loses row —
// Anki wins clean. Including a row where a competitor wins makes the rest
// of the table land harder; the Linear/Cursor comparison-table playbook.
export const COMPARISON: {
  cols: readonly string[];
  rows: {
    label: string;
    icon: ComparisonRowIcon;
    cells: readonly ComparisonCell[];
  }[];
} = {
  cols: ['Strive', 'ChatGPT', 'Coursera', 'Anki'],
  rows: [
    {
      icon: 'Target',
      label: 'Personalised to your goal',
      cells: ['yes', 'partial', 'no', 'no'],
    },
    {
      icon: 'Layers',
      label: 'Modules → lessons → quizzes',
      cells: ['yes', 'no', 'yes', 'no'],
    },
    {
      icon: 'Wand2',
      label: 'Lessons generated live',
      cells: ['yes', 'partial', 'no', 'no'],
    },
    {
      icon: 'Repeat',
      label: 'Daily spaced-recall queue',
      cells: ['yes', 'no', 'no', 'manual'],
    },
    {
      icon: 'Infinity',
      label: 'Free, no usage caps',
      cells: ['partial', 'partial', 'partial', 'yes'],
    },
    {
      icon: 'Network',
      label: 'Quizzes connect across lessons',
      cells: ['yes', 'no', 'partial', 'no'],
    },
    {
      icon: 'Lock',
      label: 'Your notes stay private',
      cells: ['yes', 'depends', 'varies', 'yes'],
    },
  ],
};

// Two-anchor teaser: Free (lowest-friction entry) + Pro (most-popular paid
// tier) only. Starter and Studio live one click away on /pricing — the
// landing teaser used to mirror all four cards, which duplicated the full
// pricing page lossily (no annual toggle, no descriptions, no per-card
// CTA). Two anchors + direct CTAs convert better and reduce choice overload
// while still keeping pricing transparent above the fold.
export const PRICING_TEASER = {
  heading: 'Free to start. Pay only for what you generate.',
  body:
    'Every plan unlocks every feature. Tiers differ only in monthly allowance.',
  cards: {
    free: {
      tagline: 'Try Strive end-to-end. No credit card needed.',
      // Lesson guidance ("≈ 4–5 lessons") is now derived live from
      // BillingCatalog via formatPlanLessonsPerMonth in PricingTeaser.tsx.
      // This editorial tagline + cta stay static — they're brand voice,
      // not pricing-dependent. If the catalog ever fails to load, the
      // teaser renders the skeleton, not these strings.
      cta: 'Start free',
    },
    pro: {
      tagline: 'Most chosen by daily learners. Generate as you go.',
      cta: 'Get Pro',
    },
  },
  comparisonCta: { label: 'Compare all four plans', href: '/pricing' },
} as const;

export const FAQ = [
  {
    question: 'Is this just a ChatGPT wrapper?',
    answer:
      'No. Strive uses Anthropic Claude as its language model under the hood, but the value isn’t the model — it’s the structure around it: a clarification questionnaire, a curriculum-shaping pipeline, typed lesson blocks, module quizzes that test synthesis, and a Leitner-style recall queue. ChatGPT can write you one lesson; Strive builds and remembers the whole course.',
  },
  {
    question: 'What if I run out of allowance?',
    answer:
      'Top up any time (any whole-dollar amount, $5 minimum) or upgrade tiers. We refund allowance on jobs that fail. Lessons you’ve already generated are yours forever; running out only stops new generation.',
  },
  {
    question: 'Is my study data private?',
    answer:
      'Yes — architecturally. Your notes, bookmarks, and quiz attempts never feed into generation, recommendations, or any other learner’s view. We don’t sell your study data.',
  },
  {
    question: 'How long does a course take to generate?',
    answer:
      'The curriculum (modules + lesson titles) is typically ready in under a minute. Individual lessons are generated on demand and stream onto the page block by block — you’re reading within seconds, not waiting for a finished document.',
  },
  {
    // Domain list ordered by demand share in wiki/working/USER_BASE.md (n=1820).
    // Lead-in carries an implicit "who Strive is for" signal — do not alphabetise.
    question: 'Can I learn anything?',
    answer:
      'Most general-knowledge domains work well — marketing and sales, software and web/mobile development, content and creator skills, exam prep, languages (text-first), business and analytics, no-code and AI automations, design, and STEM. We don’t recommend Strive for medical, legal, or clinical advice; the platform isn’t a specialist tool.',
  },
  {
    question: 'What’s the difference between the module quiz and the recall queue?',
    answer:
      'The module quiz appears at the end of each module and tests synthesis — at least two questions span multiple lessons. The recall queue surfaces atomic ideas (3–5 per lesson) at scheduled intervals over weeks to anchor them in long-term memory.',
  },
  {
    question: 'Can I edit a generated course?',
    answer:
      'You can chat with a live AI agent during the wizard to refine the structure before accepting. Once accepted, lesson content is generated on-demand from the curriculum; we don’t currently support post-acceptance manual editing of lesson text.',
  },
  {
    question: 'Do you have a mobile app?',
    answer:
      'Not yet. The site is fully responsive on mobile browsers; native apps are roadmap, not shipped.',
  },
] as const;

export const FINAL_CTA = {
  eyebrow: 'Start learning',
  heading: 'Ready to learn something — for real this time?',
  subhead:
    'Tell us what you want to learn. We shape the curriculum, stream lessons as you read, and the recall queue keeps it from fading. What you generate is yours.',
  cta: 'Build my first course — free',
  ctaSecondary: 'See pricing',
  microcopy: 'Free tier included. No credit card.',
  // 3 cards rotated through in the closing visual. Echoes real RecallCard
  // shape (course + lesson + prompt + answer + box badge). Coprime cycle so
  // the visitor doesn't see the same card twice on a normal scroll-by.
  recallSamples: [
    {
      course: 'SQL for analysts',
      lesson: 'Window functions',
      prompt: "Which window function returns the row's rank with gaps?",
      answer: 'RANK()',
      box: 'Box 2',
    },
    {
      course: 'Spanish A2',
      lesson: 'The pretérito',
      prompt: "What's the 'yo' form of *poder* in pretérito?",
      answer: 'pude',
      box: 'New',
    },
    {
      course: 'Negotiation tactics',
      lesson: 'Anchoring',
      prompt: 'The first number in a negotiation tends to…',
      answer: 'pull the final outcome toward it',
      box: 'Box 3',
    },
  ],
} as const;
