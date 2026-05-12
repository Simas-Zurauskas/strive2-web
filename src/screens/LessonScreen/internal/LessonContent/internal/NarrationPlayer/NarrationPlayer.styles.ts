import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const dotPulse = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

// ── Empty / generating state ────────────────────────

export const EmptyContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  margin: 0.5rem 0 1.25rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
`;

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
`;

export const EmptyEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const EmptyTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.3;
`;

export const PrimaryButton = styled.button`
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: none;
  background: ${(p) => p.theme.colors.accent};
  color: ${(p) => p.theme.colors.surface};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GeneratingDots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 14px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.muted};
    animation: ${dotPulse} 1.2s ease-in-out infinite;
  }
  span:nth-child(2) {
    animation-delay: 0.15s;
  }
  span:nth-child(3) {
    animation-delay: 0.3s;
  }
`;

// ── Ready (player) state ────────────────────────────

/** Wraps the player + optional voice-mismatch banner so the margin
 *  collapsing stays clean when the banner is conditionally rendered. */
export const PlayerStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0 1.25rem;
`;

export const PlayerContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 0.875rem 0.75rem 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  background: ${(p) => p.theme.colors.surface};
`;

export const PlayButton = styled.button<{ $playing: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  border: none;
  background: ${(p) => p.theme.colors.accent};
  color: ${(p) => p.theme.colors.surface};
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  box-shadow: ${(p) => `0 2px 8px ${p.theme.colors.accentMuted}`};

  /* Optical centering — the play triangle visually leans left of the
     button center; nudge it right by 1px when paused so it looks centered. */
  svg {
    transform: ${(p) => (p.$playing ? 'translateX(0)' : 'translateX(1px)')};
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const PlayerBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PlayerEyebrow = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${(p) => p.theme.colors.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ScrubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const Scrub = styled.input<{ $progress: number }>`
  flex: 1;
  min-width: 60px;
  height: 4px;
  appearance: none;
  border-radius: 999px;
  cursor: pointer;
  /* Filled-up-to-thumb effect — works in webkit and moz without separate
     pseudo-elements. The gradient stop tracks $progress. */
  background: linear-gradient(
    to right,
    ${(p) => p.theme.colors.accent} 0%,
    ${(p) => p.theme.colors.accent} ${(p) => p.$progress}%,
    ${(p) => p.theme.colors.border} ${(p) => p.$progress}%,
    ${(p) => p.theme.colors.border} 100%
  );

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.surface};
    border: 2px solid ${(p) => p.theme.colors.accent};
    cursor: pointer;
    transition: transform 0.15s;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.surface};
    border: 2px solid ${(p) => p.theme.colors.accent};
    cursor: pointer;
  }

  ${(p) => p.theme.media.hover} {
    &:hover::-webkit-slider-thumb {
      transform: scale(1.15);
    }
  }
`;

export const Time = styled.div`
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  color: ${(p) => p.theme.colors.muted};
  flex-shrink: 0;
  letter-spacing: 0.01em;
  text-align: right;
  /* Defensive: even with tabular-nums + always-padded MM:SS the
   * computed width can wobble by a sub-pixel between renders. Pin it. */
  min-width: 75px;

  span {
    opacity: 0.5;
    margin: 0 0.125rem;
  }
`;

export const RateButton = styled.button`
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  padding: 0.25rem 0;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  /* Fixed width sized to the widest rate label ("1.75×") so cycling
   * through 1× → 1.25× → 1.5× → 1.75× → 2× doesn't shift the layout
   * (the scrub bar would otherwise twitch left/right on every click). */
  width: 50px;
  text-align: center;
  transition: border-color 0.15s, color 0.15s, background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => p.theme.colors.accent};
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.accentMuted};
    }
  }
`;

// ── Voice-mismatch banner ───────────────────────────

export const MismatchBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.875rem;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.tertiary}40;
  background: ${(p) => p.theme.colors.tertiaryMuted};

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

export const MismatchText = styled.div`
  flex: 1;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: ${(p) => p.theme.colors.foreground};

  strong {
    font-weight: 600;
    color: ${(p) => p.theme.colors.tertiary};
  }
`;

export const MismatchAction = styled.button`
  flex-shrink: 0;
  padding: 0.4375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.tertiary};
  background: transparent;
  color: ${(p) => p.theme.colors.tertiary};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      background: ${(p) => p.theme.colors.tertiary};
      color: ${(p) => p.theme.colors.surface};
    }
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
