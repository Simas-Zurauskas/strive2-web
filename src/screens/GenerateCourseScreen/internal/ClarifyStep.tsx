'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClarifyQuestion } from '@/api/types';
import { RadioGroup, CheckboxGroup, Textarea, Button, Card, Eyebrow } from '@/components';
import * as S from './ClarifyStep.styles';

type AnswerValue = string | string[];

interface ClarifyStepProps {
  questions: ClarifyQuestion[];
  initialAnswers: Record<string, AnswerValue>;
  hasExistingData: boolean;
  onSubmit: (answers: Record<string, AnswerValue>) => void;
  onBack: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const isAnswered = (value: AnswerValue | undefined): boolean => {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return value.trim().length > 0;
};

export const ClarifyStep = ({
  questions,
  initialAnswers,
  hasExistingData,
  onSubmit,
  onBack,
  onDirtyChange,
}: ClarifyStepProps) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;

  const allAnswered = useMemo(
    () => questions.every((q) => isAnswered(answers[q.id])),
    [questions, answers],
  );

  const answersUnchanged = hasExistingData && JSON.stringify(answers) === JSON.stringify(initialAnswers);

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(answers) !== JSON.stringify(initialAnswers));
  }, [answers, initialAnswers, onDirtyChange]);

  const updateAnswer = ({ questionId, value }: { questionId: string; value: AnswerValue }) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!isLast) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (isFirst) {
      onBack();
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = () => {
    if (allAnswered) onSubmit(answers);
  };

  const renderQuestion = (q: ClarifyQuestion) => {
    switch (q.type) {
      case 'multiple_choice':
        return q.options ? (
          <RadioGroup
            name={q.id}
            options={q.options.map((opt) => ({ value: opt, label: opt }))}
            value={(answers[q.id] as string) || ''}
            onChange={(value) => updateAnswer({ questionId: q.id, value })}
            allowOther
          />
        ) : null;

      case 'multiple_select':
        return q.options ? (
          <CheckboxGroup
            name={q.id}
            options={q.options.map((opt) => ({ value: opt, label: opt }))}
            value={(answers[q.id] as string[]) || []}
            onChange={(value) => updateAnswer({ questionId: q.id, value })}
            allowOther
          />
        ) : null;

      case 'text':
      default:
        return (
          <Textarea
            name={q.id}
            placeholder="Your answer..."
            value={(answers[q.id] as string) || ''}
            rows={4}
            onChange={(e) => updateAnswer({ questionId: q.id, value: e.target.value })}
          />
        );
    }
  };

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>Questions</Eyebrow>
        <S.Title>A few questions to personalize your course</S.Title>
        <S.Subtitle>Your answers shape the topics, focus areas, and difficulty of your curriculum.</S.Subtitle>
      </S.Header>

      <S.ProgressBar>
        {questions.map((q, i) => (
          <S.ProgressDot key={q.id} $active={i === currentIndex} $answered={isAnswered(answers[q.id])} />
        ))}
      </S.ProgressBar>

      <Card>
        <S.QuestionCard>
          <S.QuestionCounter>
            Question {currentIndex + 1} of {questions.length}
          </S.QuestionCounter>
          <S.QuestionLabel>
            {currentQuestion.question}
            {currentQuestion.type === 'multiple_select' && (
              <S.QuestionHint>Select all that apply</S.QuestionHint>
            )}
          </S.QuestionLabel>
          {renderQuestion(currentQuestion)}
        </S.QuestionCard>
      </Card>

      <S.Actions>
        <Button variant="secondary" type="button" onClick={handlePrev}>
          Back
        </Button>
        {isLast ? (
          <Button type="button" onClick={handleSubmit} disabled={!allAnswered}>
            {answersUnchanged ? 'Continue' : 'Next \u2192'}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} disabled={!isAnswered(answers[currentQuestion.id])}>
            Next
          </Button>
        )}
      </S.Actions>
    </S.Container>
  );
};
