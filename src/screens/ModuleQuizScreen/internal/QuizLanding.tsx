import { AlertCircle, CheckCircle, Trophy } from 'lucide-react';
import { Eyebrow, TextLoader } from '@/components';
import { plural } from '@/lib/strings';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, QuizMasteryTier, UserModuleQuizProgress } from '@/api/types';

const tierIcon: Record<QuizMasteryTier, typeof Trophy> = {
  mastered: Trophy,
  passed: CheckCircle,
  needs_review: AlertCircle,
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
}: QuizLandingProps) => (
  <S.Container>
    <S.Content>
      <S.HeaderSection>
        <Eyebrow>
          {isReviewMode ? 'Spaced Review' : `Module ${moduleIndex + 1} Quiz`}
        </Eyebrow>
        <S.Title>{mod.name}</S.Title>
      </S.HeaderSection>

      {quizProgress && quizProgress.bestTier && (() => {
        const TierIcon = tierIcon[quizProgress.bestTier];
        return (
          <S.PreviousAttempt>
            <S.TierIconInline $tier={quizProgress.bestTier}>
              <TierIcon size={16} strokeWidth={2} />
            </S.TierIconInline>
            <span>Previous best:</span>
            <S.MasteryBadge $tier={quizProgress.bestTier}>
              {quizProgress.bestScore}% —{' '}
              {quizProgress.bestTier === 'mastered'
                ? 'Mastered'
                : quizProgress.bestTier === 'passed'
                  ? 'Passed'
                  : 'Needs Review'}
            </S.MasteryBadge>
            <span style={{ color: 'inherit', opacity: 0.5 }}>
              ({quizProgress.attempts.length} {plural(quizProgress.attempts.length, 'attempt')})
            </span>
          </S.PreviousAttempt>
        );
      })()}

      {isGenerating ? (
        <TextLoader text="Creating quiz questions..." />
      ) : hasQuizContent ? (
        <>
          <S.DescriptionText>
            {totalQuestions} questions testing your understanding across all lessons in this module.
          </S.DescriptionText>
          <S.StartButton onClick={onStart}>
            {quizProgress ? 'Retake Quiz' : 'Start Quiz'}
          </S.StartButton>
        </>
      ) : (
        <>
          <S.DescriptionText>
            Test your understanding across all {mod.lessons?.length ?? 0} lessons in this module.
          </S.DescriptionText>
          <S.StartButton onClick={onGenerate} disabled={isGenerating}>
            {quizProgress ? 'Create New Quiz' : 'Start Quiz'}
          </S.StartButton>
        </>
      )}
    </S.Content>
  </S.Container>
);
