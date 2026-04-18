import { AlertCircle, ArrowRight, Check, CheckCircle, Trash2, Trophy, X } from 'lucide-react';
import { InlineLink, Eyebrow } from '@/components';
import { DEV_MODE } from '@/conf/env';
import { plural } from '@/lib/strings';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, QuizAttemptResult, QuizMasteryTier } from '@/api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

const tierIcon: Record<QuizMasteryTier, typeof Trophy> = {
  mastered: Trophy,
  passed: CheckCircle,
  needs_review: AlertCircle,
};

interface QuizResultsProps {
  results: QuizAttemptResult;
  mod: CourseModule;
  moduleIndex: number;
  courseBasePath: string;
  isReviewMode: boolean;
  fromQuizzes: boolean;
  isGenerating: boolean;
  isResetting: boolean;
  onRetake: () => void;
  onNextModule: () => void;
  onBackToCourses: () => void;
  onBackToReviews: () => void;
  onDevReset: () => void;
  hasNextModule: boolean;
}

export const QuizResults = ({
  results,
  mod,
  moduleIndex,
  courseBasePath,
  isReviewMode,
  fromQuizzes,
  isGenerating,
  isResetting,
  onRetake,
  onNextModule,
  onBackToCourses,
  onBackToReviews,
  onDevReset,
  hasNextModule,
}: QuizResultsProps) => {
  const TierIcon = tierIcon[results.masteryTier];

  return (
    <S.Container>
      <S.Content>
        {DEV_MODE && (
          <S.TopBar>
            <S.DevResetButton onClick={onDevReset} disabled={isResetting}>
              <Trash2 size={10} /> Reset Quiz
            </S.DevResetButton>
          </S.TopBar>
        )}

        <S.ResultsHeader>
          <Eyebrow>{isReviewMode ? 'Review Results' : 'Quiz Results'}</Eyebrow>
          <S.Title>{mod.name}</S.Title>
          <S.TierIconHero $tier={results.masteryTier}>
            <TierIcon size={28} strokeWidth={2} />
          </S.TierIconHero>
          <S.ScoreDisplay>{results.score}%</S.ScoreDisplay>
          <S.MasteryBadge $tier={results.masteryTier}>
            {results.masteryTier === 'mastered'
              ? 'Mastered'
              : results.masteryTier === 'passed'
                ? 'Passed'
                : 'Needs Review'}
          </S.MasteryBadge>
          {results.reviewIntervalDays > 0 && (
            <S.NextReviewInfo>
              Next review in {results.reviewIntervalDays} {plural({ count: results.reviewIntervalDays, singular: 'day' })} or sooner as you progress
            </S.NextReviewInfo>
          )}
        </S.ResultsHeader>

        <S.ResultsList>
          {results.questions.map((q, i) => (
            <S.ResultItem key={q.id} $correct={q.correct}>
              <S.ResultItemHeader $correct={q.correct}>
                <S.ResultIndicator $correct={q.correct}>
                  {q.correct ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                </S.ResultIndicator>
                <span>
                  Q{i + 1}: {q.question}
                </span>
              </S.ResultItemHeader>
              <S.ResultExplanation>
                <strong>Correct: {LETTERS[q.correctIndex]}</strong> — {q.explanation}
                {q.sourceLessons.length > 0 && (
                  <S.SourceLinks>
                    {q.sourceLessons.map((li) => (
                      <InlineLink
                        key={li}
                        href={`${courseBasePath}/lesson/${moduleIndex}/${li}`}
                        newTab
                      >
                        Lesson {li + 1}: {mod.lessons?.[li]?.name}
                      </InlineLink>
                    ))}
                  </S.SourceLinks>
                )}
              </S.ResultExplanation>
            </S.ResultItem>
          ))}
        </S.ResultsList>

        <S.ActionButtons>
          <S.SecondaryButton onClick={onRetake} disabled={isGenerating}>
            Retake Quiz
          </S.SecondaryButton>
          {fromQuizzes ? (
            <S.StartButton onClick={onBackToReviews}>
              Back to Quizzes <ArrowRight size={14} />
            </S.StartButton>
          ) : hasNextModule ? (
            <S.StartButton onClick={onNextModule}>
              Continue to Next Module <ArrowRight size={14} />
            </S.StartButton>
          ) : (
            <S.StartButton onClick={onBackToCourses}>Back to Courses</S.StartButton>
          )}
        </S.ActionButtons>
      </S.Content>
    </S.Container>
  );
};
