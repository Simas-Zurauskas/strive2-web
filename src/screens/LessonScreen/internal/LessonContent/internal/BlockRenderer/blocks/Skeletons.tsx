import Skeleton from 'react-loading-skeleton';
// Skeleton placeholders for two distinct block types — pull each set
// of styles from its own file via named imports rather than a merged
// `* as S` namespace, since this file straddles both surfaces.
import {
  ExerciseContainer,
  ExerciseHeader,
  ExerciseHeaderIcon,
  ExerciseHeaderLabel,
  ExerciseContent,
} from '../styles/exercise.styles';
import {
  QuizContainer,
  QuizHeader,
  QuizHeaderIcon,
  QuizHeaderLabel,
  QuizBody,
} from '../styles/quiz.styles';

export const QuizSkeleton = () => (
  <QuizContainer>
    <QuizHeader>
      <QuizHeaderIcon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6" />
          <path d="M6 6.5a2 2 0 0 1 3.5 1.3c0 1.2-2 1.7-2 1.7" />
          <circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      </QuizHeaderIcon>
      <QuizHeaderLabel>Check your understanding</QuizHeaderLabel>
    </QuizHeader>
    <QuizBody>
      <Skeleton width="70%" height={14} borderRadius={6} />
      <Skeleton height={44} borderRadius={10} />
      <Skeleton height={44} borderRadius={10} />
      <Skeleton height={44} borderRadius={10} />
    </QuizBody>
  </QuizContainer>
);

export const ExerciseSkeleton = () => (
  <ExerciseContainer>
    <ExerciseHeader>
      <ExerciseHeaderIcon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.5 2L2 5.5 5.5 9" />
          <path d="M10.5 7L14 10.5 10.5 14" />
        </svg>
      </ExerciseHeaderIcon>
      <ExerciseHeaderLabel>Try It Yourself</ExerciseHeaderLabel>
    </ExerciseHeader>
    <ExerciseContent>
      <Skeleton width="85%" height={14} borderRadius={6} />
      <Skeleton width="60%" height={14} borderRadius={6} />
      <Skeleton height={96} borderRadius={8} />
    </ExerciseContent>
  </ExerciseContainer>
);
