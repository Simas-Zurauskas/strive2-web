'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './CourseDepthAnimation.styles';

// Single course outline that *grows and shrinks* between three depths.
// Rows insert and collapse around the bracket's vertical centre, so the
// audience sees the same course reshape — not three separate trees lighting
// up. A side gauge shows estimated time growing in step.

const TIERS = [
  { id: 'overview', label: 'Overview', rows: 4, time: 'short' },
  { id: 'comprehensive', label: 'Comprehensive', rows: 8, time: 'end-to-end' },
  { id: 'deep', label: 'Deep Dive', rows: 13, time: 'mastery' },
] as const;

type TierId = (typeof TIERS)[number]['id'];

const TICK_MS = 2400;
const ROW_WIDTHS = [82, 60, 88, 55, 72, 64, 50, 86, 60, 76, 52, 80, 68] as const;
const ROW_INDENTS = [false, true, true, false, true, true, false, true, true, true, false, true, true] as const;

export const CourseDepthAnimation = () => {
  const { prefersReduced } = useMotion();
  const [tierIdx, setTierIdx] = useState(1); // start on Comprehensive

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTierIdx((t) => (t + 1) % TIERS.length), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const tier = TIERS[tierIdx];
  const rowsToShow = ROW_WIDTHS.slice(0, tier.rows);
  const isRecommended = tier.id === ('comprehensive' satisfies TierId);
  const fillPct = (tierIdx / (TIERS.length - 1)) * 100;

  return (
    <S.Wrap aria-hidden>
      <S.Stage>
        <S.Tree $recommended={isRecommended}>
          <S.RowsCol>
            <AnimatePresence initial={false}>
              {rowsToShow.map((w, i) => (
                <S.RowWrap
                  key={i}
                  as={motion.div}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    layout: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.22, ease: 'easeOut', delay: i * 0.015 },
                    height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                  }}
                >
                  <S.Row $w={w} $indent={ROW_INDENTS[i]} $highlight={isRecommended} />
                </S.RowWrap>
              ))}
            </AnimatePresence>
          </S.RowsCol>
        </S.Tree>

        <S.Gauge>
          <S.GaugeLabel>commitment</S.GaugeLabel>
          <S.GaugeTrack>
            <S.GaugeFill
              as={motion.span}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
            {TIERS.map((_, i) => (
              <S.GaugeMark
                key={i}
                $position={(i / (TIERS.length - 1)) * 100}
                $active={i === tierIdx}
                $reached={i <= tierIdx}
              />
            ))}
          </S.GaugeTrack>

          <S.TextSlot>
            <S.GaugeTierSlot>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`tier-${tier.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  {tier.label}
                </motion.span>
              </AnimatePresence>
            </S.GaugeTierSlot>

            <S.GaugeRecSlot>
              <AnimatePresence initial={false}>
                {isRecommended && (
                  <motion.span
                    key="rec"
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    recommended
                  </motion.span>
                )}
              </AnimatePresence>
            </S.GaugeRecSlot>

            <S.GaugeTimeSlot>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`time-${tier.id}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {tier.time}
                </motion.span>
              </AnimatePresence>
            </S.GaugeTimeSlot>
          </S.TextSlot>
        </S.Gauge>
      </S.Stage>
    </S.Wrap>
  );
};
