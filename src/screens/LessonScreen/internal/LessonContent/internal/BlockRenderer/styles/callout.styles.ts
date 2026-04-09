import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ── Callout (all variants) ────────────────────────────

export const CalloutContainer = styled.div<{ $color: string }>`
  font-size: 1em;
  line-height: 1.7;
  padding: 0.125rem 0 0.125rem 1.5rem;
  position: relative;
  color: ${(p) => p.theme.colors.foreground};
  animation: ${fadeIn} 0.3s ease-out;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background: ${(p) => p.$color};
  }

  p { margin: 0; }
  p + p { margin-top: 0.75rem; }
  strong { font-weight: 600; }
  ul, ol { margin: 0.5rem 0; padding-left: 1.25rem; }

  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const CalloutLabel = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.$color};
  margin-bottom: 0.375rem;

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 2px;
  }
`;

// ── Key Concept — centered pull-quote ─────────────────

export const KeyConceptContainer = styled.div`
  text-align: center;
  padding: 2.5rem 2rem;
  margin: 0.5rem 0;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;

  &::before, &::after {
    content: '';
    display: block;
    width: 48px;
    height: 1px;
    background: currentColor;
    opacity: 0.2;
    margin: 0 auto;
  }
  &::before { margin-bottom: 1.5rem; }
  &::after { margin-top: 1.5rem; }
`;

export const KeyConceptLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 0.6875rem;
  font-weight: 600;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
  margin-bottom: 1rem;
`;

export const KeyConceptQuote = styled.blockquote`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.45em;
  font-style: italic;
  font-weight: 400;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.foreground};
  max-width: 560px;
  margin: 0 auto;
`;
