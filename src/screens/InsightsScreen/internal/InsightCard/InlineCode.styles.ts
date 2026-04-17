import styled from 'styled-components';

export const Code = styled.code`
  font-family: var(--font-mono, ui-monospace, 'SF Mono', Menlo, monospace);
  font-size: 0.85em;
  padding: 0.0625rem 0.3125rem;
  border-radius: 4px;
  background: ${(p) => p.theme.colors.surfaceBorder};
  color: ${(p) => p.theme.colors.foreground};
  font-weight: 500;
`;
