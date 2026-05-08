'use client';

import { motion } from 'framer-motion';
import { Check, Flame, Layers, Unlock, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { easeOutSpring, useMotion } from '@/theme/motionPresets';
import * as S from './LessonCompletionAnimation.styles';

// One central button, four downstream effects.
//   • idle    — button rests, chips muted
//   • press   — button shows pressed/finished state
//   • cascade — chips light up staggered (recall → quiz → XP → streak)
//   • hold    — all four lit, button shows "Lesson finished"
//
// The four chips correspond 1:1 to the actual side-effects of
// `handleMarkComplete`: enqueueing recall cards, advancing the
// module-quiz unlock counter, awarding XP, and ticking the streak.

const PHASES = ['idle', 'press', 'cascade', 'hold'] as const;
type Phase = (typeof PHASES)[number];

const TICK_MS = 1400;

const CHIPS = [
  { id: 'recall', Icon: Layers, label: 'Recall queue' },
  { id: 'quiz', Icon: Unlock, label: 'Quiz unlock' },
  { id: 'xp', Icon: Zap, label: '+50 XP' },
  { id: 'streak', Icon: Flame, label: 'Streak +1' },
];

export const LessonCompletionAnimation = () => {
  const { prefersReduced } = useMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % PHASES.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const phase: Phase = PHASES[tick];
  const pressed = phase !== 'idle';
  const lit = phase === 'cascade' || phase === 'hold';

  return (
    <S.Wrap aria-hidden>
      <S.ButtonRow>
        <motion.div
          animate={{ scale: phase === 'press' ? 0.97 : 1 }}
          transition={{ duration: 0.18, ease: easeOutSpring }}
        >
          <S.MockButton $pressed={pressed}>
            <S.MockButtonIcon $shown={pressed}>
              <Check size={14} strokeWidth={2.5} />
            </S.MockButtonIcon>
            <span>{pressed ? 'Lesson finished' : 'Mark as finished'}</span>
          </S.MockButton>
        </motion.div>
      </S.ButtonRow>

      <S.ChipRow>
        {CHIPS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={false}
            animate={{ y: lit ? 0 : 4, opacity: lit ? 1 : 0.45 }}
            transition={{
              delay: lit ? i * 0.16 : 0,
              duration: 0.36,
              ease: easeOutSpring,
            }}
          >
            <S.Chip $lit={lit}>
              <S.ChipIcon $lit={lit}>
                <c.Icon size={14} strokeWidth={2} />
              </S.ChipIcon>
              <S.ChipLabel>{c.label}</S.ChipLabel>
            </S.Chip>
          </motion.div>
        ))}
      </S.ChipRow>
    </S.Wrap>
  );
};
