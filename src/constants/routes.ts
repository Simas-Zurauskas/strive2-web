// Centralized route builders. Prefer these over inline template strings so a
// slug-vs-id or path change has a single source of truth.

export const ROUTES = {
  home: () => '/',
  library: (tab?: 'courses' | 'bookmarks') => (tab ? `/library?tab=${tab}` : '/library'),
  login: () => '/login',
  signup: () => '/signup',
  checkEmail: () => '/signup/check-email',

  pricing: () => '/pricing',
  // Billing lives under Profile as a tab; the querystring drives which tab
  // opens so deep links / nav from elsewhere in the app land the user on
  // the right view without a second click. Stripe post-checkout returns
  // redirect straight here with `&checkout=subscription|topup` appended —
  // the Billing tab picks up the flag and shows a welcome toast, no
  // dedicated success page needed.
  billing: () => '/profile?tab=billing',
  profile: () => '/profile',

  // Global recall practice queue (Leitner) — not course-scoped. Linked
  // from the navbar AND from mentor hand-offs (`emit_handoff` with
  // target='recall' resolves here; the wire string is 'recall'
  // for back-compat with stored mentor sessions).
  recall: () => '/recall',

  course: (slugOrId: string | null | undefined, fallbackId: string) =>
    `/course/${slugOrId ?? fallbackId}`,

  lesson: (
    slugOrId: string | null | undefined,
    fallbackId: string,
    moduleIndex: number,
    lessonIndex: number,
  ) => `${ROUTES.course(slugOrId, fallbackId)}/lesson/${moduleIndex}/${lessonIndex}`,

  moduleQuiz: (
    slugOrId: string | null | undefined,
    fallbackId: string,
    moduleIndex: number,
    review?: boolean,
  ) => `${ROUTES.course(slugOrId, fallbackId)}/quiz/${moduleIndex}${review ? '?review=true' : ''}`,
} as const;
