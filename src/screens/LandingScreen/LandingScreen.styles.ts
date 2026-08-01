'use client';

import styled from 'styled-components';

// Tiled fractal-noise SVG — the "paper" in the Cartographer's Press
// treatment. A data URI so it costs zero requests and survives the CSP;
// rendered by the Page ::after overlay at very low opacity.
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`;

export const Page = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${(p) => p.theme.colors.background};

  /* Paper grain over the whole landing — sits above section backgrounds,
     below nothing interactive (pointer-events: none). Opacity is the whole
     trick: at 4% it reads as stock texture, not as noise. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background-image: ${PAPER_GRAIN};
    background-repeat: repeat;
    opacity: 0.04;
  }

  /* Landing-scoped selection color — gold wash, part of the print identity. */
  *::selection {
    background: color-mix(in srgb, ${(p) => p.theme.colors.tertiary} 30%, transparent);
  }
`;

/* 'Section' and 'SectionInner' used to sit here: a shared shell declared at
   exactly the page's measure that nothing ever imported, which is why the
   nine sections each grew their own. The live system is
   'internal/_system/section.ts'; these are gone so there is one place to
   look rather than two, one of them a decoy. */
