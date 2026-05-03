import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  max-width: 620px;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const SearchIcon = styled.span`
  color: ${(p) => p.theme.colors.muted};
  display: flex;
  align-items: center;
`;

export const InputEl = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.foreground};
  outline: none;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }
`;

export const ClearBtn = styled.button`
  border: none;
  background: none;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 0.75rem;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Results = styled.ul`
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  right: 0;
  z-index: 30;
  list-style: none;
  margin: 0;
  padding: 0.375rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  max-height: 360px;
  overflow-y: auto;
`;

export const ResultItem = styled.li<{ $active?: boolean }>`
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  background: ${(p) => (p.$active ? p.theme.colors.tertiaryMuted : 'transparent')};
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${(p) => p.theme.colors.tertiaryMuted};
  }
`;

export const ResultTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 0.125rem;
`;

export const ResultMeta = styled.div`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  letter-spacing: 0.02em;
`;

export const ResultEmpty = styled.div`
  padding: 0.875rem 0.75rem;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
`;
