import styled from 'styled-components';

export const Layout = styled.div`
  min-height: calc(100vh - 56px);
  min-height: calc(100dvh - 56px);
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

    ${(p) => p.theme.media.hover} {
      &:hover {
        opacity: 0.8;
      }
    }
  }

  strong {
    font-weight: 600;
  }

  code {
    font-size: 0.875em;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    word-break: break-word;
  }

  /* GFM tables (legal-basis, sub-processor, retention, cookie tables).
     display:block + overflow-x:auto keeps the widest table — the
     sub-processor list — scrolling inside its own box instead of pushing
     the whole document sideways on a phone. */
  table {
    display: block;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-x: contain;  /* stop a horizontal swipe at the
       scroller's edge from chaining to the browser's back-gesture */
    -webkit-overflow-scrolling: touch;
    border-collapse: collapse;
    margin: 0 0 1.5rem 0;
    font-size: 0.8125rem;
    line-height: 1.55;
  }

  th,
  td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  th {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
    color: ${(p) => p.theme.colors.muted};
    border-bottom: 2px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;
