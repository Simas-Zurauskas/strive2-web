import type { LearnTopic } from '../types';

// ESL & Indian competitive exams cluster — five topics aligned to the
// high-LTV niches surfaced in USER_BASE.md. IELTS and Business English
// serve the ESL audience that already shows up in v1; JEE / NEET / UPSC
// target the sticky Indian exam-prep cohort flagged as a strategic
// priority. Hand-authored marketing copy only; no fields are derived
// from any individual learner's generated course.
//
// Honesty notes baked in here:
// - Language pages are text-first today; no live speaking-coach claims.
// - Exam pages never claim Strive replaces coaching or test-series mocks.
// - Syllabus claims stay general where official exam bodies revise yearly.

const UPDATED = '2026-05-10';

export const TOPICS_EXAMS: readonly LearnTopic[] = [
  {
    slug: 'ielts',
    title: 'IELTS preparation',
    category: 'language',
    eyebrow: 'Language · IELTS Academic & General',
    headline: 'Prepare for IELTS — Academic or General, on your timeline.',
    subhead:
      'Tell Strive your test date, your target band, and whether you sit Academic or General Training, and AI builds the prep around exactly that. Reading and writing tasks use the question types you will face on the day, and the daily recall queue keeps vocabulary, collocations, and band-descriptor phrases from fading.',
    metaDescription:
      'Personal AI-built IELTS prep course for Academic & General — Reading, Writing, Listening, Speaking. Daily spaced recall and band-descriptor practice.',
    keywords: [
      'ielts preparation',
      'ielts academic',
      'ielts general training',
      'ielts course online',
      'ielts writing task 2',
      'ielts speaking practice',
      'personalized ielts course',
    ],
    outcomes: [
      'Recognise every IELTS Reading question type and the strategy each one rewards.',
      'Plan and write Task 1 (Academic graphs or General letters) and Task 2 essays against the band descriptors.',
      'Train Listening for the four sections — note completion, matching, multiple choice, and map labelling.',
      'Build the Part 1 / Part 2 / Part 3 Speaking framework, with cue-card drills and follow-up patterns.',
      'Use academic collocations and linking devices that examiners actually credit.',
      'Diagnose your weakest band and route prep time toward it instead of repeating what you already do well.',
      'Retain phrases and grammar — recall queue surfaces collocations and structures over weeks, not minutes.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on IELTS preparation',
      modules: [
        { title: 'How IELTS is scored — band descriptors, scoring, Academic vs General', lessonCount: 3 },
        { title: 'Reading — skimming, scanning, and the 11 question types', lessonCount: 5 },
        { title: 'Writing Task 1 — Academic graphs and General letters', lessonCount: 4 },
        { title: 'Writing Task 2 — argument, opinion, problem-solution', lessonCount: 5 },
        { title: 'Listening — sections, traps, and note-taking patterns', lessonCount: 4 },
        { title: 'Speaking — Part 1, Part 2 cue cards, Part 3 follow-ups', lessonCount: 4 },
        { title: 'Mock-week plan — pacing, fatigue, and the day before', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Does the course cover both Academic and General Training?',
        answer:
          'You pick during the wizard. The Reading and Writing modules reshape around your choice — Academic gets graph descriptions and academic essays, General gets letter writing and the General Reading question mix.',
      },
      {
        question: 'Is there speaking practice?',
        answer:
          'It is text-first today. You read, write, and recall — the recall queue surfaces whole phrases and band-descriptor language, and the Speaking module gives you cue-card drills and model answers to study. Live speaking practice with a coach is on the roadmap, not shipped.',
      },
      {
        question: 'Can it score my essays?',
        answer:
          'It can give structured feedback against the four band descriptors (Task Achievement, Coherence, Lexical Resource, Grammar) on essays you submit inside a lesson. Treat that as a study aid, not a guarantee — the official band on test day comes from human examiners.',
      },
      {
        question: 'Will Strive get me to my target band?',
        answer:
          'No course can promise a specific band, including this one. Strive builds the foundations, surfaces weak areas, and keeps your vocabulary alive between sessions. Pair it with timed mock tests and, if budget allows, a human evaluator for written feedback before the real exam.',
      },
    ],
    estimatedHours: 'Typically 30–60 hours over 4–12 weeks',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'business-english',
    title: 'Business English',
    category: 'language',
    eyebrow: 'Language · For working professionals',
    headline: 'Polish your Business English — for the email, the meeting, the call.',
    subhead:
      'Strive builds a Business English course around the situations you actually face at work — writing email that lands, running meetings without filler, presenting to a client, negotiating a contract, joining a stand-up across time zones. Lessons stream live, and a daily recall queue makes the phrasing automatic instead of remembered.',
    metaDescription:
      'Personal AI-built Business English course — email, meetings, presentations, negotiation. Polished phrasing with a daily spaced-recall queue.',
    keywords: [
      'business english course',
      'learn business english',
      'professional english',
      'english for work',
      'business english for esl',
      'corporate english training',
      'personalized business english course',
    ],
    outcomes: [
      'Write email that sounds professional without sounding stiff — opens, asks, escalations, follow-ups.',
      'Run and contribute to meetings — agendas, interruptions, disagreement, summaries.',
      'Present to a non-technical audience without losing the room or the structure.',
      'Negotiate over contracts, scope, deadlines, and price using neutral, confident phrasing.',
      'Handle small talk, intros, and cross-cultural friction in international teams.',
      'Replace common ESL tells (article slips, preposition mix-ups, register mismatches) with cleaner alternatives.',
      'Retain the phrasing — recall queue brings full sentence patterns back, not isolated words.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Business English',
      modules: [
        { title: 'Email that earns a reply — tone, structure, and the ask', lessonCount: 5 },
        { title: 'Meetings — opening, contributing, disagreeing, closing', lessonCount: 4 },
        { title: 'Presenting — narrative arc and the language of confidence', lessonCount: 4 },
        { title: 'Negotiation language — softeners, anchors, and pushbacks', lessonCount: 4 },
        { title: 'Cross-cultural communication — small talk, directness, silence', lessonCount: 3 },
        { title: 'Common ESL tells — articles, prepositions, register', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: 'Is this the same thing as IELTS or TOEFL prep?',
        answer:
          'No — different goal entirely. IELTS and TOEFL test academic English against a band scale; Business English trains the phrasing and patterns you use at work. If you need an exam score, take the IELTS or TOEFL course; if you need to sound polished in email and meetings, take this one.',
      },
      {
        question: 'Does it cover speaking practice?',
        answer:
          'It is text-first today. You read, write, and recall — the recall queue surfaces whole phrases (openings, softeners, summaries) so they come to you on the call. Live speaking practice with a coach is on the roadmap, not shipped.',
      },
      {
        question: 'Can it focus on my industry?',
        answer:
          'Yes. The wizard asks for your role and industry — engineering, sales, consulting, finance, healthcare — and the worked examples and vocabulary tilt accordingly.',
      },
    ],
    estimatedHours: 'Typically 12–20 hours',
    difficulty: 'intermediate',
    updated: UPDATED,
  },
  {
    slug: 'jee',
    title: 'JEE preparation',
    category: 'math',
    eyebrow: 'Exam prep · Indian engineering entrance',
    headline: 'Prepare for JEE — Mains and Advanced, paced for where you are.',
    subhead:
      'Strive shapes a JEE course around your phase: Class 11 foundation, Class 12 peak prep, or revision in the final weeks. Physics, Chemistry, and Mathematics modules use TeX-rendered formulas and worked problems, and the daily recall queue keeps techniques alive across the long arc of preparation.',
    metaDescription:
      'Personal AI-built JEE preparation course — Physics, Chemistry, Maths for Mains and Advanced. Worked problems and daily spaced recall.',
    keywords: [
      'jee preparation',
      'iit jee preparation',
      'jee mains course',
      'jee advanced course',
      'learn jee',
      'jee physics chemistry maths',
      'personalized jee course',
    ],
    outcomes: [
      'Build Physics intuition — mechanics, electromagnetism, modern physics — beyond formula memorisation.',
      'Work Chemistry across all three streams: physical, organic, and inorganic, with reaction-mechanism reasoning.',
      'Move fluently across JEE Mathematics — calculus, algebra, coordinate geometry, vectors, probability.',
      'Recognise the question patterns the exam favours and which technique each one calls for.',
      'Keep techniques alive across the long arc — the recall queue prevents the Class 11 syllabus fading by Class 12.',
      'Diagnose weak topics by chapter and route revision time toward them instead of re-doing strong areas.',
      'Train problem-solving pacing — the cost of a stuck question and when to skip and return.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on JEE preparation',
      modules: [
        { title: 'Mechanics — kinematics, Newton’s laws, work-energy, rotation', lessonCount: 6 },
        { title: 'Electromagnetism — fields, circuits, induction, EM waves', lessonCount: 5 },
        { title: 'Modern physics — photoelectric, atomic models, nuclei, semiconductors', lessonCount: 4 },
        { title: 'Physical chemistry — mole concept, thermodynamics, equilibrium, electrochemistry', lessonCount: 5 },
        { title: 'Organic chemistry — mechanisms, named reactions, isomerism', lessonCount: 5 },
        { title: 'Inorganic chemistry — periodic trends, coordination, p- and d-block', lessonCount: 4 },
        { title: 'Mathematics — calculus, algebra, coordinate geometry, vectors, probability', lessonCount: 6 },
      ],
    },
    faq: [
      {
        question: 'Is the syllabus current?',
        answer:
          'The curriculum reflects the publicly known JEE Mains and Advanced framework — three subjects, the standard chapter structure, and the question patterns the NTA and IIT Joint Admission Board have used in recent years. Cross-check with the official information bulletin from the NTA (Mains) and the conducting IIT (Advanced) for your specific exam year, since paper patterns and chapter weightings get revised periodically.',
      },
      {
        question: 'Does Strive replace coaching?',
        answer:
          'No — it is a complement. Strive cannot replace test-series mocks or one-on-one mentorship from a coaching teacher who has seen thousands of students through the exam. What it can do well is build foundations, surface weak chapters through recall, and give you a structured way to revise. Pair it with a mock-test series and, ideally, a coaching environment.',
      },
      {
        question: 'Can the course be paced for the final two months before the exam?',
        answer:
          'Yes. The wizard asks where you are — foundation phase (Class 11), peak prep (Class 12), or final revision — and the curriculum, pacing, and recall-queue intensity reshape around that. Final-revision mode emphasises high-yield chapters and PYQ patterns over deep first-principles derivation.',
      },
      {
        question: 'Does it cover Mains only, Advanced only, or both?',
        answer:
          'You pick during the wizard. Mains-only mode focuses on speed and accuracy across the standard chapter set; Advanced mode adds harder application problems and the multi-step reasoning the IIT paper rewards; both-modes covers the union and flags which problems sit in which paper.',
      },
    ],
    estimatedHours: '40–80 hours over 3–18 months',
    difficulty: 'advanced',
    updated: UPDATED,
  },
  {
    slug: 'neet',
    title: 'NEET preparation',
    category: 'science',
    eyebrow: 'Exam prep · Indian medical entrance',
    headline: 'Prepare for NEET — Biology, Chemistry, and Physics, on your phase.',
    subhead:
      'Strive shapes a NEET-UG course around where you are — Class 11 foundation, Class 12 peak prep, or repeat-attempt revision. Biology gets the time it deserves, Chemistry covers all three streams, and Physics is grounded in worked problems. The daily recall queue keeps the dense biology terminology alive across months of prep.',
    metaDescription:
      'Personal AI-built NEET-UG preparation course — Biology, Chemistry, and Physics. Worked problems, diagrams, and daily spaced recall.',
    keywords: [
      'neet preparation',
      'neet ug course',
      'learn neet',
      'neet biology',
      'neet chemistry physics',
      'medical entrance exam india',
      'personalized neet course',
    ],
    outcomes: [
      'Move fluently through Biology — the syllabus that decides most NEET ranks, with botany and zoology weighted properly.',
      'Work Chemistry across physical, organic, and inorganic with reaction-mechanism reasoning, not just rote learning.',
      'Build Physics intuition for the NEET pattern — mechanics, thermodynamics, optics, modern physics.',
      'Retain dense terminology — the recall queue is built for the kind of vocabulary load Biology demands.',
      'Recognise the question patterns NEET favours and the trap distractors that catch unprepared students.',
      'Diagnose weak chapters by topic and route revision time toward them.',
      'Train pacing — the NEET paper rewards accuracy under time pressure, not deep multi-step derivation.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on NEET preparation',
      modules: [
        { title: 'Cell biology and biomolecules — the foundation everything sits on', lessonCount: 5 },
        { title: 'Human physiology — digestion, circulation, respiration, neural, endocrine', lessonCount: 6 },
        { title: 'Genetics, evolution, and biotechnology', lessonCount: 5 },
        { title: 'Plant physiology, ecology, and reproduction', lessonCount: 5 },
        { title: 'Physical chemistry — mole concept, equilibrium, thermodynamics, electrochemistry', lessonCount: 4 },
        { title: 'Organic chemistry — mechanisms, biomolecules, named reactions', lessonCount: 4 },
        { title: 'Inorganic chemistry — periodic trends, coordination, blocks', lessonCount: 3 },
        { title: 'Physics for NEET — mechanics, thermodynamics, optics, modern physics', lessonCount: 5 },
      ],
    },
    faq: [
      {
        question: 'Is the syllabus current?',
        answer:
          'The curriculum reflects the publicly known NEET-UG framework — Biology weighted at roughly half the paper, Chemistry and Physics covering the standard NCERT chapter structure. Cross-check with the latest NTA information bulletin for your exam year, since paper patterns, chapter inclusions, and weightings get revised periodically.',
      },
      {
        question: 'Does Strive replace coaching?',
        answer:
          'No — it is a complement. Strive cannot replace test-series mocks or one-on-one mentorship from a coaching teacher who has guided students through NEET cycles. What it can do is build foundations chapter by chapter, surface weak topics through recall, and give you a structured way to revise the dense Biology syllabus. Pair it with a mock-test series and ideally a coaching environment.',
      },
      {
        question: 'Does it lean on NCERT?',
        answer:
          'Yes. NEET draws heavily from NCERT, especially in Biology, and the course treats NCERT as the spine — diagrams, terminology, and chapter ordering follow it. The wizard lets you flag whether you have already read NCERT cover-to-cover, in which case the course shifts toward gap-filling and PYQ-pattern drilling rather than first-pass teaching.',
      },
      {
        question: 'Is it suitable for a repeat attempt (dropper year)?',
        answer:
          'Yes — flag dropper or repeat-attempt mode in the wizard. The course de-emphasises the chapters you already know cold and routes revision time toward the chapters where you historically lose marks, with the recall queue tuned for sustained months of prep rather than first exposure.',
      },
    ],
    estimatedHours: '40–80 hours over 3–18 months',
    difficulty: 'advanced',
    updated: UPDATED,
  },
  {
    slug: 'upsc',
    title: 'UPSC preparation',
    category: 'business',
    eyebrow: 'Exam prep · Indian Civil Services',
    headline: 'Prepare for UPSC Civil Services — Prelims, Mains, and the long haul.',
    subhead:
      'Strive shapes a UPSC course around the phase you are in: foundation reading, Prelims focus, Mains answer-writing, or final revision. Modules cover the General Studies framework, optional subject support, and the current-affairs habit you need to sustain across one to two years of preparation. The daily recall queue is built for the long arc — facts, dates, and frameworks stay alive without re-reading the textbook.',
    metaDescription:
      'Personal AI-built UPSC Civil Services preparation course — Prelims, Mains GS papers, optional support, and current affairs. Daily spaced recall.',
    keywords: [
      'upsc preparation',
      'upsc civil services',
      'ias preparation',
      'upsc prelims',
      'upsc mains',
      'learn upsc',
      'personalized upsc course',
    ],
    outcomes: [
      'Map the UPSC framework end-to-end — Prelims, Mains, and the Personality Test stage.',
      'Read the General Studies syllabus across history, polity, geography, economy, environment, and science & tech.',
      'Build the answer-writing discipline Mains rewards — structure, examples, and the right verb in the demand.',
      'Sustain a current-affairs habit instead of cramming the last two months — the recall queue is built for it.',
      'Choose and work an optional subject with a study plan that does not eat the GS time.',
      'Train the ethics, integrity, and aptitude paper (GS-IV) using case-study reasoning, not just definitions.',
      'Pace the long arc — UPSC rewards endurance, and the course is built to be revisited across months and attempts.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on UPSC preparation',
      modules: [
        { title: 'How UPSC is structured — Prelims, Mains, Interview, and the calendar', lessonCount: 3 },
        { title: 'Indian polity and governance — Constitution, institutions, federalism', lessonCount: 6 },
        { title: 'Modern Indian history and post-independence India', lessonCount: 5 },
        { title: 'Geography — physical, Indian, and economic geography', lessonCount: 5 },
        { title: 'Indian economy — concepts, policy, and current developments', lessonCount: 5 },
        { title: 'Environment, ecology, and science & technology for GS', lessonCount: 4 },
        { title: 'Ethics, integrity, and aptitude (GS-IV) — case-study reasoning', lessonCount: 4 },
        { title: 'Mains answer writing — structure, examples, and time discipline', lessonCount: 5 },
        { title: 'Current affairs as a sustained habit, not a final-month sprint', lessonCount: 4 },
      ],
    },
    faq: [
      {
        question: 'Is the syllabus current?',
        answer:
          'The curriculum reflects the publicly known UPSC Civil Services framework — Prelims with GS Paper I and CSAT, Mains with the four GS papers plus essay and optional. Cross-check with the latest UPSC notification for your attempt year, since the syllabus and paper structure get refined and the optional subject list is updated periodically. Treat the course as the framework; treat the official notification as the contract.',
      },
      {
        question: 'Does Strive replace coaching?',
        answer:
          'No — it is a complement. UPSC is a long, lonely exam, and coaching helps with answer-writing feedback, peer cohort, and test-series mocks that Strive cannot replicate. Strive can build the GS foundations, sustain the current-affairs habit, surface weak topics through recall, and give you a way to revise across a multi-year arc. Pair it with at least a Mains test series, and ideally human feedback on answer-writing.',
      },
      {
        question: 'Can it cover my optional subject?',
        answer:
          'For most popular optional subjects — sociology, public administration, geography, history, political science, anthropology — yes; flag the optional in the wizard and a dedicated module set is built. For rarer optionals or specific literature papers, the course can build foundations but the depth depends on the subject; the wizard will be honest about coverage.',
      },
      {
        question: 'How does it handle current affairs?',
        answer:
          'The course teaches the habit and the framework — how to filter newspapers, what to note, how to link a current event back to the GS syllabus — rather than serving daily news. It is built to sit alongside a newspaper or a current-affairs digest you already read, with the recall queue keeping noted items alive for months instead of weeks.',
      },
    ],
    estimatedHours: '120–250 hours over 12–24 months',
    difficulty: 'advanced',
    updated: UPDATED,
  },
];
