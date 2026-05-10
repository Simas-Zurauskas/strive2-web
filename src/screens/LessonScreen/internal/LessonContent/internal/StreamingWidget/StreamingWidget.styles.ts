import styled, { keyframes, css } from 'styled-components';

/* Three-dot wave — each dot lifts + scales + fades, staggered by 0.16 s
   per index. Reads as continuous motion rather than a synchronised strobe. */
const dotWave = keyframes`
  0%, 100% { transform: translateY(0)    scale(1);    opacity: 0.4; }
  20%      { transform: translateY(-3px) scale(1.18); opacity: 1;   }
  60%      { transform: translateY(0)    scale(1);    opacity: 0.4; }
`;

/* A soft accent gradient sweeps left → right beneath the content as a
   continuous "work in progress" signal. No determinate progress to surface
   here — the gradient is intentionally non-scrubbing. */
const sweep = keyframes`
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(220%); }
`;

/* Slow shimmer drifting across the italic-serif label. Long cycle (4 s)
   so the type still reads as still type, with just a hint of life. */
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

/* Calm fade-in on mount — the widget appears below the streaming content
   so a hard pop reads as jank. */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Wrap = styled.div<{ $finishing: boolean }>`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin: 0.875rem 0 0.25rem;
  padding: 0.875rem 1.125rem;
  border-radius: 14px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: var(--shadow-card-soft);
  animation: ${fadeIn} 0.32s cubic-bezier(0.16, 1, 0.3, 1);

  ${(p) =>
    p.$finishing &&
    css`
      /* Finishing state — quieter, no card chrome, smaller padding, so it
         visually defers to the (already-rendered) lesson content above. */
      padding: 0.5rem 0.75rem;
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const IconStage = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  height: 18px;
`;

export const Dot = styled.span<{ $i: 0 | 1 | 2; $finishing: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) =>
    p.$finishing ? p.theme.colors.muted : p.theme.colors.accent};
  animation: ${dotWave} 1.4s ease-in-out infinite;
  animation-delay: ${(p) => p.$i * 0.16}s;
  will-change: transform, opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  flex: 1;
`;

export const Title = styled.span<{ $finishing: boolean }>`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: ${(p) => (p.$finishing ? '0.9375rem' : '1.0625rem')};
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: ${(p) => p.theme.colors.foreground};

  /* Slow shimmer along the label — barely-there gradient drift over the
     italic-serif type so the line feels alive without scrolling.
     Background-clip: text needs the WebKit prefix to render in Safari. */
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.foreground} 0%,
    ${(p) => p.theme.colors.foreground} 38%,
    ${(p) => p.theme.colors.muted} 50%,
    ${(p) => p.theme.colors.foreground} 62%,
    ${(p) => p.theme.colors.foreground} 100%
  );
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: ${shimmer} 4s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: none;
    -webkit-text-fill-color: ${(p) => p.theme.colors.foreground};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Sub = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

/* Sweep — thin accent gradient travelling along the bottom edge of the
   card. Single chunk that loops; opacity-fades at the gradient ends keep
   the head and tail soft. Hidden in `finishing` (and reduced-motion). */
export const Sweep = styled.span<{ $finishing: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 45%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${(p) => p.theme.colors.accent} 50%,
    transparent 100%
  );
  opacity: 0.7;
  animation: ${sweep} 1.9s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  will-change: transform;

  ${(p) =>
    p.$finishing &&
    css`
      display: none;
    `}

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;
