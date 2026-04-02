import { components } from './_generated';

export type ApiError = components['schemas']['ApiError'];

export type AuthorisedUser = components['schemas']['AuthorisedUser'];
export type AuthProvider = components['schemas']['AuthProvider'];

export type ClarifyQuestion = components['schemas']['ClarifyQuestion'];
export type ClarifyResponse = components['schemas']['ClarifyResponse'];
export type CourseModule = components['schemas']['CourseModule'];
export type CourseLesson = components['schemas']['CourseLesson'];
export type Course = components['schemas']['Course'];
export type CourseStatus = Course['status'];
export type CourseDepth = NonNullable<Course['depth']>;
export type QuestionType = ClarifyQuestion['type'];
export type DepthPreview = components['schemas']['DepthPreview'];
export type DepthPreviewsResponse = components['schemas']['DepthPreviewsResponse'];
export type JobStatus = components['schemas']['JobStatus'];
