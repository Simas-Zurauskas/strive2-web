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
  // Per-feature completion messages. Used by the central WS-status
  // router in useJobManager.tsx, which also decides whether to show
  // the toast at all (suppressed when the user is already on the
  // target page).
  GENERATION_COMPLETE: 'Lesson ready.',
  GENERATION_COMPLETE_HERO: 'Hero image generated.',
  GENERATION_COMPLETE_LINKS: 'Further reading curated.',
  GENERATION_COMPLETE_RECALL: 'Recall cards ready.',
  GENERATION_COMPLETE_NARRATION: 'Narration ready.',
  GENERATION_COMPLETE_QUIZ: 'Quiz ready.',
  GENERATION_FAILED: 'Generation failed',
  GENERATION_FAILED_RETRY: 'Generation failed. Please try again.',
  COURSE_COMPLETE: 'Course complete.',

  // ── Quiz ──────────────────────────────────────────────
  QUIZ_GENERATION_FAILED: 'Quiz generation failed. Please try again.',
  QUIZ_START_ERROR: 'Failed to start quiz generation',
  MODULE_MASTERED: 'Module mastered.',
  QUIZ_SUBMIT_ERROR: 'Failed to submit quiz',

  // ── Auth & verification ───────────────────────────────
  VERIFICATION_SENT: 'Verification email sent. Check your inbox.',
  VERIFICATION_SENT_SHORT: 'Verification email sent.',
  RESEND_ERROR: 'Failed to resend. Please try again.',
  SESSION_EXPIRED: 'Session expired. Please sign in and resend from your profile.',
  PASSWORD_REQUIRED: 'Please enter your password to confirm.',
  PASSWORD_CHANGED: 'Password updated. Other devices have been signed out.',
  PASSWORD_SET: 'Password set. You can now sign in with email and password.',
  PASSWORD_CHANGE_ERROR: 'Failed to change password. Please try again.',
  CODE_SENT: 'Confirmation code sent. Check your email.',
  CODE_SEND_ERROR: 'Could not send confirmation code. Please try again.',
  RESET_LINK_SENT: 'If an account exists for that email, a reset link has been sent.',
  RESET_LINK_INVALID: 'This reset link is invalid or has been used.',
  RESET_LINK_EXPIRED: 'This reset link has expired. Please request a new one.',
  RESET_PASSWORD_SUCCESS: 'Password reset. Please sign in with your new password.',
  FORGOT_PASSWORD_ERROR: 'Could not send reset link. Please try again.',

  // ── Chat ─────────────────────────────────────────────
  CHAT_HISTORY_ERROR: 'Failed to load chat history.',

  // ── Step protection ──────────────────────────────────
  CONTENT_RESET: 'Course content has been reset to match the new structure.',
} as const;

// Helper for dynamic messages with a fallback
export const toastMessage = ({ dynamic, fallback }: { dynamic: string | null | undefined; fallback: string }) => dynamic || fallback;
