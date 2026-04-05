import styled from 'styled-components';

export const Wrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};

  /* Override Sandpack's default styles to match app theme */
  .sp-wrapper {
    border: none !important;
    border-radius: 0 !important;
  }

  .sp-layout {
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
`;

export const CompleteButton = styled.button<{ $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  border: none;
  background: ${(p) => (p.$completed ? p.theme.colors.success : p.theme.colors.accent)};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: ${(p) => (p.$completed ? 'default' : 'pointer')};
  transition: background 0.15s;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

export const TemplateLabel = styled.span`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  margin-left: auto;
`;
