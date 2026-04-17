/**
 * UI-only state unions — these are purely presentation concerns and not
 * backed by any OpenAPI schema, so they belong here rather than in
 * `@/api/types`. Keep this file to presentation enums only.
 */

// Quiz icon states in course/module sidebars, overview cards, and quiz lists.
// `mastered | passed | needs_review` mirror QuizMasteryTier; `locked` and
// `not-taken` are UI-only states. Consumers that don't use `locked` simply
// don't emit it, keeping a single source of truth for the superset.
export type QuizIconVariant = 'locked' | 'not-taken' | 'mastered' | 'passed' | 'needs_review';

// Per-option state for multiple-choice questions during quiz interaction.
export type QuizOptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';
