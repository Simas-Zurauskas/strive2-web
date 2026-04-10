import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { InlineLink } from '@/components';
import { DEV_MODE } from '@/conf/env';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, QuizAttemptResult } from '@/api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

interface QuizResultsProps {
  results: QuizAttemptResult;
  mod: CourseModule;
  moduleIndex: number;
  courseBasePath: string;
  isReviewMode: boolean;
  isGenerating: boolean;
  isResetting: boolean;
  onBack: () => void;
  onRetake: () => void;
  onNextModule: () => void;
  onBackToCourses: () => void;
  onDevReset: () => void;
  hasNextModule: boolean;
}

export const QuizResults = ({
  results,
  mod,
  moduleIndex,
  courseBasePath,
  isReviewMode,
  isGenerating,
  isResetting,
  onBack,
  onRetake,
  onNextModule,
  onBackToCourses,
  onDevReset,
  hasNextModule,
}: QuizResultsProps) => (
  <S.Container>
    <S.Content>
      <S.TopBar>
        <S.BackLink onClick={onBack}>
          <ArrowLeft size={14} /> Back to course
        </S.BackLink>
        {DEV_MODE && (
          <S.DevResetButton onClick={onDevReset} disabled={isResetting}>
            <Trash2 size={10} /> Reset Quiz
          </S.DevResetButton>
        )}
      </S.TopBar>

      <S.ResultsHeader>
        <S.Eyebrow>{isReviewMode ? 'Review Results' : 'Quiz Results'}</S.Eyebrow>
        <S.Title>{mod.name}</S.Title>
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
            Next review in {results.reviewIntervalDays} day
            {results.reviewIntervalDays !== 1 ? 's' : ''} or sooner as you progress
          </S.NextReviewInfo>
        )}
      </S.ResultsHeader>

      <S.ResultsList>
        {results.questions.map((q, i) => (
          <S.ResultItem key={q.id} $correct={q.correct}>
            <S.ResultItemHeader $correct={q.correct}>
              <S.ResultIndicator $correct={q.correct}>
                {q.correct ? '\u2713' : '\u2717'}
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
        {hasNextModule && (
          <S.StartButton onClick={onNextModule}>
            Continue to Next Module <ArrowRight size={14} />
          </S.StartButton>
        )}
        {!hasNextModule && (
          <S.StartButton onClick={onBackToCourses}>Back to Courses</S.StartButton>
        )}
      </S.ActionButtons>
    </S.Content>
  </S.Container>
);
