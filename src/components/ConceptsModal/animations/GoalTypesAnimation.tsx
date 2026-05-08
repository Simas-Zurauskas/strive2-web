'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, Hammer, Languages, type LucideIcon, Telescope, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './GoalTypesAnimation.styles';

// One container that re-shapes its inner contents between five goal-type
// "personalities". Children fade out, the container's badge/colour
// transitions, and a fresh layout fades in. The orbit ring around the
// container rotates a hero icon to mark the active type, so the user
// reads ONE composition that's morphing rather than 5 separate panels.

const TICK_MS = 1500;

interface TypeEntry {
  id: 'master' | 'monetize' | 'pass' | 'build' | 'fluency';
  label: string;
  verb: string;
  Icon: LucideIcon;
}

// Same five lucide icons used by the landing GoalTypesSection — keeps the
// product's vocabulary consistent across surfaces.
const TYPES: ReadonlyArray<TypeEntry> = [
  { id: 'master', label: 'Master', verb: 'go deep', Icon: Telescope },
  { id: 'monetize', label: 'Monetize', verb: 'earn from', Icon: TrendingUp },
  { id: 'pass', label: 'Pass', verb: 'pass the test', Icon: GraduationCap },
  { id: 'build', label: 'Build', verb: 'build with', Icon: Hammer },
  { id: 'fluency', label: 'Fluency', verb: 'be fluent in', Icon: Languages },
];

const renderShape = (id: TypeEntry['id']) => {
  switch (id) {
    case 'master':
      return (
        <S.ShapeBox key={id}>
          {[78, 60, 88, 50, 70, 56, 82, 48].map((w, i) => (
            <S.TreeRow key={i} $w={w} $delay={i * 35} />
          ))}
        </S.ShapeBox>
      );
    case 'monetize':
      return (
        <S.ShapeBox key={id}>
          {[92, 92, 92, 92].map((w, i) => (
            <S.ListRow key={i} $w={w} $delay={i * 70} />
          ))}
        </S.ShapeBox>
      );
    case 'pass':
      return (
        <S.ShapeBox key={id}>
          {[40, 60, 84, 60, 40].map((w, i) => (
            <S.ArcRow key={i} $w={w} $delay={i * 60} />
          ))}
        </S.ShapeBox>
      );
    case 'build':
      return (
        <S.ShapeBox key={id}>
          <S.ProjectCanvas />
        </S.ShapeBox>
      );
    case 'fluency':
      return (
        <S.ShapeBox key={id}>
          <S.Bubble $align="left" $w={56} $delay={0} />
          <S.Bubble $align="right" $w={68} $delay={120} />
          <S.Bubble $align="left" $w={42} $delay={240} />
          <S.Bubble $align="right" $w={58} $delay={360} />
        </S.ShapeBox>
      );
  }
};

export const GoalTypesAnimation = () => {
  const { prefersReduced } = useMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % TYPES.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const current = TYPES[idx];

  return (
    <S.Wrap aria-hidden>
      <S.OrbitRing>
        {TYPES.map((t, i) => (
          <S.OrbitGlyph
            key={t.id}
            $angle={(i / TYPES.length) * 360 - 90}
            $active={i === idx}
          >
            <t.Icon size={13} strokeWidth={2} />
          </S.OrbitGlyph>
        ))}

        <S.Center>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderShape(current.id)}
            </motion.div>
          </AnimatePresence>
        </S.Center>

        <S.Caption>
          <S.CaptionVerb>to {current.verb}</S.CaptionVerb>
          <S.CaptionLabel>{current.label}</S.CaptionLabel>
        </S.Caption>
      </S.OrbitRing>
    </S.Wrap>
  );
};
