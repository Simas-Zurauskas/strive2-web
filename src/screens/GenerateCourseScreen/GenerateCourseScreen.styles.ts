import styled from 'styled-components';
import { TextAction } from '@/components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Bottom padding keeps the Structure step's sticky right-rail chat
     (whose bottom is bound by this Layout's bottom edge at end-of-scroll)
     from sitting flush against the global Footer. */
  padding: 2rem 2rem 2.5rem 2rem;

  ${(p) => p.theme.media.tablet} {
    padding: 2rem 1.25rem 2.5rem;
  }
`;

export const Container = styled.div<{ $wide?: boolean; $semiWide?: boolean }>`
  width: 100%;
  /* $wide (step 4 — structure review with side panel) matches the home
     layout's 1120px so the page edges stay consistent across the app. */
  max-width: ${(p) => (p.$wide ? '1120px' : p.$semiWide ? '820px' : '640px')};
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  flex-shrink: 0;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 1.5rem;
`;

export const StepperWrapper = styled.div`
  padding-bottom: 2rem;
  border-bottom: 1px solid ${(p) => p.theme.colorsLib.gray900}1a;
`;

export const Content = styled.div``;

export const DiscardLink = styled(TextAction)`
  margin-left: auto;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const CourseName = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: -0.01em;
  font-style: italic;
`;

// ── Step-level error card (documents pre-structure flow) ──
// Pairs the step-5 loader with an inline retry state so a failed
// prepare_corpus / structure submit never leaves the step body blank.

export const StepErrorCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 2rem 1.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid color-mix(in srgb, ${(p) => p.theme.colors.error} 35%, ${(p) => p.theme.colors.surfaceBorder});
  box-shadow: var(--shadow-card);
  max-width: 560px;
  margin: 2rem auto 0;
`;

export const StepErrorTitle = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const StepErrorBody = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const StepErrorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
`;
