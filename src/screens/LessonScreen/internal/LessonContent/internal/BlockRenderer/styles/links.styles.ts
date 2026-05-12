import styled from 'styled-components';

export const LinksContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: var(--shadow-card-soft);
`;

export const LinksHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const LinksList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LinkItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.875rem 1.25rem;
  text-decoration: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  transition: background 0.15s, transform 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  ${(p) => p.theme.media.hover} {
    &:hover {
      background: ${(p) => `${p.theme.colors.accent}06`};
      transform: translateX(4px);
    }
  }
`;

export const LinkTitle = styled.span`
  font-size: 0.9375em;
  font-weight: 500;
  color: ${(p) => p.theme.colors.accent};
`;

export const LinkDescription = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
`;

export const LinksEmptyState = styled.div`
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const LinksGenerateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
`;

export const LinksGenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px dashed ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover:not(:disabled) {
      color: ${(p) => p.theme.colors.tertiary};
      border-color: ${(p) => p.theme.colors.tertiary};
      background: ${(p) => `${p.theme.colors.tertiary}10`};
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LinksSkeletonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;
