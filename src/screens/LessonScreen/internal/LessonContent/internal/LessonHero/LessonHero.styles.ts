import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ── Image block ──────────────────────────────────────

export const HeroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: calc(100% + 4rem);
  margin: -2rem -2rem 0;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
  line-height: 0;
  font-size: 0;

  ${(p) => p.theme.media.tablet} {
    width: calc(100% + 2.5rem);
    margin: -1.25rem -1.25rem 0;
  }
`;

export const Image = styled.img<{ $loaded?: boolean }>`
  display: block;
  width: 100%;
  height: auto;
  max-height: 380px;
  object-fit: cover;
  object-position: center;
  opacity: ${(p) => (p.$loaded === false ? 0 : 1)};
  transition: opacity 0.3s ease;
  ${(p) => p.$loaded === false && 'position: absolute; inset: 0;'}
`;

export const ImageActions = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 2;
  display: flex;
  gap: 0.5rem;
`;

export const BookmarkButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${(p) =>
    p.$active ? `${p.theme.colors.tertiary}30` : 'rgba(0, 0, 0, 0.3)'};
  color: ${(p) => (p.$active ? p.theme.colors.tertiary : 'rgba(255, 255, 255, 0.9)')};
  cursor: pointer;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
  transition:
    background 0.15s,
    color 0.15s,
    transform 0.15s ease;

  &:hover {
    background: ${(p) =>
      p.$active ? `${p.theme.colors.tertiary}40` : 'rgba(0, 0, 0, 0.45)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// ── Title area (below image) ─────────────────────────

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

export const BookmarkButtonInline = styled.button<{ $active: boolean }>`
  /* Sized to fit the longer "Bookmarked" label so toggling between the
     two states doesn't visibly resize the chip — keeps the eyebrow row
     stable. justify-content: center keeps the shorter label visually
     centered inside the same width. margin-left: auto pushes it to the
     right edge of the eyebrow row regardless of eyebrow content width. */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  min-width: 7rem;
  margin-left: auto;
  font-family: var(--font-body-sans), system-ui, sans-serif;
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.border)};
  background: ${(p) => (p.$active ? p.theme.colors.tertiaryMuted : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.colors.tertiary : p.theme.colors.muted)};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  & svg {
    width: 12px;
    height: 12px;
    stroke-width: 1.75;
  }

  &:hover {
    color: ${(p) => p.theme.colors.tertiary};
    border-color: ${(p) =>
      p.$active
        ? p.theme.colors.tertiary
        : `color-mix(in oklab, ${p.theme.colors.tertiary} 50%, ${p.theme.colors.border})`};
    background: ${(p) => p.theme.colors.tertiaryMuted};
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const EyebrowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  /* min-height locks the row to the chip's height so toggling
     hasContent (which mounts/unmounts the bookmark chip) doesn't
     change the row height and shift the title below. */
  min-height: 1.75rem;
`;

export const Eyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.tertiary};
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.25rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.025em;
  line-height: 1.15;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.75rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 1.5rem;
  }
`;

export const GenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px dashed ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    color: ${(p) => p.theme.colors.tertiary};
    border-color: ${(p) => p.theme.colors.tertiary};
    background: ${(p) => `${p.theme.colors.tertiary}10`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GeneratingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
`;

