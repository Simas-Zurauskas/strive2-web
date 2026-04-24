import { components } from './_generated';

// ── Enum types ─────────────────────────────────────────

export type ErrorCode = components['schemas']['ErrorCode'];
export type AuthProviderType = components['schemas']['AuthProviderType'];
export type QuestionType = components['schemas']['QuestionType'];
export type CourseDepth = components['schemas']['CourseDepth'];
export type CourseStatus = components['schemas']['CourseStatus'];
export type JobStatusEnum = components['schemas']['JobStatusEnum'];
export type JobType = components['schemas']['JobType'];
export type LessonProgressStatus = components['schemas']['LessonProgressStatus'];
export type QuizMasteryTier = components['schemas']['QuizMasteryTier'];
export type BlockType = components['schemas']['BlockType'];
export type ReviewReason = components['schemas']['ReviewReason'];

// ── Object types ───────────────────────────────────────

export type ApiError = components['schemas']['ApiError'];
/** Client-enriched error (status attached by the axios interceptor). */
export type ClientApiError = ApiError & { status?: number };

export type AuthorisedUser = components['schemas']['AuthorisedUser'];
export type AuthProvider = components['schemas']['AuthProvider'];

export type ClarifyQuestion = components['schemas']['ClarifyQuestion'];
export type ClarifyResponse = components['schemas']['ClarifyResponse'];
export type CourseModule = components['schemas']['CourseModule'];
export type CourseLesson = components['schemas']['CourseLesson'];
export type Course = components['schemas']['Course'];
export type DepthPreview = components['schemas']['DepthPreview'];
export type DepthPreviewsResponse = components['schemas']['DepthPreviewsResponse'];
export type JobStatus = components['schemas']['JobStatus'];

export type LessonBlock = components['schemas']['LessonBlock'];
export type LessonContent = components['schemas']['LessonContent'];
export type UserLessonProgress = components['schemas']['UserLessonProgress'];
export type QuizResponse = components['schemas']['QuizResponse'];
export type ExerciseAttempt = components['schemas']['ExerciseAttempt'];
export type CourseProgressStats = components['schemas']['CourseProgressStats'];
export type ModuleQuizQuestion = components['schemas']['ModuleQuizQuestion'];
export type ModuleQuizContent = components['schemas']['ModuleQuizContent'];
export type QuizAttemptQuestionResult = components['schemas']['QuizAttemptQuestionResult'];
export type QuizAttemptResult = components['schemas']['QuizAttemptResult'];
export type UserModuleQuizProgress = components['schemas']['UserModuleQuizProgress'];
export type CourseQuizProgressItem = components['schemas']['CourseQuizProgressItem'];
export type ReviewDueItem = components['schemas']['ReviewDueItem'];

export type AchievementCategory = components['schemas']['AchievementCategory'];
export type EarnedAchievement = components['schemas']['EarnedAchievement'];
export type GamificationProfile = components['schemas']['GamificationProfile'];
export type GamificationStats = components['schemas']['GamificationStats'];

// ── Insight types ──────────────────────────────────────
export type InsightKind = components['schemas']['InsightKind'];
export type InsightMode = components['schemas']['InsightMode'];
export type InsightState = components['schemas']['InsightState'];
export type InsightRating = components['schemas']['InsightRating'];
export type InsightQueueItem = components['schemas']['InsightQueueItem'];
export type InsightQueue = components['schemas']['InsightQueue'];
export type RateInsightResult = components['schemas']['RateInsightResult'];
export type InsightStats = components['schemas']['InsightStats'];
export type GradeVerdict = components['schemas']['GradeVerdict'];
export type GradeResult = components['schemas']['GradeResult'];

// ── Billing / subscription types ───────────────────────
export type PlanKey = components['schemas']['PlanKey'];
export type SubscriptionStatus = components['schemas']['SubscriptionStatus'];
export type UserSubscription = components['schemas']['UserSubscription'];
export type UserCredits = components['schemas']['UserCredits'];
export type BillingPlan = components['schemas']['BillingPlan'];
export type BillingTopupRate = components['schemas']['BillingTopupRate'];
export type BillingCatalog = components['schemas']['BillingCatalog'];
export type BillingSummary = components['schemas']['BillingSummary'];
export type CreditLedgerEntry = components['schemas']['CreditLedgerEntry'];
