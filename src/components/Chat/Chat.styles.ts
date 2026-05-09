import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { thinScrollbar, onAccent } from '@/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ── Outer wrapper ─────────────────────────────────────
// No card chrome (border/radius/shadow); the consumer wraps as it sees
// fit. Just the internal layout: a scrolling region above, a sticky
// composer below.

export const Wrapper = styled.div<{ $scrollSettled: boolean }>`
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: 1fr auto;

  /* Hide visually until use-stick-to-bottom has run its initial
     scroll-to-bottom, which is scheduled inside requestAnimationFrame
     (one frame AFTER first paint). Without this, on mount with
     existing messages the user briefly sees the top of the
     conversation, then the lib's rAF fires and content jumps to the
     bottom — that's the visible "blip". \`visibility: hidden\` keeps
     the element in layout (so the lib can measure heights + scroll),
     it just isn't painted; flipping to \`visible\` after the second
     rAF reveals an already-scrolled state. */
  visibility: ${(p) => (p.$scrollSettled ? 'visible' : 'hidden')};
`;

// ── Scroll area + messages ────────────────────────────

export const ScrollArea = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 0;

  /* use-stick-to-bottom renders TWO nested divs: an outer wrapper and
     an inner ref={scrollRef} that the library sets \`overflow: auto\` on
     at mount. The inner div is the actual scroller, so the scrollbar
     styling AND \`overscroll-behavior: contain\` must land there — not
     on the outer wrapper. Without \`contain\`, hitting the chat's top/
     bottom chains the wheel scroll to the lesson page underneath. */
  > div > div {
    ${thinScrollbar}
    overscroll-behavior: contain;
  }
`;

export const Messages = styled.div`
  display: flex;
  flex-direction: column;
  /* 1.25rem — assistant messages no longer have a bubble's visual
     padding to lean on, so the inter-message gap has to do the work
     of separating an AI reply from the next user bubble. */
  gap: 1.25rem;
  padding: 1rem;
`;

// motion.button so framer-motion can drive the enter/exit animation in
// Chat.tsx (AnimatePresence-wrapped). Static styles here, motion props
// applied at the call site.
export const ScrollDownButton = styled(motion.button)`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card-soft);
  transition: background 0.15s ease;
  z-index: 2;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
  }
`;

// ── Empty state ───────────────────────────────────────

/**
 * Vertically + horizontally centered so the suggested prompts sit as a
 * calm focal point, not stuck against the input or floating at the top.
 */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 100%;
  text-align: center;
  padding: 2rem 1.25rem;
  gap: 1.125rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

/** Small uppercase tracked eyebrow above the prompt list. */
export const EmptyEyebrow = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${(p) => p.theme.colors.muted};
`;

export const SuggestedPrompts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 320px;
`;

/**
 * Suggested prompt button — sans-serif question (more legible than the
 * serif italic at small sizes) with a faint hairline border and an
 * accent-muted halo on hover.
 */
export const SuggestedPrompt = styled.button`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: var(--radius-md);
  padding: 0.6875rem 0.9375rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.4;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
  animation: ${fadeIn} 0.4s ease-out both;

  &:nth-child(1) {
    animation-delay: 0.05s;
  }
  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  &:nth-child(3) {
    animation-delay: 0.15s;
  }

  &:hover:not(:disabled) {
    border-color: ${(p) =>
      `color-mix(in oklab, ${p.theme.colors.accent} 45%, ${p.theme.colors.surfaceBorder})`};
    background: ${(p) => p.theme.colors.accentMuted};
    color: ${(p) => p.theme.colors.accent};
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

// ── Composer (input area) ─────────────────────────────

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.875rem 1rem;
  background: ${(p) => p.theme.colors.surface};
  position: relative;
  z-index: 1;
  border-top: 1px solid ${(p) => p.theme.colors.surfaceBorder};
`;

export const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

export const ChatInput = styled.textarea`
  flex: 1;
  resize: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 1rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.4;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  min-height: 2.5rem;
  max-height: 6rem;
  overflow-y: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px ${(p) => `${p.theme.colors.accent}26`};
  }

  &:disabled {
    opacity: 0.6;
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }
`;

export const SendButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border: none;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  cursor: pointer;
  padding: 0;
  transition:
    background 0.2s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const LoaderIcon = styled.span`
  display: inline-flex;
  animation: ${spin} 0.8s linear infinite;
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.error};
  animation: ${fadeIn} 0.3s ease-out;
`;

// ── Attachment composer additions ─────────────────────

export const AttachButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 50%;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  padding: 0;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.muted};
    color: ${(p) => p.theme.colors.foreground};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const AttachmentChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem;
  border: 1px solid ${(p) => p.theme.colors.surfaceBorder};
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  animation: ${fadeIn} 0.2s ease-out;
  align-self: flex-start;
  max-width: 100%;
  min-width: 0;
`;

export const AttachmentChipLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`;

export const AttachmentChipClose = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  padding: 0;
  border-radius: 4px;

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
    background: ${(p) => p.theme.colors.surface};
  }
`;

export const AttachLoading = styled.span`
  display: inline-flex;
  animation: ${spin} 0.8s linear infinite;
`;

// Pulsing ring around the stop button — communicates "something's
// happening right now, tap to interrupt". Slow + low-amplitude so it
// reads as a heartbeat rather than a flash.
const stopPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent);
  }
  70% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent);
  }
`;

// Stops in-flight generation. Sits in the same composer slot as
// SendButton, so we keep its size + accent fill identical to avoid a
// jarring color flip when the send→stop swap happens. The square icon
// + the soft accent halo (stopPulse) is the differentiation: same
// button frame, new state.
export const StopButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border: none;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.accent};
  color: ${onAccent};
  cursor: pointer;
  padding: 0;
  animation: ${stopPulse} 1.6s ease-out infinite;
  transition:
    background 0.2s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.accentHover};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;
