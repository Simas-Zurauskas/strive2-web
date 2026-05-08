import styled from 'styled-components';
import { thinScrollbar } from '@/theme';

export const CodeContainer = styled.div`
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  box-shadow: var(--shadow-card-soft);
`;

export const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const CodeLanguage = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const CopyButton = styled.button`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.background};
  }
`;

export const CodePre = styled.pre`
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  font-size: 0.8125em;
  line-height: 1.6;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  ${thinScrollbar}

  code {
    font-family: var(--font-geist-mono, 'Geist Mono', 'SF Mono', 'Fira Code', monospace);
  }
`;

