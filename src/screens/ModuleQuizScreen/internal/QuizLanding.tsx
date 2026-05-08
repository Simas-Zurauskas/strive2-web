import { ArrowRight } from 'lucide-react';
import { Button, Eyebrow, HelpAnchor } from '@/components';
import { plural } from '@/lib/strings';
import { QuizGenerationPanel } from './QuizGenerationPanel';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, QuizMasteryTier, UserModuleQuizProgress } from '@/api/types';

const tierLabel: Record<QuizMasteryTier, string> = {
  mastered: 'Mastered',
  passed: 'Passed',
  needs_review: 'Needs review',
};

interface QuizLandingProps {
  mod: CourseModule;
  moduleIndex: number;
  totalQuestions: number;
  quizProgress: UserModuleQuizProgress | undefined;
  isReviewMode: boolean;
  isGenerating: boolean;
  hasQuizContent: boolean;
  onStart: () => void;
  onGenerate: () => void;
  onBack: () => void;
  backLabel: string;
}

export const QuizLanding = ({
  mod,
  moduleIndex,
  totalQuestions,
  quizProgress,
  isReviewMode,
  isGenerating,
  hasQuizContent,
  onStart,
  onGenerate,
  onBack,
  backLabel,
}: QuizLandingProps) => {
  const lessonCount = mod.lessons?.length ?? 0;

  // Description folds in the question count once content exists, so the
  // separate meta line ("3 lessons · 8 questions · Pass at 70%…") is no
  // longer needed — the lesson count is already in the description, and
  // the pass/master thresholds live once on the /quizzes index hero.
  const lessonText = `${lessonCount} ${plural({ count: lessonCount, singular: 'lesson' })}`;
  const description = isReviewMode
    ? 'A quick check-in to keep what you learned within reach. Mixed questions across the module.'
    : totalQuestions > 0
      ? `${totalQuestions} ${plural({
          count: totalQuestions,
          singular: 'question',
        })} testing your understanding across the ${lessonText} in this module.`
      : `Test your understanding across the ${lessonText} in this module.`;

  return (
    <S.Container>
      <S.Content>
        <S.TopRail>
          <S.BackLink onClick={onBack}>
            <S.BackIcon />
            {backLabel}
          </S.BackLink>
        </S.TopRail>

        <S.HeaderSection>
          <S.EyebrowRow>
            <Eyebrow>{isReviewMode ? 'Spaced review' : `Module ${moduleIndex + 1} · Quiz`}</Eyebrow>
            <HelpAnchor concept="quiz-types" size="sm" />
          </S.EyebrowRow>
          <S.Title>{mod.name}</S.Title>
        </S.HeaderSection>

        {isGenerating ? (
          <QuizGenerationPanel />
        ) : (
          <>
            <S.DescriptionText>{description}</S.DescriptionText>

            {quizProgress && quizProgress.bestTier && (
              <S.PreviousAttemptLine>
                Previous best ·{' '}
                <S.PreviousAttemptHighlight $tier={quizProgress.bestTier}>
                  {quizProgress.bestScore}% · {tierLabel[quizProgress.bestTier]}
                </S.PreviousAttemptHighlight>
                {' '}
                <S.PreviousAttemptCount>
                  {quizProgress.attempts.length}{' '}
                  {plural({ count: quizProgress.attempts.length, singular: 'attempt' })}
                </S.PreviousAttemptCount>
              </S.PreviousAttemptLine>
            )}

            <S.PrimaryAction>
              <Button
                onClick={hasQuizContent ? onStart : onGenerate}
                disabled={isGenerating}
              >
                {hasQuizContent
                  ? quizProgress
                    ? 'Retake quiz'
                    : 'Start quiz'
                  : quizProgress
                    ? 'Create new quiz'
                    : 'Start quiz'}
                <ArrowRight size={14} />
              </Button>
            </S.PrimaryAction>
          </>
        )}
      </S.Content>
    </S.Container>
  );
};
