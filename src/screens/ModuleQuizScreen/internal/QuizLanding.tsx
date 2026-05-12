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
  //
  // The not-yet-generated branch is explicit (rather than just a softer
  // version of the existing copy) so first-time visitors understand the
  // CTA below kicks off AI generation, not the quiz itself.
  const lessonText = `${lessonCount} ${plural({ count: lessonCount, singular: 'lesson' })}`;
  const description = isReviewMode
    ? 'A quick check-in to keep what you learned within reach. Mixed questions across the module.'
    : hasQuizContent
      ? totalQuestions > 0
        ? `${totalQuestions} ${plural({
            count: totalQuestions,
            singular: 'question',
          })} testing your understanding across the ${lessonText} in this module.`
        : `Test your understanding across the ${lessonText} in this module.`
      : `This quiz isn't generated yet. We'll write a set of questions testing your understanding across the ${lessonText} in this module.`;

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
                </S.PreviousAttemptHighlight>{' '}
                <S.PreviousAttemptCount>
                  {quizProgress.attempts.length} {plural({ count: quizProgress.attempts.length, singular: 'attempt' })}
                </S.PreviousAttemptCount>
              </S.PreviousAttemptLine>
            )}

            <S.PrimaryAction>
              <Button onClick={hasQuizContent ? onStart : onGenerate} disabled={isGenerating}>
                {/* CTA reflects what the click actually does. When no
                    quiz content exists, the click kicks off AI
                    generation — the label must say so. "Start quiz"
                    is reserved for the case where the questions are
                    already prepared and waiting. */}
                {hasQuizContent
                  ? quizProgress
                    ? 'Retake quiz'
                    : 'Start quiz'
                  : quizProgress
                    ? 'Generate new quiz'
                    : 'Generate quiz'}
                <ArrowRight size={14} />
              </Button>
            </S.PrimaryAction>
          </>
        )}
      </S.Content>
    </S.Container>
  );
};
