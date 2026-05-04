import { ArrowRight, Check, Trash2, X } from 'lucide-react';
import { Button, Eyebrow, InlineLink } from '@/components';
import { DEV_MODE } from '@/conf/env';
import { plural } from '@/lib/strings';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, QuizAttemptResult, QuizMasteryTier } from '@/api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

const tierLabel: Record<QuizMasteryTier, string> = {
  mastered: 'Mastered',
  passed: 'Passed',
  needs_review: 'Needs review',
};

const tierSubtext: Record<QuizMasteryTier, string> = {
  mastered: 'Strong recall across the module.',
  passed: 'Solid foundation — a review later will lock it in.',
  needs_review: 'A few concepts to revisit before moving on.',
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
  onBack: () => void;
  backLabel: string;
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
  onBack,
  backLabel,
}: QuizResultsProps) => {
  return (
    <S.Container>
      <S.Content>
        <S.TopRail>
          <S.BackLink onClick={onBack}>
            <S.BackIcon />
            {backLabel}
          </S.BackLink>
          {DEV_MODE && (
            <S.DevResetButton onClick={onDevReset} disabled={isResetting}>
              <Trash2 size={10} /> Reset quiz
            </S.DevResetButton>
          )}
        </S.TopRail>

        <S.HeaderSection>
          <Eyebrow>{isReviewMode ? 'Review results' : `Module ${moduleIndex + 1} · Results`}</Eyebrow>
          <S.Title>{mod.name}</S.Title>
        </S.HeaderSection>

        <S.ResultsHero>
          <S.ScoreDisplay $tier={results.masteryTier}>{results.score}%</S.ScoreDisplay>
          <S.MasteryBadge $tier={results.masteryTier}>{tierLabel[results.masteryTier]}</S.MasteryBadge>
          <S.ResultsTitle>{tierSubtext[results.masteryTier]}</S.ResultsTitle>
          {results.reviewIntervalDays > 0 && (
            <S.NextReviewInfo>
              Next review in {results.reviewIntervalDays} {plural({ count: results.reviewIntervalDays, singular: 'day' })} —
              {' '}sooner if you keep progressing.
            </S.NextReviewInfo>
          )}
        </S.ResultsHero>

        <S.ResultsSectionLabel>Question breakdown</S.ResultsSectionLabel>

        <S.ResultsList>
          {results.questions.map((q, i) => {
            const userPicked = q.selectedOption;
            const showPicked = !q.correct && userPicked !== null && userPicked !== undefined;
            return (
              <S.ResultItem key={q.id} $correct={q.correct}>
                <S.ResultItemHeader $correct={q.correct}>
                  <S.ResultIndicator $correct={q.correct}>
                    {q.correct ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                  </S.ResultIndicator>
                  <S.QuestionIndex>Q{i + 1}</S.QuestionIndex>
                  <S.QuestionTextHeader>{q.question}</S.QuestionTextHeader>
                </S.ResultItemHeader>

                <S.ResultBody>
                  {showPicked && (
                    <S.AnswerRow>
                      <S.AnswerLabel $variant="picked-wrong">Your pick</S.AnswerLabel>
                      <S.AnswerText>
                        {LETTERS[userPicked!]} — {q.options[userPicked!]}
                      </S.AnswerText>
                    </S.AnswerRow>
                  )}
                  <S.AnswerRow>
                    <S.AnswerLabel $variant="correct">{q.correct ? 'Correct' : 'Answer'}</S.AnswerLabel>
                    <S.AnswerText>
                      {LETTERS[q.correctIndex]} — {q.options[q.correctIndex]}
                    </S.AnswerText>
                  </S.AnswerRow>
                  <S.ExplanationText>{q.explanation}</S.ExplanationText>
                  {q.sourceLessons.length > 0 && (
                    <S.SourceLinks>
                      <S.SourceLinksLabel>
                        {q.sourceLessons.length === 1 ? 'Revisit' : 'Revisit lessons'}
                      </S.SourceLinksLabel>
                      <S.SourceLinksList>
                        {q.sourceLessons.map((li) => (
                          <InlineLink
                            key={li}
                            href={`${courseBasePath}/lesson/${moduleIndex}/${li}`}
                            newTab
                          >
                            Lesson {li + 1}: {mod.lessons?.[li]?.name}
                          </InlineLink>
                        ))}
                      </S.SourceLinksList>
                    </S.SourceLinks>
                  )}
                </S.ResultBody>
              </S.ResultItem>
            );
          })}
        </S.ResultsList>

        <S.ActionButtons>
          <Button variant="secondary" onClick={onRetake} disabled={isGenerating}>
            Retake quiz
          </Button>
          {fromQuizzes ? (
            <Button onClick={onBackToReviews}>
              Back to quizzes <ArrowRight size={14} />
            </Button>
          ) : hasNextModule ? (
            <Button onClick={onNextModule}>
              Next module <ArrowRight size={14} />
            </Button>
          ) : (
            <Button onClick={onBackToCourses}>Back to courses</Button>
          )}
        </S.ActionButtons>
      </S.Content>
    </S.Container>
  );
};
