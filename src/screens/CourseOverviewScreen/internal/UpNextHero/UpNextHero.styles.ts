'use client';

import styled from 'styled-components';
import { onAccent } from '@/theme';

// Editorial card with a soft warm halo on the left rail. Sits between the
// course header and the Quizzes/Bookmarks sections — always rendered (no
// conditional gating on progress) so first-time AND returning users have
// the same anchor for "what should I do next?".
export const Container = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: 4px 1fr;
  gap: 0;
  margin-bottom: 2rem;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  background: ${(p) => p.theme.colors.surface};
  overflow: hidden;
`;

// Warm gradient rail — gold/tertiary at the top, fading to nothing.
// Differentiates the Up-next moment from the neutral module cards below.
export const AccentRail = styled.span<{ $variant: 'lesson' | 'quiz' | 'complete' }>`
  display: block;
  background: ${(p) => {
    switch (p.$variant) {
      case 'quiz':
        return `linear-gradient(180deg, ${p.theme.colors.warning}, ${p.theme.colors.warning}33 70%)`;
      case 'complete':
        return `linear-gradient(180deg, ${p.theme.colors.success}, ${p.theme.colors.success}22 70%)`;
      default:
        return `linear-gradient(180deg, ${p.theme.colors.tertiary}, ${p.theme.colors.tertiary}22 70%)`;
    }
  }};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem 1.375rem;

  @media (max-width: 640px) {
    padding: 1rem 1.125rem 1.125rem;
  }
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

export const Subhead = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.muted};
  margin: 0;
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

export const PrimaryCta = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  transition: background 0.15s, transform 0.08s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => p.theme.colors.accentHover};
    }
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 3px;
  }

  & > svg {
    transition: transform 0.18s ease;
  }

  ${(p) => p.theme.media.hover} {
    &:hover > svg {
      transform: translateX(2px);
    }
  }
`;

export const SecondaryAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.5rem;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.foreground};
      background: ${(p) => p.theme.colors.background};
    }
  }
`;
