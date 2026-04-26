import { paths } from '@/api/_generated';
import { client } from '@/api/client';

// ── Course CRUD ─────────────────────────────────────────

type CreateCourseBody = paths['/api/course']['post']['requestBody']['content']['application/json'];
type CreateCourseResponse = paths['/api/course']['post']['responses']['200']['content']['application/json'];

export const createCourse = (params: CreateCourseBody) => {
  return client<CreateCourseResponse>({
    url: '/course',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

type ListCoursesResponse = paths['/api/course']['get']['responses']['200']['content']['application/json'];

export const getCourses = () => {
  return client<ListCoursesResponse>({
    url: '/course',
    method: 'GET',
  }).then((res) => res.data.data);
};

type GetCourseResponse = paths['/api/course/{id}']['get']['responses']['200']['content']['application/json'];

export const getCourse = (id: string) => {
  return client<GetCourseResponse>({
    url: `/course/${id}`,
    method: 'GET',
  }).then((res) => res.data.data);
};

type UpdateCourseBody = paths['/api/course/{id}']['patch']['requestBody']['content']['application/json'];
type UpdateCourseResponse = paths['/api/course/{id}']['patch']['responses']['200']['content']['application/json'];

export const updateCourse = (params: { id: string; data: UpdateCourseBody }) => {
  return client<UpdateCourseResponse>({
    url: `/course/${params.id}`,
    method: 'PATCH',
    data: params.data,
  }).then((res) => res.data.data);
};

export const deleteCourse = (id: string) => {
  return client({
    url: `/course/${id}`,
    method: 'DELETE',
  });
};

// ── AI Generation (scoped to course) ────────────────────

type ClarifyResponse =
  paths['/api/course/{courseId}/clarify']['post']['responses']['202']['content']['application/json'];

export const clarifyCourse = (courseId: string) => {
  return client<ClarifyResponse>({
    url: `/course/${courseId}/clarify`,
    method: 'POST',
  }).then((res) => res.data.data);
};

type GenerateStructureResponse =
  paths['/api/course/{courseId}/generate-structure']['post']['responses']['202']['content']['application/json'];

export const generateStructure = (courseId: string) => {
  return client<GenerateStructureResponse>({
    url: `/course/${courseId}/generate-structure`,
    method: 'POST',
  }).then((res) => res.data.data);
};

type RefineStructureBody =
  paths['/api/course/{courseId}/refine-structure']['post']['requestBody']['content']['application/json'];
type RefineStructureResponse =
  paths['/api/course/{courseId}/refine-structure']['post']['responses']['202']['content']['application/json'];

export const refineStructure = (params: { courseId: string; data: RefineStructureBody }) => {
  return client<RefineStructureResponse>({
    url: `/course/${params.courseId}/refine-structure`,
    method: 'POST',
    data: params.data,
  }).then((res) => res.data.data);
};

// ── Depth previews ─────────────────────────────────────

type GenerateDepthPreviewsResponse =
  paths['/api/course/{courseId}/depth-previews']['post']['responses']['202']['content']['application/json'];

export const generateDepthPreviews = (courseId: string) => {
  return client<GenerateDepthPreviewsResponse>({
    url: `/course/${courseId}/depth-previews`,
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Lesson generation ──────────────────────────────────

type GenerateLessonResponse =
  paths['/api/course/{courseId}/generate-lesson']['post']['responses']['202']['content']['application/json'];

export const generateLesson = (params: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  includeImage?: boolean;
  includeLinks?: boolean;
}) => {
  const { courseId, ...body } = params;
  return client<GenerateLessonResponse>({
    url: `/course/${courseId}/generate-lesson`,
    method: 'POST',
    data: body,
  }).then((res) => res.data.data);
};

// ── Hero / links regeneration ──────────────────────────

type RegenerateHeroResponse =
  paths['/api/course/{courseId}/lesson/{moduleIndex}/{lessonIndex}/regenerate-hero']['post']['responses']['202']['content']['application/json'];

export const regenerateHero = (params: { courseId: string; moduleIndex: number; lessonIndex: number }) => {
  return client<RegenerateHeroResponse>({
    url: `/course/${params.courseId}/lesson/${params.moduleIndex}/${params.lessonIndex}/regenerate-hero`,
    method: 'POST',
  }).then((res) => res.data.data);
};

type RegenerateLinksResponse =
  paths['/api/course/{courseId}/lesson/{moduleIndex}/{lessonIndex}/regenerate-links']['post']['responses']['202']['content']['application/json'];

export const regenerateLinks = (params: { courseId: string; moduleIndex: number; lessonIndex: number }) => {
  return client<RegenerateLinksResponse>({
    url: `/course/${params.courseId}/lesson/${params.moduleIndex}/${params.lessonIndex}/regenerate-links`,
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Lesson narration (TTS) ─────────────────────────────

type GenerateNarrationBody = NonNullable<
  paths['/api/course/{courseId}/lesson/{moduleIndex}/{lessonIndex}/narration']['post']['requestBody']
>['content']['application/json'];
type GenerateNarrationResponse =
  paths['/api/course/{courseId}/lesson/{moduleIndex}/{lessonIndex}/narration']['post']['responses']['202']['content']['application/json'];

export const generateLessonNarration = (params: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  body?: GenerateNarrationBody;
}) => {
  return client<GenerateNarrationResponse>({
    url: `/course/${params.courseId}/lesson/${params.moduleIndex}/${params.lessonIndex}/narration`,
    method: 'POST',
    data: params.body ?? {},
  }).then((res) => res.data.data);
};

export const deleteLessonNarration = (params: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
}) => {
  return client({
    url: `/course/${params.courseId}/lesson/${params.moduleIndex}/${params.lessonIndex}/narration`,
    method: 'DELETE',
  });
};

type NarrationVoicesResponse =
  paths['/api/course/narration-voices']['get']['responses']['200']['content']['application/json'];

export const getNarrationVoices = () => {
  return client<NarrationVoicesResponse>({
    url: '/course/narration-voices',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Code execution ─────────────────────────────────────

type ExecuteCodeResponse = paths['/api/course/execute-code']['post']['responses']['200']['content']['application/json'];

export const executeCode = (params: { code: string; language: string; stdin?: string }) => {
  return client<ExecuteCodeResponse>({
    url: '/course/execute-code',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Lesson content ─────────────────────────────────────

export type LessonContentResponse =
  paths['/api/course/{courseId}/lesson-content/{moduleIndex}/{lessonIndex}']['get']['responses']['200']['content']['application/json'];

export const getLessonContent = (params: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
}): Promise<LessonContentResponse['data'] | null> => {
  return client<LessonContentResponse>({
    url: `/course/${params.courseId}/lesson-content/${params.moduleIndex}/${params.lessonIndex}`,
    method: 'GET',
  })
    .then((res) => res.data.data)
    .catch((err) => {
      // 404 = not generated yet — return null instead of throwing
      // so React Query stays in success state and refetchInterval works
      if (err?.message?.includes('not yet generated')) return null;
      throw err;
    });
};

// ── Chat history ────────────────────────────────────────

type ChatHistoryResponse =
  paths['/api/course/{courseId}/chat/history']['get']['responses']['200']['content']['application/json'];

export const getChatHistory = (courseId: string) => {
  return client<ChatHistoryResponse>({
    url: `/course/${courseId}/chat/history`,
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Job polling ─────────────────────────────────────────

type JobStatusResponse = paths['/api/course/job/{jobId}']['get']['responses']['200']['content']['application/json'];

export const getJobStatus = (jobId: string) => {
  return client<JobStatusResponse>({
    url: `/course/job/${jobId}`,
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Progress tracking ──────────────────────────────────

export type UpsertProgressBody = NonNullable<
  paths['/api/course/{courseId}/progress/{moduleIndex}/{lessonIndex}']['post']['requestBody']
>['content']['application/json'];

type UpsertProgressResponse =
  paths['/api/course/{courseId}/progress/{moduleIndex}/{lessonIndex}']['post']['responses']['200']['content']['application/json'];

export type CourseProgressResponse =
  paths['/api/course/{courseId}/progress']['get']['responses']['200']['content']['application/json']['data'];

export type ContinueLearningResponse = NonNullable<
  paths['/api/course/continue']['get']['responses']['200']['content']['application/json']['data']
>;

export type ProgressSummaryItem =
  paths['/api/course/progress-summary']['get']['responses']['200']['content']['application/json']['data'][number];

export const upsertLessonProgress = (params: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  data: UpsertProgressBody;
}) => {
  return client<UpsertProgressResponse>({
    url: `/course/${params.courseId}/progress/${params.moduleIndex}/${params.lessonIndex}`,
    method: 'POST',
    data: params.data,
  }).then((res) => res.data.data);
};

type CourseProgressFullResponse =
  paths['/api/course/{courseId}/progress']['get']['responses']['200']['content']['application/json'];

export const getCourseProgress = (courseId: string) => {
  return client<CourseProgressFullResponse>({
    url: `/course/${courseId}/progress`,
    method: 'GET',
  }).then((res) => res.data.data);
};

type ContinueLearningFullResponse =
  paths['/api/course/continue']['get']['responses']['200']['content']['application/json'];

export const getContinueLearning = () => {
  return client<ContinueLearningFullResponse>({
    url: '/course/continue',
    method: 'GET',
  }).then((res) => res.data.data);
};

type GeneratedLessonsResponse =
  paths['/api/course/{courseId}/generated-lessons']['get']['responses']['200']['content']['application/json'];

export const getGeneratedLessons = (courseId: string) => {
  return client<GeneratedLessonsResponse>({
    url: `/course/${courseId}/generated-lessons`,
    method: 'GET',
  }).then((res) => res.data.data);
};

type ProgressSummaryResponse =
  paths['/api/course/progress-summary']['get']['responses']['200']['content']['application/json'];

export const getProgressSummary = () => {
  return client<ProgressSummaryResponse>({
    url: '/course/progress-summary',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Module quizzes ────────────────────────────────────────

type GenerateModuleQuizResponse =
  paths['/api/course/{courseId}/module-quiz/{moduleIndex}/generate']['post']['responses']['200']['content']['application/json'];

export const generateModuleQuiz = (params: { courseId: string; moduleIndex: number }) => {
  return client<GenerateModuleQuizResponse>({
    url: `/course/${params.courseId}/module-quiz/${params.moduleIndex}/generate`,
    method: 'POST',
  }).then((res) => res.data.data);
};

type GetModuleQuizContentResponse =
  paths['/api/course/{courseId}/module-quiz/{moduleIndex}']['get']['responses']['200']['content']['application/json'];

export const getModuleQuizContent = (params: {
  courseId: string;
  moduleIndex: number;
}): Promise<GetModuleQuizContentResponse['data'] | null> => {
  return client<GetModuleQuizContentResponse>({
    url: `/course/${params.courseId}/module-quiz/${params.moduleIndex}`,
    method: 'GET',
  })
    .then((res) => res.data.data)
    .catch((err) => {
      if (err?.message?.includes('not generated')) return null;
      throw err;
    });
};

type SubmitQuizAttemptResponse =
  paths['/api/course/{courseId}/module-quiz/{moduleIndex}/submit']['post']['responses']['200']['content']['application/json'];

export const submitQuizAttempt = (params: {
  courseId: string;
  moduleIndex: number;
  responses: { questionId: string; selectedOption: number }[];
}) => {
  return client<SubmitQuizAttemptResponse>({
    url: `/course/${params.courseId}/module-quiz/${params.moduleIndex}/submit`,
    method: 'POST',
    data: { responses: params.responses },
  }).then((res) => res.data.data);
};

type GetModuleQuizProgressResponse =
  paths['/api/course/{courseId}/module-quiz/{moduleIndex}/progress']['get']['responses']['200']['content']['application/json'];

export const getModuleQuizProgress = (params: { courseId: string; moduleIndex: number }) => {
  return client<GetModuleQuizProgressResponse>({
    url: `/course/${params.courseId}/module-quiz/${params.moduleIndex}/progress`,
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Edit impact assessment ──────────────────────────────

type EditImpactFullResponse =
  paths['/api/course/{courseId}/edit-impact']['get']['responses']['200']['content']['application/json'];

export type EditImpactResponse = EditImpactFullResponse['data'];

export const getEditImpact = (courseId: string) => {
  return client<EditImpactFullResponse>({
    url: `/course/${courseId}/edit-impact`,
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Dev: reset module quiz ───────────────────────────────

export const resetModuleQuiz = (params: { courseId: string; moduleIndex: number }) => {
  return client<{ data: { deleted: { quizContent: boolean; quizProgress: boolean } } }>({
    url: `/course/${params.courseId}/module-quiz/${params.moduleIndex}/reset`,
    method: 'DELETE',
  }).then((res) => res.data.data);
};

// ── Reviews due ──────────────────────────────────────────

type ReviewsDueResponse = paths['/api/course/reviews-due']['get']['responses']['200']['content']['application/json'];

export const getReviewsDue = () => {
  return client<ReviewsDueResponse>({
    url: '/course/reviews-due',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Unattempted quizzes ─────────────────────────────────

type UnattemptedQuizzesResponse =
  paths['/api/course/unattempted-quiz-count']['get']['responses']['200']['content']['application/json'];

export const getUnattemptedQuizzes = () => {
  return client<UnattemptedQuizzesResponse>({
    url: '/course/unattempted-quiz-count',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Favorites ──────────────────────────────────────────

type FavoriteCourseIdsResponse =
  paths['/api/course/favorites']['get']['responses']['200']['content']['application/json'];

export const getFavoriteCourseIds = () => {
  return client<FavoriteCourseIdsResponse>({
    url: '/course/favorites',
    method: 'GET',
  }).then((res) => res.data.data);
};

type ToggleFavoriteCourseResponse =
  paths['/api/course/favorite/{courseId}']['post']['responses']['200']['content']['application/json'];

export const toggleFavoriteCourse = (courseId: string) => {
  return client<ToggleFavoriteCourseResponse>({
    url: `/course/favorite/${courseId}`,
    method: 'POST',
  }).then((res) => res.data.data);
};

// ── Bookmarked lessons ─────────────────────────────────

type BookmarkedLessonsResponse =
  paths['/api/course/bookmarked-lessons']['get']['responses']['200']['content']['application/json'];

export const getBookmarkedLessons = () => {
  return client<BookmarkedLessonsResponse>({
    url: '/course/bookmarked-lessons',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Recent activity ────────────────────────────────

type RecentActivityResponse =
  paths['/api/course/recent-activity']['get']['responses']['200']['content']['application/json'];

export const getRecentActivity = () => {
  return client<RecentActivityResponse>({
    url: '/course/recent-activity',
    method: 'GET',
  }).then((res) => res.data.data);
};
