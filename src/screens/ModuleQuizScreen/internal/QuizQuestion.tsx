import { ArrowRight, Trash2 } from 'lucide-react';
import { Button, Eyebrow } from '@/components';
import { DEV_MODE } from '@/conf/env';
import * as S from '../ModuleQuizScreen.styles';
import type { CourseModule, ModuleQuizQuestion } from '@/api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

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
}: QuizQuestionProps) => {
  const getOptionState = (index: number): OptionState => {
    if (index === selectedOption) return 'selected';
    return 'default';
  };

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

        <S.HeaderSection>
          <Eyebrow>
            {isReviewMode ? 'Spaced Review' : `Module ${moduleIndex + 1} Quiz`}
          </Eyebrow>
          <S.Title>{mod.name}</S.Title>
        </S.HeaderSection>

        <S.ProgressBarContainer>
          <S.ProgressBarTrack>
            <S.ProgressBarFill $percent={((currentQuestion + 1) / totalQuestions) * 100} />
          </S.ProgressBarTrack>
          <S.ProgressText>
            {currentQuestion + 1} / {totalQuestions}
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
            <S.Explanation>
              <S.SourceTag>
                Review question from Module {(question.interleavedModuleIndex ?? 0) + 1}
              </S.SourceTag>
            </S.Explanation>
          )}
        </S.QuestionCard>

        {selectedOption !== null && (
          <Button onClick={onNext} loading={isSubmitting} style={{ alignSelf: 'flex-start' }}>
            {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}{' '}
            <ArrowRight size={14} />
          </Button>
        )}
      </S.Content>
    </S.Container>
  );
};
