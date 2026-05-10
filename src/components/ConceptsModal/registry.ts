import { CourseDepthAnimation } from './animations/CourseDepthAnimation';
import { CreditsAnimation } from './animations/CreditsAnimation';
import { DesignChatAnimation } from './animations/DesignChatAnimation';
import { GoalTypesAnimation } from './animations/GoalTypesAnimation';
import { HowStriveWorksAnimation } from './animations/HowStriveWorksAnimation';
import { LessonCompletionAnimation } from './animations/LessonCompletionAnimation';
import { LessonExtrasAnimation } from './animations/LessonExtrasAnimation';
import { MentorChatAnimation } from './animations/MentorChatAnimation';
import { ModulesLessonsAnimation } from './animations/ModulesLessonsAnimation';
import { NarrationAnimation } from './animations/NarrationAnimation';
import { QuizTypesAnimation } from './animations/QuizTypesAnimation';
import { RecallRatingsAnimation } from './animations/RecallRatingsAnimation';
import { SpacedRecallAnimation } from './animations/SpacedRecallAnimation';
import { WizardAnimation } from './animations/WizardAnimation';
import { XpStreaksAnimation } from './animations/XpStreaksAnimation';
import type { ComponentType } from 'react';

/**
 * Concept registry — the runtime mirror of `tutorial.md`. Edit copy in
 * `tutorial.md` first, then re-sync this registry. Keep the two in lockstep.
 *
 * Adding a concept: extend `CONCEPT_IDS`, append an entry below, and (if you
 * want the modal to render an animation for it) add a component under
 * `./animations/` and reference it here. `animation` is optional — the modal
 * shows a graceful empty visual slot when omitted.
 */
export const CONCEPT_IDS = [
  'how-strive-works',
  'credits',
  'spaced-recall',
  'course-depth',
  'goal-types',
  'wizard',
  'recall-ratings',
  'quiz-types',
  'xp-and-streaks',
  'narration',
  'mentor-chat',
  'modules-and-lessons',
  'design-chat',
  'lesson-completion',
  'lesson-extras',
] as const;

export type ConceptId = (typeof CONCEPT_IDS)[number];

export type ConceptEyebrow = 'Core concept' | 'How it works' | 'Pro tip';

export interface ConceptEntry {
  id: ConceptId;
  eyebrow: ConceptEyebrow;
  title: string;
  body: string[];
  /** Optional bespoke animation rendered in the modal header slot. */
  animation?: ComponentType;
}

