import { components } from './_generated';

// ── Enum types ─────────────────────────────────────────

export type ErrorCode = components['schemas']['ErrorCode'];
export type AuthProviderType = components['schemas']['AuthProviderType'];
export type QuestionType = components['schemas']['QuestionType'];
export type CourseDepth = components['schemas']['CourseDepth'];
export type CourseStatus = components['schemas']['CourseStatus'];
export type CourseDomain = components['schemas']['CourseDomain'];
export type JobStatusEnum = components['schemas']['JobStatusEnum'];
export type JobType = components['schemas']['JobType'];
export type LessonProgressStatus = components['schemas']['LessonProgressStatus'];
export type QuizMasteryTier = components['schemas']['QuizMasteryTier'];
export type BlockType = components['schemas']['BlockType'];
export type ReviewReason = components['schemas']['ReviewReason'];
export type ChatMessageRole = components['schemas']['ChatMessageRole'];

// ── Error types ────────────────────────────────────────

export type ApiError = components['schemas']['ApiError'];
/** Client-enriched error (status attached by the axios interceptor). */
export type ClientApiError = ApiError & { status?: number };

// ── Auth / user types ──────────────────────────────────

export type AuthorisedUser = components['schemas']['AuthorisedUser'];
export type AuthProvider = components['schemas']['AuthProvider'];

// ── Course / clarify types ─────────────────────────────

export type ClarifyQuestion = components['schemas']['ClarifyQuestion'];
export type ClarifyResponse = components['schemas']['ClarifyResponse'];
export type CourseAnswer = components['schemas']['CourseAnswer'];
export type CourseModule = components['schemas']['CourseModule'];
export type CourseLesson = components['schemas']['CourseLesson'];
export type Course = components['schemas']['Course'];
export type StructureReasoning = components['schemas']['StructureReasoning'];
export type GenerateStructureResponse = components['schemas']['GenerateStructureResponse'];
export type DepthPreview = components['schemas']['DepthPreview'];
export type DepthPreviewsResponse = components['schemas']['DepthPreviewsResponse'];

// ── Job / lesson content types ─────────────────────────

export type JobStatus = components['schemas']['JobStatus'];
export type LessonBlock = components['schemas']['LessonBlock'];
export type LessonContent = components['schemas']['LessonContent'];
export type UserLessonProgress = components['schemas']['UserLessonProgress'];
export type QuizResponse = components['schemas']['QuizResponse'];
export type ExerciseAttempt = components['schemas']['ExerciseAttempt'];
export type CourseProgressStats = components['schemas']['CourseProgressStats'];

// ── Module quiz types ──────────────────────────────────

export type ModuleQuizQuestion = components['schemas']['ModuleQuizQuestion'];
export type ModuleQuizContent = components['schemas']['ModuleQuizContent'];
export type QuizAttempt = components['schemas']['QuizAttempt'];
export type QuizAttemptQuestionResult = components['schemas']['QuizAttemptQuestionResult'];
export type QuizAttemptResult = components['schemas']['QuizAttemptResult'];
export type UserModuleQuizProgress = components['schemas']['UserModuleQuizProgress'];
export type CourseQuizProgressItem = components['schemas']['CourseQuizProgressItem'];
export type ReviewDueItem = components['schemas']['ReviewDueItem'];

// ── Cross-course list item types ───────────────────────

export type UnattemptedQuizItem = components['schemas']['UnattemptedQuizItem'];
export type BookmarkedLessonItem = components['schemas']['BookmarkedLessonItem'];
export type RecentActivityItem = components['schemas']['RecentActivityItem'];

// ── Chat types (course design agent) ───────────────────

export type ChatMessage = components['schemas']['ChatMessage'];
export type ChatHistoryMessage = components['schemas']['ChatHistoryMessage'];

// ── Gamification types ─────────────────────────────────

export type AchievementCategory = components['schemas']['AchievementCategory'];
export type EarnedAchievement = components['schemas']['EarnedAchievement'];
export type XpSource = components['schemas']['XpSource'];
export type XpLogEntry = components['schemas']['XpLogEntry'];
export type XpDaySources = components['schemas']['XpDaySources'];
export type XpDayEntry = components['schemas']['XpDayEntry'];
export type XpWeekEntry = components['schemas']['XpWeekEntry'];
export type WeeklySummaryPeriod = components['schemas']['WeeklySummaryPeriod'];
export type GamificationProfile = components['schemas']['GamificationProfile'];
export type GamificationStats = components['schemas']['GamificationStats'];
export type QuizTrendsAttempt = components['schemas']['QuizTrendsAttempt'];
export type QuizTrendsResult = components['schemas']['QuizTrendsResult'];

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
export type BillingCadence = components['schemas']['BillingCadence'];
export type UserSubscription = components['schemas']['UserSubscription'];
export type UserCredits = components['schemas']['UserCredits'];
export type BillingPlan = components['schemas']['BillingPlan'];
export type BillingTopupRate = components['schemas']['BillingTopupRate'];
export type BillingCatalog = components['schemas']['BillingCatalog'];
export type BillingSummary = components['schemas']['BillingSummary'];
export type CreditLedgerReason = components['schemas']['CreditLedgerReason'];
export type CreditLedgerEntry = components['schemas']['CreditLedgerEntry'];

// ── Usage / cost tracking types ────────────────────────

export type UsageService = components['schemas']['UsageService'];
export type UsageEvent = components['schemas']['UsageEvent'];
export type UsageHistory = components['schemas']['UsageHistory'];
export type UsageCostBucket = components['schemas']['UsageCostBucket'];
export type UsageServiceTotal = components['schemas']['UsageServiceTotal'];
export type UsageSummary = components['schemas']['UsageSummary'];
export type UsageSortField = components['schemas']['UsageSortField'];
export type UsageSortDir = components['schemas']['UsageSortDir'];

// ── Socket.io event payload types ──────────────────────
//
// These mirror the shapes the api emits over Socket.io. Backend type-safe
// emitters live at api/src/types/socketEvents.ts; this side is the
// consumer contract.

export type JobStartedEvent = components['schemas']['JobStartedEvent'];
export type JobStatusEvent = components['schemas']['JobStatusEvent'];
export type JobProgressEvent = components['schemas']['JobProgressEvent'];
export type LessonPlaceholderType = components['schemas']['LessonPlaceholderType'];
export type LessonPlaceholderBlock = components['schemas']['LessonPlaceholderBlock'];
export type LessonProgressEvent = components['schemas']['LessonProgressEvent'];
export type LessonProgressBlockEvent = components['schemas']['LessonProgressBlockEvent'];
export type LessonProgressHeroImageEvent = components['schemas']['LessonProgressHeroImageEvent'];
export type LessonProgressContentReadyEvent = components['schemas']['LessonProgressContentReadyEvent'];
export type LessonProgressInsightEvent = components['schemas']['LessonProgressInsightEvent'];
export type LessonProgressInsightsSavedEvent = components['schemas']['LessonProgressInsightsSavedEvent'];
export type GeneratedInsight = components['schemas']['GeneratedInsight'];
export type CreditsUpdatedEvent = components['schemas']['CreditsUpdatedEvent'];
