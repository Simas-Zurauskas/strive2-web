import type { LearnTopic } from '../types';

// Languages add-ons + soft skills cluster. Japanese was the largest
// non-Romance language signal in v1 signups; Mandarin / Korean / Italian
// fill the rest of the long tail. Productivity bleeds across personas
// (founders, ICs, students) and creative-writing / ux-design pick up
// the design+creator overlap. Hand-authored marketing copy only — never
// seeded from any learner's generated course.

const UPDATED = '2026-05-10';

export const TOPICS_MISC: readonly LearnTopic[] = [
  {
    slug: 'japanese',
    title: 'Japanese',
    category: 'language',
    eyebrow: 'Language · A1–A2 (JLPT N5–N4)',
    headline: 'Learn Japanese — for the show, the trip, or the move.',
    subhead:
      'Tell Strive why you want Japanese — anime and manga, business in Tokyo, a trip you actually booked, or JLPT prep — and AI builds the curriculum around it. Lessons stream live; the daily recall queue (1 / 3 / 7 / 14 / 30 days) is what keeps the kana, the particles, and the kanji from quietly fading.',
    metaDescription:
      'Personal AI-built Japanese course shaped to your goal — kana, particles, basic kanji, and JLPT N5–N4 grounding. Daily spaced recall keeps it.',
    keywords: [
      'learn japanese',
      'japanese course',
      'japanese for beginners',
      'jlpt n5',
      'jlpt n4',
      'ai japanese tutor',
      'personalized japanese course',
    ],
    outcomes: [
      'Read and write hiragana and katakana fluently — no more romaji crutch.',
      'Use the core particles (は, が, を, に, で, へ, と, も) without freezing.',
      'Recognise around 100 foundational kanji and the radicals that explain them.',
      'Hold a basic introduction, café, station, or shop conversation in plain form and です／ます.',
      'Tell apart polite, plain, and casual register — and know when each is wrong.',
      'Read a simple native text (sign, menu, NHK Easy headline) and pull meaning from structure.',
      'Retain it — recall queue surfaces full phrases, not isolated vocab.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Japanese (N5 → N4)',
      modules: [
        { title: 'Hiragana, katakana, and the sound of Japanese', lessonCount: 5 },
        { title: 'Particles — the small words that carry the sentence', lessonCount: 5 },
        { title: 'Verbs, です／ます, and the polite register', lessonCount: 5 },
        { title: 'Your first 100 kanji — by radical, not by rote', lessonCount: 4 },
        { title: 'Past, negative, and the te-form that opens everything', lessonCount: 5 },
        { title: 'Reading a short native text — what you already know', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Do I have to learn kanji from day one?',
        answer:
          'No. Kana comes first — hiragana, then katakana — and only once those are solid does kanji enter, by radical and by frequency. By the end of an N5-aimed course you will recognise around 100 of them and read them by structure, not by guessing.',
      },
      {
        question: 'Will it help me prep for the JLPT?',
        answer:
          'Yes — flag JLPT N5 or N4 as the goal in the wizard and the curriculum reshapes around the exam: vocabulary lists, grammar points, and reading-comprehension patterns specific to that level.',
      },
      {
        question: 'Is this a speaking course?',
        answer:
          'It is text-first today. You read, write, and recall — the recall queue surfaces whole phrases, not just words. Live speaking practice is on the roadmap, not shipped.',
      },
    ],
    estimatedHours: 'Typically 25–45 hours to A2',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'mandarin',
    title: 'Mandarin Chinese',
    category: 'language',
    eyebrow: 'Language · A1–A2 (HSK 1–3)',
    headline: 'Learn Mandarin — pinyin first, characters in their own time.',
    subhead:
      'Strive builds a Mandarin course around your reason — work in mainland China, family roots, a move, or HSK prep. Pinyin and tones come first, characters arrive gradually, and the daily recall queue (1 / 3 / 7 / 14 / 30 days) keeps the tones honest long after the lesson ends.',
    metaDescription:
      'Personal AI-built Mandarin course — pinyin, tones, sentence patterns, and gradual characters. HSK 1–3 grounding with daily spaced recall.',
    keywords: [
      'learn mandarin',
      'mandarin chinese course',
      'chinese for beginners',
      'hsk 1',
      'hsk 2',
      'hsk 3',
      'personalized mandarin course',
    ],
    outcomes: [
      'Hear and produce the four tones (and the neutral) without guessing.',
      'Read pinyin fluently and pronounce unfamiliar words on sight.',
      'Recognise around 300 high-frequency characters and the radicals behind them.',
      'Use the core sentence patterns — 是, 有, 在, measure words, 了, 过, 把.',
      'Hold a short introduction, restaurant, taxi, or shop conversation.',
      'Read a simple native text (menu, sign, short message) without translating word-for-word.',
      'Retain it — recall queue brings tones, characters, and patterns back over weeks.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Mandarin (HSK 1 → HSK 3)',
      modules: [
        { title: 'Pinyin and the four tones — the part you cannot skip', lessonCount: 5 },
        { title: 'Sentence patterns — 是, 有, 在 and the verb that does no work', lessonCount: 5 },
        { title: 'Measure words, numbers, and time', lessonCount: 4 },
        { title: 'Characters by radical — your first 300', lessonCount: 5 },
        { title: 'Aspect and 了 — talking about completion and change', lessonCount: 4 },
        { title: 'Reading a short native text — what you already know', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Simplified or Traditional characters?',
        answer:
          'You choose during the wizard. Simplified is the default (mainland China, Singapore); Traditional is available for Taiwan and Hong Kong contexts, and the course will use that script consistently in lessons, quizzes, and the recall queue.',
      },
      {
        question: 'How are tones taught when this is text-first?',
        answer:
          'Tone marks live on the pinyin in every lesson, and quizzes drill tone-pair distinctions explicitly (mā/má/mǎ/mà and beyond). You read and recall — live speaking practice with tone correction is on the roadmap, not shipped.',
      },
      {
        question: 'Does it help with HSK prep?',
        answer:
          'Yes — flag HSK 1, 2, or 3 in the wizard and the vocabulary lists, grammar points, and reading patterns reshape around the exam.',
      },
    ],
    estimatedHours: 'Typically 25–45 hours to A2',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'korean',
    title: 'Korean',
    category: 'language',
    eyebrow: 'Language · A1–A2 (TOPIK I)',
    headline: 'Learn Korean — Hangul in a week, the rest at your pace.',
    subhead:
      'Strive builds a Korean course around your reason — K-drama and K-pop fluency, a move, study abroad, or TOPIK I prep. Hangul lands fast, particles and verb endings come in slowly, and the daily recall queue (1 / 3 / 7 / 14 / 30 days) keeps the polite-vs-casual register straight.',
    metaDescription:
      'Personal AI-built Korean course — Hangul, particles, verb endings, and TOPIK I grounding. Daily spaced recall keeps register and forms in place.',
    keywords: [
      'learn korean',
      'korean course',
      'korean for beginners',
      'hangul',
      'topik 1',
      'k-pop korean',
      'personalized korean course',
    ],
    outcomes: [
      'Read and write Hangul fluently within the first module — no romanisation after that.',
      'Use the core particles (은/는, 이/가, 을/를, 에, 에서, 도, 만) without freezing.',
      'Conjugate verbs in the present, past, and future across formal, polite, and casual.',
      'Tell apart 합니다체, 해요체, and 반말 — and know which one is wrong for the situation.',
      'Hold a short café, subway, or introduction conversation in 해요체.',
      'Catch common phrases in K-drama and K-pop lyrics by structure, not subtitle.',
      'Retain it — recall queue brings forms and endings back over weeks.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Korean (TOPIK I)',
      modules: [
        { title: 'Hangul — the alphabet you can read by Friday', lessonCount: 4 },
        { title: 'Particles — the small words that mark who does what', lessonCount: 5 },
        { title: 'Verbs and the 해요체 that runs daily life', lessonCount: 5 },
        { title: 'Past, future, and the connectors that build sentences', lessonCount: 4 },
        { title: 'Register — 합니다체, 해요체, and 반말', lessonCount: 4 },
        { title: 'Reading a short native text — and a K-drama line', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'How long until I can actually read Hangul?',
        answer:
          'The first module is built around it, and most learners are reading (slowly) by the end of that module. Strive will not let you ride romanisation past it — once Hangul is in, the rest of the course uses it.',
      },
      {
        question: 'Does it cover TOPIK?',
        answer:
          'Yes — flag TOPIK I as the goal in the wizard and the vocabulary, grammar, and reading-comprehension patterns reshape around the exam. TOPIK II is its own (longer) course.',
      },
      {
        question: 'Is this a speaking course?',
        answer:
          'It is text-first today. You read, write, and recall — the recall queue surfaces whole phrases, not just words. Live speaking practice is on the roadmap, not shipped.',
      },
    ],
    estimatedHours: 'Typically 22–40 hours to A2',
    difficulty: 'beginner',
    updated: UPDATED,
  },
  {
    slug: 'italian',
    title: 'Italian',
    category: 'language',
    eyebrow: 'Language · A1–A2 conversational',
    headline: 'Learn Italian — for the trip, the family, or the move.',
    subhead:
      'A personal Italian course built around your reason — a holiday in Puglia, family roots in Sicily, a move to Milan, or just the sound of the language. Strive picks the vocabulary and grammar that matter for you, and the daily recall queue (1 / 3 / 7 / 14 / 30 days) keeps the conjugations from sliding away.',
    metaDescription:
      'Personal AI-built Italian course shaped to your goal — A1 to A2 grammar, real-world vocabulary, and a daily spaced-recall queue.',
    keywords: [
      'learn italian',
      'italian course',
      'italian for beginners',
      'italian a2',
      'ai italian tutor',
      'personalized italian course',
    ],
    outcomes: [
      'Hold a basic café, trattoria, shop, or hotel conversation without freezing.',
      'Use the present, passato prossimo, and imperfetto in real situations.',
      'Recognise essere vs avere as auxiliaries and which verbs take which.',
      'Handle gendered nouns, articles, and the everyday prepositions (di, a, da, in, su).',
      'Build vocabulary that matches your goal — travel, family, work, or culture.',
      'Read a simple native text (menu, sign, short article) by picking out the structure.',
      'Retain it — recall queue brings phrases and forms back over weeks.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Italian (A1 → A2)',
      modules: [
        { title: 'Sound, gender, and the first 200 words', lessonCount: 5 },
        { title: 'Present tense — regular and the verbs you’ll actually use', lessonCount: 5 },
        { title: 'Al bar, al ristorante, per strada', lessonCount: 4 },
        { title: 'The past — passato prossimo with essere and avere', lessonCount: 5 },
        { title: 'Imperfetto, prepositions, and the small words', lessonCount: 4 },
        { title: 'Reading a short native text — making sense of it', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Will it cover regional variants?',
        answer:
          'Standard Italian by default. The wizard lets you flag a region (Tuscany, Sicily, Naples, Milan) and the course will note pronunciation and vocabulary differences where they actually matter.',
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
    slug: 'productivity',
    title: 'Productivity',
    category: 'business',
    eyebrow: 'Soft skills · For founders & individual contributors',
    headline: 'Learn productivity — the small set of habits that survive a bad week.',
    subhead:
      'Most productivity systems collapse under their own weight. Strive’s course teaches a small set of operating habits — time blocking, deep-work protection, a task system you can run on a Monday morning, and email triage that does not eat the day. Lessons stream live; the daily recall queue keeps the habits in front of you when motivation does not.',
    metaDescription:
      'Personal AI-built productivity course — time blocking, deep work, task systems, email triage, meeting hygiene. Plain habits, daily recall.',
    keywords: [
      'learn productivity',
      'productivity course',
      'time blocking',
      'deep work',
      'gtd',
      'email triage',
      'meeting hygiene',
    ],
    outcomes: [
      'Run a weekly review that actually changes the next week.',
      'Time-block a calendar that survives a real Tuesday — not the imaginary one.',
      'Protect deep work from drift, notifications, and ambient meetings.',
      'Operate a lightweight task system (GTD-style or bespoke) without becoming its admin.',
      'Triage email and chat in fixed windows instead of the entire day.',
      'Cut, shorten, or refuse meetings using a defensible standard.',
      'Pick the one habit that would change the most for you, and start it Monday.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Productivity',
      modules: [
        { title: 'Why productivity systems collapse — and what to do about it', lessonCount: 3 },
        { title: 'Time blocking that survives Tuesday', lessonCount: 4 },
        { title: 'Deep work — protecting the only hours that compound', lessonCount: 4 },
        { title: 'A task system you can run on a Monday morning', lessonCount: 4 },
        { title: 'Email and chat — triage in windows, not all day', lessonCount: 3 },
        { title: 'Meeting hygiene — the cuts, the agendas, the refusals', lessonCount: 3 },
        { title: 'The weekly review that earns its place', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this another GTD course?',
        answer:
          'No. GTD is one of several task-system shapes the wizard can use — alongside lighter bespoke setups. The course is about the operating habits underneath, not the brand of the system.',
      },
      {
        question: 'I work in a high-meeting environment. Will this still apply?',
        answer:
          'Yes — the meeting-hygiene module is built for it. The course is honest that some meetings are not yours to cancel; the question becomes which ones you can shorten, batch, or step back from without paying a political cost.',
      },
      {
        question: 'Is it tied to a specific app — Notion, Things, Todoist?',
        answer:
          'No. The wizard asks what you already use and shapes examples around it; if you do not have a tool, the course suggests a small one rather than building a new dependency.',
      },
    ],
    estimatedHours: 'Typically 6–10 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'creative-writing',
    title: 'Creative writing',
    category: 'creator',
    eyebrow: 'Creator · Fiction craft, short story to novel',
    headline: 'Learn creative writing — character, scene, voice, and finishing the thing.',
    subhead:
      'Strive builds a creative-writing course shaped by what you are trying to write — a short story, a novel, a chapter that is stuck, or a voice you have not pinned down yet. Lessons stream live with worked examples and prompts; the daily recall queue keeps the craft principles in front of you while you actually draft.',
    metaDescription:
      'Personal AI-built creative writing course — character, scene, voice, structure, revision, and getting unstuck. Worked prompts and daily recall.',
    keywords: [
      'learn creative writing',
      'creative writing course',
      'fiction writing',
      'short story course',
      'novel writing',
      'writing craft',
      'ai writing tutor',
    ],
    outcomes: [
      'Build a character with desire, contradiction, and a flaw the story can use.',
      'Write a scene that earns its place — entry, turn, exit.',
      'Find a narrative voice that sounds like a person, not a workshop.',
      'Structure a short story end-to-end, and a novel chapter by chapter.',
      'Revise without rewriting forever — diagnose, don’t reflexively redraft.',
      'Get unstuck mid-draft using working tactics, not motivational quotes.',
      'Apply the craft to a real piece you are writing, not a parallel exercise.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on Creative Writing',
      modules: [
        { title: 'Character — desire, contradiction, the flaw', lessonCount: 4 },
        { title: 'Scene — the unit of story', lessonCount: 4 },
        { title: 'Voice — finding it, keeping it, knowing when it slipped', lessonCount: 4 },
        { title: 'Structure — short story shape and the novel chapter', lessonCount: 4 },
        { title: 'Dialogue and subtext — what people say vs what they want', lessonCount: 3 },
        { title: 'Revision — diagnosing instead of rewriting', lessonCount: 3 },
        { title: 'Getting unstuck — working tactics, not pep talks', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Is this for short stories or novels?',
        answer:
          'Both — you tell the wizard which you are working on and the course tilts accordingly. Short story prep concentrates structure and revision; a novel-in-progress concentrates character, scene economy, and chapter-shaping.',
      },
      {
        question: 'Will the AI write fiction for me?',
        answer:
          'No — and the course is built so it will not. Lessons teach the craft and the prompts make you write; worked examples come from published work, not generated drafts standing in for yours.',
      },
      {
        question: 'Is this the same as copywriting or marketing writing?',
        answer:
          'No. This course is fiction craft. If you want hooks, landing pages, or sales pages, the marketing-copy course is the one to run.',
      },
    ],
    estimatedHours: 'Typically 10–18 hours',
    difficulty: 'all',
    updated: UPDATED,
  },
  {
    slug: 'ux-design',
    title: 'UX design',
    category: 'design',
    eyebrow: 'Design · Research to handoff, tool-agnostic',
    headline: 'Learn UX design — research, wireframes, prototype, handoff.',
    subhead:
      'Strive builds a UX design course shaped by what you are designing for — a SaaS product, a consumer app, a redesign, or a portfolio piece. The arc runs research → wireframes → prototype → usability → handoff. Lessons stream live with worked examples; the daily recall queue keeps the heuristics and the patterns in your head while you actually open Figma.',
    metaDescription:
      'Personal AI-built UX design course — research, wireframes, prototyping, usability testing, and handoff. Tool-agnostic, Figma-friendly. Daily recall.',
    keywords: [
      'learn ux design',
      'ux design course',
      'ux for beginners',
      'wireframing',
      'usability testing',
      'figma ux',
      'product design course',
    ],
    outcomes: [
      'Run a small piece of user research and turn it into design decisions.',
      'Sketch and wireframe a flow before opening a high-fidelity tool.',
      'Build a clickable prototype in Figma (or your tool of choice) that tests the riskiest assumption.',
      'Apply Nielsen’s heuristics and common interaction patterns without quoting them by number.',
      'Run a 5-person usability test and act on what you saw, not what was tidy.',
      'Hand off to engineering with the specs, states, and edge cases they actually need.',
      'Build a portfolio-worthy case study from one of the projects you do during the course.',
    ],
    sampleCourse: {
      title: 'A typical Strive course on UX Design',
      modules: [
        { title: 'What UX really covers — and what it doesn’t', lessonCount: 3 },
        { title: 'Research — interviews, surveys, and the JTBD lens', lessonCount: 4 },
        { title: 'Information architecture and flows', lessonCount: 3 },
        { title: 'Wireframes before pixels', lessonCount: 4 },
        { title: 'High-fidelity in Figma — components, states, prototypes', lessonCount: 5 },
        { title: 'Usability testing with five users', lessonCount: 3 },
        { title: 'Handoff — specs, edge cases, and the developer conversation', lessonCount: 3 },
      ],
    },
    faq: [
      {
        question: 'Do I need Figma to take this course?',
        answer:
          'The course is tool-agnostic on principle — but Figma is the reference tool, and the high-fidelity module assumes you have access to it (the free tier is enough). Sketch, Penpot, or Adobe XD work too; the wizard lets you choose.',
      },
      {
        question: 'Is this UX or UI?',
        answer:
          'UX, with enough UI to ship a real prototype. The arc is research → wireframes → prototype → handoff. If you want pure visual design — type, colour systems, brand — that’s a different course.',
      },
      {
        question: 'Will I leave with a portfolio piece?',
        answer:
          'Yes — the course is built around a real project you choose at the start. The final module turns it into a case study you can put in a portfolio.',
      },
    ],
    estimatedHours: 'Typically 14–22 hours',
    difficulty: 'beginner',
    updated: UPDATED,
  },
];
