import styled, { css, keyframes } from 'styled-components';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Multi-peak waveform keyframe — non-sinusoidal so adjacent bars (driven
// by varying durations/delays below) drift in and out of phase, mimicking
// the irregularity of real audio amplitude rather than a perfect ripple.
const waveBar = keyframes`
  0%   { transform: scaleY(0.22); }
  18%  { transform: scaleY(0.65); }
  34%  { transform: scaleY(0.4);  }
  52%  { transform: scaleY(1);    }
  68%  { transform: scaleY(0.55); }
  84%  { transform: scaleY(0.78); }
  100% { transform: scaleY(0.22); }
`;

// 9 prime-ish durations & delays cycled across 18 bars. The mismatched
// periods stop the pattern from looping back to a neat repeat — the
// global beat takes ~minutes to recur, so the eye reads it as organic.
const BAR_DURATIONS_S = [0.72, 0.9, 1.08, 0.84, 1.02, 0.78, 0.96, 1.14, 0.69];
const BAR_DELAYS_S = [0, 0.18, 0.36, 0.54, 0.06, 0.24, 0.42, 0.12, 0.3];

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  flex-direction: column;
  gap: 0.625rem;
`;

export const LessonBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 320px;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const ProseRow = styled.span<{ $w: number; $reading: boolean; $read: boolean }>`
  display: block;
  height: 6px;
  width: ${(p) => p.$w}%;
  border-radius: 3px;
  background: ${(p) =>
    p.$reading
      ? p.theme.colors.tertiary
      : p.theme.colors.muted};
  opacity: ${(p) => (p.$reading ? 0.95 : p.$read ? 0.75 : 0.32)};
  transform: ${(p) => (p.$reading ? 'scaleX(1.02)' : 'scaleX(1)')};
  transform-origin: left center;
  transition:
    background 0.3s ease,
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const CodeBlock = styled.div<{ $skipping: boolean }>`
  position: relative;
  padding: 0.625rem;
  border-radius: 6px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 4px 0;
  font-family: var(--font-mono, monospace);
  filter: ${(p) => (p.$skipping ? 'saturate(0.4) opacity(0.55)' : 'none')};
  transition: filter 0.4s ease;
`;

export const SkippedBadge = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.tertiary};
  color: ${(p) => p.theme.colors.surface};
  opacity: ${(p) => (p.$on ? 1 : 0.55)};
  transform: scale(${(p) => (p.$on ? 1.05 : 1)});
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  ${(p) => p.$on && css`animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1);`}
`;

export const CodeRow = styled.span<{ $w: number }>`
  display: block;
  height: 5px;
  width: ${(p) => p.$w}%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: 0.55;
`;

// ── Voice waveform row at the bottom ─────────────────────
export const WaveRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  max-width: 320px;
  padding: 0.5rem 0.875rem;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
`;

export const WaveIcon = styled.span`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.tertiary};
  display: inline-flex;
`;

export const Wave = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 22px;
`;

/* A calm static line shown only when narration pauses (e.g. on a code
 * block). Crossfades with the bouncing bars so neither animation has
 * to morph into the other — that's what was causing the "glitchy" feel. */
export const PausedLine = styled.span<{ $shown: boolean }>`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  transform: translateY(-50%) scaleX(${(p) => (p.$shown ? 1 : 0.5)});
  transform-origin: center;
  border-radius: 1px;
  background: ${(p) => p.theme.colors.tertiary};
  opacity: ${(p) => (p.$shown ? 0.55 : 0)};
  pointer-events: none;
  transition:
    opacity 0.35s ease,
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Bar = styled.span<{ $i: number; $hidden: boolean }>`
  display: block;
  flex: 1;
  height: 18px;
  border-radius: 1.5px;
  background: ${(p) => p.theme.colors.tertiary};
  transform-origin: center;
  animation: ${waveBar}
    ${(p) => BAR_DURATIONS_S[p.$i % BAR_DURATIONS_S.length]}s
    ease-in-out
    infinite;
  /* Negative delay starts each bar mid-cycle so the wave is alive on mount. */
  animation-delay: -${(p) => BAR_DELAYS_S[p.$i % BAR_DELAYS_S.length]}s;
  /* Crossfade out while the calm line crossfades in. The keyframe keeps
   * running underneath; only opacity moves, so there's nothing for the
   * transitions to fight over. */
  opacity: ${(p) => (p.$hidden ? 0 : 1)};
  transition: opacity 0.35s ease;
  will-change: transform, opacity;
`;

/* Holds two absolutely-positioned label variants on top of an invisible
 * spacer sized to the longest text. That keeps the row width constant
 * regardless of which label is showing, so the wave bars never stretch
 * when narration toggles between "reading aloud" and "pause". */
export const WaveLabel = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.tertiary};
  white-space: nowrap;
`;

export const WaveLabelSpacer = styled.span`
  visibility: hidden;
  white-space: nowrap;
`;

export const WaveLabelText = styled.span<{ $shown: boolean }>`
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  opacity: ${(p) => (p.$shown ? 1 : 0)};
  transition: opacity 0.3s ease;
`;
