'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { easeOutSpring, useMotion } from '@/theme/motionPresets';
import * as S from './LessonExtrasAnimation.styles';

// One mock lesson card cycles through four configurations to show
// what hero image and further reading add — and that the lesson
// body itself is unchanged either way.
//
//   beat 0 — both on
//   beat 1 — hero only
//   beat 2 — links only
//   beat 3 — neither (the "skip both" case)
//
// The status row above tracks which extras are currently included.

const TICK_MS = 1700;

const STATES = [
  { hero: true, links: true },
  { hero: true, links: false },
  { hero: false, links: true },
  { hero: false, links: false },
];

export const LessonExtrasAnimation = () => {
  const { prefersReduced } = useMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % STATES.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const { hero, links } = STATES[tick];

  return (
    <S.Wrap aria-hidden>
      <S.StatusRow>
        <S.StatusItem $on={hero}>
          <S.StatusDot $on={hero} />
          Hero image
        </S.StatusItem>
        <S.StatusSep>·</S.StatusSep>
        <S.StatusItem $on={links}>
          <S.StatusDot $on={links} />
          Further reading
        </S.StatusItem>
      </S.StatusRow>

      <S.LessonCard>
        <AnimatePresence initial={false}>
          {hero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: easeOutSpring }}
              style={{ overflow: 'hidden' }}
            >
              <S.HeroBlock>
                <S.HeroLabel>cover image</S.HeroLabel>
              </S.HeroBlock>
            </motion.div>
          )}
        </AnimatePresence>

        <S.Body>
          <S.BodyTitle>Lesson title</S.BodyTitle>
          <S.BodyLine $w={88} />
          <S.BodyLine $w={94} />
          <S.BodyLine $w={72} />
          <S.BodyLine $w={80} />
        </S.Body>

        <AnimatePresence initial={false}>
          {links && (
            <motion.div
              key="links"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: easeOutSpring }}
              style={{ overflow: 'hidden' }}
            >
              <S.LinksBlock>
                <S.LinksHeader>Further reading</S.LinksHeader>
                <S.LinkItem>· deepen this topic</S.LinkItem>
                <S.LinkItem>· primary source</S.LinkItem>
              </S.LinksBlock>
            </motion.div>
          )}
        </AnimatePresence>
      </S.LessonCard>
    </S.Wrap>
  );
};
