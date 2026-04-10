import styled from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;

  ${(p) => p.theme.media.mobile} {
    padding: 1.25rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

export const LastUpdated = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  margin: 0 0 2rem 0;
`;

export const MarkdownBody = styled.div`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.foreground};

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 2rem 0 0.75rem 0;
  }

  h3 {
    font-size: 1.0625rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem 0;
  }

  p {
    margin: 0 0 1rem 0;
  }

  ul {
    margin: 0 0 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.375rem;
  }

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      opacity: 0.8;
    }
  }

  strong {
    font-weight: 600;
  }
`;
