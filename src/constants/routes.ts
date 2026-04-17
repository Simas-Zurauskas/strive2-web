// Centralized route builders. Prefer these over inline template strings so a
// slug-vs-id or path change has a single source of truth.

export const ROUTES = {
  home: () => '/',
  login: () => '/login',
  signup: () => '/signup',
  checkEmail: () => '/signup/check-email',

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