export const CONCEPTS: Record<ConceptId, ConceptEntry> = {
  'how-strive-works': {
    id: 'how-strive-works',
    eyebrow: 'How it works',
    title: 'From a one-line goal to lasting knowledge',
    body: [
      'You give us a goal. We ask a few questions, propose a course shape, then stream the lessons live as you read.',
      'Each lesson seeds a handful of recall cards — small prompts that come back over the following days and weeks until the knowledge sticks.',
      "You don't memorise. The schedule does the work.",
    ],
    animation: HowStriveWorksAnimation,  },

  credits: {
    id: 'credits',
    eyebrow: 'Core concept',
    title: 'How allowance gets used',
    body: [
      'Every plan includes a monthly allowance. Generating a course, regenerating a lesson, or making narration draws from it. We measure in real cost — most lessons use a small fraction.',
      "Top-ups stack on top and don't expire. The monthly bucket resets at the start of each billing cycle and doesn't roll over.",
      'Out of allowance? You can keep reading, reviewing, and quizzing. Only new generation pauses.',
    ],
    animation: CreditsAnimation,  },

  'spaced-recall': {
    id: 'spaced-recall',
    eyebrow: 'Core concept',
    title: 'Why we bring things back',
    body: [
      "Reading something once feels like learning. It isn't.",
      'We extract small prompts from each lesson and bring them back on a widening schedule — tomorrow, then a few days, then a week. Each time you remember, the gap grows. Each time you don’t, it resets.',
      "Cards you find easy keep moving away. The ones you struggle with stay close until they don't.",
    ],
    animation: SpacedRecallAnimation,  },

  'course-depth': {
    id: 'course-depth',
    eyebrow: 'How it works',
    title: 'Picking the right shape',
    body: [
      'Overview gives you a working grasp — short and quick. Comprehensive covers the topic end-to-end. Deep Dive goes for mastery and takes the most time.',
      "We recommend a tier based on your answers — but it's only advice. You can pick any of the three.",
      'The recall queue and quizzes scale with whatever you choose.',
    ],
    animation: CourseDepthAnimation,  },

  'goal-types': {
    id: 'goal-types',
    eyebrow: 'How it works',
    title: "What's this knowledge for?",
    body: [
      "We tune the course to what you'll do with it.",
      'Master — go deep, build a complete model. Monetize — focus on what earns or sells. Pass — narrow to what’s on the test. Build — practice-heavy, project-shaped. Fluency — conversational range over depth.',
      'Switching mid-flow regenerates the questions for the new shape. Pick before answering if you can.',
    ],
    animation: GoalTypesAnimation,
  },

  wizard: {
    id: 'wizard',
    eyebrow: 'How it works',
    title: 'How we build your course',
    body: [
      'Four steps. One, you tell us the goal. Two, we ask 3–5 short questions to size and flavour the course (one is always free-text so you can name specifics).',
      'Three, you pick a depth — we recommend one based on your answers. Four, we draft an outline; you can chat with it to add, remove, or reshape modules before accepting.',
      'After acceptance, lessons start streaming.',
    ],
    animation: WizardAnimation,
  },

  'recall-ratings': {
    id: 'recall-ratings',
    eyebrow: 'Pro tip',
    title: 'What each rating means',
    body: [
      'After you reveal (or type) the answer, you rate honesty — not performance.',
      'Again — you forgot it; the card resets and comes back tomorrow. Hard — you got there but it cost you; same interval next time. Good — solid recall; the gap widens. Easy — instant; the gap jumps further.',
      "Be honest with Again. It's how the algorithm earns its keep.",
    ],
    animation: RecallRatingsAnimation,  },

  'quiz-types': {
    id: 'quiz-types',
    eyebrow: 'How it works',
    title: 'Two kinds of quiz, two different jobs',
    body: [
      "Inline quizzes appear inside lessons — quick self-checks. The answer isn't graded or stored. Use them to test yourself as you read.",
      'Module quizzes sit at the end of each module. They’re graded, count toward your XP, and we keep your best score.',
      'Only module quizzes count toward progress. Inline quizzes are for you, not for the record.',
    ],
    animation: QuizTypesAnimation,
  },

  'xp-and-streaks': {
    id: 'xp-and-streaks',
    eyebrow: 'How it works',
    title: 'Why we count any of this',
    body: [
      "XP rewards finishing things — completed lessons, improved quiz scores, mastered recall cards. The level curve flattens after L25, so chasing levels stops paying off. The streak doesn't.",
      'Streaks count consecutive days with any learning activity — even a 3-card recall counts. Weekends are forgiven by default.',
      "The point isn't to gamify learning into a chore. It's to nudge you toward the cadence the recall scheduler already needs you to keep.",
    ],
    animation: XpStreaksAnimation,  },

  narration: {
    id: 'narration',
    eyebrow: 'Pro tip',
    title: 'Listen to your lesson',
    body: [
      'We can read the lesson aloud in one of six voices. Generating uses a small slice of allowance; once made, the audio is cached, so re-opening the lesson is free.',
      "The audio sticks to prose — anything that doesn't translate cleanly to speech is skipped rather than read awkwardly.",
      "Changing your default voice in Profile doesn't rewrite past lessons — you'll see a “Regenerate with [voice]” button on lessons narrated in your old voice.",
    ],
    animation: NarrationAnimation,  },

  'mentor-chat': {
    id: 'mentor-chat',
    eyebrow: 'How it works',
    title: 'Two mentors, two scopes',
    body: [
      "The **lesson mentor** lives inside the lesson. It has read what you're studying and the lessons around it — ask for a re-explanation in different words, an example in your own field, or help troubleshooting something you tried. You can paste code, a URL, or attach a PDF and discuss whatever you've shared.",
      "The **course mentor** sits on the course overview. It sees your whole outline, your progress, and what's due in recall — ask \"what should I do next?\", \"how does module 3 connect to module 7?\", or \"where am I weakest?\". It points you to the right surface — a lesson, a quiz, your recall queue — rather than re-teaching.",
      "Different jobs, paired on purpose. The lesson mentor is where you stop when you're stuck mid-paragraph; the course mentor is where you stand back to decide what's next.",
    ],
    animation: MentorChatAnimation,  },

  'modules-and-lessons': {
    id: 'modules-and-lessons',
    eyebrow: 'How it works',
    title: 'How a course is laid out',
    body: [
      'A course is a stack of modules. Each module is a small set of lessons on a tight subtopic, capped by a module quiz.',
      "You don't have to do them in order, but the quiz unlocks once all lessons in its module are completed.",
      'The structure is fixed once you accept the course. Refine it before accepting — chat with the outline in the wizard to add, remove, or reshape modules.',
    ],
    animation: ModulesLessonsAnimation,
  },

  'design-chat': {
    id: 'design-chat',
    eyebrow: 'How it works',
    title: 'Talk to the outline',
    body: [
      "The proposed structure is a draft, not a verdict. The chat sees your goal, your answers, and the current outline — talk to it the way you'd talk to a course designer.",
      "Ask “why this order?” or “is testing covered?” and it answers without changing anything. Or instruct: “split module 2 in two”, “drop the basics”, “more practice, less theory” — the outline updates in place.",
      "Refine here, before you accept. Once you accept, the structure locks in; if any lessons have already streamed when you change the outline, those get cleared and regenerated.",
    ],
    animation: DesignChatAnimation,
  },

  'lesson-completion': {
    id: 'lesson-completion',
    eyebrow: 'How it works',
    title: 'Why finishing matters',
    body: [
      "Scrolling to the bottom doesn't count. Marking a lesson finished is the gate — and it does more than save your spot.",
      "It releases this lesson's recall cards into your daily review queue, counts toward unlocking the module quiz (which auto-opens once every lesson in the module is marked), awards 50 XP and your daily streak tick, and forwards you to the next lesson.",
      "Skip ahead and come back if you want — but until you mark it, the cards stay dormant and the quiz stays locked. The button is the moment the lesson enters your learning loop.",
    ],
    animation: LessonCompletionAnimation,
  },

  'lesson-extras': {
    id: 'lesson-extras',
    eyebrow: 'How it works',
    title: 'Two optional extras',
    body: [
      "Both come with the lesson by default, but neither is required for learning. Toggle either off to save a slice of allowance and ship the lesson faster.",
      "The hero image is a decorative cover at the top — visual mood, nothing more. The lesson reads identically without it.",
      "Further reading is a short list of AI-curated external links at the bottom — articles, docs, or videos that deepen the topic. The lesson body is self-contained, so skip it if you don't need outside material. Either can be added later if you change your mind.",
    ],
    animation: LessonExtrasAnimation,
  },
};
