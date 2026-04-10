import { paths } from '@/api/_generated';
import { client, getAuthToken } from '@/api/client';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';
import type { LessonBlock } from '@/api/types';

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

export const generateLesson = (params: { courseId: string; moduleIndex: number; lessonIndex: number }) => {
  const { courseId, ...body } = params;
  return client<GenerateLessonResponse>({
    url: `/course/${courseId}/generate-lesson`,
    method: 'POST',
    data: body,
  }).then((res) => res.data.data);
};

// ── Lesson streaming ───────────────────────────────────

export interface PlaceholderBlock {
  id: string;
  type: 'quiz' | 'exercise';
  order: number;
}

export type LessonStreamEvent =
  | { type: 'block'; block: LessonBlock }
  | { type: 'blocks'; blocks: LessonBlock[] }
  | { type: 'hero_image'; url: string }
  | { type: 'content_ready'; placeholders: PlaceholderBlock[] }
  | { type: 'complete' }
  | { type: 'error'; message: string };

export const streamLesson = async (
  params: {
    courseId: string;
    moduleIndex: number;
    lessonIndex: number;
    includeImage?: boolean;
    includeLinks?: boolean;
    signal?: AbortSignal;
    onEvent: (event: LessonStreamEvent) => void;
  },
): Promise<void> => {
  const { courseId, onEvent, signal, ...body } = params;
  const token = getAuthToken();

  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/course/${courseId}/stream-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = 'Generation failed';
    try { message = JSON.parse(text).message ?? message; } catch { /* ignore */ }
    onEvent({ type: 'error', message });
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onEvent({ type: 'error', message: 'No response stream' });
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Parse SSE lines: "data: {...}\n\n"
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const json = trimmed.slice(6); // strip "data: "
      if (json === '[DONE]') continue;

      try {
        const event = JSON.parse(json) as LessonStreamEvent;
        onEvent(event);
      } catch {
        // ignore malformed events
      }
    }
  }
};

// ── Code execution ─────────────────────────────────────

type ExecuteCodeResponse =
  paths['/api/course/execute-code']['post']['responses']['200']['content']['application/json'];

export const executeCode = (params: { code: string; language: string; stdin?: string }) => {
  return client<ExecuteCodeResponse>({
    url: '/course/execute-code',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Lesson content ─────────────────────────────────────

type LessonContentResponse =
  paths['/api/course/{courseId}/lesson-content/{moduleIndex}/{lessonIndex}']['get']['responses']['200']['content']['application/json'];

export type { LessonContentResponse };

export const getLessonContent = (params: { courseId: string; moduleIndex: number; lessonIndex: number }): Promise<LessonContentResponse['data'] | null> => {
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

type JobStatusResponse =
  paths['/api/course/job/{jobId}']['get']['responses']['200']['content']['application/json'];

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

export const upsertLessonProgress = (
  params: { courseId: string; moduleIndex: number; lessonIndex: number; data: UpsertProgressBody },
) => {
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

export const getModuleQuizContent = (params: { courseId: string; moduleIndex: number }): Promise<GetModuleQuizContentResponse['data'] | null> => {
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

export const submitQuizAttempt = (
  params: { courseId: string; moduleIndex: number; responses: { questionId: string; selectedOption: number }[] },
) => {
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

type ReviewsDueResponse =
  paths['/api/course/reviews-due']['get']['responses']['200']['content']['application/json'];

export const getReviewsDue = () => {
  return client<ReviewsDueResponse>({
    url: '/course/reviews-due',
    method: 'GET',
  }).then((res) => res.data.data);
};
