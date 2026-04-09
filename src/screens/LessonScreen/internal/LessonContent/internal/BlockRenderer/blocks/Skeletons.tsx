import Skeleton from 'react-loading-skeleton';
import * as S from '../styles';

export const QuizSkeleton = () => (
  <S.QuizContainer>
    <S.QuizHeader>
      <S.QuizHeaderIcon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6" />
          <path d="M6 6.5a2 2 0 0 1 3.5 1.3c0 1.2-2 1.7-2 1.7" />
          <circle cx="8" cy="12" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      </S.QuizHeaderIcon>
      <S.QuizHeaderLabel>Check your understanding</S.QuizHeaderLabel>
    </S.QuizHeader>
    <S.QuizBody>
      <Skeleton width="70%" height={14} borderRadius={6} />
      <Skeleton height={44} borderRadius={10} />
      <Skeleton height={44} borderRadius={10} />
      <Skeleton height={44} borderRadius={10} />
    </S.QuizBody>
  </S.QuizContainer>
);

export const ExerciseSkeleton = () => (
  <S.ExerciseContainer>
    <S.ExerciseHeader>
      <S.ExerciseHeaderIcon>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.5 2L2 5.5 5.5 9" />
          <path d="M10.5 7L14 10.5 10.5 14" />
        </svg>
      </S.ExerciseHeaderIcon>
      <S.ExerciseHeaderLabel>Try It Yourself</S.ExerciseHeaderLabel>
    </S.ExerciseHeader>
    <S.ExerciseContent>
      <Skeleton width="85%" height={14} borderRadius={6} />
      <Skeleton width="60%" height={14} borderRadius={6} />
      <Skeleton height={96} borderRadius={8} />
    </S.ExerciseContent>
  </S.ExerciseContainer>
);
