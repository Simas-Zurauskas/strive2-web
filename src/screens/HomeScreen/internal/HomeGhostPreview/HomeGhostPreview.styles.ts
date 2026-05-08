import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrap = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  max-width: ${(p) => (p.$size === 'sm' ? '320px' : p.$size === 'md' ? '380px' : '420px')};
  margin: 0 auto;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem 1.25rem 1.125rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 14px;
  background: ${(p) => p.theme.colors.background};
  box-shadow: var(--shadow-ghost);
`;

export const TopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${(p) => p.theme.colors.tertiary};
  opacity: 0.75;
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.tertiary};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.tertiary};
    box-shadow: 0 0 0 4px
      ${(p) => `color-mix(in oklab, ${p.theme.colors.tertiary} 18%, transparent)`};
  }
`;

export const Title = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.0625rem;
  line-height: 1.35;
  color: ${(p) => p.theme.colors.foreground};
  margin: 0;
  text-align: left;
`;

export const Modules = styled.ul`
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

/** Grid layout with fixed columns: [num | label | bar-track]. The bar
 *  column is a fixed 130px so the label column never reflows when the
 *  fill animates — width changes happen INSIDE the track via ModuleFill. */
export const Module = styled(motion.li)`
  display: grid;
  grid-template-columns: 22px 1fr 130px;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: left;
`;

export const ModuleNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 20%, ${p.theme.colors.background})`};
  color: ${(p) => p.theme.colors.tertiary};
  font-size: 0.6875rem;
  font-weight: 600;
`;

export const ModuleLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const ModuleBarTrack = styled.span`
  display: block;
  width: 100%;
  height: 7px;
  border-radius: 999px;
  background: ${(p) =>
    `color-mix(in oklab, ${p.theme.colors.tertiary} 12%, ${p.theme.colors.surfaceBorder})`};
  overflow: hidden;
`;

/** Fill is a percentage of the TRACK (not of the row), so growing the
 *  fill never changes the row's outer dimensions. Animated via CSS
 *  transition rather than framer-motion to keep the timer simple. */
export const ModuleBarFill = styled.span<{ $w: number }>`
  display: block;
  height: 100%;
  width: ${(p) => `${p.$w}%`};
  border-radius: 999px;
  background: ${(p) =>
    `linear-gradient(90deg,
      color-mix(in oklab, ${p.theme.colors.tertiary} 55%, ${p.theme.colors.surfaceBorder}) 0%,
      color-mix(in oklab, ${p.theme.colors.tertiary} 25%, ${p.theme.colors.surfaceBorder}) 100%)`};
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;
