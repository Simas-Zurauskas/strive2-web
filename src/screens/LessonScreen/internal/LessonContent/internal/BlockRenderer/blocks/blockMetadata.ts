/**
 * Typed metadata shapes for `quiz` and `exercise` lesson blocks, plus
 * runtime parsers.
 *
 * Why: the server-side `LessonContentModel.blocks[].metadata` field is
 * declared as `Record<string, unknown> | null` (block-type-specific
 * shape would balloon the schema), so the OpenAPI codegen surfaces it
 * to the client as `unknown`. Casting `metadata?.field as Type` inline
 * works in the happy path but silently produces empty/wrong-shape
 * output when the LLM-generated content drifts. These parsers narrow
 * the shape at the boundary and let the components render a graceful
 * fallback instead.
 */

export interface QuizBlockMetadata {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface ExerciseBlockMetadata {
  /** Programming language hint, e.g. "python", "javascript". Empty
   * string is allowed and means "render content only, no editor". */
  language: string;
  /** Initial code shown in the editor. Empty string allowed (no editor). */
  starterCode: string;
  /** Optional reference output the learner's run is compared against. */
  expectedOutput?: string;
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === 'string');

/**
 * Parse + validate quiz metadata. Returns null on any of:
 *   - missing or non-string question
 *   - missing/empty/non-string-array options
 *   - non-number correctIndex OR correctIndex out of `options` range
 *
 * `explanation` is optional — preserved when a string, otherwise omitted.
 */
export const parseQuizMetadata = (raw: unknown): QuizBlockMetadata | null => {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Record<string, unknown>;

  if (typeof m.question !== 'string' || m.question.length === 0) return null;
  if (!isStringArray(m.options) || m.options.length === 0) return null;
  if (typeof m.correctIndex !== 'number') return null;
  if (m.correctIndex < 0 || m.correctIndex >= m.options.length) return null;

  return {
    question: m.question,
    options: m.options,
    correctIndex: m.correctIndex,
    ...(typeof m.explanation === 'string' && m.explanation.length > 0
      ? { explanation: m.explanation }
      : {}),
  };
};

/**
 * Parse + validate exercise metadata. Always returns a populated
 * object (never null) — the existing component contract supports
 * "exercise with no editor" via empty `language`/`starterCode`, so
 * partial metadata still renders the prose-only view.
 */
export const parseExerciseMetadata = (raw: unknown): ExerciseBlockMetadata => {
  if (!raw || typeof raw !== 'object') {
    return { language: '', starterCode: '' };
  }
  const m = raw as Record<string, unknown>;
  return {
    language: typeof m.language === 'string' ? m.language : '',
    starterCode: typeof m.starterCode === 'string' ? m.starterCode : '',
    ...(typeof m.expectedOutput === 'string' && m.expectedOutput.length > 0
      ? { expectedOutput: m.expectedOutput }
      : {}),
  };
};
