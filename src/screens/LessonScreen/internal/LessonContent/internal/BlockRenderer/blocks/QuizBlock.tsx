'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import * as S from '../styles';
import type { QuizResponse } from '@/api/types';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuizBlock = ({
  blockId,
  metadata,
  savedResponse,
  onAnswer,
}: {
  blockId: string;
  metadata: Record<string, unknown> | null;
  savedResponse?: QuizResponse;
  onAnswer?: (response: { blockId: string; selectedOption: number; correct: boolean }) => void;
}) => {
  const [selected, setSelected] = useState<number | null>(savedResponse?.selectedOption ?? null);
  const [confirmed, setConfirmed] = useState(savedResponse != null);

  const question = (metadata?.question as string) ?? '';
  const options = (metadata?.options as string[]) ?? [];
  const correctIndex = (metadata?.correctIndex as number) ?? 0;
  const explanation = (metadata?.explanation as string) ?? '';

  const getOptionState = (index: number): 'default' | 'selected' | 'correct' | 'incorrect' | 'dimmed' => {
    if (!confirmed) {
      return index === selected ? 'selected' : 'default';
    }
    if (index === correctIndex) return 'correct';
    if (index === selected) return 'incorrect';
    return 'dimmed';
  };

  const getLetterContent = (index: number) => {
    if (!confirmed) return OPTION_LETTERS[index];
    if (index === correctIndex) return <Check size={12} strokeWidth={3} />;
    if (index === selected) return <X size={12} strokeWidth={3} />;
    return OPTION_LETTERS[index];
  };

  const handleSelect = (index: number) => {
    if (confirmed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    onAnswer?.({ blockId, selectedOption: selected, correct: selected === correctIndex });
  };

  return (
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
        <S.QuizQuestion>{question}</S.QuizQuestion>
        <S.QuizOptions>
          {options.map((option, i) => (
            <S.QuizOption key={i} $state={getOptionState(i)} onClick={() => handleSelect(i)}>
              <S.QuizOptionLetter $state={getOptionState(i)}>
                {getLetterContent(i)}
              </S.QuizOptionLetter>
              {option}
            </S.QuizOption>
          ))}
        </S.QuizOptions>

        <AnimatePresence mode="wait">
          {selected !== null && !confirmed && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <S.QuizConfirmButton onClick={handleConfirm}>Confirm Answer</S.QuizConfirmButton>
            </motion.div>
          )}
          {confirmed && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <S.QuizResult $correct={selected === correctIndex}>
                {selected === correctIndex ? 'Correct' : 'Incorrect'}
              </S.QuizResult>
            </motion.div>
          )}
        </AnimatePresence>
      </S.QuizBody>

      {confirmed && explanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <S.QuizExplanationWrapper>
            <S.QuizExplanationLabel>Explanation</S.QuizExplanationLabel>
            <S.QuizExplanation>{explanation}</S.QuizExplanation>
          </S.QuizExplanationWrapper>
        </motion.div>
      )}
    </S.QuizContainer>
  );
};
