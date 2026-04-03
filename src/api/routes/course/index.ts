import { paths } from '@/api/_generated';
import { client, getAuthToken } from '@/api/client';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';

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

export const updateCourse = (id: string, data: UpdateCourseBody) => {
  return client<UpdateCourseResponse>({
    url: `/course/${id}`,
    method: 'PATCH',
    data,
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

export const refineStructure = (courseId: string, params: RefineStructureBody) => {
  return client<RefineStructureResponse>({
    url: `/course/${courseId}/refine-structure`,
    method: 'POST',
    data: params,
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

export const generateLesson = (courseId: string, params: { moduleIndex: number; lessonIndex: number }) => {
  return client<{ data: { jobId: string } }>({
    url: `/course/${courseId}/generate-lesson`,
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Lesson streaming ───────────────────────────────────

export type LessonStreamEvent =
  | { type: 'block'; block: LessonBlock }
  | { type: 'blocks'; blocks: LessonBlock[] }
  | { type: 'hero_image'; url: string }
  | { type: 'complete' }
  | { type: 'error'; message: string };

export const streamLesson = async (
  courseId: string,
  params: { moduleIndex: number; lessonIndex: number; includeImage?: boolean; includeLinks?: boolean },
  onEvent: (event: LessonStreamEvent) => void,
): Promise<void> => {
  const token = getAuthToken();

  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/course/${courseId}/stream-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(params),
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

export interface ExecuteCodeResponse {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: string;
  time: string | null;
  memory: number | null;
}

export const executeCode = (params: { code: string; language: string; stdin?: string }) => {
  return client<{ data: ExecuteCodeResponse }>({
    url: '/course/execute-code',
    method: 'POST',
    data: params,
  }).then((res) => res.data.data);
};

// ── Lesson content ─────────────────────────────────────

export interface LessonBlock {
  id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown> | null;
  order: number;
}

export interface LessonContentResponse {
  blocks: LessonBlock[];
  heroImageUrl: string | null;
  includeHeroImage?: boolean;
  summary: string | null;
  version: number;
}

export const getLessonContent = (courseId: string, moduleIndex: number, lessonIndex: number): Promise<LessonContentResponse | null> => {
  return client<{ data: LessonContentResponse }>({
    url: `/course/${courseId}/lesson-content/${moduleIndex}/${lessonIndex}`,
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

export interface QuizResponseInput {
  blockId: string;
  selectedOption: number;
  correct: boolean;
}

export interface ExerciseAttemptInput {
  blockId: string;
  code: string;
  passed: boolean;
}

export interface UpsertProgressBody {
  status?: 'not_started' | 'in_progress' | 'completed';
  notes?: string | null;
  bookmarked?: boolean;
  timeSpentDelta?: number;
  quizResponse?: QuizResponseInput;
  exerciseAttempt?: ExerciseAttemptInput;
}

export interface QuizResponseData {
  blockId: string;
  selectedOption: number;
  correct: boolean;
  answeredAt: string;
}

export interface ExerciseAttemptData {
  blockId: string;
  code: string;
  passed: boolean;
  attemptedAt: string;
}

export interface LessonProgress {
  _id: string;
  userId: string;
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt: string | null;
  lastAccessedAt: string;
  timeSpentSeconds: number;
  quizResponses: QuizResponseData[];
  exerciseAttempts: ExerciseAttemptData[];
  notes: string | null;
  bookmarked: boolean;
}

export interface CourseQuizProgressItem {
  moduleIndex: number;
  bestScore: number;
  bestTier: 'needs_review' | 'passed' | 'mastered' | null;
  attemptCount: number;
  nextReviewAt: string | null;
  reviewDue: boolean;
}

export interface CourseProgressResponse {
  lessons: LessonProgress[];
  quizzes: CourseQuizProgressItem[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    percentage: number;
  };
}

export interface ContinueLearningResponse {
  courseId: string;
  courseName: string;
  courseGoal: string;
  moduleName: string;
  lessonName: string;
  moduleIndex: number;
  lessonIndex: number;
  courseProgress: { total: number; completed: number; percentage: number };
}

export interface ProgressSummaryItem {
  courseId: string;
  total: number;
  completed: number;
  percentage: number;
}

export const upsertLessonProgress = (
  courseId: string,
  moduleIndex: number,
  lessonIndex: number,
  data: UpsertProgressBody,
) => {
  return client<{ data: LessonProgress }>({
    url: `/course/${courseId}/progress/${moduleIndex}/${lessonIndex}`,
    method: 'POST',
    data,
  }).then((res) => res.data.data);
};

export const getCourseProgress = (courseId: string) => {
  return client<{ data: CourseProgressResponse }>({
    url: `/course/${courseId}/progress`,
    method: 'GET',
  }).then((res) => res.data.data);
};

export const getContinueLearning = () => {
  return client<{ data: ContinueLearningResponse | null }>({
    url: '/course/continue',
    method: 'GET',
  }).then((res) => res.data.data);
};

export const getGeneratedLessons = (courseId: string) => {
  return client<{ data: { moduleIndex: number; lessonIndex: number }[] }>({
    url: `/course/${courseId}/generated-lessons`,
    method: 'GET',
  }).then((res) => res.data.data);
};

export const getProgressSummary = () => {
  return client<{ data: ProgressSummaryItem[] }>({
    url: '/course/progress-summary',
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Module quizzes ────────────────────────────────────────

export interface ModuleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  sourceLessons: number[];
  isInterleaved: boolean;
  interleavedModuleIndex?: number;
}

export interface ModuleQuizContent {
  courseId: string;
  moduleIndex: number;
  questions: ModuleQuizQuestion[];
  version: number;
}

export interface QuizAttemptQuestionResult {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceLessons: number[];
  isInterleaved: boolean;
  interleavedModuleIndex?: number;
  selectedOption: number | null;
  correct: boolean;
}

export interface QuizAttemptResult {
  attemptNumber: number;
  score: number;
  masteryTier: 'needs_review' | 'passed' | 'mastered';
  completedAt: string;
  questions: QuizAttemptQuestionResult[];
  nextReviewAt: string;
  reviewIntervalDays: number;
}

export interface ModuleQuizProgressResponse {
  _id: string;
  userId: string;
  courseId: string;
  moduleIndex: number;
  attempts: {
    attemptNumber: number;
    score: number;
    masteryTier: string;
    completedAt: string;
    quizVersion: number;
  }[];
  bestScore: number;
  bestTier: 'needs_review' | 'passed' | 'mastered' | null;
}

export const generateModuleQuiz = (courseId: string, moduleIndex: number) => {
  return client<{ data: { jobId: string } }>({
    url: `/course/${courseId}/module-quiz/${moduleIndex}/generate`,
    method: 'POST',
  }).then((res) => res.data.data);
};

export const getModuleQuizContent = (courseId: string, moduleIndex: number): Promise<ModuleQuizContent | null> => {
  return client<{ data: ModuleQuizContent }>({
    url: `/course/${courseId}/module-quiz/${moduleIndex}`,
    method: 'GET',
  })
    .then((res) => res.data.data)
    .catch((err) => {
      if (err?.message?.includes('not generated')) return null;
      throw err;
    });
};

export const submitQuizAttempt = (
  courseId: string,
  moduleIndex: number,
  responses: { questionId: string; selectedOption: number }[],
) => {
  return client<{ data: QuizAttemptResult }>({
    url: `/course/${courseId}/module-quiz/${moduleIndex}/submit`,
    method: 'POST',
    data: { responses },
  }).then((res) => res.data.data);
};

export const getModuleQuizProgress = (courseId: string, moduleIndex: number) => {
  return client<{ data: ModuleQuizProgressResponse | null }>({
    url: `/course/${courseId}/module-quiz/${moduleIndex}/progress`,
    method: 'GET',
  }).then((res) => res.data.data);
};

// ── Reviews due ──────────────────────────────────────────

export interface ReviewDueItem {
  courseId: string;
  courseName: string;
  moduleIndex: number;
  moduleName: string;
  bestScore: number;
  bestTier: 'needs_review' | 'passed' | 'mastered';
  nextReviewAt: string | null;
  reviewReason: 'time' | 'progression';
}

export const getReviewsDue = () => {
  return client<{ data: ReviewDueItem[] }>({
    url: '/course/reviews-due',
    method: 'GET',
  }).then((res) => res.data.data);
};
