import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  /* At tablet (≤1024) the chat moves out of the grid into a fixed slide-in
     drawer (see ChatColumn). The structure column takes full width here so
     the user can browse modules without competing for horizontal space. */
  ${(p) => p.theme.media.desktop} {
    grid-template-columns: 1fr;
  }
`;

export const StructureColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
`;

// Dual-mode container.
//   Desktop: persistent right rail; sticky-positioned, scrolls with the
//   page within a viewport-sized box, and shares the structure column's
//   width on a 1:1 grid.
//   Tablet/mobile (≤1024): pulled out of the grid via position: fixed,
//   slides in from the right edge on user trigger ("Refine with AI"
//   button). Backdrop and drag-to-close come from the surrounding markup.
export const ChatColumn = styled(motion.div)`
  position: sticky;
  top: calc(56px + 1.5rem);
  align-self: start;
  min-width: 0;
  height: calc(100vh - 56px - 1.5rem - 7rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  ${(p) => p.theme.media.desktop} {
    position: fixed;
    top: var(--navbar-offset, 56px);
    right: 0;
    bottom: 0;
    left: auto;
    align-self: auto;
    width: min(440px, 100%);
    height: auto;
    z-index: 60;
    background: ${(p) => p.theme.colors.surface};
    border-left: 1px solid ${(p) => p.theme.colors.surfaceBorder};
    box-shadow: var(--shadow-drawer-l);
    /* No padding here — the inner ChatPanel now owns its own header
       chrome (eyebrow strip with help anchor + collapse chevron, body,
       composer). Wrapper padding would stack with the panel's own
       padding and produce a visible inner frame. */
    padding: 0;
    gap: 0;
    /* Match the navbar's 0.3s hide-on-scroll slide so the drawer's top
       edge tracks --navbar-offset smoothly (same pattern as the lesson
       side panels). framer-motion only animates transform here, so a
       CSS top-transition layers cleanly without conflicting. */
    transition: top 0.3s ease;
  }
`;

// Scrim shown behind the drawer at tablet only. Anchors below the
// navbar (same as the drawer) so the navbar stays tappable while the
// drawer is open and the scrim doesn't paint over it.
export const ChatBackdrop = styled.div<{ $open: boolean }>`
  display: none;

  ${(p) => p.theme.media.desktop} {
    display: block;
    position: fixed;
    top: var(--navbar-offset, 56px);
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 59;
    background: var(--scrim-light);
    opacity: ${(p) => (p.$open ? 1 : 0)};
    pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
    transition:
      opacity 0.3s ease,
      top 0.3s ease;
  }
`;

// Inline trigger that opens the chat drawer at tablet. Hidden at desktop
// (chat is always visible there, so the trigger is redundant).
export const RefineTrigger = styled.button`
  display: none;

  ${(p) => p.theme.media.desktop} {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: 9999px;
    /* Same accent-tinted pill as Navbar's FeedbackButton — invites
       engagement without competing with the primary "Accept" button. */
    border: 1px solid color-mix(in srgb, ${(p) => p.theme.colors.accent} 40%, transparent);
    background: color-mix(in srgb, ${(p) => p.theme.colors.accent} 15%, transparent);
    color: ${(p) => p.theme.colors.accent};
    font-family: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    transition:
      background 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
      color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
      border-color 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
      box-shadow 220ms cubic-bezier(0.22, 0.61, 0.36, 1),
      transform 160ms cubic-bezier(0.22, 0.61, 0.36, 1);

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: ${(p) => p.theme.colors.accent};
      color: ${(p) => p.theme.colors.surface};
      border-color: ${(p) => p.theme.colors.accent};
      box-shadow:
        0 2px 10px ${(p) => p.theme.colors.accentMuted},
        var(--shadow-card);
      transform: translateY(-0.5px);
    }

    &:active {
      transform: translateY(0) scale(0.97);
      transition-duration: 80ms;
    }

    &:focus-visible {
      outline: 2px solid ${(p) => p.theme.colors.accent};
      outline-offset: 2px;
    }
  }
`;


export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

export const Title = styled.h2`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 2.5rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.025em;
  line-height: 1.1;

  ${(p) => p.theme.media.tablet} {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
`;

export const ModulesWrapper = styled.div`
  position: relative;
`;

export const Modules = styled.div<{ $dimmed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  opacity: ${(p) => (p.$dimmed ? 0.5 : 1)};
  transition: opacity 0.3s ease;
  pointer-events: ${(p) => (p.$dimmed ? 'none' : 'auto')};
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const ModifyingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: var(--shadow-pop);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const ModifyingSpinner = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-top-color: ${(p) => p.theme.colors.accent};
  animation: ${spin} 0.6s linear infinite;
`;

export const ModuleDescription = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const LessonList = styled.ol`
  list-style: none;
  counter-reset: lesson;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const LessonItem = styled.li`
  counter-increment: lesson;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;

  &::before {
    content: counter(lesson);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.background};
    border: 1px solid ${(p) => p.theme.colors.border};
    font-size: 0.6875rem;
    font-weight: 600;
    color: ${(p) => p.theme.colors.muted};
    margin-top: 1px;
  }
`;

export const LessonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const LessonName = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const LessonDescription = styled.span`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: ${(p) => p.theme.colors.background};
  padding: 0.5rem 1rem 1.25rem;
  margin: 0 -1rem;
  z-index: 2;
  box-shadow: 0 -8px 16px ${(p) => p.theme.colors.background};
`;
