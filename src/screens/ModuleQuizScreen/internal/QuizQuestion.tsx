import { ArrowRight, Trash2 } from 'lucide-react';
import { Button, Eyebrow } from '@/components';
import { DEV_MODE } from '@/conf/env';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, ModuleQuizQuestion } from '@/api/types';
import type { QuizOptionState } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D'];

interface QuizQuestionProps {
  question: ModuleQuizQuestion;
  mod: CourseModule;
  moduleIndex: number;
  currentQuestion: number;
  totalQuestions: number;
  selectedOption: number | null;
  isReviewMode: boolean;
  isSubmitting: boolean;
  isResetting: boolean;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  onDevReset: () => void;
  onBack: () => void;
  backLabel: string;
}

export const QuizQuestion = ({
  question,
  mod,
  moduleIndex,
  currentQuestion,
  totalQuestions,
  selectedOption,
  isReviewMode,
  isSubmitting,
  isResetting,
  onSelectOption,
  onNext,
  onDevReset,
  onBack,
  backLabel,
}: QuizQuestionProps) => {
  const getOptionState = (index: number): QuizOptionState =>
    index === selectedOption ? 'selected' : 'default';

  const isLastQuestion = currentQuestion >= totalQuestions - 1;

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
          <Eyebrow>{isReviewMode ? 'Spaced review' : `Module ${moduleIndex + 1} · Quiz`}</Eyebrow>
          <S.Title>{mod.name}</S.Title>
        </S.HeaderSection>

        <S.ProgressBarContainer>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percent={((currentQuestion + 1) / totalQuestions) * 100} />
          </S.ProgressBarTrack>
          <S.ProgressText>
            Question {currentQuestion + 1} of {totalQuestions}
          </S.ProgressText>
        </S.ProgressBarContainer>

        <S.QuestionCard>
          <S.QuestionText>{question.question}</S.QuestionText>
          <S.OptionsContainer>
            {question.options.map((opt, i) => (
              <S.Option key={i} $state={getOptionState(i)} onClick={() => onSelectOption(i)}>
                <S.OptionLetter $state={getOptionState(i)}>{LETTERS[i]}</S.OptionLetter>
                {opt}
              </S.Option>
            ))}
          </S.OptionsContainer>
          {question.isInterleaved && (
            <S.InterleavedTagWrap>
              <S.SourceTag>
                Review · From module {(question.interleavedModuleIndex ?? 0) + 1}
              </S.SourceTag>
            </S.InterleavedTagWrap>
          )}
        </S.QuestionCard>

        {selectedOption !== null && (
          <S.PrimaryAction>
            <Button onClick={onNext} loading={isSubmitting}>
              {isLastQuestion ? 'Submit answers' : 'Next question'}
              <ArrowRight size={14} />
            </Button>
          </S.PrimaryAction>
        )}
      </S.Content>
    </S.Container>
  );
};
