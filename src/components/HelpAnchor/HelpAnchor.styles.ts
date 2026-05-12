import styled, { keyframes, css } from 'styled-components';

// Three motion layers, all gated on the "unviewed" state:
//   1. ring   — an accent (forest-green) disc that scales out and fades on
//      a 2.2 s loop, like a sonar ping (Ring).
//   2. dot    — the button itself wobbles gently in scale on the same beat
//      and switches its chrome to an accent-tinted fill + accent border so
//      it reads as a real call-to-action rather than a quiet "?" gloss
//      (Button).
//   3. bounce — the whole anchor does a single physical hop on a 4 s cycle
//      (Wrap). 75 % of the cycle is at rest; the active 1 s does a primary
//      lift with a smaller real rebound at the bottom, like a ball that
//      pops up and settles. The "physical" feel comes from per-keyframe
//      easing: ease-out on the rises (decelerating into the apex, the way
//      a thrown object slows under gravity) and ease-in on the falls
//      (accelerating from rest, the way a falling object speeds up).
//      Linear interpolation between fixed easing for the whole animation
//      can't replicate this — that's what made the earlier attempts feel
//      mechanical.
// Once the user views the concept all three layers fall away — the button
// reverts to the calm tertiary-gold treatment so a page full of viewed
// anchors doesn't read busy.

const pulseRing = keyframes`
  0%   { transform: scale(1);    opacity: 0.75; }
  60%  { transform: scale(2.4);  opacity: 0;    }
  100% { transform: scale(2.4);  opacity: 0;    }
`;

const pulseDot = keyframes`
  0%, 100% { transform: scale(1);    }
  18%      { transform: scale(1.22); }
  42%      { transform: scale(1);    }
`;

/* Single physical bounce with per-keyframe easing for proper gravity feel.
   Phases (cycle = 4 s, total motion = ~ 1 s, rest = ~ 3 s):
     75 → 82 %   primary lift to −10 px       (ease-out — decelerate to peak)
     82 → 88 %   fall back to baseline        (ease-in  — accelerate falling)
     88 → 91 %   rebound up to −3 px          (ease-out — decelerate to peak)
     91 → 94 %   final settle to baseline     (ease-in  — accelerate falling)
     94 → 100 % + 0 → 75 %  rest at baseline  (~ 3.24 s of stillness)
   The rest period is what makes the bounce read as a deliberate "look here"
   rather than constant agitation. */
const bounce = keyframes`
  0%, 75%, 100% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
  82% {
    transform: translateY(-10px);
    animation-timing-function: ease-in;
  }
  88% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
  91% {
    transform: translateY(-3px);
    animation-timing-function: ease-in;
  }
  94% {
    transform: translateY(0);
  }
`;

export const Wrap = styled.span<{ $variant: 'inline' | 'floating'; $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* vertical-align: middle aligns to x-height — fine for sentence-case but
     reads slightly high next to uppercase eyebrows (cap-height > x-height).
     The small negative em nudges the anchor down so it sits on the visual
     midline of cap-heavy text without disturbing sentence-case lines. */
  vertical-align: -0.08em;
  /* Horizontal breathing room so the boosted sonar ring (2.4× scale) clears
     adjacent characters instead of pulsing into them. */
  margin: 0 0.5em;

  /* Bounce only on inline variant — floating anchors are positioned over
     hero animations elsewhere and shouldn't dance independently of their
     composition. The "linear" timing here is intentional: per-keyframe
     animation-timing-function rules do the real easing work, so the
     top-level curve must be a no-op. */
  ${(p) =>
    p.$active &&
    p.$variant === 'inline' &&
    css`
      animation: ${bounce} 4s linear infinite;
    `}

  ${(p) =>
    p.$variant === 'floating' &&
    css`
      position: absolute;
      margin: 0;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Ring = styled.span<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.accent};
  pointer-events: none;
  opacity: 0;
  ${(p) =>
    p.$active &&
    css`
      animation: ${pulseRing} 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    `}
`;

export const Button = styled.button<{ $active: boolean; $size: 'sm' | 'md' }>`
  position: relative;
  width: ${(p) => (p.$size === 'sm' ? '18px' : '22px')};
  height: ${(p) => (p.$size === 'sm' ? '18px' : '22px')};
  padding: 0;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.tertiary};
  font-size: ${(p) => (p.$size === 'sm' ? '0.6875rem' : '0.8125rem')};
  font-weight: 600;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.tertiaryHover};
      border-color: ${(p) => p.theme.colors.tertiary};
      background: ${(p) => p.theme.colors.tertiaryMuted};
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  ${(p) =>
    p.$active &&
    css`
      /* Unseen — switch chrome to accent green so the anchor stops reading
         as a "?" gloss and starts reading as a CTA. The pulse on top makes
         it impossible to miss. */
      color: ${p.theme.colors.accent};
      border-color: ${p.theme.colors.accent};
      background: ${p.theme.colors.accentMuted};
      animation: ${pulseDot} 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;

      ${p.theme.media.hover} {
        &:hover {
          color: ${p.theme.colors.accentHover};
          border-color: ${p.theme.colors.accentHover};
          background: ${p.theme.colors.accentMuted};
        }
      }
    `}
`;
