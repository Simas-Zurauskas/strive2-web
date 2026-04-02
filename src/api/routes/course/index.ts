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
  summary: string | null;
  version: number;
}

export const getLessonContent = (courseId: string, moduleIndex: number, lessonIndex: number) => {
  return client<{ data: LessonContentResponse }>({
    url: `/course/${courseId}/lesson-content/${moduleIndex}/${lessonIndex}`,
    method: 'GET',
  }).then((res) => res.data.data);
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
