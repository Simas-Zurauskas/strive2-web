'use client';

import { useEffect, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './XpStreaksAnimation.styles';

// Gauge-and-bridge composition.
//   Left:  a circular XP ring that fills as XP ticks up. The number
//          inside refreshes with a tiny pop on each step. Mini icons
//          flash above to attribute the +XP to its source action.
//   Right: a 7-day calendar where lit days are connected by bridges
//          (rather than just coloured tiles). The bridge "draws in"
//          chronologically. Weekends are dimmer but still bridged so
//          the streak chain reads as continuous.

const TICK_MS = 700;
const STEPS_PER_CYCLE = 14; // ~10s per cycle
const XP_PER_STEP = 5;
const TARGET_XP = 240;

const SOURCES = ['lesson', 'recall', 'quiz', 'lesson', 'recall', 'recall'] as const;

export const XpStreaksAnimation = () => {
  const { prefersReduced } = useMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % STEPS_PER_CYCLE), TICK_MS);
    return () => clearInterval(id);
  }, [prefersReduced]);

  const xp = Math.min(TARGET_XP, 60 + tick * XP_PER_STEP * 2);
  const xpPct = (xp / TARGET_XP) * 100;
  // Active "current" calendar day cycles through Mon..Sat (skip Sun visually).
  const activeDay = tick % 6;
  const source = SOURCES[tick % SOURCES.length];

  return (
    <S.Wrap aria-hidden>
      <S.Gauge>
        <S.RingSvg viewBox="0 0 100 100" aria-hidden>
          {/* Track */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-border)" strokeWidth="6" />
          {/* Filled arc */}
          <S.RingArc
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            $pct={xpPct}
            transform="rotate(-90 50 50)"
          />
        </S.RingSvg>
        <S.GaugeContent>
          <S.GaugeXpRow key={tick}>
            <S.XpPlus>+</S.XpPlus>
            <S.XpValue>{xp}</S.XpValue>
            <S.XpUnit>XP</S.XpUnit>
          </S.GaugeXpRow>
          <S.GaugeSource>from {source}</S.GaugeSource>
        </S.GaugeContent>
      </S.Gauge>

      <S.Calendar>
        <S.CalLabel>this week</S.CalLabel>
        <S.DayChain>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => {
            const isWeekend = i >= 5;
            const isLit = i <= activeDay && !isWeekend;
            const isActive = i === activeDay;
            return (
              <S.DayCell key={i}>
                <S.DayDot
                  $lit={isLit}
                  $weekend={isWeekend}
                  $active={isActive}
                >
                  {label}
                </S.DayDot>
                {i < 6 && (
                  <S.Bridge
                    $lit={i < activeDay}
                    $dimmed={i === 4 || i === 5}
                  />
                )}
              </S.DayCell>
            );
          })}
        </S.DayChain>
        <S.CalFootnote>weekends bridged · streak alive</S.CalFootnote>
      </S.Calendar>
    </S.Wrap>
  );
};
