import Link from 'next/link';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-top: 8vh;

  ${(p) => p.theme.media.tablet} {
    padding-top: 2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 4.5rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.03em;
  line-height: 1.05;

  ${(p) => p.theme.media.tabletLarge} {
    font-size: 3rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 2.25rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  max-width: 540px;
`;

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1.5rem 0;
  border: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  outline: none;
  resize: none;
  /* Auto-grow bounds — GoalStep.tsx writes the height, this only fences it.
     The box is sized by rows={2} and nothing ever re-measured it, so a typed
     goal ran under the border-bottom and, on narrow phones, the 110-character
     PLACEHOLDER alone wrapped past two lines and was sliced flush on the
     border (measured clientHeight 99 / scrollHeight 125, sweep S3-16). Blink
     counts the placeholder in scrollHeight, so one measurement fixes the empty
     state and the typed state. The cap keeps a 500-character goal from pushing
     the wizard's Next button off-screen. */
  overflow-y: auto;
  max-height: min(40dvh, 20rem);
  line-height: 1.6;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
    opacity: 0.4;
    font-style: italic;
  }

  /* Step down with the Title above (4.5rem -> 2.25rem at this breakpoint). At
     24px the placeholder needs five 38.4px lines in a 320px column — 240px,
     past the 40dvh (227px at 320x568) auto-grow cap, so the empty field would
     still clip. At 20px it is four 32px lines, 176px, comfortably inside the
     cap; still well above the 16px iOS auto-zoom floor. */
  ${(p) => p.theme.media.mobile} {
    font-size: 1.25rem;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.error};
  line-height: 1.4;
`;

export const HelperText = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const SubmitRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SubmitRowEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${(p) => p.theme.media.mobile} {
    justify-content: space-between;
  }
`;

// ── Documents-mode entry (the second way to create a course) ──

export const DocumentsEntryBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: -1.25rem;
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) => p.theme.colors.surfaceBorder};
  }
`;

export const DocumentsEntryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

export const EntryIcon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.tertiaryMuted};
  color: ${(p) => p.theme.colors.tertiary};

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const EntryChevron = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.muted};
  transition:
    color 0.15s ease,
    transform 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const DocumentsEntryCard = styled(Link)`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  box-shadow: var(--shadow-card);
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.2s ease;

  ${(p) => p.theme.media.hover} {
    &:hover {
      border-color: ${(p) => p.theme.colors.tertiary};
      box-shadow: var(--shadow-lift);

      ${EntryChevron} {
        color: ${(p) => p.theme.colors.tertiary};
        transform: translateX(2px);
      }
    }
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const EntryText = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const EntryTitle = styled.span`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.01em;
`;

export const EntryDescription = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const CharCount = styled.span<{ $atLimit: boolean }>`
  font-size: 0.8125rem;
  color: ${(p) => (p.$atLimit ? p.theme.colors.error : p.theme.colors.muted)};
  font-variant-numeric: tabular-nums;
  transition: color 0.15s ease;
`;
