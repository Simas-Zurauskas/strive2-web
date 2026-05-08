import styled from 'styled-components';

// OG image native dimensions. Open Graph spec recommends 1200×630 for the
// most reliable cross-platform rendering (FB, X, LinkedIn, iMessage).
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
// Half-scale preview is the largest size that comfortably fits inside the
// admin container's 960px max-width with breathing room for the download
// button column. Output PNG is still rendered at native 1200×630 — see
// `style: { transform: 'none' }` in OgCanvas.tsx.
const PREVIEW_SCALE = 0.5;

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

export const Label = styled.h3`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  color: ${(p) => p.theme.colors.foreground};
`;

export const Slug = styled.span`
  font-family: var(--font-mono), ui-monospace, SFMono-Regular, monospace;
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
`;

// Crop window. Sized to the scaled preview so layout reserves the right
// amount of vertical space; the unscaled 1200×630 child overflows internally
// and is clipped by `overflow: hidden`.
export const Frame = styled.div`
  width: ${OG_WIDTH * PREVIEW_SCALE}px;
  height: ${OG_HEIGHT * PREVIEW_SCALE}px;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
`;

// The actual OG canvas. Lives at native dimensions and is scaled down for
// display only. Screenshot capture targets this node and overrides the
// transform so the output PNG is the full 1200×630 — no resampling.
export const Canvas = styled.div`
  width: ${OG_WIDTH}px;
  height: ${OG_HEIGHT}px;
  transform: scale(${PREVIEW_SCALE});
  transform-origin: top left;
  position: relative;
  overflow: hidden;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
