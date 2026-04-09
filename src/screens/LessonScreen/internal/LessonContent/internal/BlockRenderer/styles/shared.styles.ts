import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const BlockWrapper = styled.div`
  line-height: 1.75;
  font-size: 1em;
  color: ${(p) => p.theme.colors.foreground};
`;
