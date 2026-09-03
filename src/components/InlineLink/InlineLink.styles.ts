import styled from 'styled-components';
import { touchMinHeight } from '@/theme';

export const StyledLink = styled.a`
  color: ${(p) => p.theme.colors.accent};
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: ${(p) => p.theme.colors.accent}40;
  text-underline-offset: 2px;
  transition:
    color 0.15s,
    text-decoration-color 0.15s;

  ${(p) => p.theme.media.hover} {
    &:hover {
      color: ${(p) => p.theme.colors.accentHover};
      text-decoration-color: ${(p) => p.theme.colors.accentHover};
    }
  }

  /* Height only, and deliberately NOT the centred variant: this primitive is
     the app's prose-link, and min-block-size is a no-op on a genuinely
     inline box. It binds only where the link is a flex/grid item — today
     that is SourceLinksList on the quiz results page, where the "Revisit
     lesson" links measured 42px (and ~21px when the lesson title fits one
     line). */
  ${touchMinHeight}
`;
