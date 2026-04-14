export const TOASTS = {
  // ── Course creation ───────────────────────────────────
  COURSE_CREATE_ERROR: 'Failed to create course',
  CLARIFY_ERROR: 'Failed to generate questions. Please try again.',
  COURSE_SAVE_ERROR: 'Failed to save course data',
  STRUCTURE_ERROR: 'Failed to generate structure. Please try again.',
  DEPTH_PREVIEWS_ERROR: 'Failed to load depth options. Please try again.',
  COURSE_DELETED: 'Course deleted',
  COURSE_DELETE_ERROR: 'Failed to delete course',
  COURSE_ARCHIVED: 'Course archived',
  COURSE_UNARCHIVED: 'Course unarchived',
  COURSE_READY: 'Course is ready!',

  // ── Lesson generation ────────────────────────────────
  GENERATION_COMPLETE: 'Generation complete',
  GENERATION_FAILED: 'Generation failed',
  GENERATION_FAILED_RETRY: 'Generation failed. Please try again.',
  COURSE_COMPLETE: 'Congratulations! Course complete!',
  LESSON_COMPLETE: 'Lesson complete!',

  // ── Quiz ──────────────────────────────────────────────
  QUIZ_GENERATION_FAILED: 'Quiz generation failed. Please try again.',
  QUIZ_START_ERROR: 'Failed to start quiz generation',
  MODULE_MASTERED: 'Module mastered!',
  QUIZ_SUBMIT_ERROR: 'Failed to submit quiz',

  // ── Auth & verification ───────────────────────────────
  VERIFICATION_SENT: 'Verification email sent. Check your inbox.',
  VERIFICATION_SENT_SHORT: 'Verification email sent.',
  RESEND_ERROR: 'Failed to resend. Please try again.',
  SESSION_EXPIRED: 'Session expired. Please sign in and resend from your profile.',
  PASSWORD_REQUIRED: 'Please enter your password to confirm.',

  // ── Job management ───────────────────────────────────
  JOB_TIMEOUT: 'This is taking too long. Please try again.',

  // ── Chat ─────────────────────────────────────────────
  CHAT_HISTORY_ERROR: 'Failed to load chat history.',

  // ── Step protection ──────────────────────────────────
  CONTENT_RESET: 'Course content has been reset to match the new structure.',
} as const;

// Helper for dynamic messages with a fallback
export const toastMessage = (dynamic: string | null | undefined, fallback: string) => dynamic || fallback;
