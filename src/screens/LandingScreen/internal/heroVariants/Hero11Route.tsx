'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './Hero11Route.styles';
import { HeroSection } from '../HeroSection/HeroSection';
import type { Easing, TargetAndTransition, Transition } from 'framer-motion';

/**
 * VARIANT 11 — THE SHIPPED HERO, IN A CHASE.
 *
 * Not a re-cut of the hero: the hero. `HeroSection` is mounted here
 * unchanged — same eyebrow, same two-line headline, same subhead, same
 * two-column grid and proportions, same live goal form, same charted route
 * synced to the rotating example goal — inside variant 02's two-forme
 * chase at one screen minus the nav bar.
 *
 * Earlier passes re-implemented the composition (heavier headline, even
 * column split, enlarged route, an extra sources line) and review rejected
 * all of it twice. Importing the real component instead means this variant
 * cannot drift from what ships: if the hero changes, 11 changes with it,
 * and the only question the variant actually poses — "does the chase and
 * the full-screen height suit it?" — is the only variable left.
 *
 * MOTION — one register, inherited with the border. Once every thirteen
 * seconds the gold forme lands a hair off (fast, easeOut), sits wrong for
 * a beat, and is pulled back slowly (easeInOut), exactly as 02's press
 * does. The period is 13s against 02's 18s so that when the lab stacks
 * both, the two chases never slip in unison — which would read as a
 * site-wide glitch rather than each page's own press. The hero's own
 * motion (the route re-charting) is untouched and unduplicated.
 *
 * REDUCED MOTION / SSR. The slip's first and last keyframes are register
 * 0/0 and the reduced branch pins x/y to 0, so the server-rendered style is
 * the same string under either preference and hydration cannot disagree.
 * `initial={false}` keeps the hero the LCP element it is at variant 00 —
 * nothing here serialises an entrance.
 */

interface Props {
  onOpenSignUp: () => void;
}

/* Hero 02's mis-registration: held true for half the cycle, knocked off in
   under a second, held wrong, corrected slowly. The eases are what sell it
   — a plate LANDS (easeOut), a pressman eases it back (easeInOut). */
const REGISTER_TIMES = [0, 0.52, 0.56, 0.74, 0.88, 1];
const REGISTER_EASE: Easing[] = ['linear', 'easeOut', 'linear', 'easeInOut', 'linear'];
const REGISTER_TRANSITION: Transition = {
  // 21s originally; shortened at review so the slip comes round more often.
  // Still off 02's 18s, which is the point — when the lab stacks both, two
  // chases slipping in unison would read as a site-wide glitch rather than
  // as each page's own press.
  duration: 13,
  repeat: Infinity,
  times: REGISTER_TIMES,
  ease: REGISTER_EASE,
};

const REGISTER_OFF: TargetAndTransition = {
  x: [0, 0, -1.6, -1.6, 0, 0],
  y: [0, 0, 1.1, 1.1, 0, 0],
};
const REGISTER_HELD: TargetAndTransition = { x: 0, y: 0 };

export const Hero11Route = ({ onOpenSignUp }: Props) => {
  const { prefersReduced } = useMotion();

  // Held (not slipping) while the hero is scrolled away — an infinite
  // 13s transform loop has no audience six screens down (011-landing C3).
  // `useInView` is false on the server and first render, and REGISTER_HELD
  // is x/y 0 — the same style `initial={false}` resolved before — so the
  // SSR markup is unchanged. Re-entering view restarts the cycle from its
  // held half, which is indistinguishable from the loop's own rest state.
  const chaseRef = useRef<HTMLDivElement | null>(null);
  const chaseInView = useInView(chaseRef);
  const held = prefersReduced || !chaseInView;

  return (
    <S.Wrap>
      <S.Chase ref={chaseRef}>
        <S.GoldFrame
          aria-hidden="true"
          initial={false}
          animate={held ? REGISTER_HELD : REGISTER_OFF}
          transition={held ? { duration: 0 } : REGISTER_TRANSITION}
        >
          {([0, 1, 2, 3] as const).map((c) => (
            <S.Quoin key={c} $c={c} />
          ))}
        </S.GoldFrame>

        <S.HeroHost>
          <HeroSection onOpenSignUp={onOpenSignUp} />
        </S.HeroHost>
      </S.Chase>
    </S.Wrap>
  );
};
