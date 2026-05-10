// Source-of-truth types for the public /learn topic landing pages.
//
// Privacy note: every field in LearnTopic is hand-authored marketing
// copy. None of it is derived from any individual learner's generated
// course. The `sampleCourse` outline is a *demonstration* outline — it
// is not, and must never become, a copy of a user-generated course.

export type LearnCategory =
  | 'language'
  | 'programming'
  | 'data'
  | 'math'
  | 'science'
  | 'business'
  | 'design'
  | 'creator';

export type LearnDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface LearnSampleModule {
  title: string;
  lessonCount: number;
}

export interface LearnFaq {
  question: string;
  answer: string;
}

export interface LearnTopic {
  slug: string;
  title: string;
  category: LearnCategory;
  eyebrow: string;
  headline: string;
  subhead: string;
  metaDescription: string;
  keywords: readonly string[];
  outcomes: readonly string[];
  sampleCourse: {
    title: string;
    modules: readonly LearnSampleModule[];
  };
  faq: readonly LearnFaq[];
  estimatedHours: string;
  difficulty: LearnDifficulty;
  updated: string;
}
