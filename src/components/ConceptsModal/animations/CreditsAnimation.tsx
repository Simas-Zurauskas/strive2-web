'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, type LucideIcon, RotateCcw, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { easeOutSpring, useMotion } from '@/theme/motionPresets';
import * as S from './CreditsAnimation.styles';

// Twin-vessel allowance metaphor with explicit "spending" cues.
//   Left vessel  = monthly bucket (refills at period rollover).
//   Right vessel = top-up bucket (sticky, doesn't reset).
// Each tick, an "action" pulse scrolls across the bottom (lesson /
// narration / quiz icon), draining one drop from the relevant vessel.
// When monthly empties, drops switch to top-up. After ~6 ticks total a
// "new period" beat refills monthly with a wave animation. Reduced-
// motion holds at full + full.

const TICK_MS = 800;
const MAX_MONTHLY = 6;
const MAX_TOPUP = 4;
// Cycle drains 6 monthly + 2 top-up actions, then refills monthly. One
// entry per tick so the chip never repeats consecutively.
const REFILL_AT = 9;

const ACTIONS = [
  { id: 'lesson',  Icon: BookOpen },
  { id: 'narrate', Icon: Volume2 },
  { id: 'quiz',    Icon: CheckCircle2 },
  { id: 'lesson',  Icon: BookOpen },
  { id: 'recall',  Icon: RotateCcw },
  { id: 'narrate', Icon: Volume2 },
  { id: 'quiz',    Icon: CheckCircle2 },
  { id: 'lesson',  Icon: BookOpen },
  { id: 'recall',  Icon: RotateCcw },
] as const satisfies ReadonlyArray<{ id: string; Icon: LucideIcon }>;

export const CreditsAnimation = () => {
  const { prefersReduced } = useMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % REFILL_AT), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const monthlyDraws = Math.min(tick, MAX_MONTHLY);
  const topupDraws = Math.max(0, tick - MAX_MONTHLY);
  const monthlyLevel = Math.max(0, MAX_MONTHLY - monthlyDraws);
  const topupLevel = Math.max(0, MAX_TOPUP - topupDraws);

  const isRefilling = tick === 0;
  const action = ACTIONS[tick];
  const ActionIcon = action.Icon;
  // Tone follows the bucket the current action draws from; tick 0 is the
  // refill beat where monthly is freshly full, so it stays monthly-toned.
  const tone: 'monthly' | 'topup' = tick > MAX_MONTHLY ? 'topup' : 'monthly';

  return (
    <S.Wrap aria-hidden>
      <S.Stage>
        <S.Vessel>
          <S.VesselLabel>Monthly</S.VesselLabel>
          <S.VesselBody>
            {isRefilling && <S.RefillWave />}
            {Array.from({ length: MAX_MONTHLY }).map((_, i) => (
              <S.Drop key={`m-${i}`} $filled={i < monthlyLevel} $tone="monthly" />
            ))}
          </S.VesselBody>
          <S.VesselFoot $emphasis={isRefilling}>
            {isRefilling ? 'new period · refilled' : 'resets monthly'}
          </S.VesselFoot>
        </S.Vessel>

        {/* Mid-stage action pulse — drives the visual cause for each draw.
            Chip stays anchored; only the icon/label swap, with a soft ring
            ripple beating outward each tick. Tone follows the draining
            bucket so the chip ties into the same gold/green palette. */}
        <S.ActionPulse>
          <S.ActionGlyph $tone={tone}>
            <S.PulseRing key={`ring-${tick}`} $tone={tone} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={action.id}
                style={{ display: 'inline-flex', position: 'relative', zIndex: 1 }}
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.55 }}
                transition={{ duration: 0.2, ease: easeOutSpring }}
              >
                <ActionIcon size={14} strokeWidth={2} />
              </motion.span>
            </AnimatePresence>
          </S.ActionGlyph>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: easeOutSpring }}
            >
              <S.ActionLabel $tone={tone}>{action.id}</S.ActionLabel>
            </motion.div>
          </AnimatePresence>
        </S.ActionPulse>

        <S.Vessel>
          <S.VesselLabel>Top-up</S.VesselLabel>
          <S.VesselBody>
            {Array.from({ length: MAX_TOPUP }).map((_, i) => (
              <S.Drop key={`t-${i}`} $filled={i < topupLevel} $tone="topup" />
            ))}
          </S.VesselBody>
          <S.VesselFoot>doesn&rsquo;t expire</S.VesselFoot>
        </S.Vessel>
      </S.Stage>
    </S.Wrap>
  );
};
