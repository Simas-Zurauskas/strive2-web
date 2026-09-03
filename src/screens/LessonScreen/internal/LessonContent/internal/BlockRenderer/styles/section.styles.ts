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

  /* Generated lesson tables arrive as bare GFM — there is no wrapper element to
     hang a scroller on. 'overflow' is inert on a 'display: table' box (it only
     ever served the border-radius clip here), and html/body are
     'overflow-x: clip', so a wide generated table is amputated with no way to
     scroll the missing columns back — 80px of overshoot was unreachable on the
     equivalent legal-page tables at 320px.

     Deliberately gated to <=640px rather than applied unconditionally:
     'display: block' wraps the rows in an anonymous shrink-to-fit table box, so
     the 'th' header band and the 'tr:nth-child(even)' zebra below would stop at
     the table's content width instead of spanning the full prose column. That
     is a visible desktop regression, and those fills are the design. Below the
     tablet breakpoint the column is narrow enough that a table essentially
     always fills it, so the fills land in the same place either way.
     'overflow-y: hidden' rather than dropping the longhand: neither longhand is
     'visible', so the pair is honoured and the 8px radius still clips. */
  ${(p) => p.theme.media.tablet} {
    table {
      display: block;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
    }
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
