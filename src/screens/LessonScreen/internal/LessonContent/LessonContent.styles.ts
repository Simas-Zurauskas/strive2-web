import styled from 'styled-components';

// ── Container ─────────────────────────────────────────

export const Container = styled.div`
  max-width: 740px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;

  ${(p) => p.theme.media.tablet} {
    padding: 1.25rem 1.25rem;
    gap: 1.5rem;
  }
`;

// ── Scaled content wrapper ────────────────────────────

export const ScaledContent = styled.div<{ $scale: number }>`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: ${(p) => p.$scale}rem;

  ${(p) => p.theme.media.tablet} {
    gap: 1.5rem;
  }
`;

// ── Lesson description ────────────────────────────────

export const LessonDescription = styled.p`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-size: 1.125em;
  font-style: italic;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  max-width: 620px;
`;

// ── Placeholder (no content yet) ──────────────────────

export const Placeholder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
  border-radius: 16px;
  border: 1px dashed ${(p) => p.theme.colors.border};
  background: linear-gradient(135deg, ${(p) => p.theme.colors.surface} 0%, ${(p) => `${p.theme.colors.accent}06`} 100%);
`;

export const PlaceholderText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
  line-height: 1.5;
`;

export const GeneratingText = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.accent};
  text-align: center;
  font-weight: 500;
`;

export const GenerateOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 340px;
`;

export const GenerateOptionsHeading = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => p.theme.colors.muted};
  text-align: center;
`;

// ── Streaming indicators ──────────────────────────────

export const StreamingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent};
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

export const FinishingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  font-weight: 400;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.muted};
    animation: pulse 1.5s ease-in-out infinite;
  }
`;

// ── Complete section ──────────────────────────────────

export const CompleteSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
`;

export const CompleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 2rem;
  border-radius: 8px;
  border: 1.5px solid ${(p) => p.theme.colors.accent};
  background: transparent;
  color: ${(p) => p.theme.colors.accent};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: ${(p) => p.theme.colors.accent};
    color: #fff;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const CompletedBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.success}14;
  border: 1px solid ${(p) => p.theme.colors.success}33;
  color: ${(p) => p.theme.colors.success};
  font-size: 0.8125rem;
  font-weight: 600;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

// ── Navigation ────────────────────────────────────────

export const Nav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  margin-top: 1rem;

  ${(p) => p.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const NavButton = styled.button<{ $hidden?: boolean; $direction?: 'prev' | 'next' }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  text-align: ${(p) => (p.$direction === 'next' ? 'right' : 'left')};
  font-family: inherit;
  cursor: pointer;
  visibility: ${(p) => (p.$hidden ? 'hidden' : 'visible')};
  transition:
    border-color 0.2s,
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

export const NavLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => p.theme.colors.muted};
`;

export const NavLessonName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.3;
`;

