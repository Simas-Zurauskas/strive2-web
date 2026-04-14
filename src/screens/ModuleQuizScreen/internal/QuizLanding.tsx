import { ArrowLeft } from 'lucide-react';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, UserModuleQuizProgress } from '@/api/types';

interface QuizLandingProps {
  mod: CourseModule;
  moduleIndex: number;
  totalQuestions: number;
  quizProgress: UserModuleQuizProgress | undefined;
  isReviewMode: boolean;
  isGenerating: boolean;
  hasQuizContent: boolean;
  onBack: () => void;
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
  onBack,
  onStart,
  onGenerate,
}: QuizLandingProps) => (
  <S.Container>
    <S.Content>
      <S.TopBar>
        <S.BackLink onClick={onBack}>
          <ArrowLeft size={14} /> {isReviewMode ? 'Back to review' : 'Back to course'}
        </S.BackLink>
      </S.TopBar>

      <S.HeaderSection>
        <S.Eyebrow>
          {isReviewMode ? 'Spaced Review' : `Module ${moduleIndex + 1} Quiz`}
        </S.Eyebrow>
        <S.Title>{mod.name}</S.Title>
      </S.HeaderSection>

      {quizProgress && quizProgress.bestTier && (
        <S.PreviousAttempt>
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
            ({quizProgress.attempts.length} attempt
            {quizProgress.attempts.length !== 1 ? 's' : ''})
          </span>
        </S.PreviousAttempt>
      )}

      {isGenerating ? (
        <S.LoadingContainer>
          <S.Spinner />
          <span>Creating quiz questions...</span>
        </S.LoadingContainer>
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
