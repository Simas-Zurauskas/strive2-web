import styled, { keyframes, css } from 'styled-components';

const pulseRing = keyframes`
  0%   { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.6); opacity: 0; }
`;

const cardLand = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  35%  { transform: translate(-50%, -65%) scale(1.15) rotate(-4deg); }
  100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
`;

const masteryShimmer = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--tertiary) 0%, transparent); }
  50%      { box-shadow: 0 0 22px 4px color-mix(in srgb, var(--tertiary) 45%, transparent); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;

export const Track = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 70px;
  display: flex;
  gap: 6px;
`;

export const Box = styled.div<{ $reached: boolean; $isCurrent: boolean; $isMastery: boolean }>`
  position: relative;
  flex: 1;
  border-radius: 8px;
  border: 1px solid
    ${(p) =>
      p.$isMastery && p.$reached
        ? p.theme.colors.tertiary
        : p.$reached
        ? p.theme.colors.tertiary
        : p.theme.colors.surfaceBorder};
  background: ${(p) => (p.$reached ? p.theme.colors.tertiaryMuted : 'transparent')};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  transition: border-color 0.3s ease, background 0.3s ease;

  ${(p) =>
    p.$isMastery && p.$reached &&
    css`
      animation: ${masteryShimmer} 1.4s ease-in-out infinite;
    `}

  ${(p) =>
    p.$isCurrent &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 10px;
        background: ${p.theme.colors.tertiary};
        z-index: 0;
        animation: ${pulseRing} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `}
`;

export const BoxLabel = styled.span`
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  color: ${(p) => p.theme.colors.muted};
  position: relative;
  z-index: 1;
`;

export const HoppingCard = styled.div<{ $position: number }>`
  position: absolute;
  top: 50%;
  left: ${(p) => p.$position}%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 36px;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surface};
  border: 1.5px solid ${(p) => p.theme.colors.tertiary};
  box-shadow: var(--shadow-lift-strong);
  transition: left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  animation: ${cardLand} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 5px;
    right: 5px;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.colors.tertiary};
    opacity: 0.7;
  }
  &::after {
    content: '';
    position: absolute;
    top: 13px;
    left: 5px;
    width: 60%;
    height: 2px;
    border-radius: 1px;
    background: ${(p) => p.theme.colors.tertiary};
    opacity: 0.4;
  }
`;

export const MasteryBadge = styled.span<{ $on: boolean }>`
  position: absolute;
  top: -10px;
  right: -8px;
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.tertiary};
  color: ${(p) => p.theme.colors.surface};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${(p) => (p.$on ? 1 : 0)};
  ${(p) => p.$on && css`animation: ${slideInRight} 0.35s cubic-bezier(0.16, 1, 0.3, 1);`}
  transition: opacity 0.3s ease;
`;

export const Ratings = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
  max-width: 380px;
`;

const colorForRating = (
  rating: 'again' | 'hard' | 'good' | 'easy',
  theme: { colors: { error: string; warning: string; tertiary: string; success: string } },
) => {
  switch (rating) {
    case 'again': return theme.colors.error;
    case 'hard':  return theme.colors.warning;
    case 'good':  return theme.colors.tertiary;
    case 'easy':  return theme.colors.success;
  }
};

export const RatingBtn = styled.div<{ $active: boolean; $rating: 'again' | 'hard' | 'good' | 'easy' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 7px 4px;
  border-radius: 6px;
  border: 1px solid
    ${(p) =>
      p.$active
        ? colorForRating(p.$rating, p.theme)
        : `color-mix(in oklab, ${colorForRating(p.$rating, p.theme)} 25%, transparent)`};
  background: ${(p) =>
    p.$active
      ? `color-mix(in oklab, ${colorForRating(p.$rating, p.theme)} 14%, transparent)`
      : 'transparent'};
  color: ${(p) => colorForRating(p.$rating, p.theme)};
  transform: scale(${(p) => (p.$active ? 1.04 : 1)});
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
`;

export const Kbd = styled.span`
  font-size: 0.5625rem;
  font-family: var(--font-mono, monospace);
  padding: 1px 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  opacity: 0.7;
`;
