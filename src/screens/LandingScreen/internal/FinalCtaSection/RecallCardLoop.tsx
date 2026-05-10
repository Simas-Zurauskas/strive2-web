'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { easeOutSpring, useMotion } from '@/theme/motionPresets';
import * as S from './RecallCardLoop.styles';
import { FINAL_CTA } from '../../constants';

const ROTATE_MS = 5000;

/**
 * Bottom-of-page closer visual. Replaces the old 3D scene.
 *
 * Loops through the three sample recall cards in `FINAL_CTA.recallSamples`
 * with a crossfade between cards and a staggered reveal within each card
 * (badge row → prompt → answer). Mirrors the hero's `LiveLessonMock`
 * vocabulary — italic-serif prompt, tertiary accent on the box badge,
 * `easeOutSpring` curve, surface card with hairline border.
 *
 * Honors `prefers-reduced-motion`: no auto-rotation, first card only.
 */
export const RecallCardLoop = () => {
  const { prefersReduced } = useMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % FINAL_CTA.recallSamples.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  const sample = FINAL_CTA.recallSamples[index];

  return (
    <S.Frame role="img" aria-label="Tomorrow&apos;s review — auto-scheduled from your recall queue">
      <S.Header>
        <S.Eyebrow>From your recall queue</S.Eyebrow>
        <S.StatusDot>Auto-scheduled</S.StatusDot>
      </S.Header>

      <S.Stage>
        <S.GhostCard $depth={2} aria-hidden="true" />
        <S.GhostCard $depth={1} aria-hidden="true" />

        <AnimatePresence mode="wait" initial={false}>
          <S.Card
            key={index}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -4 }}
            transition={{ duration: 0.42, ease: easeOutSpring }}
          >
            <S.MetaRow
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: easeOutSpring }}
            >
              <S.CourseBadge>{sample.course}</S.CourseBadge>
              <S.MetaSep aria-hidden="true">·</S.MetaSep>
              <S.LessonBadge>{sample.lesson}</S.LessonBadge>
              <S.BoxBadge>{sample.box}</S.BoxBadge>
            </S.MetaRow>

            <S.Prompt
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: easeOutSpring }}
            >
              {sample.prompt}
            </S.Prompt>

            <S.AnswerWrap
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6, ease: easeOutSpring }}
            >
              <S.AnswerLabel>Answer</S.AnswerLabel>
              <S.Answer>{sample.answer}</S.Answer>
            </S.AnswerWrap>
          </S.Card>
        </AnimatePresence>
      </S.Stage>

      <S.Footer>
        <span>Tomorrow&apos;s review</span>
        <S.Pips aria-hidden="true">
          {FINAL_CTA.recallSamples.map((_, i) => (
            <motion.span key={i} layout>
              <S.Pip $active={i === index} />
            </motion.span>
          ))}
        </S.Pips>
      </S.Footer>
    </S.Frame>
  );
};
