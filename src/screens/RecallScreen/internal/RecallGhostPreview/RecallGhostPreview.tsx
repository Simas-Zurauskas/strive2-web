'use client';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './RecallGhostPreview.styles';

// Three-card stack that previews what a recall card looks like before the
// user has any. The topmost card cycles through Q → A → next Q on a slow
// loop (~5s) so the visual is never frozen but never demanding either.
//
// Content is illustrative-only (not real spaced-repetition material) so
// nothing here can drift out of sync with backend recall logic.

const CARDS = [
  {
    q: 'What does spaced repetition optimise for?',
    a: 'Reviewing just before you would have forgotten — the trough of the forgetting curve.',
  },
  {
    q: 'Why are short prompts better than long flashcards?',
    a: 'Retrieval effort is the lever. Smaller prompts mean more retrievals per minute.',
  },
  {
    q: 'When does a card stop being scheduled?',
    a: 'After several easy recalls in a row — the interval grows until the card is effectively retired.',
  },
] as const;

const CYCLE_MS = 5000;
const FLIP_DELAY_MS = 2200;

interface RecallGhostPreviewProps {
  /**
   * Visual scale. `lg` (default) is the empty-state-on-screen size used in
   * `RecallScreen`. `sm` is the embedded-in-modal size used by the
   * `spaced-recall` concept modal.
   */
  size?: 'sm' | 'md' | 'lg';
}

export const RecallGhostPreview = ({ size = 'lg' }: RecallGhostPreviewProps = {}) => {
  const { prefersReduced } = useMotion();
  const [idx, setIdx] = useState(0);
  const [showingAnswer, setShowingAnswer] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    const flip = setTimeout(() => setShowingAnswer(true), FLIP_DELAY_MS);
    const advance = setTimeout(() => {
      setShowingAnswer(false);
      setIdx((i) => (i + 1) % CARDS.length);
    }, CYCLE_MS);
    return () => {
      clearTimeout(flip);
      clearTimeout(advance);
    };
  }, [idx, prefersReduced]);

  const card = CARDS[idx];

  return (
    <S.Wrap aria-hidden $size={size}>
      {/* Back-of-stack ghosts — static, just suggest depth. */}
      <S.GhostCard
        style={{
          transform: 'translate(8%, 8%) scale(0.94)',
          opacity: 0.32,
          zIndex: 0,
        }}
      />
      <S.GhostCard
        style={{
          transform: 'translate(4%, 4%) scale(0.97)',
          opacity: 0.55,
          zIndex: 1,
        }}
      />

      {/* Top card — content cycles. */}
      <S.GhostCard
        style={{ zIndex: 2 }}
        initial={false}
        animate={{ opacity: 1 }}
      >
        <div>
          <S.Eyebrow>Recall card</S.Eyebrow>
          <S.Question>{card.q}</S.Question>
        </div>
        <AnimatePresence mode="wait">
          {showingAnswer && !prefersReduced ? (
            <S.Answer
              key={`a-${idx}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {card.a}
            </S.Answer>
          ) : (
            <S.Footer key={`f-${idx}`}>
              <span>Tap to reveal</span>
              <S.FooterDots>
                {CARDS.map((_, i) => (
                  <S.Dot key={i} $active={i === idx} />
                ))}
              </S.FooterDots>
            </S.Footer>
          )}
        </AnimatePresence>
      </S.GhostCard>
    </S.Wrap>
  );
};
