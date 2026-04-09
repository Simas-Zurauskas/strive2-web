import styled from 'styled-components';

export const IntroText = styled.div`
  font-size: 1.1em;
  line-height: 1.75;
  color: ${(p) => p.theme.colors.foreground};
  position: relative;
  padding-top: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 3px;
    background: ${(p) => p.theme.colors.accent};
    border-radius: 2px;
  }

  strong {
    font-weight: 600;
  }
  em {
    font-style: italic;
  }
  code {
    font-size: 0.875em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const SectionContent = styled.div<{ $first?: boolean }>`
  line-height: 1.75;
  font-size: 1em;
  color: ${(p) => p.theme.colors.foreground};

  ${(p) =>
    p.$first &&
    `
    /* Drop cap on the opening paragraph of the first section */
    > p:first-of-type::first-letter {
      font-family: var(--font-heading-serif), Georgia, serif;
      font-size: 3.25em;
      float: left;
      line-height: 0.8;
      margin-right: 0.1em;
      margin-top: 0.1em;
      font-weight: 600;
      color: ${p.theme.colors.foreground};
    }
  `}

  h2 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.6em;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    color: ${(p) => p.theme.colors.foreground};
    line-height: 1.25;
  }

  h3 {
    font-family: var(--font-heading-serif), Georgia, serif;
    font-size: 1.2em;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin-top: 1.5rem;
    margin-bottom: 0.625rem;
    color: ${(p) => p.theme.colors.foreground};
  }

  p {
    margin-bottom: 1rem;
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  code {
    font-size: 0.85em;
    padding: 0.125em 0.375em;
    border-radius: 4px;
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  }

  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 0.875em;
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 0.5rem 0.75rem;
    border: 1px solid ${(p) => p.theme.colors.border};
    text-align: left;
  }

  th {
    background: ${(p) => p.theme.colors.surface};
    font-weight: 600;
  }

  tr:nth-child(even) {
    background: ${(p) => `${p.theme.colors.surface}80`};
  }
`;
